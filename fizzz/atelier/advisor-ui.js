/* VelvetRuin · human-approved change suggestions for the active Fizzz draft. */
(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const element=(tag,className,text)=>{
 const e=document.createElement(tag);if(className)e.className=className;
 if(text!==undefined)e.textContent=text;return e;
};
const chapterFor={
 title:"profile",name:"profile",bio:"profile",warning:"profile",
 coreRaw:"core",traits:"core",voice:"core",boundaries:"core",
 relationship:"core",dynamic:"spark",concept:"spark",motivation:"core",
 backstory:"core",appearance:"core",role:"spark",contradiction:"core",
 initialRaw:"opening",openingScene:"opening",openingLine:"opening",
 world1Body:"world",world1Keywords:"world",world2Body:"world",world2Keywords:"world",
 world3Body:"world",world3Keywords:"world",
 voiceDirection:"media",imageDirection:"media",coverDirection:"media"
};
let history=[],current=[],lastAnalysis="";
function A(){return window.FizzzAtelier;}
function Advisor(){return window.VelvetRuinFizzzAdvisor;}
function inputText(s,kind){
 const report=$("#improvement-status");
 report.textContent=s;report.dataset.state=kind||"info";
}
function showText(raw,kind){
 const text=String(raw??"");
 const full=element("details","suggestion-full");
 if(text.length<=300){
  const pre=element("pre","improvement-preview",text||"(empty field)");
  return pre;
 }
 const preview=element("pre","improvement-preview",text.slice(0,260)+"\n… ("+text.length+" characters total)");
 const summary=element("summary","","Show complete "+kind+" · "+text.length.toLocaleString()+" chars");
 const pre=element("pre","improvement-fulltext",text);
 full.append(summary,pre);
 const wrap=element("div","improvement-preview-wrap");wrap.append(preview,full);return wrap;
}
function focusField(field){
 const chapter=chapterFor[field]||"core";
 A().chapter(chapter);
 const input=document.querySelector("#edit-"+field);
 if(input){
  input.focus();input.scrollIntoView({behavior:"smooth",block:"center"});
 }else A().notify("Open the related chapter to edit this recommendation.");
}
function card(rec,context="review"){
 const item=element("article","suggestion-card "+rec.kind+" "+rec.priority);
 item.dataset.recommendation=rec.id;
 const top=element("div","suggestion-top"),type=element("span","suggestion-type",rec.category||"Story craft"),
  impact=element("span","suggestion-impact",rec.priority==="high"?"High-priority checkpoint":rec.priority==="medium"?"Worth reviewing":"Optional polish");
 top.append(type,impact);
 const header=element("h4","",rec.title);
 const reason=element("div","suggestion-reason"),why=element("p","","**");
 why.textContent=rec.why;reason.append(why);
 const benefit=element("p","suggestion-benefit");
 benefit.append(element("b","","WHY IT COULD HELP"),element("span","",rec.benefit));
 const actions=element("div","suggestion-buttons");
 item.append(top,header,reason);
 if(rec.kind==="edit"){
  const compare=element("div","suggestion-compare");
  const before=element("section","suggestion-before"),after=element("section","suggestion-after");
  before.append(element("b","","YOUR CURRENT "+rec.field.toUpperCase()),showText(rec.before,"original"));
  after.append(element("b","","SUGGESTED VERSION · "+rec.field.toUpperCase()),showText(rec.after,"suggestion"));
  compare.append(before,after);item.append(compare);
  const saved=(rec.before.length-rec.after.length);
  if(saved>0)item.append(element("p","suggestion-tokens","Saves "+saved+" characters · approximately "+Math.floor(saved/4)+" tokens. Quality matters more than a target."));
  const apply=element("button","main-button suggest-accept","✓ Apply This Specific Edit");
  apply.type="button";
  apply.addEventListener("click",()=>{
   const state=A().getState();
   const existing=String(state[rec.field]||"");
   if(existing!==rec.before){
    apply.disabled=true;
    const warn=element("p","suggestion-stale","This field changed after these suggestions were generated. Run the review again to protect your latest writing.");
    item.append(warn);return;
   }
   if(history.length===0){
     try{localStorage.setItem("velvetruin.fizzz.improvements.original.v1",A().backup())}catch{}
   }
   const result=A().importDraft({[rec.field]:rec.after},{replace:true});
   if(!result.applied.includes(rec.field)){
     item.append(element("p","suggestion-stale","Could not update that field. Your original text is intact."));return;
   }
   history.push({field:rec.field,original:rec.before,edited:rec.after,title:rec.title});
   $("#undo-improvement").disabled=false;
   apply.textContent="✓ Added to Character";apply.disabled=true;
   item.classList.add("suggestion-applied");
   inputText("✓ Applied “"+rec.title+"” to the real "+rec.field+" field. The original version is saved for Undo. Other suggestions remain optional.","good");
  });
  const jump=element("button","quiet-button","Edit Field Myself");
  jump.type="button";jump.addEventListener("click",()=>focusField(rec.field));
  actions.append(apply,jump);
 }else{
  const note=element("div","suggestion-sample");
  note.append(element("b","","WHAT TO WRITE / REVISE"),element("p","",rec.sample||""));
  item.append(note);
  const jump=element("button","quiet-button","✎ Open "+(chapterFor[rec.field]||"core")+" Fields →");
  jump.type="button";jump.addEventListener("click",()=>focusField(rec.field));
  actions.append(jump);
 }
 item.append(benefit,actions);
 return item;
}
function render(destination="#improvement-list",small=false){
 const target=$(destination);
 if(!target||!A()||!Advisor())return [];
 current=Advisor().evaluate(A().getState(),{tags:A().getTags()});
 target.replaceChildren();
 const totalEdits=current.filter(x=>x.kind==="edit").length;
 const priority=current.filter(x=>x.priority==="high").length;
 const heading=element("div","improvement-report-heading");
 heading.append(element("b","",current.length+" source-aware recommendation"+(current.length===1?"":"s")),
    element("p",""," "+totalEdits+" concrete edit"+(totalEdits===1?"":"s")+" with before/after previews · "+(current.length-totalEdits)+" guidance item"+(current.length-totalEdits===1?"":"s")+". Suggestions aren't a popularity score."));
 target.append(heading);
 const shown=small?current.slice(0,6):current;
 shown.forEach(rec=>target.append(card(rec,small?"import":"review")));
 if(small&&current.length>shown.length){
   const go=element("button","quiet-button","See all "+current.length+" recommendations in Review & Export");
   go.type="button";go.addEventListener("click",()=>{A().chapter("review");render("#improvement-list");});
   target.append(go);
 }
 const exportText=current.map((r,i)=>{
  const out=[""+(i+1)+". "+r.title,"Priority: "+r.priority,"Category: "+r.category,"Field: "+r.field,"Why: "+r.why,"Benefit: "+r.benefit];
  if(r.kind==="edit")out.push("BEFORE:\n"+r.before,"AFTER:\n"+r.after);
  else out.push("EDITORIAL GUIDANCE:\n"+r.sample);
  return out.join("\n");
 }).join("\n\n"+"—".repeat(55)+"\n\n");
 lastAnalysis="Fizzz character: "+(A().getState().name||"Unnamed Draft")+"\n"+"Local editorial recommendations; creator approval required.\n\n"+exportText;
 return current;
}
function run(){
 if(!A()||!Advisor()){inputText("The recommendations module did not load. Refresh the builder.","error");return}
 const state=A().getState();
 if(!Object.values(state).some(v=>typeof v==="string"&&v.trim()&&!["keyword","always","Limited","Any POV"].includes(v))){
   inputText("Start writing a character or import one before requesting improvements.","error");return;
 }
 const recs=render();
 inputText("Found "+recs.length+" recommendations for this specific draft. Review the before-and-after examples; accept only what fits your character.","good");
}
function afterImport(){
 const panel=$("#simple-feedback-panel");if(!panel)return;
 panel.replaceChildren();
 panel.append(element("h4","","Suggested Improvements for Your Character"));
 panel.append(element("p","","Each recommended change is grounded in your source and Fizzz writing guidance. These are editorial hypotheses—not guarantees of views or messages."));
 const area=element("div","import-improvement-cards");panel.append(area);
 const recs=renderInto(area);
 panel.hidden=false;
 const button=$("#simple-feedback");
 if(button)button.textContent="✓ "+recs.length+" Improvement Suggestions Below";
}
function renderInto(area){
 current=Advisor()?.evaluate(A().getState(),{tags:A().getTags()})||[];
 const shown=current.slice(0,6);
 for(const x of shown)area.append(card(x,"import"));
 if(current.length>shown.length){
  const more=element("button","quiet-button","See all "+current.length+" suggestions in Review & Export");
  more.type="button";more.addEventListener("click",()=>{A().chapter("review");run();});
  area.append(more);
 }
 return current;
}
function undo(){
 const last=history.pop();if(!last)return;
 const live=A().getState()[last.field];
 if(live!==last.edited){
   history.push(last);inputText("Can't undo automatically: "+last.field+" has since been edited. Restore it manually or download your backup.","error");return;
 }
 A().importDraft({[last.field]:last.original},{replace:true,allowEmpty:true});
 $("#undo-improvement").disabled=history.length===0;
 inputText("↶ Restored original "+last.field+" wording from before “"+last.title+"”. Your current saved draft reflects the undo.","good");
 run();
}
function init(){
 const btn=$("#run-improvements"),top=$("#top-improve");
 if(!btn||!A()||!Advisor())return;
 btn.addEventListener("click",run);
 top.addEventListener("click",()=>{A().chapter("review");run();});
 $("#download-improvement-report").addEventListener("click",()=>{
  if(!lastAnalysis)run();
  A().download((A().getState().name||"character").replace(/[^a-z0-9-_]+/gi,"-")+"-fizzz-improvements.txt",lastAnalysis);
 });
 $("#undo-improvement").addEventListener("click",undo);
 // Imported characters receive recommendations without another workflow step.
 window.VelvetRuinFizzzAdvisorUI=Object.freeze({run,afterImport,render});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
})();