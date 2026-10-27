/* Fizzz private session: character text lives only in JavaScript memory.
   Legacy browser autosaves are removed from durable storage on first load.
   A one-time recovery copy is offered in this tab so old work isn't silently lost.
   No sessionStorage/localStorage/IndexedDB character writes. */
(()=>{
"use strict";
const keys=[
 "velvetruin.fizzz.promptbuilder.v1",
 "velvetruin.fizzz.promptbuilder.v1.previous-draft",
 "vr.fizzz.compiled.v2",
 "vr.fizzz.compiled.v2.legacy-bio-backup"
];
let recovered={},dirty=false,backupPending=false;
for(const key of keys){
 try{
  const old=localStorage.getItem(key);
  if(old)recovered[key]=old;
  localStorage.removeItem(key);
 }catch{}
 try{sessionStorage.removeItem(key)}catch{}
}
backupPending=Object.keys(recovered).length>0;
function hasWork(){return dirty||backupPending;}
function beforeLeave(event){
 if(!hasWork())return;
 // Browser owns the warning text and may suppress dialogs on forced shutdown.
 event.preventDefault();
 event.returnValue="";
}
window.addEventListener("beforeunload",beforeLeave);
function updated(){
 const label=document.getElementById("session-protection-status");
 if(label)label.textContent=dirty?
  "Unsaved changes in this tab. Download a Builder Backup before closing or refreshing.":
  "Current character is in this tab's memory only. Closing or refreshing clears it.";
}
function edited(){dirty=true;updated();}
function backedUp(){dirty=false;updated();}
function legacyPackage(){
 const prefix="velvetruin.fizzz.promptbuilder.v1",main=recovered[prefix];
 let project=null;
 try{
  const obj=main?JSON.parse(main):null;
  if(obj?.data)project={
   builder:"VelvetRuin Fizzz Prompt Builder",version:2,
   data:obj.data,tags:obj.chosen||[],
   original_source:obj.original||"",source_filename:obj.originalName||"",
   export_note:"One-time recovery of pre-privacy browser autosave; not an automatic session restore."
  };
 }catch{}
 let prior,compiler,compilerBackup;
 try{prior=JSON.parse(recovered[prefix+".previous-draft"]||"null")}catch{}
 try{compiler=JSON.parse(recovered["vr.fizzz.compiled.v2"]||"null")}catch{}
 try{compilerBackup=JSON.parse(recovered["vr.fizzz.compiled.v2.legacy-bio-backup"]||"null")}catch{}
 const payload=project||{builder:"Fizzz Legacy Recovery Archive",version:1,
  note:"No restorable builder project found; inspect the included legacy data."};
 if(compiler&&project)payload.compiler_draft=compiler;
 if(prior)payload.previous_project=prior;
 if(compilerBackup)payload.previous_compiler=compilerBackup;
 return payload;
}
function downloadRecovery(){
 if(!backupPending)return;
 const content=JSON.stringify(legacyPackage(),null,2);
 const blob=new Blob([content],{type:"application/json"}),url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download="fizzz-previous-browser-draft-recovery.json";
 document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),4000);
 backupPending=false;recovered={};
 const banner=document.getElementById("legacy-recovery-banner");
 if(banner)banner.remove();
 updated();
}
function showRecovery(){
 if(!backupPending)return;
 const shell=document.querySelector(".shell");if(!shell)return;
 const banner=document.createElement("section");
 banner.id="legacy-recovery-banner";banner.className="session-recovery";
 banner.innerHTML='<strong>Previous browser-saved draft found.</strong>'+
  '<p>To keep this shared builder private, old character autosaves have been cleared from permanent browser storage. A one-time recovery copy remains available <strong>only in this open tab</strong>. Download it now if you need that work. It will not be loaded automatically into the editor.</p>'+
  '<button id="download-legacy-recovery" class="primary" type="button">↓ Download Previous Draft Recovery</button>';
 shell.prepend(banner);
 document.getElementById("download-legacy-recovery")?.addEventListener("click",downloadRecovery);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{showRecovery();updated()},{once:true});
else{showRecovery();updated();}
const styles=document.createElement("style");
styles.textContent='.session-recovery{padding:16px;margin:14px 0;border:1px solid #d0ac84;background:#2c2026;border-radius:10px}.session-recovery p{font-size:12px;line-height:1.6;margin:9px 0 12px}.session-recovery strong{color:#ead2aa}#session-protection-status{font-size:12px;color:#e6cda8;line-height:1.6}';
document.head.append(styles);
window.FizzzSessionPrivacy=Object.freeze({edited,backedUp,hasWork,legacyRecoveryAvailable:()=>backupPending});
})();