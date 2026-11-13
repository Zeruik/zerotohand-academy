'use strict';
// POSIX fallback: authenticated encryption with an app-owned, permission-bound
// local key. It is deliberately NOT described as OS key-store protection.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const KEY_NAME='local-archive-key.bin',KEY_MAGIC=Buffer.from('ZTH-LOCAL-KEY-1\0'),DATA_MAGIC=Buffer.from('ZTH-AES-GCM-1\0'),MAX=64*1024*1024;
function keyFile(directory){if(typeof directory!=='string'||!path.isAbsolute(directory))throw Error('LOCAL_KEY_DIRECTORY');return path.join(directory,KEY_NAME);}
function createFileProtection(directory){
 const file=keyFile(directory);fs.mkdirSync(directory,{recursive:true,mode:0o700});const folder=fs.lstatSync(directory);if(folder.isSymbolicLink()||!folder.isDirectory())throw Error('LOCAL_KEY_DIRECTORY_LINK');if(process.platform!=='win32'){fs.chmodSync(directory,0o700);if((fs.statSync(directory).mode&0o077)!==0)throw Error('LOCAL_KEY_PERMISSIONS_UNSUPPORTED');}
 if(!fs.existsSync(file)){const bytes=Buffer.concat([KEY_MAGIC,crypto.randomBytes(32)]);try{const handle=fs.openSync(file,'wx',0o600);try{fs.writeFileSync(handle,bytes);fs.fsyncSync(handle);}finally{fs.closeSync(handle);}}catch(e){if(e.code!=='EEXIST')throw Error('LOCAL_KEY_CREATE_FAILED');}}
 const st=fs.lstatSync(file);if(st.isSymbolicLink()||!st.isFile()||st.size!==KEY_MAGIC.length+32)throw Error('LOCAL_KEY_INVALID');if(process.platform!=='win32'){if(typeof process.getuid==='function'&&st.uid!==process.getuid())throw Error('LOCAL_KEY_OWNER');fs.chmodSync(file,0o600);if((fs.statSync(file).mode&0o077)!==0)throw Error('LOCAL_KEY_PERMISSIONS_UNSUPPORTED');}
 const bytes=fs.readFileSync(file);if(!bytes.subarray(0,KEY_MAGIC.length).equals(KEY_MAGIC))throw Error('LOCAL_KEY_INVALID');const key=bytes.subarray(KEY_MAGIC.length);
 return{protected:false,encrypted:true,keyProtection:'private-file',recoveryFiles:[KEY_NAME],
  async encrypt(text){if(typeof text!=='string'||Buffer.byteLength(text)>MAX)throw Error('LOCAL_RECORD_SIZE');const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(DATA_MAGIC);const encrypted=Buffer.concat([cipher.update(text,'utf8'),cipher.final()]);return Buffer.concat([DATA_MAGIC,iv,cipher.getAuthTag(),encrypted]);},
  async decrypt(input){if(!Buffer.isBuffer(input)&&!(input instanceof Uint8Array)||input.length>MAX+128)throw Error('LOCAL_RECORD_SIZE');const b=Buffer.from(input),offset=DATA_MAGIC.length;if(b.length<offset+28||!b.subarray(0,offset).equals(DATA_MAGIC))throw Error('LOCAL_RECORD_PROVIDER_MISMATCH');try{const decipher=crypto.createDecipheriv('aes-256-gcm',key,b.subarray(offset,offset+12));decipher.setAAD(DATA_MAGIC);decipher.setAuthTag(b.subarray(offset+12,offset+28));return Buffer.concat([decipher.update(b.subarray(offset+28)),decipher.final()]).toString('utf8');}catch{throw Error('LOCAL_RECORD_DECRYPT_FAILED');}}
 };
}
module.exports={KEY_NAME,keyFile,createFileProtection};
