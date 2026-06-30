'use strict';
// ▓▓▓ MODULE: weapons/weapons-melee.js — extracted from former js/weapons.js ▓▓▓
// Melee-oriented weapon render functions.

const MELEE_WEAPONS={
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
  const reach=d.reach||2.8;
  ctx.fillStyle=col2;
  ctx.fillRect(-r*reach,-r*.055,r*reach*2,r*.11);
  ctx.fillStyle=col1;
  ctx.fillRect(-r*reach,-r*.032,r*reach*2,r*.058);
  ctx.strokeStyle='#5a3808';ctx.lineWidth=r*.07;ctx.lineCap='round';
  for(let i=0;i<5;i++){
   const gx=-r*0.7+i*r*0.36;
   ctx.beginPath();ctx.moveTo(gx,-r*.07);ctx.lineTo(gx,r*.07);ctx.stroke();
  }
  ctx.fillStyle=col1;
  ctx.beginPath();ctx.arc(-r*(reach-.1),0,r*.15,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(r*(reach-.1),0,r*.15,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#3a2808';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(-r*(reach-.1),0,r*.15,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(r*(reach-.1),0,r*.15,0,Math.PI*2);ctx.stroke();
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
};
