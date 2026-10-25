/* VelvetRuin Fizzz Character Atelier · a local-first original creator.
   Fizzz platform numbers: official creator guidelines; creative templates are editorial. */
(() => {
"use strict";
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const STORAGE="velvetruin.fizzz.atelier.v1";
const PAGES=["spark","profile","core","opening","world","media","review","migrate","handbook"];
const EDITABLE=new Set(["concept","archetype","dynamic","conflict","role","arc","name","title","age","gender","pov","rating","bio","warning","appearance","occupation","species","backstory","traits","contradiction","motivation","relationship","behavior","boundaries","voice","coreRaw","initialRaw","openingScene","openingAction","openingLine","openingBeat","world1Title","world1Mode","world1Keywords","world1Body","world2Title","world2Mode","world2Keywords","world2Body","world3Title","world3Mode","world3Keywords","world3Body","coverDirection","imageDirection","videoDirection","voiceDirection","voiceDesignPrompt","voiceId","musicDirection"]);
const TAGS=["Original Character","Romance","Slow Burn","Enemies to Lovers","Friends to Lovers","Forced Proximity","Arranged Marriage","Marriage Drama","Boss","Workplace","Protective","Mafia","Crime","Biker","Sports","College","Comfort","Angst","Mystery","Supernatural","Vampire","Werewolf","Omegaverse","Fantasy","Gothic","Horror","Sci-Fi","Historical","Adventure","Drama","Slice of Life","Found Family","Green Flag","Rivals","Western","Non-human"];
const INITIAL={};
for(const k of EDITABLE)INITIAL[k]="";
INITIAL.age="";INITIAL.gender="";INITIAL.pov="Any POV";INITIAL.rating="Limited";
for(let i=1;i<=3;i++)INITIAL["world"+i+"Mode"]=i===1?"always":"keyword";
const arch=[
{id:"blank",icon:"✧",name:"Blank Canvas",tag:"No preset. Make it entirely yours.",concept:"",dynamic:"",conflict:"",role:"",scene:"",action:"",line:"",beat:"",trait:"",voice:""},
{id:"mafia",icon:"♠",name:"Criminal Protector",tag:"Danger · loyalty · a real choice",concept:"A feared strategist offers safety without demanding surrender.",dynamic:"Dangerous but self-controlled. Fierce loyalty grows through earned trust.",conflict:"Someone in the criminal world wants to exploit {{user}}'s knowledge. Protection has a cost the character refuses to hide.",role:"{{user}} is an adult who unexpectedly holds information both sides want.",scene:"A rain-dark private office after an interrupted meeting.",action:"The character sets an unmarked envelope on the table and steps back.",line:"You should know the price before you decide.",beat:"The character leaves the envelope unopened, waiting for {{user}} to choose.",trait:"Strategic, observant and ruthless when necessary, but refuses to confuse protection with ownership.",voice:"Precise, low-key sentences; promises rarely, follows through."},
{id:"marriage",icon:"♜",name:"Marriage Under Strain",tag:"Intimacy · distance · repair",concept:"A marriage looks perfect to everyone but the two people living inside it.",dynamic:"An established connection strained by silence and accumulated expectations.",conflict:"A long-overdue decision can no longer be postponed, but neither person knows what the other truly wants.",role:"{{user}} is an adult partner whose feelings, history details and choices remain theirs.",scene:"A familiar kitchen after an event neither person wanted to attend.",action:"The character removes a watch, then stops before setting it down.",line:"We can keep pretending, or we can finally have the conversation.",beat:"They leave space for {{user}} to speak without deciding the answer.",trait:"Capable and attentive in public; struggles to be vulnerable in private.",voice:"Understated and specific; words become careful when emotions rise."},
{id:"workplace",icon:"◆",name:"Impossible Boss",tag:"Ambition · workplace tension",concept:"A demanding leader needs the one colleague who is unimpressed by power.",dynamic:"Professional friction can grow into admiration and a slow-earned bond.",conflict:"A career-defining project forces cooperation and puts both reputations at risk.",role:"{{user}} is an adult professional assigned to a high-stakes project.",scene:"An almost-empty office after a major deadline moves forward.",action:"The character pushes the amended brief across the desk.",line:"Tell me which part of this plan you think won't survive tomorrow.",beat:"The final decision is not made until {{user}} weighs in.",trait:"Hard to impress, quietly meticulous; rewards competence rather than obedience.",voice:"Short direct questions, dry humor, rare unguarded compliments."},
{id:"forbidden",icon:"☾",name:"Complicated Connection",tag:"Adult forbidden feelings · restraint",concept:"Two adults have every reason to maintain distance, until circumstances refuse to cooperate.",dynamic:"Mutual attraction complicated by loyalties, obligations or conflicting goals.",conflict:"A choice that protects one person may cost the other something important.",role:"{{user}} is an adult whose position creates an ethical or social complication.",scene:"A quiet corridor immediately after a difficult public announcement.",action:"The character offers a confidential document but keeps their distance.",line:"This changes what we can ask of each other.",beat:"The character waits rather than deciding how {{user}} feels.",trait:"Self-aware, restrained, principled; not immune to desire or self-doubt.",voice:"Measured, candid under pressure, never speaks for the other person."},
{id:"comfort",icon:"❀",name:"Comfort & Connection",tag:"Green flag · everyday intimacy",concept:"The person who always notices the small things has been waiting to be noticed too.",dynamic:"Slow friendship-to-love built from consistent acts of care.",conflict:"A life change threatens the routine that kept them close.",role:"{{user}} is an adult friend or neighbor with an independently chosen future.",scene:"A familiar cafe closing earlier than expected.",action:"The character slides over a takeaway cup made the way {{user}} usually orders it.",line:"I didn't assume you'd stay. I just didn't want you to go hungry.",beat:"There's an empty chair and an invitation with no pressure attached.",trait:"Warm, steady and observant, with a life and ambitions of their own.",voice:"Conversational, humorous, reassuring without minimizing problems."},
{id:"biker",icon:"⚡",name:"Biker & Rival",tag:"Adrenaline · shared ambition",concept:"A skilled rider's worst rival is the only person they trust on the track.",dynamic:"Competitive chemistry that depends on mutual respect.",conflict:"A damaged bike before an important run exposes an old dispute.",role:"{{user}} is an adult rider, mechanic or invited guest with agency over their role.",scene:"A garage under bright inspection lights.",action:"The character places a worn part beside a pristine replacement.",line:"You think I'm wrong? Show me where.",beat:"Their challenge is an invitation to collaborate, not submit.",trait:"Competitive, technically meticulous, protective of friends.",voice:"Quick banter, precise technical language, quieter when stakes are personal."},
{id:"campus",icon:"✺",name:"Campus Rival",tag:"Adult university · reputation",concept:"A campus celebrity's confidence cracks around the one person who sees through the performance.",dynamic:"Rivals with room for accountability and earned growth.",conflict:"A public mistake threatens the character's carefully managed social standing.",role:"{{user}} is an adult university peer with their own alliances and ambitions.",scene:"A nearly empty student center after a crowded event.",action:"The character sets down the phone everyone has been talking about.",line:"Before you say anything, you deserve the actual story.",beat:"A genuine apology is possible, but forgiveness is {{user}}'s decision.",trait:"Charming, strategic, prideful; capable of taking responsibility.",voice:"Socially effortless until sincere, when words turn direct and awkward."},
{id:"supernatural",icon:"☽",name:"Dangerous Supernatural",tag:"Vampire · dhampir · hidden rules",concept:"An immortal's oldest rule fails the moment an unexpected visitor crosses the threshold.",dynamic:"Strangeness and yearning with real consent and character choice.",conflict:"A secret magical restriction threatens both the visitor and the character's home.",role:"{{user}} is an adult unexpected visitor with a reason to enter a forbidden place.",scene:"A candlelit entrance hall while something knocks from inside the wall.",action:"The character covers an old sigil before opening the inner door.",line:"You may leave, but first I need you to understand what followed you here.",beat:"They wait for {{user}} to decide whether to listen.",trait:"Old-world formality masking humor, curiosity and genuine unease.",voice:"Calm, articulate, occasional irreverent observations."},
{id:"gothic",icon:"✦",name:"Gothic Enigma",tag:"Haunted places · emotional secrets",concept:"Someone bound to a forgotten building discovers the world is still capable of surprising them.",dynamic:"A stranger's arrival challenges a carefully defended isolation.",conflict:"An impossible event implies the building's history has been deliberately falsified.",role:"{{user}} is an adult visitor who finds something the character believed was destroyed.",scene:"A silent chapel just as an old bell rings without moving.",action:"The character catches a falling candle before it touches the floor.",line:"That name hasn't been spoken here in thirty years.",beat:"The object remains in {{user}}'s hands for them to inspect.",trait:"Intelligent, skeptical, wry; longing hidden beneath curiosity.",voice:"Lyrical only when distracted; otherwise cutting and precise."},
{id:"western",icon:"♧",name:"Rural Protector",tag:"Small town · weathered loyalty",concept:"A capable loner is forced to share the one place they never let anyone enter.",dynamic:"Rugged self-reliance slowly learning to accept help.",conflict:"A land dispute and an incoming storm force cooperation before trust exists.",role:"{{user}} is an adult newcomer or neighbor with a stake in the unfolding events.",scene:"A stable office as a storm rolls across the valley.",action:"The character pins a damaged property map beside an intact one.",line:"You can walk away. I wouldn't blame you. But the land won't wait.",beat:"The character leaves the map open for {{user}} to examine.",trait:"Practical, patient, fiercely fair, bad at asking for help.",voice:"Spare, dry, concrete details; affection expressed through work."},
{id:"fantasy",icon:"♛",name:"Fantasy Outcast",tag:"Non-human · duty · discovery",concept:"A feared outsider must choose between an ancient duty and a life never offered to them.",dynamic:"Discovery, difference, earned trust and possible romance.",conflict:"A fragile treaty has been broken, and the only witness may change everything.",role:"{{user}} is an adult emissary, traveler or witness whose identity remains flexible.",scene:"A border sanctuary just after the protective runes go dark.",action:"The character withdraws a weapon and lays it on the altar.",line:"I can offer you the truth. I can't promise you will like it.",beat:"A sealed record remains between them.",trait:"Proud, perceptive and wary; honor is a practical commitment.",voice:"Formal in public, quietly candid in private."},
{id:"mystery",icon:"⌘",name:"Investigation & Secrets",tag:"Clues · player-directed discovery",concept:"A careful investigator finds evidence that contradicts their most trusted memory.",dynamic:"A reluctant alliance with gradually increasing trust.",conflict:"New evidence undermines a closed case, and someone wants it to stay closed.",role:"{{user}} is an adult potential witness or independent investigator.",scene:"An archive room after an unexplained power failure.",action:"The character turns an old photograph toward the lamp.",line:"There's a person in this picture who wasn't there yesterday.",beat:"The photograph stays where {{user}} can examine it.",trait:"Analytical, patient, secretly sentimental about unsolved cases.",voice:"Asks precise questions, allows silence, never leaps to conclusions."}
];
const field=(key,labelText,guide,example,cut,expand,opts={})=>({key,label:labelText,guide,example,cut,expand,...opts});
const sparkle=[
 field("concept","The character's core hook","Write ONE sentence describing who they are and what makes meeting them extraordinary.","An exiled palace archivist discovers the visitor carries a page written in his own handwriting a century ago.","Skip generic adjective clusters and unrelated backstory.","Add a second sentence only if the player cannot understand the stakes.",{rows:3}),
 field("dynamic","Relationship promise","What kind of connection can actually develop: rivals, allies, reunited partners, slow-burn, dangerous protector?","Distrustful partners who grow closer through solving a mystery; trust must be earned.","Avoid predicting that {{user}} falls in love.","Explain distinct phases if the dynamic is genuinely unusual.",{rows:3}),
 field("conflict","Immediate problem / story engine","Explain what keeps interaction going after the first three messages.","Three archive ledgers disagree about which year the city burned; the next ledger vanishes tonight.","Avoid vague 'secrets and danger'.","Specify evidence, deadlines or story rules if needed.",{rows:3}),
 field("role","{{user}}'s entry role","Give the player an actionable position, but do not control their emotions, decisions, body or gender.","{{user}} is an adult who arrives with an impossible page; their history and decisions remain their own.","Don't write 'you are terrified and obey immediately'.","Constrain the role only when essential to the premise.",{rows:3}),
 field("arc","Long-term change that may occur","What could the character learn or want without demanding a single ending?","The archivist learns that survival alone is no longer enough; trust changes only through events in play.","Do not prescribe a wedding, pregnancy, or predetermined outcome.","Add milestones for investigative plots.",{rows:3})
];
const profile=[
 field("title","Public title *","This is clickable, public copy. Use a short identity + hook, not explicit shock wording.","The Archivist Who Remembers Tomorrow","Cut unnecessary adjectives.","Name alone is fine if the character is already distinctive."),
 field("name","Character Chat Name *","The name the AI character uses. Avoid duplicate or near-identical names across your own cast.","Corvin Dace","Avoid elaborate titles in the chat name.","Include surnames if needed to distinguish recurring casts."),
 field("age","Character age / age range","Use an unambiguous adult age, especially in romantic plots.","38","Don't imply an underage romantic character.","Fantasy age may have an apparent age plus actual age clarified in Core Personality."),
 field("gender","Gender tag *","Choose the character's gender for Fizzz categorization.","Male","Do not infer from appearance.", "Clarify gender identity in Core Personality when relevant.",{type:"select",choices:["","Male","Female","Non-binary","Other / set on Fizzz"]}),
 field("pov","POV tag *","Choose how the bot is presented to users. Confirm platform values during publishing.","Any POV","Never force {{user}}'s pronouns if your premise is flexible.","Use a constrained perspective only when essential to the story.",{type:"select",choices:["Any POV","Female POV","Male POV","Other / set on Fizzz"]}),
 field("rating","Rating tag *","Choose the correct rating in Fizzz. Ratings do not override platform safety rules.","Limited","Do not use a rating to circumvent prohibited content.","Explain darker-but-permitted themes in public warnings.",{type:"select",choices:["Limited","Limitless","Choose on Fizzz"]}),
 field("bio","Character Bio · public","Tell readers who the character is, what they can experience, and their player role. Bio does NOT drive model behavior.","An archivist who remembers books that were never written. You arrive with a page from tomorrow, and he is the only person who can read it. Slow-burn mystery; player-directed discoveries.","Do not copy the entire Core Personality.","Add premise boundaries or content warnings if the experience is intense.",{rows:5}),
 field("warning","Optional content advisory","State relevant permitted intense themes without sensationalizing them.","Content note: grief, supernatural horror, family secrets.","Do not make unsupported safety promises.","Mention high-intensity themes players might want to avoid.",{rows:2})
];
const core=[
 field("occupation","Identity & role","Give profession/species-role and why the character is where the story begins.","Municipal archivist, responsible for maintaining sealed city records.","Cut resume-like details that never affect play.","Add operational responsibilities for workplace or political plots.",{rows:2}),
 field("species","Species / supernatural identity","Specify human, nonhuman or special nature. Clarify fictional mechanics in Worldbook.","Human with an involuntary memory anomaly.","Avoid unexplained powers.","Expand on unique abilities only if they affect decisions.",{rows:2}),
 field("appearance","Appearance the text model must know","The character images don't instruct Fizzz's TEXT model. Describe build, face, hair, eyes, key marks, clothing and consistent details.","6'2, lean, deep-brown eyes, dark hair cut short at the sides, fine scar above the left eyebrow, charcoal coat.","Avoid praising attractiveness without describing it.","Important scars, prosthetics and visual rules are worth spelling out.",{rows:4}),
 field("backstory","Causal background","What happened and HOW did it shape today's behavior? Keep events that drive choices.","After misfiling a witness statement years ago, he developed an exacting habit of checking every date twice.","Avoid chronology with no behavioral impact.","Add background when secrets, plot clues or long-term motivation require it.",{rows:4}),
 field("traits","Core personality · observable behavior","Describe trait, trigger, reaction and contradiction, not just a personality adjective list.","He appears detached when questioned, but remembers tiny acts of kindness. When cornered, he becomes quieter and asks more precise questions.","Replace 'cold, kind, protective' with situations and behavior.","Spend more when a layered character reacts differently across contexts.",{rows:5}),
 field("contradiction","Internal contradiction","Describe two competing truths that both genuinely belong to the character.","He claims not to care whether anyone believes him, yet he saves every note written by people who do.","Don't force a tragedy just to add depth.","Multiple contradictions are useful for story-rich characters.",{rows:3}),
 field("motivation","Character goals & lasting drive","What does this person pursue even when {{user}} is absent?","He wants to reconstruct the lost register before the city council destroys it.","Avoid making love the only possible ambition.","Describe conflicts between goals if necessary.",{rows:3}),
 field("relationship","Relationship with {{user}} · starting state","Explain how the character treats {{user}} now, without forcing future intimacy.","At first he treats {{user}} as an unreliable source, but offers honest information when they ask direct questions.","Never predetermine {{user}}'s attraction or compliance.","For marriage or complex histories, include crucial context.",{rows:4}),
 field("behavior","Growth & behavior under pressure","What should change with earned trust? What remains consistent?","He does not confess affection after a single kind exchange. Trust grows through shared discoveries, mistakes, and repairs.","Avoid rigid turn-based affection counters.","Explain redemption/accountability requirements for morally gray characters.",{rows:4}),
 field("boundaries","Behavioral boundaries / agency rules","Keep concise. Add after testing if the bot oversteps. Protect player agency while preserving tension.","Do not narrate {{user}}'s choices, private thoughts or consent. Remain capable of disagreement; never force immediate reconciliation.","Don't bury personality under 40 negative rules.","Add only specific rules for observed drift.",{rows:4}),
 field("voice","Speaking style · last in the core","Tone, sentence length, vocabulary, characteristic reaction, restrained mannerisms. Fizzz has no dedicated example-dialogue field.","Measured, concrete sentences; rarely repeats himself. Uses dry humor under stress. Falls silent rather than shouting when hurt.","Avoid long sample conversations that the model may parrot.","Add one signature line if truly distinctive.",{rows:4}),
 field("coreRaw","Optional verbatim Core Personality · preserved source","Use this to import an existing persona word-for-word. When populated, the final Core Personality prioritizes this original text; write extra clarification above only if intentionally needed.","# Identity\nOriginal character settings preserved without rewriting.","Don't paste a duplicate of fields already completed.","Use this for long/complex established bots when exact canon matters.",{rows:7})
];
const opening=[
 field("initialRaw","Complete Initial Message · recommended","For full control, write the opening here in prose with character dialogue. A migrated initial message is preserved verbatim.","*The archive's last lamp guttered. Corvin closed the ledger with two fingers.* \"This page should not exist.\" *He laid it where {{user}} could see.* \"Where did you get it?\"","Avoid writing {{user}}'s thoughts, actions and answers.","Longer openings are fine when each beat adds meaningful tension.",{rows:11}),
 field("openingScene","Scene · location, time & atmosphere","Only needed if you build the opening from separate beats below.","The archive is closing during a heavy storm; a page has arrived that should not exist.","Avoid a full exposition dump.","Add a couple sensory details for image/video cohesion.",{rows:3}),
 field("openingAction","What the character visibly does","Give natural motion and a revealing action that video could portray.","Corvin sets the sealed register on the counter, keeping one finger on its broken clasp.","Avoid impossible camera jumps.","A special movement is worth describing if it defines the scene.",{rows:3}),
 field("openingLine","One or two spoken lines","The Opening Film uses dialogue. Write a line that sounds like this particular person.","\"Tell me where you found this.\"","Avoid monologues or performing {{user}}'s reply.","A second line is fine if the scene calls for it.",{rows:3}),
 field("openingBeat","Playable opening beat","End with an open invitation, choice or unresolved event.","He steps away from the register, leaving {{user}} room to examine it.","Don't end with {{user}} agreeing, kissing or escaping automatically.","Complex mystery scenes may contain multiple open options.",{rows:3})
];
const media=[
 field("coverDirection","Cover · 3:4 promotional composition","Face visible. The cover is a clickable poster, not the video-driving image. Note cropping and avoid watermarks.","3:4 vertical portrait, centered adult archivist, rain-speckled windows, warm desk lamp, face unobstructed.","Avoid heavy typography obscuring the face.","Stylistic illustration elements can work on the cover.",{rows:4}),
 field("imageDirection","Character Images · 9:16 up to three","Design consistent single-subject images for video generation. Face, lighting, clothes and age should match Core Personality.","9:16 photorealistic single adult male, dark cropped hair, brown eyes, charcoal coat; medium portrait in candlelit archive, face entirely visible.","Avoid multiple people, heavy blur and obscured faces.","Describe alternate outfit/scene images if the identity remains recognizable.",{rows:5}),
 field("videoDirection","Opening Film & movement notes","Match the opening text's lighting, pose and actions to the character image.","Opening at desk: hands rest on ledger, he glances at its seal and speaks one measured line.","Avoid unfilmable poses, props changing hands and scene contradictions.","Add one precise gesture if central to the first impression.",{rows:4}),
 field("voiceDirection","Required voice · casting notes","Fizzz voice is mandatory; describe timbre, accent, pace and tone, then choose a voice on the platform.","Mature low-mid register, measured tempo, unhurried diction, dry undertone.","Don't select based on accent stereotypes alone.","Include emotion shifts for a layered character.",{rows:3}),
 field("voiceDesignPrompt","Design Voice · 20-word maximum","Fizzz Design Voice descriptions may be at most 20 words. Prioritize language, adult age feel, pitch, timbre, pace, emotion and clean recording quality.","Native English. Male, 30s. Low-pitched, raspy, calm, slow pacing. Warm and steady.","Remove effects words such as reverb, echo, phone, tape; they can harm voice quality.","A voice with distinct language and pacing may use the full 20-word allowance.",{rows:2}),
 field("voiceId","Optional ElevenLabs V3 Voice ID","If you have an authorized ElevenLabs V3 Voice ID, copy it here for your production notes. Paste into Fizzz where supported; verify availability in your account.","An authorized voice ID from your selected ElevenLabs V3 library voice.","Do not paste private credentials or API keys.","Include the ID only if you are actually selecting a supported custom voice."),
 field("musicDirection","Optional background music","Keep music subtle enough to complement dialogue and scene.","Sparse piano, distant rain ambience, restrained and cinematic.","Avoid music that contradicts the scene.","Music can change by location if important.",{rows:2})
];
const WB="world";
function worldFields(){const result=[];
 for(let i=1;i<=3;i++){
   result.push(field("world"+i+"Title","Entry "+i+" · title / focus","One theme per Worldbook entry. Keep character identity in Core Personality.","The Archive's Locked Register","Do not cram all lore into one page.","Separate scenes, people and rules when each has different activation.",{rows:1}));
   result.push(field("world"+i+"Mode","Entry "+i+" · activation","Always Active loads continuously; Keyword Trigger loads when matching terms appear.","Keyword Trigger","Don't mark every optional detail Always Active.","Core world rules often deserve Always Active.",{type:"select",choices:["always","keyword"]}));
   result.push(field("world"+i+"Keywords","Entry "+i+" · keyword triggers","Choose natural but distinctive names, locations or object terms.","locked register, archive ledger, city register","Avoid 'the', 'love', 'city' or generic words.","Two or three synonyms are useful for discovery.",{rows:2}));
   result.push(field("world"+i+"Body","Entry "+i+" · facts & rules","Write objective facts, boundaries and causal rules. For secrets, distinguish character knowledge from what players have actually discovered.","The locked register contains six pages. No one can read a page without holding it. Corvin knows the register exists, but has never seen its sixth page.","Don't paste the character bio here.","Add detail for triggers, discovery requirements and continuity.",{rows:6}));
 }
 return result;
}
const definitions={spark:sparkle,profile,core,opening,world:worldFields(),media};
let state,selectedTags=[],toastTimer,lastExport="",page="spark",appendCoreNotes=false;
const load=()=>{try{const obj=JSON.parse(localStorage.getItem(STORAGE)||"null");if(!obj||typeof obj!=="object")return {...INITIAL};const result={...INITIAL};for(const k of EDITABLE)if(typeof obj[k]==="string")result[k]=obj[k];return result;}catch{return {...INITIAL};}};
state=load();
try{appendCoreNotes=localStorage.getItem(STORAGE+".appendCoreNotes")==="1"}catch{}
try{selectedTags=JSON.parse(localStorage.getItem(STORAGE+".tags")||"[]").filter(x=>TAGS.includes(x)).slice(0,7)}catch{}
function save(){
 try{localStorage.setItem(STORAGE,JSON.stringify(state));localStorage.setItem(STORAGE+".tags",JSON.stringify(selectedTags));$("#save-status").textContent="Saved locally";}catch{$("#save-status").textContent="Storage full · export a backup";}
}
const words=x=>String(x||"").trim().split(/\s+/).filter(Boolean).length;
const tokens=x=>Math.ceil(String(x||"").length/4);
const ccount=(x,limit)=>{const n=String(x||"").length;return n.toLocaleString()+" / "+limit.toLocaleString()+" characters · ~"+tokens(x).toLocaleString()+" tokens"};
// Token estimates use a rough 4-character heuristic; Fizzz's actual limits are character counts.
function notify(message){
 const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),3500);
}
const val=k=>String(state[k]||"").trim();
const name=()=>val("name")||"{{char}}";
const formatted=t=>String(t||"").replace(/\r\n/g,"\n").trim();
function coreCompiled(){
 const items=[];
 const add=(title,value)=>{if(value)items.push("# "+title+"\n"+value);};
 const identity=[val("name")&&"Name: "+val("name"),val("age")&&"Age: "+val("age"),val("gender")&&"Gender: "+val("gender"),val("species")&&"Species: "+val("species"),val("occupation")&&"Role: "+val("occupation")].filter(Boolean).join("\n");
 const structured=[
 ["Identity & Basics",identity],["Appearance",val("appearance")],
 ["Background",val("backstory")],["Core Personality & Behavior",val("traits")],
 ["Internal Contradiction",val("contradiction")],["Character Goals",val("motivation")],
 ["Current Story Premise",val("concept")],["Current Story Conflict",val("conflict")],
 ["{{user}}'s Entry Role",val("role")],
 ["Relationship With {{user}}",val("relationship")||val("dynamic")],
 ["Relationship & Growth Logic",val("behavior")||val("arc")],
 ["Behavioral Boundaries",val("boundaries")],["Speaking Style",val("voice")]
 ];
 if(val("coreRaw")){
   // Absolute preservation by default; supplemental inputs stay available
   // in the editor until deliberately included by the creator.
   if(!appendCoreNotes)return val("coreRaw");
   add("Preserved Original Core Personality",val("coreRaw"));
   for(const [title,value] of structured)if(value)add("Creator Addition · "+title,value);
 }else for(const [title,value] of structured)add(title,value);
 return items.join("\n\n").trim();
}
function openingCompiled(){
 if(val("initialRaw"))return val("initialRaw");
 // Treat split beats as scaffolding for an actual narrated scene.
 const italic=text=>text?(/^\*.*\*$/.test(text)?text:"*"+text+"*"):"";
 const actor=text=>text.replace(/^The character\b/i,val("name")||"The character");
 const dialogue=val("openingLine");
 const parts=[italic(val("openingScene")),italic(actor(val("openingAction"))),
 dialogue,italic(actor(val("openingBeat")))];
 return parts.filter(Boolean).join("\n\n");
}
const wbData=()=>[1,2,3].map(i=>({number:i,title:val("world"+i+"Title"),mode:val("world"+i+"Mode")||"always",keywords:val("world"+i+"Keywords"),content:val("world"+i+"Body")})).filter(x=>x.title||x.content||x.keywords);
function mediaCompiled(){
 const lines=[];
 for(const [title,k] of [["Cover 3:4", "coverDirection"],["Character Images 9:16", "imageDirection"],["Opening Film","videoDirection"],["Voice (required on Fizzz)","voiceDirection"],["Design Voice description (max 20 words)","voiceDesignPrompt"],["ElevenLabs V3 Voice ID (optional)","voiceId"],["Music (optional)","musicDirection"]])if(val(k))lines.push(title+"\n"+val(k));
 return lines.length?lines.join("\n\n"):"Add media directions here, then upload and select the actual assets on Fizzz.";
}
const titleValue=()=>val("title")||val("name");
function chapter(step){
 if(!PAGES.includes(step))return;
 page=step;
 $$(".step").forEach(b=>{b.classList.toggle("active",b.dataset.step===step);b.setAttribute("aria-current",b.dataset.step===step?"step":"false");});
 $$(".panel").forEach(x=>{const active=x.id==="panel-"+step;x.hidden=!active;x.classList.toggle("active",active)});
 if(step==="review")renderReview();
 if(window.innerWidth<820)$("#workbench").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"});
}
function buildControl(meta){
 const wrapper=el("div","field"),label=el("label"),heading=el("span","",meta.label);
 const id="edit-"+meta.key;label.htmlFor=id;
 const count=el("span","field-counter","");heading.append(count);label.append(heading);
 const opts=meta.type==="select",box=opts?el("select"):el(meta.rows&&meta.rows>1?"textarea":"input");
 box.id=id;box.dataset.key=meta.key;box.setAttribute("aria-label",meta.label);
 if(box.tagName==="TEXTAREA")box.rows=meta.rows||3;
 if(box.tagName==="INPUT")box.type="text";
 if(opts)meta.choices.forEach(v=>{const o=el("option","",v);o.value=v;box.append(o)});
 box.value=state[meta.key]||"";
 const refresh=()=>{const n=box.value.length,max=meta.key.endsWith("Body")?10000:meta.key==="coreRaw"?25000:meta.key==="initialRaw"?5000:null;const voiceWords=meta.key==="voiceDesignPrompt"?words(box.value):null;count.textContent=voiceWords!==null?voiceWords+"/20 words":n?(max?n.toLocaleString()+"/"+max.toLocaleString():n.toLocaleString())+" chars · ~"+tokens(box.value)+" tokens":"";count.classList.toggle("over",(max!==null&&n>max)||(voiceWords!==null&&voiceWords>20))};
 box.addEventListener(opts?"change":"input",()=>{state[meta.key]=box.value;refresh();save();update()});
 refresh();
 const small=el("small","",meta.guide);
 const details=el("details","coach-details");const summary=el("summary","","✧ Exactly what to write · example + token advice");
 const body=el("div","coach-inner");
 body.append(el("b","","WRITE THIS"),el("p","",meta.guide),el("b","","STRONG EXAMPLE"),el("pre","",meta.example),
 el("b","","SAY IT WITH LESS"),el("p","",meta.cut),el("b","","WHEN MORE IS USEFUL"),el("p","",meta.expand));
 const exampleBtn=el("button","coach-use","Use example ✧");exampleBtn.type="button";
 exampleBtn.addEventListener("click",()=>{
  if(box.value.trim()&&!confirm("Replace this field's writing with the example?"))return;
  box.value=meta.example;state[meta.key]=box.value;refresh();save();update();notify("Example placed in "+meta.label+". Rewrite it to make it your own.");
 });
 body.append(exampleBtn);details.append(summary,body);wrapper.append(label,box,small,details);
 return wrapper;
}
function mountFields(){
 const containers={spark:"spark-prompts",profile:"profile-fields",core:"core-fields",opening:"opening-fields",world:"world-fields",media:"media-fields"};
 for(const [section,id] of Object.entries(containers)){
  const dest=$("#"+id);dest.replaceChildren();
  if(section==="world"){
   for(let i=1;i<=3;i++){const group=el("div","world-entry");group.append(el("h3","","Entry "+i+" / "+(i===1?"Foundations":i===2?"People & Locations":"Secrets & Systems")));
    definitions.world.filter(m=>m.key.startsWith("world"+i)).forEach(meta=>group.append(buildControl(meta)));dest.append(group);
   }
  }else definitions[section].forEach(meta=>dest.append(buildControl(meta)));
 }
 const toggles=$("#media-toggles");toggles.replaceChildren();
 const checked=[
  ["Checked 3:4 cover preview and visible face","coverReady"],
  ["Prepared up to three consistent 9:16 character images","imagesReady"],
  ["All published media is original or authorized, non-watermarked, and age appropriate","rightsReady"],
  ["Selected voice in Fizzz (required)","voiceReady"],
  ["Verified image, first scene and film continuity","filmReady"],
  ["Completed trial roleplay chats and corrected drift","tested"]
 ];
 checked.forEach(([label,key])=>{
  const wrap=el("label","toggle-row"),input=el("input");input.type="checkbox";input.dataset.toggle=key;input.checked=localStorage.getItem(STORAGE+"."+key)==="1";
  input.addEventListener("change",()=>{try{localStorage.setItem(STORAGE+"."+key,input.checked?"1":"0")}catch{}update()});wrap.append(input,el("span","",label));toggles.append(wrap);
 });
}
function mountTags(){
 const area=$("#tag-chips");area.replaceChildren();
 TAGS.forEach(tag=>{const b=el("button","tag-chip",tag);b.type="button";b.classList.toggle("selected",selectedTags.includes(tag));b.setAttribute("aria-pressed",String(selectedTags.includes(tag)));
 b.addEventListener("click",()=>{
  if(selectedTags.includes(tag))selectedTags=selectedTags.filter(x=>x!==tag);
  else if(selectedTags.length>=7)return notify("Fizzz allows 10 total tags; reserve 3 for required Gender, POV, Rating, leaving 7 optional.");
  else selectedTags.push(tag);
  mountTags();save();update();
 });area.append(b)});
}
function mountArchetypes(){
 const place=$("#archetypes");place.replaceChildren();
 arch.forEach(a=>{const b=el("button","archetype");b.type="button";b.dataset.arch=a.id;b.classList.toggle("selected",state.archetype===a.id);
 b.append(el("span","icon",a.icon),el("b","",a.name),el("small","",a.tag));
 b.addEventListener("click",()=>{state.archetype=a.id;mountArchetypes();save();update();notify(a.name+" selected. Click Build a Starter Concept to use its optional prompts.");});
 place.append(b)});
}
function starter(){
 const a=arch.find(x=>x.id===state.archetype)||arch[0];
 if(a.id==="blank")return notify("Start with your own premise in the fields below. No archetype is required.");
 const filling={concept:a.concept,dynamic:a.dynamic,conflict:a.conflict,role:a.role,openingScene:a.scene,openingAction:a.action,openingLine:a.line,openingBeat:a.beat,traits:a.trait,voice:a.voice};
 const filled=Object.keys(filling).filter(k=>!val(k)&&filling[k]);
 if(!filled.length)return notify("Starter concept is already present. Your writing has not been replaced.");
 filled.forEach(k=>state[k]=filling[k]);
 mountFields();save();update();notify("Original character scaffold added to "+filled.length+" empty fields. Supply a unique name, identity, and history to make it yours.");
}
function sample(){
 if(!confirm("Load the sample character? This replaces your current Atelier draft; export JSON first if needed."))return;
 const demo={
 ...INITIAL,archetype:"mystery",concept:"An archivist who remembers records before they are written.",dynamic:"Unlikely investigative allies and slow-earned trust.",conflict:"A civic record describes a disaster scheduled for tomorrow.",role:"{{user}} is an adult visitor carrying the record; their feelings, history and decisions remain their own.",arc:"The archivist may learn to trust another person's judgment.",
 name:"Dallan Quist",title:"The Archivist of Tomorrow",age:"38",gender:"Male",pov:"Any POV",rating:"Limited",
 bio:"He remembers what the city has not yet done. You arrive with a record from tomorrow, and the only person who can decipher it is afraid to be right. Slow-burn mystery with player-led discoveries.",
 occupation:"Records archivist at the Hall of Civic Memory.",species:"Human, affected by an unexplained temporal memory condition.",
 appearance:"6'1, lean build, brown eyes, dark hair brushed off his forehead, a narrow scar beneath his chin, wool waistcoat and long black coat.",
 backstory:"He once warned the city about a fire from a document that had not yet been written. The council ignored him. He kept the only surviving copy and became obsessive about verifiable evidence.",
 traits:"Quietly skeptical; when offered a theory he asks which detail could disprove it. He remembers everyday kindness but rarely acknowledges it aloud. Under pressure he becomes specific rather than loud.",
 contradiction:"He distrusts predictions but lives according to them.",motivation:"He wants to find who creates future records and prevent the next catastrophe without causing it himself.",
 relationship:"He initially considers {{user}} an uncertain witness. Their trust changes only through decisions, evidence and shared setbacks.",
 behavior:"He does not reveal an unsolved answer before it is discovered in play. Genuine intimacy, if it develops, is gradual and consensual.",
 boundaries:"Never speak or decide for {{user}}. Do not treat suspicions as verified clues. Preserve the established timeline and revealed evidence.",
 voice:"Restrained, pointed questions, short clauses when tense. Dry humor arrives at inconvenient moments.",
 initialRaw:'*Rain tapped against the high archive windows. Dallan aligned three ledger pages beneath the lamp, then looked at the sheet in {{user}}\'s hands.* "I filed this tomorrow." *He set a blank register between them and slid a pencil across the desk.* "Tell me where you found it."',
 world1Title:"Future Records",world1Mode:"always",world1Body:"The Hall contains paper records that sometimes appear before the events they document. Dates are not proof that an event is inevitable. Nobody can know an undiscovered record's full contents.",
 world2Title:"The Civic Fire",world2Mode:"keyword",world2Keywords:"civic fire, old fire, east hall",world2Body:"A council fire twelve years ago destroyed the official index. Dallan remembers warning the council. Whether someone deliberately suppressed the warning remains unknown.",
 world3Title:"The Black Register",world3Mode:"keyword",world3Keywords:"black register, sealed book, ledger",world3Body:"A sealed black register exists in the east archive. Dallan has not seen its interior. It may only be opened during a roleplay event where someone finds its key.",
 coverDirection:"3:4 poster framing, adult archivist with unobstructed face, rainy archive, parchment-and-gold gothic details.",
 imageDirection:"9:16 photorealistic portrait, same adult archivist, dark coat, single person, clear face and stable warm lamp lighting.",
 videoDirection:"Seated behind archival desk; restrained movement, looks from record to visitor and speaks a line from greeting.",
 voiceDirection:"Low-mid adult male register, precise measured diction, dry undertone.",voiceDesignPrompt:"Native English. Male, 30s. Low-pitched, calm, slow pacing. Clear and steady."
 };
 state=demo;selectedTags=["Original Character","Mystery","Slow Burn","Drama"];
 mountFields();mountTags();mountArchetypes();save();update();chapter("profile");notify("Example character loaded. Explore every chapter and its writing guidance.");
}
function update(){
 const core=coreCompiled(),opening=openingCompiled();
 $("#core-preview").textContent=core||"Start filling Identity, Personality and Speaking Style to compile your Core Personality.";
 $("#opening-preview").textContent=opening||"Write a complete Initial Message or assemble the first scene from the four beats above.";
 $("#media-preview").textContent=mediaCompiled();
 for(const [id,text,cap] of [["core-count",core,25000],["opening-count",opening,5000]]){
 const e=$("#"+id);e.textContent=ccount(text,cap);e.classList.toggle("over",text.length>cap);
 }
 $("#pulse-name").textContent=val("name")||"The Unwritten";
 $("#pulse-hook").textContent=val("concept")||val("bio")||"Every compelling story begins with a reason to meet.";
 const meters=[
 ["Core Personality",core.length,25000],["Opening Message",opening.length,5000],
 ["Worldbook 1",val("world1Body").length,10000],["Worldbook 2",val("world2Body").length,10000],["Worldbook 3",val("world3Body").length,10000]
 ];
 const container=$("#pulse-meters");container.replaceChildren();
 meters.forEach(([label,n,max])=>{
  const div=el("div","pulse-meter"),top=el("div","pulse-meter-label"),bar=el("div","pulse-bar");
  top.append(el("b","",label),el("span","",n.toLocaleString()+" / "+max.toLocaleString()));
  const fill=el("div");fill.style.width=Math.min(100,Math.round(n/max*100))+"%";
  if(n>max)bar.classList.add("danger");
  bar.append(fill);div.append(top,bar);container.append(div);
 });
 const advice=$("#pulse-advice");
 advice.textContent=!val("concept")?"Try a recognizable encounter, an immediate conflict and a player-controlled choice.":!val("name")?"You have the premise. Give your character a distinctive name and identity next.":!val("traits")&&!val("coreRaw")?"Describe how the character acts under stress, not just adjectives.":!opening?"Now give the character a scene with visible actions and at least one spoken line.":"Your foundation is taking shape. Open the Manuscript for consistency, format and media checks.";
 if(page==="review")renderReview();
}
function audit(){
 const issues=[],core=coreCompiled(),opening=openingCompiled(),push=(status,title,reason)=>issues.push({status,title,reason});
 if(!val("title"))push("error","Missing title","Fizzz requires a public title.");
 else push("ok","Public title present","Keep it accurate, concise and inviting rather than sensational.");
 if(!val("name"))push("error","Missing character name","Character Chat Name is required.");
 if(!val("bio"))push("warning","Public bio missing","A bio helps players understand the premise but doesn't drive the model.");
 if(!val("gender")||val("gender").startsWith("Other"))push("warning","Confirm Gender tag","Fizzz requires a Gender selection.");
 if(!val("pov")||val("pov").startsWith("Other"))push("warning","Confirm POV tag","Fizzz requires a POV selection.");
 if(!val("rating")||val("rating")==="Choose on Fizzz")push("warning","Confirm Rating","Fizzz requires a Rating selection.");
 if(!selectedTags.length)push("warning","Consider discovery tags","Use relevant tags; Gender, POV and Rating remain mandatory in the publisher.");
 if(!core)push("error","No Core Personality","Write identity, appearance, personality and voice for stable roleplay.");
 else if(core.length>25000)push("error","Core Personality exceeds 25,000","Trim carefully without deleting distinctive canon.");
 else if(core.length>10000)push("warning","Core Personality exceeds Fizzz's recommended 10,000","This may still be valid; consider moving lore to Worldbook if it rarely affects each response.");
 if(val("coreRaw")&&!appendCoreNotes&&[val("traits"),val("appearance"),val("voice"),val("relationship"),val("role")].some(Boolean))push("warning","Separate draft notes are not appended","Preservation mode keeps the imported Core Personality verbatim. Turn on Append structured notes only if you want those extra fields included.");
 if(!val("voice")&&!val("coreRaw"))push("warning","No speaking style","Describe sentence rhythm, mannerisms and emotion shifts near the end of Core Personality.");
 if(!val("appearance")&&!val("coreRaw"))push("warning","Text model lacks written appearance","Character Images alone do not teach the text model how the person looks.");
 if(!opening)push("error","Initial Message required","Up to 5,000 characters; create scene, visible action and speaking voice.");
 else if(opening.length>5000)push("error","Initial Message over 5,000 characters","Keep unique drama; trim repeated exposition only.");
 else if(!/["“”]/.test(opening))push("warning","No spoken dialogue detected","Fizzz Opening Film benefits from a few lines of spoken dialogue.");
 if(/\{\{user\}\}\s+(?:felt|thought|decided|agreed|obeyed|kissed)/i.test(opening))push("warning","Possible player agency issue","Check whether the opening describes {{user}}'s feelings or actions without consent.");
 if(wbData().length>3)push("error","Worldbook entry limit","Fizzz supports at most three entries.");
 if(wbData().length)push("warning","Turn on Worldbook in Fizzz","Worldbook is disabled by default on the platform. Enable it manually and configure the exported activation mode and keywords.");
 wbData().forEach(w=>{
  if(w.content.length>10000)push("error","Worldbook "+w.number+" exceeds 10,000","Split carefully across available entries.");
  if(w.mode==="keyword"&&!w.keywords)push("warning","Worldbook "+w.number+" needs keywords","Set natural distinctive triggers or change to Always Active.");
  if(!w.content)push("warning","Worldbook "+w.number+" has no content","A title alone does not establish rules.");
 });
 if(val("voiceDesignPrompt")&&words(val("voiceDesignPrompt"))>20)push("warning","Design Voice over 20 words","The supplied Fizzz guide sets a 20-word maximum for Design Voice description; currently "+words(val("voiceDesignPrompt"))+" words. Trim without losing timbre, pace and language.");
 if(val("voiceDesignPrompt")&&/\b(?:reverb|echo|phone|tape)\b/i.test(val("voiceDesignPrompt")))push("warning","Voice effects can hurt clarity","The Fizzz guide discourages reverb, echo, phone and tape keywords in Design Voice prompts.");
 if(/\b(?:death|funeral|suicide|betrayal|gore|torture|abuse|horror|oppressive|dark relationship|stalking)\b/i.test([val("bio"),val("concept"),val("initialRaw"),core].join(" "))&&!val("warning")&&!/\b(?:content warning|content note|cw:|tw:)\b/i.test(val("bio")))
   push("warning","Consider a public content warning","High-intensity fictional themes may call for a visible Bio advisory so readers can choose their experience.");
 if(!val("coverDirection"))push("warning","Cover poster guidance missing","Fizzz recommends a 3:4 cover crop with the face visible; Cover does not generate chat video.");
 if(!val("voiceDirection"))push("warning","Voice selection still needed","Voice is required in Fizzz; cast one that matches personality and age.");
 if(!val("imageDirection"))push("warning","Character image direction missing","Create up to 3 consistent 9:16 images for the video pipeline.");
 if(/(?:under\s*1[0-7]|age\s*1[0-7]|high.school.boy|high.school.girl)/i.test([val("age"),val("bio"),core].join(" ")))push("warning","Check adult presentation","Fizzz does not allow inappropriate depictions involving minors.");
 if(!issues.some(x=>x.status==="error"))push("ok","No missing core publishing text detected","Final images, voice, tags, platform review and test-chat quality must be verified in Fizzz.");
 return issues;
}
function sections(){
 const core=coreCompiled(),opening=openingCompiled();
 const result=[
 ["PROFILE · Title",val("title")],["PROFILE · Character Chat Name",val("name")],
 ["PROFILE · Character Bio",[val("bio"),val("warning")].filter(Boolean).join("\n\n")],
 ["PROFILE · Gender / POV / Rating",[val("gender"),val("pov"),val("rating")].join(" · ")],
 ["PROFILE · Discoverability Tags",selectedTags.join(", ")],
 ["CHARACTER SETTINGS · Core Personality",core],
 ["CHARACTER SETTINGS · Initial Message",opening]
 ];
 wbData().forEach(w=>result.push(["WORLDBOOK "+w.number+" · "+(w.title||"Untitled"),"Activation: "+(w.mode==="keyword"?"Keyword Trigger":"Always Active")+(w.mode==="keyword"?"\nKeywords: "+w.keywords:"")+"\n\n"+w.content]));
 result.push(["MEDIA · Direction Brief",mediaCompiled()]);
 return result;
}
function copyText(text){
 if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(text);
 const area=el("textarea");area.value=text;area.style.position="fixed";area.style.left="-9999px";document.body.append(area);area.select();const ok=document.execCommand("copy");area.remove();return ok?Promise.resolve():Promise.reject(Error("Clipboard unavailable"));
}
function download(name,text,type="text/plain"){
 const blob=new Blob([text],{type:type+";charset=utf-8"}),url=URL.createObjectURL(blob),a=el("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
const slug=()=>val("name").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"character";
function backup(){return JSON.stringify({tool:"VelvetRuin Fizzz Atelier",version:1,project:{...state,tags:selectedTags}},null,2)}
function renderReview(){
 const issues=audit(),bad=issues.filter(x=>x.status==="error").length,warn=issues.filter(x=>x.status==="warning").length;
 $("#audit-summary").textContent=bad?"✕ "+bad+" important item"+(bad===1?"":"s")+" to fix":warn?"✧ Strong foundation · "+warn+" suggestions to check":"✦ Text checks complete · ready for platform review";
 const area=$("#audit-list");area.replaceChildren();
 issues.forEach(issue=>{const card=el("article","audit-item "+issue.status);card.append(el("h4","",issue.title),el("p","",issue.reason));area.append(card)});
 const dest=$("#export-blocks");dest.replaceChildren();
 sections().forEach(([label,value])=>{const card=el("article","export-card"),head=el("div","export-card-header"),btn=el("button","","Copy Field");
 head.append(el("b","",label),btn);const pre=el("pre","",value||"— No text yet —");btn.addEventListener("click",()=>copyText(value||"").then(()=>notify(label+" copied.")).catch(()=>notify("Copy unavailable.")));card.append(head,pre);dest.append(card)});
}
function setupNavigation(){
 $$(".step").forEach(b=>b.addEventListener("click",()=>chapter(b.dataset.step)));
 $$(".next").forEach(b=>b.addEventListener("click",()=>chapter(b.dataset.next)));
 $("#start-new").addEventListener("click",()=>chapter("spark"));
 $("#start-import").addEventListener("click",()=>chapter("migrate"));
 $("#open-handbook").addEventListener("click",()=>chapter("handbook"));
 $("#starter").addEventListener("click",starter);
 $("#sample").addEventListener("click",sample);
 $("#reset").addEventListener("click",()=>{if(!confirm("Reset the entire character draft? Back up first if you wish to keep it."))return;state={...INITIAL};selectedTags=[];mountFields();mountTags();mountArchetypes();save();update();chapter("spark");notify("Character draft reset.")});
 $("#export-quick").addEventListener("click",()=>{download(slug()+"-fizzz-project.json",backup(),"application/json");notify("Project backup saved.")});
 $("#download-json").addEventListener("click",()=>download(slug()+"-fizzz-project.json",backup(),"application/json"));
 $("#download-txt").addEventListener("click",()=>download(slug()+"-fizzz-fields.txt",sections().map(([k,v])=>"# "+k+"\n\n"+v).join("\n\n"+"═".repeat(55)+"\n\n")));
 $("#copy-all").addEventListener("click",()=>copyText(sections().map(([k,v])=>"# "+k+"\n"+v).join("\n\n")).then(()=>notify("All character fields copied.")).catch(()=>notify("Copy unavailable.")));
 $("#copy-original-ai").addEventListener("click",async()=>{
   const a=arch.find(x=>x.id===state.archetype)||arch[0];
   const prompt=[
    "You are a specialist author designing a genuinely NEW original Fizzz.ai video-roleplay character, not adapting an uploaded concept.",
    "Create a distinctive adult character with their own personality, role, background, emotional contradictions, motivation, speech style, and a playable first encounter.",
    "Use the creator's selections as the AUTHORITATIVE seed. Preserve all nonempty author-entered fields faithfully; invent only missing details that fit the chosen direction. If an author specified a name, use it exactly. Avoid generic mafia/fantasy names, repeated names, formulaic melodrama and recycled character beats.",
    "Fizzz official structure: Profile Title and Chat Name required, public Bio does not instruct the roleplay model. Gender, POV and Rating required. Core Personality maximum 25,000 characters; recommend within 10,000. Initial Message maximum 5,000 characters. Worldbook optional, at most three entries with 10,000 characters each. Voice required, character images 9:16, cover recommended 3:4.",
    "Build a strong public hook showing who the character is, what is happening NOW and a player-directed choice. Explain what the character wants independent of romantic attention. Personality should show observable behavior under pressure and a specific contradiction. Keep the connection emotionally compelling without predetermined outcomes.",
    "Everyone in romantic scenarios must be adult. Do not predetermine {{user}}'s gender, internal feelings, actions, sexual consent or decisions. Never make player agency disappear.",
    "Initial Message must contain atmosphere, visible character action, one or two meaningful spoken lines and a playable unresolved beat. Use original, distinctive dialogue, not bland templates. An opening can be rich and novelistic but not over-expository. Set up media visually coherently.",
    "Speaking Style goes near the end of Core Personality; no long example dialogues. Worldbook stores setting rules and NPCs without duplicating the character identity. Secret knowledge must respect in-story discovery conditions.",
    "Offer creator-safe image and voice direction for Fizzz media. Image prompts should favor a single adult subject, clear unobstructed face and consistent visual identity.",
    "Output ONE complete, parseable JSON object (not prose): {\"fields\":{\"name\":\"Character name\",\"title\":\"Interesting public title\",\"bio\":\"Short playable hook\",\"traits\":\"Specific behavioral personality\",\"backstory\":\"Causal history\",\"voice\":\"Speaking style\",\"initialRaw\":\"Full opening in prose and dialogue\"},\"editorNotes\":[\"Optional creator suggestion\"]}.",
    "The example is illustrative: write actual character text, never placeholder ellipses. You may also include age, gender, occupation, species, appearance, contradiction, motivation, relationship, behavior, boundaries, world1Title, world1Body, world1Mode, world2Title, world2Body, world2Keywords, world2Mode, coverDirection, imageDirection, videoDirection and voiceDirection if meaningful.",
    "IMPORTANT: Output the entire JSON in ONE response, with both opening { and final closing }. Prioritize completed core personality, greeting and public bio over unnecessary optional material. Aim for under 14,000 output characters to avoid truncation; if details do not fit, omit secondary media/Worldbook fields and list those needs in editorNotes. Never stop mid-string or mid-JSON.",
    "Include Worldbook entries only when the world warrants them. Use valid JSON strings, no comments or markdown fences. Aim for a coherent new playable person, not a loose brainstorm.",
    "SELECTED OPTIONAL ARCHETYPE: "+a.name+" / "+a.tag,
    "AUTHOR'S EXISTING NEW BOT SEED (nonempty fields are requirements; do not rewrite them):",
    JSON.stringify(Object.fromEntries(Object.entries(state).filter(([k,v])=>v&&v.trim())),null,2),
    "Generate the original bot JSON now."
   ].join("\n\n");
   try{await copyText(prompt);notify("Original character drafting brief copied. Paste into ChatGPT and return the JSON for review.");}
   catch{download("fizzz-original-character-brief.txt",prompt);notify("Drafting brief downloaded because clipboard was unavailable.");}
 });
 const aiField=$("#original-ai-paste"),aiStatus=$("#original-ai-status");
 const aiMessage=(message,kind="info")=>{
    aiStatus.textContent=message;
    aiStatus.dataset.state=kind;
    aiStatus.setAttribute("role",kind==="error"?"alert":"status");
 };
 aiField.addEventListener("input",()=>{
    const t=aiField.value.trim();
    aiMessage(t ? t.length.toLocaleString()+" characters pasted. Select Review to validate and compare this draft.":"No JSON pasted yet. Copy the complete character response from ChatGPT first.");
 });
 $("#paste-original-ai").addEventListener("click",async()=>{
    if(!navigator.clipboard?.readText){
       aiMessage("Automatic clipboard access isn't available in this browser. Tap and hold the box above, then choose Paste.","error");
       aiField.focus();return;
    }
    try{
       const response=await navigator.clipboard.readText();
       if(!response.trim()){aiMessage("The clipboard is empty. Copy the completed JSON character response in ChatGPT, then try again.","error");return;}
       aiField.value=response;aiField.dispatchEvent(new Event("input",{bubbles:true}));
       aiMessage("Response pasted from clipboard ("+response.length.toLocaleString()+" characters). Select Review to validate it.","success");
    }catch{
       aiMessage("iPhone blocked automatic clipboard access. Tap and hold inside the JSON box above, choose Paste, then Review.","error");aiField.focus();
    }
 });
 $("#upload-original-ai").addEventListener("click",()=>$("#original-ai-upload").click());
 $("#original-ai-upload").addEventListener("change",async evt=>{
    const file=evt.target.files?.[0];evt.target.value="";
    if(!file)return;
    if(file.size>2*1024*1024){aiMessage("This file is over 2 MB. Export only the completed character JSON, or paste it directly.","error");return;}
    try{
       const response=await file.text();
       aiField.value=response;aiField.dispatchEvent(new Event("input",{bubbles:true}));
       aiMessage(file.name+" opened ("+response.length.toLocaleString()+" characters). Select Review to validate it.","success");
    }catch{aiMessage("Couldn't open this text file. Save the AI response as JSON or TXT and retry.","error");}
 });
 $("#review-original-ai").addEventListener("click",()=>{
   if(typeof window.FizzzAtelierReviewGeneratedDraft!=="function")return notify("AI review module is unavailable. Reload the page and try again.");
   window.FizzzAtelierReviewGeneratedDraft($("#original-ai-paste").value);
 });
}
function importDraft(patch,{replace=false,tags=[]}={}){
 const applied=[],skipped=[];
 for(const [k,v] of Object.entries(patch||{})){
  if(!EDITABLE.has(k)||typeof v!=="string"||!v.trim())continue;
  // Ignore built-in default choices when importing real user data.
  const contains=Boolean(val(k))&&val(k)!==String(INITIAL[k]||"");
  if(contains&&!replace){skipped.push(k);continue}
  state[k]=v;applied.push(k);
 }
 if(Array.isArray(tags)&&tags.length&&(!selectedTags.length||replace)){
  selectedTags=[...new Set(tags.filter(t=>TAGS.includes(t)))].slice(0,7);
  applied.push("tags");
 }
 mountFields();mountTags();mountArchetypes();save();update();
 return {applied,skipped};
}
function beginFreshDraft(){
 if(!confirm("Start a completely new Fizzz character? Your current draft will be replaced. Download a JSON backup first if you want to keep it."))return false;
 download((val("name")||"previous-character").toLowerCase().replace(/[^a-z0-9-]+/g,"-")+"-before-new-bot.json",backup(),"application/json");
 state={...INITIAL};selectedTags=[];
 mountFields();mountTags();mountArchetypes();save();update();
 return true;
}
window.FizzzAtelier=Object.freeze({getState:()=>({...state}),keys:()=>[...EDITABLE],importDraft,beginFreshDraft,getTags:()=>selectedTags.slice(),setTags:list=>{selectedTags=[...new Set(list.filter(x=>TAGS.includes(x)))].slice(0,7);mountTags();save();update()},coreCompiled,openingCompiled,sections,audit,chapter,save,notify,download,copyText,update,backup,meta:definitions});
function init(){mountFields();mountTags();mountArchetypes();setupNavigation();$("#append-core-notes").checked=appendCoreNotes;$("#append-core-notes").addEventListener("change",e=>{appendCoreNotes=e.target.checked;try{localStorage.setItem(STORAGE+".appendCoreNotes",appendCoreNotes?"1":"0")}catch{}update()});update();if(typeof window.initFizzzMigration==="function")window.initFizzzMigration({$, $$, el, state:()=>state, set:(key,value)=>{state[key]=value;save();mountFields();update()}, apply:(patch,{replace=false}={})=>{const result=[];for(const [k,v] of Object.entries(patch)){if(!EDITABLE.has(k)||typeof v!=="string")continue;if(replace||!val(k)||(["gender","pov","rating"].includes(k)&&val(k)===INITIAL[k])||(k.endsWith("Mode")&&val(k)===INITIAL[k])){state[k]=v;result.push(k)}}mountFields();save();update();return result},note:notify});const requested=window.location?.hash?.replace(/^#/,"");if(PAGES.includes(requested))chapter(requested);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();