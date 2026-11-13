/*
  "What we do", drawn tall: 720 x 1280 here, 1080 x 1920 in the file. For Instagram Reels,
  LinkedIn on a phone, WhatsApp status.

  Same words and the same voice as the film on the home page (scenes-overview.js); every
  scene is laid out again for an upright screen. The safe area is described at the top of
  scenes-weekend-reel.js: content between 180 and 866 down, 48 and 632 across.
*/
const reelO = []
GLOWV.claude = [[600, 200, 880, 'rgba(229,138,98,.3)'], [90, 1000, 820, 'rgba(34,110,255,.28)'], [420, 1290, 640, 'rgba(255,190,80,.1)']]
GLOWV.green = [[620, 980, 900, 'rgba(62,213,152,.16)'], [110, 170, 900, 'rgba(34,110,255,.34)'], [400, 0, 600, 'rgba(120,96,255,.16)']]
/** A short row: a small icon tile, a few words, and a quieter few after them. */
const rowV = (b, top, icon, tone, title, line, attrs = '', tall = 62) => `<div class="abs card" data-b="${b}" data-fx="right" data-pad="30" ${attrs} style="left:${RX}px;top:${top}px;width:${RW}px;height:${tall}px;border-radius:18px;padding:0 16px 0 10px;display:flex;align-items:center;gap:14px">
    ${ico(icon, tall - 16, tone)}<div style="min-width:0"><div class="h3 nowrap" style="font-size:19px">${title}</div>${line ? `<div class="small nowrap" style="margin-top:3px;font-size:14px">${line}</div>` : ''}</div></div>`

// ------------------------------------------------------------------ 1. the vision
reelO.push({
  id: 'vision',
  cues: [['o01', { 1: 0, 2: 'learn', 3: 'And' }], ['o02', { 4: 0 }]],
  bg: ground(GLOWV.blue, { mx: 50, my: 38 }) + `<div class="abs" style="left:${360 - 540}px;top:${480 - 540}px;opacity:.45">${ring(520, 120, { speed: -0.9, dot: 2, alpha: .55, gold: 0 })}</div>`,
  fg: `
    <div class="abs" data-b="0" data-fx="fade" data-dur="1.8" style="left:${360 - 346}px;top:${488 - 346}px">${ring(326, 84, { speed: 1.6, alpha: .8 })}</div>
    <div class="abs kicker center" data-b="0" data-fx="fade" style="left:0;width:720px;top:236px;font-size:15px">Our vision</div>
    <div class="abs h1 center" data-b="1" style="left:0;width:720px;top:280px;font-size:58px;line-height:1.1">A world where<br>anyone can learn</div>
    <div class="abs h1 center" data-b="2" style="left:0;width:720px;top:412px;font-size:58px;line-height:1.1">the skills that<br>work asks for,</div>
    <div class="abs h1 center nowrap" data-b="3" style="left:0;width:720px;top:548px"><span class="grad serif" style="font-size:80px;padding:0 8px">and prove them.</span></div>
    <div class="abs p center" data-b="4" style="left:0;width:720px;top:676px;font-size:25px">That is what we are building.</div>
    <div class="abs" data-b="4" data-o="2" data-fx="fade" style="left:${360 - 110}px;top:738px">${img('logo', 'width:220px')}</div>`,
})

// ------------------------------------------------------------------ 2. why
reelO.push({
  id: 'why',
  cues: [['o03', { 1: 0, 2: 'We' }]],
  bg: ground(GLOWV.deep, { mx: 50, my: 46 }),
  fg: `
    <div class="abs kicker" data-b="0" data-fx="fade" style="left:${RX}px;top:196px;font-size:15px">Why we exist</div>
    ${piece(1, `left:${RX - 2}px;top:232px;width:640px`, `<div class="h2" style="font-size:46px;color:var(--mute);font-weight:600;line-height:1.12">Most training ends<br>when the slides end.</div>`)}
    ${piece(1, `left:${RX}px;top:358px`, `<div class="row" style="gap:12px">${[0, 1, 2, 3].map(slideCard).join('')}<span class="chip" style="--dot:#7d8cab;color:var(--mute);margin-left:6px"><i></i>The end</span></div>`, 'data-o="2" data-fx="left"')}
    <div class="abs" data-b="1" data-o="3" data-fx="fade" style="left:${RX}px;top:448px;width:${RW}px;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.22),transparent)"></div>
    ${piece(2, `left:${RX - 2}px;top:480px;width:640px`, `<div class="h1" style="font-size:60px;line-height:1.08">It should end<br>when you can<br><span class="grad">do the work.</span></div>`)}
    <div class="abs" data-b="2" data-o="3" data-fx="fade" data-pad="20" style="left:${RX + 48}px;top:752px">
      <svg width="488" height="20" viewBox="0 0 488 20" style="overflow:visible"><defs><linearGradient id="pathV1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="488" y2="0"><stop offset="0" stop-color="#3d94ff"/><stop offset=".6" stop-color="#8f7dff"/><stop offset="1" stop-color="#ffc24b"/></linearGradient></defs>
      <path class="draw" data-delay=".1" data-dur="1.5" d="M0 10 H488" stroke="url(#pathV1)" stroke-width="4" style="filter:drop-shadow(0 0 8px rgba(120,150,255,.9))"/></svg></div>
    <div class="abs seq" data-b="2" data-o="4" data-fx="none" data-delay=".15" data-gap=".38" style="left:${RX}px;top:720px;width:${RW}px;display:flex;justify-content:space-between">
      ${NODES.map(([i, t, label]) => `<div style="width:96px;text-align:center">${ico(i, 84, t, 'round')}<div class="h3" style="margin-top:12px;font-size:20px${t === 'gold' ? ';color:var(--gold)' : ''}">${label}</div></div>`).join('')}</div>`,
})

// ------------------------------------------------------------------ 3. inside every course: the lesson on top, the five things under it
const FEATS_V = [
  ['play', 'blue', 'Short video lessons', 'With captions'],
  ['flask-conical', 'violet', 'Labs you run yourself', 'A guide for every step'],
  ['bot-message-square', 'green', 'An assistant in the lesson', 'Answers from the course'],
  ['list-checks', 'rose', 'A quiz in every module', 'So it lands'],
  ['award', 'gold', 'A certificate at the end', 'Yours to share'],
]
const WIN_TOP = 344
reelO.push({
  id: 'course',
  cues: [['o04', { 1: 'Short', 2: 'Labs' }], ['o05', { 3: 0, 4: 'quiz', 5: 'certificate' }]],
  bg: ground(GLOWV.blue, { mx: 50, my: 44 }),
  fg: `${headV('Inside every course', 'Built to be done,<br>not just watched.')}
    <div class="abs win" data-b="0" data-o="3" style="left:${RX}px;top:${WIN_TOP}px;width:${RW}px;height:284px">
      <div class="bar" style="height:36px"><b></b><b></b><b></b><span>AI-103 &middot; Build and Ship AI Agents</span></div>
      <div style="padding:12px 12px 0">
        <div class="thumb" style="position:relative;width:100%;height:184px;border-radius:12px;background-image:url('${ART.files['thumb-ai-103'] || ''}')">
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(4,8,18,.88))"></div>
          <div style="position:absolute;left:50%;top:46%;width:64px;height:64px;margin:-32px;border-radius:50%;background:linear-gradient(180deg,#2f8cff,#0a62f0);display:flex;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.4)"><svg width="26" height="26" viewBox="0 0 24 24" style="margin-left:4px"><path d="M7 4.5v15l12.5-7.5z" fill="#fff"/></svg></div>
          <div style="position:absolute;left:14px;right:14px;bottom:12px" class="row"><span style="font:600 12px/1 var(--body)">4:12</span><div class="track" style="flex:1"><i class="grow" data-to="46%" data-delay=".5" data-dur="2.4"></i></div><span style="font:600 12px/1 var(--body);color:var(--soft)">9:05</span></div>
        </div>
        <div class="row" style="margin-top:10px;gap:8px">${[['Overview'], ['Lab guide', 2, '#b9adff'], ['Ask', 3, '#7df0c0'], ['Quiz', 4, '#ff9db4']].map(([t, b, c], i) => `<span class="chip" style="position:relative;height:30px;padding:0 13px;font-size:13px${i === 0 ? ';background:rgba(61,148,255,.25);border-color:rgba(125,190,255,.5)' : ''}">${t}${b ? `<span class="hl" data-b="${b}" data-o="1" data-fx="pop" data-pad="26" style="--hc:${c}"></span>` : ''}</span>`).join('')}<span class="small nowrap" style="margin-left:auto;font-size:13px">Give the agent a tool</span></div>
      </div>
    </div>
    <div class="abs" data-b="1" data-o="1" data-fx="pop" data-pad="34" style="left:${RX + 12 + 280 - 46}px;top:${WIN_TOP + 36 + 12 + 85 - 46}px;width:92px;height:92px;border-radius:50%;border:3px solid rgba(255,255,255,.95);box-shadow:0 0 34px rgba(61,148,255,.95),inset 0 0 20px rgba(61,148,255,.5)"></div>
    <div class="abs bubble a" data-b="3" data-o="2" data-fx="pop" style="left:${RX + 26}px;top:${WIN_TOP + 126}px;width:250px;padding:11px 14px;font-size:14px;background:linear-gradient(180deg,#22b47e,#0f7f58);box-shadow:0 16px 36px -14px rgba(20,160,110,.9)"><span class="who">Assistant</span>It chooses a tool by its description. This lesson shows how.</div>
    <div class="abs" data-b="5" data-o="1" data-fx="drop" data-tf="rotate(6deg)" style="left:${RX + RW - 176}px;top:${WIN_TOP + 62}px;width:150px;height:100px;border-radius:11px;background:linear-gradient(160deg,#fffdf5,#f4e6bf);box-shadow:0 26px 50px -16px rgba(0,0,0,.8),0 0 0 1px rgba(255,220,150,.6),0 0 40px -6px rgba(255,194,75,.7);padding:12px 14px">
      <div style="font:700 7.5px/1 var(--body);letter-spacing:.2em;color:#9a7a2a">CERTIFICATE OF COMPLETION</div>
      <div style="height:6px;width:78%;border-radius:9px;background:#3a2a05;opacity:.82;margin-top:11px"></div>
      <div style="height:4px;width:56%;border-radius:9px;background:#3a2a05;opacity:.35;margin-top:7px"></div>
      <div style="position:absolute;right:11px;bottom:9px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe59a,#e09a1a);box-shadow:0 4px 10px rgba(160,100,0,.5)"></div>
    </div>
    ${FEATS_V.map(([i, t, a, b], k) => `<div class="abs card" data-b="${k + 1}" data-fx="right" data-pad="26" style="left:${RX}px;top:${WIN_TOP + 298 + k * 45}px;width:${RW}px;height:40px;border-radius:14px;padding:0 14px 0 6px;display:flex;align-items:center;gap:12px">
        ${ico(i, 30, t)}<span class="h3 nowrap" style="font-size:18px">${a}</span><span class="small nowrap" style="margin-left:auto;font-size:14px">${b}</span></div>`).join('')}`,
})

// ------------------------------------------------------------------ 4. what you can learn: three ways in, one under the other
const fanV = (a, b) => `<div style="position:relative;flex:none;width:214px;height:136px">
  <div style="position:absolute;left:2px;top:26px;transform:rotate(-6deg)">${thumb(a, 150)}</div>
  <div style="position:absolute;left:60px;top:10px;transform:rotate(4deg)">${thumb(b, 150)}</div></div>`
reelO.push({
  id: 'learn',
  cues: [['o06', { 1: 0, 2: 'Build', 3: 'Or' }]],
  bg: ground(GLOWV.blue, { mx: 50, my: 50 }),
  fg: `
    <div class="abs kicker" data-b="0" data-fx="fade" style="left:${RX}px;top:196px;font-size:15px">What you can learn</div>
    <div class="abs h2 nowrap" data-b="0" data-o="1" style="left:${RX - 2}px;top:228px;font-size:48px">Start where you are.</div>
    ${[
      ['Certification courses', 'Prepare for the exam and<br>build the real thing.', fanV('ai-103', 'ai-500'), 'award', 'gold'],
      ['Project courses', 'One real project, from<br>start to finish.', fanV('agent-ops', 'build-real-time-ai-on-microsoft-fabric'), 'rocket', 'green'],
      ['AI Essentials', 'One useful skill, in<br>about an hour.', `<div class="seq" data-delay=".3" data-gap=".09" style="flex:none;width:214px;display:flex;flex-wrap:wrap;gap:7px;align-content:center">${ROLES.slice(0, 7).map((r, i) => `<span class="chip" style="height:28px;padding:0 10px;font-size:12.5px;gap:6px;--dot:${['#7cc0ff', '#b3a4ff', '#ffc24b', '#3ed598'][i % 4]}"><i style="width:6px;height:6px"></i>${r}</span>`).join('')}</div>`, 'sparkles', 'violet'],
    ].map(([t, line, art, i, tone], k) => `<div class="abs card" data-b="${k + 1}" style="left:${RX}px;top:${304 + k * 188}px;width:${RW}px;height:174px;padding:0 22px;display:flex;align-items:center;gap:22px">
        ${art}<div style="min-width:0"><div class="row" style="gap:12px">${ico(i, 44, tone)}<div class="h3 nowrap" style="font-size:21px">${t}</div></div>
        <div class="p" style="margin-top:12px;font-size:17px;line-height:1.35">${line}</div></div></div>`).join('')}`,
})

// ------------------------------------------------------------------ 5. Claude
reelO.push({
  id: 'claude',
  cues: [['o07', { 1: 'guide', 2: 'certification' }]],
  bg: ground(GLOWV.claude, { mx: 50, my: 46 }),
  fg: `
    <div class="abs kicker" data-b="0" data-fx="fade" style="left:${RX}px;top:196px;font-size:15px;color:var(--claude)">Claude</div>
    <div class="abs h2 nowrap" data-b="0" data-o="1" style="left:${RX - 2}px;top:228px;font-size:48px">Claude at Gennoor</div>
    <div class="abs" data-b="0" data-o="3" style="left:${RX}px;top:310px">${cpn(214)}</div>
    <div class="abs p" data-b="0" data-o="4" style="left:${RX + 262}px;top:322px;width:320px;font-size:21px;color:var(--text);line-height:1.35">${CPN_LINE}</div>
    <div class="abs small" data-b="1" data-o="7" data-fx="fade" style="left:${RX}px;top:474px;font-size:17.5px;color:var(--soft)">A guide and a practice exam for every certification</div>
    <div class="abs" data-b="1" data-fx="fade" data-pad="20" style="left:${RX + 66}px;top:540px"><svg width="452" height="80" viewBox="0 0 452 80" style="overflow:visible">
      <defs><linearGradient id="pathV2" x1="0" x2="1"><stop offset="0" stop-color="#e58a62" stop-opacity=".2"/><stop offset="1" stop-color="#ffc24b"/></linearGradient></defs>
      <path class="draw" data-delay=".1" data-dur="1.6" d="M0 76 C 80 76, 90 60, 150 58 S 250 42, 300 36 S 400 18, 452 10" stroke="url(#pathV2)" stroke-width="3.5" stroke-dasharray="2 10"/></svg></div>
    ${CERTS.map(([code, name], k) => `<div class="abs center" data-b="1" data-o="${k + 2}" data-fx="pop" style="left:${RX + k * 150.6}px;top:${566 - k * 15}px;width:132px">${sparkIco(100, code)}<div class="h3 nowrap" style="margin-top:12px;font-size:17px">${name}</div></div>`).join('')}
    ${rowV(2, 722, 'users', 'claude', 'Training for teams', 'Claude, Cowork and Claude Code', 'data-fx="left"', 66)}
    ${rowV(2, 796, 'workflow', 'gold', 'Courses by use case', 'Instructor-led, by domain', 'data-fx="left" data-o="1"', 66)}`,
})

// ------------------------------------------------------------------ 6. for your team
reelO.push({
  id: 'team',
  cues: [['o08', { 1: ['We', 2], 2: 'build', 3: 'teach' }]],
  bg: ground(GLOWV.deep, { mx: 50, my: 46 }),
  fg: `${headV('For your team', 'Built on the work<br>your people do.')}
    ${[['ear', 'blue', 'We learn your work', 'We start with what your people<br>do every day.'], ['pencil-ruler', 'violet', 'We build the course', 'Examples and exercises come<br>from your context.'], ['presentation', 'gold', 'We teach it live', 'Online or at your office,<br>hands-on.']]
      .map(([i, t, a, b2], k) => buildV(k + 1, k, i, t, a, b2, 366, 120, 132)).join('')}
    <div class="abs seq row" data-b="4" data-fx="none" data-delay=".05" data-gap=".12" style="left:${RX}px;top:768px;gap:8px;flex-wrap:wrap;width:${RW}px">
      ${['Claude', 'Microsoft AI', 'Automation', 'Custom courses', 'Microsoft official courses', 'Exam preparation'].map((t, i) => `<span class="chip" style="height:34px;padding:0 13px;font-size:14px;--dot:${['#e58a62', '#7cc0ff', '#3ed598', '#b3a4ff', '#7cc0ff', '#ffc24b'][i]}"><i></i>${t}</span>`).join('')}</div>`,
})

// ------------------------------------------------------------------ 7. automation training
reelO.push({
  id: 'automation',
  cues: [['o08b', { 1: 'One', 2: 'course', 3: 'automate' }]],
  bg: ground(GLOWV.green, { mx: 50, my: 44 }),
  fg: `${headV('Custom automation training', 'Your team learns to<br>automate its own work.')}
    <div class="abs win" data-b="1" data-fx="left" style="left:${RX}px;top:362px;width:${RW}px;height:286px">
      <div class="bar"><b></b><b></b><b></b><span>One process your team runs &middot; every week</span></div>
      <div style="position:relative;padding:24px 22px 0">
        <div data-b="3" data-fx="wipe" data-dur="1.1" data-pad="18" style="position:absolute;left:80px;top:64px;width:424px;height:4px;border-radius:9px;background:linear-gradient(90deg,#3d94ff,#8f7dff 34%,#3ed598 68%,#ffc24b);box-shadow:0 0 14px rgba(120,200,255,.9)"></div>
        <div class="row" style="position:relative;gap:0;justify-content:space-between;align-items:flex-start">
          ${STEPS.map(([i, t, label], k) => `<div style="width:116px;text-align:center">
            <div style="position:relative;width:84px;height:84px;margin:0 auto">${ico(i, 84, 'ink')}
              <span data-b="3" data-o="${k + 1}" data-fx="pop" data-pad="34" style="position:absolute;inset:0">${ico(i, 84, t)}</span>
              <span data-b="3" data-o="${k + 3}" data-fx="pop" data-pad="20" style="position:absolute;right:-10px;top:-10px">${ico('zap', 32, 'gold', 'round')}</span></div>
            <div style="margin-top:13px;font:600 15px/1.25 var(--body);color:var(--soft)">${label}</div></div>`).join('')}
        </div>
        <div style="position:relative;margin-top:18px;height:56px">
          <div class="row" style="height:56px;padding:0 16px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid var(--hair);gap:14px">${ico('timer', 34, 'ink')}<span style="font:600 16.5px/1 var(--body);color:var(--soft)">Done by hand, every week</span></div>
          <div class="row" data-b="3" data-o="8" data-fx="pop" data-pad="34" style="position:absolute;inset:0;padding:0 12px 0 16px;border-radius:16px;background:linear-gradient(180deg,#164237,#0d2b27);border:1px solid rgba(62,213,152,.6);box-shadow:0 0 34px -6px rgba(62,213,152,.65);gap:12px">${ico('zap', 34, 'gold', 'round')}<span class="nowrap" style="font:650 16.5px/1 var(--body);color:#fff">Now it runs when they ask</span><span class="chip" style="margin-left:auto;height:30px;padding:0 11px;font-size:13px;--dot:var(--green)"><i></i>A person checks</span></div>
        </div>
      </div>
    </div>
    ${[['target', 'blue', 'One process your team runs', 'Chosen with you, before we start'], ['pencil-ruler', 'violet', 'A course built on it', 'With your own examples and files'], ['graduation-cap', 'gold', 'They automate it themselves', 'Hands-on, with Claude and other AI tools']]
      .map(([i, t, a, b], k) => rowV(2, 664 + k * 68, i, t, a, b, `data-o="${k}"`)).join('')}`,
})

// ------------------------------------------------------------------ 8. your own platform
reelO.push({
  id: 'platform',
  cues: [['o09', { 1: ['Your', 2], 2: ['Your', 3], 3: ['Your', 4] }]],
  bg: ground(GLOWV.violet, { mx: 50, my: 46 }),
  fg: `${headV('Your own platform', 'A home for<br>your training.')}
    <div class="abs win" data-b="0" data-o="3" style="left:${RX}px;top:362px;width:${RW}px;height:288px">
      <div class="bar" style="height:50px;gap:12px"><span style="margin:0;display:inline-flex;align-items:center;gap:9px;height:30px;padding:0 12px;border-radius:9px;border:1.5px dashed rgba(255,194,75,.75);color:var(--gold);font:700 11.5px/1 var(--body);letter-spacing:.14em">YOUR LOGO</span><span style="font:650 15px/1 var(--display);color:#fff">Academy</span><span style="margin-left:auto;font-size:12.5px">Courses &nbsp;&middot;&nbsp; Team</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 150px;gap:12px;padding:14px 14px 0">
        ${[['monitor-play', 'blue', 'Onboarding', '82%'], ['flask-conical', 'violet', 'Product labs', '56%']].map(([i, t, name, pc], k) => `<div class="card" style="border-radius:16px;padding:14px;box-shadow:none">${ico(i, 42, t)}<div class="h3" style="font-size:16.5px;margin-top:12px">${name}</div><div class="track" style="margin-top:12px"><i class="grow" data-to="${pc}" data-delay="${0.6 + k * 0.3}" data-dur="1.6"></i></div></div>`).join('')}
        <div class="card" style="border-radius:16px;padding:12px;box-shadow:none;text-align:center"><svg width="74" height="74" viewBox="0 0 84 84" style="transform:rotate(-90deg)"><circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="9"/><circle class="draw" data-delay=".7" data-dur="1.8" cx="42" cy="42" r="34" stroke="#ffc24b" stroke-width="9" pathLength="100" style="stroke-dasharray:78 100"/></svg><div class="tiny" style="margin-top:9px;letter-spacing:.08em;font-size:10.5px">Team progress</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px 14px 0">
        <div class="card" style="border-radius:16px;padding:11px 13px;box-shadow:none"><div class="row">${ico('bot-message-square', 36, 'green')}<div><div class="h3" style="font-size:15px">Assistant</div><div class="small" style="font-size:12px">Inside the lesson</div></div></div></div>
        <div class="card" style="border-radius:16px;padding:11px 13px;box-shadow:none"><div class="row">${ico('messages-square', 36, 'rose')}<div><div class="h3" style="font-size:15px">Question board</div><div class="small" style="font-size:12px">Answered by a trainer</div></div></div></div>
      </div>
    </div>
    ${[['book-open', 'blue', 'Your courses.'], ['users', 'violet', 'Your people.'], ['badge-check', 'gold', 'Your name.']].map(([i, t, a], k) => `<div class="abs row" data-b="${k + 1}" data-fx="right" style="left:${RX + 4}px;top:${670 + k * 66}px;gap:18px">${ico(i, 56, t)}<span class="h1 nowrap" style="font-size:40px">${a}</span></div>`).join('')}`,
})

// ------------------------------------------------------------------ 9. see it work first: the blueprint, then the working thing under it
const wireV = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="rgba(125,190,255,.75)" stroke-width="1.6" stroke-dasharray="6 6"/>`
const wireText = (x, y, t) => `<text x="${x}" y="${y}" fill="rgba(160,205,255,.85)" font-family="Segoe UI" font-size="13">${t}</text>`
reelO.push({
  id: 'prototype',
  cues: [['o10', { 1: 0, 2: 'we' }]],
  bg: ground(GLOWV.green, { mx: 50, my: 48 }),
  fg: `${headV('See it first', 'See it work<br>before you commit.')}
    <div class="abs card" data-b="1" data-fx="left" style="left:${RX}px;top:362px;width:${RW}px;height:192px;padding:18px 22px;background:linear-gradient(180deg,rgba(61,148,255,.1),rgba(61,148,255,.03));border-color:rgba(125,190,255,.3)">
      <div class="tiny" style="color:var(--blue2)">The blueprint</div>
      <svg width="540" height="126" viewBox="0 0 540 126" style="margin-top:12px">${wireV(0, 0, 128, 126)}${wireV(142, 0, 188, 56)}${wireV(142, 70, 188, 56)}${wireV(344, 0, 196, 56)}${wireV(344, 70, 196, 56)}
        ${wireText(13, 25, 'document in')}${wireText(155, 25, 'read the fields')}${wireText(155, 95, 'check and flag')}${wireText(357, 25, 'a person checks')}${wireText(357, 95, 'your system')}</svg>
    </div>
    <div class="abs" data-b="2" data-fx="fade" data-pad="20" style="left:${360 - 20}px;top:562px"><svg width="40" height="46" viewBox="0 0 40 46" style="overflow:visible"><path class="draw" data-delay="0" data-dur=".8" d="M20 3 V38 M6 24 L20 40 L34 24" stroke="#3ed598" stroke-width="4"/></svg></div>
    <div class="abs win" data-b="2" data-o="2" data-fx="rise" style="left:${RX}px;top:616px;width:${RW}px;height:248px;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 40px 90px -30px rgba(0,0,0,.85),0 0 90px -26px rgba(62,213,152,.55)">
      <div class="bar" style="height:36px"><b></b><b></b><b></b><span>Working prototype &middot; on your examples</span></div>
      <div style="display:grid;grid-template-columns:140px 1fr;gap:14px;padding:14px">
        <div style="border-radius:12px;background:#f3f5fa;height:184px;padding:13px"><div style="height:8px;width:60%;background:#2a3654;border-radius:9px"></div>${[90, 76, 84, 58, 80, 66].map((w) => `<div style="height:5px;width:${w}%;background:#c3cbdc;border-radius:9px;margin-top:11px"></div>`).join('')}<div style="height:24px;border-radius:7px;background:#dfe6f5;margin-top:14px"></div></div>
        <div class="seq" data-delay=".5" data-gap=".22">${[['Supplier', 'Northwind Traders'], ['Invoice number', 'INV-20418'], ['Total', 'matches the order'], ['Tax', 'needs a person to check']].map(([k2, v], i) => `<div class="row" style="justify-content:space-between;padding:0 13px;height:40px;border-radius:12px;background:rgba(255,255,255,.06);margin-bottom:8px;font:500 14.5px/1.2 var(--body)"><span style="color:var(--soft)">${k2}</span><span class="row nowrap" style="gap:8px;color:${i === 3 ? 'var(--gold)' : '#fff'}">${v}<span class="tick" style="width:16px;height:16px${i === 3 ? ';background:var(--gold)' : ''}"></span></span></div>`).join('')}</div>
      </div>
    </div>`,
})

// ------------------------------------------------------------------ 10. the AI Weekend
const dayCardV = ([day, title, builds, tone], k, b) => `<div class="abs card" data-b="${b}" style="left:${RX + k * 298}px;top:466px;width:286px;height:330px;padding:20px 20px 0">
    ${ico(k ? 'bot' : 'file-text', 50, tone)}
    <div class="tiny" style="margin-top:15px;color:${k ? 'var(--gold)' : 'var(--blue2)'}">${day}</div><div class="h3" style="margin-top:8px;font-size:20px;line-height:1.2;min-height:48px">${title}</div>
    <div class="seq" data-delay="${0.4 + k * 0.4}" data-gap=".2" style="margin-top:12px">${builds.map((t) => `<div class="row" style="height:42px;border-top:1px solid rgba(255,255,255,.09);font:500 15.5px/1.2 var(--body)"><span class="tick" style="width:16px;height:16px${k ? ';background:var(--gold)' : ''}"></span>${t}</div>`).join('')}</div></div>`
reelO.push({
  id: 'weekend',
  cues: [['o11', { 1: 'Two', 2: 'Six' }]],
  bg: ground(GLOWV.gold, { mx: 50, my: 42 }),
  fg: `
    <div class="abs" data-b="0" data-fx="pop" data-pad="60" style="left:${RX}px;top:198px">${bolt(92)}</div>
    <div class="abs kicker" data-b="0" data-o="1" data-fx="fade" style="left:${RX + 114}px;top:208px;font-size:14px">Live &middot; every month</div>
    <div class="abs h1 nowrap" data-b="0" data-o="2" style="left:${RX + 112}px;top:232px;font-size:54px">The AI Weekend</div>
    <div class="abs p" data-b="0" data-o="3" style="left:${RX}px;top:316px;font-size:22px">Build with Claude in one weekend.</div>
    <div class="abs card lit row" data-b="0" data-o="5" data-fx="right" style="left:${RX}px;top:368px;width:${RW}px;height:80px;padding:0 24px;justify-content:space-between">
      <div><div class="tiny" style="color:var(--gold)">Every month</div><div class="h3 nowrap" style="margin-top:8px;font-size:24px">The last weekend</div></div>
      <div class="small" style="font-size:15.5px;text-align:right;line-height:1.4">Saturday &amp; Sunday<br>live online</div></div>
    ${WK.map((d, k) => dayCardV(d, k, k + 1)).join('')}`,
})

// ------------------------------------------------------------------ 11. the close
reelO.push({
  id: 'close',
  cues: [['o12', { 1: 'Train', 2: 'Innovate', 3: 'Build' }], ['o13', { 4: 0 }]],
  bg: ground(GLOWV.blue, { mx: 50, my: 34 }) + `<div class="abs" style="left:${360 - 500}px;top:${330 - 500}px;opacity:.45">${ring(480, 110, { speed: -1.1, dot: 2, alpha: .55, gold: 0 })}</div>`,
  fg: `
    <div class="abs" data-b="0" data-fx="fade" data-dur="1.4" style="left:${360 - 190}px;top:${330 - 190}px">${ring(170, 52, { speed: 2.4, dot: 2.6 })}</div>
    <div class="abs" data-b="0" data-o="1" data-fx="pop" data-pad="50" style="left:${360 - 66}px;top:${330 - 66}px">${mark(132)}</div>
    <div class="abs h1 center nowrap" data-b="1" style="left:0;width:720px;top:518px;font-size:68px">Train.</div>
    <div class="abs h1 center nowrap" data-b="2" style="left:0;width:720px;top:594px;font-size:68px">Innovate.</div>
    <div class="abs h1 center nowrap" data-b="3" style="left:0;width:720px;top:670px;font-size:68px"><span class="grad">Build.</span></div>
    <div class="abs row" style="left:0;width:720px;top:782px;justify-content:center">
      <div class="pill" data-b="4" style="height:62px;padding:0 28px;font-size:19px">Watch a preview lesson <small style="font-size:16px">gennoor.com/studio</small> <span>&rarr;</span></div></div>`,
})

window.SHOWS = { ...(window.SHOWS || {}), 'overview-reel': { scenes: reelO } }
