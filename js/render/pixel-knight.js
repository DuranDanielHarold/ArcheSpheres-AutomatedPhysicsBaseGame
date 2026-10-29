'use strict';
(function(){
 const GOLD=['#4d3508','#6a4710','#caa542','#f4d97a'];
 function drawWeapon(ctx,s){
  if(!s||!window.PixelArt||!PixelArt.enabled())return;
  const p=PixelArt.px(),ar=PixelArt.artRadius(s),d=s.d;
  const reach=Math.max(ar+2,Math.round(d.reach*ar)),width=Math.max(3,Math.round(2*d.tipR*ar));const bladeW=width%2?width:width+1;
  const key=[ar,reach,bladeW,d.out,d.wdrk,d.wcol,d.rim].join(':');
  if(!drawWeapon.cache)drawWeapon.cache=new Map();let frames=drawWeapon.cache.get(key);
  if(!frames){
   const length=reach+1,h=Math.max(9,Math.round(ar*1.5)),canvas=document.createElement('canvas');canvas.width=length+4;canvas.height=h;
   const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const cy=Math.floor(h/2),pom=Math.max(1,Math.round(ar*.095)),grip0=Math.max(1,Math.round(ar*.25)),guardX=Math.max(2,Math.round(ar*.65)),guardH=Math.max(3,Math.round(ar*.7));
   // Grip and pommel sit behind the guard.
   c.fillStyle='#25170d';c.fillRect(Math.round(ar*.32),cy-1,guardX-Math.round(ar*.32),3);
   for(let i=0;i<4;i++){c.fillStyle=i%2?'#8b6334':'#4b2b16';c.fillRect(Math.round(ar*.34+i*ar*.07),cy-1,1,3);}
   c.fillStyle=GOLD[1];c.fillRect(Math.round(ar*.58)-pom,cy-pom,pom*2+1,pom*2+1);c.fillStyle=GOLD[3];c.fillRect(Math.round(ar*.58)-pom,cy-pom,pom,1);
   c.fillStyle=GOLD[0];c.fillRect(guardX-1,cy-Math.floor(guardH/2)-1,3,guardH+2);c.fillStyle=GOLD[2];c.fillRect(guardX,cy-Math.floor(guardH/2),1,guardH);c.fillStyle=GOLD[3];c.fillRect(guardX+1,cy-Math.floor(guardH/2),1,guardH);
   c.fillStyle=GOLD[0];c.fillRect(guardX-2,cy-Math.floor(guardH/2)-1,5,1);c.fillRect(guardX-2,cy+Math.floor(guardH/2),5,1);
   const x0=guardX+2,xTip=length-1,half=Math.floor(bladeW/2);
   for(let x=x0;x<xTip;x++){const taper=Math.max(1,Math.round((xTip-x)/5*half)),hh=x>xTip-5?taper:half;c.fillStyle=d.out;c.fillRect(x,cy-hh-1,1,hh*2+3);c.fillStyle=x%3===0?d.wcol:d.wdrk;c.fillRect(x,cy-hh,1,hh*2+1);if(hh>1){c.fillStyle=d.wcol;c.fillRect(x,cy-hh,1,1);c.fillStyle=d.out;c.fillRect(x,cy,1,1);c.fillStyle=d.rim;c.fillRect(x,cy-hh+1,1,1);}}
   c.fillStyle=d.out;c.fillRect(x0-1,cy-half-1,2,half*2+3);c.fillStyle=GOLD[1];c.fillRect(x0-1,cy-2,2,5);
   const sprite={canvas,width:canvas.width,height:canvas.height};frames=PixelArt.bakeRotations(sprite,48,{x:0,y:cy});drawWeapon.cache.set(key,frames);
  }
  const idx=Math.round((((s.angle%(Math.PI*2))+(Math.PI*2))%(Math.PI*2))/(Math.PI*2)*48)%48,frame=frames[idx];
  PixelArt.blit(ctx,frame,s.x,s.y);
  if(s.invincible){const blink=Math.floor((performance.now()||0)/125)%2===0;if(blink){ctx.save();ctx.fillStyle='#fff';const tipX=s.x+Math.cos(s.angle)*reach*p,tipY=s.y+Math.sin(s.angle)*reach*p;ctx.fillRect(Math.round(tipX/p)*p,Math.round(tipY/p)*p,p,p);ctx.restore();}}
  else {const glint=Math.floor((performance.now()||0)/1600*reach)%Math.max(1,reach);PixelArt.fillPx(ctx,s.x+Math.cos(s.angle)*(glint*p),s.y+Math.sin(s.angle)*(glint*p),'#ffffff');}
 }
 window.PixelKnight={drawWeapon};
})();