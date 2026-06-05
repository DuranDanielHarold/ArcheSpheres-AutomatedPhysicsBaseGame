'use strict';
// ▓▓▓ SECTION:WEAPONS — Weapon draw functions, one per class ▓▓▓

// ▓▓▓ SECTION:WEAPONS — Weapon draw functions, one per class ▓▓▓
const WEAPONS={
 broadsword(ctx,r,d,s){
  const L=r*2.1,th=r*.14,gW=r*.7;
  const x0=r*.85,x1=x0+L,tip=x1+r*.3;
  ctx.save();
  // Crossguard and wrapped grip stay within the original guard footprint.
  const guardGrad=ctx.createLinearGradient(r*.65,-gW/2,r*.85,gW/2);
  guardGrad.addColorStop(0,'#4d3508');guardGrad.addColorStop(0.45,'#d7b750');guardGrad.addColorStop(1,'#6a4710');
  ctx.fillStyle=guardGrad;ctx.fillRect(r*.65,-gW/2,r*.2,gW);
  ctx.strokeStyle='#2b1a04';ctx.lineWidth=Math.max(1,r*.018);ctx.strokeRect(r*.65,-gW/2,r*.2,gW);
  ctx.fillStyle='#f4d97a';ctx.fillRect(r*.66,-gW/2+1,r*.18,3);
  ctx.beginPath();ctx.arc(r*.75,-gW*.42,r*.075,0,Math.PI*2);ctx.arc(r*.75,gW*.42,r*.075,0,Math.PI*2);ctx.fill();

  // Same start, length, and tip endpoint as the old stick blade; richer silhouette only.
  const bladeGrad=ctx.createLinearGradient(x0,-th,x0,th);
  bladeGrad.addColorStop(0,'#f7fbff');bladeGrad.addColorStop(0.28,d.wcol);bladeGrad.addColorStop(0.52,'#9fb3c2');bladeGrad.addColorStop(0.74,d.wdrk);bladeGrad.addColorStop(1,'#eef6ff');
  ctx.fillStyle=bladeGrad;
  ctx.beginPath();
  ctx.moveTo(x0,-th/2);ctx.lineTo(x1,-th/2);ctx.lineTo(tip,0);ctx.lineTo(x1,th/2);ctx.lineTo(x0,th/2);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#22313d';ctx.lineWidth=Math.max(1.2,r*.025);ctx.stroke();

  // Central fuller and edge highlights add broadsword character without changing hitbox geometry.
  ctx.strokeStyle='rgba(48,66,82,.52)';ctx.lineWidth=Math.max(1,r*.018);ctx.beginPath();ctx.moveTo(x0+r*.16,0);ctx.lineTo(x1-r*.12,0);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.72)';ctx.lineWidth=Math.max(1,r*.016);ctx.beginPath();ctx.moveTo(x0+r*.08,-th*.31);ctx.lineTo(x1-r*.08,-th*.31);ctx.lineTo(tip-r*.14,-th*.06);ctx.stroke();
  ctx.strokeStyle='rgba(40,55,70,.45)';ctx.beginPath();ctx.moveTo(x0+r*.1,th*.3);ctx.lineTo(x1-r*.08,th*.3);ctx.lineTo(tip-r*.14,th*.06);ctx.stroke();

  // Ricasso collar and small pommel detail.
  ctx.fillStyle='#6d4a12';ctx.fillRect(x0-r*.05,-th*.72,r*.12,th*1.44);
  ctx.strokeStyle='#2b1a04';ctx.lineWidth=Math.max(1,r*.014);ctx.strokeRect(x0-r*.05,-th*.72,r*.12,th*1.44);
  ctx.fillStyle='#caa542';ctx.beginPath();ctx.arc(r*.58,0,r*.095,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#3b2606';ctx.stroke();
  if(s&&s.invincible){ctx.shadowColor='#fff';ctx.shadowBlur=12;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,-th/2);ctx.lineTo(x1,-th/2);ctx.lineTo(tip,0);ctx.lineTo(x1,th/2);ctx.lineTo(x0,th/2);ctx.closePath();ctx.stroke();ctx.shadowBlur=0;}
  ctx.restore();
 },
 nodachi(ctx,r,d,s){
  const L=r*3.3,th=r*.065;
  const x0=r*1.24,xTip=x0+L;
  ctx.save();
  // Long wrapped handle and oval guard retain their original footprint.
  const gripGrad=ctx.createLinearGradient(r*.6,-th*1.1,r*1.15,th*1.1);
  gripGrad.addColorStop(0,'#1f0d04');gripGrad.addColorStop(0.5,'#4a210c');gripGrad.addColorStop(1,'#2a1206');
  ctx.fillStyle=gripGrad;ctx.fillRect(r*.6,-th,r*.55,th*2);
  ctx.strokeStyle='#120804';ctx.lineWidth=Math.max(1,r*.012);ctx.strokeRect(r*.6,-th,r*.55,th*2);
  ctx.strokeStyle='#c8a060';ctx.lineWidth=Math.max(1,r*.028);
  for(let i=0;i<4;i++){const x=r*(.64+i*.13);ctx.beginPath();ctx.moveTo(x,-th*.95);ctx.lineTo(x+r*.08,th*.95);ctx.stroke();}
  const guardGrad=ctx.createRadialGradient(r*1.12,-r*.05,r*.02,r*1.15,0,r*.31);
  guardGrad.addColorStop(0,'#e0b870');guardGrad.addColorStop(0.56,'#806030');guardGrad.addColorStop(1,'#2b1b10');
  ctx.fillStyle=guardGrad;ctx.beginPath();ctx.ellipse(r*1.15,0,r*.09,r*.3,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#302418';ctx.lineWidth=1;ctx.stroke();

  // Same blade start/end and slim thickness, with katana-like curve and polished facets.
  ctx.beginPath();
  ctx.moveTo(x0,-th/2);
  ctx.quadraticCurveTo(r*2.4,-th*1.2,xTip,-th*.15);
  ctx.lineTo(xTip,th*.15);
  ctx.quadraticCurveTo(r*2.4,th*.4,x0,th/2);
  ctx.closePath();
  const bladeGrad=ctx.createLinearGradient(x0,-th*1.5,x0,th*1.5);
  bladeGrad.addColorStop(0,'#f8f4dc');bladeGrad.addColorStop(0.32,d.wcol);bladeGrad.addColorStop(0.6,'#9a927d');bladeGrad.addColorStop(1,d.wdrk);
  ctx.fillStyle=bladeGrad;ctx.fill();
  ctx.strokeStyle='#3c382f';ctx.lineWidth=Math.max(1,r*.017);ctx.stroke();

  // Bright cutting edge and darker spine follow the existing curve; no geometry changes.
  ctx.strokeStyle='rgba(255,255,245,.72)';ctx.lineWidth=Math.max(1,r*.018);
  ctx.beginPath();ctx.moveTo(x0+r*.08,-th*.42);ctx.quadraticCurveTo(r*2.45,-th*1.0,xTip-r*.12,-th*.12);ctx.stroke();
  ctx.strokeStyle='rgba(72,64,48,.48)';ctx.lineWidth=Math.max(1,r*.014);
  ctx.beginPath();ctx.moveTo(x0+r*.08,th*.32);ctx.quadraticCurveTo(r*2.45,th*.2,xTip-r*.15,th*.08);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.30)';ctx.lineWidth=Math.max(1,r*.012);
  ctx.beginPath();ctx.moveTo(x0+r*.18,-th*.06);ctx.quadraticCurveTo(r*2.5,-th*.55,xTip-r*.25,-th*.02);ctx.stroke();

  if(s&&s.spiralActive){
   ctx.fillStyle='rgba(255,220,80,.38)';
   ctx.beginPath();ctx.moveTo(x0,-th*2);ctx.lineTo(xTip+r*.4,0);ctx.lineTo(x0,th*2);ctx.closePath();ctx.fill();
  }
  ctx.restore();
 },
 battleaxe(ctx,r,d,s){
  const sL=r*1.7,sT=r*.1;
  ctx.fillStyle='#6a3a10';ctx.fillRect(r*.6,-sT/2,sL,sT);
  ctx.fillStyle='#402010';ctx.fillRect(r*.6,sT*.15,sL,sT*.4);
  const bx=r*.6+sL;
  ctx.fillStyle=d.wcol;
  ctx.beginPath();ctx.moveTo(bx,-r*.9);ctx.bezierCurveTo(bx+r*.9,-r*.7,bx+r*.95,r*.3,bx,r*.7);ctx.lineTo(bx,r*.15);ctx.bezierCurveTo(bx+r*.5,r*.1,bx+r*.5,-r*.3,bx,-r*.25);ctx.closePath();ctx.fill();
  ctx.fillStyle=d.wdrk;
  ctx.beginPath();ctx.moveTo(bx,0);ctx.bezierCurveTo(bx+r*.9,r*.1,bx+r*.95,r*.3,bx,r*.7);ctx.lineTo(bx,r*.15);ctx.bezierCurveTo(bx+r*.4,r*.1,bx+r*.4,r*.1,bx,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#222';ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(bx,-r*.9);ctx.bezierCurveTo(bx+r*.9,-r*.7,bx+r*.95,r*.3,bx,r*.7);ctx.stroke();
  if(s&&s.stacks>=3){
   const p=Math.min(1,s.stacks/5);
   ctx.shadowColor='#ff8800';ctx.shadowBlur=10;
   ctx.beginPath();ctx.arc(0,0,r+5,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,140,20,${p*.85})`;ctx.lineWidth=3;ctx.stroke();
   ctx.beginPath();ctx.arc(bx,0,r*.3,0,Math.PI*2);
   ctx.strokeStyle='rgba(255,180,0,.7)';ctx.lineWidth=2;ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 flail(ctx,r,d,s){
  const chainLen=r*2.2,t=s?s.abTimer:0;
  const swingAmt=r*.5;
  const links=9;
  const pts=[];
  for(let i=0;i<=links;i++){
   const lx=r*.8+i*(chainLen/links);
   const ly=Math.sin(t*7+i*.18)*swingAmt*(i/links)+Math.sin(t*3.5)*swingAmt*.15*(i/links);
   pts.push({x:lx,y:ly});
  }
  for(let i=0;i<links;i++){
   const ax=pts[i].x,ay=pts[i].y,bx2=pts[i+1].x,by2=pts[i+1].y;
   const ang=Math.atan2(by2-ay,bx2-ax);
   const mx=(ax+bx2)/2,my=(ay+by2)/2;
   ctx.save();ctx.translate(mx,my);ctx.rotate(ang);
   if(i%2===0){
    ctx.strokeStyle='#aaa';ctx.lineWidth=r*.055;ctx.lineCap='round';
    ctx.beginPath();ctx.ellipse(0,0,r*.13,r*.055,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#666';ctx.lineWidth=r*.02;ctx.stroke();
   } else {
    ctx.strokeStyle='#888';ctx.lineWidth=r*.055;ctx.lineCap='round';
    ctx.beginPath();ctx.ellipse(0,0,r*.055,r*.13,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#555';ctx.lineWidth=r*.02;ctx.stroke();
   }
   ctx.restore();
  }
  ctx.fillStyle='#5a2a10';ctx.fillRect(r*.6,-r*.07,r*.25,r*.14);
  ctx.fillStyle='#8a4a20';ctx.fillRect(r*.62,-r*.05,r*.2,r*.04);
  const ballX=pts[links].x,ballY=pts[links].y;
  const ballRot=t*4.5;
  const ballR=r*.36;
  ctx.save();ctx.translate(ballX,ballY);ctx.rotate(ballRot);
  const bg=ctx.createRadialGradient(-ballR*.2,-ballR*.2,1,0,0,ballR);
  bg.addColorStop(0,d.wcol);bg.addColorStop(0.6,d.wdrk);bg.addColorStop(1,'#1a0808');
  ctx.fillStyle=bg;ctx.beginPath();ctx.arc(0,0,ballR,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#333';ctx.lineWidth=1.2;ctx.stroke();
  const spikes=8;
  for(let i=0;i<spikes;i++){
   const sa=(i/spikes)*Math.PI*2;
   const sx=Math.cos(sa),sy=Math.sin(sa);
   const spikeLen=r*.28,spikeW=r*.07;
   const px=sx*(ballR+spikeLen),py=sy*(ballR+spikeLen);
   const tx2=-sy*spikeW,ty2=sx*spikeW;
   ctx.fillStyle=i%2===0?d.wcol:'#ccc';
   ctx.beginPath();
   ctx.moveTo(sx*ballR+tx2,sy*ballR+ty2);
   ctx.lineTo(px,py);
   ctx.lineTo(sx*ballR-tx2,sy*ballR-ty2);
   ctx.closePath();ctx.fill();
   ctx.strokeStyle='#444';ctx.lineWidth=.8;ctx.stroke();
  }
  ctx.fillStyle='#111';ctx.beginPath();ctx.ellipse(-ballR*.22,-ballR*.18,r*.06,r*.08,-.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(ballR*.22,-ballR*.18,r*.06,r*.08,.3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#cc0000';ctx.beginPath();ctx.arc(-ballR*.22,-ballR*.18,r*.025,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(ballR*.22,-ballR*.18,r*.025,0,Math.PI*2);ctx.fill();
  ctx.restore();
  if(s&&s.ramActive){
   const pulse=0.6+0.4*Math.sin(t*18);
   ctx.shadowColor='#ff2200';ctx.shadowBlur=18;
   ctx.strokeStyle=`rgba(255,40,0,${pulse})`;ctx.lineWidth=3.5;
   ctx.beginPath();ctx.arc(ballX,ballY,ballR+r*.18,0,Math.PI*2);ctx.stroke();
   ctx.shadowColor='#ff4400';ctx.shadowBlur=10;
   ctx.strokeStyle='rgba(255,80,0,.35)';ctx.lineWidth=r*.22;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
   for(let i=1;i<=links;i++)ctx.lineTo(pts[i].x,pts[i].y);
   ctx.stroke();ctx.shadowBlur=0;
  }
 },
 morningstar(ctx,r,d,s){
  const sL=r*1.3;
  ctx.fillStyle='#c09040';ctx.fillRect(r*.7,-r*.08,sL,r*.16);
  ctx.fillStyle='#806020';ctx.fillRect(r*.7,r*.02,sL,r*.06);
  const bx=r*.7+sL,by=0;
  ctx.fillStyle=d.wcol;ctx.beginPath();ctx.arc(bx,by,r*.38,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=d.wdrk;ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle=d.wcol;
  for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2;
   ctx.save();ctx.translate(bx,by);ctx.rotate(a);
   ctx.beginPath();ctx.moveTo(r*.32,0);ctx.lineTo(r*.54,r*.07);ctx.lineTo(r*.54,-r*.07);ctx.closePath();ctx.fill();
   ctx.restore();}
  if(s&&s.stacks>=2){
   const g=ctx.createRadialGradient(bx,by,0,bx,by,r*.7);
   g.addColorStop(0,d.rim+'cc');g.addColorStop(1,'transparent');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(bx,by,r*.7,0,Math.PI*2);ctx.fill();
  }
  ctx.strokeStyle='#334';ctx.lineWidth=1;ctx.beginPath();ctx.arc(bx,by,r*.38,0,Math.PI*2);ctx.stroke();
 },
 kusarigama(ctx,r,d,s){
  const t=s?s.abTimer:0;
  ctx.fillStyle=d.wcol;
  ctx.beginPath();ctx.moveTo(r*.9,0);ctx.bezierCurveTo(r*1.8,-r*.05,r*2.0,-r*.6,r*1.5,-r*.8);ctx.lineTo(r*1.4,-r*.55);
  ctx.bezierCurveTo(r*1.65,-r*.42,r*1.55,-r*.12,r*.9,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#222';ctx.lineWidth=1;ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(r*.95,-r*.08);ctx.bezierCurveTo(r*1.7,-r*.1,r*1.85,-r*.5,r*1.48,-r*.72);ctx.stroke();
  ctx.strokeStyle=d.wdrk;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(r*.9,0);ctx.bezierCurveTo(r*1.6,r*.05,r*1.7,-r*.3,r*1.3,-r*.65);ctx.stroke();
  ctx.strokeStyle='#443322';ctx.lineWidth=r*.04;
  for(let i=0;i<3;i++){const hx=r*(.65+i*.08);ctx.beginPath();ctx.moveTo(hx,-r*.07);ctx.lineTo(hx,r*.07);ctx.stroke();}
  const chainLinks=10;
  const chainReach=r*2.6;
  const swingPhase=Math.sin(t*5.5)*r*.38+Math.sin(t*2.2)*r*.14;
  const chainPts=[];
  for(let i=0;i<=chainLinks;i++){
   const prog=i/chainLinks;
   const cx=r*.8+prog*chainReach;
   const cy=swingPhase*prog*(1-prog*.3)+Math.sin(prog*Math.PI)*r*.12;
   chainPts.push({x:cx,y:cy});
  }
  for(let i=0;i<chainLinks;i++){
   const ax=chainPts[i].x,ay=chainPts[i].y;
   const bx2=chainPts[i+1].x,by2=chainPts[i+1].y;
   const ang=Math.atan2(by2-ay,bx2-ax);
   const mx=(ax+bx2)/2,my=(ay+by2)/2;
   ctx.save();ctx.translate(mx,my);ctx.rotate(ang);
   const isHoriz=i%2===0;
   const lw=isHoriz?r*.14:r*.06,lh=isHoriz?r*.06:r*.14;
   ctx.fillStyle=i%2===0?'#999':'#777';
   rrect(ctx,-lw/2,-lh/2,lw,lh,r*.025);ctx.fill();
   ctx.strokeStyle='#444';ctx.lineWidth=.8;ctx.stroke();
   ctx.restore();
  }
  const wx=chainPts[chainLinks].x,wy=chainPts[chainLinks].y;
  const wr=r*.22;
  ctx.save();ctx.translate(wx,wy);ctx.rotate(t*2.2);
  ctx.fillStyle='#777';
  ctx.beginPath();
  for(let i=0;i<6;i++){const ha=(i/6)*Math.PI*2-Math.PI/6;ctx.lineTo(Math.cos(ha)*wr,Math.sin(ha)*wr);}
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='#444';ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle='#444';ctx.beginPath();ctx.arc(0,0,wr*.38,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#666';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.arc(-wr*.25,-wr*.25,wr*.3,0,Math.PI*2);ctx.fill();
  ctx.restore();
  if(s&&s.blinking){
   ctx.shadowColor=d.rim;ctx.shadowBlur=20;
   ctx.strokeStyle=d.rim+'88';ctx.lineWidth=r*.18;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(chainPts[0].x,chainPts[0].y);
   for(let i=1;i<=chainLinks;i++)ctx.lineTo(chainPts[i].x,chainPts[i].y);
   ctx.stroke();
   ctx.strokeStyle=d.rim+'dd';ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(r*.9,0);ctx.bezierCurveTo(r*1.8,-r*.05,r*2.0,-r*.6,r*1.5,-r*.8);ctx.lineTo(r*1.4,-r*.55);ctx.bezierCurveTo(r*1.65,-r*.42,r*1.55,-r*.12,r*.9,0);ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 orbstaff(ctx,r,d,s){
  const t=Date.now()*.004;
  const ROD_COLORS=['#ffee00','#ff4400','#44aaff','#ffffff','#886633'];
  const ROD_SHAFT=['#5a4a10','#5a1a10','#103a5a','#3a3a3a','#3a2a10'];
  const rodActive=s&&s.rodActive;
  const rodIdx=s?s.rodType:0;
  const rodCol=rodActive?ROD_COLORS[rodIdx]:d.wcol;
  const shaftCol=rodActive?ROD_SHAFT[rodIdx]:'#4a2870';
  ctx.fillStyle=shaftCol;ctx.fillRect(r*.7,-r*.07,r*1.8,r*.14);
  ctx.fillStyle=rodActive?rodCol+'88':'#8855cc';ctx.fillRect(r*.7,-r*.07,r*1.8,r*.05);
  ctx.fillStyle=rodCol;
  ctx.beginPath();ctx.moveTo(r*2.5,-r*.3);ctx.lineTo(r*2.75,0);ctx.lineTo(r*2.5,r*.3);ctx.lineTo(r*2.35,0);ctx.closePath();ctx.fill();
  if(rodActive){ctx.shadowColor=rodCol;ctx.shadowBlur=10;ctx.strokeStyle=rodCol;ctx.lineWidth=1.5;
   ctx.beginPath();ctx.moveTo(r*2.5,-r*.3);ctx.lineTo(r*2.75,0);ctx.lineTo(r*2.5,r*.3);ctx.lineTo(r*2.35,0);ctx.closePath();ctx.stroke();ctx.shadowBlur=0;}
  const orbA=t*2.2,orbR=r*.55;
  const ox=r*1.5+Math.cos(orbA)*orbR,oy=Math.sin(orbA)*orbR*.6;
  const g=ctx.createRadialGradient(ox,oy,0,ox,oy,r*.28);
  g.addColorStop(0,'#fff');g.addColorStop(.4,rodCol);g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(ox,oy,r*.28,0,Math.PI*2);ctx.fill();
  const pulse=0.5+0.5*Math.sin(t*3);
  ctx.save();ctx.globalAlpha*=(.3+pulse*.5);
  ctx.strokeStyle=rodCol;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(ox,oy,r*(.18+pulse*.14),0,Math.PI*2);ctx.stroke();
  ctx.restore();
  if(rodActive&&s){
   const pct=Math.max(0,s.rodT/8.0);
   ctx.beginPath();ctx.arc(r*2.55,0,r*.38,0,Math.PI*2*pct);
   ctx.strokeStyle=rodCol;ctx.lineWidth=2.5;ctx.shadowColor=rodCol;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
  }
  if(s&&s.stacks>=4){
   ctx.shadowColor=rodCol;ctx.shadowBlur=18;
   ctx.beginPath();ctx.arc(ox,oy,r*.35,0,Math.PI*2);
   ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.stroke();ctx.shadowBlur=0;
  }
 },
 maul(ctx,r,d,s){
  const sL=r*1.5,sT=r*.12;
  ctx.fillStyle='#5a2010';ctx.fillRect(r*.6,-sT/2,sL,sT);
  ctx.fillStyle='#3a0808';ctx.fillRect(r*.6,sT*.1,sL,sT*.45);
  const hx=r*.6+sL;
  ctx.fillStyle=d.wcol;ctx.fillRect(hx,-r*.7,r*.85,r*1.4);
  ctx.fillStyle=d.wdrk;ctx.fillRect(hx,r*.1,r*.85,r*.6);
  ctx.fillStyle='#cc0000';
  ctx.beginPath();ctx.moveTo(hx+r*.2,r*.7);ctx.lineTo(hx+r*.24,r*.95);ctx.lineTo(hx+r*.16,r*.95);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(hx+r*.55,r*.7);ctx.lineTo(hx+r*.6,r*.88);ctx.lineTo(hx+r*.5,r*.88);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#600';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hx+r*.15,-r*.4);ctx.lineTo(hx+r*.3,-r*.1);ctx.lineTo(hx+r*.2,r*.1);ctx.stroke();
  ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.strokeRect(hx,-r*.7,r*.85,r*1.4);
  if(s&&s.orbitActive){
   ctx.shadowColor='#ff2200';ctx.shadowBlur=16;
   ctx.strokeStyle='rgba(255,30,0,.8)';ctx.lineWidth=3;ctx.strokeRect(hx-2,-r*.72,r*.89,r*1.44);
   ctx.shadowBlur=0;
  }
 },
 longbow(ctx,r,d,s){
  const bowX=r*.82,bowH=r*2.05;
  const princeSilver=s&&s.key==='prince';
  const drawPull=s&&s.drawCharge?s.drawCharge:0;
  const wood=princeSilver?'#eef7ff':'#7a4020';
  const woodDark=princeSilver?'#5f83b8':'#4a2410';
  const stringCol=princeSilver?'#ffffff':'#ddd';
  const accent=princeSilver?'#8bb7ff':'#88cc44';
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  if(princeSilver){ctx.shadowColor='#8bb7ff';ctx.shadowBlur=9;}
  // Thick readable bow limbs with darker backing so the silver bow stays visible.
  ctx.strokeStyle=woodDark;ctx.lineWidth=r*.18;
  ctx.beginPath();ctx.moveTo(bowX,-bowH/2);ctx.quadraticCurveTo(bowX+r*.68,0,bowX,bowH/2);ctx.stroke();
  ctx.strokeStyle=wood;ctx.lineWidth=r*.105;
  ctx.beginPath();ctx.moveTo(bowX,-bowH/2);ctx.quadraticCurveTo(bowX+r*.58,0,bowX,bowH/2);ctx.stroke();
  // Blue-silver caps and central grip make Prince's bow distinct from Ranger's.
  if(princeSilver){
   ctx.fillStyle='#1747b8';
   ctx.fillRect(bowX-r*.08,-bowH/2-r*.05,r*.18,r*.16);
   ctx.fillRect(bowX-r*.08,bowH/2-r*.11,r*.18,r*.16);
   ctx.fillStyle='#08205f';ctx.fillRect(bowX+r*.43,-r*.18,r*.2,r*.36);
   ctx.fillStyle='#8bb7ff';ctx.fillRect(bowX+r*.47,-r*.13,r*.12,r*.26);
  }
  ctx.strokeStyle=stringCol;ctx.lineWidth=princeSilver?r*.035:r*.025;
  ctx.beginPath();ctx.moveTo(bowX,-bowH/2);ctx.lineTo(bowX+r*(.08+drawPull*.18),0);ctx.lineTo(bowX,bowH/2);ctx.stroke();
  // Nocked arrow drawn forward from the grip/tip direction.
  const arrowLen=r*(1.25+drawPull*.35);
  ctx.fillStyle=princeSilver?'#d8e8ff':'#a06030';ctx.fillRect(bowX+r*.2,-r*.035,arrowLen,r*.07);
  ctx.fillStyle=princeSilver?'#ffffff':d.wcol;ctx.beginPath();ctx.moveTo(bowX+r*.2+arrowLen,-r*.12);ctx.lineTo(bowX+r*.2+arrowLen+r*.24,0);ctx.lineTo(bowX+r*.2+arrowLen,r*.12);ctx.closePath();ctx.fill();
  ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(bowX+r*.18,-r*.035);ctx.lineTo(bowX-r*.02,-r*.16);ctx.lineTo(bowX+r*.04,-r*.035);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(bowX+r*.18,r*.035);ctx.lineTo(bowX-r*.02,r*.16);ctx.lineTo(bowX+r*.04,r*.035);ctx.closePath();ctx.fill();
  if(princeSilver){
   ctx.strokeStyle='rgba(139,183,255,.65)';ctx.lineWidth=r*.025;ctx.setLineDash([r*.12,r*.08]);
   ctx.beginPath();ctx.moveTo(bowX+r*.22,-bowH*.36);ctx.quadraticCurveTo(bowX+r*.45,0,bowX+r*.22,bowH*.36);ctx.stroke();ctx.setLineDash([]);
  }
  if(s&&s.spreadActive){
   ctx.shadowColor='#88cc44';ctx.shadowBlur=12;
   for(let a=-0.3;a<=0.3;a+=0.3){
    ctx.save();ctx.rotate(a);
    ctx.strokeStyle='rgba(136,204,68,.7)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(bowX+r*.5,0);ctx.lineTo(bowX+r*1.8,0);ctx.stroke();
    ctx.restore();
   }
  }
  ctx.shadowBlur=0;ctx.restore();
 },
 warhammer(ctx,r,d,s){
  const sL=r*1.4,sT=r*.1;
  ctx.fillStyle='#8a6020';ctx.fillRect(r*.65,-sT/2,sL,sT);
  ctx.strokeStyle='#604010';ctx.lineWidth=r*.03;
  for(let i=0;i<5;i++)ctx.strokeRect(r*.68+i*sL*.18,-sT*.4,sL*.14,sT*.8);
  const hx=r*.65+sL;
  ctx.fillStyle=d.wcol;ctx.fillRect(hx-r*.08,-r*.55,r*.72,r*1.1);
  ctx.fillStyle=d.wdrk;ctx.fillRect(hx,-r*.55,r*.62,r*.25);
  ctx.strokeStyle='rgba(255,230,100,.8)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(hx+r*.25,-r*.3);ctx.lineTo(hx+r*.25,r*.3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hx+r*.1,0);ctx.lineTo(hx+r*.4,0);ctx.stroke();
  ctx.strokeStyle='#444';ctx.lineWidth=1.5;ctx.strokeRect(hx-r*.08,-r*.55,r*.72,r*1.1);
  if(s&&s.slowFieldActive){
   const g=ctx.createRadialGradient(0,0,0,0,0,r*2.5);
   g.addColorStop(0,'rgba(255,230,80,.18)');g.addColorStop(1,'transparent');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*2.5,0,Math.PI*2);ctx.fill();
  }
 },
 daggers(ctx,r,d,s){
  // Blade length derived from reach so visual tip matches hitbox
  const reach=d.reach||1.5;
  // tip lands at r*(guard + L + point) = r*reach  →  L = r*(reach - 1.09 - 0.2)
  const L=Math.max(r*0.3, r*(reach-1.09-0.20));
  const th=r*.09;
  for(const pass of[0,1]){
   ctx.save();
   if(pass===1)ctx.rotate(Math.PI);
   ctx.fillStyle='#334';ctx.fillRect(r*.75,-r*.12,r*.22,r*.24);
   ctx.fillStyle='#c0a060';for(let i=0;i<3;i++)ctx.fillRect(r*.77+i*r*.06,-r*.11,r*.03,r*.22);
   ctx.fillStyle='#778';ctx.fillRect(r*.97,-r*.06,r*.12,r*.12);
   ctx.fillStyle=d.wcol;ctx.fillRect(r*1.09,-th/2,L,th);
   ctx.fillStyle=d.wdrk;ctx.fillRect(r*1.09,th*.1,L*.9,th*.4);
   ctx.fillStyle=d.wcol;ctx.beginPath();ctx.moveTo(r*1.09+L,-th/2);ctx.lineTo(r*1.09+L+r*.2,0);ctx.lineTo(r*1.09+L,th/2);ctx.closePath();ctx.fill();
   if(s&&s.backstabCharged){
    ctx.shadowColor='#e74c3c';ctx.shadowBlur=12;
    ctx.fillStyle='rgba(231,76,60,.6)';ctx.beginPath();ctx.ellipse(r*1.09+L*.5,0,L*.5,th*1.4,0,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
   }
   ctx.restore();
  }
 },
 halberd(ctx,r,d,s){
  const sL=r*2.6,sT=r*.09;
  ctx.fillStyle='#5a3010';ctx.fillRect(r*.65,-sT/2,sL,sT);
  ctx.fillStyle='#3a1808';ctx.fillRect(r*.65,sT*.1,sL,sT*.4);
  const hx=r*.65+sL;
  ctx.fillStyle=d.wcol;ctx.beginPath();ctx.moveTo(hx,-r*.18);ctx.lineTo(hx+r*.35,-r*.8);ctx.lineTo(hx+r*.28,-r*.18);ctx.closePath();ctx.fill();
  ctx.fillStyle=d.wcol;
  ctx.beginPath();ctx.moveTo(hx,-r*.18);ctx.bezierCurveTo(hx+r*.7,-r*.15,hx+r*.75,r*.3,hx,r*.5);ctx.lineTo(hx,r*.1);ctx.bezierCurveTo(hx+r*.35,r*.05,hx+r*.35,-r*.1,hx,-r*.18);ctx.closePath();ctx.fill();
  ctx.fillStyle=d.wdrk;ctx.beginPath();ctx.moveTo(hx,0);ctx.bezierCurveTo(hx+r*.7,r*.05,hx+r*.75,r*.3,hx,r*.5);ctx.lineTo(hx,r*.1);ctx.bezierCurveTo(hx+r*.3,r*.05,hx+r*.25,r*.05,hx,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#222';ctx.lineWidth=1.3;
  ctx.beginPath();ctx.moveTo(hx,-r*.18);ctx.bezierCurveTo(hx+r*.7,-r*.15,hx+r*.75,r*.3,hx,r*.5);ctx.stroke();
  if(s&&s.stacks>=5){
   ctx.shadowColor=d.rim;ctx.shadowBlur=14;
   ctx.strokeStyle=d.rim;ctx.lineWidth=1.8;
   ctx.beginPath();ctx.moveTo(hx,-r*.18);ctx.bezierCurveTo(hx+r*.7,-r*.15,hx+r*.75,r*.3,hx,r*.5);ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 thornwhip(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const segs=10;
  const whipLen=r*3.4;
  const crackWave=Math.sin(t*8)*r*.55;
  const crackPhase=Math.cos(t*4.5)*r*.18;
  const vinePts=[];
  for(let i=0;i<=segs;i++){
   const prog=i/segs;
   const vx=r*.75+prog*whipLen;
   const vy=crackWave*prog*(0.5+prog*.5)+crackPhase*(1-prog)*prog*2;
   vinePts.push({x:vx,y:vy});
  }
  ctx.lineCap='round';ctx.lineJoin='round';
  for(let i=0;i<segs;i++){
   const prog=i/segs;
   const thickness=r*(.14-prog*.09); // tapers from .14r to .05r
   const green=Math.round(180-prog*60);
   ctx.strokeStyle=`rgb(30,${green},40)`;
   ctx.lineWidth=Math.max(1.5,thickness);
   ctx.beginPath();ctx.moveTo(vinePts[i].x,vinePts[i].y);ctx.lineTo(vinePts[i+1].x,vinePts[i+1].y);ctx.stroke();
   ctx.strokeStyle=`rgba(105,240,174,${0.22-prog*.18})`;
   ctx.lineWidth=Math.max(.8,thickness*.4);
   ctx.beginPath();ctx.moveTo(vinePts[i].x,vinePts[i].y-thickness*.3);ctx.lineTo(vinePts[i+1].x,vinePts[i+1].y-thickness*.3);ctx.stroke();
  }
  ctx.fillStyle='#1a4a10';ctx.beginPath();ctx.arc(r*.78,0,r*.1,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#0d2a08';ctx.lineWidth=1;ctx.stroke();
  for(let i=1;i<segs;i++){
   const prog=i/segs;
   const px=vinePts[i].x,py=vinePts[i].y;
   const thornLen=r*(.18-prog*.1);
   const thornBase=r*(.05-prog*.025);
   if(thornLen<1.5)continue;
   const dx=vinePts[i+1<segs?i+1:i].x-vinePts[i-1].x;
   const dy=vinePts[i+1<segs?i+1:i].y-vinePts[i-1].y;
   const tang=Math.atan2(dy,dx);
   for(const side of[1,-1]){
    ctx.save();ctx.translate(px,py);ctx.rotate(tang);
    const wobble=Math.sin(t*6+i*1.2)*0.15*side;
    ctx.rotate(wobble);
    ctx.fillStyle=i%3===0?'#2a8a30':'#1a5a18';
    ctx.beginPath();
    ctx.moveTo(0,side*thornBase);
    ctx.lineTo(thornLen,0);
    ctx.lineTo(0,-side*thornBase);
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='#0d3010';ctx.lineWidth=.7;ctx.stroke();
    ctx.restore();
   }
  }
  const tipX=vinePts[segs].x,tipY=vinePts[segs].y;
  const tipPulse=0.55+0.45*Math.sin(t*9);
  const tipR2=r*(.14+tipPulse*.06);
  const hg=ctx.createRadialGradient(tipX,tipY,0,tipX,tipY,tipR2*3.2);
  hg.addColorStop(0,d.rim+'cc');hg.addColorStop(0.4,d.rim+'55');hg.addColorStop(1,'transparent');
  ctx.fillStyle=hg;ctx.beginPath();ctx.arc(tipX,tipY,tipR2*3.2,0,Math.PI*2);ctx.fill();
  const cg=ctx.createRadialGradient(tipX-tipR2*.2,tipY-tipR2*.2,0,tipX,tipY,tipR2);
  cg.addColorStop(0,'#fff');cg.addColorStop(0.3,d.rim);cg.addColorStop(1,d.wdrk);
  ctx.fillStyle=cg;ctx.beginPath();ctx.arc(tipX,tipY,tipR2,0,Math.PI*2);ctx.fill();
  if(s&&s.snareActive){
   ctx.shadowColor=d.rim;ctx.shadowBlur=14;
   ctx.strokeStyle=d.rim;ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(tipX,tipY,tipR2+r*.1,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 scythe(ctx,r,d,s){
  const hL=r*1.6,hT=r*.08; // shortened staff (was r*2.4)
  ctx.fillStyle='#d0c8a0';ctx.fillRect(r*.6,-hT/2,hL,hT);
  ctx.fillStyle='#b0a880';ctx.fillRect(r*.6,hT*.1,hL,hT*.35);
  ctx.fillStyle='#c8c0a0';ctx.beginPath();ctx.arc(r*.6,0,r*.18,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#222';ctx.beginPath();ctx.arc(r*.55,0,r*.06,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(r*.65,0,r*.06,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=d.wcol;
  ctx.beginPath();ctx.moveTo(r*.6+hL,-r*.12);
  ctx.bezierCurveTo(r*.6+hL+r*.5,-r*.5,r*.6+hL+r*.4,-r*1.1,r*.6+hL-r*.1,-r*1.0);
  ctx.lineTo(r*.6+hL-r*.15,-r*.7);
  ctx.bezierCurveTo(r*.6+hL+r*.15,-r*.75,r*.6+hL+r*.22,-r*.4,r*.6+hL,-r*.12);
  ctx.closePath();ctx.fill();
  ctx.fillStyle=d.wdrk;
  ctx.beginPath();ctx.moveTo(r*.6+hL,-r*.12);ctx.bezierCurveTo(r*.6+hL+r*.22,-r*.3,r*.6+hL+r*.2,-r*.65,r*.6+hL-r*.12,-r*.7);ctx.lineTo(r*.6+hL-r*.15,-r*.7);ctx.bezierCurveTo(r*.6+hL+r*.15,-r*.75,r*.6+hL+r*.22,-r*.4,r*.6+hL,-r*.12);ctx.closePath();ctx.fill();
  if(s){const t2=Date.now()*.003;['rgba(124,77,255,.6)','rgba(180,130,255,.4)'].forEach((c,i)=>{
   ctx.fillStyle=c;ctx.beginPath();ctx.arc(r*.6+hL+Math.cos(t2*2+i*Math.PI)*r*.35,(-r*.6)+Math.sin(t2*1.5+i*Math.PI)*r*.25,r*.1,0,Math.PI*2);ctx.fill();});}
 },
 cutlass(ctx,r,d,s){
  ctx.strokeStyle='#c08020';ctx.lineWidth=r*.06;
  ctx.beginPath();ctx.arc(r*.88,0,r*.28,Math.PI*.2,Math.PI*1.1);ctx.stroke();
  ctx.beginPath();ctx.arc(r*.88,0,r*.28,Math.PI*1.7,Math.PI*2.05);ctx.stroke();
  ctx.strokeStyle=d.wcol;ctx.lineWidth=r*.05;
  ctx.beginPath();ctx.moveTo(r*.62,-r*.2);ctx.lineTo(r*.62,r*.2);ctx.stroke();
  ctx.fillStyle=d.wcol;
  ctx.beginPath();ctx.moveTo(r*1.16,-r*.09);
  ctx.bezierCurveTo(r*2.2,-r*.25,r*3.0,-r*.35,r*3.5,-r*.05);
  ctx.lineTo(r*3.5,r*.05);
  ctx.bezierCurveTo(r*3.0,r*.08,r*2.2,r*.0,r*1.16,r*.09);
  ctx.closePath();ctx.fill();
  ctx.fillStyle=d.wdrk;
  ctx.beginPath();ctx.moveTo(r*1.16,-r*.09);ctx.bezierCurveTo(r*2.2,-r*.2,r*3.0,-r*.25,r*3.5,-r*.05);ctx.lineTo(r*3.5,r*.0);ctx.bezierCurveTo(r*3.0,-r*.08,r*2.2,-r*.08,r*1.16,-r*.01);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#334';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(r*1.16,-r*.09);ctx.bezierCurveTo(r*2.2,-r*.25,r*3.0,-r*.35,r*3.5,-r*.05);ctx.stroke();
  if(s&&s.draining){
   ctx.shadowColor='#ff4400';ctx.shadowBlur=10;
   ctx.strokeStyle='rgba(255,100,0,.7)';ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(r*1.16,-r*.09);ctx.bezierCurveTo(r*2.2,-r*.25,r*3.0,-r*.35,r*3.5,-r*.05);ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 jingleflail(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const omegaAbs=s?Math.abs(s.omegaCur):1;
  for(const[side,rimCol,chainCol]of[[1,'#e91e63','#ff80aa'],[-1,'#ffd740','#ffe066']]){
   const links=6;
   const ribLen=r*1.9;
   const swingScale=Math.min(1.5,omegaAbs/8);
   const swing=Math.sin(t*8+side*Math.PI*0.6)*r*.52*side*swingScale;
   const swingDrift=Math.cos(t*3.5+side)*r*.1*side;
   const linkPts=[];
   for(let i=0;i<=links;i++){
    const prog=i/links;
    const lx=r*.8+prog*ribLen;
    const ly=swing*prog+swingDrift*prog*(1-prog)*2;
    linkPts.push({x:lx,y:ly});
   }
   for(let i=0;i<links;i++){
    const ax=linkPts[i].x,ay=linkPts[i].y;
    const bx2=linkPts[i+1].x,by2=linkPts[i+1].y;
    const ang=Math.atan2(by2-ay,bx2-ax);
    const mx=(ax+bx2)/2,my=(ay+by2)/2;
    ctx.save();ctx.translate(mx,my);ctx.rotate(ang);
    const isHoriz=i%2===0;
    const lw=isHoriz?r*.12:r*.055,lh=isHoriz?r*.055:r*.12;
    ctx.fillStyle=isHoriz?'#aaa':'#888';
    ctx.strokeStyle='#555';ctx.lineWidth=.8;
    rrect(ctx,-lw/2,-lh/2,lw,lh,r*.02);ctx.fill();ctx.stroke();
    ctx.restore();
   }
   const bx=linkPts[links].x,by=linkPts[links].y;
   const lastSeg=linkPts[links-1];
   const bellAng=Math.atan2(by-lastSeg.y,bx-lastSeg.x)+Math.PI/2;
   ctx.save();ctx.translate(bx,by);ctx.rotate(bellAng);
   const bR=r*.24;
   ctx.fillStyle=d.wcol;
   ctx.beginPath();
   ctx.moveTo(-bR*.55,bR*.1);
   ctx.bezierCurveTo(-bR*.55,-bR*.5,-bR*.22,-bR*.88,0,-bR*.9);
   ctx.bezierCurveTo(bR*.22,-bR*.88,bR*.55,-bR*.5,bR*.55,bR*.1);
   ctx.bezierCurveTo(bR*.65,bR*.45,bR*.45,bR*.65,0,bR*.68);
   ctx.bezierCurveTo(-bR*.45,bR*.65,-bR*.65,bR*.45,-bR*.55,bR*.1);
   ctx.closePath();ctx.fill();
   ctx.fillStyle=d.wdrk;
   ctx.beginPath();
   ctx.moveTo(bR*.05,bR*.1);
   ctx.bezierCurveTo(bR*.05,-bR*.5,bR*.22,-bR*.85,bR*.0,-bR*.88);
   ctx.bezierCurveTo(bR*.22,-bR*.86,bR*.52,-bR*.48,bR*.52,bR*.1);
   ctx.bezierCurveTo(bR*.62,bR*.42,bR*.43,bR*.62,0,bR*.65);
   ctx.closePath();ctx.fill();
   ctx.strokeStyle=rimCol;ctx.lineWidth=r*.04;
   ctx.beginPath();ctx.moveTo(-bR*.58,bR*.12);ctx.bezierCurveTo(-bR*.65,bR*.48,bR*.65,bR*.48,bR*.58,bR*.12);ctx.stroke();
   ctx.strokeStyle='#333';ctx.lineWidth=1;
   ctx.beginPath();
   ctx.moveTo(-bR*.55,bR*.1);ctx.bezierCurveTo(-bR*.55,-bR*.5,-bR*.22,-bR*.88,0,-bR*.9);
   ctx.bezierCurveTo(bR*.22,-bR*.88,bR*.55,-bR*.5,bR*.55,bR*.1);
   ctx.bezierCurveTo(bR*.65,bR*.45,bR*.45,bR*.65,0,bR*.68);
   ctx.bezierCurveTo(-bR*.45,bR*.65,-bR*.65,bR*.45,-bR*.55,bR*.1);ctx.stroke();
   const clapperSwing=Math.sin(t*9+side*Math.PI*.6)*bR*.28*swingScale;
   ctx.fillStyle='#666';ctx.beginPath();ctx.arc(clapperSwing,bR*.35,bR*.12,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#888';ctx.lineWidth=.8;ctx.stroke();
   ctx.strokeStyle='#555';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(0,-bR*.3);ctx.lineTo(clapperSwing,bR*.23);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.28)';
   ctx.beginPath();ctx.ellipse(-bR*.18,-bR*.45,bR*.12,bR*.22,-.4,0,Math.PI*2);ctx.fill();
   ctx.restore();
   if(omegaAbs>9&&Math.abs(Math.cos(t*8+side*Math.PI*0.6))<0.08){
    for(let k=0;k<3;k++){
     const sa=Math.random()*Math.PI*2,sl=r*(.3+Math.random()*.3);
     ctx.fillStyle=rimCol;
     ctx.beginPath();ctx.arc(bx+Math.cos(sa)*sl,by+Math.sin(sa)*sl,r*.04,0,Math.PI*2);ctx.fill();
    }
   }
  }
  ctx.fillStyle='#2a1808';ctx.fillRect(r*.6,-r*.07,r*.22,r*.14);
  ctx.fillStyle='#5a3010';ctx.fillRect(r*.62,-r*.05,r*.18,r*.04);
 },
 stoneslab(ctx,r,d,s){
  const sw=r*.95,sh=r*1.75,sx=r*.62;
  ctx.fillStyle='#4a5a66';ctx.fillRect(sx,-sh/2,sw,sh);
  ctx.fillStyle='#374450';ctx.fillRect(sx,sh*.1,sw,sh*.35);
  ctx.fillStyle=d.wdrk;ctx.fillRect(sx+sw*.08,-sh*.45,sw*.84,sh*.9);
  ctx.strokeStyle='rgba(176,190,197,.5)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(sx+sw*.25,-sh*.3);ctx.lineTo(sx+sw*.25,sh*.3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(sx+sw*.55,-sh*.3);ctx.lineTo(sx+sw*.55,sh*.3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(sx+sw*.12,0);ctx.lineTo(sx+sw*.88,0);ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(sx+sw*.4,-sh*.4);ctx.lineTo(sx+sw*.5,-sh*.1);ctx.lineTo(sx+sw*.35,sh*.2);ctx.stroke();
  ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.strokeRect(sx,-sh/2,sw,sh);
  if(s&&s.fortified){ctx.shadowColor=d.rim;ctx.shadowBlur=12;ctx.strokeStyle='rgba(176,190,197,.8)';ctx.lineWidth=3.5;ctx.strokeRect(sx-3,-sh/2-3,sw+6,sh+6);ctx.shadowBlur=0;}
 },
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
 towershield(ctx,r,d,s){
  const sw=r*.85,sh=r*1.9,sx=r*.72;
  ctx.fillStyle=d.wcol;
  ctx.beginPath();ctx.moveTo(sx,0);ctx.lineTo(sx,-sh*.48);ctx.lineTo(sx+sw,-sh*.48);ctx.lineTo(sx+sw,sh*.38);ctx.lineTo(sx+sw*.5,sh*.52);ctx.lineTo(sx,sh*.38);ctx.closePath();ctx.fill();
  ctx.fillStyle=d.wdrk;
  ctx.beginPath();ctx.moveTo(sx+sw,sh*.02);ctx.lineTo(sx+sw,sh*.38);ctx.lineTo(sx+sw*.5,sh*.52);ctx.lineTo(sx,sh*.38);ctx.closePath();ctx.fill();
  ctx.fillStyle=d.rim;ctx.fillRect(sx+sw*.38,-sh*.35,sw*.24,sh*.7);ctx.fillRect(sx+sw*.08,-sh*.05,sw*.84,sh*.18);
  ctx.strokeStyle='#334';ctx.lineWidth=1.8;
  ctx.beginPath();ctx.moveTo(sx,0);ctx.lineTo(sx,-sh*.48);ctx.lineTo(sx+sw,-sh*.48);ctx.lineTo(sx+sw,sh*.38);ctx.lineTo(sx+sw*.5,sh*.52);ctx.lineTo(sx,sh*.38);ctx.closePath();ctx.stroke();
  if(s&&s.phalanxActive){ctx.shadowColor=d.rim;ctx.shadowBlur=12;ctx.strokeStyle='rgba(128,203,196,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx-2,-sh*.5);ctx.lineTo(sx+sw+2,-sh*.5);ctx.lineTo(sx+sw+2,sh*.4);ctx.lineTo(sx+sw*.5,sh*.55);ctx.lineTo(sx-2,sh*.4);ctx.closePath();ctx.stroke();ctx.shadowBlur=0;}
 },
 illusoryblade(ctx,r,d,s){
  const t=Date.now()*.003;
  const L=r*2.8,th=r*.08;
  const ghostOff=Math.sin(t*2)*r*.18;
  ctx.save();ctx.globalAlpha=0.32;ctx.translate(0,ghostOff);
  ctx.fillStyle=d.wcol;ctx.fillRect(r*.88,-th/2,L,th);
  ctx.fillStyle=d.wdrk;ctx.fillRect(r*.88+L,-th/2,r*.28,th);
  ctx.restore();
  ctx.fillStyle=d.wcol;ctx.fillRect(r*.88,-th/2,L,th);
  ctx.fillStyle='rgba(255,255,255,.38)';ctx.fillRect(r*.88,-th*.45,L*.7,th*.22);
  ctx.fillStyle=d.wdrk;ctx.fillRect(r*.88+L,-th/2,r*.28,th);
  const shimmerX=r*.88+L*(((t*.4)%1));
  ctx.fillStyle=d.rim;ctx.beginPath();ctx.arc(shimmerX,0,r*.07,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#224';ctx.lineWidth=1;ctx.strokeRect(r*.88,-th/2,L,th);
  if(s&&s.phaseOut){ctx.save();ctx.globalAlpha=0.38;ctx.fillStyle=d.rim;ctx.fillRect(r*.88,-th/2,L,th);ctx.restore();}
 },
 magnum(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const switching=s&&s.sheriffSwitching;
  if(switching){
   ctx.fillStyle='#5a3410';
   ctx.beginPath();
   ctx.moveTo(r*.58, r*.04);
   ctx.bezierCurveTo(r*.48,r*.06,r*.44,r*.18,r*.52,r*.28);
   ctx.lineTo(r*.72,r*.28);ctx.lineTo(r*.82,r*.16);ctx.lineTo(r*.82,-r*.06);
   ctx.lineTo(r*.58,-r*.06);ctx.closePath();ctx.fill();
   ctx.strokeStyle='#3a2008';ctx.lineWidth=r*.02;
   for(let i=0;i<3;i++){const gx=r*(.56+i*.08);ctx.beginPath();ctx.moveTo(gx,-r*.04);ctx.lineTo(gx+r*.04,r*.24);ctx.stroke();}
   ctx.fillStyle='#7a4a20';ctx.beginPath();ctx.moveTo(r*.58,-r*.04);ctx.lineTo(r*.60,r*.16);ctx.lineTo(r*.62,-r*.04);ctx.closePath();ctx.fill();
   ctx.fillStyle='#a0a0a8';ctx.fillRect(r*.80,-r*.13,r*.48,r*.28);
   ctx.fillStyle='#707078';ctx.fillRect(r*.80,r*.08,r*.48,r*.1);
   ctx.fillStyle='#484850';ctx.fillRect(r*.88,-r*.04,r*.28,r*.1);
   ctx.strokeStyle='#c0c0c8';ctx.lineWidth=r*.055;ctx.lineCap='round';
   ctx.beginPath();ctx.arc(r*.96,r*.1,r*.12,-Math.PI*.08,Math.PI*.82);ctx.stroke();
   ctx.fillStyle='#888890';ctx.fillRect(r*1.28,-r*.13,r*1.5,r*.26);
   ctx.fillStyle='#606068';ctx.fillRect(r*1.28,-r*.01,r*1.5,r*.03);
   ctx.fillStyle='#d0d0d8';ctx.fillRect(r*1.28,-r*.13,r*1.5,r*.05);
   ctx.fillStyle='#606068';ctx.fillRect(r*1.28,r*.09,r*1.5,r*.04);
   ctx.fillStyle='#5a3410';ctx.fillRect(r*1.42,-r*.19,r*.7,r*.09);
   ctx.strokeStyle='#3a2008';ctx.lineWidth=r*.02;
   for(let i=0;i<4;i++){const px=r*(1.46+i*.14);ctx.beginPath();ctx.moveTo(px,-r*.18);ctx.lineTo(px,-r*.11);ctx.stroke();}
   ctx.fillStyle='#707078';ctx.fillRect(r*2.74,-r*.13,r*.08,r*.26);
   ctx.fillStyle='#1a1820';
   ctx.beginPath();ctx.ellipse(r*2.78,-r*.065,r*.045,r*.045,0,0,Math.PI*2);ctx.fill();
   ctx.beginPath();ctx.ellipse(r*2.78,r*.065,r*.045,r*.045,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#d0c070';ctx.beginPath();ctx.arc(r*2.72,0,r*.03,0,Math.PI*2);ctx.fill();
   const pulse=0.6+0.4*Math.sin(t*20);
   ctx.shadowColor='#c8b840';ctx.shadowBlur=8;
   ctx.strokeStyle=`rgba(200,184,64,${pulse*0.7})`;ctx.lineWidth=1.5;
   ctx.strokeRect(r*.88,-r*.04,r*.28,r*.1);
   ctx.shadowBlur=0;
  } else {
   ctx.fillStyle='#3a2008';
   ctx.beginPath();
   ctx.moveTo(r*.60,-r*.10);
   ctx.bezierCurveTo(r*.55,-r*.10,r*.52,r*.04,r*.54,r*.18);
   ctx.bezierCurveTo(r*.56,r*.28,r*.62,r*.30,r*.68,r*.28);
   ctx.lineTo(r*.82,r*.28);ctx.lineTo(r*.82,r*.16);ctx.lineTo(r*.82,-r*.10);
   ctx.closePath();ctx.fill();
   ctx.fillStyle='#5a2a0a';ctx.beginPath();
   ctx.moveTo(r*.60,-r*.08);ctx.bezierCurveTo(r*.56,-r*.08,r*.54,r*.04,r*.56,r*.16);
   ctx.lineTo(r*.68,r*.16);ctx.lineTo(r*.68,-r*.08);ctx.closePath();ctx.fill();
   ctx.strokeStyle='#2a1204';ctx.lineWidth=r*.018;
   for(let i=0;i<4;i++){const gy=r*(-.06+i*.055);ctx.beginPath();ctx.moveTo(r*.57,gy);ctx.lineTo(r*.67,gy);ctx.stroke();}
   ctx.fillStyle='#b8b8c0';ctx.fillRect(r*.60,r*.24,r*.22,r*.05);
   ctx.fillStyle='#a8a8b0';ctx.fillRect(r*.78,-r*.11,r*.62,r*.22);
   ctx.fillStyle='#707078';ctx.fillRect(r*.78,r*.06,r*.62,r*.09);
   ctx.strokeStyle='#888890';ctx.lineWidth=r*.018;
   ctx.strokeRect(r*.84,-r*.08,r*.48,r*.18);
   ctx.fillStyle='#888890';
   ctx.beginPath();ctx.moveTo(r*.80,-r*.11);ctx.lineTo(r*.72,-r*.20);ctx.lineTo(r*.78,-r*.20);ctx.lineTo(r*.84,-r*.11);ctx.closePath();ctx.fill();
   ctx.fillStyle='#606068';ctx.fillRect(r*.73,-r*.20,r*.05,r*.04);
   ctx.strokeStyle='#c0c0c8';ctx.lineWidth=r*.07;ctx.lineCap='round';
   ctx.beginPath();ctx.arc(r*.92,r*.09,r*.13,-Math.PI*.12,Math.PI*.85);ctx.stroke();
   ctx.strokeStyle='#a8a8b0';ctx.lineWidth=r*.04;
   ctx.beginPath();ctx.moveTo(r*.92,r*.04);ctx.lineTo(r*.95,r*.14);ctx.stroke();
   const cxOff=r*1.02,cyOff=0,cylR=r*.16;
   ctx.fillStyle='#b8b8c0';ctx.beginPath();
   ctx.arc(cxOff,cyOff,cylR,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#808088';ctx.lineWidth=1.2;ctx.stroke();
   for(let i=0;i<6;i++){
    const a=(i/6)*Math.PI*2+(Math.PI/6);
    ctx.strokeStyle='#686870';ctx.lineWidth=r*.04;
    ctx.beginPath();ctx.moveTo(cxOff+Math.cos(a)*cylR*.62,cyOff+Math.sin(a)*cylR*.62);
    ctx.lineTo(cxOff+Math.cos(a)*cylR*.94,cyOff+Math.sin(a)*cylR*.94);ctx.stroke();
   }
   for(let i=0;i<6;i++){
    const a=(i/6)*Math.PI*2+(s?s.cylinderRot||0:0);
    ctx.fillStyle=i<(s?s.sheriffCylinder||0:6)?'#1a1820':'#3a3840';
    ctx.beginPath();ctx.arc(cxOff+Math.cos(a)*cylR*.55,cyOff+Math.sin(a)*cylR*.55,r*.04,0,Math.PI*2);ctx.fill();
   }
   ctx.strokeStyle='#909098';ctx.lineWidth=r*.04;
   ctx.beginPath();ctx.moveTo(r*.84,cyOff);ctx.lineTo(cxOff-cylR*.9,cyOff);ctx.stroke();
   ctx.fillStyle='#a0a0a8';ctx.fillRect(r*1.18,-r*.075,r*1.28,r*.15);
   ctx.fillStyle='#d0d0d8';ctx.fillRect(r*1.18,-r*.075,r*1.28,r*.04); // top shine
   ctx.fillStyle='#686870';ctx.fillRect(r*1.18,r*.05,r*1.28,r*.04);   // bottom shadow
   ctx.fillStyle='#c0c0c8';ctx.fillRect(r*1.18,-r*.085,r*1.28,r*.015);
   ctx.fillStyle='#888890';ctx.fillRect(r*1.22,r*.075,r*1.0,r*.055);
   ctx.fillStyle='#686870';ctx.fillRect(r*1.22,r*.11,r*1.0,r*.02);
   ctx.fillStyle='#a0a0a8';ctx.fillRect(r*1.24,r*.09,r*.72,r*.06);
   ctx.fillStyle='#d8d8e0';ctx.fillRect(r*1.26,r*.09,r*.68,r*.02);
   ctx.fillStyle='#808088';ctx.fillRect(r*2.42,-r*.085,r*.14,r*.17);
   ctx.fillStyle='#1a1820';ctx.beginPath();ctx.arc(r*2.46,r*.005,r*.055,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#686870';
   for(let i=0;i<3;i++){ctx.fillRect(r*(2.22+i*.06),-r*.085,r*.035,r*.04);}
   ctx.fillStyle='#d0c070';ctx.fillRect(r*2.40,-r*.09,r*.04,r*.02);
   ctx.fillStyle='#404048';ctx.fillRect(r*1.22,-r*.09,r*.06,r*.025);
   ctx.fillStyle='#d0c070';ctx.fillRect(r*1.245,-r*.09,r*.01,r*.025);
   if(s&&s.sheriffReloading){
    const pulse=0.5+0.5*Math.sin(t*30);
    ctx.strokeStyle=`rgba(212,168,58,${pulse})`;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(cxOff,cyOff,cylR+r*.05,0,Math.PI*2);ctx.stroke();
    const smokePhase=(t*1.2)%1;
    for(let i=0;i<3;i++){
     const sp=(smokePhase+i*0.33)%1;
     const sx=cxOff+Math.cos(Math.PI*0.5+i*0.4)*cylR;
     const sy=cyOff+Math.sin(Math.PI*0.5+i*0.4)*cylR;
     const sr=r*(0.1+sp*0.22);
     const sa=Math.max(0,0.22-sp*0.22);
     ctx.save();ctx.globalAlpha=sa;
     const sg=ctx.createRadialGradient(sx,sy-sp*r*.3,0,sx,sy-sp*r*.3,sr);
     sg.addColorStop(0,'rgba(220,215,200,.9)');sg.addColorStop(1,'transparent');
     ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy-sp*r*.3,sr,0,Math.PI*2);ctx.fill();
     ctx.restore();
    }
   }
   if(s&&s.sheriffHitCount>=1){
    const pulse2=0.5+0.5*Math.sin(t*8);
    ctx.shadowColor='#d4a83a';ctx.shadowBlur=8;
    ctx.strokeStyle=`rgba(212,168,58,${0.6+pulse2*.4})`;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(cxOff,cyOff,cylR+r*.07,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
   }
  }
 },
 censer(ctx,r,d,s){  const t=s?s.abTimer:0;
  const chainLen=r*2.6;
  const swing=Math.sin(t*4.5)*r*0.55;
  const links=8;
  const pts=[];
  for(let i=0;i<=links;i++){
   const prog=i/links;
   pts.push({x:r*0.75+prog*chainLen, y:swing*prog*(1-prog*0.3)});
  }
  for(let i=0;i<links;i++){
   const ax=pts[i].x,ay=pts[i].y,bx=pts[i+1].x,by=pts[i+1].y;
   const ang=Math.atan2(by-ay,bx-ax);
   const mx=(ax+bx)/2,my=(ay+by)/2;
   ctx.save();ctx.translate(mx,my);ctx.rotate(ang);
   const isH=i%2===0;
   ctx.strokeStyle=i%2===0?'#d4c880':'#c8b860';ctx.lineWidth=r*0.045;ctx.lineCap='round';
   ctx.beginPath();ctx.ellipse(0,0,isH?r*0.11:r*0.045,isH?r*0.045:r*0.11,0,0,Math.PI*2);ctx.stroke();
   ctx.restore();
  }
  ctx.fillStyle='#8a7040';ctx.fillRect(r*0.58,-r*0.06,r*0.2,r*0.12);
  ctx.fillStyle='#c8a860';ctx.fillRect(r*0.60,-r*0.04,r*0.16,r*0.04);
  const cx=pts[links].x,cy=pts[links].y;
  const cr=r*0.3;
  ctx.save();ctx.translate(cx,cy);
  ctx.strokeStyle='#d4c070';ctx.lineWidth=r*0.055;
  ctx.beginPath();ctx.arc(0,0,cr+r*0.06,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#b09040';
  ctx.beginPath();
  for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2+(t*1.5);ctx.lineTo(Math.cos(a)*cr,Math.sin(a)*cr);}
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='#888040';ctx.lineWidth=1;ctx.stroke();
  const glow=0.5+0.5*Math.sin(t*6);
  const g=ctx.createRadialGradient(0,0,0,0,0,cr);
  g.addColorStop(0,`rgba(255,240,140,${0.7+glow*0.3})`);
  g.addColorStop(0.5,`rgba(220,180,60,${0.4+glow*0.2})`);
  g.addColorStop(1,'rgba(180,140,20,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,cr,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=`rgba(255,250,200,${0.5+glow*0.3})`;
  for(let i=0;i<3;i++){const a=(i/3)*Math.PI*2+(t*2);ctx.beginPath();ctx.arc(Math.cos(a)*cr*0.5,Math.sin(a)*cr*0.5,r*0.05,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='rgba(255,255,255,0.25)';ctx.beginPath();ctx.ellipse(-cr*0.25,-cr*0.3,cr*0.22,cr*0.14,Math.PI*0.3,0,Math.PI*2);ctx.fill();
  const smokeT=(t*0.65)%1;
  for(let i=0;i<6;i++){
   const phase=(smokeT+i*(1/6))%1;
   const sy=-cr*(0.7+phase*2.8);
   const swayDir=(i%2===0)?1:-1;
   const sx=Math.sin(phase*Math.PI*2.5+i*1.1)*cr*0.55*swayDir;
   const sa=Math.max(0,Math.sin(phase*Math.PI)*0.38);
   const sz=cr*(0.12+phase*0.52);
   if(sz<=0||sa<=0)continue;
   ctx.save();ctx.globalAlpha=sa;
   const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,sz);
   sg.addColorStop(0,'rgba(255,255,255,1)');
   sg.addColorStop(0.35,'rgba(245,240,235,0.7)');
   sg.addColorStop(1,'transparent');
   ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  if(s&&s.benedictionActive){
   const bp=0.5+0.5*Math.sin(t*14);
   ctx.shadowColor='#fff8a0';ctx.shadowBlur=14;
   ctx.strokeStyle=`rgba(255,248,160,${0.6+bp*0.4})`;ctx.lineWidth=3;
   ctx.beginPath();ctx.arc(0,0,cr+r*0.18,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
  }
  ctx.restore();
  if(s&&s.priestShieldStacks>0){
   const sp2=Math.min(1,s.priestShieldStacks/10);
   ctx.save();ctx.translate(-cx,-cy);
   ctx.restore();
  }
 },
 crimsonclaws(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const ghostMode=s&&s.ghostMode;
  // Scale blade to reach so visual tip == hitbox tip
  const reach=d.reach||1.7;
  // The unscaled tip is at r*2.2 (peak ~r*2.6). Scale factor maps 2.2 → reach.
  const sc=reach/2.2;
  for(const side of[0,1]){
   ctx.save();
   if(side===1)ctx.rotate(Math.PI);
   // Handle
   ctx.fillStyle='#2a0010';ctx.fillRect(r*.72,-r*.055,r*.38,r*.11);
   ctx.strokeStyle='#4a0020';ctx.lineWidth=r*.025;
   for(let i=0;i<3;i++){const gx=r*(.76+i*.1);ctx.beginPath();ctx.moveTo(gx,-r*.05);ctx.lineTo(gx,r*.05);ctx.stroke();}
   // Main blade — scaled crescent
   ctx.fillStyle=ghostMode?'rgba(180,0,60,0.45)':d.wcol;
   ctx.beginPath();
   ctx.moveTo(r*1.1,-r*.08);
   ctx.bezierCurveTo(r*2.2*sc,-r*.15,r*2.6*sc,-r*.55,r*2.2*sc,-r*.85);
   ctx.bezierCurveTo(r*2.05*sc,-r*.72,r*2.05*sc,-r*.42,r*1.5*sc,-r*.18);
   ctx.lineTo(r*1.1,r*.08);
   ctx.bezierCurveTo(r*1.3*sc,r*.05,r*1.5*sc,-r*.04,r*1.5*sc,-r*.18);
   ctx.closePath();ctx.fill();
   // Inner blade sheen
   ctx.fillStyle='rgba(255,80,120,0.30)';
   ctx.beginPath();
   ctx.moveTo(r*1.2,-r*.06);
   ctx.bezierCurveTo(r*2.0*sc,-r*.12,r*2.4*sc,-r*.42,r*2.15*sc,-r*.72);
   ctx.bezierCurveTo(r*2.05*sc,-r*.62,r*1.95*sc,-r*.36,r*1.45*sc,-r*.12);
   ctx.closePath();ctx.fill();
   // Serrations
   ctx.fillStyle=d.wdrk;
   for(let i=0;i<4;i++){
    const prog=(i+1)/5;
    const tx2=r*(1.1+prog*1.1*sc),ty2=r*(-0.08+prog*(-0.77));
    ctx.beginPath();
    ctx.moveTo(tx2,ty2);
    ctx.lineTo(tx2-r*.06,ty2-r*.1);
    ctx.lineTo(tx2+r*.06,ty2-r*.04);
    ctx.closePath();ctx.fill();
   }
   // Blade outline
   ctx.strokeStyle='#550020';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(r*1.1,-r*.08);ctx.bezierCurveTo(r*2.2*sc,-r*.15,r*2.6*sc,-r*.55,r*2.2*sc,-r*.85);ctx.stroke();
   // Glowing crimson tip — at r*reach along the rotation axis (matches hitbox)
   const tipX=r*reach,tipY=0;
   const tg=ctx.createRadialGradient(tipX,tipY,0,tipX,tipY,r*.22);
   tg.addColorStop(0,'rgba(255,100,150,0.9)');tg.addColorStop(0.5,d.wcol+'88');tg.addColorStop(1,'transparent');
   ctx.fillStyle=tg;ctx.beginPath();ctx.arc(tipX,tipY,r*.22,0,Math.PI*2);ctx.fill();
   // Ghost shimmer
   if(ghostMode){
    const glow=0.4+0.3*Math.sin(t*8+side*Math.PI);
    ctx.shadowColor='#cc0044';ctx.shadowBlur=12;
    ctx.strokeStyle=`rgba(200,0,68,${glow})`;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(r*1.1,-r*.08);ctx.bezierCurveTo(r*2.2*sc,-r*.15,r*2.6*sc,-r*.55,r*2.2*sc,-r*.85);ctx.stroke();
    ctx.shadowBlur=0;
   }
   ctx.restore();
  }
 },
 brandingiron(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const pyreOn=s&&s.pyreActive;
  const heat=pyreOn?1:(s?Math.min(1,Math.hypot(s.vx||0,s.vy||0)/((s.baseSpd||1)*1.5)):0);
  const glowCol=pyreOn?'#ff4400':`rgba(255,${Math.round(100+heat*120)},0,${0.4+heat*0.6})`;
  if(heat>0.15||pyreOn){
   ctx.shadowColor=glowCol;ctx.shadowBlur=pyreOn?18:6+heat*10;
  }
  ctx.fillStyle='#4a2808';ctx.fillRect(r*.65,-r*.06,r*1.1,r*.12);
  ctx.fillStyle='#2a1404';ctx.fillRect(r*.65,r*.02,r*1.1,r*.05);
  for(let i=0;i<5;i++){
   ctx.strokeStyle=i%2===0?'#6a3810':'#3a1a08';ctx.lineWidth=r*.025;
   ctx.beginPath();ctx.moveTo(r*(.68+i*.2),-r*.06);ctx.lineTo(r*(.68+i*.2),r*.06);ctx.stroke();
  }
  const hx=r*.65+r*1.1;
  ctx.fillStyle=pyreOn?'#ff6600':heat>0.5?'#cc3300':'#661100';
  ctx.fillRect(hx,-r*.22,r*.18,r*.44);
  ctx.fillStyle=pyreOn?'#ff9900':heat>0.5?'#882200':'#441100';
  ctx.fillRect(hx+r*.02,r*.04,r*.14,r*.18);
  ctx.fillStyle='#222';ctx.strokeStyle='#111';ctx.lineWidth=1;
  ctx.strokeRect(hx,-r*.22,r*.18,r*.44);
  ctx.fillStyle=heat>0.3||pyreOn?'#ff8800':'#440800';
  ctx.beginPath();ctx.arc(hx+r*.09,r*.22+r*.05,r*.09,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#222';ctx.beginPath();ctx.arc(hx+r*.09,-r*.22-r*.05,r*.07,0,Math.PI*2);ctx.fill();
  if(pyreOn||heat>0.5){
   const flamePts=4;
   for(let i=0;i<flamePts;i++){
    const fa=(i/flamePts)*Math.PI*2+t*6;
    const fr=r*(0.08+Math.random()*0.12);
    const fx=hx+r*.09+Math.cos(fa)*r*.06;
    const fy=-r*.22-r*.05+Math.sin(fa)*r*.06;
    const fg=ctx.createRadialGradient(fx,fy,0,fx,fy,fr);
    fg.addColorStop(0,'rgba(255,255,160,0.9)');
    fg.addColorStop(0.4,pyreOn?'rgba(255,80,0,0.8)':'rgba(255,160,0,0.6)');
    fg.addColorStop(1,'transparent');
    ctx.fillStyle=fg;ctx.beginPath();ctx.arc(fx,fy,fr,0,Math.PI*2);ctx.fill();
   }
  }
  if(pyreOn){
   ctx.shadowColor='#ff2200';ctx.shadowBlur=20;
   ctx.strokeStyle=`rgba(255,80,0,${0.6+0.4*Math.sin(t*12)})`;ctx.lineWidth=2.5;
   ctx.strokeRect(hx-2,-r*.24,r*.22,r*.48);
   ctx.shadowBlur=0;
  }
  ctx.shadowBlur=0;
 },
 quarterstaff(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const nirvana=s&&s.nirvanaActive;
  const col1=nirvana?'#ffe0a0':d.wcol;
  const col2=nirvana?'#8a6010':d.wdrk;
  if(nirvana){ctx.shadowColor='#ffe0a0';ctx.shadowBlur=12;}
  ctx.fillStyle=col2;
  ctx.fillRect(-r*2.8,-r*.055,r*5.6,r*.11);
  ctx.fillStyle=col1;
  ctx.fillRect(-r*2.8,-r*.032,r*5.6,r*.058);
  ctx.strokeStyle='#5a3808';ctx.lineWidth=r*.07;ctx.lineCap='round';
  for(let i=0;i<5;i++){
   const gx=-r*0.7+i*r*0.36;
   ctx.beginPath();ctx.moveTo(gx,-r*.07);ctx.lineTo(gx,r*.07);ctx.stroke();
  }
  ctx.fillStyle=col1;
  ctx.beginPath();ctx.arc(-r*2.7,0,r*.15,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(r*2.7,0,r*.15,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#3a2808';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(-r*2.7,0,r*.15,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(r*2.7,0,r*.15,0,Math.PI*2);ctx.stroke();
  if(nirvana){
   const pulse=0.5+0.5*Math.sin(t*14);
   ctx.strokeStyle=`rgba(255,224,160,${0.45+pulse*0.45})`;ctx.lineWidth=1.8;
   ctx.beginPath();ctx.arc(0,0,r*2.9,0,Math.PI*2);ctx.stroke();
   ctx.strokeStyle=`rgba(200,160,64,${0.25+pulse*0.3})`;ctx.lineWidth=1.2;
   ctx.beginPath();ctx.arc(0,0,r*1.8,0,Math.PI*2);ctx.stroke();
   for(let i=0;i<4;i++){
    const a=(i/4)*Math.PI*2+t*5;
    const ox=Math.cos(a)*r*2.3,oy=Math.sin(a)*r*2.3;
    const og=ctx.createRadialGradient(ox,oy,0,ox,oy,r*0.18);
    og.addColorStop(0,'rgba(255,240,180,0.9)');og.addColorStop(1,'rgba(200,160,64,0)');
    ctx.fillStyle=og;ctx.beginPath();ctx.arc(ox,oy,r*0.18,0,Math.PI*2);ctx.fill();
   }
   ctx.shadowBlur=0;
  }
 },
 dragonlance(ctx,r,d,s){
  const leaping=s&&s.isLeaping;
  const landed=s&&s.justLanded;
  const t=s?s.abTimer:0;
  const lp=leaping?(0.5+0.5*Math.sin(t*12)):0;
  if(leaping){ctx.shadowColor='#4488cc';ctx.shadowBlur=18+lp*10;}
  // === SHAFT — layered hardwood with metal bands ===
  const shaftLen=r*4.0;
  const sx=r*.72;
  // Dark wood base
  ctx.fillStyle='#2a1608';ctx.fillRect(sx,-r*.065,shaftLen,r*.13);
  // Grain highlight
  ctx.fillStyle='#4a2810';ctx.fillRect(sx,-r*.035,shaftLen,r*.055);
  ctx.fillStyle='#3a1e0a';ctx.fillRect(sx,r*.015,shaftLen,r*.025);
  // Metal reinforcing bands (4 bands along shaft)
  for(let i=0;i<4;i++){
   const bx=sx+shaftLen*(0.18+i*0.2);
   ctx.fillStyle='#6680a0';ctx.fillRect(bx-r*.025,-r*.08,r*.05,r*.16);
   ctx.fillStyle='#88aacc';ctx.fillRect(bx-r*.02,-r*.055,r*.04,r*.04);
  }
  // === BUTT CAP — rear spike ===
  ctx.fillStyle='#5577aa';
  ctx.beginPath();ctx.moveTo(sx,0);ctx.lineTo(sx-r*.08,-r*.07);ctx.lineTo(sx-r*.22,0);ctx.lineTo(sx-r*.08,r*.07);ctx.closePath();ctx.fill();
  ctx.fillStyle='#88aacc';ctx.beginPath();ctx.moveTo(sx-r*.08,-r*.04);ctx.lineTo(sx-r*.18,0);ctx.lineTo(sx-r*.08,r*.04);ctx.closePath();ctx.fill();
  // === COLLAR — steel socket before the head ===
  const collarX=sx+shaftLen-r*.22;
  ctx.fillStyle='#4466aa';ctx.fillRect(collarX,-r*.12,r*.22,r*.24);
  ctx.fillStyle='#6688cc';ctx.fillRect(collarX+r*.02,-r*.09,r*.06,r*.06);
  ctx.fillStyle='#334488';ctx.fillRect(collarX,-r*.12,r*.22,r*.04);
  // Dragon wing guard — two swept flanges at collar
  ctx.fillStyle='#5577aa';
  ctx.beginPath();ctx.moveTo(collarX+r*.05,-r*.12);ctx.lineTo(collarX+r*.14,-r*.28);ctx.lineTo(collarX+r*.22,-r*.14);ctx.lineTo(collarX+r*.18,-r*.12);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(collarX+r*.05,r*.12);ctx.lineTo(collarX+r*.14,r*.28);ctx.lineTo(collarX+r*.22,r*.14);ctx.lineTo(collarX+r*.18,r*.12);ctx.closePath();ctx.fill();
  ctx.fillStyle='#88aacc';
  ctx.beginPath();ctx.moveTo(collarX+r*.07,-r*.13);ctx.lineTo(collarX+r*.13,-r*.24);ctx.lineTo(collarX+r*.19,-r*.14);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(collarX+r*.07,r*.13);ctx.lineTo(collarX+r*.13,r*.24);ctx.lineTo(collarX+r*.19,r*.14);ctx.closePath();ctx.fill();
  // === LANCE HEAD — long tapering blade with fuller groove ===
  const hx=sx+shaftLen+r*.22;
  ctx.fillStyle=leaping?`rgba(136,187,221,${0.85+lp*.15})`:d.wcol;
  ctx.beginPath();ctx.moveTo(hx+r*.65,0);ctx.lineTo(hx,-r*.075);ctx.lineTo(hx-r*.22,0);ctx.lineTo(hx,-r*.075);ctx.closePath();
  ctx.moveTo(hx+r*.65,0);ctx.lineTo(hx,r*.075);ctx.lineTo(hx-r*.22,0);ctx.lineTo(hx,r*.075);ctx.closePath();
  // Actually draw as one diamond
  ctx.beginPath();ctx.moveTo(hx-r*.22,0);ctx.lineTo(hx,-r*.075);ctx.lineTo(hx+r*.65,0);ctx.lineTo(hx,r*.075);ctx.closePath();ctx.fill();
  // Fuller (central blood groove) — dark stripe down middle
  ctx.fillStyle=d.wdrk;
  ctx.beginPath();ctx.moveTo(hx-r*.15,0);ctx.lineTo(hx-r*.02,-r*.025);ctx.lineTo(hx+r*.5,0);ctx.lineTo(hx-r*.02,r*.025);ctx.closePath();ctx.fill();
  // Edge highlight
  ctx.strokeStyle='rgba(180,210,240,0.7)';ctx.lineWidth=r*.018;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(hx-r*.18,-r*.04);ctx.lineTo(hx+r*.6,0);ctx.stroke();
  // Dragon scale etchings along shaft — small overlapping arcs
  ctx.strokeStyle=leaping?`rgba(68,136,204,${0.5+lp*0.4})`:'rgba(68,136,204,0.4)';
  ctx.lineWidth=r*.022;
  for(let i=0;i<8;i++){
   const ex=sx+r*(0.3+i*0.44);
   ctx.beginPath();ctx.arc(ex+r*.18,0,r*.2,Math.PI*.65,Math.PI*1.35);ctx.stroke();
  }
  // === LEAP EFFECTS ===
  if(leaping){
   // Crackling energy along the full length of the lance
   ctx.shadowColor='#88ccff';ctx.shadowBlur=22;
   ctx.strokeStyle=`rgba(136,187,255,${0.55+lp*.35})`;ctx.lineWidth=r*.04;
   ctx.beginPath();ctx.moveTo(sx,0);ctx.lineTo(hx+r*.65,0);ctx.stroke();
   // Tip corona
   const tg=ctx.createRadialGradient(hx+r*.65,0,0,hx+r*.65,0,r*.35);
   tg.addColorStop(0,`rgba(200,230,255,${0.8+lp*0.2})`);tg.addColorStop(0.5,`rgba(68,136,204,${0.4+lp*0.3})`);tg.addColorStop(1,'transparent');
   ctx.fillStyle=tg;ctx.beginPath();ctx.arc(hx+r*.65,0,r*.35,0,Math.PI*2);ctx.fill();
   ctx.shadowBlur=0;
  }
  // === LANDED FLASH ===
  if(landed){
   ctx.shadowColor='#ffffff';ctx.shadowBlur=20;
   const tf=ctx.createRadialGradient(hx+r*.65,0,0,hx+r*.65,0,r*.6);
   tf.addColorStop(0,'rgba(220,240,255,0.95)');tf.addColorStop(0.5,'rgba(68,136,204,0.5)');tf.addColorStop(1,'transparent');
   ctx.fillStyle=tf;ctx.beginPath();ctx.arc(hx+r*.65,0,r*.6,0,Math.PI*2);ctx.fill();
   ctx.shadowBlur=0;
  }
 },
 flasklauncher(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const omegaAbs=s?Math.abs(s.omegaCur):1;
  const charged=s&&s.stacks>=2;
  const pulse=0.5+0.5*Math.sin(t*6);
  const cordLen=r*2.2;
  const links=8;
  const swingScale=Math.min(1.6,omegaAbs/5);
  const swing=Math.sin(t*6.5)*r*.55*swingScale;
  const swingDrift=Math.cos(t*3.0)*r*.08;
  const cordPts=[];
  for(let i=0;i<=links;i++){
   const prog=i/links;
   const cx=r*.75+prog*cordLen;
   const cy=swing*prog*(0.6+prog*.6)+swingDrift*prog*(1-prog)*2+Math.sin(prog*Math.PI)*r*.1;
   cordPts.push({x:cx,y:cy});
  }
  ctx.strokeStyle='#5a4020';ctx.lineWidth=r*.035;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(cordPts[0].x,cordPts[0].y);
  for(let i=1;i<=links;i++)ctx.lineTo(cordPts[i].x,cordPts[i].y);
  ctx.stroke();
  ctx.strokeStyle='#8a6030';ctx.lineWidth=r*.018;
  ctx.beginPath();ctx.moveTo(cordPts[0].x,cordPts[0].y);
  for(let i=1;i<=links;i++)ctx.lineTo(cordPts[i].x,cordPts[i].y);
  ctx.stroke();
  const vx=cordPts[links].x,vy=cordPts[links].y;
  const lastSeg=cordPts[links-1];
  const vAng=Math.atan2(vy-lastSeg.y,vx-lastSeg.x);
  ctx.save();ctx.translate(vx,vy);ctx.rotate(vAng+Math.PI/2);
  const pR=r*.28;
  ctx.fillStyle='#3a2010';
  ctx.beginPath();
  ctx.moveTo(-pR*.55,-pR*.4);ctx.bezierCurveTo(-pR*.8,-pR*.2,-pR*.8,pR*.4,-pR*.55,pR*.6);
  ctx.bezierCurveTo(-pR*.3,pR*.85,pR*.3,pR*.85,pR*.55,pR*.6);
  ctx.bezierCurveTo(pR*.8,pR*.4,pR*.8,-pR*.2,pR*.55,-pR*.4);
  ctx.lineTo(0,-pR*.55);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#6a4020';ctx.lineWidth=1;ctx.stroke();
  const vialX=0,vialY=pR*.15;
  const vG=ctx.createRadialGradient(vialX-pR*.08,vialY-pR*.1,pR*.04,vialX,vialY,pR*.22);
  vG.addColorStop(0,'rgba(180,255,100,.95)');
  vG.addColorStop(0.5,`rgba(60,${charged?220:160},20,.85)`);
  vG.addColorStop(1,'rgba(10,50,5,.6)');
  ctx.fillStyle=vG;
  ctx.beginPath();ctx.ellipse(vialX,vialY,pR*.2,pR*.24,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=charged?`rgba(100,255,60,${0.5+pulse*0.5})`:'rgba(80,180,30,.5)';
  ctx.lineWidth=1.2;ctx.stroke();
  ctx.fillStyle='rgba(200,255,160,.5)';
  ctx.beginPath();ctx.ellipse(vialX-pR*.06,vialY-pR*.08,pR*.06,pR*.1,-.3,0,Math.PI*2);ctx.fill();
  if(charged){
   ctx.shadowColor='#66ff44';ctx.shadowBlur=8+pulse*6;
   ctx.beginPath();ctx.ellipse(vialX,vialY,pR*.25,pR*.29,0,0,Math.PI*2);
   ctx.strokeStyle=`rgba(80,255,44,${0.35+pulse*0.45})`;ctx.lineWidth=1.8;ctx.stroke();
   ctx.shadowBlur=0;
  }
  // Green bubbling mist at vial tip — always present, intensifies when charged
  const mistA=charged?0.72:0.38;
  const mistCount=charged?4:2;
  for(let mi=0;mi<mistCount;mi++){
   const mOff=mi/mistCount;
   const mx=vialX+(Math.sin(t*7+mOff*Math.PI*2)*pR*.18);
   const my=vialY-pR*.1+(Math.cos(t*5+mOff*Math.PI*2)*pR*.12);
   const mSz=pR*(0.12+0.10*Math.sin(t*9+mOff*3.1));
   const mg=ctx.createRadialGradient(mx,my,0,mx,my,mSz*1.8);
   mg.addColorStop(0,`rgba(120,255,80,${mistA*0.85})`);
   mg.addColorStop(0.5,`rgba(40,180,20,${mistA*0.45})`);
   mg.addColorStop(1,'rgba(10,80,5,0)');
   ctx.fillStyle=mg;ctx.beginPath();ctx.arc(mx,my,mSz*1.8,0,Math.PI*2);ctx.fill();
  }
  // Small bubble rings floating off the tip
  for(let bi=0;bi<3;bi++){
   const bPhase=(t*1.8+bi*0.9)%1;
   const bx=vialX+(Math.sin(bi*2.1+t*.8)*pR*.14);
   const by=vialY-pR*(0.1+bPhase*0.9);
   const bSz=pR*(0.06+bPhase*0.1)*(1-bPhase*0.5);
   ctx.save();ctx.globalAlpha=(1-bPhase)*mistA*0.7;
   ctx.strokeStyle=charged?'#88ff44':'#44cc22';
   ctx.lineWidth=Math.max(0.5,bSz*0.35);
   ctx.beginPath();ctx.arc(bx,by,bSz,0,Math.PI*2);ctx.stroke();
   ctx.restore();
  }
  ctx.restore();
  ctx.fillStyle='#3a2010';ctx.fillRect(r*.58,-r*.07,r*.2,r*.14);
  ctx.fillStyle='#6a4020';ctx.fillRect(r*.60,-r*.05,r*.16,r*.04);
  for(let i=0;i<3;i++){
   const gx=r*(.62+i*.055);
   ctx.strokeStyle='#2a1208';ctx.lineWidth=r*.025;
   ctx.beginPath();ctx.moveTo(gx,-r*.06);ctx.lineTo(gx,r*.06);ctx.stroke();
  }
 },
 syringe(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const infected=s&&(s.virulenceStacks||0)>0;
  // Dark outline first for contrast against any background
  ctx.strokeStyle='#1a2a10';ctx.lineWidth=r*.055;
  ctx.strokeRect(r*.74,-r*.06,r*2.02,r*.12);
  // Barrel body — dark green frame, pale window
  ctx.fillStyle='#3a5a28';ctx.fillRect(r*.74,-r*.06,r*2.02,r*.12);
  ctx.fillStyle='#e8f4e0';ctx.fillRect(r*.80,-r*.042,r*1.82,r*.084);
  // Dose markings on barrel
  ctx.strokeStyle='#3a5a28';ctx.lineWidth=r*.018;
  for(let i=1;i<=5;i++){
   const mx=r*(.82+i*.30);
   ctx.beginPath();ctx.moveTo(mx,-r*.042);ctx.lineTo(mx,-r*.010);ctx.stroke();
  }
  // Liquid fill — vivid lime-green, very visible
  const liqCol=infected
   ?`rgba(80,240,20,${0.85+0.15*Math.sin(t*8)})`
   :'rgba(60,200,30,0.80)';
  ctx.fillStyle=liqCol;
  ctx.fillRect(r*.82,-r*.036,r*1.50,r*.072);
  // Barrel end caps
  ctx.fillStyle='#3a5a28';ctx.fillRect(r*.74,-r*.06,r*.08,r*.12);ctx.fillRect(r*2.74,-r*.06,r*.04,r*.12);
  // Plunger handle — bright amber, clearly distinct
  ctx.fillStyle='#cc6600';ctx.fillRect(r*.56,-r*.13,r*.20,r*.26);
  ctx.fillStyle='#ff9922';ctx.fillRect(r*.58,-r*.11,r*.16,r*.10);
  ctx.strokeStyle='#882200';ctx.lineWidth=r*.03;ctx.strokeRect(r*.56,-r*.13,r*.20,r*.26);
  // Plunger rod connecting handle to barrel
  ctx.fillStyle='#cc6600';ctx.fillRect(r*.64,-r*.025,r*.12,r*.05);
  // Needle — bright steel with dark outline
  ctx.fillStyle='#1a1a1a';ctx.fillRect(r*2.76,-r*.022,r*.68,r*.044); // dark shadow
  ctx.fillStyle='#d8e8d8';ctx.fillRect(r*2.76,-r*.016,r*.65,r*.030);
  ctx.fillStyle='#f0f8f0';ctx.fillRect(r*2.78,-r*.008,r*.50,r*.014);
  // Needle tip — sharp point
  ctx.fillStyle='#d0e0d0';
  ctx.beginPath();ctx.moveTo(r*3.41,-r*.016);ctx.lineTo(r*3.58,0);ctx.lineTo(r*3.41,r*.016);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#1a1a1a';ctx.lineWidth=r*.025;
  ctx.beginPath();ctx.moveTo(r*3.41,-r*.016);ctx.lineTo(r*3.58,0);ctx.lineTo(r*3.41,r*.016);ctx.closePath();ctx.stroke();
  // Infected glow
  if(infected){
   ctx.shadowColor='#44ff00';ctx.shadowBlur=10+Math.sin(t*6)*5;
   ctx.strokeStyle='rgba(68,255,0,0.85)';ctx.lineWidth=1.8;
   ctx.strokeRect(r*.78,-r*.048,r*1.68,r*.096);
   ctx.shadowBlur=0;
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
 mimicblade(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const copying=s&&s.perfectCopyActive;
  const pulse=0.5+0.5*Math.sin(t*8);
  const stealTotal=(s&&s.mimicDmgStolen)||0;
  const glowIntensity=Math.min(1,stealTotal/3);
  const hue=Math.floor((t*30)%360);
  // Dark outline stroke behind everything for contrast
  ctx.strokeStyle='rgba(0,0,0,0.7)';ctx.lineWidth=r*.06;
  ctx.beginPath();ctx.moveTo(r*.90,-r*.10);ctx.quadraticCurveTo(r*1.8,-r*.12,r*3.2,0);ctx.lineTo(r*.90,r*.10);ctx.closePath();ctx.stroke();
  // Handle — dark with visible wrap
  ctx.fillStyle='#1a0a2e';ctx.fillRect(r*.63,-r*.11,r*.30,r*.22);
  ctx.fillStyle='#3a1855';ctx.fillRect(r*.65,-r*.09,r*.26,r*.18);
  for(let i=0;i<4;i++){
   ctx.fillStyle=i%2===0?'#aa66cc':'#220a44';
   ctx.fillRect(r*.67+i*r*.06,-r*.09,r*.04,r*.18);
  }
  // Guard — flat wide piece
  ctx.fillStyle='#5a2888';ctx.fillRect(r*.60,-r*.14,r*.06,r*.28);
  ctx.fillStyle='#8844bb';ctx.fillRect(r*.61,-r*.12,r*.04,r*.10);
  // Blade — vibrant purple, strong fill
  const bc=copying?`hsl(${hue},95%,68%)`:'#cc88ff';
  const bd=copying?`hsl(${hue},70%,35%)`:'#6622aa';
  ctx.fillStyle=bd; // dark underlay first
  ctx.beginPath();
  ctx.moveTo(r*.93,-r*.09);ctx.quadraticCurveTo(r*1.8,-r*.11+Math.sin(t*5)*r*.025,r*3.05,-r*.05);
  ctx.lineTo(r*3.25,0);ctx.lineTo(r*3.05,r*.05);
  ctx.quadraticCurveTo(r*1.8,r*.11-Math.sin(t*5)*r*.025,r*.93,r*.09);
  ctx.closePath();ctx.fill();
  ctx.fillStyle=bc; // bright face
  ctx.beginPath();
  ctx.moveTo(r*.93,-r*.085);ctx.quadraticCurveTo(r*1.8,-r*.10+Math.sin(t*5)*r*.02,r*3.02,-r*.04);
  ctx.lineTo(r*3.22,0);ctx.lineTo(r*3.02,r*.04);
  ctx.quadraticCurveTo(r*1.8,r*.10-Math.sin(t*5)*r*.02,r*.93,r*.085);
  ctx.closePath();ctx.fill();
  // Fuller groove
  ctx.fillStyle=bd;
  ctx.beginPath();ctx.moveTo(r*.95,r*.005);ctx.quadraticCurveTo(r*1.8,r*.04,r*3.02,r*.04);
  ctx.lineTo(r*3.22,0);ctx.lineTo(r*3.02,-r*.01);ctx.quadraticCurveTo(r*1.8,r*.015,r*.95,r*.005);ctx.closePath();ctx.fill();
  // Bright edge line
  ctx.strokeStyle=copying?`rgba(255,255,255,${0.7+pulse*0.3})`:`rgba(220,160,255,${0.65+glowIntensity*0.35})`;
  ctx.lineWidth=r*.022;
  ctx.beginPath();ctx.moveTo(r*.93,-r*.085);ctx.quadraticCurveTo(r*1.8,-r*.10,r*3.05,-r*.04);ctx.lineTo(r*3.25,0);ctx.stroke();
  // Glow effect
  if(copying||glowIntensity>0.15){
   ctx.shadowColor=copying?`hsl(${hue},100%,75%)`:'#cc88ff';
   ctx.shadowBlur=copying?20:8+glowIntensity*12;
   ctx.strokeStyle=copying?`rgba(255,255,255,0.9)`:`rgba(200,136,255,${0.6+glowIntensity*0.4})`;
   ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(r*.93,-r*.085);ctx.quadraticCurveTo(r*1.8,-r*.10,r*3.25,0);ctx.lineTo(r*3.05,r*.04);ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 lightningchain(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const charge=s?(s.staticCharge||0):0;
  const maxCharge=30;
  const chargeRatio=Math.min(1,charge/maxCharge);
  const thunderclapActive=s&&s.thunderclapActive;
  // The lightning chain is a crackling arc of electricity — NOT a metal chain.
  // It has a jagged fractal bolt body, plasma glow, and a heavy electrode head.
  // --- HANDLE: a thick insulated rod with a copper coil wrap ---
  ctx.fillStyle='#0a0820';ctx.fillRect(r*.60,-r*.14,r*.30,r*.28);
  ctx.fillStyle='#1a1540';ctx.fillRect(r*.62,-r*.12,r*.26,r*.24);
  // Copper coil wraps (distinct from alchemist's leather)
  for(let i=0;i<5;i++){
   ctx.fillStyle=i%2===0?'#7a4a10':'#3a2008';
   ctx.fillRect(r*.63+i*r*.046,-r*.12,r*.03,r*.24);
  }
  // Sparking end cap with amber glow
  ctx.fillStyle='#cc6600';ctx.fillRect(r*.60,-r*.06,r*.06,r*.12);
  ctx.fillStyle='#ffaa22';ctx.fillRect(r*.60,-r*.04,r*.04,r*.08);
  // --- EMITTER NODE: where the bolt fires from — a glowing electrode orb ---
  const nodeX=r*.96,nodeY=0;
  ctx.fillStyle='rgba(0,0,20,0.9)';ctx.beginPath();ctx.arc(nodeX,nodeY,r*.12,0,Math.PI*2);ctx.fill();
  const nodeG=ctx.createRadialGradient(nodeX-r*.03,nodeY-r*.03,0,nodeX,nodeY,r*.12);
  nodeG.addColorStop(0,'#ffffff');
  nodeG.addColorStop(0.3,chargeRatio>0.5?'#aaddff':'#7799cc');
  nodeG.addColorStop(0.7,'#1133aa');
  nodeG.addColorStop(1,'#000833');
  ctx.fillStyle=nodeG;ctx.beginPath();ctx.arc(nodeX,nodeY,r*.10,0,Math.PI*2);ctx.fill();
  if(chargeRatio>0.1){
   ctx.shadowColor='#88ccff';ctx.shadowBlur=chargeRatio*16;
   ctx.strokeStyle=`rgba(150,210,255,${chargeRatio*0.8})`;ctx.lineWidth=r*.025;
   ctx.beginPath();ctx.arc(nodeX,nodeY,r*.13,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
  }
  // --- LIGHTNING BOLT: fractal jagged arc from node to endpoint ---
  // Deterministic jitter using sin-based pseudo-random for stable flicker
  const boltLen=r*2.2;
  const endX=nodeX+boltLen,endY=0;
  const segments=8;
  const boltPts=[{x:nodeX,y:nodeY}];
  for(let i=1;i<segments;i++){
   const p=i/segments;
   const baseX=nodeX+p*boltLen;
   // Jagged perpendicular offsets — alternating direction, large displacement
   const jitterAmp=r*(0.28*(1-p*.5));
   const jitter=(Math.sin(t*22+i*3.7)*0.5+Math.sin(t*13+i*1.9)*0.5)*jitterAmp;
   boltPts.push({x:baseX,y:jitter});
  }
  boltPts.push({x:endX,y:0});
  // Secondary micro-bolt (thinner, offset slightly, different phase)
  const boltPts2=[{x:nodeX,y:nodeY}];
  for(let i=1;i<segments;i++){
   const p=i/segments;
   const baseX=nodeX+p*boltLen;
   const jitterAmp=r*(0.16*(1-p*.4));
   const jitter=(Math.sin(t*19+i*2.3)*0.5+Math.sin(t*31+i*5.1)*0.5)*jitterAmp;
   boltPts2.push({x:baseX,y:jitter});
  }
  boltPts2.push({x:endX,y:r*.06});
  // Draw outer glow halo of bolt
  const glowWidth=Math.max(r*.06,r*.18*chargeRatio+r*.04);
  ctx.save();ctx.globalAlpha=Math.max(0.15,chargeRatio*.55+0.1);
  ctx.strokeStyle='#4488ff';ctx.lineWidth=glowWidth*2;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.shadowColor='#88ccff';ctx.shadowBlur=chargeRatio*20+8;
  ctx.beginPath();ctx.moveTo(boltPts[0].x,boltPts[0].y);
  for(let i=1;i<boltPts.length;i++)ctx.lineTo(boltPts[i].x,boltPts[i].y);
  ctx.stroke();ctx.shadowBlur=0;ctx.restore();
  // Draw mid bolt (bright blue)
  ctx.strokeStyle='#66aaff';ctx.lineWidth=Math.max(1.5,r*.060);ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(boltPts[0].x,boltPts[0].y);
  for(let i=1;i<boltPts.length;i++)ctx.lineTo(boltPts[i].x,boltPts[i].y);
  ctx.stroke();
  // Draw secondary branch bolt
  ctx.strokeStyle='#4477dd';ctx.lineWidth=Math.max(1,r*.030);
  ctx.beginPath();ctx.moveTo(boltPts2[0].x,boltPts2[0].y);
  for(let i=1;i<boltPts2.length;i++)ctx.lineTo(boltPts2[i].x,boltPts2[i].y);
  ctx.stroke();
  // Draw hot white core
  ctx.strokeStyle='rgba(220,240,255,0.95)';ctx.lineWidth=Math.max(0.8,r*.018);
  ctx.beginPath();ctx.moveTo(boltPts[0].x,boltPts[0].y);
  for(let i=1;i<boltPts.length;i++)ctx.lineTo(boltPts[i].x,boltPts[i].y);
  ctx.stroke();
  // Plasma orbs at each vertex (the "knuckles" of the bolt)
  for(let i=1;i<boltPts.length-1;i++){
   const px=boltPts[i].x,py=boltPts[i].y;
   const pr=Math.max(r*.025,r*.06*(1-i/segments*.5));
   const pg=ctx.createRadialGradient(px,py,0,px,py,pr*2.5);
   pg.addColorStop(0,'rgba(200,230,255,0.95)');
   pg.addColorStop(0.4,'rgba(80,150,255,0.6)');
   pg.addColorStop(1,'rgba(20,60,200,0)');
   ctx.fillStyle=pg;ctx.beginPath();ctx.arc(px,py,pr*2.5,0,Math.PI*2);ctx.fill();
  }
  // Mini fork branches — small sparks splitting off mid-bolt
  const forkCount=chargeRatio>0.4?3:2;
  for(let fi=0;fi<forkCount;fi++){
   const fIdx=2+fi;
   if(fIdx>=boltPts.length-1)continue;
   const fx=boltPts[fIdx].x,fy=boltPts[fIdx].y;
   const fAngle=Math.PI*.25*(fi%2===0?1:-1)+Math.sin(t*8+fi)*0.3;
   const fLen=r*(.28+chargeRatio*.18);
   const fEx=fx+Math.cos(fAngle)*fLen,fEy=fy+Math.sin(fAngle)*fLen;
   ctx.save();ctx.globalAlpha=0.55+chargeRatio*.3;
   ctx.strokeStyle='#88ccff';ctx.lineWidth=Math.max(0.6,r*.020);ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fEx,fEy);ctx.stroke();
   ctx.restore();
  }
  // --- ENDPOINT: a crackling plasma sphere ---
  const bx=endX,by=0;
  // Dark halo
  ctx.fillStyle='rgba(0,0,20,0.85)';ctx.beginPath();ctx.arc(bx,by,r*.30,0,Math.PI*2);ctx.fill();
  // Plasma gradient
  const plasmaCol=chargeRatio>0.6?'#ffffff':chargeRatio>0.3?'#aaddff':'#6699cc';
  const bg=ctx.createRadialGradient(bx-r*.08,by-r*.08,r*.01,bx,by,r*.26);
  bg.addColorStop(0,chargeRatio>0.5?'#ffffff':'#bbddff');
  bg.addColorStop(0.35,plasmaCol);
  bg.addColorStop(0.7,'#1155cc');
  bg.addColorStop(1,'#000822');
  ctx.fillStyle=bg;ctx.beginPath();ctx.arc(bx,by,r*.26,0,Math.PI*2);ctx.fill();
  // Rotating lightning prongs around the sphere
  const prongCount=4;
  for(let i=0;i<prongCount;i++){
   const a=(i/prongCount)*Math.PI*2+t*2.5;
   const px1=bx+Math.cos(a)*r*.26,py1=by+Math.sin(a)*r*.26;
   const px2=bx+Math.cos(a)*r*.40,py2=by+Math.sin(a)*r*.40;
   // Jagged prong
   const pmx=bx+Math.cos(a)*r*.33+Math.sin(t*15+i)*r*.06;
   const pmy=by+Math.sin(a)*r*.33+Math.cos(t*12+i)*r*.06;
   ctx.strokeStyle='#88ccff';ctx.lineWidth=r*.022;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(px1,py1);ctx.lineTo(pmx,pmy);ctx.lineTo(px2,py2);ctx.stroke();
   ctx.strokeStyle='rgba(200,230,255,0.7)';ctx.lineWidth=r*.010;
   ctx.beginPath();ctx.moveTo(px1,py1);ctx.lineTo(pmx,pmy);ctx.lineTo(px2,py2);ctx.stroke();
  }
  // Outer electric ring
  if(chargeRatio>0.08){
   ctx.shadowColor='#88ccff';ctx.shadowBlur=8+chargeRatio*20;
   ctx.strokeStyle=`rgba(136,204,255,${0.6+chargeRatio*0.4})`;ctx.lineWidth=r*.030;
   ctx.beginPath();ctx.arc(bx,by,r*.30,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
  }
  // Thunderclap ring
  if(thunderclapActive){
   ctx.shadowColor='#ffffff';ctx.shadowBlur=30;
   ctx.strokeStyle='rgba(180,220,255,0.95)';ctx.lineWidth=4;
   ctx.beginPath();ctx.arc(0,0,r*3.2,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
  }
 },
 gravityspike(ctx,r,d,s){
  const t=s?s.abTimer:0;
  const singularityActive=s&&s.singularityActive;
  const voidTears=(s&&s.voidTearCount)||0;
  const pulse=0.5+0.5*Math.sin(t*7);
  // Handle — dark with vivid purple accent, strong contrast
  ctx.fillStyle='#0a0015';ctx.fillRect(r*.61,-r*.13,r*.32,r*.26);
  ctx.fillStyle='#2a0055';ctx.fillRect(r*.63,-r*.11,r*.28,r*.22);
  for(let i=0;i<3;i++){
   ctx.fillStyle=i%2===0?'#6600cc':'#2a0055';
   ctx.fillRect(r*.65+i*r*.08,-r*.11,r*.06,r*.22);
  }
  // Guard crystal
  ctx.fillStyle='#8800ff';ctx.fillRect(r*.60,-r*.15,r*.06,r*.30);
  ctx.fillStyle='#cc44ff';ctx.fillRect(r*.61,-r*.12,r*.04,r*.12);
  // Shaft — layered for visibility: dark base, bright purple mid, white edge
  // Dark shadow
  ctx.fillStyle='#0a0015';ctx.fillRect(r*.93,-r*.075,r*1.85,r*.15);
  // Rich purple body
  ctx.fillStyle='#440088';ctx.fillRect(r*.95,-r*.065,r*1.80,r*.13);
  // Bright upper highlight stripe
  ctx.fillStyle='#9933ff';ctx.fillRect(r*.96,-r*.055,r*1.75,r*.055);
  ctx.fillStyle='rgba(200,150,255,0.6)';ctx.fillRect(r*.97,-r*.048,r*1.50,r*.022);
  // Void ripple along shaft when active
  if(voidTears>0||singularityActive){
   const voidA=Math.min(0.8,voidTears*0.18+(singularityActive?0.5:0));
   ctx.save();ctx.globalAlpha=voidA;
   for(let i=0;i<5;i++){
    const vx=r*(1.0+i*.36),vy=Math.sin(t*8+i*1.4)*r*.07;
    ctx.shadowColor='#cc44ff';ctx.shadowBlur=8;
    const vg=ctx.createRadialGradient(vx,vy,0,vx,vy,r*.14);
    vg.addColorStop(0,'rgba(220,100,255,0.95)');vg.addColorStop(1,'transparent');
    ctx.fillStyle=vg;ctx.beginPath();ctx.arc(vx,vy,r*.14,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
   }
   ctx.restore();
  }
  // Spike head — angular, bright purple face with dark borders
  // Outer dark silhouette for contrast
  ctx.fillStyle='#0a0015';
  ctx.beginPath();ctx.moveTo(r*2.70,-r*.18);ctx.lineTo(r*2.92,-r*.08);ctx.lineTo(r*3.25,0);ctx.lineTo(r*2.92,r*.08);ctx.lineTo(r*2.70,r*.18);ctx.lineTo(r*2.52,0);ctx.closePath();ctx.fill();
  // Purple mid tone
  ctx.fillStyle='#6600cc';
  ctx.beginPath();ctx.moveTo(r*2.74,-r*.15);ctx.lineTo(r*2.94,-r*.07);ctx.lineTo(r*3.20,0);ctx.lineTo(r*2.94,r*.07);ctx.lineTo(r*2.74,r*.15);ctx.lineTo(r*2.58,0);ctx.closePath();ctx.fill();
  // Bright face
  ctx.fillStyle='#bb44ff';
  ctx.beginPath();ctx.moveTo(r*2.78,-r*.10);ctx.lineTo(r*2.96,-r*.05);ctx.lineTo(r*3.15,0);ctx.lineTo(r*2.96,r*.05);ctx.lineTo(r*2.78,r*.10);ctx.lineTo(r*2.65,0);ctx.closePath();ctx.fill();
  // Inner bright core flash
  ctx.fillStyle=singularityActive?`rgba(255,220,255,${0.6+pulse*0.4})`:'rgba(200,150,255,0.5)';
  ctx.beginPath();ctx.moveTo(r*2.82,-r*.06);ctx.lineTo(r*2.96,-r*.03);ctx.lineTo(r*3.08,0);ctx.lineTo(r*2.96,r*.03);ctx.lineTo(r*2.82,r*.06);ctx.lineTo(r*2.74,0);ctx.closePath();ctx.fill();
  // Void eye at center
  ctx.fillStyle='#000000';ctx.beginPath();ctx.arc(r*2.88,0,r*.06,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(120,0,180,0.8)';ctx.beginPath();ctx.arc(r*2.88,0,r*.04,0,Math.PI*2);ctx.fill();
  if(singularityActive){
   ctx.shadowColor='#cc44ff';ctx.shadowBlur=18+pulse*12;
   ctx.strokeStyle=`rgba(200,100,255,${0.8+pulse*0.2})`;ctx.lineWidth=2.5;
   ctx.beginPath();ctx.arc(r*2.88,0,r*.14,0,Math.PI*2);ctx.stroke();
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

 rustyshovel(ctx,r,d,s){
  ctx.save();
  ctx.fillStyle='#5a3518';ctx.fillRect(r*.58,-r*.055,r*2.15,r*.11);
  ctx.strokeStyle='#2a180c';ctx.lineWidth=r*.025;ctx.strokeRect(r*.58,-r*.055,r*2.15,r*.11);
  ctx.translate(r*2.82,0);ctx.rotate(0.08);
  const grad=ctx.createLinearGradient(-r*.18,-r*.38,r*.42,r*.38);
  grad.addColorStop(0,d.wdrk);grad.addColorStop(0.55,d.wcol);grad.addColorStop(1,'#3b2c1f');
  ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(-r*.18,-r*.38);ctx.quadraticCurveTo(r*.48,-r*.32,r*.58,0);ctx.quadraticCurveTo(r*.48,r*.32,-r*.18,r*.38);ctx.quadraticCurveTo(r*.05,0,-r*.18,-r*.38);ctx.fill();
  ctx.strokeStyle='#2b241c';ctx.lineWidth=r*.035;ctx.stroke();
  ctx.strokeStyle='rgba(180,120,70,.45)';ctx.lineWidth=r*.02;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(r*.05,i*r*.12);ctx.lineTo(r*.42,i*r*.08);ctx.stroke();}
  ctx.restore();
 },
 knottedscourge(ctx,r,d,s){
  ctx.save();
  const t=performance.now()/1000;
  const spin=Math.abs(s?.omegaCur||d.om||1);
  const flow=Math.max(-1,Math.min(1,(s?.omegaCur||d.om||1)/(Math.max(1,d.om)*1.4)));
  ctx.fillStyle='#6b3020';ctx.fillRect(r*.55,-r*.08,r*.62,r*.16);
  ctx.strokeStyle='#d8b06a';ctx.lineWidth=r*.025;ctx.strokeRect(r*.55,-r*.08,r*.62,r*.16);
  ctx.fillStyle='rgba(216,176,106,.85)';ctx.beginPath();ctx.arc(r*1.13,0,r*.12,0,Math.PI*2);ctx.fill();
  const tails=6;
  for(let i=0;i<tails;i++){
   const off=(i-(tails-1)/2)*r*.105;
   const phase=t*(5.5+spin*.25)+i*.9;
   const curl=flow*r*(.26+.03*i);
   const tipLift=Math.sin(phase*1.22)*r*.28+curl;
   ctx.strokeStyle=i%2?d.wdrk:d.wcol;ctx.lineWidth=r*(.052-i*.003);ctx.lineCap='round';ctx.lineJoin='round';
   ctx.beginPath();ctx.moveTo(r*1.08,off);
   let px=r*1.08,py=off;
   for(let k=1;k<=5;k++){
    const p=k/5;
    const x=r*(1.08+p*1.95);
    const wave=Math.sin(phase+p*5.2)*r*(.12+p*.2);
    const sag=Math.sin(p*Math.PI)*r*.13;
    const y=off*(1+p*.7)+wave+tipLift*p*p+sag;
    const mx=(px+x)/2,my=(py+y)/2;
    ctx.quadraticCurveTo(px,my,mx,my);
    px=x;py=y;
   }
   ctx.lineTo(px,py);ctx.stroke();
   ctx.fillStyle='#d8b06a';
   for(let k=1;k<=3;k++){
    const p=(k+.25)/4.5;
    const x=r*(1.08+p*1.95);
    const y=off*(1+p*.7)+Math.sin(phase+p*5.2)*r*(.12+p*.2)+tipLift*p*p+Math.sin(p*Math.PI)*r*.13;
    ctx.beginPath();ctx.arc(x,y,r*.047,0,Math.PI*2);ctx.fill();
   }
  }
  ctx.restore();
 },
 catchingpole(ctx,r,d,s){
  ctx.save();
  ctx.strokeStyle='#6b5a34';ctx.lineWidth=r*.075;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(r*.55,0);ctx.lineTo(r*3.85,0);ctx.stroke();
  ctx.strokeStyle=d.wcol;ctx.lineWidth=r*.04;ctx.beginPath();ctx.moveTo(r*.8,-r*.04);ctx.lineTo(r*3.55,-r*.04);ctx.stroke();
  ctx.translate(r*3.85,0);
  ctx.strokeStyle='#c0b080';ctx.lineWidth=r*.055;ctx.beginPath();ctx.ellipse(0,0,r*.22,r*.42,0,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='#2b2112';ctx.lineWidth=r*.025;ctx.beginPath();ctx.moveTo(-r*.08,-r*.38);ctx.lineTo(-r*.36,-r*.18);ctx.moveTo(-r*.08,r*.38);ctx.lineTo(-r*.36,r*.18);ctx.stroke();
  ctx.restore();
 },
 keyring(ctx,r,d,s){
  ctx.save();
  ctx.fillStyle='#3a2b16';ctx.fillRect(r*.55,-r*.07,r*.55,r*.14);
  ctx.translate(r*1.18,0);
  ctx.strokeStyle=d.wcol;ctx.lineWidth=r*.065;ctx.beginPath();ctx.arc(0,0,r*.28,0,Math.PI*2);ctx.stroke();
  const t=performance.now()/1000;
  for(let i=0;i<6;i++){
   const a=i*Math.PI*2/6+t*.3,hang=r*.28;
   ctx.save();ctx.translate(Math.cos(a)*hang,Math.sin(a)*hang);ctx.rotate(a+Math.PI/2);
   ctx.fillStyle=i%2?d.wcol:d.wdrk;ctx.fillRect(-r*.035,0,r*.07,r*.62);
   ctx.fillRect(-r*.08,r*.46,r*.16,r*.08);ctx.fillRect(r*.02,r*.36,r*.12,r*.06);
   ctx.beginPath();ctx.arc(0,-r*.04,r*.075,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  ctx.restore();
 },
 blowpipe(ctx,r,d,s){
  ctx.save();
  ctx.strokeStyle='#35545a';ctx.lineWidth=r*.08;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(r*.58,0);ctx.lineTo(r*3.25,0);ctx.stroke();
  ctx.strokeStyle='#82f4ff';ctx.lineWidth=r*.025;ctx.beginPath();ctx.moveTo(r*.8,-r*.055);ctx.lineTo(r*3.0,-r*.055);ctx.stroke();
  ctx.translate(r*3.32,0);
  const pulse=0.55+0.45*Math.sin(performance.now()/1000*8);
  ctx.shadowColor='#ff7a22';ctx.shadowBlur=10+pulse*10;
  const g=ctx.createRadialGradient(-r*.08,-r*.08,1,0,0,r*.28);
  g.addColorStop(0,'#fff2a0');g.addColorStop(0.45,d.wcol);g.addColorStop(1,d.wdrk);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*.28,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#82f4ff';ctx.lineWidth=r*.025;ctx.stroke();ctx.shadowBlur=0;
  ctx.restore();
 },
 hexstaff(ctx,r,d,s){
  const t=performance.now()/1000;
  ctx.save();
  // Gnarled root staff: uneven silhouette, bone ties, and a cursed crystal crown.
  ctx.lineCap='round';ctx.lineJoin='round';
  const pts=[];
  for(let i=0;i<=7;i++){
   const p=i/7;
   pts.push({x:r*(.52+p*2.36),y:Math.sin(t*2.0+i*.85)*r*(.045+.035*p)+Math.sin(i*1.7)*r*.035});
  }
  ctx.strokeStyle='#17091f';ctx.lineWidth=r*.145;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();
  ctx.strokeStyle='#4a2b20';ctx.lineWidth=r*.105;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();
  ctx.strokeStyle='#7b4a2c';ctx.lineWidth=r*.038;ctx.beginPath();ctx.moveTo(pts[1].x,pts[1].y-r*.04);for(let i=2;i<pts.length-1;i++)ctx.lineTo(pts[i].x,pts[i].y-r*.025);ctx.stroke();
  ctx.strokeStyle=d.rim+'88';ctx.lineWidth=r*.026;ctx.setLineDash([r*.12,r*.1]);ctx.beginPath();ctx.moveTo(r*.82,r*.11);ctx.quadraticCurveTo(r*1.62,-r*.24,r*2.62,r*.03);ctx.stroke();ctx.setLineDash([]);
  for(let i=0;i<4;i++){
   const x=r*(1.0+i*.43),a=-.75+i*.18;
   ctx.save();ctx.translate(x,Math.sin(t*2+i)*r*.025);ctx.rotate(a);
   ctx.strokeStyle=i%2?'#d7c2a5':'#aa8a64';ctx.lineWidth=r*.03;ctx.beginPath();ctx.moveTo(-r*.12,0);ctx.lineTo(r*.12,0);ctx.stroke();
   ctx.restore();
  }
  ctx.translate(r*2.88,0);ctx.rotate(t*.8);
  ctx.shadowColor=d.rim;ctx.shadowBlur=12+Math.sin(t*7)*5;
  const cg=ctx.createRadialGradient(-r*.08,-r*.08,1,0,0,r*.36);
  cg.addColorStop(0,'#fff8ff');cg.addColorStop(.36,d.rim);cg.addColorStop(.72,d.wcol);cg.addColorStop(1,'#2a0c46');
  ctx.fillStyle=cg;ctx.beginPath();
  for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*.19:r*.34;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();
  ctx.strokeStyle='#12051f';ctx.lineWidth=r*.025;ctx.stroke();
  ctx.globalAlpha=.85;ctx.strokeStyle='#12051f';ctx.lineWidth=r*.018;for(let i=0;i<4;i++){const a=i*Math.PI/2+t*.4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*r*.3,Math.sin(a)*r*.3);ctx.stroke();}
  ctx.restore();
 },
 doruaspis(ctx,r,d,s){
  const t=performance.now()/1000,p=s&&s.ramActive?0.5+0.5*Math.sin(t*18):0;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  // Opposing readable ends: long Doru spear forward, full Aspis face backward.
  const shaft=ctx.createLinearGradient(-r*1.25,-r*.08,r*2.75,r*.08);
  shaft.addColorStop(0,'#3b1908');shaft.addColorStop(.5,'#8a5224');shaft.addColorStop(1,'#4a210d');
  ctx.fillStyle=shaft;ctx.fillRect(-r*1.18,-r*.07,r*3.95,r*.14);
  ctx.strokeStyle='#1a0b03';ctx.lineWidth=r*.025;ctx.strokeRect(-r*1.18,-r*.07,r*3.95,r*.14);
  for(let x=r*.2;x<r*2.35;x+=r*.48){ctx.strokeStyle='rgba(216,176,96,.42)';ctx.lineWidth=r*.018;ctx.beginPath();ctx.moveTo(x,-r*.09);ctx.lineTo(x+r*.12,r*.09);ctx.stroke();}
  const tipX=r*2.66;
  const tg=ctx.createLinearGradient(tipX,-r*.3,tipX+r*.56,r*.3);tg.addColorStop(0,'#f8e0a2');tg.addColorStop(.45,d.wcol);tg.addColorStop(1,'#684018');
  ctx.fillStyle=tg;ctx.beginPath();ctx.moveTo(tipX,-r*.27);ctx.lineTo(tipX+r*.62,0);ctx.lineTo(tipX,r*.27);ctx.lineTo(tipX+r*.12,0);ctx.closePath();ctx.fill();ctx.strokeStyle='#2a1807';ctx.stroke();
  ctx.translate(-r*1.18,0);
  const sg=ctx.createRadialGradient(-r*.18,-r*.18,r*.08,0,0,r*.72);sg.addColorStop(0,'#f1c06a');sg.addColorStop(.28,'#9d2c24');sg.addColorStop(.68,'#5b1a16');sg.addColorStop(1,'#1a0705');
  ctx.fillStyle=sg;ctx.beginPath();ctx.arc(0,0,r*.68,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=d.wcol;ctx.lineWidth=r*.08;ctx.stroke();
  ctx.strokeStyle='#f0d08a';ctx.lineWidth=r*.035;ctx.beginPath();ctx.arc(0,0,r*.43,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle=d.wcol;ctx.beginPath();ctx.arc(0,0,r*.18,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#4b2608';ctx.stroke();
  if(s&&s.ironStacks>0){for(let i=0;i<Math.min(5,s.ironStacks);i++){const a=-Math.PI*.7+i*Math.PI*.35;ctx.fillStyle='#ffd36a';ctx.beginPath();ctx.arc(Math.cos(a)*r*.86,Math.sin(a)*r*.86,r*.045,0,Math.PI*2);ctx.fill();}}
  if(s&&s.ramActive){ctx.shadowColor='#ffd36a';ctx.shadowBlur=18;ctx.strokeStyle=`rgba(255,211,90,${.45+p*.45})`;ctx.lineWidth=r*.13;ctx.beginPath();ctx.moveTo(r*1.4,0);ctx.lineTo(r*4.1,0);ctx.stroke();ctx.shadowBlur=0;}
  ctx.restore();
 },
 gladiusnet(ctx,r,d,s){
  const t=performance.now()/1000;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  // Short brutal gladius on one side, weighted arena net on a chain on the other.
  ctx.fillStyle='#5b351e';ctx.fillRect(r*.52,-r*.09,r*.36,r*.18);
  ctx.fillStyle='#d4aa68';ctx.fillRect(r*.78,-r*.28,r*.12,r*.56);
  const bg=ctx.createLinearGradient(r*.88,-r*.16,r*2.15,r*.16);bg.addColorStop(0,'#fff6dc');bg.addColorStop(.45,d.wcol);bg.addColorStop(1,'#6f5b46');
  ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(r*.9,-r*.15);ctx.lineTo(r*1.88,-r*.13);ctx.lineTo(r*2.16,0);ctx.lineTo(r*1.88,r*.13);ctx.lineTo(r*.9,r*.15);ctx.closePath();ctx.fill();ctx.strokeStyle='#3b2b22';ctx.lineWidth=r*.022;ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=r*.018;ctx.beginPath();ctx.moveTo(r*1.02,-r*.06);ctx.lineTo(r*1.9,-r*.04);ctx.stroke();
  const chainPts=[];for(let i=0;i<=6;i++){const p=i/6;chainPts.push({x:-r*(.48+p*1.05),y:Math.sin(t*5+i*.9)*r*.18*Math.sin(p*Math.PI)});}
  ctx.strokeStyle='#6b5848';ctx.lineWidth=r*.035;ctx.beginPath();ctx.moveTo(chainPts[0].x,chainPts[0].y);for(let i=1;i<chainPts.length;i++)ctx.lineTo(chainPts[i].x,chainPts[i].y);ctx.stroke();
  const nx=chainPts[6].x-r*.18,ny=chainPts[6].y;
  ctx.translate(nx,ny);ctx.rotate(Math.sin(t*3)*.18);
  ctx.strokeStyle='#d9c4a0';ctx.lineWidth=r*.026;
  for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-r*.44,i*r*.12);ctx.quadraticCurveTo(0,i*r*.08,r*.44,i*r*.12);ctx.stroke();ctx.beginPath();ctx.moveTo(i*r*.16,-r*.38);ctx.quadraticCurveTo(i*r*.08,0,i*r*.16,r*.38);ctx.stroke();}
  ctx.strokeStyle='#8a6b4b';ctx.lineWidth=r*.04;ctx.beginPath();ctx.ellipse(0,0,r*.5,r*.42,0,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#7a6048';for(const [x,y] of [[-r*.42,-r*.28],[r*.42,-r*.25],[-r*.28,r*.36],[r*.3,r*.34]]){ctx.beginPath();ctx.arc(x,y,r*.065,0,Math.PI*2);ctx.fill();}
  if(s&&s.netLockoutT>0){ctx.shadowColor='#f0c08a';ctx.shadowBlur=12;ctx.strokeStyle='rgba(240,192,138,.7)';ctx.lineWidth=r*.055;ctx.beginPath();ctx.ellipse(0,0,r*.62,r*.52,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}
  ctx.restore();
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
  // Crown cup and prongs with fleur-de-lis center.
  const cup=ctx.createLinearGradient(-r*.38,-r*.37,r*.38,-r*.08);cup.addColorStop(0,'#6c090f');cup.addColorStop(.45,'#d00020');cup.addColorStop(1,'#ff4960');
  ctx.fillStyle=cup;ctx.strokeStyle='#ffd35a';ctx.lineWidth=r*.028;
  ctx.beginPath();ctx.moveTo(-r*.39,-r*.17);ctx.quadraticCurveTo(0,-r*.04,r*.39,-r*.17);ctx.lineTo(r*.31,-r*.35);ctx.quadraticCurveTo(0,-r*.27,-r*.31,-r*.35);ctx.closePath();ctx.fill();ctx.stroke();
  for(let i=-2;i<=2;i++){
   const x=i*r*.16,h=i===0?r*.76:Math.abs(i)===1?r*.58:r*.46;
   ctx.fillStyle=i===0?'#b60018':'#d00020';ctx.strokeStyle='#ffd35a';
   ctx.beginPath();ctx.moveTo(x-r*.075,-r*.31);ctx.lineTo(x,-h);ctx.lineTo(x+r*.075,-r*.31);ctx.closePath();ctx.fill();ctx.stroke();
   const jewel=i===0?'#7df6ff':Math.abs(i)===1?'#ffd35a':'#fff1a8';
   ctx.fillStyle=jewel;ctx.beginPath();ctx.arc(x,-h,r*(i===0?.055:.04),0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7a4a08';ctx.lineWidth=r*.01;ctx.stroke();
  }
  ctx.fillStyle='#ffd35a';ctx.beginPath();ctx.moveTo(0,-r*.53);ctx.bezierCurveTo(-r*.16,-r*.47,-r*.17,-r*.31,0,-r*.24);ctx.bezierCurveTo(r*.17,-r*.31,r*.16,-r*.47,0,-r*.53);ctx.fill();
  ctx.fillRect(-r*.025,-r*.49,r*.05,r*.34);
  if(s&&s.decreeT>0){
   ctx.strokeStyle=`rgba(255,211,90,${.45+p*.4})`;ctx.lineWidth=r*.07;ctx.setLineDash([r*.08,r*.05]);
   ctx.beginPath();ctx.arc(0,-r*.22,r*(.72+p*.1),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=`rgba(255,211,90,${.18+p*.16})`;ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,rr=r*(.78+(i%2)*.16);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr-r*.1);}ctx.closePath();ctx.fill();
  }
  ctx.shadowBlur=0;ctx.restore();
 },
 regalrapier(ctx,r,d,s){
  const t=performance.now()/1000,p=s&&s.blinking?0.5+0.5*Math.sin(t*14):0;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  const x0=r*.82,x1=r*3.46;
  ctx.strokeStyle='#32142a';ctx.lineWidth=r*.055;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1,0);ctx.stroke();
  ctx.strokeStyle=d.wcol;ctx.lineWidth=r*.026;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1,0);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.72)';ctx.lineWidth=r*.012;ctx.beginPath();ctx.moveTo(x0+r*.08,-r*.025);ctx.lineTo(x1-r*.16,-r*.025);ctx.stroke();
  ctx.fillStyle='#fff4fb';ctx.beginPath();ctx.moveTo(x1,-r*.065);ctx.lineTo(x1+r*.28,0);ctx.lineTo(x1,r*.065);ctx.closePath();ctx.fill();ctx.strokeStyle=d.wdrk;ctx.stroke();
  const gg=ctx.createLinearGradient(r*.55,-r*.48,r*1.02,r*.48);gg.addColorStop(0,'#fff0fb');gg.addColorStop(.44,d.wcol);gg.addColorStop(1,d.wdrk);
  ctx.strokeStyle=gg;ctx.lineWidth=r*.04;ctx.beginPath();ctx.ellipse(r*.82,0,r*.34,r*.47,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(r*.7,-r*.18,r*.18,Math.PI*.15,Math.PI*1.35);ctx.stroke();ctx.beginPath();ctx.arc(r*.7,r*.18,r*.18,-Math.PI*1.35,-Math.PI*.15);ctx.stroke();
  ctx.fillStyle=d.wdrk;ctx.fillRect(r*.56,-r*.055,r*.34,r*.11);ctx.fillStyle=d.rim;ctx.beginPath();ctx.arc(r*.6,0,r*.075,0,Math.PI*2);ctx.fill();
  if(s&&s.blinking){ctx.shadowColor=d.rim;ctx.shadowBlur=18;ctx.strokeStyle=`rgba(255,139,209,${.4+p*.45})`;ctx.lineWidth=r*.09;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1+r*.35,0);ctx.stroke();ctx.shadowBlur=0;}
  ctx.restore();
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
 arcanecannon(ctx,r,d,s){
  const t=performance.now()/1000,p=s&&s.overloadActive?0.5+0.5*Math.sin(t*16):0,charge=Math.min(1,(s&&s.arcaneCharge||0)/5);
  ctx.save();ctx.translate(r*1.54,0);ctx.lineJoin='round';
  ctx.shadowColor=d.rim;ctx.shadowBlur=8+charge*10+p*12;
  // Floating runic barrel with rotating rings and charge core.
  const body=ctx.createLinearGradient(-r*.7,-r*.31,r*.72,r*.31);body.addColorStop(0,'#08283a');body.addColorStop(.45,d.wdrk);body.addColorStop(1,'#0a1728');
  ctx.fillStyle=body;rrect(ctx,-r*.72,-r*.3,r*1.28,r*.6,r*.08);ctx.fill();ctx.strokeStyle='#061722';ctx.lineWidth=r*.025;ctx.stroke();
  const muzzle=ctx.createLinearGradient(r*.25,-r*.23,r*1.12,r*.23);muzzle.addColorStop(0,'#bdf4ff');muzzle.addColorStop(.45,d.wcol);muzzle.addColorStop(1,'#1c668e');
  ctx.fillStyle=muzzle;rrect(ctx,r*.22,-r*.22,r*.88,r*.44,r*.06);ctx.fill();ctx.strokeStyle=d.rim;ctx.lineWidth=r*.026;ctx.stroke();
  ctx.fillStyle='#04131d';ctx.beginPath();ctx.ellipse(r*1.04,0,r*.14,r*.18,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=d.rim;ctx.lineWidth=r*.032;for(let i=0;i<3;i++){ctx.save();ctx.rotate(t*(1.1+i*.35)+i*Math.PI/3);ctx.beginPath();ctx.ellipse(-r*.18,0,r*(.48+i*.09),r*(.31+i*.06),0,0,Math.PI*2);ctx.stroke();ctx.restore();}
  for(let i=0;i<6;i++){const a=t*2.4+i*Math.PI/3;ctx.fillStyle=i%2?d.wcol:d.rim;ctx.beginPath();ctx.arc(Math.cos(a)*r*.62,Math.sin(a)*r*.42,r*(.035+charge*.025),0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=.85;ctx.fillStyle=`rgba(232,251,255,${.25+charge*.6})`;ctx.beginPath();ctx.arc(-r*.18,0,r*(.12+charge*.13+p*.04),0,Math.PI*2);ctx.fill();
  if(s&&s.overloadActive){ctx.strokeStyle=`rgba(255,122,34,${.5+p*.35})`;ctx.lineWidth=r*.06;ctx.setLineDash([r*.08,r*.06]);ctx.beginPath();ctx.arc(-r*.18,0,r*.74,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  ctx.shadowBlur=0;ctx.restore();
 },
};
// ▓▓▓ END:WEAPONS ▓▓▓
