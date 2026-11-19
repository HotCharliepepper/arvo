import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {bookingAdapter} from './booking.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'site.data.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'media-manifest.json'),'utf8'));
const run=(args=[],cwd=root,env={})=>execFileSync(process.execPath,[path.join(cwd,'scripts/build.mjs'),...args],{encoding:'utf8',env:{...process.env,...env},stdio:'pipe'});
run(['--preview']);
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
test('eight R3 type IDs preserved',()=>{
 assert.deepEqual(data.rooms.map(r=>r.id),['standard','deluxe','twin','twinvip','vip','pc2','signature2','signature4']);
 assert.equal((html.match(/class="room-card"/g)||[]).length,8);
 for(const r of data.rooms)assert.ok(html.includes('<h3>'+r.name+'</h3>'));
});
test('intent data selects 3 / 4 / 4 distinct types',()=>{
 for(const [key,count] of [['work',3],['together',4],['rest',4]]){assert.equal(data.rooms.filter(r=>r.tags.includes(key)).length,count);assert.ok(html.includes('data-intent-filter="'+key+'"'));}
 assert.ok(html.includes('실시간 재고·가격 검색이 아닙니다'));
});
test('noindex in HTML and headers; no unapproved schema or canonical',()=>{
 assert.ok(html.includes('noindex,nofollow,noarchive'));
 assert.match(fs.readFileSync(path.join(root,'dist/_headers'),'utf8'),/X-Robots-Tag: noindex/);
 assert.ok(!html.includes('application/ld+json'));assert.ok(!html.includes('rel="canonical"'));
});
test('safe preview copies no supplied photo or video, even when locally present',()=>{
 assert.equal(files(path.join(root,'dist')).filter(p=>/\.(webp|avif|mp4|jpg)$/i.test(p)).length,0);
 assert.ok(!html.includes('assets/media/'));assert.ok(!html.includes('<video'));
});
test('outbound destinations match verified accommodation identities',()=>{
 for(const url of Object.values(bookingAdapter(data).channels))assert.ok(html.includes(url));
 for(const a of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))assert.match(a[0],/rel="noopener noreferrer"/);
 assert.equal(bookingAdapter(data).supportsTransactions,false);
});
test('no unverified phone, ratings, prices, occupancy or operating times',()=>{
 assert.ok(!html.includes('href="tel:'));
 for(const s of ['aggregateRating','priceRange','15:00','12:00','25대','29실','30실','예약 완료','결제하기'])assert.ok(!html.includes(s),s);
});
test('single H1, accessible filter state, native FAQ and skip link',()=>{
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.equal((html.match(/class="faq-item"/g)||[]).length,6);
 for(const s of ['aria-live="polite"','aria-controls="mobile-menu"','class="skip-link"'])assert.ok(html.includes(s));
 assert.ok(!/\{\{[A-Z_]+\}\}/.test(html));
});
test('all internal anchors point to unique real IDs',()=>{
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),m[1]);
});
test('production gate fails before touching last good preview',()=>{
 assert.throws(()=>run(['--production']),e=>String(e.stderr).includes('PUBLICATION BLOCKED'));
 assert.equal(fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),html);
});
test('direct booking and altered OTA IDs fail closed',()=>{
 for(const state of ['VENDIT_READY_FOR_QA','DIRECT_BOOKING_LIVE']){const fixture=structuredClone(data);fixture.booking.state=state;assert.throws(()=>bookingAdapter(fixture),/DIRECT BOOKING BLOCKED/);}
 const fixture=structuredClone(data);fixture.reservation.nol='https://example.com';assert.throws(()=>bookingAdapter(fixture),/re-verification/);
});
test('CI, Netlify and production reject private-media build',()=>{
 assert.throws(()=>run(['--preview','--local-media'],root,{CI:'true'}),e=>String(e.stderr).includes('PRIVATE REVIEW BLOCKED'));
 assert.throws(()=>run(['--preview','--local-media'],root,{NETLIFY:'true'}),e=>String(e.stderr).includes('PRIVATE REVIEW BLOCKED'));
 assert.throws(()=>run(['--production','--local-media']),e=>String(e.stderr).includes('PRIVATE REVIEW BLOCKED'));
});
test('private media bundling and deferred video; false string approvals do not leak',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'arvo-r4-'));
 try{
  for(const p of ['site.data.json','media-manifest.json','src/index.html','scripts/build.mjs','scripts/booking.mjs','assets/css/style.css','assets/js/site.js','assets/images/favicon.svg']){fs.mkdirSync(path.dirname(path.join(tmp,p)),{recursive:true});fs.copyFileSync(path.join(root,p),path.join(tmp,p));}
  fs.mkdirSync(path.join(tmp,'review-media'),{recursive:true});
  for(const a of Object.values(manifest.assets))for(const p of [a.webp,a.small,a.avif,a.src].filter(Boolean))fs.writeFileSync(path.join(tmp,p),'fixture');
  run(['--local-media'],tmp,{CI:'',NETLIFY:''});
  const reviewed=fs.readFileSync(path.join(tmp,'dist-review/index.html'),'utf8');
  assert.match(reviewed,/<source data-src="assets\/media\/room-film.mp4"/);
  assert.match(reviewed,/<video[^>]*preload="none"/);assert.ok(!/<video[^>]*autoplay/.test(reviewed));assert.ok(!/<source src=/.test(reviewed));
  assert.ok(fs.existsSync(path.join(tmp,'dist-review/assets/media/room-film.mp4')));
  run(['--preview'],tmp);assert.ok(!fs.existsSync(path.join(tmp,'dist/assets/media')));
  const m=structuredClone(manifest);m.assets.hero.rightsApproved='false';m.assets.hero.contentApproved='true';
  fs.writeFileSync(path.join(tmp,'media-manifest.json'),JSON.stringify(m));run(['--preview'],tmp);assert.ok(!fs.existsSync(path.join(tmp,'dist/assets/media')));
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
test('no external script, analytics, payment form or iframe',()=>{
 assert.ok(!/<script[^>]+src="https?:/.test(html));assert.ok(!/<form\b/.test(html));assert.ok(!/<iframe\b/.test(html));
 const js=fs.readFileSync(path.join(root,'assets/js/site.js'),'utf8');
 assert.ok(!/fetch\(|sendBeacon\(|localStorage\.|document\.cookie\s*=/.test(js));assert.ok(js.includes('prefers-reduced-motion'));
});
test('actual client script: purpose filters, menu close, Escape focus',()=>{
 const el=(dataset={})=>{const listeners={},attrs={},classes=new Set();return{dataset,hidden:false,textContent:'',listeners,focused:false,addEventListener(k,cb){listeners[k]=cb;},setAttribute(k,v){attrs[k]=String(v);},getAttribute(k){return attrs[k];},classList:{toggle(k,on){on?classes.add(k):classes.delete(k);}},click(){listeners.click?.();},focus(){this.focused=true;}};};
 const menu=el(),nav=el(),status=el();menu.setAttribute('aria-expanded','false');nav.hidden=true;
 const filters=['all','work','together','rest'].map(filter=>el({filter}));
 const cards=data.rooms.map(r=>el({tags:r.tags.join(' ')}));
 const intents=['work','together','rest'].map(intentFilter=>el({intentFilter}));
 const navLink=el(),events={};
 const document={querySelector(s){return {'.menu-toggle':menu,'#mobile-menu':nav,'#filter-status':status}[s]||null;},querySelectorAll(s){return {'.filter':filters,'.room-card':cards,'[data-intent-filter]':intents,'#mobile-menu a':[navLink]}[s]||[];},addEventListener(k,cb){events[k]=cb;}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/site.js'),'utf8'),{document,window:{matchMedia:()=>({addEventListener(){}})},console});
 const count=()=>cards.filter(c=>!c.hidden).length;
 assert.equal(count(),8);intents[0].click();assert.equal(count(),3);assert.equal(filters[1].getAttribute('aria-pressed'),'true');
 filters[2].click();assert.equal(count(),4);filters[3].click();assert.equal(count(),4);filters[0].click();assert.equal(count(),8);
 assert.match(status.textContent,/예약 가능 객실 수와 다릅니다/);
 menu.click();assert.equal(nav.hidden,false);events.keydown({key:'Escape'});assert.equal(nav.hidden,true);assert.equal(menu.focused,true);
 menu.click();navLink.click();assert.equal(nav.hidden,true);
});
