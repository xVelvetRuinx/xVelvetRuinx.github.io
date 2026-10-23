/* VelvetRuin · Migration Studio · local, review-before-apply workflow. */
(() => {
"use strict";
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const app=()=>window.VelvetRuinAtelier,engine=()=>window.AtelierMigrator;
const priority=["title","name","age","gender","hook","userRole","tease","trope","appearance","personality","contradiction","voice","mannerisms","occupation","surfaceGoal","hiddenGoal","backstory","anchors","setting","lore","scenario","relationship","supporting","canon","customGreeting","openingScene","openingAction","openingDialogue","openingBeat","sampleUser1","sampleChar1","sampleUser2","sampleChar2","sampleUser3","sampleChar3","tags","rating","replyLength","promptMode"];
const labels={title:"Storefront title",name:"Character name",age:"Adult age",gender:"Gender",hook:"Public hook",userRole:"Player role",appearance:"Appearance",personality:"Personality",contradiction:"Contradiction",voice:"Speech and voice",mannerisms:"Habits and tells",occupation:"Role",surfaceGoal:"Immediate goal",hiddenGoal:"Secret motivation",backstory:"Backstory",anchors:"Character rules",setting:"Setting",lore:"World rules",scenario:"Story scenario",relationship:"Starting relationship",supporting:"Supporting cast",canon:"Canonical facts",customGreeting:"Opening / First Message",sampleChar1:"Character Dialogue 1",sampleChar2:"Character Dialogue 2",sampleChar3:"Character Dialogue 3",sampleUser1:"User Dialogue 1",sampleUser2:"User Dialogue 2",sampleUser3:"User Dialogue 3",tags:"Suggested tags",rating:"Rating"};
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
let current=null,source="",lastFormat="text",fileName="",sourceWarnings=[],notifyTimer;
const token=v=>Math.ceil(String(v||"").length/4);
function alertUser(message,err=false){
 const target=$("#migration-file-line");target.textContent=message;target.classList.toggle("error",err);
 const t=$("#toast");if(t){t.textContent=message;t.classList.add("show");clearTimeout(notifyTimer);notifyTimer=setTimeout(()=>t.classList.remove("show"),3200);}
}
function download(name,text){
 const b=new Blob([text],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(b),a=el("a");
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);
}
function setInput(text,opts={}){
 $("#migration-paste").value=text;source=text;lastFormat=opts.format||"text";fileName=opts.filename||"";
 sourceWarnings=opts.warnings||[];$("#migration-results").hidden=true;
 alertUser((fileName?fileName:"Pasted character")+" ready · "+text.length.toLocaleString()+" characters. Analyze to see proposed changes.");
}
async function readFile(file){
 if(!file)return;
 const b=$("#migration-analyze");b.disabled=true;b.textContent="Extracting document…";
 try{setInput((await engine().extract(file)).text,{});}catch(e){alertUser(e.message||"Could not read the file.",true);}
 finally{b.disabled=false;b.textContent="✦ Analyze & Optimize for Tipsy";}
}
async function readImportedFile(file){
 if(!file)return;
 const button=$("#migration-analyze");button.disabled=true;button.textContent="Extracting document…";
 try{
   const result=await engine().extract(file);
   setInput(result.text,{format:result.format,filename:result.filename,warnings:result.warnings});
 }catch(e){alertUser(e.message||"Could not read file.",true);}
 finally{button.disabled=false;button.textContent="✦ Analyze & Optimize for Tipsy";}
}
function analyze(input,format,mode){
 const raw=input===undefined?$("#migration-paste").value.trim():input;
 if(!raw || typeof raw==="string"&&!raw.trim())throw Error("Paste a character or select a file first.");
 if(typeof raw==="string"&&raw.length>850000)throw Error("Please select only the character-relevant pages (maximum 850,000 characters).");
 const detected=format||(typeof raw==="string"&&/^\s*\{/.test(raw)?"json":lastFormat);
 current=engine().analyze(raw,{format:detected,mode:mode||($('input[name="migration-style"]:checked')||{}).value||"tuned"});
 render(current);return current;
}
function render(result){
 const name=result.fields.name||"Imported character";
 $("#migration-summary").textContent=name+" — proposed field mapping";
 $("#migration-count").textContent=result.review.length+" fields";
 $("#migration-note").textContent="Source preserved. Your existing draft is unchanged until you click Apply Selected Changes.";
 const insights=$("#migration-insights");insights.replaceChildren();
 const note=(txt,good=false)=>{const a=el("p",good?"migrate-insight good":"migrate-insight warn",txt);insights.append(a);};
 note(result.review.length+" usable sections detected. Review and edit each proposed field.",true);
 sourceWarnings.forEach(s=>note(s));
 result.tips.slice(0,7).forEach(s=>note(s));
 if(result.unmapped)note("Some source text could not be assigned confidently. Preserve and review the full original.");
 const leftovers=$("#migration-leftovers");leftovers.hidden=!Boolean(result.unmapped);
 $("#migration-leftovers-text").textContent=result.unmapped||"";
 const dest=$("#migration-diff");dest.replaceChildren();
 const existing=app().getData(),known=new Set(app().keys());
 result.review.sort((a,b)=>(priority.indexOf(a.key)+100)%100-(priority.indexOf(b.key)+100)%100).forEach(item=>{
   if(!known.has(item.key))return;
   const card=el("article","migrate-review-card");
   const head=el("div","migrate-review-head"),label=el("label","migrate-review-label");
   const checkbox=el("input");checkbox.type="checkbox";checkbox.checked=true;checkbox.dataset.migrationSelect=item.key;
   label.append(checkbox,el("b","",labels[item.key]||item.key));
   head.append(label,el("span","migrate-review-confidence",item.confidence));
   const body=el("div","migrate-review-body");
   body.append(el("p","migrate-review-reason",item.reason));
   const edit=el("textarea","migrate-review-editor");
   edit.value=Array.isArray(item.value)?item.value.join(", "):String(item.value);
   edit.rows=Math.min(9,Math.max(3,Math.ceil(edit.value.length/90)));
   edit.dataset.migrationField=item.key;edit.setAttribute("aria-label","Edit imported "+(labels[item.key]||item.key));
   const budget=el("div","migrate-review-budget");
   const recount=()=>budget.textContent=token(edit.value)+" estimated tokens · "+edit.value.length+" characters";
   edit.addEventListener("input",recount);recount();body.append(edit,budget);
   const prev=existing[item.key];
   if(prev && String(prev)!==String(item.value)){
     const d=el("details","migrate-old"),s=el("summary","migrate-old-summary","Compare your current Atelier draft"),pre=el("pre","",Array.isArray(prev)?prev.join(", "):String(prev));
     d.append(s,pre);body.append(d);
   }
   card.append(head,body);dest.append(card);
 });
 $("#migration-results").hidden=false;
 $("#migration-results").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
}
function changes(){
 const patch={},tags=new Set(app().tags());
 $$("[data-migration-field]").forEach(a=>{
    const k=a.dataset.migrationField,c=$('[data-migration-select="'+k+'"]');
    if(!c?.checked||!a.value.trim())return;
    if(k==="tags")patch.tags=Array.from(new Set(a.value.split(/[,;\n]+/g).map(x=>x.trim()).filter(x=>tags.has(x)))).slice(0,10);
    else patch[k]=a.value;
 });
 return patch;
}
function apply(){
 if(!current){alertUser("Analyze a character first.",true);return;}
 const patch=changes();
 if(!Object.keys(patch).length){alertUser("Select at least one field to apply.",true);return;}
 const replace=($('input[name="migration-merge"]:checked')||{}).value==="replace";
 if(replace&&!confirm("Replace selected existing draft fields? Download a JSON backup first if you want an undo point."))return;
 const result=app().apply(patch,{replace});
 if(!result.applied.length){alertUser("No empty fields to fill. Select Replace selected fields to overwrite existing writing.",true);return;}
 alertUser(result.applied.length+" fields applied. Review the five Atelier chapters before publishing.");
 app().go("concept");
}
function example(){
 const sample=[
 "# Character Name","Edda Varick","","# Age","36","","# Personality",
 "Edda is a meticulous mountain rescue pilot. She hides fear behind clipped humor; when someone ignores a warning, she becomes very quiet instead of angry.",
 "","# Appearance","Windburned, cropped auburn hair, red weatherproof jacket, silver aviation watch.",
 "","# Voice","Dry understatement and short replies under pressure.",
 "","# Backstory","Three winters ago, a failed rescue cost her a teammate. She now triple-checks weather reports and never promises anyone a safe flight.",
 "","# Scenario","A winter storm closes the mountain pass. {{user}} brings a distress call from an abandoned station.",
 "","# User Role","{{user}} is an adult traveler carrying an emergency call; their emotions and choices remain their own.",
 "","# Relationship","Wary strangers who may become allies under pressure.",
 "","# First Message",
 '*The hangar doors shudder in the wind. Edda flattens the distress map against her workbench.* "Those coordinates have not had a signal in nine years." *She looks at {{user}}.* "Tell me exactly where you found this."',
 "","# Example Dialogue",
 '{{user}}: "Are you afraid of flying?"',
 '{{char}}: "Of the weather? No." *Edda checks the ceiling fan that has stopped turning.* "Of people who think courage means ignoring it? Every day."'
 ].join("\n");
 setInput(sample,{filename:"sample-character.md"});
 alertUser("Example character loaded. Click Analyze to migrate it.");
}
function jsonResponse(text){
 let raw=String(text||"").trim();
 // Strip optional Markdown code fences without embedding the fence delimiter in this script.
 const ticks=String.fromCharCode(96).repeat(3);
 if(raw.startsWith(ticks))raw=raw.replace(new RegExp("^"+ticks+"(?:json)?\\s*","i"),"").replace(new RegExp("\\s*"+ticks+"$"),"").trim();
 const a=raw.indexOf("{"),b=raw.lastIndexOf("}");
 if(a>=0&&b>a)raw=raw.slice(a,b+1);
 return JSON.parse(raw);
}
function aiRequest(){
 const raw=$("#migration-paste").value.trim()||source;
 if(!raw)throw Error("Import or paste the original character first.");
 const keys=["title","name","age","gender","rating","hook","userRole","tease","trope","appearance","personality","contradiction","voice","mannerisms","occupation","surfaceGoal","hiddenGoal","backstory","anchors","setting","lore","scenario","relationship","supporting","canon","customGreeting","sampleUser1","sampleChar1","sampleUser2","sampleChar2","sampleUser3","sampleChar3"];
 const guidance=[
 "TASK: Rewrite this existing, creator-owned AI roleplay character into an optimized Tipsy character JSON export.",
 "Return ONLY a JSON object with these allowed property names: "+keys.join(", ")+". Each value must be a string. Omit fields without supporting evidence.",
 "Preserve established canon: name, age, identity, motivations, contradictions, knowledge limits, appearance, relationships, world facts, secrets, and plot logic. Do not invent facts or alter existing history.",
 "Make personality behaviorally specific: disposition + trigger + visible reaction + conflicting need. Replace repeated adjectives with actions. State sentence rhythm and speech patterns.",
 "Develop a concise public-facing hook with conflict, stakes and a roleplay entry point. Keep {{user}}'s gender, actions, thoughts and decisions open unless the source explicitly sets a required role.",
 "Write a first message with *narration*, spoken dialogue in double quotes, and an unresolved choice. The bot must not speak for {{user}}.",
 "Write 2–3 contrasting pairs of example dialogue. Separate user prompts into sampleUser1/2/3 and character replies into sampleChar1/2/3, without prefixed role labels.",
 "Keep essential world rules and constraints; remove duplicate prose. An ensemble or investigation may need more tokens. No arbitrary length guarantee.",
 "Tipsy’s guide recommends roughly 700–800 tokens across personality and example dialogues combined, with about 250–350 example-dialogue tokens. These are guidelines, not limits. Prioritize quality.",
 "All characters participating in romance are adults. Public-facing materials must satisfy Tipsy's content standards.",
 "No Markdown code fences, no commentary, no HTML. Do not output unknown keys.",
 "MAPPED FIELDS FOR REFERENCE (possibly imperfect):",
 JSON.stringify(current?.fields||{},null,2),
 "ORIGINAL SOURCE — authoritative:",
 raw.slice(0,65000),
 "Return ONLY the valid revised JSON object."
 ];
 return guidance.join("\n\n");
}
async function copy(text){
 try{await navigator.clipboard.writeText(text);return true;}
 catch{
   const area=el("textarea");area.value=text;area.style.position="fixed";area.style.left="-9999px";
   document.body.append(area);area.select();let ok=false;try{ok=document.execCommand("copy")}catch{}area.remove();return ok;
 }
}
async function handoff(){
 try{
  const text=aiRequest();
  if(await copy(text))alertUser("Upgrade instructions copied. Paste into ChatGPT; return with the JSON result.");
  else{download("velvetruin-tipsy-ai-upgrade-brief.txt",text);alertUser("Saved a text file with the AI upgrade instructions.");}
 }catch(e){alertUser(e.message,true);}
}
function fromAI(text){
 try{
  const value=jsonResponse(text),data=value.project||value.fields||value;
  current=engine().analyze(data,{mode:"faithful",format:"json"});
  render(current);alertUser("AI rewrite imported for review. No changes have been applied yet.");
 }catch(e){alertUser("AI JSON could not be parsed: "+e.message,true);}
}
function init(){
 if(!engine()||!app()){console.error("Migration Studio requires the original Atelier script.");return;}
 const file=$("#migration-file"),drop=$("#migration-dropzone");
 file.addEventListener("change",()=>readImportedFile(file.files?.[0]));
 drop.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();file.click();}});
 ["dragenter","dragover"].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.add("dragging");}));
 ["dragleave","drop"].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.remove("dragging");}));
 drop.addEventListener("drop",e=>{if(e.dataTransfer?.files?.length)readImportedFile(e.dataTransfer.files[0]);});
 $("#migration-paste").addEventListener("input",()=>{lastFormat="text";fileName="";$("#migration-results").hidden=true;});
 $("#migration-example").addEventListener("click",example);
 $("#migration-analyze").addEventListener("click",()=>{
   try{analyze();alertUser("Character mapped. Review and select improvements before applying.");}
   catch(e){alertUser(e.message,true);}
 });
 $("#migration-select-all").addEventListener("click",()=>$$("[data-migration-select]").forEach(b=>b.checked=true));
 $("#migration-select-none").addEventListener("click",()=>$$("[data-migration-select]").forEach(b=>b.checked=false));
 $("#migration-apply").addEventListener("click",apply);
 $("#migration-copy-source").addEventListener("click",()=>{
   if(!source&&!$("#migration-paste").value.trim()){alertUser("No source to save.",true);return;}
   download((fileName||"character").replace(/\.[^.]+$/,"").replace(/[^a-z0-9_-]+/gi,"-")+"-original.txt",source||$("#migration-paste").value);
   alertUser("Original character text saved.");
 });
 $("#migration-copy-ai").addEventListener("click",handoff);
 $("#migration-import-ai").addEventListener("click",()=>$("#migration-ai-file").click());
 $("#migration-ai-file").addEventListener("change",async e=>{
   const f=e.target.files?.[0];e.target.value="";if(!f)return;
   try{if(f.size>1000000)throw Error("AI JSON must be smaller than 1 MB.");fromAI(await f.text());}
   catch(err){alertUser(err.message,true);}
 });
 $("#migration-ai-parse").addEventListener("click",()=>fromAI($("#migration-ai-paste").value));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();