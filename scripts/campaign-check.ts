/**
 * The film campaign on LinkedIn, checked against what the owner asked for and the house rules:
 * the plan (every second day, the times, weekend posts on weekends, twice a week, the next cycle)
 * and the words of all 77 posts (nothing called "free", no price, no first person, the house
 * length, a hook, the page address, hashtags, no two alike).
 *
 *   npx tsx scripts/campaign-check.ts
 *
 * Run it after changing a post in src/data/linkedin-campaign-*.ts or the plan in
 * src/lib/promo-campaign.ts. It reads no store and posts nothing. It must end with ALL OK.
 */
import { plan, fill, linkOf, cycleStart, CYCLE_DAYS, START } from '@/lib/promo-campaign'
import { WEEKEND_WEEKDAY, WEEKEND_WEEKEND } from '@/data/linkedin-campaign-weekend'
import { OVERVIEW_POSTS } from '@/data/linkedin-campaign-overview'
import { formatForLinkedIn, toPlain } from '@/lib/linkedin-format'

const results: string[] = []
const ok = (name: string, pass: boolean, detail = '') => results.push(`${pass ? 'ok   ' : 'WRONG'} ${name}${detail ? `  (${detail})` : ''}`)
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dow = (d: string) => new Date(`${d}T00:00:00Z`).getUTCDay()
const gap = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)

const c0 = plan(0)
const c1 = plan(1)
const wk = c0.filter((p) => p.film === 'weekend')
const ov = c0.filter((p) => p.film === 'overview')
ok('the first day is a Saturday', dow(START) === 6, START)
ok('77 posts in a cycle: 49 with the AI Weekend film, 28 with "What we do"', wk.length === 49 && ov.length === 28, `${wk.length} + ${ov.length}`)
ok('written: 35 weekday + 14 weekend + 28', WEEKEND_WEEKDAY.length === 35 && WEEKEND_WEEKEND.length === 14 && OVERVIEW_POSTS.length === 28, `${WEEKEND_WEEKDAY.length}, ${WEEKEND_WEEKEND.length}, ${OVERVIEW_POSTS.length}`)
ok('every post is used once in a cycle', new Set(c0.map((p) => p.id)).size === 77)
ok('the AI Weekend film goes out every second day', wk.every((p, i) => i === 0 || gap(wk[i - 1].date, p.date) === 2))
ok('its time goes morning, afternoon, evening, and round again', wk.every((p, i) => p.slot === ['morning', 'afternoon', 'evening'][i % 3]), wk.slice(0, 4).map((p) => `${DOW[dow(p.date)]} ${p.time}`).join(', '))
ok('a post on a Saturday or Sunday is one written for the weekend, and no other is', wk.every((p) => (dow(p.date) === 0 || dow(p.date) === 6) === p.id.startsWith('s')), `${wk.filter((p) => p.id.startsWith('s')).length} weekend posts`)
const wkDays = new Set(wk.map((p) => p.date))
ok('"What we do" never shares a day with the AI Weekend film', ov.every((p) => !wkDays.has(p.date)))
// a week is counted Monday to Sunday, as people count it
const perWeek = new Map<string, number>()
for (const p of ov) {
  const d = new Date(`${p.date}T00:00:00Z`)
  const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86_400_000).toISOString().slice(0, 10)
  perWeek.set(monday, (perWeek.get(monday) || 0) + 1)
}
ok('"What we do" goes out twice in every week, Monday to Sunday', [...perWeek.values()].every((n) => n === 2), [...perWeek.values()].join(''))
ok('"What we do" is on working days', ov.every((p) => dow(p.date) >= 1 && dow(p.date) <= 5), [...new Set(ov.map((p) => DOW[dow(p.date)]))].join(' '))
ok('no day has two posts', new Set(c0.map((p) => p.date)).size === c0.length)
ok('the films alternate tall and wide', wk.filter((p) => p.shape === 'tall').length === 25 && ov.filter((p) => p.shape === 'wide').length === 14)
const firstWeekendOfNext = c1.filter((p) => p.film === 'weekend')[0]
ok('the next cycle starts 14 weeks later, on a Saturday, two days after the last AI Weekend post', gap(START, cycleStart(1)) === CYCLE_DAYS && dow(c1[0].date) === 6 && gap(wk[wk.length - 1].date, firstWeekendOfNext.date) === 2, `${wk[wk.length - 1].date} -> ${firstWeekendOfNext.date}`)
ok('in the next cycle every post is on the same weekday and time as before', c0.every((p) => { const q = c1.find((x) => x.id === p.id); return !!q && dow(q.date) === dow(p.date) && q.time === p.time }))

// the words
const all = [...WEEKEND_WEEKDAY, ...WEEKEND_WEEKEND, ...OVERVIEW_POSTS]
const day = new Date('2026-11-16T04:00:00Z')
const plain = (t: string) => toPlain(formatForLinkedIn(fill(t, day)))
const words = (t: string) => plain(t).replace(/#\w+/g, '').split(/\s+/).filter(Boolean).length
const both = (p: { text: string; share: string }) => `${p.text} ${p.share}`
const ids = (f: (p: { id: string; text: string; share: string }) => boolean) => all.filter(f).map((p) => p.id).join(',')
const PRICE = /₹|\brs\.?\s?\d|\binr\b|\brupee|\$\s?\d|\bfees?\b|\bprice|\bdiscount|\bpaid\b|\bpay\b/i
ok('no post says "free"', all.every((p) => !/\bfree\b/i.test(both(p))), ids((p) => /\bfree\b/i.test(both(p))))
ok('no post names a price or a fee', all.every((p) => !PRICE.test(both(p))), ids((p) => PRICE.test(both(p))))
ok('every post opens with a hook in bold', all.every((p) => /^\*\*[^*\n]{20,}\*\*\n/.test(p.text)), ids((p) => !/^\*\*[^*\n]{20,}\*\*\n/.test(p.text)))
ok('every post names the page to go to', all.every((p) => /gennoor\.com/.test(p.text)), ids((p) => !/gennoor\.com/.test(p.text)))
const tagCount = (p: { text: string }) => (p.text.match(/#\w+/g) || []).length
ok('every post has 3 to 5 hashtags', all.every((p) => tagCount(p) >= 3 && tagCount(p) <= 5), ids((p) => tagCount(p) < 3 || tagCount(p) > 5))
const lens = all.map((p) => words(p.text))
ok('every post is 50 to 110 words, the house length', lens.every((n) => n >= 50 && n <= 110), `shortest ${Math.min(...lens)}, longest ${Math.max(...lens)}, usual ${Math.round(lens.reduce((a, b) => a + b, 0) / lens.length)}`)
ok('no two posts open the same way', new Set(all.map((p) => p.text.split('\n')[0].toLowerCase())).size === all.length)
ok('no two company page lines are the same', new Set(all.map((p) => p.share.toLowerCase())).size === all.length)
ok('every company page line is short and names the page', all.every((p) => p.share.length <= 170 && /gennoor\.com/.test(p.share)), all.filter((p) => p.share.length > 170 || !/gennoor\.com/.test(p.share)).map((p) => `${p.id}:${p.share.length}`).join(','))
const sets = new Set(all.map((p) => (p.text.match(/#\w+/g) || []).join(' ')))
ok('the hashtags vary', sets.size >= 25, `${sets.size} different sets`)
ok('the Claude Partner line is word for word wherever it is used', all.every((p) => !/Claude Partner/i.test(both(p)) || both(p).includes('Gennoor is Certified in the Claude Partner Network.')))
const FIRST = /(I|I'm|I've|I'll|I'd|my|me|mine|myself)/
ok('no post speaks in the first person singular (the house rule for every LinkedIn post)', all.every((p) => !FIRST.test(both(p))), ids((p) => FIRST.test(both(p))))
ok('no blank is left after the dates are written in', all.every((p) => !/[{}]/.test(fill(p.text) + fill(p.share))))
const PAST = /\blast (month|cohort)\b|\blast weekend(?! of every month)|\bparticipants? (said|built|loved)|\btestimonial/i
ok('no post tells of a past weekend or a past learner', all.every((p) => !PAST.test(both(p))), ids((p) => PAST.test(both(p))))

// the dates written in, on five kinds of day (the AI Weekend of November 2026 is the 28th and 29th)
const sample = 'The next one is {when}. ({dates})'
console.log('two weeks before :', fill(sample, new Date('2026-11-16T04:00:00Z')))
console.log('the Sunday before:', fill(sample, new Date('2026-11-22T04:00:00Z')))
console.log('the Wednesday    :', fill(sample, new Date('2026-11-25T04:00:00Z')))
console.log('Saturday 09:15   :', fill(sample, new Date('2026-11-28T03:45:00Z')))
console.log('Saturday 18:45   :', fill(sample, new Date('2026-11-28T13:15:00Z')))
console.log('link, weekend post:', linkOf(c0[0]))
const studio = ov.find((p) => /gennoor\.com\/studio/.test(p.text))
if (studio) console.log('link, studio post :', linkOf(studio))
console.log('the first two weeks:')
for (const p of c0.filter((x) => gap(START, x.date) < 14)) console.log(`  ${p.date} ${DOW[dow(p.date)]} ${p.time} ${p.film.padEnd(8)} ${p.shape.padEnd(4)} ${p.id}  ${p.text.split('\n')[0].replace(/\*\*/g, '').slice(0, 72)}`)
console.log(`\n${results.join('\n')}`)
console.log(results.some((r) => r.startsWith('WRONG')) ? '\nSOMETHING IS WRONG' : '\nALL OK')
