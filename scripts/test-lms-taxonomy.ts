import { cleanOptionName, optionExists, mergedOptions, sanitizeCustom, slugifyOption } from '../src/lib/lms-taxonomy.ts'
const c = sanitizeCustom({ vendor: ['Databricks Pro', '<b>x</b>'], kind: [{ id: 'workshop', label: 'Workshop' }, { id: 'Bad Id', label: 'x1' }] })
const t = (n: string, v: unknown, e: unknown) => { if (JSON.stringify(v) !== JSON.stringify(e)) { console.log('FAIL', n, v, e); process.exitCode = 1 } else console.log('ok', n) }
t('clean', cleanOptionName('  Data   Bricks '), 'Data Bricks')
t('html', cleanOptionName('<img src=x>'), '')
t('free', cleanOptionName('Free stuff'), '')
t('long', cleanOptionName('x'.repeat(41)), '')
t('dupe ci', optionExists('vendor', 'microsoft'), true)
t('dupe custom', optionExists('vendor', 'databricks pro', c), true)
t('new', optionExists('topic', 'Quantum'), false)
t('kind dupe slug', optionExists('kind', 'USE CASE'), true)
t('sanitize', c, { vendor: ['Databricks Pro'], level: [], topic: [], domain: [], kind: [{ id: 'workshop', label: 'Workshop' }] })
t('merged', mergedOptions(c).vendors.at(-1), 'Databricks Pro')
t('slug', slugifyOption('AI & Data!'), 'ai-and-data')
