'use strict';
const royaleSkyState={meteors:[],magneticT:0,magneticPhase:0};
function royaleSkyVisible(x,y,r){const v=royaleCameraViewRect();return x+r>=v.l&&x-r<=v.r&&y+r>=v.t&&y-r<=v.b;}
function royaleSkyRand(a,b){return a+Math.random()*(b-a);}
function royaleSkyClear(){royaleSkyState.meteors.length=0;royaleSkyState.magneticT=0;royaleSkyState.magneticPhase=0;}
royaleRegisterEvent('meteorShower',{
 start(){const c=ROYALE_EVENT_CONFIG.meteorShower;royaleSkyClear();for(let i=0;i<c.count;i++){const p=royaleRandomPointInZone(c.edgePad);royaleSkyState.meteors.push({x:p.x,y:p.y,t:c.telegraph+royaleSkyRand(0,c.stagger),hit:false,seed:i});}},
 update(dt){const c=ROYALE_EVENT_CONFIG.meteorShower;for(let i=0;i<royaleSkyState.meteors.length;i++){const m=royaleSkyState.meteors[i];m.t-=dt;if(m.t<=0&&!m.hit){m.hit=true;for(let j=0;j<spheres.length;j++){const s=spheres[j];if(!s.alive||s.dying||s.isReplica||s.leaping)continue;if(Math.hypot(s.x-m.x,s.y-m.y)<=c.radius+s.radius)royaleStrikePercent(s,c.damagePct);}}}},
 draw(){const c=ROYALE_EVENT_CONFIG.meteorShower,t=window.matchTime||0;for(let i=0;i<royaleSkyState.meteors.length;i++){const m=royaleSkyState.meteors[i];if(m.hit||!royaleSkyVisible(m.x,m.y,c.radius+30))continue;const p=1-Math.max(0,m.t)/c.telegraph;ctx.save();ctx.globalAlpha=.25+.45*(.5+.5*Math.sin(t*9+i));ctx.strokeStyle='#f2c27a';ctx.lineWidth=2;ctx.setLineDash([7,6]);ctx.beginPath();ctx.arc(m.x,m.y,c.radius*(.45+p*.55),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.8;ctx.fillStyle='#f5a35b';ctx.beginPath();ctx.arc(m.x,m.y,5+p*5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffdfaa';ctx.beginPath();ctx.moveTo(m.x-12,m.y-18);ctx.lineTo(m.x+12,m.y+18);ctx.moveTo(m.x+12,m.y-18);ctx.lineTo(m.x-12,m.y+18);ctx.stroke();ctx.restore();}},
 end(){royaleSkyClear();}
});
royaleRegisterEvent('magneticStorm',{
 start(){royaleSkyState.magneticT=ROYALE_EVENT_CONFIG.magneticStorm.interval;royaleSkyState.magneticPhase=0;},
 update(dt){const c=ROYALE_EVENT_CONFIG.magneticStorm;royaleSkyState.magneticT-=dt;if(royaleSkyState.magneticT>0)return;royaleSkyState.magneticT+=c.interval;royaleSkyState.magneticPhase++;const center=royaleRandomPointInZone(c.edgePad);for(let i=0;i<spheres.length;i++){const s=spheres[i];if(!s.alive||s.dying||s.isReplica||s.leaping)continue;const dx=s.x-center.x,dy=s.y-center.y,d=Math.hypot(dx,dy);if(d>1&&d<c.radius){const sign=royaleSkyState.magneticPhase%2?1:-1,force=c.impulse*(1-d/c.radius)*sign;royaleDisplace(s,dx/d*force,dy/d*force);}}if(typeof royaleCameraShake==='function')royaleCameraShake(c.shake);},
 draw(){const c=ROYALE_EVENT_CONFIG.magneticStorm,t=window.matchTime||0;const x=ROYALE_CONFIG.worldW/2,y=ROYALE_CONFIG.worldH/2;if(!royaleSkyVisible(x,y,c.radius))return;ctx.save();ctx.translate(x,y);ctx.rotate(t*.12);ctx.strokeStyle='#78d8e8';ctx.globalAlpha=.12;ctx.lineWidth=3;for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(0,0,c.radius*(.25+i*.16),c.radius*(.12+i*.1),i*.2,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=.32;ctx.strokeStyle='#d0f5ff';ctx.lineWidth=1.5;for(let i=0;i<12;i++){const a=i*Math.PI/6+t*.2;ctx.beginPath();ctx.moveTo(Math.cos(a)*c.radius*.18,Math.sin(a)*c.radius*.18);ctx.lineTo(Math.cos(a+.18)*c.radius*.92,Math.sin(a+.18)*c.radius*.92);ctx.stroke();}ctx.restore();},
 end(){royaleSkyState.magneticT=0;royaleSkyState.magneticPhase=0;}
});
