/* Fizzz Atelier · complete project exports.
   Uses the current active editor, not the original uploaded text. Browser-only. */
(() => {
 "use strict";
 const A=()=>window.FizzzAtelier,$=s=>document.querySelector(s);
 const enc=new TextEncoder();
 let imageFile=null;
 const filename=()=>((A()?.getState().name||"character").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"character");
 function status(t){const x=$("#export-suite-status");if(x)x.textContent=t;}
 function save(name,blob){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);}
 const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 function compiled(){
  const s=A().getState(),books=[];
  for(let i=1;i<=3;i++)if(s["world"+i+"Title"]||s["world"+i+"Body"]||s["world"+i+"Keywords"]){
   books.push({number:i,title:s["world"+i+"Title"]||"",activation:s["world"+i+"Mode"]||"keyword",keywords:(s["world"+i+"Keywords"]||"").split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean),content:s["world"+i+"Body"]||"",complete:Boolean((s["world"+i+"Body"]||"").trim())});
  }
  const date=(s.bio||"").match(/CREATION DATE:\*{0,2}\s*(November\s+1,\s+2026|\d{4}-\d{2}-\d{2})/i)?.[1]||"";
  return {format:"VelvetRuin Fizzz field package",schema_version:2,platform:"Fizzz",note:"Creator-ready field package, not an official Fizzz bulk-import schema; copy fields into Fizzz.",creation_date:date,profile:{public_title:s.title||"",chat_name:s.name||"",age:s.age||"",gender:s.gender||"",pov:s.pov||"",rating:s.rating||"",bio:s.bio||"",content_advisory:s.warning||"",discovery_tags:A().getTags()},core_personality:A().coreCompiled(),initial_message:A().openingCompiled(),worldbooks:books,media:{cover_direction:s.coverDirection||"",character_images_direction:s.imageDirection||"",voice_direction:s.voiceDirection||"",voice_design:s.voiceDesignPrompt||"",opening_film:s.videoDirection||""},checks:{core_characters:A().coreCompiled().length,opening_characters:A().openingCompiled().length,worldbooks:books.map(x=>({number:x.number,characters:x.content.length,complete:x.complete}))}};
 }
 function exportJSON(){const out=compiled();save(filename()+"-fizzz-final.json",new Blob([JSON.stringify(out,null,2)],{type:"application/json"}));status("Structured final JSON exported. Fizzz does not currently have a verified native JSON import for this package.");}
 function crc32(b){let c=-1;for(const x of b){c^=x;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^(-1))>>>0;}
 function makeZip(files){
  const local=[],central=[];let offset=0,csize=0;
  for(const [name,content] of Object.entries(files)){
   const n=enc.encode(name),data=enc.encode(content),crc=crc32(data);
   const head=new Uint8Array(30),h=new DataView(head.buffer);
   h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,n.length,true);
   local.push(head,n,data);
   const ch=new Uint8Array(46),v=new DataView(ch.buffer);
   v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint32(16,crc,true);v.setUint32(20,data.length,true);v.setUint32(24,data.length,true);v.setUint16(28,n.length,true);v.setUint32(42,offset,true);
   central.push(ch,n);csize+=ch.length+n.length;offset+=head.length+n.length+data.length;
  }
  const end=new Uint8Array(22),e=new DataView(end.buffer);
  e.setUint32(0,0x06054b50,true);e.setUint16(8,Object.keys(files).length,true);e.setUint16(10,Object.keys(files).length,true);e.setUint32(12,csize,true);e.setUint32(16,offset,true);
  return new Blob([...local,...central,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
 }
 function paragraph(line,isHead=false){
  const prop=isHead?'<w:pPr><w:spacing w:before="260" w:after="140"/><w:rPr><w:b/><w:color w:val="603952"/><w:sz w:val="28"/></w:rPr></w:pPr>':'<w:pPr><w:spacing w:after="65"/></w:pPr>';
  return '<w:p>'+prop+'<w:r><w:t xml:space="preserve">'+esc(line||" ")+'</w:t></w:r></w:p>';
 }
 function exportDOCX(){
  const out=compiled(),blocks=A().sections();
  const all=[paragraph(out.profile.chat_name||"Fizzz Character",true),paragraph("Creator-ready field manuscript · Validate and paste individual fields into Fizzz.")];
  for(const [label,content] of blocks){
   all.push(paragraph(label,true));
   if(/^WORLDBOOK/.test(label)&&!/[\s\S]*\n\n\S/.test(content||""))all.push(paragraph("[Outline only — add the full Worldbook text before publishing]"));
   for(const line of String(content||"").split("\n"))all.push(paragraph(line));
  }
  const document='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
   '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+all.join("")+
   '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/></w:sectPr></w:body></w:document>';
  const files={
   "[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
   "_rels/.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
   "word/document.xml":document
  };
  save(filename()+"-fizzz-final.docx",makeZip(files));
  status("DOCX exported with the compiled fields. Wordbook bodies that were only outlined in the import must still be supplied.");
 }
 function drawWrap(ctx,text,x,y,maxWidth,lineH,maxLines=4){
  let words=String(text||"").replace(/[#*_]/g,"").split(/\s+/).filter(Boolean),line="",drawn=0;
  for(const w of words){const next=line?line+" "+w:w;if(ctx.measureText(next).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineH;drawn++;line=w;if(drawn>=maxLines)return y;}else line=next;}
  if(line&&drawn<maxLines){ctx.fillText(line,x,y);y+=lineH;}return y;
 }
 async function exportPNG(){
  const s=A().getState(),canvas=document.createElement("canvas");canvas.width=1080;canvas.height=1920;const ctx=canvas.getContext("2d");
  if(!ctx)throw Error("Canvas unavailable in this browser.");
  const bg=ctx.createLinearGradient(0,0,1080,1920);bg.addColorStop(0,"#301c30");bg.addColorStop(.5,"#130e18");bg.addColorStop(1,"#08090e");ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1920);
  if(imageFile){
   const url=URL.createObjectURL(imageFile);
   try{const im=new Image();await new Promise((res,rej)=>{im.onload=res;im.onerror=rej;im.src=url});
    const scale=Math.max(1080/im.width,1920/im.height),w=im.width*scale,h=im.height*scale;
    ctx.drawImage(im,(1080-w)/2,(1920-h)/2,w,h);
   }finally{URL.revokeObjectURL(url);}
  }else{
   ctx.strokeStyle="rgba(218,187,145,.10)";ctx.lineWidth=3;
   for(let i=0;i<16;i++){ctx.beginPath();ctx.ellipse(540,860,125+i*62,210+i*68,0,0,Math.PI*2);ctx.stroke();}
  }
  const layer=ctx.createLinearGradient(0,750,0,1920);layer.addColorStop(0,"rgba(0,0,0,0)");layer.addColorStop(.43,"rgba(11,7,14,.72)");layer.addColorStop(1,"rgba(9,6,15,.98)");ctx.fillStyle=layer;ctx.fillRect(0,650,1080,1270);
  ctx.fillStyle="#dec498";ctx.font="600 30px Georgia,serif";ctx.letterSpacing="7px";ctx.fillText("V E L V E T R U I N   ·   F I Z Z Z",76,140);
  ctx.fillStyle="#fff2f4";ctx.font="bold 105px Georgia,serif";const name=s.name||"Untitled Character";
  let ny=drawWrap(ctx,name.toUpperCase(),76,1440,930,115,2);
  ctx.fillStyle="#e7c59d";ctx.font="italic 52px Georgia,serif";
  ny=drawWrap(ctx,(s.title||"").replace(name,"").replace(/^[\s|—:]+/,"").trim(),80,ny+24,890,65,3);
  ctx.fillStyle="#f1e8ec";ctx.font="38px Arial,sans-serif";
  const hook=(s.bio||"").split("\n").map(x=>x.replace(/[*#]/g,"").trim()).find(x=>x.length>48)||"An unforgettable character awaits.";
  drawWrap(ctx,hook,80,Math.min(ny+42,1700),900,55,2);
  ctx.fillStyle="#d8b784";ctx.font="26px Arial,sans-serif";ctx.fillText("CHARACTER PREVIEW · 9:16",80,1830);
  await new Promise(resolve=>canvas.toBlob(b=>{if(b)save(filename()+"-character-preview.png",b);resolve();},"image/png"));
  status(imageFile?"9:16 promotional PNG exported using your uploaded artwork.":"9:16 typographic PNG exported. Upload existing character art first if you want the character visible.");
 }
 function init(){
  $("#download-final-json")?.addEventListener("click",exportJSON);
  $("#download-docx")?.addEventListener("click",exportDOCX);
  $("#download-png")?.addEventListener("click",()=>exportPNG().catch(e=>status("PNG export failed: "+e.message)));
  $("#export-png-image")?.addEventListener("change",e=>{imageFile=e.target.files?.[0]||null;status(imageFile?"Artwork ready: "+imageFile.name+" — Export 9:16 PNG when ready.":"No artwork selected; PNG will use a typographic background.");});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
 window.VelvetRuinFizzzExportSuite=Object.freeze({compiled});
})();