'use strict';
let royaleZone=null;
function resetRoyaleZone(){royaleZone=null;}
function initRoyaleZone(largestRadius){
 royaleZone={bounds:{l:0,t:0,r:ROYALE_CONFIG.worldW,b:ROYALE_CONFIG.worldH},from:{l:0,t:0,r:ROYALE_CONFIG.worldW,b:ROYALE_CONFIG.worldH},to:null,
  progress:0,originalW:ROYALE_CONFIG.worldW,originalH:ROYALE_CONFIG.worldH,largestRadius:largestRadius||0};
}
function planNextZone(){
 if(!royaleZone)return;
 const phase=Math.max(1,Math.min(ROYALE_CONFIG.phases,royaleState.phase));
 const areaScale=Math.sqrt(Math.max(0,1-ROYALE_CONFIG.shrinkAreaStep*phase));
 const current=royaleZone.bounds;
 const currentW=current.r-current.l,currentH=current.b-current.t;
 const minW=Math.min(royaleZone.originalW,Math.max(5*royaleZone.largestRadius,0.12*royaleZone.originalW));
 const minH=Math.min(royaleZone.originalH,Math.max(5*royaleZone.largestRadius,0.12*royaleZone.originalH));
 const targetW=Math.min(currentW,Math.max(minW,royaleZone.originalW*areaScale));
 const targetH=Math.min(currentH,Math.max(minH,royaleZone.originalH*areaScale));
 const roomX=Math.max(0,currentW-targetW),roomY=Math.max(0,currentH-targetH);
 const left=current.l+Math.random()*roomX,top=current.t+Math.random()*roomY;
 royaleZone.from={l:current.l,t:current.t,r:current.r,b:current.b};
 royaleZone.to={l:left,t:top,r:left+targetW,b:top+targetH};
 royaleZone.progress=0;
}
function updateZone(dt){
 if(!royaleZone||!royaleZone.to||royaleState.state!=='SHRINK')return;
 royaleZone.progress=Math.min(1,royaleZone.progress+dt/ROYALE_CONFIG.shrink);
 const p=royaleZone.progress,t=p*p*(3-2*p);
 const f=royaleZone.from,to=royaleZone.to,b=royaleZone.bounds;
 b.l=f.l+(to.l-f.l)*t;b.t=f.t+(to.t-f.t)*t;
 b.r=f.r+(to.r-f.r)*t;b.b=f.b+(to.b-f.b)*t;
}
function finishRoyaleZone(){
 if(!royaleZone||!royaleZone.to)return;
 const b=royaleZone.bounds,to=royaleZone.to;
 b.l=to.l;b.t=to.t;b.r=to.r;b.b=to.b;royaleZone.progress=1;
}
function resolveRoyaleBounds(){
 if(!royaleZone)return;
 const b=royaleZone.bounds;
 for(const bodies of [spheres,skeletons]){
 for(let i=0;i<bodies.length;i++){
  const s=bodies[i];
  if(!s.alive||s.dying||s.isLeaping)continue;
  const r=s.radius,spd=s.targetSpd||s.baseSpd||s.speed||0;
  let touched=false,smear=-r-10;
  if(s.x-r<b.l){s.x=b.l+r;s.vx=Math.max(Math.abs(s.vx)*WALL_REST,spd*.5);s.impactVx=0;touched=true;}
  else if(s.x+r>b.r){s.x=b.r-r;s.vx=-Math.max(Math.abs(s.vx)*WALL_REST,spd*.5);s.impactVx=0;touched=true;}
  if(s.y-r<b.t){s.y=b.t+r;s.vy=Math.max(Math.abs(s.vy)*WALL_REST,spd*.5);s.impactVy=0;touched=true;smear=r+10;}
  else if(s.y+r>b.b){s.y=b.b-r;s.vy=-Math.max(Math.abs(s.vy)*WALL_REST,spd*.5);s.impactVy=0;touched=true;}
  if(touched)royaleWallContact(s,smear);
 }
 }
}
function royaleZoneIntersectsView(l,t,r,b){
 const view=typeof royaleCameraViewRect==='function'?royaleCameraViewRect():{l:0,t:0,r:W,b:H};
 return r>=view.l&&l<=view.r&&b>=view.t&&t<=view.b;
}
function drawZone(){
 if(!royaleZone)return;
 const b=royaleZone.bounds;
 ctx.save();ctx.fillStyle='rgba(5,10,20,.58)';
 ctx.fillRect(0,0,W,Math.max(0,b.t));
 ctx.fillRect(0,b.b,W,Math.max(0,H-b.b));
 ctx.fillRect(0,b.t,Math.max(0,b.l),Math.max(0,b.b-b.t));
 ctx.fillRect(b.r,b.t,Math.max(0,W-b.r),Math.max(0,b.b-b.t));
 if(royaleZone.to&&(royaleState.state==='WARNING'||royaleState.state==='EVENT')){
  const n=royaleZone.to;if(royaleZoneIntersectsView(n.l,n.t,n.r,n.b)){ctx.strokeStyle='#f4d06f';ctx.lineWidth=2;ctx.setLineDash([9,6]);ctx.strokeRect(n.l,n.t,n.r-n.l,n.b-n.t);ctx.setLineDash([]);}
 }
 if(royaleZoneIntersectsView(b.l,b.t,b.r,b.b)){ctx.shadowColor='#d66a32';ctx.shadowBlur=12;ctx.strokeStyle='#e5a23c';ctx.lineWidth=7;
  ctx.strokeRect(b.l,b.t,b.r-b.l,b.b-b.t);ctx.shadowBlur=0;}ctx.restore();
}
function royaleHandleResize(){ if(typeof royaleViewportChanged==='function')royaleViewportChanged(); }
