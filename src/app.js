/* ================= helpers ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=(n,c='')=>`<svg class="ic ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const todo=t=>`<span class="todo" title="Placeholder: Abdullah will add this">${ic('warning_20_filled','ic16')}To add: ${esc(t)}</span>`;
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const fmtTime=d=>d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
const isMobile=()=>matchMedia('(max-width:719px)').matches;
/* phone bottom bar: the first sections in desktop order; the rest go under More, in the same order */
const MOBILE_BAR=['activity','chat','about','experience'];

function avatar(kind='me',size=32,o={}){
  const s=`style="--s:${size}px${o.ring?';--ring:'+o.ring:''}"`;
  if(kind==='me'){
    const inner=CONFIG.photo?`<img src="${esc(CONFIG.photo)}" alt="" width="${size}" height="${size}" decoding="async">`:ME.initials;
    const pres=o.presence===false?'':`<span class="pres" title="${ME.status}">${size>=40?'<svg viewBox="0 0 16 16"><path d="M6.5 10.8 3.9 8.2l-.9.9 3.5 3.5 6.5-6.5-.9-.9z"/></svg>':''}</span>`;
    return `<span class="av" ${s} ${o.label?`role="img" aria-label="${esc(ME.name)}"`:'aria-hidden="true"'}>${inner}${pres}</span>`;
  }
  if(kind==='org'){ const lg=o.logo||(typeof LOGOS!=='undefined'&&LOGOS[o.text]);
    if(lg) return `<span class="av org logo" aria-hidden="true" style="--s:${size}px"><img src="${esc(lg)}" alt="" width="${size}" height="${size}" decoding="async"></span>`;
    return `<span class="av org" aria-hidden="true" style="--s:${size}px;background:${o.color};color:#fff">${esc(o.text)}</span>`; }
  if(kind==='app') return `<span class="av av-app sq" ${s} aria-hidden="true">${ic(o.icon,size<28?'ic16':'')}</span>`;
  if(kind==='you') return `<span class="av" ${s} aria-hidden="true">${ic('person_20_regular')}</span>`;
  return '';
}
async function copyText(t,okMsg='Copied'){
  try{ await navigator.clipboard.writeText(t); toast(okMsg); return true; }
  catch(e){ toast('Copy is blocked here. Select the text and press Ctrl+C.'); return false; }
}
let toastT; function toast(t){ $('#toastTxt').textContent=t; $('#toast').hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>$('#toast').hidden=true,2600); }

/* ================= apps (rail) ================= */
const READ=new Set(store.get('ws-read',[]));
const ACTIVITY=[
  {id:'welcome',name:'New message from Abdullah',pv:'Hi, I\'m Abdullah. Welcome to my portfolio.',tm:'Now',to:['chat','abdullah'],av:'me'},
  {id:'netsol',name:'Started a new role',pv:'Associate Software Engineer at NETSOL Technologies',tm:'Oct 2025',to:['experience','netsol'],av:'org:netsol'},
  {id:'data',name:'Data Analytics',pv:'How data runs through my work, from QA to models',tm:'2025',to:['analytics','overview'],av:'app:data_bar_vertical_24_regular'},
  {id:'auto',name:'Automation Lab',pv:'From C# UI suites to a Python BDD framework',tm:'2025',to:['automation','architecture'],av:'app:bot_24_regular'},
  {id:'caretrax',name:'Project: CareTrax',pv:'IoT insulin-drip monitor: ESP32, Firebase, Android',tm:'2025',to:['projects','caretrax'],av:'app:folder_24_regular',read:true},
  {id:'grad',name:'Graduated',pv:'BS Computer Science, Forman Christian College',tm:'2025',to:['about','education'],av:'org:fccu-ta',read:true},
  {id:'resume',name:'Abdullah shared a file with you',pv:'Abdullah-Farhat-Khokhar-Resume',tm:'2026',to:['resume','doc'],av:'app:document_24_regular',read:true},
];
const unreadCount=()=>ACTIVITY.filter(a=>!a.read&&!READ.has(a.id)).length;
const avFrom=(spec,size)=>{ if(spec==='me') return avatar('me',size,{ring:'var(--pane)'}); const [k,v]=spec.split(':'); if(k==='org'){const e=EXPERIENCE.find(x=>x.id===v);return avatar('org',size,{color:e.color,text:e.short});} return avatar('app',size,{icon:v}); };

const APPS=[
  {id:'activity',label:'Activity',icon:'alert',title:'Activity',def:'welcome',
    groups:()=>[{label:'Feed',items:ACTIVITY.map(a=>({id:a.id,name:a.name,pv:a.pv,tm:a.tm,av:avFrom(a.av,32),unread:!a.read&&!READ.has(a.id)}))}],
    view:id=>{ const a=ACTIVITY.find(x=>x.id===id)||ACTIVITY[0]; markRead(a.id); return appById(a.to[0]).view(a.to[1],true); } },
  {id:'chat',label:'Chat',icon:'chat',title:'Chat',def:'abdullah',
    groups:()=>[{label:'Pinned',items:[{id:'abdullah',name:ME.name,pv:lastPreview(),tm:fmtTime(CHAT.t0),av:avatar('me',32,{ring:'var(--pane)'})}]},
                {label:'Recent',items:[{id:'guide',name:'Portfolio guide',pv:'How to get around this portfolio',tm:'Pinned',av:avatar('app',32,{icon:'apps_20_regular'})}]}],
    view:id=>id==='guide'?guideView():chatView() },
  {id:'about',label:'About Me',icon:'person',title:'About Me',def:'intro',
    groups:()=>[{label:'About Me',items:[
      {id:'intro',name:'Introduction',pv:ME.headline,av:avatar('me',32,{ring:'var(--pane)'})},
      {id:'glance',name:'At a glance',pv:'Role, focus, location, links',av:licon('info_20_regular')},
      {id:'education',name:'Education',pv:'BS Computer Science, FCCU (2021–2025)',av:licon('hat_graduation_20_regular')},
      {id:'certs',name:'Certifications',pv:`${CERTS.length} credentials, Coursera`,av:licon('checkmark_circle_20_filled')} ]}],
    view:aboutView },
  {id:'experience',label:'Experience',icon:'briefcase',title:'Experience',def:'netsol',
    groups:()=>[{label:'Current',items:EXPERIENCE.slice(0,1).map(expItem)},{label:'Previous',items:EXPERIENCE.slice(1).map(expItem)}],
    view:expView },
  {id:'projects',label:'Projects',icon:'folder',title:'Projects',def:'movie',
    groups:()=>[{label:'Data science',items:PROJECTS.filter(p=>p.icon==='data_bar_vertical').map(projItem)},{label:'Engineering',items:PROJECTS.filter(p=>p.icon!=='data_bar_vertical').map(projItem)}],
    view:projView },
  {id:'analytics',label:'Data Analytics',short:'Analytics',icon:'data_bar_vertical',title:'Data Analytics',def:'overview',
    groups:()=>LABS.analyticsGroups(), view:id=>LABS.analyticsView(id) },
  {id:'automation',label:'Automation Lab',short:'Automation',icon:'bot',title:'Automation Lab',def:'architecture',
    groups:()=>LABS.automationGroups(), view:id=>LABS.automationView(id) },
  {id:'skills',label:'Skills',icon:'code',title:'Skills',def:'all',
    groups:()=>[{label:'Categories',items:[{id:'all',name:'All skills',pv:`${SKILLS.reduce((n,c)=>n+c.items.length,0)} skills in ${SKILLS.length} categories`,av:licon('apps_20_regular')},
      ...SKILLS.map((c,i)=>({id:'c'+i,name:c.cat,pv:c.items.slice(0,4).map(x=>x[0]).join(', ')+'…',av:licon('code_20_regular')}))]}],
    view:skillsView },
  {id:'resume',label:'Resume',icon:'document',title:'Resume',def:'doc',
    groups:()=>[{label:'Files',items:[{id:'doc',name:'Abdullah-Farhat-Khokhar-Resume',pv:'Resume · 1 page',av:licon('document_20_regular')},{id:'text',name:'Plain-text version',pv:'For copying into application forms',av:licon('text_bullet_list_20_regular')}]}],
    view:resumeView },
  {id:'contact',label:'Contact',icon:'mail',title:'Contact',def:'new',
    groups:()=>[{label:'Get in touch',items:[
      {id:'new',name:'New message',pv:'Write to Abdullah from here',av:licon('compose_20_regular')},
      {id:'email',name:'Email',pv:ME.email,av:licon('mail_20_regular')},
      {id:'li',name:'LinkedIn',pv:'linkedin.com/in/abdullahkhokhar1',av:licon('people_20_regular'),href:ME.linkedin},
      {id:'gh',name:'GitHub',pv:'github.com/abdullahkhokhar1',av:licon('code_20_regular'),href:ME.github} ]}],
    view:contactView },
];
const appById=id=>APPS.find(a=>a.id===id)||APPS[1];
function licon(n){ return `<span class="lic" aria-hidden="true">${ic(n)}</span>`; }
function expItem(e){ return {id:e.id,name:e.org,pv:e.role,tm:e.when.split(' – ')[0].replace(/^\w+ /,''),av:avatar('org',32,{color:e.color,text:e.short})}; }
function projItem(p){ return {id:p.id,name:p.name,pv:p.kind,tm:p.when,av:licon(p.icon==='bot'?'bot_24_regular':'data_bar_vertical_24_regular')}; }
function markRead(id){ if(!READ.has(id)){ READ.add(id); store.set('ws-read',[...READ]); renderRail(); if(st.app==='activity') renderList(); } }

/* ================= state + navigation ================= */
let st={app:'chat',item:'abdullah',tab:null}, hist=[], hi=-1, detailsOpen=store.get('ws-details',null);
function parseHash(){ const h=decodeURIComponent(location.hash.slice(1)); if(!h) return null; const i=h.indexOf('-'); const app=i<0?h:h.slice(0,i), item=i<0?null:h.slice(i+1); return APPS.some(a=>a.id===app)?{app,item}:null; }
function go(app,item,tab,o={}){
  const A=appById(app); item=item||A.def;
  st={app:A.id,item,tab:tab||null};
  if(o.push!==false){ hist=hist.slice(0,hi+1); hist.push({...st}); hi=hist.length-1; }
  const h='#'+A.id+(item&&item!==A.def?'-'+item:''); if(location.hash!==h){ try{ history.replaceState(null,'',h); }catch(e){ location.hash=h; } }
  /* phones: entering a section shows its list; only picking an item opens it */
  if(isMobile()&&o.detail!==undefined) $('#work').classList.toggle('detail',!!o.detail);
  render(); updateNav();
}
function updateNav(){ $('#navBack').disabled=hi<=0; $('#navFwd').disabled=hi>=hist.length-1; }
function navStep(d){ const n=hi+d; if(n<0||n>=hist.length) return; hi=n; const s=hist[hi]; go(s.app,s.item,s.tab,{push:false,detail:true}); }

/* ================= render ================= */
function renderRail(){
  const mobileKeep=MOBILE_BAR;
  const n=unreadCount();
  $('#rail').innerHTML=APPS.map((a,i)=>{
    const ri=a.icon+'_24_regular', fi=a.icon+'_24_filled';
    return `${i===APPS.length-1?'<div class="sp"></div>':''}<button class="ritem ${mobileKeep.includes(a.id)?'':'mhide'}" type="button" data-app="${a.id}" ${st.app===a.id?'aria-current="page"':''} aria-label="${a.label}${a.id==='activity'&&n?`, ${n} unread`:''}" data-tip="${a.label} (Ctrl+${i===9?0:i+1})">
      <svg class="ic ic24 r" aria-hidden="true"><use href="#i-${ri}"/></svg><svg class="ic ic24 f" aria-hidden="true"><use href="#i-${fi}"/></svg>
      <span class="lbl">${a.short||a.label}</span>${a.id==='activity'&&n?`<span class="badge">${n}</span>`:''}</button>`;
  }).join('')+`<button class="ritem mmore" type="button" id="railMore" aria-label="More sections" aria-haspopup="menu"><svg class="ic ic24" aria-hidden="true"><use href="#i-more_horizontal_24_regular"/></svg><span class="lbl">More</span></button>`;
}
const collapsed=new Set();
function renderList(){
  const A=appById(st.app); $('#listTitle').textContent=A.title;
  const f=$('#lfq').value.trim().toLowerCase();
  const html=A.groups().map(g=>{
    const items=g.items.filter(it=>!f||(it.name+' '+(it.pv||'')).toLowerCase().includes(f));
    if(!items.length) return '';
    const key=A.id+':'+g.label, open=!collapsed.has(key);
    return `<button class="lgroup" type="button" data-group="${esc(key)}" aria-expanded="${open}">${ic('chevron_down_20_regular')}${esc(g.label)}</button>`+
      (open?items.map(it=>{
        const tag=it.href?'a':'button', extra=it.href?`href="${it.href}" target="_blank" rel="noopener"`:`type="button" data-item="${it.id}"`;
        return `<${tag} class="litem ${it.unread?'unread':''}" role="option" ${extra} aria-selected="${!it.href&&st.item===it.id}">${it.av||''}<span class="txt"><span class="t1"><span class="nm">${esc(it.name)}</span>${it.tm?`<span class="tm">${esc(it.tm)}</span>`:''}</span>${it.pv?`<span class="pv">${esc(it.pv)}</span>`:''}</span>${it.href?ic('open_20_regular','ic16'):''}</${tag}>`;
      }).join(''):'');
  }).join('');
  $('#lscroll').innerHTML=html||`<p class="muted small" style="padding:8px 12px">Nothing matches “${esc(f)}”.</p>`;
}
let curView=null;
function renderMain(){
  const A=appById(st.app), v=A.view(st.item);
  curView=v; const tab=st.tab&&v.tabs&&v.tabs.some(t=>t.id===st.tab)?st.tab:(v.tabs?v.tabs[0].id:null); st.tab=tab;
  const hasD=!!v.details, dOpen=hasD&&(detailsOpen??(v.detailsAuto&&innerWidth>=1280));
  $('#mhead').innerHTML=`<button class="ibtn back" type="button" id="mBack" aria-label="Back to list">${ic('chevron_left_20_regular')}</button>
    <div class="who">${v.av||''}<${v.nameClick?'button type="button" class="nmb" data-card':'span style="display:grid;min-width:0"'}><span class="nm">${esc(v.title)}</span>${v.sub?`<span class="sub">${esc(v.sub)}</span>`:''}</${v.nameClick?'button':'span'}></div>
    ${v.tabs?`<div class="tabs" role="tablist">${v.tabs.map(t=>`<button class="tab" role="tab" type="button" data-tab="${t.id}" aria-selected="${t.id===tab}">${esc(t.label)}</button>`).join('')}</div>`:''}
    <div class="acts">${v.actions||''}${hasD?`<button class="ibtn" type="button" id="dToggle" data-tip="${dOpen?'Hide':'Show'} details" aria-label="${dOpen?'Hide':'Show'} details" aria-pressed="${dOpen}">${ic(dOpen?'info_20_filled':'info_20_regular')}</button>`:''}</div>`;
  const body=$('#mbody'); body.innerHTML=v.body(tab); body.scrollTop=0;
  $('#composer').hidden=!v.composer;
  const d=$('#details'); d.hidden=!dOpen; d.classList.toggle('auto',false);
  if(hasD){ const dd=v.details(); $('#dTitle').textContent=dd.title||'Details'; $('#dbody').innerHTML=dd.html; }
  v.mount&&v.mount(body,tab);
}
function render(){ renderRail(); renderList(); renderMain(); document.title=`${appById(st.app).label} | Abdullah Farhat Khokhar | Portfolio`; }

/* ================= chat ================= */
const CHAT={t0:new Date(Date.now()-4*60000),log:[]};
const STARTERS=['What do you do right now?','What data work have you done?','What does your automation work look like?','Can I see your projects?','How do I reach you?'];
CHAT.log=[
  {from:'me',t:CHAT.t0,html:`<p>Hi, I'm Abdullah. Welcome to my portfolio.</p>`},
  {from:'me',t:CHAT.t0,html:`<p>I'm an <b>Associate Software Engineer at NETSOL Technologies</b>, on the QA Automation team. Most of my work sits where automation meets data: test frameworks, backend validation and data verification.</p>`},
  {from:'me',t:CHAT.t0,html:`<p>Everything about my work is organized into the sections of this portfolio. Or ask me something here:</p>`,chips:STARTERS},
];
function lastPreview(){ const m=CHAT.log[CHAT.log.length-1]; const t=m.html.replace(/<[^>]+>/g,''); return (m.from==='you'?'You: ':'')+t.slice(0,80); }
function msgHTML(m,prev){
  const cont=prev&&prev.from===m.from&&(m.t-prev.t)<5*60000;
  if(m.from==='you') return `<div class="msg me ${cont?'cont':''}"><div class="meta">${fmtTime(m.t)}</div><div class="bub">${m.html}</div></div>`;
  return `<div class="msg ${cont?'cont':''}">${avatar('me',32,{ring:'var(--canvas)'})}<div class="meta"><button type="button" data-card>${ME.name}</button><span>${fmtTime(m.t)}</span></div>
    <div class="bub">${m.html}${m.chips?`<div class="chips">${m.chips.map(c=>`<button class="chip" type="button" data-ask="${esc(c)}">${esc(c)}</button>`).join('')}</div>`:''}${m.go?`<div class="chips"><button class="tbtn" type="button" data-go="${m.go.join(',')}">Open ${esc(appById(m.go[0]).label)} ${ic('chevron_right_20_regular','ic16')}</button></div>`:''}</div></div>`;
}
function chatView(){
  return {title:ME.name,sub:`${ME.status} · ${ME.title}, ${ME.org}`,av:avatar('me',32,{ring:'var(--canvas)'}),nameClick:true,
    tabs:[{id:'chat',label:'Chat'},{id:'shared',label:'Shared'}], composer:true,
    actions:`<button class="sbtn sm hide-m" type="button" data-go="contact,new">${ic('mail_20_regular','ic16')}Email</button>`,
    body:tab=>tab==='shared'?sharedTab():`<div class="feed" id="feed" aria-live="polite"><div class="day">Today</div>${CHAT.log.map((m,i)=>msgHTML(m,CHAT.log[i-1])).join('')}</div>`,
    mount:(b,tab)=>{ if(tab==='chat'){ b.scrollTop=b.scrollHeight; } },
    details:()=>({title:'Chat details',html:profileDetails()}), detailsAuto:true };
}
function sharedTab(){
  const links=[['document_20_regular','Abdullah-Farhat-Khokhar-Resume','Resume','resume,doc'],['people_20_regular','LinkedIn profile','linkedin.com',null,ME.linkedin],['code_20_regular','GitHub profile','github.com',null,ME.github]];
  return `<div class="page"><div class="secthead"><h2>Shared in this chat</h2><span class="note">${links.length} items</span></div><div class="tablewrap"><table class="dt"><thead><tr><th>Name</th><th>Type</th><th></th></tr></thead><tbody>${links.map(l=>`<tr><td><span style="display:inline-flex;gap:8px;align-items:center">${ic(l[0],'ic16')}${esc(l[1])}</span></td><td class="muted">${esc(l[2])}</td><td>${l[4]?`<a href="${l[4]}" target="_blank" rel="noopener">Open ↗</a>`:`<button class="tbtn" type="button" data-go="${l[3]}">Open</button>`}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function ageNow(){ const [y,m,d]=ME.born, n=new Date(); let a=n.getFullYear()-y; if(n.getMonth()+1<m||(n.getMonth()+1===m&&n.getDate()<d)) a--; return a; }
/* Extra answers that never appear as suggestions: name and age (age is worked out live). Birth-date questions get the normal reply. */
function hiddenAnswer(s){
  s=s.replace(/[’`]/g,"'").replace(/\s+/g,' ').trim();
  if(/\b(birthday|birth ?date|date of birth|dob|born|birth year|year of birth)\b/.test(s)) return {none:true};
  if(/\bhow old\b|\b(your|ur|yr|his)\s+age\b|\bage\s+(is|are)\s+(you|u)\b|^(age|ur age|your age)\s*\??$|\bwhat(?:'s| is|s)?\s+(the\s+)?age\s*\??$/.test(s)) return {a:`I'm ${ageNow()} years old.`,go:null};
  if(/\b(your|ur|yr|his)\s+(full |real |good |first |last |sur)?name\b|\bwho\s+(are|r)\s+(you|u)\b|\bwho\s+is\s+this\b|\bwhat\s+(should|do|can)\s+i\s+call\s+(you|u)\b|^(name|full name|ur name|your name)\s*\??$|\bwhat(?:'s| is|s)?\s+(the\s+)?name\s*\??$|\bintroduce\s+(yourself|urself)\b/.test(s)) return {a:`My name is <b>${ME.fullName}</b>.`,go:null};
  return null;
}
function answer(q){
  const s=q.toLowerCase(), h=hiddenAnswer(s); if(h) return h.none?null:h;
  let best=null,score=0;
  for(const f of FAQ){ let sc=0; for(const k of f.k){ if(s.includes(k)) sc+=k.length>3?2:1; } if(f.q.toLowerCase()===s) sc+=10; if(sc>score){score=sc;best=f;} }
  return score?best:null;
}
function ask(q){
  q=q.trim(); if(!q) return;
  CHAT.log.push({from:'you',t:new Date(),html:`<p>${esc(q)}</p>`});
  if(st.app!=='chat'||st.item!=='abdullah') go('chat','abdullah',null,{detail:true}); else renderMain();
  renderList();
  const feed=$('#feed'); if(!feed) return;
  feed.insertAdjacentHTML('beforeend',`<div class="msg" id="typing">${avatar('me',32,{ring:'var(--canvas)'})}<div class="meta"><b>${ME.name}</b></div><div class="bub typing" aria-label="Abdullah is typing"><i></i><i></i><i></i></div></div>`);
  $('#mbody').scrollTop=$('#mbody').scrollHeight;
  const f=answer(q);
  setTimeout(()=>{
    const m=f?{from:'me',t:new Date(),html:`<p>${f.a}</p>`,go:f.go&&f.go[0]!=='chat'?f.go:null}
      :{from:'me',t:new Date(),html:`<p>I haven't written an answer for that one yet. You can send the question to my inbox and I'll reply by email.</p>`,go:['contact','new'],q};
    if(!f) CHAT.pendingQ=q;
    CHAT.log.push(m); if(st.app==='chat'&&st.item==='abdullah'){ renderMain(); } renderList();
  }, matchMedia('(prefers-reduced-motion: reduce)').matches?150:750);
}
function guideView(){
  const tips=[
    ['Getting around','Pick any section. Each one opens a list, and the list opens the details, just like a chat or a channel.'],
    ['Search','Press <kbd class="k">Ctrl</kbd> + <kbd class="k">E</kbd> (or click Search at the top) to find a skill, a project or a role anywhere in the portfolio.'],
    ['Shortcuts','<kbd class="k">Ctrl</kbd> + <kbd class="k">1</kbd>…<kbd class="k">0</kbd> switch sections, <kbd class="k">Alt</kbd> + <kbd class="k">←</kbd>/<kbd class="k">→</kbd> go back and forward, and <kbd class="k">Ctrl</kbd> + <kbd class="k">.</kbd> lists every shortcut.'],
    ['Theme','Light and dark themes are under ··· at the top right.'] ];
  return {title:'Portfolio guide',sub:'Pinned',av:avatar('app',32,{icon:'apps_20_regular'}),
    body:()=>`<div class="feed"><div class="day">Pinned</div>${tips.map((t,i)=>`<div class="msg ${i?'cont':''}">${avatar('app',32,{icon:'apps_20_regular'})}<div class="meta"><b>Portfolio guide</b></div><div class="bub"><h3>${t[0]}</h3><p>${t[1]}</p></div></div>`).join('')}</div>` };
}

/* ================= profile ================= */
function localTime(){ try{ return new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit',timeZone:ME.tz}); }catch(e){ return ''; } }
function profileDetails(){
  return `<div class="dprofile">${avatar('me',96,{ring:'var(--canvas)'})}<div class="nm">${ME.name}</div><div class="sub">${ME.headline}</div>
     <div class="small" style="display:flex;gap:6px;align-items:center;color:var(--fg-3)"><i style="width:10px;height:10px;border-radius:50%;background:var(--presence);display:inline-block"></i>${ME.status}</div></div>
    <div class="dsec"><h3>Contact</h3>
      <button class="dlink tbtn" style="color:var(--fg);font-weight:400;width:100%" type="button" data-copy="${ME.email}">${ic('mail_20_regular')}<span style="overflow-wrap:anywhere">${ME.email}</span></button>
      <a class="dlink" href="${ME.linkedin}" target="_blank" rel="noopener">${ic('people_20_regular')}LinkedIn</a>
      <a class="dlink" href="${ME.github}" target="_blank" rel="noopener">${ic('code_20_regular')}GitHub</a></div>
    <div class="dsec"><h3>Organisation</h3><p>${ME.title}<br><span class="muted">${ME.org} · ${ME.location}</span></p><p class="small muted">${localTime()} local time (PKT)</p></div>
    <div class="dsec"><h3>Quick links</h3>
      <button class="dlink tbtn" style="color:var(--fg);font-weight:400;width:100%" type="button" data-go="resume,doc">${ic('document_20_regular')}Resume</button>
      <button class="dlink tbtn" style="color:var(--fg);font-weight:400;width:100%" type="button" data-go="projects,movie">${ic('folder_24_regular')}Projects</button>
      <button class="dlink tbtn" style="color:var(--fg);font-weight:400;width:100%" type="button" data-go="analytics,sql">${ic('data_bar_vertical_24_regular')}Data Analytics</button></div>`;
}
function cardHTML(){
  return `<div class="ctop">${avatar('me',64,{ring:'var(--surface)'})}<div style="min-width:0"><div class="nm">${ME.name}</div><div class="sub">${ME.title} · ${ME.org}</div><div class="st"><i></i>${ME.status}</div></div></div>
   <div class="cacts"><button class="pbtn sm" type="button" data-go="chat,abdullah">${ic('chat_24_regular','ic16')}Chat</button><button class="sbtn sm" type="button" data-go="contact,new">${ic('mail_20_regular','ic16')}Email</button><a class="sbtn sm" href="${ME.linkedin}" target="_blank" rel="noopener" style="text-decoration:none">${ic('people_20_regular','ic16')}LinkedIn</a></div>
   <div class="cinfo">
    <div class="r">${ic('mail_20_regular')}<span>${ME.email}</span><button class="ibtn" style="margin-left:auto;width:28px;height:28px" type="button" data-copy="${ME.email}" aria-label="Copy email address" data-tip="Copy">${ic('copy_20_regular','ic16')}</button></div>
    <div class="r">${ic('calendar_20_regular')}<span>${localTime()} local time · ${ME.location}</span></div>
    <div class="r">${ic('briefcase_24_regular')}<span>${ME.headline}</span></div>
    <div class="r">${ic('status_20_regular')}<span>Focus: ${esc(ME.focus)}</span></div>
    <button class="tbtn" type="button" data-go="about,intro" style="justify-self:start">View full profile ${ic('chevron_right_20_regular','ic16')}</button></div>`;
}

/* ================= about ================= */
function post(av,who,when,inner,foot=''){ return `<article class="post"><div class="ph">${av}<div class="meta"><b>${who}</b> · ${when}</div></div><div class="pb">${inner}</div>${foot}</article>`; }
const meAv=()=>avatar('me',32,{ring:'var(--surface)'});
const meName=`<button type="button" data-card class="tbtn" style="color:var(--fg-2);padding:0">${ME.name}</button>`;
function aboutView(id){
  const base={title:'About Me',av:avatar('app',32,{icon:'person_24_regular'}),details:()=>({title:'Profile',html:profileDetails()}),detailsAuto:true};
  if(id==='glance') return {...base,sub:'At a glance',body:()=>`<div class="page"><div class="secthead"><h2>At a glance</h2></div><div class="rows">
      ${[['Name',ME.fullName],['Headline',ME.headline],['Now',`${ME.title}, ${ME.org} (since Oct 2025)`],['Focus',ME.focus],['Degree','BS Computer Science, Forman Christian College, 2025'],['Based in',`${ME.location} (PKT, UTC+5)`],['Email',`${ME.email} <button class="tbtn" type="button" data-copy="${ME.email}">Copy</button>`],['Links',`<a href="${ME.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a> · <a href="${ME.github}" target="_blank" rel="noopener">GitHub ↗</a>`]].map(r=>`<div class="row"><div class="k">${r[0]}</div><div class="v">${r[1]}</div></div>`).join('')}</div></div>`};
  if(id==='education') return {...base,sub:'Education',body:()=>`<div class="page"><div class="secthead"><h2>Education</h2></div>${EDUCATION.map((e,ei)=>post(avatar('org',32,{color:e.color,text:e.short}),esc(e.org),e.when,`<h3>${e.title}</h3>${e.note?`<p class="muted">${e.note}</p>`:''}${e.courses?`<p><span class="lbl-s">Relevant courses</span><br>${e.courses}</p>`:''}`)+mediaPosts('edu:'+ei)).join('')}</div>`};
  if(id==='certs') return {...base,sub:'Certifications',body:()=>`<div class="page"><div class="secthead"><h2>Certifications</h2><span class="note">${CERTS.length} credentials · ${CERTS.reduce((n,c)=>n+(c.courses?c.courses.length:1),0)} courses</span></div><div class="tablewrap"><table class="dt certs"><thead><tr><th>Certificate</th><th>Type</th><th>Issuer</th></tr></thead><tbody>${CERTS.map(c=>`<tr><td><b>${esc(c.name)}</b>${c.courses?`<ol class="sublist">${c.courses.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:''}</td><td>${esc(c.kind||'')}</td><td>${c.issuer?esc(c.issuer):''}</td></tr>`).join('')}</tbody></table></div></div>`};
  return {...base,sub:'Introduction',body:()=>`<div class="page">
    <div class="hero">${CONFIG.portrait?`<img class="portrait" src="${esc(CONFIG.portrait)}" alt="Portrait of ${esc(ME.name)}" width="480" height="604" decoding="async">`:avatar('me',96,{ring:'var(--canvas)'})}
      <div class="hero-t"><h2>${ME.name}</h2><p class="hl">${ME.headline}</p><p class="small muted" style="display:flex;gap:6px;align-items:center"><i class="dot"></i>${ME.status} · ${ME.title}, ${ME.org} · ${ME.location}</p>
      <div class="chips"><button class="pbtn sm" type="button" data-go="chat,abdullah">${ic('chat_24_regular','ic16')}Chat with me</button><button class="sbtn sm" type="button" data-go="resume,doc">${ic('document_20_regular','ic16')}Resume</button><button class="sbtn sm" type="button" data-go="contact,new">${ic('mail_20_regular','ic16')}Email</button></div>
      </div></div></div>
    ${post(meAv(),meName,'Introduction',`<h3>Software engineer working where automation meets data.</h3>
      <p>At NETSOL Technologies I work on the QA Automation team, on enterprise client products. A lot of my day is automation and data verification in our Python BDD framework: making sure what an application shows matches what its APIs return and what its database stores.</p>
      <p>Before that I interned in data science at CodSoft, built RPA workflows at Systems Limited, and did data extraction work as a freelancer.</p>
      <p class="muted">“${esc(ME.quote)}”</p>`)}
    ${post(meAv(),meName,'What I work on',`<h3>What I work on</h3><div class="grid2">
      ${[['Test automation','C#, Playwright, .NET and Python BDD','Developed and maintained 150+ end-to-end automated test cases in C# across 3 enterprise products, later expanding into a Python-based BDD framework covering UI, regression, API, and backend testing.','automation,architecture'],
         ['Data and analytics','Python, SQL, pandas, visualisation','Data verification every day at NETSOL, and models on 10,000+ records at CodSoft with +20% accuracy over baseline.','analytics,overview'],
         ['Process automation','UiPath, AI-assisted automation','UiPath workflows for data processing across 6 projects at Systems Limited, and agentic automation for test coverage and regression flows at NETSOL.','automation,uipath'],
         ['Building things','ESP32, Firebase, Android','CareTrax, an IoT insulin-drip monitor with real-time alerts in under 5 seconds on average.','projects,caretrax']].map(c=>`<div class="box"><h4>${c[0]}</h4><p class="small muted">${c[1]}</p><p>${c[2]}</p><button class="tbtn" type="button" data-go="${c[3]}">Open ${ic('chevron_right_20_regular','ic16')}</button></div>`).join('')}</div>`)}</div>`};
}

/* ================= experience ================= */
const openThreads=new Set();
function expView(id){
  const e=EXPERIENCE.find(x=>x.id===id)||EXPERIENCE[0];
  return {title:e.org,sub:`${e.role} · ${e.when}`,av:avatar('org',32,{color:e.color,text:e.short}),
    tabs:[{id:'posts',label:'Posts'},{id:'details',label:'Responsibilities'}],
    body:tab=>tab==='details'?`<div class="page"><div class="secthead"><h2>${e.role}</h2><span class="note">${e.org} · ${e.when}</span></div><div class="rows">
        <div class="row"><div class="k">Summary</div><div class="v"><p>${esc(e.summary)}</p></div></div>
        <div class="row"><div class="k">Responsibilities</div><div class="v"><ul>${e.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div></div>
        <div class="row"><div class="k">Technologies</div><div class="v"><div class="tags">${e.tech.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div></div>
        <div class="row"><div class="k">Type · Location</div><div class="v">${e.type} · ${e.place}</div></div></div></div>`
      :`<div class="page">${expPost(e)}${mediaPosts('exp:'+e.id)}${EXPERIENCE.filter(x=>x!==e).length?`<p class="small muted">Other roles: ${EXPERIENCE.filter(x=>x!==e).map(x=>`<button class="tbtn" type="button" data-go="experience,${x.id}">${esc(x.org)}</button>`).join(' · ')}</p>`:''}</div>`,
    details:()=>({title:'About this role',html:`<div class="dprofile">${avatar('org',64,{color:e.color,text:e.short})}<div class="nm">${esc(e.org)}</div><div class="sub">${esc(e.role)}</div></div>
      <div class="dsec"><h3>Dates</h3><p>${e.when}</p></div><div class="dsec"><h3>Type · Location</h3><p>${e.type} · ${e.place}</p></div>
      <div class="dsec"><h3>Technologies</h3><div class="tags">${e.tech.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div>`}), detailsAuto:true };
}
function expPost(e){
  const open=openThreads.has(e.id);
  const replies=open?`<div class="replies">${e.points.map(p=>`<div class="reply">${avatar('me',24,{presence:false})}<div class="meta"><b>${ME.name}</b></div><p>${esc(p)}</p></div>`).join('')}</div>`:'';
  return post(meAv(),meName,e.when,`<h3>${esc(e.role)} at ${esc(e.org)}</h3><p>${esc(e.summary)}</p><div class="tags">${e.tech.slice(0,6).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`,
    `<div class="pf"><button class="tbtn" type="button" data-thread="${e.id}" aria-expanded="${open}">${ic(open?'chevron_down_20_regular':'arrow_reply_20_regular','ic16')}${open?'Collapse':`${e.points.length} replies from ${ME.name}`}</button></div>${replies}`);
}

/* ================= projects ================= */
function projView(id){
  const p=PROJECTS.find(x=>x.id===id)||PROJECTS[0];
  const res=p.results?`<p>${esc(p.results)}</p>`:'';
  const vids=VIDEOS.filter(v=>v.project===p.id);
  return {title:p.name,sub:p.kind,av:avatar('app',32,{icon:p.icon==='bot'?'bot_24_regular':'data_bar_vertical_24_regular'}),
    tabs:[{id:'overview',label:'Overview'},{id:'details',label:'Case study'},...(vids.length?[{id:'videos',label:'Videos'}]:[]),...(p.poster?[{id:'poster',label:'Poster'}]:[]),{id:'files',label:'Files'}],
    actions:p.link?`<a class="sbtn sm hide-m" href="${p.link}" target="_blank" rel="noopener" style="text-decoration:none">${ic('open_20_regular','ic16')}Notebook</a>`:'',
    body:tab=>{
      if(tab==='details') return `<div class="page"><div class="secthead"><h2>${esc(p.name)}</h2><span class="note">${esc(p.kind)}</span></div><div class="rows">
        <div class="row"><div class="k">Overview</div><div class="v"><p>${esc(p.overview)}</p></div></div>
        <div class="row"><div class="k">Problem</div><div class="v"><p>${esc(p.problem)}</p></div></div>
        <div class="row"><div class="k">Approach</div><div class="v"><ul>${p.approach.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>
        <div class="row"><div class="k">Technologies</div><div class="v"><div class="tags">${p.tech.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div></div>
        <div class="row"><div class="k">Implementation</div><div class="v"><ul>${p.impl.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>
        ${res?`<div class="row"><div class="k">Results</div><div class="v">${res}</div></div>`:''}</div></div>`;
      if(tab==='poster'&&p.poster) return `<div class="page"><div class="secthead"><h2>Project poster</h2><a class="note" href="${p.poster.full}" target="_blank" rel="noopener">Open full size ↗</a></div><img class="poster" src="${p.poster.full}" width="${p.poster.w}" height="${p.poster.h}" alt="${esc(p.name)} project poster: problem statement, solution, system architecture, key features, technologies, hardware and team" loading="lazy"></div>`;
      if(tab==='videos') return `<div class="page"><div class="secthead"><h2>Videos</h2><span class="note">${vids.length} video${vids.length>1?'s':''}</span></div><div class="vgrid">${vids.map(videoCard).join('')}</div></div>`;
      if(tab==='files') return `<div class="page"><div class="secthead"><h2>Files</h2></div><div class="tablewrap"><table class="dt"><thead><tr><th>Name</th><th>Location</th><th></th></tr></thead><tbody>
        ${p.link?`<tr><td>${ic('code_20_regular','ic16')} ${esc(p.name)}.ipynb</td><td class="muted">GitHub · abdullahkhokhar1/CODSOFT</td><td><a href="${p.link}" target="_blank" rel="noopener">Open ↗</a></td></tr>`:''}${p.poster?`<tr><td>${ic('image_20_regular','ic16')} ${esc(p.name)} poster</td><td class="muted">Project poster</td><td><button class="linkbtn" type="button" data-tab-go="poster">View</button></td></tr>`:''}</tbody></table></div></div>`;
      return `<div class="page">${post(meAv(),meName,p.when,`<h3>${esc(p.name)}</h3><p>${esc(p.overview)}</p><p><span class="lbl-s">The problem</span><br>${esc(p.problem)}</p>${res?`<p><span class="lbl-s">Results</span><br>${esc(p.results)}</p>`:''}${vids.slice(0,1).map(videoCard).join('')}${p.poster?posterCard(p):''}<div class="tags">${p.tech.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`,
        `<div class="pf"><button class="tbtn" type="button" data-tab-go="details">${ic('text_bullet_list_20_regular','ic16')}Read the case study</button>${p.link?`<a class="tbtn" href="${p.link}" target="_blank" rel="noopener">${ic('open_20_regular','ic16')}Open notebook</a>`:''}</div>`)}</div>`;
    },
    details:()=>({title:'Project details',html:`<div class="dsec"><h3>Type</h3><p>${esc(p.kind)}</p></div><div class="dsec"><h3>Year</h3><p>${p.when}</p></div>
      <div class="dsec"><h3>Technologies</h3><div class="tags">${p.tech.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div>
      <div class="dsec"><h3>Links</h3>${p.link?`<a class="dlink" href="${p.link}" target="_blank" rel="noopener">${ic('code_20_regular')}Notebook on GitHub</a>`:''}${p.poster?`<button class="dlink tbtn" type="button" data-tab-go="poster">${ic('image_20_regular')}Project poster</button>`:''}</div>
      <div class="dsec"><h3>Other projects</h3>${PROJECTS.filter(x=>x!==p).map(x=>`<button class="dlink tbtn" style="color:var(--fg);font-weight:400;width:100%" type="button" data-go="projects,${x.id}">${ic('folder_24_regular')}${esc(x.name)}</button>`).join('')}</div>`}), detailsAuto:true };
}

/* Teams-style video attachment: poster with a play button; plays inline, links to the LinkedIn post */
const liUrn=v=>{ if(v.embed) return v.embed; const u=v.linkedin||''; let m=u.match(/urn:li:(?:activity|ugcPost|share):\d+/); if(m) return m[0]; m=u.match(/(activity|ugcPost|share)-(\d{15,})/); return m?`urn:li:${m[1]}:${m[2]}`:null; };
function videoCard(v){
  const i=VIDEOS.indexOf(v), urn=!v.src&&liUrn(v);
  const thumb=urn?`<button class="vthumb li-thumb" type="button" data-embed="${i}" aria-label="Play video: ${esc(v.title)}" ${v.poster?`style="background-image:url('${esc(v.poster)}')"`:''}><span class="play"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg></span><span class="vhint">Play the LinkedIn post here</span></button>`
    :v.src?`<button class="vthumb" type="button" data-play="${i}" aria-label="Play video: ${esc(v.title)}" ${v.poster?`style="background-image:url('${esc(v.poster)}')"`:''}><span class="play"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg></span>${v.duration?`<span class="dur">${esc(v.duration)}</span>`:''}</button>`
    :`<a class="vthumb" href="${esc(v.linkedin)}" target="_blank" rel="noopener" aria-label="Watch on LinkedIn: ${esc(v.title)}" ${v.poster?`style="background-image:url('${esc(v.poster)}')"`:''}><span class="play"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg></span></a>`;
  return `<div class="vcard" data-vcard="${i}">${thumb}<div class="vmeta"><span class="li" aria-hidden="true">in</span><span class="vt"><b>${esc(v.title)}</b><span>LinkedIn${v.posted?' · '+esc(v.posted):''}</span></span>${v.linkedin?`<a class="ibtn" href="${esc(v.linkedin)}" target="_blank" rel="noopener" data-tip="Open the post on LinkedIn" aria-label="Open the post on LinkedIn">${ic('open_20_regular')}</a>`:''}</div></div>`;
}

function posterCard(p){ return `<div class="vcard mcard"><button class="mthumb pthumb" type="button" data-tab-go="poster" aria-label="View the ${esc(p.name)} poster"><img src="${p.poster.thumb}" width="${p.poster.tw}" height="${p.poster.th}" alt="Top of the ${esc(p.name)} project poster" loading="lazy"></button><div class="vmeta"><span class="li fi" aria-hidden="true">${ic('image_20_regular','ic16')}</span><span class="vt"><b>${esc(p.name)} poster</b><span>Final-year project · ${p.when}</span></span><button class="ibtn" type="button" data-tab-go="poster" data-tip="View the full poster" aria-label="View the full poster">${ic('open_20_regular')}</button></div></div>`; }
/* Teams-style image attachment from a post; click opens a larger view */
function mediaCard(m){
  const i=MEDIA.indexOf(m), many=m.imgs.length>1;
  const pics=m.imgs.map((g,k)=>`<button class="mthumb" type="button" data-media="${i},${k}" aria-label="View larger: ${esc(g.alt)}"><img src="${esc(g.src)}" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async"></button>`).join('');
  return `<div class="vcard mcard"><div class="mgrid${many?' many':''}">${pics}</div><div class="vmeta"><span class="li" aria-hidden="true">in</span><span class="vt"><b>${esc(m.title)}</b><span>LinkedIn · ${esc(m.posted)}</span></span><a class="ibtn" href="${esc(m.linkedin)}" target="_blank" rel="noopener" data-tip="Open the post on LinkedIn" aria-label="Open the post on LinkedIn">${ic('open_20_regular')}</a></div></div>`;
}
const mediaPosts=where=>MEDIA.filter(m=>m.where===where).map(m=>post(meAv(),meName,m.posted,`<p>${esc(m.text)}</p>${mediaCard(m)}`)).join('');

/* ================= skills ================= */
function skillsView(id){
  const cats=id&&id.startsWith('c')?[SKILLS[+id.slice(1)]].filter(Boolean):SKILLS;
  const n=cats.reduce((k,c)=>k+c.items.length,0);
  return {title:id==='all'||!id.startsWith('c')?'All skills':cats[0].cat,sub:'Skills',av:avatar('app',32,{icon:'code_24_regular'}),
    body:()=>`<div class="page"><div class="toolbar"><div class="field" style="flex:1;min-width:200px"><label class="sr" for="skq">Filter skills</label><input id="skq" type="text" placeholder="Filter skills, e.g. Python" autocomplete="off"></div><span class="small muted" id="skn">${n} skills</span></div>
      <div class="skcats" id="skt">${cats.map(c=>`<section class="box skcat"><h3>${esc(c.cat)}</h3><div class="tags">${c.items.map(s=>`<span class="tag" data-s="${esc(s[0].toLowerCase())}">${esc(s[0])}</span>`).join('')}</div></section>`).join('')}</div>
      <p class="small muted" id="sknone" hidden>No skills match that filter.</p></div>`,
    mount:b=>{ const q=$('#skq',b); q.addEventListener('input',()=>{ const v=q.value.trim().toLowerCase(); let k=0; $$('.skcat',b).forEach(sec=>{ let m=0; $$('.tag',sec).forEach(t=>{ const ok=!v||t.dataset.s.includes(v); t.hidden=!ok; m+=ok; }); sec.hidden=!m; k+=m; }); $('#skn',b).textContent=`${k} skill${k===1?'':'s'}`; $('#sknone',b).hidden=!!k; }); } };
}

/* ================= resume ================= */
function resumeView(id){
  const pdf=CONFIG.resumePdf;
  const acts=`${pdf?`<a class="pbtn sm" href="${pdf}" download style="text-decoration:none" aria-label="Download PDF">${ic('arrow_download_20_regular','ic16')}<span class="bl">Download PDF</span></a><a class="sbtn sm hide-m" href="${pdf}" target="_blank" rel="noopener" style="text-decoration:none">${ic('open_20_regular','ic16')}Open</a>`:''}<button class="sbtn sm" type="button" data-copytext="${esc(RESUME_TEXT)}" data-okmsg="Resume text copied" aria-label="Copy text">${ic('copy_20_regular','ic16')}<span class="bl">Copy text</span></button>`;
  if(id==='text') return {title:'Plain-text version',sub:'Resume',av:avatar('app',32,{icon:'text_bullet_list_20_regular'}),actions:acts,body:()=>`<div class="page"><div class="box plain" tabindex="0" aria-label="Resume as plain text">${esc(RESUME_TEXT)}</div></div>`};
  return {title:'Abdullah-Farhat-Khokhar-Resume',sub:'PDF · 1 page',av:avatar('app',32,{icon:'document_24_regular'}),actions:acts,
    body:()=>`<div class="docview"><figure class="resdoc"><img src="${CONFIG.resumeImg}" width="1530" height="1980" alt="Resume of ${ME.fullName}, page 1. The plain-text version has the same content."></figure><a class="show-m zoomlink" href="${CONFIG.resumeImg}" target="_blank" rel="noopener">${ic('open_20_regular','ic16')}Open full size to zoom</a></div>`};
}

/* ================= contact ================= */
const DRAFT=store.get('ws-draft',{name:'',email:'',subject:'',message:''});
function contactView(id){
  if(id==='email') return {title:'Email',sub:'Contact',av:avatar('app',32,{icon:'mail_24_regular'}),
    body:()=>`<div class="page cpage"><div class="secthead"><h2>Email Abdullah</h2></div><div class="compose">
      <div class="mailcard"><span class="micon">${ic('mail_24_regular')}</span><div class="mtext"><span class="small muted">Email address</span><span class="addr">${ME.email}</span></div></div>
      <div class="cfoot"><span class="small muted">If your mail app doesn't open, copy the address instead.</span><div class="toolbar"><button class="sbtn sm" type="button" data-mailto="mailto:${ME.email}">${ic('mail_20_regular','ic16')}Open in mail app</button><button class="pbtn sm" type="button" data-copy="${ME.email}">${ic('copy_20_regular','ic16')}Copy address</button></div></div>
    </div></div>`};
  return {title:'New message',sub:`To ${ME.name}`,av:avatar('me',32,{ring:'var(--canvas)'}),nameClick:true,
    body:()=>`<div class="page cpage"><form class="compose" id="mailForm" novalidate>
      <div class="chead"><span class="lab">To</span><span class="pill">${avatar('me',24,{presence:false})}${ME.name}</span><span class="small muted addr">${ME.email}</span></div>
      <div class="cbody">
        <div class="grid2"><div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" value="${esc(DRAFT.name)}" placeholder="Jane Doe"><span class="err" id="e-name"></span></div>
        <div class="field"><label for="f-email">Your email</label><input id="f-email" name="email" type="email" autocomplete="email" value="${esc(DRAFT.email)}" placeholder="you@company.com"><span class="err" id="e-email"></span></div></div>
        <div class="field"><label for="f-subject">Subject</label><input id="f-subject" name="subject" value="${esc(DRAFT.subject)}" placeholder="Let's talk"></div>
        <div class="field"><label for="f-message">Message</label><textarea id="f-message" name="message" placeholder="Hi Abdullah, I saw your portfolio…">${esc(DRAFT.message||(CHAT.pendingQ?`Hi Abdullah, a question from your portfolio chat: ${CHAT.pendingQ}`:''))}</textarea><span class="err" id="e-message"></span></div>
        <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
        <div id="f-status" role="status"></div>
      </div>
      <div class="cfoot"><span class="small muted">Your draft is saved in this browser.</span><div class="toolbar"><button class="sbtn" type="button" id="f-clear">Discard</button><button class="pbtn" type="submit" id="f-send">${ic('send_20_filled','ic16')}Send</button></div></div>
    </form></div>`,
    mount:b=>mountMail(b) };
}
/* Open a mailto: link without navigating this page. Inside an embedded frame a plain mailto link
   replaces the frame and leaves it blank, so there it goes through a new window instead. */
function openMail(href){
  let left=false; const onBlur=()=>{left=true;};
  window.addEventListener('blur',onBlur,{once:true});
  try{
    if(window.top===window){ const a=document.createElement('a'); a.href=href; a.style.display='none'; document.body.appendChild(a); a.click(); a.remove(); }
    else window.open(href,'_blank','noopener');
  }catch(e){}
  setTimeout(()=>{ window.removeEventListener('blur',onBlur); if(!left&&!document.hidden) toast("Your mail app didn't open. Use Copy address instead."); },1500);
}
function mountMail(b){
  const f=$('#mailForm',b), save=()=>{ ['name','email','subject','message'].forEach(k=>DRAFT[k]=f.elements[k].value); store.set('ws-draft',DRAFT); };
  f.addEventListener('input',save);
  $('#f-clear',b).addEventListener('click',()=>{ ['name','email','subject','message'].forEach(k=>{DRAFT[k]='';f.elements[k].value='';}); CHAT.pendingQ=null; store.set('ws-draft',DRAFT); $('#f-status',b).innerHTML=''; toast('Draft discarded'); });
  f.addEventListener('submit',async e=>{
    e.preventDefault(); save();
    const v=k=>f.elements[k].value.trim(); let ok=true;
    const setErr=(k,m)=>{ const el=$('#e-'+k,b); if(el) el.textContent=m; f.elements[k].setAttribute('aria-invalid',m?'true':'false'); if(m) ok=false; };
    setErr('name',v('name')?'':'Add your name so Abdullah knows who wrote.');
    setErr('email',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'))?'':'Enter an email address Abdullah can reply to.');
    setErr('message',v('message').length>=10?'':'Write a message of at least 10 characters.');
    const out=$('#f-status',b);
    if(!ok){ out.innerHTML=''; f.querySelector('[aria-invalid="true"]').focus(); return; }
    if(!CONFIG.web3formsKey){
      const body=encodeURIComponent(`${v('message')}\n\n— ${v('name')} (${v('email')})`), subj=encodeURIComponent(v('subject')||'Message from your portfolio');
      out.innerHTML=`<div class="status info">${ic('info_20_regular')}<div>Your message has <b>not</b> been sent. Direct sending isn't switched on in this preview yet. You can <button class="linkbtn" type="button" data-mailto="mailto:${ME.email}?subject=${subj}&amp;body=${body}">open it in your mail app</button> or <button class="tbtn" type="button" data-copytext="${esc(v('message')+'\n\n— '+v('name')+' ('+v('email')+')')}" data-okmsg="Message copied">copy the message</button> and send it to ${ME.email}.</div></div>`;
      return;
    }
    const btn=$('#f-send',b); btn.disabled=true; btn.lastChild.textContent='Sending…';
    try{
      const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({access_key:CONFIG.web3formsKey,name:v('name'),email:v('email'),subject:v('subject')||'Message from your portfolio',message:v('message'),from_name:'Abdullah Farhat Khokhar | Portfolio',botcheck:f.elements.botcheck.checked})});
      const j=await r.json().catch(()=>({}));
      if(r.ok&&j.success){ out.innerHTML=`<div class="status ok">${ic('checkmark_circle_20_filled')}<div>Sent. Abdullah will reply to ${esc(v('email'))}.</div></div>`; ['subject','message'].forEach(k=>{DRAFT[k]='';f.elements[k].value='';}); store.set('ws-draft',DRAFT); CHAT.pendingQ=null; }
      else throw new Error(j.message||('HTTP '+r.status));
    }catch(err){ out.innerHTML=`<div class="status err">${ic('dismiss_circle_20_filled')}<div>The message didn't send (${esc(err.message||'network error')}). Your draft is saved. Try again, or email ${ME.email} directly.</div></div>`; }
    finally{ btn.disabled=false; btn.lastChild.textContent='Send'; }
  });
}

/* ================= search ================= */
let IDX=null;
function buildIndex(){
  IDX=[];
  APPS.forEach(a=>IDX.push({g:'Sections',t:a.label,s:'Open section',x:a.label+' '+a.title,go:[a.id]}));
  EXPERIENCE.forEach(e=>IDX.push({g:'Experience',t:`${e.role}, ${e.org}`,s:e.when,x:[e.org,e.role,e.summary,...e.points,...e.tech].join(' '),go:['experience',e.id]}));
  PROJECTS.forEach(p=>IDX.push({g:'Projects',t:p.name,s:p.kind,x:[p.name,p.kind,p.overview,p.problem,...p.approach,...p.impl,...p.tech,p.results||''].join(' '),go:['projects',p.id]}));
  SKILLS.forEach((c,i)=>c.items.forEach(s=>IDX.push({g:'Skills',t:s[0],s:c.cat,x:s[0]+' '+c.cat,go:['skills','c'+i]})));
  EDUCATION.forEach(e=>IDX.push({g:'Education',t:e.title,s:e.org,x:[e.title,e.org,e.courses||''].join(' '),go:['about','education']}));
  CERTS.forEach(c=>IDX.push({g:'Education',t:c.name,s:(c.kind||'Certification')+(c.issuer?' · '+c.issuer:''),x:c.name+' certification coursera '+(c.issuer||'')+' '+(c.courses||[]).join(' '),go:['about','certs']}));
  LABS.searchEntries().forEach(e=>IDX.push(e));
}
let sSel=0,sHits=[];
function runSearch(){
  const q=$('#q').value.trim(), box=$('#sres'); $('#qClear').hidden=!q;
  if(!q){ box.hidden=true; $('#q').setAttribute('aria-expanded','false'); return; }
  if(!IDX) buildIndex();
  const toks=q.toLowerCase().split(/\s+/);
  sHits=IDX.map(e=>{ const x=e.x.toLowerCase(), t=e.t.toLowerCase(); if(!toks.every(k=>x.includes(k)||t.includes(k))) return null; return {e,sc:(t.startsWith(toks[0])?3:0)+(toks.every(k=>t.includes(k))?2:0)}; }).filter(Boolean).sort((a,b)=>b.sc-a.sc).slice(0,14).map(h=>h.e);
  sSel=0;
  const mark=s=>{ let r=esc(s); toks.forEach(k=>{ if(k.length>1) r=r.replace(new RegExp('('+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>'); }); return r; };
  let lastG=''; box.innerHTML=sHits.length?sHits.map((h,i)=>{ const g=h.g!==lastG?`<div class="grp">${h.g}</div>`:''; lastG=h.g;
      return `${g}<button class="mi" type="button" role="option" id="sr${i}" data-si="${i}" aria-selected="${i===0}">${ic({Sections:'apps_20_regular',Experience:'briefcase_24_regular',Projects:'folder_24_regular',Skills:'code_20_regular',Education:'hat_graduation_20_regular',Analytics:'data_bar_vertical_24_regular',Automation:'bot_24_regular'}[h.g]||'search_20_regular')}<span class="d"><span>${mark(h.t)}</span><small>${esc(h.s)}</small></span></button>`; }).join('')
    :`<div class="empty">No results for “${esc(q)}”. Try a skill (Python, Playwright), a company or a project.</div>`;
  box.hidden=false; $('#q').setAttribute('aria-expanded','true'); $('#q').setAttribute('aria-activedescendant',sHits.length?'sr0':'');
}
function pickSearch(i){ const h=sHits[i]; if(!h) return; $('#q').value=''; runSearch(); $('#q').blur(); go(h.go[0],h.go[1],h.go[2],{detail:true}); }

/* ================= popovers, tooltips, dialogs ================= */
function placePop(pop,anchor,align='right'){
  pop.hidden=false; const r=anchor.getBoundingClientRect(), w=pop.offsetWidth, h=pop.offsetHeight;
  let x=align==='right'?r.right-w:r.left, y=r.bottom+6; if(y+h>innerHeight-8) y=Math.max(8,r.top-h-6);
  x=Math.max(8,Math.min(x,innerWidth-w-8)); pop.style.left=x+'px'; pop.style.top=y+'px';
}
let popAnchor=null;
function openCard(anchor){ const c=$('#pcard'); c.innerHTML=cardHTML(); placePop(c,anchor,anchor.closest('.titlebar')?'right':'left'); popAnchor=anchor; $('.pbtn',c).focus(); }
function closePops(){ ['#pcard','#moreMenu'].forEach(s=>$(s).hidden=true); $('#moreBtn').setAttribute('aria-expanded','false'); if(popAnchor&&document.activeElement&&document.activeElement.closest('.pop')) popAnchor.focus(); popAnchor=null; }
function openMenu(btn,html){ const m=$('#moreMenu'); if(html!=null){ m.innerHTML=html; } placePop(m,btn,'right'); btn.setAttribute('aria-expanded','true'); popAnchor=btn; ($('[aria-checked="true"]',m)||$('.mi',m)).focus(); }
const MORE_MENU=$('#moreMenu').innerHTML;
function syncThemeMenu(){ const t=store.get('ws-theme','system'); $$('[data-theme-set]').forEach(b=>b.setAttribute('aria-checked',b.dataset.themeSet===t)); }
function setTheme(t){ store.set('ws-theme',t); if(t==='system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme',t); syncThemeMenu(); if(st.app==='analytics') renderMain(); }
let lastFocus=null;
function dialog(title,html){ lastFocus=document.activeElement; $('#dlgTitle').textContent=title; $('#dlgBody').innerHTML=html; $('#scrim').hidden=false; $('#dlgOk').focus(); }
function closeDialog(){ $('#scrim').hidden=true; lastFocus&&lastFocus.focus&&lastFocus.focus(); }
function shortcutsDialog(){ dialog('Keyboard shortcuts',`<table class="kbd-table"><tbody>${[
  ['Search','<kbd class="k">Ctrl</kbd> + <kbd class="k">E</kbd>'],['Activity … Contact','<kbd class="k">Ctrl</kbd> + <kbd class="k">1</kbd> … <kbd class="k">0</kbd>'],
  ['Back / forward','<kbd class="k">Alt</kbd> + <kbd class="k">←</kbd> / <kbd class="k">→</kbd>'],['Show or hide details','<kbd class="k">Ctrl</kbd> + <kbd class="k">Shift</kbd> + <kbd class="k">D</kbd>'],
['Send chat message','<kbd class="k">Enter</kbd>'],['Close a menu or dialog','<kbd class="k">Esc</kbd>'],['This list','<kbd class="k">Ctrl</kbd> + <kbd class="k">.</kbd>']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table>`); }

const tip=$('#tip'); let tipT=null, tipEl=null;
function showTip(el){ clearTimeout(tipT); tipT=setTimeout(()=>{ if(!document.body.contains(el)) return; tipEl=el; tip.textContent=el.dataset.tip; tip.classList.add('on'); const r=el.getBoundingClientRect(), w=tip.offsetWidth, h=tip.offsetHeight;
  const rail=el.classList.contains('ritem')&&!isMobile(); let x=rail?r.right+6:r.left+r.width/2-w/2, y=rail?r.top+r.height/2-h/2:r.bottom+6; if(y+h>innerHeight-4) y=r.top-h-6;
  tip.style.left=Math.max(4,Math.min(x,innerWidth-w-4))+'px'; tip.style.top=y+'px'; },450); }
function hideTip(){ clearTimeout(tipT); tip.classList.remove('on'); tipEl=null; }

/* ================= events ================= */
document.addEventListener('click',e=>{
  const t=e.target;
  const ri=t.closest('.ritem[data-app]'); if(ri){ hideTip(); $('#lfq').value=''; go(ri.dataset.app,null,null,{detail:false}); return; }
  if(t.closest('#railMore')){ const b=t.closest('#railMore'); openMenu(b,APPS.filter(a=>!MOBILE_BAR.includes(a.id)).map(a=>`<button class="mi" role="menuitem" type="button" data-go="${a.id}">${ic(a.icon+'_24_regular')}${a.label}</button>`).join('')); return; }
  const li=t.closest('.litem[data-item]'); if(li){ go(st.app,li.dataset.item,null,{detail:true}); return; }
  const lg=t.closest('[data-group]'); if(lg){ const k=lg.dataset.group; collapsed.has(k)?collapsed.delete(k):collapsed.add(k); renderList(); return; }
  const tb=t.closest('[data-tab]'); if(tb){ st.tab=tb.dataset.tab; if(hist[hi]) hist[hi].tab=st.tab; renderMain(); return; }
  const tg=t.closest('[data-tab-go]'); if(tg){ st.tab=tg.dataset.tabGo; renderMain(); return; }
  const g=t.closest('[data-go]'); if(g){ closePops(); const [a,i,tab]=g.dataset.go.split(','); go(a,i||null,tab||null,{detail:!!i}); return; }
  const ak=t.closest('[data-ask]'); if(ak){ ask(ak.dataset.ask); return; }
  const mt=t.closest('[data-mailto]'); if(mt){ openMail(mt.dataset.mailto); return; }
  const cp=t.closest('[data-copy]'); if(cp){ copyText(cp.dataset.copy,'Email address copied'); return; }
  const ct=t.closest('[data-copytext]'); if(ct){ copyText(ct.dataset.copytext,ct.dataset.okmsg||'Copied'); return; }
  const th=t.closest('[data-thread]'); if(th){ const id=th.dataset.thread; openThreads.has(id)?openThreads.delete(id):openThreads.add(id); renderMain(); return; }
  const md=t.closest('[data-media]'); if(md){ const [a,b]=md.dataset.media.split(',').map(Number), m=MEDIA[a], g=m.imgs[b]; dialog(m.title,`<img class="dlgimg" src="${esc(g.src)}" alt="${esc(g.alt)}"><p class="small muted" style="margin:8px 0 0">${m.imgs.length>1?`Photo ${b+1} of ${m.imgs.length} · `:''}<a href="${esc(m.linkedin)}" target="_blank" rel="noopener">View the post on LinkedIn</a></p>`); return; }
  const em=t.closest('[data-embed]'); if(em){ const v=VIDEOS[+em.dataset.embed]; const f=document.createElement('iframe'); f.src='https://www.linkedin.com/embed/feed/update/'+liUrn(v)+'?compact=1'; f.className='liframe'; f.title=v.title+' (LinkedIn post)'; f.allow='autoplay; encrypted-media; fullscreen; picture-in-picture'; f.allowFullscreen=true; const w=document.createElement('div'); w.className='liwrap'; w.innerHTML='<span class="liload">Loading the post from LinkedIn…</span>'; w.appendChild(f); em.replaceWith(w); return; }
  const pl=t.closest('[data-play]'); if(pl){ const v=VIDEOS[+pl.dataset.play]; const vd=document.createElement('video'); vd.src=v.src; vd.controls=true; vd.autoplay=true; vd.playsInline=true; if(v.poster) vd.poster=v.poster; vd.setAttribute('aria-label',v.title); pl.replaceWith(vd); vd.focus(); return; }
  if(t.closest('#logoBtn')){ go('chat','abdullah',null,{detail:false}); return; }
  const cd=t.closest('[data-card]'); if(cd){ openCard(cd); return; }
  const ts=t.closest('[data-theme-set]'); if(ts){ setTheme(ts.dataset.themeSet); closePops(); return; }
  const sr=t.closest('[data-si]'); if(sr){ pickSearch(+sr.dataset.si); return; }
  if(!t.closest('.pop')&&!t.closest('#moreBtn')&&!t.closest('#meBtn')) closePops();
  if(!t.closest('.searchwrap')){ $('#sres').hidden=true; $('#q').setAttribute('aria-expanded','false'); }
});
$('#navBack').onclick=()=>navStep(-1); $('#navFwd').onclick=()=>navStep(1);
$('#meBtn').onclick=e=>{ e.stopPropagation(); const c=$('#pcard'); if(!c.hidden){ closePops(); return; } closePops(); openCard($('#meBtn')); };
$('#moreBtn').onclick=e=>{ e.stopPropagation(); if(!$('#moreMenu').hidden){ closePops(); return; } closePops(); openMenu($('#moreBtn'),MORE_MENU); syncThemeMenu(); };
$('#moreMenu').addEventListener('click',e=>{ const id=e.target.closest('.mi')?.id; if(id==='miShortcuts'){ closePops(); shortcutsDialog(); } if(id==='miCopyLink'){ closePops(); copyText(location.href.split('#')[0]+location.hash,'Link copied'); } });
$('#moreMenu').addEventListener('keydown',e=>{ const items=$$('.mi',$('#moreMenu')); const i=items.indexOf(document.activeElement); if(e.key==='ArrowDown'){ e.preventDefault(); items[(i+1)%items.length].focus(); } if(e.key==='ArrowUp'){ e.preventDefault(); items[(i-1+items.length)%items.length].focus(); } });
$('#dlgX').onclick=closeDialog; $('#dlgOk').onclick=closeDialog; $('#scrim').addEventListener('click',e=>{ if(e.target.id==='scrim') closeDialog(); });
$('#listFilterBtn').onclick=()=>{ const on=!$('#lfilter').classList.contains('on'); $('#lfilter').classList.toggle('on',on); $('#listFilterBtn').setAttribute('aria-pressed',on); if(on) $('#lfq').focus(); else { $('#lfq').value=''; renderList(); } };
$('#lfq').addEventListener('input',renderList);
$('#listNewBtn').onclick=()=>go('contact','new',null,{detail:true});
$('#main').addEventListener('click',e=>{
  if(e.target.closest('#dToggle')){ const open=$('#details').hidden; detailsOpen=open; store.set('ws-details',open); renderMain(); }
  if(e.target.closest('#mBack')){ $('#work').classList.remove('detail'); }
});
$('#dClose').onclick=()=>{ detailsOpen=false; store.set('ws-details',false); renderMain(); };
// composer
const cmsg=$('#cmsg');
cmsg.addEventListener('input',()=>{ $('#cSend').disabled=!cmsg.value.trim(); cmsg.style.height='auto'; cmsg.style.height=Math.min(120,cmsg.scrollHeight)+'px'; });
cmsg.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); $('#cform').requestSubmit(); } });
$('#cform').addEventListener('submit',e=>{ e.preventDefault(); const v=cmsg.value; if(!v.trim()) return; cmsg.value=''; cmsg.style.height='auto'; $('#cSend').disabled=true; ask(v); setTimeout(()=>$('#cmsg').focus(),0); });
$('#cEmoji').onclick=e=>{ e.stopPropagation(); openMenu($('#cEmoji'),`<div class="mlabel">Suggested questions</div>`+FAQ.filter(f=>f.q!=='Hi!'&&!f.hidden).map(f=>`<button class="mi" role="menuitem" type="button" data-ask="${esc(f.q)}">${ic('chat_24_regular','ic16')}${esc(f.q)}</button>`).join('')); };
$('#moreMenu').addEventListener('click',e=>{ const a=e.target.closest('[data-ask]'); if(a) closePops(); });
// search
const q=$('#q');
q.addEventListener('input',runSearch); q.addEventListener('focus',()=>{ if(q.value) runSearch(); });
q.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); if(!sHits.length) return; sSel=(sSel+(e.key==='ArrowDown'?1:-1)+sHits.length)%sHits.length; $$('#sres [data-si]').forEach(b=>b.setAttribute('aria-selected',+b.dataset.si===sSel)); const el=$('#sr'+sSel); el&&el.scrollIntoView({block:'nearest'}); q.setAttribute('aria-activedescendant','sr'+sSel); }
  if(e.key==='Enter'){ e.preventDefault(); pickSearch(sSel); }
  if(e.key==='Escape'){ q.value=''; runSearch(); q.blur(); }
});
$('#qClear').onclick=()=>{ q.value=''; runSearch(); q.focus(); };
// tooltips
document.addEventListener('mouseover',e=>{ const el=e.target.closest('[data-tip]'); if(el&&el!==tipEl) showTip(el); else if(!el&&tipEl) hideTip(); });
document.addEventListener('focusin',e=>{ const el=e.target.closest&&e.target.closest('[data-tip]'); if(el&&el.matches(':focus-visible')) showTip(el); else hideTip(); });
document.addEventListener('mousedown',hideTip);
// keyboard
document.addEventListener('keydown',e=>{
  const mod=e.ctrlKey||e.metaKey;
  if(e.key==='Escape'){ if(!$('#scrim').hidden){ closeDialog(); return; } if(!$('#pcard').hidden||!$('#moreMenu').hidden){ closePops(); return; } if(!$('#details').hidden&&innerWidth<1100){ detailsOpen=false; renderMain(); } }
  if(mod&&(e.key==='e'||e.key==='E')&&!e.shiftKey){ e.preventDefault(); q.focus(); q.select(); }
  if(mod&&e.key==='.'){ e.preventDefault(); shortcutsDialog(); }
  if(mod&&e.shiftKey&&(e.key==='D'||e.key==='d')){ e.preventDefault(); if(curView&&curView.details){ detailsOpen=$('#details').hidden; store.set('ws-details',detailsOpen); renderMain(); } }
  if(mod&&!e.shiftKey&&!e.altKey&&/^[0-9]$/.test(e.key)){ const i=e.key==='0'?9:+e.key-1; if(APPS[i]){ e.preventDefault(); go(APPS[i].id,null,null,{detail:false}); } }
  if(e.altKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){ e.preventDefault(); navStep(e.key==='ArrowLeft'?-1:1); }
  if((e.key==='ArrowDown'||e.key==='ArrowUp')&&document.activeElement&&document.activeElement.classList.contains('litem')){ e.preventDefault(); const its=$$('#lscroll .litem'); const i=its.indexOf(document.activeElement); const n=its[i+(e.key==='ArrowDown'?1:-1)]; n&&n.focus(); }
});
addEventListener('hashchange',()=>{ const p=parseHash(); if(p&&(p.app!==st.app||(p.item||appById(p.app).def)!==st.item)) go(p.app,p.item,null,{detail:true}); });
addEventListener('resize',()=>{ if(!isMobile()) $('#work').classList.remove('detail'); });

/* ================= boot ================= */
(function boot(){
  const t=store.get('ws-theme','system'); if(t!=='system') document.documentElement.setAttribute('data-theme',t);
  $('#meBtn').innerHTML=avatar('me',32,{ring:'var(--chrome)',label:true});
  const p=parseHash(); go(p?p.app:'chat',p?p.item:null,null,{detail:!!(p&&p.item)});
  setInterval(()=>{ if(!$('#pcard').hidden) { /* keep local time fresh */ const r=$('#pcard .cinfo .r:nth-child(2) span'); if(r) r.textContent=`${localTime()} local time · ${ME.location}`; } },30000);
})();
