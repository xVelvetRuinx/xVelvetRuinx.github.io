/* Dedicated transfer for Fizzz's three distinct Worldbook entries.
   Deliberately NEVER copy concatenated Worldbooks into a single Fizzz slot. */
(()=>{
"use strict";
const $=s=>document.querySelector(s);
const safe=s=>String(s||"").replace(/\r\n?/g,"\n").trim();
const esc=s=>safe(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const ids=["worldbook-transfer-world","worldbook-transfer-output"];
const filename=()=>safe(window.FizzzAtelier?.getState?.()?.name||"character").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"character";
function book(n){
 const a=window.FizzzAtelier?.getState?.()||{},b=window.VelvetRuinFizzzCompiler?.selectedWorld?.(n),p="world"+n;
 const mode=b?.mode||a[p+"Mode"]||"keyword";
 return {number:n,title:safe(b?.title??a[p+"Title"]),mode:mode==="always"?"always":"keyword",
   keywords:safe(b?.keywords??a[p+"Keywords"]),content:safe(b?.content??a[p+"Body"])};
}
const books=()=>[book(1),book(2),book(3)];
function status(s){
 for(const id of ids){
  const root=document.getElementById(id);
  const node=root?.querySelector(".wb-transfer-status");
  if(node)node.textContent=s;
 }
}
function save(name,text){
 const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),3000);
}
function item(n){
 const b=book(n),has=Boolean(b.content),over=b.content.length>10000;
 const box=document.createElement("article");box.className="wb-transfer-card";
 box.innerHTML='<div class="wb-transfer-top"><div><b>WORLDBOOK '+n+'</b><h4>'+esc(b.title||"Untitled entry")+'</h4></div><span>'+ (b.mode==="always"?"Always Active":"Keyword Trigger")+'</span></div>'+
  '<p>'+ (has?b.content.length.toLocaleString()+' / 10,000 lore characters'+(over?' · TOO LONG':''):'Missing full lore body — import it before transfer')+'</p>'+
  '<div class="wb-transfer-controls">'+
  '<button type="button" data-part="title"'+(!b.title?" disabled":"")+'>Copy Title</button>'+
  '<button type="button" data-part="keywords"'+(b.mode==="always"||!b.keywords?" disabled":"")+'>Copy Keywords</button>'+
  '<button type="button" data-part="content"'+(!has||over?" disabled":"")+'>Copy Lore Only</button>'+
  '<button type="button" data-part="download"'+(!has||over?" disabled":"")+'>Download Lore TXT</button>'+
  '</div>'+
  (b.mode==="always"?'<p class="muted">Set Always Active in Fizzz. Keywords are not needed.</p>':
   !b.keywords?'<p class="wb-transfer-warning">Keyword Trigger selected but no keywords are entered.</p>':'')+
  '<label class="wb-transfer-confirm"><input type="checkbox" data-wb-complete="'+n+'"> I created Worldbook '+n+' as its OWN entry in Fizzz.</label>';
 for(const button of box.querySelectorAll("[data-part]")){
  button.addEventListener("click",async()=>{
   const current=book(n),part=button.dataset.part;
   try{
    if(part==="download"){
     if(!current.content||current.content.length>10000)throw Error("Lore is missing or over the limit.");
     save(filename()+"-worldbook-"+n+"-lore-only.txt",current.content);
     status("Saved Worldbook "+n+" lore as its own file, with no other Worldbooks included.");return;
    }
    const value=part==="title"?current.title:part==="keywords"?current.keywords:current.content;
    if(!value)throw Error(part+" field is empty.");
    if(part==="content"&&value.length>10000)throw Error("Lore exceeds 10,000 characters.");
    if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable. Select and copy from the matching field in the Worldbooks tab.");
    await navigator.clipboard.writeText(value);
    status("Copied Worldbook "+n+" "+(part==="content"?"lore ONLY":part)+". Paste it into Worldbook "+n+"'s matching Fizzz field, not the other entries.");
   }catch(e){status("Worldbook "+n+": "+e.message);}
  });
 }
 return box;
}
function render(){
 for(const id of ids){
  const root=document.getElementById(id);if(!root)continue;
  const marked=new Set([...root.querySelectorAll("[data-wb-complete]:checked")].map(e=>e.dataset.wbComplete));
  const existing=root.querySelector(".wb-transfer-status")?.textContent||"";
  root.replaceChildren();
  const heading=document.createElement("header");
  heading.innerHTML='<h3>Transfer each Worldbook into its own Fizzz entry</h3><p>Do not paste the combined character TXT or all three Worldbooks into one lore field. Each button below copies <strong>only one entry and only one field</strong>.</p>';
  root.append(heading);
  const steps=document.createElement("p");steps.className="wb-transfer-steps";
  steps.textContent="On Fizzz, create entry 1 and paste its fields → click Add Worldbook to create entry 2 → repeat → click Add Worldbook for entry 3. Choose each entry's activation mode manually.";
  root.append(steps);
  for(let n=1;n<=3;n++){
   const card=item(n),checkbox=card.querySelector("input[data-wb-complete]");
   checkbox.checked=marked.has(String(n));
   checkbox.addEventListener("change",()=>status("Progress noted locally. This checkbox does not create or save anything on Fizzz."));
   root.append(card);
  }
  const feedback=document.createElement("p");feedback.className="wb-transfer-status";feedback.setAttribute("role","status");
  feedback.textContent=existing||"Start with Worldbook 1. The three lore bodies are never joined together.";
  root.append(feedback);
 }
}
function init(){
 render();
 document.addEventListener("fizzz:field-data-changed",render);
 document.addEventListener("input",e=>{if(e.target?.dataset?.key?.startsWith("world"))render();});
 document.addEventListener("change",e=>{if(e.target?.dataset?.key?.startsWith("world"))render();});
 for(const tab of document.querySelectorAll('[data-tab="world"],[data-tab="output"]'))tab.addEventListener("click",render);
}
const css=document.createElement("style");
css.textContent=[
".wb-transfer{border:1px solid #78586c;border-radius:12px;padding:17px;margin:24px 0;background:rgba(24,14,25,.42)}",
".wb-transfer header h3{font:600 25px Georgia,serif;margin:0 0 8px}",
".wb-transfer header p,.wb-transfer-steps,.wb-transfer-card p,.wb-transfer-confirm,.wb-transfer-status{font-size:12px;line-height:1.7}",
".wb-transfer-steps{border-left:3px solid #d1af85;background:rgba(255,255,255,.035);padding:10px 12px;margin:12px 0}",
".wb-transfer-card{border:1px solid #684a61;border-radius:9px;padding:14px;margin:11px 0;background:rgba(12,8,17,.45)}",
".wb-transfer-top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px}",
".wb-transfer-top b,.wb-transfer-top span{color:#e4c49e;font-size:11px}",
".wb-transfer-top h4{font:600 20px Georgia,serif;margin:4px 0}",
".wb-transfer-controls{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}",
".wb-transfer-controls button{padding:7px 10px;font-size:12px}",
".wb-transfer-controls button:disabled{opacity:.42;cursor:not-allowed}",
".wb-transfer-confirm{display:flex;gap:8px;align-items:start;margin-top:10px}",
".wb-transfer-confirm input{flex:none;margin-top:5px}",
".wb-transfer-warning{color:#f2b99a}",
".wb-transfer-status{color:#e4c49e;margin:12px 0 0}"
].join("");
document.head.append(css);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
window.FizzzWorldbookTransfer=Object.freeze({books,book,render});
})();