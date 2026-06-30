'use strict';
// ▓▓▓ MODULE: ui/picker-styles.js — extracted from former js/ui.js ▓▓▓
// Picker/start-screen stylesheet injection.

function injectPickerStyles(){
 if(document.getElementById('ss-styles'))return;
 const st=document.createElement('style');st.id='ss-styles';
 st.textContent=`
 .ss-mbtn{font-family:'Press Start 2P',monospace;font-size:clamp(7px,2vw,11px);
  background:#1a2340;color:#e8b430;border:2px solid #8a6000;
  padding:12px 32px;cursor:pointer;letter-spacing:1px;
  box-shadow:4px 4px 0 #000;min-width:200px;text-align:left;}
 .ss-mbtn:hover{background:#243060;border-color:#e8b430;}
 .ss-mbtn:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #000;}
 #picker-screen{position:fixed;inset:0;background:#0d1520;z-index:99;display:flex;flex-direction:column;overflow:hidden;}
 #picker-header{background:#111a2e;border-bottom:2px solid #8a6000;padding:6px 10px;display:flex;align-items:center;gap:6px;flex-shrink:0;flex-wrap:wrap;}
 #picker-slots{display:flex;gap:4px;align-items:center;flex:1;overflow-x:auto;min-width:0;}
 .pslot{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1.1vw,6px);
  padding:4px 6px;border:2px solid #2a3a55;background:#111a2e;color:#4a6080;
  cursor:pointer;min-width:52px;text-align:center;}
 .pslot.active{border-color:#e8b430;color:#e8b430;background:#1e2a40;}
 .pslot-label{font-size:clamp(4px,0.9vw,5px);display:block;margin-bottom:1px;}
 .pslot-name{font-size:clamp(4px,1vw,6px);}
 .pslot.filled .pslot-name{color:#88cc44;}
 #picker-body{flex:1;display:flex;overflow:hidden;min-height:0;}
 #picker-grid{flex:1;overflow-y:auto;padding:8px;display:grid;
  grid-template-columns:repeat(auto-fill,minmax(clamp(80px,16vw,120px),1fr));gap:6px;align-content:start;}
 .pcard{background:#111a2e;border:2px solid #1e2e45;cursor:pointer;padding:8px 6px;
  display:flex;flex-direction:column;align-items:center;gap:3px;position:relative;}
 .pcard:hover{border-color:#8a6000;background:#182030;}
 .pcard.selected{border-color:#e8b430;background:#1c2840;}
 .pcard-icon{display:flex;align-items:center;justify-content:center;width:40px;height:40px;}
 .pcard-name{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);color:#ccddf0;text-align:center;}
 .pcard-role{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);padding:1px 4px;}
 .pcard-ab{font-family:'VT323',monospace;font-size:clamp(8px,1.6vw,11px);color:#7080a0;text-align:center;line-height:1.2;}
 .pcard-stats{display:flex;gap:5px;margin-top:2px;}
 .pstat{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#5070a0;text-align:center;}
 .pstat span{display:block;}
 #picker-detail{width:clamp(160px,26vw,240px);background:#0a1018;border-left:2px solid #1e2e45;
  overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;flex-shrink:0;}
 #picker-detail.hidden{display:none;}
 .dbar-wrap{margin-bottom:4px;}
 .dbar-labels{display:flex;justify-content:space-between;}
 .dbar-label{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#5070a0;}
 .dbar-val{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#ccddf0;}
 .dbar{height:4px;background:#1a2340;margin-top:2px;}
 .dbar-fill{height:100%;}
 .dstat-row{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #1a2340;}
 #detail-toggle{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);
  background:#1a2340;color:#6080a8;border:2px solid #2a3a50;padding:4px 8px;cursor:pointer;white-space:nowrap;}
 #detail-toggle.on{border-color:#e8b430;color:#e8b430;}
 #picker-launch{font-family:'Press Start 2P',monospace;font-size:clamp(5px,1.4vw,8px);
  background:#2a5010;color:#88cc44;border:2px solid #1a3008;padding:8px 16px;
  cursor:pointer;box-shadow:3px 3px 0 #000;letter-spacing:.5px;white-space:nowrap;}
 #picker-launch:hover{background:#3a6818;}
 #picker-launch:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #000;}
 #picker-back{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);
  background:#1a2340;color:#6080a8;border:2px solid #2a3a50;padding:6px 10px;cursor:pointer;white-space:nowrap;}
 #picker-back:hover{background:#243060;}
 #countdown-overlay{position:absolute;inset:0;background:rgba(0,0,0,.72);
  display:none;align-items:center;justify-content:center;z-index:30;flex-direction:column;gap:6px;}
 #countdown-overlay.show{display:flex;}
 #countdown-num{font-family:'Press Start 2P',monospace;font-size:clamp(48px,14vw,90px);
  color:#e8b430;text-shadow:0 0 24px #c8920a,4px 4px 0 #000;}
 #countdown-label{font-family:'VT323',monospace;font-size:clamp(14px,3.5vw,22px);color:#ccddf0;letter-spacing:3px;}
 @keyframes cdpop{0%{transform:scale(1.6);opacity:.4;}60%{transform:scale(0.95);}100%{transform:scale(1);opacity:1;}}
 .cd-pop{animation:cdpop .5s ease-out forwards;}
 `;
 document.head.appendChild(st);
}
