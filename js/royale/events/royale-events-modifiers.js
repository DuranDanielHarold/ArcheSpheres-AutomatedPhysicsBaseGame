'use strict';

const royaleModifierState={
 bloodMoon:{vignette:null,width:0,height:0},
 lowGravity:{mode:null,current:1,start:1,target:1,elapsed:0,motes:[]},
 timeWarp:{mode:null,target:1},
 glassCannon:{active:false},
 kingsBounty:{crowned:null,previousHook:null,hook:null}
};

function royaleModifierLiving(s){return !!(s&&s.alive&&!s.dying);}
function royaleModifierPrimary(s){return royaleModifierLiving(s)&&!s.isReplica;}
function royaleModifierApplyDamage(s,id,mult){if(royaleModifierLiving(s))royaleSetDmgTakenMod(s,id,mult);}
function royaleModifierClearDamage(id){for(let i=0;i<spheres.length;i++)royaleClearDmgTakenMod(spheres[i],id);}
function royaleModifierApplyHeal(s,id,mult){if(royaleModifierLiving(s))royaleSetHealMod(s,id,mult);}
function royaleModifierClearHeal(id){for(let i=0;i<spheres.length;i++)royaleClearHealMod(spheres[i],id);}
function royaleModifierConsumeForced(id,allowed,randomValue){
 const forced=window._royaleModifierForcedVariants&&window._royaleModifierForcedVariants[id];
 if(forced&&allowed.includes(forced)){delete window._royaleModifierForcedVariants[id];return forced;}
 return randomValue();
}
function royaleModifierSetVariant(id,variant){
 if(!window._royaleModifierForcedVariants)window._royaleModifierForcedVariants={};
 window._royaleModifierForcedVariants[id]=variant;
 return true;
}

function royaleBloodMoonVignette(){
 const state=royaleModifierState.bloodMoon,w=canvas.width,h=canvas.height;
 if(state.vignette&&state.width===w&&state.height===h)return state.vignette;
 if(!state.vignette)state.vignette=document.createElement('canvas');
 state.vignette.width=w;state.vignette.height=h;state.width=w;state.height=h;
 const vctx=state.vignette.getContext('2d');
 const radius=Math.max(w,h)*0.78;
 const gradient=vctx.createRadialGradient(w*.5,h*.48,Math.min(w,h)*.12,w*.5,h*.48,radius);
 gradient.addColorStop(0,'rgba(115,0,8,0)');
 gradient.addColorStop(.52,'rgba(125,0,10,.12)');
 gradient.addColorStop(1,'rgba(115,0,12,1)');
 vctx.fillStyle=gradient;vctx.fillRect(0,0,w,h);
 return state.vignette;
}

royaleRegisterEvent('bloodMoon',{
 start(){
  const c=ROYALE_EVENT_CONFIG.bloodMoon;
  for(let i=0;i<spheres.length;i++){royaleModifierApplyDamage(spheres[i],'bloodMoon',c.dmgTaken);royaleModifierApplyHeal(spheres[i],'bloodMoon',c.healMult);}
 },
 update(){
  const c=ROYALE_EVENT_CONFIG.bloodMoon;
  for(let i=0;i<spheres.length;i++){const s=spheres[i];royaleModifierApplyDamage(s,'bloodMoon',c.dmgTaken);royaleModifierApplyHeal(s,'bloodMoon',c.healMult);}
 },
 end(){royaleModifierClearDamage('bloodMoon');royaleModifierClearHeal('bloodMoon');},
 drawScreen(){
  const c=ROYALE_EVENT_CONFIG.bloodMoon,t=window.matchTime||0;
  const pulse=.82+.18*Math.sin(t*.7);
  const vignette=royaleBloodMoonVignette();
  ctx.save();ctx.globalAlpha=c.tint*pulse;ctx.drawImage(vignette,0,0);ctx.restore();
  const x=canvas.width-34,y=34;
  ctx.save();ctx.translate(x,y);ctx.globalAlpha=.82;
  ctx.fillStyle='#e7c6c2';ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.fill();
  ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(6,-4,10,0,Math.PI*2);ctx.fill();
  ctx.globalCompositeOperation='source-over';ctx.strokeStyle='#e8b2ad';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,15,Math.PI*.12,Math.PI*1.15);ctx.stroke();
  ctx.restore();
 }
});

royaleRegisterEvent('lowGravity',{
 start(){
  const c=ROYALE_EVENT_CONFIG.lowGravity,state=royaleModifierState.lowGravity;
  state.mode=royaleModifierConsumeForced('lowGravity',['LOW','FLIP'],()=>Math.random()<c.flipChance?'FLIP':'LOW');
  state.start=1;state.current=1;state.target=state.mode==='FLIP'?c.flipMult:c.lowMult;state.elapsed=0;
  state.motes.length=0;
  for(let i=0;i<c.motes;i++)state.motes.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,speed:18+Math.random()*34,phase:Math.random()*Math.PI*2,size:1+Math.random()*1.8});
 },
 update(dt){
  const c=ROYALE_EVENT_CONFIG.lowGravity,state=royaleModifierState.lowGravity;
  state.elapsed=Math.min(c.tween,state.elapsed+dt);
  const p=c.tween>0?state.elapsed/c.tween:1;
  state.current=state.start+(state.target-state.start)*p;
  royaleSetGravity(state.current);
  // Mote positions are derived from matchTime in drawScreen so their visual
  // animation remains independent of the simulation time scale.

 },
 end(){royaleResetGravity();const s=royaleModifierState.lowGravity;s.mode=null;s.motes.length=0;s.current=1;s.target=1;s.elapsed=0;},
 drawScreen(){
  const state=royaleModifierState.lowGravity,t=window.matchTime||0,dir=state.mode==='FLIP'?-1:1,span=canvas.height+16;
  ctx.save();ctx.globalAlpha=.24;ctx.fillStyle='#d7ecf5';
  for(let i=0;i<state.motes.length;i++){const m=state.motes[i],travel=(m.speed*t*dir+m.phase*span)%span,y=((m.y-travel+span*2)%span)-8,x=m.x+Math.sin(t*.7+m.phase)*5;ctx.beginPath();ctx.arc(x,y,m.size,0,Math.PI*2);ctx.fill();}
  if(state.mode==='FLIP'){const x=canvas.width-30,y=74;ctx.globalAlpha=.65;ctx.strokeStyle='#d9efff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+10);ctx.lineTo(x,y-10);ctx.moveTo(x-6,y-4);ctx.lineTo(x,y-10);ctx.lineTo(x+6,y-4);ctx.stroke();}
  ctx.restore();
 }
});

royaleRegisterEvent('timeWarp',{
 start(){
  const c=ROYALE_EVENT_CONFIG.timeWarp,state=royaleModifierState.timeWarp;
  state.mode=royaleModifierConsumeForced('timeWarp',['SLOW','FAST'],()=>Math.random()<c.fastChance?'FAST':'SLOW');
  state.target=state.mode==='FAST'?c.fast:c.slow;
  royaleSetTimeScale(state.target,c.tween);
 },
 update(){},
 end(){royaleResetTimeScale(ROYALE_EVENT_CONFIG.timeWarp.tween);royaleModifierState.timeWarp.mode=null;royaleModifierState.timeWarp.target=1;},
 drawScreen(){
  const state=royaleModifierState.timeWarp,scale=window._royaleTimeScale||1;
  const x=30,y=66,r=13,t=window.matchTime||0;
  ctx.save();ctx.globalAlpha=.76;ctx.strokeStyle='#d6dce7';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
  ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(t*scale*1.8)*8,y-Math.cos(t*scale*1.8)*8);ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(t*scale*.8)*5,y+Math.sin(t*scale*.8)*5);ctx.stroke();
  ctx.fillStyle='#eef2f8';ctx.font='bold 10px monospace';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText((state.mode==='FAST'?'x':'x')+scale.toFixed(1),x+19,y);
  ctx.restore();
 }
});

function royaleGlassCannonStrip(s,c){
 if(!royaleModifierLiving(s)||!s.d)return;
 if(s._gcArm===undefined){s._gcArm=s.d.arm;s._gcMdef=s.d.magDef;}
 if(s.d.arm!==0||s.d.magDef!==0){s.d=Object.assign({},s.d);s.d.arm=0;s.d.magDef=0;}
 royaleSetDmgTakenMod(s,'glassCannon',c.dmgTaken);
}
function royaleGlassCannonRestore(){
 for(let i=0;i<spheres.length;i++){
  const s=spheres[i];if(s._gcArm===undefined&&s._gcMdef===undefined)continue;
  if(s.d){s.d=Object.assign({},s.d);s.d.arm=s._gcArm;s.d.magDef=s._gcMdef;}
  delete s._gcArm;delete s._gcMdef;royaleClearDmgTakenMod(s,'glassCannon');
 }
}
royaleRegisterEvent('glassCannon',{
 start(){royaleModifierState.glassCannon.active=true;const c=ROYALE_EVENT_CONFIG.glassCannon;for(let i=0;i<spheres.length;i++)royaleGlassCannonStrip(spheres[i],c);},
 update(){const c=ROYALE_EVENT_CONFIG.glassCannon;for(let i=0;i<spheres.length;i++)royaleGlassCannonStrip(spheres[i],c);},
 end(){royaleGlassCannonRestore();royaleModifierState.glassCannon.active=false;}
});

function royaleKingsBountyChoose(){
 let best=null;
 for(let i=0;i<spheres.length;i++){const s=spheres[i];if(royaleModifierPrimary(s)&&(!best||s.hp>best.hp))best=s;}
 return best;
}
function royaleKingsBountyCrown(s){
 const state=royaleModifierState.kingsBounty,c=ROYALE_EVENT_CONFIG.kingsBounty;
 if(state.crowned&&state.crowned!==s)royaleClearDmgTakenMod(state.crowned,'crown');
 state.crowned=s;
 if(s){royaleSetDmgTakenMod(s,'crown',c.dmgTaken);if(typeof royaleCamera!=='undefined'&&royaleCamera.pushShot)royaleCamera.pushShot({x:s.x,y:s.y,zoomFactor:1.2,secs:1.2,priority:40});}
}
function royaleKingsBountyDamage(victim,removed,source){
 const state=royaleModifierState.kingsBounty;
 if(state.crowned!==victim||!source||!source.key)return;
 for(let i=0;i<spheres.length;i++){
  const attacker=spheres[i];
  if(royaleModifierPrimary(attacker)&&attacker!==victim&&attacker.key===source.key){
   const c=ROYALE_EVENT_CONFIG.kingsBounty;
   attacker.receiveHeal(Math.min(removed*c.healFrac,attacker.maxHp*c.healCapPct));
   return;
  }
 }
}
royaleRegisterEvent('kingsBounty',{
 start(){
  const state=royaleModifierState.kingsBounty;
  state.previousHook=window._royaleOnDamage;
  state.hook=function(victim,removed,source){if(typeof state.previousHook==='function')state.previousHook(victim,removed,source);royaleKingsBountyDamage(victim,removed,source);};
  window._royaleOnDamage=state.hook;
  state.crowned=null;royaleKingsBountyCrown(royaleKingsBountyChoose());
 },
 update(){
  const state=royaleModifierState.kingsBounty;
  if(!royaleModifierPrimary(state.crowned)){royaleClearDmgTakenMod(state.crowned,'crown');state.crowned=null;royaleKingsBountyCrown(royaleKingsBountyChoose());}
  if(state.crowned)royaleSetDmgTakenMod(state.crowned,'crown',ROYALE_EVENT_CONFIG.kingsBounty.dmgTaken);
 },
 end(){
  const state=royaleModifierState.kingsBounty;
  if(window._royaleOnDamage===state.hook)window._royaleOnDamage=state.previousHook;
  royaleClearDmgTakenMod(state.crowned,'crown');
  state.crowned=null;state.previousHook=null;state.hook=null;
 },
 drawTop(){
  const s=royaleModifierState.kingsBounty.crowned;if(!royaleModifierPrimary(s))return;
  const t=window.matchTime||0,pulse=.5+.5*Math.sin(t*4),y=s.y-s.radius-17;
  ctx.save();ctx.globalAlpha=.85+pulse*.15;ctx.strokeStyle='#e9bd55';ctx.lineWidth=2+pulse;
  ctx.beginPath();ctx.arc(s.x,s.y,s.radius+8+pulse*3,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#f3c94f';ctx.strokeStyle='#684512';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(s.x-10,y+5);ctx.lineTo(s.x-8,y-5);ctx.lineTo(s.x-2,y+1);ctx.lineTo(s.x+2,y-7);ctx.lineTo(s.x+7,y+1);ctx.lineTo(s.x+10,y-5);ctx.lineTo(s.x+12,y+6);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.restore();
 }
});

window.royaleDebug=Object.assign(window.royaleDebug||{},{
 setModifierVariant:royaleModifierSetVariant,
 clearModifierVariants(){window._royaleModifierForcedVariants={};}
});
