'use strict';
let royaleObstacles=[];
function resetRoyaleObstacles(){royaleObstacles=[];}
function refreshRoyaleObstaclePixels(){
 for(let i=0;i<royaleObstacles.length;i++){
  const o=royaleObstacles[i];
  o.pixel.x=o.x*W;o.pixel.y=o.y*H;o.pixel.w=o.w*W;o.pixel.h=o.h*H;
 }
}
function initRoyaleObstacles(spawnPoints,largestRadius){
 royaleObstacles=[];
 const low=ROYALE_CONFIG.obstacleCount[0],high=ROYALE_CONFIG.obstacleCount[1];
 const target=low+Math.floor(Math.random()*(high-low+1));
 const cell=Math.max(4,Math.round(H*0.025));
 const gap=largestRadius*2.5;
 for(let i=0;i<target;i++){
  let placed=false;
  for(let attempt=0;attempt<220&&!placed;attempt++){
   const cols=2+Math.floor(Math.random()*3),rows=2+Math.floor(Math.random()*3);
   const pw=cols*cell,ph=rows*cell;
   if(pw>=W*.35||ph>=H*.35)continue;
   const maxCol=Math.max(1,Math.floor((W-pw)/cell));
   const maxRow=Math.max(1,Math.floor((H-ph)/cell));
   const px=Math.floor(Math.random()*(maxCol+1))*cell;
   const py=Math.floor(Math.random()*(maxRow+1))*cell;
   if(px+pw>W||py+ph>H)continue;
   let blocked=false;
   for(let j=0;j<royaleObstacles.length;j++){
    const q=royaleObstacles[j].pixel;
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
   royaleObstacles.push({x:px/W,y:py/H,w:pw/W,h:ph/H,pixel:{x:px,y:py,w:pw,h:ph}});
   placed=true;
  }
 }
}
function drawRoyaleObstacles(){
 for(let i=0;i<royaleObstacles.length;i++){
  const p=royaleObstacles[i].pixel;
  ctx.fillStyle='#75634c';ctx.fillRect(p.x,p.y,p.w,p.h);
  ctx.fillStyle='rgba(255,232,190,.18)';ctx.fillRect(p.x+2,p.y+2,Math.max(0,p.w-4),Math.max(2,p.h*.16));
  ctx.strokeStyle='#3f3428';ctx.lineWidth=2;ctx.strokeRect(p.x+1,p.y+1,p.w-2,p.h-2);
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(p.x+p.w*.5,p.y);ctx.lineTo(p.x+p.w*.5,p.y+p.h);ctx.stroke();
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
   const p=royaleObstacles[j].pixel;
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
   const o=royaleObstacles[j].pixel;
   if(p.x+r<o.x||p.x-r>o.x+o.w||p.y+r<o.y||p.y-r>o.y+o.h)continue;
   const cx=Math.max(o.x,Math.min(o.x+o.w,p.x));
   const cy=Math.max(o.y,Math.min(o.y+o.h,p.y));
   const dx=p.x-cx,dy=p.y-cy;
   if(dx*dx+dy*dy<=r*r){p.alive=false;spawnSpark(p.x,p.y,'#e8c078',4);break;}
  }
 }
}
