'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {installerIdentityMatches}=require('../package-release-v14.cjs'),version=require('../desktop/package.json').version;
const setup=fs.readFileSync(path.join(__dirname,'../ZeroToHand-Desktop.iss'),'utf8');
assert.equal(installerIdentityMatches(setup,version),true);
for(const change of [s=>s.replace(/^AppVersion=.+$/m,'AppVersion=99.0.0'),s=>s.replace(/^VersionInfoVersion=.+$/m,'VersionInfoVersion=99.0.0.0'),s=>s.replace(/InstallerVersion = '[^']+';/,"InstallerVersion = '99.0.0';"),s=>s+'\nAppVersion='+version+'\n'])assert.equal(installerIdentityMatches(change(setup),version),false);
assert.equal(installerIdentityMatches(setup,'14.0'),false);
console.log('PASS current app, PE metadata and upgrade-guard versions agree; stale and duplicate declarations reject');
