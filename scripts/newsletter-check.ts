/**
 * The weekly email of new posts: its rules, checked with made-up posts, made-up people and a made-up clock.
 *
 *   npx tsx scripts/newsletter-check.ts          must end with ALL OK
 *
 * It reads no store, no mailbox and sends nothing: it runs the pure rules of src/lib/newsletter.ts (which
 * Thursday, which posts, who gets it, how many at a time, never twice) and the email of
 * src/lib/newsletter-email.ts (its words and its links). Run it before any pull request that touches either.
 * Every name and address in it is invented.
 */
import { issueFor, issueTime, newsletterTick, nextIssue, postsFor, subscribed, MAX_POSTS, PER_HOUR, PER_TICK, type DigestPost, type NewsletterDeps, type NewsletterState } from '@/lib/newsletter'
import { brief, digestEmail, digestSubject, weekWords } from '@/lib/newsletter-email'

let failed = 0
const ok = (name: string, pass: boolean, detail = '') => { console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${detail ? `  (${detail})` : ''}`); if (!pass) failed++ }

/** A moment given as India time, "2026-11-19 10:00". */
const ist = (text: string) => Date.parse(`${text.replace(' ', 'T')}:00+05:30`)
const post = (slug: string, date: string, title = `Post ${slug}`): DigestPost => ({ slug, title, excerpt: `What ${slug} is about, said in one plain sentence for a manager who is curious about AI and not a specialist.`, date, category: 'AI Strategy', readTime: '6 min read' })

// ---- 1. Which Thursday
ok('Thursday 09:59 India time still belongs to last week\'s issue', issueFor(ist('2026-11-19 09:59')) === '2026-11-12', issueFor(ist('2026-11-19 09:59')))
ok('Thursday 10:00 is this week\'s issue', issueFor(ist('2026-11-19 10:00')) === '2026-11-19')
ok('Saturday belongs to the Thursday before it', issueFor(ist('2026-11-14 00:30')) === '2026-11-12')
ok('Wednesday night belongs to last Thursday', issueFor(ist('2026-11-18 23:59')) === '2026-11-12')
ok('the next issue is seven days on', nextIssue(ist('2026-11-14 00:30')) === '2026-11-19')
ok('an issue is due at 10:00 India time on its day', issueTime('2026-11-19') === ist('2026-11-19 10:00'))
ok('across a year end', issueFor(ist('2027-01-02 12:00')) === '2026-12-31')

// ---- 2. Which posts
{
  const all = [post('a', '2026-11-19'), post('b', '2026-11-18'), post('c', '2026-11-13'), post('d', '2026-11-12'), post('e', '2026-11-20'), post('f', '2026-11-16')]
  const got = postsFor('2026-11-19', all).map((p) => p.slug).join(',')
  ok('the seven days up to and including the Thursday, newest first', got === 'a,b,f,c', got)
  ok('a post that went in an earlier issue is not sent again', postsFor('2026-11-19', all, ['b']).map((p) => p.slug).join(',') === 'a,f,c')
  const many = Array.from({ length: 12 }, (_, i) => post(`m${i}`, '2026-11-17'))
  ok(`never more than ${MAX_POSTS} posts in one email`, postsFor('2026-11-19', many).length === MAX_POSTS)
  ok('a week with no post gives nothing', postsFor('2026-11-19', [post('x', '2026-11-01')]).length === 0)
}

// ---- 3. Who gets it
{
  const signUps = [
    { email: 'Asha@Example.org', at: '2026-11-01T10:00:00Z' },
    { email: 'ben@company.in', at: '2026-11-02T10:00:00Z' },
    { email: 'ben@company.in', at: '2026-11-05T10:00:00Z' },        // signed up twice
    { email: 'cara@company.in', at: '2026-11-03T10:00:00Z' },
    { email: 'dev@company.in', at: '2026-11-04T10:00:00Z' },
    { email: 'dev@company.in', at: '2026-11-09T10:00:00Z' },        // came back after asking to stop
    { email: 'not-an-address', at: '2026-11-04T10:00:00Z' },
    { email: 'tester@example.com', at: '2026-11-04T10:00:00Z' },    // cannot be a real mailbox
  ]
  const optOuts = [{ email: 'cara@company.in', at: '2026-11-06T10:00:00Z' }, { email: 'dev@company.in', at: '2026-11-07T10:00:00Z' }]
  const list = subscribed(signUps, optOuts).join(',')
  ok('each address once, in the order they signed up', list.startsWith('ben@company.in'), list)
  ok('someone who asked to stop is not written to', !list.includes('cara@'))
  ok('someone who signed up again after stopping is', list.includes('dev@company.in'))
  ok('made-up and broken addresses are left out', !list.includes('example') && !list.includes('not-an-address'), list)
}

// ---- 4. The week, step by step (a made-up store, clock and email service)
async function week() {
  let state: NewsletterState | null = null
  let clock = ist('2026-11-14 00:30')
  let people = Array.from({ length: 12 }, (_, i) => `person${i}@company.in`)
  let siteRoom = 100
  let posts = [post('p1', '2026-11-16'), post('p2', '2026-11-18')]
  const sentTo: string[] = []
  let refuse: string[] = []
  const deps: NewsletterDeps = {
    now: () => clock,
    load: async () => (state ? structuredClone(state) : null),
    save: async (s) => { state = structuredClone(s) },
    posts: () => posts,
    people: async () => people,
    room: async () => siteRoom,
    send: async (email) => { if (refuse.includes(email)) return false; sentTo.push(email); return true },
  }
  const tick = async (at: string) => { clock = ist(at); return (await newsletterTick(deps)).join(' | ') }

  ok('the first run ever sends nothing: the first email is the next Thursday\'s', (await tick('2026-11-14 00:30')).includes('first issue is 2026-11-19') && sentTo.length === 0)
  ok('nothing goes before Thursday 10:00', (await tick('2026-11-19 09:45')) === 'nothing due' && sentTo.length === 0)
  const first = await tick('2026-11-19 10:00')
  ok(`on Thursday at 10:00 the first ${PER_TICK} go`, sentTo.length === PER_TICK, first)
  await tick('2026-11-19 10:15'); await tick('2026-11-19 10:30')
  ok('a few more at each heartbeat, nobody twice', sentTo.length === 12 && new Set(sentTo).size === 12, `${sentTo.length} sent`)
  const closing = await tick('2026-11-19 10:45')
  ok('when everyone has had it, the issue is finished', closing.includes('finished') && !state!.current && state!.history[0].sent === 12, closing)
  ok('and nothing more goes that week', (await tick('2026-11-20 11:00')) === 'nothing due' && sentTo.length === 12)

  // The next week: a late subscriber, someone who stopped, the hour's limit, an address that fails
  posts = [...posts, post('p3', '2026-11-24')]
  people = [...people.filter((e) => e !== 'person3@company.in'), ...Array.from({ length: 30 }, (_, i) => `new${i}@company.in`)]
  refuse = ['person5@company.in']
  sentTo.length = 0
  await tick('2026-11-26 10:00')
  ok('the next issue holds only the new post', state!.current!.slugs.join(',') === 'p3', state!.current!.slugs.join(','))
  for (const t of ['10:15', '10:30', '10:45']) await tick(`2026-11-26 ${t}`)
  // four heartbeats of five: twenty places, three of them spent on the address that is refused
  ok(`no more than ${PER_HOUR} in an hour`, sentTo.length <= PER_HOUR && sentTo.length >= PER_HOUR - 3, `${sentTo.length} in the first hour`)
  const beforeWait = sentTo.length
  siteRoom = 0
  await tick('2026-11-26 11:00')
  ok('when the rest of the site has used the hour, the weekly email waits', sentTo.length === beforeWait)
  siteRoom = 100
  for (const t of ['11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00']) await tick(`2026-11-26 ${t}`)
  ok('then it goes on until everyone has had it', new Set(sentTo).size === sentTo.length && sentTo.length === 40, `${sentTo.length} of 40 who can be reached`)
  ok('the person who asked to stop got nothing', !sentTo.includes('person3@company.in'))
  ok('an address the email service refuses is tried three times, then left', !sentTo.includes('person5@company.in') && !state!.current && state!.history[0].issue === '2026-11-26', JSON.stringify(state!.history[0]).slice(0, 90))

  // A week with no post
  await tick('2026-12-03 10:00')
  ok('a week with no new post sends nothing and says so', state!.history[0].issue === '2026-12-03' && state!.history[0].sent === 0 && /no new posts/.test(state!.history[0].note || ''), state!.history[0].note)

  // A restart in the middle of a send must not send anyone the issue twice
  posts = [...posts, post('p4', '2026-12-08')]
  sentTo.length = 0
  let saves = 0
  const crashing: NewsletterDeps = { ...deps, save: async (s) => { state = structuredClone(s); if (++saves === 3) throw new Error('the server stopped here') } }
  clock = ist('2026-12-10 10:00')
  await newsletterTick(crashing).catch(() => undefined)
  const before = sentTo.length
  for (const t of ['10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45']) await tick(`2026-12-10 ${t}`)
  ok('a restart in the middle of a send sends nobody the issue twice', before > 0 && new Set(sentTo).size === sentTo.length, `${sentTo.length} sent, ${new Set(sentTo).size} different people`)
}

// ---- 5. The email itself
function email() {
  const posts = [post('one', '2026-11-19', 'What an AI agent can do for a finance team'), post('two', '2026-11-18', 'Five questions to ask before buying an AI tool'), post('three', '2026-11-17', 'Tom & Jerry <script>')]
  const link = 'https://www.gennoor.com/api/unsubscribe?email=a%40b.in&token=abc'
  const mail = digestEmail(posts, '2026-11-19', link)
  ok('the subject is the newest post, and how many more', mail.subject === 'What an AI agent can do for a finance team (and 2 more this week)', mail.subject)
  ok('one post alone needs no "more"', digestSubject([posts[0]]) === posts[0].title)
  ok('every post is in it, with a link to it', posts.every((p) => mail.html.includes(`https://www.gennoor.com/resources/blog/${p.slug}`)))
  ok('the week is said in words', weekWords('2026-11-19') === '13 to 19 November 2026' && weekWords('2026-12-03') === '27 November to 3 December 2026', `${weekWords('2026-11-19')} / ${weekWords('2026-12-03')}`)
  ok('the reader\'s own unsubscribe link is in it', mail.html.includes(link.replace(/&/g, '&')) && /Unsubscribe/.test(mail.html))
  ok('a title cannot put code into the email', !mail.html.includes('<script>') && mail.html.includes('Tom &amp; Jerry &lt;script&gt;'))
  ok('it opens with the light top, not a dark band', mail.html.includes('/email/header.png') && !/#0C1426/i.test(mail.html))
  const words = mail.html.replace(/<[^>]+>/g, ' ')
  ok('nothing is called free, and there is no price', !/\bfree\b/i.test(words) && !/[₹$]\s?\d/.test(words))
  ok('a long summary is cut at a word', brief('one two three four five six seven eight nine ten', 22) === 'one two three four…', brief('one two three four five six seven eight nine ten', 22))
}

week().then(() => {
  email()
  console.log(failed ? `\n${failed} CHECK(S) FAILED` : '\nALL OK')
  process.exit(failed ? 1 : 0)
}).catch((e) => { console.error(e); process.exit(1) })
