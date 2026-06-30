'use strict';
// ▓▓▓ MODULE: weapons/weapons-exotic.js — extracted from former js/weapons.js ▓▓▓
// Exotic and ability-heavy weapon render functions.

const EXOTIC_WEAPONS={
 talon(ctx,r,d,s){
  const t=s?s.abTimer:Date.now()*.005;
  const ember=s?Math.min(1,(s.phoenixEmber||0)/100):0;
  const active=s&&s.ashwingActive;
  const reborn=s&&s.rebirthDone;
  const pulse=0.5+0.5*Math.sin(t*12);
  const baseX=r*.72;
  const tipX=r*(active?3.26:3.06);
  const wingSpread=r*(active?0.74:0.62);
  const coreCol=reborn?'#fff3d0':'#fff8a8';
  const flameCol=active?'#ffcc02':d.wcol;
  const edgeCol=reborn?'#ff6a00':'#ff4400';

  if(ember>0.15||active){
   ctx.save();
   ctx.globalAlpha=0.18+ember*0.28+(active?0.15:0);
   ctx.shadowColor='#ffcc02';ctx.shadowBlur=16+ember*16;
   const aura=ctx.createRadialGradient(r*1.85,0,0,r*1.85,0,r*(1.1+ember*0.55));
   aura.addColorStop(0,`rgba(255,220,80,${0.45+ember*0.25})`);
   aura.addColorStop(0.55,'rgba(255,90,0,0.22)');
   aura.addColorStop(1,'transparent');
   ctx.fillStyle=aura;ctx.beginPath();ctx.arc(r*1.85,0,r*(1.1+ember*0.55),0,Math.PI*2);ctx.fill();
   ctx.restore();
  }

  for(const side of [-1,1]){
   const flap=Math.sin(t*8+side*0.7)*0.035;
   ctx.save();
   ctx.rotate(side*(0.14+ember*0.05+(active?0.08:0))+flap);

   const wingGrad=ctx.createLinearGradient(baseX,0,tipX,0);
   wingGrad.addColorStop(0,reborn?'#6d1900':'#8a2400');
   wingGrad.addColorStop(0.32,edgeCol);
   wingGrad.addColorStop(0.68,flameCol);
   wingGrad.addColorStop(1,coreCol);
   ctx.fillStyle=wingGrad;
   ctx.beginPath();
   ctx.moveTo(baseX,side*r*.08);
   ctx.bezierCurveTo(r*1.12,side*-wingSpread*.80,r*2.12,side*-wingSpread*.92,tipX,side*-r*.05);
   ctx.bezierCurveTo(r*2.25,side*-wingSpread*.38,r*1.30,side*-r*.18,baseX,side*r*.16);
   ctx.closePath();ctx.fill();

   ctx.strokeStyle=reborn?'rgba(255,240,210,0.75)':'rgba(255,250,180,0.65)';
   ctx.lineWidth=r*.035;
   ctx.beginPath();
   ctx.moveTo(baseX+r*.12,side*r*.02);
   ctx.bezierCurveTo(r*1.28,side*-wingSpread*.52,r*2.16,side*-wingSpread*.52,tipX-r*.16,side*-r*.04);
   ctx.stroke();

   for(let i=0;i<5;i++){
    const f=i/4;
    const fx=r*(1.10+f*1.35);
    const fy=side*(-r*(0.22+0.26*(1-f))+Math.sin(t*10+i)*r*.025);
    const len=r*(0.36+0.18*(1-f)+ember*0.08);
    ctx.fillStyle=i%2===0?edgeCol:'#ff9a22';
    ctx.beginPath();
    ctx.moveTo(fx,fy);
    ctx.lineTo(fx+r*(0.22+f*.08),fy+side*-len);
    ctx.lineTo(fx+r*(0.42+f*.10),fy+side*r*.02);
    ctx.closePath();ctx.fill();
   }

   ctx.fillStyle='rgba(60,10,0,0.45)';
   ctx.beginPath();
   ctx.moveTo(baseX,side*r*.13);
   ctx.bezierCurveTo(r*1.24,side*-r*.08,r*2.10,side*-r*.13,tipX-r*.22,side*r*.04);
   ctx.lineTo(tipX-r*.06,side*r*.11);
   ctx.bezierCurveTo(r*2.00,side*r*.02,r*1.25,side*r*.05,baseX,side*r*.20);
   ctx.closePath();ctx.fill();
   ctx.restore();
  }

  const talonGrad=ctx.createLinearGradient(baseX,0,tipX+r*.24,0);
  talonGrad.addColorStop(0,'#7a1c00');
  talonGrad.addColorStop(0.45,edgeCol);
  talonGrad.addColorStop(0.75,flameCol);
  talonGrad.addColorStop(1,coreCol);
  ctx.fillStyle=talonGrad;
  ctx.beginPath();
  ctx.moveTo(baseX,-r*.10);
  ctx.lineTo(tipX+r*.24,0);
  ctx.lineTo(baseX,r*.10);
  ctx.quadraticCurveTo(r*1.35,0,baseX,-r*.10);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(60,10,0,0.9)';ctx.lineWidth=r*.035;ctx.stroke();

  ctx.save();
  ctx.shadowColor=ember>=1?'#ffcc02':'#ff6600';
  ctx.shadowBlur=10+ember*18+(active?8:0);
  const tipGlow=ctx.createRadialGradient(tipX+r*.16,0,0,tipX+r*.16,0,r*(0.25+ember*0.22));
  tipGlow.addColorStop(0,coreCol);
  tipGlow.addColorStop(0.45,`rgba(255,${Math.round(120+ember*110)},0,0.75)`);
  tipGlow.addColorStop(1,'transparent');
  ctx.fillStyle=tipGlow;
  ctx.beginPath();ctx.arc(tipX+r*.16,0,r*(0.25+ember*0.18+pulse*r*0.001),0,Math.PI*2);ctx.fill();
  ctx.restore();

  if(reborn){
   ctx.save();
   ctx.globalAlpha=0.32+0.16*pulse;
   ctx.strokeStyle='rgba(255,230,190,0.8)';
   ctx.lineWidth=r*.04;
   ctx.setLineDash([r*.10,r*.08]);
   ctx.beginPath();ctx.arc(r*1.55,0,r*.92,0,Math.PI*2);ctx.stroke();
   ctx.setLineDash([]);
   ctx.restore();
  }
 },
 waterwhip(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const riptideReady=s&&s.stacks>=3;
  // The water whip is a living tendril of water — thick near handle, tapering to a razor tip,
  // with a distinct sinusoidal "S-curve" body and glassy water cross-section illusion.
  const segs=18;const whipLen=r*3.2;
  // Two-frequency wave: primary bend + secondary ripple for organic feel
  const primaryWave=Math.sin(t*5.5)*r*.70;
  const pts=[];
  for(let i=0;i<=segs;i++){
   const p=i/segs;
   const wave1=primaryWave*p*(0.4+p*.7);
   const wave2=Math.sin(t*11+p*Math.PI*2.5)*r*.10*p*(1-p*.4);
   pts.push({x:r*.85+p*whipLen,y:wave1+wave2});
  }
  ctx.lineCap='round';ctx.lineJoin='round';
  // --- LAYER 1: dark shadow/outline (wider) ---
  for(let i=0;i<segs;i++){
   const p=(i+0.5)/segs;
   const thick=Math.max(1.5,r*(.22-p*.16));
   ctx.strokeStyle='rgba(0,10,40,0.85)';
   ctx.lineWidth=thick+r*.04;
   ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[i+1].x,pts[i+1].y);ctx.stroke();
  }
  // --- LAYER 2: deep ocean body — dark translucent blue-green core ---
  for(let i=0;i<segs;i++){
   const p=(i+0.5)/segs;
   const thick=Math.max(1.2,r*(.20-p*.15));
   const rVal=Math.round(0+p*10);
   const gVal=Math.round(100+p*60);
   const bVal=Math.round(200-p*30);
   ctx.strokeStyle=`rgb(${rVal},${gVal},${bVal})`;
   ctx.lineWidth=thick;
   ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[i+1].x,pts[i+1].y);ctx.stroke();
  }
  // --- LAYER 3: bright aqua highlight running along inner curve edge ---
  for(let i=0;i<segs;i++){
   const p=(i+0.5)/segs;
   const thick=Math.max(0.5,r*(.065-p*.042));
   const alpha=riptideReady?(0.95-p*.3):(0.60-p*.25);
   // Offset perpendicular to the segment direction for the highlight stripe
   const dx=pts[i+1].x-pts[i].x,dy=pts[i+1].y-pts[i].y;
   const len=Math.hypot(dx,dy)||1;
   const nx=-dy/len,ny=dx/len; // normal pointing "up" relative to curve
   const hOff=r*(.065-p*.04);
   ctx.strokeStyle=riptideReady?`rgba(180,255,255,${alpha})`:`rgba(0,230,255,${alpha})`;
   ctx.lineWidth=thick;
   ctx.beginPath();
   ctx.moveTo(pts[i].x+nx*hOff,pts[i].y+ny*hOff);
   ctx.lineTo(pts[i+1].x+nx*hOff,pts[i+1].y+ny*hOff);
   ctx.stroke();
  }
  // --- LAYER 4: translucent inner glow / water volume illusion ---
  if(riptideReady){
   ctx.save();ctx.globalAlpha=0.35;
   for(let i=0;i<segs;i++){
    const p=(i+0.5)/segs;
    const thick=Math.max(1.0,r*(.26-p*.18));
    ctx.strokeStyle='rgba(100,240,255,1)';ctx.lineWidth=thick;
    ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[i+1].x,pts[i+1].y);ctx.stroke();
   }
   ctx.restore();
  }
  // --- Water droplets spraying off the whip body ---
  const dropCount=riptideReady?5:3;
  for(let di=0;di<dropCount;di++){
   const dp=0.3+((t*1.3+di*0.37)%0.7);
   const segIdx=Math.floor(dp*segs);
   if(segIdx>=segs)continue;
   const px=pts[segIdx].x,py=pts[segIdx].y;
   const dx2=pts[Math.min(segIdx+1,segs)].x-px;
   const dy2=pts[Math.min(segIdx+1,segs)].y-py;
   const len2=Math.hypot(dx2,dy2)||1;
   const spray=((t*2.2+di*1.1)%1)*r*.30+r*.04;
   const sideSign=((di%2)*2-1);
   const nx2=-dy2/len2*sideSign,ny2=dx2/len2*sideSign;
   const dropR=Math.max(1,r*(.04-dp*.02));
   const dropAlpha=riptideReady?0.85:0.55;
   ctx.save();ctx.globalAlpha=dropAlpha*(1-dp*.4);
   const dg=ctx.createRadialGradient(px+nx2*spray,py+ny2*spray,0,px+nx2*spray,py+ny2*spray,dropR*2);
   dg.addColorStop(0,riptideReady?'rgba(200,255,255,0.9)':'rgba(0,220,255,0.85)');
   dg.addColorStop(1,'rgba(0,100,200,0)');
   ctx.fillStyle=dg;ctx.beginPath();ctx.arc(px+nx2*spray,py+ny2*spray,dropR*2,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  // --- Handle: a wrapped leather grip, cylindrical, short ---
  ctx.fillStyle='#0a1830';ctx.fillRect(r*.60,-r*.13,r*.28,r*.26);
  // Leather wrap bands
  for(let i=0;i<4;i++){
   ctx.fillStyle=i%2===0?'#003366':'#001a44';
   ctx.fillRect(r*.61+i*r*.065,-r*.11,r*.05,r*.22);
  }
  // Guard ring: a silver-blue ring separating handle from whip
  ctx.strokeStyle='#00aadd';ctx.lineWidth=r*.045;
  ctx.beginPath();ctx.arc(r*.87,0,r*.11,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(0,200,255,0.5)';ctx.lineWidth=r*.02;ctx.stroke();
  // --- TIP: razor-sharp water blade — a flat teardrop shape ---
  const tipX=pts[segs].x,tipY=pts[segs].y;
  const lastPx=pts[segs-1].x,lastPy=pts[segs-1].y;
  const tipAng=Math.atan2(tipY-lastPy,tipX-lastPx);
  ctx.save();ctx.translate(tipX,tipY);ctx.rotate(tipAng);
  // Dark outline of the blade
  ctx.fillStyle='rgba(0,10,40,0.9)';
  ctx.beginPath();ctx.moveTo(r*.24,0);ctx.quadraticCurveTo(r*.04,-r*.09,-r*.02,0);ctx.quadraticCurveTo(r*.04,r*.09,r*.24,0);ctx.closePath();ctx.fill();
  // Bright water blade face
  const bladeG=ctx.createLinearGradient(-r*.02,0,r*.24,0);
  bladeG.addColorStop(0,riptideReady?'rgba(200,255,255,0.95)':'rgba(0,200,255,0.95)');
  bladeG.addColorStop(0.5,riptideReady?'rgba(0,240,255,0.85)':'rgba(0,120,220,0.80)');
  bladeG.addColorStop(1,'rgba(0,40,120,0.4)');
  ctx.fillStyle=bladeG;
  ctx.beginPath();ctx.moveTo(r*.22,0);ctx.quadraticCurveTo(r*.05,-r*.07,0,0);ctx.quadraticCurveTo(r*.05,r*.07,r*.22,0);ctx.closePath();ctx.fill();
  // Glint on blade edge
  ctx.strokeStyle=riptideReady?'rgba(255,255,255,0.9)':'rgba(120,240,255,0.7)';
  ctx.lineWidth=r*.018;
  ctx.beginPath();ctx.moveTo(r*.22,0);ctx.quadraticCurveTo(r*.05,-r*.07,0,0);ctx.stroke();
  if(riptideReady){
   ctx.shadowColor='#00eeff';ctx.shadowBlur=10;
   ctx.strokeStyle='rgba(200,255,255,0.8)';ctx.lineWidth=1.5;
   ctx.beginPath();ctx.moveTo(r*.22,0);ctx.quadraticCurveTo(r*.05,-r*.07,0,0);ctx.quadraticCurveTo(r*.05,r*.07,r*.22,0);ctx.closePath();ctx.stroke();
   ctx.shadowBlur=0;
  }
  ctx.restore();
 },
 flailshield(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const charging=s&&s.holyChargeActive;
  const retribPct=s?(Math.min(1,(s.retributionCounter||0)/30)):0;
  // ── SHIELD drawn on the BACK side — translate to behind the sphere ──
  ctx.save();
  // Move to the rear (negative x = opposite of weapon direction)
  ctx.translate(-r*1.45,0);
  const shW=r*.90,shH=r*1.35;
  // Outer dark frame for contrast
  ctx.fillStyle='#2a1a00';
  rrect(ctx,-shW/2-r*.04,-shH/2-r*.04,shW+r*.08,shH+r*.08,r*.18);ctx.fill();
  // Shield face — gold/brass
  const shieldCol=charging?'#fffacc':'#d4a830';
  ctx.fillStyle=shieldCol;
  rrect(ctx,-shW/2,-shH/2,shW,shH,r*.15);ctx.fill();
  // Inner panel
  ctx.fillStyle=charging?'rgba(255,250,200,0.5)':'#b08820';
  rrect(ctx,-shW/2+r*.07,-shH/2+r*.07,shW-r*.14,shH-r*.14,r*.10);ctx.fill();
  // Bold cross on shield — white for maximum visibility
  ctx.fillStyle=charging?'#ffffff':'#f8e890';
  ctx.strokeStyle='#5a3800';ctx.lineWidth=r*.025;
  ctx.fillRect(-r*.065,-shH*.42,r*.13,shH*.84);
  ctx.strokeRect(-r*.065,-shH*.42,r*.13,shH*.84);
  ctx.fillRect(-shW*.40,-r*.065,shW*.80,r*.13);
  ctx.strokeRect(-shW*.40,-r*.065,shW*.80,r*.13);
  // Boss (center knob)
  ctx.fillStyle=charging?'#fffacc':'#ffd040';
  ctx.beginPath();ctx.arc(0,0,r*.18,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#5a3800';ctx.lineWidth=r*.035;ctx.stroke();
  ctx.fillStyle=charging?'#ffffff':'#ffe880';
  ctx.beginPath();ctx.arc(-r*.04,-r*.04,r*.08,0,Math.PI*2);ctx.fill();
  // Rim highlight
  ctx.strokeStyle=charging?'rgba(255,255,200,0.9)':'rgba(255,220,80,0.6)';
  ctx.lineWidth=r*.04;
  rrect(ctx,-shW/2,-shH/2,shW,shH,r*.15);ctx.stroke();
  if(charging){
   ctx.shadowColor='#fffacc';ctx.shadowBlur=18;
   ctx.strokeStyle='rgba(255,250,180,0.9)';ctx.lineWidth=2.5;
   rrect(ctx,-shW/2-r*.04,-shH/2-r*.04,shW+r*.08,shH+r*.08,r*.18);ctx.stroke();
   ctx.shadowBlur=0;
  }
  ctx.restore();
  // ── FLAIL on weapon side ──
  const links=5;const chainLen=r*1.7;
  const swingScale=charging?2.2:Math.min(1.8,Math.abs(s?s.omegaCur:1)/4);
  const swing=Math.sin(t*7)*r*.52*swingScale;
  const chainPts=[];
  for(let i=0;i<=links;i++){
   const p=i/links;
   chainPts.push({x:r*.85+p*chainLen,y:swing*p*(0.5+p*.6)});
  }
  // Chain dark outline
  ctx.strokeStyle='#1a0a00';ctx.lineWidth=r*.07;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(chainPts[0].x,chainPts[0].y);
  for(let i=1;i<=links;i++)ctx.lineTo(chainPts[i].x,chainPts[i].y);
  ctx.stroke();
  // Chain main color
  ctx.strokeStyle='#aa8833';ctx.lineWidth=r*.045;
  ctx.beginPath();ctx.moveTo(chainPts[0].x,chainPts[0].y);
  for(let i=1;i<=links;i++)ctx.lineTo(chainPts[i].x,chainPts[i].y);
  ctx.stroke();
  // Individual link rings
  ctx.strokeStyle='#cc9940';ctx.lineWidth=r*.022;
  for(let i=1;i<links;i++){
   ctx.beginPath();ctx.arc(chainPts[i].x,chainPts[i].y,r*.04,0,Math.PI*2);ctx.stroke();
  }
  // Flail ball — solid, dark-outlined, vivid
  const bx=chainPts[links].x,by=chainPts[links].y;
  // Shadow
  ctx.fillStyle='rgba(0,0,0,0.4)';ctx.beginPath();ctx.arc(bx+r*.05,by+r*.05,r*.22,0,Math.PI*2);ctx.fill();
  // Ball gradient
  const ballHot=retribPct>0.1;
  const bg=ctx.createRadialGradient(bx-r*.07,by-r*.07,r*.02,bx,by,r*.23);
  bg.addColorStop(0,ballHot?'#ffcc44':'#d0c8a0');
  bg.addColorStop(0.5,ballHot?`rgba(255,${Math.round(120-retribPct*120)},0,1)`:'#888070');
  bg.addColorStop(1,'#2a1a00');
  ctx.fillStyle=bg;ctx.beginPath();ctx.arc(bx,by,r*.23,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#1a0a00';ctx.lineWidth=r*.04;ctx.stroke();
  // Spikes — visible dark-tipped
  for(let i=0;i<8;i++){
   const a=(i/8)*Math.PI*2;
   const ix=bx+Math.cos(a)*r*.23,iy=by+Math.sin(a)*r*.23;
   const ox=bx+Math.cos(a)*r*.35,oy=by+Math.sin(a)*r*.35;
   const side=bx+Math.cos(a+.25)*r*.20,siY=by+Math.sin(a+.25)*r*.20;
   ctx.fillStyle=ballHot?'#ff8800':'#aa9966';
   ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(ox,oy);ctx.lineTo(side,siY);ctx.closePath();ctx.fill();
   ctx.strokeStyle='#1a0a00';ctx.lineWidth=r*.02;ctx.stroke();
  }
  if(ballHot){
   ctx.shadowColor='#ff6600';ctx.shadowBlur=10+retribPct*14;
   ctx.strokeStyle=`rgba(255,${Math.round(100+retribPct*100)},0,${0.6+retribPct*0.4})`;ctx.lineWidth=2.5;
   ctx.beginPath();ctx.arc(bx,by,r*.28,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 dragonbite(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const firebreathReady=s&&s.stacks>=3;
  const growing=s&&(s.whelplingGrowth||0)>0;
  const growFactor=1+(s?Math.min(0.4,s.whelplingGrowth*0.05):0);
  const pulse=0.5+0.5*Math.sin(t*8);
  {
   const clamp01=v=>Math.max(0,Math.min(1,v));
   const easeOut=v=>1-Math.pow(1-v,3);
   const easeIn=v=>v*v*v;
   const mot=s?(s.mouthOpenTimer||0):0;
   const mom=s?(s.mouthOpenMode||0):0;
   let jawPct=0.08+Math.abs(Math.sin(t*2.5))*0.04;
   let lowerPct=0.02;
   let pouncePct=0;

   if(mom===1){
    const phase=clamp01(1-mot/0.42);
    const openPhase=clamp01(phase/0.32);
    const closePhase=clamp01((phase-0.32)/0.68);
    jawPct=closePhase>0?1-easeIn(closePhase):easeOut(openPhase);
    lowerPct=0.08*jawPct;
    pouncePct=clamp01(1-Math.abs(phase-0.58)/0.30);
   } else if(mom===2){
    const breathPct=clamp01(mot/1.2);
    jawPct=0.82+0.06*Math.sin(t*18)*breathPct;
    lowerPct=0.14+0.03*Math.sin(t*14)*breathPct;
   }

   const upperAngle=-(Math.PI/4)*clamp01(jawPct);
   const lowerAngle=(Math.PI/12)*clamp01(lowerPct);
   const pounceX=r*0.20*pouncePct;
   const snoutX=r*0.88;
   const snoutW=r*1.35*growFactor;
   const toothCol=firebreathReady?`rgba(255,${Math.round(180-pulse*140)},0,0.95)`:'#f0ead0';

   ctx.save();
   ctx.translate(pounceX,0);

   if(pouncePct>0.02){
    ctx.save();
    ctx.globalAlpha=0.5*pouncePct;
    ctx.strokeStyle='#ff9a22';
    ctx.lineWidth=Math.max(1,r*0.04);
    ctx.lineCap='round';
    for(let i=0;i<3;i++){
     const y=(i-1)*r*0.16;
     ctx.beginPath();
     ctx.moveTo(snoutX-r*(0.58+i*0.08),y-r*0.08);
     ctx.quadraticCurveTo(snoutX-r*0.26,y,snoutX-r*0.06,y+r*0.03);
     ctx.stroke();
    }
    ctx.restore();
   }

   ctx.save();
   ctx.translate(snoutX,0);
   ctx.rotate(lowerAngle);
   ctx.fillStyle='#1a0000';
   ctx.beginPath();
   ctx.moveTo(-r*0.04,r*0.03);
   ctx.quadraticCurveTo(snoutW*0.45,r*0.03,snoutW,r*0.10);
   ctx.lineTo(snoutW,r*0.32*growFactor);
   ctx.quadraticCurveTo(snoutW*0.42,r*0.48*growFactor,-r*0.02,r*0.40*growFactor);
   ctx.closePath();ctx.fill();
   ctx.fillStyle='#8b1a1a';
   ctx.beginPath();
   ctx.moveTo(0,r*0.08);
   ctx.quadraticCurveTo(snoutW*0.48,r*0.08,snoutW*0.96,r*0.14);
   ctx.lineTo(snoutW*0.92,r*0.27*growFactor);
   ctx.quadraticCurveTo(snoutW*0.42,r*0.39*growFactor,r*0.05,r*0.32*growFactor);
   ctx.closePath();ctx.fill();
   ctx.fillStyle='#aa2222';
   ctx.beginPath();
   ctx.moveTo(r*0.14,r*0.18*growFactor);
   ctx.quadraticCurveTo(snoutW*0.46,r*0.15*growFactor,snoutW*0.78,r*0.19*growFactor);
   ctx.lineTo(snoutW*0.72,r*0.25*growFactor);
   ctx.quadraticCurveTo(snoutW*0.40,r*0.30*growFactor,r*0.16,r*0.27*growFactor);
   ctx.closePath();ctx.fill();
   ctx.fillStyle=toothCol;
   for(let i=0;i<5;i++){
    const tx=snoutW*(0.13+i*0.17);
    const th=r*(0.13-i*0.008)*growFactor;
    ctx.beginPath();ctx.moveTo(tx,r*0.07);ctx.lineTo(tx+r*0.055,r*0.07-th);ctx.lineTo(tx+r*0.11,r*0.07);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#2a0000';ctx.lineWidth=r*.018;ctx.stroke();
   }
   ctx.restore();

   ctx.fillStyle=firebreathReady?`rgba(255,80,0,${0.48+pulse*0.38})`:'rgba(80,10,10,0.82)';
   ctx.beginPath();
   ctx.moveTo(snoutX+r*0.08,-r*0.02);
   ctx.quadraticCurveTo(snoutX+snoutW*0.55,-r*(0.16+0.35*jawPct),snoutX+snoutW*0.96,-r*0.02);
   ctx.quadraticCurveTo(snoutX+snoutW*0.62,r*(0.12+0.08*lowerPct),snoutX+r*0.10,r*0.08);
   ctx.closePath();ctx.fill();

   if(firebreathReady){
    ctx.shadowColor='#ff4400';ctx.shadowBlur=14+pulse*10;
    const fg=ctx.createRadialGradient(snoutX+snoutW*0.92,0,0,snoutX+snoutW*0.92,0,r*0.72);
    fg.addColorStop(0,`rgba(255,200,0,${0.7+pulse*0.3})`);
    fg.addColorStop(0.4,'rgba(255,80,0,0.5)');
    fg.addColorStop(1,'transparent');
    ctx.fillStyle=fg;ctx.beginPath();ctx.arc(snoutX+snoutW*0.92,0,r*0.72,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
   }

   ctx.save();
   ctx.translate(snoutX,0);
   ctx.rotate(upperAngle);
   ctx.fillStyle='#1a0000';
   ctx.beginPath();
   ctx.moveTo(-r*0.03,-r*0.40*growFactor);
   ctx.quadraticCurveTo(snoutW*0.42,-r*0.52*growFactor,snoutW,-r*0.22*growFactor);
   ctx.lineTo(snoutW,r*0.05);
   ctx.quadraticCurveTo(snoutW*0.50,-r*0.04,r*0.02,r*0.03);
   ctx.closePath();ctx.fill();
   ctx.fillStyle='#8b1a1a';
   ctx.beginPath();
   ctx.moveTo(r*0.02,-r*0.34*growFactor);
   ctx.quadraticCurveTo(snoutW*0.42,-r*0.43*growFactor,snoutW*0.94,-r*0.18*growFactor);
   ctx.lineTo(snoutW*0.94,r*0.00);
   ctx.quadraticCurveTo(snoutW*0.48,-r*0.07,r*0.05,r*0.00);
   ctx.closePath();ctx.fill();
   ctx.fillStyle='#aa2222';
   ctx.beginPath();
   ctx.moveTo(r*0.15,-r*0.29*growFactor);
   ctx.quadraticCurveTo(snoutW*0.46,-r*0.35*growFactor,snoutW*0.78,-r*0.18*growFactor);
   ctx.lineTo(snoutW*0.74,-r*0.08*growFactor);
   ctx.quadraticCurveTo(snoutW*0.42,-r*0.15*growFactor,r*0.16,-r*0.12*growFactor);
   ctx.closePath();ctx.fill();
   ctx.fillStyle=toothCol;
   for(let i=0;i<5;i++){
    const tx=snoutW*(0.16+i*0.16);
    const th=r*(0.15-i*0.01)*growFactor;
    ctx.beginPath();ctx.moveTo(tx,r*0.00);ctx.lineTo(tx+r*0.055,th);ctx.lineTo(tx+r*0.11,r*0.00);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#2a0000';ctx.lineWidth=r*.018;ctx.stroke();
   }
   ctx.strokeStyle='rgba(60,10,10,0.65)';ctx.lineWidth=r*.035;
   for(let i=0;i<3;i++){
    const sx=r*(0.22+i*0.35),sy=-r*0.25*growFactor;
    ctx.beginPath();ctx.arc(sx,sy,r*0.12,0,Math.PI);ctx.stroke();
   }
   ctx.fillStyle='#0a0000';
   ctx.beginPath();ctx.ellipse(snoutW*0.70,-r*0.24,r*.04,r*.02,0.3,0,Math.PI*2);ctx.fill();
   ctx.beginPath();ctx.ellipse(snoutW*0.80,-r*0.20,r*.035,r*.018,-0.2,0,Math.PI*2);ctx.fill();
   ctx.restore();

   if(growing){
    const gp=Math.min(1,(s.whelplingGrowth||0)/8);
    ctx.shadowColor='#ff6600';ctx.shadowBlur=6+gp*10;
    ctx.strokeStyle=`rgba(255,${Math.round(100+gp*80)},0,${0.4+gp*0.4})`;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(snoutX+snoutW*0.5,0,r*growFactor,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
   }
   ctx.restore();
  }
  return;

  // ── Jaw open logic ──────────────────────────────────────────────────
  // mouthOpenMode 0 = idle (barely open), 1 = bite snap, 2 = firebreath wide
  const mot=s?(s.mouthOpenTimer||0):0;
  const mom=s?(s.mouthOpenMode||0):0;
  let jawOpen;
  if(mom===1){
   // Bite snap: rapid open on first frame, snaps shut as timer drains
   // mot goes 0.35 → 0; open wide immediately, close fast
   const snapPct=mot/0.35;          // 1→0 as timer expires
   jawOpen=r*(0.55*snapPct+0.05);   // wide open → nearly shut
  } else if(mom===2){
   // Firebreath: stay wide open for most of the duration, then close
   const breathPct=mot/1.2;
   jawOpen=r*(0.60+0.10*Math.sin(breathPct*Math.PI*4)*breathPct); // held open + flutter
  } else {
   // Idle: very slight ambient wiggle, mouth nearly closed
   jawOpen=r*(0.05+Math.abs(Math.sin(t*2.5))*0.04);
  }
  // ── SNOUT extending forward from the sphere ──
  // Position the mouth ahead of the sphere radius
  const snoutX=r*0.90; // where the mouth starts (at sphere edge)
  const snoutW=r*1.35*growFactor; // length of the snout
  // Dark outline of entire snout for contrast
  ctx.fillStyle='#1a0000';
  ctx.beginPath();
  ctx.moveTo(snoutX,-r*0.42*growFactor);
  ctx.lineTo(snoutX+snoutW,-r*0.18*growFactor);
  ctx.lineTo(snoutX+snoutW,r*0.18*growFactor);
  ctx.lineTo(snoutX,r*0.42*growFactor);
  ctx.closePath();ctx.fill();
  // Upper jaw
  ctx.fillStyle='#8b1a1a';
  ctx.beginPath();
  ctx.moveTo(snoutX,-r*0.38*growFactor);
  ctx.lineTo(snoutX+snoutW,-r*0.06);
  ctx.lineTo(snoutX+snoutW,-jawOpen);
  ctx.lineTo(snoutX,-r*0.36*growFactor);
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#aa2222';
  ctx.beginPath();
  ctx.moveTo(snoutX+r*0.15,-r*0.34*growFactor);
  ctx.lineTo(snoutX+snoutW,-r*0.08);
  ctx.lineTo(snoutX+snoutW,-jawOpen*0.8);
  ctx.lineTo(snoutX+r*0.15,-r*0.30*growFactor);
  ctx.closePath();ctx.fill();
  // Lower jaw
  ctx.fillStyle='#8b1a1a';
  ctx.beginPath();
  ctx.moveTo(snoutX,r*0.38*growFactor);
  ctx.lineTo(snoutX+snoutW,r*0.06);
  ctx.lineTo(snoutX+snoutW,jawOpen);
  ctx.lineTo(snoutX,r*0.36*growFactor);
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#aa2222';
  ctx.beginPath();
  ctx.moveTo(snoutX+r*0.15,r*0.30*growFactor);
  ctx.lineTo(snoutX+snoutW,r*0.05);
  ctx.lineTo(snoutX+snoutW,jawOpen*0.7);
  ctx.lineTo(snoutX+r*0.15,r*0.26*growFactor);
  ctx.closePath();ctx.fill();
  // Teeth — upper row
  const toothCol=firebreathReady?`rgba(255,${Math.round(180-pulse*140)},0,0.95)`:'#f0ead0';
  ctx.fillStyle=toothCol;
  for(let i=0;i<5;i++){
   const tx=snoutX+snoutW*(0.15+i*0.17);
   const th=r*(0.12-i*0.01)*growFactor;
   ctx.beginPath();ctx.moveTo(tx,-r*0.06);ctx.lineTo(tx+r*.055,0-jawOpen*0.85);ctx.lineTo(tx+r*.11,-r*0.06);ctx.closePath();ctx.fill();
   ctx.strokeStyle='#2a0000';ctx.lineWidth=r*.018;ctx.stroke();
  }
  // Teeth — lower row
  for(let i=0;i<5;i++){
   const tx=snoutX+snoutW*(0.12+i*0.17);
   ctx.beginPath();ctx.moveTo(tx,r*0.06);ctx.lineTo(tx+r*.055,0+jawOpen*0.85);ctx.lineTo(tx+r*.11,r*0.06);ctx.closePath();ctx.fill();
   ctx.strokeStyle='#2a0000';ctx.lineWidth=r*.018;ctx.stroke();
  }
  // Mouth interior (dark red)
  ctx.fillStyle=firebreathReady?`rgba(255,80,0,${0.5+pulse*0.4})`:'rgba(80,10,10,0.8)';
  ctx.beginPath();
  ctx.moveTo(snoutX+snoutW,-jawOpen*0.75);
  ctx.lineTo(snoutX+snoutW*0.5,-r*0.04);
  ctx.lineTo(snoutX+snoutW,jawOpen*0.75);
  ctx.closePath();ctx.fill();
  // Fire glow from mouth when ready
  if(firebreathReady){
   ctx.shadowColor='#ff4400';ctx.shadowBlur=14+pulse*10;
   const fg=ctx.createRadialGradient(snoutX+snoutW,0,0,snoutX+snoutW,0,r*0.7);
   fg.addColorStop(0,`rgba(255,200,0,${0.7+pulse*0.3})`);
   fg.addColorStop(0.4,'rgba(255,80,0,0.5)');
   fg.addColorStop(1,'transparent');
   ctx.fillStyle=fg;ctx.beginPath();ctx.arc(snoutX+snoutW,0,r*0.7,0,Math.PI*2);ctx.fill();
   ctx.shadowBlur=0;
  }
  // Scale texture on upper jaw
  ctx.strokeStyle='rgba(60,10,10,0.6)';ctx.lineWidth=r*.035;
  for(let i=0;i<3;i++){
   const sx=snoutX+r*(0.2+i*0.35),sy=-r*0.28*growFactor;
   ctx.beginPath();ctx.arc(sx,sy,r*0.12,0,Math.PI);ctx.stroke();
  }
  // Nostril slits
  ctx.fillStyle='#0a0000';
  ctx.beginPath();ctx.ellipse(snoutX+snoutW*0.7,-r*0.22,r*.04,r*.02,0.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(snoutX+snoutW*0.8,-r*0.18,r*.035,r*.018,-0.2,0,Math.PI*2);ctx.fill();
  // Growth glow ring
  if(growing){
   const gp=Math.min(1,(s.whelplingGrowth||0)/8);
   ctx.shadowColor='#ff6600';ctx.shadowBlur=6+gp*10;
   ctx.strokeStyle=`rgba(255,${Math.round(100+gp*80)},0,${0.4+gp*0.4})`;ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(snoutX+snoutW*0.5,0,r*growFactor,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 lute(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const crescendo=s&&s.crescendoActive;
  const pulse=0.5+0.5*Math.sin(t*10);
  // Real lute palette — warm instrument wood tones
  const mahogany='#6b2d0f';   // back/sides
  const spruce='#d4a96a';     // spruce top (soundboard)
  const spruceDark='#b8864a'; // spruce shadow
  const rosewood='#2d0c08';   // fretboard
  const bone='#f0ead8';       // nut & binding
  const ivory='#ede6c8';      // tuning pegs
  const gutStr='rgba(220,200,140,0.75)'; // gut/nylon strings

  // ── Neck (rosewood fretboard over mahogany shaft)
  ctx.fillStyle=mahogany;
  ctx.fillRect(r*.58,-r*.058,r*1.85,r*.116);
  ctx.fillStyle=rosewood;
  ctx.fillRect(r*.60,-r*.048,r*1.80,r*.096);
  // Nut (bone white strip at base of neck)
  ctx.fillStyle=bone;
  ctx.fillRect(r*.58,-r*.058,r*.06,r*.116);
  // Frets (thin silver lines)
  ctx.strokeStyle='rgba(180,180,160,0.7)';ctx.lineWidth=r*.018;
  for(let i=0;i<5;i++){
   const fx=r*(.72+i*.32);
   ctx.beginPath();ctx.moveTo(fx,-r*.048);ctx.lineTo(fx,r*.048);ctx.stroke();
  }

  // ── Body — mahogany back (shadow layer)
  ctx.fillStyle=mahogany;
  ctx.beginPath();
  ctx.ellipse(r*2.52,r*.02,r*.58,r*.45,0,0,Math.PI*2);
  ctx.fill();
  // Spruce soundboard (top face, slightly inset)
  const bodyGrad=ctx.createRadialGradient(r*2.35,-r*.08,r*.05,r*2.55,r*.04,r*.52);
  bodyGrad.addColorStop(0,spruce);
  bodyGrad.addColorStop(0.6,spruceDark);
  bodyGrad.addColorStop(1,mahogany);
  ctx.fillStyle=bodyGrad;
  ctx.beginPath();
  ctx.ellipse(r*2.52,r*.0,r*.54,r*.43,0,0,Math.PI*2);
  ctx.fill();
  // Wood grain lines on soundboard
  ctx.strokeStyle='rgba(160,110,50,0.25)';ctx.lineWidth=r*.012;
  for(let g=0;g<4;g++){
   const gy=-r*.28+g*r*.18;
   ctx.beginPath();ctx.moveTo(r*2.0,gy);ctx.lineTo(r*3.05,gy);ctx.stroke();
  }
  // Binding strip around body edge
  ctx.strokeStyle=bone;ctx.lineWidth=r*.028;
  ctx.beginPath();ctx.ellipse(r*2.52,r*.0,r*.54,r*.43,0,0,Math.PI*2);ctx.stroke();

  // ── Sound hole (rosette)
  ctx.fillStyle=rosewood;
  ctx.beginPath();ctx.arc(r*2.52,0,r*.15,0,Math.PI*2);ctx.fill();
  // Rosette ring detail
  ctx.strokeStyle='rgba(200,160,80,0.6)';ctx.lineWidth=r*.025;
  ctx.beginPath();ctx.arc(r*2.52,0,r*.19,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(200,160,80,0.3)';ctx.lineWidth=r*.012;
  ctx.beginPath();ctx.arc(r*2.52,0,r*.22,0,Math.PI*2);ctx.stroke();

  // ── Strings (gut/nylon, 4 strings)
  const strCols=crescendo
   ?['rgba(80,255,120,0.9)','rgba(255,220,40,0.9)','rgba(80,180,255,0.9)','rgba(255,80,80,0.9)']
   :[gutStr,gutStr,gutStr,gutStr];
  ctx.lineWidth=r*.016;
  for(let i=0;i<4;i++){
   const sy=-r*.055+i*r*.037;
   ctx.strokeStyle=strCols[i];
   ctx.beginPath();ctx.moveTo(r*.62,sy);ctx.lineTo(r*3.04,sy);ctx.stroke();
  }

  // ── Tuning pegs (ivory/bone, 2 pairs at pegbox)
  ctx.fillStyle=rosewood;ctx.fillRect(r*.58,-r*.18,r*.12,r*.36); // pegbox
  ctx.fillStyle=ivory;
  const pegPositions=[[-r*.15],[r*.0],[r*.15]];
  for(let i=0;i<3;i++){
   const py=pegPositions[i][0];
   ctx.beginPath();ctx.arc(r*.53,py,r*.055,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='rgba(120,90,40,0.5)';ctx.lineWidth=r*.018;ctx.stroke();
  }

  // ── Crescendo glow — multicolour shimmer around body
  if(crescendo){
   const glowCols=['#44ff88','#ffdd00','#44aaff','#ff4444','#e040fb'];
   const gc=glowCols[Math.floor(t*4)%glowCols.length];
   ctx.shadowColor=gc;ctx.shadowBlur=14+pulse*10;
   ctx.strokeStyle=`rgba(255,255,255,${0.4+pulse*0.5})`;ctx.lineWidth=2;
   ctx.beginPath();ctx.ellipse(r*2.52,0,r*.62,r*.5,0,0,Math.PI*2);ctx.stroke();
   // Vibrating string highlight
   for(let i=0;i<4;i++){
    const sy=-r*.055+i*r*.037;
    const wave=Math.sin(t*20+i*1.5)*r*.03;
    ctx.strokeStyle=glowCols[i%glowCols.length];ctx.lineWidth=r*.022;ctx.globalAlpha=0.7+pulse*0.3;
    ctx.beginPath();ctx.moveTo(r*.62,sy);
    ctx.quadraticCurveTo(r*1.8,sy+wave,r*3.04,sy);
    ctx.stroke();ctx.globalAlpha=1;
   }
   ctx.shadowBlur=0;
  }
 },

 royalscepter(ctx,r,d,s){
  const t=performance.now()/1000,p=s&&s.decreeT>0?0.5+0.5*Math.sin(t*10):0;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  // Royal scepter: long gilded ceremonial shaft, jeweled collar, crown head, and heavy orb.
  const shaftX=r*.55,shaftY=-r*.065,shaftL=r*1.98,shaftH=r*.13;
  const shaftGrad=ctx.createLinearGradient(shaftX,shaftY,shaftX,shaftY+shaftH);
  shaftGrad.addColorStop(0,'#fff0a8');shaftGrad.addColorStop(.18,d.wcol);shaftGrad.addColorStop(.48,'#9b6718');shaftGrad.addColorStop(.78,d.wdrk);shaftGrad.addColorStop(1,'#3d2105');
  ctx.fillStyle=shaftGrad;rrect(ctx,shaftX,shaftY,shaftL,shaftH,r*.045);ctx.fill();
  ctx.strokeStyle='#2a1402';ctx.lineWidth=r*.022;ctx.stroke();
  ctx.strokeStyle='rgba(255,245,180,.75)';ctx.lineWidth=r*.018;ctx.beginPath();ctx.moveTo(r*.7,-r*.035);ctx.lineTo(r*2.32,-r*.035);ctx.stroke();
  ctx.strokeStyle='#ffd35a';ctx.lineWidth=r*.028;
  for(let i=0;i<5;i++){const x=r*(.74+i*.31);ctx.beginPath();ctx.moveTo(x,-r*.085);ctx.lineTo(x+r*.12,r*.085);ctx.stroke();}
  // Grip pommel and jewel bands make it read as royal regalia instead of a plain mace.
  for(const x of [r*.72,r*1.28,r*1.84,r*2.38]){
   ctx.fillStyle='#d00020';ctx.beginPath();ctx.ellipse(x,0,r*.055,r*.105,0,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#ffd35a';ctx.lineWidth=r*.012;ctx.stroke();
  }
  ctx.fillStyle='#7df6ff';ctx.beginPath();ctx.arc(r*2.08,0,r*.06,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffffff';ctx.stroke();
  ctx.translate(r*2.62,0);ctx.shadowColor=d.rim;ctx.shadowBlur=10+p*16;
  // Heavy jeweled orb at the end of the scepter.
  const orb=ctx.createRadialGradient(-r*.13,-r*.16,r*.04,0,0,r*.42);
  orb.addColorStop(0,'#fff7c7');orb.addColorStop(.32,d.wcol);orb.addColorStop(.66,'#c78a1a');orb.addColorStop(1,'#5c3105');
  ctx.fillStyle=orb;ctx.beginPath();ctx.arc(0,0,r*.38,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#2a1304';ctx.lineWidth=r*.026;ctx.stroke();
  ctx.fillStyle='#d00020';ctx.beginPath();ctx.arc(-r*.09,-r*.08,r*.07,0,Math.PI*2);ctx.arc(r*.1,r*.09,r*.055,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#7df6ff';ctx.beginPath();ctx.arc(r*.08,-r*.09,r*.045,0,Math.PI*2);ctx.fill();
  // Crown head belongs on the forward tip of the scepter, not hanging off the side.
  ctx.save();
  ctx.translate(r*.34,0);
  ctx.shadowColor=d.rim;ctx.shadowBlur=8+p*10;
  const cup=ctx.createLinearGradient(-r*.04,-r*.36,r*.28,r*.36);cup.addColorStop(0,'#6c090f');cup.addColorStop(.45,'#d00020');cup.addColorStop(1,'#ff4960');
  ctx.fillStyle=cup;ctx.strokeStyle='#ffd35a';ctx.lineWidth=r*.028;
  ctx.beginPath();ctx.moveTo(-r*.06,-r*.39);ctx.quadraticCurveTo(r*.12,0,-r*.06,r*.39);ctx.lineTo(r*.13,r*.31);ctx.quadraticCurveTo(r*.05,0,r*.13,-r*.31);ctx.closePath();ctx.fill();ctx.stroke();
  for(let i=-2;i<=2;i++){
   const y=i*r*.16,len=i===0?r*.76:Math.abs(i)===1?r*.58:r*.46;
   ctx.fillStyle=i===0?'#b60018':'#d00020';ctx.strokeStyle='#ffd35a';
   ctx.beginPath();ctx.moveTo(r*.09,y-r*.075);ctx.lineTo(len,y);ctx.lineTo(r*.09,y+r*.075);ctx.closePath();ctx.fill();ctx.stroke();
   const jewel=i===0?'#7df6ff':Math.abs(i)===1?'#ffd35a':'#fff1a8';
   ctx.fillStyle=jewel;ctx.beginPath();ctx.arc(len,y,r*(i===0?.055:.04),0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7a4a08';ctx.lineWidth=r*.01;ctx.stroke();
  }
  ctx.fillStyle='#ffd35a';ctx.beginPath();ctx.moveTo(r*.52,0);ctx.bezierCurveTo(r*.46,-r*.16,r*.3,-r*.17,r*.24,0);ctx.bezierCurveTo(r*.3,r*.17,r*.46,r*.16,r*.52,0);ctx.fill();
  ctx.fillRect(r*.18,-r*.025,r*.34,r*.05);
  ctx.restore();
  if(s&&s.decreeT>0){
   ctx.strokeStyle=`rgba(255,211,90,${.45+p*.4})`;ctx.lineWidth=r*.07;ctx.setLineDash([r*.08,r*.05]);
   ctx.beginPath();ctx.arc(0,-r*.22,r*(.72+p*.1),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=`rgba(255,211,90,${.18+p*.16})`;ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,rr=r*(.78+(i%2)*.16);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr-r*.1);}ctx.closePath();ctx.fill();
  }
  ctx.shadowBlur=0;ctx.restore();
 },
 regalrapier(ctx,r,d,s){
  const t=performance.now()/1000,p=s&&s.blinking?0.5+0.5*Math.sin(t*14):0,g=s&&s.queenGambitT>0?0.5+0.5*Math.sin(t*18):0;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  if(s&&s.queenGambitT>0){ctx.shadowColor=d.color;ctx.shadowBlur=18+g*10;}
  const x0=r*.82,x1=r*3.46;
  ctx.strokeStyle='#32142a';ctx.lineWidth=r*.055;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1,0);ctx.stroke();
  ctx.strokeStyle=s&&s.queenGambitT>0?d.color:d.wcol;ctx.lineWidth=s&&s.queenGambitT>0?r*.045:r*.026;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1,0);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.72)';ctx.lineWidth=r*.012;ctx.beginPath();ctx.moveTo(x0+r*.08,-r*.025);ctx.lineTo(x1-r*.16,-r*.025);ctx.stroke();
  ctx.fillStyle='#fff4fb';ctx.beginPath();ctx.moveTo(x1,-r*.065);ctx.lineTo(x1+r*.28,0);ctx.lineTo(x1,r*.065);ctx.closePath();ctx.fill();ctx.strokeStyle=d.wdrk;ctx.stroke();
  const gg=ctx.createLinearGradient(r*.55,-r*.48,r*1.02,r*.48);gg.addColorStop(0,'#fff0fb');gg.addColorStop(.44,d.wcol);gg.addColorStop(1,d.wdrk);
  ctx.strokeStyle=gg;ctx.lineWidth=r*.04;ctx.beginPath();ctx.ellipse(r*.82,0,r*.34,r*.47,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(r*.7,-r*.18,r*.18,Math.PI*.15,Math.PI*1.35);ctx.stroke();ctx.beginPath();ctx.arc(r*.7,r*.18,r*.18,-Math.PI*1.35,-Math.PI*.15);ctx.stroke();
  ctx.fillStyle=d.wdrk;ctx.fillRect(r*.56,-r*.055,r*.34,r*.11);ctx.fillStyle=d.rim;ctx.beginPath();ctx.arc(r*.6,0,r*.075,0,Math.PI*2);ctx.fill();
  if(s&&s.blinking){ctx.shadowColor=d.rim;ctx.shadowBlur=18;ctx.strokeStyle=`rgba(255,139,209,${.4+p*.45})`;ctx.lineWidth=r*.09;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1+r*.35,0);ctx.stroke();}
  if(s&&s.queenGambitT>0){ctx.strokeStyle=`rgba(176,24,114,${.45+g*.35})`;ctx.lineWidth=r*.12;ctx.beginPath();ctx.moveTo(x0-r*.04,0);ctx.lineTo(x1+r*.42,0);ctx.stroke();}
  ctx.shadowBlur=0;ctx.restore();
 },
 duelingsabre(ctx,r,d,s){
  const t=performance.now()/1000,p=s&&s.rushT>0?0.5+0.5*Math.sin(t*16):0;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  const x0=r*.82,x1=r*3.0;
  ctx.strokeStyle='#293553';ctx.lineWidth=r*.13;ctx.beginPath();ctx.moveTo(x0,r*.045);ctx.quadraticCurveTo(r*1.85,-r*.34,x1,-r*.08);ctx.stroke();
  ctx.strokeStyle=d.wcol;ctx.lineWidth=r*.072;ctx.beginPath();ctx.moveTo(x0,r*.04);ctx.quadraticCurveTo(r*1.86,-r*.29,x1,-r*.065);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.68)';ctx.lineWidth=r*.018;ctx.beginPath();ctx.moveTo(x0+r*.15,-r*.01);ctx.quadraticCurveTo(r*1.95,-r*.26,x1-r*.15,-r*.08);ctx.stroke();
  ctx.fillStyle='#edf6ff';ctx.beginPath();ctx.moveTo(x1,-r*.15);ctx.lineTo(x1+r*.24,-r*.06);ctx.lineTo(x1,r*.015);ctx.closePath();ctx.fill();ctx.strokeStyle=d.wdrk;ctx.stroke();
  ctx.strokeStyle=d.wdrk;ctx.lineWidth=r*.05;ctx.beginPath();ctx.arc(r*.78,0,r*.34,-Math.PI*.88,Math.PI*.82);ctx.stroke();
  ctx.strokeStyle=d.wcol;ctx.lineWidth=r*.025;ctx.beginPath();ctx.arc(r*.78,0,r*.25,-Math.PI*.78,Math.PI*.72);ctx.stroke();
  ctx.fillStyle='#3a2614';ctx.fillRect(r*.54,-r*.055,r*.34,r*.11);ctx.fillStyle='#8bb7ff';ctx.beginPath();ctx.arc(r*.55,0,r*.08,0,Math.PI*2);ctx.fill();
  if(s&&s.rushT>0){ctx.shadowColor=d.rim;ctx.shadowBlur=14;ctx.strokeStyle=`rgba(139,183,255,${.35+p*.38})`;ctx.lineWidth=r*.16;ctx.beginPath();ctx.moveTo(r*.95,r*.18);ctx.quadraticCurveTo(r*1.92,-r*.5,r*3.28,-r*.05);ctx.stroke();ctx.shadowBlur=0;}
  ctx.restore();
 },
 pixiewand(ctx,r,d,s){
  const t=performance.now()/1000;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  const rg=ctx.createLinearGradient(r*.55,-r*.04,r*2.02,r*.04);rg.addColorStop(0,'#fff');rg.addColorStop(.5,'#ffd9fb');rg.addColorStop(1,'#b86aff');
  ctx.strokeStyle='#5d2a72';ctx.lineWidth=r*.085;ctx.beginPath();ctx.moveTo(r*.55,0);ctx.lineTo(r*2.05,0);ctx.stroke();
  ctx.strokeStyle=rg;ctx.lineWidth=r*.05;ctx.beginPath();ctx.moveTo(r*.58,-r*.01);ctx.lineTo(r*2.02,-r*.01);ctx.stroke();
  for(let i=0;i<3;i++){ctx.fillStyle=i%2?'#ff8ce2':'#fff0ff';ctx.beginPath();ctx.arc(r*(.85+i*.38),Math.sin(t*3+i)*r*.035,r*.035,0,Math.PI*2);ctx.fill();}
  ctx.translate(r*2.2,0);ctx.rotate(t*2.4);
  ctx.shadowColor=d.rim;ctx.shadowBlur=14+Math.sin(t*9)*4;
  const sg=ctx.createRadialGradient(0,0,1,0,0,r*.44);sg.addColorStop(0,'#fff');sg.addColorStop(.45,d.wcol);sg.addColorStop(1,'#ff61ce');ctx.fillStyle=sg;
  ctx.beginPath();for(let i=0;i<10;i++){const rr=i%2?r*.16:r*.39,a=i*Math.PI/5-Math.PI/2;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();
  ctx.strokeStyle='#ffffff';ctx.lineWidth=r*.018;ctx.stroke();
  ctx.globalAlpha=.75;for(let i=0;i<5;i++){const a=t*1.8+i*Math.PI*2/5;ctx.fillStyle=i%2?'#fff0ff':'#ffb8ef';ctx.beginPath();ctx.arc(Math.cos(a)*r*.56,Math.sin(a)*r*.56,r*.035,0,Math.PI*2);ctx.fill();}
  ctx.restore();
 },
 beastwhip(ctx,r,d,s){
  const t=performance.now()/1000;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  ctx.fillStyle='#4a2410';ctx.fillRect(r*.48,-r*.1,r*.55,r*.2);ctx.fillStyle='#c08a50';ctx.fillRect(r*.56,-r*.065,r*.32,r*.045);
  const pts=[];for(let i=0;i<=10;i++){const p=i/10;pts.push({x:r*(.88+p*3.65),y:Math.sin(t*5+i*.62)*r*(.08+.18*p)+Math.sin(p*Math.PI)*r*.08});}
  ctx.strokeStyle='#2a1206';ctx.lineWidth=r*.105;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();
  ctx.strokeStyle=d.wdrk;ctx.lineWidth=r*.075;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();
  ctx.strokeStyle=d.wcol;ctx.lineWidth=r*.022;ctx.setLineDash([r*.12,r*.12]);ctx.beginPath();ctx.moveTo(pts[1].x,pts[1].y-r*.02);for(let i=2;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y-r*.02);ctx.stroke();ctx.setLineDash([]);
  const tip=pts[pts.length-1];ctx.fillStyle='#e0b16d';ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.lineTo(tip.x+r*.22,tip.y-r*.06);ctx.lineTo(tip.x+r*.15,tip.y+r*.11);ctx.closePath();ctx.fill();
  if(s&&s.packHuntT>0){ctx.shadowColor='#ffb060';ctx.shadowBlur=13;ctx.strokeStyle='rgba(255,176,96,.48)';ctx.lineWidth=r*.13;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();ctx.shadowBlur=0;}
  ctx.restore();
 },
 ancienttome(ctx,r,d,s){
  const t=performance.now()/1000,p=s&&s.foresightT>0?0.5+0.5*Math.sin(t*11):0;
  ctx.save();ctx.translate(r*1.48,0);ctx.rotate(t*1.35);
  ctx.shadowColor=s&&s.foresightT>0?d.rim:'transparent';ctx.shadowBlur=8+p*14;
  const bg=ctx.createLinearGradient(-r*.55,-r*.42,r*.55,r*.42);bg.addColorStop(0,'#34200e');bg.addColorStop(.45,'#7a4f25');bg.addColorStop(1,'#201207');
  ctx.fillStyle=bg;rrect(ctx,-r*.56,-r*.42,r*1.12,r*.84,r*.08);ctx.fill();ctx.strokeStyle='#120a04';ctx.lineWidth=r*.025;ctx.stroke();
  ctx.fillStyle='#e6d8a0';rrect(ctx,-r*.47,-r*.34,r*.42,r*.68,r*.035);ctx.fill();rrect(ctx,r*.05,-r*.34,r*.42,r*.68,r*.035);ctx.fill();
  ctx.strokeStyle=d.rim;ctx.lineWidth=r*.028;ctx.beginPath();ctx.moveTo(0,-r*.35);ctx.lineTo(0,r*.35);ctx.stroke();
  ctx.strokeStyle='#7a6040';ctx.lineWidth=r*.012;for(let i=0;i<4;i++){const y=-r*.22+i*r*.13;ctx.beginPath();ctx.moveTo(-r*.38,y);ctx.lineTo(-r*.12,y+r*.02);ctx.stroke();ctx.beginPath();ctx.moveTo(r*.12,y+r*.01);ctx.lineTo(r*.38,y-r*.015);ctx.stroke();}
  ctx.fillStyle=d.rim;for(let i=0;i<4;i++){const a=t*2+i*Math.PI/2;ctx.beginPath();ctx.arc(Math.cos(a)*r*.68,Math.sin(a)*r*.55,r*.035,0,Math.PI*2);ctx.fill();}
  if(s&&s.knowledge>0){ctx.strokeStyle=`rgba(214,240,178,${.35+Math.min(.45,s.knowledge*.04)})`;ctx.lineWidth=r*.035;ctx.beginPath();ctx.arc(0,0,r*.7,0,Math.PI*2);ctx.stroke();}
  ctx.shadowBlur=0;ctx.restore();
 },
};
