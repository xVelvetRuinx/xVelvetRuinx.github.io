/* VelvetRuin Multi-Character Studio: explicit local saves, separate character and group exports. */
(function(){
"use strict";
var DB_NAME="velvetruin-fizzz-multi-studio-v1", db=null, characters=[], groups=[];
var editingId=null, currentImage="", dirtyChar=false, groupId=null, roster=[];
var $=function(id){return document.getElementById(id);};
var field=function(id){var e=$(id);return e?e.value.trim():"";};
var set=function(id,v){var e=$(id);if(e)e.value=v==null?"":String(v);};
var html=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});};
var uid=function(){return (window.crypto&&crypto.randomUUID)?crypto.randomUUID():"vr-"+Date.now()+"-"+Math.random().toString(36).slice(2);};
var slug=function(s){return String(s||"character").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"character";};
var safeImage=function(s){return typeof s==="string"&&/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(s)?s:"";};
var now=function(){return new Date().toISOString();};
function status(id,msg,bad){var e=$(id);if(e){e.textContent=msg;e.classList.toggle("error",!!bad);}}
function download(name,content,mime){var b=content instanceof Blob?content:new Blob([content],{type:mime||"text/plain;charset=utf-8"});var u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},60000);}
function openDB(){return new Promise(function(resolve,reject){if(!window.indexedDB)return reject(Error("IndexedDB is unavailable in this browser. Use a modern browser with site storage enabled."));var req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=function(){var d=req.result;["characters","groups"].forEach(function(k){if(!d.objectStoreNames.contains(k))d.createObjectStore(k,{keyPath:"id"});});};req.onsuccess=function(){resolve(req.result);};req.onerror=function(){reject(req.error||Error("Cannot open local storage."));};});}
function store(name,mode,verb,obj){return new Promise(function(resolve,reject){var t=db.transaction(name,mode),req=t.objectStore(name)[verb](obj);t.oncomplete=function(){resolve(req.result);};t.onerror=function(){reject(t.error||Error("Local storage failed."));};});}
function list(name){return store(name,"readonly","getAll");}
function put(name,obj){return store(name,"readwrite","put",obj);}
function del(name,id){return store(name,"readwrite","delete",id);}
async function refreshDB(){characters=await list("characters");groups=await list("groups");characters.sort(function(a,b){return (b.updatedAt||"").localeCompare(a.updatedAt||"");});renderLibrary();renderOptions();}
function blankWB(){return {title:"",mode:"always",keywords:"",body:""};}
function makeWorldFields(prefix,target){var out="";for(var n=1;n<=3;n++){var p=prefix+"-w"+n;out+='<div class="world-entry"><h3>Worldbook '+n+'</h3><div class="form-grid"><label>Title<input id="'+p+'-title" maxlength="140" placeholder="Setting, interaction, personal lore"></label><label>Activation<select id="'+p+'-mode"><option value="always">Always active</option><option value="keyword">Keyword activated</option></select></label><label class="full">Keywords / triggers<input id="'+p+'-keywords" placeholder="Optional trigger terms"></label><label class="full">Worldbook body <span class="limit" id="count-'+p+'">0 / 10,000</span><textarea id="'+p+'-body" maxlength="10000" rows="8" placeholder="Keep this lore separate from Core Personality."></textarea></label></div></div>';}$(target).innerHTML=out;}
function worldRead(prefix){var out=[];for(var n=1;n<=3;n++){var p=prefix+"-w"+n;out.push({title:field(p+"-title"),mode:field(p+"-mode")||"always",keywords:field(p+"-keywords"),body:field(p+"-body")});}return out;}
function worldSet(prefix,books){for(var n=1;n<=3;n++){var p=prefix+"-w"+n,b=Array.isArray(books)&&books[n-1]||blankWB();set(p+"-title",b.title);set(p+"-mode",b.mode||"always");set(p+"-keywords",b.keywords);set(p+"-body",b.body);}}
function countText(textId,counterId,max){var count=($(textId).value||"").length,el=$(counterId);if(el){el.textContent=count.toLocaleString()+" / "+max.toLocaleString();el.classList.toggle("bad",count>max);}}
function updateCounts(){countText("c-core","count-core",25000);countText("c-opening","count-opening",5000);countText("g-opening","count-group-opening",5000);["c","g"].forEach(function(p){for(var n=1;n<=3;n++)countText(p+"-w"+n+"-body","count-"+p+"-w"+n,10000);});}
function validWB(books){return books.every(function(b){return (b.body||"").length<=10000;});}
function characterDraft(){var name=field("c-name"),age=Number(field("c-age")),tags=field("c-tags").split(",").map(function(s){return s.trim();}).filter(Boolean),books=worldRead("c");if(!name)throw Error("Enter a character name.");if(!Number.isInteger(age)||age<18||age>150)throw Error("Each character must be 18 or older.");if(tags.length>10)throw Error("Use no more than 10 tags.");if(field("c-core").length>25000||field("c-opening").length>5000||!validWB(books))throw Error("A Fizzz text field exceeds its character limit.");var previous=characters.find(function(c){return c.id===editingId;});return {id:editingId||uid(),name:name,age:age,gender:field("c-gender"),role:field("c-role"),title:field("c-title"),bio:field("c-bio"),core:field("c-core"),opening:field("c-opening"),tags:tags,worldbooks:books,image:safeImage(currentImage),fizzzUrl:field("c-fizzz"),published:$("c-published").checked,createdAt:previous?previous.createdAt:now(),updatedAt:now()};}
function showPortrait(){var e=$("portrait-preview");e.replaceChildren();if(!safeImage(currentImage)){e.textContent="No portrait yet";return;}var img=document.createElement("img");img.alt="Current character portrait";img.src=currentImage;e.appendChild(img);}
function editorDirty(){dirtyChar=true;$("character-save-state").textContent="Unsaved changes";updateCounts();}
function clearEditor(force){if(!force&&dirtyChar&&!confirm("Discard the unsaved edits to this character?"))return false;editingId=null;currentImage="";dirtyChar=false;$("character-form").reset();worldSet("c",[]);showPortrait();updateCounts();$("editor-title").textContent="Create a character";$("character-save-state").textContent="New draft";status("character-message","");return true;}
function openCharacter(id){var c=characters.find(function(x){return x.id===id;});if(!c)return;if(dirtyChar&&!confirm("Discard unsaved edits to open another character?"))return;clearEditor(true);editingId=c.id;["name","age","gender","role","title","bio","core","opening"].forEach(function(k){set("c-"+k,c[k]);});set("c-tags",(c.tags||[]).join(", "));set("c-fizzz",c.fizzzUrl);$("c-published").checked=!!c.published;worldSet("c",c.worldbooks);currentImage=safeImage(c.image);showPortrait();updateCounts();$("editor-title").textContent="Edit "+c.name;$("character-save-state").textContent="Saved locally";status("character-message","Loaded "+c.name+". Edit and press Save to keep changes.");showView("characters");}
async function saveCharacter(e){if(e)e.preventDefault();try{var c=characterDraft();await put("characters",c);editingId=c.id;dirtyChar=false;await refreshDB();$("editor-title").textContent="Edit "+c.name;$("character-save-state").textContent="Saved locally";status("character-message","✓ "+c.name+" saved as an independent bot record. Export it and create the matching Fizzz bot separately.");}catch(err){status("character-message",err.message,true);}}
function cardImage(c){return safeImage(c.image)?'<img alt="" src="'+c.image+'">':'<div class="portrait-placeholder">✧</div>';}
function renderLibrary(){var q=field("search-characters").toLowerCase(),items=characters.filter(function(c){return (c.name+" "+(c.role||"")+" "+(c.title||"")).toLowerCase().includes(q);});$("character-count").textContent=characters.length;if(!items.length){$("character-list").innerHTML='<div class="empty">'+(q?"No characters match your search.":"No saved characters yet. Start with one standalone bot.")+'</div>';return;}$("character-list").innerHTML=items.map(function(c){return '<article class="library-card">'+cardImage(c)+'<div class="details"><b>'+html(c.name)+'</b><small>'+html(String(c.age)+" · "+(c.role||"Standalone bot"))+'</small><small class="'+(c.published?"status-published":"")+'">'+(c.published?"✓ Created on Fizzz":"◇ Not marked created on Fizzz")+'</small><div class="card-tools"><button type="button" data-c-action="edit" data-id="'+html(c.id)+'">Edit</button><button type="button" data-c-action="duplicate" data-id="'+html(c.id)+'">Duplicate</button><button type="button" data-c-action="kit" data-id="'+html(c.id)+'">📦 Kit + PNG</button><button type="button" data-c-action="export" data-id="'+html(c.id)+'">TXT</button><button type="button" data-c-action="remove" data-id="'+html(c.id)+'">Delete</button></div></div></article>';}).join("");}
function renderOptions(){var options=characters.slice().sort(function(a,b){return a.name.localeCompare(b.name);}).map(function(c){return '<option value="'+html(c.id)+'">'+html(c.name)+(c.published?" ✓":"")+'</option>';}).join("");var current=$("add-character").value;$("add-character").innerHTML='<option value="">Choose a saved character…</option>'+options;if(characters.some(function(c){return c.id===current;}))$("add-character").value=current;var prev=$("saved-ensembles").value;$("saved-ensembles").innerHTML='<option value="">New ensemble…</option>'+groups.slice().sort(function(a,b){return (b.updatedAt||"").localeCompare(a.updatedAt||"");}).map(function(g){return '<option value="'+html(g.id)+'">'+html(g.title||"Untitled ensemble")+'</option>';}).join("");$("saved-ensembles").value=groupId||prev||"";renderRoster();}
function textCharacter(c){return ["FIZZZ INDIVIDUAL CHARACTER — COPY INTO STANDALONE BOT","Name: "+c.name,"Age: "+c.age,"Gender: "+(c.gender||""),"Role: "+(c.role||""),"Public Title: "+(c.title||""),"Tags: "+(c.tags||[]).join(", "),"\nPUBLIC DESCRIPTION\n"+(c.bio||""),"\nCORE PERSONALITY\n"+(c.core||""),"\nINDIVIDUAL OPENING\n"+(c.opening||""),"\n---\nWorldbooks and portrait are deliberately exported separately. This is not a verified native Fizzz bulk import."].join("\n");}
function textWorldbooks(books){return (books||[]).map(function(b,i){return ["WORLDBOOK "+(i+1)+" — "+(b.title||"Untitled"),"Activation: "+(b.mode||"always"),"Keywords: "+(b.keywords||""),"\n"+(b.body||"(No lore yet)")].join("\n");}).join("\n\n"+"=".repeat(45)+"\n\n");}
/* Download kits use a self-contained, uncompressed ZIP writer (no third-party CDN).
   Each portrait is converted to a real PNG for ordinary browser image-upload fields. */
function pngBytesFromPortrait(image){
 return new Promise(function(resolve,reject){
  if(!safeImage(image))return reject(Error("The saved bot has no profile portrait. Choose a portrait, save the bot, and try again."));
  var img=new Image();
  img.onerror=function(){reject(Error("The profile portrait could not be decoded."));};
  img.onload=function(){
   try{
    var canvas=document.createElement("canvas");canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    if(!canvas.width||!canvas.height)throw Error("Portrait is empty.");
    canvas.getContext("2d").drawImage(img,0,0);
    canvas.toBlob(function(blob){if(!blob)return reject(Error("Could not convert the portrait to a PNG."));
     blob.arrayBuffer().then(function(buffer){resolve(new Uint8Array(buffer));}).catch(reject);
    },"image/png");
   }catch(error){reject(error);}
  };
  img.src=image;
 });
}
function zipCrc32(bytes){
 var crc=0xffffffff;
 for(var i=0;i<bytes.length;i++){
  crc^=bytes[i];
  for(var n=0;n<8;n++)crc=(crc>>>1)^(-(crc&1)&0xedb88320);
 }
 return (crc^0xffffffff)>>>0;
}
function zipFromFiles(files){
 if(!files.length)throw Error("There are no files to package.");
 if(files.length>65535)throw Error("Too many files for a ZIP package.");
 var encoder=new TextEncoder(),local=[],central=[],offset=0,centralLength=0;
 files.forEach(function(file){
  var name=encoder.encode(file.name),bytes=file.data instanceof Uint8Array?file.data:encoder.encode(String(file.data));
  if(name.length>65535)throw Error("A ZIP path is too long.");
  if(bytes.length>0xffffffff)throw Error("A file is too large for this ZIP.");
  var crc=zipCrc32(bytes);
  var lh=new Uint8Array(30),lv=new DataView(lh.buffer);
  lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0x0800,true);
  lv.setUint32(14,crc,true);lv.setUint32(18,bytes.length,true);lv.setUint32(22,bytes.length,true);
  lv.setUint16(26,name.length,true);
  local.push(lh,name,bytes);
  var ch=new Uint8Array(46),cv=new DataView(ch.buffer);
  cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);
  cv.setUint16(8,0x0800,true);cv.setUint32(16,crc,true);cv.setUint32(20,bytes.length,true);
  cv.setUint32(24,bytes.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);
  central.push(ch,name);
  offset+=lh.length+name.length+bytes.length;
  centralLength+=ch.length+name.length;
  if(offset>0xffffffff||centralLength>0xffffffff)throw Error("This collection is too large for a browser ZIP.");
 });
 var end=new Uint8Array(22),ev=new DataView(end.buffer);
 ev.setUint32(0,0x06054b50,true);ev.setUint16(8,files.length,true);ev.setUint16(10,files.length,true);
 ev.setUint32(12,centralLength,true);ev.setUint32(16,offset,true);
 return new Blob(local.concat(central,[end]),{type:"application/zip"});
}
function uploadKitReadme(c){
 return [
  "FIZZZ CHARACTER UPLOAD KIT — "+c.name,
  "",
  "This folder is one independent character bot.",
  "It includes an actual PNG named profile-image.png (not just a link or picture preview).",
  "",
  "WEB CREATOR STEPS:",
  "1. Extract this ZIP on your device.",
  "2. In Fizzz's individual character creator, choose profile-image.png using the profile image-upload control.",
  "3. Copy the public title, description and tags from profile.txt.",
  "4. Copy the Core Personality from core-personality.txt.",
  "5. Copy the initial message from initial-message.txt.",
  "6. Add the three Worldbooks separately from worldbooks.txt where Fizzz offers Worldbook entry fields.",
  "7. Save/create this individual bot. Record its Fizzz URL/ID in the studio.",
  "8. Only after all individuals exist on Fizzz, add them to your Multi-Character bot there.",
  "",
  "character-studio-backup.json can restore this character (including its portrait) in VelvetRuin Multi-Character Studio.",
  "This ZIP is a creator preparation package, NOT a native Fizzz bulk-import format.",
  "The image can be uploaded separately; a ZIP cannot automatically bind the image to a Fizzz character without their supported integration.",
  ""
 ].join("\n");
}
async function kitFilesForCharacter(c,prefix){
 if(!safeImage(c.image))throw Error(c.name+" has no saved portrait. Add its image before downloading the upload kit.");
 var png=await pngBytesFromPortrait(c.image),d=prefix||"";
 return [
  {name:d+"README-START-HERE.txt",data:uploadKitReadme(c)},
  {name:d+"profile-image.png",data:png},
  {name:d+"profile.txt",data:["NAME: "+c.name,"AGE: "+c.age,"GENDER: "+(c.gender||""),"ROLE: "+(c.role||""),"PUBLIC TITLE: "+(c.title||""),"TAGS: "+(c.tags||[]).join(", "),"\nPUBLIC BIO\n"+(c.bio||"")].join("\n")},
  {name:d+"core-personality.txt",data:c.core||""},
  {name:d+"initial-message.txt",data:c.opening||""},
  {name:d+"worldbooks.txt",data:textWorldbooks(c.worldbooks)},
  {name:d+"character-studio-backup.json",data:JSON.stringify({format:"velvetruin.fizzz.multi-character",version:1,character:c},null,2)}
 ];
}
async function downloadCharacterKit(c){
 var files=await kitFilesForCharacter(c,slug(c.name)+"/");
 download(slug(c.name)+"-fizzz-upload-kit-with-portrait.zip",zipFromFiles(files),"application/zip");
 status("character-message","✓ Downloaded "+c.name+"'s upload kit with profile-image.png, fields, separate Worldbooks and a restorable JSON.");
}
async function downloadEnsembleKits(){
 var g=groupDraft(),members=g.characterIds.map(function(id){return characters.find(function(c){return c.id===id;});});
 if(members.some(function(c){return !c;}))throw Error("Some roster characters have been deleted. Remove the missing cards first.");
 var missing=members.filter(function(c){return !safeImage(c.image);}).map(function(c){return c.name;});
 if(missing.length)throw Error("Portraits are missing for: "+missing.join(", ")+". Add them before exporting all upload kits.");
 var files=[
  {name:"README-START-HERE.txt",data:"FIZZZ MULTI-CHARACTER UPLOAD KITS\n\nExtract the ZIP. Each numbered character folder contains profile-image.png, public profile, core, individual greeting, Worldbooks and a full character backup. Create all standalone bots FIRST on Fizzz, attaching their PNGs through the web image-upload field. THEN build the multi-character bot using those existing bot records. The group folder contains the ensemble setup. The ZIP itself is NOT a native Fizzz import.\n"},
  {name:"00-MULTI-BOT/"+ "assembly-instructions.txt",data:groupText(g)},
  {name:"00-MULTI-BOT/"+ "shared-worldbooks.txt",data:textWorldbooks(g.worldbooks)}
 ];
 for(var i=0;i<members.length;i++){
  var prefix=String(i+1).padStart(2,"0")+"-"+slug(members[i].name)+"/";
  files.push.apply(files,await kitFilesForCharacter(members[i],prefix));
 }
 files.push({name:"00-MULTI-BOT/complete-project-backup.json",data:JSON.stringify(projectFile(members,[g]),null,2)});
 download(slug(g.title)+"-all-character-kits-with-portraits.zip",zipFromFiles(files),"application/zip");
 status("ensemble-message","✓ Downloaded "+members.length+" individual bot kits WITH their profile-image.png files and the ensemble setup.");
}

function exportSingle(c,kind){if(!c)return;var name=slug(c.name);if(kind==="txt")download(name+"-character.txt",textCharacter(c));else if(kind==="world")download(name+"-worldbooks.txt",textWorldbooks(c.worldbooks));else if(kind==="json")download(name+"-character.json",JSON.stringify({format:"velvetruin.fizzz.multi-character",version:1,character:c},null,2),"application/json");else if(kind==="image"){if(!safeImage(c.image))return status("character-message","Add a portrait first.",true);pngBytesFromPortrait(c.image).then(function(bytes){download(name+"-profile-image.png",new Blob([bytes],{type:"image/png"}),"image/png");status("character-message","✓ Profile image PNG downloaded.");}).catch(function(err){status("character-message",err.message,true);});}}
function exportCurrent(kind){try{exportSingle(characterDraft(),kind);}catch(err){status("character-message",err.message,true);}}
async function copyCharacter(id){var c=characters.find(function(x){return x.id===id;});if(!c)return;var name=prompt("Name for the copied standalone character:",c.name+" (copy)");if(!name||!name.trim())return;var clone={...c,id:uid(),name:name.trim(),published:false,fizzzUrl:"",createdAt:now(),updatedAt:now()};await put("characters",clone);await refreshDB();openCharacter(clone.id);}
async function removeCharacter(id){var c=characters.find(function(x){return x.id===id;});if(!c)return;if(!confirm("Delete "+c.name+" from this device? Groups that use this character will show a missing-character warning. Export a backup first if needed."))return;await del("characters",id);if(editingId===id)clearEditor(true);await refreshDB();}
function setPreviewFromFile(file){if(!file)return;if(!/^image\/(png|jpeg|webp)$/.test(file.type))return status("character-message","Choose PNG, JPG or WebP.",true);if(file.size>12*1024*1024)return status("character-message","Please choose an image under 12 MB.",true);var fr=new FileReader();fr.onload=function(){var img=new Image();img.onload=function(){var scale=Math.min(1,720/img.width,1280/img.height),canvas=document.createElement("canvas");canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,canvas.width,canvas.height);try{currentImage=canvas.toDataURL("image/webp",.87);if(!currentImage.startsWith("data:image/webp"))currentImage=canvas.toDataURL("image/jpeg",.88);showPortrait();editorDirty();status("character-message","Portrait added to this draft. Press Save to keep it in your library.");}catch(err){status("character-message","This image could not be saved: "+err.message,true);}};img.onerror=function(){status("character-message","Could not read this image.",true);};img.src=String(fr.result);};fr.onerror=function(){status("character-message","Image upload failed.",true);};fr.readAsDataURL(file);}
function showView(view){document.querySelectorAll(".tab").forEach(function(b){var on=b.dataset.view===view;b.classList.toggle("active",on);b.setAttribute("aria-selected",on?"true":"false");});document.querySelectorAll(".view").forEach(function(v){v.hidden=v.id!=="view-"+view;});}
function groupDraft(){var title=field("g-title"),books=worldRead("g");if(!title)throw Error("Enter a multi-bot title.");if(!roster.length)throw Error("Add at least one saved character.");if(field("g-opening").length>5000||!validWB(books))throw Error("A group text field exceeds its character limit.");var previous=groups.find(function(g){return g.id===groupId;});return {id:groupId||uid(),title:title,bio:field("g-bio"),opening:field("g-opening"),rules:field("g-rules"),worldbooks:books,characterIds:roster.slice(),createdAt:previous?previous.createdAt:now(),updatedAt:now()};}
function resetGroup(){groupId=null;roster=[];["g-title","g-bio","g-opening","g-rules"].forEach(function(id){set(id,"");});worldSet("g",[]);renderOptions();updateCounts();status("ensemble-message","New multi-bot setup. Choose saved characters to begin.");}
function loadGroup(id){if(!id){resetGroup();return;}var g=groups.find(function(x){return x.id===id;});if(!g)return;groupId=g.id;roster=(g.characterIds||[]).slice();set("g-title",g.title);set("g-bio",g.bio);set("g-opening",g.opening);set("g-rules",g.rules);worldSet("g",g.worldbooks);renderOptions();updateCounts();status("ensemble-message","Loaded saved ensemble "+g.title+".");}
function renderRoster(){var box=$("roster");$("roster-count").textContent=roster.length;if(!roster.length){box.innerHTML='<div class="empty">No characters selected yet. Add individual bots from your saved library.</div>';return;}box.innerHTML=roster.map(function(id,i){var c=characters.find(function(x){return x.id===id;});if(!c)return '<article class="roster-item warning">Missing character ID '+html(id)+' <button data-r-action="remove" data-index="'+i+'">Remove</button></article>';return '<article class="roster-item"><div class="roster-line">'+cardImage(c)+'<div class="name">'+html((i+1)+". "+c.name)+'<small>'+html(c.role||"Ensemble character")+'</small><small class="'+(c.published?"status-published":"warning")+'">'+(c.published?"✓ Created on Fizzz":"⚠ Create standalone bot on Fizzz first")+'</small></div></div><div class="card-tools"><button data-r-action="up" data-index="'+i+'" type="button">↑</button><button data-r-action="down" data-index="'+i+'" type="button">↓</button><button data-r-action="edit" data-index="'+i+'" type="button">Edit bot</button><button data-r-action="remove" data-index="'+i+'" type="button">Remove</button></div></article>';}).join("");}
async function saveGroup(){try{var g=groupDraft();await put("groups",g);groupId=g.id;await refreshDB();$("saved-ensembles").value=groupId;status("ensemble-message","✓ Ensemble saved. Its roster still points to independent characters.");}catch(err){status("ensemble-message",err.message,true);}}
async function deleteGroup(){if(!groupId)return status("ensemble-message","No saved ensemble is selected.",true);if(!confirm("Delete this saved ensemble setup? Individual characters will remain in your library."))return;await del("groups",groupId);groupId=null;await refreshDB();resetGroup();}
function groupText(g){var names=g.characterIds.map(function(id,i){var c=characters.find(function(x){return x.id===id;});if(!c)return (i+1)+". MISSING CHARACTER "+id;return (i+1)+". "+c.name+" ("+c.age+") — "+(c.role||"")+"\n   Fizzz individual bot URL/ID: "+(c.fizzzUrl||"NOT YET RECORDED")+"\n   Marked created on Fizzz: "+(c.published?"Yes":"No");});return ["FIZZZ MULTI-CHARACTER ASSEMBLY GUIDE — NOT A NATIVE IMPORT","\n1. FIRST CREATE THESE STANDALONE CHARACTERS ON FIZZZ",names.join("\n"),"\n2. CREATE A MULTI-CHARACTER BOT IN FIZZZ AND SELECT THESE EXISTING CHARACTERS","\nMULTI-BOT TITLE\n"+g.title,"\nMULTI-BOT PUBLIC DESCRIPTION\n"+g.bio,"\nMULTI-BOT OPENING\n"+g.opening,"\nENSEMBLE RESPONSE & CONTINUITY RULES\n"+g.rules,"\n3. SHARED MULTI-BOT WORLDBOOKS\n"+textWorldbooks(g.worldbooks),"\n4. KEEP EACH CHARACTER'S OWN PERSONALITY, OPENING, PORTRAIT AND WORLDBOOKS ON ITS INDIVIDUAL BOT. Verify platform fields and test in Fizzz."].join("\n");}
function projectFile(chars,grps){return {format:"velvetruin.fizzz.multi-studio",version:1,exportedAt:now(),notes:"Creator project backup, not a native Fizzz import. Character Worldbooks stay in their own worldbooks arrays. Includes private character portraits as local data URLs.",characters:chars,groups:grps};}
function exportGroup(kind){try{var g=groupDraft();if(kind==="txt"){download(slug(g.title)+"-assembly-instructions.txt",groupText(g));}else{var related=g.characterIds.map(function(id){return characters.find(function(c){return c.id===id;});}).filter(Boolean);download(slug(g.title)+"-full-project.json",JSON.stringify(projectFile(related,[g]),null,2),"application/json");}status("ensemble-message","Export downloaded. Remember to create each individual bot in Fizzz first.");}catch(err){status("ensemble-message",err.message,true);}}
function mappedBuilder(d,tags){var core=d.coreRaw||[d.occupation,d.appearance,d.backstory,d.traits,d.contradiction,d.motivation,d.relationship,d.behavior,d.boundaries,d.voice].filter(Boolean).join("\n\n");return {id:uid(),name:d.name||d.title||"Imported character",age:Number(d.age)||18,gender:d.gender||"",role:d.occupation||"",title:d.title||"",bio:d.bio||"",core:core,opening:d.initialRaw||d.openingScene||"",tags:Array.isArray(tags)?tags:[],worldbooks:[1,2,3].map(function(n){return {title:d["world"+n+"Title"]||"",mode:d["world"+n+"Mode"]||"always",keywords:d["world"+n+"Keywords"]||"",body:d["world"+n+"Body"]||""};}),image:"",fizzzUrl:"",published:false,createdAt:now(),updatedAt:now()};}
function parseImport(obj){if(obj&&Array.isArray(obj.characters))return {characters:obj.characters,groups:Array.isArray(obj.groups)?obj.groups:[]};if(obj&&obj.character)return {characters:[obj.character],groups:[]};if(obj&&obj.data)return {characters:[mappedBuilder(obj.data,obj.tags)],groups:[]};if(obj&&obj.atelier_project&&obj.atelier_project.project)return {characters:[mappedBuilder(obj.atelier_project.project,obj.atelier_project.project.tags)],groups:[]};if(obj&&obj.project)return {characters:[mappedBuilder(obj.project,obj.project.tags)],groups:[]};if(obj&&obj.profile&&typeof obj.core==="string")return {characters:[{...mappedBuilder({name:obj.profile.name,age:obj.profile.age,gender:obj.profile.gender,title:obj.profile.title,bio:obj.profile.bio,initialRaw:obj.opening},obj.profile.tags),core:obj.core}],groups:[]};throw Error("This JSON does not look like a character, Fizzz Builder backup, or Multi-Studio project.");}
function normalizeCharacter(c){if(!c||typeof c!=="object")return null;var age=Number(c.age);if(!c.name||!Number.isInteger(age)||age<18)return null;return {id:String(c.id||uid()),name:String(c.name).slice(0,100),age:age,gender:String(c.gender||""),role:String(c.role||""),title:String(c.title||""),bio:String(c.bio||""),core:String(c.core||"").slice(0,25000),opening:String(c.opening||"").slice(0,5000),tags:Array.isArray(c.tags)?c.tags.slice(0,10).map(String):[],worldbooks:[0,1,2].map(function(i){var b=Array.isArray(c.worldbooks)?c.worldbooks[i]:null;return {title:String(b&&b.title||""),mode:String(b&&b.mode||"always"),keywords:String(b&&b.keywords||""),body:String(b&&b.body||"").slice(0,10000)};}),image:safeImage(c.image),fizzzUrl:String(c.fizzzUrl||""),published:!!c.published,createdAt:c.createdAt||now(),updatedAt:now()};}
async function importJSON(file){if(!file)return;try{if(file.size>40*1024*1024)throw Error("File exceeds 40 MB. Import a smaller project backup.");var obj=JSON.parse(await file.text()),data=parseImport(obj),count=0;for(var raw of data.characters){var c=normalizeCharacter(raw);if(c){await put("characters",c);count++;}}for(var g of data.groups){if(g&&g.id&&Array.isArray(g.characterIds)){await put("groups",{id:String(g.id),title:String(g.title||"Untitled ensemble"),bio:String(g.bio||""),opening:String(g.opening||"").slice(0,5000),rules:String(g.rules||""),worldbooks:(Array.isArray(g.worldbooks)?g.worldbooks:[]).slice(0,3),characterIds:g.characterIds.map(String),createdAt:g.createdAt||now(),updatedAt:now()});}}await refreshDB();if(data.groups.length)loadGroup(data.groups[0].id);status("character-message","✓ Imported "+count+" standalone character(s) and "+data.groups.length+" ensemble(s) into this browser.");if(count)showView("characters");}catch(err){status("character-message","Import failed: "+err.message,true);showView("characters");}}
function bind(){
 document.querySelectorAll(".tab").forEach(function(b){b.addEventListener("click",function(){showView(b.dataset.view);});});
 $("character-form").addEventListener("submit",saveCharacter);
 $("character-form").addEventListener("input",function(){editorDirty();});
 $("character-form").addEventListener("change",function(){editorDirty();});
 $("new-character").addEventListener("click",function(){clearEditor(false);});
 $("c-image").addEventListener("change",function(e){setPreviewFromFile(e.target.files[0]);e.target.value="";});
 $("remove-image").addEventListener("click",function(){currentImage="";showPortrait();editorDirty();});
 $("search-characters").addEventListener("input",renderLibrary);
 $("character-list").addEventListener("click",function(e){var b=e.target.closest("[data-c-action]");if(!b)return;var c=characters.find(function(x){return x.id===b.dataset.id;});if(b.dataset.cAction==="edit")openCharacter(b.dataset.id);if(b.dataset.cAction==="duplicate")copyCharacter(b.dataset.id).catch(function(err){status("character-message",err.message,true);});if(b.dataset.cAction==="kit")downloadCharacterKit(c).catch(function(err){status("character-message",err.message,true);});if(b.dataset.cAction==="export")exportSingle(c,"txt");if(b.dataset.cAction==="remove")removeCharacter(b.dataset.id).catch(function(err){status("character-message",err.message,true);});});
 $("export-character-kit").addEventListener("click",function(){try{var c=characterDraft();downloadCharacterKit(c).catch(function(err){status("character-message",err.message,true);});}catch(err){status("character-message",err.message,true);}});
 [["export-character","txt"],["export-worldbooks","world"],["export-character-json","json"],["export-image","image"]].forEach(function(pair){$(pair[0]).addEventListener("click",function(){exportCurrent(pair[1]);});});
 $("library-backup").addEventListener("click",function(){download("velvetruin-fizzz-multi-library-backup.json",JSON.stringify(projectFile(characters,groups),null,2),"application/json");});
 $("library-import").addEventListener("change",function(e){importJSON(e.target.files[0]);e.target.value="";});
 $("add-to-ensemble").addEventListener("click",function(){var id=$("add-character").value;if(!id)return status("ensemble-message","Choose a saved character.",true);if(roster.includes(id))return status("ensemble-message","That character is already in the roster.",true);roster.push(id);renderRoster();status("ensemble-message","Character added. Save the Multi-Bot Setup to keep the roster.");});
 $("roster").addEventListener("click",function(e){var b=e.target.closest("[data-r-action]");if(!b)return;var i=Number(b.dataset.index),act=b.dataset.rAction;if(!Number.isInteger(i)||i<0||i>=roster.length)return;if(act==="edit"){openCharacter(roster[i]);return;}if(act==="remove")roster.splice(i,1);if(act==="up"&&i>0)[roster[i-1],roster[i]]=[roster[i],roster[i-1]];if(act==="down"&&i<roster.length-1)[roster[i+1],roster[i]]=[roster[i],roster[i+1]];renderRoster();});
 $("saved-ensembles").addEventListener("change",function(e){loadGroup(e.target.value);});
 $("save-ensemble").addEventListener("click",function(){saveGroup();});
 $("delete-ensemble").addEventListener("click",function(){deleteGroup();});
 $("export-ensemble-kits").addEventListener("click",function(){downloadEnsembleKits().catch(function(err){status("ensemble-message",err.message,true);});});
 $("export-group").addEventListener("click",function(){exportGroup("txt");});
 $("export-group-json").addEventListener("click",function(){exportGroup("json");});
 $("go-characters").addEventListener("click",function(){showView("characters");});
 $("go-ensemble").addEventListener("click",function(){showView("ensemble");});
 document.addEventListener("input",function(e){if(e.target&&((e.target.id||"").startsWith("g-")||(e.target.id||"").startsWith("c-w")))updateCounts();});
}
async function init(){makeWorldFields("c","character-worldbooks");makeWorldFields("g","group-worldbooks");bind();updateCounts();try{db=await openDB();await refreshDB();}catch(err){status("character-message","Local save is unavailable: "+err.message+". Export your drafts before closing.",true);status("ensemble-message","Local save is unavailable: "+err.message,true);}var params=new URLSearchParams(location.search);if(params.get("view")==="ensemble")showView("ensemble");}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();