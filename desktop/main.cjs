const {app,BrowserWindow,Menu,shell,session,ipcMain,safeStorage,dialog}=require('electron');
const path=require('path');
const {pathToFileURL}=require('url');
const {storagePath10}=require('./storage-path.cjs');
const {createFlasher10}=require('./flashing.cjs');
const {configureProtectionPaths,createProtection}=require('./protection.cjs');
for(const stream of [process.stdout,process.stderr])stream?.on('error',error=>{if(error.code!=='EPIPE')throw error;});
app.setName('ZeroToHand Academy');
configureProtectionPaths(app);
if(process.platform==='win32')app.setAppUserModelId('ZeroToHand.Desktop');
function external(url){try{let u=new URL(url);if(u.protocol==='https:'||(u.protocol==='mailto:'&&u.pathname==='zeruik@qq.com'))shell.openExternal(u.href);}catch{}}
if(!app.requestSingleInstanceLock())app.quit();
else{let win;app.on('second-instance',()=>{if(win){win.show();if(win.isMinimized())win.restore();win.focus();}});app.whenReady().then(async()=>{
 session.defaultSession.setPermissionRequestHandler((_wc,_permission,reply)=>reply(false));
 Menu.setApplicationMenu(null);
 const entry=pathToFileURL(path.join(__dirname,'index.html')).href;
 const protection=await createProtection(safeStorage);
 const archive=await storagePath10(path.dirname(app.getPath('exe')),app.getPath('userData'),protection);
 const store=archive.store;
 const flasher=createFlasher10({root:path.join(process.resourcesPath,'flashing-v10'),tempRoot:path.join(app.getPath('temp'),'ZeroToHand-builds')});
 const firmware=new Map();let disposing=false,disposed=false;
 app.on('before-quit',event=>{if(disposed)return;event.preventDefault();if(disposing)return;disposing=true;flasher.dispose().catch(()=>{}).finally(()=>{disposed=true;app.quit();});});
 function trusted(event){return !!win&&!win.isDestroyed()&&event.sender===win.webContents&&event.senderFrame===win.webContents.mainFrame&&event.senderFrame.url.split('#')[0]===entry;}
 for(const [channel,handler]of [['load',()=>store.load()],['save',data=>store.save(data)],['info',()=>({storage:'local-file',protected:protection.protected,archivePath:archive.directory,migrated:archive.migrated,runtime:process.versions.electron})]])ipcMain.handle('zth9:'+channel,(event,data)=>{if(!trusted(event))throw Error('UNTRUSTED_SENDER');return handler(data);});
 win=new BrowserWindow({show:false,width:1440,height:960,minWidth:460,minHeight:560,backgroundColor:'#f7f3ed',icon:path.join(__dirname,'icon.ico'),webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 win.once('ready-to-show',()=>win.show());
 let closePending=false,closeReady=false,interruptAccepted=false;
 ipcMain.handle('zth9:close-ready',event=>{if(!trusted(event))throw Error('UNTRUSTED_SENDER');closeReady=true;});
 win.on('close',event=>{
   if(flasher.getStatus().operation==='upload'&&!interruptAccepted){const choice=dialog.showMessageBoxSync(win,{type:'warning',buttons:['继续等待 / Keep waiting','中断写入并退出 / Interrupt and exit'],defaultId:0,cancelId:0,title:'开发板正在写入 / Flash in progress',message:'现在退出会中断写入，板卡可能需要重新通过 USB 烧录。\nExiting interrupts flashing; the board may need USB recovery.'});if(choice!==1){event.preventDefault();return;}interruptAccepted=true;}
   // Before the app is interactive there is no renderer close listener yet.
   // Let Chromium's normal beforeunload path handle that early-close case.
   if(win.webContents.isCrashed()||!closeReady)return;
   event.preventDefault();
   if(!closePending){closePending=true;win.webContents.send('zth9:close-request');}
 });
 ipcMain.handle('zth9:close-response',(event,allow)=>{
   if(!trusted(event))throw Error('UNTRUSTED_SENDER');
   closePending=false;
   if(allow===true)win.destroy();else interruptAccepted=false;
 });
 win.webContents.setWindowOpenHandler(({url})=>{external(url);return{action:'deny'};});
 win.webContents.on('will-navigate',(event,url)=>{if(url.split('#')[0]!==entry){event.preventDefault();external(url);}});
 win.webContents.on('will-prevent-unload',event=>{
   const choice=dialog.showMessageBoxSync(win,{type:'warning',buttons:['返回保存 / Return to save','退出并舍弃未保存更改 / Leave without saving'],defaultId:0,cancelId:0,title:'ZeroToHand',message:'还有未保存的学习更改。There are unsaved learning changes.',detail:'返回应用后，可手动保存或导出 .zth 档案。Return to save locally or export a .zth archive.'});
   if(choice===1)event.preventDefault();
 });
 ipcMain.handle('zth10:policy',async(event,kind)=>{if(!trusted(event)||!['license','privacy'].includes(kind))throw Error('UNTRUSTED_REQUEST');return shell.openPath(path.join(path.dirname(app.getPath('exe')),kind==='license'?'LICENSE-ZH.txt':'PRIVACY-ZH.txt'));});
 const flashHandlers={
  ports:()=>flasher.listPorts(),
  compile:async input=>{const result=await flasher.compile(input);firmware.set(result.buildId,result);return result;},
  discard:async id=>{const result=await flasher.discard(id);firmware.delete(id);return result;},
  upload:async input=>{const build=firmware.get(input?.buildId);if(!build||!/^COM[1-9]\d{0,3}$/.test(input?.port||''))throw Error('BUILD_OR_PORT_INVALID');
   const result=await dialog.showMessageBox(win,{type:'warning',title:'确认写入开发板 / Confirm board flash',buttons:['取消 / Cancel','写入此开发板 / Flash this board'],defaultId:0,cancelId:0,noLink:true,message:`${build.chip.toUpperCase()} · ${input.port}`,detail:`Flash: ${build.options.flashSize} · PSRAM: ${build.options.psram}\n本操作会覆盖该串口所连接开发板上的程序与分区表，请先备份需要保留的数据。请核对芯片丝印、存储配置和目标串口。\nThis replaces firmware and the partition table on the connected board. Back up needed data and verify the chip, memory and serial port.\n\nSHA-256: ${build.sha256}`});
   if(result.response!==1)return{cancelled:true};
   try{return await flasher.upload(input);}finally{firmware.delete(input.buildId);}
  }
 };
 for(const [name,handler]of Object.entries(flashHandlers))ipcMain.handle('zth10:'+name,async(event,input)=>{if(!trusted(event))throw Error('UNTRUSTED_REQUEST');try{return await handler(input);}catch(error){throw Error(/^[A-Z_]{2,40}$/.test(error.code||'')?error.code:'LOCAL_TOOL_FAILED');}});
 win.loadFile(path.join(__dirname,'index.html'));
 }).catch(error=>{const reason=String(error.code||error.message);dialog.showErrorBox('ZeroToHand电子版',reason==='STORE_NEWER_VERSION'?'此存档来自更新版本，已停止写入。请使用创建此存档的新版应用；原始存档与备份均保留。\nThis archive needs a newer application. Writes are blocked; original files and backups are retained.':'无法启动本地存档 / Local archive could not start.\n请检查安装时选择的目录权限，保留存档并联系支持。\n'+reason);app.quit();});app.on('window-all-closed',()=>app.quit());}
