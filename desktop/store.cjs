const fs = require('fs/promises');
const path = require('path');

// The renderer can only use this fixed application store; it cannot supply paths.
function createStore9(directory, codec) {
  const current = path.join(directory, 'learning-store.zthdb');
  const previous = current + '.previous';
  const pending = current + '.pending';
  const limit = 64 * 1024 * 1024;
  const producerVersion = '10.0.0';
  let queue = Promise.resolve();
  const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const profileId = value => typeof value === 'string' && /^[\w-]{8,80}$/.test(value) && !['__proto__', 'constructor', 'prototype'].includes(value);
  const questionId = value => typeof value === 'string' && /^[\w.-]{1,100}$/.test(value) && !['__proto__', 'constructor', 'prototype'].includes(value);
  function producer(value) {
    if (value === undefined) return; // Original schema-9 databases had no producer marker.
    if (typeof value !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)) throw Error('STORE_FORMAT');
    const found = value.split('.').map(Number), supported = producerVersion.split('.').map(Number);
    if (!found.every(Number.isSafeInteger)) throw Error('STORE_FORMAT');
    for (let i = 0; i < found.length; i++) {
      if (found[i] > supported[i]) throw Error('STORE_NEWER_VERSION');
      if (found[i] < supported[i]) return;
    }
  }
  function newerVersion(value, supported) {
    if (typeof value === 'number' && Number.isFinite(value) && value > supported) throw Error('STORE_NEWER_VERSION');
  }
  function schema(data) {
    if (object(data) && data.format === 'zth-local-store') {
      newerVersion(data.version, 9); producer(data.producerVersion);
      if (object(data.profiles)) for (const record of Object.values(data.profiles)) if (object(record)) { newerVersion(record.version, 9); producer(record.producerVersion); }
    }
    if (!object(data) || data.format !== 'zth-local-store' || data.version !== 9 || !object(data.profiles) || !object(data.settings) || typeof data.settings.autoSave !== 'boolean' || !['system', 'reduced', 'full'].includes(data.settings.motion) || !profileId(data.activeProfileId) || !Object.hasOwn(data.profiles, data.activeProfileId)) throw Error('STORE_FORMAT');
    for (const [id, record] of Object.entries(data.profiles)) {
      if (!profileId(id) || !object(record) || record.version !== 9 || !object(record.profile) || record.profile.id !== id || !Array.isArray(record.done) || !record.done.every(value => typeof value === 'string') || !object(record.notes)) throw Error('STORE_FORMAT');
      // Match structural fields that the renderer rejects, without duplicating its
      // course catalogue or silently filtering private learning records here.
      if (record.answers9 !== undefined) {
        const answers = record.answers9;
        if (!object(answers) || !object(answers.drafts) || !Array.isArray(answers.attempts) || answers.attempts.length > 100000) throw Error('STORE_FORMAT');
        for (const attempt of answers.attempts) if (!object(attempt) || typeof attempt.lessonId !== 'string' || !questionId(attempt.questionId) || !['choice', 'numeric', 'terminal', 'c'].includes(attempt.kind) || typeof attempt.correct !== 'boolean') throw Error('STORE_FORMAT');
      }
      if (record.changes9 !== undefined && (!Array.isArray(record.changes9) || record.changes9.length > 100000 || !record.changes9.every(change => object(change) && typeof change.at === 'string' && Number.isFinite(Date.parse(change.at)) && Array.isArray(change.fields)))) throw Error('STORE_FORMAT');
    }
  }
  function valid(data) {
    schema(data);
    const text = JSON.stringify(data);
    if (Buffer.byteLength(text) > limit) throw Error('STORE_TOO_LARGE');
    return text;
  }
  async function read(file) {
    try {
      const stat = await fs.stat(file);
      if (stat.size > limit * 1.5) throw Error('STORE_TOO_LARGE');
      const envelope = JSON.parse(await fs.readFile(file, 'utf8'));
      if (object(envelope) && envelope.format === 'zth-local-store') { newerVersion(envelope.version, 1); producer(envelope.producerVersion); }
      if (envelope.format !== 'zth-local-store' || envelope.version !== 1 || typeof envelope.ciphertext !== 'string') throw Error('STORE_FORMAT');
      const text = await codec.decrypt(Buffer.from(envelope.ciphertext, 'base64'));
      const data = JSON.parse(text); valid(data);
      return { data, missing: false };
    } catch (error) {
      if (error.code === 'ENOENT') return { missing: true };
      return { error };
    }
  }
  function refuseNewer(...copies) {
    // A newer but readable format is not corruption. Neither slot may be replaced
    // by this older application, including when the other slot is valid schema 9.
    if (copies.some(copy => copy.error?.message === 'STORE_NEWER_VERSION')) throw Error('STORE_NEWER_VERSION');
  }
  async function load() {
    await queue;
    const [main, backup] = await Promise.all([read(current), read(previous)]);
    refuseNewer(main, backup);
    if (main.data) return { data: main.data, recovered: false, protected: true };
    if (backup.data) return { data: backup.data, recovered: true, protected: true };
    if (main.missing && backup.missing) return { data: null, recovered: false, protected: true };
    throw Error('STORE_UNREADABLE');
  }
  function save(data) {
    schema(data); // Never overwrite an incoming future producer marker before checking it.
    const text = valid({ ...data, producerVersion }); // Snapshot without mutating the caller.
    const operation = queue.catch(() => {}).then(async () => {
      const main = await read(current), backup = await read(previous);
      refuseNewer(main, backup);
      if (!main.data && !backup.data && !(main.missing && backup.missing)) throw Error('STORE_UNREADABLE');
      const encrypted = await codec.encrypt(text);
      const savedAt = new Date().toISOString();
      const envelope = JSON.stringify({ format: 'zth-local-store', version: 1, producerVersion, savedAt, ciphertext: Buffer.from(encrypted).toString('base64') });
      await fs.mkdir(directory, { recursive: true });
      const handle = await fs.open(pending, 'w', 0o600);
      try { await handle.writeFile(envelope, 'utf8'); await handle.sync(); } finally { await handle.close(); }
      // A corrupt current file must never replace the last readable backup.
      if (main.data) await fs.copyFile(current, previous);
      await fs.rename(pending, current);
      return { savedAt, protected: true };
    });
    queue = operation.catch(() => {});
    return operation;
  }
  return { load, save };
}
module.exports = { createStore9 };
