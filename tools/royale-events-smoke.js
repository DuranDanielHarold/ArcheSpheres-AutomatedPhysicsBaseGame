'use strict';
// Royale Session 4C browser smoke test. Run with: node tools/royale-events-smoke.js
// Requires Playwright (Chromium) installed in the local development environment.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const { chromium }=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
function serve(req,res){
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('not found');return;}res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);});
}
(async()=>{
 const server=http.createServer(serve);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',{waitUntil:'load'});
  const result=await page.evaluate(()=>{
   const ids=['meteorShower','earthquake','frostbite','magneticStorm','supplyDrop','riftPortals','plagueFog'];
   const missing=ids.filter(id=>!ROYALE_EVENT_REGISTRY[id]);
   if(missing.length)throw new Error('Missing Session 4C registrations: '+missing.join(','));
   gameMode='royale';newRoyaleBattle();paused=false;
   for(const id of ids){if(!window.royaleDebug.forceEvent(id))throw new Error('Could not force '+id);stepGameFrame(1/60);}
   resetRoyaleFramework();
   return {registered:ids,phaseCount:ROYALE_CONFIG.phases,config:ids.every(id=>!!ROYALE_EVENT_CONFIG[id])};
  });
  if(errors.length)throw new Error('Browser console errors: '+errors.join(' | '));
  console.log(JSON.stringify({ok:true,...result,consoleErrors:errors.length},null,2));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(err=>{console.error(err);process.exitCode=1;});
