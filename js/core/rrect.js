'use strict';
// ▓▓▓ MODULE: core/rrect.js — extracted from former js/entities.js ▓▓▓
// Rounded-rectangle canvas helper shared by weapons and entities.

function rrect(ctx,x,y,w,h,rad){
 const r=Math.min(rad,w/2,h/2);
 ctx.beginPath();
 ctx.moveTo(x+r,y);
 ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
 ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
 ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
 ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
 ctx.closePath();
}
// Vial types: 'purple'=poison DoT, 'yellow'=magDef shred+blind, 'green'=burn+knockback
