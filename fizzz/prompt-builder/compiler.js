/* Fizzz Optimized Bot Compiler: original fields untouched; approved copy drives export. */
(()=>{
"use strict";
const $=s=>document.querySelector(s),ORDER=["occupation","species","appearance","backstory","traits","contradiction","motivation","relationship","behavior","boundaries","voice"];
const LABELS=["Identity & Role","Species & Biology","Appearance","Causal Background","Observable Personality","Internal Contradiction","Goals & Lasting Drive","Relationship With {{user}}","Growth & Pressure","Agency & Boundaries","Speaking Style"];
const BUDGET=[520,800,950,850,1500,650,720,1120,980,1050,760],STORE="vr.fizzz.compiled.v2";
let version=null,accepted=false,base="";
const src=()=>window.FizzzAtelier?.getState()||{};
const tidy=s=>String(s||"").replace(/\r\n?/g,"\n").trim();
const norm=s=>tidy(s).toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
function fingerprint(){let h=2166136261;const data=src();for(const k of [...ORDER,"title","name","age","gender","creationDate","pov","rating","bio","initialRaw","world1Body","world2Body","world3Body","world1Title","world2Title","world3Title","world1Mode","world2Mode","world3Mode","world1Keywords","world2Keywords","world3Keywords"]){for(const c of String(data[k]||"")){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}}return String(h>>>0)}
const selected=()=>accepted&&version&&base===fingerprint()?version:null;
const selectedText=k=>selected()?(k==="core"?selected().core:k==="opening"?selected().opening:null):null;
const selectedProfile=()=>selected()?{title:selected().title,bio:selected().bio}:null;
const selectedWorld=i=>selected()?.worldbooks?.[i-1]||null;
const intro=()=>tidy(src().initialRaw)||["openingScene","openingAction","openingLine","openingBeat"].map(k=>tidy(src()[k])).filter(Boolean).join("\n\n");
function fullCore(){const s=src(),out=["# "+(s.name||"Character")+" — Fizzz Core Personality"];if(s.age)out.push("Age: "+s.age);if(s.gender)out.push("Gender: "+s.gender);ORDER.forEach((k,i)=>{if(tidy(s[k]))out.push("\n## "+LABELS[i]+"\n"+tidy(s[k]))});return out.join("\n")}
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
 const full=fullCore();if(mode==="full")return {text:full,removed:0,original:full.length};
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
function bioCompile(){
 const p=tidy(src().bio);if(p.length<1250)return p;
 const lines=p.split(/\n\s*\n/).filter(Boolean),keep=[];let size=0;
 for(const item of lines){const t=item.trim();if(/^(?:#\w+|PUBLIC TAGS|CREATION DATE|UNIVERSE:)/i.test(t)||t.length>650||keep.some(x=>close(x,t)))continue;
  if(keep.length<2||/\b(you|your|arrang|marry|choice|refuse|bond|contract)\b/i.test(t)||t.includes("“")){if(size+t.length<1400){keep.push(t);size+=t.length+2;}}
 }const reduced=keep.join("\n\n");return reduced.length>250?reduced:p;
}
function checks(d){const m=[];if(d.core.length>25000)m.push("Core exceeds 25,000 characters.");else if(d.core.length>10000)m.push("Core exceeds recommended 10,000 characters.");
 if(d.opening.length>5000)m.push("Opening exceeds 5,000 characters.");
 d.worldbooks.forEach((w,i)=>{if(w.title&&!w.content)m.push("Worldbook "+(i+1)+" full lore is missing.");if(w.content.length>10000)m.push("Worldbook "+(i+1)+" is over 10,000 characters.")});
 if(!tidy(src().voiceDirection)&&!tidy(src().voiceDesignPrompt))m.push("Voice still needs to be configured in Fizzz.");
 return m;}
function compile(mode="balanced"){const s=src(),c=coreCompile(mode);
 const books=[1,2,3].map(i=>({title:tidy(s["world"+i+"Title"]),mode:s["world"+i+"Mode"]||"keyword",keywords:tidy(s["world"+i+"Keywords"]),content:tidy(s["world"+i+"Body"])}));
 version={title:tidy(s.title),bio:bioCompile(),core:c.text,opening:intro(),worldbooks:books,originalCore:c.original,removed:c.removed,mode,notes:[]};version.notes=checks(version);
 base=fingerprint();accepted=false;save();render();return version;}
function save(){try{localStorage.setItem(STORE,JSON.stringify({version,accepted,base}))}catch{}}
function load(){try{const o=JSON.parse(localStorage.getItem(STORE)||"null");if(o){version=o.version;accepted=o.accepted;base=o.base}}catch{}}
function message(t){const x=$("#compiler-status");if(x)x.textContent=t}
function render(skipFields=false){if(!version)return;
 for(const k of ["title","bio","core","opening"]){const x=$("#compiled-"+k);if(x&&!skipFields)x.value=version[k]}
 $("#compiler-measure").textContent="Original core "+version.originalCore.toLocaleString()+" chars → compiled "+version.core.length.toLocaleString()+" chars; "+version.removed+" repetitive/secondary source lines omitted.";
 $("#compiler-warnings").textContent=version.notes.length?version.notes.map(x=>"• "+x).join("\n"):"✓ No length or missing-lore warnings. Test on Fizzz.";
 $("#compiler-approve").disabled=!version.core||!version.opening||version.core.length>25000||version.opening.length>5000;
 $("#compiler-selected").textContent=selected()?"✓ Approved compiled version selected for all final exports.":accepted&&base!==fingerprint()?"Source changed; recompile before export.":"Compiled text is not yet approved; original text remains the export source.";
}
function edit(){if(!version)return;for(const k of ["title","bio","core","opening"])version[k]=$("#compiled-"+k).value;version.notes=checks(version);accepted=false;save();render(true)}
function approve(){if(!version)return;if(base!==fingerprint())return message("Source fields changed since compilation. Recompile before approving.");if(version.core.length>25000||version.opening.length>5000)return message("Exceeds Fizzz length limits.");accepted=true;save();render();window.FizzzAtelier?.refreshReview?.();message("Approved. Existing TXT, DOCX and JSON outputs will now use this compiled core, public bio and greeting.");}
function undo(){accepted=false;save();render();window.FizzzAtelier?.refreshReview?.();message("Original fields restored as export source. Edited compiled version stays saved.");}
const filename=()=>tidy(src().name||"character").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"character";
function file(name,content,type="application/json"){const b=content instanceof Blob?content:new Blob([content],{type}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}
function publishing(){const s=src(),d=selected();if(!d)throw Error("Approve your compiled character first.");return{format:"Fizzz Publishing Fields",note:"Copy field-by-field into Fizzz; platform does not document full character card file import.",profile:{title:d.title,name:s.name,age:s.age,gender:s.gender,pov:s.pov,rating:s.rating,created:s.creationDate,bio:d.bio,warning:s.warning,tags:window.FizzzAtelier?.getTags?.()||[]},core_personality:d.core,initial_message:d.opening,worldbooks:d.worldbooks}}
function card(){const f=publishing(),s=f.profile;const entries=f.worldbooks.filter(w=>w.content).map((w,i)=>({keys:w.mode==="always"?[]:w.keywords.split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean),content:w.content,enabled:true,constant:w.mode==="always",insertion_order:i,case_sensitive:false,selective:false,secondary_keys:[],position:"before_char",priority:10,comment:w.title,name:w.title,id:i,extensions:{}}));
 return {spec:"chara_card_v2",spec_version:"2.0",data:{name:s.name,description:f.core_personality,personality:"",scenario:"",first_mes:f.initial_message,mes_example:"",creator_notes:"Portable card metadata, NOT documented as native Fizzz character-file import. Public Bio: "+s.bio,system_prompt:"",post_history_instructions:"",alternate_greetings:[],tags:s.tags,creator:"",character_version:"1.0",extensions:{fizzz:{title:s.title,bio:s.bio,age:s.age,pov:s.pov,rating:s.rating,created:s.created}},character_book:{name:s.name+" Worldbooks",entries}}}}
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
 else{ctx.fillStyle="#231624";ctx.fillRect(0,0,can.width,can.height);ctx.fillStyle="#e5c9a1";ctx.textAlign="center";ctx.font="48px Georgia";ctx.fillText(src().name||"Character",450,can.height/2);ctx.font="21px Georgia";ctx.fillText("Upload portrait under Media for real artwork",450,can.height/2+40);}
 return new Promise((r,j)=>can.toBlob(b=>b?b.arrayBuffer().then(r,j):j(Error("Could not encode card")),"image/png"));}
async function cardPNG(){const c=card(),pic=await art(),result=embed(pic,b64(JSON.stringify(c)));file(filename()+"-portable-card-v2.png",new Blob([result],{type:"image/png"}));message("Portable PNG saved with embedded Character Card V2 metadata. Fizzz may read it only as an image.");}
async function cover(){publishing();const b=await art("3:4");file(filename()+"-fizzz-cover-3x4.png",new Blob([b],{type:"image/png"}));message("3:4 cover art created for separate upload to Fizzz.");}
function aiBrief(){return [
 "Source-faithfully optimize this complete Fizzz character. Preserve names, ages, relationship facts, motive, history, setting, original scene/dialogue and player agency. Add no new canon. Improve immediate romantic hook and distinct voice; retain meaningful flaws.",
 "Fizzz Core Personality ≤25,000 characters; recommend ≤10,000. Initial Message ≤5,000. Speaking style last. Worldbooks are separate. Do not invent absent Worldbooks.",
 "Return EXACT JSON {title, bio, core, opening, changeLog:[{field,why}]}, full strings, no markdown fences, so creator can review and approve.",
 "TITLE:\n"+src().title,"BIO:\n"+src().bio,"CORE:\n"+fullCore(),"OPENING:\n"+intro()
 ].join("\n\n")}
function aiImport(){try{const txt=$("#compiler-ai-json").value.trim().replace(/^\x60{3}(?:json)?\s*/i,"").replace(/\x60{3}\s*$/,""),o=JSON.parse(txt),f=o.fields||o;
 for(const k of ["title","bio","core","opening"])if(typeof f[k]!=="string"||!f[k].trim())throw Error("Required "+k+" is missing.");
 if(f.core.length>25000||f.opening.length>5000)throw Error("Proposed core or greeting exceeds Fizzz limits.");
 if(!version)compile();version={...version,title:f.title,bio:f.bio,core:f.core,opening:f.opening,notes:[]};version.notes=checks(version);accepted=false;base=fingerprint();save();render();message("AI proposal loaded for comparison; you must approve it before exporting.");
 }catch(e){message("AI proposal rejected: "+e.message)}}
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
 '<h4>Portable character card & Fizzz art</h4><p class="muted">The Character Card PNG/JSON embeds full text metadata for compatible software; Fizzz does not document native full-card import. Publish using the Fizzz-specific field exports, upload separate images, and choose voice inside Fizzz.</p>',
 '<div class="actions"><button id="compiler-card-png">↓ Character Card PNG (data embedded)</button><button id="compiler-card-json">↓ Character Card V2 JSON</button><button id="compiler-cover">↓ 3:4 Fizzz Cover PNG</button></div>',
 '<p id="compiler-status" class="muted" role="status">Choose or upload a 9:16 portrait under Media to include it in the card.</p>'
 ].join("");
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
window.VelvetRuinFizzzCompiler=Object.freeze({selected,selectedText,selectedProfile,selectedWorld,compile,card,publishing,fullCore});
})();