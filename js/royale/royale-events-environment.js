'use strict';
const royaleEnvironmentState={windT:0,gust:1,thornCD:new WeakMap()};
function royaleEnvTargets(){return royaleLivingPrimaries();}
function royaleDrawWorldRect(x,y,w,h,color,alpha=1){const v=royaleCameraViewRect();if(x+w<v.l||x>v.r||y+h<v.t||y>v.b)return;ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(x,y,w,h);ctx.restore();}
royaleRegisterEvent('overgrowth',{
 start(){for(const s of royaleEnvTargets())royaleSetSizeMod(s,'overgrowth',ROYALE_EVENT_CONFIG.overgrowth.mult,ROYALE_EVENT_CONFIG.overgrowth.tween);},
 end(){for(const s of spheres)royaleClearSizeMod(s,'overgrowth',ROYALE_EVENT_CONFIG.overgrowth.tween);},
 draw(){const b=royaleZone.bounds;ctx.save();ctx.strokeStyle='#72a85b';ctx.globalAlpha=.35;ctx.lineWidth=5;ctx.strokeRect(b.l,b.t,b.r-b.l,b.b-b.t);ctx.restore();}
});
royaleRegisterEvent('dwarfism',{
 start(){for(const s of royaleEnvTargets())royaleSetSizeMod(s,'dwarfism',ROYALE_EVENT_CONFIG.dwarfism.mult,ROYALE_EVENT_CONFIG.dwarfism.tween);},
 end(){for(const s of spheres)royaleClearSizeMod(s,'dwarfism',ROYALE_EVENT_CONFIG.dwarfism.tween);},
 draw(){const b=royaleZone.bounds;ctx.save();ctx.strokeStyle='#9cc9d8';ctx.globalAlpha=.28;ctx.lineWidth=3;ctx.strokeRect(b.l,b.t,b.r-b.l,b.b-b.t);ctx.restore();}
});
royaleRegisterEvent('hurricane',{
 start(){royaleEnvironmentState.windT=0;royaleEnvironmentState.gust=1;},
 update(dt){const c=ROYALE_EVENT_CONFIG.hurricane;royaleEnvironmentState.windT+=dt;const phase=(royaleEnvironmentState.windT%c.gustPeriod)/c.gustPeriod;const gust=c.gustMin+(1-c.gustMin)*(0.5+0.5*Math.sin(phase*Math.PI*2));royaleEnvironmentState.gust=gust;const strength=c.strength*gust;for(let i=0;i<spheres.length;i++){const s=spheres[i];if(!s.alive||s.dying||s.isReplica||s.leaping)continue;royaleDisplace(s,strength*c.driftRate*dt*(s.vx>=0?1:-1),Math.sin(royaleEnvironmentState.windT*1.7+i)*strength*.12*dt);}for(let i=0;i<projectiles.length;i++){const p=projectiles[i];if(p.alive){p.vx=(p.vx||0)+Math.sign(p.vx||1)*strength*c.projectileFactor*dt*.02;}}},
 draw(){const c=ROYALE_EVENT_CONFIG.hurricane,v=royaleCameraViewRect();ctx.save();ctx.strokeStyle='rgba(185,220,235,.45)';ctx.lineWidth=1.5;for(let i=0;i<c.streaks;i++){const x=v.l+((i*137.51+royaleEnvironmentState.windT*180)%v.w),y=v.t+((i*71.17+royaleEnvironmentState.windT*95)%v.h);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-28,y+10);ctx.stroke();}ctx.restore();}
});
royaleRegisterEvent('thornedWalls',{
 start(){royaleEnvironmentState.thornCD=new WeakMap();},
 update(dt){const c=ROYALE_EVENT_CONFIG.thornedWalls,b=royaleZone.bounds;for(let i=0;i<spheres.length;i++){const s=spheres[i];if(!s.alive||s.dying||s.isReplica||s.leaping)continue;let cd=royaleEnvironmentState.thornCD.get(s)||0;cd=Math.max(0,cd-dt);if(cd<=0&&(s.x-s.radius-b.l<c.thornLen||b.r-(s.x+s.radius)<c.thornLen||s.y-s.radius-b.t<c.thornLen||b.b-(s.y+s.radius)<c.thornLen)){royaleStrikePercent(s,c.dmgPct);s.bleedStacks=Math.min(3,(s.bleedStacks||0)+c.bleedStacks);s.bleedSourceKey=null;s.bleedT=Math.max(s.bleedT||0,1.5);s.bleedTickT=Math.min(s.bleedTickT||0,0.5);royaleEnvironmentState.thornCD.set(s,c.contactCooldown);}else royaleEnvironmentState.thornCD.set(s,cd);}},
 draw(){const c=ROYALE_EVENT_CONFIG.thornedWalls,b=royaleZone.bounds;ctx.save();ctx.strokeStyle='#7c9b47';ctx.lineWidth=4;ctx.globalAlpha=.9;for(let x=b.l;x<=b.r;x+=c.spacing){ctx.beginPath();ctx.moveTo(x,b.t);ctx.lineTo(x+c.thornLen*.35,b.t-c.thornLen);ctx.moveTo(x,b.b);ctx.lineTo(x+c.thornLen*.35,b.b+c.thornLen);ctx.stroke();}for(let y=b.t;y<=b.b;y+=c.spacing){ctx.beginPath();ctx.moveTo(b.l,y);ctx.lineTo(b.l-c.thornLen,y+c.thornLen*.35);ctx.moveTo(b.r,y);ctx.lineTo(b.r+c.thornLen,y+c.thornLen*.35);ctx.stroke();}ctx.restore();}
});
