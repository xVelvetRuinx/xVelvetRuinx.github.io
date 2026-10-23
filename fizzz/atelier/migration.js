/* VelvetRuin Fizzz Atelier: browser-only format extraction + review-before-merge.
   A file parser is not a creative language model; no source is silently rewritten. */
(() => {
"use strict";
const A=()=>window.FizzzAtelier,EX=()=>window.AtelierMigrator;
const names={title:"Public title",name:"Character Chat Name",age:"Age",gender:"Gender",pov:"POV",rating:"Rating",bio:"Public Character Bio",warning:"Content advisory",concept:"Core hook",dynamic:"Relationship promise",conflict:"Story conflict",role:"Player role",arc:"Long-term character change",coreRaw:"Verbatim Core Personality",initialRaw:"Original Initial Message",appearance:"Appearance",occupation:"Occupation",species:"Species",backstory:"Backstory",traits:"Behavioral personality",contradiction:"Internal contradiction",motivation:"Character goals",relationship:"Relationship with {{user}}",behavior:"Growth rules",boundaries:"Behavior boundaries",voice:"Speaking style",openingScene:"Scene",openingAction:"Visible action",openingLine:"Spoken line",openingBeat:"Open response beat",world1Title:"Worldbook 1 title",world1Body:"Worldbook 1 facts",world1Mode:"Worldbook 1 activation",world1Keywords:"Worldbook 1 triggers",world2Title:"Worldbook 2 title",world2Body:"Worldbook 2 facts",world2Mode:"Worldbook 2 activation",world2Keywords:"Worldbook 2 triggers",world3Title:"Worldbook 3 title",world3Body:"Worldbook 3 facts",world3Mode:"Worldbook 3 activation",world3Keywords:"Worldbook 3 triggers",imageDirection:"Character-image brief",coverDirection:"Cover brief",voiceDirection:"Voice brief"};
const allowed=new Set(["title","name","age","gender","pov","rating","bio","warning","concept","dynamic","conflict","role","arc","appearance","occupation","species","backstory","traits","contradiction","motivation","relationship","behavior","boundaries","voice","coreRaw","initialRaw","openingScene","openingAction","openingLine","openingBeat","world1Title","world1Mode","world1Keywords","world1Body","world2Title","world2Mode","world2Keywords","world2Body","world3Title","world3Mode","world3Keywords","world3Body","coverDirection","imageDirection","videoDirection","voiceDirection","musicDirection"]);
let originalText="",fileName="",format="text",sourceMapped=null,proposals=[],remaining="",extraWarnings=[],baseline={},lastAIFeedback=[];
const label=key=>names[key]||key.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase());
const txt=v=>typeof v==="string"?v:typeof v==="number"?String(v):"";
const make=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node};
const token=v=>Math.ceil(String(v||"").length/4);
const normalize=x=>String(x||"").toLowerCase().replace(/[\[\]#*()_.:—–/-]+/g," ").replace(/\s+/g," ").trim();
function getFrom(o,aliases){
 if(!o||typeof o!=="object")return null;
 for(const name of aliases){
   if(Object.prototype.hasOwnProperty.call(o,name)&&o[name]!==null)return o[name];
   const candidate=Object.keys(o).find(k=>normalize(k)===normalize(name));
   if(candidate&&o[candidate]!==null)return o[candidate];
 }
 return null;
}
const aliases={
 title:["title","bot title","published title","display_name","character title"],
 name:["name","character name","character chat name","char_name","character_name","full name"],
 age:["age","apparent age","looks age"],gender:["gender","sex"],pov:["pov","perspective"],rating:["rating","content rating"],
 bio:["bio","character bio","public bio","short_description","short description","public_description","tagline","summary"],
 warning:["content warning","content note","content advisory","warnings"],
 concept:["concept","character concept","story hook","core hook"],
 dynamic:["dynamic","relationship promise","romance dynamic","tropes"],conflict:["conflict","story engine"],
 role:["user role","player role","userRole","role of user","your role"],
 arc:["character arc","long term arc","arc"],
 occupation:["occupation","profession","job","career"],
 species:["species","race"],appearance:["appearance","physical appearance","looks","physical description"],
 backstory:["backstory","background","history","origin"],
 traits:["traits","core traits","behavior","personality traits"],
 contradiction:["contradiction","inner conflict"],motivation:["motivation","character goals","goals","hidden goal"],
 relationship:["relationship","relationship with user","starting relationship"],behavior:["relationship pacing","progression rules","growth rules"],
 boundaries:["rules","character rules","behavioral boundaries","roleplay rules"],
 voice:["speaking style","voice style","speech patterns","speech style"],
 coreRaw:["core personality","core_personality","corePersonality","character settings","personality","char_persona","character definition","system_prompt","description","persona","character personality","long description","long_description"],
 initialRaw:["initial message","initial_message","greeting","first message","first_mes","firstMessage","opening","customGreeting","starter","message"],
 coverDirection:["cover direction","cover prompt"],imageDirection:["character images","character image prompt","image direction","art prompt"],
 voiceDirection:["voice direction","voice notes"],
 world1Title:["worldbook 1 title","worldbook1 title","lorebook 1 title"],
 world1Body:["worldbook 1","worldbook entry 1","worldbook1","lorebook 1"],
 world2Title:["worldbook 2 title","worldbook2 title","lorebook 2 title"],
 world2Body:["worldbook 2","worldbook entry 2","worldbook2","lorebook 2"],
 world3Title:["worldbook 3 title","worldbook3 title","lorebook 3 title"],
 world3Body:["worldbook 3","worldbook entry 3","worldbook3","lorebook 3"],
 world1Mode:["worldbook 1 mode","worldbook1 mode"],world2Mode:["worldbook 2 mode","worldbook2 mode"],world3Mode:["worldbook 3 mode"],
 world1Keywords:["worldbook 1 keywords","worldbook1 keywords"],world2Keywords:["worldbook 2 keywords","worldbook2 keywords"],world3Keywords:["worldbook 3 keywords"]
};
const reverse=new Map();
Object.entries(aliases).forEach(([k,labels])=>labels.forEach(x=>reverse.set(normalize(x),k)));
function findField(heading){return reverse.get(normalize(heading))||null}
function titleText(x){return String(x||"").trim().slice(0,300)}
function clean(v){
 return String(v??"").replace(/\r\n?/g,"\n").replace(/\u0000/g,"").trim();
}
function readWorld(entries,patch,added,unmapped){
 let n=0;
 for(const e of entries){
  if(!e||typeof e!=="object")continue;
  const content=txt(e.content||e.text||e.value),entryTitle=txt(e.name||e.title||e.comment),keys=Array.isArray(e.keys)?e.keys.join(", "):Array.isArray(e.key)?e.key.join(", "):txt(e.keywords||e.keys||e.key),always=Boolean(e.constant===true||e.always_active===true||e.mode==="always"||e.activation==="always");
  if(!content&&!entryTitle)continue;
  n++;
  if(n>3){unmapped.push("ADDITIONAL ORIGINAL WORLDBOOK ENTRY "+n+":\n"+entryTitle+"\n"+content+"\nKEYWORDS: "+keys);continue}
  if(content){patch["world"+n+"Body"]=content;added["world"+n+"Body"]="Mapped complete worldbook entry "+n+" without shortening its lore."}
  if(entryTitle){patch["world"+n+"Title"]=entryTitle;added["world"+n+"Title"]="Preserved source entry title."}
  if(keys){patch["world"+n+"Keywords"]=keys;added["world"+n+"Keywords"]="Preserved keyword triggers from source metadata."}
  patch["world"+n+"Mode"]=always?"always":"keyword";
  added["world"+n+"Mode"]="Activation mapped from source metadata; verify it against the original platform.";
 }
 if(n>3)extraWarnings.push("Source has "+n+" Worldbook entries. Fizzz permits three. Entries beyond three are retained under Unmapped Source for manual consolidation.");
}
function extractJSON(obj){
 if(!obj||typeof obj!=="object"||Array.isArray(obj))throw Error("Expected one character JSON object.");
 const root=obj.project&&typeof obj.project==="object"?obj.project:obj.data&&typeof obj.data==="object"?obj.data:obj.character&&typeof obj.character==="object"?obj.character:obj;
 const result={},notes={},unmapped=[];
 if(obj.tool==="VelvetRuin Fizzz Atelier"&&obj.project){
   for(const [k,v] of Object.entries(obj.project))if(allowed.has(k)&&typeof v==="string")result[k]=v;
   return {fields:result,notes,unmapped:[],kind:"Fizzz Atelier backup",tags:Array.isArray(root.tags)?root.tags:[]};
 }
 for(const [k,a] of Object.entries(aliases)){
   const found=getFrom(root,a);
   if(typeof found==="string"&&found.trim()||typeof found==="number"&&Number.isFinite(found)){
      result[k]=String(found);notes[k]="Matched an existing field from the imported JSON. Wording has not been rewritten.";
   }
 }
 if(!result.coreRaw&&typeof root.core==="string")result.coreRaw=root.core;
 if(!result.bio && typeof root.description==="string" && typeof root.personality==="string" && root.description!==root.personality && root.description.length<=1200){
   result.bio=root.description;notes.bio="Used the existing shorter public description rather than rewriting the bio.";
 }
 if(Array.isArray(root.character_book?.entries))readWorld(root.character_book.entries,result,notes,unmapped);
 else if(Array.isArray(root.worldbook?.entries))readWorld(root.worldbook.entries,result,notes,unmapped);
 else if(Array.isArray(root.worldbook))readWorld(root.worldbook,result,notes,unmapped);
 else if(Array.isArray(root.lorebook))readWorld(root.lorebook,result,notes,unmapped);
 else if(typeof root.lore==="string"&&!result.world1Body){result.world1Body=root.lore;notes.world1Body="Mapped source lore to the first Worldbook entry.";}
 else if(typeof root.lorebook==="string"&&!result.world1Body){result.world1Body=root.lorebook;notes.world1Body="Mapped source lorebook to first Worldbook entry.";}
 if(typeof root.mes_example==="string"&&root.mes_example.trim())unmapped.push("ORIGINAL EXAMPLE DIALOGUE (Fizzz has no separate sample-dialogue field):\n"+root.mes_example);
 const extras=["sampleUser1","sampleChar1","sampleUser2","sampleChar2","sampleUser3","sampleChar3","sampleDialogue","example_dialogue","example_messages"];
 const past=extras.map(k=>root[k]&&k+": "+root[k]).filter(Boolean);
 if(past.length)unmapped.push("ORIGINAL EXAMPLES (review whether a SHORT speaking-style line is useful):\n"+past.join("\n\n"));
 if(!result.coreRaw){
    const parts=["appearance","backstory","traits","occupation","species","voice","relationship","behavior","boundaries","motivation","contradiction"].filter(k=>result[k]).map(k=>"# "+label(k)+"\n"+result[k]);
    if(!parts.length&&typeof root.character_description==="string")result.coreRaw=root.character_description;
 }
 if(!result.initialRaw&&typeof root.first_mes==="string")result.initialRaw=root.first_mes;
 if(!result.bio&&typeof root.description==="string"&&typeof root.personality!=="string")extraWarnings.push("The import has a Description field that might be a persona, not a public Bio. It was treated as Core Personality; please review.");
 return {fields:result,notes,unmapped,kind:"Structured character JSON",tags:Array.isArray(root.tags)?root.tags:[]};
}
function parseText(text){
 const lines=clean(text).split("\n"),chunks=[],unknown=[];
 let active=null,prefix=[];
 const flush=()=>{if(active){active.text=active.lines.join("\n").trim();chunks.push(active);active=null}};
 const headers=[
 /^#{1,4}\s+(.+)$/, /^\[([^\]]{2,90})\]$/, /^\*\*([^*]{2,90})\*\*:?\s*$/,
 /^(\d{1,2})\s*[·.:—-]\s*(.+)$/
 ];
 for(let i=0;i<lines.length;i++){
  const line=lines[i],stripped=line.trim();
  let heading=null,inline="";
  for(const re of headers){const m=stripped.match(re);if(m){heading=m[2]||m[1];break}}
  if(!heading){
    const m=stripped.match(/^([A-Za-z][\w _/-]{1,45}):\s*(.*)$/);
    if(m&&findField(m[1])){heading=m[1];inline=m[2]}
  }
  if(!heading&&stripped.length<70&&findField(stripped)&&(!lines[i-1]||!lines[i-1].trim()))heading=stripped;
  const key=heading?findField(heading):null;
  if(key){
    if(prefix.join("").trim())unknown.push(prefix.join("\n").trim());
    prefix=[];flush();active={key,label:heading,lines:inline?[inline]:[]};
  }else if(active)active.lines.push(line);
  else prefix.push(line);
 }
 flush();
 if(prefix.join("").trim())unknown.push(prefix.join("\n").trim());
 const mapped={},notes={},leftovers=[];
 for(const c of chunks){
  if(!c.text)continue;
  if(mapped[c.key]&&mapped[c.key]!==c.text){
     if(["coreRaw","backstory","traits","initialRaw"].includes(c.key)){
       mapped[c.key]+="\n\n"+c.text;notes[c.key]="Combined separate source passages without rewriting them.";
     }else leftovers.push("CONFLICTING "+c.label+":\n"+c.text);
  }else{mapped[c.key]=c.text;notes[c.key]="Matched original heading '"+c.label+"'; source wording preserved.";}
 }
 leftovers.push(...unknown);
 if(!Object.keys(mapped).length){
  // Preserve unstructured source as original Core Personality, marked optional in review.
  mapped.coreRaw=clean(text);
  notes.coreRaw="Unstructured source preserved IN FULL for manual sorting. This is not a finished Core Personality.";
  return {fields:mapped,notes,unmapped:[],kind:"Unstructured prose",unstructured:true};
 }
 if(unknown.length)extraWarnings.push("Some paragraphs were not clearly labeled; their original wording is retained below for manual review.");
 return {fields:mapped,notes,unmapped:leftovers,kind:"Labeled text"};
}
function normalizeSelections(data){
 const out={...data};
 if(out.gender){const g=out.gender.toLowerCase();if(g==="male"||g==="man")out.gender="Male";else if(g==="female"||g==="woman")out.gender="Female";else if(["non-binary","non binary","nonbinary"].includes(g))out.gender="Non-binary";else{extraWarnings.push("Unrecognized Gender: "+out.gender+". Review before assigning.");delete out.gender;}}
 if(out.rating){const g=out.rating.toLowerCase();if(g==="limited")out.rating="Limited";else if(g==="limitless")out.rating="Limitless";else{extraWarnings.push("Unrecognized rating '"+out.rating+"'. Choose it manually.");delete out.rating;}}
 if(out.pov){const p=out.pov.toLowerCase();if(["any pov","any","anypov"].includes(p))out.pov="Any POV";else if(["female pov","fem pov"].includes(p))out.pov="Female POV";else if(["male pov","masc pov"].includes(p))out.pov="Male POV";else{extraWarnings.push("Unrecognized POV: "+out.pov+". Choose one during publishing.");delete out.pov;}}
 if(out.age&&!/^(?:\d{2,3})$/.test(out.age.trim()))extraWarnings.push("Age '"+out.age+"' may include an apparent/actual age distinction. Keep it in text; enter correct adult age separately.");
 for(let i=1;i<=3;i++){
   const k="world"+i+"Mode";if(out[k]&&!["always","keyword"].includes(out[k])){out[k]=/always|constant/i.test(out[k])?"always":"keyword";}
 }
 return out;
}
function describe(key,source){
 if(source==="Generated proposal")return "OPTIONAL: Derived entirely from existing text. It has not been confirmed as an intended public promise.";
 if(key==="coreRaw")return "Preserve the COMPLETE original persona rather than generating a replacement. Add manual clarifications separately if needed.";
 if(key==="initialRaw")return "Preserve the first message, pacing and every dialogue line exactly. Fix only formatting with the creator's approval.";
 if(key.startsWith("world"))return "Maintain the original lore and trigger logic. Move facts into the appropriate Worldbook entry, preserving the content.";
 if(["bio","title"].includes(key))return "Public-facing source copied into Fizzz's matching field. Bio does not govern roleplay performance.";
 if(["gender","age","rating","pov"].includes(key))return "Platform classification recognized from the source. Check against the real character before publishing.";
 return "Existing source facts assigned to the corresponding creator field, with original wording intact.";
}
function prepare(parsed,{source="file",ai=false,log=[]}={}){
 const data=normalizeSelections(parsed.fields||{}),items=[],s=A().getState(),keys=new Set(A().keys());
 for(const [key,v] of Object.entries(data)){
  if(!keys.has(key)||typeof v!=="string"||!v.trim())continue;
  const old=ai?baseline[key]:v,proposal=String(v);
  const changeLog=log.filter(x=>x&&x.field===key);
  const changed=ai?String(old||"").trim()!==proposal.trim():false;
  const status=ai?changed?"AI proposed change":"Source unchanged":parsed.unstructured?"Needs manual sorting":"Mapped unchanged";
  let reason=ai
   ?changeLog.length?changeLog.map(x=>"AI says: "+(x.why||"No explanation supplied")).join("; "):"AI gave no itemized reason; verify that no content was lost."
   :(parsed.notes?.[key]||describe(key,source));
  if(ai&&changed)reason+=" • External AI can alter meaning despite instructions. Compare every word before approval.";
  items.push({key,value:proposal,original:old==null?"":String(old),status,reason,inferred:!ai&&!!(parsed.generated?.includes(key)||parsed.unstructured),aiChanged:ai&&changed,sourceChanged:changed});
 }
 const leftovers=Array.isArray(parsed.unmapped)?parsed.unmapped.join("\n\n"):String(parsed.unmapped||"");
 return {items,leftovers,notes:[...extraWarnings,...(parsed.notesGlobal||[])],tags:parsed.tags||[],kind:parsed.kind||source,source,s};
}
function prospective(jsonOrText,sourceFormat){
 extraWarnings=[];
 let parsed;
 if(sourceFormat==="json"){
   let obj;
   try{obj=typeof jsonOrText==="string"?JSON.parse(jsonOrText):jsonOrText}catch(e){throw Error("Invalid JSON: "+e.message)}
   parsed=extractJSON(obj);
 }else{
   const source=typeof jsonOrText==="string"?jsonOrText:JSON.stringify(jsonOrText,null,2);
   if(/^\s*\{/.test(source)){try{parsed=extractJSON(JSON.parse(source))}catch{parsed=parseText(source)}}
   else parsed=parseText(source);
 }
 if(!parsed.fields.name&&!parsed.fields.title)extraWarnings.push("No confidently identified character name. Do not invent one during migration.");
 if(!parsed.fields.initialRaw)extraWarnings.push("No complete Initial Message was found. Write an opening after importing, preserving the original premise.");
 if(!parsed.fields.voice&&!parsed.fields.coreRaw)extraWarnings.push("No speaking style or core persona found. Write one so the bot remains recognizable.");
 if(parsed.fields.coreRaw&&parsed.fields.coreRaw.length>10000)extraWarnings.push("The source Core Personality exceeds Fizzz's recommended 10,000 characters. It is PRESERVED, not shortened. Consider moving only secondary lore to Worldbook.");
 if(parsed.fields.initialRaw&&parsed.fields.initialRaw.length>5000)extraWarnings.push("The initial message exceeds Fizzz's 5,000-character maximum. It remains intact until you choose what to edit.");
 return prepare(parsed);
}
function setImported(text,{name="",formatHint="text",warnings=[]}={}){
 originalText=String(text||"");fileName=name;format=formatHint;
 extraWarnings=[...warnings];sourceMapped=null;baseline={};lastAIFeedback=[];
 $("#migration-paste").value=originalText;$("#migration-results").hidden=true;$("#migration-file-status").textContent=(name||"Pasted content")+" · "+originalText.length.toLocaleString()+" characters ready. "+warnings.join(" ");
}
async function importFile(file){
 if(!file)return;
 const button=$("#analyze-file");button.disabled=true;button.textContent="Reading character…";
 try{
  if(!EX())throw Error("Import readers unavailable. Paste the source text instead.");
  const fileResult=await EX().extract(file);
  setImported(fileResult.text,{name:fileResult.filename||file.name,formatHint:fileResult.format,warnings:fileResult.warnings||[]});
  A().notify("Character document loaded. Select Map & Review.");
 }catch(e){A().notify("Import failed: "+e.message);}
 finally{button.disabled=false;button.textContent="✦ Map & Review Character";}
}
const major=(k,before,after)=>{
 const a=String(before||"").trim(),b=String(after||"").trim();
 if(!a||a===b)return false;
 if(["name","title","age","gender"].includes(k))return true;
 if(["coreRaw","initialRaw","backstory","traits","relationship","lore","voice"].includes(k)||k.endsWith("Body")){
  const x=new Set((a.toLowerCase().match(/[\p{L}\p{N}']+/gu)||[])),y=new Set((b.toLowerCase().match(/[\p{L}\p{N}']+/gu)||[]));
  const union=new Set([...x,...y]).size||1,intersection=[...x].filter(w=>y.has(w)).length;
  return 1-intersection/union>.48||Math.abs(a.length-b.length)/Math.max(a.length,b.length,1)>.33;
 }
 return false;
};
function showReview(data){
 sourceMapped=data;proposals=data.items;
 const notes=$("#migration-notes");notes.replaceChildren();
 [data.kind+" · "+data.items.length+" mapped fields",...data.notes,...lastAIFeedback].forEach((note,i)=>{notes.append(make("p",i?"muted":"",note));});
 const where=$("#migration-proposals");where.replaceChildren();
 for(const item of data.items){
  const wrap=make("article","migration-proposal"),header=make("div","proposal-head"),l=make("label"),box=make("input");box.type="checkbox";box.dataset.select=item.key;
  box.checked=!item.inferred&&!item.aiChanged;
  l.append(box,make("b","",label(item.key)));
  const status=make("span","proposal-status",item.status);header.append(l,status);
  const reason=make("p","",item.reason),edit=make("textarea");edit.rows=Math.min(10,Math.max(3,Math.ceil(item.value.length/90)));edit.value=item.value;edit.dataset.proposal=item.key;edit.setAttribute("aria-label","Review "+label(item.key));
  const budget=make("div","proposal-budget"),detail=make("details","before-after"),summary=make("summary","","View original versus proposed");
  const grid=make("div","before-after-grid"),left=make("div"),right=make("div"),proposed=make("pre","",item.value);
  left.append(make("b","","ORIGINAL · PROTECTED"),make("pre","",item.original||"(no corresponding source field)"));
  right.append(make("b","","PROPOSED · EDITABLE"),proposed);grid.append(left,right);detail.append(summary,grid);
  const restore=make("button","proposal-restore","↶ Restore exact original");restore.type="button";
  const approve=make("label","proposal-approve"),check=make("input");check.type="checkbox";check.dataset.approve=item.key;
  approve.append(check,make("span","","I compared this substantial change against my original and approve it."));
  const redraw=()=>{
   const updated=edit.value;proposed.textContent=updated;
   const diff=token(updated)-token(item.original);
   budget.textContent=(item.original?"Original ~"+token(item.original)+" → ":"New ")+token(updated)+" estimated tokens ("+(diff>=0?"+":"")+diff+")";
   const risk=major(item.key,item.original,updated);
   approve.hidden=!risk;
   if(!risk)check.checked=false;
   status.textContent=item.original===updated?"Source unchanged":risk?"Substantial change · review":item.aiChanged?"AI proposal":"Formatting / edited";
   detail.open=risk&&!check.checked;
  };
  edit.addEventListener("input",()=>{check.checked=false;redraw()});
  restore.addEventListener("click",()=>{edit.value=item.original;box.checked=true;check.checked=false;redraw();A().notify("Original restored for "+label(item.key))});
  wrap.append(header,reason,edit,budget,detail);
  if(item.original)wrap.append(restore);
  wrap.append(approve);where.append(wrap);redraw();
 }
 $("#migration-results").hidden=false;
 $("#migration-leftovers").textContent=data.leftovers||"No unmapped text.";
 $("#migration-results").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"});
}
function selection(){
 const patch={},blocked=[];
 for(const textarea of $$("[data-proposal]")){
  const k=textarea.dataset.proposal,sel=$('[data-select="'+k+'"]');
  if(!sel?.checked||!textarea.value.trim())continue;
  const item=proposals.find(x=>x.key===k);
  if(item&&major(k,item.original,textarea.value)&&!$('[data-approve="'+k+'"]')?.checked){blocked.push(k);continue;}
  patch[k]=textarea.value;
 }
 return {patch,blocked};
}
function report(){
 const rows=["VELVETRUIN · FIZZZ CHARACTER MIGRATION",new Date().toISOString(),"Source: "+(fileName||"pasted text"),"Mapped fields require approval. No automatic story rewriting.",""];
 for(const item of proposals){
  const editor=$('[data-proposal="'+item.key+'"]'),selected=$('[data-select="'+item.key+'"]')?.checked;
  rows.push("═".repeat(46),label(item.key),"Status: "+item.status,"Reason: "+item.reason,
  "Selected: "+(selected?"yes":"no"),"Original approx tokens: "+token(item.original),"Proposed approx tokens: "+token(editor?.value||""),
  "ORIGINAL:\n"+item.original,"PROPOSED:\n"+(editor?.value||""),"");
 }
 if(sourceMapped?.leftovers)rows.push("UNMAPPED ORIGINAL SOURCE:\n"+sourceMapped.leftovers);
 return rows.join("\n");
}
function apply(){
 const {patch,blocked}=selection();
 if(blocked.length){A().notify("Review and explicitly approve significant changes in: "+blocked.map(label).slice(0,2).join(", "));return}
 if(!Object.keys(patch).length){A().notify("Select at least one reviewed field to apply.");return}
 const replace=$('input[name="merge-mode"]:checked')?.value==="replace";
 if(replace&&!confirm("Replace only your selected fields in the current draft? Back up first if needed."))return;
 const done=api.apply(patch,{replace});
 if(!done.length){A().notify("No empty fields to fill. Choose Replace selected fields if you want to overwrite your draft.");return}
 A().notify(done.length+" reviewed fields applied. Check the manuscript and media before publishing.");
 A().chapter("profile");
}
function auditCurrent(){
 const project=A().getState(),real=Object.fromEntries(Object.entries(project).filter(([k,v])=>allowed.has(k)&&typeof v==="string"&&v.trim()&&!["gender","pov","rating"].includes(k)));
 if(!Object.keys(real).length){A().notify("The current draft is empty. Write something or load an example first.");return}
 originalText=JSON.stringify(project,null,2);fileName="Current Fizzz draft";format="json";baseline={...project};lastAIFeedback=[];
 const p=prepare({fields:real,kind:"Current draft review",notes:{},unmapped:[]});
 p.items.forEach(item=>{item.reason="Audited existing field without altering wording. Use the creator checklist for improvements.";item.status="Source unchanged"});
 showReview(p);
}
function aiBrief(){
 if(!originalText.trim()&&!sourceMapped)throw Error("Import a character first, or choose Review My Current Draft.");
 const context=Object.fromEntries(proposals.map(x=>[x.key,x.value]));
 const keys=[...allowed].filter(k=>!k.startsWith("world")||k.endsWith("Body")||k.endsWith("Title")||k.endsWith("Keywords")||k.endsWith("Mode"));
 const rules=[
 "You are a copyeditor protecting an EXISTING creator-owned Fizzz roleplay character, not a bot rewriter.",
 "Preserve the established identity, species, age, name, secrets, narrative situation, motivations, nuanced psychology, personality, dialogue, relationship logic, user agency and worldbook facts.",
 "Do not replace the character concept, rewrite whole scenes, invent lore, change opening dialogue, remove a distinct behavioral trait or compress unique backstory to chase arbitrary targets.",
 "Make only local, carefully justified grammar edits, ambiguity fixes, repeated-word removal, structural moves into correct Fizzz fields and very minor clarity tweaks.",
 "If an existing field is good, leave it completely unchanged and OMIT IT from the output fields object.",
 "Fizzz official limits: Core Personality max 25,000 characters; recommended within 10,000. Initial Message max 5,000. Worldbook: up to 3 entries, 10,000 chars each. Bio is public but not model context. Images for video recommended 9:16. No independent example dialogue field: prefer concise speaking style in core instead.",
 "Preserve initial message prose, spoken lines, emotional tone, chronology and playable closing beat verbatim unless a tiny local correction is absolutely needed.",
 "Never speak for {{user}} or predetermine consent, feelings or outcomes. Flag problems; do not alter unrelated text.",
 "Do not invent content that was not in original. If a better hook, new archetype, new image, new character or missing detail needs author input, write an optional suggestion only.",
 "Return ONLY valid JSON with schema:",
 '{"fields":{"bio":"...only when minimally edited","coreRaw":"...only when minimally edited"},"changeLog":[{"field":"coreRaw","before":"exact changed words","after":"exact replacement words","why":"specific benefit (clarity, tiny trim, consistency)"}],"suggestions":[{"field":"role","note":"Optional issue requiring human decision"}]}',
 "Allowed fields: "+keys.join(", "),
 "Never return unrelated commentary, markdown fences or fields that have not been changed. Each changed field needs a specific changeLog entry quoting real before/after text.",
 "Original source is authoritative. The extracted mapping may be imperfect.",
 "EXTRACTED FIELDS:\n"+JSON.stringify(context,null,2),
 "ORIGINAL SOURCE:\n"+originalText.slice(0,65000),
 "Return valid JSON only. Avoid substantive rewriting."
 ];
 return rules.join("\n\n");
}
function parseAi(text){
 let raw=String(text||"").trim();const ticks=String.fromCharCode(96).repeat(3);
 if(raw.startsWith(ticks))raw=raw.replace(new RegExp("^"+ticks+"(?:json)?\\s*","i"),"").replace(new RegExp("\\s*"+ticks+"$"),"").trim();
 const i=raw.indexOf("{"),j=raw.lastIndexOf("}");if(i>=0&&j>i)raw=raw.slice(i,j+1);
 return JSON.parse(raw);
}
function aiReview(input){
 try{
  const obj=parseAi(input),updates=obj.fields&&typeof obj.fields==="object"?obj.fields:obj;
  const real=Object.fromEntries(Object.entries(updates).filter(([k,v])=>allowed.has(k)&&typeof v==="string"&&v.trim()));
  if(!sourceMapped&&!Object.keys(baseline).length)throw Error("Analyze the original character first so changes can be compared.");
  const old=Object.fromEntries(proposals.map(x=>[x.key,x.original||x.value]));
  if(!Object.keys(baseline).length)baseline={...old};
  if(!Object.keys(real).length){
    const tips=Array.isArray(obj.suggestions)?obj.suggestions:[];
    lastAIFeedback=tips.map(x=>"AI suggestion · "+(x.field||"general")+": "+(x.note||"")).filter(Boolean);
    if(sourceMapped){sourceMapped.notes.push(...lastAIFeedback);showReview(sourceMapped);A().notify("No copyedits proposed. Optional feedback is displayed.");}
    return;
  }
  const src=Object.assign({},baseline,real);
  const logs=Array.isArray(obj.changeLog)?obj.changeLog:[];
  const data=prepare({fields:src,kind:"AI suggestions · preserve original",notes:{},unmapped:sourceMapped?.leftovers||""},{ai:true,log:logs});
  data.items.forEach(item=>{
    item.original=Object.prototype.hasOwnProperty.call(baseline,item.key)?String(baseline[item.key]||""):"";
    if(item.value===item.original){item.status="Source unchanged";item.aiChanged=false;item.reason="AI left this exact original text unchanged.";}
    else {item.aiChanged=true;item.status="AI copyedit · optional";if(!logs.some(c=>c?.field===item.key))item.reason="AI changed this field without explaining why. Do not approve without a full comparison.";}
  });
  lastAIFeedback=(Array.isArray(obj.suggestions)?obj.suggestions:[]).slice(0,8).map(x=>"AI optional feedback · "+(x.field||"general")+": "+(x.note||""));
  data.notes.push("AI changes are UNCHECKED by default. Inspect every original and explanation. AI may unintentionally change meaning.",...lastAIFeedback);
  showReview(data);
  A().notify("AI copyedits are ready for manual review. Nothing changed in your saved character.");
 }catch(e){A().notify("Could not review AI result: "+e.message);}
}
function demo(){
 const sample="# Character Chat Name\nIona Vesk\n\n# Character Bio\nA coastal investigator returns to the lighthouse she swore never to visit. You have the letter that brought her back.\n\n# Core Personality\nIona is a 36-year-old former rescue diver. Her hair is dark, her gaze unblinking, and her wrists bear pale rope scars. She speaks briefly when afraid; rather than abandon others, she prepares a second exit. Her closest friend vanished during a failed rescue seven years ago. She wants the truth, but distrusts anyone eager to supply it.\n\n# Initial Message\n*The lighthouse beam crossed the harbor for the third time. Iona unfolded a damp letter, then lifted her gaze to {{user}}.* \"Tell me how you found this. I burned the original.\" *The paper remains where {{user}} can read it.*\n\n# Worldbook 1\nThe lighthouse keeper's log was lost in the storm seven years ago. No character may know its contents until it is actually discovered in roleplay.";
 setImported(sample,{name:"example-fizzz-character.txt"});A().notify("Migration example loaded; click Map & Review Character.");
}
let api=null;
function initFizzzMigration(context){
 api=context;
 $("#migration-file").addEventListener("change",e=>importFile(e.target.files?.[0]));
 const drop=$("#dropzone");
 ["dragover","dragenter"].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.add("dragging")}));
 ["drop","dragleave"].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.remove("dragging")}));
 drop.addEventListener("drop",e=>{if(e.dataTransfer?.files?.length)importFile(e.dataTransfer.files[0])});
 $("#migration-paste").addEventListener("input",()=>{$("#migration-results").hidden=true;format="text";fileName="Pasted text";originalText=$("#migration-paste").value;sourceMapped=null;baseline={}});
 $("#analyze-file").addEventListener("click",()=>{
  try{
    originalText=$("#migration-paste").value;
    if(!originalText.trim())throw Error("Choose a file or paste an existing character.");
    sourceMapped=prospective(originalText,format);baseline=Object.fromEntries(sourceMapped.items.map(x=>[x.key,x.original]));
    showReview(sourceMapped);A().notify("Original text mapped for review. No changes applied.");
  }catch(e){A().notify("Could not map character: "+e.message)}
 });
 $("#audit-current").addEventListener("click",auditCurrent);
 $("#migration-sample").addEventListener("click",demo);
 $("#select-mapped").addEventListener("click",()=>$$("#migration-proposals input[data-select]").forEach(x=>{const item=proposals.find(p=>p.key===x.dataset.select);x.checked=Boolean(item&&!item.inferred&&!item.aiChanged)}));
 $("#deselect-mapped").addEventListener("click",()=>$$("#migration-proposals input[data-select]").forEach(x=>x.checked=false));
 $("#source-download").addEventListener("click",()=>{if(!originalText)return A().notify("No original source to export.");A().download("fizzz-character-original.txt",originalText);A().notify("Original character source saved.")});
 $("#report-download").addEventListener("click",()=>{if(!sourceMapped)return A().notify("Analyze a character before exporting the report.");A().download("fizzz-migration-change-report.txt",report());A().notify("Change report saved.")});
 $("#apply-migration").addEventListener("click",apply);
 $("#copy-ai-brief").addEventListener("click",async()=>{try{await A().copyText(aiBrief());A().notify("Gentle-copyedit AI brief copied. Bring the resulting JSON back for review.");}catch(e){A().notify("Copy failed: "+e.message)}});
 $("#import-ai-file-button").addEventListener("click",()=>$("#import-ai-file").click());
 $("#import-ai-file").addEventListener("change",async e=>{const f=e.target.files?.[0];e.target.value="";if(!f)return;try{if(f.size>1048576)throw Error("JSON file over 1 MB");aiReview(await f.text())}catch(err){A().notify(err.message)}});
 $("#review-ai").addEventListener("click",()=>aiReview($("#ai-response").value));
}
window.initFizzzMigration=initFizzzMigration;
})();