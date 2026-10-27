/* Fizzz Optimized Bot Compiler: original fields untouched; approved copy drives export. */
(()=>{
"use strict";
const $=s=>document.querySelector(s),ORDER=["occupation","species","appearance","backstory","traits","contradiction","motivation","relationship","behavior","boundaries","voice"];
const LABELS=["Identity & Role","Species & Biology","Appearance","Causal Background","Observable Personality","Internal Contradiction","Goals & Lasting Drive","Relationship With {{user}}","Growth & Pressure","Agency & Boundaries","Speaking Style"];
const BUDGET=[520,800,950,850,1500,650,720,1120,980,1050,760];
let version=null,accepted=false,base="";
const src=()=>window.FizzzAtelier?.getState()||{};
const tidy=s=>String(s||"").replace(/\r\n?/g,"\n").trim();
const norm=s=>tidy(s).toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
function fingerprint(){let h=2166136261;const data=src();for(const k of [...ORDER,"title","name","age","gender","creationDate","pov","rating","bio","initialRaw"]){for(const c of String(data[k]||"")){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}}return String(h>>>0)}
const selected=()=>accepted&&version&&base===fingerprint()?version:null;
const selectedText=k=>selected()?(k==="core"?selected().core:k==="opening"?selected().opening:null):null;
const selectedProfile=()=>selected()?{title:selected().title,bio:selected().bio}:null;
const selectedWorld=i=>{const s=src(),p="world"+i;return{title:s[p+"Title"]||"",mode:s[p+"Mode"]||"keyword",keywords:s[p+"Keywords"]||"",content:s[p+"Body"]||""};};
const intro=()=>tidy(src().initialRaw)||["openingScene","openingAction","openingLine","openingBeat"].map(k=>tidy(src()[k])).filter(Boolean).join("\n\n");
function fullCore(){const s=src(),out=["# "+(s.name||"Character")+" — Fizzz Core Personality"];if(s.age)out.push("Age: "+s.age);if(s.gender)out.push("Gender: "+s.gender);ORDER.forEach((k,i)=>{if(tidy(s[k]))out.push("\n## "+LABELS[i]+"\n"+tidy(s[k]))});if(ORDER.filter(k=>tidy(s[k])).length<5&&tidy(s.coreRaw))out.push("\n## PRESERVED ORIGINAL SOURCE — UNCLASSIFIED (SORT BEFORE PUBLISHING)\n"+tidy(s.coreRaw));return out.join("\n")}
function close(a,b){const x=new Set(norm(a).split(" ").filter(w=>w.length>=4)),y=new Set(norm(b).split(" ").filter(w=>w.length>=4));let n=0;for(const t of x)if(y.has(t))n++;return x.size&&y.size&&n/Math.min(x.size,y.size)>.88&&n/Math.max(x.size,y.size)>.53}
function weight(str,key){let w=2;const t=norm(str);
 if(/never|must|cannot|do not|not automatically|without consent|agency|autonomy|choice/.test(t))w+=5;
 if(/wolf|symbol|transform|compatible|family|gender|scent|scar|tattoo|eyes|age/.test(t))w+=3;
 if(/marriage|relationship|bond|trust|attraction|protect|jealousy/.test(t))w+=3;
 if(key==="voice"&&/speak|dialogue|humor|voice|silent/.test(t))w+=3;
 if(key==="relationship"&&/user|refuse|arranged|no existing/.test(t))w+=4;
 return w;
}
function coreCompile(mode){
 const full=fullCore(),source=src();
 // Never discard a fallback import merely because its labels were not mapped.
 // The entire source remains visible until the creator sorts it into fields.
 if(mode==="full"||(tidy(source.coreRaw)&&ORDER.filter(k=>tidy(source[k])).length<5))return {text:full,removed:0,original:full.length};
 const groups=[],seen=[],s=src(),short=mode==="lean"?0.81:1,limit=mode==="lean"?8500:9900;let total=0;
 for(let i=0;i<ORDER.length;i++){
  const key=ORDER[i],items=[],lines=tidy(s[key]).split("\n");let heading="";
  for(const raw of lines){const t=raw.trim();if(!t)continue;if(/^#{2,5}\s/.test(t)){heading=t;continue}
   if(t.length<9||seen.some(x=>close(x,t)))continue;seen.push(t);items.push({text:t,heading,score:weight(t,key)});}
  total+=items.length;let used=0;
  const keep=[];for(const item of [...items].sort((a,b)=>b.score-a.score)){if(used+item.text.length<=BUDGET[i]*short||!keep.length){keep.push(item);used+=item.text.length+2}}
  groups.push(keep.sort((a,b)=>items.indexOf(a)-items.indexOf(b)));
 }
 function output(){let o=["# "+(s.name||"Character")+" — Optimized Fizzz Core"];if(s.age)o.push("Age: "+s.age);if(s.gender)o.push("Gender: "+s.gender);
  groups.forEach((group,i)=>{if(!group.length)return;o.push("\n## "+LABELS[i]);let head="";
   group.forEach(line=>{if(line.heading&&head!==line.heading){o.push(line.heading);head=line.heading;}o.push(line.text)})});return o.join("\n").trim();}
 let text=output();while(text.length>limit){let pool=[];groups.forEach((g,i)=>{if(g.length>2)g.forEach((v,j)=>pool.push({i,j,score:v.score}))});pool.sort((a,b)=>a.score-b.score);if(!pool.length)break;groups[pool[0].i].splice(pool[0].j,1);text=output();}
 return {text,removed:total-groups.reduce((n,x)=>n+x.length,0),original:full.length};
}
/* The old extractor selected scattered paragraphs because of regex keyword hits,
   producing incoherent dialogue snippets. Preserve complete public prose by default.
   Any shorter creative rewrite must be reviewed as a complete replacement. */
function bioCompile(){
 return tidy(src().bio);
}
function bioIntegrity(candidate,original){
 const text=tidy(candidate),sourceText=tidy(original),notes=[];
 if(!text)notes.push("Compiled Public Bio is missing.");
 if(sourceText.length>800&&text.length<Math.max(350,sourceText.length*.48))
  notes.push("Bio is suspiciously short compared with its source; the character, conflict, and player choice may have been lost.");
 const player=/\b(you|your|yours)\b|\{\{user\}\}/i;
 if(player.test(sourceText)&&!player.test(text))notes.push("The player-facing entry point is missing.");
 const markdown=text.replace(/\\\*/g,""),d=(markdown.match(/\*\*/g)||[]).length,s=(markdown.replace(/\*\*/g,"").match(/\*/g)||[]).length;
 if(d%2||s%2)notes.push("Unbalanced Markdown emphasis in public bio.");
 if(/\uFFFC|\uFFFD/.test(text))notes.push("Broken or invisible object marker in public bio.");
 return notes;
}
function checks(d){const m=[...bioIntegrity(d.bio,src().bio)];if(d.core.length>25000)m.push("Core exceeds 25,000 characters.");else if(d.core.length>10000)m.push("Core exceeds recommended 10,000 characters.");
 if(d.opening.length>5000)m.push("Opening exceeds 5,000 characters.");
 return m;}
function compile(mode="balanced"){const s=src(),c=coreCompile(mode);
 version={title:tidy(s.title),bio:bioCompile(),core:c.text,opening:intro(),originalCore:c.original,removed:c.removed,mode,notes:[],bioQualityV2:true};version.notes=checks(version);
 base=fingerprint();accepted=false;save();render();return version;}
function save(){window.FizzzSessionPrivacy?.edited?.();}
function load(){/* No autosave. Only the current tab's JS memory is used. */}
function snapshot(){
 return {version:version?JSON.parse(JSON.stringify(version)):null,accepted,base};
}
function restoreSnapshot(saved){
 if(saved?.version&&typeof saved.version.core==="string"&&typeof saved.version.opening==="string"){
  version=JSON.parse(JSON.stringify(saved.version));
  accepted=Boolean(saved.accepted);
  base=String(saved.base||"");
  if(base!==fingerprint())accepted=false;
  version.notes=checks(version);
  render();
  message(accepted?"Compiled character restored from a manually uploaded backup.":"Compiled draft restored for review from a manually uploaded backup.");
 }else{
  version=null;accepted=false;base="";
  for(const key of ["title","bio","core","opening"]){const area=$("#compiled-"+key);if(area)area.value="";}
  const measure=$("#compiler-measure");if(measure)measure.textContent="Nothing compiled yet. Start with an import or blank character.";
  const approve=$("#compiler-approve");if(approve)approve.disabled=true;
  const selected=$("#compiler-selected");if(selected)selected.textContent="No compiled draft selected. All character data exists only until this tab closes.";
  message("Fresh in-memory character. No compiler draft is stored or restored automatically.");
 }
}
function message(t){const x=$("#compiler-status");if(x)x.textContent=t}
function render(skipFields=false){if(!version)return;
 for(const k of ["title","bio","core","opening"]){const x=$("#compiled-"+k);if(x&&!skipFields)x.value=version[k]}
 $("#compiler-measure").textContent="Original core "+version.originalCore.toLocaleString()+" chars → compiled "+version.core.length.toLocaleString()+" chars; "+version.removed+" repetitive/secondary source lines omitted.";
 $("#compiler-warnings").textContent=version.notes.length?version.notes.map(x=>"• "+x).join("\n"):"✓ Character card text is within the structural checks. Worldbooks transfer separately.";
 $("#compiler-approve").disabled=!version.core||!version.opening||version.core.length>25000||version.opening.length>5000||bioIntegrity(version.bio,src().bio).length>0;
 $("#compiler-selected").textContent=selected()?"✓ Approved compiled version selected for all final exports.":accepted&&base!==fingerprint()?"Source changed; recompile before export.":"Compiled text is not yet approved; original text remains the export source. The full public bio is retained by default.";
}
function edit(){if(!version)return;for(const k of ["title","bio","core","opening"])version[k]=$("#compiled-"+k).value;version.notes=checks(version);accepted=false;save();render(true)}
function approve(){if(!version)return;if(base!==fingerprint())return message("Source fields changed since compilation. Recompile before approving.");if(version.core.length>25000||version.opening.length>5000)return message("Exceeds Fizzz length limits."); const problems=bioIntegrity(version.bio,src().bio);if(problems.length)return message("Bio needs review: "+problems.join(" "));accepted=true;save();render();window.FizzzAtelier?.refreshReview?.();message("Approved. Existing TXT, DOCX and JSON outputs will now use this compiled core, public bio and greeting.");}
function undo(){accepted=false;save();render();window.FizzzAtelier?.refreshReview?.();message("Original fields restored as export source. Edited compiled version remains in this tab only.");}
const filename=()=>tidy(src().name||"character").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"character";
function file(name,content,type="application/json"){const b=content instanceof Blob?content:new Blob([content],{type}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}
function publishing(){
 const s=src(),d=selected();
 if(!d)throw Error("Approve your compiled character first.");
 return {format:"Fizzz Publishing Fields",version:3,
  note:"Character-only package: Worldbooks and Media/Voice settings are deliberately excluded. Add each Worldbook separately in Fizzz using the dedicated transfer controls. Native one-click import is unverified.",
  profile:{title:d.title,name:s.name,age:s.age,gender:s.gender,pov:s.pov,rating:s.rating,created:s.creationDate,bio:d.bio,warning:s.warning,tags:window.FizzzAtelier?.getTags?.()||[]},
  core_personality:d.core,initial_message:d.opening};
}
function card(){
 const f=publishing(),s=f.profile;
 return {spec:"chara_card_v2",spec_version:"2.0",data:{
  name:s.name,description:f.core_personality,personality:"",scenario:"",first_mes:f.initial_message,mes_example:"",
  creator_notes:"Portable Character Card V2. Worldbooks are separate and NOT embedded. This is not a verified native Fizzz bulk import. Public Bio: "+s.bio,
  system_prompt:"",post_history_instructions:"",alternate_greetings:[],tags:s.tags,creator:"",character_version:"1.0",
  extensions:{fizzz:{title:s.title,bio:s.bio,age:s.age,pov:s.pov,rating:s.rating,created:s.created}}
 }};
}
function crc(bytes){let c=-1;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^-1)>>>0}
function num(n){const a=new Uint8Array(4);new DataView(a.buffer).setUint32(0,n,false);return a}
function embed(buffer,text){
 const bytes=new Uint8Array(buffer),name=new TextEncoder().encode("tEXt"),payload=new TextEncoder().encode("chara\0"+text),body=new Uint8Array(payload.length+4),chunk=new Uint8Array(payload.length+12);
 body.set(name);body.set(payload,4);chunk.set(num(payload.length),0);chunk.set(body,4);chunk.set(num(crc(body)),8+payload.length);
 let at=8,point=-1;while(at+12<=bytes.length){const n=new DataView(bytes.buffer,bytes.byteOffset+at,4).getUint32(0,false),t=String.fromCharCode(...bytes.slice(at+4,at+8));if(t==="IEND"){point=at;break}at+=n+12}
 if(point<0)throw Error("Invalid PNG");const result=new Uint8Array(bytes.length+chunk.length);result.set(bytes.slice(0,point));result.set(chunk,point);result.set(bytes.slice(point),point+chunk.length);return result;
}
function b64(x){const t=new TextEncoder().encode(x);let s="";for(let i=0;i<t.length;i+=8192)s+=String.fromCharCode(...t.slice(i,i+8192));return btoa(s)}
async function art(format="9:16"){
 const can=document.createElement("canvas");can.width=900;can.height=format==="3:4"?1200:1600;
 const ctx=can.getContext("2d"),imgFile=$("#export-png-image")?.files?.[0];
 if(imgFile){const url=URL.createObjectURL(imgFile);try{const im=new Image();await new Promise((r,j)=>{im.onload=r;im.onerror=j;im.src=url});const scale=Math.max(can.width/im.naturalWidth,can.height/im.naturalHeight),w=im.naturalWidth*scale,h=im.naturalHeight*scale;ctx.drawImage(im,(can.width-w)/2,(can.height-h)/2,w,h)}finally{URL.revokeObjectURL(url)}}
 else{ctx.fillStyle="#231624";ctx.fillRect(0,0,can.width,can.height);ctx.fillStyle="#e5c9a1";ctx.textAlign="center";ctx.font="48px Georgia";ctx.fillText(src().name||"Character",450,can.height/2);ctx.font="21px Georgia";ctx.fillText("Choose an optional portrait in Compile & Export",450,can.height/2+40);}
 return new Promise((r,j)=>can.toBlob(b=>b?b.arrayBuffer().then(r,j):j(Error("Could not encode card")),"image/png"));}
async function cardPNG(){const c=card(),pic=await art(),result=embed(pic,b64(JSON.stringify(c)));file(filename()+"-portable-card-v2.png",new Blob([result],{type:"image/png"}));message("Portable PNG saved with embedded Character Card V2 metadata. Fizzz may read it only as an image.");}
async function cover(){publishing();const b=await art("3:4");file(filename()+"-fizzz-cover-3x4.png",new Blob([b],{type:"image/png"}));message("3:4 cover art created for separate upload to Fizzz.");}
function aiBrief(mode="complete"){const scope=["bio","core","opening","complete"].includes(mode)?mode:"complete";const task={complete:"Rewrite title, public bio, complete Markdown Core Personality and complete Initial Message as one internally consistent, finished Fizzz character.",bio:"Rewrite only the PUBLIC BIO as a complete standalone and engaging romance description. Preserve the full connected premise, name, character voice, emotional stakes, player role and choice; improve narrative flow, not just reduce length.",core:"Rewrite only the COMPLETE CORE PERSONALITY as structured Markdown for reliable roleplay. Preserve age, appearance, history, motives, agency rules and distinctive dialogue; speaking style must remain last.",opening:"Rewrite only the COMPLETE INITIAL MESSAGE in the original novelistic voice, keeping scene logic, player agency, spoken dialogue, and a playable ending."};return [
 "SPECIFIC CREATIVE TASK: "+task[scope],
 "Source-faithfully optimize this complete Fizzz character. Preserve names, ages, relationship facts, motive, history, setting, original scene/dialogue and player agency. Add no new canon. Improve immediate romantic hook and distinct voice; retain meaningful flaws.",
 "Fizzz Core Personality ≤25,000 characters; recommend ≤10,000. Initial Message ≤5,000. Speaking style last. Worldbooks are separate. Do not invent absent Worldbooks.",
 scope==="complete" ? "Return EXACT JSON with all four COMPLETE finished fields: {title, bio, core, opening, changeLog:[{field,why}]}; never return editing instructions instead of the replacement. Markdown belongs inside each JSON string. No code fences." : "Return EXACT JSON: {\"target\":\""+scope+"\",\"replacement\":\"THE ENTIRE IMPROVED "+scope.toUpperCase()+" FIELD\",\"changeLog\":[{\"field\":\""+scope+"\",\"why\":\"WHAT WAS IMPROVED\"}]}. The replacement must include the full field text, not an excerpt. Markdown belongs inside the JSON string. Do not include other fields.",
 "PUBLIC BIO: Preserve the full connected romance premise and distinctive character appeal. Improve genuine weaknesses in complete narrative paragraphs, not by extracting isolated taglines, abbreviating developed prose, or joining dialogue snippets. A strong existing bio may require only subtle edits.",
 "CORE: Produce a cohesive model-readable Markdown character specification. Retain distinct quirks, emotional conflict, independent motives, agency rules, and speaking style last, while reducing truly redundant instructions.",
 "FIRST MESSAGE: Preserve the original fully playable novel-style scene, character dialogue, logical continuity, and a clear choice for the player. Rewrite only if it improves the prose and pacing.",
 "CHANGE LOG: For each actual edit, explain the specific writing improvement. If no change is necessary, preserve original exactly and explain why in changeLog.",
 "TITLE:\n"+src().title,"BIO:\n"+src().bio,"CORE:\n"+fullCore(),"OPENING:\n"+intro(),
 "Worldbooks are edited and uploaded separately; do NOT copy their complete lore into Core Personality or the final character card."
 ].join("\n\n")}
function aiImport(){
 try{
  const raw=$("#compiler-ai-json").value.trim();
  if(!raw)throw Error("Paste a complete JSON answer from ChatGPT first.");
  const txt=raw.replace(/^\x60{3}(?:json)?\s*/i,"").replace(/\x60{3}\s*$/,"");
  const response=JSON.parse(txt),o=response.fields||response;
  if(!version)compile("balanced");
  const updates={};
  if(o.target){
   if(!["bio","core","opening","title"].includes(o.target)||typeof o.replacement!=="string"||!o.replacement.trim())throw Error("AI reply must include a recognized target and complete replacement string.");
   updates[o.target]=o.replacement;
  }else{
   for(const k of ["title","bio","core","opening"])if(typeof o[k]!=="string"||!o[k].trim())throw Error("Missing complete string field: "+k);
   for(const k of ["title","bio","core","opening"])updates[k]=o[k];
  }
  const proposed={...version,...updates};
  if(proposed.core.length>25000||proposed.opening.length>5000)throw Error("Proposed core or greeting exceeds Fizzz limits.");
  const bad=bioIntegrity(proposed.bio,src().bio);
  if(bad.length)throw Error("Public bio needs revision: "+bad.join(" "));
  version={...proposed,notes:[],changeLog:Array.isArray(response.changeLog)?response.changeLog:[],mode:"ChatGPT creative rewrite",bioQualityV2:true};
  version.notes=checks(version);accepted=false;base=fingerprint();save();render();
  const report=$("#compiler-ai-report");
  if(report)report.textContent=version.changeLog.length?version.changeLog.map(x=>"• "+String(x.field||"field")+": "+String(x.why||"specific improvement")).join("\n"):"The AI provided no change log. Compare the proposed text to the original before approving.";
  message("✓ ChatGPT generated complete "+(o.target||"character")+" replacement for review. Your original is unchanged. Approve the compiled bot only when satisfied.");
 }catch(e){message("ChatGPT proposal not applied: "+e.message)}
}
function mount(){
 const panel=$("#panel-output");if(!panel)return;const box=document.createElement("section");box.className="compiler-box";box.innerHTML=[
 '<div class="eyebrow">FINAL BOT COMPILER</div><h3>Build the finished <em>Fizzz character.</em></h3>',
 '<p class="muted">Compile a standalone, concise and editable character from imported facts. Source text is never overwritten or silently retconned. Deeper prose rewrites use an optional ChatGPT handoff.</p>',
 '<div class="actions"><label>Detail level <select id="compiler-mode"><option value="balanced">Recommended core (~10k)</option><option value="lean">Lean core (~8.5k)</option><option value="full">All source facts (≤25k)</option></select></label><button class="primary" id="compiler-start">✦ Compile Finished Bot</button><button id="compiler-original">↶ Use Original</button></div>',
 '<p class="muted" id="compiler-measure">Import a bot and press Compile Finished Bot.</p>',
 '<div class="field wide"><label>Final Public Title</label><input id="compiled-title" type="text"></div>',
 '<div class="field wide"><label>Final Public Bio</label><textarea id="compiled-bio" rows="8"></textarea></div>',
 '<div class="field wide"><label>Final Core Personality</label><textarea id="compiled-core" rows="23"></textarea></div>',
 '<div class="field wide"><label>Final Initial Message</label><textarea id="compiled-opening" rows="16"></textarea></div>',
 '<pre id="compiler-warnings" class="compiler-diagnostics">No compiled version yet.</pre>',
 '<div class="actions"><button class="primary" id="compiler-approve" disabled>✓ Use Compiled Bot for Exports</button><button id="compiler-publishing">↓ Fizzz Publishing JSON</button></div>',
 '<p id="compiler-selected" class="hint">Original fields currently drive exports.</p>',
 '<details><summary>✧ Deep creative rewrite with AI (optional and reviewable)</summary><p class="muted">This static GitHub site has no secure generative AI backend. Copy the detailed source prompt into ChatGPT and paste back complete proposed JSON; nothing changes until you approve.</p><button id="compiler-copy-ai">Copy Source-Aware AI Brief</button><textarea id="compiler-ai-json" rows="5" placeholder="Paste JSON returned from ChatGPT"></textarea><button id="compiler-import-ai">Review AI Proposal</button></details>',
 '<h4>Portable character card & Fizzz art</h4><p class="muted">The portable Character Card PNG/JSON contains only your approved profile, Core Personality and Initial Message. It never embeds Worldbooks. Transfer lore separately with the Worldbook controls. This is not a verified native Fizzz one-click character import.</p>',
 '<div class="actions"><button id="compiler-card-png">↓ Character Card PNG (data embedded)</button><button id="compiler-card-json">↓ Character Card V2 JSON</button><button id="compiler-cover">↓ 3:4 Fizzz Cover PNG</button></div>',
 '<p id="compiler-status" class="muted" role="status">Optional: choose a portrait in the Export section above for a character-art PNG. The PNG card contains no Worldbooks.</p>'
 ].join("");
 for(const input of box.querySelectorAll("input,textarea"))input.setAttribute("autocomplete","off");
  const anchor=panel.querySelector(".output-tools");if(anchor)anchor.parentNode.insertBefore(box,anchor);else panel.append(box);
 const click=(id,fn)=>$("#"+id).addEventListener("click",()=>Promise.resolve().then(fn).catch(e=>message(e.message)));
 click("compiler-start",()=>{compile($("#compiler-mode").value);message("Bot compiled. Review the optimized Core and Bio, then approve for publication.");});
 click("compiler-original",undo);click("compiler-approve",approve);
 for(const k of ["title","bio","core","opening"])$("#compiled-"+k).addEventListener("input",edit);
 click("compiler-publishing",()=>file(filename()+"-fizzz-fields.json",JSON.stringify(publishing(),null,2)));
 click("compiler-card-png",cardPNG);click("compiler-card-json",()=>file(filename()+"-portable-v2.json",JSON.stringify(card(),null,2)));
 click("compiler-cover",cover);
 click("compiler-copy-ai",()=>navigator.clipboard.writeText(aiBrief()).then(()=>message("Source-aware AI editing brief copied.")));
 click("compiler-import-ai",aiImport);
 load();if(version)render();
}
const css=document.createElement("style");css.textContent='.compiler-box{padding:22px;margin:28px 0;border:1px solid #bb9677;border-radius:13px;background:linear-gradient(120deg,#342139,#18121b)}.compiler-box h3{font:600 39px Georgia,serif;margin:8px 0}.compiler-box h3 em{color:#dfb8c9}.compiler-box h4{font:600 26px Georgia,serif}.compiler-box .field{margin:14px 0}.compiler-box .field input,.compiler-box .field textarea{width:100%;background:#100d15;border:1px solid #79576b;border-radius:7px;color:#f7e9f0;padding:10px;font:13px/1.6 sans-serif}.compiler-box #compiled-core{min-height:420px}.compiler-box #compiled-opening{min-height:290px}.compiler-box .actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:13px 0}.compiler-box select{background:#15101a;color:#fff;padding:8px}.compiler-diagnostics{white-space:pre-wrap;background:#110d16;padding:13px;border-left:3px solid #d8b785;line-height:1.7}.compiler-box details{padding:14px;border:1px solid #71566c;border-radius:8px;margin:14px 0}.compiler-box summary{cursor:pointer;color:#dfbf90}.compiler-box #compiler-ai-json{width:100%;display:block;min-height:130px;background:#100c14;color:white;margin:12px 0;padding:10px}';document.head.append(css);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.VelvetRuinFizzzCompiler=Object.freeze({selected,selectedText,selectedProfile,selectedWorld,compile,card,publishing,fullCore,aiBrief,snapshot,restoreSnapshot});
})();