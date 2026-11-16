
document.documentElement.classList.add('js');
const IMAGES={living:'assets/room_living_61aa11ad420a.webp',tap:'assets/bath_button_2c575f6b647b.webp',room:'assets/room_twin_133272c11a02.webp',food:['assets/menu_bowl_01_55fa16e7db16.webp','assets/menu_bowl_02_1bd3d48c3221.webp','assets/menu_bowl_03_dcb71f6ecfd1.webp','assets/menu_bowl_04_5fb9acc60fb4.webp']};
const byId=(id)=>document.getElementById(id);
let moment='before',priority='room',deliver='proof';
const story={
 before:{image:IMAGES.living,label:'BEFORE THE STAY · 연출 시안',index:'SCENE 01 — 기대',question:'이 사진을 보신다면,<br>어떤 시간을 기대하시겠습니까?',answer:'침대의 크기, 공간의 따뜻함, 잠시 머무는 모습. 사진은 아직 만나지 않은 객실을 상상하게 합니다.',foot:'다음 순간을 눌러보세요. 같은 객실을 다른 시선으로 보게 됩니다.',alt:'객실에 사람이 머무는 이미지 연출 시안'},
 after:{image:IMAGES.tap,label:'DURING THE STAY · 현장 점검 사진',index:'SCENE 02 — 이용',question:'그런데 객실에 들어온 뒤,<br>버튼 하나 앞에서 멈춘다면?',answer:'잘 만들어진 공간에서도, 사용법을 모르는 순간 편안함이 끊어질 수 있습니다. 고객에게는 사진과 실제 이용이 하나의 경험입니다.',foot:'이 버튼의 사용법은 현장에서 확인한 뒤 객실 안내문으로 완성합니다.',alt:'욕조 수전에 안전 버튼 위치를 표시한 현장 사진'}
};
function setMoment(next){moment=next;let s=story[next];byId('momentImage').src=s.image;byId('momentImage').alt=s.alt;byId('momentLabel').textContent=s.label;byId('momentIndex').textContent=s.index;byId('momentQuestion').innerHTML=s.question;byId('momentAnswer').textContent=s.answer;byId('momentFoot').textContent=s.foot;byId('momentBefore').setAttribute('aria-pressed',next==='before');byId('momentAfter').setAttribute('aria-pressed',next==='after');}
byId('momentBefore').addEventListener('click',()=>setMoment('before'));byId('momentAfter').addEventListener('click',()=>setMoment('after'));
const photoScenes={space:{img:IMAGES.room,alt:'트윈 객실의 실제 구조를 보여주는 전경 시안',caption:'A · 침대 구성과 실제 동선을 먼저 이해합니다.'},mood:{img:IMAGES.living,alt:'인물이 등장하는 객실 연출 시안',caption:'B · 어떤 시간을 보낼지 상상하게 합니다. 실제 투숙객 사진은 아닙니다.'}};
document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.photo;byId('compareImg').src=photoScenes[key].img;byId('compareImg').alt=photoScenes[key].alt;byId('photoCopy').textContent=photoScenes[key].caption;document.querySelectorAll('[data-photo]').forEach(x=>x.setAttribute('aria-pressed',x===b));}));
const foods=[{title:'재료의 형태가 먼저 보이는 컷',text:'나물과 고기, 국물의 재료가 무엇인지 첫눈에 읽히는 장면입니다.'},{title:'붉은 국물의 인상을 남기는 컷',text:'같은 그릇이어도 국물의 색과 토핑이 메뉴의 차이를 보여줍니다.'},{title:'담백한 구성을 강조하는 컷',text:'두부와 채소의 재료감이 보입니다. 실제 판매명은 따로 확인해야 합니다.'},{title:'고기와 맑은 국물의 온기가 보이는 컷',text:'고기 단면과 국물의 색감이 분명합니다. 조식·식사 이미지의 역할을 검토할 수 있습니다.'}];
document.querySelectorAll('[data-food]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.food);byId('foodImage').src=IMAGES.food[i];byId('foodLabel').textContent='PHOTO 0'+(i+1)+' / 같은 그릇, 다른 내용';byId('foodTitle').textContent=foods[i].title;byId('foodText').textContent=foods[i].text;document.querySelectorAll('[data-food]').forEach(x=>x.setAttribute('aria-pressed',x===b));}));
const choices={room:{title:'객실의 첫 사진,<br>선택이 쉬워지는 배열',body:'객실 유형별로 먼저 보여야 할 전경을 정하고, 인물 연출은 실제 공간·조건과 어긋나지 않도록 검수합니다.',img:IMAGES.room,alt:'트윈 객실 실내 전경'},bath:{title:'작은 버튼부터,<br>편해지는 객실 안내',body:'욕조·하이오더·Wi-Fi 이용에서 손님이 직접 묻는 내용을 정확히 확인하고 한 장의 안내에 정리합니다.',img:IMAGES.tap,alt:'욕조 수전 버튼 점검 사진'},food:{title:'메뉴의 첫인상부터,<br>찾기 쉬운 마장동까지',body:'촬영한 음식의 역할을 구분하고 메뉴명·영업정보·현장 안내를 일치시키는 데서 시작합니다.',img:IMAGES.food[3],alt:'마장동 실제 뚝배기 음식'}};
const delivers={proof:'모바일 화면에서 첫 사진·안내 문구가 어떻게 보이는지 확인할 시안',sign:'현장에 부착할 안내물·포스터의 실제 크기와 문장 시안',plan:'어느 채널·장소에 언제 적용할지 확인하는 순서와 검수 항목'};
function updateChoice(){let c=choices[priority];byId('recommendTitle').innerHTML=c.title;byId('recommendBody').textContent=c.body;byId('recommendImage').src=c.img;byId('recommendImage').alt=c.alt;byId('recommendDeliver').textContent=delivers[deliver];document.querySelectorAll('[data-priority]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.priority===priority));document.querySelectorAll('[data-deliver]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.deliver===deliver));}
document.querySelectorAll('[data-priority]').forEach(b=>b.addEventListener('click',()=>{priority=b.dataset.priority;updateChoice();}));document.querySelectorAll('[data-deliver]').forEach(b=>b.addEventListener('click',()=>{deliver=b.dataset.deliver;updateChoice();}));
function summary(){return ['아르보호텔 × 마장동 / 다음 만남에서 함께 볼 이야기','우선으로 살펴볼 순간: '+({room:'예약 전에 객실을 쉽게 고르는 순간',bath:'객실에서 기기를 편하게 쓰는 순간',food:'마장동을 찾고 메뉴를 고르는 순간'})[priority],'먼저 보고 싶은 결과물: '+({proof:'모바일에서 보이는 사진·문안 시안',sign:'현장에 붙일 안내물·포스터 시안',plan:'채널 반영·검수 순서와 체크리스트'})[deliver],'마장동 우선 메뉴: '+(window.r8SurveySummary?window.r8SurveySummary().menu:'미선택'),'서비스 메뉴 방향: '+(window.r8SurveySummary?window.r8SurveySummary().service:'미선택'),'제안할 첫 작업: '+byId('recommendTitle').textContent.replace(/\s+/g,' '),'기존 계약 포함 업무를 먼저 대조하고, 신규 제작이 필요하면 범위와 조건을 사전 협의','추가 메모: '+(byId('memoNotes').value.trim()||'(없음)')].join('\n');}
async function copyText(text,node){try{if(navigator.clipboard?.writeText && window.isSecureContext){await navigator.clipboard.writeText(text);}else{let ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px;top:0;';document.body.appendChild(ta);ta.select();let ok=document.execCommand('copy');ta.remove();if(!ok)throw Error('copy unavailable');}node.textContent='복사했습니다. 메신저에 붙여 넣을 수 있습니다.';}catch(e){node.textContent='이 환경에서는 자동 복사가 어렵습니다. 내용을 선택해 직접 복사해 주세요.';}}
byId('copySelections').addEventListener('click',()=>copyText(summary(),byId('copyFeedback')));byId('copyMeeting').addEventListener('click',()=>copyText(summary(),byId('meetingFeedback')));
function reading(){const d=document.documentElement;const total=Math.max(1,d.scrollHeight-innerHeight);byId('reading').style.transform=`scaleX(${Math.min(1,scrollY/total)})`;}window.addEventListener('scroll',reading,{passive:true});reading();
if('IntersectionObserver'in window){let io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('[data-animate]').forEach(el=>io.observe(el));}else document.querySelectorAll('[data-animate]').forEach(el=>el.classList.add('visible'));



// R7: UI-only previews (nothing is posted to any platform).
(()=>{
const weeks=[
 {period:'10.04–10.10',num:13,note:'첫 관찰 주. 이후 증가 여부를 판단할 때 이 주만을 기준으로 삼지는 않습니다.'},
 {period:'10.11–10.17',num:35,note:'계약 문안의 10월 22일 착수일 이전에도 35건이었습니다.'},
 {period:'10.18–10.24',num:27,note:'10월 22일이 포함된 주간입니다. 주 단위 집계라 이전·이후를 분리할 수 없습니다.'},
 {period:'10.25–10.31',num:37,note:'이 화면에서 확인되는 가장 높은 주간 예약 수치입니다.'},
 {period:'11.01–11.07',num:32,note:'32건. 사진·광고·가격·판매 가능 객실의 차이는 별도 확인이 필요합니다.'},
 {period:'11.08–11.14',num:33,note:'33건. 바로 전주보다 1건 많지만 상승 추세 확정은 어렵습니다.'}
];
for(const btn of document.querySelectorAll('[data-week]')){
 btn.addEventListener('click',()=>{
   const i=Number(btn.dataset.week),w=weeks[i];
   document.querySelectorAll('[data-week]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));
   document.getElementById('weekPeriod').textContent=w.period;
   document.getElementById('weekValue').textContent=w.num+'건';
   document.getElementById('weekNote').textContent=w.note;
 });
}
const keywords={
 food:[
  {tag:'업체 식별',name:'사천 마장동 / 마장동',hint:'실제 이름으로 검색되는가',title:'‘사천 마장동’을 검색하면,<br>같은 식당을 찾을 수 있을까요?',why:'등록된 상호·업종·주소와 지도 위치부터 확인합니다. 이름 변경은 사실관계와 승인 기준을 먼저 확인합니다.',channel:'네이버 플레이스 · 티맵 · 카카오맵 · 공식 안내',caution:'사업자 등록 상호와 현재 검색 표시 상태는 검증 전입니다.'},
  {tag:'메뉴 선택',name:'갈비살 · 꽃살',hint:'대표님이 중요하게 보는 메뉴',title:'검색에서 찾은 메뉴를,<br>메뉴판에서도 바로 고를 수 있을까요?',why:'실제 메뉴명·판매 여부·제공량을 먼저 확인하고 사진·설명·배치의 역할을 나눕니다. 수익성은 대표님 의견을 기준으로 대조합니다.',channel:'네이버 메뉴·사진 · 식당 메뉴판 · 현장 포스터',caution:'높은 마진이라는 말씀은 아직 원가·판매량 자료로 검증하지 않았습니다.'},
  {tag:'메뉴 정보',name:'한우국밥 · 소머리국밥',hint:'손님이 찾는 메뉴와 사진',title:'손님이 찾는 것은,<br>가게 이름만이 아닙니다.',why:'실제 제공 중인 메뉴명, 원재료 표기, 운영시간과 사진을 맞춥니다. 한정 메뉴는 판매 조건을 확인합니다.',channel:'네이버 메뉴·사진 · 식당 안내 · 포스터',caution:'메뉴명과 판매 여부는 대표님 승인 후 게시합니다.'},
  {tag:'경험 콘텐츠',name:'사천의 아침 · 한 끼의 시간',hint:'조식·식사 이용을 설명',title:'호텔의 아침과 식당의 한 끼,<br>어떤 연결이 자연스러울까요?',why:'조식 포함 상품을 만들기 전 제공 인원·시간·메뉴·정산을 확인하고, 그 경험을 사진과 문장으로 전합니다.',channel:'OTA 조식 상품 · 호텔 홈페이지 · 식당 소식',caution:'조식 패키지는 아직 판매 확정 상품이 아닙니다.'}
 ],
 hotel:[
  {tag:'업체 식별',name:'아르보호텔 · 사천 호텔',hint:'동일한 호텔을 찾는가',title:'찾은 호텔과 예약하는 호텔이,<br>같은 곳으로 보일까요?',why:'상호·주소·지도 핀과 공식 예약 경로를 먼저 맞춥니다. 브랜드 병기 여부도 현장 승인값을 따릅니다.',channel:'홈페이지 · 네이버 · GBP · OTA',caution:'현재 공식 표기와 by 아늑 관계는 운영 확인 후 적용합니다.'},
  {tag:'객실 구분',name:'트윈 객실 · 특화 객실',hint:'객실별 실제 차이를 전달',title:'사진을 보기 전에,<br>무엇이 다른 방인지 알 수 있을까요?',why:'침대 구성·실제 시설·정원·이용 조건을 객실 유형별로 정리한 뒤 대표 이미지와 연결합니다.',channel:'NOL · 여기어때 · 호텔 홈페이지',caution:'특화시설은 해당 객실에 실제 제공되는 경우에만 사용합니다.'},
  {tag:'도착·이용',name:'사천 숙박 · 주차 · 객실 안내',hint:'방문 전 불안을 줄이는 정보',title:'도착한 뒤 헤매지 않도록,<br>검색부터 안내하겠습니다.',why:'차량 진입·주차·체크인·욕조·Wi-Fi처럼 손님이 실제로 묻는 질문을 확인된 답으로 정리합니다.',channel:'홈페이지 FAQ · 지도 · 현장 카드',caution:'체크인·주차·기기 조건은 최신 운영값 확인 후 반영합니다.'}
 ]
};
let business='food',idx=0;
const categories=document.getElementById('keywordCategories');
function paintKeywords(){
 categories.replaceChildren();
 keywords[business].forEach((k,i)=>{
 const b=document.createElement('button'); b.type='button';b.className='keyword-choice';b.setAttribute('aria-pressed',String(i===idx));
 const count=document.createElement('span'); count.textContent=String(i+1).padStart(2,'0');
 const copy=document.createElement('div');const bold=document.createElement('b');bold.textContent=k.name;const small=document.createElement('small');small.textContent=k.hint;
 copy.append(bold,small);b.append(count,copy);
 b.addEventListener('click',()=>{idx=i;paintKeywords();});categories.appendChild(b);
 });
 const k=keywords[business][idx];
 document.getElementById('keywordTopic').textContent=k.tag;
 document.getElementById('keywordHeadline').innerHTML=k.title;
 document.getElementById('keywordWhy').textContent=k.why;
 document.getElementById('keywordChannel').textContent=k.channel;
 document.getElementById('keywordCaution').textContent=k.caution;
 document.querySelectorAll('[data-business]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.business===business)));
}
document.querySelectorAll('[data-business]').forEach(b=>b.addEventListener('click',()=>{business=b.dataset.business;idx=0;paintKeywords()}));paintKeywords();
const guideCards=[...document.querySelectorAll('.guide-card')];
const guideScroller=document.getElementById('guideCards');
const tabs=[...document.querySelectorAll('[data-guide]')];
function guideActive(index,scroll=true){
  tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));
  guideCards.forEach((card,i)=>card.dataset.active=String(i===index));
  if(scroll && window.innerWidth<=820) guideScroller.scrollTo({left: guideCards[index].offsetLeft-guideCards[0].offsetLeft, behavior:'instant'});
}
tabs.forEach((tab,i)=>tab.addEventListener('click',()=>guideActive(i)));
guideActive(0,false);
if('IntersectionObserver' in window && guideCards.length){
  let observer=new IntersectionObserver(entries=>{
   if(window.innerWidth>820)return;
   const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
   if(active)guideActive(Number(active.target.dataset.step),false);
  },{root:guideScroller,threshold:[.55,.75]});guideCards.forEach(card=>observer.observe(card));
}
})();



// R8 · read-only family decision board. No data leaves this HTML.
(()=>{
  const state={menu:null,service:null};
  const menu={beef:'갈비살·꽃살의 차이를 알기 쉽게',meal:'조식·국물요리의 이용 선택을 쉽게',search:'마장동의 검색·지도 식별 개선',later:'다음 만남에서 우선순위 결정'};
  const service={codari:'코다리 우선 검토',yukhoe:'한우 육회 우선 검토',both:'육회·코다리 비교 후 결정',later:'서비스 결정 보류'};
  window.r8SurveySummary=()=>({menu:menu[state.menu]||'미선택',service:service[state.service]||'미선택'});
  const connect=(selector,property,dict)=>{
    document.querySelectorAll(selector).forEach(btn=>btn.addEventListener('click',()=>{
      state[property]=btn.dataset[property==='menu'?'r8menu':'r8service'];
      document.querySelectorAll(selector).forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));
    }));
  };
  connect('[data-r8menu]','menu',menu);
  connect('[data-r8service]','service',service);
  const info=document.getElementById('r8WeekInfo');
  const periods=['10월 18일–24일','10월 25일–31일','11월 1일–7일','11월 8일–14일'];
  const yeogi=[37,43,47,47],nol=[27,37,32,33];
  document.querySelectorAll('[data-r8week]').forEach(btn=>btn.addEventListener('click',()=>{
    const i=Number(btn.dataset.r8week);
    document.querySelectorAll('[data-r8week]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));
    info.replaceChildren();
    const b=document.createElement('b'),s=document.createElement('span');
    b.textContent=periods[i]; s.textContent=`여기어때 ${yeogi[i]}건 · NOL ${nol[i]}건. 차이는 ${yeogi[i]-nol[i]}건으로, 원인은 각 채널의 사진·가격·프로모션·방문 조건을 확인해야 알 수 있습니다.`;
    info.append(b,s);
  }));
})();



// R9 interaction hints and local-only answer preview.
(()=>{
  const next=document.getElementById('guideNext');
  if(next){
    next.addEventListener('click',()=>{
      const tabs=[...document.querySelectorAll('[data-guide]')];
      const active=tabs.findIndex(b=>b.getAttribute('aria-pressed')==='true');
      tabs[(active+1)%tabs.length]?.click();
    });
  }
  const summary=document.getElementById('r9LiveSummary');
  if(!summary)return;
  const groups=[
    ['가장 먼저', '[data-priority]'],
    ['보고 싶은 시안','[data-deliver]'],
    ['식당 메뉴','[data-r8menu]'],
    ['서비스 메뉴','[data-r8service]']
  ];
  function update(){
    summary.replaceChildren();
    groups.forEach(([title,selector])=>{
      const choice=[...document.querySelectorAll(selector)].find(b=>b.getAttribute('aria-pressed')==='true');
      const row=document.createElement('div');row.className='r9-preview-row';
      const label=document.createElement('span'),value=document.createElement('b');
      label.textContent=title;value.textContent=choice?.textContent.trim()||'아직 고르지 않으셨어요';
      row.append(label,value);summary.append(row);
    });
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-priority],[data-deliver],[data-r8menu],[data-r8service]'))requestAnimationFrame(update);
  });
  update();
})();
