/* VelvetRuin Fizzz: deterministic, review-first word economy (not generative AI). */
(() => {
"use strict";
const tokens=t=>Math.ceil(String(t||"").length/4);
const noTouch=new Set(["name","title","age","gender","pov","rating","initialRaw","openingScene","openingAction","openingLine","openingBeat","world1Body","world2Body","world3Body"]);
const polish=new Set(["coreRaw","traits","backstory","relationship","behavior","boundaries","motivation","contradiction","role","concept","conflict","dynamic","arc","bio","warning","occupation","species","voice","appearance"]);
const replacements=[
["due to the fact that","because","Shortened a cause phrase while keeping its meaning."],
["in order to","to","Shortened a purpose phrase without changing the goal."],
["at this point in time","now","Removed a redundant time phrase; verify timeline intent."],
["in the event that","if","Shortened the conditional without changing the condition."],
["for the purpose of","to","Kept the purpose while removing extra framing words."],
["on a daily basis","daily","Simplified the stated frequency."],
["with the exception of","except","Kept the exception in fewer words."],
["in spite of the fact that","although","Reduced a verbose contrast phrase."],
["it should be noted that","","Removed an instruction preamble; all following facts remain."],
["it is important to note that","","Removed an instruction preamble; all following facts remain."]
];
const normalize=t=>String(t||"").toLowerCase().replace(/\s+/g," ").trim();
function reduce(field,input){
 const start=String(input??"");let s=start;const changes=[];
 const describe=(kind,before,after,why,beforeText,afterText)=>changes.push({kind,before,after,why,charactersSaved:(beforeText||before).length-(afterText||after).length});
 if(/\r|\u00a0/.test(s)){const next=s.replace(/\r\n?/g,"\n").replace(/\u00a0/g," ");describe("Formatting","CRLF / nonbreaking space","standard line breaks / spaces","Normalized document encoding without changing words.",s,next);s=next;}
 if(/[ \t]+$/m.test(s)){const next=s.replace(/[ \t]+$/gm,"");describe("Formatting","trailing spaces","removed","Removed invisible trailing whitespace.",s,next);s=next;}
 if(/\n{3,}/.test(s)){const next=s.replace(/\n{3,}/g,"\n\n");describe("Formatting","extra blank lines","one empty line","Reduced formatting gaps without editing a sentence.",s,next);s=next;}
 if(polish.has(field)&&!noTouch.has(field)){
  const paras=s.split(/\n\s*\n/),seen=new Set(),kept=[];let duplicates=0;
  for(const p of paras){
   const fingerprint=normalize(p);
   const safe=p.length>=80&&!/["“”]/.test(p)&&!/\{\{(?:user|char)\}\}:/i.test(p);
   if(safe&&seen.has(fingerprint)){duplicates++;continue;}
   kept.push(p);if(safe)seen.add(fingerprint);
  }
  if(duplicates){const next=kept.join("\n\n");describe("Exact duplicate",duplicates+" complete duplicate paragraph(s)","retained only original occurrence","Later word-for-word duplicate paragraphs removed; compare in case repetition was deliberate.",s,next);s=next;}
 }
 if(polish.has(field)&&!noTouch.has(field)&&field!=="voice"){
  const lines=s.split("\n").map(line=>{
   if(/["“”]/.test(line)||/\{\{(?:user|char)\}\}:/i.test(line))return line;
   for(const [phrase,replacement,why] of replacements){
     const re=new RegExp("\\b"+phrase+"\\b","gi");const previous=line;
     line=line.replace(re,match=>{
       const capital=match.charAt(0)===match.charAt(0).toUpperCase()&&match.charAt(0)!==match.charAt(0).toLowerCase();
       return capital?replacement.charAt(0).toUpperCase()+replacement.slice(1):replacement;
     });
     if(line!==previous)describe("Phrase economy",phrase,replacement||"(removed)",why,previous,line);
   }
   return line;
  });
  s=lines.join("\n");
 }
 return {original:start,proposed:s,changed:start!==s,charsBefore:start.length,charsAfter:s.length,tokensBefore:tokens(start),tokensAfter:tokens(s),charactersSaved:start.length-s.length,tokensSaved:tokens(start)-tokens(s),changes};
}
function feedback(fields){
 const f={...fields},notes=[],value=k=>String(f[k]||"").trim();
 const note=(field,heading,reason,priority="tip")=>notes.push({field,heading,reason,priority});
 const core=value("coreRaw")||[value("traits"),value("backstory"),value("relationship"),value("voice")].join("\n\n");
 const opening=value("initialRaw")||[value("openingScene"),value("openingAction"),value("openingLine"),value("openingBeat")].join("\n\n");
 if(!value("bio"))note("bio","A public hook is missing","Fizzz Bio sells the playable experience, not model instructions: identify the character, tension and reader's entry.","important");
 else{
  if(!/\b(?:you|your|reader|player)\b|\{\{user\}\}/i.test(value("bio")))note("bio","Make the player central","The public bio describes the character but not what the reader can do. Add a playable choice or starting role.");
  if(value("bio").length>1000)note("bio","Separate public appeal from private settings","A long public dossier often buries the hook. Move behavior instructions to Core Personality; retain content notes.");
 }
 if(!value("conflict")&&!/\b(?:because|until|unless|must|risk|threat|secret|decide|choose|contract|marriage|witness|rival)\b/i.test(value("concept")+" "+value("bio")))note("concept","Add a playable story engine","A recognizable trope helps someone understand the fantasy; a concrete event, choice or conflict helps them start talking.");
 if(!value("role")&&!/\{\{user\}\}/i.test(value("relationship")+" "+core+" "+opening))note("role","Give {{user}} an entry","Define the adult reader's starting situation without deciding their identity, feelings or actions.");
 if(core.length>10000)note("coreRaw","Core Personality exceeds Fizzz's recommendation","25,000 characters is the official limit; ≤10,000 recommended. Put secondary world facts in Worldbook rather than deleting distinct characterization.","important");
 if(core.length>0&&core.length<350)note("coreRaw","Character behavior may be underspecified","Add psychology, conflict-driven reactions, lasting motivation and speaking style before shortening further.");
 if(!value("voice")&&!/\b(?:speaking style|speech|voice|tone|sentence|speaks|verbal habits)\b/i.test(core))note("voice","Describe the speaking voice near the end","Fizzz has no separate example-dialogue field. Specify vocabulary, sentence length, humor, stress response and very few signature phrases.");
 if(!value("motivation")&&!/\b(?:goal|wants to|intends to|plans to|strives to)\b/i.test(core))note("motivation","Give the person an independent goal","Continuing aspirations keep the character from existing only to pursue {{user}}.");
 if(/\b(?:possessive|dominant|territorial|controlling|cruel)\b/i.test(core)&&!/\b(?:consent|choice|respect|boundar|autonomy|agency|refus|not force)\b/i.test(core))note("boundaries","Preserve danger with restraint","If you intend controlled dominance, clarify {{user}}'s right to refuse without turning character conflict into forced control.");
 if(opening&&!/["“”]/.test(opening))note("initialRaw","A voice needs a line","Fizzz Opening Film uses spoken dialogue; one or two lines help video and character recognition.","important");
 if(opening.length>3500)note("initialRaw","Check the first playable beat","The 5,000-character limit is a ceiling, not a target. Keep distinctive dialogue and actions; reduce only repeated exposition.");
 if(/\{\{user\}\}\s+(?:felt|thought|decided|agreed|obeyed|kissed|nodded|accepted|wanted)\b/i.test(opening))note("initialRaw","Possible player agency issue","Check whether the opening narrates {{user}}'s emotions, consent or actions. Keep their reply open.","important");
 if(opening&&!/\b(?:you|your)\b|\{\{user\}\}/i.test(opening))note("initialRaw","Clear reader entry","Offer an object, choice, invitation, unexplained event or reason for the player to respond.");
 const books=[1,2,3].map(i=>({i,text:value("world"+i+"Body"),keys:value("world"+i+"Keywords"),mode:value("world"+i+"Mode")}));
 for(const b of books){
  if(!b.text)continue;
  if(b.text.length>10000)note("world"+b.i+"Body","Entry above Fizzz limit","Maximum 10,000 characters each. Split themes if possible; preserve unique facts.","important");
  if(b.mode==="keyword"&&!b.keys)note("world"+b.i+"Keywords","Missing keywords","Choose distinctive natural terms for optional NPC, place, item or scene information.");
  if(b.mode==="keyword"&&/(^|,)\s*(?:the|a|he|she|love|city|room|user|character)\s*(,|$)/i.test(b.keys))note("world"+b.i+"Keywords","Trigger is too generic","Common words can activate optional lore nearly every turn; choose more specific triggers.");
  if(/\b(?:secret|sealed|hidden|record|evidence|discovered)\b/i.test(b.text)&&!/\b(?:does not know|doesn't know|until|after|actually found|confirmed|suspect|proof|must discover|never reveal)\b/i.test(b.text))note("world"+b.i+"Body","Protect discovery logic","State what the character already knows, what is suspected and what event makes a secret proven. Triggering lore alone doesn't prove discovery.");
 }
 if(core&&books.some(b=>b.text)){
  const paragraphs=t=>t.split(/\n\s*\n/).map(x=>x.trim()).filter(x=>x.length>85).map(normalize);
  const owned=new Set(paragraphs(core));
  for(const b of books){
   const hit=paragraphs(b.text).find(p=>owned.has(p));
   if(hit){note("world"+b.i+"Body","Repeated content across sections","One paragraph repeats verbatim in Core Personality and Worldbook. Choose where it is needed; do not automatically delete facts.");break;}
  }
 }
 if(!value("imageDirection"))note("imageDirection","Align visuals with the character","Use up to three consistent 9:16 single-subject images with an unobstructed face to support Fizzz chat video.");
 if(!value("voiceDirection"))note("voiceDirection","Voice is required","Match the selected voice's age impression, phrasing, accent and emotional range to the written character.");
 return notes;
}
function budget(field,text){
 const n=String(text||"").length,max=field==="coreRaw"?25000:field==="initialRaw"?5000:/^world[123]Body$/.test(field)?10000:null;
 const tip=field==="coreRaw"?"Official: 25,000 max, recommended ≤10,000. Editorial target: prioritize repeatable psychology, dialogue style, relationship logic, goals; use more only when the plot requires it.":field==="initialRaw"?"Official 5,000 max. Editorial: scene, visible action, spoken dialogue, open beat; don't delete the personality from a novel-style opening.":field==="bio"?"Editorial: sell an instantly recognizable fantasy and a reader-driven dilemma. Public Bio is not read as model instructions.":field==="voice"?"Editorial: concise rhythm/vocabulary/habits near the end of Core Personality; avoid large example dialogues.":field.endsWith("Body")?"Official: 10,000 max per entry. Worldbook holds rules, NPCs and secrets with defined triggers and discovery boundaries.":"";
 return {characters:n,limit:max,over:max!==null&&n>max,estimatedTokens:tokens(text),tip};
}
window.VelvetRuinFizzzOptimizer=Object.freeze({reduce,feedback,budget,tokens});
})();