'use strict';
const royaleFogState={patches:[]};
function royaleFogVisible(x,y,r){const v=royaleCameraViewRect();return x+r>=v.l&&x-r<=v.r&&y+r>=v.t&&y-r<=v.b;}
function royaleFogClearMods(){for(let i=0;i<spheres.length;i++){royaleClearMoveMod(spheres[i],'frostbite');royaleClearMoveMod(spheres[i],'plague-fog');}}
function royaleFogReset(){royaleFogClearMods();royaleFogState.patches.length=0;}
royaleRegisterEvent('frostbite',{
 start(){const c=ROYALE_EVENT_CONFIG.frostbite;royaleFogReset();for(let i=0;i<c.count;i++){const p=royaleRandomPointInZone(c.edgePad);royaleFogState.patches.push({x:p.x,y:p.y,r:c.radius});}},
 update(){const c=ROYALE_EVENT_CONFIG.frostbite;for(let j=0;j<spheres.length;j++){const s=spheres[j];if(!s.alive||s.dying||s.isReplica||s.leaping)continue;let inside=false;for(let i=0;i<royaleFogState.patches.length;i++){const p=royaleFogState.patches[i];if(Math.hypot(s.x-p.x,s.y-p.y)<p.r+s.radius){inside=true;break;}}if(inside)royaleSetMoveMod(s,'frostbite',c.slowMult);else royaleClearMoveMod(s,'frostbite');}},
 draw(){const t=window.matchTime||0;for(let i=0;i<royaleFogState.patches.length;i++){const p=royaleFogState.patches[i];if(!royaleFogVisible(p.x,p.y,p.r))continue;ctx.save();ctx.globalAlpha=.16+.05*Math.sin(t*2+i);ctx.fillStyle='#9bd9ed';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.45;ctx.strokeStyle='#d8f4ff';ctx.lineWidth=2;for(let k=0;k<6;k++){const a=k*Math.PI/3+t*.08;ctx.beginPath();ctx.moveTo(p.x+Math.cos(a)*p.r*.2,p.y+Math.sin(a)*p.r*.2);ctx.lineTo(p.x+Math.cos(a)*p.r*.8,p.y+Math.sin(a)*p.r*.8);ctx.stroke();}ctx.restore();}},
 end(){royaleFogClearMods();royaleFogState.patches.length=0;}
});
royaleRegisterEvent('plagueFog',{
 start(){const c=ROYALE_EVENT_CONFIG.plagueFog;royaleFogReset();for(let i=0;i<c.count;i++){const p=royaleRandomPointInZone(c.edgePad);royaleFogState.patches.push({x:p.x,y:p.y,r:c.radius,tick:c.tick,due:false});}},
 update(dt){const c=ROYALE_EVENT_CONFIG.plagueFog;for(let i=0;i<royaleFogState.patches.length;i++){const p=royaleFogState.patches[i];p.tick-=dt;p.due=p.tick<=0;if(p.due)p.tick+=c.tick;}for(let j=0;j<spheres.length;j++){const s=spheres[j];if(!s.alive||s.dying||s.isReplica||s.leaping)continue;let inside=false;for(let i=0;i<royaleFogState.patches.length;i++){const p=royaleFogState.patches[i];if(Math.hypot(s.x-p.x,s.y-p.y)<p.r+s.radius){inside=true;if(p.due)royaleStrikePercent(s,c.damagePct);}}if(inside)royaleSetMoveMod(s,'plague-fog',c.slowMult);else royaleClearMoveMod(s,'plague-fog');}},
 draw(){const t=window.matchTime||0;for(let i=0;i<royaleFogState.patches.length;i++){const p=royaleFogState.patches[i];if(!royaleFogVisible(p.x,p.y,p.r))continue;ctx.save();ctx.globalAlpha=.17+.05*Math.sin(t*1.7+i);ctx.fillStyle='#76945d';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.35;ctx.strokeStyle='#b0c48a';ctx.lineWidth=2;for(let k=0;k<8;k++){const a=k*Math.PI/4+t*.05;ctx.beginPath();ctx.arc(p.x+Math.cos(a)*p.r*.28,p.y+Math.sin(a)*p.r*.28,p.r*.34,0,Math.PI*1.2);ctx.stroke();}ctx.restore();}},
 end(){royaleFogClearMods();royaleFogState.patches.length=0;}
});
