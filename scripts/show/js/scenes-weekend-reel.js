/*
  The Gennoor AI Weekend film, drawn tall: 720 x 1280 here, 1080 x 1920 in the file.
  For Instagram Reels, LinkedIn on a phone, WhatsApp status: anywhere a film is held upright.

  Same words, same voice and same six scenes as scenes-weekend.js; only the layout is new.
  Where things may sit (in the 720 x 1280 picture):

    0    ┌──────────────┐
         │  app's header│  the top 180 is left to the app (its title, the camera, the close button)
    180  ├──────────────┤
         │              │
         │   content    │  everything a viewer must read sits between 180 and 866,
         │              │  and between 48 and 632 across (the app's buttons run down the right edge)
    866  ├──────────────┤
         │   captions   │  the words being spoken, burned in by engine.js (880 to 980)
    980  ├──────────────┤
         │ app's caption│  the bottom 300 is covered by the account name, the caption and the sound
    1280 └──────────────┘

  The glows and the dots fill the whole picture, so nothing looks cut off.
*/
const reel = []
const RX = 48, RW = 584           // the column everything is set in
const GLOWV = {
  gold: [[360, 250, 900, 'rgba(255,170,46,.22)'], [70, 1040, 840, 'rgba(34,110,255,.34)'], [670, 1190, 720, 'rgba(120,96,255,.26)']],
  deep: [[640, 190, 880, 'rgba(34,110,255,.32)'], [90, 900, 760, 'rgba(98,224,232,.13)'], [420, 1290, 780, 'rgba(120,96,255,.22)']],
  blue: [[110, 150, 880, 'rgba(34,110,255,.36)'], [650, 1090, 840, 'rgba(120,96,255,.26)'], [610, 300, 480, 'rgba(255,190,80,.08)']],
  violet: [[360, 130, 920, 'rgba(120,96,255,.3)'], [70, 1090, 780, 'rgba(34,110,255,.28)'], [690, 900, 600, 'rgba(98,224,232,.12)']],
}
const sparksV = (n, seed) => Array.from({ length: n }, (_, i) => { const a = (i * 137.5 + seed) % 360, r = 210 + ((i * 53 + seed) % 250); return `<i data-loop="float" data-amp="${6 + (i % 5) * 3}" data-per="${3 + (i % 4)}" data-i="${i}" style="position:absolute;left:${(360 + r * 0.92 * Math.cos(a * Math.PI / 180)).toFixed(0)}px;top:${(520 + r * 1.5 * Math.sin(a * Math.PI / 180)).toFixed(0)}px;width:${3 + (i % 3) * 2}px;height:${3 + (i % 3) * 2}px;border-radius:50%;background:${i % 3 ? '#ffd27a' : '#8ccaff'};box-shadow:0 0 12px ${i % 3 ? '#ffb02e' : '#3d94ff'};opacity:${0.35 + (i % 4) * 0.15}"></i>` }).join('')

// ------------------------------------------------------------------ 1. the question
reel.push({
  id: 'hook',
  cues: [['w01', { 1: 0, 2: 'in' }]],
  bg: ground(GLOWV.gold, { mx: 50, my: 38 }) + sparksV(26, 11),
  fg: `
    <div class="abs" data-b="0" data-fx="pop" data-pad="90" style="left:${360 - 82}px;top:222px">${wkBolt(164)}</div>
    <div class="abs h1 center" data-b="1" style="left:30px;width:660px;top:470px;font-size:64px;line-height:1.1">What could you<br>build with <span style="color:var(--gold)">AI</span></div>
    <div class="abs h1 center nowrap" data-b="2" style="left:0;width:720px;top:630px"><span class="grad serif" style="font-size:84px;padding:0 10px">in one weekend?</span></div>`,
})

// ------------------------------------------------------------------ 2. two live sessions
const dayPageV = (label, day, n, tone) => `<div class="card" style="width:270px;height:292px;border-radius:26px;overflow:hidden;text-align:center">
    <div style="height:60px;display:flex;align-items:center;justify-content:center;background:${tone === 'gold' ? 'linear-gradient(180deg,#ffb83a,#f08a12)' : 'linear-gradient(180deg,#3d94ff,#0a5fe8)'};font:700 15px/1 var(--body);letter-spacing:.3em;color:${tone === 'gold' ? '#2a1a00' : '#fff'}">${label}</div>
    <div style="font:650 84px/1 var(--display);letter-spacing:-.04em;margin-top:38px">${day}</div>
    <div class="tiny" style="margin-top:26px;color:var(--soft);font-size:13px">Session ${n} &middot; live</div></div>`
reel.push({
  id: 'days',
  cues: [['w02', { 1: 'Two', 2: ['one', 1], 3: ['one', 2] }]],
  bg: ground(GLOWV.deep, { mx: 50, my: 42 }),
  fg: `
    <div class="abs kicker center" data-b="0" data-fx="fade" style="left:0;width:720px;top:204px;font-size:15px">Come and see</div>
    <div class="abs h1 center nowrap" data-b="1" style="left:0;width:720px;top:240px;font-size:64px">Two live sessions.</div>
    <div class="abs" data-b="2" data-fx="left" data-tf="rotate(-4deg)" style="left:62px;top:372px">${dayPageV('SATURDAY', 'Day 1', 'one', 'blue')}</div>
    <div class="abs" data-b="3" data-fx="right" data-tf="rotate(4deg)" style="left:372px;top:428px">${dayPageV('SUNDAY', 'Day 2', 'two', 'gold')}</div>
    <div class="abs row seq" data-b="3" data-o="4" data-fx="none" data-delay=".5" data-gap=".16" style="left:${RX}px;width:${RW}px;top:756px;justify-content:center;gap:12px;flex-wrap:wrap">
      <span class="chip big" style="--dot:#ff6b6b"><i></i>Live</span><span class="chip big" style="--dot:#7cc0ff"><i></i>Online</span><span class="chip big" style="--dot:#ffc24b"><i></i>Questions answered as we go</span></div>`,
})

// ------------------------------------------------------------------ 3 and 4. what is built on each day: three rows, one under the other
const buildV = (b, k, icon, tone, title, line, top = 366, tall = 156, step = 172) => `<div class="abs card" data-b="${b}" style="left:${RX}px;top:${top + k * step}px;width:${RW}px;height:${tall}px;padding:0 26px;display:flex;align-items:center;gap:22px">
    ${ico(icon, 100, tone)}
    <div style="min-width:0"><div class="h3 nowrap" style="font-size:25px">${title}</div><div class="p" style="margin-top:8px;font-size:18px;line-height:1.35">${line}</div></div>
    <span style="position:absolute;right:22px;top:14px;font:650 46px/1 var(--display);letter-spacing:-.04em;color:rgba(255,255,255,.1)">0${k + 1}</span></div>`
const headV = (kicker, title, color) => `<div class="abs kicker" data-b="0" data-fx="fade" style="left:${RX}px;top:196px;font-size:15px;${color ? `color:${color}` : ''}">${kicker}</div>
    <div class="abs h2" data-b="0" data-o="1" style="left:${RX - 2}px;top:228px;width:640px;font-size:48px;line-height:1.1">${title}</div>`
// Saturday has four parts: four shorter rows in the same space (they end at 862; the safe area ends at 866)
const buildV4 = (b, k, icon, tone, title, line) => `<div class="abs card" data-b="${b}" style="left:${RX}px;top:${366 + k * 126}px;width:${RW}px;height:118px;padding:0 24px;display:flex;align-items:center;gap:20px">
    ${ico(icon, 78, tone)}
    <div style="min-width:0"><div class="h3 nowrap" style="font-size:23px">${title}</div><div class="p" style="margin-top:6px;font-size:16.5px;line-height:1.3">${line}</div></div>
    <span style="position:absolute;right:20px;top:12px;font:650 40px/1 var(--display);letter-spacing:-.04em;color:rgba(255,255,255,.1)">0${k + 1}</span></div>`
reel.push({
  id: 'day1',
  cues: [['w03', { 1: 'how', 2: 'weekly' }], ['w04', { 3: 'pictures', 4: 'skills' }]],
  bg: ground(GLOWV.blue, { mx: 50, my: 48 }),
  fg: `${headV('Day 1 &middot; Saturday', 'From how AI works<br>to your own tools.', 'var(--blue2)')}
    ${buildV4(1, 0, 'file-text', 'blue', 'Your context file', 'So the answers stop being generic.')}
    ${buildV4(2, 1, 'table-2', 'green', 'A weekly report in minutes', 'A messy sheet in, a summary out.')}
    ${buildV4(3, 2, 'video', 'rose', 'Pictures, video and sound', 'Made with AI, from a description.')}
    ${buildV4(4, 3, 'blocks', 'violet', 'Skills and connectors', 'AI reaches your files and tools.')}`,
})
reel.push({
  id: 'day2',
  cues: [['w05', { 1: 'automate', 2: 'agent' }], ['w06', { 3: 'team' }]],
  bg: ground(GLOWV.gold, { mx: 50, my: 48 }),
  fg: `${headV('Day 2 &middot; Sunday', 'We automate a task.<br>Then build agents.')}
    ${buildV(1, 0, 'repeat', 'gold', 'One task automated', 'A job you repeat every week<br>now runs when you ask.')}
    ${buildV(2, 1, 'bot', 'green', 'Your first agent', 'Give it a goal. It researches,<br>drafts and checks its own work.')}
    ${buildV(3, 2, 'users', 'rose', 'A team of agents', 'Each has one job, and they<br>pass the work to each other.')}`,
})

// ------------------------------------------------------------------ 5. how the weekend works
reel.push({
  id: 'how',
  cues: [['w07', { 1: 0, 2: 'kit', 3: 'repeat' }]],
  bg: ground(GLOWV.violet, { mx: 50, my: 46 }),
  fg: `${headV('How it works', 'Built live.<br>Then it is yours.')}
    ${[['eye', 'blue', 'Watch it built live', 'Step by step, from an empty screen.'], ['package-open', 'gold', 'Get the complete kit', 'Everything that was used.'], ['repeat', 'green', 'Repeat it yourself', 'At your own pace, on your own tasks.']]
      .map(([i, t, a, b2], k) => buildV(k + 1, k, i, t, a, b2, 366, 124, 138)).join('')}
    <div class="abs row seq" data-b="2" data-o="4" data-fx="none" data-delay=".5" data-gap=".14" style="left:${RX}px;width:${RW}px;top:786px;gap:10px;flex-wrap:wrap">
      ${KIT.map((t, i) => `<span class="chip" style="--dot:${['#ffc24b', '#7cc0ff', '#3ed598', '#b3a4ff', '#ff9db4'][i]}"><i></i>${t}</span>`).join('')}</div>`,
})

// ------------------------------------------------------------------ 6. reserve a seat
reel.push({
  id: 'cta',
  cues: [['w08', { 1: 0, 2: 'Live' }], ['w09', { 3: 0 }]],
  bg: ground(GLOWV.gold, { mx: 50, my: 40 }) + sparksV(22, 47) + `<div class="abs" style="left:${360 - 470}px;top:${300 - 470}px;opacity:.4">${ring(450, 100, { speed: -1.1, dot: 2, alpha: .55, gold: 6, color: '#ffd27a' })}</div>`,
  fg: `
    <div class="abs" data-b="0" data-fx="pop" data-pad="90" style="left:${360 - 70}px;top:206px">${wkBolt(140)}</div>
    <div class="abs h1 center nowrap" data-b="1" style="left:0;width:720px;top:386px;font-size:76px">The AI Weekend</div>
    <div class="abs row seq" data-b="2" data-fx="none" data-delay="0" data-gap=".26" style="left:${RX}px;width:${RW}px;top:498px;justify-content:center;gap:12px;flex-wrap:wrap">
      <span class="chip big" style="--dot:#ff6b6b"><i></i>Live</span><span class="chip big" style="--dot:#7cc0ff"><i></i>Online</span><span class="chip big" style="--dot:#b3a4ff"><i></i>Saturday &amp; Sunday</span>
      <span class="chip big" style="--dot:#ffc24b"><i></i>The last weekend of every month</span></div>
    <div class="abs row" style="left:0;width:720px;top:652px;justify-content:center"><div class="pill gold" data-b="3" data-fx="pop" style="height:72px;padding:0 40px;font-size:26px">Reserve your seat <span>&rarr;</span></div></div>
    <div class="abs h3 center" data-b="3" data-o="3" data-fx="fade" style="left:0;width:720px;top:752px;font-size:27px;color:var(--soft)">gennoor.com/ai-weekend</div>
    <div class="abs" data-b="3" data-o="5" data-fx="fade" style="left:${360 - 88}px;top:802px">${img('logo', 'width:176px')}</div>`,
})

window.SHOWS = { ...(window.SHOWS || {}), 'weekend-reel': { scenes: reel } }
