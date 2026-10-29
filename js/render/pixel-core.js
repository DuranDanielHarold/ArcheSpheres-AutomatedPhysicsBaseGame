'use strict';
// Pixel-only presentation helpers. Never called by balance simulations.
(function(){
 const PIXEL_KEYS=new Set(['knight','ranger']);
 let cachedPx=-1,bodyCache=new Map(),rotationCache=new Map(),spriteCache=new Map();
 let seed=0x6d2b79f5;
 function clear(){bodyCache.clear();rotationCache.clear();spriteCache.clear();}
 function px(){
  const short=Math.min(window.innerWidth||800,window.innerHeight||600);
  // Mirrors Sphere's constructor formula for the 0.095 mass band.
  const cap=short<=500?Math.min(390,short*.72):Math.min(660,short*.62);
  const refRadius=cap*.095;
  const value=Math.max(2,Math.round(refRadius/12));
  if(value!==cachedPx){cachedPx=value;clear();}
  return value;
 }
 function rand(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;}
 function enabled(){return window._pixelArt!==false&&!(window.location&&/[?&]pixel=0(?:&|$)/.test(window.location.search))&&!window._balanceNoVisuals;}
 function isPilot(key){return PIXEL_KEYS.has(key);}
 function artRadius(s){return Math.max(1,Math.round(s.radius/px()));}
 function fillPx(ctx,x,y,color){const p=px();ctx.fillStyle=color;ctx.fillRect(Math.round(x/p)*p,Math.round(y/p)*p,p,p);}
 function line(ctx,x0,y0,x1,y1,color,dash){
  let x=Math.round(x0),y=Math.round(y0),tx=Math.round(x1),ty=Math.round(y1),dx=Math.abs(tx-x),sx=x<tx?1:-1,dy=-Math.abs(ty-y),sy=y<ty?1:-1,err=dx+dy,i=0;
  while(true){if(!dash||Math.floor(i/Math.max(1,dash[0]))%Math.max(2,dash[0]+dash[1])<dash[0])fillPx(ctx,x,y,color);if(x===tx&&y===ty)break;const e=2*err;if(e>=dy){err+=dy;x+=sx;}if(e<=dx){err+=dx;y+=sy;}i++;}
 }
 function ring(ctx,cx,cy,r,color,dash){
  const pts=[];let x=Math.round(r),y=0,err=1-x;
  while(x>=y){pts.push([x,y], [y,x],[-y,x],[-x,y],[-x,-y],[-y,-x],[y,-x],[x,-y]);y++;if(err<0)err+=2*y+1;else{x--;err+=2*(y-x)+1;}}
  let i=0;for(const q of pts){if(!dash||Math.floor(i/Math.max(1,dash[0]))%Math.max(2,dash[0]+dash[1])<dash[0])fillPx(ctx,cx+q[0]*px(),cy+q[1]*px(),color);i++;}
 }
 function ditherDisc(ctx,cx,cy,r,color,coverage=.25){
  const p=px(),n=Math.ceil(r);for(let y=-n;y<=n;y++)for(let x=-n;x<=n;x++)if(x*x+y*y<=n*n&&((x+y)&1)===0&&(((x-y)%Math.max(2,Math.round(1/coverage)))===0))fillPx(ctx,cx+x*p,cy+y*p,color);
 }
 function makeSprite(rows,paletteMap){
  if(!enabled())return null;
  const sig=JSON.stringify(paletteMap),key=rows.join('\n')+'|'+sig+'|'+px();if(spriteCache.has(key))return spriteCache.get(key);
  const p=px(),w=Math.max(...rows.map(r=>r.length)),canvas=document.createElement('canvas');canvas.width=w;canvas.height=rows.length;
  const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
  for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++){const k=rows[y][x];if(k!=='.'&&paletteMap[k]){c.fillStyle=paletteMap[k];c.fillRect(x,y,1,1);}}
  const sprite={canvas,scale:p,width:w,height:rows.length};spriteCache.set(key,sprite);return sprite;
 }
 function bakeRotations(sprite,steps=48,pivot){
  if(!enabled()||!sprite)return [];
  const key=[sprite.canvas.width,sprite.canvas.height,sprite.scale,steps,pivot&&pivot.x,pivot&&pivot.y].join(':');if(rotationCache.has(key))return rotationCache.get(key);
  const frames=[],w=sprite.canvas.width,h=sprite.canvas.height,cx=pivot?pivot.x:w/2,cy=pivot?pivot.y:h/2,diag=Math.ceil(Math.hypot(w,h))+2;
  const source=document.createElement('canvas');source.width=w*4;source.height=h*4;const sc=source.getContext('2d');sc.imageSmoothingEnabled=false;sc.drawImage(sprite.canvas,0,0,w*4,h*4);
  for(let i=0;i<steps;i++){
   const angle=i*Math.PI*2/steps,canvas=document.createElement('canvas');canvas.width=diag;canvas.height=diag;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
   const image=c.createImageData(diag,diag),src=sc.getImageData(0,0,w*4,h*4),co=Math.cos(angle),si=Math.sin(angle);
   for(let y=0;y<diag;y++)for(let x=0;x<diag;x++){const dx=x-diag/2,dy=y-diag/2,sx=Math.floor(((dx*co+dy*si)+cx)*4),sy=Math.floor(((-dx*si+dy*co)+cy)*4);if(sx>=0&&sy>=0&&sx<w*4&&sy<h*4){const si4=(sy*w*4+sx)*4,di=(y*diag+x)*4;if(src.data[si4+3]>=128){image.data[di]=src.data[si4];image.data[di+1]=src.data[si4+1];image.data[di+2]=src.data[si4+2];image.data[di+3]=255;}}}
   c.putImageData(image,0,0);frames.push({canvas,width:diag,height:diag});
  }
  rotationCache.set(key,frames);return frames;
 }
 function blit(ctx,frame,cx,cy){
  if(!enabled()||!frame)return;const p=px(),w=frame.width*p,h=frame.height*p;ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.drawImage(frame.canvas,Math.round((cx-w/2)/p)*p,Math.round((cy-h/2)/p)*p,w,h);ctx.restore();
 }
 function drawBody(ctx,s){
  if(!enabled())return;
  const p=px(),ar=artRadius(s),d=s.d,key=s.key+':'+ar+':'+[d.out,d.color,d.dark,d.rim].join(':');let sprite=bodyCache.get(key);
  if(!sprite){const n=ar*2+1,can=document.createElement('canvas');can.width=n;can.height=n;const c=can.getContext('2d');c.imageSmoothingEnabled=false;
   for(let y=-ar;y<=ar;y++)for(let x=-ar;x<=ar;x++){const dist=x*x+y*y;if(dist>ar*ar)continue;let col=d.color;if(dist>=(ar-1)*(ar-1))col=d.out;else if(y>0&&dist>=(ar*.57)*(ar*.57))col=d.dark;else if(x+y< -ar*.7)col=d.rim;if(x*x+y*y<=2)col='#ffffff';c.fillStyle=col;c.fillRect(x+ar,y+ar,1,1);}
   sprite={canvas:can};bodyCache.set(key,sprite);
  }
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite.canvas,Math.round((s.x-ar*p)/p)*p,Math.round((s.y-ar*p)/p)*p, sprite.canvas.width*p,sprite.canvas.height*p);
  if(s.hitFlash>0){ctx.globalAlpha=Math.min(1,Math.ceil(s.hitFlash*3)/3)*.45;ctx.fillStyle='#ffff3c';ctx.fillRect(Math.round((s.x-ar*p)/p)*p,Math.round((s.y-ar*p)/p)*p,(ar*2+1)*p,(ar*2+1)*p);}
  ctx.restore();
 }
 function drawWeapon(ctx,s){if(!enabled()||!isPilot(s.key)||!s)return; if(s.key==='knight'&&window.PixelKnight)window.PixelKnight.drawWeapon(ctx,s);}
 function drawKnightOverlay(ctx,s){
  const p=px(),ar=artRadius(s),x=Math.round(s.x/p)*p,y=Math.round(s.y/p)*p,d=s.d;
  if(s.invincible){
   ditherDisc(ctx,x,y,ar+4,d.rim,.25);ring(ctx,x,y,ar+4,'#ffffff');
   // Two blocky top-left highlight arcs.
   for(let i=0;i<Math.max(2,ar/2);i++){fillPx(ctx,x-(ar+3-i)*p,y-(ar+2)*p,'#ffffff');fillPx(ctx,x-(ar+2)*p,y-(ar+3-i)*p,'#ffffff');}
   const pulse=Math.floor((performance.now()||0)/166.6667)%2;ring(ctx,x,y,ar+4+pulse,'#ffffff');
   if((s.invincibleT||0)<.6&&Math.floor((performance.now()||0)/100)%2===0)return;
  }
  if((s.stalwartStacks||0)>0){const lit=Math.ceil(s.stalwartStacks/5);for(let a=0;a<6;a++){const r=ar+2;for(let k=0;k<Math.max(2,Math.floor(r*.85));k++){const t=(a/6)+(k/(6*Math.max(2,Math.floor(r*.85))));if(a<lit){const xx=x+Math.round(Math.cos(t*Math.PI*2)*r)*p,yy=y+Math.round(Math.sin(t*Math.PI*2)*r)*p;fillPx(ctx,xx,yy,d.rim);}}}}
  if(s.stacks>0){const total=getStackDisplayThreshold(s.key),gap=3,start=-(total-1)*gap/2;for(let i=0;i<total;i++){const xx=x+(start+i*gap)*p,yy=y+(ar+Math.max(4,Math.round(15/p)))*p;for(let a=0;a<2;a++)for(let b=0;b<2;b++)fillPx(ctx,xx+a*p,yy+b*p,i<s.stacks?d.rim:'#334455');}}
  if(s.hitBuffStacks>0)ring(ctx,x,y,ar+2,'#ffdc50',[3,2]);
  if(s.lowHpBuffApplied)ring(ctx,x,y,ar+4,'#ff8800',[4,2]);
 }
 function drawPilotOverlay(ctx,s){if(enabled()&&s.key==='knight')drawKnightOverlay(ctx,s);}
 function drawGrid(ctx,w,h){if(!enabled()||!window._pixelGrid)return;const p=px();ctx.save();ctx.globalAlpha=.18;ctx.strokeStyle='#fff';ctx.lineWidth=1;for(let x=0;x<w;x+=p){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=p){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}ctx.restore();}
 window.addEventListener('resize',()=>{cachedPx=-1;clear();});window.addEventListener('orientationchange',()=>{cachedPx=-1;clear();});
 window.PixelArt={enabled,isPilot,px,artRadius,rand,makeSprite,bakeRotations,blit,fillPx,line,ring,ditherDisc,drawBody,drawWeapon,drawPilotOverlay,drawGrid};
})();