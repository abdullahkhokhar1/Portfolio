/* ================= LABS: Data Analytics + Automation Lab =================
   Real work only. No sample data, no example code. */
const LABS=(()=>{
const meBy=()=>`<button type="button" data-card class="tbtn" style="color:var(--fg-2);padding:0">${ME.name}</button>`;
const mePost=(when,inner,foot='')=>post(avatar('me',32,{ring:'var(--surface)'}),meBy(),when,inner,foot);
const tags=a=>`<div class="tags">${a.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`;
const open=(go,label)=>`<button class="tbtn" type="button" data-go="${go}">${label} ${ic('chevron_right_20_regular','ic16')}</button>`;
const foot=links=>`<div class="pf">${links.join('')}</div>`;
const exp=id=>EXPERIENCE.find(e=>e.id===id);
const skillsIn=cat=>(SKILLS.find(c=>c.cat===cat)||{items:[]}).items.map(i=>i[0]);

/* ---------- Data Analytics ---------- */
function overview(){
  return {title:'Data across my work',sub:'Data Analytics',av:avatar('app',32,{icon:'data_bar_vertical_24_regular'}),
    body:()=>`<div class="page">
      ${mePost('Overview',`<h3>Data runs through most of what I do</h3>
        <p>In QA, the question is always “is this data right?”. I check what an application shows against what its APIs return and what its database stores. Before that I worked on the analysis side: cleaning datasets, visualising them and building models.</p>
        <div class="grid2">
          ${[['Data verification in test automation','NETSOL · Oct 2025 – Present','Python BDD framework with API interception, backend validation and data verification.','analytics,validation'],
             ['Predictive modelling','CodSoft · 2023','Cleaned and visualised datasets of 10,000+ records; Logistic Regression and Decision Tree models with +20% accuracy over baseline.','analytics,ml'],
             ['Data extraction','Upwork · 2020 – 2021','Extracted and organised datasets for research, analytics and business clients.','analytics,handling'],
             ['Records and reporting','FCCU · 2025','Grade records for 100+ students in Google Sheets: entry, validation and reporting.','analytics,handling']]
            .map(c=>`<div class="box"><h4>${c[0]}</h4><p class="small muted">${c[1]}</p><p>${c[2]}</p>${open(c[3],'Read more')}</div>`).join('')}
        </div>`)}
      ${mePost('Toolkit',`<h3>The tools I use for data</h3><p class="tlabel">Data & analytics</p>${tags(skillsIn('Data & analytics'))}<p class="tlabel">Machine learning</p>${tags(skillsIn('Machine learning'))}`,foot([open('analytics,toolkit','See the full toolkit')]))}</div>`};
}
function validation(){
  const e=exp('netsol');
  return {title:'Data validation in QA',sub:'Data Analytics · NETSOL Technologies',av:avatar('app',32,{icon:'checkmark_circle_20_filled'}),
    body:()=>`<div class="page">${mePost(e.when,`<h3>Making sure the data is right, not just the screen</h3>
      <p>On the QA Automation team at NETSOL, working on enterprise client products, our Python BDD framework checks more than the user interface. It intercepts the API calls behind each page, validates the backend, and verifies the data itself.</p>
      <p>The same mindset carries over to analysis work: knowing where data comes from, checking it at each step, and catching the record that doesn't match.</p>`,
      foot([open('automation,bdd','How the framework works'),open('experience,netsol','The full role')]))}
      <div class="rows">
        <div class="row"><div class="k">What I check</div><div class="v"><ul><li>API responses captured while the UI runs</li><li>Backend records behind each screen</li><li>That the UI, the API and the stored data agree</li></ul></div></div>
        <div class="row"><div class="k">Related skills</div><div class="v">${tags(['Data validation','Data profiling','ETL testing','Backend validation','API interception','SQL','Python'])}</div></div></div></div>`};
}
function ml(){
  const ps=PROJECTS.filter(p=>p.link);
  return {title:'Machine learning projects',sub:'Data Analytics · CodSoft',av:avatar('app',32,{icon:'sparkle_20_regular'}),
    body:()=>`<div class="page">${mePost('Aug – Sep 2023',`<h3>From raw tables to models</h3>
      <p>During my data science internship at CodSoft I cleaned, preprocessed and visualised datasets of 10,000+ records, and built Logistic Regression and Decision Tree models with +20% accuracy over baseline.</p>`,foot([open('experience,codsoft','The internship')]))}
      <div class="tablewrap"><table class="dt"><thead><tr><th>Project</th><th>Task</th><th>Model</th><th>Notebook</th></tr></thead><tbody>
      ${ps.map(p=>`<tr><td><button class="tbtn" style="font-weight:600" type="button" data-go="projects,${p.id}">${esc(p.name)}</button></td><td style="white-space:normal;min-width:220px">${esc(p.overview)}</td><td>${esc(p.tech[p.tech.length-1])}</td><td><a href="${p.link}" target="_blank" rel="noopener">GitHub ↗</a></td></tr>`).join('')}</tbody></table></div>
      <div class="rows"><div class="row"><div class="k">Techniques</div><div class="v">${tags(['Data cleaning','Missing-value imputation','Categorical encoding','Feature engineering','Exploratory analysis','Train/test evaluation','MSE, MAE, R²'])}</div></div>
      <div class="row"><div class="k">Libraries</div><div class="v">${tags(['pandas','NumPy','Matplotlib','Seaborn'])}</div></div></div></div>`};
}
function handling(){
  return {title:'Data handling and reporting',sub:'Data Analytics',av:avatar('app',32,{icon:'table_20_regular'}),
    body:()=>`<div class="page">
      ${mePost('Mar – Jun 2025',`<h3>Grade records for 100+ students</h3><p>As a Teaching Assistant at Forman Christian College I managed grade records in Google Sheets: data entry, validation and reporting for two courses.</p>`,foot([open('experience,fccu-ta','The role')]))}
      ${mePost('Nov 2020 – Oct 2021',`<h3>Data extraction on Upwork</h3><p>Freelance data extraction and management for research, analytics and business clients: collecting the data, organising it, and delivering it in the shape each client needed.</p>`,foot([open('experience,upwork','The role')]))}
      ${mePost('Sep – Nov 2023',`<h3>Automating data processing</h3><p>At Systems Limited I built UiPath workflows for repetitive data processing across 6 projects.</p>`,foot([open('automation,uipath','UiPath work')]))}</div>`};
}
function toolkit(){
  const dataCerts=CERTS.filter(c=>/data|python|sql|database|spreadsheet/i.test(c.name+' '+(c.courses||[]).join(' ')));
  return {title:'Analytics toolkit',sub:'Data Analytics',av:avatar('app',32,{icon:'apps_20_regular'}),
    body:()=>`<div class="page"><div class="rows">
      <div class="row"><div class="k">Languages</div><div class="v">${tags(['Python','SQL'])}</div></div>
      <div class="row"><div class="k">Analysis & visualisation</div><div class="v">${tags(['pandas','NumPy','Matplotlib','Seaborn','Tableau','MS Excel','Google Sheets'])}</div></div>
      <div class="row"><div class="k">Data quality</div><div class="v">${tags(['Data validation','Data profiling','ETL testing','Backend validation'])}</div></div>
      <div class="row"><div class="k">Machine learning</div><div class="v">${tags(skillsIn('Machine learning'))}</div></div>
      <div class="row"><div class="k">Other</div><div class="v">${tags(['Data mining','Data visualisation','Big data'])}</div></div>
      <div class="row"><div class="k">Coursework</div><div class="v"><p>Machine Learning, Artificial Intelligence, Database Systems, Data Structures & Algorithms</p></div></div>
      <div class="row"><div class="k">Certifications</div><div class="v"><ul>${dataCerts.map(c=>`<li>${esc(c.name)}${c.issuer?` <span class="muted">· ${esc(c.issuer)}</span>`:''}</li>`).join('')}</ul></div></div></div>
      <p class="small muted">You can check all my skills in the ${open('skills,all','Skills')} section.</p></div>`};
}

/* ---------- Automation Lab ---------- */
function arch(){
  const lane=(t,nodes)=>`<div class="lane"><div class="lt">${t}</div><div class="nodes">${nodes.map((n,i)=>`${i?`<span class="arrow" aria-hidden="true">→</span>`:''}<div class="node ${n[2]?'b':''}"><b>${n[0]}</b><span>${n[1]}</span></div>`).join('')}</div></div>`;
  return {title:'Automation overview',sub:'Automation Lab',av:avatar('app',32,{icon:'bot_24_regular'}),
    body:()=>`<div class="page">${mePost('NETSOL · Oct 2025 – Present',`<h3>From C# suites to one Python framework</h3>
       <p>Automation started in C#, Playwright and .NET: 150+ end-to-end cases across 3 enterprise products. It was then migrated to a Python BDD framework, where everything now lives and keeps growing: the automation scripts, the test cases and the regression coverage.</p>
       <p>The framework also does more than click through screens. It intercepts the API calls behind each page and validates the backend and the data as well.</p>`)}
      <div class="box"><h4>How a scenario flows through the framework</h4><p class="small muted">A high-level view. The framework itself is private.</p>
       <div class="arch">${lane('Specification',[['Feature files','Scenarios in plain language'],['Step definitions','Python, one function per step',1]])}
        ${lane('Execution',[['Browser automation','Playwright drives the UI'],['API interception','Capture requests and responses',1],['Backend validation','Compare stored data',1]])}
        ${lane('Results',[['Assertions','UI, API and data must agree'],['CI/CD pipeline','Azure DevOps']])}</div></div>
      <div class="grid2">
        <div class="box"><h4>UI test suites</h4><p>Where it started: 150+ end-to-end cases in C#, Playwright and .NET.</p>${open('automation,ui','Read more')}</div>
        <div class="box"><h4>Python BDD framework</h4><p>Automation scripts, test cases and regression coverage, with UI, API and data checks.</p>${open('automation,bdd','Read more')}</div>
        <div class="box"><h4>AI-assisted validation</h4><p>Agentic automation that covers test cases and keeps regression flows up to date.</p>${open('automation,ai','Read more')}</div>
        <div class="box"><h4>RPA with UiPath</h4><p>Workflows for data processing across 6 projects.</p>${open('automation,uipath','Read more')}</div></div></div>`};
}
function ui(){ const e=exp('netsol'); return {title:'UI test suites',sub:'Automation Lab · C#, Playwright, .NET',av:avatar('app',32,{icon:'code_20_regular'}),
  body:()=>`<div class="page">${mePost(e.when,`<h3>150+ end-to-end cases across 3 enterprise products</h3><p>I built and scaled UI test suites in C#, Playwright and .NET, and worked on both automation and manual QA. On client projects that meant feature and UI testing, investigating production issues, and presenting new features to the client team.</p><p>These suites were later migrated to the Python BDD framework, where they continue to grow.</p>`,foot([open('automation,bdd','The Python framework'),open('experience,netsol','The full role')]))}
    <div class="rows"><div class="row"><div class="k">Stack</div><div class="v">${tags(['C#','.NET','Playwright','SpecFlow','Azure DevOps'])}</div></div><div class="row"><div class="k">Scale</div><div class="v"><p>150+ end-to-end cases · 3 enterprise products</p></div></div></div></div>`}; }
function bdd(){ const e=exp('netsol'); return {title:'Python BDD framework',sub:'Automation Lab · UI, API and data',av:avatar('app',32,{icon:'checkmark_circle_20_filled'}),
  body:()=>`<div class="page">${mePost(e.when,`<h3>One framework for scripts, regression and data checks</h3><p>The Python BDD framework is where all of our automation lives. Scenarios are written in plain language as feature files, and Python step definitions drive the browser with Playwright. It holds the automation scripts, the test cases and the regression suite, so new features get covered and existing flows keep getting checked on every run.</p><p>Each run also checks the same behaviour three ways: what the API returned, what the page shows, and what the backend stores.</p>`,foot([open('analytics,validation','Why this is data work')]))}
    <div class="rows"><div class="row"><div class="k">Capabilities</div><div class="v"><ul><li>Automation scripting</li><li>Test cases and regression coverage</li><li>API interception</li><li>Backend validation</li><li>Data verification</li></ul></div></div><div class="row"><div class="k">Stack</div><div class="v">${tags(['Python','Python BDD','Playwright','SQL'])}</div></div></div></div>`}; }
function ai(){ const e=exp('netsol'); return {title:'AI-assisted validation',sub:'Automation Lab',av:avatar('app',32,{icon:'sparkle_20_regular'}),
  body:()=>`<div class="page">${mePost(e.when,`<h3>Agentic automation with domain knowledge</h3><p>Within the Python framework, I use agentic automation together with product domain knowledge to cover test cases and regression flows, and to keep them updated as the product changes over time. It takes over a lot of the repetitive validation work.</p>`,foot([open('experience,netsol','The full role')]))}</div>`}; }
function rpa(){ return {title:'UiPath RPA',sub:'Automation Lab · Systems Limited',av:avatar('app',32,{icon:'bot_24_regular'}),
  body:()=>`<div class="page">${mePost('Sep – Nov 2023',`<h3>UiPath workflows for repetitive data processing</h3><p>During my internship at Systems Limited I built UiPath workflows across <b>6 projects</b>. The workflows cut manual effort by 40% and processing time by 50% on routine departmental tasks.</p>`,foot([open('experience,systems','The role')]))}</div>`}; }

return {
  analyticsGroups:()=>[{label:'Data Analytics',items:[
      {id:'overview',name:'Data across my work',pv:'Where data shows up in each role',av:licon('data_bar_vertical_24_regular')},
      {id:'validation',name:'Data validation in QA',pv:'NETSOL · UI, API and backend data',av:licon('checkmark_circle_20_filled')},
      {id:'ml',name:'Machine learning projects',pv:'CodSoft · 3 notebooks',av:licon('sparkle_20_regular')},
      {id:'handling',name:'Data handling and reporting',pv:'Sheets, extraction, RPA',av:licon('table_20_regular')},
      {id:'toolkit',name:'Analytics toolkit',pv:'Languages, libraries, certifications',av:licon('apps_20_regular')} ]}],
  analyticsView:id=>({validation,ml,handling,toolkit}[id]||overview)(),
  automationGroups:()=>[{label:'Automation Lab',items:[
      {id:'architecture',name:'Automation overview',pv:'From C# to a Python BDD framework',av:licon('apps_20_regular')},
      {id:'ui',name:'UI test suites',pv:'C#, Playwright, .NET · 150+ cases',av:licon('code_20_regular')},
      {id:'bdd',name:'Python BDD framework',pv:'Scripts, regression, UI, API and data checks',av:licon('checkmark_circle_20_filled')},
      {id:'ai',name:'AI-assisted validation',pv:'Agentic automation for regression flows',av:licon('sparkle_20_regular')},
      {id:'uipath',name:'UiPath RPA',pv:'Systems Limited · 6 projects',av:licon('bot_24_regular')} ]}],
  automationView:id=>({ui,bdd,ai,uipath:rpa}[id]||arch)(),
  searchEntries:()=>[
    {g:'Analytics',t:'Data across my work',s:'Data Analytics',x:'data analytics overview verification modelling extraction reporting',go:['analytics','overview']},
    {g:'Analytics',t:'Data validation in QA',s:'NETSOL',x:'data validation backend api interception etl testing profiling sql',go:['analytics','validation']},
    {g:'Analytics',t:'Machine learning projects',s:'CodSoft',x:'machine learning logistic regression decision tree pandas notebook model',go:['analytics','ml']},
    {g:'Analytics',t:'Data handling and reporting',s:'Sheets, extraction, RPA',x:'google sheets excel extraction reporting records upwork',go:['analytics','handling']},
    {g:'Analytics',t:'Analytics toolkit',s:'Tools and certifications',x:'tableau pandas numpy matplotlib seaborn sql python certification toolkit',go:['analytics','toolkit']},
    {g:'Automation',t:'Automation overview',s:'Automation Lab',x:'framework architecture bdd api interception backend validation c# playwright',go:['automation','architecture']},
    {g:'Automation',t:'UI test suites',s:'C#, Playwright, .NET',x:'ui test suites c# csharp .net playwright specflow end-to-end',go:['automation','ui']},
    {g:'Automation',t:'Python BDD framework',s:'Scripts, regression and data checks',x:'python bdd framework migration regression test cases scripting api interception backend data verification',go:['automation','bdd']},
    {g:'Automation',t:'AI-assisted validation',s:'Agentic automation',x:'ai agentic automation regression test cases validation',go:['automation','ai']},
    {g:'Automation',t:'UiPath RPA',s:'Systems Limited',x:'uipath rpa robotic process automation systems limited',go:['automation','uipath']}],
};
})();
