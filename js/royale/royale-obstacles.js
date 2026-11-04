'use strict';
let royaleObstacles=[];
function resetRoyaleObstacles(){royaleObstacles=[];}
function refreshRoyaleObstaclePixels(){ /* World-unit geometry is persistent across viewport resizes. */ }
function initRoyaleObstacles(spawnPoints,largestRadius){
 royaleObstacles=[];
 const low=ROYALE_CONFIG.obstacleCount[0],high=ROYALE_CONFIG.obstacleCount[1];
 const target=low+Math.floor(Math.random()*(high-low+1));
 const cell=20;
 const gap=largestRadius*2.5;
 for(let i=0;i<target;i++){
  let placed=false;
  for(let attempt=0;attempt<220&&!placed;attempt++){
   const pw=(3+Math.floor(Math.random()*9))*cell,ph=(3+Math.floor(Math.random()*9))*cell;
   if(pw>220||ph>220)continue;
   const maxCol=Math.max(1,Math.floor((ROYALE_CONFIG.worldW-pw)/cell));
   const maxRow=Math.max(1,Math.floor((ROYALE_CONFIG.worldH-ph)/cell));
   const px=Math.floor(Math.random()*(maxCol+1))*cell;
   const py=Math.floor(Math.random()*(maxRow+1))*cell;
   if(px+pw>W||py+ph>H)continue;
   let blocked=false;
   for(let j=0;j<royaleObstacles.length;j++){
    const q=royaleObstacles[j];
    if(px+pw+gap>q.x&&px-gap<q.x+q.w&&py+ph+gap>q.y&&py-gap<q.y+q.h){blocked=true;break;}
   }
   if(blocked)continue;
   for(let j=0;j<spawnPoints.length;j++){
    const sp=spawnPoints[j];
    const cx=Math.max(px,Math.min(px+pw,sp.x));
    const cy=Math.max(py,Math.min(py+ph,sp.y));
    if(Math.hypot(sp.x-cx,sp.y-cy)<largestRadius*3){blocked=true;break;}
   }
   if(blocked)continue;
   royaleObstacles.push({x:px,y:py,w:pw,h:ph,sprite:royaleBuildObstacleSprite(pw,ph),bobSeed:i*1.71});
   placed=true;
  }
 }
}
function royaleBuildObstacleSprite(w,h){
 const scale=2,cv=document.createElement('canvas');cv.width=Math.ceil(w*scale);cv.height=Math.ceil(h*scale);
 const c=cv.getContext('2d');c.scale(scale,scale);
 c.fillStyle='#514b3e';c.fillRect(0,0,w,h);
 c.fillStyle='#756b55';c.fillRect(2,2,w-4,h-4);
 c.fillStyle='rgba(180,190,145,.22)';c.fillRect(3,3,w-6,Math.max(3,h*.12));
 c.strokeStyle='#3b3429';c.lineWidth=2;c.strokeRect(1,1,w-2,h-2);
 const brickH=18,brickW=38;
 for(let y=5,row=0;y<h-4;y+=brickH,row++){
  const offset=row%2?brickW/2:0;
  c.strokeStyle='rgba(35,30,24,.58)';c.lineWidth=1;c.beginPath();c.moveTo(2,y);c.lineTo(w-2,y);
  for(let x=offset;x<w;x+=brickW){c.moveTo(x,y);c.lineTo(x,y+brickH);}c.stroke();
  c.strokeStyle='rgba(220,208,170,.12)';c.beginPath();c.moveTo(3,y+1);c.lineTo(w-3,y+1);c.stroke();
 }
 c.fillStyle='rgba(63,91,52,.18)';
 for(let x=8;x<w-4;x+=31){c.fillRect(x,Math.max(3,(x*7)%Math.max(5,h-8)),3,2);}
 return cv;
}
function drawRoyaleObstacles(){
 const view=typeof royaleCameraViewRect==='function'?royaleCameraViewRect():{l:0,t:0,r:W,b:H};
 const t=(window.matchTime||0);
 for(let i=0;i<royaleObstacles.length;i++){
  const p=royaleObstacles[i];
  if(p.x+p.w<view.l-40||p.x>view.r+40||p.y+p.h<view.t-40||p.y>view.b+40)continue;
  const bob=Math.sin(t*1.15+(p.bobSeed||0))*.8;
  if(p.sprite)ctx.drawImage(p.sprite,p.x,p.y+bob,p.w,p.h);
  else{ctx.fillStyle='#75634c';ctx.fillRect(p.x,p.y+bob,p.w,p.h);}
 }
}
function royaleWallContact(s,smearTextDy){
 if(!Number.isFinite(s._royaleObstacleCooldown)||s._royaleObstacleCooldown<=0){
  s._wallContactPassives(smearTextDy);
  s._royaleObstacleCooldown=ROYALE_CONFIG.obstacleCooldown;
 }
}
function resolveRoyaleObstacles(){
 for(let i=0;i<spheres.length;i++){
  const s=spheres[i];
  if(!s.alive||s.dying||s.isLeaping)continue;
  const r=s.radius;
  for(let j=0;j<royaleObstacles.length;j++){
   const p=royaleObstacles[j];
   if(s.x+r<p.x||s.x-r>p.x+p.w||s.y+r<p.y||s.y-r>p.y+p.h)continue;
   let nx=0,ny=0,penetration=0;
   const inside=s.x>=p.x&&s.x<=p.x+p.w&&s.y>=p.y&&s.y<=p.y+p.h;
   if(inside){
    const dl=s.x-p.x,dr=p.x+p.w-s.x,dt=s.y-p.y,db=p.y+p.h-s.y;
    const shallow=Math.min(dl,dr,dt,db);
    if(shallow===dl){nx=-1;penetration=r+dl;}
    else if(shallow===dr){nx=1;penetration=r+dr;}
    else if(shallow===dt){ny=-1;penetration=r+dt;}
    else{ny=1;penetration=r+db;}
   }else{
    const cx=Math.max(p.x,Math.min(p.x+p.w,s.x));
    const cy=Math.max(p.y,Math.min(p.y+p.h,s.y));
    const dx=s.x-cx,dy=s.y-cy,dist=Math.hypot(dx,dy);
    if(dist>=r||dist===0)continue;
    nx=dx/dist;ny=dy/dist;penetration=r-dist;
   }
   s.x+=nx*penetration;s.y+=ny*penetration;
   const vn=s.vx*nx+s.vy*ny;
   if(vn<0){s.vx-=(1+0.9)*vn*nx;s.vy-=(1+0.9)*vn*ny;}
   const impactN=s.impactVx*nx+s.impactVy*ny;
   s.impactVx-=impactN*nx;s.impactVy-=impactN*ny;
   royaleWallContact(s,-r-10);
  }
 }
}
function killRoyaleProjectilesOnObstacles(){
 for(let i=0;i<projectiles.length;i++){
  const p=projectiles[i];
  if(!p.alive||!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;
  const r=p.r||p.radius||5;
  for(let j=0;j<royaleObstacles.length;j++){
   const o=royaleObstacles[j];
   if(p.x+r<o.x||p.x-r>o.x+o.w||p.y+r<o.y||p.y-r>o.y+o.h)continue;
   const cx=Math.max(o.x,Math.min(o.x+o.w,p.x));
   const cy=Math.max(o.y,Math.min(o.y+o.h,p.y));
   const dx=p.x-cx,dy=p.y-cy;
   if(dx*dx+dy*dy<=r*r){p.alive=false;spawnSpark(p.x,p.y,'#e8c078',4);break;}
  }
 }
}
