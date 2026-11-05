'use strict';
let _royaleTimeScale=1,_royaleTimeScaleTarget=1,_royaleTimeScaleTween=0;
window._royaleTimeScale=1;window._royaleRealStep=0;
function royaleSetTimeScale(target,tweenSecs){const c=ROYALE_EVENT_CONFIG.timeScale;_royaleTimeScaleTarget=Math.max(c.min,Math.min(c.max,Number.isFinite(target)?target:c.default));_royaleTimeScaleTween=Math.max(0,Number.isFinite(tweenSecs)?tweenSecs:c.tweenSecs);if(!_royaleTimeScaleTween){_royaleTimeScale=_royaleTimeScaleTarget;window._royaleTimeScale=_royaleTimeScale;}}
function royaleUpdateTimeScale(realDt){if(_royaleTimeScaleTween>0){const k=1-Math.exp(-Math.max(0,realDt)/_royaleTimeScaleTween);_royaleTimeScale+=(_royaleTimeScaleTarget-_royaleTimeScale)*k;if(Math.abs(_royaleTimeScale-_royaleTimeScaleTarget)<1e-4){_royaleTimeScale=_royaleTimeScaleTarget;_royaleTimeScaleTween=0;}window._royaleTimeScale=_royaleTimeScale;}}
function royaleResetTimeScale(){_royaleTimeScale=_royaleTimeScaleTarget=ROYALE_EVENT_CONFIG.timeScale.default;_royaleTimeScaleTween=0;window._royaleTimeScale=_royaleTimeScale;window._royaleRealStep=0;}
function royaleRecalcSphereMod(s,field,multField){const m=s[field];let p=1;if(m)for(const k in m)p*=m[k];s[multField]=p;}
function royaleSetDmgTakenMod(s,key,mult){if(!s||!key)return;if(!s._royaleDmgTaken)s._royaleDmgTaken={};s._royaleDmgTaken[key]=Number.isFinite(mult)?Math.max(0,mult):1;royaleRecalcSphereMod(s,'_royaleDmgTaken','_royaleDmgTakenMult');}
function royaleClearDmgTakenMod(s,key){if(!s||!s._royaleDmgTaken)return;delete s._royaleDmgTaken[key];royaleRecalcSphereMod(s,'_royaleDmgTaken','_royaleDmgTakenMult');if(!Object.keys(s._royaleDmgTaken).length)delete s._royaleDmgTaken;}
function royaleSetHealMod(s,key,mult){if(!s||!key)return;if(!s._royaleHealMods)s._royaleHealMods={};s._royaleHealMods[key]=Number.isFinite(mult)?Math.max(0,mult):1;royaleRecalcSphereMod(s,'_royaleHealMods','_royaleHealMult');}
function royaleClearHealMod(s,key){if(!s||!s._royaleHealMods)return;delete s._royaleHealMods[key];royaleRecalcSphereMod(s,'_royaleHealMods','_royaleHealMult');if(!Object.keys(s._royaleHealMods).length)delete s._royaleHealMods;}

function royaleSetSizeMod(s,id,mult,tween){if(!s._royaleSizeMods)s._royaleSizeMods={};s._royaleSizeMods[id]={target:mult,tween:Math.max(0,tween||0)};s._royaleSizeMult=s._royaleSizeMult||1;}
function royaleClearSizeMod(s,id,tween){if(s._royaleSizeMods&&s._royaleSizeMods[id]){s._royaleSizeMods[id].target=1;s._royaleSizeMods[id].tween=Math.max(0,tween||0);s._royaleSizeMods[id].clear=true;}}
function royaleSetMoveMod(s,id,mult){if(!s._royaleMoveMods)s._royaleMoveMods={};s._royaleMoveMods[id]=mult;}
function royaleClearMoveMod(s,id){if(s._royaleMoveMods)delete s._royaleMoveMods[id];}
function royaleDisplace(s,x,y){if(!s||s.dying||s.leaping)return;s.x+=x;s.y+=y;}
function royaleRandomPointInZone(pad=0){const b=royaleZone.bounds;return{x:b.l+pad+Math.random()*Math.max(1,b.r-b.l-pad*2),y:b.t+pad+Math.random()*Math.max(1,b.b-b.t-pad*2)};}
function royalePointFreeOfObstacles(x,y,r=0){for(let i=0;i<royaleObstacles.length;i++){const o=royaleObstacles[i];if(x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h)return false;}return true;}
function royaleLivingPrimaries(){const out=[];for(let i=0;i<spheres.length;i++){const s=spheres[i];if(s.alive&&!s.dying&&!s.isReplica)out.push(s);}return out;}
function royaleStrikePercent(s,pct){if(!s||!s.alive||s.dying||s.leaping)return 0;return s.receiveTrueDamage(Math.max(0,s.maxHp*pct),null,'ability');}
function updateRoyaleFramework(dt){
 if(!royaleState)return;
 for(let i=0;i<spheres.length;i++){const s=spheres[i];const mods=s._royaleSizeMods;if(mods){const oldMult=s._royaleSizeMult||1;const rawRadius=s.radius/oldMult;let product=1;for(const id in mods){const m=mods[id];const cur=mods[id].current===undefined?1:mods[id].current;const target=m.target;const step=m.tween>0?1-Math.exp(-dt/m.tween):1;const next=cur+(target-cur)*step;m.current=Math.abs(next-target)<1e-3?target:next;if(m.current===1&&m.clear)delete mods[id];product*=m.current;}s._royaleSizeMult=product;s.radius=rawRadius*product;}
  const move=s._royaleMoveMods;if(move&&!s.dying&&!s.leaping){let product=1;for(const id in move)product*=move[id];const vx=(s.vx||0)+(s.impactVx||0),vy=(s.vy||0)+(s.impactVy||0);s.x+=vx*(product-1)*dt;s.y+=vy*(product-1)*dt;}
 }
 const effects=royaleState.timedEffects||[];
 for(let i=effects.length-1;i>=0;i--){const e=effects[i];e.t-=dt;if(e.tickEvery>0){e.tickT-=dt;while(e.tickT<=0&&e.t>0){if(e.onTick)e.onTick(e.s,dt);e.tickT+=e.tickEvery;}}if(e.t<=0){if(e.onEnd)e.onEnd(e.s);effects.splice(i,1);}}
}
function royaleClearFramework(){for(let i=0;i<spheres.length;i++){const s=spheres[i];delete s._royaleMoveMods;if(s._royaleSizeMods){const m=s._royaleSizeMult||1;if(m)s.radius/=m;delete s._royaleSizeMods;delete s._royaleSizeMult;}delete s._royaleDmgTaken;delete s._royaleDmgTakenMult;delete s._royaleHealMods;delete s._royaleHealMult;}if(royaleState)royaleState.timedEffects=[];}
function resetRoyaleFramework(){if(royaleState&&royaleState.currentEventId&&typeof royaleEndEvent==='function'){royaleEndEvent();royaleState.currentEventId=null;}royaleClearFramework();royaleResetGravity();royaleResetTimeScale();}
function royaleRegisterEvent(id,entry){ROYALE_EVENT_REGISTRY[id]=entry;}
window.royaleDebug=window.royaleDebug||{};
window.royaleDebug.listEvents=()=>ROYALE_EVENT_IDS.map(id=>({id,label:ROYALE_EVENT_LABELS[id],implemented:!!ROYALE_EVENT_REGISTRY[id]}));
window.royaleDebug.runEvent=id=>{if(!royaleState||!ROYALE_EVENT_IDS.includes(id))return false;royaleEndEvent();royaleState.currentEventId=id;royaleState.state='EVENT';royaleState.stateTimer=ROYALE_CONFIG.event;royaleState.eventSequence.push(id);const entry=ROYALE_EVENT_REGISTRY[id];if(entry&&entry.start)entry.start(royaleState);return true;};
