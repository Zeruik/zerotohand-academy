// Render the supplied artwork into application packaging sizes. No logo is redrawn.
const fs=require('fs'),path=require('path');
const sharp=require('./qa/desktop-runtime/node_modules/sharp');
const root=__dirname;
const original=fs.readFileSync(path.join(root,'assets/zerotohand-logo-original.jpg')).toString('base64');
const artwork=`<defs><filter id="ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.2126 -0.7152 -0.0722 0 1"/></filter></defs><image width="2560" height="1024" href="data:image/jpeg;base64,${original}" filter="url(#ink)"/>`;
const sigil=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect x="1" y="1" width="254" height="254" rx="48" fill="#f3ecdc"/><path d="M42 231H214" stroke="#bc7d4e" stroke-width="5"/><svg x="22" y="17" width="212" height="212" viewBox="165 65 840 910">${artwork}</svg></svg>`;
function bmp24(rgb,width,height){const stride=Math.ceil(width*3/4)*4,header=Buffer.alloc(54),pixels=Buffer.alloc(stride*height);header.write('BM');header.writeUInt32LE(54+pixels.length,2);header.writeUInt32LE(54,10);header.writeUInt32LE(40,14);header.writeInt32LE(width,18);header.writeInt32LE(height,22);header.writeUInt16LE(1,26);header.writeUInt16LE(24,28);header.writeUInt32LE(pixels.length,34);for(let y=0;y<height;y++)for(let x=0;x<width;x++){const a=(y*width+x)*3,b=(height-y-1)*stride+x*3;pixels[b]=rgb[a+2];pixels[b+1]=rgb[a+1];pixels[b+2]=rgb[a];}return Buffer.concat([header,pixels]);}
async function rasterBmp(svg,file,width,height){const data=await sharp(Buffer.from(svg)).resize(width,height).flatten({background:'#f3f1e9'}).removeAlpha().raw().toBuffer();fs.writeFileSync(path.join(root,file),bmp24(data,width,height));}
(async()=>{
 fs.writeFileSync(path.join(root,'assets/zerotohand-icon.svg'),sigil);
 const sizes=[16,24,32,48,64,128,256],images=[];for(const size of sizes)images.push(await sharp(Buffer.from(sigil)).resize(size,size).png().toBuffer());
 const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
 sizes.forEach((size,i)=>{const o=6+i*16;header[o]=header[o+1]=size===256?0:size;header.writeUInt16LE(1,o+4);header.writeUInt16LE(32,o+6);header.writeUInt32LE(images[i].length,o+8);header.writeUInt32LE(offset,o+12);offset+=images[i].length;});
 fs.writeFileSync(path.join(root,'ZeroToHand-Academy.ico'),Buffer.concat([header,...images]));
 const logo=fs.readFileSync(path.join(root,'assets/zerotohand-logo.svg')).toString('base64');
 const wizard=`<svg xmlns="http://www.w3.org/2000/svg" width="164" height="314"><rect width="164" height="314" fill="#f3f1e9"/><image x="12" y="28" width="140" height="62" href="data:image/svg+xml;base64,${logo}"/><path d="M18 114H146" stroke="#a9764e"/><text x="18" y="140" font-family="Segoe UI,sans-serif" font-size="11" fill="#31565d">ENGINEERING</text><text x="18" y="158" font-family="Segoe UI,sans-serif" font-size="11" fill="#31565d">ACADEMY 10.0</text><g fill="none" stroke="#45847d" stroke-width="2"><path d="M28 218H78V249H136M28 218V277H112"/><circle cx="28" cy="218" r="5"/><circle cx="78" cy="249" r="5"/><circle cx="112" cy="277" r="5"/><path d="M126 218h20v20h-20z"/></g><text x="18" y="300" font-family="Segoe UI,sans-serif" font-size="9" fill="#637773">LEARN · BUILD · UNDERSTAND</text></svg>`;
 await rasterBmp(wizard,'setup-wizard.bmp',164,314);await rasterBmp(sigil,'setup-small.bmp',55,55);
 console.log('Original-brand icon and installer artwork rendered.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});

