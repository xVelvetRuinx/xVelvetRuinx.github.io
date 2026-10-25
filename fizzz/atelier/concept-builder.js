/* VelvetRuin Fizzz: turn story concepts and exported writing into editable creator fields.
   Deterministic local conversion, not an AI service. Author's original stays intact. */
(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const sourceLabel="ORIGINAL USER-SUPPLIED CHARACTER TEXT";
function trim(x){return String(x||"").replace(/\r\n?/g,"\n").trim();}
function extractSource(input){
 const source=trim(input);
 if(!source)throw Error("Paste a character idea, synopsis, or existing bot text first.");
 const marker=source.search(/ORIGINAL USER[-‑– ]SUPPLIED CHARACTER TEXT\s*(?:\([^)]*\))?\s*:/i);
 if(marker>=0){
   const begin=source.slice(marker).match(/ORIGINAL USER[-‑– ]SUPPLIED CHARACTER TEXT\s*(?:\([^)]*\))?\s*:/i);
   let body=source.slice(marker+begin[0].length).trim();
   body=body.split(/\n\s*(?:OUTPUT\s*:|RETURN VALID JSON ONLY\b|(?:EXISTING EXTRACTED FIELDS\b))\s*/i)[0].trim();
   if(!body)throw Error("A creator editing brief was detected but the ORIGINAL USER-SUPPLIED CHARACTER TEXT section is empty.");
   return {text:body,excluded:source.length-body.length,fromPrompt:true,notes:["Detected a Tipsy editing brief. Ignored its ROLE, GOAL, JSON instructions and suggested edits. Used only the ORIGINAL USER-SUPPLIED CHARACTER TEXT as the authoritative character concept."]};
 }
 if(/^\s*ROLE\s*:\s*(?:Careful copyeditor|copyeditor|editor of an EXISTING)/im.test(source)&&/RETURN VALID JSON ONLY|NON-NEGOTIABLE PRESERVATION RULES/i.test(source))
   throw Error("You pasted instructions for a different assistant, not the character itself. Add the actual character under “ORIGINAL USER-SUPPLIED CHARACTER TEXT:” or paste the character synopsis directly.");
 return {text:source,excluded:0,fromPrompt:false,notes:[]};
}
const headingMap=[
 [/^tropes?\s*:/i,"tropes"],[/^(?:the\s+)?hook\s*:/i,"hook"],[/^(?:the\s+)?premise\s*:?\s*$/i,"premise"],
 [/^(?:the\s+)?(?:halloween|seasonal|plot)\s+twist\s*:?\s*$/i,"twist"],[/^(?:his\s+|her\s+|their\s+|the\s+)?personality\s*:?\s*$/i,"personality"],
 [/^(?:opening scene concept|opening scene|first scene concept|first encounter|scene setup)\s*:?\s*$/i,"scene"],
 [/^(?:initial message|first message|greeting|custom greeting)\s*:?\s*$/i,"greeting"],
 [/^(?:public\s+)?(?:character\s+)?bio\s*:?\s*$/i,"bio"],
 [/^(?:title|chat name|character name)\s*:/i,"identity"],
 [/^(?:appearance|physical description)\s*:?\s*$/i,"appearance"],[/^(?:background|backstory|history)\s*:?\s*$/i,"backstory"],
 [/^(?:relationship|relationship with \{\{user\}\})\s*:?\s*$/i,"relationship"],
 [/^(?:user role|player role)\s*:?\s*$/i,"role"],[/^(?:voice|speaking style)\s*:?\s*$/i,"voice"],
 [/^(?:worldbook|lorebook|world rules|worldbuilding)\s*:?\s*$/i,"worldbook"],[/^(?:secret|mystery|threat|conflict)\s*:?\s*$/i,"conflict"]
];
function headings(input){
 let active="front";
 const sections={front:[]};
 for(const line of trim(input).split("\n")){
  const stripped=line.trim();
  let match=null;
  if(stripped.length<220){
    for(const [re,key] of headingMap){
      const m=stripped.match(re);if(m){match={key,inline:stripped.slice(m[0].length).trim()};break;}
    }
  }
  if(match){
    active=match.key;
    if(!sections[active])sections[active]=[];
    if(match.inline)sections[active].push(match.inline);
  }else{
    if(!sections[active])sections[active]=[];
    sections[active].push(line);
  }
 }
 for(const [k,arr] of Object.entries(sections))sections[k]=trim(arr.join("\n"));
 return sections;
}
function firstSentences(text,count=2){
 const paragraphs=trim(text).split(/\n\s*\n/).filter(Boolean);
 return paragraphs.slice(0,count).join(" ");
}
function normalizeCap(s){return s.toLowerCase().replace(/\b[\p{L}]/gu,x=>x.toUpperCase());}
function detectIdentity(front,premise,all){
 let name="",age="",title="";
 const lines=front.split("\n").map(trim).filter(Boolean);
 for(let i=0;i<Math.min(5,lines.length);i++){
  // Emoji-prefixed creator headers: ✦ NIA CORBEN | 33
  const head=lines[i].match(/^(?:[^\p{L}\d]{0,8})?([\p{L}][\p{L}'-]+(?:\s+[\p{L}][\p{L}'-]+){1,2})\s*[|·—-]\s*(\d{2,3})\s*$/u);
  if(head){name=normalizeCap(head[1]);age=head[2];title=lines[i+1]||"";break;}
 }
 if(!name){
   const m=all.match(/\b([A-Z][a-zA-Z'-]+\s+[A-Z][a-zA-Z'-]+)\s*,\s*(\d{2,3})\s*,\s*(?:owns?|works?|is|was|runs?|lives?|serves?|has)\b/);
   if(m){name=m[1];age=m[2];}
 }
 if(!name){
  const m=lines.find(x=>/^[A-Z][a-z'-]+ [A-Z][a-z'-]+$/.test(x));
  if(m)name=m;
 }
 if(!age){const m=front.match(/\|\s*(\d{2,3})\b/)||all.match(/\b(?:age|aged)\s*:?\s*(\d{2,3})\b/i);if(m)age=m[1];}
 if(!title){
  const possible=lines.find((line,i)=>line!==name&&!/^\w+:/i.test(line)&&line.length<120&&i<5&&!/^\W*[A-Z][A-Z ]+\|\s*\d+$/.test(line));
  if(possible&&!/^\s*(?:Tropes|The hook)/i.test(possible))title=possible;
 }
 title=title.replace(/^[🎃✦✧\s]+/u,"").trim();
 return {name,age,title};
}
function splitParagraphs(text){return trim(text).split(/\n\s*\n/).map(trim).filter(Boolean)}
function findExplicit(text,re){const m=text.match(re);return m?trim(m[0]):"";}
function openingDraft(section,name,roleHint){
 const s=trim(section);if(!s)return null;
 // A complete authored greeting is canon: preserve it exactly.
 if(/\*[^*]+\*/.test(s)&&/["“”]/.test(s)&&s.length>120)return {text:s,source:"Preserved the complete authored opening exactly as written."};
 const lines=splitParagraphs(s);
 const quote=s.match(/[“"][^"”\n]+[”"]/);
 const spoken=quote?quote[0]:"";
 const action=[];
 for(let sentence of lines){
   if(spoken&&sentence.includes(spoken))continue;
   sentence=sentence.replace(/\s+/g," ").trim();
   if(!sentence)continue;
   action.push(sentence);
 }
 if(!spoken){
   // No dialogue is available: leave the scene as a source-based scaffold and
   // flag missing dialogue. Never invent the character's signature voice.
   const raw=action.slice(0,9).join(" ");
   return {text:raw?"*"+raw+"*":"",source:"Arranged the creator's opening outline without adding invented dialogue; add a character-specific spoken line.",incomplete:true};
 }
 // Adapt only direct-address staging into an actor-focused stage direction.
 // We keep every available event in sequence and preserve the literal quote.
 const intro=action.map(a=>{
  return a
   .replace(/^It[’']s your first night working at ([^.]+)\.$/i,"It is {{user}}'s first night working at $1.")
   .replace(/^You[’']ve been sent backstage to find the owner because/i,"Backstage, the owner is needed because")
   .replace(/^You find ([\p{L} -]+) in his office, arguing with /iu,"$1 is in his office, arguing with ")
   .replace(/^You find ([\p{L} -]+) in her office, arguing with /iu,"$1 is in her office, arguing with ")
   .replace(/^You initially assume /i,"The scene initially appears to show ")
   .replace(/\blooks at you\b/i,"looks toward {{user}}");
 }).join(" ");
 const final=trim("*"+intro+"*\n\n"+spoken);
 return {text:final,source:"Converted original outline beats into one playable narrated scene. Kept their order and quoted dialogue EXACTLY; review the small grammatical staging changes.",incomplete:false};
}
const tagMapping=[[/workplace romance/i,["Workplace","Romance"]],[/monster\s*[×x\/]\s*human/i,["Supernatural","Non-human"]],[/flirty boss/i,["Boss"]],[/dangerous protector/i,["Protective"]],[/supernatural secrets/i,["Mystery","Supernatural"]],[/vampire/i,["Vampire"]],[/werewolf/i,["Werewolf"]],[/gothic/i,["Gothic"]],[/slow.?burn/i,["Slow Burn"]],[/biker/i,["Biker"]],[/fantasy/i,["Fantasy"]],[/horror/i,["Horror"]]];
function convert(input){
 const picked=extractSource(input),text=picked.text;
 if(!text||text.length<24)throw Error("More detail is needed. Paste who the character is and what happens when {{user}} meets them.");
 const s=headings(text),notes=[...picked.notes],changed={},fields={};
 const add=(key,value,why,kind="mapped")=>{
  const v=trim(value);
  if(!v||fields[key])return;
  fields[key]=v;changed[key]={why,kind};
 };
 let identity=detectIdentity(s.front,s.premise,text);
 if(identity.name)add("name",identity.name,"Read the character's exact name from the supplied text.");
 if(identity.age)add("age",identity.age,"Read the stated age from the existing concept; did not invent an age.");
 if(/\bHis Personality\b|\bhe[’']s\s+(?:a|also|playful|handsome)\b/i.test(text))
   add("gender","Male","Inferred male classification from consistent he/his references; verify it matches the actual character.","draft");
 else if(/\bHer Personality\b|\bshe[’']s\s+(?:a|also|playful|beautiful)\b/i.test(text))
   add("gender","Female","Inferred female classification from consistent she/her references; verify it matches the actual character.","draft");
 if(identity.title)add("title",identity.title,"Reused the author's clickable subtitle as the public title.");
 const tropes=s.tropes||"";const hook=s.hook||"";
 if(hook)add("concept",hook,"Mapped the original hook as the story promise without changing the character's premise.");
 else if(s.premise)add("concept",firstSentences(s.premise,1),"Used the first source premise sentence as the seed hook; no new plot facts were introduced.","draft");
 if(tropes)add("dynamic",tropes,"Retained the supplied tropes and relationship promise verbatim.");
 const premise=s.premise||"";
 const premiseBits=splitParagraphs(premise);
 const characterIntroduction=premiseBits.find(p=>identity.name&&p.includes(identity.name))||"";
 const supernaturalReveal=premiseBits.find(p=>/^(?:He|She|They)[’']s also an? (?:demon|vampire|ghost|werewolf|fae|dhampir)\./i.test(p))||"";
 const originalBio=[hook||firstSentences(premise,2),characterIntroduction,supernaturalReveal].filter(Boolean).join("\n\n");
 if(s.bio)add("bio",s.bio,"Copied the supplied public bio exactly.");
 else if(originalBio)add("bio",originalBio,"Built the short public introduction from an existing hook, keeping the source wording.","draft");
 if(s.appearance)add("appearance",s.appearance,"Copied the author-provided appearance without inventing visual traits.");
 else {
  // Only explicit visual cues; avoid extrapolation from trope labels.
  const m=text.match(/(?:his|her|their)\s+((?:(?:\w+[, ]+){0,5})?(?:horns|pointed ears|glowing eyes)(?:[^.\n]{0,100}))/i);
  if(m)add("appearance",m[1].replace(/\s+are\s+(?:elaborate\s+)?(?:prosthetics|fake|a costume|special effects).*$/i,"").trim(),"Extracted identifying physical features only, not the character’s initial assumption they are fake.","draft");
 }
 if(s.backstory)add("backstory",s.backstory,"Preserved the backstory exactly.");
 if(s.personality){
   const ps=splitParagraphs(s.personality);
   const rel=[],person=[];
   for(const p of ps){
     if(/\b(?:affection|relationship|trust|intimacy)\b/i.test(p)&&/\b(?:develops|grows|immediate|automatic|progress|through everyday)\b/i.test(p)){rel.push(p);continue;}
     person.push(p);
   }
   add("traits",person.join("\n\n")||s.personality,"Copied the author's character-specific personality and everyday behavior with its original voice.");
   if(rel.length)add("relationship",rel.join("\n\n"),"Moved the author's existing relationship progression statements verbatim from Personality to the appropriate Fizzz field.");
 }
 if(s.relationship)add("relationship",s.relationship,"Copied the supplied starting relationship and progression rules.");
 const sourceRelationship=splitParagraphs(premise).filter(p=>/\b(?:interested in keeping you around|rather than firing you|newest seasonal employee|first human employee)\b/i.test(p));
 if(sourceRelationship.length){
   const addition=sourceRelationship.join("\n\n");
   if(fields.relationship){
     // Add only source sentences not already included elsewhere in this field.
     const unique=sourceRelationship.filter(p=>!fields.relationship.includes(p));
     if(unique.length){fields.relationship=unique.join("\n\n")+"\n\n"+fields.relationship;
       changed.relationship={why:"Preserved the original starting dynamic from the premise alongside its stated slow relationship development.",kind:"draft"};}
   }else add("relationship",addition,"Preserved original relationship and player-employment context from the source premise.","draft");
 }
 if(s.role)add("role",s.role,"Copied the supplied player role; did not assign new actions or feelings.");
 if(s.voice)add("voice",s.voice,"Preserved the author's speaking style.");
 if(!s.voice&&s.personality){
    const spoken=splitParagraphs(s.personality).find(p=>/\b(?:sarcastic|playful|flirtatious|dry humor|wry|teases|soft-spoken|blunt|measured)\b/i.test(p));
    if(spoken)add("voice",spoken,"Provisional speaking-style direction borrowed verbatim from the author's personality. Refine phrasing and sentence rhythm in The Person.","draft");
 }
 if(s.tropes&&/workplace|boss/i.test(tropes)&&s.premise){
  const m=findExplicit(s.premise,/\b[\p{L}][\p{L} '-]{2,70}\s*,\s*\d{2,3},\s*owns[^.\n]+\./iu);
  if(m)add("occupation",m,"Reused the premise's explicit employer/occupation detail; no invented career.","draft");
 }
 const creature=(premise+" "+s.personality).match(/\b(?:an actual, centuries-old|a centuries-old|a|an)\s+(demon|vampire|werewolf|dhampir|incubus|fae|ghost|elf|dragon)\b/i);
 if(creature){
    const centuries=/\b(?:centuries-old|centuries old|several centuries)\b/i.test(premise);
    add("species",centuries?"centuries-old "+creature[1]:creature[1],"Extracted the species and, when explicitly present, the distinction between apparent age and centuries-old existence.");
 }
 if(s.twist){
  add("conflict",s.twist,"Retained the author's entire story twist as the conflict engine. No invented antagonist or reveal.");
 }
 if(s.conflict)add("conflict",s.conflict,"Kept the author's own conflict text.");
 if(!fields.role){
   const employeeMatch=premise.match(/\bnewest seasonal employee\b/i);
   const roleLine=employeeMatch&&identity.name?"{{user}} is "+identity.name+"'s newest seasonal employee.":hook||findExplicit(premise,/[^\n.]*newest seasonal employee[^\n.]*/i);
   if(roleLine)add("role",roleLine,"Derived the starting player role from an existing employee reference; did not decide {{user}}'s feelings or future response.","draft");
 }
 const opening=s.greeting?{text:s.greeting,source:"Kept the existing full greeting verbatim."}:
      openingDraft(s.scene,identity.name,fields.role);
 if(opening?.text)add("initialRaw",opening.text,opening.source,opening.incomplete?"draft":"draft");
 if(opening?.incomplete)notes.push("Opening outline did not include voiced character dialogue. The first-scene text is a scaffold, not a final spoken greeting.");
 if(!opening)notes.push("No opening scene was provided. The creator did not invent dialogue; write a first encounter with a filmable action and an open user response.");
 if(!s.personality)notes.push("There is no clearly labeled Character Personality section. Add specific triggers, contradictions and speaking style rather than relying only on the premise.");
 if(!s.voice)notes.push("Speaking Style wasn't separately supplied. The bot needs your distinctive sentence rhythm, vocabulary, and behavior under stress.");
 if(!s.appearance&&!fields.appearance)notes.push("Written appearance wasn't stated. Fizzz's TEXT model does not learn appearance from uploaded images: add height/build, face, hair, eyes and distinguishing features.");
 if(fields.appearance&&!/\b(?:height|build|hair|skin|tall|short|feet|eyes? (?:are|is))\b/i.test(fields.appearance))
   notes.push("Some visual traits were extracted, but the full look is not established. Add height, build, hairstyle, eyes, clothing and any canonical tattoos/scars rather than letting the bot invent them.");
 if(s.worldbook)add("world1Body",s.worldbook,"Moved prewritten lore into Worldbook without changing facts.");
 else{
  const worldFacts=splitParagraphs(premise).filter(p=>/entire staff|vampires handle|ghosts manage|werewolves|supernatural creatures pretending|haunted attraction|Blackthorn House exists/i.test(p));
  const twistRules=splitParagraphs(s.twist).filter(p=>/temporarily lose|exists to give|on Halloween night/i.test(p));
  const merged=[...new Set([...worldFacts,...twistRules])];
  if(merged.length){
    add("world1Title",identity.name?"Setting & Rules":"World Rules","Labeled the explicit setting rules in one optional Worldbook.");
    add("world1Mode","always","Continuous world rules are a suggested Always Active entry; change the activation if they only apply in certain scenes.","draft");
    add("world1Body",merged.join("\n\n"),"Moved already supplied world rules, staff roles and Halloween mechanics into Worldbook; did not invent facts.","draft");
  }
 }
 if(s.twist&&/something dangerous|something .* among the customers|didn.t hire/i.test(s.twist)){
   const mystery=splitParagraphs(s.twist).filter(p=>/something dangerous|something .* among the customers|didn.t hire|particularly interested/i.test(p));
   if(mystery.length){
     add("world2Title","Uninvited Presence","Created a descriptive label for an unresolved source mystery, not a new character or reveal.","draft");
     add("world2Mode","keyword","Suggested a keyword entry for optional investigation scenes.","draft");
     add("world2Keywords","Halloween, customers, uninvited","Suggested conversational triggers grounded in terms already present; review before publishing.","draft");
     add("world2Body",mystery.join("\n\n"),"Preserved existing mystery statements; the intruder's identity remains intentionally unresolved.","draft");
   }
 }
 // Unlabeled prose is still helpful without pretending to have inferred complete personality.
 if(!Object.keys(fields).length){
  add("concept",firstSentences(text,2),"Used your first two paragraphs as the raw concept. More detailed author input is needed for a complete bot.","draft");
 }
 if(!fields.name)notes.push("No unambiguous character name detected. The creator will NOT invent one; add it in The Invitation.");
 if(!fields.age)notes.push("No explicit age detected. Choose an adult age appropriate to the story.");
 if(!fields.title&&fields.name)add("title",fields.name,"Used the creator's original name as the public title; no marketing hook was invented.","draft");
 if(!fields.bio&&fields.concept)add("bio",fields.concept,"Reused the supplied premise as the public introduction; review for clickability.","draft");
 if(!fields.traits&&premise){
    notes.push("The concept contains plot, but no separately described psychological traits. Write personality behavior in The Person; the converter will not invent a history or character psychology.");
 }
 const tags=[];
 for(const [re,list] of tagMapping)if(re.test(tropes||text.slice(0,350)))for(const tag of list)if(!tags.includes(tag))tags.push(tag);
 const remaining=Object.entries(s).filter(([k,v])=>v&&!["front","hook","tropes","premise","twist","personality","scene","greeting","bio","relationship","role","appearance","backstory","voice","worldbook","conflict"].includes(k));
 notes.push("The converter reorganizes and lightly formats only source facts. It is NOT an AI creative writer. Verify the drafted Initial Message and add missing personality/voice/media details in the normal Fizzz chapters.");
 return {sourceText:text,rawInput:trim(input),fields,notes,explanations:changed,tags:tags.slice(0,7),remainder:remaining.map(x=>x.join("\n")).join("\n\n"),fromPrompt:picked.fromPrompt};
}
function start(){
 const field=$("#concept-source"),status=$("#concept-status"),report=$("#concept-report"),section=$("#concept-results");
 if(!field)return;
 let last=null;
 const say=(msg,error=false)=>{status.textContent=msg;status.dataset.level=error?"error":"success";};
 const results=(converted,applied,skipped)=>{
  report.replaceChildren();
  const lead=document.createElement("p");lead.textContent=applied.length+" real Fizzz fields filled"+(skipped.length?" · "+skipped.length+" existing fields protected":"")+". Original source retained. New draft is editable below."+(!applied.length?" To replace a previous character, tick Start a new character project and build again.":"");report.append(lead);
  for(const [key,value] of Object.entries(converted.fields)){
   const card=document.createElement("article");card.className="concept-result";
   const label=document.createElement("b");label.textContent=key+" · "+value.length+" chars";const why=document.createElement("p");
   why.textContent=converted.explanations[key]?.why||"Retained source text.";
   const text=document.createElement("pre");text.textContent=value.length>1150?value.slice(0,1150)+"… (open chapter to see full text)":value;
   card.append(label,why,text);report.append(card);
  }
  if(converted.notes.length){
   const notes=document.createElement("div");notes.className="concept-missing";
   const title=document.createElement("b");title.textContent="What still needs your attention";notes.append(title);
   for(const item of converted.notes){const p=document.createElement("p");p.textContent="✧ "+item;notes.append(p)}
   report.append(notes);
  }
  section.hidden=false;
  section.scrollIntoView({behavior:"smooth",block:"start"});
 };
 const build=(input,opts={})=>{
  const C=window.VelvetRuinFizzzConceptConverter;
  try{
    const data=C.convert(input);
    const a=window.FizzzAtelier;
    if(!a?.importDraft)throw Error("Character editor hasn't loaded. Refresh the page and retry.");
    if($("#concept-start-fresh").checked){
      if(!a.beginFreshDraft()){say("Fresh-project creation was cancelled. Your current character remains unchanged.",true);return null;}
      $("#concept-start-fresh").checked=false;
    }
    const {applied,skipped}=a.importDraft(data.fields,{replace:false,tags:data.tags});
    last=data;field.value=input;
    try{localStorage.setItem("velvetruin.fizzz.lastConceptSource",input)}catch{}
    results(data,applied,skipped);
    say("✓ Fizzz draft created: "+applied.length+" fields filled"+(skipped.length?"; "+skipped.length+" existing fields preserved. Tick ‘Start a new character project’ if you want a completely separate bot":"")+". Review the mapping, then edit the fields in The Invitation and The Person.");
    return data;
  }catch(e){say(e.message||"Could not assemble a draft from this paste.",true);return null;}
 };
 $("#build-from-concept").addEventListener("click",()=>build(field.value));
 $("#concept-example").addEventListener("click",()=>{
  field.value="✦ NIA CORBEN | 33\n\nThe Night-Shift Mechanic Has a Missing Day\n\nTropes: Mystery • Slow Burn • Workplace\n\nThe hook:\nA late-night repair shop returns an item you lost years ago. Its owner insists it was delivered tomorrow.\n\nThe Premise\n\nNia Corben, 33, owns Lantern Lane Repairs, an all-night repair shop in a riverside town.\n\nShe's intensely observant, practical, and reluctant to make promises she can't keep.\n\nA strange pattern of deliveries has begun: objects arrive with dates that haven't happened yet.\n\nHer Personality\n\nNia prefers to solve problems with her hands. When worried, she becomes quieter and asks specific questions. She finds humor in badly timed observations.\n\nThe Halloween Twist\n\nEvery year on October 31, the repair shop receives a single parcel addressed to a person who hasn't arrived.\n\nOpening Scene Concept\n\nThe shop is closing for the night.\n\nNia sets a sealed parcel on the counter.\n\nShe examines the date stamped on the box.\n\nThen she looks toward the visitor.\n\n“Your name has appeared on three of these parcels.”";
  say("Original demonstration loaded. Press Build Fizzz Draft to populate the creator fields.");
 });
 $("#concept-clipboard").addEventListener("click",async()=>{
   try{if(!navigator.clipboard?.readText)throw Error("Clipboard unavailable");
     const s=await navigator.clipboard.readText();if(!s.trim())throw Error("Clipboard empty");
     field.value=s;say("Text pasted from clipboard. Press Build Fizzz Draft.");
   }catch{say("On iPhone, tap and hold inside the input box, select Paste, then Build Fizzz Draft.",true);field.focus();}
 });
 $("#concept-open-profile").addEventListener("click",()=>window.FizzzAtelier?.chapter("profile"));
 $("#concept-review-migration").addEventListener("click",()=>{
    if(!last)return;
    $("#migration-paste").value=last.rawInput;
    $("#migration-paste").dispatchEvent(new Event("input",{bubbles:true}));
    window.FizzzAtelier?.chapter("migrate");
    $("#build-from-migration").click();
 });
 $("#concept-save-source").addEventListener("click",()=>{if(last)window.FizzzAtelier?.download("fizzz-original-character-source.txt",last.rawInput);});
 $("#concept-expand-ai").addEventListener("click",()=>{
   if(!last)return say("Build a source-based draft first, then request help finishing what's missing.",true);
   $("#copy-original-ai").click();
   say("An original-character drafting brief was copied for ChatGPT. Paste it into ChatGPT to develop only missing areas; then return its complete JSON to the 'Original Character Drafting with AI' section for approval.");
 });
 // Allow Migration Studio to recognize pasted natural language (and formerly Tipsy)
 // copyedit instructions containing an original text block.
 window.VelvetRuinFizzzBuildFromPaste=build;
}
window.VelvetRuinFizzzConceptConverter=Object.freeze({convert,extractSource});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();