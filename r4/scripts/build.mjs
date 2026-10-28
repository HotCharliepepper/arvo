import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bookingAdapter} from './booking.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'site.data.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'media-manifest.json'),'utf8'));
const production=process.argv.includes('--production');
const localMedia=process.argv.includes('--local-media');
if(localMedia&&(production||process.env.NETLIFY||process.env.CI)) throw new Error('PRIVATE REVIEW BLOCKED: local-media is never allowed in production, Netlify or CI');
const booking=bookingAdapter(data),b=data.business;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const knownRoom=id=>data.rooms.some(r=>r.id===id);
const publishedAssets=new Set();
const safePath=p=>typeof p==='string'&&/^review-media\/[a-z0-9-]+\.(webp|avif|mp4)$/.test(p);
const exists=p=>safePath(p)&&fs.existsSync(path.join(root,p))&&fs.statSync(path.join(root,p)).size>0;
const approved=m=>m?.rightsApproved===true&&m?.contentApproved===true&&(m?.role==='brand'||knownRoom(m?.roomId));
const available=key=>{const m=manifest.assets[key];return !!(m&&exists(m.webp||m.src)&&(localMedia||approved(m)));};
const asset=p=>{if(!exists(p)) throw new Error('Missing or unsafe asset: '+p);publishedAssets.add(p);return p.replace('review-media/','assets/media/');};
if(production) {
 const requirements={
  productionApproved:data.productionApproved===true,
  displayName:b.displayNameApproved===true,address:b.addressApproved===true,
  phone:b.phoneApproved===true&&/^\+?[0-9()\- ]{8,20}$/.test(b.phone),
  canonical:b.canonicalApproved===true&&/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(b.officialWebsite),
  business:b.legalInfoApproved===true&&!!b.legalDisplayName&&/^\d{3}-\d{2}-\d{5}$/.test(b.registrationNumber),
  category:b.schemaTypeApproved===true&&['Hotel','Motel','LodgingBusiness'].includes(b.schemaType),
  inventory:data.roomInventoryApproved===true&&data.rooms.every(r=>r.mappingApproved===true&&r.approvedDetails?.length>12&&available(r.photoId)),
  policies:data.policyApproved===true&&['checkin','parking','sauna','breakfast','children','cancel'].every(k=>data.approvedFaqAnswers?.[k]?.trim()),
  photoRights:data.photoRightsApproved===true,operationalReview:data.securityReviewClosed===true,
  hero:available('hero')&&manifest.assets.hero.role==='room'&&knownRoom(manifest.assets.hero.roomId),
  selectedMedia:['hero','sauna','bath','lamp','sign','filmPoster','film'].every(available),
  videoRelease:manifest.assets.film.peopleReleaseApproved===true,
  arrival:!!data.approvedGuide?.parking&&!!data.approvedGuide?.checkin,
  editorialRelease:data.editorial.publicationCopyApproved===true
 };
 const blocked=Object.keys(requirements).filter(k=>!requirements[k]);
 if(blocked.length) throw new Error('PUBLICATION BLOCKED — approval required: '+blocked.join(', '));
}
function picture(key,className='',eager=false) {
 const m=manifest.assets[key];
 if(!available(key)) return '<div class="photo-pending '+esc(className)+'" role="img" aria-label="'+esc(m?.pending||'객실 사진 확인 중')+'"><span class="pending-mark" aria-hidden="true">A</span><span>'+esc(m?.pending||'객실 사진 확인 중')+'<small>사진·객실 연결 확인 후 적용</small></span></div>';
 const avif=exists(m.avif)?'<source type="image/avif" srcset="'+asset(m.avif)+'">':'';
 const srcset=exists(m.small)?' srcset="'+asset(m.small)+' 640w, '+asset(m.webp)+' '+m.width+'w" sizes="(max-width: 700px) 100vw, 50vw"':'';
 return '<picture class="'+esc(className)+'">'+avif+'<img src="'+asset(m.webp)+'"'+srcset+' alt="'+esc(m.alt)+'" width="'+m.width+'" height="'+m.height+'" loading="'+(eager?'eager':'lazy')+'" decoding="async" '+(eager?'fetchpriority="high"':'')+'></picture>';
}
const external=(url,label,classes='',extra='')=>'<a class="'+classes+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer" '+extra+'>'+label+'<span aria-hidden="true">↗</span><span class="sr-only">(외부 사이트, 새 창)</span></a>';
const faqRows=[
 ['checkin','체크인과 체크아웃은 언제인가요?','체크인·체크아웃 적용 시간은 예약할 날짜와 상품 화면에서 확인해 주세요. 얼리 체크인·늦은 도착 등 개별 조건은 해당 채널의 숙소 문의로 확인할 수 있습니다.'],
 ['parking','주차와 차량 진입은 어떻게 확인하나요?','주차 가능 여부, 차량 제한과 진입 경로는 도착 전에 예약 채널의 숙소 안내에서 확인해 주세요. 입구·주차 실사와 현장 안내는 확인 후 추가합니다.'],
 ['sauna','모든 객실에 사우나가 있나요?','시그니처는 OTA에 사우나가 표시된 판매 유형입니다. 모든 객실의 공통 시설로 안내하지 않습니다. 현재 운영 상태·사용 시간·추가 요금은 선택한 상품에서 확인해 주세요.'],
 ['breakfast','조식이 숙박에 포함되나요?','조식 운영 여부와 포함 조건은 확인 중입니다. 포함 혜택으로 판단하기 전에 선택한 날짜의 판매 상품과 숙소 안내를 확인해 주세요.'],
 ['children','아동 동반과 추가 인원은 가능한가요?','아동 동반 및 추가 인원 규정은 확인 중입니다. 실제 투숙 인원과 연령, 객실의 허용 인원을 예약 전에 확인해 주세요.'],
 ['cancel','변경·취소·환불은 어디서 하나요?','선택한 객실·요금제·예약 채널에 따라 조건이 달라집니다. 결제 전 최종 조건을 확인하고, 예약한 채널에서 변경·취소 절차를 진행해 주세요.']
];
const cards=data.rooms.map((r,i)=>'<article class="room-card" data-room="'+esc(r.id)+'" data-tags="'+esc(r.tags.join(' '))+'"><div class="room-photo">'+picture(r.photoId)+'<span class="room-number">'+String(i+1).padStart(2,'0')+'</span><span class="room-en">'+esc(r.en)+'</span></div><div class="room-copy"><p class="room-label">'+esc(r.tagLabel)+'</p><h3>'+esc(r.name)+'</h3><p class="room-description">'+esc(r.description)+'</p><details class="room-details"><summary>선택 전 확인할 조건<span aria-hidden="true">+</span></summary><p>'+esc(production?r.approvedDetails:r.details)+'</p></details>'+external(booking.channels.nol,'NOL에서 유형 확인','text-link','data-outbound="nol" data-room-id="'+esc(r.id)+'"')+'</div></article>').join('\n');
const faq=faqRows.map(([id,q,a],i)=>'<details class="faq-item" id="faq-'+id+'"><summary><span class="faq-index">0'+(i+1)+'</span><span>'+q+'</span><span class="faq-icon" aria-hidden="true">+</span></summary><p>'+esc(production?data.approvedFaqAnswers[id]:a)+'</p></details>').join('\n');
const filmReady=available('film')&&available('filmPoster');
const film=filmReady?'<div class="film-frame" data-film>'+picture('filmPoster','film-poster')+'<video data-video controls playsinline preload="none" poster="'+asset(manifest.assets.filmPoster.webp)+'" aria-label="제공 원본에서 인물 없는 침대 장면을 발췌한 무음 객실 영상" aria-describedby="film-description" hidden><source data-src="'+asset(manifest.assets.film.src)+'" type="video/mp4">이 브라우저에서는 영상 재생을 지원하지 않습니다.</video><button type="button" class="film-toggle" data-video-toggle aria-pressed="false">객실 영상 재생 <span aria-hidden="true">▶</span></button><p class="film-status" data-video-status role="status" aria-live="polite">선택할 때만 영상을 불러옵니다.</p></div>':'<div class="film-frame">'+picture('filmPoster')+'<p class="film-status">실사 영상은 공개 사용 승인 후 연결됩니다.</p></div>';
const schema=production?'<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':b.schemaType,name:b.displayName,url:b.officialWebsite,telephone:b.phone,address:{'@type':'PostalAddress',streetAddress:b.address,addressCountry:'KR'}}).replace(/</g,'\\u003c')+'</script>':'';
const vars={
 ROBOTS:production?'index,follow':'noindex,nofollow,noarchive',
 MODE:production?'production':localMedia?'private-review':'public-preview',
 PRODUCTION_META:production?'<link rel="canonical" href="'+esc(b.officialWebsite)+'"><meta property="og:url" content="'+esc(b.officialWebsite)+'">'+schema:'',
 RIBBON:production?'':'<aside class="review-ribbon">R4 디자인 검토본 <span>· 운영 정보와 사진 공개 승인 전</span></aside>',
 HERO:picture('hero','hero-picture',true),
 HERO_CAPTION:production?'ARVO / SACHEON':available('hero')?'임시 공간 이미지 · 로비 사인 / 승인된 객실 전경으로 교체 예정':'사진 공개 승인 후 실사 적용 · 대표 객실 전경 확보 대기',
 ROOM_GUIDANCE:production?'시설·인원 조건은 선택한 날짜의 판매 상품에서도 확인해 주세요.':'객실명은 OTA 판매 유형 기준입니다. 침대·정원·시설과 객실별 사진은 운영 확인 중입니다.',
 ROOM_CARDS:cards,SAUNA:picture('sauna'),BATH:picture('bath'),
 MEDIA_REVIEW:production?'':'<span class="media-review">실사 검토용 · 객실·사용권 확인 전</span>',
 FILM:film,FILM_DURATION:filmReady?manifest.assets.film.durationLabel:'검토본에서 확인',
 SIGN:picture('sign'),LAMP:picture('lamp'),ADDRESS:esc(b.address),NAME:esc(b.displayName),
 MAP_LINK:external('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(b.address),'지도에서 주소 확인','text-link'),
 FAQ:faq,RESERVATION_LINKS:external(booking.channels.nol,'NOL에서 객실·요금 확인','btn btn-light','data-outbound="nol"')+external(booking.channels.yeogi,'여기어때에서 확인','btn btn-outline','data-outbound="yeogi"'),
 PHONE:b.phoneApproved===true&&/^\+?[0-9()\- ]{8,20}$/.test(b.phone)?'<a class="phone-link" href="tel:'+esc(b.phone)+'">전화 문의 '+esc(b.phone)+'</a>':'<p>전화 문의 경로는 공식 번호 확인 후 제공됩니다.</p>',
 FOOTER_LEGAL:production?'<p>'+esc(b.legalDisplayName)+' · '+esc(b.registrationNumber)+'</p>':'<p class="fine-print">검토본 · 운영·사업자·사진 공개 승인 전</p>'
};
const template=fs.readFileSync(path.join(root,'src/index.html'),'utf8');
const html=template.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{if(!(key in vars)) throw new Error('Unknown template token: '+key);return vars[key];});
const out=path.join(root,localMedia?'dist-review':'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'index.html'),html);
for(const p of ['assets/css/style.css','assets/js/site.js','assets/images/favicon.svg']) {fs.mkdirSync(path.dirname(path.join(out,p)),{recursive:true});fs.copyFileSync(path.join(root,p),path.join(out,p));}
for(const p of publishedAssets) {const dest=path.join(out,p.replace('review-media/','assets/media/'));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,p),dest);}
fs.writeFileSync(path.join(out,'robots.txt'),production?'User-agent: *\nAllow: /\nSitemap: '+b.officialWebsite.replace(/\/$/,'')+'/sitemap.xml\n':'User-agent: *\n# noindex supplied in HTML and response headers; allow it to be read.\n');
fs.writeFileSync(path.join(out,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n'+(production?'':'  X-Robots-Tag: noindex, nofollow, noarchive\n  Cache-Control: private, no-store\n'));
if(production) fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+esc(b.officialWebsite)+'</loc></url></urlset>');
fs.writeFileSync(path.join(out,'build-info.json'),JSON.stringify({version:data.releaseVersion,profile:production?'production':localMedia?'private-review':'public-preview',booking:booking.state,mediaFiles:publishedAssets.size,productionApproved:data.productionApproved},null,2));
console.log('Built '+(production?'production':localMedia?'private media review':'public-safe preview')+': '+data.rooms.length+' types, '+publishedAssets.size+' media files → '+out);
