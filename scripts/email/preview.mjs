// Renders every visitor email to HTML (and PNG screenshots with headless Chrome) without sending anything.
//   node scripts/email/preview.mjs [outDir]
import { createRequire } from 'module'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { execFileSync } from 'child_process'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const out = resolve(process.argv[2] || join(root, '.email-preview'))
const build = join(out, '_build')
mkdirSync(build, { recursive: true })

// Transpile the three files the templates need, rewriting the @/ alias to ./ siblings.
const files = { 'email-templates.ts': 'src/lib/email-templates.ts', 'email-theme.ts': 'src/lib/crm/email-theme.ts', 'escape-html.ts': 'src/lib/escape-html.ts' }
for (const [name, rel] of Object.entries(files)) {
  let src = readFileSync(join(root, rel), 'utf8').replace(/from '@\/lib\/(?:crm\/)?([\w-]+)'/g, "from './$1.mjs'")
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText
  writeFileSync(join(build, name.replace('.ts', '.mjs')), js)
}
const t = await import(pathToFileURL(join(build, 'email-templates.mjs')).href)

const pages = {
  welcome: t.welcomeEmailHtml('Jalal Khan'),
  training: t.trainingConfirmationHtml({ name: 'Priya Sharma', programTitle: 'AI-103 Azure AI Engineer', programKind: 'course', company: 'Acme Analytics', trainingForLabel: 'My team (12 people)', timelineLabel: 'Within 1 month', message: 'We want a hands-on version with our own data.' }),
  expert_call: t.expertCallHtml({ name: 'Rahul Mehta', programTitle: 'Claude for teams', company: 'Mehta Logistics', country: 'India', role: 'Head of Operations' }),
  certification: t.certificationHtml({ name: 'Asha Rao', certification: 'AI-102 Azure AI Engineer Associate', level: 'Intermediate', targetDate: 'December 2026', mode: 'Online, weekends' }),
  readiness_report: t.readinessReportHtml('Sam Patel', 'Quick Scan'),
  readiness_org: t.readinessOrgHtml('Sam Patel'),
  cowork: t.coworkHtml({ name: 'Neha Iyer', timeZone: 'Asia/Kolkata' }),
}
const chrome = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const shots = process.env.SHOTS_DIR
for (const [name, html] of Object.entries(pages)) {
  // Images live on the production host once deployed; for the preview read them from public/.
  const local = html
    .replaceAll('https://www.gennoor.com/email/', pathToFileURL(join(root, 'public', 'email') + '/').href)
    .replaceAll('https://www.gennoor.com/logos/', pathToFileURL(join(root, 'public', 'logos') + '/').href)
  const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f1f5f9">${local}</body></html>`
  const file = join(out, `${name}.html`)
  writeFileSync(file, doc)
  if (shots) {
    mkdirSync(shots, { recursive: true })
    // Headless Chrome will not go narrower than ~500px, so the 420px phone view is an iframe of that width.
    const phone = join(out, `${name}_phone.html`)
    writeFileSync(phone, `<!doctype html><body style="margin:0;background:#cbd5e1;padding:20px 0"><iframe src="${pathToFileURL(file).href}" width="420" height="2300" style="display:block;margin:0 auto;border:0;background:#f1f5f9"></iframe></body>`)
    for (const [tag, w, h, page] of [['mobile', 520, 2340, phone], ['desktop', 800, 2000, file]]) {
      execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${w},${h}`, '--force-device-scale-factor=2', '--allow-file-access-from-files', `--screenshot=${join(shots, `email_${name}_${tag}.png`)}`, pathToFileURL(page).href], { stdio: 'ignore' })
    }
  }
}
console.log('rendered', Object.keys(pages).join(', '), '->', out)
