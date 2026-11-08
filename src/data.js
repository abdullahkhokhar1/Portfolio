/* ============ CONTENT ============ */
const CONFIG = {
  photo: 'assets/profile-256.webp',      // square crop for avatars
  portrait: 'assets/portrait-about.webp', // portrait shown at the top of About Me
  resumePdf: 'assets/Abdullah-Farhat-Khokhar-Resume.pdf',
  resumeImg: 'assets/resume-page-1.webp',
  web3formsKey: null,          // Web3Forms access key (public, domain-restricted); null = sending disabled
};
/* LinkedIn videos shown in Projects, Teams-style. Add one entry per post:
   { project:'caretrax', title:'…', posted:'Mar 2025', linkedin:'https://www.linkedin.com/posts/abdullahkhokhar1_…-activity-7123456789012345678-AbCd' }
   The post plays inline through LinkedIn's official embed (the activity number is read from the link).
   Optional: embed:'urn:li:ugcPost:…' if LinkedIn's "Embed this post" gives a different urn; src/poster for a self-hosted file. */
const VIDEOS = [
  { project:'titanic', title:'Titanic Survival Prediction: CodSoft task 1', posted:'Aug 2023', poster:'assets/li/titanic-cover.webp',
    linkedin:'https://www.linkedin.com/posts/abdullahkhokhar1_codsoft-datascience-machinelearning-ugcPost-7100884601467731968-WH91' },
  { project:'movie', title:'Movie Rating Prediction: CodSoft task 2', posted:'Aug 2023', poster:'assets/li/movie-cover.webp',
    linkedin:'https://www.linkedin.com/posts/abdullahkhokhar1_codsoft-datascience-machinelearning-ugcPost-7102998205662961666-Z7nO' },
  { project:'iris', title:'Iris Flower Classification: CodSoft task 3', posted:'Sep 2023', poster:'assets/li/iris-cover.webp',
    linkedin:'https://www.linkedin.com/posts/abdullahkhokhar1_codsoft-datascience-machinelearning-ugcPost-7104092938942447616-HHsz' },
];
/* Pictures from Abdullah's posts, shown where they belong (where = 'exp:<id>' or 'edu:<index>'). */
const MEDIA = [
  { where:'exp:codsoft', posted:'Sep 2023', title:'CodSoft internship completion certificate',
    text:'Completed my data science internship at CodSoft (10 Aug – 10 Sep 2023) and received the completion certificate.',
    imgs:[{src:'assets/li/codsoft-certificate.webp',w:1065,h:748,alt:'CodSoft certificate of completion, Data Science internship, awarded to Abdullah Farhat Khokhar'}],
    linkedin:'https://www.linkedin.com/posts/abdullahkhokhar1_codsoft-internship-datascience-share-7107779585244577792-3Hj4' },
  { where:'exp:systems', posted:'Nov 2023', title:'Systems Limited internship letter',
    text:'Completed my internship in the Digital Automation department at Systems Limited (1 Sep – 1 Nov 2023), working with the team on UiPath automation.',
    imgs:[{src:'assets/li/systems-certificate.webp',w:753,h:976,alt:'Systems Limited internship letter for Abdullah Farhat Khokhar, Digital Automation Department'}],
    linkedin:'https://www.linkedin.com/posts/abdullahkhokhar1_systemslimited-internship-digitalautomation-share-7134556137789566977-jGKk' },
  { where:'exp:systems', posted:'Sep 2023', title:'UiPath RPA Developer Foundation',
    text:'Finished the RPA Developer Foundation learning plan on UiPath Academy during the internship: UI automation, selectors, Excel and DataTables, error handling, logging and Orchestrator.',
    imgs:[{src:'assets/li/uipath-rpa-foundation.webp',w:1072,h:756,alt:'UiPath diploma of completion, RPA Developer Foundation, awarded to Abdullah Khokhar'}],
    linkedin:'https://www.linkedin.com/posts/abdullahkhokhar1_rpa-uipath-automation-share-7110859106898374656-wRqn' },
  { where:'edu:0', posted:'Nov 2025', title:'Graduation day',
    text:'Graduated from Forman Christian College, grateful to my family, teachers and friends.',
    imgs:[{src:'assets/li/graduation-1.webp',w:745,h:720,alt:'Abdullah receiving his degree on stage at the convocation'},
          {src:'assets/li/graduation-4.webp',w:800,h:639,alt:'Abdullah with friends at the convocation'},
          {src:'assets/li/graduation-3.webp',w:872,h:1300,alt:'Abdullah holding his degree folder outside the college'},
          {src:'assets/li/graduation-2.webp',w:731,h:1300,alt:'Forman Christian College degree folder'}],
    linkedin:'https://www.linkedin.com/posts/abdullahkhokhar1_i-officially-graduated-today-and-im-truly-ugcPost-7400641008524451840-iyDu' },
];
const ME = {
  name: 'Abdullah Farhat Khokhar', fullName: 'Abdullah Farhat Khokhar', initials: 'AF',
  headline: 'Software Engineer | Automation | Data Enthusiast',
  title: 'Associate Software Engineer', org: 'NETSOL Technologies',
  location: 'Lahore, Pakistan', tz: 'Asia/Karachi',
  email: 'abdullahfarhat1492@gmail.com',
  linkedin: 'https://www.linkedin.com/in/abdullahkhokhar1/', github: 'https://github.com/abdullahkhokhar1',
  born: [2002, 9, 14],   // used only to work out the current age; never shown
  status: 'Available', focus: 'Automation, data validation and analytics',
  quote: 'Passionate about solving problems through data and automation. I enjoy turning complex data into clear insights and building smart automated solutions that make processes efficient.',
};

/* Organisation logos, taken from each organisation's own website; keyed by short code. */
const LOGOS = { NT:'assets/logos/netsol.webp', SL:'assets/logos/systems.webp', CS:'assets/logos/codsoft.webp', UP:'assets/logos/upwork.webp', FC:'assets/logos/fccu.webp', PC:'assets/logos/pgc.webp', DS:'assets/logos/dhass.webp' };

const EXPERIENCE = [
  { id:'netsol', org:'NETSOL Technologies', short:'NT', color:'#0F6CBD', role:'Associate Software Engineer', when:'Oct 2025 – Present', start:'Oct 2025', place:'Lahore', type:'Full-time',
    summary:'QA Automation team, working on enterprise client products. Test automation in C# and Python, with a growing focus on backend and data verification.',
    points:[
      'Built and scaled UI test suites in C#, Playwright and .NET: 150+ end-to-end cases across 3 enterprise products, covering both automation and manual QA.',
      'Migrated the automation from C# to a Python BDD framework, which now holds the automation scripts, test cases and regression coverage, and adds API interception, backend validation and data verification.',
      'On client projects: feature and UI testing, investigating production issues, and presenting new features to client teams.',
      'Used agentic automation with product domain knowledge to cover test cases and keep regression flows up to date as the product changes.' ],
    tech:['Python','Playwright','C#','.NET','Python BDD','SpecFlow','API interception','Backend validation','SQL','Data validation','Azure DevOps'] },
  { id:'fccu-ta', org:'Forman Christian College', short:'FC', color:'#8764B8', role:'Teaching Assistant', when:'Mar 2025 – Jun 2025', place:'Lahore', type:'Part-time',
    summary:'Supported two computer science courses during the final year of my degree.',
    points:[ 'Supported Parallel & Distributed Computing and Computer Organization & Assembly Language.', 'Graded quizzes, homework and projects, and ran project vivas.', 'Managed grade records for 100+ students in Google Sheets: entry, validation and reporting.' ],
    tech:['Google Sheets','Data validation','Reporting'] },
  { id:'systems', org:'Systems Limited', short:'SL', color:'#C239B3', role:'RPA / Digital Automation Intern', when:'Sep 2023 – Nov 2023', place:'Lahore', type:'Internship',
    summary:'Robotic process automation for repetitive data processing.',
    points:[ 'Worked with the Digital Automation team on 6 UiPath projects.', 'Automated repetitive data-processing workflows, cutting manual effort by 40%.', 'Designed automation solutions that cut processing time by 50% on routine departmental tasks.' ],
    tech:['UiPath','RPA','Process automation'] },
  { id:'codsoft', org:'CodSoft', short:'CS', color:'#038387', role:'Data Science Intern', when:'Aug 2023 – Sep 2023', place:'Remote', type:'Internship',
    summary:'Data cleaning, visualisation and classic machine learning models.',
    points:[ 'Cleaned, preprocessed and visualised datasets of 10,000+ records.', 'Built Logistic Regression and Decision Tree models with +20% accuracy over baseline.', 'Projects: Movie Rating Prediction, Titanic Survival Prediction, Iris Flower Classification (notebooks on GitHub).' ],
    tech:['Python','pandas','NumPy','Matplotlib','Seaborn','Logistic Regression','Decision Trees'] },
  { id:'upwork', org:'Upwork', short:'UP', color:'#498205', role:'Freelancer', when:'Nov 2020 – Oct 2021', place:'Remote', type:'Freelance',
    summary:'Data extraction and management for clients.',
    points:[ 'Data extraction and management for research, analytics and business clients.', 'Extracted and organised datasets to client specifications.' ],
    tech:['Data extraction','Data management','MS Excel'] },
];

const GH = 'https://github.com/abdullahkhokhar1/CODSOFT/blob/main/';
const PROJECTS = [
  { id:'movie', name:'Movie Rating Prediction', kind:'Data science · CodSoft', icon:'data_bar_vertical', when:'2023',
    overview:'Predict how a movie will be rated from its attributes, using merged movie, rating and user data.',
    problem:'Ratings live in separate movie, rating and user tables. The task was to combine them and see which attributes help predict a rating.',
    approach:['Merged the movie, rating and user datasets into one analysis table.','Explored correlations between features and ratings with Seaborn.','Trained a Decision Tree Regressor to predict ratings.'],
    impl:['Python notebook using pandas for joins and cleaning.','Feature-importance and actual-vs-predicted plots to inspect the model.','Evaluated with MSE, MAE and R².'],
    results:'Evaluated with MSE, MAE and R² in the notebook.', 
    tech:['Python','pandas','Seaborn','Decision Tree Regressor'], link:GH+'Movie%20Rating%20Prediction.ipynb' },
  { id:'titanic', name:'Titanic Survival Prediction', kind:'Data science · CodSoft', icon:'data_bar_vertical', when:'2023',
    overview:'Classify whether a Titanic passenger survived, from the passenger record.',
    problem:'The passenger data has missing values and categorical fields, so it needs cleaning before a model can use it.',
    approach:['Imputed missing values.','Encoded categorical features and dropped low-signal columns.','Trained a Logistic Regression classifier.'],
    impl:['Python notebook with Matplotlib and Seaborn for exploration.','scikit-learn style train/test workflow for the classifier.'],
    results:null,
    tech:['Python','Matplotlib','Seaborn','Logistic Regression'], link:GH+'Titanic%20Survival%20Prediction.ipynb' },
  { id:'iris', name:'Iris Flower Classification', kind:'Data science · CodSoft', icon:'data_bar_vertical', when:'2023',
    overview:'Classify iris flowers into three species from four measurements.',
    problem:'A multiclass classification problem on a small, clean dataset: a good test of the full workflow end to end.',
    approach:['Explored the features visually.','Label-encoded the species.','Trained a multiclass Logistic Regression classifier.'],
    impl:['Python notebook using pandas.','Evaluated on a held-out test set.'],
    results:null,
    tech:['Python','pandas','Logistic Regression'], link:GH+'Iris%20Flower%20Classification.ipynb' },
  { id:'caretrax', name:'CareTrax', kind:'IoT · Final-year project', icon:'bot', when:'2025',
    overview:'An IoT insulin-drip monitor that measures drip weight and streams it to an Android app for real-time alerts.',
    problem:'Drips need watching. CareTrax measures the bag weight continuously so staff get an alert instead of checking by hand.',
    approach:['Load cell with an HX711 amplifier on an ESP32 to measure drip weight.','Readings sent over Wi-Fi (Firebase and MQTT) to a mobile app built in React Native.','A Django REST backend with PostgreSQL stores the records, and alerts reach nursing staff in real time.'],
    impl:['ESP32 firmware reading the HX711 load cell.','Firebase as the real-time data layer.','Android app for monitoring and alert notifications.','Built over 3 prototype iterations by a team of three.'],
    results:'Tracks drip weight to ±2 g, delivers alerts in under 5 s on average, cut manual monitoring time by 80% and held 95%+ uptime across 3 prototype iterations.',
    tech:['ESP32','HX711','Load cell','React Native','Android','Firebase','Django REST','PostgreSQL','MQTT'], link:null,
    poster:{thumb:'assets/caretrax-poster-top.webp',full:'assets/caretrax-poster.webp',w:1000,h:2228,tw:960,th:1025} },
];

const EDUCATION = [
  { when:'2021 – 2025', title:'BS Computer Science', org:'Forman Christian College (A Chartered University)', short:'FC', color:'#8764B8', note:'CGPA 3.1',
    courses:'Machine Learning, Artificial Intelligence, Database Systems, Data Structures & Algorithms, Software Quality Assurance, Software Requirements Engineering, Web Application Development' },
  { when:'2019 – 2021', title:'Pre-Engineering', org:'Punjab College', short:'PC', color:'#2B3A8C' },
  { when:'2016 – 2019', title:'O Levels, Computer Science', org:'DHA Senior School for Boys', short:'DS', color:'#5C2E91' },
];
const CERTS = [
  { name:'Introduction to Data Science', issuer:'IBM · Coursera', kind:'Specialization', courses:[
    'Data Science Foundations: Tools, Careers & Real-World Applications',
    'Essential Tools for Data Scientists: Git, Jupyter & More',
    'Data Science Methodology: Apply the Framework in Real Projects',
    'Databases and SQL for Data Science with Python' ] },
  { name:'Exploring and Producing Data for Business Decision Making', issuer:'University of Illinois Urbana-Champaign · Coursera', kind:'Course' },
  { name:'Azure CloudOps: Automating Infrastructure & Cost Control', issuer:'Coursera', kind:'Course' },
  { name:'Database Operations in MariaDB Using Python', issuer:'Infosys · Coursera', kind:'Guided project' },
  { name:'Python Database Connection with MariaDB', issuer:'Infosys · Coursera', kind:'Guided project' },
  { name:'Introduction to Data Analysis Using Google Spreadsheet', issuer:'Coursera', kind:'Guided project' },
  { name:'Python for Everybody', issuer:'University of Michigan · Coursera', kind:'Specialization', courses:[
    'Programming for Everybody (Getting Started with Python)',
    'Python Data Structures',
    'Using Python to Access Web Data',
    'Using Databases with Python',
    'Capstone: Retrieving, Processing, and Visualizing Data with Python' ] },
  { name:'Create Charts and Dashboard using Google Sheets', issuer:'Coursera', kind:'Course' },
  { name:'RPA Developer Foundation', issuer:'UiPath Academy', kind:'Course' },
];

/* skills, grouped. Each item is [name]. */
const SKILLS = [
  { cat:'Test automation & QA', items:[['Playwright'],['BDD'],['SpecFlow'],['Reqnroll'],['Cucumber'],['API testing'],['Postman API'],['API interception'],['Backend validation'],['Feature testing'],['Agentic automation'],['Software Quality Assurance']] },
  { cat:'Programming', items:[['Python'],['C#'],['.NET Framework'],['SQL'],['C'],['C++'],['Object-Oriented Programming (OOP)'],['MIPS Assembly'],['Parallel computing']] },
  { cat:'Data & analytics', items:[['Data analysis'],['Data science'],['Exploratory data analysis'],['Data cleaning'],['Data preprocessing'],['Data validation'],['Data profiling'],['ETL testing'],['Data collection'],['Data extraction'],['Data management'],['Data mining'],['Data visualisation'],['Statistical analysis'],['Big data'],['CRISP-DM'],['pandas'],['NumPy'],['Matplotlib'],['Seaborn'],['Tableau'],['IBM SPSS'],['Microsoft Excel'],['Google Sheets'],['Jupyter notebooks'],['RStudio'],['Data entry']] },
  { cat:'Machine learning', items:[['Deep learning'],['Artificial intelligence (AI)'],['Feature engineering'],['Logistic Regression'],['Decision Trees'],['Model evaluation (MSE, MAE, R²)']] },
  { cat:'Databases', items:[['PostgreSQL'],['MariaDB'],['RDBMS'],['Cloud databases']] },
  { cat:'Automation, cloud & tools', items:[['Robotic Process Automation (RPA)'],['UiPath'],['Microsoft Power Automate'],['Azure DevOps Services'],['Amazon Web Services (AWS)'],['Amazon CloudWatch'],['GitHub'],['Firebase'],['ESP32']] },
  { cat:'Professional', items:[['Presentations'],['Communication'],['Teamwork'],['Problem solving'],['Attention to detail'],['Project management'],['Project planning'],['Project plans'],['Project documentation'],['Organisation skills'],['Teaching assistance'],['Student assessment'],['Freelancing'],['Computer literacy']] },
];

/* Chat answers: prewritten from the facts above. Matching is by keywords, not AI. */
const FAQ = [
  { k:['what do you do','role','job','work','current','netsol','now','position'], q:'What do you do right now?',
    a:`I'm an <b>Associate Software Engineer at NETSOL Technologies</b> (since Oct 2025), on the QA Automation team. I work on enterprise client products: building and maintaining test automation in C# and Python, verifying that the UI, the APIs and the stored data agree, testing new features, and presenting them to client teams.`, go:['experience','netsol'] },
  { k:['data','analytics','analyst','analysis','science','scientist','sql','pandas','machine learning','model'], q:'What data work have you done?',
    a:`Quite a lot of it day to day. At NETSOL I verify backend data through our Python BDD framework: checking that what the UI shows matches the API responses and the stored records. At CodSoft I cleaned and visualised datasets of 10,000+ records and built Logistic Regression and Decision Tree models (+20% accuracy over baseline). I've also done data extraction on Upwork and managed records for 100+ students in Google Sheets.`, go:['analytics','overview'] },
  { k:['automation','playwright','test','qa','framework','bdd','selenium','c#'], q:'What does your automation work look like?',
    a:`I started in <b>C#</b> (Playwright, .NET and BDD with SpecFlow and Reqnroll), building 150+ end-to-end cases across 3 products. That automation was then migrated to a <b>Python BDD framework</b>, where it keeps growing: automation scripts, test cases and regression coverage, plus API interception, backend validation and data verification. I also use <b>agentic automation</b> to cover test cases and regression flows, and to keep them up to date as the product changes. The <b>Automation Lab</b> section walks through it.`, go:['automation','architecture'] },
  { k:['project','portfolio','built','caretrax','titanic','movie','iris','github'], q:'Can I see your projects?',
    a:`I've worked on multiple projects, from machine-learning models to an IoT health monitor. Some of them are listed in the <b>Projects</b> section, with notebooks and videos.`, go:['projects','movie'] },
  { k:['skill','stack','tools','tech','language','python'], q:'What tools do you use?',
    a:`Python, SQL, C# and .NET; Playwright, Python BDD and SpecFlow for testing; pandas, NumPy, Matplotlib and Seaborn for analysis; UiPath and Azure DevOps. You can check all my skills in the <b>Skills</b> section.`, go:['skills','all'] },
  { k:['education','degree','university','study','fccu','forman','college','cgpa'], q:'Where did you study?',
    a:`BS Computer Science at <b>Forman Christian College (A Chartered University)</b>, 2021–2025. I was also a Teaching Assistant there in my final semester.`, go:['about','education'] },
  { k:['resume','cv','resume','download'], q:'Can I get your resume?',
    a:`Yes, open the <b>Resume</b> section on the left. It shows my full resume.`, go:['resume','doc'] },
  { k:['contact','email','mail','reach','hire','hiring','interview','call','meet'], q:'How do I reach you?',
    a:`Email me at <b>${'abdullahfarhat1492@gmail.com'}</b>, or use the <b>Contact</b> section to write a message right here. I'm also on LinkedIn.`, go:['contact','new'] },
  { k:['where','location','based','lahore','pakistan','remote','relocate'], q:'Where are you based?',
    a:`Lahore, Pakistan (PKT, UTC+5).`, go:null },
  { k:['hi','hello','hey','salam','assalam'], q:'Hi!',
    a:`Hi, thanks for stopping by. Ask me anything about my work, or pick one of the suggestions below.`, go:null },
];

const RESUME_TEXT = "Abdullah Farhat Khokhar\nlinkedin.com/in/abdullahkhokhar1/ | (+92) 306 6666919 | abdullahfarhat1492@gmail.com\n\nEDUCATION\nForman Christian College University Pakistan\nBachelor of Science in Computer Science 2025\n• CGPA: 3.1\n• Relevant Courses: (Data Structures and Algorithms, Database Systems, Artificial Intelligence, Machine Learning, Software Requirements Engineering, Software Quality Assurance, Web Application Development)\n\nWORK EXPERIENCE\nNETSOL Technologies October 2025 - Current\nAssociate Software Engineer\n• Developed and scaled automated UI test suites using C#, Playwright, and the .NET Framework, automating 150+ end-to-end test cases across 3 enterprise products while contributing to both Automation and Manual QA teams in parallel.\n• Transitioned automation to a Python-based BDD framework, implementing feature validation with API interception, backend validation, and data verification, reducing manual testing effort by 75%.\n• Worked extensively on the BMW project, performing feature/UI testing and production issue investigation, while presenting new features and updates directly to the BMW client team.\n• Leveraged AI/agentic automation within the Python framework, using BMW domain knowledge to accelerate testing cycles and streamline repetitive validation tasks.\nSystems Limited September 2023 - October 2023\nDigital Automation Intern\n• Coordinated with Systems Limited's Digital Automation team, concentrating on 6 UiPath projects.\n• Automated repetitive data processing workflows using modern development tools and technologies, cutting manual effort by 40%.\n• Devised and implemented automation solutions, cutting processing time by 50% for routine departmental tasks, leading to streamlined operations and increased efficiency across the board.\nCodSoft August 2023 - August 2023\nData Science Intern\n• Executed comprehensive data cleaning, preprocessing, and visualization tasks for diverse datasets with over 10,000 records, improving data quality and analysis outcomes.\n• Engineered features and developed predictive models using Logistic Regression and Decision Tree Regressor, achieving a 20% increase in accuracy rates over baseline models.\n• Collaborated with a cross-functional team of 8 professionals to analyze and interpret data insights, supporting informed decision-making processes within the organization.\n\nPROJECTS\nCareTrax (Automated Insulin Drip Monitoring System)\n• Built an IoT device to track insulin drip weight with ±2g accuracy using ESP32, HX711 and Load Cell.\n• Designed and deployed a custom Android app integrated with Firebase, enabling real-time monitoring and alert notifications with an average response time under 5 seconds.\n• Reduced manual monitoring time by 80%, improving hospital workflow efficiency.\n• Achieved 95%+ uptime and consistent performance through 3 prototype iterations.\n\nSKILLS AND INTERESTS\n• Skills: Python, SQL, C#, Data Validation, Data Profiling, ETL Testing, Tableau, Data Analysis, Playwright, API Interception, SpecFlow, Data Mining, Data Visualization, Machine Learning, Big Data, MS Excel.\n• Interests: Artificial Intelligence, Web Automation, IoT Development, E-commerce, Cryptocurrency, Chess.";
