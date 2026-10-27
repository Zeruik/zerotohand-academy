const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');

const ROOT = fs.realpathSync(__dirname);
const VERSION = '10.0.0';
const SOURCE_FOLDER = 'publish/zerotohand-academy-v10';
const RELEASE_FOLDER = 'release/ZeroToHand-Academy-Windows-v10.0.0';
const INSTALLER = 'dist/Install-ZeroToHand-v10.exe';
const APP_HTML = 'ZeroToHand-Engineering-Academy.html';

// Public inputs are deliberately enumerated. Add a new required source file here.
// A folder-wide copy would make a stray learner archive or developer log public.
const SOURCE_FILES = [
  'desktop/flashing.cjs', 'build-flashing.cjs', 'build-exe-brand-v10.cjs', 'qa/flashing-v10.cjs',
  'src/rtos-v10.js', 'src/rtos-v10.css', 'qa/rtos-v10.cjs', 'qa/harness-v10.cjs', 'qa/navigation-shell-v10.cjs',
  'src/companion-v10.js', 'src/companion-v10.css',
  'qa/companion-v10.cjs', 'desktop/storage-path.cjs', 'qa/storage-path-v10.cjs', 'qa/storage-upgrade-v10.cjs',
  'src/components-v10.js', 'src/components-v10.css',
  'src/wiring-v10.js', 'src/wiring-v10.css',
  'src/tooling-v10.js', 'src/tooling-v10.css',
  'src/course-content-v10.js', 'src/course-content-v10.css',
  'src/experience-v10.js', 'src/experience-v10.css',
  'qa/components-v10.cjs', 'qa/wiring-v10.cjs', 'qa/tooling-v10.cjs',
  'qa/integration-v10.cjs', 'qa/content-v10.cjs', 'qa/archive-compatibility-v10.cjs', 'qa/installer-lifecycle-v10.cjs',
  'src/foundations-v9.js', 'src/foundations-v9.css',
  'src/profiles-v9.js', 'src/profiles-v9.css',
  'src/motion-v9.js', 'src/motion-v9.css',
  'src/brand-v9.js', 'src/brand-v9.css',
  'desktop/store.cjs', 'desktop/preload.cjs', 'desktop/protection.cjs', 'qa/protection-native-v10.cjs',
  'qa/foundations-v9.cjs', 'qa/profiles-v9.cjs', 'qa/motion-v9.cjs',
  'qa/store-v9.cjs', 'qa/storage-native-v9.cjs',
  'build-brand-v8.cjs',
  'assets/zerotohand-logo.svg',
  'assets/zerotohand-logo-original.jpg',
  'assets/zerotohand-icon.svg',
  'src/curriculum-v8.js',
  'src/practice-v8.js',
  'src/practice-v8.css',
  'src/robotics-v8.js',
  'src/robot-assets-v8.js',
  'src/making-scenes-v8.js',
  'src/experience-v8.js',
  'src/experience-v8.css',
  'qa/quality-v8.cjs',
  'qa/making-v8.cjs',
  'qa/robotics-v8.cjs',
  'qa/practice-v8.cjs',
  'qa/profiles-v8.cjs',
  'qa/curriculum-v8.cjs',
  'qa/interface-v8.cjs',
  'qa/gallery-v8.cjs',
  'assets/robots-v8/manifest.json',
  'assets/robots-v8/NOTICE.md',
  'assets/robots-v8/go2/LICENSE-BSD-3-Clause.txt',
  'assets/robots-v8/go2/package.upstream.xml',
  'assets/robots-v8/go2/robot.urdf',
  'assets/robots-v8/ur5/LICENSE-BSD-3-Clause.txt',
  'assets/robots-v8/ur5/package.upstream.xml',
  'assets/robots-v8/ur5/README.upstream.md',
  'assets/robots-v8/ur5/robot.urdf',
  'assets/robots-v8/ur5/upstream/config/ur5/default_kinematics.yaml',
  'assets/robots-v8/ur5/upstream/config/ur5/joint_limits.yaml',
  'assets/robots-v8/ur5/upstream/config/ur5/physical_parameters.yaml',
  'assets/robots-v8/ur5/upstream/config/ur5/visual_parameters.yaml',
  'assets/robots-v8/ur5/upstream/urdf/ros2_control_mock_hardware.xacro',
  'assets/robots-v8/ur5/upstream/urdf/ur_macro.xacro',
  'assets/robots-v8/ur5/upstream/urdf/ur_mocked.urdf.xacro',
  'assets/robots-v8/ur5/upstream/urdf/ur.urdf.xacro',
  'assets/robots-v8/ur5/upstream/urdf/inc/ur_common.xacro',
  'assets/robots-v8/ur5/upstream/urdf/inc/ur_joint_control.xacro',
  'assets/robots-v8/ur5/upstream/urdf/inc/ur_sensors.xacro',
  'assets/robots-v8/ur5/upstream/urdf/inc/ur_transmissions.xacro',
  'build.cjs', 'build-desktop.ps1', 'package-release-v10.cjs',
  'ZeroToHand-Desktop.iss', 'ZeroToHand-Academy.ico',
  'setup-wizard.bmp', 'setup-small.bmp', 'THIRD-PARTY-LICENSES.txt', 'LICENSE-ZH.txt', 'PRIVACY-ZH.txt', APP_HTML,
  'assets/xiangyang-logo.png', 'desktop/package.json', 'desktop/main.cjs',
  'src/template.html', 'src/base-courses.json', 'src/models.js', 'src/labs.js',
  'src/advanced.js', 'src/content.js', 'src/stories.js', 'src/learning-v4.js',
  'src/experience-v4.js', 'src/experience-v4.css', 'src/devices-v5.js',
  'src/devices-v5.css', 'src/devices-v6.css', 'src/meter-v6.js',
  'src/scene3d-v6.js', 'src/profiles-v5.js', 'src/init-v5.js',
  'src/experience-v7.js', 'src/experience-v7.css', 'src/scene3d-v7-builders.js',
  'qa/content-v6.cjs', 'qa/scene-v6.cjs', 'qa/v5.cjs', 'qa/devices-v5.cjs',
  'qa/stories.cjs', 'qa/dom-runtime/package.json', 'qa/dom-runtime/package-lock.json',
  'qa/meter-v7.cjs', 'qa/quality-v7.cjs',
  'qa/desktop-runtime/package.json', 'qa/desktop-runtime/package-lock.json',
];

const GITIGNORE = [
  'node_modules/', 'dist/', 'release/', 'publish/', 'dev-notes/', 'archive/', 'private/', '__pycache__/',
  'qa/*-results.json', 'qa/results/', 'qa/*-art/', 'qa/*.log',
  '*.log', '*.zth', '*.zthdb', '*.previous', '*.pending', '*.zthprogress', '*progress*.html', '*Codex-Master-Prompt*',
  '.env', '.env.*', '*.pem', '*.key', '.DS_Store', 'Thumbs.db', '',
].join('\n');

function portable(value) { return value.split(path.sep).join('/'); }
function child(relative) {
  const result = path.resolve(ROOT, relative);
  const rel = path.relative(ROOT, result);
  if (!rel || rel.startsWith('..' + path.sep) || rel === '..' || path.isAbsolute(rel)) {
    throw new Error(`Path must stay below the project folder: ${relative}`);
  }
  return result;
}
function regularInput(relative) {
  const file = child(relative);
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Input is not a regular file: ${relative}`);
  const real = fs.realpathSync(file);
  const rel = path.relative(ROOT, real);
  if (rel.startsWith('..' + path.sep) || rel === '..' || path.isAbsolute(rel)) {
    throw new Error(`Input resolves outside the project folder: ${relative}`);
  }
  return file;
}
function authoringOrCanonical(authoring, canonical) {
  return fs.existsSync(child(authoring)) ? authoring : canonical;
}
function digest(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function inventory(folder, prefix = '') {
  if (!fs.existsSync(folder)) return [];
  const entries = [];
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${item.name}` : item.name;
    const full = path.join(folder, item.name);
    if (item.isSymbolicLink()) throw new Error(`Symbolic links are not allowed in an output: ${relative}`);
    if (item.isDirectory()) {
      entries.push({ path: relative, directory: true });
      entries.push(...inventory(full, relative));
    } else if (item.isFile()) entries.push({ path: relative, directory: false });
    else throw new Error(`Unexpected output entry: ${relative}`);
  }
  return entries;
}
function assertOnlyExpected(folder, expectedFiles, requireAll = false) {
  const expected = new Set(expectedFiles);
  const directories = new Set();
  for (const file of expectedFiles) {
    let parent = path.posix.dirname(file);
    while (parent !== '.') { directories.add(parent); parent = path.posix.dirname(parent); }
  }
  const entries = inventory(folder);
  const actual = new Set(entries.filter((e) => !e.directory).map((e) => e.path));
  for (const entry of entries) {
    if (!(entry.directory ? directories : expected).has(entry.path)) {
      throw new Error(`Unexpected existing output; move it outside the publish folder before packaging: ${entry.path}`);
    }
  }
  if (requireAll) for (const name of expected) if (!actual.has(name)) throw new Error(`Output missing: ${name}`);
}
function normalizeText(text) { return text.toLowerCase().replace(/\\\\/g, '/').replace(/\\/g, '/'); }
function assertNoPersonalArtifacts(names) {
  for (const name of names) {
    const parts = name.replace(/\\/g, '/').split('/'), base = parts.at(-1);
    // The pinned upstream source collection uses an "archives" folder for tarballs.
    // Its exact files/hashes are checked separately; this is not a learner directory.
    const guardedParts = parts.filter((part,index) => !(index === 1 && parts[0] === 'ThirdPartySources' && part === 'archives'));
    if (guardedParts.some(part => /^(?:\.git|dev-notes|node_modules|archives|profiles|screenshots?|cache|gpucache|local storage|session storage|indexeddb)$/i.test(part)) ||
        /^(?:local state|storage-location\.json)$/i.test(base) ||
        /\.(?:zth|zthprogress|zthdb|previous|pending|log)$/i.test(base) ||
        /(?:-results|-report|source-reproduction[^/]*)\.json$/i.test(base)) {
      throw Error('Personal archive, key context or developer artifact is forbidden in public output: ' + name);
    }
  }
}
function scanPrivateStrings(file, label) {
  const identityTerms = [ROOT, process.env.USERPROFILE, process.env.COMPUTERNAME]
    .filter(Boolean).map(normalizeText);
  const credentialPatterns = [
    /gh[pousr]_[A-Za-z0-9]{20,}/,
    /github_pat_[A-Za-z0-9_]{40,}/,
    /(?:^|[^A-Za-z0-9_-])sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}/,
    /\bAKIA[A-Z0-9]{16}\b/,
    /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  ];
  const username = process.env.USERNAME;
  const usernamePattern = username && /^[A-Za-z0-9_-]{3,}$/.test(username)
    ? new RegExp(`(^|[^A-Za-z0-9_-])${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^A-Za-z0-9_-])`, 'i') : null;
  const isText = /\.(?:cjs|mjs|js|css|html|json|md|txt|ps1|iss|svg|xml|urdf|xacro|yaml|yml)$|\.gitignore$/i.test(label);
  const handle = fs.openSync(file, 'r');
  const chunk = Buffer.alloc(1024 * 1024);
  let carry = Buffer.alloc(0);
  try {
    let count;
    while ((count = fs.readSync(handle, chunk, 0, chunk.length, null)) > 0) {
      const block = Buffer.concat([carry, chunk.subarray(0, count)]);
      for (const text of [block.toString('utf8'), block.toString('utf16le')]) {
        const normalized = normalizeText(text);
        if (identityTerms.some((term) => term.length >= 4 && normalized.includes(term))) {
          throw new Error(`Privacy scan found a machine identity or local project path: ${label}`);
        }
        if (/[A-Za-z]:[\\/]Users[\\/][^\\/\s"'<>]+/.test(text)) {
          throw new Error(`Privacy scan found an absolute user-profile path: ${label}`);
        }
        if (credentialPatterns.some((pattern) => pattern.test(text))) {
          throw new Error(`Privacy scan found a credential-like string: ${label}`);
        }
        if (isText && usernamePattern && usernamePattern.test(text)) {
          throw new Error(`Privacy scan found the local account name in text: ${label}`);
        }
      }
      carry = block.subarray(Math.max(0, block.length - 4096));
    }
  } finally { fs.closeSync(handle); }
}
function sourcePlan() {
  if (new Set(SOURCE_FILES.map(file => file.toLowerCase())).size !== SOURCE_FILES.length) throw new Error('Duplicate or case-colliding public input.');
  const plan = SOURCE_FILES.map((file) => ({ from: file, to: file }));
  plan.push({ from: authoringOrCanonical('README-v10.md', 'README.md'), to: 'README.md' });
  plan.push({ from: authoringOrCanonical('README-v10.txt', 'README.txt'), to: 'README.txt' });
  plan.push({ text: GITIGNORE, to: '.gitignore' });
  return plan;
}
function releasePlan() {
  const plan = [
    { from: INSTALLER, to: 'Install-ZeroToHand-v10.exe' },
    { from: authoringOrCanonical('README-v10.txt', 'README.txt'), to: '快速开始.txt' },
    { from: 'THIRD-PARTY-LICENSES.txt', to: 'THIRD-PARTY-LICENSES.txt' },
    { from: 'LICENSE-ZH.txt', to: 'LICENSE-ZH.txt' },
    { from: 'PRIVACY-ZH.txt', to: 'PRIVACY-ZH.txt' },
    { from: APP_HTML, to: `免安装版/${APP_HTML}` },
  ];
  const file=child('dist/flashing-sources-v10/distribution-manifest.json');
  if(fs.existsSync(file)){
    const manifest=readSourceMaterials();
    for(const item of manifest.files)plan.push({from:'dist/flashing-sources-v10/'+item.file,to:'ThirdPartySources/'+item.file});
    plan.push({from:'dist/flashing-sources-v10/distribution-manifest.json',to:'ThirdPartySources/distribution-manifest.json'});
  }
  return plan;
}
function safeManifestPaths(files){
  if(!Array.isArray(files)||files.length===0)throw Error('An explicit nonempty third-party inventory is required.');
  const seen=new Set();for(const item of files){if(typeof item.file!=='string'||item.file.startsWith('/')||/[\\:\x00-\x1f]/.test(item.file)||item.file.split('/').some(x=>!x||x==='.'||x==='..'||/[. ]$/.test(x)))throw Error('Unsafe third-party inventory path.');if(seen.has(item.file.toLowerCase()))throw Error('Duplicate third-party inventory path.');seen.add(item.file.toLowerCase());if(!/^[a-f0-9]{64}$/.test(item.sha256)||!Number.isSafeInteger(item.bytes)||item.bytes<0)throw Error('Invalid third-party inventory hash or size.');}
}
function readSourceMaterials(){
  const manifest=JSON.parse(fs.readFileSync(regularInput('dist/flashing-sources-v10/distribution-manifest.json'),'utf8'));
  if(manifest.format!=='zth-corresponding-source'||manifest.version!==10||manifest.distributionReady!==true||(manifest.openItems||[]).length)throw Error('Corresponding toolchain sources and notices are not cleared for distribution.');
  safeManifestPaths(manifest.files);return manifest;
}
function checkFlashingPayload(bundleFolder){
  const source=readSourceMaterials(),sourcesRoot=child('dist/flashing-sources-v10');
  assertOnlyExpected(sourcesRoot,[...source.files.map(x=>x.file),'distribution-manifest.json'],true);
  for(const item of source.files){const file=regularInput('dist/flashing-sources-v10/'+item.file);if(fs.statSync(file).size!==item.bytes||digest(file)!==item.sha256)throw Error('Corresponding-source file changed: '+item.file);}
  const toolRoot=child('dist/flashing-v10'),manifest=JSON.parse(fs.readFileSync(regularInput('dist/flashing-v10/bundle.json'),'utf8'));
  if(manifest.format!=='zth-flashing-toolchain'||manifest.version!==10||manifest.distributionReady!==true)throw Error('The offline toolchain is not cleared for distribution.');
  if(manifest.sourceManifestSha256!==digest(regularInput('dist/flashing-sources-v10/distribution-manifest.json')))throw Error('The offline toolchain is not paired with this corresponding-source inventory.');
  safeManifestPaths(manifest.files);const files=[...manifest.files.map(x=>x.file),'bundle.json'];assertOnlyExpected(toolRoot,files,true);
  const expected=files.map(f=>'resources/flashing-v10/'+f);
  for(const name of files){const from=path.join(toolRoot,name),to=path.join(bundleFolder,'resources/flashing-v10',name);const item=manifest.files.find(x=>x.file===name);if(item&&(fs.statSync(from).size!==item.bytes||digest(from)!==item.sha256))throw Error('Offline toolchain input changed: '+name);if(!fs.existsSync(to)||digest(from)!==digest(to))throw Error('Bundled offline toolchain differs from its checked input: '+name);}
  return{expected,files:files.length,sourceFiles:source.files.length+1};
}
function checkRuntimePayload() {
  const runtimeFolder = child('qa/desktop-runtime/node_modules/electron/dist');
  const bundleFolder = child('dist/desktop');
  const runtimeTopLevel = new Set([
    'electron.exe', 'chrome_100_percent.pak', 'chrome_200_percent.pak',
    'd3dcompiler_47.dll', 'dxcompiler.dll', 'electron_wer.dll', 'ffmpeg.dll',
    'icudtl.dat', 'LICENSE', 'LICENSES.chromium.html', 'resources.pak',
    'snapshot_blob.bin', 'v8_context_snapshot.bin', 'version',
    'vk_swiftshader_icd.json', 'vk_swiftshader.dll', 'vulkan-1.dll',
    'resources/default_app.asar',
  ]);
  const runtimeFiles = inventory(runtimeFolder).filter((entry) => !entry.directory).map((entry) => entry.path);
  if (!runtimeFiles.includes('electron.exe')) throw new Error('The downloaded Electron runtime is missing.');
  const expectedElectron = JSON.parse(fs.readFileSync(regularInput('qa/desktop-runtime/package.json'), 'utf8')).dependencies.electron;
  if (fs.readFileSync(path.join(runtimeFolder, 'version'), 'utf8').trim() !== expectedElectron) {
    throw new Error('The downloaded Electron version differs from the pinned dependency.');
  }
  for (const file of runtimeFiles) {
    if (!runtimeTopLevel.has(file) && !/^locales\/[A-Za-z0-9_-]+\.pak$/.test(file)) {
      throw new Error(`Unreviewed Electron runtime file: ${file}`);
    }
  }
  const expected = runtimeFiles.map((file) => file === 'electron.exe' ? 'ZeroToHand.exe' : file);
  const appFiles = [
    { from: APP_HTML, to: 'resources/app/index.html' },
    { from: 'desktop/main.cjs', to: 'resources/app/main.cjs' },
    { from: 'desktop/preload.cjs', to: 'resources/app/preload.cjs' },
    { from: 'desktop/store.cjs', to: 'resources/app/store.cjs' },
    { from: 'desktop/protection.cjs', to: 'resources/app/protection.cjs' },
    { from: 'desktop/storage-path.cjs', to: 'resources/app/storage-path.cjs' },
    { from: 'desktop/flashing.cjs', to: 'resources/app/flashing.cjs' },
    { from: 'desktop/package.json', to: 'resources/app/package.json' },
    { from: 'ZeroToHand-Academy.ico', to: 'resources/app/icon.ico' },
  ];
  expected.push(...appFiles.map((file) => file.to));
  const flashing=checkFlashingPayload(bundleFolder);expected.push(...flashing.expected);
  assertOnlyExpected(bundleFolder, expected, true);
  for (const file of runtimeFiles) {
    const target = file === 'electron.exe' ? 'ZeroToHand.exe' : file;
    if (file === 'electron.exe') {
      cp.execFileSync(process.execPath, ['build-exe-brand-v10.cjs', '--check'], { cwd: ROOT, stdio: 'pipe', timeout: 120000 });
      continue;
    }
    if (digest(path.join(runtimeFolder, file)) !== digest(path.join(bundleFolder, target))) {
      throw new Error(`Bundled runtime differs from its installed dependency: ${target}`);
    }
  }
  for (const file of appFiles) {
    if (digest(regularInput(file.from)) !== digest(path.join(bundleFolder, file.to))) {
      throw new Error(`Bundled application is stale: ${file.to}`);
    }
    scanPrivateStrings(path.join(bundleFolder, file.to), file.to);
  }
  const packageVersion = JSON.parse(fs.readFileSync(regularInput('desktop/package.json'), 'utf8')).version;
  if (packageVersion !== VERSION) throw new Error(`desktop/package.json must have version ${VERSION}.`);
  const setup = fs.readFileSync(regularInput('ZeroToHand-Desktop.iss'), 'utf8');
  if (!/^AppId=\{\{CFF45F03-4D61-4AF0-93F5-5C21174D7510\}\s*$/m.test(setup)) {
    throw new Error('The installer AppId must match the released v8 product so upgrades retain the same application identity.');
  }
  if (!/^AppVersion=10\.0\.0\s*$/m.test(setup) || !/^OutputBaseFilename=Install-ZeroToHand-v10\s*$/m.test(setup)) {
    throw new Error('The Inno Setup script is not configured for the v10 installer.');
  }
  const setupInputs = [...setup.matchAll(/^Source:\s*"([^"]+)"/gm)].map((match) => match[1].replace(/\\/g, '/'));
  const expectedSetupInputs = ['dist/desktop/*', 'README.txt', 'THIRD-PARTY-LICENSES.txt', 'LICENSE-ZH.txt', 'PRIVACY-ZH.txt'];
  if (setupInputs.length !== expectedSetupInputs.length || setupInputs.some((input) => !expectedSetupInputs.includes(input))) {
    throw new Error('The Inno Setup file list contains unreviewed inputs.');
  }
  const readme = authoringOrCanonical('README-v10.txt', 'README.txt');
  if (digest(regularInput(readme)) !== digest(regularInput('README.txt'))) {
    throw new Error('Copy README-v10.txt to README.txt before compiling the installer.');
  }
  const installerTime = fs.statSync(regularInput(INSTALLER)).mtimeMs;
  const inputs = ['ZeroToHand-Desktop.iss', 'README.txt', 'THIRD-PARTY-LICENSES.txt', 'LICENSE-ZH.txt', 'PRIVACY-ZH.txt', ...expected.map((file) => `dist/desktop/${file}`)];
  const latest = Math.max(...inputs.map((file) => fs.statSync(regularInput(file)).mtimeMs));
  if (installerTime + 2000 < latest) throw new Error('The installer is older than one or more of its packaged inputs; compile it again.');
  return { runtimeFiles: runtimeFiles.length, applicationFiles: appFiles.length, flashingFiles:flashing.files, correspondingSourceFiles:flashing.sourceFiles, exactPayload: true };
}
function copyPlan(plan, folder) {
  fs.mkdirSync(folder, { recursive: true });
  for (const entry of plan) {
    const target = path.join(folder, entry.to);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (entry.text !== undefined) fs.writeFileSync(target, entry.text, 'utf8');
    else fs.copyFileSync(regularInput(entry.from), target);
  }
  assertOnlyExpected(folder, plan.map((entry) => entry.to), true);
  return plan.map((entry) => {
    const target = path.join(folder, entry.to);
    scanPrivateStrings(target, entry.to);
    const sha256 = digest(target);
    if (entry.from && sha256 !== digest(regularInput(entry.from))) throw new Error(`Copied file hash mismatch: ${entry.to}`);
    return { file: entry.to, bytes: fs.statSync(target).size, sha256 };
  });
}

function main() {
  const source = sourcePlan();
  const release = releasePlan();
  assertNoPersonalArtifacts([...source, ...release].map(entry => entry.to));
  if (process.argv.includes('--plan')) {
    console.log(JSON.stringify({ version: VERSION, upload: source.map((x) => x.to), release: release.map((x) => x.to), privateReports: 'dev-notes' }, null, 2));
    return;
  }
  for (const entry of [...source, ...release]) {
    if (entry.from) scanPrivateStrings(regularInput(entry.from), entry.to);
  }
  const payload = checkRuntimePayload();
  const sourceDir = child(SOURCE_FOLDER);
  const releaseDir = child(RELEASE_FOLDER);
  assertOnlyExpected(sourceDir, source.map((x) => x.to));
  assertOnlyExpected(releaseDir, release.map((x) => x.to));
  if (process.argv.includes('--check')) {
    console.log(JSON.stringify({ checked: true, version: VERSION, inputs: source.length + release.length, payload, outputsWritten: false }, null, 2));
    return;
  }
  const publicFiles = copyPlan(source, sourceDir);
  const distributedFiles = copyPlan(release, releaseDir);
  const report = {
    createdAt: new Date().toISOString(), version: VERSION,
    uploadFolder: SOURCE_FOLDER, releaseFolder: RELEASE_FOLDER,
    scope: 'Explicit file inventory, machine-path and credential-pattern scan, copy hashes, and bundled-runtime equality. This is not a content or visual acceptance report.',
    payload, source: publicFiles, release: distributedFiles,
    privacy: { explicitAllowlist: true, personalArchiveAndKeyFilenameGuard: true, machineIdentityAndCredentialPatternScan: true, sourceAndRuntimeCopyHashesVerified: true, noActualLearnerStoreOrExportIncluded: true, noLocalStateOrStorageLocationIncluded: true, developerLogsAndScreenshotsExcluded: true, authorizedPublicAttribution: ['Zeruik', 'zeruik@qq.com'], githubOperationPerformed: false, scope: 'Checks every direct public/distribution file and exact upstream source-material inventory. Format descriptions and synthetic test fixtures in source are allowed. Original third-party source archives retain their upstream fixtures; this is not a claim to detect every possible secret inside every upstream compressed archive.' },
    excluded: ['developer logs', 'QA results', 'screenshots', 'learner records', 'private prompts', 'dependency folders', 'Git metadata'],
  };
  fs.mkdirSync(child('dev-notes'), { recursive: true });
  fs.writeFileSync(child('dev-notes/packaging-v10.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ version: VERSION, uploadFolder: SOURCE_FOLDER, releaseFolder: RELEASE_FOLDER, uploadFiles: publicFiles.length, releaseFiles: distributedFiles.length, privacy: 'PASS', privateReport: 'dev-notes/packaging-v10.json' }, null, 2));
}

module.exports = { sourcePlan, releasePlan, assertOnlyExpected, assertNoPersonalArtifacts, scanPrivateStrings, checkRuntimePayload };
if (require.main === module) {
  try { main(); } catch (error) { console.error(`Packaging stopped: ${error.message}`); process.exitCode = 1; }
}

