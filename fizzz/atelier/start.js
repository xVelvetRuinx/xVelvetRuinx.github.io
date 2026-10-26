/* VelvetRuin Fizzz · one simple entry point
   Either start blank or import a creator-owned character into the same editor.
   No remote model calls. No silent rewriting or source deletion. */
(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const fileExt=file=>(file.name.split(".").pop()||"txt").toLowerCase();
const node=(tag,cls,content)=>{
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(content!==undefined)e.textContent=content;
 return e;
};
let imported=null;
const needsConcept=text=>/ORIGINAL USER[-‑– ]SUPPLIED CHARACTER TEXT|(?:^|\n)\s*(?:The Premise|Opening Scene Concept|The Halloween Twist|His Personality|Her Personality|Their Personality|Tropes?)\s*(?:\n|:)/i.test(text);
const recognizablyStructured=text=>/^\s*(?:#{1,4}\s*)?(?:Character Chat Name|Core Personality|Initial Message|Character Bio|Worldbook(?:\s+\d)?|Appearance|Speaking Style|Backstory|Relationship with \{\{user\}\})\s*[:\n]/im.test(text);
function readMapped(text,format="text"){
 const convert=window.VelvetRuinFizzzConceptConverter;
 const bridge=window.VelvetRuinFizzzImport;
 if(!bridge||!convert)throw Error("The document reader isn't loaded. Refresh the page and try again.");
 const t=String(text||"").trim();
 if(t.length<12)throw Error("There's not enough character information here. Add at least a character name, idea, or description.");
 const jsonSource=format==="json"||/^\s*\{/.test(t);
 const synopsis=needsConcept(t);
 const structured=recognizablyStructured(t);
 let mapped=null,parseError=null;
 if(jsonSource||structured||!synopsis){
   try{mapped=bridge.map(t,jsonSource?"json":"text");}catch(e){parseError=e;}
 }
 if(jsonSource&&parseError)throw Error("This JSON export could not be read: "+parseError.message);
 const confident=mapped&&!mapped.unstructured&&(Object.keys(mapped.fields||{}).length>0);
 if(confident&&!synopsis){
   return {...mapped,reason:"Detected labeled bot fields and preserved them in their matching Fizzz sections.",mode:"structured"};
 }
 if(synopsis||!confident){
   try{
     const result=convert.convert(t);
     const count=Object.keys(result.fields).length;
     if(count>=2||!mapped||synopsis){
       return {fields:result.fields,tags:result.tags||[],kind:"Creator-owned character concept",mode:"concept",
        notes:result.notes,mapped:Object.entries(result.fields).map(([field,value])=>({
         field,reason:result.explanations[field]?.why||"Kept this character fact from your source."
        })),unmapped:result.remainder||"",reason:"A story concept was recognized and organized into Fizzz fields using only information you supplied."};
     }
   }catch(e){if(!mapped)throw e;}
 }
 if(mapped){
  return {...mapped,mode:"structured",reason:mapped.unstructured
   ?"The text had no reliable section headings, so the entire original was kept verbatim in Core Personality for manual organization."
   :"Existing bot sections were recognized and imported without changing the prose."};
 }
 throw Error("No usable character content was found. Paste the original character rather than an editing instruction alone.");
}
function status(message,error=false){
 const bar=$("#simple-status");
 bar.textContent=message;bar.dataset.state=error?"error":"good";
}
function feedback(){
 const ui=window.VelvetRuinFizzzAdvisorUI;
 if(!ui)return status("The improvement editor is not available. Refresh this page.",true);
 ui.afterImport();
}
function report(mapped,filename,originalText,applied,skipped){
 imported={originalText,filename,mapped};
 const root=$("#simple-import-report"),summary=$("#simple-import-summary"),title=$("#simple-import-title");
 title.textContent="Imported: "+(window.FizzzAtelier.getState().name||filename||"Your character");
 summary.textContent=applied.length+" creator fields populated. "+(skipped.length?skipped.length+" entries required review because the editor already contained material. ":"")+"The source text and every originally supplied detail remain available for comparison. Nothing was automatically shortened.";
 const list=$("#simple-mapping");list.replaceChildren();
 const warnings=Array.isArray(mapped.notes)?mapped.notes:[];
 if(warnings.length){
   const block=node("div","simple-import-warnings");
   block.append(node("b","","Source review notes"));
   for(const note of warnings.slice(0,18))block.append(node("p","",typeof note==="string"?note:String(note?.reason||note?.message||"")));
   list.append(block);
 }
 for(const entry of mapped.mapped||[]){
  const box=node("div","simple-map-row");
  box.append(node("b","",entry.field),node("p","",entry.reason||"Preserved content from the source in this field."));
  list.append(box);
 }
 $("#simple-original").textContent=originalText;
 const leftovers=$("#simple-unmapped");
 leftovers.textContent=mapped.unmapped||"(No unmapped sections were detected by the parser. Review the imported fields against the original to confirm completeness.)";
 const save=$("#simple-download-original");save.disabled=!originalText;
 const panel=$("#simple-feedback-panel");panel.hidden=true;panel.replaceChildren();
 root.hidden=false;
 status("✓ Imported into the Fizzz builder. The editor suggests specific improvements below; all edits require your approval.",false);
 // Auto-populate the real improvement cards on import, including concrete
 // source-grounded before/after examples and contextual reasoning.
 if(window.VelvetRuinFizzzAdvisorUI)window.VelvetRuinFizzzAdvisorUI.afterImport();
 root.scrollIntoView({behavior:"smooth",block:"start"});
}
function doImport(text,filename="",format="text"){
 const A=window.FizzzAtelier;
 try{
  const converted=readMapped(text,format);
  if(!Object.keys(converted.fields||{}).length)throw Error("No character fields could be mapped from this source.");
  // Convert completely BEFORE clearing the previous draft; cancellation leaves
  // that draft untouched. A populated previous draft is automatically backed up.
  if(!A.beginFreshDraft()){status("Import cancelled. Your current character is unchanged.",true);return null;}
  const result=A.importDraft(converted.fields,{tags:converted.tags||[]});
  try{
   if(String(text).length<900000)localStorage.setItem("velvetruin.fizzz.original-import.v1",
    JSON.stringify({source:String(text),filename,date:new Date().toISOString()}));
  }catch{}
  report(converted,filename,String(text),result.applied,result.skipped);
  return converted;
 }catch(e){
  status("Could not import: "+(e.message||String(e)),true);
  return null;
 }
}
async function fromFile(file){
 if(!file)return;
 const API=window.VelvetRuinFizzzImport;
 const upload=$("#simple-file");
 upload.disabled=true;status("Reading "+file.name+"…");
 try{
   if(file.size>12*1024*1024)throw Error("File exceeds 12 MB. Export a smaller character document first.");
   if(!API)throw Error("The import reader is not ready. Refresh the page.");
   const parsed=await API.readFile(file);
   const contents=String(parsed?.text||"");
   if(!contents.trim())throw Error("No text was extracted. Try TXT or copy/paste the character.");
   const type=parsed.format||(["json"].includes(fileExt(file))?"json":"text");
   const outcome=doImport(contents,parsed.filename||file.name,type);
   if(outcome&&Array.isArray(parsed.warnings)&&parsed.warnings.length){
    const notice=node("p","import-reader-warning",parsed.warnings.join(" "));
    $("#simple-mapping").prepend(notice);
   }
 }catch(e){status("File import problem: "+e.message,true);}
 finally{upload.disabled=false;upload.value="";}
}
function createNew(){
 const A=window.FizzzAtelier;if(!A)return;
 if(!A.beginFreshDraft()){status("New character cancelled; the previous draft is still here.",true);return;}
 imported=null;$("#simple-import-report").hidden=true;
 status("Blank Fizzz character ready. Begin with the public Profile; every field provides examples and useful length guidance.");
 A.chapter("profile");
}
function init(){
 const A=window.FizzzAtelier;
 if(!A)return;
 $("#simple-new").addEventListener("click",createNew);
 const file=$("#simple-file"),drop=$("#simple-drop");
 file.addEventListener("change",event=>fromFile(event.target.files?.[0]));
 for(const event of ["dragenter","dragover"])drop.addEventListener(event,e=>{e.preventDefault();drop.classList.add("dragging")});
 for(const event of ["dragleave","drop"])drop.addEventListener(event,e=>{e.preventDefault();drop.classList.remove("dragging")});
 drop.addEventListener("drop",e=>{if(e.dataTransfer?.files?.[0])fromFile(e.dataTransfer.files[0]);});
 $("#simple-import-text").addEventListener("click",()=>{
  const value=$("#simple-text").value;
  if(!value.trim()){status("Paste character text into the box first, or choose a file.",true);return;}
  doImport(value,"Pasted character","text");
 });
 $("#simple-edit").addEventListener("click",()=>A.chapter("profile"));
 $("#simple-feedback").addEventListener("click",feedback);
 $("#simple-download-original").addEventListener("click",()=>{
   if(!imported)return;
   A.download("original-"+(imported.filename||"character").replace(/[^\w.-]+/g,"-")+".txt",imported.originalText);
 });
 // A lightweight optional entry to the existing advanced migration reviewer.
 // All other import controls and source comparison remain available on demand.
}
window.VelvetRuinFizzzStart=Object.freeze({readMapped,doImport});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();