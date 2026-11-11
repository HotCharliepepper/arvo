/* ARVO R4.1 Hero playback. No analytics, cookies or external requests. */
(() => {
 'use strict';
 const root=document.querySelector('[data-hero]');
 const video=root?.querySelector('[data-hero-video]');
 const control=root?.querySelector('[data-hero-toggle]');
 if(!root||!video||!control)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let userPaused=false,failed=false;
 function label(playing){control.textContent=playing?'영상 일시정지 Ⅱ':'영상 재생 ▶';control.setAttribute('aria-pressed',String(playing));root.dataset.videoState=playing?'playing':'paused';}
 async function playFromIntent(){
  if(reduced.matches||document.hidden||userPaused||failed)return;
  try{await video.play();label(true);}catch{label(false);failed=true;video.hidden=true;control.textContent='영상 재생 시도 ↻';}
 }
 control.addEventListener('click',async()=>{
  if(!video.paused){userPaused=true;video.pause();label(false);return;}
  failed=false;userPaused=false;video.hidden=false;
  try{await video.play();label(true);}catch{failed=true;video.hidden=true;label(false);control.textContent='영상 재생 시도 ↻';}
 });
 video.addEventListener('error',()=>{failed=true;video.hidden=true;label(false);control.textContent='영상 재생 시도 ↻';});
 video.addEventListener('pause',()=>label(false));
 video.addEventListener('playing',()=>label(true));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){video.pause();}else if(!userPaused)playFromIntent();});
 reduced.addEventListener?.('change',e=>{if(e.matches){video.pause();video.hidden=true;label(false);}else{video.hidden=false;playFromIntent();}});
 if(reduced.matches){video.hidden=true;label(false);return;}
 label(false);
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting){video.pause();}else if(!userPaused)playFromIntent();}},{threshold:.2});
  observer.observe(root);
 }else playFromIntent();
})();
