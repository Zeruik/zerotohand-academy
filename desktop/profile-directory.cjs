'use strict';
// Explicit advanced/QA isolation. The default profile identity remains unchanged.
const fs=require('node:fs'),path=require('node:path');
function profileDirectory(argv=process.argv){const flags=argv.filter(x=>x.startsWith('--zth-profile-dir='));if(!flags.length)return null;if(flags.length!==1)throw Error('PROFILE_DIRECTORY_ARGUMENT');const raw=flags[0].slice('--zth-profile-dir='.length);if(!path.isAbsolute(raw)||raw.includes('\0'))throw Error('PROFILE_DIRECTORY_ABSOLUTE');const full=path.resolve(raw);if(full===path.parse(full).root)throw Error('PROFILE_DIRECTORY_ROOT');let at=full;for(;;){if(fs.existsSync(at)){const s=fs.lstatSync(at);if(s.isSymbolicLink()||!s.isDirectory())throw Error('PROFILE_DIRECTORY_LINK');}const up=path.dirname(at);if(up===at)break;at=up;}fs.mkdirSync(full,{recursive:true});return full;}
module.exports={profileDirectory};
