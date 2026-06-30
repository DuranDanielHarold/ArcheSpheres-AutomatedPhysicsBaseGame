'use strict';
// ▓▓▓ MODULE: weapons/weapons-ranged.js — extracted from former js/weapons.js ▓▓▓
// Ranged weapon render functions.

const RANGED_WEAPONS={
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
