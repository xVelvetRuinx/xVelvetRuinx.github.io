/* Fizzz Worldbook importer: three INDEPENDENT lore entries, in memory only.
   These are editable source fields, NOT embedded in finished character cards.
   A character-only export has no lore by design; it cannot restore lore. */
(()=>{
"use strict";
const norm=x=>String(x??"").replace(/\r\n?/g,"\n").trim();
const BUNDLE="VelvetRuin Fizzz Worldbook Bundle";
const empty=()=>({title:"",mode:"keyword",keywords:"",content:""});
const mode=x=>/always|constant/i.test(String(x||""))?"always":"keyword";
const kw=x=>{const v=Array.isArray(x)?x.filter(t=>typeof t==="string").join(", "):norm(x);return /^(?:none|none required|n\/a|not applicable)$/i.test(v)?"":v;};
function parseObject(obj){
 if(!obj||typeof obj!=="object")return [];
 let books=null;
 if(Array.isArray(obj.worldbooks))books=obj.worldbooks;
 else if(Array.isArray(obj.entries)&&obj.format===BUNDLE)books=obj.entries;
 else if(Array.isArray(obj.character_book?.entries))books=obj.character_book.entries;
 else if(Array.isArray(obj.data?.character_book?.entries))books=obj.data.character_book.entries;
 else if(Array.isArray(obj.data?.worldbooks))books=obj.data.worldbooks;
 const result=[];
 if(books){
  for(let i=0;i<books.length;i++){
   const b=books[i];if(!b||typeof b!=="object")continue;
   const index=Number(b.number||b.index||i+1);
   if(index<1||index>3||!Number.isInteger(index)||result.some(x=>x.number===index))continue;
   const v={number:index,title:norm(b.title||b.name||""),mode:mode(b.mode||b.activation||(b.constant?"always":"keyword")),keywords:kw(b.keywords||b.keys||""),content:norm(b.content||b.body||b.lore||b.text||"")};
   if(v.title||v.content||v.keywords)result.push(v);
  }
 }
 if(result.length)return result;
 const d=obj.data&&typeof obj.data==="object"?obj.data:obj.project&&typeof obj.project==="object"?obj.project:obj.fields&&typeof obj.fields==="object"?obj.fields:obj;
 for(let n=1;n<=3;n++){
  const p="world"+n,v={number:n,title:norm(d[p+"Title"]),mode:mode(d[p+"Mode"]),keywords:kw(d[p+"Keywords"]),content:norm(d[p+"Body"])};
  if(v.title||v.content||v.keywords)result.push(v);
 }
 return result;
}
function parseWorldbookHeadings(text){
 const lines=norm(text).split("\n"),heads=[];
 for(let i=0;i<lines.length;i++){
  const raw=lines[i].trim().replace(/^#{1,6}\s*/,"").replace(/^\*\*([\s\S]+?)\*\*$/,"$1").trim();
  const m=raw.match(/^(?:Worldbook|Lorebook)\s*([1-3])(?:\s*(?:[—–:\-]|\.)\s*(.*))?$/i);
  if(m){heads.push({n:Number(m[1]),title:norm(m[2]||""),at:i});}
 }
 if(!heads.length)return [];
 const list=[];
 for(let j=0;j<heads.length;j++){
  const h=heads[j],end=j+1<heads.length?heads[j+1].at:lines.length,bodyLines=lines.slice(h.at+1,end);
  let activation="",keywords="",body=[],explicit=false;
  for(let i=0;i<bodyLines.length;i++){
   const line=bodyLines[i],clean=line.replace(/\*/g,"").trim();
   if(/^Activation(?:\s+Mode)?\s*:/i.test(clean)){activation=mode(clean.split(":").slice(1).join(":"));continue;}
   if(/^(?:Keywords|Triggers|Activation Keywords)\s*:/i.test(clean)){
    keywords=clean.replace(/^[^:]+:\s*/,"").trim();
    if(!keywords&&bodyLines[i+1]?.trim()&&!/^(?:Activation|Keywords|Triggers|Lore|Body|Content)\s*:/i.test(bodyLines[i+1].replace(/\*/g,"").trim()))keywords=bodyLines[++i].trim();
    keywords=kw(keywords);
    continue;
   }
   if(/^(?:Full )?(?:Lore|Body|Content)\s*:/i.test(clean)){
    explicit=true;
    const first=line.replace(/^\s*(?:\*\*)?(?:Full )?(?:Lore|Body|Content)(?:\*\*)?\s*:\s*/i,"").trim();
    if(first)body.push(first);
    continue;
   }
   if(/^\s*(?:#{1,4}\s*)?WORLDBOOK CONFIGURATION\s*$/i.test(clean))continue;
   body.push(line);
  }
  let content=body.join("\n").trim();
  // Configuration-only entries contain descriptions but not full lore.
  const missing=/^\[(?:Missing full lore|No full lore imported|Outline only|Full source lore missing)/i.test(content);
  if(missing||(!explicit&&content.length<100&&!/^\[(?:BACKGROUND|RULES|OVERVIEW|HISTORY|LOCATION|LORE)\]/i.test(content)))content="";
  if(h.title||content||keywords)list.push({number:h.n,title:h.title,mode:activation,keywords,content});
 }
 return list;
}
function parseLoreBlocks(text){
 const result=[],re=/<character_lore:\s*([^>]+)>([\s\S]*?)<\/character_lore>/gi;
 for(const match of String(text||"").matchAll(re)){
  const title=norm(match[1]),body=norm(match[2]);
  if(!body)continue;
  const numbered=title.match(/(?:worldbook|lorebook)\s*([1-3])\b/i),number=numbered?Number(numbered[1]):result.length+1;
  if(number>3||result.some(x=>x.number===number))continue;
  result.push({number,title,mode:"",keywords:"",content:match[0].trim()});
 }
 return result;
}
function extract(source){
 const str=norm(source);
 if(!str)return {entries:[],type:"empty",warnings:[]};
 if(/^[{\[]/.test(str)){
  try{
   const entries=parseObject(JSON.parse(str));
   if(entries.length)return {entries,type:"json",warnings:[]};
  }catch{}
 }
 const headed=parseWorldbookHeadings(str),blocks=parseLoreBlocks(str);
 const by=new Map(headed.map(b=>[b.number,b]));
 for(const block of blocks){
  const existing=by.get(block.number);
  // A complete character_lore body is authoritative over an outline.
  by.set(block.number,{...existing,...block,
   title:existing?.title||block.title,
   mode:existing?.mode||block.mode,
   keywords:existing?.keywords||block.keywords});
 }
 const entries=[...by.values()].sort((a,b)=>a.number-b.number);
 return {entries,type:blocks.length?"tagged-lore":headed.length?"numbered-lore":"unrecognized",warnings:[]};
}
function fields(entries){
 const values={};for(const b of entries){
  const n=Number(b.number);if(!Number.isInteger(n)||n<1||n>3)continue;
  const p="world"+n;
  if(b.title)values[p+"Title"]=norm(b.title);
  if(b.mode)values[p+"Mode"]=mode(b.mode);
  if(b.keywords)values[p+"Keywords"]=kw(b.keywords);
  if(b.content)values[p+"Body"]=norm(b.content);
 }
 return values;
}
function bundle(state,name){
 const entries=[];
 for(let n=1;n<=3;n++){
  const prefix="world"+n;
  entries.push({number:n,title:norm(state[prefix+"Title"]),mode:mode(state[prefix+"Mode"]),
   keywords:kw(state[prefix+"Keywords"]),content:norm(state[prefix+"Body"])});
 }
 return {format:BUNDLE,version:1,name:norm(name||state.name),note:"Worldbooks-only project file. Upload through Import Worldbooks to restore three separate editable entries. NEVER a character-card upload.",worldbooks:entries};
}
window.FizzzWorldbookSource=Object.freeze({extract,fields,bundle,parseObject,parseLoreBlocks,parseWorldbookHeadings});
})();