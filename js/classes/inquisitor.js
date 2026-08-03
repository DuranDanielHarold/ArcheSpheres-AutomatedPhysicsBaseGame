'use strict';
// ▓▓▓ MODULE: classes/inquisitor.js — Inquisitor sphere kit registry ▓▓▓

DEF.inquisitor = {"label":"Inquisitor","weapon":"Branding Iron","ab":"Heretic's Pyre","color":"#2a0a00","dark":"#150400","rim":"#ff6600","out":"#0a0200","wcol":"#ff4400","wdrk":"#8a2000","mass":9,"spd":222,"hp":512,"om":5,"dmg":4.45,"arm":138,"magDef":45,"rest":0.64,"reach":2.8,"tipR":0.38,"abilityType":"damage","passiveType":"hybrid","wt":"brandingiron"};
CLASS_ROLE.inquisitor = "FIGHTER";
CLASS_DESC.inquisitor = {
  "ability": "Heretic's Pyre (4 stacks) — Ignites a 4s burning aura around the Inquisitor. Enemies inside take heavy DoT every 0.4s. Armor grows by +8 every second the pyre burns — judgment tempers iron.",
  "passive": "Speed is Judgment — damage scales with current movement speed. The faster the Inquisitor moves, the harder the Branding Iron burns. Also leaves scorching heat trails that briefly damage enemies who cross them."
};
STACK_THRESHOLD.inquisitor = 4;
STACK_DISPLAY_THRESHOLD.inquisitor = 4;
SPHERE_AUDIO.inquisitor = {
  "weaponCollision": "audio/inquisitor/weaponCollision.wav",
  "damage": "",
  "ability": ""
};

INIT_HANDLERS.inquisitor = function(){
  this.pyreActive=false;this.pyreT=0;this.pyreAuraTimer=0;this.pyreArmBonus=0;
  this.heatTrails=[];this.heatTrailTimer=0;
};

ABILITY_HANDLERS.inquisitor = function(){
  if(this.stacks>=4){
   this.stacks=0;
   this.pyreActive=true;this.pyreT=4.0;this.pyreAuraTimer=0;
   this.pyreArmBonus=0;
   spawnBurst(this.x,this.y,'#ff6600','#ff2200',20);
   spawnPulse(this.x,this.y,'#ff4400');
  }
};

PASSIVE_HANDLERS.inquisitor = function(dt){
  const curSpd=Math.hypot(this.vx,this.vy);
  const spdFrac=Math.min(1,curSpd/(this.baseSpd*1.5));
  this.dmgMult=1+spdFrac*0.8;
  if(this.pyreActive){
   this.pyreT-=dt;
   this.pyreAuraTimer+=dt;
   const pyreSecElapsed=4.0-this.pyreT;
   const newArmBonus=Math.floor(pyreSecElapsed)*8;
   if(newArmBonus>this.pyreArmBonus){
    const diff=newArmBonus-this.pyreArmBonus;
    this.pyreArmBonus=newArmBonus;
    this.d=Object.assign({},this.d);
    this.d.arm+=diff;
   }
   if(this.pyreAuraTimer>=0.4){
    this.pyreAuraTimer=0;
    for(const s of spheres){
     if(sameFaction(this,s)||!s.alive||s.dying)continue;
     if(Math.hypot(s.x-this.x,s.y-this.y)<this.radius*2.8){
      s.receiveDamage(this.d.dmg*0.55*this.dmgMult);
      spawnSpark(s.x,s.y,'#ff4400',4);
     }
    }
   }
   for(let i=0;i<3;i++){
    const a=Math.random()*Math.PI*2,r2=this.radius*(0.8+Math.random()*0.8);
    particles.push({x:this.x+Math.cos(a)*r2,y:this.y+Math.sin(a)*r2,
     vx:(Math.random()-.5)*40,vy:-(20+Math.random()*60),
     life:1,maxL:0.4+Math.random()*0.3,sz:3+Math.random()*5,
     col:Math.random()<0.5?'#ff4400':'#ff8800',sq:false});
   }
   if(this.pyreT<=0){
    this.pyreActive=false;
    this.d=Object.assign({},this.d);
    this.d.arm=Math.max(DEF['inquisitor'].arm,this.d.arm-this.pyreArmBonus);
    this.pyreArmBonus=0;
   }
  }
  this.heatTrailTimer+=dt;
  if(this.heatTrailTimer>=0.12&&curSpd>this.baseSpd*0.4){
   this.heatTrailTimer=0;
   this.heatTrails.push({x:this.x,y:this.y,life:1.2,maxLife:1.2,r:this.radius*0.6});
  }
  this.heatTrails=this.heatTrails.filter(h=>{
   h.life-=dt;
   if(h.life>0){
    for(const s of spheres){
     if(sameFaction(this,s)||!s.alive||s.dying)continue;
     if(Math.hypot(s.x-h.x,s.y-h.y)<h.r+s.radius*0.5){
      s.receiveDamage(this.d.dmg*0.08);
     }
    }
   }
   return h.life>0;
  });
};

DRAW_OVERLAY_HANDLERS.inquisitor = function(ctx,r,p){
  const curSpd=Math.hypot(this.vx,this.vy);
  const spdFrac=Math.min(1,curSpd/(this.baseSpd*1.5));
  if(spdFrac>0.2){
   ctx.shadowColor='#ff4400';ctx.shadowBlur=Math.round(6+spdFrac*12);
   ctx.beginPath();ctx.arc(this.x,this.y,r+2+spdFrac*4,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,${Math.round(68+spdFrac*100)},0,${0.3+spdFrac*0.6})`;
   ctx.lineWidth=1.5+spdFrac*2;ctx.stroke();ctx.shadowBlur=0;
  }
  if(this.pyreActive){
   const pp=0.5+0.5*Math.sin(Date.now()*.02);
   ctx.shadowColor='#ff4400';ctx.shadowBlur=20+pp*10;
   ctx.beginPath();ctx.arc(this.x,this.y,r*2.8,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,80,0,${0.25+pp*0.2})`;ctx.lineWidth=3+pp*3;ctx.stroke();
   ctx.beginPath();ctx.arc(this.x,this.y,r+8+pp*4,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,120,0,${0.6+pp*0.3})`;ctx.lineWidth=3;ctx.stroke();
   ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='#ff6600';ctx.fillText('PYRE',this.x,this.y-r-14);
   if(this.pyreArmBonus>0){
    ctx.fillStyle='#ff9900';ctx.fillText(`+${this.pyreArmBonus}ARM`,this.x,this.y-r-26);
   }
  }
  for(const h of this.heatTrails){
   const a=(h.life/h.maxLife)*0.5;
   ctx.save();ctx.globalAlpha=a;
   const g=ctx.createRadialGradient(h.x,h.y,0,h.x,h.y,h.r);
   g.addColorStop(0,'rgba(255,120,0,0.7)');g.addColorStop(1,'rgba(255,40,0,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
};

// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
