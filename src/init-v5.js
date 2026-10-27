(async()=>{
  await window.ProfileStore9?.ready;
  window.SCENE3D6?.install();
  save4();
  // Parse after all lessons and workbenches have registered, including new modules.
  function followHash(){try{let [view,id]=decodeURIComponent(location.hash.slice(1)).split('/');if(view==='labs')view='lab';if(!['home','courses','lesson','lab','atlas','projects','notes','sources','help','path','tools'].includes(view))return false;if(view==='lesson'&&!LESSONS.some(l=>l.id===id))return false;if(view==='lab'&&id){id=LM4[id]||id;if(!LAB4[id])return false;}if(view==='tools'&&!['ide','esp32-ota'].includes(id))id='ide';nav4(view,id);return true;}catch{return false;}}
  if(!followHash())render4();
  window.addEventListener('hashchange',followHash);
  window.zthDesktop9?.onCloseRequest(async()=>{
    try{window.zthDesktop9.respondClose(await window.ProfileStore9.requestClose());}
    catch{window.zthDesktop9.respondClose(false);notice4(T('请先保存或导出档案再退出。','Save or export your archive before closing.'));}
  });
})();
