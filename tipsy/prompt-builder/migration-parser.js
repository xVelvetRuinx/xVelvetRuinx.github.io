/* VelvetRuin · Migration Studio. Local-only character import and field mapping. */
(() => {
"use strict";
const aliases={
title:"title|published title|bot title|display name|character title|name field",
name:"name|character name|char name|full name",
age:"age|apparent age",
gender:"gender|sex",
rating:"rating|content rating",
hook:"hook|tagline|short description|description field|public description|synopsis|summary|blurb",
userRole:"user role|player role|your role|user perspective|role of user|user identity",
tease:"tease|story teaser|closing hook",
trope:"tropes|trope|genre|romance tropes|relationship dynamic",
appearance:"appearance|looks|physical appearance|physical description|visual identity",
personality:"personality|persona|character personality|long description|core personality|personality traits|traits|behavior|behaviour",
contradiction:"contradiction|inner conflict|internal contradiction",
voice:"voice|speech|speech pattern|speaking style|speech style|dialogue style",
mannerisms:"mannerisms|mannerism|habits|tells|gestures",
occupation:"occupation|job|profession|career",
surfaceGoal:"surface goal|immediate goal|objective|goal",
hiddenGoal:"hidden goal|secret motive|hidden motivation|true desire|private motivation",
backstory:"backstory|background|history|origin|character history",
anchors:"rules|character rules|instructions|system prompt|roleplay rules|constraints|behavior rules|model direction|behavioral guidelines",
sampleChar1:"example dialogue|example dialogues|dialogue examples|sample dialogue|mes example|sample conversations",
setting:"setting|world setting|world|location|time period|environment",
lore:"lore|world rules|worldbook|lorebook|factions|worldbuilding|magic system",
scenario:"scenario|story scenario|premise|current situation|starting scenario|plot setup|plot",
relationship:"relationship|starting relationship|starting dynamic|relationship with user",
supporting:"supporting cast|supporting characters|side characters|npcs",
canon:"canon|memory|continuity facts|timeline|important facts",
customGreeting:"greeting|first message|initial message|first_mes|opening|opening field|initial_msg|starter",
tags:"tags|keywords|categories"
};
const keyLookup=new Map();
Object.entries(aliases).forEach(([key,s])=>s.split("|").forEach(x=>keyLookup.set(x,key)));
const label=t=>String(t||"").toLowerCase().replace(/[0-9§.*#\[\]()_:—–/-]+/g," ").replace(/\s+/g," ").trim().replace(/^character /,"");
function fieldName(t) {
 const n=label(t);
 return keyLookup.get(n)||keyLookup.get(n.replace(/ field$/,""))||(/personality.*background|background.*personality/.test(n)?"personality":/tagline.*public.*description|description.*tagline/.test(n)?"hook":/greeting.*opening|opening.*greeting/.test(n)?"customGreeting":/name.*tipsy.*name/.test(n)?"name":/example.*dialogue|dialogue.*example/.test(n)?"sampleChar1":/suggested.*tags/.test(n)?"tags":null);
}
function cleanup(s,mode="tuned") {
 let t=String(s||"").replace(/\u0000/g,"").replace(/\r\n?|\u000b|\u000c/g,"\n");
 if(/<(p|h[1-6]|div|br|span)\b/i.test(t)) {
   const doc=new DOMParser().parseFromString(t,"text/html");
   doc.querySelectorAll("script,style,object,iframe").forEach(n=>n.remove());
   doc.querySelectorAll("p,h1,h2,h3,h4,h5,h6,li,blockquote,br,div,tr").forEach(n=>n.insertAdjacentText("afterend","\n"));
   t=doc.body.textContent||t;
 }
 t=t.replace(/\\<\/?(?:p|div|span|h[1-6])[^>]*\\?>/gi,"\n")
 .replace(/\{\{\s*(user|char)\s*\}\}/gi,(_,v)=>"{{"+v.toLowerCase()+"}}")
 .replace(/<(user|char)>|\[(user|char)\]/gi,(_,a,b)=>"{{"+String(a||b).toLowerCase()+"}}")
 .replace(/[ \t]+\n/g,"\n").replace(/\n{5,}/g,"\n\n\n");
 if(mode==="tuned")t=t.replace(/([!?]){4,}/g,"$1").replace(/\n{3,}/g,"\n\n");
 return t.trim();
}
function parseSections(text){
 const groups=[],orphan=[];
 let current=null,before=[];
 const flush=()=>{if(current){current.value=current.lines.join("\n").trim();groups.push(current);current=null;}};
 for(const [i,line] of cleanup(text,"faithful").split("\n").entries()){
   const trim=line.trim();
   const numbered=trim.match(/^\d{1,2}\s*[·.\-—]\s*(.+)$/);
   const h=trim.match(/^#{1,6}\s+(.+)$/)||trim.match(/^\[([^\]]{2,65})\]\s*$/)||trim.match(/^\*\*([^*]{2,65})\*\*\s*$/)||numbered;
   const kv=trim.match(/^([A-Za-z][A-Za-z0-9 \/_-]{1,43})\s*:\s*(.*)$/);
   let name="",key=null,inline="";
   if(h){name=h[1];key=fieldName(name);}
   else if(kv){name=kv[1];key=fieldName(name);inline=kv[2];}
   else if(i===0&&trim.length<50){name=trim;key=fieldName(name);}
   if(key && !/^\{\{(?:user|char)\}\}/i.test(trim)){
      if(before.join("").trim())orphan.push(before.join("\n").trim());
      before=[];flush();current={key,name,lines:inline?[inline]:[]};continue;
   }
   if(current)current.lines.push(line);else before.push(line);
 }
 flush();
 if(before.join("").trim())orphan.push(before.join("\n").trim());
 return {groups,orphan};
}
function fromText(text){
 const parsed=parseSections(text),fields={},conflicts=[],sources=[];
 for(const item of parsed.groups){
   const {key,value,name}=item;
   if(!value)continue;
   if(fields[key]&&fields[key]!==value){
      if(["personality","lore","backstory","anchors","canon","sampleChar1"].includes(key))fields[key]+="\n\n"+value;
      else conflicts.push(key+": "+value);
   }else fields[key]=value;
   sources.push(name);
 }
 return {fields,unmapped:parsed.orphan.join("\n\n"),conflicts,sources};
}
function fromJson(obj) {
 if(typeof obj==="string")return {fields:{personality:obj},unmapped:"",sources:["text"],conflicts:[]};
 if(!obj||typeof obj!=="object"||Array.isArray(obj))throw Error("The JSON must contain a character object.");
 const main=(obj.project&&typeof obj.project==="object"?obj.project:obj.data&&typeof obj.data==="object"?obj.data:obj.character&&typeof obj.character==="object"?obj.character:obj);
 const fields={};
 for(const [k,v] of Object.entries(main)){
   const target=fieldName(k);
   if(target && typeof v==="string"&&v.trim())fields[target]=v;
 }
 const variations={
 title:["title","display_name","bot_title"],name:["name","char_name"],
 hook:["tagline","short_description","public_description","subtitle","bio","summary"],
 personality:["personality","char_persona","description","character_description","persona"],
 customGreeting:["first_mes","first_message","initial_message","greeting","opening","firstMessage"],
 sampleChar1:["mes_example","example_dialogue","example_messages"],
 anchors:["system_prompt","instructions","post_history_instructions","roleplay_rules"],
 scenario:["scenario","scenario_text","story"],lore:["lore","worldbook","world_info"],userRole:["user_role","player_role"],
 backstory:["backstory","history"],voice:["speech","voice"],appearance:["appearance","looks"],
 tags:["tags","categories"],occupation:["occupation"]
 };
 for(const [k,sourceKeys] of Object.entries(variations)){
    if(fields[k])continue;
    const found=sourceKeys.find(key=>main[key]!==undefined&&main[key]!==null);
    if(!found)continue;
    const v=main[found];
    if(typeof v==="string")fields[k]=v;
    if(k==="tags"&&Array.isArray(v))fields.tags=v.filter(x=>typeof x==="string");
 }
 if(main.character_book&&Array.isArray(main.character_book.entries)){
   const lore=main.character_book.entries.slice(0,40).map(e=>e.content||e.text||"").filter(Boolean).join("\n\n");
   if(lore)fields.lore=[fields.lore,lore].filter(Boolean).join("\n\n");
 }
 if(obj.tool==="VelvetRuin Character Atelier"&&obj.project){
   Object.assign(fields,obj.project);
 }
 return {fields,unmapped:"",conflicts:[],sources:["Structured character JSON"]};
}
function distributeDialogues(fields){
 const src=String(fields.sampleChar1||"");
 const labels=[...src.matchAll(/(?:^|\n)\s*\{\{(user|char)\}\}:\s*/gim)];
 if(labels.length<2)return;
 delete fields.sampleChar1; // Delete the combined text before distributing pairs.
 const pairs=[];
 labels.forEach((found,i)=>{
  const text=src.slice(found.index+found[0].length,i+1<labels.length?labels[i+1].index:src.length).trim();
  if(found[1].toLowerCase()==="user")pairs.push({u:text,c:""});
  else if(pairs.length)pairs[pairs.length-1].c=text;
  else pairs.push({u:"",c:text});
 });
 pairs.slice(0,3).forEach((p,i)=>{if(p.u)fields["sampleUser"+(i+1)]=p.u;if(p.c)fields["sampleChar"+(i+1)]=p.c;});
}
function firstSentences(s,max=255){
 let t=String(s||"").replace(/\*+/g,"").replace(/\s+/g," ").replace(/^\{\{(?:user|char)\}\}:/i,"").trim();
 const sentences=(t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).map(x=>x.trim()).filter(x=>x.length>18);
 return sentences.slice(0,2).join(" ").slice(0,max).trim();
}
function analyze(input,{mode="tuned",format="text"}={}){
 if(input===null||input===undefined)throw Error("No character text supplied.");
 let parsed,source;
 if(typeof input==="string"){
  source=input;
  if(format==="json") {
    try{parsed=fromJson(JSON.parse(input));}catch(e){throw Error("Unable to parse JSON: "+e.message);}
  }else{
    parsed=fromText(input);
    if(!Object.keys(parsed.fields).length&&/^\s*\{/.test(input)){
      try{parsed=fromJson(JSON.parse(input));}catch{}
    }
  }
 }else{parsed=fromJson(input);source=JSON.stringify(input,null,2);}
 let fields={...parsed.fields};
 const notes=[],tips=[],originalValues={...fields},add=(key,v,why)=>{
  if(fields[key]!==undefined&&String(fields[key]).trim())return;
  if(!String(v||"").trim())return;
  fields[key]=cleanup(v,mode);notes.push({key,why});
 };
 for(const [k,v] of Object.entries(fields))if(typeof v==="string")fields[k]=cleanup(v,mode);
 // Recognize structured properties nested inside a long imported description.
 if(fields.personality) {
    const p=fromText(fields.personality);
    if(Object.keys(p.fields).length>=2){
      for(const [k,v] of Object.entries(p.fields))if(k!=="personality")add(k,v,"Recovered from a labeled part of the imported personality.");
      if(p.fields.personality||p.unmapped)fields.personality=[p.fields.personality,p.unmapped].filter(Boolean).join("\n\n");
    }
 }
 distributeDialogues(fields);
 if(!fields.name){
   const first=parsed.unmapped.split("\n").map(x=>x.trim()).find(Boolean);
   if(first&&/^[A-Z][\p{L}.'-]+(?:\s+[A-Z][\p{L}.'-]+){0,2}$/u.test(first)){
     add("name",first,"Inferred from a standalone heading; verify it.");
     tips.push("The character name was inferred from a heading. Check it.");
   }
 }
 add("title",fields.name,"Used the original character name as a starting storefront title.");
 if(!fields.hook){
   add("hook",firstSentences(fields.scenario||fields.customGreeting||fields.personality||parsed.unmapped),"Built a provisional public hook from existing facts; refine the stakes.");
   if(fields.hook)tips.push("The proposed hook is drawn from existing prose. Rewrite it as a sharp premise with stakes.");
 }
 if(!fields.scenario&&fields.customGreeting){
   add("scenario",firstSentences(fields.customGreeting,500),"Inferred a starting scene from the original greeting; confirm accuracy.");
 }
 // Do not fabricate behavior, memories, lore or pronouns.
 if(!fields.personality&&parsed.unmapped){
    add("personality",parsed.unmapped.slice(0,2600),"Unstructured prose retained for characterization; manually sort relevant facts.");
    tips.push("Your concept was not labeled. Review the proposed personality carefully.");
 }
 if(mode==="tuned"){
   if(fields.hook&&fields.hook.length>350){fields.hook=firstSentences(fields.hook,330);tips.push("Condensed long public copy; full source remains available to save.");}
   if(fields.title)fields.title=fields.title.split("\n")[0];
   if(fields.name)fields.name=fields.name.split("\n")[0];
   for(const k of ["personality","backstory","lore","anchors"]){
     if(!fields[k]||typeof fields[k]!=="string")continue;
     const seen=new Set();fields[k]=fields[k].split(/\n\s*\n/).filter(p=>{
      const norm=p.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,140);
      if(seen.has(norm))return false;seen.add(norm);return true;
     }).join("\n\n");
   }
 }
 if(fields.age){const m=String(fields.age).match(/\d{2,3}/);if(m)fields.age=m[0];}
 if(fields.gender){
    const x=String(fields.gender).toLowerCase();
    fields.gender=x.startsWith("m")?"Male":x.startsWith("f")?"Female":x.includes("non")?"Non-binary":"";
 }
 if(fields.rating)fields.rating=/limitless|nsfw|adult/i.test(fields.rating)?"Limitless":"Limited";
 if(!fields.name)tips.push("Name not confidently identified — set it manually.");
 if(fields.age&&Number(fields.age)<18)tips.unshift("Age appears under 18. Tipsy requires adult characters; the importer will not silently alter it.");
 if(!fields.voice)tips.push("No speech pattern identified. Show sentence length, humor and reactions to pressure.");
 if(!fields.userRole)tips.push("Define {{user}}'s starting role without deciding their feelings or actions.");
 if(!fields.customGreeting)tips.push("Add an opening scene with character dialogue and a playable decision.");
 if(!fields.sampleChar1)tips.push("Add 2–3 contrasting example dialogues to demonstrate voice.");
 const knownKeys=new Set(["title","name","age","gender","rating","hook","userRole","tease","trope","appearance","personality","contradiction","voice","mannerisms","occupation","surfaceGoal","hiddenGoal","backstory","anchors","sampleUser1","sampleChar1","sampleUser2","sampleChar2","sampleUser3","sampleChar3","setting","lore","scenario","relationship","supporting","canon","customGreeting","openingScene","openingAction","openingDialogue","openingBeat","tags","promptMode","replyLength"]);
 const review=Object.entries(fields).filter(([k,v])=>knownKeys.has(k)&&v!==undefined&&String(v).trim()).map(([key,value])=>({
   key,value,
   confidence:notes.some(x=>x.key===key)?"Suggestion":"Source",
   reason:notes.find(x=>x.key===key)?.why||"Recognized from source. Review the meaning and completeness."
 }));
 if(!review.length)throw Error("No usable character details were recognized. Paste the character's text or use a different export.");
 return {fields,review,tips,conflicts:parsed.conflicts,unmapped:parsed.unmapped,source,format,mode};
}
async function script(src,test){
 if(test())return;
 await new Promise((resolve,reject)=>{
  const el=document.createElement("script"),timer=setTimeout(()=>{el.remove();reject(Error("Reader failed to load. Try again online or paste the text."));},20000);
  el.src=src;el.async=true;el.onload=()=>{clearTimeout(timer);test()?resolve():reject(Error("Reader unavailable."));};
  el.onerror=()=>{clearTimeout(timer);reject(Error("Document reader could not load. Paste text or save as .txt instead."));};
  document.head.append(el);
 });
}
function decode(buffer){
 const b=new Uint8Array(buffer),decoder=t=>new TextDecoder(t).decode(b);
 if(b[0]===255&&b[1]===254)return new TextDecoder("utf-16le").decode(b.slice(2));
 if(b[0]===254&&b[1]===255){const a=b.slice(2);for(let i=0;i<a.length-1;i+=2){let p=a[i];a[i]=a[i+1];a[i+1]=p;}return new TextDecoder("utf-16le").decode(a);}
 return decoder("utf-8");
}
function rtf(source){
 return source.replace(/\\par[d]?\b|\\line\b/g,"\n")
 .replace(/\\u(-?\d+)\??/g,(_,n)=>String.fromCharCode((Number(n)+65536)%65536))
 .replace(/\\'([0-9a-f]{2})/gi,(_,code)=>new TextDecoder("windows-1252").decode(Uint8Array.of(parseInt(code,16))))
 .replace(/\{\\\*\\(?:fonttbl|colortbl|stylesheet|info)[^}]*\}/gi,"")
 .replace(/\\[a-zA-Z]+-?\d* ?/g,"")
 .replace(/\\[{}\\]/g,x=>x.slice(1)).replace(/[{}]/g,"");
}
async function extract(file){
 if(!file||!file.arrayBuffer)throw Error("Choose a file first.");
 if(file.size>12*1024*1024)throw Error("Please use a file smaller than 12 MB.");
 const ext=file.name.toLowerCase().split(".").pop(),buf=await file.arrayBuffer();
 if(["txt","md","markdown","json","yaml","yml","html","htm","rtf","text"].includes(ext)){
   let text=decode(buf);if(ext==="rtf")text=rtf(text);
   return {text,format:ext==="json"?"json":"text",filename:file.name,warnings:[]};
 }
 if(ext==="docx"){
   await script("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.13.0/mammoth.browser.min.js",()=>!!window.mammoth);
   const data=await window.mammoth.extractRawText({arrayBuffer:buf});
   if(!data.value.trim())throw Error("The Word file has no selectable text. Save it as .txt first.");
   return {text:data.value,format:"text",filename:file.name,warnings:(data.messages||[]).slice(0,2).map(x=>x.message)};
 }
 if(ext==="pdf"){
   await script("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",()=>!!window.pdfjsLib);
   window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
   const pdf=await window.pdfjsLib.getDocument({data:new Uint8Array(buf)}).promise;
   if(pdf.numPages>70)throw Error("This PDF is over 70 pages. Export the relevant character pages first.");
   const pages=[];
   for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i),content=await page.getTextContent();
    const line=content.items.map(x=>x.str+(x.hasEOL?"\n":" ")).join("").trim();
    if(line)pages.push(line);
   }
   if(!pages.length)throw Error("This PDF has no selectable text. Scanned pages must be converted to text first.");
   return {text:pages.join("\n\n"),format:"text",filename:file.name,warnings:["PDF text layout is approximate; review heading detection."]};
 }
 if(ext==="doc"){
    if(typeof window.AtelierLegacyDoc!=="function")throw Error("Legacy Word reader unavailable. Save as DOCX or TXT.");
    return {text:window.AtelierLegacyDoc(buf),format:"text",filename:file.name,warnings:["Legacy DOC extraction may miss unusual layout. Verify the text before applying."]};
 }
 if(file.type&&file.type.startsWith("text/"))return {text:decode(buf),format:"text",filename:file.name,warnings:[]};
 throw Error("Unsupported file. Use TXT, MD, JSON, DOCX, DOC, PDF, RTF, HTML or YAML, or paste the text.");
}
window.AtelierMigrator=Object.freeze({analyze,extract,parseSections,fromJson,fromText});
})();