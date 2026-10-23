/* VelvetRuin · read Word 97–2003 DOC (OLE compound file).
   Word 97+ piece table text extraction, best effort; never sends bytes away. */
(() => {
"use strict";
function readDoc(arrayBuffer){
 const src=new Uint8Array(arrayBuffer),dv=new DataView(arrayBuffer);
 if(src.length<512||![0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1].every((b,i)=>b===src[i]))
   throw Error("Not a standard binary Word .doc file. Save as DOCX or TXT and try again.");
 const u16=(v,off)=>v.getUint16(off,true),u32=(v,off)=>v.getUint32(off,true);
 const sectorSize=2**u16(dv,30),miniSize=2**u16(dv,32),FREE=0xffffffff,END=0xfffffffe;
 if(sectorSize!==512&&sectorSize!==4096)throw Error("Legacy .doc has an unsupported storage layout.");
 function sector(id){
   const pos=(id+1)*sectorSize;
   if(id>=0xfffffffa||pos<0||pos+sectorSize>src.length)throw Error("Legacy .doc has damaged storage sectors.");
   return src.slice(pos,pos+sectorSize);
 }
 const concat=chunks=>{
   const size=chunks.reduce((n,b)=>n+b.length,0),out=new Uint8Array(size);
   let offset=0;
   for(const b of chunks){out.set(b,offset);offset+=b.length;}
   return out;
 };
 const fatIds=[];
 for(let i=0;i<109;i++){const x=u32(dv,76+i*4);if(x<0xfffffffa)fatIds.push(x);}
 let dif=u32(dv,68);
 for(let n=0;n<Math.min(u32(dv,72),400)&&dif<0xfffffffa;n++){
   const b=sector(dif),v=new DataView(b.buffer,b.byteOffset,b.byteLength);
   for(let i=0;i<sectorSize/4-1;i++){const id=u32(v,i*4);if(id<0xfffffffa)fatIds.push(id);}
   dif=u32(v,sectorSize-4);
 }
 const fat=[];
 for(const id of fatIds){
   const b=sector(id),v=new DataView(b.buffer,b.byteOffset,b.byteLength);
   for(let i=0;i<sectorSize/4;i++)fat.push(u32(v,i*4));
 }
 function chain(start,links,max=60000){
   const ids=[],seen=new Set();let id=start;
   while(id<0xfffffffa&&id!==END&&id!==FREE&&ids.length<max){
     if(id>=links.length||seen.has(id))break;
     ids.push(id);seen.add(id);id=links[id];
   }
   return ids;
 }
 function stream(start,length){
   if(!Number.isSafeInteger(length)||length<0)throw Error("Damaged .doc stream size.");
   return concat(chain(start,fat).map(sector)).slice(0,length);
 }
 const dir=stream(u32(dv,48),Math.min(src.length,12*1024*1024)),entities=[];
 for(let offset=0;offset+128<=dir.length;offset+=128){
   const v=new DataView(dir.buffer,dir.byteOffset+offset,128),size=u16(v,64);
   if(size<2||size>64)continue;
   const name=new TextDecoder("utf-16le").decode(dir.slice(offset,offset+size-2));
   entities.push({name,type:dir[offset+66],start:u32(v,116),size:u32(v,120)});
 }
 const root=entities.find(e=>e.type===5),lookup=n=>entities.find(e=>e.name===n);
 if(!root)throw Error("Legacy .doc is missing its root data stream.");
 const miniRoot=stream(root.start,Math.min(root.size,src.length)),mf=stream(u32(dv,60),Math.min(src.length,3*1024*1024)),miniFat=[],mv=new DataView(mf.buffer,mf.byteOffset,mf.length);
 for(let i=0;i+4<mf.length;i+=4)miniFat.push(u32(mv,i));
 function content(entry){
   if(!entry)throw Error("Legacy Word file is missing the required text stream.");
   if(entry.size<4096&&miniFat.length&&entry.type!==5) {
      return concat(chain(entry.start,miniFat).map(id=>miniRoot.slice(id*miniSize,(id+1)*miniSize))).slice(0,entry.size);
   }
   return stream(entry.start,Math.min(entry.size,src.length));
 }
 const word=content(lookup("WordDocument")),wv=new DataView(word.buffer,word.byteOffset,word.byteLength);
 if(word.length<100||u16(wv,0)!==0xa5ec)throw Error("This .doc version cannot be reliably read. Save it as .docx or .txt.");
 const flags=u16(wv,10);
 if(flags&0x0100||flags&0x8000)throw Error("Password-encrypted Word documents must be unlocked first.");
 const table=content(lookup((flags&0x0200)?"1Table":"0Table"));
 let cursor=32;
 if(cursor+2>=word.length)throw Error("Word file's header is incomplete.");
 const csw=u16(wv,cursor);cursor+=2+csw*2;
 if(cursor+2>=word.length)throw Error("Word file's header is incomplete.");
 const cslw=u16(wv,cursor);cursor+=2;
 const longWords=cursor;cursor+=cslw*4;
 if(cursor+2+34*8>=word.length)throw Error("Legacy .doc has no supported piece table.");
 const mainChars=cslw>3?u32(wv,longWords+12):0;
 const count=u16(wv,cursor);cursor+=2;
 if(count<34)throw Error("No text mapping found in the legacy .doc.");
 const fcClx=u32(wv,cursor+33*8),lcbClx=u32(wv,cursor+33*8+4);
 let result="";
 if(lcbClx&&fcClx+lcbClx<=table.length){
   const tv=new DataView(table.buffer,table.byteOffset,table.byteLength);
   let p=fcClx;
   const finish=fcClx+lcbClx;
   while(p<finish){
      const marker=table[p++];
      if(marker===1){if(p+2>finish)break;const size=u16(tv,p);p+=2+size;continue;}
      if(marker!==2||p+4>finish)break;
      const length=u32(tv,p);p+=4;
      const num=(length-4)/12;
      if(!Number.isInteger(num)||num<1||num>50000||p+length>finish)break;
      for(let i=0;i<num;i++){
        const cp1=u32(tv,p+i*4),cp2=u32(tv,p+(i+1)*4);
        if(mainChars&&cp1>=mainChars)break;
        const chars=Math.max(0,Math.min(cp2,mainChars||cp2)-cp1);
        if(chars<=0||chars>3000000)continue;
        const pcd=p+(num+1)*4+i*8;
        const packed=u32(tv,pcd+2),compressed=!!(packed&0x40000000);
        const at=(packed&0x3fffffff)/(compressed?2:1);
        const end=at+chars*(compressed?1:2);
        if(!Number.isInteger(at)||end>word.length||at<0)continue;
        const bytes=word.slice(at,end);
        result+=new TextDecoder(compressed?"windows-1252":"utf-16le").decode(bytes);
      }
      break;
   }
 }
 if(!result){
   const begin=u32(wv,24),end=u32(wv,28);
   if(begin<end&&end<=word.length)result=new TextDecoder("windows-1252").decode(word.slice(begin,end));
 }
 result=result.replace(/[\u0001-\u0008\u000e-\u001f]/g,"").replace(/\u000b|\u000c|\r/g,"\n").replace(/\n{4,}/g,"\n\n").trim();
 if(result.replace(/[^A-Za-zÀ-ž]/g,"").length<20)throw Error("This legacy .doc did not yield reliable text. Save it as DOCX or TXT, then import it.");
 return result;
}
window.AtelierLegacyDoc=readDoc;
})();