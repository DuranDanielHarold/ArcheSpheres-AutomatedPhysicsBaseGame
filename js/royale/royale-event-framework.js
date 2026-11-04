'use strict';
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
function royaleClearFramework(){if(!royaleState)return;for(let i=0;i<spheres.length;i++){const s=spheres[i];delete s._royaleMoveMods;if(s._royaleSizeMods){for(const id in s._royaleSizeMods)royaleClearSizeMod(s,id,0.6);}}royaleState.timedEffects=[];}
function royaleRegisterEvent(id,entry){ROYALE_EVENT_REGISTRY[id]=entry;}
window.royaleDebug=window.royaleDebug||{};
window.royaleDebug.listEvents=()=>ROYALE_EVENT_IDS.map(id=>({id,label:ROYALE_EVENT_LABELS[id],implemented:!!ROYALE_EVENT_REGISTRY[id]}));
window.royaleDebug.runEvent=id=>{if(!royaleState||!ROYALE_EVENT_IDS.includes(id))return false;royaleEndEvent();royaleState.currentEventId=id;royaleState.state='EVENT';royaleState.stateTimer=ROYALE_CONFIG.event;royaleState.eventSequence.push(id);const entry=ROYALE_EVENT_REGISTRY[id];if(entry&&entry.start)entry.start(royaleState);return true;};
