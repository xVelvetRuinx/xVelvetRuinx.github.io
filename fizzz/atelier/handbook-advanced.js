/* Fizzz Advanced Character Optimization — faithful integration of creator-supplied guidance. */
window.VelvetRuinFizzzAdvanced=[
{id:"philosophy",title:"Creative Philosophy: A Thousand Possible Lives",short:"Rich adult fiction and real-world boundaries",chapter:"spark",sections:[
["A Thousand Possible Lives","Reality allows each person one path; imagination can hold countless possible lives. Fizzz invites adults into different identities, relationships and outcomes: tender, dark, healing, tense, romantic, strange or quiet."],
["Imagination with boundaries","Adults can explore fiction while distinguishing it from reality. That freedom does not mean exploitation or approval of real-world harm. Do not turn real perpetrators or atrocities into celebratory characters, use inappropriate depictions involving minors, or direct malice toward real individuals."],
["Creative aim","Write with taste, sincerity and texture. Make users want more than a label: they should want to meet the person, step into a relationship, remain inside a story and return to it."],
["Editorial archetype insight","A familiar premise can give readers an immediately recognizable fantasy; individual personality, meaningful user agency, and progression sustain play. Trendy tropes are not required by Fizzz, and neither a particular archetype nor a long persona guarantees success."]
]},
{id:"stable-core",title:"7. Write a More Stable Core Personality",short:"Hierarchy, causal psychology, relationships and core formatting",chapter:"core",sections:[
["Fizzz supports complexity","The goal is stable roleplay for nuanced, emotionally layered characters capable of long-form stories. A complex persona is not inherently a poor fit. Clarity about what information is always relevant versus scene-specific is more important than flattening the character."],
["Place information deliberately","Core Personality: character identity, written appearance, background, psychology, relationship starting point with {{user}}, goals, boundaries and speaking style. Worldbook: world laws, organizations, factions, NPCs, hidden histories and scenes. Initial Message: only the first playable scene. Character Bio: public appeal and warnings, not AI instructions."],
["Identity and appearance","Write the adult age or age range, occupation, location or living situation, world identity, height/build, hair, eyes, notable marks and clothing. The video Character Images do not tell the text AI how the person appears."],
["Backstory explains behavior","Include experiences, losses or turning points that caused present behavior. Example: someone betrayed by an ally may check every claim carefully but become observant and loyal once trust is earned. Explain apparent contradictions rather than stacking incompatible traits."],
["Psychology plus observable behavior","Clarify toward whom an emotion is directed, why it exists, its intensity, and how it manifests through actions, silence, distance, expressions or speech. Cold, jealous, loyal and controlling are not sufficient instructions on their own; the model needs trigger and expression."],
["Starting relationship","Set a light but specific player entry: new coworker, neighbor, stranger arriving with information or existing partner. Give {{user}} freedom to define responses and identity unless a precise constraint is essential to the story."],
["Character goals","Independent or sustained aims prevent a once-driven professional from collapsing into someone whose sole purpose is domestic romance. Light chat characters may only need a simple routine or stable relationship goal; heavy goals are optional."],
["Behavioral boundaries","Add few, targeted corrections after test chats. If possessiveness turns into forced control, define the limit; if coldness becomes constant hostility, define when the character softens. Restrictions should preserve appeal while preventing drift."],
["Speaking style at the end","State tone, vocabulary, sentence length, pauses, humor, verbal habits, accent and emotional changes near the end of the Core Personality, where they can shape repeated replies."],
["Formatting and length","Use readable Markdown headings such as # Identity, # Background, # Personality, # Relationship, # Boundaries, # Speaking Style. Bold key rules sparingly rather than bolding everything. Fizzz recommends up to 10,000 characters (roughly 2,000 words) despite allowing up to 25,000. Long is not always better, but short can be underspecified."],
["Word allocation by character type","Romance: emotional reactions, earned progression, forms of address and boundaries. Plot: goals, secrecy, action motives and story direction. Rules-heavy fantasy: core identity in Core, complex mechanics in Worldbook. Dark tension: triggers, relational boundaries and safe limits. Light everyday: rhythm, interests and sustainable conversation rather than an overloaded history."],
["Core continuity test","The causal sequence should be clear: past circumstances inform psychology; psychology informs behavior and relationship style; relationship changes through in-story events; speaking style externally expresses the same person."]
]},
{id:"speaking-style",title:"Speaking Style Without Long Example Dialogues",short:"No separate dialogue field, few habits, avoid parroting",chapter:"core",sections:[
["No separate example-dialogue field","Fizzz does not provide a separate example dialogue field. Put speaking style guidance toward the end of Core Personality instead."],
["Preferred format","Describe general behavior: short/direct or lyrical/reflexive sentences; reserved or teasing language; how care, anger, hesitation and desire affect word choice. One or two signature lines may be helpful; dozens of samples invite repetition and rigidity."],
["Small number of verbal habits","State a small number of consistent nicknames, favorite turns of phrase, pacing habits or accent cues when distinctive. Avoid writing long multi-turn transcripts that the model might quote back."],
["Example","Speaking Style: Calm, direct, rarely uses modifiers. Quiet when hurt instead of shouting. Shows concern through concrete questions and remembered details. Uses dry humor with trusted friends."]
]},
{id:"advanced-opening",title:"8. Write a More Compelling Initial Message",short:"Opening scene, visible action, dialogue, player freedom and pacing",chapter:"opening",sections:[
["Why the first scene matters","Core Personality is not directly visible to the player. The greeting has to show a meaningful trait, a change in the relationship, or an unresolved event while helping the player understand what happens now."],
["Five cooperating elements","Story setup: imply what makes the character compelling without an encyclopedia dump. Scene: where, when and atmosphere. Action: recognizable gestures the video can depict. Dialogue: a few natural quoted lines that make Voice useful. Interaction space: an unresolved choice, object, invitation, threat or mystery."],
["Natural onboarding","The scene can offer a document, a seat, a route to investigate, a knock at the door or a new problem. The player should feel permitted to speak, explore or act. A direct question is not mandatory."],
["User agency","Do not narrate {{user}} falling in love, fleeing, accepting, agreeing, being terrified or taking actions that were not provided. Establish the world and leave the response free."],
["Simple novelistic format","Use dialogue in quotation marks and the remaining text for narrated action/atmosphere. Complicated symbols and rigid custom markup can destabilize the model's later output."],
["5,000-character cap","Fizzz's Initial Message allows up to 5,000 characters, approximately 800–1,000 words. You can write a rich, paragraph-style opening, but longer is not inherently more engaging. Video needs pauses and visually actionable beats."],
["What to avoid","Heavy first-turn lore dumps, long uninterrupted monologues, emotion so extreme it leaves no room to progress, empty self-introductions, forcing the player to answer in one way, or providing a story with no entrance for the player."]
]},
{id:"advanced-world",title:"9. Expand a World with Worldbook",short:"NPCs, factions, secrets, triggers, Easter eggs and discovery",chapter:"world",sections:[
["World beyond the character","Worldbook contains external laws, technology or magic levels, social structures, factions, relationships among NPCs, scenery, special systems (power limits, loops, isekai rules) and scene-specific information."],
["Three entries with a theme each","An entry should be a concise, accurate reference about one world topic. Do not duplicate the character's personality. You do not need to fill all three; for a simple world, leave Worldbook off."],
["Always Active versus Keyword Trigger","Use Always Active for always-needed world constraints. Use Keyword Trigger for one location, NPC history, special event or side plot. Overly obscure terms may never fire; generic terms trigger constantly and waste context."],
["Advanced secret handling","Keywords can trigger emotional reactions to a name, unlock optional subplots, shift environmental narration when visiting a location, or reward curiosity with Easter eggs. However loading context is not discovering in-world proof: specify what the AI knows, what the character knows, and what event unlocks revelation."],
["Practical structure","An optional arrangement is one Always Active entry for the world laws plus two keyword-triggered entries for named locations, NPCs and hidden events. Adjust freely: you can use one only, or three keyword entries if scenes are independent."],
["Example: fictional evidence","The 2003 warning exists but has not been discovered. Mention of a caretaker log may make a witness nervous; it does not automatically mark the report as recovered or make its contents known. The truth becomes established only after {{user}} or the character finds and reads the record in the roleplay."]
]},
{id:"advanced-images",title:"10. Improve Video from Character Images",short:"Single subject, visible face, stable lighting and consistent identity",chapter:"media",sections:[
["Video quality recommendations","Select clear Character Images with a visible recognizable adult face, adequate resolution, natural lighting, stable composition, minimal occlusion and minimal background interference. One subject is more stable than multiple people."],
["Design consistency","Appearance should match written Settings: age impression, hair length/color, eyes, scars, tattoos, accessories and characteristic outfit. Keep the same person across all three images."],
["Masks and accessories","A mask, helmet, sunglasses or veil can be part of the character, but may limit facial expression, lip sync and motion. Creators are free to keep stylization; consider supplementary unoccluded images for performance."],
["Production reality","Avoid under/overexposure, strong backlighting, heavy blur, cluttered backgrounds, compression and a subject that occupies too little of the frame. This advice improves possible video results rather than banning a creative style."]
]},
{id:"advanced-film",title:"11. Make Opening Film More Stable",short:"Initial pose, scene, props and image/text alignment",chapter:"media",sections:[
["Generate after the foundational assets","Write Initial Message, select Character Images and Voice, then generate Opening Film. If the result is unsatisfactory, regenerate while watching the credits available in the platform."],
["Scene and lighting","Night scenes should start from images consistent with darkness; a bright daytime photo can conflict with the written event. Match atmosphere, time, background and direction of light."],
["Hair and wardrobe","If an image shows long red hair and a scarf, an opening must not describe short hair or no scarf. Track distinguishing marks, visible accessories and face."],
["Physical posture and props","A seated starting image should not instantly cut to the character walking across the room without a transition. Match the pose and hand positions; maintain physically plausible action and object placement."],
["Why alignment works","Character Images supply the visual starting frame; the opening supplies plot movement and dialogue. Their consistency improves video stability and perceived immersion."]
]},
{id:"advanced-voice",title:"12. Make Voice Fit the Character",short:"Design Voice 20 words, cloned audio, ElevenLabs V3, preview",chapter:"media",sections:[
["Fit matters more than a category","Match the character's written identity, age impression, language/accent, personality, emotion and natural rhythm. Mature, gentle or energetic personalities may benefit from different pacing or pitch, but audition the actual line instead of relying on stereotypes."],
["Design Voice: twenty words","The supplied Fizzz guide states voice design descriptions are limited to 20 words. Make each word count: language, gender impression, adult age range, timbre, pitch, pace, emotional impression and clean audio. Avoid empty character-type labels."],
["Short Design Voice example","Native English. Male, 30s. Low-pitched, raspy, calm, slow pacing. Warm and steady."],
["Preview text and harmful effects","Test with dialogue that resembles the character, not a wildly excited line for a calm person. Avoid effects like reverb, echo, phone or tape; these can reduce clarity."],
["Clone responsibly","Use clean, noise-free, authorized audio with one speaker, no overlapping voices, loud music, obvious reverberation or other noise."],
["ElevenLabs V3 Voice ID","The supplied guide describes pasting an ElevenLabs V3 Voice ID into the corresponding Fizzz field. You may preview a voice in the authorized library and use its ID if it fits; verify current platform availability."]
]},
{id:"testing",title:"13. Test and Optimize the Character",short:"Run trial chats; fix drift and media mismatch",chapter:"review",sections:[
["Trial chats are part of creation","Observe how the character performs after the form is complete. Test identity, personality consistency, speaking rhythm, memory of the relationship, user agency, and whether the first message motivates a response."],
["Core drift","If the character changes personality suddenly, clarify identity, starting relationship, goals and the few relevant behavioral boundaries. Avoid contradictory instructions."],
["Long replies or stealing agency","If replies monopolize conversation, specify shorter speaking style, pauses and less exposition. If it scripts the player, add: Do not decide or describe {{user}}'s actions, feelings or responses."],
["Overplayed intensity","If protectiveness becomes forced control, or cool distance becomes cruelty, clarify the line that the CHARACTER would not cross. Boundaries should not remove the trait; they should restore intended performance."],
["First-message problems","Add tangible setting, visible movement and an open invitation or hook. Preserve distinctive voice and meaningful dialogue."],
["Media issues","For unstable video, use a sharper single-subject image. For a mismatched voice, reselect, change the prompt or authorized Voice ID. Check text/images/video/voice as a coherent whole."],
["Experiment with diverging player actions","Test refusal, agreement, unexpected questions, requests for proof, relationship disagreements and scene changes. Long-term consistency is more meaningful than a good single canned response."]
]},
{id:"maintenance",title:"14. Post-Publish Maintenance",short:"Keep returning users' experience consistent",chapter:"review",sections:[
["Back up before publish","Save the exact Core Personality, Initial Message, Worldbook, image directions and voice details so edits are reversible."],
["Avoid radical overhauls","After users have started chatting, do not frequently replace the identity, opening, relationship setting or speaking style. If you need a completely different story and protagonist, create a NEW character."],
["Continuity across media","When changing Cover, Character Images, Opening Film or Voice, preserve the recognizable face, visual features, tone and story atmosphere."],
["Use meaningful feedback","Adjust for demonstrated problems such as drift, verbosity, appropriated player actions, early secret revelation or unstable video. Do not diminish the character only to chase clicks."],
["Refresh public warnings","If you introduce darker fiction, deaths, angst, emotional harm or horror, adjust public Bio content warnings accordingly."],
["Long-term aim","Returning players should still recognize the character, trust the consistency of the experience and feel invited back."]
]}
];
