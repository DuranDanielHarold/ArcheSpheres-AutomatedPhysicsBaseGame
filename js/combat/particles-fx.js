'use strict';
// ▓▓▓ MODULE: combat/particles-fx.js — extracted from former js/engine.js ▓▓▓
// Particle, damage/heal number, blood splat, and background rendering helpers.

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
