'use strict';
// Royale-only world camera. It observes simulation state and changes render transforms only.
const ROYALE_CAMERA_CONFIG={
 zoomMinFactor:0.55,zoomMaxFactor:1.7,posTau:0.30,zoomTau:0.55,lookAhead:0.3,deadzone:0.03,
 heatDecay:1.2,clashDist:7,groupDist:12,pad:4,switchRatio:1.4,switchBias:0.2,switchHold:0.6,
 minDwell:1.5,idleScore:0.35,establishWarning:true,establishEventSecs:2,killcamSecs:1.0,
 killcamZoomFactor:1.5,followSecs:8,shakeMax:6,shakeDecay:0.25
};
const royaleCamera={
 x:1200,y:675,zoom:1,view:{w:1,h:1},mode:'auto',followRef:null,shots:[],shakeX:0,shakeY:0,
 shakeMag:0,heat:new WeakMap(),minimap:true,anchor:null,switchCandidate:null,switchCandidateT:0,
 anchorSince:0,matchT:0,establishT:0,establishing:true,snap:true,shakeSeed:0x7a31c4d9,lastHp:new WeakMap(),lastLiving:new Set(),
 shakeEnabled:!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches),
 switchCount:0
};
function royaleCameraRand(){let x=royaleCamera.shakeSeed|0;x^=x<<13;x^=x>>>17;x^=x<<5;royaleCamera.shakeSeed=x|0;return (x>>>0)/4294967296;}
function initRoyaleCamera(){
 royaleCamera.x=ROYALE_CONFIG.worldW/2;royaleCamera.y=ROYALE_CONFIG.worldH/2;royaleCamera.zoom=1;
 royaleCamera.mode='auto';royaleCamera.followRef=null;royaleCamera.shots=[];royaleCamera.heat=new WeakMap();
 royaleCamera.anchor=null;royaleCamera.switchCandidate=null;royaleCamera.switchCandidateT=0;royaleCamera.anchorSince=0;
 royaleCamera.matchT=0;royaleCamera.establishT=0;royaleCamera.establishing=true;royaleCamera.snap=true;
 royaleCamera.lastHp=new WeakMap();royaleCamera.lastLiving=new Set();
 royaleCamera.x=ROYALE_CONFIG.worldW/2;royaleCamera.y=ROYALE_CONFIG.worldH/2;royaleCamera.zoom=royaleCameraMinZoom();
 royaleCamera.shakeX=royaleCamera.shakeY=royaleCamera.shakeMag=0;royaleCamera.switchCount=0;
 royaleViewportChanged();
}
function royaleViewportChanged(){
 const rect=canvas.getBoundingClientRect();
 royaleCamera.view.w=Math.max(1,Math.floor(rect.width));royaleCamera.view.h=Math.max(1,Math.floor(rect.height));
 royaleCamera.zoom=royaleCameraClampZoom(royaleCamera.zoom);
 royaleCamera.x=royaleCameraClampX(royaleCamera.x,royaleCamera.zoom);royaleCamera.y=royaleCameraClampY(royaleCamera.y,royaleCamera.zoom);
}
function royaleCameraBaseZoom(){return royaleCamera.view.h/ROYALE_CONFIG.baseVisibleHeight;}
function royaleCameraMinZoom(){return Math.max(royaleCamera.view.w/ROYALE_CONFIG.worldW,royaleCamera.view.h/ROYALE_CONFIG.worldH,royaleCameraBaseZoom()*ROYALE_CAMERA_CONFIG.zoomMinFactor);}
function royaleCameraMaxZoom(){return Math.max(royaleCameraMinZoom(),royaleCameraBaseZoom()*ROYALE_CAMERA_CONFIG.zoomMaxFactor);}
function royaleCameraClampZoom(z){return Math.max(royaleCameraMinZoom(),Math.min(royaleCameraMaxZoom(),z));}
function royaleCameraClampX(x,z){const hw=royaleCamera.view.w/(2*z);return Math.max(hw,Math.min(ROYALE_CONFIG.worldW-hw,x));}
function royaleCameraClampY(y,z){const hh=royaleCamera.view.h/(2*z);return Math.max(hh,Math.min(ROYALE_CONFIG.worldH-hh,y));}
function royaleWorldToScreen(x,y){return{x:(x-royaleCamera.x)*royaleCamera.zoom+royaleCamera.view.w/2,y:(y-royaleCamera.y)*royaleCamera.zoom+royaleCamera.view.h/2};}
function royaleCameraViewRect(){const w=royaleCamera.view.w/royaleCamera.zoom,h=royaleCamera.view.h/royaleCamera.zoom;return{l:royaleCamera.x-w/2,t:royaleCamera.y-h/2,r:royaleCamera.x+w/2,b:royaleCamera.y+h/2,w,h};}
function royaleCameraFit(rect,padding=0){const w=Math.max(1,rect.r-rect.l+padding*2),h=Math.max(1,rect.b-rect.t+padding*2);return royaleCameraClampZoom(Math.min(royaleCamera.view.w/w,royaleCamera.view.h/h));}
function royaleCameraSetMode(m){if(['auto','full','follow'].includes(m)){royaleCamera.mode=m;if(m!=='follow')royaleCamera.followRef=null;}}
function royaleCameraFollow(faction){const target=spheres.find(s=>s.alive&&!s.dying&&!s.isReplica&&s.faction===faction);if(target){royaleCamera.mode='follow';royaleCamera.followRef=target;royaleCamera.followT=0;}}
function royaleCameraShake(mag){if(!royaleCamera.shakeEnabled)return;royaleCamera.shakeMag=Math.min(ROYALE_CAMERA_CONFIG.shakeMax,royaleCamera.shakeMag+Math.max(0,mag));}
function royaleCameraPushShot(shot){if(shot&&Number.isFinite(shot.x)&&Number.isFinite(shot.y))royaleCamera.shots.push({x:shot.x,y:shot.y,zoomFactor:shot.zoomFactor||1,secs:Math.max(.01,shot.secs||1),priority:shot.priority||0,t:0});}
royaleCamera.shake=royaleCameraShake;royaleCamera.pushShot=royaleCameraPushShot;royaleCamera.setMode=royaleCameraSetMode;royaleCamera.follow=royaleCameraFollow;
function royaleCameraLiving(){return spheres.filter(s=>s.alive&&!s.dying);}
function royaleCameraBoundsFit(){const b=royaleZone&&royaleZone.bounds||{l:0,t:0,r:ROYALE_CONFIG.worldW,b:ROYALE_CONFIG.worldH};return{l:b.l,t:b.t,r:b.r,b:b.b};}
function royaleCameraHeatPass(living,dt){
 for(const s of living){const hp=Number.isFinite(s.hp)?s.hp:0,max=Math.max(1,s.maxHp||1),prev=royaleCamera.lastHp.has(s)?royaleCamera.lastHp.get(s):hp;
  const dmg=Math.max(0,prev-hp),add=Math.max(0,Math.min(1.5,dmg/(max*.02)));
  let heat=royaleCamera.heat.get(s)||0;heat=(heat+add)*Math.exp(-Math.max(0,dt)/ROYALE_CAMERA_CONFIG.heatDecay);royaleCamera.heat.set(s,heat);
  if(dmg>max*.06)royaleCameraShake(Math.min(ROYALE_CAMERA_CONFIG.shakeMax,dmg/max*ROYALE_CAMERA_CONFIG.shakeMax));
  royaleCamera.lastHp.set(s,hp);
 }
}
function royaleCameraFocus(living,dt){
 const cfg=ROYALE_CAMERA_CONFIG;if(!living.length)return null;
 const scoreCandidates=living.filter(s=>!s.isReplica||(royaleCamera.heat.get(s)||0)>0);if(!scoreCandidates.length)return living.filter(s=>!s.isReplica).slice(0,2);
 const scores=scoreCandidates.map(s=>{let nearby=0;for(const o of living){if(o===s)continue;if(Math.hypot(o.x-s.x,o.y-s.y)<=cfg.clashDist*ROYALE_CONFIG.sphereRadius)nearby++;}
  const hp=(s.maxHp||1)>0?s.hp/s.maxHp:0;return{s,score:(royaleCamera.heat.get(s)||0)+.6*nearby+(hp<.25?.3:0)+.05};});
 let best=scores.reduce((a,b)=>b.score>a.score?b:a,scores[0]),anchor=best.s;
 if(royaleCamera.anchor&&living.includes(royaleCamera.anchor)){
  const cur=scores.find(x=>x.s===royaleCamera.anchor);
  if(cur&&anchor!==cur.s&&best.score>cfg.switchRatio*cur.score+cfg.switchBias&&royaleCamera.matchT-royaleCamera.anchorSince>=cfg.minDwell){
   if(royaleCamera.switchCandidate===anchor)royaleCamera.switchCandidateT+=dt;else{royaleCamera.switchCandidate=anchor;royaleCamera.switchCandidateT=0;}
   if(royaleCamera.switchCandidateT>=cfg.switchHold){royaleCamera.anchor=anchor;royaleCamera.anchorSince=royaleCamera.matchT;royaleCamera.switchCandidate=null;royaleCamera.switchCandidateT=0;royaleCamera.switchCount++;}
   else anchor=cur.s;
  }else{anchor=cur.s;royaleCamera.switchCandidate=null;royaleCamera.switchCandidateT=0;}
 }
 if(!royaleCamera.anchor||!living.includes(royaleCamera.anchor)){royaleCamera.anchor=anchor;royaleCamera.anchorSince=royaleCamera.matchT;}
 const chosen=scores.find(x=>x.s===royaleCamera.anchor)||best;
 if(chosen.score>=cfg.idleScore){
  return living.filter(s=>Math.hypot(s.x-anchor.x,s.y-anchor.y)<=cfg.groupDist*ROYALE_CONFIG.sphereRadius);
 }
 const prim=living.filter(s=>!s.isReplica);
 if(prim.length<2)return prim.length?prim:living;
 let pair=null,dist=Infinity;
 for(let i=0;i<prim.length;i++)for(let j=i+1;j<prim.length;j++){const d=Math.hypot(prim[i].x-prim[j].x,prim[i].y-prim[j].y);if(d<dist){dist=d;pair=[prim[i],prim[j]];}}
 return pair||living.slice(0,1);
}
function royaleCameraGroupTarget(group){
 if(!group||!group.length)return null;
 const r=ROYALE_CONFIG.sphereRadius,pad=ROYALE_CAMERA_CONFIG.pad*r;
 let l=Infinity,t=Infinity,rr=-Infinity,b=-Infinity,wx=0,wy=0,wt=0,vx=0,vy=0;
 for(const s of group){l=Math.min(l,s.x);t=Math.min(t,s.y);rr=Math.max(rr,s.x);b=Math.max(b,s.y);const h=Math.max(.05,royaleCamera.heat.get(s)||0);wx+=s.x*h;wy+=s.y*h;wt+=h;vx+=s.vx||0;vy+=s.vy||0;}
 const cx=(l+rr)/2*.7+(wt?wx/wt:(l+rr)/2)*.3+(vx/group.length)*ROYALE_CAMERA_CONFIG.lookAhead;
 const cy=(t+b)/2*.7+(wt?wy/wt:(t+b)/2)*.3+(vy/group.length)*ROYALE_CAMERA_CONFIG.lookAhead;
 const rect={l:l-pad,t:t-pad,r:rr+pad,b:b+pad};
 return{x:cx,y:cy,zoom:royaleCameraFit(rect),rect};
}
function updateRoyaleCamera(dtReal){
 if(!Number.isFinite(dtReal)||dtReal<0)dtReal=0;const dt=Math.min(dtReal,.25);royaleCamera.matchT+=dt;
 // The static countdown frame is snapped to the full world; resumed frames ease toward focus.
 if(royaleCamera.snap)royaleCamera.snap=false;
 const living=royaleCameraLiving();royaleCameraHeatPass(living,dt);
 const liveSet=new Set(living);
 for(const prior of royaleCamera.lastLiving){if(!liveSet.has(prior)){
  const hp=Number.isFinite(prior.hp)?prior.hp:0,max=Math.max(1,prior.maxHp||1),prev=royaleCamera.lastHp.has(prior)?royaleCamera.lastHp.get(prior):hp;
  const finalDamage=Math.max(0,prev-hp);
  let heat=royaleCamera.heat.get(prior)||0;
  heat=(heat+Math.max(0,Math.min(1.5,finalDamage/(max*.02))))*Math.exp(-dt/ROYALE_CAMERA_CONFIG.heatDecay);
  royaleCamera.heat.set(prior,heat);royaleCamera.lastHp.set(prior,hp);
  if(finalDamage>max*.06)royaleCameraShake(Math.min(ROYALE_CAMERA_CONFIG.shakeMax,finalDamage/max*ROYALE_CAMERA_CONFIG.shakeMax));
  if(heat>0)royaleCameraPushShot({x:prior.x,y:prior.y,zoomFactor:ROYALE_CAMERA_CONFIG.killcamZoomFactor,secs:ROYALE_CAMERA_CONFIG.killcamSecs,priority:100});
 }}
 royaleCamera.lastLiving=liveSet;
 let target=null,zoom=null,override=false;
 // Death killcam shots are queued from the heat pass in the death observer below.
 if(royaleCamera.shots.length){royaleCamera.shots.sort((a,b)=>b.priority-a.priority);const shot=royaleCamera.shots[0];shot.t+=dt;target={x:shot.x,y:shot.y};zoom=royaleCameraClampZoom(royaleCameraBaseZoom()*shot.zoomFactor);override=true;if(shot.t>=shot.secs)royaleCamera.shots.shift();}
 else if(royaleCamera.mode==='follow'){
  const f=royaleCamera.followRef;royaleCamera.followT=(royaleCamera.followT||0)+dt;
  if(!f||!f.alive||f.dying||royaleCamera.followT>=ROYALE_CAMERA_CONFIG.followSecs){royaleCamera.mode='auto';royaleCamera.followRef=null;}
  else{target={x:f.x,y:f.y};zoom=royaleCameraClampZoom(royaleCameraBaseZoom()*1.1);override=true;}
 }
 if(!override&&royaleCamera.mode==='full'){const b=royaleCameraBoundsFit();target={x:(b.l+b.r)/2,y:(b.t+b.b)/2};zoom=royaleCameraFit(b);override=true;}
 if(!override&&ROYALE_CAMERA_CONFIG.establishWarning&&royaleState&&(royaleState.state==='WARNING'||(royaleState.state==='EVENT'&&royaleState.stateTimer>ROYALE_CONFIG.event-ROYALE_CAMERA_CONFIG.establishEventSecs))){
  if(living.length){const xs=living.map(s=>s.x),ys=living.map(s=>s.y),b={l:Math.min(...xs),r:Math.max(...xs),t:Math.min(...ys),b:Math.max(...ys)};target={x:(b.l+b.r)/2,y:(b.t+b.b)/2};zoom=royaleCameraFit(b,ROYALE_CONFIG.sphereRadius*5);override=true;}
 }
 if(!override&&(living.length<=2||(royaleState&&royaleState.state==='FINAL'))){const b=royaleCameraBoundsFit();target={x:(b.l+b.r)/2,y:(b.t+b.b)/2};zoom=royaleCameraFit(b,ROYALE_CONFIG.sphereRadius*ROYALE_CAMERA_CONFIG.pad);override=true;}
 if(!override){const group=royaleCameraFocus(living,dt),f=royaleCameraGroupTarget(group);if(f){target={x:f.x,y:f.y};zoom=f.zoom;}}
 if(!target){target={x:ROYALE_CONFIG.worldW/2,y:ROYALE_CONFIG.worldH/2};zoom=royaleCameraMinZoom();}
 zoom=royaleCameraClampZoom(zoom);
 const dx=target.x-royaleCamera.x,dy=target.y-royaleCamera.y,viewW=royaleCamera.view.w/royaleCamera.zoom,viewH=royaleCamera.view.h/royaleCamera.zoom;
 if(Math.abs(dx)<ROYALE_CAMERA_CONFIG.deadzone*viewW)target.x=royaleCamera.x;
 if(Math.abs(dy)<ROYALE_CAMERA_CONFIG.deadzone*viewH)target.y=royaleCamera.y;
 const teleport=Math.hypot(dx/viewW,dy/viewH)>2,tau=teleport?.15:ROYALE_CAMERA_CONFIG.posTau;
 const ap=royaleCamera.snap?1:1-Math.exp(-dt/tau),az=royaleCamera.snap?1:1-Math.exp(-dt/ROYALE_CAMERA_CONFIG.zoomTau);
 royaleCamera.x=royaleCameraClampX(royaleCamera.x+(target.x-royaleCamera.x)*ap,zoom);
 royaleCamera.y=royaleCameraClampY(royaleCamera.y+(target.y-royaleCamera.y)*ap,zoom);
 royaleCamera.zoom=royaleCameraClampZoom(royaleCamera.zoom+(zoom-royaleCamera.zoom)*az);
 royaleCamera.x=royaleCameraClampX(royaleCamera.x,royaleCamera.zoom);royaleCamera.y=royaleCameraClampY(royaleCamera.y,royaleCamera.zoom);
 royaleCamera.snap=false;
 royaleCamera.shakeMag=Math.max(0,royaleCamera.shakeMag-dt/ROYALE_CAMERA_CONFIG.shakeDecay);
 royaleCamera.shakeX=(royaleCameraRand()*2-1)*royaleCamera.shakeMag;royaleCamera.shakeY=(royaleCameraRand()*2-1)*royaleCamera.shakeMag;
}
function applyRoyaleCamera(c){const z=royaleCamera.zoom,sx=Math.round(royaleCamera.view.w/2-royaleCamera.x*z+royaleCamera.shakeX),sy=Math.round(royaleCamera.view.h/2-royaleCamera.y*z+royaleCamera.shakeY);c.setTransform(z,0,0,z,sx,sy);}
function resetRoyaleCamera(c){c.setTransform(1,0,0,1,0,0);}
function royaleCameraDrawMinimap(){
 if(!royaleCamera.minimap)return;const v=royaleCamera.view,w=v.w*.18,h=w*ROYALE_CONFIG.worldH/ROYALE_CONFIG.worldW,x=v.w-w-12,y=v.h-h-12,sx=w/ROYALE_CONFIG.worldW,sy=h/ROYALE_CONFIG.worldH;
 ctx.save();ctx.globalAlpha=.4;ctx.fillStyle='#07101c';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#9ba9b9';ctx.strokeRect(x,y,w,h);
 const b=royaleZone&&royaleZone.bounds;if(b){ctx.strokeStyle='#efad46';ctx.strokeRect(x+b.l*sx,y+b.t*sy,(b.r-b.l)*sx,(b.b-b.t)*sy);}
 for(const o of royaleObstacles){ctx.fillStyle='#a89578';ctx.fillRect(x+o.x*sx,y+o.y*sy,Math.max(1,o.w*sx),Math.max(1,o.h*sy));}
 for(const s of royaleCameraLiving()){ctx.fillStyle=ROYALE_FACTION_COLORS[s.faction]?.color||'#fff';ctx.beginPath();ctx.arc(x+s.x*sx,y+s.y*sy,2.5,0,Math.PI*2);ctx.fill();}
 const r=royaleCameraViewRect();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(x+r.l*sx,y+r.t*sy,r.w*sx,r.h*sy);ctx.restore();
}
function royaleCameraDrawPointers(){
 const r=royaleCameraViewRect(),inset=14,z=royaleCamera.zoom;
 for(const s of royaleCameraLiving()){if(s.isReplica||s.x>=r.l&&s.x<=r.r&&s.y>=r.t&&s.y<=r.b)continue;
  const p=royaleWorldToScreen(s.x,s.y),cx=Math.max(inset,Math.min(royaleCamera.view.w-inset,p.x)),cy=Math.max(inset,Math.min(royaleCamera.view.h-inset,p.y));
  const a=Math.atan2(p.y-cy,p.x-cx),col=ROYALE_FACTION_COLORS[s.faction]?.color||'#fff';
  ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-5);ctx.lineTo(-3,0);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.rotate(-a);ctx.fillStyle='#fff';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(String(s.faction+1),0,14);ctx.restore();
 }
}

function royaleEnsureCameraButton(){
 const controls=document.getElementById('controls');if(!controls)return;
 let cam=document.getElementById('royale-cam-btn');
 if(!cam){cam=document.createElement('button');cam.id='royale-cam-btn';cam.className='pbtn';cam.style.cssText='font-size:9px;padding:7px 9px';controls.appendChild(cam);}
 const sync=()=>{cam.textContent='CAM: '+(royaleCamera.mode==='full'?'FULL':'AUTO');};
 cam.onclick=()=>{royaleCameraSetMode(royaleCamera.mode==='full'?'auto':'full');sync();};sync();
 let mini=document.getElementById('royale-minimap-btn');
 if(!mini){mini=document.createElement('button');mini.id='royale-minimap-btn';mini.className='pbtn';mini.textContent='MAP: ON';mini.style.cssText='font-size:9px;padding:7px 9px';controls.appendChild(mini);}
 mini.onclick=()=>{royaleCamera.minimap=!royaleCamera.minimap;mini.textContent='MAP: '+(royaleCamera.minimap?'ON':'OFF');};
}
window.addEventListener('keydown',ev=>{
 if(gameMode!=='royale'||ev.repeat)return;
 if(ev.key.toLowerCase()==='c'){royaleCameraSetMode(royaleCamera.mode==='full'?'auto':'full');royaleEnsureCameraButton();}
 if(ev.key.toLowerCase()==='m'){royaleCamera.minimap=!royaleCamera.minimap;const b=document.getElementById('royale-minimap-btn');if(b)b.textContent='MAP: '+(royaleCamera.minimap?'ON':'OFF');}
});
