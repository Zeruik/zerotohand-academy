'use strict';
const fs=require('fs'),path=require('path');

// Keep the OS-protected key store stable across installer/executable/name changes.
// Local State is part of the recovery material, not a disposable browser cache.
function configureProtectionPaths(app,directory=path.join(app.getPath('appData'),'ZeroToHand Academy')){
 fs.mkdirSync(directory,{recursive:true});
 app.setPath('userData',directory);
 app.setPath('sessionData',directory);
 return directory;
}
async function createProtection(safeStorage){
 // Availability resolves only when the asynchronous key provider is initialized.
 if(!await safeStorage.isAsyncEncryptionAvailable())throw Error('LOCAL_PROTECTION_UNAVAILABLE');
 return{
  protected:true,
  encrypt:text=>safeStorage.encryptStringAsync(text),
  decrypt:async bytes=>{const value=await safeStorage.decryptStringAsync(bytes);if(typeof value?.result!=='string')throw Error('LOCAL_PROTECTION_UNAVAILABLE');return value.result;}
 };
}
module.exports={configureProtectionPaths,createProtection};
