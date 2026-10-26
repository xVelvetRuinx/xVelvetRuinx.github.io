/* VelvetRuin Fizzz Atelier: browser-only format extraction + review-before-merge.
   A file parser is not a creative language model; no source is silently rewritten. */
(() => {
"use strict";
const A=()=>window.FizzzAtelier,EX=()=>window.AtelierMigrator;
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const names={title:"Public title",name:"Character Chat Name",age:"Age",gender:"Gender",pov:"POV",rating:"Rating",bio:"Public Character Bio",warning:"Content advisory",concept:"Core hook",dynamic:"Relationship promise",conflict:"Story conflict",role:"Player role",arc:"Long-term character change",coreRaw:"Verbatim Core Personality",initialRaw:"Original Initial Message",appearance:"Appearance",occupation:"Occupation",species:"Species",backstory:"Backstory",traits:"Behavioral personality",contradiction:"Internal contradiction",motivation:"Character goals",relationship:"Relationship with {{user}}",behavior:"Growth rules",boundaries:"Behavior boundaries",voice:"Speaking style",openingScene:"Scene",openingAction:"Visible action",openingLine:"Spoken line",openingBeat:"Open response beat",world1Title:"Worldbook 1 title",world1Body:"Worldbook 1 facts",world1Mode:"Worldbook 1 activation",world1Keywords:"Worldbook 1 triggers",world2Title:"Worldbook 2 title",world2Body:"Worldbook 2 facts",world2Mode:"Worldbook 2 activation",world2Keywords:"Worldbook 2 triggers",world3Title:"Worldbook 3 title",world3Body:"Worldbook 3 facts",world3Mode:"Worldbook 3 activation",world3Keywords:"Worldbook 3 triggers",imageDirection:"Character-image brief",coverDirection:"Cover brief",voiceDirection:"Voice brief",voiceDesignPrompt:"Design Voice description",voiceId:"ElevenLabs V3 Voice ID"};
const allowed=new Set(["title","name","age","gender","pov","rating","bio","warning","concept","dynamic","conflict","role","arc","appearance","occupation","species","backstory","traits","contradiction","motivation","relationship","behavior","boundaries","voice","coreRaw","initialRaw","openingScene","openingAction","openingLine","openingBeat","world1Title","world1Mode","world1Keywords","world1Body","world2Title","world2Mode","world2Keywords","world2Body","world3Title","world3Mode","world3Keywords","world3Body","coverDirection","imageDirection","videoDirection","voiceDirection","voiceDesignPrompt","voiceId","musicDirection"]);
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
 voiceDirection:["voice direction","voice notes"],voiceDesignPrompt:["design voice","design voice prompt","voice design description"],voiceId:["elevenlabs v3 voice id","voice id","voiceId"],
 world1Title:["worldbook 1 title","worldbook1 title","lorebook 1 title"],
 world1Body:["worldbook 1","worldbook entry 1","worldbook1","lorebook 1","worldbook","lorebook","lore"],
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
 const root=obj.project&&typeof obj.project==="object"?obj.project:obj.fields&&typeof obj.fields==="object"?obj.fields:obj.data&&typeof obj.data==="object"?obj.data:obj.character&&typeof obj.character==="object"?obj.character:obj;
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

/* Numbered 21-field Fizzz manuscripts: map source headings without flattening
   the opening into personality or mistaking Worldbook outlines for full lore. */
function parseNumberedFizzz(text){
 const source=clean(text), heading=/^##\s+(\d{1,2})\.\s+([^\n]+)\s*$/gm;
 const headers=[...source.matchAll(heading)];
 if(headers.length<12||!headers.some(h=>Number(h[1])===21))return null;
 const fields={},notes={},unmapped=[],alerts=[],sections={};
 const configAt=source.search(/^#\s+.+WORLDBOOK CONFIGURATION\s*$/m);
 for(let i=0;i<headers.length;i++){
  const h=headers[i],start=h.index+h[0].length;
  let end=i+1<headers.length?headers[i+1].index:source.length;
  if(Number(h[1])===21&&configAt>start)end=configAt;
  sections[Number(h[1])]=source.slice(start,end).trim();
 }
 const take=(key,val,label)=>{
  const v=clean(val);if(!v)return;
  fields[key]=v;
  notes[key]="Preserved exact source section: "+label+". Review before editing; no narrative facts were generated.";
 };
 take("title",sections[1],"Public Title");
 take("name",sections[2],"Chat Name");
 const age=(sections[3]||"").match(/\*\*Age:\*\*\s*(\d{2,3})/i);
 if(age)take("age",age[1],"Age");
 else alerts.push("Age was not confidently extracted; review the age field.");
 if(/\bMale\b/i.test(sections[4]||""))take("gender","Male","Gender Tag");
 else if(/\bFemale\b/i.test(sections[4]||""))take("gender","Female","Gender Tag");
 if(/AnyPOV|Any POV/i.test(sections[5]||""))take("pov","Any POV","POV Tag");
 else if(/Female POV/i.test(sections[5]||""))take("pov","Female POV","POV Tag");
 else if(/Male POV/i.test(sections[5]||""))take("pov","Male POV","POV Tag");
 if(/Mature|18\+|Limitless/i.test(sections[6]||"")){
  take("rating","Limitless","Mature / 18+ rating");
  alerts.push("Mapped source Mature / 18+ to the Atelier's Limitless rating option. Verify the rating and permissible content in Fizzz.");
 }else if(/Limited/i.test(sections[6]||""))take("rating","Limited","Rating Tag");
 take("bio",sections[7],"Public Bio including source date and tags");
 take("warning",sections[8],"Content Advisory");
 const map={9:"occupation",10:"species",11:"appearance",12:"backstory",13:"traits",14:"contradiction",15:"motivation",16:"relationship",17:"behavior",18:"boundaries",19:"voice"};
 for(const [index,key] of Object.entries(map))if(sections[index])take(key,sections[index],headers.find(h=>Number(h[1])===Number(index))?.[2]||key);
 if(sections[20]){
  // Core Personality source is duplicated by design in a 21-field manuscript.
  // Keep its verbatim source in the observable-behavior field, without toggling
  // coreRaw: coreRaw would otherwise mask sections 9–19 in final Fizzz export.
  const part="[PRESERVED VERBATIM CORE TRAITS]\n"+sections[20];
  take("traits",(fields.traits?fields.traits+"\n\n":"")+part,"Observable Personality + verbatim Core traits");
  alerts.push("Verbatim Core Personality from section 20 is appended after section 13 in the Traits field, so it survives compilation without masking the complete sections 9–19.");
 }
 const opening=sections[21]||"",lines=opening.split("\n");
 const stageHeads=["Scene · Location, Time & Atmosphere","What the Character Visibly Does","One or Two Spoken Lines","Playable Opening Beat"];
 const stageKeys=["openingScene","openingAction","openingLine","openingBeat"];
 let narrativeStart=-1,beatAt=lines.findIndex(l=>/^###\s+Playable Opening Beat\b/i.test(l));
 if(beatAt>=0){
  for(let i=beatAt+1;i<lines.length;i++){
   const v=lines[i].trim();
   if(v&&!/^(?:-|#)\s/.test(v)&&!/^[-*]\s/.test(v)&&(!lines[i-1]||!lines[i-1].trim())){
    narrativeStart=i;break;
   }
  }
 }
 if(narrativeStart<0){
  const direct=opening.match(/(?:^|\n)\s*(?:The|Rain|Night|Morning|Evening|A|An)\s+[^\n]{25,}[.!?](?:\n|$)/m);
  if(direct)narrativeStart=opening.slice(0,direct.index+(direct[0][0]==="\n"?1:0)).split("\n").length-1;
 }
 if(narrativeStart>=0){
  take("initialRaw",lines.slice(narrativeStart).join("\n").trim(),"Complete Initial Message");
  const pre=lines.slice(0,narrativeStart).join("\n");
  for(let i=0;i<stageHeads.length;i++){
   const hs=[...pre.matchAll(/^###\s+([^\n]+)\s*$/gm)],index=hs.findIndex(h=>normalize(h[1])===normalize(stageHeads[i]));
   if(index>=0){
    const begin=hs[index].index+hs[index][0].length,stop=index+1<hs.length?hs[index+1].index:pre.length;
    take(stageKeys[i],pre.slice(begin,stop),"Opening planning notes");
   }
  }
 }else{
  alerts.push("Opening prose could not be confidently separated from its planning checklist. Section 21 was retained as a whole for manual separation.");
  take("initialRaw",opening,"Complete Initial Message (review separation)");
 }
 if(configAt>=0){
  const config=source.slice(configAt),matches=[...config.matchAll(/^##\s+Worldbook\s+([1-3])\s*[—–-]\s*(.+)\s*$/gm)];
  for(let i=0;i<matches.length;i++){
   const m=matches[i],n=Number(m[1]),content=config.slice(m.index+m[0].length,i+1<matches.length?matches[i+1].index:config.length);
   take("world"+n+"Title",clean(m[2]),"Worldbook "+n+" title");
   take("world"+n+"Mode",/Always Active/i.test((content.match(/\*\*Activation:\*\*[^\n]*/i)||[])[0]||"")?"always":"keyword","Worldbook "+n+" activation");
   const keys=(content.match(/\*\*Keywords:\*\*\s*([^\n]*)\n?([^\n]*)/i)||[]);
   const kw=clean(keys[1])&&/none required/i.test(keys[1])?"":clean(keys[1]||keys[2]);
   if(kw&&!/none required/i.test(kw))take("world"+n+"Keywords",kw,"Worldbook "+n+" triggers");
   unmapped.push("WORLDBOOK "+n+" OUTLINE (not full lore):\n"+clean(content));
  }
  alerts.push("Worldbook 1–3 settings and outlines were imported. The attached file does NOT contain full Worldbook lore text. Upload or paste the three actual Worldbook entries into the empty Body fields before publishing.");
 }
 const tagSource=sections[7]||"",tagWords=(tagSource.match(/#[\p{L}\p{N}]+/gu)||[]).map(x=>x.slice(1));
 const known=["Omegaverse","Mafia","Arranged Marriage","Slow Burn","Romance","Protective","Crime","Drama","Marriage Drama"];
 const tags=[...new Set(tagWords.map(x=>known.find(t=>normalize(t)===normalize(x))).filter(Boolean))].slice(0,7);
 if(fields.initialRaw?.length>5000)alerts.push("Opening prose is "+fields.initialRaw.length+" characters (Fizzz maximum: 5,000). Revise with approval.");
 const coreCount=Object.entries(map).reduce((s,[num])=>s+(sections[num]||"").length,0)+(sections[20]||"").length;
 if(coreCount>10000)alerts.push("Character core contains approximately "+coreCount+" source characters; Fizzz recommends ~10,000 but permits up to 25,000. Consider carefully selected reductions without deleting canon.");
 return {fields,notes,unmapped,notesGlobal:alerts,kind:"21-field structured Fizzz manuscript",tags};
}

function parseText(text){
 const structured=parseNumberedFizzz(text);if(structured)return structured;
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
 const data=normalizeSelections(parsed.fields||{}),items=[],s=A().getState(),keys=new Set([...A().keys(),"tags"]);
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
 if(Array.isArray(parsed.tags)&&parsed.tags.length){
  const tags=[...new Set(parsed.tags.filter(x=>typeof x==="string"))];
  items.push({key:"tags",value:tags.join(", "),original:tags.join(", "),status:"Optional source tags",reason:"Original discovery categories recovered from the source. Some tags may not exist in Fizzz; only supported tags will be carried over, and the ten-tag limit includes the three required categories.",inferred:true,aiChanged:false});
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
 const emptyMode=$('input[name="merge-mode"][value="empty"]');if(emptyMode)emptyMode.checked=true;
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

function optInstance(){return window.VelvetRuinFizzzOptimizer;}
function optimizeOne(item,editor,checkbox,approval,status,reason,detail){
 const opt=optInstance();
 if(!opt){A().notify("The optimization module did not load. Reload this page.");return {changed:false};}
 const found=opt.reduce(item.key,editor.value);
 if(!found.changed){
   detail.hidden=false;detail.replaceChildren();
   detail.append(make("p","", "No safe mechanical reductions found. The original wording can stay. For deeper edits, use the optional AI copyedit brief and review every change."));
   return found;
 }
 editor.value=found.proposed;
 checkbox.checked=false; // every proposed trim is opt-in
 approval.checked=false;
 item.status="Gentle trim · review";
 item.reason="Deterministic, reviewable reductions suggested by the local optimizer. Original identity, canon, and any quoted speech remain intact. Check the comparison before approving.";
 item.reductionLog=(item.reductionLog||[]).concat(found.changes);
 status.textContent=item.status;reason.textContent=item.reason;
 detail.hidden=false;detail.replaceChildren();
 const top=make("p","trim-result-title","✦ "+found.charactersSaved+" characters saved · approximately "+found.tokensSaved+" estimated tokens");
 detail.append(top);
 found.changes.forEach((change,i)=>{
  const row=make("article","trim-change"),heading=make("b","", (i+1)+". "+change.kind);
  const desc=make("p","",change.why);
  const diff=make("p","trim-diff","Before: "+change.before+"  →  After: "+change.after);
  const mini=make("small","",String(change.charactersSaved)+" characters reduced by this operation");
  row.append(heading,desc,diff,mini);detail.append(row);
 });
 return found;
}
function optimizerNotes(){
 const opt=optInstance();
 if(!opt){A().notify("Reload to enable the gentle optimizer.");return [];}
 const now=Object.fromEntries(proposals.map(p=>{
   const editor=$('[data-proposal="'+p.key+'"]');
   return [p.key,editor?.value||p.value];
 }));
 const all=opt.feedback({...A().getState(),...now});
 const root=$("#optimizer-feedback");root.replaceChildren();
 if(!all.length){
   root.append(make("p","opt-success","✦ No obvious pattern-based issues found. That is not a guarantee of story quality; test the actual chats, video and voice on Fizzz."));
   return all;
 }
 const header=make("p","optimizer-note-heading","✧ "+all.length+" editorial checkpoint"+(all.length===1?"":"s")+" based on Fizzz's guide and recognizable, player-driven premise design:");
 root.append(header);
 all.forEach(n=>{
   const card=make("article","optimizer-note "+(n.priority==="important"?"important":""));
   const heading=make("b","",n.heading);
   const badge=make("span","optimizer-target",label(n.field));
   const body=make("p","",n.reason);
   const jump=make("button","optimizer-jump","Review this field ↗");jump.type="button";
   jump.addEventListener("click",()=>{
      const editor=$('[data-proposal="'+n.field+'"]');
      if(editor){editor.scrollIntoView({behavior:"smooth",block:"center"});editor.focus();}
      else{A().notify("That field was not in this import. Add it in the matching creation chapter after applying.");}
   });
   card.append(heading,badge,body,jump);root.append(card);
 });
 return all;
}
function optimizeAll(){
 const opt=optInstance();
 if(!sourceMapped){A().notify("Map an imported character or select Review My Current Draft first.");return;}
 if(!opt){A().notify("Optimization module unavailable; reload the page.");return;}
 let changedFields=0,savedChars=0,savedTokens=0;
 for(const item of proposals){
  const editor=$('[data-proposal="'+item.key+'"]');
  if(!editor)continue;
  const wrap=editor.closest?.(".migration-proposal");
  const details=wrap?.querySelector?.(".trim-info");
  const box=$('[data-select="'+item.key+'"]'),approved=$('[data-approve="'+item.key+'"]');
  const status=wrap?.querySelector?.(".proposal-status");
  const reason=wrap?.querySelector?.(".proposal-reason");
  // Delegate through the field's button so its same UI/approval logic runs.
  const result=opt.reduce(item.key,editor.value);
  if(!result.changed)continue;
  if(wrap?.querySelector?.(".proposal-trim"))wrap.querySelector(".proposal-trim").click();
  else{
    editor.value=result.proposed;box.checked=false;if(approved)approved.checked=false;
    item.reason="Gentle mechanical trims proposed: "+result.changes.map(x=>x.why).join(" ");
    item.reductionLog=(item.reductionLog||[]).concat(result.changes);
    editor.dispatchEvent(new Event("input",{bubbles:true}));
  }
  changedFields++;savedChars+=result.charactersSaved;savedTokens+=result.tokensSaved;
 }
 const target=$("#optimizer-summary");
 target.textContent=changedFields
   ?"Suggested "+changedFields+" field edit"+(changedFields===1?"":"s")+", "+savedChars+" fewer characters (about "+savedTokens+" estimated tokens). Edits are UNCHECKED; original text is retained for comparison. Review each change and check only what you approve."
   :"No automatic safe reductions found. That's often good: the tool won't rewrite distinctive scenes, dialogue, world rules or original story details just to reduce length.";
 optimizerNotes();
 A().notify(changedFields?"Gentle trims ready for review; nothing was applied.":"No safe automatic trims found; check the editorial recommendations.");
}

function showReview(data){
 sourceMapped=data;proposals=data.items;
 $("#optimizer-summary").textContent="No reductions have been proposed. Click Find Gentle Trims after reviewing the imported fields.";
 $("#optimizer-feedback").replaceChildren();
 const notes=$("#migration-notes");notes.replaceChildren();
 [data.kind+" · "+data.items.length+" mapped fields",...data.notes,...lastAIFeedback].forEach((note,i)=>{notes.append(make("p",i?"muted":"",note));});
 const where=$("#migration-proposals");where.replaceChildren();
 for(const item of data.items){
  const wrap=make("article","migration-proposal"),header=make("div","proposal-head"),l=make("label"),box=make("input");box.type="checkbox";box.dataset.select=item.key;
  box.checked=!item.inferred&&!item.aiChanged;
  l.append(box,make("b","",label(item.key)));
  const status=make("span","proposal-status",item.status);header.append(l,status);
  const reason=make("p","proposal-reason",item.reason),edit=make("textarea");edit.rows=Math.min(10,Math.max(3,Math.ceil(item.value.length/90)));edit.value=item.value;edit.dataset.proposal=item.key;edit.setAttribute("aria-label","Review "+label(item.key));
  const budget=make("div","proposal-budget"),detail=make("details","before-after"),summary=make("summary","","View original versus proposed");
  const trimInfo=make("div","trim-info");
  trimInfo.hidden=true;
  const trimBtn=make("button","proposal-trim","✧ Find precise trims");
  trimBtn.type="button";
  trimBtn.setAttribute("aria-label","Suggest compact edits for "+label(item.key));
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
  restore.addEventListener("click",()=>{edit.value=item.original;box.checked=true;check.checked=false;item.reductionLog=[];item.reason=describe(item.key,"file");reason.textContent="Original wording restored. Source history preserved.";trimInfo.hidden=true;redraw();A().notify("Original restored for "+label(item.key))});
  trimBtn.addEventListener("click",()=>{
    const result=optimizeOne(item,edit,box,check,status,reason,trimInfo);
    if(result.changed)redraw();
  });
  wrap.append(header,reason,edit,budget,trimBtn,trimInfo,detail);
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
  "Selected: "+(selected?"yes":"no"),"Estimated characters saved: "+(item.original.length-(editor?.value||"").length),"Edit rationale: "+(item.reductionLog?.length?item.reductionLog.map(ch=>ch.kind+" — "+ch.before+" → "+ch.after+"; "+ch.why).join(" | "):"No mechanical trim; original or editor-entered text"),"Original approx tokens: "+token(item.original),"Proposed approx tokens: "+token(editor?.value||""),
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
 const importedTags=typeof patch.tags==="string"?patch.tags.split(/[,;\n]+/g).map(s=>s.trim()).filter(Boolean):null;
 delete patch.tags;
 const done=api.apply(patch,{replace});
 if(importedTags?.length&&(replace||!A().getTags().length)){
    A().setTags(importedTags);done.push("tags");
 }
 if(!done.length){A().notify("No empty fields to fill. Choose Replace selected fields if you want to overwrite your draft.");return}
 A().notify(done.length+" reviewed fields applied. Check the manuscript and media before publishing.");
 A().chapter("profile");
}
function auditCurrent(){
 const project=A().getState(),real=Object.fromEntries(Object.entries(project).filter(([k,v])=>{if(!allowed.has(k)||typeof v!=="string"||!v.trim()||["gender","pov","rating"].includes(k))return false;const book=k.match(/^world([123])(?:Mode|Keywords|Title)$/);if(book&&!String(project["world"+book[1]+"Body"]||"").trim()&&!String(project["world"+book[1]+"Title"]||"").trim())return false;return true;}));
 if(!Object.keys(real).length){A().notify("The current draft is empty. Write something or load an example first.");return}
 originalText=JSON.stringify(project,null,2);fileName="Current Fizzz draft";format="json";baseline={...project};lastAIFeedback=[];
 const replaceMode=$('input[name="merge-mode"][value="replace"]');if(replaceMode)replaceMode.checked=true;
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
 "CREATOR ENGAGEMENT GOALS: Preserve an instantly legible romance/roleplay premise, user-centered stakes, a distinct emotional contradiction, protective-but-consensual behavior, and an obvious reason to respond on turn one. Familiar accessible tropes can help the first click, but character-specific behavior and meaningful progression drive lasting play. Do not flatten nuanced character traits into a generic mafia/boss/vampire stereotype.",
 "Ensure playable scenario over lore dump. Keep the original greeting's dialogue and action intact, never convert the scene into a summary. Keep rich prose when it earns emotion and visual continuity. Make speaking style behavioral, brief and useful; no independent example-dialogue field in Fizzz.",
 "For WORLD/LORE: Do not delete unique mechanics, hidden pasts, evidence, or secret-discovery rules. Flag text that belongs in Worldbook; if relocation is proposed preserve it VERBATIM and specify source/destination in changeLog. Worldbook keyword triggers are not the same as narrative discovery: define what {{char}} knows versus suspects.",
 "Optimize only redundancy, repetitive boilerplate, filler, formatting and genuine ambiguities. Do not cut a complete concept, change any signature conversation, reassign {{user}}'s identity, or invent character motivation. Include precise before/after quotes and an explicit WHY for each sentence-level suggestion.",
 "If an existing field is good, leave it completely unchanged and OMIT IT from the output fields object.",
 "Fizzz official limits: Core Personality max 25,000 characters; recommended within 10,000. Initial Message max 5,000. Worldbook: up to 3 entries, 10,000 chars each. Bio is public but not model context. Images for video recommended 9:16. No independent example dialogue field: prefer concise speaking style in core instead.",
 "Other platform details: Cover is recommended 3:4 and does NOT drive video. Up to three Character Images at 9:16 DO drive Loop Videos. Voice is required before Opening Film. Design Voice descriptions are at most 20 words; ElevenLabs V3 Voice ID is optional where supported. Gender, POV and Rating are required tags, up to ten total. Worldbook is off by default and must be enabled manually.",
 "Preserve initial message prose, spoken lines, emotional tone, chronology and playable closing beat verbatim unless a tiny local correction is absolutely needed.",
 "Never speak for {{user}} or predetermine consent, feelings or outcomes. Flag problems; do not alter unrelated text.",
 "Do not invent content that was not in original. If a better hook, new archetype, new image, new character or missing detail needs author input, write an optional suggestion only.",
 "PREFER EXACT PATCH OPERATIONS, not full rewrites. For large existing Core Personality and Worldbook text, output ONLY a list of short before/after replacements, so no huge JSON fields get cut off.",
 "Return ONLY valid JSON, preferably this format:",
 '{"edits":[{"field":"coreRaw","before":"the EXACT unique original sentence or fragment","after":"the minimally improved fragment","why":"why this exact change preserves canon and saves characters"}],"suggestions":[{"field":"voice","note":"An optional human-authored improvement"}]}',
 "Every edit.before MUST match once, character-for-character, in its field. Include enough surrounding words to identify the location uniquely; if the same text appears multiple times, specify a longer exact substring.",
 "If one entire SHORT public field should be replaced rather than patched, you may include fields:{\"bio\":\"full revised public bio\"}, but avoid replacing full Core Personality, Worldbook or Initial Message. Patches are preferred. Omitting fields and returning edits only is completely valid.",
 "Only suggest deleting repeated boilerplate or truly identical duplicate text; never cut unique personality, world mechanics, sealed discoveries, chronology or exact character dialogue.",
 "Use an empty edits array if no improvement is needed. Keep all output small and finish the closing braces—do NOT allow the JSON to truncate.",
 "Allowed fields: "+keys.join(", "),
 "Never return unrelated commentary, markdown fences or fields that have not been changed. Every patch MUST include a one-sentence why explanation and exact original/replacement text.",
 "Original source is authoritative. The extracted mapping may be imperfect.",
 "EXTRACTED FIELDS:\n"+JSON.stringify(context,null,2),
 "ORIGINAL SOURCE:\n"+originalText.slice(0,65000),
 "Return valid JSON only. Avoid substantive rewriting."
 ];
 return rules.join("\n\n");
}
function parseAi(text){
 const received=String(text??"").replace(/^\uFEFF/,"").trim();
 if(!received)throw new Error("Nothing has been pasted yet. First copy the Original Bot Draft Brief into ChatGPT. Then copy ChatGPT's COMPLETE JSON response into the box and select Review.");
 // ChatGPT often includes prose around a fenced JSON result. Prefer that
 // explicitly marked block, while also accepting prose followed by bare JSON.
 const fenced=[...received.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map(m=>m[1]).find(part=>part.includes("{"));
 const raw=(fenced||received).trim();
 const start=raw.indexOf("{");
 if(start<0)throw new Error("This looks like a description rather than a JSON character export. The response must contain a complete JSON object beginning with { and ending with }. Ask ChatGPT to return the character as valid JSON.");
 // Find the matching end of the OUTERMOST object. A '}' inside dialogue
 // or a {{user}} placeholder does not close JSON when inside a string.
 let quoted=false,escaped=false,depth=0,closed=-1;
 const stack=[];
 for(let i=start;i<raw.length;i++){
   const c=raw[i];
   if(quoted){
     if(escaped){escaped=false;continue;}
     if(c==="\\"){escaped=true;continue;}
     if(c==='"'){quoted=false;continue;}
   }else{
     if(c==='"'){quoted=true;continue;}
     if(c==="{"||c==="["){stack.push(c);if(c==="{")depth++;continue;}
     if(c==="}"||c==="]"){
       const matching=stack.pop();
       if(matching!==(c==="}"?"{":"["))throw new Error("The JSON has a mismatched closing bracket. Copy the entire original response or ask ChatGPT to resend valid JSON.");
       if(c==="}")depth--;
       if(!stack.length){closed=i;break;}
     }
   }
 }
 if(closed<0){
   const detail=quoted?"it stops in the middle of a quoted field":"it is missing its final closing } or ]";
   throw new Error("The copied JSON is incomplete ("+detail+"). This usually means the assistant's response was cut off or only part was copied. Ask ChatGPT: “Resend this character as one shorter, complete JSON object. Include the closing braces and omit extra commentary.” Then copy the FULL result.");
 }
 const objectSource=raw.slice(start,closed+1);
 let obj;
 try{obj=JSON.parse(objectSource);}
 catch(error){
   const msg=String(error.message||"");
   if(/end of (?:json|input)|unexpected eof|unterminated|end of data/i.test(msg))
     throw new Error("The JSON appears incomplete or has an unfinished quotation. Ask ChatGPT to resend a complete, shorter JSON object, then paste the entire result.");
   throw new Error("The response contains a JSON formatting mistake. Ask ChatGPT to resend VALID JSON only (all field names and text in double quotes, with escaped quotes inside dialogue). Details: "+msg.slice(0,160));
 }
 if(!obj||typeof obj!=="object"||Array.isArray(obj))throw new Error("Expected one character JSON object containing a fields section.");
 return obj;
}
function originalImportStatus(message,level="info"){
 const area=$("#original-ai-status");
 if(area){
   area.textContent=message;
   area.dataset.state=level;
   area.setAttribute("role",level==="error"?"alert":"status");
   if(level==="error")area.scrollIntoView?.({behavior:"smooth",block:"nearest"});
 }
}
function aiReview(input){
 try{
  const obj=parseAi(input);
  if(!sourceMapped&&!Object.keys(baseline).length)throw Error("First import a character or select Review My Current Draft. The editor must have a source to compare before/after.");
  if(!Object.keys(baseline).length)baseline=Object.fromEntries(proposals.map(x=>[x.key,x.original||x.value]));
  const actual={...baseline},log=Array.isArray(obj.changeLog)?obj.changeLog.slice():[],issues=[];
  // A compact, exact-patch response avoids resending and truncating 10k–25k character fields.
  for(const change of Array.isArray(obj.edits)?obj.edits:[]){
    if(!change||typeof change!=="object")continue;
    const k=change.field,before=change.before,after=change.after;
    if(!allowed.has(k)||typeof before!=="string"||!before||typeof after!=="string"){
      issues.push("Skipped malformed edit for "+String(k||"unknown")+"; the editor needs an exact before and a replacement after.");continue;
    }
    const current=String(actual[k]||"");
    if(!current.includes(before)){
      issues.push("Skipped edit in "+label(k)+": exact original phrase was not found. Nothing was guessed.");continue;
    }
    if(current.indexOf(before)!==current.lastIndexOf(before)){
      issues.push("Skipped ambiguous edit in "+label(k)+": phrase appears multiple times. Ask for a longer, unique before excerpt.");continue;
    }
    actual[k]=current.replace(before,after);
    log.push({field:k,before,after,why:typeof change.why==="string"?change.why:"No explanation supplied"});
  }
  // Backward compatible: still review full-field AI response when supplied.
  const full=obj.fields&&typeof obj.fields==="object"&&!Array.isArray(obj.fields)?obj.fields:{};
  for(const [k,v] of Object.entries(full)){
    if(!allowed.has(k)||typeof v!=="string"||!v.trim())continue;
    actual[k]=v;
    if(!log.some(x=>x?.field===k))issues.push("Full replacement proposed for "+label(k)+" without a precise explanation; review it carefully.");
  }
  const edited=Object.keys(actual).filter(k=>allowed.has(k)&&String(actual[k])!==String(baseline[k]??""));
  lastAIFeedback=issues.concat((Array.isArray(obj.suggestions)?obj.suggestions:[]).slice(0,8).map(x=>"AI optional feedback · "+(x.field||"general")+": "+(x.note||"")));
  if(!edited.length){
    if(!sourceMapped)throw Error("No changes to display. Import or audit a source first.");
    sourceMapped.notes.push(...lastAIFeedback);
    showReview(sourceMapped);
    A().notify("No valid content changes proposed. Any editorial feedback is above the source fields.");
    return;
  }
  const data=prepare({fields:actual,kind:"AI micro-edits · review before applying",notes:{},unmapped:sourceMapped?.leftovers||""},{ai:true,log});
  data.items.forEach(item=>{
    item.original=String(baseline[item.key]??"");
    if(item.value===item.original){item.status="Source unchanged";item.aiChanged=false;item.reason="The original text remains exactly as supplied.";}
    else {
      item.aiChanged=true;item.status="AI micro-edit · optional";
      const applicable=log.filter(c=>c?.field===item.key);
      item.reason=applicable.length
        ?applicable.map(c=>"Suggested: "+String(c.before).slice(0,120)+" → "+String(c.after).slice(0,120)+". Why: "+String(c.why||"No explanation supplied.")).join(" | ")
        :"Full-field AI edit without an exact patch; verify no canon or dialogue changed.";
      item.reductionLog=applicable.map(c=>({kind:"AI suggestion",before:c.before,after:c.after,why:c.why||"No reason supplied.",charactersSaved:String(c.before).length-String(c.after).length}));
    }
  });
  data.notes.push("AI text changes are unchecked by default. Examine the precise before/after, character consistency and exact dialogue.",...lastAIFeedback);
  showReview(data);
  A().notify("AI micro-edits ready. Nothing was applied; select only the changes you approve.");
 }catch(e){A().notify("Could not review the AI micro-edits: "+e.message);}
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
    const emptyMode=$('input[name="merge-mode"][value="empty"]');if(emptyMode)emptyMode.checked=true;
    const C=window.VelvetRuinFizzzConceptConverter;
    const isOutline=/ORIGINAL USER[-‑– ]SUPPLIED CHARACTER TEXT|The Premise|Opening Scene Concept|His Personality|Her Personality|The Halloween Twist/i.test(originalText);
    if(C&&isOutline){
      const converted=C.convert(originalText);
      extraWarnings=[];
      sourceMapped=prepare({
        fields:converted.fields,
        notes:Object.fromEntries(Object.entries(converted.explanations).map(([key,x])=>[key,x.why])),
        notesGlobal:converted.notes,
        generated:Object.entries(converted.explanations).filter(([key,x])=>x.kind==="draft").map(([key])=>key),
        kind:"Source-based Fizzz character draft",
        unmapped:converted.remainder||"",
        tags:converted.tags
      });
      sourceMapped.notes.push("Recognized a story outline rather than an already-configured bot. Use Create Fizzz Bot from This Concept above to fill editor fields directly.");
    }else sourceMapped=prospective(originalText,format);
    baseline=Object.fromEntries(sourceMapped.items.map(x=>[x.key,x.original]));
    showReview(sourceMapped);A().notify("Character material mapped to actual Fizzz fields for your review. No fields overwritten.");
  }catch(e){A().notify("Could not map character: "+e.message)}
 });
 $("#build-from-migration").addEventListener("click",()=>{
   const source=$("#migration-paste").value;
   if(!source.trim())return A().notify("Choose a file or paste a concept first.");
   const concept=$("#concept-source");concept.value=source;
   A().chapter("spark");
   $("#build-from-concept").click();
 });
 $("#optimize-all").addEventListener("click",optimizeAll);
 $("#audit-quality").addEventListener("click",()=>{
   if(!sourceMapped)return A().notify("Map a source character or audit your current draft first.");
   const notes=optimizerNotes();
   $("#optimizer-summary").textContent="Checked "+proposals.length+" mapped fields. Found "+notes.length+" editorial observation"+(notes.length===1?"":"s")+". These are coaching suggestions, not automatic rewrites.";
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
// Simple creator entry point: reuse the mature document readers and field
// mapper without making users visit or operate the advanced comparison studio.
window.VelvetRuinFizzzImport=Object.freeze({
 readFile:async file=>{
  if(!EX())throw Error("Document readers are unavailable. Try pasting text or a TXT/JSON export.");
  return await EX().extract(file);
 },
 map:(source,formatHint="text")=>{
  const p=prospective(source,formatHint);
  const fields=Object.fromEntries(p.items.filter(item=>item.key!=="tags").map(item=>[item.key,item.value]));
  const tags=p.items.find(item=>item.key==="tags")?.value?.split(/[,;]+/).map(t=>t.trim()).filter(Boolean)||[];
  return {fields,tags,kind:p.kind,notes:p.notes,mapped:p.items.map(item=>({field:item.key,reason:item.reason,inferred:item.inferred})),unmapped:String(p.leftovers||""),unstructured:p.kind==="Unstructured prose"};
 }
});
window.initFizzzMigration=initFizzzMigration;
window.FizzzAtelierReviewGeneratedDraft=function(input){
 try{
  const obj=parseAi(input),fields=obj.fields&&typeof obj.fields==="object"?obj.fields:obj;
  if(!fields||typeof fields!=="object")throw Error("Expected a JSON fields object.");
  const proposed=Object.fromEntries(Object.entries(fields).filter(([k,v])=>allowed.has(k)&&typeof v==="string"&&v.trim()));
  if(!Object.keys(proposed).length)throw Error("No recognized character fields found. Use the supplied drafting brief.");
  baseline=A().getState();originalText=JSON.stringify(baseline,null,2);fileName="Current original concept seed";format="json";
  const raw={fields:proposed,kind:"Original AI Bot Draft · optional",notes:{},unmapped:[],notesGlobal:["AI drafted fiction is a proposal. Confirm every invented detail, especially names, history, dialogue and character logic. Generated fields are unchecked by default."]};
  const mapped=prepare(raw,{source:"New draft",ai:true,log:[]});
  mapped.items.forEach(item=>{
   item.original=String(baseline[item.key]||"");
   item.status=item.original===item.value?"Author seed unchanged":"New bot proposal";
   item.inferred=true;item.aiChanged=true;
   item.reason=item.original===item.value?"Exact author-written seed preserved.":"New proposed content generated from your outline. This was not in the original author input; approve or edit before importing.";
  });
  mapped.notes.push("AI original-character drafts are optional and require manual review. Exact character names, motives, and scenes should be edited until they feel genuinely original.");
  lastAIFeedback=Array.isArray(obj.editorNotes)?obj.editorNotes.slice(0,7).map(x=>"Drafting note: "+x):[];
  mapped.notes.push(...lastAIFeedback);showReview(mapped);A().chapter("migrate");
  originalImportStatus("✓ Complete character JSON recognized. Review the suggested fields in Migration Studio; nothing has changed in your saved draft.","success");
  A().notify("New character draft is ready for review. No AI content was applied automatically.");
 }catch(e){
  // Preserve the original text and existing draft; parsing never edits either.
  originalImportStatus(e.message||"Could not review this draft. The response must be a complete JSON object.","error");
 }
};
})();