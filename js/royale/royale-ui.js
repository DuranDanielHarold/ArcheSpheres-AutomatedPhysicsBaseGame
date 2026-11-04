'use strict';
let royaleUiCards=[],royaleUiPlacements=new Map(),royaleUiClock=0,royaleUiLast=0,royaleUiWarningAge=99,royaleUiState='',royaleUiIdleTimer=0,royaleUiListenersReady=false;
function royaleUiInit(){
 const card=document.getElementById('card'),arena=document.getElementById('arena-outer'),border=document.getElementById('arena-border');if(!card||!arena||!border)return;
 card.classList.add('mode-royale');
 let left=document.getElementById('royale-rail-l'),right=document.getElementById('royale-rail-r');
 if(!left){left=document.createElement('aside');left.id='royale-rail-l';left.className='royale-rail';card.insertBefore(left,arena);}
 if(!right){right=document.createElement('aside');right.id='royale-rail-r';right.className='royale-rail';card.insertBefore(right,arena.nextSibling);}
 let ribbon=document.getElementById('royale-ribbon');if(!ribbon){ribbon=document.createElement('div');ribbon.id='royale-ribbon';ribbon.innerHTML='<div class="royale-ribbon-main"><b class="phase"></b><b class="event"></b><b class="count"></b></div><div class="royale-ribbon-drain"><i></i></div>';border.appendChild(ribbon);}
 let crest=document.getElementById('royale-left-crest');if(!crest){crest=document.createElement('div');crest.id='royale-left-crest';border.appendChild(crest);}
 let rotate=document.getElementById('royale-rotate');if(!rotate){rotate=document.createElement('div');rotate.id='royale-rotate';rotate.innerHTML='<div class="royale-rotate-panel"><b>ROTATE DEVICE</b><span>LANDSCAPE REQUIRED</span></div>';document.body.appendChild(rotate);}
 const controls=document.getElementById('controls');controls.classList.add('royale-controls');
 ['#balance-btn','#balance-status','#audio-panel','.pbtn.new'].forEach(sel=>controls.querySelectorAll(sel).forEach(el=>el.style.display='none'));
 const add=(id,label,fn)=>{let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;b.className='pbtn';b.textContent=label;b.onclick=fn;controls.appendChild(b);}return b;};
 add('royale-sound-btn','SOUND',()=>{if(typeof toggleAudioMute==='function')toggleAudioMute();});
 add('royale-exit-btn','EXIT',()=>showStartScreen());
 const pause=document.getElementById('pbtn');if(pause)pause.textContent='PAUSE';
 if(!royaleUiListenersReady){window.addEventListener('resize',royaleUiViewportChanged,{passive:true});window.addEventListener('pointerdown',royaleUiActivity,{passive:true});window.addEventListener('pointermove',royaleUiActivity,{passive:true});const mq=window.matchMedia('(orientation: landscape)');mq.addEventListener?.('change',royaleUiViewportChanged);royaleUiListenersReady=true;}
 royaleUiBuildCards();royaleUiViewportChanged();royaleUiActivity();
}
function royaleUiBuildCards(){
 const l=document.getElementById('royale-rail-l'),r=document.getElementById('royale-rail-r');if(!l||!r)return;
 l.textContent='';r.textContent='';royaleUiCards=[];
 for(let i=0;i<8;i++){const s=spheres.find(x=>x.faction===i);if(!s)continue;
  const el=document.createElement('button');el.type='button';el.className='royale-card';el.style.setProperty('--faction',ROYALE_FACTION_COLORS[i].color);
  el.innerHTML='<i class="royale-stripe"></i><span class="royale-card-head"><img class="avatar"><b class="name"></b><small class="faction"></small></span><span class="hp-track"><i class="trail"></i><i class="fill"></i></span><span class="card-foot"><b class="hp"></b><i class="stack"><i></i></i></span><span class="status"></span><b class="skull">☠</b><small class="place"></small>';
  el.querySelector('.avatar').src=getSphereIcon(s.key,28);el.querySelector('.name').textContent=s.d.label;el.querySelector('.faction').textContent=i+1;
  el.onclick=()=>{const c=royaleCamera;if(!c)return;if(c.mode==='follow'&&c.followRef?.faction===i)c.setMode('auto');else c.follow(i);royaleUiFollow();};
  (i<4?l:r).appendChild(el);royaleUiCards.push({i,s,el,hp:el.querySelector('.hp'),fill:el.querySelector('.fill'),trail:el.querySelector('.trail'),stack:el.querySelector('.stack>i'),status:el.querySelector('.status'),place:el.querySelector('.place'),last:{}});
 }
}
function royaleUiFollow(){const f=royaleCamera?.followRef?.faction;royaleUiCards.forEach(c=>c.el.classList.toggle('followed',c.i===f));}
function royaleUiUpdate(dt){
 if(gameMode!=='royale'||!royaleState)return;royaleUiClock+=Math.max(0,dt||0);
 if(royaleUiState!==royaleState.state){royaleUiState=royaleState.state;if(royaleUiState==='WARNING')royaleUiWarningAge=0;}else if(['WARNING','EVENT'].includes(royaleUiState))royaleUiWarningAge+=Math.max(0,dt||0);
 if(royaleUiClock-royaleUiLast>=.1){royaleUiLast=royaleUiClock;royaleUiCards.forEach(c=>{
  const s=c.s,dead=!s.alive||s.dying,alive=spheres.filter(x=>x.alive&&!x.dying&&!x.isReplica).length;
  if(dead&&!royaleUiPlacements.has(c.i))royaleUiPlacements.set(c.i,alive+1);
  const hp=Math.max(0,Math.min(100,s.hp/Math.max(1,s.maxHp)*100)),txt=Math.ceil(Math.max(0,s.hp))+'/'+s.maxHp;
  if(c.last.hp!==txt){c.hp.textContent=txt;c.last.hp=txt;}if(c.last.pct!==hp){c.fill.style.width=hp+'%';c.trail.style.width=Math.max(hp,Number(c.last.pct)||hp)+'%';requestAnimationFrame(()=>c.trail.style.width=hp+'%');c.last.pct=hp;}
  const th=typeof getStackDisplayThreshold==='function'?getStackDisplayThreshold(s.key):1,v=s.key==='sheriff'?s.sheriffHitCount||0:s.stacks||0,st=Math.min(100,v/Math.max(1,th)*100);if(c.last.st!==st){c.stack.style.width=st+'%';c.last.st=st;}
  if(c.last.dead!==dead){c.el.classList.toggle('dead',dead);c.el.querySelector('.skull').hidden=!dead;c.place.textContent=dead?'#'+(royaleUiPlacements.get(c.i)||alive+1):'';c.last.dead=dead;}
  const chips=(s._collectStatusEffectBadges?.()||[]).slice(0,2).map(x=>x.label).join(' · ');if(c.last.status!==chips){c.status.textContent=chips;c.status.hidden=!chips;c.last.status=chips;}
 });royaleUiRibbon();}
 royaleUiFollow();
}
function royaleUiRibbon(){
 const r=document.getElementById('royale-ribbon'),crest=document.getElementById('royale-left-crest');if(!r||!crest)return;
 crest.textContent=spheres.filter(s=>s.alive&&!s.dying&&!s.isReplica).length+' LEFT';
 const active=royaleState.state==='WARNING'||royaleState.state==='EVENT';r.classList.toggle('active',active);r.classList.toggle('collapsed',active&&royaleUiWarningAge>=2);
 r.querySelector('.phase').textContent='PHASE '+royaleState.phase+'/'+ROYALE_CONFIG.phases;
 r.querySelector('.event').textContent=(ROYALE_EVENT_LABELS[royaleState.currentEventId]||'NEXT EVENT').toUpperCase();
 const n=royaleState.state==='WARNING'?royaleState.stateTimer:royaleState.state==='EVENT'?royaleState.stateTimer:0;
 r.querySelector('.count').textContent=(royaleState.state==='WARNING'?'EVENT IN ':'SHRINK IN ')+Math.ceil(n)+'s';
 r.querySelector('.royale-ribbon-drain i').style.width=(royaleState.state==='EVENT'?100*n/ROYALE_CONFIG.event:100)+'%';
}
function royaleUiActivity(){const c=document.getElementById('controls');if(!c||gameMode!=='royale')return;c.classList.remove('idle');clearTimeout(royaleUiIdleTimer);royaleUiIdleTimer=setTimeout(()=>c.classList.add('idle'),3000);}
function royaleUiViewportChanged(){
 if(gameMode!=='royale')return;const portrait=matchMedia('(orientation: portrait)').matches&&matchMedia('(pointer: coarse)').matches;
 document.getElementById('royale-rotate')?.classList.toggle('show',portrait);
 if(portrait&&!paused){paused=true;document.getElementById('pbtn').textContent='RESUME';}
 else if(!portrait&&paused&&!winDone){paused=false;lastTime=performance.now();document.getElementById('pbtn').textContent='PAUSE';}
 if(typeof royaleViewportChanged==='function')royaleViewportChanged();
}
function royaleUiTryLandscape(){try{const p=document.documentElement.requestFullscreen?.();p?.catch?.(()=>{});}catch(_){}try{screen.orientation?.lock?.('landscape')?.catch?.(()=>{});}catch(_){}}
window.royaleUiInit=royaleUiInit;window.royaleUiUpdate=royaleUiUpdate;window.royaleUiTryLandscape=royaleUiTryLandscape;window.royaleUiViewportChanged=royaleUiViewportChanged;
