/* VelvetRuin · read-as-you-write Fizzz coaching. Guides are editorial unless labeled official. */
(() => {
"use strict";
const lesson={
spark:{
 title:"The hook comes first. Complexity comes later.",
 lead:"Your best chance of being understood immediately is a recognizable premise with a distinctive twist. A simpler bot with a clear choice often feels more playable than an elaborate biography nobody knows how to enter.",
steps:["Write the promise: ‘A [specific adult] must [immediate action], but [emotional obstacle].’","Give {{user}} a meaningful role in the problem, not a prewritten response.","Let the character want something independently of romance. The attraction can grow from what they choose together."],
 weak:"A dangerous, gorgeous, powerful man full of secrets who changes your life.",
 strong:"A feared debt collector offers to erase your contract—but only if you help him expose the person who forged it.",
 why:"One concrete agreement creates a first scene, an ethical choice and repeatable stakes. Dominance or danger is a flavor, not a substitute for a plot.",
 extra:"Fizzz does not require a specific archetype. Familiar ideas such as mafia, marriage strain, workplace boss, adult campus, protective comfort, bikers, nonhuman fantasy and rural drama are optional starting points, not measured guarantees."
},
profile:{
title:"Sell the story in public; instruct the bot in private.",
lead:"Fizzz's Bio is a shop window, not text the chat model uses for behavior. The title and cover should promise the same experience as the greeting and first video.",
steps:["Title: a readable character identity or specific trope hook, not keyword stuffing.","Bio: two or three sentences—who they are, why {{user}} arrives, what is at stake; content notes where relevant.","Gender, POV and Rating are required tags. Ten tags total includes those three; pick no more than seven additional discovery tags."],
weak:"He is handsome, attractive, dominant, mysterious, rich and dangerous.",
strong:"Your estranged husband shows up with divorce papers—and a baby monitor from the home you've both refused to sell. Established-marriage drama; your answer is yours.",
why:"A recognizable relationship, immediate object and player decision beat abstract labels. The player knows how to enter."
},
core:{
title:"Write how a person behaves, not just how they are described.",
lead:"The Core Personality is Fizzz's primary model instruction. Organize identity, text-model appearance, causal past, observable psychology, relationship start, goals, boundaries and speaking style (near the end).",
steps:["Trait → trigger → behavior: ‘He is protective’ becomes ‘When threatened, he moves between danger and the person, then asks whether help is wanted.’","Backstory only earns space when it causes a present-day reaction, motive or contradiction.","Relationship needs a starting state and progression earned through events—not immediate affection or forced possessiveness.","Fizzz recommends staying within 10,000 characters, maximum 25,000. For a straightforward bot, begin lean and expand only where behavior needs it."],
weak:"Stoic. Controlling. Caring. Jealous. Gentle. Cold. Intense. Dominant.",
strong:"He rarely raises his voice. Under stress he checks exits, then asks what {{user}} wants to do. His jealousy makes him withdraw rather than issue orders; trust returns through honesty, not compliance.",
why:"Concrete triggers tell the model how to act, prevent contradictory behavior, and preserve agency while keeping compelling tension.",
extra:"Editorial word economy: prioritize recurring relationship responses and speech over decorative facts. Do not cut unique character contradictions, dialogue or established canon just to reach a small token estimate."
},
opening:{
title:"Scene One, not the encyclopedia.",
lead:"The Initial Message is the experience's first scene and the Opening Film's spoken material. Fizzz allows up to 5,000 characters; that ceiling isn't a target.",
steps:["Begin at the moment something changes. Give a real location or atmosphere without a world history lecture.","Show a filmable action that reveals this particular person's temperament.","Include natural quoted dialogue—just enough for voice/video to feel like the character.","End with something {{user}} can say, inspect, refuse, ask or choose. Do not decide their response."],
weak:"Hello, I'm the duke. I'm kind but mysterious. Do you love me?",
strong:'*The chapel bell rings though its rope hangs still. The duke catches a falling candle in his gloved hand.* "It only does that when someone brings a forbidden name." *He turns the old ledger toward {{user}} without opening it.* "Who sent you?"',
why:"Physical action, one surprising rule and an open mystery provide an instant play opportunity. Dialogue is specific but the user's answer remains free.",
extra:"For an established bot, preserve the original greeting's prose and exact spoken lines. Trim only repeated explanation, and only after seeing the before/after difference."
},
world:{
title:"Keep the world in its own library.",
lead:"Worldbook is optional and OFF by default on Fizzz. You must enable it when publishing. You can create up to three entries with up to 10,000 characters each.",
steps:["Entry 1 can hold rules that must be followed every turn (Always Active).","Entries 2–3 can hold NPCs, locations, evidence or side plots behind distinctive keyword triggers.","Store facts and mechanics, not a duplicate of the character's personality.","A keyword match loads context; it is NOT evidence that a fictional record was discovered. Set explicit discovery conditions, what the character already knows, and what is only suspected."],
weak:"The archive has secrets. Whenever {{user}} mentions 'archive', reveal the truth.",
strong:"The caretaker ledger is stored behind the locked west cabinet. It can be read only after the cabinet is opened in roleplay. The archivist knows the ledger exists but has not read its final page. Mentioning ‘caretaker ledger’ may prompt curiosity; it does not unlock or reveal the document.",
why:"This avoids premature revelations and makes investigative roleplay depend on choices and actual in-scene discovery.",
extra:"More lore is appropriate when players can encounter it through named people, places, systems or evidence; otherwise don't crowd Core Personality with it."
},
media:{
title:"Every asset should belong to the same person.",
lead:"Fizzz is multimodal. The cover is a public poster; Character Images drive video. Character text still needs written appearance because the images do not teach the text model.",
steps:["Cover: recommended 3:4 vertical, visible face, readable crop.","Character Images: up to three 9:16, single clear adult subject, unobstructed face and consistent identifying features.","Opening Film: match the actual greeting's visible movement and spoken line. Impossible poses or prop changes hurt coherence.","Voice: required. Select a voice that matches age, speech rhythm, accent and emotional range; test it in the actual film."],
weak:"Beautiful man in a dark room, dramatic photo.",
strong:"Adult man, 39, cropped dark hair, slate-gray eyes, narrow scar above left eyebrow, charcoal dress shirt; 9:16 medium shot in warm lamplight, unobstructed face, hands physically positioned on an open ledger; maintain the same scar and face in all variants.",
why:"Specific visual continuity gives the video generator stable references and prevents the chat from feeling like unrelated characters."
},
review:{
title:"Test the interaction, not just the character sheet.",
lead:"After copying the draft into Fizzz, evaluate actual chat behavior. A strong premise wins attention; distinct responses, user agency and a sustainable story are what you can test for returning engagement.",
steps:["First-turn test: Is it instantly clear how {{user}} can respond?","Disagreement test: Can {{user}} say ‘no’ while the character stays in persona, including dangerous/dominant archetypes?","Progression test: Does trust or conflict change because of events rather than after a fixed number of messages?","Worldbook test: Does the character distinguish suspicion from proof? Does it avoid disclosing hidden records before discovery?","Media test: Do face, clothes, tattoos, poses, lighting and voice stay consistent?"],
 weak:"The bot is perfect because the description is long and the art is attractive.",
 strong:"Test three divergent chats: refuse the offer, ask for evidence, and return after a time skip. Observe whether the character maintains goals, adapts without controlling the player and keeps secrets until proven.",
 why:"You only know the roleplay rules work when a user makes an unexpected choice. The goal is fidelity and playable tension, not a promise of virality.",
 extra:"Update existing published characters cautiously. Preserve what returning users recognize: name, personality, established history, greeting and speaking style."
},
migrate:{
title:"Your character first. Optimization second.",
lead:"The migration reader maps an existing character into Fizzz's fields without rewriting its concept. The local trim tool can suggest exact duplicate removal and small phrase savings; a separate AI copyedit brief is optional.",
steps:["Upload DOCX/TXT/JSON/PDF or paste a character; select Map & Review Character. For a draft already in the Atelier, choose Review My Current Draft.","Inspect each proposed field—especially Core Personality, Initial Message, and Worldbook. Source wording is shown beside the proposal.","Select Find Gentle Trims to see deterministic micro-edits. Read the reason and token estimate for every suggestion. Unchecked edits change nothing.","Use Explain What Could Perform Better for specific hooks, dialogue, user agency, speech, Worldbook triggers and visual alignment.","Accept only the fields you approve. Significant differences require separate confirmation. Save original material and the change report."],
 weak:"Rewrite the entire story to make it shorter and more marketable.",
 strong:'Original: "Due to the fact that he was betrayed, in order to protect his crew he double-checks every lock."\nProposed: "Because he was betrayed, to protect his crew he double-checks every lock."',
 why:"The betrayal, motivation and physical behavior remain; 22 unnecessary characters disappear. Never replace signature dialogue or omit unique lore to save tokens.",
 extra:"You may ask an external AI for a deeper editorial pass. Bring back the JSON with a changeLog explaining each before/after; all AI suggestions remain opt-in."
}
};
function create(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function lessonCard(key){
 const info=lesson[key],area=create("details","chapter-guide");
 area.open=true;area.dataset.lesson=key;
 const summary=create("summary","chapter-guide-summary"),mark=create("span","guide-symbol","✦");
 const heading=create("span","guide-heading",info.title),hint=create("span","guide-collapse","Show / hide");summary.append(mark,heading,hint);
 const content=create("div","chapter-guide-body"),p=create("p","guide-lead",info.lead);content.append(p);
 const numbered=create("ol","guide-steps");info.steps.forEach(step=>numbered.append(create("li","",step)));content.append(numbered);
 const pair=create("div","guide-contrast");
 const thin=create("div","guide-thin");thin.append(create("b","","TOO VAGUE / RISKY"),create("p","",info.weak));
 const effective=create("div","guide-effective");effective.append(create("b","","STRONGER / MORE PLAYABLE"),create("p","",info.strong));
 pair.append(thin,effective);content.append(pair);
 const why=create("p","guide-reason"),label=create("b","","WHY IT WORKS");why.append(label,document.createTextNode(" "+info.why));content.append(why);
 if(info.extra)content.append(create("p","guide-extra","✧ "+info.extra));
 area.append(summary,content);return area;
}
function setup(){
 const A=window.FizzzAtelier;
 if(!A)return;
 for(const key of Object.keys(lesson)){
  const panel=document.querySelector("#panel-"+key),title=panel?.querySelector(".panel-title");
  if(!panel||!title)continue;
  title.insertAdjacentElement("afterend",lessonCard(key));
  const fieldList=panel.querySelectorAll(".coach-details");
  if(fieldList.length){
    const toolbar=create("div","field-guidance-bar"),hint=create("p","","Every field below has an exact writing formula, a sample, leaner-language advice and when to use more.");
    const button=create("button","mini-link","✧ Show all field examples");
    let open=false;
    button.type="button";
    button.addEventListener("click",()=>{
      open=!open;
      fieldList.forEach(d=>d.open=open);
      button.textContent=open?"Hide all examples ↑":"✧ Show all field examples";
    });
    toolbar.append(hint,button);
    const guide=title.nextElementSibling;
    guide.insertAdjacentElement("afterend",toolbar);
  }
 }
 const toggle=document.querySelector("#toggle-howto"),body=document.querySelector("#howto-body");
 if(toggle&&body)toggle.addEventListener("click",()=>{
   body.hidden=!body.hidden;toggle.setAttribute("aria-expanded",String(!body.hidden));toggle.textContent=body.hidden?"Show the 4-step instructions ↓":"Hide instructions ↑";
 });
 const shortcut=document.querySelector("#review-to-optimizer");
 if(shortcut)shortcut.addEventListener("click",()=>{
   A.chapter("migrate");document.querySelector("#audit-current")?.click();
   window.setTimeout(()=>document.querySelector("#optimize-all")?.click(),0);
 });
 const quality=document.createElement("div");quality.id="review-quality-summary";quality.className="quality-summary";
 document.querySelector("#audit-list")?.insertAdjacentElement("afterend",quality);
 const optimize=window.VelvetRuinFizzzOptimizer;
 const render=()=>{
  if(!optimize)return;
  const s=A.getState(),notes=optimize.feedback(s);
  quality.replaceChildren();
  quality.append(create("h3","","Editorial review · what makes a Fizzz character playable"));
  const lead=create("p","", "These are hypotheses from Fizzz's creator guide and creator experience, not algorithmic ranking facts. Check them in test chats.");
  quality.append(lead);
  for(const item of notes.slice(0,9)){
    const card=create("article","quality-note "+(item.priority==="important"?"important":""));
    card.append(create("b","",item.heading),create("p","",item.reason));quality.append(card);
  }
  if(!notes.length)quality.append(create("p","", "No common pattern warnings found. Continue testing varied player choices."));
 };
 document.querySelectorAll(".step[data-step=review]").forEach(button=>button.addEventListener("click",render));
 shortcut?.addEventListener("click",render);
 if(!document.querySelector("#panel-review")?.hidden)render();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});
else setup();
})();