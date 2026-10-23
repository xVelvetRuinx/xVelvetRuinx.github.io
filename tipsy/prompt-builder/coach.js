(() => {
"use strict";
/* VelvetRuin's independent writing-coach notes. All per-field budgets are
   editorial heuristics, not character-platform limits or measured outcomes. */
const F = {
 title:[4,22,"Use a distinctive name plus the instantly understandable situation.","[Name] — [a specific problem or promise]","Hollis Keene — The Last Train Out","Cut subtitles that merely say handsome, hot or mysterious.","Add a few words only if the premise is otherwise impossible to identify."],
 name:[2,8,"Give the character one consistent, adult identity. Avoid renaming them in lore.","[Given name] [surname]","Hollis Keene","Use the same spelling everywhere; avoid aliases unless narratively essential.","Add an alias only if it genuinely matters to a reveal."],
 age:[1,4,"State an adult age. Consistency is more useful than unnecessary exact birthdays.","[age, 18 or older]","38","A number is enough.","Explain a supernatural apparent age only in lore if the plot needs it."],
 gender:[1,4,"Choose a Tipsy category. A selection is not an invitation to assume {{user}}'s gender.","Male / Female / Non-binary","Male","Do not restate gender in every paragraph.","Explain unusual gendered social rules only if part of the story."],
 rating:[1,4,"Select the appropriate public rating. This is not permission to post noncompliant content.","Limited / Limitless","Limited","Set once, then write naturally within platform rules.","Review content standards rather than piling rating words into lore."],
 hook:[20,55,"Sell the immediate conflict, not the whole biography. Give the reader a reason to start.","[Disruption] + [unexpected character connection] + [specific stakes]","The last train vanished eleven years ago. Tonight, your ticket says it leaves in seven minutes.","Cut atmosphere that delays the problem; two tight sentences beat a paragraph.","A third sentence can help if the user's decision is otherwise unclear."],
 userRole:[25,65,"Tell the model who the player is, what they can do, and what is deliberately undecided.","{{user}} is [adult role] caught in [situation]; their [choices/identity] remain open.","{{user}} is an adult traveler with an impossible train ticket. Why they came, what they believe, and whether they board are their decisions.","Do not give {{user}} a personality, feelings, reaction or gender without necessity.","Specify expertise, institutional role or established history if the plot cannot function without it."],
 tease:[0,30,"End public copy on uncertainty, not an already answered mystery.","[An unresolved consequence or question]","The only man who knows the platform number refuses to say where it leads.","Skip this when the hook already does the job.","Use it for a second angle the hook cannot carry."],
 trope:[3,20,"Use recognizable reader-facing dynamics, not a dozen contradictory labels.","[relationship trope] · [genre] · [emotional pace]","Reluctant allies · supernatural mystery · slow burn","Three precise tropes beat fifteen vague ones.","Add a setting trope when readers would otherwise misread the genre."],
 appearance:[30,80,"Choose memorable visual anchors the bot should maintain; do not write an image-generation prompt here.","[build] + [face/hair] + [signature clothing or object]","Tall, weathered stationmaster with close brown hair, dark eyes, a charcoal wool coat and a brass watch that stopped at 11:47.","Pick three to five fixed anchors; cut fine color gradients and redundant synonyms.","Add a distinguishing physical trait if it changes plot action or recognition."],
 personality:[70,135,"Write actions under pressure: trait → trigger → visible response. Name contradictions rather than stacking adjectives.","[core disposition]. When [trigger], [reaction]. Despite [belief], [contradictory behavior].","Hollis is methodical and slow to trust. When frightened, he gets quieter and checks his broken watch; when someone is stranded, he helps without expecting thanks. He fears the train but still unlocks the station every night.","Replace 'mysterious, protective, loyal, dangerous' with two behaviors and a cause.","Spend more on reactions to jealousy, rejection, failure or trust only when those reactions drive the roleplay."],
 contradiction:[12,40,"One believable tension creates a person, not a trope collection.","[wants A] but [always does B] because [fear or belief]","He warns everyone away from Platform Nine, yet quietly leaves its gate unlatched every night.","Keep only the contradiction that will surface in scenes.","Add its origin if otherwise the bot acts inconsistently."],
 voice:[25,65,"Describe syntax, word choice, tone shifts and one manner of deflecting. Show it again in dialogue.","[sentence rhythm]; [humor]; [stress response]; [avoided habit]","Uses short, deliberate sentences and dry understatement. In danger he stops joking. He never explains his emotions in long speeches.","'Deep and sexy voice' does not tell the model how to write.","Add dialect or specialist vocabulary only if crucial; test to avoid caricature."],
 mannerisms:[10,40,"Give two physical tells with triggers, not a list of random gestures.","When [emotion], [specific repeated action].","When cornered by a hard question, Hollis rubs the cracked glass of his watch; when relieved, his posture loosens before his voice does.","One or two tells are enough; repeated face touches become tedious.","Use extra tells if they communicate a secret the player can discover."],
 occupation:[3,18,"Choose a job that influences routines, power and conflict.","[specific function or role]","Former stationmaster; caretaker of the abandoned terminal","Job title and one meaningful duty are enough.","Add rank or specialization if it changes what the character may realistically know or do."],
 surfaceGoal:[8,28,"What is the character trying to do in the next few scenes? Make it actionable.","[verb] + [specific objective] + [immediate reason]","Get the traveler to leave the station before midnight.","One clear active verb is stronger than 'protect everyone.'","Name a deadline if it creates immediate tension."],
 hiddenGoal:[12,45,"Give the character a private reason that can be revealed through choices.","[need] + [fear] + [what they hide]","He secretly hopes {{user}}'s ticket will lead to his missing sister, but fears risking another person's life to find her.","Do not expose all twists; state the motive and one conflict.","Explain the cost of the secret if revelations drive multiple episodes."],
 backstory:[25,85,"Use only past events that explain present behaviors or choices.","[past event] → [belief/habit now] → [consequence in play]","Eleven years ago he waved a full train out of Platform Nine. It never returned. The inquiry blamed him; since then, he keeps the station open in case the passengers come back.","Cut childhood facts if they do not influence present action.","Add a timeline of events only if chronology is itself the mystery."],
 anchors:[15,60,"State truly non-negotiable character behavior and limits positively and concretely.","Always [core rule]. Never [specific unwanted override].","Hollis never knows the train's destination for certain. He warns {{user}} but does not physically force them to leave. He does not reveal the missing-sister motive on first meeting.","Use two to four consequential rules, not fifty 'NEVER' commands.","Expand for a real puzzle mechanic or canon contradiction that needs enforcement."],
 sampleUser1:[8,35,"Prompt the bot with a believable, slightly difficult player question.","A question that tests one trait or secret.","Why do you keep checking a watch that doesn't work?","A short prompt is fine; the reply carries the teaching value.","Add player context only if needed to make the answer believable."],
 sampleChar1:[70,165,"Show a complete reply with distinctive language, small action and a reason to continue.","[in-character line] + [physical tell] + [revealing but incomplete answer]","\u0022Because it stopped at the right time.\u0022 *Hollis turns the brass watch face down, but his thumb stays on the crack.* \u0022That's what I tell people. What I don't tell them is that it runs for six seconds every time someone comes through the station door carrying one of those tickets.\u0022 *His eyes settle on the paper in {{user}}'s hand.* \u0022So, no. I don't check it to know the hour.\u0022","Do not use the sample to dump a biography; teach personality and formatting.","Longer examples can be valuable: Tipsy specifically recommends roughly 250–350 tokens across example dialogue."],
 sampleUser2:[8,40,"Use a new emotional situation; do not ask three versions of the same question.","A challenge, disagreement or unexpected request.","You could have told me about your sister.","Keep this prompt short.","Add context if refusal, jealousy or trust dynamics require it."],
 sampleChar2:[60,150,"Test an opposite side of the character so their tone stays recognizable under pressure.","[defensive first line] + [softened reveal] + [decision left to player]","\u0022Yes.\u0022 *For once, Hollis doesn't consult the watch.* \u0022I could have. And I told myself you would run if you knew what I wanted.\u0022 *He steps back from the door, leaving it open.* \u0022If you decide to leave now, I won't follow. But don't mistake that for me wanting you gone.\u0022","One meaningful pivot is enough.","Keep the longer version when it demonstrates a reaction not captured in the personality block."],
 sampleUser3:[8,35,"Pick a third situation with a different pressure level or a practical choice.","A player question at a consequential decision point.","If I step onto the train, will you come with me?","Optional when two exchanges already teach everything important.","Use this for a core relationship boundary, danger response or plot choice."],
 sampleChar3:[60,145,"Show how the bot responds when a key choice is on the table; never make the player's choice for them.","[truthful answer] + [controlled action] + [open decision]","\u0022I don't know if I can.\u0022 *He lifts the station key between two fingers but doesn't touch the latch.* \u0022I have spent eleven years making rules to keep myself off that platform. You have been here seven minutes, and every one of them has made those rules less convincing.\u0022 *He looks toward the dark rails, then back.* \u0022You go first only if that's what you want.\u0022","Cut filler and overexplained gestures.","An extra exchange is valuable when it tests a genuinely different behavior."],
 setting:[25,70,"State where and when the bot begins, plus one sensory or social factor that changes the scene.","[period/place] + [what feels different] + [constraint]","Present-day mountain town. The long-closed Victorian station has no power; the clock begins moving only when someone arrives with a stamped ticket.","Specific beats vague fantasy world; avoid describing every building.","Use more when laws, class structure or geography force different choices."],
 lore:[20,85,"Write rules with consequences. Every rule should affect what characters know, can do or risk.","[law] → [who enforces it] → [cost of breaking it]","Platform Nine no longer appears on maps. The station clock moves for valid tickets. A passenger cannot know the train's destination before boarding.","Remove lore no one can interact with.","Expand only for puzzle clues, competing factions, magic limits or political mechanics that recur."],
 scenario:[35,100,"Describe the crisis as it exists at message one. Anchor cause, deadline and what {{char}} currently knows.","[event now] + [immediate obstacle] + [stakes]","{{user}} arrives carrying a ticket dated tomorrow. An announcement sounds in the powerless station. Hollis knows the bell last rang when the train disappeared, but not who called it tonight.","Do not retell childhood history; that belongs in backstory.","Add the first obstacle if the scenario otherwise produces only idle conversation."],
 relationship:[20,65,"Set the initial emotional distance, who has leverage and what would change it.","[starting relation] + [mutual misread] + [earned bridge]","Hollis and {{user}} are wary strangers. He assumes they came seeking a legend; {{user}} has no obligation to trust him. They can earn respect through shared investigation.","Avoid instant soulmates unless that premise is intentional.","Add preexisting history only when the relationship would be incoherent without it."],
 pacing:[2,10,"Select the behavior your story requires; the export adds matching progression instructions.","[select one pacing approach]","Mystery — clues must be discovered","One pacing approach is enough.","A custom pacing law belongs in Non-negotiable characterization."],
 promptMode:[1,8,"Choose Compact first. Expanded adds more behavioral scaffolding but costs context.","Compact for most romance and character chats; Expanded for complex mechanics.","Compact · guide-first","Start compact and add only what testing proves is missing.","Switch to Expanded for complicated intrigue, many NPCs or rules that keep being forgotten."],
 supporting:[0,70,"Every NPC needs a role, conflict and one recognisable distinction.","[name] — [job] — [goal] — [pressure on {{char}}]","Ada — retired dispatcher who distrusts Hollis; she secretly preserved the old departure log.","Skip NPCs that do not enter the first several scenes.","Add factions and cast when decisions depend on opposing agendas."],
 canon:[0,85,"List only facts that must remain true, including what no character knows.","[fact] / [timeline] / [knowledge limit]","The last service vanished 11 years ago. Hollis was stationmaster, not passenger. He has not seen the missing passengers since.","Avoid duplicating every lore paragraph.","Use numbered clues or dates when a mystery relies on exact evidence."],
 openingScene:[30,100,"Open mid-event with one distinctive sensory detail, not a generic introduction.","[current sensory moment] + [unexpected change]","Rain taps the boarded station window until the bell above the abandoned ticket counter rings. The whole building falls silent.","One sound, sight or contradiction is enough.","Add two or three scene details if spatial orientation matters for what the player can do next."],
 openingAction:[20,70,"Make your character do something that proves their personality before they explain it.","[visible action revealing a priority]","Hollis steps out of the ticket office and shuts the platform gate, but leaves the station's street door wide open.","Cut generic smiling or staring unless it carries tension.","Use an action beat to establish distance, authority or boundaries."],
 openingDialogue:[10,65,"Start with a line no one else in the cast would naturally say. Spoken words go in double quotes.","\u0022[a line with subtext, observation or a consequential question]\u0022","\u0022That date hasn't happened yet.\u0022","No 'Hello, I'm Name' unless introducing them is the conflict.","Use more only if their first words actually reveal a dilemma, not a lore dump."],
 openingBeat:[20,75,"End with unresolved tension and a clear opening for {{user}}, not their response.","[physical opening] + [unanswered choice]","He steps away from the gate. Between the dark tracks and the open street door, the decision belongs to {{user}}.","Do not ask five questions at once or decide for {{user}}.","Add a relevant object, deadline or other playable pressure if there is no obvious next move."],
 openingImage:[0,35,"Paste a direct, authorized image URL only if you want to embed an image in the greeting.","https://.../your-original-art.png","https://example.com/your-original-portrait.png","Omit the image line if it harms pacing or the URL is unreliable.","Include it when a visual reveal adds context; Tipsy recommends images in greetings."],
 customGreeting:[0,260,"Use this only when you want full control of the greeting; it replaces the assembled pieces.","*One scene beat.* \u0022One distinctive line.\u0022 *An unanswered beat that leaves the player agency.*","*The platform bell rings once in the dark.* \u0022That date hasn't happened yet,\u0022 Hollis says, studying the ticket. *His hand stays off the locked gate; the street exit remains open.*","Avoid multi-scene flashbacks or speaking for {{user}}.","A longer greeting is worthwhile when it sets unique stakes and character voice; Tipsy says moderate length often performs well."],
 replyLength:[1,10,"Pick how richly the model should answer. Your greeting can be longer than normal replies.","Concise / Balanced / Literary","Balanced","Concise keeps dialogue responsive and the context light.","Use literary when scenic prose is part of the fantasy, then test for overlong replies."],
 artStyle:[2,12,"Select the look of the art prompt. This is for an image generator, not the roleplay model.","[coherent visual medium]","Cinematic photorealism","Pick one artistic style rather than mixing incompatible aesthetics.","Specify a medium only if the image generator needs more control."],
 artLighting:[10,50,"Describe place and one key source of light so the subject stays readable.","[environment] + [main light] + [accent color]","Abandoned station at night, brass desk lamp, cold rain beyond windows.","Choose one key light rather than eight cinematic adjectives.","Add another light for legibility or a specific mood."],
 artDirection:[20,70,"Choose outfit, framing, expression, and physical realism; state what must remain visible.","[outfit] + [camera] + [expression] + [important anatomy]","Charcoal wool coat, waist-up composition, restrained wary look, realistic hands, unobstructed face.","Avoid a page of competing camera instructions.","Expand for distinctive tattoos or accessories that must be reproduced exactly."]
};
const GUIDES={
 concept:{
 title:"The storefront earns the first click.",
 kicker:"01 · THE PUBLIC PROMISE",
 principle:"Write the premise in this order: who the player is → what interrupts their life → why this character changes the stakes. Give the reader one memorable choice.",
 weak:"Hollis is handsome, mysterious, protective, and has a dark past. Will you fall for him?",
 strong:"The last train vanished eleven years ago. Tonight your ticket says it leaves in seven minutes — and the stationmaster refuses to tell you where it goes.",
 steps:["Keep the title distinctive but searchable.","Use the hook to promise a playable first scene, not an entire plot.","Put facts essential to character behavior into Personality / Background as well, not only public copy."],
 caveat:"Editorial range for public hook: about 20–55 estimated tokens. Tipsy explicitly emphasizes an eye-catching tagline; this range is a VelvetRuin heuristic."
 },
 character:{
 title:"Make the model predict what they do.",
 kicker:"02 · THE PERSONALITY FORMULA",
 principle:"Write behavior, not a thesaurus. Use disposition + trigger + observable reaction + private contradiction. Then spend meaningful tokens showing that behavior in sample dialogue.",
 weak:"Dominant, mysterious, loyal, caring, smart, secretly soft, dangerous, protective, jealous.",
 strong:"Hollis is precise and slow to trust. When alarmed, his answers grow shorter and he checks his stopped watch. He warns strangers away from Platform Nine yet leaves its gate open in case someone he lost returns.",
 steps:["Tipsy suggests roughly 700–800 tokens for combined Personality and Example Dialogue, and at least 500 total characters across personality, greeting and examples.","Tipsy recommends about 250–350 tokens of example dialogue. Use contrasting exchanges to reinforce wording, choices and preferences; examples alone cannot enforce accents or reply lengths.","VelvetRuin planning split: approximately 450–550 tokens for compiled Background and 250–350 for Examples. This is not a requirement, a maximum or a guarantee.","Specify speech style and response length in Personality / Background; do not rely on sample dialogue to force them."],
 caveat:"For a simple conversational bot, spend fewer tokens on lore and more on speech and reactions. A mystery, ensemble cast or rule-driven scenario may need more. Test whether added facts actually prevent mistakes; longer does not automatically mean better."
 },
 world:{
 title:"Every detail should change a decision.",
 kicker:"03 · WORLD RULES THAT STICK",
 principle:"Write place + one binding rule + the immediate conflict + the starting relationship. A rule is useful only when it can constrain actions or cause consequences.",
 weak:"An ancient mysterious town has a thousand secrets and countless powerful figures.",
 strong:"The powerless station clock moves only when a valid ticket enters. Hollis knows this, but he has never learned where the midnight train goes. {{user}} arrives with tomorrow's ticket tonight.",
 steps:["Describe what {{char}} knows versus suspects; never grant them evidence they have not found.","Keep unnecessary world history out of the core prompt.","Use Expanded mode for recurring clues, factions or difficult mechanics; trackers operate only within the chat context, not as an actual saved database."],
 caveat:"The chapter's field budgets are editing targets, not additional token allowances: all compiled sections share one overall context."
 },
 opening:{
 title:"Begin one heartbeat before a choice.",
 kicker:"04 · THE OPENING THAT GETS ANSWERED",
 principle:"Scene → revealing action → one unmistakable voice line → an unfinished beat. Make the player curious, involved and free to respond.",
 weak:"Hello {{user}}! I am Hollis. I work at a haunted station. What do you want to do?",
 strong:"*The dead station's clock begins to tick as you unfold the ticket.* Hollis catches sight of tomorrow's date. \u0022That train never came back.\u0022 *He opens the street door instead of the platform gate and waits.*",
 steps:["Tipsy reports moderate-length greetings with narration and dialogue often receive more likes.","Use *asterisks* around narration and \u0022double quotes\u0022 around spoken words. Single quotes mark inner thoughts or side-character speech.","Do not write {{user}}'s dialogue, feelings or decision. A greeting can be longer than usual replies when scene-setting earns it."],
 caveat:"Suggested starting greeting: about 100–220 estimated tokens; not a Tipsy limit. Use more for location, conflict or clarity — never merely to fill space."
 },
 export:{
 title:"Spend tokens where players can feel them.",
 kicker:"05 · COMPILE, TRIM, TEST",
 principle:"The strongest version is not always the longest. Your budget meter measures generated Background plus Example Dialogue, not just text you typed; reusable instructions and formatting rules count too.",
 weak:"A thousand words of history and only one line of dialogue.",
 strong:"Compact present-tense identity, a few tested behavior rules, 2–3 substantially different sample responses and a strong opening scene.",
 steps:["First cut repeated adjectives, descriptions already in the image, and lore with no immediate consequence.","Then preserve speech, conflicting motives, scene constraints, knowledge limits and player autonomy.","Expand when the chat repeatedly forgets a crucial rule, the cast is genuinely multi-character, or a mystery needs exact clue logic — test one addition at a time."],
 caveat:"Tipsy's 700–800-token suggestion is a starting target, not a guarantee, approval criterion, platform maximum or substitute for roleplay testing."
 }
};
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const rough=v=>Math.max(0,Math.ceil(String(v||"").length/4));
const kfmt=n=>n.toLocaleString("en-US");
const lessonTargets=[["concept","#step-concept"],["character","#step-character"],["world","#step-world"],["opening","#step-opening"],["export","#step-export"]];
const mk=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
function createLesson(chapter,container){
 const data=GUIDES[chapter],lesson=mk("section","coach-lesson");
 lesson.setAttribute("aria-label","How to write this chapter");
 lesson.append(mk("p","coach-eyebrow",data.kicker),mk("h4","",data.title),mk("p","coach-principle",data.principle));
 const compare=mk("div","coach-compare");
 for (const [label,text,cls] of [["GENERIC / LOW IMPACT",data.weak,"bad"],["STRONGER / SPECIFIC",data.strong,"good"]]){
    const part=mk("div","coach-compare-part "+cls);
    part.append(mk("span","coach-mini-label",label),mk("p","",text));compare.append(part);
 }
 lesson.append(compare);
 const list=mk("div","coach-step-list");
 data.steps.forEach((t,i)=>{const row=mk("p","");row.append(mk("b","",String(i+1).padStart(2,"0")),document.createTextNode(t));list.append(row);});
 lesson.append(list,mk("p","coach-caveat",data.caveat));
 const anchor=$(".step-top",container);
 if(anchor)anchor.insertAdjacentElement("afterend",lesson);
}
function helpFor(field){
 const meta=F[field.dataset.key]; if(!meta) return;
 const [min,max,desc,formula,example,trim,expand]=meta;
 const label=field.closest("label.field");
 if(!label)return;
 const tip=mk("details","coach-field");
 const summary=mk("summary");
 summary.append(mk("span","coach-question","✧ What exactly should I write?"),mk("span","coach-live","≈ 0 tokens"));
 const content=mk("div","coach-field-body");
 const p=mk("p","coach-write",desc);content.append(p);
 const pairs=[["USE THIS STRUCTURE",formula],["EXAMPLE · REWRITE FOR YOUR OWN BOT",example],["SPEND LESS",trim],["SAY MORE WHEN",expand]];
 for(const [title,body] of pairs){
   const section=mk("div","coach-detail");
   section.append(mk("span","coach-mini-label",title),mk("p","",body));
   content.append(section);
 }
 if(field.type!=="checkbox"&&field.tagName!=="SELECT"&&field.dataset.key!=="openingImage"&&field.dataset.key!=="customGreeting"){
    const tryButton=mk("button","coach-example-btn","↳ Use this example");
    tryButton.type="button";
    tryButton.addEventListener("click",e=>{
      e.preventDefault();e.stopPropagation();
      if(field.value.trim() && !confirm("Replace your current writing with the example?"))return;
      field.value=example;field.dispatchEvent(new Event("input",{bubbles:true}));
      displayTip("Example inserted. Rewrite it for your character.");
      field.focus();
    });
    content.append(tryButton);
 }
 if(max)content.append(mk("p","coach-budget-hint","Suggested input: ≈ "+min+"–"+max+" tokens. These field-level ranges are optional editing aids, not Tipsy limits and do not add up to a separate allowance."));
 else content.append(mk("p","coach-budget-hint","Optional field: 0 tokens is fine if it adds nothing to the story."));
 tip.append(summary,content);
 label.append(tip);
 const counter=mk("span","coach-meter-inline");
 label.append(counter);
 field.dataset.coached="true";
 field._coach={tip,summary:summary.querySelector(".coach-live"),counter,range:[min,max]};
}
function countField(field){
 const c=field._coach;if(!c)return;
 const tokens=rough(field.type==="checkbox"?(field.checked?"yes":""):field.value);
 c.summary.textContent="≈ "+tokens+" tokens";
 const [min,max]=c.range;
 c.counter.textContent="~"+tokens+" tokens · "+(field.value||"").length+" characters"+(max?" · suggested "+min+"–"+max:"");
 c.counter.classList.toggle("over-soft",Boolean(max && tokens>max));
}
function characterData(){
 // Read generated output, not raw inputs, because the generated instruction
 // scaffold and duplicated context use tokens too.
 const cards=$$(".output-card");
 const textFor=(index)=>cards[index]?.querySelector("pre")?.textContent||"";
 const background=textFor(3),dialogue=textFor(4),opening=textFor(2);
 return {background:rough(background),dialogue:rough(dialogue),opening:rough(opening),textBack:background,textDialogue:dialogue};
}
function updateBudget(){
 const d=characterData();
 const total=d.background+d.dialogue;
 const pct=Math.min(100,Math.round(total/800*100));
 const meter=$("#coach-budget-fill"),main=$("#coach-budget-total"),b=$("#coach-budget-background"),e=$("#coach-budget-dialogue"),advice=$("#coach-budget-advice"),greeting=$("#coach-greeting-total"),bar=$("#coach-budget-meter");
 if(!main)return;
 main.textContent=kfmt(total)+" estimated tokens";
 b.textContent=kfmt(d.background);
 e.textContent=kfmt(d.dialogue);
 greeting.textContent=kfmt(d.opening);
 meter.style.width=pct+"%";
 meter.dataset.state=total>1000?"over":total>=700&&total<=850?"ideal":"neutral";
 bar.setAttribute("aria-valuenow",String(total));
 let comment="";
 if(total>1000)comment="Very long for the official starting recommendation. Cut duplicate lore and generic rules; keep motives, constraints and diverse dialogue.";
 else if(total>850)comment="Slightly over the official 700–800 guide. Keep extra detail only if testing proves it matters.";
 else if(total>=700)comment="Near Tipsy's recommended 700–800 starting target. Quality and consistent behavior still need live testing.";
 else if(d.dialogue<250 && total>400) comment="Example dialogue is light. Tipsy recommends roughly 250–350 example tokens; add a contrasting exchange before expanding lore.";
 else comment="You may need more character behavior or stronger examples. Short can be ideal for a simple bot; test it rather than padding.";
 if(d.dialogue>350)comment+=" Your dialogue also exceeds its suggested 250–350 token range; choose your strongest contrasting exchanges.";
 advice.textContent=comment;
 $("#coach-persona-breakdown").textContent="Suggested starting split: ~450–550 background / ~250–350 example dialogue. Not a fixed requirement.";
}
function makeBudget(){
 const card=mk("section","coach-budget-card");
 card.innerHTML='<p class="coach-eyebrow">LIVE TOKEN ECONOMY</p><h4>The context ledger</h4><p class="coach-budget-total" id="coach-budget-total">0 estimated tokens</p><p class="coach-small">Compiled Personality / Background + Example Dialogue</p><div class="coach-budget-bar" role="progressbar" id="coach-budget-meter" aria-label="Estimated persona and example tokens" aria-valuemin="0" aria-valuemax="800" aria-valuenow="0"><span id="coach-budget-fill"></span></div><div class="coach-budget-stats"><div><span>Background</span><b id="coach-budget-background">0</b></div><div><span>Examples</span><b id="coach-budget-dialogue">0</b></div><div><span>Opening (separate)</span><b id="coach-greeting-total">0</b></div></div><p class="coach-budget-advice" id="coach-budget-advice"></p><p class="coach-small" id="coach-persona-breakdown"></p><details class="coach-budget-faq"><summary>How exact is this count?</summary><p>Estimates use approximately one token per four characters, Tipsy’s stated general English-language approximation. Actual tokenizer results vary by punctuation, formatting, special tokens and language. This counts generated fields, including instruction scaffolding, not the model’s real runtime overhead. 700–800 is a <em>recommendation</em>, not a technical ceiling.</p></details><p class="coach-budget-source"><a href="https://tipsy.chat/creators-guide" target="_blank" rel="noopener noreferrer">Source: Tipsy guide, sections 2.5 and 3.3–3.4 ↗</a></p>';
 const preview=$(".preview-column");if(preview)preview.append(card);
 const exportStep=$("#step-export");
 if(exportStep){
   const mini=mk("div","coach-export-inline");
   mini.innerHTML='<b>✦ How much is too much?</b><p>Watch the live ledger beside the builder. Start near Tipsy’s suggested 700–800 tokens for generated background + examples; there is no universal minimum quality threshold. If it reads like a biography instead of a playable character, trim history before cutting behavior, dialogue or key rules. Expand only to solve a concrete problem you observed in testing.</p>';
   const audit=$(".audit",exportStep);
   if(audit)audit.insertAdjacentElement("beforebegin",mini);
 }
}
let noticeTimer;
function displayTip(str){
 let box=$("#coach-notice");
 if(!box){box=mk("div","coach-notice");box.id="coach-notice";box.setAttribute("role","status");document.body.append(box);}
 box.textContent=str;box.classList.add("show");
 clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>box.classList.remove("show"),2500);
}
function updateAll(){
 $$("[data-coached]").forEach(countField);
 updateBudget();
}
function init(){
 lessonTargets.forEach(([id,selector])=>{const el=$(selector);if(el)createLesson(id,el);});
 $$("input[data-key], textarea[data-key], select[data-key]").forEach(helpFor);
 makeBudget();
 updateAll();
 // Original builder saves and compiles on input; deferred refresh observes
 // the finished generated preview.
 const refresh=()=>setTimeout(updateAll,0);
 document.addEventListener("input",refresh);
 document.addEventListener("change",refresh);
 document.addEventListener("click",e=>{
   if(e.target.closest("#load-demo,#clear-project,#import-project,#project-file,.chapter,.tag-chip"))setTimeout(updateAll,80);
 });
 const uploader=$("#project-file");
 if(uploader)uploader.addEventListener("change",()=>setTimeout(updateAll,120));
 const output=$("#output-list");
 if(output && typeof MutationObserver!=="undefined"){
   const observer=new MutationObserver(()=>updateAll());
   observer.observe(output,{childList:true});
 }
 const options=["concept","character","world","opening","export"];
 const tabButtons=$$(".chapter");
 tabButtons.forEach((el,i)=>el.addEventListener("keydown",()=>setTimeout(updateAll,0)));
 const summary=$("#tab-character");
 if(summary) summary.title="Character prompts, examples and live guidance";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();