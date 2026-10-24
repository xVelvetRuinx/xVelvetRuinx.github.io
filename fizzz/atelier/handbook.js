/* VelvetRuin's embedded Fizzz handbook and publishing checklist. */
(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const quick=window.VelvetRuinFizzzQuick||[],advanced=window.VelvetRuinFizzzAdvanced||[];
const entries=[...quick,...advanced];
const factList=[
 ["CORE PERSONALITY","25,000 chars max; ≤10,000 recommended"],["INITIAL MESSAGE","5,000 chars max"],
 ["WORLDBOOK","Off by default; up to 3 × 10,000 chars"],["TAGS","Ten total; Gender, POV, Rating required"],
 ["COVER IMAGE","3:4 recommended; does not drive video"],["CHARACTER IMAGES","Up to 3, recommended 9:16; drive chat video"],
 ["LOOP VIDEO","One per image; guide states 12 free AI generations/day"],["OPENING FILM","Set Voice first; guide states 10 free generations/day"],
 ["VOICE","Required in opening and chat video; Design Voice ≤20 words"],["BACKGROUND MUSIC","Optional"]
];
const snapshots={
 profile:{title:"Profile and public-content review",topics:["profile","cover","tags","public-review"],text:"Title* and Character Chat Name* introduce the character; Bio is PUBLIC and is not AI personality. Cover 3:4 is a poster, NOT video source. Select Gender*, POV* and Rating* plus at most seven extra tags. Review copyrights, visible age and dark-theme warnings."},
 core:{title:"AI-facing Core Personality",topics:["core","stable-core","speaking-style"],text:"Core Personality: 25k characters maximum, ≤10k recommended. Character Images do not tell the text model appearance. Connect background, psychology, observable behavior, {{user}} relationship, goals and speaking style. Complex characters are welcome when organized."},
 opening:{title:"The opening and the {{user}} name placeholder",topics:["initial","advanced-opening"],text:"Initial Message*: 5k characters maximum. Begin at the change, show visible actions and natural quoted dialogue, and give {{user}} a playable entry. Fizzz substitutes {{user}} with the player's display name. Leave their feelings and actions open."},
 world:{title:"Worldbook rules, triggers and secrets",topics:["world","advanced-world"],text:"Optional Worldbook is OFF by default; enable it manually. Three entries maximum, up to 10k characters each. Always Active is continuous; Keyword Trigger loads on named terms. Keyword activation is NOT proof of a story discovery."},
 media:{title:"Media requirements and production",topics:["cover","character-images","opening-film","voice-and-music","advanced-images","advanced-film","advanced-voice"],text:"Cover 3:4 can be a poster. Character Images: up to three 9:16 shots that drive Loop Video. Voice* must be set before Opening Film. Design Voice has a 20-word description limit. Music is optional; video quotas must be checked live."},
 migrate:{title:"Optimization without erasing the character",topics:["stable-core","advanced-world","testing","maintenance"],text:"Preserve the original identity, established dialogue, lore, secrets and opening. Trim repetitive or non-causal material with before/after explanations. Existing public characters should remain recognizable to returning players."},
 review:{title:"Trial-chat and publish readiness",topics:["public-review","testing","maintenance"],text:"Test personality stability, player agency, reply pacing, relationship progression, Worldbook discovery, visual clarity and voice. Confirm media licensing and public presentation, update warnings, and save a JSON backup."}
};
const checks=[
 ["profile","Title*, Chat Name*, Gender/POV/Rating and up to 10 accurate tags checked in Fizzz.","required"],
 ["bio","Public Bio reflects the actual experience; add warnings for permitted dark/intense material when applicable.","conditional"],
 ["copyright","Images/voice/video are authorized: no unauthorized real-person photos, copyrighted art, platform logos or watermarks.","required"],
 ["public","Public wording and images comply with review standards, including character age and visible age impression.","required"],
 ["cover","3:4 Cover preview: character face, crop and identifying details remain clear.","recommended"],
 ["images","Character Images: at most three; 9:16 recommended, one recognizable adult subject, clear face.","recommended"],
 ["core","Core Personality is internally coherent, written appearance is included, and 25k limit is respected.","required"],
 ["message","Initial Message* fits within 5k, offers spoken dialogue and leaves {{user}} choices open.","required"],
 ["worldbook","If Worldbook is used, it is enabled in Fizzz and all active/keyword triggers and discovery rules work.","conditional"],
 ["voice","Required Voice is selected, auditioned and consistent with age, accent and behavior.","required"],
 ["film","If using Opening Film, I selected Voice first and checked scene, posture, lighting, props and outfit match.","conditional"],
 ["test","Trial chats tested disagreement, consent, verbosity, progression, secrets, visual stability and voice.","recommended"],
 ["backup","I exported an editable copy before publishing or modifying a character with users.","recommended"]
];
function node(t,cls,text){const e=document.createElement(t);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function go(topic){
 const entry=entries.find(e=>e.id===topic);if(!entry)return;
 const search=$("#handbook-search");if(search&&search.value){search.value="";filter("");}
 window.FizzzAtelier?.chapter("handbook");
 const found=$("#guide-"+topic);
 if(found){found.hidden=false;found.open=true;found.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
}
function buildEntry(x){
 const card=node("details","handbook-entry");card.id="guide-"+x.id;card.dataset.topic=x.id;if(x.id==="quick-start")card.open=true;
 const summary=node("summary","handbook-entry-heading");
 summary.append(node("b","",x.title),node("span","",x.short));
 card.append(summary);
 const content=node("div","handbook-entry-content");
 for(const [name,description] of x.sections){
   const section=node("section","handbook-paragraph");
   section.append(node("h4","",name));
   for(const para of description.split("\n")){
     if(para.trim())section.append(node("p","",para));
   }
   content.append(section);
 }
 const jump=node("button","quiet-button","✦ Edit the related character fields →");jump.type="button";
 jump.addEventListener("click",()=>window.FizzzAtelier?.chapter(x.chapter));
 const cite=node("a","handbook-source-link","Official Fizzz creator guide ↗");
 cite.href="https://fizzz.ai/creator-guidelines/";cite.target="_blank";cite.rel="noopener noreferrer";
 const footer=node("div","handbook-entry-footer");footer.append(jump,cite);
 content.append(footer);card.append(content);return card;
}
function filter(q){
 const search=q.trim().toLowerCase();let shown=0;
 entries.forEach(x=>{
   const item=$("#guide-"+x.id);if(!item)return;
   const haystack=[x.title,x.short,...x.sections.flat()].join(" ").toLowerCase();
   const match=!search||haystack.includes(search);
   item.hidden=!match;
   if(match)shown++;
   if(search&&match)item.open=true;
 });
 $$(".handbook-part").forEach(part=>{
   const all=$$(".handbook-entry",part);
   part.hidden=!all.some(x=>!x.hidden);
 });
 const fallback=$("#handbook-empty");
 if(fallback){fallback.hidden=shown>0;fallback.textContent="No entries match “"+q+"”. Try a term such as voice, first scene, tags, age, Worldbook, 20 words or video.";}
}
function showContent(){
 const outer=$("#handbook-sections"),index=$("#handbook-index"),facts=$("#handbook-facts");
 if(!outer||!index||!facts)return;
 for(const [key,value] of factList){
   const card=node("article","handbook-fact");
   card.append(node("b","",key),node("span","",value));facts.append(card);
 }
 for(const [id,title,items] of [["quick","Part 1 · Quick Start with Fizzz Characters",quick],["advanced","Part 2 · Advanced Character Optimization",advanced]]){
   const part=node("section","handbook-part");part.dataset.group=id;part.append(node("h3","",title));
   const group=node("div","handbook-index-group");group.append(node("strong","",id==="quick"?"QUICK START":"ADVANCED OPTIMIZATION"));
   for(const x of items){
     part.append(buildEntry(x));
     const btn=node("button","handbook-index-button",x.title);btn.type="button";btn.addEventListener("click",()=>go(x.id));
     group.append(btn);
   }
   outer.append(part);index.append(group);
 }
 const none=node("p","handbook-empty");none.id="handbook-empty";none.hidden=true;outer.append(none);
 $("#handbook-search")?.addEventListener("input",e=>filter(e.target.value));
 $("#handbook-clear")?.addEventListener("click",()=>{const input=$("#handbook-search");input.value="";filter("");input.focus();});
 for(const [chapter,info] of Object.entries(snapshots)){
   const mount=$('.official-inline[data-official="'+chapter+'"]');
   if(!mount)continue;
   const details=node("details","official-inline-card"),heading=node("summary","", "✧ Fizzz handbook · "+info.title);details.open=true;
   const body=node("div","official-inline-body");body.append(node("p","",info.text));
   const buttons=node("div","official-inline-links");
   for(const topic of info.topics){
     const entry=entries.find(e=>e.id===topic);if(!entry)continue;
     const button=node("button","official-topic-button",entry.title+" ↗");button.type="button";button.addEventListener("click",()=>go(topic));
     buttons.append(button);
   }
   body.append(buttons);details.append(heading,body);mount.append(details);
 }
 $$("[data-handbook-topic]").forEach(button=>button.addEventListener("click",()=>go(button.dataset.handbookTopic)));
 checklist();
}
function checklist(){
 const wrap=$("#publication-checks"),message=$("#publication-progress");if(!wrap||!message)return;
 const storage="velvetruin.fizzz.publication-checks.v1";
 let state={};try{state=JSON.parse(localStorage.getItem(storage)||"{}")||{}}catch{}
 for(const [id,description,category] of checks){
   const row=node("label","pubcheck-row"),box=node("input");
   box.type="checkbox";box.dataset.check=id;box.checked=state[id]===true;
   row.append(box,node("span","",description),node("small","",category==="required"?"Required / review":category==="conditional"?"If applicable":"Recommended"));
   wrap.append(row);
   box.addEventListener("change",()=>{state[id]=box.checked;try{localStorage.setItem(storage,JSON.stringify(state))}catch{}status()});
 }
 function status(){
   const mandatory=checks.filter(c=>c[2]==="required");
   const count=mandatory.filter(c=>state[c[0]]===true).length;
   message.textContent=count+"/"+mandatory.length+" required/review items self-confirmed. This checklist does not inspect uploaded images or replace platform review.";
   message.classList.toggle("complete",count===mandatory.length);
 }
 status();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",showContent,{once:true});else showContent();
})();