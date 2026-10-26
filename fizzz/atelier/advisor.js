/* VelvetRuin Fizzz · editorial suggestions derived from the creator's own draft.
   This is deterministic, inspectable analysis — not an AI model or popularity predictor.
   Existing dialogue, canon, identity and full text are never overwritten automatically. */
(() => {
"use strict";
const val=(o,k)=>String(o[k]||"").trim();
const words=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length;
const flat=s=>String(s||"").replace(/\s+/g," ").trim();
const cut=(s,max=185)=>flat(s).slice(0,max)+(flat(s).length>max?"…":"");
const noProfanity=/(?:^|\s)(?:fuck|shit|bitch|asshole)(?:\s|$)/i;
const boilerplate=/(?:due to the fact that|in order to|at this point in time|in the event that|it should be noted that)/i;
const rights='Give {{user}} full control over their own dialogue, feelings, decisions, actions and consent. Do not narrate their response; react to what they actually do.';
const speech=/\b(sarcastic|sarcasm|dry humor|wry|playful|flirtatious|flirty|teasing|blunt|direct|soft.spoken|formal|measured|quiet|reserved|gentle|warm|witty|laconic)\b/ig;
const bannedStatements=new Set(["name","age","gender","species","occupation","title"]);
function evaluate(state,options={}){
 const s={...state},out=[],used=new Set(),max=options.max||28;
 const propose=(candidate)=>{
   if(out.length>=max||!candidate||used.has(candidate.id))return;
   used.add(candidate.id);out.push({priority:"medium",...candidate});
 };
 const edit=(id,field,before,after,title,why,benefit,priority="medium",category="Playability")=>{
   if(!after||after===before)return;
   propose({id,field,title,why,benefit,category,priority,kind:"edit",before,after});
 };
 const coach=(id,field,title,why,sample,benefit,priority="medium",category="Story craft")=>{
   propose({id,field,title,why,benefit,category,priority,kind:"coach",sample});
 };
 const original=k=>String(s[k]||"");
 const whole=(val("","")||""); // empty string; all source text is read from the state only
 const core=val(s,"coreRaw");
 const opening=val(s,"initialRaw")||[val(s,"openingScene"),val(s,"openingAction"),val(s,"openingLine"),val(s,"openingBeat")].filter(Boolean).join("\n\n");
 const personality=val(s,"traits")||core;
 const text=[core,val(s,"traits"),val(s,"concept"),val(s,"bio"),val(s,"relationship"),opening].join("\n");
 const name=val(s,"name")||"the character";
 const story=val(s,"concept")||val(s,"conflict")||val(s,"bio");
 const role=val(s,"role");
 const canApply=(field,after)=>String(after||"").length<=({coreRaw:25000,initialRaw:5000,world1Body:10000,world2Body:10000,world3Body:10000}[field]||100000);
 const protectCore=Boolean(core);
 const focusField=(field)=>protectCore&&["voice","boundaries","traits","relationship","appearance"].includes(field)?"coreRaw":field;
 const addToCore=(section,text)=>core+(core.endsWith("\n")?"\n":"\n\n")+"# "+section+"\n"+text;
 // 1. High-value hook: only source-grounded text. Don't change compelling public hooks.
 if(!val(s,"title")){
   const seed=val(s,"name")||"";
   if(seed)edit("title-missing","title",original("title"),seed,"Give the character a clear public title",
      "Fizzz requires a public title. Reusing the existing name is safe; a stronger premise-based title can be chosen later.",
      "Makes the character discoverable without inventing an identity.","high","First click");
   else coach("identity-missing","name","Give the character an original name","No name was identified. An invented one would risk overwriting an intended identity.","Write the established name or choose a new one yourself.","Fizzz requires Character Chat Name.","high","Publication");
 } else if(val(s,"title").length>95){
   const before=original("title"),first=before.split(/\s*[|•–—]\s*/).find(x=>x&&x.length>=6&&x.length<=75);
   if(first&&first!==before)edit("title-long","title",before,first,"Tighten the public title",
      "The title is unusually long. This removes only an additional subtitle after a separator; check that the essential clickable premise remains.",
      "The main hook becomes easier to scan on a small screen.","medium","First click");
   else coach("title-long-advice","title","Make the title readable at a glance","This title is long for a discovery surface, and the tool cannot safely choose which words represent your character.","Use the existing character name and the single strongest identity/relationship tension (avoid long adjective chains).","A concise, accurate hook helps players understand the bot quickly.","medium","First click");
 }
 if(!val(s,"bio")){
   const premise=val(s,"concept");
   if(premise&&premise.length<=850&&canApply("bio",premise))
     edit("bio-from-hook","bio",original("bio"),premise,"Turn your existing hook into a public Bio",
       "Your supplied story premise can introduce the character without inventing a separate description. Review its player entry and content warnings.",
       "Readers understand the experience before starting; Bio does not instruct the AI.","high","First click");
   else coach("bio-empty","bio","Write a public, playable invitation",
     "Bio is missing. It should state who the player meets and what choice or tension begins the roleplay; it isn't an AI instruction field.",
     "Use 2–3 lines: [existing identity] + [what brings {{user}} into the scene] + [existing tension/choice]. Keep it recognizably yours.",
     "An instantly understandable premise improves the odds a visitor will try the bot.","high","First click");
 } else {
   const bio=val(s,"bio");
   if(bio.length>1000)coach("bio-dossier","bio","Move the lore dump out of your public Bio",
     "The Bio is long enough to hide your actual starting promise. Keep the public hook and advisory; move behavior rules into Core Personality or lore into Worldbook.",
     "Keep: the strongest existing premise sentence, {{user}}'s situation, and what changes today. Preserve the remaining original text in the appropriate AI-facing fields.",
     "A recognizable scenario is easier to click than a full biography.","medium","First click");
   if(!/\{\{user\}\}|\byou\b|\byour\b|\bplayer\b/i.test(bio)&&role)
     coach("bio-player","bio","Tell the reader where they enter",
       "The Bio describes the character without directly explaining the player's starting role, even though that role is already defined.",
       "Existing role: "+cut(role,210)+". Use that fact to add one short player-facing entry sentence; leave their feelings and choices unwritten.",
       "Gives visitors a clear reason to interact.","medium","First click");
   if(noProfanity.test(bio))coach("bio-public","bio","Check public-language review","Fizzz public titles and descriptions have different content-review requirements from private roleplay.","Review strong public language against Fizzz's current publishing guidelines.","Reduces the risk of a public listing being rejected.","high","Publication");
 }
 // 2. Distinct behavior, not adjective piles.
 if(!personality){
   coach("traits-missing",protectCore?"coreRaw":"traits","Add behavior the player can actually experience",
     "The AI needs a cause-and-effect personality, not just a visual or genre label. No reliable personality evidence was supplied.",
     "Write two sourced patterns: 'When [existing pressure], [character] usually [specific action].' and 'With {{user}}, [observable change only after an event].'",
     "Helps the bot respond consistently when the user disagrees or surprises it.","high","Long chats");
 }else if(personality.length<240||/^(?:\s*[A-Za-z-]+[,;]\s*){3,}\s*[A-Za-z-]+\.?$/i.test(personality)){
   coach("traits-plain","traits","Turn personality adjectives into reactions",
     "The description is short or trait-heavy. The model can overplay labels such as cold, jealous or protective without specific triggers.",
     "Keep the original traits. Add ONE observed pattern from the source: when [named situation] happens, [observable behavior]; when trust is challenged, [actual response].",
     "More predictable character reactions across varied player choices.","high","Long chats");
 }
 if(!val(s,"contradiction")&&!/contradic|although|but secretly|despite|yet he|yet she/i.test(personality)){
   const a=personality.match(/\b(?:but|however|yet|although|despite|while)\b[^.\n]{12,160}/i);
   if(a)coach("contradiction-source","contradiction","Name the contradiction already in your character",
     "Your source hints at contrasting traits; make the trigger and observable response clear without creating a new secret.",
     "Relevant source phrase: “"+cut(a[0],130)+"”. Explain how BOTH sides appear in actual scenes.",
     "Keeps an emotionally layered character from becoming one repeated mood.","low","Long chats");
 }
 // 3. Speaking style grounded only in creator's own adjectives.
 const speechText=[val(s,"voice"),core].join("\n");
 if(!val(s,"voice")&&!/\b(?:speaking style|speech patterns|verbal habits|pacing|sentence length)\b/i.test(speechText)){
   const candidates=[];
   for(const t of [val(s,"traits"),val(s,"relationship"),val(s,"dynamic"),core]){
     const matches=t.match(speech)||[];
     for(const m of matches){const n=m.toLowerCase();if(!candidates.includes(n))candidates.push(n);}
   }
   if(candidates.length){
     const text="Speaking manner draws on the established characterization: "+candidates.slice(0,4).join(", ")+". Let reactions and sentence rhythm follow the character's actual mood; avoid repetitive catchphrases.";
     const field=focusField("voice"),before=original(field),after=protectCore?addToCore("Speaking Style",text):text;
     if(canApply(field,after))edit("voice-source",field,before,after,"Make the established speaking style actionable",
       "These words come from the original personality. This adds a small, reusable speech instruction instead of writing fictitious sample dialogue.",
       "Fizzz has no example-dialogue field; this makes replies more recognizable while keeping the original persona.","high","Long chats");
   }else coach("voice-authored",protectCore?"coreRaw":"voice","Define the character's actual voice",
       "Voice is not described clearly enough to prevent generic responses. The site cannot invent a signature accent or speaking habit.",
       "Add a short Speaking Style section: typical sentence length, humor, preferred vocabulary, how frustration and care change the delivery.",
       "Distinct dialogue encourages a more recognizable roleplay character.","medium","Long chats");
 }
 // 4. Protect user agency. Add only behavioral instruction, never fabricate lore.
 if(!/\b(?:do not (?:speak|decide|narrate|describe|control)|never (?:speak|decide|narrate|describe|control)|user agency|user's agency|user’s agency|user autonomy)\b/i.test([val(s,"boundaries"),core].join(" "))){
   const field=focusField("boundaries"),before=original(field);
   const after=protectCore?addToCore("Player Agency",rights):(before?before+"\n"+rights:rights);
   if(canApply(field,after))edit("agency-rule",field,before,after,"Protect the player's decisions",
     "The creator's identity and scenes are unchanged; this instruction only prevents the AI from deciding {{user}}'s thoughts, actions or consent.",
     "Avoids one of the most disruptive problems in interactive roleplay.","high","Playability");
 }
 if(/\b(?:possessive|territorial|dominant|controlling|jealous)\b/i.test(personality)&&!/\b(?:consent|respect|refus|choice|autonomy|boundary|boundaries)\b/i.test([personality,core,val(s,"boundaries")].join(" "))){
   coach("intensity-restraint",protectCore?"coreRaw":"boundaries","Give intense traits a consistent limit",
     "The character has an intentionally powerful or jealous trait, but the source doesn't describe how the intensity stays consistent with player choice.",
     "Keep the trait. Define from your existing concept: what actually triggers it, how the character shows it, and how they respond when {{user}} says no.",
     "Makes dark tension playable without flattening the character into coercive behavior.","high","Long chats");
 }
 // 5. Relationship pacing and starting point.
 if(!val(s,"relationship")&&!val(s,"dynamic")&&!/\b(?:relationship with|current relationship|trust develops)\b/i.test(core))
   coach("relationship-entry",protectCore?"coreRaw":"relationship","Clarify the existing starting relationship",
     "Without an established starting relationship, the AI may assume instant affection or an invented shared history.",
     "Using only your existing plot: '{{user}} begins as [role from your source]. Their relationship starts as [canon dynamic] and changes through choices, not fixed message counts.'",
     "Creates a sustainable romance or friendship rather than a fixed-response loop.","high","Long chats");
 if(!val(s,"motivation")&&!/\b(?:goal|wants to|determined to|aims to|must protect|working toward)\b/i.test([core,val(s,"traits"),val(s,"backstory")].join(" "))){
   coach("character-life",protectCore?"coreRaw":"motivation","Keep the character's own goal alive",
     "A character without a continuing personal goal may drop work, loyalties or mysteries once romance starts.",
     "Extract one ongoing goal already shown in their story—business, duty, unanswered question or personal promise—and state how it continues after meeting {{user}}.",
     "Supports long-running conversations beyond instant attraction.","medium","Long chats");
 }
 // 6. First reply and movie: never rewrite quoted dialogue.
 if(!opening){
   coach("scene-missing","initialRaw","Write the first playable encounter",
     "Fizzz requires an Initial Message. The first scene needs a setting, visible action and dialogue with an unresolved interaction.",
     "Use the original premise: [current scene] → [recognizable action by {{char}}] → [original voice line] → [something {{user}} can choose]. Don't script the player's reply.",
     "Provides a reason to begin chatting, and voiced dialogue for Opening Film.","high","First reply");
 }else{
   if(!/["“”]/.test(opening))
     coach("scene-no-voice","initialRaw","Give the opening a line the character can speak",
       "The first message has no quoted dialogue; Opening Film may show motion without a speaking voice.",
       "Preserve all original scene beats. Insert one authentic line in the established voice after a visible action; write it yourself if none is present.",
       "Makes the character immediately recognizable in a multimodal opening.","high","First reply");
   if(opening.length>3800)
     coach("scene-long","initialRaw","Move repeated setup behind the scene",
       "A long first message may postpone the first response. Fizzz permits up to 5,000 characters; there is no requirement to fill them.",
       "Keep your original dialogue and action sequence. Highlight the first interactive beat; move only genuinely redundant exposition to Core or Worldbook.",
       "Makes it easier to start playing without sacrificing atmospheric prose.","medium","First reply");
   const agencyLine=opening.match(/\{\{user\}\}\s+(?:felt|thought|decided|agreed|accepted|wanted|obeyed|kissed)[^.!?\n]{0,110}/i);
   if(agencyLine)coach("scene-autonomy","initialRaw","The greeting may narrate the player's choice",
       "The following authored phrase may dictate what {{user}} does or feels: “"+cut(agencyLine[0])+"”. Because it's fiction, a human needs to check intent.",
       "Keep surrounding prose and quoted dialogue verbatim. Revise only this precise agency-taking phrase so the player can choose their own response.",
       "Prevents the first scene from dictating player consent or emotions.","high","First reply");
   if(!/\{\{user\}\}|\byou\b|\byour\b|\bplayer\b/i.test(opening)&&!/[?]\s*["”]?\s*$/.test(opening))
      coach("scene-entry","initialRaw","Offer a player-facing way into the opening",
      "The scene may be atmospheric but the user's involvement is not explicit. A question is optional; any actionable interruption works.",
      "Keep the existing last action and all quoted lines. Ensure the player can speak, inspect something, accept or refuse an invitation, or change direction.",
      "Reduces dead-end first turns.","medium","First reply");
 }
 // 7. Persistent lore, keyword triggers, and images.
 for(let i=1;i<=3;i++){
   const body=val(s,"world"+i+"Body"),mode=val(s,"world"+i+"Mode"),keys=val(s,"world"+i+"Keywords");
   if(body&&mode==="keyword"&&!keys)
     coach("wb-keyword-"+i,"world"+i+"Keywords","Add a reliable Worldbook trigger",
       "Keyword entry "+i+" has lore but no activation terms. It may never load during roleplay.",
       "Choose two or three distinctive nouns from this exact entry: "+cut(body,145),
       "Makes side characters, secrets and places appear when relevant.","high","World continuity");
   if(body&&/\b(?:secret|sealed|hidden|evidence|record|logbook|document|discover)\b/i.test(body)&&!/\b(?:until|only after|cannot know|does not know|must discover|requires discovery|suspects|confirmed)\b/i.test(body))
     coach("wb-proof-"+i,"world"+i+"Body","State what proves a hidden fact",
       "This entry describes a secret, but not the event that lets the character prove or reveal it.",
       "Add a rule specifying what is known, what is suspected and which actual in-chat discovery establishes the truth. Keyword activation is NOT discovery.",
       "Prevents premature spoilers and makes exploration consequential.","high","World continuity");
 }
 if(!val(s,"appearance")&&!/#[ \t]*Appearance|\b(?:eye color|hair color|has [a-z ]+ hair)\b/i.test(core)){
   coach("appearance-written",protectCore?"coreRaw":"appearance","Make the text model know what the character looks like",
     "Fizzz video images do not teach the text AI physical appearance. A recognizable character must be described in writing.",
     "Supply only canonical features: build, hair, eyes, clothing, scars, tattoos and any nonhuman details already part of your design.",
     "Preserves identity consistently between dialogue and video.","medium","Media continuity");
 }else if(val(s,"appearance")&&!val(s,"imageDirection")){
   const before=original("imageDirection");
   const after="Recommended 9:16 Character Images. Match the established written appearance: "+val(s,"appearance")+"\nKeep a consistent adult face, clear single-subject framing, natural motion and unobstructed facial features.";
   if(canApply("imageDirection",after))edit("images-from-appearance","imageDirection",before,after,"Make video artwork consistent with your written character",
     "This production brief quotes the creator's existing appearance and adds Fizzz's 9:16 video-stability guidance. It does not change the person's features.",
     "Reduces image/film identity drift.","medium","Media continuity");
 }
 if(!val(s,"voiceDirection")&&val(s,"voice")){
   const voice=val(s,"voice"),after="Choose a voice in Fizzz that matches these existing speaking instructions:\n"+voice+"\nMatch mature age impression, natural pacing and clean audio; verify it in Opening Film.";
   if(canApply("voiceDirection",after))edit("media-voice","voiceDirection",original("voiceDirection"),after,"Align the selected voice with the written dialogue style",
     "Copied the creator's existing speaking instructions into an optional voice-casting note.",
     "Helps opening-film audio sound like the same person players read.","low","Media continuity");
 }
 // 8. True word-economy reductions: unquoted persona prose only, never scenes/Worldbook.
 const reducer=window.VelvetRuinFizzzOptimizer;
 if(reducer){
  for(const field of ["coreRaw","traits","backstory","relationship","behavior","bio","motivation","voice","conflict"]){
   const source=original(field);
   if(!source||source.length>24000||!boilerplate.test(source)&&!/\n{3,}|[ \t]+$/m.test(source))continue;
   const small=reducer.reduce(field,source);
   if(small.changed&&small.tokensSaved>=1&&canApply(field,small.proposed)){
     edit("trim-"+field,field,source,small.proposed,"Remove redundant phrasing from "+field,
       "Only mechanical phrase shortening or formatting was suggested: "+small.changes.map(x=>x.kind+": "+x.before+" → "+x.after).slice(0,3).join("; ")+". Compare the original before accepting.",
       "Saves approximately "+small.tokensSaved+" estimated tokens without inventing story facts.","low","Clarity & economy");
   }
  }
 }
 // A helpful success message matters: not all creators need arbitrary edits.
 if(out.length===0)coach("strong-draft","bio","Keep what is already working",
   "No high-confidence edits were identified. That is a good reason NOT to rewrite an established character just for optimization.",
   "Trial-chat three choices: accept a request, refuse it, and investigate a secret. Check the same voice, agency and knowledge boundaries hold each time.",
   "Actual Fizzz chat and media testing is stronger evidence than a generic popularity score.","low","Testing");
 const order={high:0,medium:1,low:2};
 return out.sort((a,b)=>order[a.priority]-order[b.priority]||(a.kind==="edit"?-1:1));
}
window.VelvetRuinFizzzAdvisor=Object.freeze({evaluate});
})();