'use strict';
const {spawnSync}=require('node:child_process');
const result=spawnSync(process.execPath,process.argv.slice(2),{encoding:'utf8',maxBuffer:16*1024*1024,env:process.env});
process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');
if(result.error||result.status!==0){const message=result.error?.message||((result.stderr||'')+'\n'+(result.stdout||'')).slice(-2400);console.error('::error::'+message.replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A'));}
process.exit(result.status??1);
