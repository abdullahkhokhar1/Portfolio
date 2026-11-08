// Assemble the single-file site: index.html (full page for GitHub Pages) and artifact.html (body fragment for preview).
const fs=require('fs'), r=f=>fs.readFileSync(__dirname+'/src/'+f,'utf8');
const head=`<title>Abdullah Farhat Khokhar | Workspace</title>
<link rel="icon" href="assets/logo.svg" type="image/svg+xml">
<meta name="description" content="Abdullah Farhat Khokhar: Software Engineer, QA Automation, Data & Analytics. Portfolio workspace.">
<style>
${r('styles.css')}
</style>`;
const body=`${r('icons.svg')}
${r('body.html')}
<script>
${r('data.js')}
${r('labs.js')}
${r('app.js')}
</script>`;
fs.writeFileSync(__dirname+'/artifact.html',head+'\n'+body);
fs.writeFileSync(__dirname+'/index.html',`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head><body>
${body}
</body></html>`);
console.log('built', fs.statSync(__dirname+'/index.html').size);
