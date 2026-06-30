'use strict';
// ▓▓▓ MODULE: hud/hud.js — extracted from former js/engine.js ▓▓▓
// Ability bar and stat panel update helpers.

function updateAbBar(){
 for(const[fi,fid,side]of[[0,'acd-r','r'],[1,'acd-b','b']]){
   const s=getFactionDisplaySphere(fi);if(!s)continue;
   const fill=document.getElementById(fid);
    const thresh=getStackDisplayThreshold(s.key);
   const stackValue=s.key==='sheriff'?s.sheriffHitCount:s.stacks;
   const pct=Math.min(1,stackValue/thresh);
   fill.style.width=(pct*100)+'%';
   fill.style.background=pct>=1?'#ff4400':pct>=0.6?`hsl(${30+pct*30},95%,55%)`:'#e8b430';
   const hpPct=s.hp/s.maxHp;
   const hpCol=hpPct<0.30?'#ff4444':hpPct<0.55?'#ffaa22':'#44ee66';
   const hpEl=document.getElementById(`shp-${side}`);
   if(hpEl){hpEl.textContent=Math.ceil(s.hp)+'/'+s.maxHp;hpEl.style.color=hpCol;}
   const dmgEl=document.getElementById(`sd-${side}`);
   if(dmgEl){
    dmgEl.textContent=s.d.dmg.toFixed(1);
    dmgEl.style.color=s.lowHpBuffApplied?'#ff8800':s.d.dmg>DEF[s.key].dmg*1.005?'#ffdd44':'#ccddf0';
   }
   const armEl=document.getElementById(`sa-${side}`);
   if(armEl){
    armEl.textContent=s.d.arm;
    armEl.style.color=s.lowHpBuffApplied?'#ff8800':Math.abs(s.d.arm-DEF[s.key].arm)>1?'#ffdd44':'#ccddf0';
   }
   const mdefEl=document.getElementById(`smd-${side}`);
   if(mdefEl){
    mdefEl.textContent=s.d.magDef;
    const mdefBase=DEF[s.key].magDef;
    mdefEl.style.color=s.d.magDef<mdefBase-0.5?'#cc88ff':s.d.magDef>mdefBase*1.005?'#ffdd44':'#ccddf0';
   }
   const omEl=document.getElementById(`so-${side}`);
   if(omEl){
    omEl.textContent=Math.abs(s.omegaCur).toFixed(1);
    omEl.style.color=s.lowHpBuffApplied?'#ff8800':Math.abs(s.omegaCur)>s.d.om*1.05?'#ffdd44':'#ccddf0';
   }
   const stkEl=document.getElementById(`sst-${side}`);
   if(stkEl){
    const stackShown=Math.min(stackValue,thresh);
    stkEl.textContent=stackShown+'/'+thresh;
    stkEl.style.color=stackValue>=thresh?'#ff4400':stackValue>0?'#e8b430':'#556677';
   }
  }
 }
function fillStats(key,side){
 const d=DEF[key];
 const fac=side==='r'?0:1;
 const s=getFactionDisplaySphere(fac);
 const thresh=getStackDisplayThreshold(key);
 document.getElementById(`wn-${side}`).textContent=d.weapon;
 const hpEl=document.getElementById(`shp-${side}`);
 if(hpEl){hpEl.textContent=(s?Math.ceil(s.hp):d.hp)+'/'+(s?s.maxHp:d.hp);hpEl.style.color='#44ee66';}
 document.getElementById(`sd-${side}`).textContent=d.dmg.toFixed(1);
 document.getElementById(`sa-${side}`).textContent=d.arm;
 const mdefEl=document.getElementById(`smd-${side}`);
 if(mdefEl){mdefEl.textContent=d.magDef;mdefEl.style.color='#ccddf0';}
 document.getElementById(`so-${side}`).textContent=d.om.toFixed(1);
 const stkEl=document.getElementById(`sst-${side}`);
 if(stkEl){stkEl.textContent='0/'+thresh;stkEl.style.color='#556677';}
 document.getElementById(`abn-${side}`).textContent=d.ab;
 document.getElementById(side==='r'?'t-red':'t-blue').textContent=d.label;
 for(const id of[`sd-${side}`,`sa-${side}`,`so-${side}`])document.getElementById(id).style.color='#ccddf0';
}
