'use strict';
/* The Ghost of Edinburgh — standalone, dependency-free prototype.
 * A fantasy adventure. Historical facts are separated from invented story beats.
 */
(() => {
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W=960,H=540,GROUND=453,SAVE='ghost-edinburgh-save-v1',SCORES='ghost-edinburgh-scores-v1';
const $ = id => document.getElementById(id);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const ROOM={
 cellar:{name:'The Black Rose Cellar',tag:'THE MORNING AFTER THE NIGHT BEFORE',style:'cellar',left:null,right:'bar',platforms:[{x:415,y:361,w:174}]},
 bar:{name:'The Black Rose Tavern',tag:'A PLACE OF QUESTIONABLE WISDOM',style:'bar',left:'cellar',right:'cowgate',platforms:[{x:630,y:348,w:165}]},
 cowgate:{name:'The Cowgate',tag:'OLD TOWN · AFTER DARK',style:'street',left:'bar',right:'cinema',platforms:[{x:590,y:345,w:155}]},
 cinema:{name:'The Banshee Cinema',tag:'NO TALKING DURING THE FEATURE',style:'cinema',left:'cowgate',right:'passage',platforms:[{x:380,y:345,w:140}]},
 passage:{name:'The Banshee Passage',tag:'BELOW NIDDRY STREET',style:'passage',left:'cinema',right:'vault',platforms:[{x:320,y:347,w:130}]},
 workshop:{name:"Deacon Brodie's Workshop",tag:'LOCKS MADE · LOCKS BROKEN',style:'workshop',left:'cowgate',right:null,platforms:[{x:135,y:348,w:140}]},
 vault:{name:'The South Bridge Vaults',tag:'THE STONES REMEMBER',style:'vault',left:'passage',right:'chamber',platforms:[{x:155,y:348,w:130}]},
 chamber:{name:'The Stone Circle',tag:'AN INVENTED MYSTERY INSPIRED BY LOCAL FOLKLORE',style:'chamber',left:'vault',right:null,platforms:[{x:750,y:358,w:130}]}
};
const FACTS={
 oldtown:{title:'Auld Reekie',kind:'HISTORY',text:'Edinburgh acquired the nickname “Auld Reekie”, traditionally linked to the smoke and smells of the densely populated city. Its cramped Old Town was a world of closes, tenements and narrow streets.',source:'https://www.edinburghmuseums.org.uk/'},
 brodie:{title:'Deacon Brodie · 1788',kind:'HISTORY',text:'William Brodie was a respected Edinburgh cabinetmaker and town councillor who also led a gang of burglars. His work with locks made his secret crimes especially notorious. He was executed in 1788.',source:'https://www.historic-uk.com/HistoryUK/HistoryofScotland/Deacon-William-Brodie/'},
 westport:{title:'The West Port Murders · 1828',kind:'HISTORY',text:'William Burke and William Hare murdered 16 people and sold their bodies for anatomy lessons in Edinburgh. Their victims deserve to be remembered as people, not reduced to a gruesome curiosity.',source:'https://www.nms.ac.uk/past-exhibitions/anatomy-a-matter-of-death-and-life'},
 bridge:{title:'The South Bridge',kind:'HISTORY',text:'Edinburgh’s South Bridge was built in the 1780s. The arches concealed vaults originally intended for storage and workshops, later used in other ways as conditions changed.',source:'https://www.edinburgh.gov.uk/downloads/file/37896/rp04c-south-bridge-structures-report-final'},
 vaults:{title:'Lives Beneath the Streets',kind:'HISTORY',text:'The South Bridge vaults served as working and storage spaces, and some became damp and unsuitable. Stories of the people who lived and worked below street level form part of the darker side of Edinburgh’s growth.',source:'https://www.auldreekietours.com/tours/the-vaults-tour/'},
 mortsafe:{title:'The Body-Snatching Panic',kind:'HISTORY',text:'In the early nineteenth century, some families used heavy iron “mortsafes” to stop grave robbers stealing recently buried bodies. Burke and Hare, however, killed their victims rather than robbing graves.',source:'https://www.nms.ac.uk/discover-catalogue/the-coffins-found-on-arthurs-seat'},
 circle:{title:'The Haunted Stone Circle',kind:'FOLKLORE & FICTION',text:'Auld Reekie Tours describes a stone circle and former modern witchcraft temple in the vaults. This game’s magical runes, bell and trapped Fire Ghost are entirely fictional; they are not historical claims.',source:'https://www.auldreekietours.com/tours/the-vaults-tour/'}
};
const ITEMS={crank:{label:'Iron crank',emoji:'⚙️'},wax:{label:'Wax impression',emoji:'🕯️'},key:{label:'Brass key',emoji:'🗝️'}};
const BASE_OBJECTS={
 cellar:[{id:'water',x:185,y:GROUND,label:'Water barrel',icon:'💧'},{id:'crank',x:692,y:GROUND,label:'Loose iron crank',icon:'⚙️'},{id:'oldtown',x:478,y:361,label:'Old inscription',icon:'📜'}],
 bar:[{id:'water',x:171,y:GROUND,label:'Free drinking water',icon:'💧'},{id:'bartender',x:420,y:GROUND,label:'The bartender',icon:'🍺'}],
 cowgate:[{id:'workshopDoor',x:315,y:GROUND,label:'Brodie’s workshop',icon:'🚪'},{id:'westport',x:668,y:345,label:'Weathered notice',icon:'📜'}],
 cinema:[{id:'wax',x:233,y:GROUND,label:'Strange wax impression',icon:'🕯️'},{id:'projector',x:728,y:GROUND,label:'Silent projector',icon:'🎞️'},{id:'bansheeghost',x:347,y:GROUND,label:'Little Banshee Ghost',icon:'👻'},{id:'water',x:565,y:GROUND,label:'Water station',icon:'💧'},{id:'mortsafe',x:447,y:345,label:'Old film poster',icon:'📜'}],
 passage:[{id:'bridge',x:385,y:347,label:'Builders’ records',icon:'📜'},{id:'gate',x:780,y:GROUND,label:'Locked iron gate',icon:'🔒'}],
 workshop:[{id:'brodie',x:202,y:348,label:'Brodie’s ledger',icon:'📖'},{id:'machine',x:662,y:GROUND,label:'Key-cutting bench',icon:'🗝️'}],
 vault:[{id:'vaults',x:205,y:348,label:'Torn inventory',icon:'📜'},{id:'valve',x:390,y:GROUND,label:'Broken sluice',icon:'⚙️'},{id:'fireghost',x:755,y:GROUND,label:'Fire Ghost',icon:'🔥'}],
 chamber:[{id:'circle',x:107,y:GROUND,label:'Stone plaque',icon:'📜'},{id:'rune0',x:300,y:GROUND,label:'First rune',icon:'✧'},{id:'rune1',x:492,y:GROUND,label:'Second rune',icon:'✧'},{id:'rune2',x:685,y:GROUND,label:'Third rune',icon:'✧'},{id:'bell',x:860,y:358,label:'Silent bell',icon:'🔔'}]
};
const initial=()=>({room:'cellar',x:92,y:GROUND,vy:0,elapsed:0,wobble:68,water:0,falls:0,inventory:[],selected:-1,found:[],flags:{gate:false,drained:false,fire:false,projector:false,complete:false},runes:[0,2,1],hints:0,steps:0,scoreSaved:false});
let state=initial(),keys={left:false,right:false},jumpRequested=false,toastUntil=0,toastText='',modalOpen=false,running=false,lastFrame=performance.now(),lastSave=0,blink=0,fireBob=0,randomFallCooldown=0;
let soundOn=false,audioCtx=null;
let ghost={x:state.x,y:state.y,vy:0,onGround:true,face:1,tumble:0};
const storGet=(k)=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
const storSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
function note(text,duration=3000){toastText=text;toastUntil=performance.now()+duration;$('toast').textContent=text;$('toast').classList.add('show');}
function beep(freq=440,dur=.08){if(!soundOn)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='triangle';o.frequency.value=freq;g.gain.value=.035;o.connect(g).connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.stop(audioCtx.currentTime+dur);}catch{}}
function save(){if(!state.flags.complete)storSet(SAVE,{...state,x:ghost.x,y:ghost.y,vy:0});}
function load(){const s=storGet(SAVE);if(!s||!ROOM[s.room]||!Array.isArray(s.inventory)||!s.flags)return false;state={...initial(),...s,flags:{...initial().flags,...s.flags}};ghost={x:clamp(s.x||92,25,925),y:GROUND,vy:0,onGround:true,face:1,tumble:0};return true;}
function reset(){state=initial();ghost={x:92,y:GROUND,vy:0,onGround:true,face:1,tumble:0};storSet(SAVE,null);refresh();}
const owns=id=>state.inventory.includes(id);
function give(id){if(owns(id))return; if(state.inventory.length>=3){note('Your pockets are full. Use something first!');return false;}state.inventory.push(id);state.selected=state.inventory.length-1;beep(560);note(`Picked up: ${ITEMS[id].label}`);refresh();save();return true;}
function take(id){const i=state.inventory.indexOf(id);if(i!==-1)state.inventory.splice(i,1);state.selected=state.inventory.length?Math.min(state.selected,state.inventory.length-1):-1;refresh();save();}
function selected(){return state.inventory[state.selected];}
function unlockFact(id){if(state.found.includes(id))return;state.found.push(id);note(`📖 Historical secret unlocked: ${FACTS[id].title}`,3600);beep(780,.15);refresh();save();}
function hydrated(){state.water++;state.wobble=Math.max(12,state.wobble-30);note('A glass of water. Fire Ghost approves. Remember: only time sobers you up.',4600);beep(650);refresh();save();}
function activeObjects(){return BASE_OBJECTS[state.room].filter(o=>{
 if(o.id==='crank'&&!owns('crank')&&state.flags.drained===false&&state.steps>=0)return true;
 if(o.id==='crank')return false;
 if(o.id==='wax')return !owns('wax')&&!owns('key')&&!state.flags.gate;
 if(o.id==='fireghost')return !state.flags.fire;
 if(o.id==='gate')return !state.flags.gate;
 return true;
});}
function nearest(){const arr=activeObjects().map(o=>({...o,d:Math.abs(ghost.x-o.x)+Math.abs(ghost.y-o.y)*1.3})).sort((a,b)=>a.d-b.d);return arr[0]&&arr[0].d<106?arr[0]:null;}
function nearestUsable(){const o=nearest();if(!o)return null;return o;}
function interact(){if(modalOpen||!running)return;const o=nearest();if(!o){note('Nothing nearby to examine.');return;}const id=o.id;
 if(id==='water'){hydrated();return;}
 if(id==='crank'){give('crank');return;}
 if(id==='wax'){give('wax');return;}
 if(FACTS[id]){unlockFact(id);factModal(id);return;}
 if(id==='bansheeghost'){say('Little Banshee Ghost','“I kept saying I was fine. Now I haunt the water station.”','“Listen to Fire Ghost. Have some water, take your time, and look out for your pals. Also, there’s something useful in this cinema.”');return;}
 if(id==='bartender'){
   say('The Black Rose Bartender','“You were asleep on a barrel. Again. And no, the cellar is not a hotel.”','“Take the water. That iron crank behind you might be useful. There’s something peculiar happening over at the Banshee.”');return;
 }
 if(id==='workshopDoor'){changeRoom('workshop',90);return;}
 if(id==='machine'){say('An Ingenious Device','An old key-cutting machine rests beside a sheet of brass. On a note: “An impression comes first; the key follows.”',owns('wax')?'Select the wax impression in your pockets, then press USE.': 'Perhaps a wax impression is hidden somewhere else in Edinburgh.');return;}
 if(id==='projector'){say('The Banshee Cinema','A strange film reel shows three empty shapes. The lamp has gone cold.',state.flags.fire?'Fire Ghost can ignite it. Stand nearby and press USE.':'It needs a flame to reveal the picture. Perhaps you could find someone who is literally on fire.');return;}
 if(id==='gate'){say('The Iron Gate','“PROPERTY OF SOMEONE WHO NEVER RETURNED.” The lock is remarkably fine.',owns('key')?'Your brass key might fit. Select it and press USE.':'It will take a specially cut key to get through.');return;}
 if(id==='valve'){say('The Flooded Vault','A narrow stone channel blocks the passage. The sluice has lost its handle.',owns('crank')?'Select the iron crank and press USE.':'There might be a replacement handle in an old cellar.');return;}
 if(id==='fireghost'){if(!state.flags.drained){say('Fire Ghost','“HELP! I’M TRAPPED ON THIS SIDE!”','“And NO, I am not getting into that water!”');return;}state.flags.fire=true;beep(850,.3);say('FIRE GHOST RESCUED!','“About time! I’ve been stuck here arguing with the damp for centuries.”','Fire Ghost will now follow you. Perhaps he can light the projector in the Banshee Cinema.');refresh();save();return;}
 if(id.startsWith('rune')){const n=Number(id.slice(-1));state.runes[n]=(state.runes[n]+1)%3;beep(390+n*110);note(`Rune ${n+1}: ${['KEY','FLAME','CROWN'][state.runes[n]]}`);save();return;}
 if(id==='bell'){if(!state.flags.fire){say('The Silent Bell','The bell is cold and silent. A nearby carving reads: “Even a candle needs a flame.”','Find Fire Ghost first.');return;}
 if(!state.flags.projector){say('The Silent Bell','Three stones must be aligned, but their order is hidden.','A film at the Banshee might reveal the pattern if its projector is lit.');return;}
 if(state.runes.join(',')==='0,1,2')complete();else say('The Silent Bell','The stones stir, then sink back into silence.','The order is wrong. Find the projector’s hidden clue, then turn each rune by examining it.');return;}
}
function use(){if(modalOpen||!running)return;const o=nearestUsable();if(!o){note('Move closer to something before using an item.');return;}
 const it=selected(),id=o.id;
 if(id==='machine'&&it==='wax'){if(state.wobble>57){note('Your hands are too shaky. Find some water and take your time.',3700);return;}take('wax');give('key');unlockFact('brodie');say('The Brass Key','A brass key clicks free from Brodie’s machine.','The original Brodie really was known for his skill with locks. Ours is a fictional puzzle.');return;}
 if(id==='gate'&&it==='key'){take('key');state.flags.gate=true;beep(580,.2);say('A Door Opens','CLICK. The old gate releases with a satisfied groan.','Beyond it lie the South Bridge vaults.');refresh();save();return;}
 if(id==='valve'&&it==='crank'){take('crank');state.flags.drained=true;state.wobble=Math.min(state.wobble+5,100);beep(310,.3);say('The Sluice Turns','You fit the crank and turn it. Centuries of water begin to drain away.','“Mind your boots,” says a familiar voice. Fire Ghost is waiting across the room.');refresh();save();return;}
 if(id==='projector'&&state.flags.fire&&!state.flags.projector){state.flags.projector=true;beep(910,.2);say('THE SECRET REEL','Fire Ghost lights the projector. Three symbols blaze across the screen:','<strong>KEY → FLAME → CROWN</strong><br>Remember their order. The stone circle beneath Edinburgh awaits.');refresh();save();return;}
 if(id==='projector'&&state.flags.projector){say('The Secret Reel','The film still shows the symbols.','<strong>KEY → FLAME → CROWN</strong>');return;}
 if(id==='bell'){interact();return;}
 if(it)note(`${ITEMS[it].label} does nothing useful here.`,2600);
 else note('Select something in your pockets first — or LOOK / TALK to investigate.');
}
function say(title,body,extra=''){showModal('A GHOST STORY',title,`<p>${body}</p>${extra?`<div class="aside">${extra}</div>`:''}`,[['Carry on',closeModal]]);}
function factModal(id){const f=FACTS[id];showModal(f.kind,f.title,`<p>${f.text}</p><small>${f.kind==='HISTORY'?'Based on documented Edinburgh history.':'The supernatural elements are fictional.'} <a href="${f.source}" target="_blank" rel="noopener noreferrer">Read more ↗</a></small>`,[['Keep exploring',closeModal]]);}
function showModal(eyebrow,title,body,buttons){modalOpen=true;$('modal').hidden=false;$('modal-eyebrow').textContent=eyebrow;$('modal-title').textContent=title;$('modal-body').innerHTML=body;$('modal-actions').replaceChildren();buttons.forEach(([label,callback,isSecondary])=>{const b=document.createElement('button');b.type='button';b.textContent=label;if(isSecondary)b.className='secondary';b.addEventListener('click',callback);$('modal-actions').appendChild(b)});$('modal-actions').querySelector('button')?.focus();}
function closeModal(){modalOpen=false;$('modal').hidden=true;keys.left=keys.right=false;refresh();}
function goIntro(){showModal('A HAUNTED PUBS ADVENTURE','The Ghost of Edinburgh',`<p>Our little ghost has woken up in the <strong>Black Rose cellar</strong> with an almighty headache and no memory of last night. Meanwhile <strong>Fire Ghost</strong> is missing, and something deep beneath Edinburgh has stopped ringing.</p><p>Explore the <strong>Banshee Labyrinth</strong>, solve puzzles using objects found across the city, and uncover its dark history.</p><div class="aside">Move with the arrows. Press E to investigate. Select an item in your pockets and press U to use it. SPACE jumps. On a phone, use the buttons underneath the game.</div><p><small>Playtime: this first chapter is a shorter playable prototype of the planned 15–20-minute adventure.</small></p>`,[
 ['Start new game',()=>{reset();closeModal();running=true;say('An Unfortunate Awakening','“Ohhhh, my head. Was that last night or last century?”','Perhaps find some water. The crank nearby looks important.');}],
 ...(storGet(SAVE)?.room?[['Continue previous game',()=>{load();running=true;closeModal();refresh();}]]:[]),
 ['Hall of fame',()=>leaderboard('today'),true]
]);}
function hint(){if(!running){goIntro();return;}state.hints++;let msg='';if(state.room==='cellar'&&!owns('crank')&&!state.flags.drained)msg='Look for a loose iron crank near the barrels. Take it with E. Drinking water helps with thirst, but only time can sober you up.';
 else if(!owns('wax')&&!owns('key')&&!state.flags.gate)msg='At the Banshee Cinema, there is a wax impression. Explore the Cowgate to find Deacon Brodie’s workshop.';
 else if(owns('wax'))msg='Take the wax to Brodie’s workshop, reachable from the Cowgate. Use it on the key-cutting machine. If you’re wobbly, have a glass of water.';
 else if(owns('key'))msg='The iron gate is at the far right of the Banshee Passage. Equip the brass key and press USE.';
 else if(!state.flags.gate)msg='Find a wax impression in the cinema, then make a key in Brodie’s workshop.';
 else if(!state.flags.drained)msg='The broken sluice in the vaults needs the iron crank from the Black Rose cellar. Select it and press USE nearby.';
 else if(!state.flags.fire)msg='Cross the drained vault and TALK to Fire Ghost.';
 else if(!state.flags.projector)msg='Go back to the Banshee Cinema and USE the projector with Fire Ghost following you.';
 else msg='In the Stone Circle, examine each rune to rotate it. The film gave the order: KEY → FLAME → CROWN. Then examine the bell.';
 say('Fire Ghost’s Helpful Hint','“Right, listen carefully. This is what I reckon...”',msg);save();}
function history(){const entries=state.found.map(k=>`<div class="entry"><h3>${FACTS[k].kind} · ${FACTS[k].title}</h3><p>${FACTS[k].text}</p><small><a href="${FACTS[k].source}" target="_blank" rel="noopener noreferrer">Historical source ↗</a></small></div>`).join('');showModal('A HISTORY JOURNAL','The Edinburgh Book of the Dead',entries||'<p>You haven’t found any historical secrets yet. Look for glowing scrolls, posters and plaques scattered through Edinburgh.</p>',[[`Back to adventure (${state.found.length}/7)`,closeModal]]);}
function changeRoom(next,start=next===ROOM[state.room].right?55:905){if(!ROOM[next])return;
 if(state.room==='passage'&&next==='vault'&&!state.flags.gate){note('The iron gate is locked. Maybe there is a key somewhere.');ghost.x=890;return;}
 if(state.room==='vault'&&next==='chamber'&&!state.flags.drained){note('The flooded passage is impassable.');ghost.x=885;return;}
 state.room=next;ghost.x=start;ghost.y=GROUND;ghost.vy=0;ghost.onGround=true;state.x=start;state.y=GROUND;note(`${ROOM[next].name}`,2100);beep(250,.05);refresh();save();}
function refresh(){const room=ROOM[state.room];$('room-title').textContent=room.name;$('wobble-fill').style.width=`${Math.round(state.wobble)}%`;$('wobble-label').textContent=`${Math.round(state.wobble)}%`;$('secret-count').textContent=`SECRETS ${state.found.length}/7`;const inv=$('inventory-slots');inv.replaceChildren();for(let i=0;i<3;i++){const id=state.inventory[i],b=document.createElement('button');b.type='button';b.className=`slot ${id?(i===state.selected?'selected':''):'empty'}`;b.innerHTML=id?`<span class="emoji">${ITEMS[id].emoji}</span><span>${ITEMS[id].label}</span>`:`<span class="emoji">○</span><span>Empty</span>`;b.setAttribute('aria-label',id?`Select ${ITEMS[id].label}`:'Empty pocket');b.addEventListener('click',()=>{if(!id)return;state.selected=i;refresh();});inv.appendChild(b)}
 $('selected-label').textContent=selected()?`Selected: ${ITEMS[selected()].label}`:'Select an item, then USE nearby.';
 let mission='Find Fire Ghost and investigate the silent bell.';
 if(!state.flags.gate)mission='Find a way through the locked Banshee passage.';
 else if(!state.flags.drained)mission='Drain the flooded vault and find Fire Ghost.';
 else if(!state.flags.fire)mission='Find Fire Ghost across the drained vault.';
 else if(!state.flags.projector)mission='Return to the Banshee cinema with Fire Ghost.';
 else mission='Visit the stone circle. Align the runes to ring the bell.';
 if(state.flags.complete)mission='Edinburgh saved! You should probably have some water.';
 $('mission-text').textContent=mission;
}
function timeText(t){const s=Math.floor(t);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function computeScore(){return 1000+state.found.length*100+Math.max(0,3-state.hints)*50+Math.max(0,Math.round(300*(1-Math.min(state.elapsed,1200)/1200)));}
function dateEdinburgh(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=x=>parts.find(p=>p.type===x).value;return `${get('year')}-${get('month')}-${get('day')}`;}
function complete(){if(state.flags.complete)return;state.flags.complete=true;running=false;storSet(SAVE,null);const points=computeScore();const body=`<p>Fire Ghost breathes a careful flame across the bell. <strong>BOOOOOONG!</strong> The stones tremble. Every trapped spirit in Auld Reekie is free.</p><p><strong>Our Ghost:</strong> “Well, that was sobering.”<br><strong>Fire Ghost:</strong> “It really wasn't. Only time does that. Drink some water.”</p><div class="aside"><strong>YOUR SCORE: ${points.toLocaleString('en-GB')}</strong><br>Time: ${timeText(state.elapsed)} · Historical secrets: ${state.found.length}/7 · Water breaks: ${state.water} · Falls: ${state.falls} · Hints used: ${state.hints}</div><p><strong>Enjoy the spirits. Don't become one.</strong></p><p><small>This prototype saves high scores on this device only. A shared leaderboard needs an online database.</small></p><label for="player-name">Your leaderboard nickname:</label><input id="player-name" maxlength="16" minlength="2" autocomplete="nickname" placeholder="e.g. Wee Ghostie" />`;
 showModal('YOU SURVIVED AULD REEKIE','Edinburgh Is Saved!',body,[['Save my score',()=>{const field=$('player-name'),name=field.value.trim().replace(/[<>\x00-\x1f]/g,'').slice(0,16);if(name.length<2){field.focus();field.setCustomValidity('Please enter at least two characters');field.reportValidity();field.setCustomValidity('');return;}const scores=storGet(SCORES)||[];scores.push({name,score:points,elapsed:state.elapsed,date:dateEdinburgh(),when:Date.now()});storSet(SCORES,scores.slice(-300));state.scoreSaved=true;leaderboard('today');}],['Replay adventure',()=>{reset();closeModal();running=true;},true]]);
}
function leaderboard(which='today'){const scores=storGet(SCORES)||[],today=dateEdinburgh();const rows=scores.filter(s=>which==='all'||s.date===today).reduce((acc,s)=>{if(!acc[s.name]||s.score>acc[s.name].score)acc[s.name]=s;return acc;},{});const rank=Object.values(rows).sort((a,b)=>b.score-a.score||a.elapsed-b.elapsed).slice(0,10);const content=`<p><small>Prototype leaderboard: scores on <strong>this browser only</strong>. Shared, cross-device scores will follow with a server database.</small></p><div class="pills"><button type="button" id="tab-today" class="${which==='today'?'active':''}">Today</button><button type="button" id="tab-all" class="${which==='all'?'active':''}">All Time</button></div><table class="leaderboard"><thead><tr><th>#</th><th>GHOST</th><th>TIME</th><th>SCORE</th></tr></thead><tbody>${rank.length?rank.map((s,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(s.name)}</td><td>${timeText(s.elapsed)}</td><td>${s.score.toLocaleString('en-GB')}</td></tr>`).join(''):'<tr><td colspan="4">Nobody on the board yet. Be the first!</td></tr>'}</tbody></table>`;
 showModal('THE HAUNTED HALL OF FAME',which==='today'?'Today’s Best Ghosts':'All-Time Legends',content,[['Back to game',()=>{if(state.flags.complete)goIntro();else closeModal();}],['New adventure',()=>{reset();running=true;closeModal();},true]]);$('tab-today').onclick=()=>leaderboard('today');$('tab-all').onclick=()=>leaderboard('all');}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function update(dt){state.elapsed+=dt;state.wobble=clamp(state.wobble+dt*.12,0,95);state.steps+=dt;if(randomFallCooldown>0)randomFallCooldown-=dt;ghost.tumble=Math.max(0,ghost.tumble-dt);
 let dir=(keys.right?1:0)-(keys.left?1:0);const speed=state.wobble>70?174:200;if(dir)ghost.face=dir;
 const wobble=state.wobble>55?Math.sin(state.elapsed*8)*((state.wobble-55)*.03):0;
 ghost.x+=(dir*speed+wobble)*dt;
 if(jumpRequested&&ghost.onGround){ghost.vy=-530;ghost.onGround=false;beep(410,.06);}jumpRequested=false;
 const prevY=ghost.y;ghost.vy+=1130*dt;ghost.y+=ghost.vy*dt;ghost.onGround=false;
 for(const p of ROOM[state.room].platforms){if(ghost.vy>=0 && prevY<=p.y+5 && ghost.y>=p.y && ghost.x+16>=p.x && ghost.x-16<=p.x+p.w){ghost.y=p.y;ghost.vy=0;ghost.onGround=true;}}
 if(ghost.y>=GROUND){ghost.y=GROUND;ghost.vy=0;ghost.onGround=true;}
 if(state.room==='passage'&&!state.flags.gate&&ghost.x>736)ghost.x=736;
 if(state.room==='vault'&&!state.flags.drained&&ghost.x>465)ghost.x=465;
 if(ghost.x<24){if(state.room==='workshop')changeRoom('cowgate',390);else if(ROOM[state.room].left)changeRoom(ROOM[state.room].left,920);else ghost.x=24;}
 if(ghost.x>936){if(ROOM[state.room].right)changeRoom(ROOM[state.room].right,45);else ghost.x=936;}
 if(state.wobble>74 && ghost.onGround && Math.abs(dir)>0 && randomFallCooldown<=0 && Math.sin(state.elapsed*3.5)>0.997){ghost.tumble=.63;state.falls++;randomFallCooldown=10;note('The floor is having another go at you. Time for water?',2400);}
 fireBob+=dt;blink+=dt;
 if(state.elapsed-lastSave>8){lastSave=state.elapsed;save();}
 $('wobble-fill').style.width=`${Math.round(state.wobble)}%`;$('wobble-label').textContent=`${Math.round(state.wobble)}%`;$('clock').textContent=timeText(state.elapsed);$('score').textContent=String(state.flags.complete?computeScore():state.found.length*100+[state.flags.gate,state.flags.drained,state.flags.fire,state.flags.projector].filter(Boolean).length*150).padStart(4,'0')+' PTS';
 const n=nearest();$('prompt').textContent=n?`[E] ${n.label}${selected()?`    [U] use ${ITEMS[selected()].label}`:''}`:'← explore →     SPACE jump';
}
// Procedural vector art: no proprietary graphics or external image files.
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function line(x1,y1,x2,y2,color='#5c4b65',width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function text(s,x,y,size=15,color='#f4deba',font='Georgia',align='center'){ctx.font=`bold ${size}px ${font}`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(s,x,y)}
function glow(x,y,r,c){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function brickwall(c1='#2d2535',c2='#392e43',size=84){rect(0,0,W,H,c1);for(let row=0;row<9;row++){const yy=row*57-4;for(let col=-1;col<Math.ceil(W/size)+1;col++){const xx=col*size+((row%2)*size/2);rect(xx+2,yy+2,size-4,52,(row+col)%4===0?c2:c1);line(xx,yy,xx+size,yy,'#171422',2);line(xx,yy,xx,yy+54,'#211929',1);}}}
function arch(x,y,w,h,inner='#100e1b'){ctx.fillStyle='#59455c';ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w/2);ctx.arc(x+w/2,y+w/2,w/2,Math.PI,0);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();ctx.fillStyle=inner;ctx.beginPath();ctx.moveTo(x+11,y+h);ctx.lineTo(x+11,y+w/2);ctx.arc(x+w/2,y+w/2-1,w/2-11,Math.PI,0);ctx.lineTo(x+w-11,y+h);ctx.closePath();ctx.fill()}
function lantern(x,y,col='#ffc27d'){line(x,y-50,x,y-2,'#74687d',3);glow(x,y,88,col==='red'?'#b5442255':'#ffb85044');rect(x-14,y-10,28,27,'#251e2d');rect(x-9,y-4,18,16,col);rect(x-17,y-13,34,5,'#897382')}
function bottle(x,y){rect(x-7,y-20,14,20,'#527662');rect(x-3,y-30,6,10,'#527662');rect(x-6,y-14,12,7,'#9f8754')}
function cask(x,y){ctx.fillStyle='#59352c';ctx.beginPath();ctx.ellipse(x,y-21,34,41,0,0,Math.PI*2);ctx.fill();rect(x-28,y-53,56,8,'#8b6253');rect(x-32,y-20,64,8,'#856558');ellipse(x,y-20,4,4,'#d4a970')}
function stairs(){for(let i=0;i<6;i++)rect(i*22,GROUND-7-i*9,22,9,'#604c5d')}
function street(){rect(0,0,W,H,'#141523');glow(700,80,310,'#5a335d55');ellipse(775,70,32,32,'#e2d6b3');for(let i=0;i<12;i++){const x=i*92-22,h=205+(i%4)*48;rect(x,GROUND-h,100,h,i%2?'#292535':'#302637');ctx.fillStyle='#382f40';ctx.beginPath();ctx.moveTo(x-7,GROUND-h);ctx.lineTo(x+50,GROUND-h-60);ctx.lineTo(x+109,GROUND-h);ctx.fill();for(let j=0;j<3;j++)for(let k=0;k<2;k++)rect(x+18+k*43,GROUND-h+45+j*48,15,25,(j+k+i)%3?'#59465b':'#b58b62');}
 rect(0,GROUND,960,87,'#403341');for(let i=0;i<24;i++)line(i*45,GROUND+8,i*45-20,GROUND+80,'#514353',1);lantern(480,194);}
function cinema(){brickwall('#251d31','#302437',112);for(let i=0;i<5;i++){rect(20+i*196,120,145,145,'#160e22');rect(27+i*196,127,131,131,i%2?'#6e3948':'#603d58');text(['THE','OLD','TOWN','IS','HAUNTED'][i],93+i*196,188,15,'#e7c48a')}
 rect(0,385,960,68,'#3d293d');for(let i=0;i<8;i++){rect(i*124+15,387,95,39,'#7b3041');rect(i*124+25,410,75,25,'#4f2633')}rect(565,180,115,125,'#1e1724');rect(583,199,80,72,'#3b3749');glow(728,308,100,'#eac48325');}
function tavern(){brickwall('#2d1c28','#422a34',98);rect(0,160,960,15,'#7a492f');rect(0,280,960,13,'#774b33');for(let x=70;x<=850;x+=155){lantern(x,171);bottle(x+35,280);bottle(x+64,280)}rect(0,335,960,120,'#4c2d2c');for(let i=0;i<12;i++)rect(i*88,335,80,15,'#9d6742');text('THE BLACK ROSE',480,112,47,'#d8b279');}
function cellar(){brickwall('#302a37','#37303f',86);arch(65,122,190,300,'#151324');arch(610,95,220,330,'#211926');for(let x of [290,365,820,880])cask(x,GROUND);lantern(470,174);stairs();text('NO SLEEPING ON THE BARRELS',478,78,20,'#bca37b');}
function workshop(){brickwall('#302835','#423342',90);rect(510,290,320,165,'#593f36');rect(520,286,298,13,'#a67b55');for(let i=0;i<5;i++){rect(115+i*163,125,76,120,'#332637');rect(125+i*163,135,55,100,'#75513e');}for(let j=0;j<7;j++){const x=145+j*98;rect(x,170,7,45,'#d6ac6a');ellipse(x+3,215,11,11,'#ac8a59');}lantern(450,176);}
function underground(kind){brickwall(kind==='chamber'?'#262138':'#292633',kind==='chamber'?'#302b43':'#383240',104);for(let x=95;x<=940;x+=250)arch(x-65,90,175,362,kind==='chamber'?'#1b1833':'#181522');if(kind==='passage'){for(let x=180;x<800;x+=215)lantern(x,232);}
 if(kind==='vault'&&!state.flags.drained){rect(480,392,480,62,'#25475b');for(let i=0;i<17;i++)ellipse(500+i*33,399+Math.sin(fireBob*4+i)*4,20,4,'#427488');}
 if(kind==='chamber'){glow(490,360,280,'#6e4ba544');for(let x of [300,492,685]){rect(x-57,360,114,90,'#51445c');rect(x-45,346,90,17,'#71647a');}}
}
function bg(){const kind=ROOM[state.room].style;
 if(kind==='cellar')cellar();else if(kind==='bar')tavern();else if(kind==='street')street();else if(kind==='cinema')cinema();else if(kind==='workshop')workshop();else underground(kind);
 rect(0,GROUND,960,H-GROUND,'#2b2334');rect(0,GROUND,960,6,'#6e5767');for(let x=0;x<960;x+=74)line(x,GROUND+7,x+26,GROUND+80,'#514254',1);
 ROOM[state.room].platforms.forEach(p=>{rect(p.x,p.y,p.w,15,'#79637c');rect(p.x+5,p.y+15,p.w-10,7,'#3b3046');for(let x=p.x+11;x<p.x+p.w;x+=27)line(x,p.y+1,x-6,p.y+12,'#4e3c58',1)});
 if(state.room==='passage'&&!state.flags.gate){for(let x=756;x<811;x+=14)rect(x,218,5,GROUND-218,'#7f8792');rect(747,217,67,13,'#a4a7ae');}
 if(state.room==='chamber'){for(let i=0;i<3;i++){const xx=[300,492,685][i],name=['KEY','FLAME','CROWN'][state.runes[i]];glow(xx,330,65,'#c99d8b28');text(['⚿','♨','♛'][state.runes[i]],xx,331,43,'#f2ce93');text(name,xx,388,12,'#e3c599','monospace');}text('THE BELL REMEMBERS THE ORDER',480,160,20,'#c9a8d9');}
 if(state.room==='bar')text('FREE WATER AVAILABLE',171,290,15,'#ead29c');
 if(state.room==='cowgate'){text('COWGATE',492,90,40,'#dcb782');rect(244,265,144,145,'#241b2e');text('BRODIE',315,258,22,'#e8c690');}
 if(state.room==='cinema')text('BANSHEE CINEMA',480,72,38,'#e0c49e');
 if(state.room==='vault'){text('SOUTH BRIDGE VAULTS',470,84,26,'#d0b49a');if(!state.flags.drained)text('FLOODED',706,373,15,'#91c5d5');}
 if(state.room==='cellar')text('THE BLACK ROSE',730,166,21,'#a98aa4');
 if(state.room==='passage')text('NIDDRY STREET',476,80,27,'#cbb3c5');
}
function drawObjects(){for(const o of activeObjects()){const wave=Math.sin(fireBob*2+o.x)*4;if(o.id==='fireghost'){drawFire(o.x,GROUND-25,1.8,true);continue;}
 if(o.id==='valve'){ellipse(o.x,GROUND-30,38,38,'#4d5769');ellipse(o.x,GROUND-30,27,27,'#9da0ad');ellipse(o.x,GROUND-30,19,19,'#484052');text('?',o.x,GROUND-25,25,'#dac99d');continue;}
 if(o.id==='water'){glow(o.x,GROUND-42,68,'#73badb25');rect(o.x-32,GROUND-57,64,55,'#3b6879');ellipse(o.x,GROUND-58,33,13,'#74acc0');text('WATER',o.x,GROUND-25,13,'#f0e9cd');continue;}
 if(o.id==='gate'){text('🔒',o.x,GROUND-56,32);continue;}
 if(o.id==='machine'){rect(o.x-72,GROUND-75,146,67,'#67503f');rect(o.x-64,GROUND-84,128,12,'#b38c5b');ellipse(o.x+38,GROUND-100,24,24,'#ad9670');text('⚙',o.x+38,GROUND-91,34,'#d9c291');continue;}
 if(o.id==='bartender'){drawNpc(o.x,GROUND);continue;}
 if(o.id==='bansheeghost'){glow(o.x,GROUND-55,61,'#c8a6ea55');ellipse(o.x,GROUND-53,28,35,'#c8addd');ellipse(o.x-9,GROUND-60,4,6,'#242038');ellipse(o.x+10,GROUND-60,4,6,'#242038');text('!',o.x,GROUND-107,21,'#e2baff');continue;}
 if(o.id==='projector'){rect(o.x-50,GROUND-62,104,54,'#443c4b');ellipse(o.x-19,GROUND-67,27,27,'#898694');ellipse(o.x+28,GROUND-67,19,19,'#b7a6a1');glow(o.x+50,GROUND-43,120,state.flags.projector?'#e8d68b88':'#786f8844');continue;}
 if(o.id==='bell'){glow(o.x,305,120,'#e7c18a33');text('🔔',o.x,334,64);continue;}
 if(o.id.startsWith('rune'))continue;
 if(o.id==='workshopDoor'){text('🚪',o.x,GROUND-81,47);continue;}
 const x=o.x,y=o.y-35+wave;glow(x,y,48,'#e7b77f2d');text(o.icon,x,y+13,32);if(Math.abs(ghost.x-x)<135)text(o.label,x,y-27,13,'#f4d5aa');
 }}
function drawFire(x,y,scale=1,behind=false){ctx.save();ctx.translate(x,y+Math.sin(fireBob*6)*5);ctx.scale(scale,scale);glow(0,0,44,'#ff6b2d70');ctx.fillStyle='#fc7b31';ctx.beginPath();ctx.moveTo(-18,21);ctx.bezierCurveTo(-37,3,-4,-7,-12,-32);ctx.bezierCurveTo(2,-24,3,-37,9,-45);ctx.bezierCurveTo(14,-20,31,-7,20,22);ctx.closePath();ctx.fill();ctx.fillStyle='#f4cc5e';ctx.beginPath();ctx.moveTo(-9,18);ctx.bezierCurveTo(-16,6,2,-9,3,-19);ctx.bezierCurveTo(9,-7,19,4,12,19);ctx.closePath();ctx.fill();ellipse(-5,3,3.5,5,'#231e2d');ellipse(9,3,3.5,5,'#231e2d');ctx.restore();if(behind)text('HELP!',x,y-72,12,'#ffc7a1');}
function drawNpc(x,ground){ctx.save();ctx.translate(x,ground);ellipse(0,-30,21,35,'#1a171e');ellipse(0,-66,21,19,'#d0a98e');rect(-25,-85,50,13,'#19151f');rect(-11,-101,22,18,'#17131b');ellipse(-7,-68,2,4,'#2a1e26');ellipse(9,-68,2,4,'#2a1e26');ctx.restore();}
function drawGhost(){ctx.save();let wob=(state.wobble/100)*Math.sin(state.elapsed*8)*9,fall=ghost.tumble>0;ctx.translate(ghost.x,ghost.y-35+Math.sin(fireBob*6)*2);if(fall)ctx.rotate(.9*Math.sin(ghost.tumble*4));else ctx.rotate(wob*Math.PI/180);ctx.scale(ghost.face,1);
 glow(0,0,62,'#b5d9ee1c');ellipse(0,31,24,5,'#070b1880');
 ctx.fillStyle='#f0ecf4';ctx.strokeStyle='#c4c3df';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-26,20);ctx.bezierCurveTo(-33,-3,-32,-35,-13,-42);ctx.bezierCurveTo(7,-52,32,-35,31,-9);ctx.lineTo(30,21);ctx.quadraticCurveTo(23,32,15,23);ctx.quadraticCurveTo(6,35,-2,24);ctx.quadraticCurveTo(-16,34,-23,22);ctx.closePath();ctx.fill();ctx.stroke();
 ellipse(-10,-14,5,8,'#232339');ellipse(11,-14,5,8,'#232339');ellipse(-8,-12,1.5,3,'#f6f1f0');ellipse(12,-12,1.5,3,'#f6f1f0');ctx.strokeStyle='#57465a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(2,-1,7,0.1,Math.PI-.2);ctx.stroke();
 // scarf and glove — our ghost’s signature look
 rect(-29,0,15,10,'#bd5c61');rect(17,2,15,10,'#bd5c61');rect(-15,22,7,9,'#a94355');rect(12,23,7,9,'#a94355');ctx.restore();
 if(state.flags.fire)drawFire(ghost.x-ghost.face*61,ghost.y-33,.75);
}
function render(){ctx.clearRect(0,0,W,H);bg();drawObjects();drawGhost();if(state.wobble>72){rect(0,0,W,6,'#a54b5166');rect(0,H-6,W,6,'#a54b5166');}}
function frame(t){const dt=Math.min(.04,(t-lastFrame)/1000);lastFrame=t;if(running&&!modalOpen)update(dt);render();if(toastText && t>toastUntil){toastText='';$('toast').classList.remove('show')}requestAnimationFrame(frame)}
function keyDown(e){if(['ArrowLeft','ArrowRight','ArrowUp',' ','Spacebar'].includes(e.key))e.preventDefault();if(modalOpen){if(e.key==='Escape'&&running)closeModal();return;}
 if(e.repeat&&['e','E','u','U','h','H'].includes(e.key))return;
 const k=e.key.toLowerCase();if(k==='arrowleft'||k==='a')keys.left=true;if(k==='arrowright'||k==='d')keys.right=true;if(k==='arrowup'||k===' '||k==='w')jumpRequested=true;if(k==='e'||k==='enter')interact();if(k==='u'||k==='q')use();if(k==='h')hint();if(['1','2','3'].includes(k)){const n=Number(k)-1;if(state.inventory[n]){state.selected=n;refresh();}}}
function keyUp(e){const k=e.key.toLowerCase();if(k==='arrowleft'||k==='a')keys.left=false;if(k==='arrowright'||k==='d')keys.right=false;}
window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',()=>{keys.left=keys.right=false;});
for(const ev of ['contextmenu','selectstart','dragstart'])document.querySelector('.touch-controls').addEventListener(ev,e=>e.preventDefault());
for(const b of document.querySelectorAll('[data-control]')){const act=b.dataset.control;
 const down=e=>{e.preventDefault();b.classList.add('active');if(act==='left'||act==='right')keys[act]=true;else if(act==='jump')jumpRequested=true;else if(act==='interact')interact();else if(act==='use')use();};
 const up=e=>{e.preventDefault();b.classList.remove('active');if(act==='left'||act==='right')keys[act]=false;};
 b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);b.addEventListener('pointerleave',up);
}
$('btn-leaderboard').onclick=()=>leaderboard('today');$('btn-journal').onclick=history;$('btn-hint').onclick=hint;$('btn-sound').onclick=()=>{soundOn=!soundOn;$('btn-sound').textContent=soundOn?'♫ ON':'♫ OFF';beep(800);};
$('score').addEventListener('click',()=>leaderboard('today'));$('score').style.cursor='pointer';$('score').title='View the local high-score boards';
refresh();goIntro();requestAnimationFrame(frame);
})();
