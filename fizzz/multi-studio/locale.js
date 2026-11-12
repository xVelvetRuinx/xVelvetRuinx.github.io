/* VelvetRuin Fizzz Multi-Character Studio bilingual UI. Only chrome/help text is translated; user writing is never changed. */
(function(){
"use strict";
var ES={
  "Single Bot Builder": "Creador de bots individuales",
  "Creator Guide": "Guía para creadores",
  "Fizzz tools": "Herramientas Fizzz",
  "Studio views": "Vistas del estudio",
  "VELVETRUIN'S CREATOR TOOLS · MULTI-CHARACTER WORKFLOW": "HERRAMIENTAS DE VELVETRUIN · FLUJO MULTIPERSONAJE",
  "Build them apart.": "Créales por separado.",
  "Bring them together.": "Reúnelos en una historia.",
  "Create and keep each adult character as a standalone bot with its own portrait, personality, opening and three separate Worldbooks. When they're ready, choose them from your saved library to assemble a multi-character scene.": "Crea y guarda cada personaje adulto como un bot individual, con su retrato, personalidad, mensaje inicial y tres libros de mundo separados. Cuando estén listos, selecciónalos desde tu biblioteca para crear una historia con varios personajes.",
  "✦ Portrait included in every upload-kit ZIP": "✦ Retrato incluido en cada ZIP",
  "✦ Individual exports": "✦ Exportaciones individuales",
  "✦ Reusable character library": "✦ Biblioteca reutilizable de personajes",
  "✦ Up to 3 lore entries per bot": "✦ Hasta 3 libros de mundo por bot",
  "✦ Ensemble assembly": "✦ Montaje del elenco",
  "✦ Manual Fizzz publishing checklist": "✦ Guía de publicación en Fizzz",
  "Private, browser-only library.": "Biblioteca privada en este navegador.",
  "Saved characters, images and ensembles stay in this browser's IndexedDB on this device, not on GitHub or a server. Unlike the session-only Single Bot Builder, this studio saves only when you press Save. Download a Library Backup to avoid losing work if browser data is cleared. This site cannot publish bots directly into Fizzz.": "Los personajes, imágenes y elencos guardados permanecen en este dispositivo, en IndexedDB del navegador; no se envían a GitHub ni a ningún servidor. A diferencia del creador de un solo bot, este estudio solo guarda cuando pulsas Guardar. Descarga una copia de seguridad de la biblioteca para no perder tu trabajo si se borran los datos del navegador. Esta página no publica bots directamente en Fizzz.",
  "01 · Character Library": "01 · Biblioteca de personajes",
  "02 · Multi-Bot Assembly": "02 · Crear multibot",
  "03 · Publish Checklist": "03 · Guía de publicación",
  "YOUR ROSTER": "TUS PERSONAJES",
  "Saved characters": "Personajes guardados",
  "+ New": "+ Nuevo",
  "Each card is a standalone bot. Edit, export, or reuse it. Choose": "Cada tarjeta es un bot independiente. Puedes editarlo, exportarlo o reutilizarlo. Elige",
  "📦 Upload Kit": "📦 Kit de subida",
  "to download the character profile": "para descargar el perfil del personaje",
  "and its actual uploadable portrait PNG": "y su retrato PNG listo para subir",
  "together in one ZIP.": "juntos en un archivo ZIP.",
  "Your library is empty.": "Tu biblioteca está vacía.",
  "↓ Library Backup JSON": "↓ Copia de seguridad JSON",
  "↑ Import JSON / Backup": "↑ Importar JSON / copia de seguridad",
  "A backup can contain image data and be large. Imports merge by character ID; matching records are replaced. Separate browsers/devices do not share libraries automatically.": "La copia de seguridad puede incluir imágenes y ser un archivo grande. Al importar se combinan los registros por ID; los coincidentes se reemplazan. Los navegadores y dispositivos diferentes no comparten la biblioteca automáticamente.",
  "STANDALONE CHARACTER EDITOR": "EDITOR DE PERSONAJES INDIVIDUALES",
  "Create a character": "Crear personaje",
  "New draft": "Nuevo borrador",
  "Character name": "Nombre del personaje",
  "Age (18+)": "Edad (18+)",
  "Gender / identity": "Género / identidad",
  "Role in the cast": "Papel en el elenco",
  "Public title": "Título público",
  "Public description": "Descripción pública",
  "Core personality": "Personalidad principal",
  "Individual opening message": "Mensaje inicial individual",
  "Tags (comma-separated, up to 10)": "Etiquetas (separadas por comas; máximo 10)",
  "✧ Character portrait / media": "✧ Retrato y archivos multimedia",
  "No portrait yet": "Aún no hay retrato",
  "↑ Choose character portrait": "↑ Elegir retrato",
  "Remove portrait": "Quitar retrato",
  "PNG, JPG or WebP; images are resized to fit within 720 × 1280 and saved privately with the character.": "PNG, JPG o WebP; las imágenes se redimensionan a un máximo de 720 × 1280 y se guardan de forma privada con el personaje.",
  "Download Upload Kit ZIP": "Descargar ZIP del kit de subida",
  "exports a standard": "exporta un archivo estándar",
  "together with this character’s fields, Worldbooks, and restorable JSON. Upload the PNG using Fizzz’s image selector; paste or import the text using whatever fields Fizzz supports.": "junto con los campos del personaje, sus libros de mundo y un JSON restaurable. Sube el PNG con el selector de imágenes de Fizzz; copia o importa los textos en los campos disponibles.",
  "✧ Three separate Worldbooks": "✧ Tres libros de mundo independientes",
  "These are NOT concatenated into the character's personality or portable card. Export lore separately and enter it in the proper Fizzz Worldbook fields.": "NO se combinan con la personalidad ni con la tarjeta del personaje. Exporta la información de mundo por separado y colócala en los campos correspondientes de Fizzz.",
  "✧ Fizzz publishing reference": "✧ Referencia de publicación en Fizzz",
  "Fizzz individual character URL or ID": "URL o ID del personaje individual en Fizzz",
  "I have created/published this individual character on Fizzz": "Ya creé o publiqué este personaje individual en Fizzz",
  "This is a creator-maintained status, not an automatic platform verification.": "El creador marca este estado manualmente; no es una verificación automática de Fizzz.",
  "✓ Save Individual Character": "✓ Guardar personaje individual",
  "📦 Download Bot Upload Kit ZIP + Image": "📦 Descargar ZIP del bot con imagen",
  "↓ Character TXT": "↓ Personaje TXT",
  "↓ Worldbooks TXT": "↓ Libros de mundo TXT",
  "↓ Character JSON": "↓ Personaje JSON",
  "↓ Portrait": "↓ Retrato",
  "ENSEMBLE ROSTER": "ELENCO DEL MULTIBOT",
  "Choose saved bots": "Elige bots guardados",
  "Select characters you already created separately. This assembly references their saved records; editing a character updates its roster entry.": "Selecciona personajes creados por separado. Este elenco usa sus registros guardados; si editas un personaje, también se actualizará su entrada en el elenco.",
  "Add from your character library": "Añadir desde tu biblioteca",
  "Choose a saved character…": "Elige un personaje guardado…",
  "+ Add Character to Ensemble": "+ Añadir personaje al elenco",
  "For the Thanksgiving example, use five main characters. The tool itself does not assert a platform character limit.": "En el ejemplo de Acción de Gracias se usan cinco personajes principales. Esta herramienta no establece un límite oficial de personajes de la plataforma.",
  "📎 Existing Fizzz bots": "📎 Bots existentes en Fizzz",
  "Once each character is created on Fizzz, use the platform's Multi-Character creation screen to select those existing characters. This studio prepares the content and records their URLs/IDs; it does not connect to Fizzz's private upload interface.": "Una vez creados los personajes en Fizzz, selecciónalos desde la pantalla de creación de multibots de la plataforma. Este estudio prepara el contenido y conserva sus URL/ID; no se conecta al sistema privado de publicación de Fizzz.",
  "MULTI-BOT SETUP": "CONFIGURACIÓN DEL MULTIBOT",
  "Group scenario & lore": "Escenario e historia del grupo",
  "Separate from individual bots": "Separado de los bots individuales",
  "START HERE · HOW THIS BUILDER WORKS": "EMPIEZA AQUÍ · CÓMO FUNCIONA EL CREADOR",
  "Five steps to your multi-character bot": "Cinco pasos para crear tu multibot",
  "A multi-bot links": "Un multibot reúne",
  "already-created individual characters": "personajes individuales creados previamente",
  ". It does not turn one group profile into five standalone bots. Follow these steps in order:": ". No convierte un perfil grupal en cinco bots individuales. Sigue estos pasos en orden:",
  "Build each person separately.": "Crea cada personaje por separado.",
  "Use Character Library (Tab 01) to give each person a name, adult age, portrait, Core Personality, individual greeting and Worldbooks. Press": "Usa la Biblioteca de personajes (pestaña 01) para asignar nombre, edad adulta, retrato, personalidad principal, mensaje inicial individual y libros de mundo. Pulsa",
  "Save Individual Character": "Guardar personaje individual",
  "for each one.": "para cada uno.",
  "Download their upload kits.": "Descarga sus kits de subida.",
  "Select": "Elige",
  "Download Bot Upload Kit ZIP + Image": "Descargar ZIP del bot con imagen",
  "for each character, or": "para cada personaje, o",
  "All Character Kits ZIP + Portraits": "Todos los kits ZIP con retratos",
  "later. Extract the ZIP to find the real": "más adelante. Extrae el ZIP para encontrar el archivo real",
  "and text files.": "y los archivos de texto.",
  "Create those individuals on Fizzz.": "Crea esos personajes individuales en Fizzz.",
  "In Fizzz Creator on the web, create each bot separately. Upload the matching PNG, paste its own fields, and save or publish. Come back to Tab 01, record each Fizzz URL/ID and tick that it was created.": "En Fizzz Creator (web), crea cada bot por separado. Sube su PNG correspondiente, copia sus campos y guarda o publica. Después vuelve a la pestaña 01, registra la URL o ID de cada personaje y márcalo como creado.",
  "Choose the saved characters here.": "Selecciona aquí los personajes guardados.",
  "In the left-hand roster, select each character from your library and press": "En el elenco de la izquierda, selecciona cada personaje de tu biblioteca y pulsa",
  "Add Character to Ensemble": "Añadir personaje al elenco",
  ". Reorder or remove them as needed; they remain independent bots.": ". Puedes cambiar el orden o quitarlos según necesites; seguirán siendo bots independientes.",
  "Write and export the group story.": "Escribe y exporta la historia grupal.",
  "Complete the title, public description, group opening and shared lore below. Press": "Completa el título, la descripción pública, el mensaje inicial grupal y la historia compartida. Pulsa",
  "Save Multi-Bot Setup": "Guardar configuración del multibot",
  "and download the kits. In Fizzz's Multi-Character creator, select the": "y descarga los kits. En el creador de multibots de Fizzz, selecciona los",
  "existing characters": "personajes ya creados",
  ", add the ensemble content, test and publish.": ", añade el contenido grupal, prueba el resultado y publícalo.",
  "Important:": "Importante:",
  "Saving or exporting here does not upload a bot to Fizzz. The ZIP is a creator kit, not a native Fizzz import. The English / Español switch translates this website and the included guides,": "Guardar o exportar aquí no sube ningún bot a Fizzz. El ZIP es un kit para creadores, no un formato de importación nativo de Fizzz. El selector English / Español traduce esta página y sus instrucciones,",
  "not the character text you write": "no los textos de los personajes que escribas",
  ".": ".",
  "↗ Go to Character Library": "↗ Ir a la biblioteca",
  "↗ Full publishing checklist": "↗ Guía completa de publicación",
  "Open a saved ensemble": "Abrir un multibot guardado",
  "New ensemble…": "Nuevo multibot…",
  "Multi-bot title": "Título del multibot",
  "Group opening scene": "Escena inicial del grupo",
  "Group interaction and continuity rules": "Reglas de interacción y continuidad",
  "✧ Shared setting & Worldbooks": "✧ Escenario y libros de mundo compartidos",
  "Use these for ensemble-specific setting, interaction and secrets. Character Worldbooks remain on each standalone record.": "Úsalos para el entorno, las interacciones y los secretos del grupo. Los libros de mundo de cada personaje permanecen en su registro individual.",
  "✓ Save Multi-Bot Setup": "✓ Guardar multibot",
  "📦 All Character Kits ZIP + Portraits": "📦 Todos los kits ZIP con retratos",
  "↓ Assembly Instructions TXT": "↓ Instrucciones de montaje TXT",
  "↓ Full Project Backup JSON": "↓ Copia de seguridad completa JSON",
  "Delete Saved Setup": "Borrar multibot guardado",
  "THE CORRECT FIZZZ WORKFLOW": "FLUJO CORRECTO EN FIZZZ",
  "Individual bots first.": "Primero los bots individuales.",
  "Multi-bot second.": "Después el multibot.",
  "Create each character separately.": "Crea cada personaje por separado.",
  "Give Miles, Wren, Sebastian, Genevieve and Elias their own standalone profiles, personality, initial message, portrait and individual lore. Save each in your library.": "Crea perfiles, personalidades, mensajes iniciales, retratos y libros de mundo independientes para Miles, Wren, Sebastian, Genevieve y Elias. Guárdalos en tu biblioteca.",
  "Download each character’s Upload Kit ZIP.": "Descarga el ZIP de cada personaje.",
  "One ZIP contains their public profile, Core Personality, individual opening, separate Worldbooks, restorable JSON,": "Cada ZIP contiene el perfil público, la personalidad principal, el mensaje inicial individual, los libros de mundo separados, un JSON restaurable",
  "and a real profile-image.png": "y un archivo profile-image.png real",
  ". Unzip it and upload the PNG through Fizzz’s image control. Alternatively, download an": ". Extrae el ZIP y sube el PNG desde el selector de imágenes de Fizzz. También puedes descargar un",
  "All Character Kits ZIP": "ZIP con los kits de todos los personajes",
  "from the group editor to collect every cast member’s files at once.": "desde el editor del grupo para reunir todos los archivos del elenco.",
  "Create/upload those five characters inside Fizzz.": "Crea o sube los cinco personajes a Fizzz.",
  "Enter each field into the corresponding standalone bot. Publish or save as Fizzz requires; then record its URL/ID back in this studio.": "Completa los campos de cada bot individual. Guarda o publica según indique Fizzz; luego registra su URL o ID en este estudio.",
  "Create the Multi-Character bot on Fizzz.": "Crea el multibot en Fizzz.",
  "In Fizzz's multibot builder, choose the already-created characters from the list, instead of trying to upload a single combined character card.": "En el creador de multibots de Fizzz, elige los personajes previamente creados de la lista en lugar de intentar subir una tarjeta grupal única.",
  "Transfer the group scenario.": "Transfiere el escenario grupal.",
  "Use the group's title, bio, opening, shared Worldbooks, and interaction guidance. Follow the fields Fizzz actually offers. Test entrances, speaking order, continuity and {{user}} autonomy.": "Usa el título, la biografía, el mensaje inicial, los libros de mundo compartidos y las reglas de interacción del grupo. Respeta los campos disponibles en Fizzz. Prueba las intervenciones, el orden de diálogo, la continuidad y la autonomía de {{user}}.",
  "The portrait file inside each ZIP is a standard PNG ready for selection in a website image-upload field.": "El retrato de cada ZIP es un PNG estándar, listo para seleccionarlo en el campo de subida de imágenes de la web.",
  "The ZIP itself is not a verified native Fizzz import.": "El ZIP no es un formato de importación nativo de Fizzz verificado.",
  "Unzip first, upload the PNG separately, and enter/copy the corresponding profile and lore into Fizzz. Direct publishing would require an authorized Fizzz integration or API.": "Primero extrae el ZIP, sube el PNG por separado y copia los datos del perfil y del mundo a Fizzz. Para publicar directamente se necesitaría una integración o API autorizada de Fizzz.",
  "Create individual bots →": "Crear bots individuales →",
  "Assemble your cast →": "Montar el elenco →",
  "Open Fizzz ↗": "Abrir Fizzz ↗",
  "VELVETRUIN · MULTI-CHARACTER STUDIO · Works in your browser. Export a backup before changing devices.": "VELVETRUIN · ESTUDIO MULTIPERSONAJE · Funciona en tu navegador. Exporta una copia antes de cambiar de dispositivo.",
  "Search your characters…": "Buscar personajes…",
  "Search saved characters": "Buscar personajes guardados",
  "Male": "Masculino",
  "Best friend, secretly in love": "Mejor amigo, enamorado en secreto",
  "A short hook readers will see before chatting.": "Un gancho breve que verán los lectores antes de chatear.",
  "Identity, appearance, psychological motivations, independent goals, emotional habits, boundaries and speech style. Keep Worldbook lore separate.": "Identidad, apariencia, motivaciones, objetivos propios, hábitos emocionales, límites y forma de hablar. Mantén la historia de mundo separada.",
  "A standalone scene for this bot. The ensemble opening is written separately.": "Una escena inicial individual para este bot. La introducción grupal se escribe por separado.",
  "AnyPOV, Drama, Friends to Lovers, Slow Burn": "AnyPOV, Drama, Amigos a amantes, Romance lento",
  "Paste the live individual character URL or ID after publishing": "Pega la URL o ID del personaje individual después de publicarlo",
  "The invitation, the emotional hook and the scandals.": "La invitación, el gancho emocional y los escándalos.",
  "The ensemble's initial message, with naturally overlapping characters and player agency.": "El mensaje inicial del grupo, con intervenciones naturales entre personajes y libertad para el jugador.",
  "Who knows what, character autonomy, never writing the player's actions, when each character speaks, slow-burn progression.": "Quién sabe qué, autonomía de los personajes, no escribir acciones del jugador, cuándo habla cada uno y progresión gradual.",
  "Worldbook 1": "Libro de mundo 1",
  "Worldbook 2": "Libro de mundo 2",
  "Worldbook 3": "Libro de mundo 3",
  "Title": "Título",
  "Activation": "Activación",
  "Always active": "Siempre activo",
  "Keyword activated": "Activado por palabras clave",
  "Keywords / triggers": "Palabras clave / activadores",
  "Worldbook body": "Contenido del libro de mundo",
  "Setting, interaction, personal lore": "Escenario, interacción e historia personal",
  "Optional trigger terms": "Palabras clave opcionales",
  "Keep this lore separate from Core Personality.": "Mantén esta historia separada de la personalidad principal.",
  "Edit": "Editar",
  "Duplicate": "Duplicar",
  "Delete": "Eliminar",
  "TXT": "TXT",
  "📦 Kit + PNG": "📦 Kit + PNG",
  "Remove": "Quitar",
  "Edit bot": "Editar bot",
  "↑": "↑",
  "↓": "↓",
  "No saved characters yet. Start with one standalone bot.": "Aún no hay personajes guardados. Empieza creando un bot individual.",
  "No characters match your search.": "No hay personajes que coincidan con tu búsqueda.",
  "✓ Created on Fizzz": "✓ Creado en Fizzz",
  "◇ Not marked created on Fizzz": "◇ Aún no se ha marcado como creado en Fizzz",
  "⚠ Create standalone bot on Fizzz first": "⚠ Primero crea el bot individual en Fizzz",
  "No characters selected yet. Add individual bots from your saved library.": "Todavía no hay personajes seleccionados. Añade bots individuales desde tu biblioteca.",
  "Missing character ID": "Falta el ID del personaje",
  "Saved locally": "Guardado localmente",
  "Unsaved changes": "Cambios sin guardar",
  "Worldbooks": "Libros de mundo",
  "Fizzz Multi-Character Studio · VelvetRuin": "Estudio Multibot de Fizzz · VelvetRuin"
};
var LANG_KEY="vr.fizzz.multi-studio.interface-language";
var chosen="en", originalNodes=new WeakMap(), originalAttributes=new WeakMap();
var strings=Object.freeze(ES);
function language(){return chosen;}
function translate(source){
 var clean=String(source==null?"":source).trim();
 if(chosen==="en")return String(source==null?"":source);
 return Object.prototype.hasOwnProperty.call(strings,clean)?strings[clean]:clean;
}
var patterns=[
 [/^Edit (.+)$/,m=>"Editar "+m[1]],
 [/^Loaded (.+)\. Edit and press Save to keep changes\.$/,m=>"Se cargó "+m[1]+". Edita y pulsa Guardar para conservar los cambios."],
 [/^✓ (.+) saved as an independent bot record\. Export it and create the matching Fizzz bot separately\.$/,m=>"✓ "+m[1]+" se guardó como bot independiente. Expórtalo y créalo por separado en Fizzz."],
 [/^✓ Downloaded (.+)'s upload kit with profile-image\.png, fields, separate Worldbooks and a restorable JSON\.$/,m=>"✓ Se descargó el kit de "+m[1]+" con profile-image.png, campos, libros de mundo separados y un JSON restaurable."],
 [/^✓ Downloaded (\d+) individual bot kits WITH their profile-image\.png files and the ensemble setup\.$/,m=>"✓ Se descargaron "+m[1]+" kits individuales con sus imágenes profile-image.png y la configuración del elenco."],
 [/^Loaded saved ensemble (.+)\.$/,m=>"Se cargó el multibot guardado: "+m[1]+"."],
 [/^✓ Imported (\d+) standalone character\(s\) and (\d+) ensemble\(s\) into this browser\.$/,m=>"✓ Se importaron "+m[1]+" personajes y "+m[2]+" multibots en este navegador."],
 [/^Portraits are missing for: (.+)\. Add them before exporting all upload kits\.$/,m=>"Faltan los retratos de: "+m[1]+". Añádelos antes de exportar los kits."],
 [/^(.+) has no saved portrait\. Add its image before downloading the upload kit\.$/,m=>m[1]+" no tiene retrato guardado. Añade una imagen antes de descargar el kit."],
 [/^Missing character ID (.+)$/,m=>"Falta el personaje con ID "+m[1]],
 [/^New multi-bot setup\. Choose saved characters to begin\.$/,()=> "Nuevo multibot. Selecciona personajes guardados para empezar."]
];
var dynamic={
 "Enter a character name.":"Escribe el nombre del personaje.",
 "Each character must be 18 or older.":"Todos los personajes deben tener al menos 18 años.",
 "Use no more than 10 tags.":"Usa un máximo de 10 etiquetas.",
 "A Fizzz text field exceeds its character limit.":"Un campo de Fizzz supera el límite de caracteres.",
 "Discard the unsaved edits to this character?":"¿Descartar los cambios sin guardar de este personaje?",
 "Discard unsaved edits to open another character?":"¿Descartar los cambios sin guardar para abrir otro personaje?",
 "Choose PNG, JPG or WebP.":"Elige PNG, JPG o WebP.",
 "Please choose an image under 12 MB.":"Elige una imagen de menos de 12 MB.",
 "Could not read this image.":"No se pudo leer la imagen.",
 "Image upload failed.":"Falló la carga de la imagen.",
 "Portrait added to this draft. Press Save to keep it in your library.":"Retrato añadido al borrador. Pulsa Guardar para conservarlo en la biblioteca.",
 "Enter a multi-bot title.":"Escribe el título del multibot.",
 "Add at least one saved character.":"Añade al menos un personaje guardado.",
 "A group text field exceeds its character limit.":"Un campo grupal supera el límite de caracteres.",
 "✓ Ensemble saved. Its roster still points to independent characters.":"✓ Multibot guardado. El elenco sigue vinculado a personajes independientes.",
 "No saved ensemble is selected.":"No has seleccionado ningún multibot guardado.",
 "Delete this saved ensemble setup? Individual characters will remain in your library.":"¿Eliminar esta configuración? Los personajes individuales permanecerán en la biblioteca.",
 "Choose a saved character.":"Elige un personaje guardado.",
 "That character is already in the roster.":"Ese personaje ya está en el elenco.",
 "Character added. Save the Multi-Bot Setup to keep the roster.":"Personaje añadido. Guarda el multibot para conservar el elenco.",
 "Export downloaded. Remember to create each individual bot in Fizzz first.":"Exportación descargada. Recuerda crear antes cada bot individual en Fizzz.",
 "Add a portrait first.":"Primero añade un retrato.",
 "✓ Profile image PNG downloaded.":"✓ Se descargó el retrato PNG.",
 "The profile portrait could not be decoded.":"No se pudo interpretar el retrato.",
 "Portrait is empty.":"El retrato está vacío.",
 "Could not convert the portrait to a PNG.":"No se pudo convertir el retrato a PNG.",
 "Some roster characters have been deleted. Remove the missing cards first.":"Algunos personajes del elenco fueron eliminados. Quita primero las tarjetas faltantes.",
 "There are no files to package.":"No hay archivos para empaquetar.",
 "Local storage failed.":"Falló el almacenamiento local.",
 "The profile portrait could not be saved.":"No se pudo guardar el retrato.",
 "Name for the copied standalone character:":"Nombre para el personaje individual duplicado:",
 "Delete":"Eliminar",
 "No character found.":"No se encontró el personaje.",
 "No saved characters yet. Start with one standalone bot.":"Aún no hay personajes guardados. Empieza con un bot individual.",
 "Your library is empty.":"Tu biblioteca está vacía.",
 "No characters match your search.":"No hay personajes que coincidan con tu búsqueda."
};
function message(value){
 var raw=String(value==null?"":value);
 if(chosen!=="es")return raw;
 if(Object.prototype.hasOwnProperty.call(dynamic,raw))return dynamic[raw];
 for(var item of patterns){var m=raw.match(item[0]);if(m)return item[1](m);}
 return raw;
}
function translateNode(node){
 var p=node.parentElement;
 if(!p||p.closest("script,style,textarea,[contenteditable]"))return;
 var source=originalNodes.get(node);
 if(source===undefined){source=node.nodeValue;originalNodes.set(node,source);}
 var m=source.match(/^(\s*)([\s\S]*?)(\s*)$/);
 if(!m||!m[2])return;
 var newText=chosen==="es"? (strings[m[2]]||m[2]) : m[2];
 var expected=m[1]+newText+m[3];if(node.nodeValue!==expected)node.nodeValue=expected;
}
function translateAttrs(element){
 var names=["placeholder","aria-label","title"],base=originalAttributes.get(element);
 if(!base){base={};originalAttributes.set(element,base);}
 for(var attr of names){
  if(!element.hasAttribute(attr))continue;
  if(!Object.prototype.hasOwnProperty.call(base,attr))base[attr]=element.getAttribute(attr);
  var value=base[attr],translated=chosen==="es"?(strings[value]||value):value;
  if(element.getAttribute(attr)!==translated)element.setAttribute(attr,translated);
 }
}
function apply(){
 if(!document.body)return;
 document.documentElement.lang=chosen;
 document.querySelectorAll("[data-lang]").forEach(function(button){
  var selected=button.dataset.lang===chosen;
  button.setAttribute("aria-pressed",selected?"true":"false");
  button.classList.toggle("active",selected);
 });
 var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 for(var node;node=walker.nextNode();)translateNode(node);
 document.querySelectorAll("[placeholder],[aria-label],[title]").forEach(translateAttrs);
 var pageTitle="Fizzz Multi-Character Studio · VelvetRuin";
 document.title=chosen==="es"?(strings[pageTitle]||pageTitle):pageTitle;
}
function setLanguage(value){
 chosen=value==="es"?"es":"en";
 try{localStorage.setItem(LANG_KEY,chosen);}catch(e){}
 apply();
}
function initialize(){
 try{chosen=localStorage.getItem(LANG_KEY)==="es"?"es":"en";}catch(e){}
 var param=new URLSearchParams(location.search).get("lang");
 if(param==="es"||param==="en")chosen=param;
 document.querySelectorAll("[data-lang]").forEach(function(button){button.addEventListener("click",function(){setLanguage(button.dataset.lang);});});
 apply();
 var obs=new MutationObserver(function(records){
  if(!records.some(function(rec){return rec.addedNodes.length||rec.removedNodes.length;}))return;
  apply();
 });
 obs.observe(document.body,{subtree:true,childList:true});
}
window.FizzzMultiI18n=Object.freeze({language:language,message:message,apply:apply,setLanguage:setLanguage,translate:translate});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize();
})();