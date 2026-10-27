/* VelvetRuin Fizzz Prompt Builder — numbered character import, guidance and field compilation.
  Local first; source never sent to this site; all editorial edits explicitly opt-in. */
(()=>{
"use strict";
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));

const tagsKnown=["Female","Male","Trans","Non-binary","Femboy","AnyPOV","MalePOV","FemPOV","SFW","NSFW","OC","Fictional","Game","Anime","Movies / TV","Books","MLM","WLW","Enemies to Lovers","Friends to Lovers","Love Interest","Harem","Reverse Harem","Polyamory","Multiple People","Dominant","Submissive","Switch","Villain","Hero","Yandere","Tsundere","Kuudere","Smut","Fluff","Angst","Comedy","Dead Dove","Horror","Drama","Slow Burn","Wholesome","Historical","Royalty","Sci-Fi","Magical","RPG","Scenario","Demi-Human","Monster Girl","Monster","Non-Human","Vampire","Elf","Werewolf","Demon","Angel","Dragon","Furry","Robot","Alien","Mafia","Military","Police","CEO / Boss","Teacher","Student","Doctor","Nurse","Maid","Butler","Knight","Assassin","Spy","Bodyguard","Idol","Rockstar","Model","Pirate"];
const TAG_LIMIT=10;
const defs={
profile:[
["title","Public Title","Short, recognizable romantic hook for the Fizzz discovery card.","text"],
["name","Character Chat Name","The name shown while chatting; do not add a full tagline.","text"],
["age","Character age","Use the established adult age. Never infer a new age.","text"],
["gender","Gender tag","Choose Fizzz's primary gender category.","select",["","Male","Female","Non-binary"]],
["pov","POV tag","Any POV accommodates player-defined gender and designation.","select",["Any POV","Female POV","Male POV"]],
["rating","Rating tag","Choose the supported Fizzz rating when you publish.","select",["Limited","Limitless"]],
["creationDate","Creation / scheduled publication date","Optional creator metadata, e.g. November 1, 2026.","text"],
["bio","Public Character Bio","Immediate draw first; recognizable trope, situation, player choice. Not instructions for the character model.","long"],
["warning","Optional content advisory","Brief, factual themes that readers may wish to know.","short"]],
core:[
["occupation","Identity & role","Who they are, what they do, social role and practical responsibilities.","short"],
["species","Species / supernatural identity","Secondary designation, biology and whether visible wolf is symbolic or literal.","short"],
["appearance","Appearance the text model must know","Distinct physical facts, consistent scars, tattoos, colors, clothing, scent.","large"],
["backstory","Causal background","Only history explaining present reactions, decisions and values.","large"],
["traits","Core personality · observable behavior","Behavioral patterns in public, private, conflict and affection.","large"],
["contradiction","Internal contradiction","Two conflicting truths that keep the character emotionally interesting.","short"],
["motivation","Character goals & lasting drive","What they pursue even when {{user}} is absent.","short"],
["relationship","Relationship with {{user}} · starting state","Establish the actual first-scene relationship, not a predetermined outcome.","large"],
["behavior","Growth & behavior under pressure","How they change as trust is earned; what must remain consistent.","large"],
["boundaries","Behavioral boundaries / agency rules","Protect player autonomy and maintain character agency without flattening tension.","large"],
["voice","Speaking style · last in the core","Voice, sentence length, humor, pacing, and what dialogue should avoid.","short"],
["coreRaw","Preserved Import Text / Verbatim Core Source","Unmapped original text and character-card personality appear here. If the rest of the Core fields were not recognized, this entire text remains visible in the compiled Core instead of being discarded.","large"]],
opening:[
["openingScene","Scene · location, time & atmosphere","Planning notes for the opening; do not duplicate inside a completed greeting.","short"],
["openingAction","What the character visibly does","Filmable actions, physical motion, and relationship cues.","short"],
["openingLine","One or two spoken lines","Memorable voice samples for Opening Film.","short"],
["openingBeat","Playable opening beat","An unresolved choice for {{user}}.","short"],
["initialRaw","Complete Initial Message","Use full original prose when imported; max 5,000 characters.","long"]]
};
const initial={};for(const arr of Object.values(defs))for(const [k] of arr)initial[k]="";
for(let n=1;n<=3;n++){initial["world"+n+"Title"]="";initial["world"+n+"Mode"]=n===1?"always":"keyword";initial["world"+n+"Keywords"]="";initial["world"+n+"Body"]="";}
initial.pov="Any POV";initial.rating="Limited";
let data={...initial},chosen=[],original="",originalName="",recommendations=[],sourceNotes=[];
const norm=x=>String(x||"").toLowerCase().replace(/[#*[\]_.:—–/()-]+/g," ").replace(/\s+/g," ").trim();
const str=x=>String(x??"").replace(/\r\n?/g,"\n");
const tagKey=x=>String(x||"").replace(/^#/,"").toLowerCase().replace(/[^a-z0-9]+/g,"");
const tagAliases=Object.freeze({anypov:"AnyPOV",malepov:"MalePOV",femalepov:"FemPOV",femalepointofview:"FemPOV",malepointofview:"MalePOV",boss:"CEO / Boss",mafiaromance:"Mafia",dominantalpha:"Dominant"});
function normalizeTags(raw){
 const parts=Array.isArray(raw)?raw:typeof raw==="string"?raw.split(/[,;\n]+/):[];
 const known=new Map(tagsKnown.map(t=>[tagKey(t),t])),valid=[];
 for(const entry of parts){const key=tagKey(entry),tag=tagAliases[key]||known.get(key);if(tag&&!valid.includes(tag))valid.push(tag);if(valid.length>=TAG_LIMIT)break;}
 return valid;
}
const limit=k=>k==="initialRaw"?5000:k.endsWith("Body")?10000:k==="coreRaw"?25000:null;
function normalizeIncomingFields(raw){
 const normalized={...initial};
 if(!raw||typeof raw!=="object")return normalized;
 for(const key of Object.keys(initial)){
  const value=raw[key];
  if(typeof value==="string")normalized[key]=value;
  else if(key==="age"&&typeof value==="number"&&Number.isFinite(value))normalized[key]=String(value);
  else if(key.endsWith("Keywords")&&Array.isArray(value))normalized[key]=value.filter(x=>typeof x==="string").join(", ");
 }
 return normalized;
}

const escape=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
function copy(t){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(t);const el=document.createElement("textarea");el.value=t;document.body.append(el);el.select();document.execCommand("copy");el.remove();return Promise.resolve();}
function download(name,text,type="text/plain"){const a=document.createElement("a"),u=URL.createObjectURL(new Blob([text],{type:type+";charset=utf-8"}));a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000);}
function notify(t){const x=$("#toast");x.textContent=t;x.style.display="block";clearTimeout(notify._timer);notify._timer=setTimeout(()=>x.style.display="none",3300);}
const BUILD_ID="14 · Import diagnostics";
function reportImportError(error,stage="Character import"){
 const message=error instanceof Error?error.message:String(error);
 const stack=error?.stack||"Stack trace unavailable.";
 mark(stage+" — "+message+" ("+BUILD_ID+")","error");
 let panel=document.getElementById("import-debug-details");
 if(!panel){
  panel=document.createElement("details");panel.id="import-debug-details";
  panel.innerHTML='<summary>Technical error details · copy for troubleshooting</summary><p>Only the error location is shown, not your character text.</p><textarea rows="7" readonly id="import-debug-text" style="width:100%;font-family:monospace"></textarea>';
  document.getElementById("import-status")?.insertAdjacentElement("afterend",panel);
 }
 if(panel){panel.querySelector("#import-debug-text").value=BUILD_ID+"\nStage: "+stage+"\nMessage: "+message+"\nStack: "+stack;panel.open=true;}
}
function mark(t,state=""){const x=$("#import-status");x.className="import-status "+state;x.textContent=t;}
function save(){window.FizzzSessionPrivacy?.edited?.();}
function readSaved(){/* Every new tab starts blank. Character drafts are memory-only. */}
function fieldRender(group){
 const parent=$("#fields-"+group);
 for(const [key,label,help,kind,options] of defs[group]){
  const box=document.createElement("div");box.className="field "+(kind==="text"||kind==="select"?"":"wide");
  const lab=document.createElement("label"),id="field-"+key;lab.htmlFor=id;lab.innerHTML="<span>"+escape(label)+"</span><small id='count-"+key+"'></small>";
  let inp;
  if(kind==="select"){inp=document.createElement("select");for(const v of options){const op=document.createElement("option");op.textContent=v;op.value=v;inp.append(op)}}
  else if(kind==="text"){inp=document.createElement("input");inp.type="text";}
  else{inp=document.createElement("textarea");inp.rows=kind==="long"?17:kind==="large"?9:4;inp.className=kind;}
  inp.id=id;inp.dataset.key=key;inp.value=data[key]||"";inp.autocomplete="off";inp.setAttribute("autocomplete","off");
  inp.addEventListener(kind==="select"?"change":"input",()=>{data[key]=inp.value;save();refresh()});
  const para=document.createElement("p");para.className="help";para.textContent=help;
  box.append(lab,inp,para);parent.append(box);
 }
}
function worldRender(){
 const dst=$("#world-cards");
 for(let i=1;i<=3;i++){
  const div=document.createElement("article");div.className="world-card";
  div.innerHTML='<h3>Worldbook '+i+'</h3><div class="world-meta"><span class="muted" id="world-note-'+i+'"></span><label class="file-trigger" for="world-file-'+i+'">⌁ Upload complete lore<input type="file" accept=".txt,.md,.markdown,.docx,.doc,.rtf" id="world-file-'+i+'" data-builder-world="'+i+'" hidden></label></div>';
  const grid=document.createElement("div");grid.className="field-group";
  const meta=[
  ["world"+i+"Title","Entry title","text"],
  ["world"+i+"Mode","Activation mode","select"],
  ["world"+i+"Keywords","Activation keywords · comma-separated","short"],
  ["world"+i+"Body","Complete Worldbook "+i+" lore · 10,000 max","large"]];
  for(const [key,label,kind] of meta){
   const wrap=document.createElement("div");wrap.className="field "+(kind==="short"||kind==="large"?"wide":"");
   const l=document.createElement("label"),id="field-"+key;l.htmlFor=id;l.innerHTML="<span>"+escape(label)+"</span><small id='count-"+key+"'></small>";
   const inp=kind==="text"?document.createElement("input"):kind==="select"?document.createElement("select"):document.createElement("textarea");
   if(inp.tagName==="INPUT")inp.type="text";
   if(inp.tagName==="TEXTAREA"){inp.rows=kind==="large"?12:2;inp.className=kind;}
   if(kind==="select")for(const v of ["always","keyword"]){const op=document.createElement("option");op.value=v;op.textContent=v==="always"?"Always Active":"Keyword Trigger";inp.append(op)}
   inp.id=id;inp.dataset.key=key;inp.value=data[key]||"";
   inp.addEventListener("input",()=>{data[key]=inp.value;save();refresh()});
   wrap.append(l,inp);grid.append(wrap);
  }
  div.append(grid);dst.append(div);
 }
}
function tagsRender(){
 const p=$("#tag-choices"),query=String($("#tag-search")?.value||"").trim().toLowerCase();
 p.replaceChildren();
 for(const t of tagsKnown){
  if(query&&!t.toLowerCase().includes(query))continue;
  const b=document.createElement("button");b.type="button";b.className="chip"+(chosen.includes(t)?" on":"");
  b.textContent=t;b.setAttribute("aria-pressed",chosen.includes(t)?"true":"false");
  b.addEventListener("click",()=>{
   if(chosen.includes(t))chosen=chosen.filter(x=>x!==t);
   else if(chosen.length<TAG_LIMIT)chosen.push(t);
   else{notify("You can select up to 10 Fizzz tags. Remove one to add another.");return;}
   tagsRender();save();refresh();
  });
  p.append(b);
 }
 const count=$("#tag-count");if(count)count.textContent=chosen.length+" / "+TAG_LIMIT+" selected";
 const selected=$("#tag-selected");if(selected)selected.textContent=chosen.length?"Selected: "+chosen.join(" · "):"No tags selected yet.";
 const empty=$("#tag-empty");if(empty)empty.hidden=!!p.childElementCount;
}
function coreCompiled(){
 const revised=window.VelvetRuinFizzzCompiler?.selectedText("core");if(revised!==null&&revised!==undefined)return revised;
 const order=[["Identity & Role",["occupation"]],["Species & Biology",["species"]],["Appearance",["appearance"]],["Causal Background",["backstory"]],["Core Personality & Observable Behavior",["traits"]],["Internal Contradiction",["contradiction"]],["Character Goals",["motivation"]],["Starting Relationship with {{user}}",["relationship"]],["Growth and Behavior under Pressure",["behavior"]],["Behavioral Boundaries",["boundaries"]],["Speaking Style",["voice"]]];
 const out=["# "+(data.name||"Character")+" — Character Settings"];
 if(data.age)out.push("Age: "+data.age);if(data.gender)out.push("Gender: "+data.gender);
 for(const [label,fields] of order){const v=fields.map(k=>str(data[k]).trim()).filter(Boolean).join("\n");if(v)out.push("\n## "+label+"\n"+v);}
 if(data.coreRaw?.trim()){
  const typed=["occupation","species","appearance","backstory","traits","contradiction","motivation","relationship","behavior","boundaries","voice"].filter(k=>data[k]?.trim()).length;
  if(typed<5)out.push("\n## PRESERVED SOURCE — REVIEW & SORT INTO FIZZZ FIELDS\n"+data.coreRaw.trim());
 }
 return out.join("\n").trim();
}
function openingCompiled(){
 const revised=window.VelvetRuinFizzzCompiler?.selectedText("opening");if(revised!==null&&revised!==undefined)return revised;
 if((data.initialRaw||"").trim())return data.initialRaw.trim();
 return [["openingScene",""],["openingAction",""],["openingLine",""],["openingBeat",""]].map(([k])=>str(data[k]||"").trim()).filter(Boolean).join("\n\n");
}
function sections(){
 const finalized=window.VelvetRuinFizzzCompiler?.selectedProfile();
 const out=[["PUBLIC TITLE",finalized?.title||data.title],["CHARACTER CHAT NAME",data.name],["AGE",data.age],["GENDER",data.gender],["POV",data.pov],["RATING",data.rating],["CREATION DATE",data.creationDate],["DISCOVERY TAGS",chosen.join(", ")],["PUBLIC BIO",finalized?.bio||data.bio],["CONTENT ADVISORY",data.warning],["CORE PERSONALITY",coreCompiled()],["INITIAL MESSAGE",openingCompiled()]];


 return out;
}
function counts(){
 const profile=["title","name","age","gender","pov","rating","bio","warning"].filter(k=>String(data[k]||"").trim()).length;
 const core=["occupation","species","appearance","backstory","traits","contradiction","motivation","relationship","behavior","boundaries","voice"].filter(k=>String(data[k]||"").trim()).length;
 const opening=openingCompiled().length?1:0,world=[1,2,3].filter(n=>String(data["world"+n+"Body"]||"").trim()).length;
 return {profile,core,opening,world};
}
function refresh(){
 $$("[data-key]").forEach(node=>{const k=node.dataset.key,l=$("#count-"+k);if(!l)return;const max=limit(k),count=(data[k]||"").length;const special=k==="voiceDesignPrompt";let n=special?str(data[k]).trim().split(/\s+/).filter(Boolean).length:count;l.textContent=(special?n+"/20 words":max?n.toLocaleString()+"/"+max.toLocaleString():n?n+" chars":"");l.className=(max&&count>max||special&&n>20)?"over":max&&count>0?"ok":"";});
 $("#core-preview").textContent=coreCompiled();$("#opening-preview").textContent=openingCompiled();
 $("#core-counter").textContent=coreCompiled().length.toLocaleString()+" / 25,000";
 $("#greeting-counter").textContent=openingCompiled().length.toLocaleString()+" / 5,000";
 $("#side-name").textContent=data.name||"Your character";$("#side-sub").textContent=data.title||"A character worth returning to.";
 $("#side-hook").textContent=(data.bio||"").replace(/[#*_]/g,"").split("\n").map(x=>x.trim()).find(x=>x.length>40)||"One recognizable romantic fantasy. One open door for {{user}}.";
 const n=counts();for(const [key,max] of [["profile",8],["core",11],["opening",1],["world",3]]){$("#metric-"+key).textContent=n[key]+"/"+max;$("#bar-"+key).style.width=Math.min(100,n[key]/max*100)+"%";}
 $("#aside-core").textContent=coreCompiled().length.toLocaleString()+" / 25k";
 $("#aside-opening").textContent=openingCompiled().length.toLocaleString()+" / 5k";
 $("#aside-world").textContent=[1,2,3].map(i=>(data["world"+i+"Body"]||"").length.toLocaleString()).join(" / ")+" chars";
 for(let i=1;i<=3;i++){const x=$("#world-note-"+i);x.textContent=data["world"+i+"Body"]?.trim()?data["world"+i+"Body"].length+" characters · full lore entered":"Outline/settings only · full lore missing";}
}
function rerender(){ $$("[data-key]").forEach(el=>el.value=data[el.dataset.key]||"");tagsRender();refresh();document.dispatchEvent(new CustomEvent("fizzz:field-data-changed"));}
function showTab(tab){$$(".tab").forEach(b=>{b.classList.toggle("active",b.dataset.tab===tab);b.setAttribute("aria-selected",b.dataset.tab===tab)});$$(".panel").forEach(p=>p.hidden=p.id!=="panel-"+tab);if(tab==="output"){analyse();renderOutput();}if(window.innerWidth<900)document.querySelector(".tabs").scrollIntoView({block:"start",behavior:"smooth"});}
function stripMd(s){return str(s).replace(/\*\*/g,"").replace(/^#+\s?/gm,"").trim();}
function dataFromNumbered(source){
 const text=str(source).replace(/\u00a0/g," ");
 // Word/DOCX extraction often removes Markdown heading marks (##). Numbered
 // labels may also be Word automatic numbering and disappear entirely.
 // Accept only KNOWN section labels, never numbered steps from source lore.
 const headingNames={
  1:["Public Title"],2:["Character Chat Name"],3:["Character Age / Age Range","Character Age","Age / Age Range"],
  4:["Gender Tag"],5:["POV Tag"],6:["Rating Tag"],
  7:["Character Bio · Public","Character Bio - Public","Character Bio Public","Public Character Bio","Public Bio"],
  8:["Optional Content Advisory","Content Advisory"],
  9:["Identity & Role","Identity and Role"],10:["Species / Supernatural Identity","Species and Supernatural Identity","Species & Biology"],
  11:["Appearance the Text Model Must Know","Appearance Text Model Must Know","Appearance"],
  12:["Causal Background","Background"],
  13:["Core Personality · Observable Behavior","Core Personality Observable Behavior","Observable Personality"],
  14:["Internal Contradiction"],15:["Character Goals & Lasting Drive","Character Goals and Lasting Drive"],
  16:["Relationship with {{user}} · Starting State","Relationship with {{user}} Starting State","Relationship with User Starting State"],
  17:["Growth & Behavior Under Pressure","Growth and Behavior Under Pressure"],
  18:["Behavioral Boundaries / Agency Rules","Behavioral Boundaries Agency Rules"],
  19:["Speaking Style · Last in the Core","Speaking Style Last in the Core","Speaking Style"],
  20:["Optional Verbatim Core Personality · Preserved Source","Optional Verbatim Core Personality Preserved Source"],
  21:["Complete Initial Message · Recommended","Complete Initial Message Recommended","Complete Initial Message"]
 };
 const normalizeHeading=x=>String(x).toLowerCase().replace(/\*+/g,"").replace(/\{\{user\}\}/gi,"user").replace(/[^\p{L}\p{N}]+/gu," ").trim().replace(/\s+/g," ");
 const lines=text.split("\n"),h=[];
 let cursor=0;
 for(const line of lines){
  const at=cursor;cursor+=line.length+1;
  let heading=line.trim().replace(/^#{1,6}\s*/,"").replace(/^\*\*(.*?)\*\*$/,"$1").trim();
  const num=heading.match(/^(\d{1,2})\s*[.)·:—–-]\s*(.+)$/u);
  const n=num?Number(num[1]):null,label=(num?num[2]:heading).replace(/\*+$/,"").trim(),id=normalizeHeading(label);
  const matches=Object.entries(headingNames).filter(([index,aliases])=>(n===null||Number(index)===n)&&aliases.some(a=>normalizeHeading(a)===id));
  if(matches.length===1)h.push({index:at,0:line,1:Number(matches[0][0]),2:label});
 }
 if(h.length<10||!h.some(x=>x[1]===7)||!h.some(x=>x[1]===21))return null;
 const config=text.search(/^(?:#{1,6}\s*)?(?:[\p{L}\p{N} '\-]+\s*[—–-]\s*)?WORLDBOOK CONFIGURATION\s*$/imu),sec={};
 for(let i=0;i<h.length;i++){let end=i+1<h.length?h[i+1].index:text.length;if(+h[i][1]===21&&config>=0)end=Math.min(end,config);const val=text.slice(h[i].index+h[i][0].length,end).trim();if(!sec[h[i][1]])sec[h[i][1]]=val;}
 const d={...initial},messages=[];
 d.title=sec[1]||"";d.name=sec[2]||"";
 d.age=(sec[3]||"").match(/\*\*Age:\*\*\s*(\d{2,3})/i)?.[1]||(sec[3]||"").match(/\b(\d{2,3})\b/)?.[1]||"";
 d.gender=/\bMale\b/i.test(sec[4]||"")?"Male":/\bFemale\b/i.test(sec[4]||"")?"Female":"";
 d.pov=/AnyPOV|Any POV/i.test(sec[5]||"")?"Any POV":/Female POV/i.test(sec[5]||"")?"Female POV":/Male POV/i.test(sec[5]||"")?"Male POV":"Any POV";
 d.rating=/Mature|18\+|Limitless/i.test(sec[6]||"")?"Limitless":"Limited";
 d.bio=sec[7]||"";d.warning=sec[8]||"";
 const map={9:"occupation",10:"species",11:"appearance",12:"backstory",13:"traits",14:"contradiction",15:"motivation",16:"relationship",17:"behavior",18:"boundaries",19:"voice",20:"coreRaw"};
 for(const [i,k] of Object.entries(map))d[k]=sec[i]||"";
 d.creationDate=sec[7]?.match(/CREATION DATE:\*{0,2}\s*(November\s+\d{1,2},\s+\d{4}|\d{4}-\d{2}-\d{2})/i)?.[1]||"";
 if(sec[21]){
  const lines=sec[21].split("\n");
  const labels=["Scene · Location, Time & Atmosphere","What the Character Visibly Does","One or Two Spoken Lines","Playable Opening Beat"];
  const keys=["openingScene","openingAction","openingLine","openingBeat"];
  const simplified=x=>String(x).replace(/^#{1,6}\s*/,"").replace(/^\*\*(.*?)\*\*$/,"$1").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();
  const indexes=labels.map(label=>lines.findIndex(line=>simplified(line)===simplified(label)));
  // Word extracts text but not the original ### formatting. Locate the
  // opening planner by its actual four headings, not the Markdown prefix.
  if(indexes[3]>=0){
   let proseStart=-1;
   for(let j=indexes[3]+1;j<lines.length;j++){
    const line=lines[j].trim();
    if(!line||/^[-*•]\s+/.test(line)||/^#{1,6}\s+/.test(line))continue;
    proseStart=j;break;
   }
   for(let j=0;j<4;j++){
    const a=indexes[j],b=j<3?indexes[j+1]:(proseStart<0?lines.length:proseStart);
    if(a>=0&&b>a)d[keys[j]]=lines.slice(a+1,b).join("\n").trim();
   }
   if(proseStart>=0)d.initialRaw=lines.slice(proseStart).join("\n").trim();
   else {
    d.initialRaw="";
    messages.push("Section 21 contains opening notes but no distinguishable complete scene. Write or import the actual greeting; do not mistake the planner for finished prose.");
   }
  }else{
   d.initialRaw=sec[21];
   messages.push("No four-part opening planner detected; the complete Section 21 text was retained as the initial message for review.");
  }
 }
 if(config>=0){
  const chunk=text.slice(config),wb=[...chunk.matchAll(/^(?:#{1,6}\s*)?Worldbook\s+([1-3])\s*[—–-]\s*(.+)\s*$/gim)];
  for(let i=0;i<wb.length;i++){
   const n=+wb[i][1],body=chunk.slice(wb[i].index+wb[i][0].length,i+1<wb.length?wb[i+1].index:chunk.length);
   d["world"+n+"Title"]=wb[i][2].trim();
   d["world"+n+"Mode"]=/\*\*Activation:\*\*\s*Always Active/i.test(body)?"always":"keyword";
   const m=body.match(/\*\*Keywords:\*\*\s*([^\n]*)\n?([^\n]*)/i);
   const inline=(m?.[1]||"").trim(),kw=inline||m?.[2]||"";
   if(!/none required/i.test(kw))d["world"+n+"Keywords"]=kw.trim();
  }
  messages.push("This file contains Worldbook 1–3 configuration and summaries, not the complete three lore bodies. Import the complete entries separately.");
 }
 const incoming=(d.bio.match(/#[A-Za-z][A-Za-z0-9]+/g)||[]).map(x=>x.slice(1));
 const tags=normalizeTags(incoming);
 return {fields:d,tags,messages,kind:"Full 21-section Fizzz character"};
}
/* Parse the field-by-field TXT/Markdown output of THIS creator before
   handing anything to a generic parser that might mistake PUBLIC TITLE
   for a proper character name. This makes our own exports reversible. */
function parseExportedFields(source){
 const txt=str(source).replace(/^\uFEFF/,"");
 const d={...initial},tags=[],notes=[],parts=[],recognized=new Set();
 const names={
  "PUBLIC TITLE":"title","CHARACTER CHAT NAME":"name",
  "AGE":"age","CHARACTER AGE":"age","GENDER":"gender",
  "POV":"pov","RATING":"rating","CREATION DATE":"creationDate",
  "DISCOVERY TAGS":"tags","PUBLIC BIO":"bio","CONTENT ADVISORY":"warning",
  "CORE PERSONALITY":"coreRaw","INITIAL MESSAGE":"initialRaw",
  "COVER DIRECTIONS":"coverDirection","CHARACTER IMAGE DIRECTIONS":"imageDirection",
  "OPENING FILM DIRECTIONS":"videoDirection","VOICE DIRECTIONS":"voiceDirection",
  "VOICE DESIGN PROMPT":"voiceDesignPrompt"
 };
 const heading=line=>{
  const clean=line.trim().replace(/^#{1,3}\s*/,"").replace(/^\*\*(.*?)\*\*$/,"$1").replace(/:$/,"").trim();
  const upper=clean.toUpperCase().replace(/\s+/g," ");
  if(names[upper])return {key:names[upper],label:clean};
  const match=clean.match(/^Worldbook\s+([1-3])(?:\s*[—–:-]\s*(.+))?$/i);
  return match?{key:"world"+match[1],number:Number(match[1]),label:match[2]||"Worldbook "+match[1]}:null;
 };
 let active=null,chunk=[];
 const emit=()=>{if(active){parts.push({heading:active,value:chunk.join("\n").trim()});chunk=[];}};
 for(const line of txt.split("\n")){
  if(/^\s*[═━─=]{12,}\s*$/.test(line))continue;
  const h=heading(line);
  if(h){emit();active=h;recognized.add(h.key);}
  else if(active)chunk.push(line);
 }
 emit();
 if(recognized.size<4||!parts.some(x=>["bio","coreRaw","initialRaw"].includes(x.heading.key)))return null;
 let countBooks=0;
 const coreNames={
  "Identity & Role":"occupation","Species & Biology":"species",
  "Appearance":"appearance","Causal Background":"backstory",
  "Core Personality & Observable Behavior":"traits","Core Personality & Behavior":"traits",
  "Observable Personality":"traits","Internal Contradiction":"contradiction",
  "Character Goals":"motivation","Goals & Lasting Drive":"motivation",
  "Starting Relationship with {{user}}":"relationship","Relationship With {{user}}":"relationship",
  "Growth and Behavior under Pressure":"behavior","Growth & Pressure":"behavior",
  "Behavioral Boundaries":"boundaries","Agency & Boundaries":"boundaries",
  "Player Agency & Boundaries":"boundaries","Speaking Style":"voice"
 };
 const norm=x=>String(x).toLowerCase().replace(/\s+/g," ").trim();
 const normalized=Object.fromEntries(Object.entries(coreNames).map(([k,v])=>[norm(k),v]));
 for(const {heading:h,value} of parts){
  if(h.key==="tags"){tags.push(...value.split(/[,;\n]+/).map(x=>x.trim().replace(/^#/,"")).filter(Boolean));continue;}
  if(h.number){
   const n=h.number,p="world"+n;countBooks++;d[p+"Title"]=h.label;
   const lines=value.split("\n");
   const activationIndex=lines.findIndex(x=>/^\s*Activation\s*:/i.test(x.replace(/\*/g,"")));
   const keywordsIndex=lines.findIndex(x=>/^\s*Keywords\s*:/i.test(x.replace(/\*/g,"")));
   const activation=activationIndex>=0?lines[activationIndex].replace(/\*/g,""):"";
   const keys=keywordsIndex>=0?lines[keywordsIndex].replace(/\*/g,""):"";
   d[p+"Mode"]= /always active|:\s*always/i.test(activation)?"always":"keyword";
   let parsedKeys=keys.replace(/^\s*Keywords\s*:\s*/i,"").trim();
   const continuation=keywordsIndex>=0&&!parsedKeys&&lines[keywordsIndex+1]?.trim()?keywordsIndex+1:-1;
   if(continuation>=0)parsedKeys=lines[continuation].trim();
   d[p+"Keywords"]= /^(none|none required|n\/a)$/i.test(parsedKeys)?"":parsedKeys;
   const lore=lines.filter((line,i)=>i!==activationIndex&&i!==keywordsIndex&&i!==continuation).join("\n").trim();
   if(lore&&!/^\[(?:Missing full lore|No full lore imported|Outline only|Full source lore missing)/i.test(lore))d[p+"Body"]=lore;
   continue;
  }
  if(h.key==="coreRaw"){
   d.coreRaw=value;
   let section=null,acc=[];
   const finish=()=>{const v=acc.join("\n").trim();if(section&&v&&!d[section])d[section]=v;acc=[];};
   for(const line of value.split("\n")){
    const m=line.trim().match(/^#{2,4}\s+(.+)$/);
    const newSection=m&&normalized[norm(m[1])];
    if(newSection){finish();section=newSection;continue;}
    if(section)acc.push(line);
   }
   finish();
   continue;
  }
  if(h.key==="pov")d.pov=/female/i.test(value)?"Female POV":/male/i.test(value)?"Male POV":"Any POV";
  else if(h.key==="rating")d.rating=/limitless/i.test(value)?"Limitless":"Limited";
  else if(h.key==="gender")d.gender=/^male$/i.test(value)?"Male":/^female$/i.test(value)?"Female":/^non.?binary$/i.test(value)?"Non-binary":"";
  else if(["title","name"].includes(h.key)){const v=value.trim();d[h.key]=names[v.toUpperCase()]?"":v;}
  else d[h.key]=value;
 }
 if(/^PUBLIC TITLE$/i.test(d.name))d.name="";
 const mapped=["occupation","species","appearance","backstory","traits","contradiction","motivation","relationship","behavior","boundaries","voice"].filter(x=>d[x]).length;
 notes.push("Parsed "+recognized.size+" known Fizzz publishing fields from an exported TXT/Markdown manuscript, with "+countBooks+" Worldbook entries.");
 if(d.coreRaw&&mapped<5)notes.push("Compiled Core preserved verbatim. Some details remain in Preserved Import Text because the source did not label its subfields.");
 if(!d.name)notes.push("No chat name was found in the exported manuscript; a heading was not mistaken for the name.");
 return {fields:d,tags,messages:notes,kind:"Native Fizzz publishing-field manuscript"};
}
function parseGeneric(source,ext){
 const raw=str(source),d={...initial},messages=[];
 const normalizeChoice=x=>String(x||"").trim();
 const cleanCore=x=>String(x||"").trim();
 let tags=[];
 if(ext==="json"||raw.trim().startsWith("{")){
  let obj;try{obj=JSON.parse(raw);}catch(e){throw Error("Character JSON could not be read: "+e.message)}
  if(obj?.builder==="VelvetRuin Fizzz Prompt Builder"&&obj.data)
   return {fields:{...initial,...obj.data},tags:obj.tags||[],compiler_draft:obj.compiler_draft||null,messages:["Imported project into this tab only; no browser autosave."],kind:"Existing Fizzz creator project"};
  if(obj?.tool==="VelvetRuin Fizzz Atelier"&&obj.project)
   return {fields:{...initial,...obj.project},tags:obj.project.tags||[],messages:["Imported complete Fizzz Atelier project."],kind:"Fizzz Atelier project"};
  if(obj?.atelier_project?.project)
   return {fields:{...initial,...obj.atelier_project.project},tags:obj.atelier_project.project.tags||[],messages:["Imported saved Atelier project."],kind:"Fizzz Atelier backup"};
  // Portable V2 character cards contain the entire core in description.
  if(obj?.spec==="chara_card_v2"&&obj.data){
   const card=obj.data,meta=card.extensions?.fizzz||{};
   Object.assign(d,{
    title:meta.title||card.name||"",name:card.name||meta.chat_name||"",
    age:String(meta.age||""),gender:meta.gender||"",pov:meta.pov||"Any POV",
    rating:meta.rating||"Limited",bio:meta.bio||card.creator_notes||"",
    initialRaw:card.first_mes||"",coreRaw:card.description||card.personality||"",
    creationDate:meta.creation_date||meta.created||""
   });
   tags=Array.isArray(card.tags)?card.tags:[];
   (card.character_book?.entries||[]).filter(item=>item&&item.content).slice(0,3).forEach((item,i)=>{
    const n=i+1;d["world"+n+"Title"]=item.name||"Worldbook "+n;
    d["world"+n+"Body"]=item.content;
    d["world"+n+"Mode"]=item.constant?"always":"keyword";
    d["world"+n+"Keywords"]=(item.keys||[]).join(", ");
   });
   return {fields:d,tags,messages:["Portable character card imported. Original Core Personality is preserved verbatim and visible under Core Personality > Preserved Source."],kind:"Character Card V2"};
  }
  // Re-import both previous JSON export variants, retaining the entire core.
  if(["VelvetRuin Fizzz field package","Fizzz Publishing Fields","VelvetRuin Fizzz Publishing Fields"].includes(obj?.format)||obj?.schema==="VelvetRuin Fizzz compilation"){
   const p=obj.profile||{};
   Object.assign(d,{
    title:p.public_title||p.title||"",name:p.chat_name||p.name||"",
    age:String(p.age||""),gender:p.gender||"",pov:p.pov||"Any POV",
    rating:p.rating||"Limited",bio:p.bio||"",warning:p.content_advisory||p.warning||"",
    creationDate:p.creation_date||p.created||obj.creation_date||"",
    initialRaw:obj.initial_message||"",coreRaw:obj.core_personality||""
   });
   (obj.worldbooks||[]).slice(0,3).forEach((book,i)=>{
    const n=book.number||i+1;if(n<1||n>3)return;
    d["world"+n+"Title"]=book.title||"";
    d["world"+n+"Mode"]=book.activation||book.mode||"keyword";
    d["world"+n+"Keywords"]=Array.isArray(book.keywords)?book.keywords.join(", "):book.keywords||"";
    d["world"+n+"Body"]=book.content||"";
   });
   tags=p.discovery_tags||p.tags||[];
   return {fields:d,tags,messages:["Complete Fizzz publishing package imported. Core Personality is preserved verbatim under Preserved Source and in compiled output."],kind:"Fizzz field package"};
  }
  const sourceObj=obj.fields||obj.character||obj.data||obj;
  for(const key of Object.keys(initial)){
   if(typeof sourceObj[key]==="string")d[key]=sourceObj[key];
  }
  const map={description:"bio",public_description:"bio",char_name:"name",chat_name:"name",first_mes:"initialRaw",firstMessage:"initialRaw",initial_message:"initialRaw",greeting:"initialRaw",personality:"coreRaw",scenario:"relationship",system_prompt:"boundaries"};
  for(const [key,to] of Object.entries(map))if(!d[to]&&typeof sourceObj[key]==="string")d[to]=sourceObj[key];
  if(!d.coreRaw&&typeof sourceObj.character_definition==="string")d.coreRaw=sourceObj.character_definition;
  if(!d.name&&typeof obj.name==="string")d.name=obj.name;
  tags=Array.isArray(sourceObj.tags)?sourceObj.tags:[];
  messages.push("Imported general character JSON. Original personality text is retained under Core > Preserved Source; review placement and mapping.");
  return {fields:d,tags,messages,kind:"General character JSON"};
 }
 // Generic rich-text and unnumbered templates (including Word text) can still
 // contain recognizable named fields. Use the already loaded document parser.
 const parsed=window.AtelierMigrator?.fromText?.(raw)||{fields:{},unmapped:raw};
 const p=parsed.fields||{};
 const mapping={
  title:"title",name:"name",age:"age",gender:"gender",rating:"rating",
  hook:"bio",userRole:"relationship",scenario:"relationship",
  appearance:"appearance",personality:"traits",contradiction:"contradiction",
  voice:"voice",occupation:"occupation",backstory:"backstory",
  anchors:"boundaries",surfaceGoal:"motivation",hiddenGoal:"motivation",
  customGreeting:"initialRaw",openingScene:"openingScene",openingAction:"openingAction",
  openingDialogue:"openingLine",openingBeat:"openingBeat",lore:"world1Body"
 };
 for(const [old,newKey] of Object.entries(mapping)){
  const text=typeof p[old]==="string"?p[old].trim():"";
  if(!text)continue;
  if(d[newKey]){if(["traits","backstory","motivation","relationship","boundaries"].includes(newKey))d[newKey]+="\n\n"+text;}
  else d[newKey]=text;
 }
 if(p.name&&!d.name)d.name=p.name;
 if(p.age&&!d.age)d.age=p.age;
 if(d.gender){if(/^male$/i.test(d.gender))d.gender="Male";else if(/^female$/i.test(d.gender))d.gender="Female";}
 if(d.rating&&!["Limited","Limitless"].includes(d.rating))d.rating="Limited";
 if(!d.name){
  const first=raw.split("\n").map(x=>x.trim()).find(x=>x.length>1&&x.length<100);
  const heading=first?.replace(/^#{1,6}\s*/,"").replace(/\*\*/g,"").split(/\s+[|—–]\s+/)[0].trim()||"";
  if(/^[A-Z][\p{L}.'-]+(?:\s+[A-Z][\p{L}.'-]+){1,2}$/u.test(heading))d.name=heading;
 }
 // Import cannot just silently leave a 28k-character character file in a
 // hidden coreRaw slot. Preserve and surface ALL content if few fields mapped.
 const meaningful=["name","bio","traits","appearance","backstory","relationship","initialRaw","occupation","boundaries","voice"].filter(k=>d[k]);
 const residual=(parsed.unmapped||"").trim();
 if(residual&&residual!==d.traits&&residual!==d.coreRaw)d.coreRaw=residual;
 if(meaningful.length<3){
  d.coreRaw=raw.trim();
  messages.push("WARNING: This file did not contain enough recognized Fizzz field headings. All extracted text has been preserved under Core > Preserved Source, NOT discarded. It still needs field placement.");
 }else{
  messages.push("Recognized "+meaningful.length+" meaningful fields from a non-numbered document. Unclassified original text is preserved under Core > Preserved Source where available.");
 }
 return {fields:d,tags,messages,kind:meaningful.length<3?"Partially recognized character document":"Mapped general character document"};
}
function displayExtractedSource(name,raw,warnings=[]){
 let details=document.getElementById("extracted-source-preview");
 if(!details){
  details=document.createElement("details");
  details.id="extracted-source-preview";details.className="import-source-preview";
  details.innerHTML='<summary>View what the uploader actually read from your file</summary><p id="extracted-source-info"></p><textarea id="extracted-source-text" readonly rows="12" style="width:100%;min-height:160px"></textarea>';
  document.getElementById("import-status")?.insertAdjacentElement("afterend",details);
 }
 details.querySelector("#extracted-source-info").textContent=name+" · "+raw.length.toLocaleString()+" characters extracted. "+(warnings||[]).join(" ");
 details.querySelector("#extracted-source-text").value=raw;
}
function worldbookNotice(msg){
 const n=$("#worldbooks-import-status");if(n)n.textContent=msg;
}
function importBookEntries(entries,{label="Worldbook source",ask=true}={}){
 const input=window.FizzzWorldbookSource?.fields(entries)||{};
 const applied=[];
 if(!Object.keys(input).length)throw Error("No recognized Worldbook titles, activation settings, keywords or full lore found.");
 const changing=[1,2,3].filter(n=>{
  const p="world"+n;
  return ["Title","Mode","Keywords","Body"].some(s=>Object.hasOwn(input,p+s)&&String(input[p+s]||"")!==String(data[p+s]||"")&&String(data[p+s]||"").trim());
 });
 if(ask&&changing.length&&typeof confirm==="function"&&!confirm("This will update Worldbook "+changing.join(", ")+" in the CURRENT character. Download a Builder Backup first to preserve existing lore. Continue?"))return false;
 for(const [k,value] of Object.entries(input)){
  if(!Object.hasOwn(initial,k)||typeof value!=="string")continue;
  if(k.endsWith("Body")&&value.length>10000)throw Error(k+" is over Fizzz's 10,000-character limit. No lore was imported.");
 }
 for(const [k,value] of Object.entries(input)){if(!Object.hasOwn(initial,k))continue;data[k]=value;applied.push(k);}
 save();rerender();
 const populated=[1,2,3].filter(n=>String(data["world"+n+"Body"]||"").trim()).length;
 const summary=label+": "+[1,2,3].filter(n=>applied.some(k=>k.startsWith("world"+n))).map(n=>"Worldbook "+n).join(", ")+" imported as SEPARATE slots. "+populated+"/3 full lore bodies present.";
 worldbookNotice(summary);notify(summary);return true;
}
function downloadBookBundle(){
 const api=window.FizzzWorldbookSource;
 if(!api)throw Error("Worldbook source tools haven't loaded. Refresh the builder.");
 download(filename()+"-three-worldbooks-backup.json",JSON.stringify(api.bundle(data,data.name),null,2),"application/json");
 worldbookNotice("Three-Worldbook backup downloaded. This file restores lore into the builder, NOT into the character card.");
}
async function loadWorldbookBundle(file){
 if(!file)return;
 if(file.size>12*1024*1024)throw Error("Worldbook source file exceeds 12 MB.");
 const read=window.AtelierMigrator?.extract;
 const extracted=read?await read(file):{text:await file.text()};
 const parsed=window.FizzzWorldbookSource?.extract(extracted?.text||"");
 if(!parsed?.entries?.length)throw Error("No separate Worldbooks found. Import a Builder Backup JSON, three-Worldbook JSON bundle, or text with 'Worldbook 1 — Title' / <character_lore: ...> headings.");
 importBookEntries(parsed.entries,{label:file.name});
}
function mergeParsed(parsed,name,source){
 const originalSource=String(source||""),incoming=parsed.fields||{},weak=parsed.kind==="Partially recognized character document";
 const strongKeys=["name","title","bio","traits","appearance","backstory","relationship","initialRaw","occupation","boundaries","coreRaw"];
 const existingStrong=strongKeys.filter(k=>String(data[k]||"").trim()).length;
 const arrivingStrong=strongKeys.filter(k=>String(incoming[k]||"").trim()).length;
 // A partially mapped document must not silently erase a much richer draft.
 if(weak&&existingStrong>=3&&arrivingStrong<3){
  mark("This file's text was extracted but fewer than 3 meaningful fields were recognized. Your existing draft was NOT replaced. Read the extracted source preview or revise the file headings and try again.","error");
  return;
 }
 /* Import history is not persisted. Export a backup explicitly before replacing an active draft. */
 const oldName=String(data.name||"").trim().toLowerCase(),newName=String(incoming.name||"").trim().toLowerCase();
 const sameCharacter=Boolean(oldName&&newName&&oldName===newName);
 // Importing a character-only package must not erase its three already-edited
 // Worldbooks. Never carry lore to a DIFFERENT character.
 if(sameCharacter&&["Native Fizzz publishing-field manuscript","Character Card V2","Fizzz field package","Full 21-section Fizzz character"].includes(parsed.kind)){
  let preserved=0;
  for(let n=1;n<=3;n++)for(const part of ["Title","Mode","Keywords","Body"]){
   const k="world"+n+part;
   if((incoming[k]===undefined||incoming[k]===null||incoming[k]==="")&&String(data[k]||"").trim()){incoming[k]=data[k];preserved++;}
  }
  if(preserved)parsed.messages=[...(parsed.messages||[]),"Retained "+preserved+" existing Worldbook fields for the same character; this source did not contain replacements."];
 }
 data=normalizeIncomingFields(incoming);chosen=normalizeTags(parsed.tags);
 original=originalSource;originalName=name;sourceNotes=parsed.messages||[];recommendations=[];rerender();save();
 window.VelvetRuinFizzzCompiler?.restoreSnapshot?.(parsed.compiler_draft||null);
 const populated=Object.entries(incoming).filter(([k,v])=>typeof v==="string"&&v.trim());
 const missing=populated.filter(([k,v])=>{const input=document.getElementById("field-"+k);return input&&input.value!==v;});
 if(missing.length){mark("Import incomplete: "+missing.length+" populated fields did not appear in the editor ("+missing.map(([k])=>k).join(", ")+"). The original file remains available; do not publish this draft.", "error");return;}
 const warning=weak||parsed.kind==="General character JSON"||parsed.kind==="Partially recognized character document";
 mark((warning?"⚠ Partial mapping — ":"✓ ")+parsed.kind+": "+populated.length+" populated values displayed. "+(sourceNotes.length?sourceNotes.join(" "):"All recognized content preserved.")+" "+(warning?"Open Core > Preserved Import Text for unsorted material; review before compiling.":"Review the panels, then compile."),warning?"error":"success");
 showTab("profile");
 try{buildSuggestions();}catch(err){reportImportError(err,"Post-import recommendations");}
}
async function loadFile(file,forWorld=null){
 let phase="File validation";
 try{
 if(!file)return;
 if(file.size>12*1024*1024)throw Error("File is larger than 12 MB.");
 const ext=(file.name.split(".").pop()||"txt").toLowerCase();
 let content="",readerWarnings=[];
 const api=window.AtelierMigrator;
 if(api?.extract){
  phase="Document text extraction";
  const extracted=await api.extract(file);
  content=str(extracted?.text||"");
  readerWarnings=extracted?.warnings||[];
 }else if(["txt","md","markdown","json"].includes(ext)){
  phase="Reading text file";
  content=await file.text();
 }else throw Error("The document reader failed to initialize. Reload the page; DOCX, DOC, PDF, RTF, and PNG imports need the reader.");
 phase="Checking extracted text";
 if(!content.trim())throw Error("No usable text extracted from this file. It has not replaced your current character.");
 phase="Displaying extracted source preview";
 if(!forWorld)displayExtractedSource(file.name,content,readerWarnings);
 phase=forWorld?"Updating individual Worldbook":"Identifying character document fields";
 if(forWorld){
  if(content.length>10000)throw Error("Worldbook "+forWorld+" exceeds 10,000 characters. No data was replaced.");
  const key="world"+forWorld+"Body";
  if(data[key]?.trim()&&!confirm("Replace the existing Worldbook "+forWorld+" body? Export your backup first if needed."))return;
  data[key]=content.trim();rerender();save();notify("Worldbook "+forWorld+" imported ("+content.length+" characters).");
  return;
 }
 const world=window.FizzzWorldbookSource?.extract(content)||{entries:[]};
 const published=parseExportedFields(content);
 const structured=published?null:dataFromNumbered(content);
 const containsCore=Boolean(published||structured||/^(?:#{0,4}\s*)?(?:name|character name|character chat name|public title|public bio|core personality|initial message|greeting|scenario)\s*:/im.test(content));
 const jsonMeta=(()=>{try{return JSON.parse(content)}catch{return null}})();
 const isBundle=jsonMeta?.format==="VelvetRuin Fizzz Worldbook Bundle";
 const isCharacterJSON=Boolean(jsonMeta?.builder||jsonMeta?.spec||jsonMeta?.profile||jsonMeta?.character?.name||jsonMeta?.data?.name||jsonMeta?.name||jsonMeta?.initial_message||jsonMeta?.core_personality);
 if(world.entries.length&&(isBundle||(!containsCore&&!isCharacterJSON&&world.entries.some(x=>x.content)))){
  const done=importBookEntries(world.entries,{label:file.name});
  if(done){mark("✓ Imported "+world.entries.length+" separate Worldbooks from "+file.name+"; the existing character was preserved.","success");showTab("world");}
  return;
 }
 const parsed=published||structured||parseGeneric(content,ext);
 if(world.entries.length){
  const mapped=window.FizzzWorldbookSource.fields(world.entries);
  // Complete separately identified lore takes precedence over a summary, but
  // missing source bodies NEVER overwrite full lore.
  for(const [key,value] of Object.entries(mapped)){
   if(key.endsWith("Body")&&value)parsed.fields[key]=value;
   else if(!String(parsed.fields[key]||"").trim()&&value)parsed.fields[key]=value;
  }
  parsed.messages=[...(parsed.messages||[]),"Worldbook source detected: "+world.entries.map(x=>x.number).join(", ")+". Distinct entries mapped to the Worldbooks editor, never included in the final card."];
 }
 if(!parsed||typeof parsed!=="object")throw Error("The parser returned no character fields.");
 parsed.messages=[...(readerWarnings||[]),...(parsed.messages||[])];
 phase="Populating character template";
 mergeParsed(parsed,file.name,content);
 }catch(err){
  const description=err instanceof Error?err.message:String(err);
  const wrapped=new Error((file?.name||"Character file")+" · "+phase+": "+description);
  if(err?.stack)wrapped.stack=wrapped.message+"\nCaused by: "+String(err.stack);
  throw wrapped;
 }

}
function isReadiness(){
 const issues=[],core=coreCompiled(),op=openingCompiled();
 if(!str(data.title).trim())issues.push("Public title missing.");
 if(!str(data.name).trim())issues.push("Chat name missing.");
 if(!str(data.bio).trim())issues.push("Public bio missing.");

 if(core.length>25000)issues.push("Core exceeds Fizzz's 25,000-character limit.");
 else if(core.length>10000)issues.push("Core exceeds the recommended 10,000 characters but is within the 25,000 maximum.");
 if(op.length>5000)issues.push("Opening exceeds 5,000 characters.");
 if(!op)issues.push("Opening message missing.");


 return issues;
}
/* Local string matching cannot write complete creative prose safely.
   Preserve the original character bio and reject fragmentary replacements. */
function bioIntegrity(candidate,reference){
 const text=String(candidate||"").trim(),orig=String(reference||"").trim(),issues=[];
 const plain=x=>x.replace(/[*_#\uFFFC]/g,"").replace(/\s+/g," ").trim();
 const p=plain(text);
 if(!p||p.length<170)issues.push("Description is too short for a complete playable premise.");
 if(orig.length>800&&text.length<Math.max(350,orig.length*.48))issues.push("Too much established context was removed; isolated quotes are not a complete description.");
 const player=/\b(you|your|yours)\b|\{\{user\}\}/i;
 if(player.test(orig)&&!player.test(text))issues.push("The player's entry point has disappeared.");
 if(orig.length>500&&!/[.!?][”"*_]?(?:\s|$)/.test(text))issues.push("No complete sentences remain.");
 const md=text.replace(/\\\*/g,"");
 const doubles=(md.match(/\*\*/g)||[]).length,singles=(md.replace(/\*\*/g,"").match(/\*/g)||[]).length;
 if(doubles%2!==0||singles%2!==0)issues.push("Markdown emphasis is unbalanced.");
 if(/\uFFFC|\uFFFD/.test(text))issues.push("Contains a replacement or invisible object character.");
 return {valid:issues.length===0,issues};
}
function buildSuggestions(){
 const rec=[],add=(field,title,why,after,priority="medium")=>{const before=data[field]||"";if(!after||String(after).trim()===before.trim())return;rec.push({field,title,why,before,after,priority})};
 const bio=data.bio||"",greet=openingCompiled(),core=coreCompiled();
 /* Complete bio reviews now live directly under the Public Bio field. Length alone is never a suggested defect. */
 if(bio&&!/\byou\b|\{\{user\}\}/i.test(bio))rec.push({field:"bio",title:"Clarify the player's entry point in the existing premise",why:"A public description should show what role the player has and what decision is possible. Avoid appending generic questions or writing {{user}}'s actions; revise the relevant paragraph using the established story and voice.",before:bio,after:bio,priority:"medium",manual:true});
 if(str(data.title).length>94)rec.push({field:"title",title:"Review public title length without damaging the hook",why:"The title is long. If you shorten it, retain the character name and the recognizable trope rather than automatically cutting off the last words.",before:data.title,after:data.title,priority:"medium",manual:true});
 if(data.boundaries&&!/never (?:write|narrate|determine).*?\{\{user\}\}/i.test(data.boundaries))add("boundaries","Clarify player agency","Explicit player agency rules help avoid the bot narrating {{user}}'s decisions.",str(data.boundaries).trim()+"\n- Never write {{user}}'s dialogue, internal thoughts, or completed choices.","high");
 if(!str(data.motivation).trim()&&str(data.backstory).trim())rec.push({field:"motivation",title:"Give the character a lasting independent goal",why:"Existing history should cause decisions outside romance. Draft a goal using facts from the source rather than inventing canon.",before:"",after:"[Write an independent objective grounded in the imported backstory.]",priority:"high",manual:true});
 if(greet.length>5000)rec.push({field:"initialRaw",title:"Opening is over the 5,000-character limit",why:"Revise selectively while keeping scene, voice, dialogue and the unresolved player choice. Automatic truncation is deliberately disabled.",before:greet,after:greet,priority:"high",manual:true});
 if(core.length>10000)rec.push({field:"traits",title:"Core is rich but above the recommended length",why:"Compare recurring facts against Worldbooks before selectively moving secondary lore. Fizzz allows 25,000 characters; no cuts are applied automatically.",before:data.traits||"",after:data.traits||"",priority:"medium",manual:true});
 // Media & Voice were removed; no suggestions should target deleted fields.
 for(let n=1;n<=3;n++)if(data["world"+n+"Title"]&&!data["world"+n+"Body"]){rec.push({field:"world"+n+"Body",title:"Worldbook "+n+" needs its actual lore",why:"Your source contains title/trigger/outline metadata, not the full entry. Upload the original complete Worldbook rather than generating its facts from a summary.",before:"",after:"",priority:"high",manual:true});}
 recommendations=rec;return rec;
}
function renderSuggestions(){
 const dst=$("#suggestion-list");dst.replaceChildren();const rec=recommendations;
 if(!rec.length){const p=document.createElement("p");p.className="hint";p.textContent="No obvious pattern-based issues found. Test roleplay on Fizzz for consistency, pacing and player choice.";dst.append(p);return;}
 for(const [index,r] of rec.entries()){
  const card=document.createElement("article");card.className="suggestion";
  const h=document.createElement("h4");h.textContent=r.title;const p=document.createElement("p");p.textContent=r.why;
  const row=document.createElement("div");row.className="compare";
  for(const [label,value] of [["CURRENT FIELD",r.before],[r.manual?"EDITING DIRECTION — NOT REPLACEMENT TEXT":"COMPLETE PROPOSED REPLACEMENT",r.after||"(Upload or write the missing content)"]]){
   const block=document.createElement("div"),b=document.createElement("b"),pre=document.createElement("pre");b.textContent=label;pre.textContent=(value||"(empty)").slice(0,6000);block.append(b,pre);row.append(block);
  }
  const act=document.createElement("div");act.className="actions";
  const jump=document.createElement("button");jump.type="button";jump.textContent="Edit "+r.field;jump.addEventListener("click",()=>{let section=r.field.startsWith("world")?"world":defs.core.some(x=>x[0]===r.field)?"core":defs.profile.some(x=>x[0]===r.field)?"profile":defs.opening.some(x=>x[0]===r.field)?"opening":"profile";showTab(section);const el=$("#field-"+r.field);el?.scrollIntoView({block:"center",behavior:"smooth"});el?.focus();});act.append(jump);
  if(!r.manual){const apply=document.createElement("button");apply.type="button";apply.textContent="✓ Apply this specific edit";apply.className="primary";apply.addEventListener("click",()=>{if(data[r.field]!==r.before){notify("Field has changed; refresh suggestions before applying.");return;}if(r.field==="bio"){const gate=bioIntegrity(r.after,r.before);if(!gate.valid){notify("Cannot apply incomplete bio: "+gate.issues.join(" "));return;}}data[r.field]=r.after;rerender();save();buildSuggestions();renderSuggestions();notify("Only this edit was applied. Original file remains available.");});act.append(apply);}
  if(!r.field.startsWith("world") && r.field!=="imageDirection"){
   const ai=document.createElement("button");
   const scope=r.field==="bio"?"bio":r.field==="initialRaw"?"opening":"core";
   ai.type="button";ai.textContent="✦ Generate Complete "+(scope==="bio"?"Public Bio":scope==="core"?"Core Rewrite":"Opening")+" with ChatGPT";
   ai.title="Use ChatGPT (including its Free tier, subject to usage limits) to generate a full replacement instead of vague editing instructions.";
   ai.addEventListener("click",()=>{
    showTab("output");
    if(window.VelvetRuinFizzzChatGPT?.launch)window.VelvetRuinFizzzChatGPT.launch(scope);
    else notify("ChatGPT handoff unavailable. Refresh the page and use Compile & Export.");
   });
   act.append(ai);
  }
  const ignore=document.createElement("button");ignore.className="subtle";ignore.textContent="Keep original";ignore.addEventListener("click",()=>{recommendations.splice(index,1);renderSuggestions()});act.append(ignore);
  card.append(h,p,row,act);dst.append(card);
 }
}
function analyse(){
 const issues=isReadiness(),r=$("#readiness");r.textContent=issues.length?"Publishing checklist: "+issues.join(" • "):"✓ Required character text is ready. Select up to 10 discovery tags and transfer Worldbooks separately before publishing.";
 buildSuggestions();renderSuggestions();
}
function renderOutput(){
 const dst=$("#output-fields");dst.replaceChildren();
 for(const [label,value] of sections()){
  const sect=document.createElement("article");sect.className="output-section";
  const head=document.createElement("header"),title=document.createElement("h3"),button=document.createElement("button");
  title.textContent=label;button.textContent="Copy field";button.className="mini";button.addEventListener("click",()=>copy(value||"").then(()=>notify(label+" copied.")));
  head.append(title,button);const pre=document.createElement("pre");pre.className="pre";pre.textContent=value||"— Missing content —";sect.append(head,pre);dst.append(sect);
 }
}
function project(){return {builder:"VelvetRuin Fizzz Prompt Builder",version:2,data,source_filename:originalName,original_source:original,tags:chosen,
 compiler_draft:window.VelvetRuinFizzzCompiler?.snapshot?.()||null,
 export_note:"This JSON is a manually downloaded backup. Nothing is saved automatically after this tab closes."};}
function filename(){return (data.name||"character").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"character";}
function sendProject(){download(filename()+"-fizzz-project.json",JSON.stringify(project(),null,2),"application/json");window.FizzzSessionPrivacy?.backedUp?.();notify("Backup downloaded. Keep the JSON file to restore your character later.");}
async function restoreJSON(file){if(!file)return;const content=await file.text(),obj=JSON.parse(content);if(!obj||obj.builder!=="VelvetRuin Fizzz Prompt Builder"||!obj.data)throw Error("Not a compatible project backup. Use standard Import for other JSON.");data=normalizeIncomingFields(obj.data);chosen=normalizeTags(obj.tags);original=obj.original_source||"";originalName=obj.source_filename||file.name;save();rerender();window.VelvetRuinFizzzCompiler?.restoreSnapshot?.(obj.compiler_draft||null);notify("Project restored into this tab only. Export a backup before closing.");}
function init(){
 readSaved();for(const name of Object.keys(defs))fieldRender(name);worldRender();tagsRender();rerender();
 $("#tag-search")?.addEventListener("input",tagsRender);
 $("#tag-clear")?.addEventListener("click",()=>{chosen=[];tagsRender();save();refresh();});
 $("#worldbooks-bundle-file")?.addEventListener("change",async e=>{
  const file=e.target.files?.[0];e.target.value="";if(!file)return;
  try{await loadWorldbookBundle(file);}catch(err){worldbookNotice("Worldbook import failed: "+err.message);reportImportError(err,"Worldbooks import");}
 });
 $("#worldbooks-bundle-download")?.addEventListener("click",()=>{
  try{downloadBookBundle();}catch(err){worldbookNotice(err.message);}
 });
 $$(".tab").forEach(el=>el.addEventListener("click",()=>showTab(el.dataset.tab)));
 $$(".next").forEach(el=>el.addEventListener("click",()=>showTab(el.dataset.to)));
 $("#jump-import").addEventListener("click",()=>{$("#import-box").open=true;$("#drop-area").scrollIntoView({behavior:"smooth",block:"center"})});
 $("#start-empty").addEventListener("click",()=>{if((data.name||data.bio)&&!confirm("Starting a new character discards this tab’s draft. Download a Builder Backup first if you need to keep it. Continue?"))return;data={...initial};chosen=[];original="";originalName="";sourceNotes=[];save();rerender();window.VelvetRuinFizzzCompiler?.restoreSnapshot?.(null);window.FizzzSessionPrivacy?.cleared?.();showTab("profile");mark("New blank session-only character. Nothing is saved after this tab closes.");});
 $("#download-backup").addEventListener("click",sendProject);$("#download-project").addEventListener("click",sendProject);
 $("#character-file").addEventListener("change",async e=>{const f=e.target.files?.[0];e.target.value="";if(!f)return;try{await loadFile(f)}catch(err){reportImportError(err,"Upload")}});
 const drop=$("#drop-area");for(const name of ["dragover","dragenter"])drop.addEventListener(name,e=>{e.preventDefault();drop.classList.add("drag")});for(const name of ["dragleave","drop"])drop.addEventListener(name,e=>{e.preventDefault();drop.classList.remove("drag")});drop.addEventListener("drop",async e=>{const f=e.dataTransfer?.files?.[0];if(!f)return;try{await loadFile(f)}catch(err){mark(err.message,"error")}});
 $("#import-paste").addEventListener("click",()=>{const val=$("#character-paste").value;if(!val.trim())return mark("Paste some source character content first.","error");try{displayExtractedSource("Pasted character",val,[]);mergeParsed(parseExportedFields(val)||dataFromNumbered(val)||parseGeneric(val,"txt"),"Pasted character",val);}catch(err){reportImportError(err,"Pasted text")}});
 $("#restore-backup").addEventListener("click",()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=()=>restoreJSON(input.files?.[0]).catch(e=>reportImportError(e,"Restoring backup"));input.click();});
 $$("[data-builder-world]").forEach(el=>el.addEventListener("change",async e=>{const f=e.target.files?.[0];e.target.value="";if(!f)return;const n=Number(el.dataset.builderWorld);try{await loadFile(f,n)}catch(err){notify("Worldbook "+n+": "+err.message)}}));
 $("#refresh-suggestions").addEventListener("click",()=>{analyse();notify("Suggestions refreshed; changes require your approval.")});
 $("#download-txt").addEventListener("click",()=>download(filename()+"-fizzz-fields.txt",sections().map(([l,v])=>"# "+l+"\n\n"+(v||"")).join("\n\n"+"═".repeat(60)+"\n\n")));
 $("#download-original").addEventListener("click",()=>original?download((originalName||"original-character")+".txt",original):notify("No imported original exists. Your current character is editable and can be backed up."));
 $("#download-notes").addEventListener("click",()=>download(filename()+"-improvement-report.txt",["SOURCE MAPPING NOTES",...sourceNotes,"","READINESS CHECKS",...isReadiness(),"","EDITORIAL SUGGESTIONS",...buildSuggestions().map(r=>r.title+"\nField: "+r.field+"\nReason: "+r.why)].join("\n")));
 $("#export-png-image")?.addEventListener("change",e=>notify(e.target.files?.[0]?"Portrait selected for PNG export: "+e.target.files[0].name:"PNG card will use the typographic background."));
 // Compatibility with ../atelier/export-suite.js for actual JSON/DOCX/PNG exports.
 window.FizzzAtelier=Object.freeze({availableTags:()=>tagsKnown.slice(),tagLimit:TAG_LIMIT,getState:()=>({...data}),getTags:()=>chosen.slice(),coreCompiled,openingCompiled,sections,importDraft:(patch,{replace=false}={})=>{const applied=[];for(const [k,v] of Object.entries(patch)){if(Object.hasOwn(initial,k)&&typeof v==="string"&&(replace||!data[k])){data[k]=v;applied.push(k)}}rerender();save();return {applied}},download,refreshReview:()=>{refresh();renderOutput();},backup:()=>JSON.stringify(project(),null,2)});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();