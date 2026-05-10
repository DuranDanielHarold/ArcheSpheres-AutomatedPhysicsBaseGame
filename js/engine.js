'use strict';
// ▓▓▓ SECTION:ENGINE — Physics resolution, collisions, particles, game loop ▓▓▓
// NOTE: This file also contains four entity classes that were written immediately
// before resolveAll() in the original source: Afterimage, SonicProjectile,
// NoiseTrap, and Shuriken. They are kept here to preserve the original code order.

const _audioPoolCache = new Map();
const _audioStorageKey = 'archeSpheresAudioState';
let _bgmAudio = null;
let _audioState = {
 masterVolume: AUDIO_SETTINGS_DEFAULTS.masterVolume,
 sfxVolume: AUDIO_SETTINGS_DEFAULTS.sfxVolume,
 bgmVolume: AUDIO_SETTINGS_DEFAULTS.bgmVolume,
 muted: AUDIO_SETTINGS_DEFAULTS.muted,
};

function _saveAudioState(){
 try{localStorage.setItem(_audioStorageKey,JSON.stringify(_audioState));}catch(_err){}
}

function _loadAudioState(){
 try{
  const raw=localStorage.getItem(_audioStorageKey);
  if(!raw)return;
  const parsed=JSON.parse(raw);
  if(typeof parsed.masterVolume==='number')_audioState.masterVolume=Math.max(0,Math.min(1,parsed.masterVolume));
  if(typeof parsed.sfxVolume==='number')_audioState.sfxVolume=Math.max(0,Math.min(1,parsed.sfxVolume));
  if(typeof parsed.bgmVolume==='number')_audioState.bgmVolume=Math.max(0,Math.min(1,parsed.bgmVolume));
  if(typeof parsed.muted==='boolean')_audioState.muted=parsed.muted;
 }catch(_err){}
}

function _resolveAudioVolume(key, slot, channel='sfx'){
 const bucket=channel==='bgm' ? (AUDIO_VOLUMES.arena||{}) : (AUDIO_VOLUMES[key]||{});
 const base=(bucket[slot] ?? AUDIO_VOLUMES.default?.[slot] ?? 0.65);
 const channelVolume=channel==='bgm' ? _audioState.bgmVolume : _audioState.sfxVolume;
 if(_audioState.muted)return 0;
 return Math.max(0,Math.min(1,base*_audioState.masterVolume*channelVolume));
}

function _updateAudioUi(){
 const muteBtn=document.getElementById('mute-btn');
 const sfxSlider=document.getElementById('sfx-vol');
 const bgmSlider=document.getElementById('bgm-vol');
 if(muteBtn)muteBtn.textContent=_audioState.muted?'SOUND OFF':'SOUND ON';
 if(sfxSlider)sfxSlider.value=Math.round(_audioState.sfxVolume*100);
 if(bgmSlider)bgmSlider.value=Math.round(_audioState.bgmVolume*100);
}

function _syncArenaBgm(forceRestart=false){
 const path=ARENA_AUDIO?.bgm;
 if(!path){
  if(_bgmAudio){_bgmAudio.pause();_bgmAudio=null;}
  return;
 }
 if(!_bgmAudio||_bgmAudio.src.indexOf(path)===-1){
  if(_bgmAudio)_bgmAudio.pause();
  _bgmAudio=new Audio(path);
  _bgmAudio.preload='auto';
  _bgmAudio.loop=true;
  _bgmAudio.load();
 }
 _bgmAudio.volume=_resolveAudioVolume('arena','bgm','bgm');
 if(_audioState.muted||_bgmAudio.volume<=0){
  _bgmAudio.pause();
  return;
 }
 if(forceRestart){
  try{_bgmAudio.currentTime=0;}catch(_err){}
 }
 if(_bgmAudio.paused){
  const playAttempt=_bgmAudio.play();
  if(playAttempt&&typeof playAttempt.catch==='function')playAttempt.catch(()=>{});
 }
}

function _primeAudioPath(path, poolSize=1){
 if(!path)return;
 let pool=_audioPoolCache.get(path);
 if(!pool){
  pool=[];
  _audioPoolCache.set(path,pool);
 }
 while(pool.length<poolSize){
  const clip=new Audio(path);
  clip.preload='auto';
  clip.load();
  pool.push(clip);
 }
}

function _preloadConfiguredAudio(){
 if(typeof SPHERE_AUDIO==='undefined'||typeof ARENA_AUDIO==='undefined')return;
 for(const slots of Object.values(SPHERE_AUDIO)){
  if(!slots)continue;
  for(const path of Object.values(slots))_primeAudioPath(path,2);
 }
 for(const path of Object.values(ARENA_AUDIO))_primeAudioPath(path,1);
}

function _playAudioPath(path, volume=0.65){
 if(!path)return;
 if(volume<=0)return;
 let pool=_audioPoolCache.get(path);
 if(!pool){
  _primeAudioPath(path,2);
  pool=_audioPoolCache.get(path);
 }
 let clip=pool.find(a=>a.paused||a.ended);
 if(!clip){
  clip=new Audio(path);
  clip.preload='auto';
  clip.load();
  pool.push(clip);
 }
 try{clip.currentTime=0;}catch(_err){}
 clip.volume=volume;
 const playAttempt=clip.play();
 if(playAttempt&&typeof playAttempt.catch==='function')playAttempt.catch(()=>{});
}

function _playSphereAudio(key, slot, volume){
 if(!SPHERE_AUDIO||!SPHERE_AUDIO[key])return;
 const path=SPHERE_AUDIO[key][slot];
 const finalVolume=typeof volume==='number'?volume:_resolveAudioVolume(key,slot,'sfx');
 _playAudioPath(path,finalVolume);
}

window.toggleAudioMute=function(){
 _audioState.muted=!_audioState.muted;
 _saveAudioState();
 _updateAudioUi();
 _syncArenaBgm();
};

window.setAudioVolume=function(channel, value){
 const normalized=Math.max(0,Math.min(1,Number(value)/100));
 if(channel==='sfx')_audioState.sfxVolume=normalized;
 if(channel==='bgm')_audioState.bgmVolume=normalized;
 _saveAudioState();
 _updateAudioUi();
 _syncArenaBgm();
};

window.initAudioUi=function(){
 _loadAudioState();
 _updateAudioUi();
 _syncArenaBgm();
};

function resolveAll(){
 for(let i=0;i<spheres.length;i++){
  for(let j=i+1;j<spheres.length;j++){
   const a=spheres[i],b=spheres[j];
   if(!a.alive||!b.alive||a.dying||b.dying)continue;
   // Ghost vampire passes through bodies but can still swing claws
   const aGhost=a.untargetable,bGhost=b.untargetable;
   if(!aGhost&&!bGhost){
    // Normal body collision — only when neither is a ghost
    const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy)||0.01;
    const nx=dx/dist,ny=dy/dist;
    const bodyMin=a.radius+b.radius;
    if(dist<bodyMin){
     const dvx=b.vx-a.vx+b.impactVx-a.impactVx,dvy=b.vy-a.vy+b.impactVy-a.impactVy;
     const vRel=dvx*nx+dvy*ny;
     if(vRel<0){
      const e=Math.max(0.55,Math.sqrt(a.d.rest*b.d.rest));
      const imp=(-(1+e)*vRel)/(1/a.mass+1/b.mass);
      a.vx-=(imp/a.mass)*nx;a.vy-=(imp/a.mass)*ny;
      b.vx+=(imp/b.mass)*nx;b.vy+=(imp/b.mass)*ny;
      const pushF=Math.abs(vRel)*0.12;
      a.applyImpact(-nx*pushF*b.mass,-ny*pushF*b.mass);
      b.applyImpact( nx*pushF*a.mass, ny*pushF*a.mass);
     }
     const ov=(bodyMin-dist)*0.85,tot=a.mass+b.mass;
     a.x-=nx*ov*(b.mass/tot);a.y-=ny*ov*(b.mass/tot);
     b.x+=nx*ov*(a.mass/tot);b.y+=ny*ov*(a.mass/tot);
     spawnSpark((a.x+b.x)/2,(a.y+b.y)/2,'#fff',3);
    }
   }
   // Weapon hits always run — _weaponHit guards against hitting a ghost def internally
   _weaponHit(a,b);_weaponHit(b,a);
   if(!aGhost&&!bGhost)_weaponClash(a,b);
  }
 }
 for(const sk of skeletons){
  if(!sk.alive)continue;
  for(const s of spheres){
   if(!s.alive||s.dying)continue;
   
   if(s.key==='necromancer'&&s.faction===sk.faction)continue; // never hit master
   _skeletonWeaponHit(sk,s);
  }
 }
 for(const s of spheres){
  if(!s.alive||s.dying)continue;
  for(const sk of skeletons){
   if(!sk.alive)continue;
   
   _sphereHitSkeleton(s,sk);
  }
 }
 for(const s of spheres){
  if(!s.alive||s.dying)continue;
  for(const sk of skeletons){
   if(!sk.alive)continue;
   
   if(s.key==='necromancer'&&s.faction===sk.faction)continue;
   const dx=sk.x-s.x,dy=sk.y-s.y,dist=Math.hypot(dx,dy)||0.01;
   const bodyMin=s.radius+sk.radius;
   if(dist<bodyMin){
    const nx=dx/dist,ny=dy/dist;
    const dvx=sk.vx-s.vx,dvy=sk.vy-s.vy;
    const vRel=dvx*nx+dvy*ny;
    if(vRel<0){
     const e=0.65,imp=(-(1+e)*vRel)/(1/s.mass+1/sk.mass);
     s.vx-=(imp/s.mass)*nx;s.vy-=(imp/s.mass)*ny;
     sk.vx+=(imp/sk.mass)*nx;sk.vy+=(imp/sk.mass)*ny;
    }
    const ov=(bodyMin-dist)*0.85,tot=s.mass+sk.mass;
    s.x-=nx*ov*(sk.mass/tot);s.y-=ny*ov*(sk.mass/tot);
    sk.x+=nx*ov*(s.mass/tot);sk.y+=ny*ov*(s.mass/tot);
   }
  }
 }
}

class Afterimage{
 constructor(owner){
  this.x=owner.x;this.y=owner.y;
  this.radius=owner.radius;
  this.angle=owner.angle;
  this.d=owner.d;
  this.life=1.2;this.maxLife=1.2;
  this.alive=true;
  this.absorbed=false; // has it taken a hit yet?
 }
 update(dt){
  if(!this.alive)return;
  this.life-=dt;
  if(this.life<=0){this.alive=false;return;}
  // Check if any enemy weapon tip hits this decoy
  for(const s of spheres){
   if(!s.alive||s.dying)continue;
   if(this.absorbed)break;
   const pts=s.getBladePoints();
   const tipR=s.radius*s.d.tipR;
   for(const pt of pts){
    if(Math.hypot(pt.x-this.x,pt.y-this.y)<this.radius+tipR){
     // Absorbed! Flash and vanish
     this.absorbed=true;this.life=Math.min(this.life,0.25);
     spawnBurst(this.x,this.y,this.d.rim,'#e0f7fa',12);
     spawnDmgNum(this.x,this.y-this.radius*1.4,'DECOY!','#e0f7fa');
     break;
    }
   }
   if(this.absorbed)break;
  }
 }
 draw(){
  if(!this.alive)return;
  const pct=this.life/this.maxLife;
  const alpha=this.absorbed?(this.life/0.25)*0.6:pct*0.55;
  ctx.save();ctx.globalAlpha=alpha;
  // Ghost body
  ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
  ctx.fillStyle=this.d.color;ctx.fill();
  // Cyan rim shimmer
  ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
  ctx.strokeStyle=this.d.rim;ctx.lineWidth=2.5;ctx.stroke();
  // Weapon ghost
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle);
  if(WEAPONS[this.d.wt])WEAPONS[this.d.wt](ctx,this.radius,this.d,null);
  ctx.restore();
  // Dissolve scan lines
  if(!this.absorbed){
   ctx.globalAlpha=alpha*0.4;
   for(let i=0;i<4;i++){
    const ly=this.y-this.radius+i*(this.radius*0.55);
    ctx.strokeStyle=this.d.rim;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(this.x-this.radius,ly);ctx.lineTo(this.x+this.radius,ly);ctx.stroke();
   }
  }
  ctx.restore();
 }
}

class SonicProjectile{
 static NOTE_TYPES=[
  {sym:'♩',col:'#44dd66',glow:'#00ff88',trail:'rgba(40,200,80,'},   // green  — quarter note
  {sym:'♪',col:'#ffdd00',glow:'#ffe040',trail:'rgba(220,190,0,'},    // yellow — eighth note
  {sym:'♫',col:'#ff4455',glow:'#ff6070',trail:'rgba(220,40,60,'},    // red    — beamed notes
  {sym:'♬',col:'#44aaff',glow:'#66ccff',trail:'rgba(40,140,220,'},   // blue   — beamed pair
  {sym:'𝄞',col:'#e040fb',glow:'#cc44ff',trail:'rgba(180,40,220,'},   // purple — treble clef
 ];
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=3.5;
  this.r=9;this.t=0;this.bounces=0;
  this.trail=[];
  // Pick a random note type for this projectile
  const ni=Math.floor(Math.random()*SonicProjectile.NOTE_TYPES.length);
  this.note=SonicProjectile.NOTE_TYPES[ni];
 }
 update(dt){
  this.t+=dt;
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>14)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.life-=dt;
  if(this.life<=0){this.alive=false;return;}
  // Wall bounces — each bounce amplifies speed by WALL_REST
  const boost=WALL_REST; // 1.30
  if(this.x-this.r<0){this.x=this.r;this.vx=Math.abs(this.vx)*boost;this.bounces++;this._onBounce();}
  if(this.x+this.r>W){this.x=W-this.r;this.vx=-Math.abs(this.vx)*boost;this.bounces++;this._onBounce();}
  if(this.y-this.r<0){this.y=this.r;this.vy=Math.abs(this.vy)*boost;this.bounces++;this._onBounce();}
  if(this.y+this.r>H){this.y=H-this.r;this.vy=-Math.abs(this.vy)*boost;this.bounces++;this._onBounce();}
  // Cap speed so it doesn't go insane after many bounces
  const spd=Math.hypot(this.vx,this.vy);
  if(spd>1100){const f=1100/spd;this.vx*=f;this.vy*=f;}
  for(const s of spheres){
   if(s===this.owner||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
    // Minimal HP damage via magic, massive knockback
    const magDmg=this.dmg/(s.d.magDef*0.01+1);
    s.receiveMagicDamage(magDmg);
    const spd2=Math.hypot(this.vx,this.vy)||500;
    const nx=(s.x-this.x)/Math.hypot(s.x-this.x,s.y-this.y)||1;
    const ny=(s.y-this.y)/Math.hypot(s.x-this.x,s.y-this.y)||0;
    const kbForce=300+this.bounces*120; // more bounces = harder hit
    s.applyImpact(nx*kbForce,ny*kbForce);
    this.owner.gainStack();
    this.owner._applyHitBuff();
    spawnBurst(s.x,s.y,this.note.col,this.note.glow,14);
    spawnDmgNum(s.x,s.y-s.radius*1.4,`${this.note.sym} ${Math.round(kbForce)}`,this.note.col);
    this.alive=false;return;
   }
  }
 }
 _onBounce(){
  spawnSpark(this.x,this.y,this.note.col,4);
 }
 draw(){
  if(!this.alive)return;
  const spd=Math.hypot(this.vx,this.vy);
  const intensity=Math.min(1,(spd-300)/800);
  const n=this.note;
  // Coloured trail — each note type has its own trail colour
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.65;
   ctx.save();ctx.globalAlpha=a*0.75;
   const sz=this.r*(0.35+a*0.65);
   const g=ctx.createRadialGradient(tr.x,tr.y,0,tr.x,tr.y,sz);
   g.addColorStop(0,n.trail+'0.95)');
   g.addColorStop(0.55,n.trail+'0.4)');
   g.addColorStop(1,'transparent');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(tr.x,tr.y,sz,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  // Outer glow halo
  ctx.save();
  ctx.shadowColor=n.glow;ctx.shadowBlur=10+intensity*16;
  const g2=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r+5);
  g2.addColorStop(0,'#ffffff');
  g2.addColorStop(0.25,n.col);
  g2.addColorStop(0.65,n.trail+`${0.45+intensity*0.35})`);
  g2.addColorStop(1,'transparent');
  ctx.fillStyle=g2;ctx.beginPath();ctx.arc(this.x,this.y,this.r+5,0,Math.PI*2);ctx.fill();
  // Note symbol — white with coloured shadow
  ctx.font=`bold ${this.r*1.5}px serif`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=n.col;ctx.fillText(n.sym,this.x+1,this.y+1); // coloured shadow
  ctx.fillStyle='#ffffff';ctx.fillText(n.sym,this.x,this.y);
  ctx.shadowBlur=0;ctx.restore();
 }
}
class NoiseTrap{
 constructor(x,y,owner){
  this.x=x;this.y=y;this.owner=owner;
  this.life=3.0;this.maxLife=3.0;
  this.alive=true;this.r=18;this.t=0;
 }
 update(dt){
  if(!this.alive)return;
  this.t+=dt;this.life-=dt;
  if(this.life<=0){this.alive=false;return;}
  for(const s of spheres){
   if(s===this.owner||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
    // Zero out spin (melee threat) and slow ranged fire rate
    s.omegaCur=0;
    s.dissonantT=2.0;
    if(RANGED_KEYS.has(s.key)){
     s.discordFireRateT=3.0;
     spawnDmgNum(s.x,s.y-s.radius*2.0,'SILENCED!','#e040fb');
    }
    spawnBurst(this.x,this.y,this.owner.d.rim,'#e040fb',10);
    spawnDmgNum(s.x,s.y-s.radius*1.4,'DISCORD!','#e040fb');
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  const pct=this.life/this.maxLife;
  const pulse=0.5+0.5*Math.sin(this.t*8);
  ctx.save();ctx.globalAlpha=0.55*pct;
  // Ripple ring
  ctx.strokeStyle=`rgba(224,64,251,${0.5+pulse*0.4})`;
  ctx.lineWidth=1.5;ctx.setLineDash([4,4]);
  ctx.beginPath();ctx.arc(this.x,this.y,this.r*(0.8+pulse*0.3),0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);
  // Inner glow
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
  g.addColorStop(0,`rgba(224,64,251,${0.3*pct})`);
  g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
  // ♩ note icon
  ctx.globalAlpha=0.8*pct;
  ctx.font=`bold ${this.r*0.9}px serif`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='#e040fb';ctx.fillText('♩',this.x,this.y);
  ctx.restore();
 }
}

class Shuriken{
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=1.8;this.rot=0;
  this.points=Math.random()<0.5?4:3; // 3- or 4-pointed
  this.trail=[];
 }
 update(dt){
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>8)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.rot+=dt*18;
  this.life-=dt;
  if(this.x<0||this.x>W||this.y<0||this.y>H||this.life<=0){this.alive=false;return;}
  for(const s of spheres){
   if(s===this.owner||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+7){
    const fd=this.dmg/(s.d.arm*0.004+1);
    s.receiveDamage(fd);
    const nx=(s.x-this.x)/Math.hypot(s.x-this.x,s.y-this.y)||1;
    const ny=(s.y-this.y)/Math.hypot(s.x-this.x,s.y-this.y)||0;
    s.applyImpact(nx*90,ny*90);
    spawnSpark(this.x,this.y,this.owner.d.rim,5);
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
  // Trail
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.4;
   ctx.save();ctx.globalAlpha=a;
   ctx.strokeStyle='#9b59b6';ctx.lineWidth=1.5;
   if(i>1){ctx.beginPath();ctx.moveTo(this.trail[i-1].x-this.x,this.trail[i-1].y-this.y);ctx.lineTo(tr.x-this.x,tr.y-this.y);ctx.stroke();}
   ctx.restore();
  }
  const n=this.points;
  const outerR=8,innerR=3.5;
  ctx.fillStyle='#2c3e50';
  ctx.beginPath();
  for(let i=0;i<n*2;i++){
   const a=(i/( n*2))*Math.PI*2-Math.PI/2;
   const r2=i%2===0?outerR:innerR;
   i===0?ctx.moveTo(Math.cos(a)*r2,Math.sin(a)*r2):ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
  }
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#9b59b6';
  ctx.beginPath();
  for(let i=0;i<n*2;i++){
   const a=(i/(n*2))*Math.PI*2-Math.PI/2;
   const r2=i%2===0?outerR*0.7:innerR*0.9;
   i===0?ctx.moveTo(Math.cos(a)*r2,Math.sin(a)*r2):ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
  }
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='#6c3483';ctx.lineWidth=1;
  ctx.beginPath();
  for(let i=0;i<n*2;i++){
   const a=(i/(n*2))*Math.PI*2-Math.PI/2;
   const r2=i%2===0?outerR:innerR;
   i===0?ctx.moveTo(Math.cos(a)*r2,Math.sin(a)*r2):ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
  }
  ctx.closePath();ctx.stroke();
  ctx.fillStyle='rgba(155,89,182,0.5)';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
}
function _weaponHit(att,def){
 if(def.untargetable)return; // vampire ghost mode — weapons pass through ghost vampire
 // Note: att.untargetable is intentionally NOT checked — ghost vampire can still deal bat damage
 if(RANGED_KEYS.has(att.key)){
  if(att.weaponHitCD>0)return;
  const tip=att.getTip();
  const tipR=att.radius*att.d.tipR;
  if(Math.hypot(tip.x-def.x,tip.y-def.y)<def.radius+tipR){
   att.weaponHitCD=0.55;
   const bluntDmg=(att.d.dmg*0.35*att.dmgMult)/(def.d.arm*0.004+1);
   if(bluntDmg>0.1){
    def.receiveDamage(bluntDmg);
    att.gainStack();
    att._applyHitBuff();
    att.omegaCur*=-1;
    const nx=(def.x-att.x)||1,ny=(def.y-att.y)||0;
    const nd=Math.hypot(nx,ny)||1;
    def.applyImpact((nx/nd)*90,(ny/nd)*90);
    spawnSpark(tip.x,tip.y,att.d.rim,3);
   }
  }
  return;
 }
 const pts=att.getBladePoints();
 const tipR=att.radius*att.d.tipR;
 let hit=false,hitPt=null,hitDist=Infinity;
 for(const pt of pts){
  const pdx=pt.x-def.x,pdy=pt.y-def.y,d=Math.hypot(pdx,pdy);
  if(d<def.radius+tipR&&d<hitDist){hit=true;hitPt=pt;hitDist=d;}
 }
 const tip=att.getTip();
 if(hit&&!att.hasHitThisSwing){
  att.hasHitThisSwing=true;
  if(att.blinded&&Math.random()<0.30){spawnDmgNum(att.x,att.y-att.radius*1.4,'MISS','#ffee44');return;} // blind: 30% miss
  const hx=hitPt.x,hy=hitPt.y,hdist=hitDist||0.01;
  const px=(hx-def.x)/hdist,py=(hy-def.y)/hdist;
  const armX=hx-att.x,armY=hy-att.y;
  const tvx=att.vx+att.impactVx+(-att.omegaCur*armY);
  const tvy=att.vy+att.impactVy+(att.omegaCur*armX);
  const rvx=tvx-def.vx-def.impactVx,rvy=tvy-def.vy-def.impactVy;
  const vRel=rvx*px+rvy*py;
  if(vRel>0){
   const e=0.82,imp=(1+e)*vRel/(1/def.mass+1/att.mass);
   def.applyImpact(px*(imp/def.mass)*1.1,py*(imp/def.mass)*1.1); // 0.9→1.1
   att.vx-=(imp/att.mass)*px*0.35;att.vy-=(imp/att.mass)*py*0.35; // slight attacker pushback
   const ov=(def.radius+tipR-hdist)*1.0;def.x+=px*ov;def.y+=py*ov;
  }
  att.omegaCur*=-1;
  const tipSpd=Math.hypot(tvx,tvy);
  const weaponWeight=att.mass*0.35;
  let dmg=(tipSpd*att.d.dmg*0.010+weaponWeight*0.12)*att.dmgMult/(def.d.arm*0.004+1);
  if(att.key==='pirate'&&att.draining){
   att.receiveHeal(dmg*0.15);
   const pullX=att.x-def.x,pullY=att.y-def.y,pullD=Math.hypot(pullX,pullY)||1;
   def.applyImpact((pullX/pullD)*120,(pullY/pullD)*120);
  }
  if(att.key==='necromancer'){
   def.woundT=Math.max(def.woundT||0, 4.0);
  }
  if(att.key==='guardian')dmg*=1.22;
  if(def.key==='guardian'){
   def.impactVx*=0.7;def.impactVy*=0.7; // reduce knockback taken
  }
  if(att.key==='rogue'&&att.backstabCharged){dmg*=2;att.backstabCharged=false;att.backstabT=0;att.dmgMult=1;}
  // Samurai — Iaijutsu: first hit after spin reversal deals 2× dmg
  if(att.key==='samurai'&&att.iaijutsuReady){dmg*=2;att.iaijutsuReady=false;att.iaijutsuCD=3.0;spawnDmgNum(att.x,att.y-att.radius*1.5,'IAIJUTSU','#8a1f28');}
  if(isFinite(dmg)&&dmg>0.2){
   if(att.key==='alchemist')def.receiveMagicDamage(dmg);
   else def.receiveDamage(dmg);
   att.gainStack();
   att._applyHitBuff();
    // Whelpling: open the upper jaw, lunge forward, then clamp shut.
    if(att.key==='whelpling'&&att.mouthOpenMode!==2){att.mouthOpenTimer=0.42;att.mouthOpenMode=1;}
   if(att.key==='vampire'&&!att.ghostMode){
    att.receiveHeal(dmg*0.25);
    spawnSpark(att.x,att.y,'#cc0044',3);
   }
   if(att.key==='monk'&&att.nirvanaActive){
    const nx2=(def.x-att.x)||1,ny2=(def.y-att.y)||0;
    const nd2=Math.hypot(nx2,ny2)||1;
    def.applyImpact((nx2/nd2)*520,(ny2/nd2)*520);
    spawnSpark(hx,hy,'#ffe0a0',6);
   }
   if(att.key==='alchemist'){
    def.corrosionStacks=Math.min(6,(def.corrosionStacks||0)+1);
    if(def.corrosionT<=0)def.corrosionT=1.2; // start decay timer if not already ticking
    def.d=Object.assign({},def.d);
    const _baseA=def.baseArm||DEF[def.key]?.arm||def.d.arm||0;
    def.d.arm=Math.max(0,_baseA-def.corrosionStacks*5);
    spawnSpark(hx,hy,'#66ff44',4);
   }
   // Knight — Stalwart: permanent micro-buff per hit (capped at 30 stacks)
   if(att.key==='knight'&&att.stalwartStacks<30){
    att.stalwartStacks++;
    att.d=Object.assign({},att.d);
    att.d.dmg*=1.006;att.d.arm=Math.round(att.d.arm*1.006);att.d.om*=1.006;
    att.omegaCur=Math.abs(att.omegaCur)*1.006*Math.sign(att.omegaCur||1);
    if(att.stalwartStacks%5===0)spawnDmgNum(att.x,att.y-att.radius*1.5,'STALWART','#d8eaf8');
   }
   // Barbarian — Bloodlust: +6 speed per hit, max +60, decays slowly
   if(att.key==='barbarian'){
    att.bloodlustBonus=Math.min(60,att.bloodlustBonus+6);
    att.targetSpd=att.baseSpd+att.bloodlustBonus;
    spawnSpark(att.x,att.y,'#b04010',3);
   }
   // Rogue — Hemorrhage: apply/refresh bleed stacks on target (max 3)
   if(att.key==='rogue'){
    def.bleedStacks=Math.min(3,(def.bleedStacks||0)+1);
    def.bleedT=1.8;
    if(def.bleedTickT<=0)def.bleedTickT=0.5;
    spawnSpark(hx,hy,'#e74c3c',4);
    }
    spawnSpark(hx,hy,att.d.rim,7);
    spawnImpactBurst(hx,hy,att.d.rim,def.d.color);
    if(att.key==='phoenix')att._releasePhoenixEmber(def,hx,hy);
   // Plague Doctor — Attrition: permanently reduce enemy max HP
   if(att.key==='plague'){
    const drain=3;
    def.maxHp=Math.max(80,def.maxHp-drain);
    def.hp=Math.min(def.hp,def.maxHp);
    att.plagueMaxHpDrain=(att.plagueMaxHpDrain||0)+drain;
    if(att.plagueMaxHpDrain%15===0)spawnDmgNum(def.x,def.y-def.radius*1.8,`-${att.plagueMaxHpDrain}MAX`,'#aadd44');
   }
   // Mimic — Essence Drain: steal DMG permanently
   if(att.key==='mimic'&&att.mimicDmgStolen<3.0){
    const steal=0.04;
    att.mimicDmgStolen=Math.min(3.0,(att.mimicDmgStolen||0)+steal);
    def.d=Object.assign({},def.d);
    def.d.dmg=Math.max(0.5,def.d.dmg-steal);
    att.d=Object.assign({},att.d);
    att.d.dmg+=(att._mimicBaseDmg===undefined?steal:0); // only when not copy-active
    if(Math.round(att.mimicDmgStolen*10)%5===0)spawnDmgNum(att.x,att.y-att.radius*1.5,`DRAIN ${att.mimicDmgStolen.toFixed(1)}`,'#cc88ff');
   }
   // Stormbringer — discharge static charge on hit
   if(att.key==='stormbringer'&&att.staticCharge>0){
    const trueDmg=att.staticCharge*0.6;
    def.hp=Math.max(0,def.hp-trueDmg);
    def.hitFlash=1;
    if(trueDmg>0.5){spawnDmgNum(def.x,def.y-def.radius*1.8,trueDmg,'#88ccff');spawnSpark(def.x,def.y,'#88ccff',5);}
    att.staticCharge=0;
    if(def.hp<=0&&!def.dying){def.alive=false;def.dying=true;spawnBurst(def.x,def.y,def.d.rim,def.d.color,28);}
   }
   // Crusader — Retribution: discharge on hit, then reset
   if(att.key==='crusader'&&att.retributionCounter>0){
    const rdmg=att.retributionCounter*0.5/(def.d.arm*0.004+1);
    if(rdmg>0.1){def.receiveDamage(rdmg);spawnDmgNum(att.x,att.y-att.radius*1.5,rdmg,'#fffacc');}
    att.retributionCounter=0;
   }
  }
 }
 const bladeStillInside=pts.some(pt=>Math.hypot(pt.x-def.x,pt.y-def.y)<def.radius+tipR);
 if(!bladeStillInside)att.hasHitThisSwing=false;
}
function _weaponClash(a,b){
 
 if(a.weaponHitCD>0||b.weaponHitCD>0)return;
 const ptsA=a.getBladePoints(), ptsB=b.getBladePoints();
 const clashDist=a.radius*a.d.tipR+b.radius*b.d.tipR+6;
 let clashPtA=null,clashPtB=null,bestDist=Infinity;
 for(const pa of ptsA){
  for(const pb of ptsB){
   const d=Math.hypot(pa.x-pb.x,pa.y-pb.y);
   if(d<clashDist&&d<bestDist){bestDist=d;clashPtA=pa;clashPtB=pb;}
  }
 }
 if(!clashPtA)return;
 const tipA=a.getTip(),tipB=b.getTip();
 const armAx=tipA.x-a.x,armAy=tipA.y-a.y;
 const armBx=tipB.x-b.x,armBy=tipB.y-b.y;
 const tvAx=a.vx+a.impactVx+(-a.omegaCur*armAy);
 const tvAy=a.vy+a.impactVy+(a.omegaCur*armAx);
 const tvBx=b.vx+b.impactVx+(-b.omegaCur*armBy);
 const tvBy=b.vy+b.impactVy+(b.omegaCur*armBx);
 const abx=tipB.x-tipA.x,aby=tipB.y-tipA.y,abd=Math.hypot(abx,aby)||1;
 const aConverging=(tvAx*(abx/abd)+tvAy*(aby/abd))>0;
 const bConverging=(tvBx*(-abx/abd)+tvBy*(-aby/abd))>0;
 if(aConverging||!bConverging) a.omegaCur*=-1;
 if(bConverging||!aConverging) b.omegaCur*=-1;
 a.weaponHitCD=0.28;b.weaponHitCD=0.28;
 const mx=(clashPtA.x+clashPtB.x)/2,my=(clashPtA.y+clashPtB.y)/2;
 // Play one clash sound from the first sphere that has a configured weaponCollision asset.
 if(SPHERE_AUDIO[a.key]&&SPHERE_AUDIO[a.key].weaponCollision)_playSphereAudio(a.key,'weaponCollision');
 else if(SPHERE_AUDIO[b.key]&&SPHERE_AUDIO[b.key].weaponCollision)_playSphereAudio(b.key,'weaponCollision');
 spawnSpark(mx,my,'#ffe066',10);spawnSpark(mx,my,'#fff',6);
 spawnImpactBurst(mx,my,'#ffe066','#fff');
 const bx=b.x-a.x,by2=b.y-a.y,bd=Math.hypot(bx,by2)||1;
 a.applyImpact(-(bx/bd)*80,-(by2/bd)*80);b.applyImpact((bx/bd)*80,(by2/bd)*80);
}
function _skeletonWeaponHit(sk,def){
 if(sk.weaponHitCD>0)return;
 const pts=sk.getBladePoints();
 const tipR=sk.radius*sk.tipR;
 let hit=false,hitPt=null,hitDist=Infinity;
 for(const pt of pts){
  const d=Math.hypot(pt.x-def.x,pt.y-def.y);
  if(d<def.radius+tipR&&d<hitDist){hit=true;hitPt=pt;hitDist=d;}
 }
 if(hit&&!sk.hasHitThisSwing){
  sk.hasHitThisSwing=true;
  sk.weaponHitCD=0.4;
  const hx=hitPt.x,hy=hitPt.y,hdist=hitDist||0.01;
  const px=(hx-def.x)/hdist,py=(hy-def.y)/hdist;
  const armX=hx-sk.x,armY=hy-sk.y;
  const tvx=sk.vx+sk.impactVx+(-sk.omegaCur*armY);
  const tvy=sk.vy+sk.impactVy+(sk.omegaCur*armX);
  const vRel=(tvx-def.vx)*px+(tvy-def.vy)*py;
  if(vRel>0){
   const e=0.7,imp=(1+e)*vRel/(1/def.mass+1/sk.mass);
   def.applyImpact(px*(imp/def.mass),py*(imp/def.mass));
   sk.vx-=(imp/sk.mass)*px*0.3;sk.vy-=(imp/sk.mass)*py*0.3;
  }
  sk.omegaCur*=-1;
  const dmg=sk.dmg/(def.d.arm*0.004+1);
  if(dmg>0.1){
   def.receiveDamage(dmg);
   spawnSpark(hx,hy,'#c8c0a0',5);
  }
 }
 const bladeStillIn=pts.some(pt=>Math.hypot(pt.x-def.x,pt.y-def.y)<def.radius+tipR);
 if(!bladeStillIn)sk.hasHitThisSwing=false;
}
function _sphereHitSkeleton(att,sk){
 if(att.key==='necromancer'&&att.faction===sk.faction)return;
 if(att.weaponHitCD>0)return;
 const tip=att.getTip();
 const tipR=att.radius*att.d.tipR;
 const dist=Math.hypot(tip.x-sk.x,tip.y-sk.y);
 if(dist<sk.radius+tipR){
  att.weaponHitCD=0.35;
  const armX=tip.x-att.x,armY=tip.y-att.y;
  const tvx=att.vx+att.impactVx+(-att.omegaCur*armY);
  const tvy=att.vy+att.impactVy+(att.omegaCur*armX);
  const tipSpd=Math.hypot(tvx,tvy);
  const dmg=(tipSpd*att.d.dmg*0.010+(att.mass*0.35)*0.12)*att.dmgMult/(sk.arm*0.004+1);
  if(dmg>0.1){
   sk.hp=Math.max(0,sk.hp-dmg);
   sk.hitFlash=1;
   spawnBloodSplat(sk.x,sk.y,'#c8c0a0',dmg);
   spawnDmgNum(sk.x,sk.y-sk.radius*0.5,dmg,dmg>=10?'#ff4444':dmg>=4?'#ffaa22':'#ffffff');
   const nx=(sk.x-tip.x)/dist||1,ny=(sk.y-tip.y)/dist||1;
   sk.applyImpact(nx*100,ny*100);
   att.omegaCur*=-1;
   if(sk.hp<=0){sk.alive=false;spawnToxicCloud(sk.x,sk.y);spawnBurst(sk.x,sk.y,'#7c4dff','#c8c0a0',14);}
  }
 }
}
function spawnVialShatter(x,y,vialType){
 const palettes={
  purple:['#cc44ff','#8800cc','#ff88ff','#dd00ff','#fff','rgba(200,80,255,.7)'],
  yellow:['#ffee22','#ffcc00','#fff8a0','#ddaa00','#fff','rgba(255,220,60,.7)'],
  green: ['#44ff66','#22cc44','#aaffcc','#00dd44','#fff','rgba(80,255,100,.7)'],
 };
 const cols=palettes[vialType]||palettes.green;
 // Large slow rising bubbles — the main bubble effect
 for(let i=0;i<28;i++){
  const a=Math.random()*Math.PI*2;
  const spd=15+Math.random()*45;
  const sz=6+Math.random()*14;
  const drift=(Math.random()-.5)*24;
  particles.push({x:x+drift,y:y+(Math.random()-.5)*12,
   vx:Math.cos(a)*spd,vy:-25-Math.random()*90,
   life:1,maxL:0.6+Math.random()*0.55,sz,
   col:cols[Math.floor(Math.random()*cols.length)],sq:false,bubble:true});
 }
 // Medium floating blobs — secondary layer
 for(let i=0;i<16;i++){
  const a=Math.random()*Math.PI*2,spd=30+Math.random()*70;
  particles.push({x,y,vx:Math.cos(a)*spd*0.7,vy:-15-Math.random()*55,
   life:1,maxL:0.45+Math.random()*0.4,sz:4+Math.random()*8,
   col:cols[Math.floor(Math.random()*cols.length)],sq:false,bubble:true});
 }
 // Fast sharp sparks radiating out
 for(let i=0;i<18;i++){
  const a=Math.random()*Math.PI*2,spd=90+Math.random()*180;
  particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-35,
   life:1,maxL:0.16+Math.random()*0.12,sz:1.5+Math.random()*3,col:cols[Math.floor(Math.random()*3)],sq:true});
 }
 // Central glowing ring
 for(let i=0;i<12;i++){
  const a=(i/12)*Math.PI*2,spd=40+Math.random()*30;
  particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
   life:1,maxL:0.32,sz:4+Math.random()*5,col:cols[0],sq:false});
 }
 // Tiny fizz droplets
 for(let i=0;i<20;i++){
  const a=Math.random()*Math.PI*2,spd=25+Math.random()*65;
  particles.push({x:x+(Math.random()-.5)*18,y,
   vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-18,
   life:1,maxL:0.22+Math.random()*0.15,sz:1.5+Math.random()*2.5,
   col:cols[Math.floor(Math.random()*cols.length)],sq:false});
 }
}

function spawnBurst(x,y,c1,c2,n=22){
 const cols=[c1,c2,'#fff','#ffff44','#aaa'];
 for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=50+Math.random()*140,sz=3+Math.floor(Math.random()*5);
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-25,life:1,maxL:.5+Math.random()*.5,sz,col:cols[Math.floor(Math.random()*cols.length)],sq:Math.random()>.45});}
}
function spawnSpark(x,y,col,n=5){
 for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=28+Math.random()*90;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,maxL:.14+Math.random()*.1,sz:1.5+Math.random()*2.5,col,sq:true});}
}
function spawnPulse(x,y,col){
 for(let i=0;i<16;i++){const a=(i/16)*Math.PI*2,s=60+Math.random()*100;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,maxL:.4,sz:3+Math.random()*3,col,sq:Math.random()>.5});}
}
function spawnImpactBurst(x,y,c1,c2){
 for(let i=0;i<8;i++){const a=Math.random()*Math.PI*2,s=35+Math.random()*70;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,maxL:.18+Math.random()*.1,sz:2+Math.random()*4,col:Math.random()>.5?c1:c2,sq:Math.random()>.4});}
}
function spawnArrowHit(x,y){
 for(let i=0;i<10;i++){const a=Math.random()*Math.PI*2,s=30+Math.random()*60;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,maxL:.2,sz:2+Math.random()*3,col:Math.random()>.5?'#88cc44':'#c0c090',sq:Math.random()>.5});}
}
function spawnFlameExplosion(x,y){
 for(let i=0;i<20;i++){const a=Math.random()*Math.PI*2,s=60+Math.random()*120;
  const cols=['#cc88ff','#8800cc','#fff','#ff80ff'];
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-20,life:1,maxL:.45+Math.random()*.3,sz:5+Math.random()*8,col:cols[Math.floor(Math.random()*cols.length)],sq:false});}
}
function spawnToxicCloud(x,y){
 for(let i=0;i<12;i++){const a=Math.random()*Math.PI*2,s=20+Math.random()*50;
  const g=Math.floor(150+Math.random()*105);
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-10,life:1,maxL:.5+Math.random()*.4,sz:4+Math.random()*7,col:`rgba(50,${g},60,.8)`,sq:false});}
}
function spawnRingBurst(x,y,col){
 for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2,s=40+Math.random()*60;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-10,life:1,maxL:.22,sz:2+Math.random()*3,col,sq:false});}
}
function spawnNirvanaActivate(x,y){
 // Tight ring of golden streaks imploding inward — energy focusing
 const n=28;
 for(let i=0;i<n;i++){
  const a=(i/n)*Math.PI*2;
  const dist=55+Math.random()*30;
  const sx=x+Math.cos(a)*dist, sy=y+Math.sin(a)*dist;
  // Particles travel inward toward the monk
  const speed=120+Math.random()*60;
  particles.push({x:sx,y:sy,vx:(x-sx)/dist*speed,vy:(y-sy)/dist*speed,
   life:1,maxL:0.32+Math.random()*0.12,sz:2.5+Math.random()*2.5,col:i%3===0?'#fff':'#ffe0a0',sq:false});
 }
 // Central burst of white-gold sparks
 for(let i=0;i<16;i++){
  const a=Math.random()*Math.PI*2,s=40+Math.random()*80;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-15,
   life:1,maxL:0.25+Math.random()*0.15,sz:3+Math.random()*4,col:i%2===0?'#ffe0a0':'#c8a040',sq:true});
 }
}
function spawnHolyShieldBurst(x,y){
 for(let i=0;i<14;i++){const a=(i/14)*Math.PI*2,s=30+Math.random()*55;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-15,life:1,maxL:.35,sz:2+Math.random()*4,col:i%2===0?'#fff8c0':'#f0e870',sq:false});}
}
function spawnWizardTeleportDepart(x,y){
 const dc=['#fff','#cc88ff','#884499'];
 for(let i=0;i<24;i++){
  const a=(i/24)*Math.PI*2,r=40+Math.random()*20;
  const tx=x+Math.cos(a)*r,ty=y+Math.sin(a)*r;
  const dx=x-tx,dy=y-ty,d=Math.hypot(dx,dy)||1;
  const s=90+Math.random()*60;
  particles.push({x:tx,y:ty,vx:(dx/d)*s,vy:(dy/d)*s,life:1,maxL:.28+Math.random()*.12,sz:2.5+Math.random()*3,col:dc[i%3],sq:false});
 }
 for(let i=0;i<12;i++){
  const a=Math.random()*Math.PI*2,s=15+Math.random()*35;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-20,life:1,maxL:.2+Math.random()*.1,sz:1.5+Math.random()*2,col:'#cc88ff',sq:true});
 }
}
function spawnWizardTeleportArrive(x,y){
 const cols=['#cc88ff','#884499','#fff','#e8b0ff','#7c4dff'];
 for(let i=0;i<30;i++){
  const a=(i/30)*Math.PI*2;
  const s=60+Math.random()*130;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,life:1,maxL:.4+Math.random()*.25,sz:3+Math.random()*5,col:cols[Math.floor(Math.random()*cols.length)],sq:i%4===0});
 }
 for(let i=0;i<16;i++){
  const a=(i/16)*Math.PI*2,r=28;
  particles.push({x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,vx:Math.cos(a)*55,vy:Math.sin(a)*55-15,life:1,maxL:.5,sz:2+Math.random()*2.5,col:i%2===0?'#fff':'#cc88ff',sq:false});
 }
 for(let i=0;i<8;i++){
  const a=Math.random()*Math.PI*2,s=20+Math.random()*25;
  particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,maxL:.15,sz:4+Math.random()*4,col:'#fff',sq:true});
 }
}
function updateParticles(dt){
 for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=55*dt;p.vx*=.965;p.life-=dt/p.maxL;}
 particles=particles.filter(p=>p.life>0);
}
function drawParticles(){
 for(const p of particles){ctx.save();ctx.globalAlpha=Math.max(0,p.life*p.life);ctx.fillStyle=p.col;
  const sz=p.sz*p.life;
  if(p.sq){ctx.fillRect(p.x-sz/2,p.y-sz/2,sz,sz);
  }else if(p.bubble){ctx.beginPath();ctx.arc(p.x,p.y,sz/2,0,Math.PI*2);ctx.strokeStyle=p.col;ctx.lineWidth=Math.max(1,sz*.18);ctx.globalAlpha*=0.75;ctx.stroke();
  }else{ctx.beginPath();ctx.arc(p.x,p.y,sz/2,0,Math.PI*2);ctx.fill();}ctx.restore();}
}
function spawnDmgNum(x,y,amount,col){
 if(typeof amount==='number'&&(!isFinite(amount)||isNaN(amount)))return;
 const drift=(Math.random()-.5)*18;
 dmgNums.push({x:x+drift,y,amount:typeof amount==='number'?Math.ceil(amount):amount,col,life:1,maxL:0.75,vy:-52,heal:false});
}
function spawnHealNum(x,y,amount){
 if(amount<0.5)return; // skip sub-1 ticks — too spammy
 const drift=(Math.random()-.5)*14;
 dmgNums.push({x:x+drift,y,amount:Math.ceil(amount),col:'#44ee66',life:1,maxL:0.7,vy:-62,heal:true});
}
function updateDmgNums(dt){
 for(const n of dmgNums){n.y+=n.vy*dt;n.vy*=Math.pow(0.7,dt*8);n.life-=dt/n.maxL;}
 dmgNums=dmgNums.filter(n=>n.life>0);
}
function drawDmgNums(){
 for(const n of dmgNums){
  const alpha=Math.max(0,n.life);
  const sz=Math.max(7,Math.min(13,6+n.amount*0.18));
  ctx.save();ctx.globalAlpha=alpha;
  ctx.font=`bold ${sz}px 'Press Start 2P',monospace`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  const txt=(n.heal?'+':'')+n.amount.toString();
  ctx.fillStyle='#000';
  for(const[ox,oy]of[[-1,-1],[1,-1],[-1,1],[1,1],[0,-2],[0,2],[-2,0],[2,0]])
   ctx.fillText(txt,n.x+ox,n.y+oy);
  ctx.fillStyle=n.col;
  ctx.fillText(txt,n.x,n.y);
  ctx.restore();
 }
}
function spawnBloodSplat(x,y,col,dmg){
 const count=Math.min(10,Math.max(2,Math.floor(dmg*0.55)));
 const baseR=Math.min(10,Math.max(2.5,dmg*0.28));
 const life=1.8+Math.random()*1.2;
 const blobs=[];
 for(let i=0;i<count;i++){
  const ang=Math.random()*Math.PI*2;
  const dist=Math.random()*baseR*2.2;
  const r=baseR*(0.35+Math.random()*0.75);
  const sx=0.6+Math.random()*0.8;
  const sy=0.6+Math.random()*0.8;
  blobs.push({x:x+Math.cos(ang)*dist,y:y+Math.sin(ang)*dist,r,sx,sy});
 }
 blobs.push({x,y,r:baseR*(0.7+Math.random()*0.4),sx:1,sy:1});
 bloodSplats.push({blobs,col,life,maxLife:life});
}
function updateBloodSplats(dt){
 for(const s of bloodSplats)s.life-=dt;
 bloodSplats=bloodSplats.filter(s=>s.life>0);
}
function drawBloodSplats(){
 for(const s of bloodSplats){
  const alpha=Math.max(0,s.life/s.maxLife);
  ctx.save();ctx.globalAlpha=alpha*alpha;
  ctx.fillStyle=s.col;
  for(const b of s.blobs){
   ctx.save();ctx.translate(b.x,b.y);ctx.scale(b.sx,b.sy);
   ctx.beginPath();ctx.arc(0,0,b.r,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  ctx.restore();
 }
}
function drawBg(){
 ctx.fillStyle='#a8d8ea';ctx.fillRect(0,0,W,H);
 const tile=Math.max(10,W*.07);
 ctx.strokeStyle='rgba(90,168,200,.25)';ctx.lineWidth=1;
 for(let x=0;x<W;x+=tile){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
 for(let y=0;y<H;y+=tile){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
 ctx.setLineDash([5,7]);ctx.strokeStyle='rgba(55,120,145,.28)';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();ctx.setLineDash([]);
}
function updateAbBar(){
 for(const[fi,fid,side]of[[0,'acd-r','r'],[1,'acd-b','b']]){
   const s=spheres.find(sp=>sp.faction===fi);if(!s)continue;
   const fill=document.getElementById(fid);
   const thresh=s.key==='trickster'?2:s.key==='vampire'?6:['samurai','barbarian','rogue','templar','druid','necromancer','phoenix','alchemist','dragoon','bard','plague','tidecaller','crusader','mimic','stormbringer','voidwalker','whelpling'].includes(s.key)?3:s.key==='wizard'||s.key==='ranger'?4:s.key==='priest'?8:s.key==='sheriff'?2:5;
   const pct=s.key==='sheriff'?Math.min(1,s.sheriffHitCount/2):Math.min(1,s.stacks/thresh);
   fill.style.width=(pct*100)+'%';
   fill.style.background=pct>=1?'#ff4400':pct>=0.6?`hsl(${30+pct*30},95%,55%)`:'#e8b430';
   const hpPct=s.hp/s.maxHp;
   const hpCol=hpPct<0.30?'#ff4444':hpPct<0.55?'#ffaa22':'#44ee66';
   const hpEl=document.getElementById(`shp-${side}`);
   if(hpEl){hpEl.textContent=Math.ceil(s.hp)+'/'+s.maxHp;hpEl.style.color=hpCol;}
   const dmgEl=document.getElementById(`sd-${side}`);
   if(dmgEl){
    dmgEl.textContent=s.d.dmg.toFixed(1);
    dmgEl.style.color=s.lowHpBuffApplied?'#ff8800':s.d.dmg>DEF[s.key].dmg*1.005?'#ffdd44':'#ccddf0';
   }
   const armEl=document.getElementById(`sa-${side}`);
   if(armEl){
    armEl.textContent=s.d.arm;
    armEl.style.color=s.lowHpBuffApplied?'#ff8800':Math.abs(s.d.arm-DEF[s.key].arm)>1?'#ffdd44':'#ccddf0';
   }
   const mdefEl=document.getElementById(`smd-${side}`);
   if(mdefEl){
    mdefEl.textContent=s.d.magDef;
    const mdefBase=DEF[s.key].magDef;
    mdefEl.style.color=s.d.magDef<mdefBase-0.5?'#cc88ff':s.d.magDef>mdefBase*1.005?'#ffdd44':'#ccddf0';
   }
   const omEl=document.getElementById(`so-${side}`);
   if(omEl){
    omEl.textContent=Math.abs(s.omegaCur).toFixed(1);
    omEl.style.color=s.lowHpBuffApplied?'#ff8800':Math.abs(s.omegaCur)>s.d.om*1.05?'#ffdd44':'#ccddf0';
   }
   const stkEl=document.getElementById(`sst-${side}`);
   if(stkEl){
    if(s.key==='ranger'){
     const pct=Math.round((s.critChance||0)*100);
     stkEl.textContent=`CRIT ${pct}%`;
     stkEl.style.color=pct>=60?'#ff4400':pct>=30?'#ffaa22':'#88cc44';
    } else if(s.key==='wizard'){
     const bonus=s.wizardDmgBonusTotal||0;
     stkEl.textContent=bonus>0?`EXILE +${bonus}`:`${s.stacks}/${thresh}`;
     stkEl.style.color=bonus>0?'#cc88ff':s.stacks>=thresh?'#ff4400':s.stacks>0?'#e8b430':'#556677';
    } else {
     stkEl.textContent=s.stacks+'/'+thresh;
     stkEl.style.color=s.stacks>=thresh?'#ff4400':s.stacks>0?'#e8b430':'#556677';
    }
   }
  }
 }
function fillStats(key,side){
 const d=DEF[key];
 const fac=side==='r'?0:1;
 const s=spheres.find(sp=>sp.faction===fac)||null;
 const thresh=key==='trickster'?2:key==='vampire'?6:['samurai','barbarian','rogue','templar','druid','necromancer','phoenix','alchemist','dragoon','bard','plague','tidecaller','crusader','mimic','stormbringer','voidwalker','whelpling'].includes(key)?3:key==='wizard'||key==='ranger'?4:key==='priest'?8:key==='sheriff'?2:5;
 document.getElementById(`wn-${side}`).textContent=d.weapon;
 const hpEl=document.getElementById(`shp-${side}`);
 if(hpEl){hpEl.textContent=(s?Math.ceil(s.hp):d.hp)+'/'+(s?s.maxHp:d.hp);hpEl.style.color='#44ee66';}
 document.getElementById(`sd-${side}`).textContent=d.dmg.toFixed(1);
 document.getElementById(`sa-${side}`).textContent=d.arm;
 const mdefEl=document.getElementById(`smd-${side}`);
 if(mdefEl){mdefEl.textContent=d.magDef;mdefEl.style.color='#ccddf0';}
 document.getElementById(`so-${side}`).textContent=d.om.toFixed(1);
 const stkEl=document.getElementById(`sst-${side}`);
 if(stkEl){stkEl.textContent='0/'+thresh;stkEl.style.color='#556677';}
 document.getElementById(`abn-${side}`).textContent=d.ab;
 document.getElementById(side==='r'?'t-red':'t-blue').textContent=d.label;
 for(const id of[`sd-${side}`,`sa-${side}`,`so-${side}`])document.getElementById(id).style.color='#ccddf0';
}
function loop(ts){
 animId=requestAnimationFrame(loop);
 if(paused){lastTime=ts;return;}
 const dt=Math.min((ts-lastTime)/1000,.05);lastTime=ts;
 for(const s of spheres)s.update(dt);
 for(const p of projectiles)p.update(dt);
 resolveAll();
 updateParticles(dt);
 updateDmgNums(dt);
 updateBloodSplats(dt);
 updateAbBar();
 slowZones=slowZones.filter(z=>{z.update(dt);return z.life>0;});
 thornPatches=thornPatches.filter(p=>{p.update(dt);return p.life>0;});
 miasmaClouds=miasmaClouds.filter(m=>{m.update(dt);return m.life>0;});
 afterimages=afterimages.filter(a=>{a.update(dt);return a.alive;});
 noiseTraps=noiseTraps.filter(n=>{n.update(dt);return n.alive;});
 skeletons=skeletons.filter(sk=>{sk.update(dt);return sk.alive;});
 projectiles=projectiles.filter(p=>p.alive);
 if(!winDone){
  const alive=spheres.filter(s=>s.alive&&!s.dying);
  if(alive.length<2&&spheres.length>=2){winDone=true;showWinner(alive[0]||null);}
 }
 drawBg();
 drawBloodSplats();
 for(const z of slowZones)z.draw();
 for(const p of thornPatches)p.draw();
 for(const m of miasmaClouds)m.draw();
 for(const a of afterimages)a.draw();
 for(const n of noiseTraps)n.draw();
 drawParticles();
 for(const sk of skeletons)sk.draw();
 for(const p of projectiles)p.draw();
 for(const s of spheres)if(s.dying)s.draw();
 for(const s of spheres)if(!s.dying&&s.alive)s.draw();
 drawDmgNums();
}
function showWinner(w){
 const ov=document.getElementById('winner'),wt=document.getElementById('wt'),ws=document.getElementById('ws');
 if(!w)wt.innerHTML=`<span style="color:#ffcc44">DRAW!</span><br><span style="color:#aac;font-size:.75em">ALL FELL</span>`;
 else{
  const col=w.faction===0?'#ff6633':'#88aaff';
  wt.innerHTML=`<span style="color:${col}">${w.d.label.toUpperCase()}</span><br><span style="color:#ffcc44;font-size:.8em">WINS!</span>`;
 }
 if(ws)ws.innerHTML='<div style="font-size:.75em">TAP — REMATCH</div><div style="font-size:.55em;color:#5a6a80;margin-top:3px">LONG PRESS — REPICK</div>';
 ov.classList.add('show');
 let pressTimer=null;
 const cleanup=()=>{ov.removeEventListener('mousedown',onDown);ov.removeEventListener('touchstart',onDown);ov.removeEventListener('mouseup',onUp);ov.removeEventListener('touchend',onUp);};
 const onDown=()=>{pressTimer=setTimeout(()=>{cleanup();ov.classList.remove('show');window.startPicker(gameMode);},600);};
 const onUp=()=>{if(pressTimer){clearTimeout(pressTimer);pressTimer=null;cleanup();ov.classList.remove('show');launchBattle();}};
 ov.addEventListener('mousedown',onDown);ov.addEventListener('touchstart',onDown);
 ov.addEventListener('mouseup',onUp,{once:true});ov.addEventListener('touchend',onUp,{once:true});
}
