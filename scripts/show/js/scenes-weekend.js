/*
  The Gennoor AI Weekend film. Six scenes, about a minute.
  It says what is built on each day and how the weekend works. It carries no dates and no
  price: both change, and the page it sends people to shows them.
*/
const weekend = []
const wkBolt = (size) => `<div style="position:relative;width:${size}px;height:${size}px"><div data-loop="pulse" data-per="2" style="position:absolute;inset:-38%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,190,70,.62),transparent 70%)"></div>${ico('zap', size, 'gold', 'round')}</div>`
const sparks = (n, seed) => Array.from({ length: n }, (_, i) => { const a = (i * 137.5 + seed) % 360, r = 150 + ((i * 53 + seed) % 210); return `<i data-loop="float" data-amp="${6 + (i % 5) * 3}" data-per="${3 + (i % 4)}" data-i="${i}" style="position:absolute;left:${(640 + r * 1.7 * Math.cos(a * Math.PI / 180)).toFixed(0)}px;top:${(330 + r * Math.sin(a * Math.PI / 180)).toFixed(0)}px;width:${3 + (i % 3) * 2}px;height:${3 + (i % 3) * 2}px;border-radius:50%;background:${i % 3 ? '#ffd27a' : '#8ccaff'};box-shadow:0 0 12px ${i % 3 ? '#ffb02e' : '#3d94ff'};opacity:${0.35 + (i % 4) * 0.15}"></i>` }).join('')

// ------------------------------------------------------------------ 1. the question
weekend.push({
  id: 'hook',
  cues: [['w01', { 1: 0, 2: 'in' }]],
  bg: ground(GLOW.gold, { mx: 50, my: 46 }) + sparks(26, 11),
  fg: `
    <div class="abs" data-b="0" data-fx="pop" data-pad="80" style="left:${640 - 66}px;top:112px">${wkBolt(132)}</div>
    <div class="abs h1 center nowrap" data-b="1" style="left:0;width:1280px;top:306px;font-size:70px">What could you build with <span style="color:var(--claude)">Claude</span></div>
    <div class="abs h1 center nowrap" data-b="2" style="left:0;width:1280px;top:392px"><span class="grad serif" style="font-size:86px;padding:0 10px">in one weekend?</span></div>`,
})

// ------------------------------------------------------------------ 2. two live sessions
const dayPage = (label, day, n, tone) => `<div class="card" style="width:330px;height:300px;border-radius:28px;overflow:hidden;text-align:center">
    <div style="height:64px;display:flex;align-items:center;justify-content:center;background:${tone === 'gold' ? 'linear-gradient(180deg,#ffb83a,#f08a12)' : 'linear-gradient(180deg,#3d94ff,#0a5fe8)'};font:700 15px/1 var(--body);letter-spacing:.3em;color:${tone === 'gold' ? '#2a1a00' : '#fff'}">${label}</div>
    <div style="font:650 96px/1 var(--display);letter-spacing:-.04em;margin-top:34px">${day}</div>
    <div class="tiny" style="margin-top:22px;color:var(--soft);font-size:13px">Session ${n} &middot; live with the trainer</div></div>`
weekend.push({
  id: 'days',
  cues: [['w02', { 1: 'Two', 2: ['one', 1], 3: ['one', 2] }]],
  bg: ground(GLOW.deep, { mx: 50, my: 55 }),
  fg: `
    <div class="abs kicker center" data-b="0" data-fx="fade" style="left:0;width:1280px;top:84px">Come and see</div>
    <div class="abs h1 center nowrap" data-b="1" style="left:0;width:1280px;top:112px;font-size:62px">Two live sessions.</div>
    <div class="abs" data-b="2" data-fx="left" data-tf="rotate(-3deg)" style="left:270px;top:240px">${dayPage('SATURDAY', 'Day 1', 'one', 'blue')}</div>
    <div class="abs" data-b="3" data-fx="right" data-tf="rotate(3deg)" style="left:680px;top:240px">${dayPage('SUNDAY', 'Day 2', 'two', 'gold')}</div>
    <div class="abs row seq" data-b="3" data-o="4" data-fx="none" data-delay=".5" data-gap=".16" style="left:0;width:1280px;top:592px;justify-content:center;gap:12px">
      <span class="chip big" style="--dot:#ff6b6b"><i></i>Live</span><span class="chip big" style="--dot:#7cc0ff"><i></i>Online</span><span class="chip big" style="--dot:#ffc24b"><i></i>Questions answered as we go</span></div>`,
})

// ------------------------------------------------------------------ 3 and 4. what is built on each day
const build = (b, k, icon, tone, title, line, extra = '') => `<div class="abs card" data-b="${b}" style="left:${84 + k * 372}px;top:226px;width:344px;height:330px;padding:28px">
    <div class="row" style="justify-content:space-between;align-items:flex-start">${ico(icon, 96, tone)}<span style="font:650 60px/1 var(--display);letter-spacing:-.04em;color:rgba(255,255,255,.09)">0${k + 1}</span></div>
    <div class="h3 nowrap" style="margin-top:26px;font-size:23.5px">${title}</div><div class="p" style="margin-top:10px;font-size:17px">${line}</div>${extra}</div>`
weekend.push({
  id: 'day1',
  cues: [['w03', { 1: 'we' }], ['w04', { 2: 'weekly', 3: 'workspace' }]],
  bg: ground(GLOW.blue, { mx: 50, my: 58 }),
  fg: `${head('Day 1 &middot; Saturday', 'We set <span style="color:var(--claude)">Claude</span> up to know your work.', { color: 'var(--blue2)' })}
    ${build(1, 0, 'file-text', 'blue', 'Your context file', 'So the answers stop<br>being generic.')}
    ${build(2, 1, 'table-2', 'green', 'A weekly report in minutes', 'A messy sheet goes in.<br>A summary comes out.')}
    ${build(3, 2, 'folder-open', 'violet', 'A connected workspace', 'Claude reads your files<br>and drafts directly.')}`,
})
weekend.push({
  id: 'day2',
  cues: [['w05', { 1: 'automate', 2: 'app' }], ['w06', { 3: 'agent' }]],
  bg: ground(GLOW.gold, { mx: 50, my: 58 }),
  fg: `${head('Day 2 &middot; Sunday', 'We automate a task. Then build an agent.')}
    ${build(1, 0, 'repeat', 'gold', 'One task automated', 'A job you repeat every week<br>now runs when you ask.')}
    ${build(2, 1, 'app-window', 'rose', 'A small working app', 'Built just by describing it.<br>No coding needed.')}
    ${build(3, 2, 'bot', 'green', 'Your first agent', 'Give it a goal. It researches,<br>drafts and checks its own work.')}`,
})

// ------------------------------------------------------------------ 5. how the weekend works
const KIT = ['Session notes', 'Every prompt used', 'Demo files', 'Step-by-step guides', 'Setup checklist']
weekend.push({
  id: 'how',
  cues: [['w07', { 1: 0, 2: 'kit', 3: 'repeat' }]],
  bg: ground(GLOW.violet, { mx: 50, my: 55 }),
  fg: `${head('How it works', 'Built live. Then it is yours.')}
    ${[['eye', 'blue', 'Watch it built live', 'Step by step, from an empty screen.'], ['package-open', 'gold', 'Get the complete kit', 'Everything that was used.'], ['repeat', 'green', 'Repeat it yourself', 'At your own pace, on your own tasks.']]
      .map(([i, t, a, b2], k) => `<div class="abs card" data-b="${k + 1}" style="left:${84 + k * 372}px;top:214px;width:344px;height:232px;padding:26px 28px">${ico(i, 84, t)}<div class="h3" style="margin-top:22px;font-size:25px">${a}</div><div class="p" style="margin-top:8px;font-size:16.5px">${b2}</div></div>`).join('')}
    <div class="abs row seq" data-b="2" data-o="4" data-fx="none" data-delay=".5" data-gap=".14" style="left:84px;width:1112px;top:488px;gap:11px;flex-wrap:wrap">
      ${KIT.map((t, i) => `<span class="chip big" style="--dot:${['#ffc24b', '#7cc0ff', '#3ed598', '#b3a4ff', '#ff9db4'][i]}"><i></i>${t}</span>`).join('')}</div>`,
})

// ------------------------------------------------------------------ 6. reserve a seat
weekend.push({
  id: 'cta',
  cues: [['w08', { 1: 0, 2: 'Live' }], ['w09', { 3: 0 }]],
  bg: ground(GLOW.gold, { mx: 50, my: 44 }) + sparks(22, 47) + `<div class="abs" style="left:${640 - 520}px;top:${250 - 520}px;opacity:.4">${ring(500, 110, { speed: -1.1, dot: 2, alpha: .55, gold: 6, color: '#ffd27a' })}</div>`,
  fg: `
    <div class="abs" data-b="0" data-fx="pop" data-pad="80" style="left:${640 - 56}px;top:86px">${wkBolt(112)}</div>
    <div class="abs h1 center nowrap" data-b="1" style="left:0;width:1280px;top:244px;font-size:84px">The AI Weekend</div>
    <div class="abs row seq" data-b="2" data-fx="none" data-delay="0" data-gap=".3" style="left:0;width:1280px;top:366px;justify-content:center;gap:12px">
      <span class="chip big" style="--dot:#ff6b6b"><i></i>Live</span><span class="chip big" style="--dot:#7cc0ff"><i></i>Online</span><span class="chip big" style="--dot:#ffc24b"><i></i>The last weekend of every month</span></div>
    <div class="abs row" style="left:0;width:1280px;top:470px;justify-content:center"><div class="pill gold" data-b="3" data-fx="pop" style="height:68px;padding:0 38px;font-size:24px">Reserve your seat <span>&rarr;</span></div></div>
    <div class="abs h3 center" data-b="3" data-o="3" data-fx="fade" style="left:0;width:1280px;top:566px;font-size:26px;color:var(--soft)">gennoor.com/ai-weekend</div>
    <div class="abs" data-b="3" data-o="5" data-fx="fade" style="left:${640 - 80}px;top:626px">${img('logo', 'width:160px')}</div>`,
})

window.SHOWS = { ...(window.SHOWS || {}), weekend: { scenes: weekend } }
