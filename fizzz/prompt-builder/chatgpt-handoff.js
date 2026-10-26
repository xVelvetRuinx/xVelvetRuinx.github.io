/* Fizzz Prompt Builder: free-plan-compatible ChatGPT handoff.
   ChatGPT runs on its own site. This is not API inference or account sharing.
   The creator reviews and imports the AI's finished JSON manually. */
(()=>{
 "use strict";
 const $=s=>document.querySelector(s);
 const NOTICE="This does not call OpenAI from your GitHub site. It opens ChatGPT in a separate tab under the creator's own Free or paid account, subject to plan limits.";
 function info(str){const el=$("#compiler-status");if(el)el.textContent=str;}
 function save(name,text,type){
  const blob=new Blob([text],{type:type||"text/markdown"}),a=document.createElement("a"),url=URL.createObjectURL(blob);
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3500);
 }
 function markdown(){
  const api=window.VelvetRuinFizzzCompiler;if(!api)throw Error("Compiler unavailable.");
  const f=api.publishing(),p=f.profile,blocks=[];
  blocks.push("# "+(p.title||p.name||"Fizzz Character"));
  for(const [label,value] of [
   ["Public Title",p.title],["Character Chat Name",p.name],["Character Age",p.age],
   ["Gender",p.gender],["POV",p.pov],["Rating",p.rating],
   ["Creation Date",p.created],["Discovery Tags",(p.tags||[]).join(", ")],
   ["Public Bio",p.bio],["Content Advisory",p.warning],
   ["Core Personality — Paste Into Fizzz",f.core_personality],
   ["Initial Message — Paste Into Fizzz",f.initial_message]]){
    blocks.push("## "+label+"\n\n"+String(value||""));
  }
  for(const [i,book] of f.worldbooks.entries()){
   blocks.push("## Worldbook "+(i+1)+" — "+(book.title||"Untitled")+"\n\n"+
    "**Activation:** "+(book.mode==="always"?"Always Active":"Keyword Trigger")+"\n\n"+
    "**Keywords:** "+(book.keywords||"None")+"\n\n"+
    (book.content||"**Full source lore missing: import before publishing**"));
  }
  const slug=(p.name||"character").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  save(slug+"-fizzz-final-bot.md",blocks.join("\n\n---\n\n"),"text/markdown");
  info("Complete Fizzz Markdown character saved from your APPROVED AI/compiler version. Copy the individual fields into Fizzz.");
 }
 function copiedPrompt(mode){
  const api=window.VelvetRuinFizzzCompiler;if(!api)throw Error("Prompt compiler is unavailable.");
  return api.aiBrief(mode||$("#chatgpt-scope")?.value||"complete");
 }
 function fallback(prompt){
  const container=$("#chatgpt-manual"),txt=$("#chatgpt-manual-text");if(txt)txt.value=prompt;
  if(container)container.hidden=false;
 }
 function openChatGPT(mode){
  if(typeof mode==="string"&&$("#chatgpt-scope"))$("#chatgpt-scope").value=mode;
  let prompt;try{prompt=copiedPrompt();}catch(e){info(e.message);return;}
  // Request clipboard while this tab still has focus, then open a new tab synchronously.
  let write=null;
  if(navigator.clipboard?.writeText){try{write=navigator.clipboard.writeText(prompt);}catch{write=null}}
  window.open("https://chatgpt.com/","_blank","noopener,noreferrer");
  if(!write){
   fallback(prompt);info("ChatGPT opened. Copy the source-aware instructions from the box below, paste into ChatGPT, then return with the complete JSON reply.");return;
  }
  Promise.resolve(write).then(()=>{
   info("✓ Prompt copied and ChatGPT opened. Paste it there, send the request, then paste the JSON result into Step 2 below.");
  }).catch(()=>{
   fallback(prompt);info("Clipboard permissions were blocked. Your prompt is shown below for manual copying.");
  });
 }
 async function copyOnly(){
  const prompt=copiedPrompt();
  if(!navigator.clipboard?.writeText){fallback(prompt);info("Copy the full prompt from the visible box.");return;}
  try{await navigator.clipboard.writeText(prompt);info("Full source-aware prompt copied. Paste it into ChatGPT.");}
  catch{fallback(prompt);info("Clipboard permission blocked. Copy from the visible prompt box.");}
 }
 function init(){
  const old=$("#compiler-copy-ai");if(!old)return;
  const details=old.closest("details");if(!details)return;
  const title=details.querySelector("summary");
  if(title)title.textContent="✦ Create a complete AI-improved bot with ChatGPT (Free option)";
  details.open=true;
  const first=document.createElement("section");
  first.className="chatgpt-handoff";
  first.innerHTML=[
   '<p class="muted"><strong>Real AI writing, not keyword extraction.</strong> Generate a fully connected public bio, a complete optimized Markdown core, and an edited first message while preserving established canon. No additional API key or third-party AI subscription is required.</p>',
   '<p class="muted">',NOTICE,'</p>',
   '<label for="chatgpt-scope" class="muted">Choose the complete field ChatGPT should improve:</label><select id="chatgpt-scope"><option value="complete">Entire bot — Title + Public Bio + Core + Opening</option><option value="bio">Public Bio — complete improved story</option><option value="core">Core Personality — complete revised Markdown</option><option value="opening">Initial Message — full novel-style scene</option></select>',
   '<div class="actions"><button id="chatgpt-open" type="button" class="primary">1 · Copy Source & Open ChatGPT</button><button id="chatgpt-copy" type="button">Copy Full Source Prompt</button><a class="btn" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Open ChatGPT Manually</a></div>',
   '<div id="chatgpt-manual" hidden><p class="muted">Clipboard access was unavailable. Select and copy this complete prompt:</p><textarea id="chatgpt-manual-text" rows="10" readonly></textarea></div>',
   '<p class="muted"><strong>Step 2:</strong> ChatGPT returns JSON containing the COMPLETE revised title, bio, core and opening. Paste that entire result into the text box below, not just the prose excerpts.</p>'
  ].join("");
  const promptEl=$("#compiler-ai-json");
  if(promptEl)details.insertBefore(first,promptEl);
  else details.insertBefore(first,old);
  old.textContent="Copy Prompt (alternative)";
  const importButton=$("#compiler-import-ai");
  if(importButton)importButton.textContent="3 · Import Complete ChatGPT Rewrite for Approval";
  const report=document.createElement("pre");
  report.id="compiler-ai-report";report.className="compiler-diagnostics";
  report.textContent="The AI change log will appear here after importing the JSON. Accept or reject the entire revision using the compiler controls.";
  if(importButton)importButton.insertAdjacentElement("afterend",report);
  const actionBar=document.querySelector("#compiler-workspace")||document.querySelector(".compiler-box");
  const md=document.createElement("button");md.type="button";md.id="chatgpt-export-md";md.textContent="↓ Export Approved Bot as Markdown (.md)";
  if(actionBar){const tools=actionBar.querySelector("#compiler-publishing");if(tools)tools.insertAdjacentElement("afterend",md);else actionBar.append(md);}
  $("#chatgpt-open").addEventListener("click",()=>openChatGPT());
  $("#chatgpt-copy").addEventListener("click",()=>{copyOnly()});
  md.addEventListener("click",()=>{try{markdown();}catch(e){info(e.message)}});
 }
 window.VelvetRuinFizzzChatGPT=Object.freeze({launch:openChatGPT,copyPrompt:copiedPrompt});
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
