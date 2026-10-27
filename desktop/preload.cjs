const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('zthDesktop9', {
  loadStore: () => ipcRenderer.invoke('zth9:load'),
  saveStore: data => ipcRenderer.invoke('zth9:save', data),
  getInfo: () => ipcRenderer.invoke('zth9:info'),
  openPolicy: kind => ipcRenderer.invoke('zth10:policy',kind),
  listPorts: () => ipcRenderer.invoke('zth10:ports'),
  compileFirmware: input => ipcRenderer.invoke('zth10:compile',input),
  uploadFirmware: input => ipcRenderer.invoke('zth10:upload',input),
  discardFirmware: id => ipcRenderer.invoke('zth10:discard',id),
  onCloseRequest: callback => {
    const listener = () => callback();
    ipcRenderer.on('zth9:close-request', listener);
    ipcRenderer.invoke('zth9:close-ready').catch(() => {});
    return () => ipcRenderer.removeListener('zth9:close-request', listener);
  },
  respondClose: allow => ipcRenderer.invoke('zth9:close-response', allow === true),
});
