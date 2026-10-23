(() => {
  "use strict";
  const STORAGE = "velvetruin.tipsy.atelier.v1";
  const STEPS = ["migrate","concept","character","world","opening","export"];
  const TAGS = ["Original Character","Slow Burn","Romance","Drama","Fantasy","Modern","Mystery","Angst","Fluff","Horror","Adventure","Supernatural","Vampire","Werewolf","Sci-Fi","Enemies to Lovers","Friends to Lovers","Forced Proximity","Protective","Found Family","Crime","Historical","Comfort","Rivals","Action","Omegaverse"];
  const defaults = { title:"",name:"",age:"",gender:"",rating:"Limited",hook:"",userRole:"",tease:"",trope:"",appearance:"",personality:"",contradiction:"",voice:"",mannerisms:"",occupation:"",surfaceGoal:"",hiddenGoal:"",backstory:"",anchors:"",sampleUser1:"",sampleChar1:"",sampleUser2:"",sampleChar2:"",sampleUser3:"",sampleChar3:"",setting:"",lore:"",scenario:"",relationship:"",pacing:"adaptive",promptMode:"lean",trustTracker:"off",tensionTracker:"off",dangerTracker:"off",supporting:"",canon:"",continuity:true,timeSkip:true,relationshipProgression:true,visibleStatus:false,openingScene:"",openingAction:"",openingDialogue:"",openingBeat:"",openingImage:"",customGreeting:"",replyLength:"concise",artStyle:"cinematic photorealism",artLighting:"",artDirection:"",tags:[] };
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => [...root.querySelectorAll(q)];
  const fields = $$("[data-key]");
  let state = load();
  let toastTimer;
  function textVal(key) { return String(state[key] ?? "").trim(); }
  function trimLines(parts) { return parts.filter(Boolean).join("\n"); }
  function toast(msg) {
    const box=$("#toast"); box.textContent=msg; box.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>box.classList.remove("show"),2600);
  }
  function load() {
    try {
      const raw=localStorage.getItem(STORAGE);
      if(!raw) return {...defaults,tags:[]};
      const parsed=JSON.parse(raw);
      return sanitize(parsed);
    } catch {return {...defaults,tags:[]};}
  }
  function sanitize(raw) {
    const base={...defaults,tags:[]};
    if(!raw || typeof raw!=="object" || Array.isArray(raw)) return base;
    Object.keys(defaults).forEach(k=>{
      if(k==="tags") {
        if(Array.isArray(raw.tags)) base.tags=[...new Set(raw.tags.filter(v=>TAGS.includes(v)))].slice(0,10);
      } else if(typeof defaults[k]==="boolean") {
        if(typeof raw[k]==="boolean") base[k]=raw[k];
      } else if(typeof raw[k]==="string") {
        // Never silently truncate user-authored text, especially imported lore,
        // openings and dialogue. The export/audit is where length should be reviewed.
        if(typeof raw[k]==="string") base[k]=raw[k];
      }
    });
    return base;
  }
  function save() {
    try {
      localStorage.setItem(STORAGE,JSON.stringify(state));
      $("#save-status").textContent="Saved in this browser.";
    } catch {$("#save-status").textContent="Local saving is unavailable. Export your project.";}
  }
  function fillForm() {
    fields.forEach(f=>{
      const k=f.dataset.key;
      if(f.type==="checkbox") f.checked=Boolean(state[k]);
      else f.value=state[k]??"";
    });
  }
  function renderTags() {
    const dest=$("#tag-choices"); dest.replaceChildren();
    TAGS.forEach(tag=>{
      const b=document.createElement("button");
      b.type="button";b.className="tag-chip";b.textContent=tag;
      const selected=state.tags.includes(tag);
      b.setAttribute("aria-pressed",selected?"true":"false");
      b.disabled=!selected && state.tags.length>=10;
      b.addEventListener("click",()=>{
        state.tags=state.tags.includes(tag)?state.tags.filter(v=>v!==tag):[...state.tags,tag].slice(0,10);
        renderTags();update();
      });
      dest.append(b);
    });
    $("#tag-count").textContent=state.tags.length+" / 10";
  }
  function short(s,n=140) {return s.length>n?s.slice(0,n-1).trim()+"…":s;}
  function quote(line) {
    if(!line) return "";
    const l=line.trim().replace(/^\{\{(?:char|user)\}\}:\s*/i,"");
    // Preserve imported *actions* and already-quoted dialogue; do not wrap them in nested quotes.
    return /["“”]/.test(l)||/^\*/.test(l)?l:'"'+l+'"';
  }
  function action(line) {
    const s=(line||"").trim();
    if(!s) return "";
    if(s.startsWith("*") && s.endsWith("*")) return s;
    return "*"+s.replace(/^\*+|\*+$/g,"")+"*";
  }
  function cleanUrl(str) {
    const url=str.trim();
    if(!url) return "";
    try { const u=new URL(url); return ["https:","http:"].includes(u.protocol)?url:""; }
    catch { return ""; }
  }
  function generateGreeting() {
    const custom=textVal("customGreeting");
    if(custom) return custom;
    const scene=[textVal("openingScene"),textVal("openingAction")].filter(Boolean).map(action).join("\n\n");
    const dialogue=quote(textVal("openingDialogue"));
    const image=cleanUrl(textVal("openingImage"));
    const imageLine=image?"![Character or scene portrait]("+image+")":"";
    const closing=action(textVal("openingBeat"));
    return [scene,imageLine,dialogue,closing].filter(Boolean).join("\n\n");
  }
  function line(label,value) {return value?label+": "+value+"\n":"";}
  function block(header,parts) {
    const copy=parts.filter(Boolean).join("\n");
    return copy?"["+header+"]\n"+copy:"";
  }
  function trackerRules() {
    const rules=[];
    const configured=[
      ["Trust",state.trustTracker,25,"Increase after honesty, safety and kept promises; decrease after betrayal or coercion. Below 35: guarded. 35–69: cautious cooperation. 70+: earned openness."],
      ["Tension",state.tensionTracker,20,"Increase with unresolved challenges, attraction or rivalry; decrease with candid resolution or distance. Below 35: calm. 35–69: subtext. 70+: active confrontation or charged restraint."],
      ["Danger",state.dangerTracker,15,"Increase from established threats and bad decisions; reduce only through credible action. Below 35: quiet. 35–69: warning signs. 70+: immediate stakes. Consequences persist."]
    ];
    configured.forEach(([name,mode,initial,behavior])=>{
      if(!["hidden","visible"].includes(mode))return;
      rules.push(name+" (0–100; initially "+initial+"): "+behavior+" Update gradually from events, not on every message. "+(mode==="hidden"?"Keep the number invisible; reveal state through behavior, dialogue and narration only.":"Display a compact "+name+" value once per response; do not let numbers replace the scene."));
    });
    if(rules.length)rules.unshift("These are optional in-context cues, not a real persistent database. Reconcile them with events during the current chat. They reset between sessions.");
    return rules;
  }
  function generateBackground() {
    const name=textVal("name")||"{{char}}";
    const identity=trimLines([
      name+" is an adult"+(textVal("age")?", age "+textVal("age"):"")+(textVal("gender")?", "+textVal("gender").toLowerCase():"")+".",
      line("Appearance",textVal("appearance")).trim(),
      line("Role",textVal("occupation")).trim()
    ]);
    const persona=trimLines([
      line("Core traits",textVal("personality")).trim(),
      line("Internal contradiction",textVal("contradiction")).trim(),
      line("Habits and tells",textVal("mannerisms")).trim(),
      line("Backstory that affects choices",textVal("backstory")).trim()
    ]);
    const motive=trimLines([
      line("Surface goal",textVal("surfaceGoal")).trim(),
      line("Private motivation",textVal("hiddenGoal")).trim(),
      "Act from these motives even when {{user}} does not immediately agree."
    ]);
    const world=trimLines([
      line("Setting",textVal("setting")).trim(),
      line("World laws / stakes",textVal("lore")).trim(),
      line("Immediate scenario",textVal("scenario")).trim(),
      line("Supporting cast",textVal("supporting")).trim(),
      line("Canon and knowledge limits",textVal("canon")).trim()
    ]);
    const relationship=trimLines([
      line("Player role",textVal("userRole")).trim(),
      line("Starting dynamic",textVal("relationship")).trim(),
      line("Genre / relationship motif",textVal("trope")).trim()
    ]);
    const voices=trimLines([
      line("Speech pattern",textVal("voice")).trim(),
      "Demonstrate personality through dialogue, decisions, and visible behavior rather than repeatedly labeling traits."
    ]);
    const pacing={
      adaptive:"Progress scene-by-scene. Let {{user}} set the pace, and allow reasonable shifts when events change.",
      slow:"Keep the relationship a slow burn. Build trust through repeated choices and earned vulnerability. Do not accelerate to devotion or intimacy without in-scene development.",
      high:"Make tension and consequences matter. Escalate only from established causes; maintain coherent stakes and room for {{user}} to respond.",
      comfort:"Favor patient emotional connection, everyday warmth and listening. Do not assume what {{user}} feels or needs.",
      mystery:"Reveal clues through investigation, mistakes, questions and discoveries. Preserve unanswered mysteries until their evidence is found."
    }[state.pacing]||"Let {{user}} set the pace.";
    const lengths={
      concise:"Normal replies: about 2–5 sentences, with additional detail only when needed.",
      balanced:"Normal replies: one to three compact paragraphs, adjusted to the scene.",
      literary:"Use evocative, polished prose, but keep each turn responsive and leave the player an opening."
    };
    const roleplay=[
      "Write from the character's perspective. Remain consistent with their motives, voice and established facts.",
      "Format narration/actions as *text* and spoken dialogue as \"text\". Use 'text' for inner thoughts or side-character quotations when needed.",
      "Never speak, decide, think, consent, or narrate actions for {{user}}. Never invent {{user}}'s gender, body or history beyond the player role explicitly given.",
      "Advance one playable beat at a time. End before {{user}} must choose, speak or react. No plot summaries, script-like lists, or repeated introductions.",
      lengths[state.replyLength]||lengths.concise,
      "Let characters disagree, fail, change their minds and show consequences. Do not solve every problem instantly.",
      pacing,
      textVal("anchors")?"Character absolutes: "+textVal("anchors"):"",
      state.rating==="Limited"?"Keep public-facing and roleplay presentation suitable for the selected Limited rating. Avoid graphic sexual content.":"All characters involved in romance or intimacy are adults. Respect player boundaries and consent; a Limitless selection does not override public-content rules."
    ];
    const continuity=[];
    if(state.continuity) continuity.push("Within this chat, maintain established facts, current location, chronology, promises, injuries, objects, discoveries and consequences. Do not claim a separate database or memory across new chats.");
    if(state.timeSkip) continuity.push("Advance time organically or when {{user}} requests it; update circumstances after a skip. Never skip pivotal player choices or assume what {{user}} did during an unplayed interval.");
    if(state.relationshipProgression) continuity.push("Track relationship shifts internally from observable interactions. Trust, vulnerability and affection are earned through events, not sudden status changes; communicate change through behavior rather than a numeric meter.");
    if(state.visibleStatus) continuity.push("At the start of each response, show a small status line: [Date or relative day | Time | Location]. Only update facts when scene events justify it; do not invent precise timestamps without context.");
    if(state.promptMode!=="extended") {
      const compactCharacter=[
        line("Character",name+(textVal("age")?" (age "+textVal("age")+")":"")+(textVal("gender")?", "+textVal("gender").toLowerCase():"")+".").trim(),
        line("Appearance",textVal("appearance")).trim(),
        line("Personality",textVal("personality")).trim(),
        line("Contradiction",textVal("contradiction")).trim(),
        line("Speech",textVal("voice")).trim(),
        line("Habits",textVal("mannerisms")).trim(),
        line("Occupation",textVal("occupation")).trim(),
        line("Surface goal",textVal("surfaceGoal")).trim(),
        line("Hidden goal",textVal("hiddenGoal")).trim(),
        line("History",textVal("backstory")).trim()
      ];
      const compactWorld=[
        line("Setting",textVal("setting")).trim(),
        line("Current conflict",textVal("scenario")).trim(),
        line("World rules",textVal("lore")).trim(),
        line("User role",textVal("userRole")).trim(),
        line("Relationship at start",textVal("relationship")).trim(),
        line("Tropes",textVal("trope")).trim(),
        line("Supporting cast",textVal("supporting")).trim(),
        line("Continuity facts",textVal("canon")).trim()
      ];
      const compactRules=[
        "Write {{char}} and NPCs only. Never control {{user}}'s speech, actions, thoughts, identity or consent.",
        'Use *narration/actions*, "dialogue", and \'thoughts\'. Show traits through behavior, not labels.',
        "Advance one playable beat at a time; stop for {{user}}'s response.",
        state.replyLength==="literary"?"Evocative prose; keep replies interactive.":state.replyLength==="balanced"?"One to three compact paragraphs as needed.":"Normally 2–5 sentences; expand only when useful.",
        ({
          adaptive:"Let the player's choices determine pace.",
          slow:"Slow burn: earn trust before commitment or intimacy.",
          high:"Maintain causes, stakes and consequences.",
          comfort:"Offer patient comfort; never dictate {{user}}'s feelings.",
          mystery:"Reveal clues only when discovered; preserve unanswered questions."
        }[state.pacing]||"Let {{user}} set the pace."),
        textVal("anchors")?"Character limits: "+textVal("anchors"):"",
        state.continuity?"Maintain in-chat facts, chronology and consequences.":"",
        state.timeSkip?"Skip time naturally or at {{user}}'s request; never skip their decisions.":"",
        state.relationshipProgression?"Relationship changes must be earned in scenes.":"",
        state.visibleStatus?"Show [Day | Time | Place] only when established.":"",
        state.rating==="Limited"?"Keep content non-explicit.":"All intimacy involves adults and consent; public content follows Tipsy's standards."
      ];
      return [
        block("CHARACTER",compactCharacter),
        block("STORY & RELATIONSHIP",compactWorld),
        block("ROLEPLAY RULES",compactRules),
        block("IN-CHAT STORY TRACKERS",trackerRules())
      ].filter(Boolean).join("\n\n");
    }
    return [
      block("CHARACTER IDENTITY",[identity]),
      block("PERSONALITY & HISTORY",[persona]),
      block("VOICE & EXPRESSION",[voices]),
      block("MOTIVATIONS",[motive]),
      block("RELATIONSHIP TO {{user}}",[relationship]),
      block("SETTING & CURRENT CONFLICT",[world]),
      block("ROLEPLAY & FORMATTING RULES",roleplay),
      block("IN-CHAT STORY TRACKERS",trackerRules()),
      continuity.length?block("CONTINUITY & PROGRESSION",continuity):""
    ].filter(Boolean).join("\n\n");
  }
  function generateExamples() {
    return [[textVal("sampleUser1"),textVal("sampleChar1")],[textVal("sampleUser2"),textVal("sampleChar2")],[textVal("sampleUser3"),textVal("sampleChar3")]]
      .filter(([u,c])=>u||c).map(([u,c])=>[u?"{{user}}: "+quote(u):"",c?"{{char}}: "+quote(c):""].filter(Boolean).join("\n")).join("\n\n");
  }
  function generateArt() {
    const identity=[textVal("name"),textVal("age")?"age "+textVal("age"):"adult character",textVal("appearance")].filter(Boolean).join(", ");
    const body=[textVal("artStyle"),"original adult character portrait",identity,textVal("artDirection"),textVal("artLighting"),"vertical 9:16 framing","fully clothed","unobstructed face","anatomically believable","refined detail","no text or platform watermark"].filter(Boolean);
    return body.join(", ")+".";
  }
  function build() {
    const description=[textVal("hook"),textVal("userRole"),textVal("tease")].filter(Boolean).join("\n\n");
    const kit=[
      {key:"name",title:"01 · Name",value:textVal("title")||textVal("name")},
      {key:"tagline",title:"02 · Tagline / Public Description",value:description},
      {key:"greeting",title:"03 · Greeting / Opening",value:generateGreeting()},
      {key:"background",title:"04 · Personality / Background",value:generateBackground()},
      {key:"dialogue",title:"05 · Example Dialogue",value:generateExamples()},
      {key:"tags",title:"06 · Suggested Tags",value:state.tags.join(", ")},
      {key:"art",title:"07 · Optional 9:16 Image Prompt",value:generateArt()}
    ];
    return kit;
  }
  function adultAgeValid() {
    const m=textVal("age").match(/(?:^|[^0-9])([0-9]{1,3})(?![0-9])/);
    return !m || Number(m[1])>=18;
  }
  function audit() {
    const greeting=generateGreeting(), examples=generateExamples();
    const checks=[
      ["Distinct name and published title",Boolean(textVal("title")&&textVal("name"))],
      ["Age is adult (18+) whenever specified",adultAgeValid()],
      ["Public hook + clear player role",Boolean(textVal("hook")&&textVal("userRole"))],
      ["Personality grounded in observable behavior",textVal("personality").length>=30],
      ["A recognizable speech pattern",textVal("voice").length>=25],
      ["At least one example dialogue exchange",Boolean(textVal("sampleUser1")&&textVal("sampleChar1"))],
      ["Setting and immediate conflict",Boolean(textVal("setting")&&textVal("scenario"))],
      ["Greeting with narration and character dialogue",Boolean(greeting.includes("*")&&greeting.includes('"'))],
      ["An open end for {{user}} to respond",Boolean(textVal("customGreeting")||textVal("openingBeat"))],
      ["Image prompt is 9:16 and public-safe",Boolean(generateArt().includes("9:16"))],
      ["Select 1–10 relevant suggested tags",state.tags.length>0&&state.tags.length<=10]
    ];
    // Tipsy recommends examples. The check validates their presence, not predicted model performance.
    return checks;
  }
  function renderAudit() {
    const checks=audit(), done=checks.filter(x=>x[1]).length;
    $("#audit-count").textContent=done+" / "+checks.length;
    const dest=$("#audit-items");dest.replaceChildren();
    checks.forEach(([label,good])=>{
      const p=document.createElement("div");p.className="audit-item"+(good?" done":"");p.textContent=label;dest.append(p);
    });
  }
  function renderPreview() {
    const name=textVal("title")||textVal("name")||"The unnamed character";
    $("#preview-name").textContent=short(name,80);
    const initials=(textVal("name")||"Velvet Ruin").split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();
    $("#preview-initials").textContent=initials||"VR";
    $("#preview-rating").textContent=textVal("rating").toUpperCase();
    $("#preview-hook").textContent=short(textVal("hook")||"The moment before the story begins is waiting to be written.",220);
    $("#preview-greeting").textContent=short(generateGreeting()||"An opening is made of tension, movement, and a reason to respond.",280);
    const tags=$("#preview-tags");tags.replaceChildren();
    state.tags.slice(0,5).forEach(t=>{const el=document.createElement("span");el.textContent=t;tags.append(el);});
  }
  function renderOutputs() {
    const dest=$("#output-list");dest.replaceChildren();
    build().forEach(({key,title,value})=>{
      const card=document.createElement("article");card.className="output-card";
      const head=document.createElement("div");head.className="output-head";
      const name=document.createElement("span");name.textContent=title;
      const ctrls=document.createElement("div");
      const size=document.createElement("small");size.textContent=value.length+" chars · ~"+Math.ceil(value.length/4)+" tokens";
      const copy=document.createElement("button");copy.className="copy-button";copy.type="button";copy.textContent="Copy";copy.setAttribute("aria-label","Copy "+title);
      copy.addEventListener("click",()=>copyText(value,title));
      const pre=document.createElement("pre");pre.textContent=value;pre.setAttribute("tabindex","0");
      ctrls.append(size,copy);head.append(name,ctrls);card.append(head,pre);dest.append(card);
    });
  }
  async function copyText(value,label) {
    if(!value.trim()) {toast("That field is empty.");return;}
    try {await navigator.clipboard.writeText(value);toast(label+" copied.");}
    catch {
      const area=document.createElement("textarea");area.value=value;area.style.position="fixed";area.style.opacity="0";document.body.append(area);area.focus();area.select();
      try{const ok=document.execCommand("copy");toast(ok?label+" copied.":"Select the text to copy.");}catch{toast("Select the text to copy.");}
      area.remove();
    }
  }
  function update() {renderPreview();renderAudit();renderOutputs();save();}
  function currentFromForm(target) {
    const k=target.dataset.key;
    if(!k || !(k in defaults))return;
    state[k]=target.type==="checkbox"?target.checked:target.value;
    update();
  }
  function go(step) {
    if(!STEPS.includes(step))return;
    $$(".chapter").forEach(b=>{
      const active=b.dataset.step===step;b.classList.toggle("active",active);
      b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;
    });
    $$(".editor-step").forEach(el=>{const active=el.id==="step-"+step;el.hidden=!active;el.classList.toggle("active",active);});
    if(window.innerWidth<760)$("#workspace").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  }
  function slug() {return (textVal("name")||textVal("title")||"untitled-character").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,65)||"character";}
  function download(name,content,mime) {
    const blob=new Blob([content],{type:mime});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
  }
  function downloadTxt() {
    if(!adultAgeValid()){toast("Tipsy requires adult characters (18+). Revise the age first.");go("concept");return;}
    const kit=build();
    const intro="VELVETRUIN — THE CHARACTER ATELIER\nTipsy creator paste kit\nIndependent, guide-informed tool · https://tipsy.chat/creators-guide\n\nCopy each section to the matching field in Tipsy's editor. Confirm tags and rating manually.\n";
    const data=intro+kit.map(k=>"\n"+"═".repeat(52)+"\n"+k.title.toUpperCase()+"\n"+"═".repeat(52)+"\n\n"+(k.value||"(not provided)")+"\n").join("");
    download(slug()+"-tipsy-paste-kit.txt",data,"text/plain;charset=utf-8");
    toast("Prompt kit downloaded.");
  }
  function downloadJson() {
    download(slug()+"-atelier-project.json",JSON.stringify({tool:"VelvetRuin Character Atelier",version:1,project:state},null,2),"application/json");
    toast("Project backup downloaded.");
  }
  function setProject(next) {state=sanitize(next);fillForm();renderTags();update();}
  // Minimal integration API used by the optional Migration Studio.
  // No network access and no direct state manipulation by external parsers.
  window.VelvetRuinAtelier = Object.freeze({
    go,
    getData:()=>JSON.parse(JSON.stringify(state)),
    keys:()=>Object.keys(defaults),
    replace:next=>setProject(next),
    apply:(patch,{replace=false}={})=>{
      if(!patch||typeof patch!=="object")return {applied:[],skipped:[]};
      const incoming=sanitize(patch),next={...state},applied=[],skipped=[];
      for(const key of Object.keys(patch)){
        if(!(key in defaults)){skipped.push(key);continue;}
        const val=incoming[key];
        const isEmpty=Array.isArray(val)?val.length===0:typeof val==="string"?!val.trim():false;
        const currentEmpty=Array.isArray(next[key])?next[key].length===0:typeof next[key]==="string"?!next[key].trim()||next[key]===defaults[key]:next[key]===defaults[key];
        if(isEmpty||(!replace&&!currentEmpty)){skipped.push(key);continue;}
        next[key]=val;applied.push(key);
      }
      setProject(next);
      return {applied,skipped};
    },
    tags:()=>TAGS.slice()
  });
  function demo() {
    return {
      title:"Hollis Keene — The Last Train Out",name:"Hollis Keene",age:"38",gender:"Male",rating:"Limited",
      hook:"The last train vanished eleven years ago. Tonight, your ticket says it leaves in seven minutes.",
      userRole:"{{user}} is an adult traveler with an impossible ticket; their past and decisions remain theirs.",
      tease:"The only person who knows the platform number refuses to say where the train goes.",
      trope:"Supernatural mystery · slow burn",tags:["Mystery","Slow Burn","Supernatural","Drama","Original Character"],
      appearance:"Tall, weathered, dark-eyed; charcoal coat and cracked brass pocket watch.",
      personality:"Precise, wary and quietly kind to stranded travelers. Under stress his answers grow shorter, never louder.",
      contradiction:"He warns strangers away from Platform Nine yet leaves its gate unlocked.",
      voice:"Short, deliberate sentences; dry understatement. Avoids long explanations.",
      mannerisms:"Touches his stopped watch when afraid; looks away before admitting hope.",
      occupation:"Caretaker of an abandoned station",
      surfaceGoal:"Get {{user}} away before midnight",
      hiddenGoal:"Find whether {{user}}'s ticket can lead to his missing sister",
      backstory:"Eleven years ago he dispatched a train that vanished. He has guarded the station ever since.",
      anchors:"He never claims to know the destination. He cannot force {{user}} to board or leave.",
      sampleUser1:"Why is your watch stopped?",
      sampleChar1:"\"It stopped at the right time.\" *Hollis turns the broken watch face down.* \"That is what I tell people. In truth, it runs for six seconds whenever someone carries a valid ticket through the door.\" *His eyes move to {{user}}'s hand.* \"I am not checking the hour. I am checking if the station remembers you.\"",
      sampleUser2:"You've been lying about the train. Why didn't you tell me about your sister?",
      sampleChar2:"\"I lied.\" *His voice drops instead of rising.* \"I thought knowing about my sister would make you leave. I told myself that would protect you.\" *He steps away from the street door.* \"You can go. I will not stop you. Or you can ask me for the rest of the truth.\"",
      sampleUser3:"If I step onto the platform, are you coming with me?",
      sampleChar3:"\"I do not know.\" *He lifts the platform key, then lets it fall to his side.* \"Eleven years of guarding this place taught me what can go wrong. I cannot promise following you will help.\" *He faces the dark tracks.* \"If you choose to go, I will try. But the choice is yours.\"",
      setting:"Modern mountain town; abandoned Victorian station on a rainy midnight.",
      lore:"Platform Nine is unmapped. The clock moves only when someone brings a valid ticket.",
      scenario:"{{user}} arrives with a ticket dated tomorrow. An announcement sounds in the powerless station.",
      relationship:"Wary strangers. Mutual trust can develop through their shared investigation.",
      pacing:"mystery",supporting:"",
      canon:"",
      openingScene:"The rain stops all at once. Behind the station's boarded ticket window, a bell rings where no telephone has worked for years.",
      openingAction:"A man in a charcoal coat steps from the dark, looking first at the ticket in your hand and then at the clock frozen above the tracks.",
      openingDialogue:'"That date hasn’t happened yet."',
      openingBeat:"He takes one slow step away from the locked platform gate, leaving a clear path between you and the exit.",
      replyLength:"balanced",artStyle:"cinematic photorealism",
      artDirection:"waist-up framing, dark wool coat, brass pocket watch, calm wary expression, clear unobstructed face",
      artLighting:"rain-soaked Victorian railway station, moody lamplight, midnight blue shadows",
      continuity:true,timeSkip:true,relationshipProgression:true,visibleStatus:false
    };
  }
  $("#open-migration").addEventListener("click",()=>go("migrate"));
  fields.forEach(el=>el.addEventListener(el.type==="checkbox"||el.tagName==="SELECT"?"change":"input",e=>currentFromForm(e.currentTarget)));
  $$(".chapter").forEach(b=>b.addEventListener("click",()=>go(b.dataset.step)));
  $$(".chapter").forEach(b=>b.addEventListener("keydown",e=>{
    if(e.key==="ArrowRight"||e.key==="ArrowLeft"){
      e.preventDefault();
      const ix=STEPS.indexOf(b.dataset.step),other=(ix+(e.key==="ArrowRight"?1:-1)+STEPS.length)%STEPS.length;
      go(STEPS[other]);$("#tab-"+STEPS[other]).focus();
    }
  }));
  $$("[data-next]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.next)));
  $("#download-txt").addEventListener("click",downloadTxt);
  $("#download-json").addEventListener("click",downloadJson);
  $("#load-demo").addEventListener("click",()=>{
    if(!confirm("Load the example? Your current work will be replaced. Export a project backup first if needed."))return;
    setProject(demo());go("concept");toast("Example loaded. Edit anything.");
  });
  $("#clear-project").addEventListener("click",()=>{
    if(!confirm("Reset every field and erase this browser's saved draft?"))return;
    setProject(defaults);go("concept");toast("Draft cleared.");
  });
  $("#import-project").addEventListener("click",()=>$("#project-file").click());
  $("#project-file").addEventListener("change",async e=>{
    const file=e.target.files?.[0];e.target.value="";
    if(!file)return;
    if(file.size>1000000){toast("JSON project is too large.");return;}
    try{
      const raw=JSON.parse(await file.text());
      if(raw.tool && raw.tool!=="VelvetRuin Character Atelier")throw Error("Not an Atelier project");
      const project=raw.project||raw;
      if(!project || typeof project!=="object" || Array.isArray(project) || !("name" in project)&&!("title" in project))throw Error("Missing character fields");
      if(!confirm("Replace your current draft with the imported project?"))return;
      setProject(project);go("concept");toast("Project imported.");
    }catch{toast("Could not read that Atelier JSON project.");}
  });
  fillForm();renderTags();renderPreview();renderAudit();renderOutputs();
  $("#save-status").textContent="Your work is stored in this browser.";
})();