(() => {
 'use strict';
 const $=(s,root=document)=>root.querySelector(s);
 const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
 const menuButton=$('.menu-toggle'),nav=$('#mobile-menu');
 const setMenu=open=>{menuButton?.setAttribute('aria-expanded',String(open));menuButton?.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');if(nav)nav.hidden=!open;};
 menuButton?.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
 $$('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true'){setMenu(false);menuButton.focus();}});
 window.matchMedia('(min-width: 801px)').addEventListener?.('change',e=>{if(e.matches)setMenu(false);});
 const filters=$$('.filter'),cards=$$('.room-card');
 function selectFilter(value) {
  if(!filters.some(b=>b.dataset.filter===value))return;
  filters.forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.filter===value));b.classList.toggle('is-active',b.dataset.filter===value);});
  let count=0;cards.forEach(card=>{card.hidden=value!=='all'&&!card.dataset.tags.split(' ').includes(value);if(!card.hidden)count++;});
  $('#filter-status').textContent=count+'개 유형 · 예약 가능 객실 수와 다릅니다.';
 }
 filters.forEach(b=>b.addEventListener('click',()=>selectFilter(b.dataset.filter)));
 $$('[data-intent-filter]').forEach(a=>a.addEventListener('click',()=>selectFilter(a.dataset.intentFilter)));
 const frame=$('[data-film]');if(!frame)return;
 const video=$('[data-video]',frame),source=$('source',video),toggle=$('[data-video-toggle]',frame),status=$('[data-video-status]',frame);
 let failed=false,pending=false,attempt=0,loadTimer;
 const sync=playing=>{toggle.setAttribute('aria-pressed',String(playing));toggle.textContent=playing?'영상 일시정지 Ⅱ':failed?'영상 다시 재생 ▶':'객실 영상 재생 ▶';};
 const stopLoading=()=>{clearTimeout(loadTimer);pending=false;toggle.disabled=false;};
 const fallback=()=>{attempt++;stopLoading();failed=true;video.pause();video.hidden=true;frame.dataset.active='false';sync(false);status.textContent='영상을 재생하지 못했습니다. 사진으로 살펴보거나 다시 시도해 주세요.';};
 toggle.addEventListener('click',async()=>{
  if(pending)return;
  if(!video.paused){video.pause();return;}
  const thisAttempt=++attempt;failed=false;pending=true;toggle.disabled=true;status.textContent='영상을 불러오는 중입니다. 잠시만 기다려 주세요.';
  if(!source.getAttribute('src')||video.error){source.src=source.dataset.src;video.load();}
  loadTimer=setTimeout(fallback,12000);
  try{await video.play();if(thisAttempt!==attempt){video.pause();return;}stopLoading();video.hidden=false;frame.dataset.active='true';sync(true);status.textContent='무음 실사 발췌 · 일시정지할 수 있습니다.';}
  catch{if(thisAttempt===attempt)fallback();}
 });
 video.addEventListener('playing',()=>{if(!failed){sync(true);status.textContent='무음 실사 발췌 · 일시정지할 수 있습니다.';}});
 video.addEventListener('pause',()=>{sync(false);if(!failed)status.textContent='일시정지됨 · 재생 버튼으로 이어볼 수 있습니다.';});
 video.addEventListener('ended',()=>{video.hidden=true;frame.dataset.active='false';sync(false);status.textContent='영상이 끝났습니다. 다시 볼 수 있습니다.';});
 // Empty data-src-only sources may raise an error before user intent. Ignore it.
 video.addEventListener('error',()=>{if(source.getAttribute('src'))fallback();});
 source.addEventListener('error',()=>{if(source.getAttribute('src'))fallback();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
 window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change',e=>{if(e.matches)video.pause();});
 // No autoplay, analytics, cookies, forms, storage, PMS or payment requests.
 // data-outbound describes navigation only, not bookings or revenue.
})();
