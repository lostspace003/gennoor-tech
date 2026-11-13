/*
  "What we do": the scenes of the presentation and of the film that opens the home page.

  Each scene says one thing. Words on screen are few on purpose: the presenter (or the
  narrator) says the rest. `cues` ties beats to the narration for the film; in the
  presentation every beat after `auto` is one mouse click. `notes` is what to say.
  Scenes with film:false are in the presentation only.
*/
const D = ART.data.meta || { weekend: { name: 'Gennoor AI Weekend', dates: '', time: '' }, counts: {} }
const piece = (b, style, html, attrs = '') => `<div class="abs" data-b="${b}" ${attrs} style="${style}">${html}</div>`

const overview = []

// ------------------------------------------------------------------ 1. the vision
overview.push({
  id: 'vision', title: 'Our vision', auto: 3,
  notes: 'Our vision: a world where anyone can learn the skills that work asks for, and prove them. That is what we are building. (The three lines arrive by themselves; click once for the last line.)',
  cues: [['o01', { 1: 0, 2: 'learn', 3: 'And' }], ['o02', { 4: 0 }]],
  bg: ground(GLOW.blue, { mx: 50, my: 50 }) + `<div class="abs" style="left:${640 - 540}px;top:${360 - 540}px;opacity:.5">${ring(520, 120, { speed: -0.9, dot: 2, alpha: .55, gold: 0 })}</div>`,
  fg: `
    <div class="abs" data-b="0" data-fx="fade" data-dur="1.8" data-pad="0" data-spin="1.6" style="left:${640 - 356}px;top:4px">${ring(336, 84, { speed: 1.6, alpha: .8 })}</div>
    <div class="abs kicker center" data-b="0" data-fx="fade" style="left:0;width:1280px;top:196px">Our vision</div>
    <div class="abs h1 center nowrap" data-b="1" style="left:0;width:1280px;top:234px">A world where anyone can learn</div>
    <div class="abs h1 center nowrap" data-b="2" style="left:0;width:1280px;top:308px">the skills that work asks for,</div>
    <div class="abs h1 center nowrap" data-b="3" style="left:0;width:1280px;top:382px"><span class="grad serif" style="font-size:74px;padding:0 8px">and prove them.</span></div>
    <div class="abs p center" data-b="4" style="left:0;width:1280px;top:496px;font-size:23px">That is what we are building.</div>
    <div class="abs" data-b="4" data-o="2" data-fx="fade" style="left:${640 - 105}px;top:580px">${img('logo', 'width:210px')}</div>`,
})

// ------------------------------------------------------------------ 2. why
const slideCard = (i) => `<div class="card" style="width:86px;height:58px;border-radius:11px;padding:11px 12px;opacity:${1 - i * 0.2}"><div style="height:6px;width:60%;border-radius:9px;background:rgba(255,255,255,.3)"></div><div style="height:4px;width:86%;border-radius:9px;background:rgba(255,255,255,.14);margin-top:9px"></div><div style="height:4px;width:70%;border-radius:9px;background:rgba(255,255,255,.14);margin-top:6px"></div></div>`
const NODES = [['play', 'blue', 'Watch'], ['flask-conical', 'violet', 'Practise'], ['blocks', 'green', 'Build'], ['award', 'gold', 'Prove']]
overview.push({
  id: 'why', title: 'Why we exist',
  notes: 'Most training ends when the slides end. We think it should end when you can do the work: watch, practise, build, and then prove it.',
  cues: [['o03', { 1: 0, 2: 'We' }]],
  bg: ground(GLOW.deep, { mx: 62, my: 60 }),
  fg: `
    <div class="abs kicker" data-b="0" data-fx="fade" style="left:84px;top:70px">Why we exist</div>
    ${piece(1, 'left:82px;top:126px;width:600px', `<div class="h2" style="font-size:50px;color:var(--mute);font-weight:600">Most training ends<br>when the slides end.</div>`)}
    ${piece(1, 'left:700px;top:160px', `<div class="row" style="gap:12px">${[0, 1, 2, 3].map(slideCard).join('')}<span class="chip" style="--dot:#7d8cab;color:var(--mute);margin-left:6px"><i></i>The end</span></div>`, 'data-o="2" data-fx="left"')}
    <div class="abs" data-b="1" data-o="3" data-fx="fade" style="left:84px;top:312px;width:1112px;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.22),transparent)"></div>
    ${piece(2, 'left:82px;top:372px;width:600px', `<div class="h1" style="font-size:64px">It should end when<br>you can <span class="grad">do the work.</span></div>`)}
    <div class="abs" data-b="2" data-o="3" data-fx="fade" data-pad="20" style="left:736px;top:442px">
      <svg width="420" height="20" viewBox="0 0 420 20" style="overflow:visible"><defs><linearGradient id="path1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="420" y2="0"><stop offset="0" stop-color="#3d94ff"/><stop offset=".6" stop-color="#8f7dff"/><stop offset="1" stop-color="#ffc24b"/></linearGradient></defs>
      <path class="draw" data-delay=".1" data-dur="1.5" d="M0 10 H420" stroke="url(#path1)" stroke-width="4" style="filter:drop-shadow(0 0 8px rgba(120,150,255,.9))"/></svg></div>
    <div class="abs seq" data-b="2" data-o="4" data-fx="none" data-delay=".15" data-gap=".38" style="left:696px;top:412px;display:flex;gap:60px">
      ${NODES.map(([i, t, label]) => `<div style="width:80px;text-align:center">${ico(i, 80, t, 'round')}<div class="h3" style="margin-top:14px;font-size:20px${t === 'gold' ? ';color:var(--gold)' : ''}">${label}</div></div>`).join('')}</div>`,
})

// ------------------------------------------------------------------ 3. inside every course
const LESSONS = [['Welcome', 1], ['Your first agent', 1], ['Give it a tool', 2], ['Lab: build it', 0], ['Module quiz', 0]]
const FEATS = [
  ['play', 'blue', 'Short video lessons', 'With captions, at your own pace'],
  ['flask-conical', 'violet', 'Labs you run yourself', 'A guide for every step, files included'],
  ['bot-message-square', 'green', 'An assistant in the lesson', 'It answers from the course'],
  ['list-checks', 'rose', 'A quiz in every module', 'So you know it has landed'],
  ['award', 'gold', 'A certificate at the end', 'Yours to share'],
]
overview.push({
  id: 'course', title: 'Inside every course',
  notes: 'Every course is built the same way. Short video lessons. Labs you run yourself, with a guide for every step. An assistant inside the lesson that answers from the course. A quiz in every module, and a certificate at the end. (One click for each of the five.)',
  cues: [['o04', { 1: 'Short', 2: 'Labs' }], ['o05', { 3: 0, 4: 'quiz', 5: 'certificate' }]],
  bg: ground(GLOW.blue, { mx: 32, my: 58 }),
  fg: `${head('Inside every course', 'Built to be done, not just watched.')}
    <div class="abs win" data-b="0" data-o="3" style="left:84px;top:196px;width:640px;height:404px">
      <div class="bar"><b></b><b></b><b></b><span>AI-103 &middot; Build and Ship AI Agents</span></div>
      <div style="display:flex;height:366px">
        <div style="flex:1;padding:16px 16px 0">
          <div class="thumb" style="position:relative;width:100%;height:236px;border-radius:12px;background-image:url('${ART.files['thumb-ai-103'] || ''}')">
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(4,8,18,.85))"></div>
            <div style="position:absolute;left:50%;top:50%;width:66px;height:66px;margin:-33px;border-radius:50%;background:linear-gradient(180deg,#2f8cff,#0a62f0);display:flex;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.4)"><svg width="26" height="26" viewBox="0 0 24 24" style="margin-left:4px"><path d="M7 4.5v15l12.5-7.5z" fill="#fff"/></svg></div>
            <div style="position:absolute;left:14px;right:14px;bottom:13px" class="row"><span style="font:600 12px/1 var(--body)">4:12</span><div class="track" style="flex:1"><i class="grow" data-to="46%" data-delay=".5" data-dur="2.4"></i></div><span style="font:600 12px/1 var(--body);color:var(--soft)">9:05</span></div>
          </div>
          <div class="h3" style="margin-top:15px;font-size:19px">Give the agent a tool</div>
          <div class="row" style="margin-top:11px;gap:8px">${[['Overview'], ['Lab guide', 2, '#b9adff'], ['Ask', 3, '#7df0c0'], ['Quiz', 4, '#ff9db4']].map(([t, b, c], i) => `<span class="chip" style="position:relative;height:30px;padding:0 13px;font-size:13px${i === 0 ? ';background:rgba(61,148,255,.25);border-color:rgba(125,190,255,.5)' : ''}">${t}${b ? `<span class="hl" data-b="${b}" data-o="1" data-fx="pop" data-pad="26" style="--hc:${c}"></span>` : ''}</span>`).join('')}</div>
        </div>
        <div style="width:186px;border-left:1px solid rgba(255,255,255,.08);padding:16px 14px">
          <div class="tiny" style="margin-bottom:12px">Module 3</div>
          ${LESSONS.map(([t, st], k) => `<div class="row" style="position:relative;padding:9px 8px;border-radius:10px;font:500 13.5px/1.2 var(--body);color:${st === 2 ? '#fff' : 'var(--soft)'}${st === 2 ? ';background:rgba(61,148,255,.2)' : ''}"><span class="tick ${st === 1 ? '' : 'off'}" style="width:16px;height:16px"></span>${t}${k === 3 ? '<span class="hl" data-b="2" data-o="2" data-fx="pop" data-pad="26" style="--hc:#b9adff;inset:0"></span>' : ''}${k === 4 ? '<span class="tick" data-b="4" data-o="2" data-fx="pop" data-pad="18" style="position:absolute;left:8px;top:50%;margin-top:-8px;width:16px;height:16px;box-shadow:0 0 12px rgba(62,213,152,.9)"></span>' : ''}</div>`).join('')}
        </div>
      </div>
    </div>
    ${FEATS.map(([i, t, a, b], k) => piece(k + 1, `left:772px;top:${196 + k * 82.4}px;width:424px`, feat(i, t, a, b), 'data-fx="right" data-pad="30"')).join('')}
    <div class="abs" data-b="1" data-o="1" data-fx="pop" data-pad="34" style="left:${84 + 16 + 211 - 47}px;top:${196 + 38 + 16 + 118 - 47}px;width:94px;height:94px;border-radius:50%;border:3px solid rgba(255,255,255,.95);box-shadow:0 0 34px rgba(61,148,255,.95),inset 0 0 20px rgba(61,148,255,.5)"></div>
    <div class="abs bubble a" data-b="3" data-o="2" data-fx="pop" style="left:262px;top:386px;width:246px;padding:11px 14px;font-size:13.5px;background:linear-gradient(180deg,#22b47e,#0f7f58);box-shadow:0 16px 36px -14px rgba(20,160,110,.9)"><span class="who">Assistant</span>It chooses a tool by its description. This lesson shows how.</div>
    <div class="abs" data-b="5" data-o="1" data-fx="drop" data-tf="rotate(6deg)" style="left:590px;top:508px;width:150px;height:100px;border-radius:11px;background:linear-gradient(160deg,#fffdf5,#f4e6bf);box-shadow:0 26px 50px -16px rgba(0,0,0,.8),0 0 0 1px rgba(255,220,150,.6),0 0 40px -6px rgba(255,194,75,.7);padding:12px 14px">
      <div style="font:700 7.5px/1 var(--body);letter-spacing:.2em;color:#9a7a2a">CERTIFICATE OF COMPLETION</div>
      <div style="height:6px;width:78%;border-radius:9px;background:#3a2a05;opacity:.82;margin-top:11px"></div>
      <div style="height:4px;width:56%;border-radius:9px;background:#3a2a05;opacity:.35;margin-top:7px"></div>
      <div style="position:absolute;right:11px;bottom:9px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe59a,#e09a1a);box-shadow:0 4px 10px rgba(160,100,0,.5)"></div>
    </div>
    ${go('See a course', '/studio/ai-103', { b: 6 })}`,
})

// ------------------------------------------------------------------ 4. the assistant (presentation only)
overview.push({
  id: 'assistant', title: 'Ask anything', film: false,
  notes: 'The assistant sits inside the lesson. A learner asks in their own words and the answer comes from the course itself. Every course also has a discussion page, and every lesson has captions.',
  bg: ground(GLOW.green, { mx: 30, my: 55 }),
  fg: `${head('Ask anything', 'An assistant that knows the course.')}
    <div class="abs win" data-b="0" data-o="3" style="left:84px;top:196px;width:620px;height:404px">
      <div class="bar"><b></b><b></b><b></b><span>Ask &middot; in the lesson</span></div></div>
    <div class="abs bubble q" data-b="1" data-fx="pop" style="left:110px;top:258px;width:400px;font-size:18px"><span class="who">You</span>Why did my agent call the wrong tool?</div>
    <div class="abs bubble a" data-b="2" data-fx="pop" style="left:214px;top:356px;width:464px;font-size:18px"><span class="who">Assistant</span>The model picks a tool by its description. Make the description specific, then run the lab again.</div>
    <div class="abs chip" data-b="3" data-fx="pop" style="left:110px;top:520px;--dot:var(--green)"><i></i>Answered from this course</div>
    ${[['bot-message-square', 'green', 'Inside every lesson', 'Ask without leaving the video'], ['messages-square', 'blue', 'A discussion page for every course', 'Talk with other learners and our team'], ['captions', 'violet', 'Captions on every lesson', 'Follow along with the sound off']]
      .map(([i, t, a, b], k) => piece(k + 4, `left:752px;top:${214 + k * 104}px;width:444px`, feat(i, t, a, b), 'data-fx="right" data-pad="30"')).join('')}
    ${go('See it in a course', '/studio/ai-103', { b: 7 })}`,
})

// ------------------------------------------------------------------ 5. labs (presentation only)
overview.push({
  id: 'labs', title: 'Hands-on', film: false,
  notes: 'This is where the learning happens. The learner runs each lab on their own machine. The guide walks with them step by step, the starter files are included, and every module adds a working part, so the course ends with a finished project.',
  bg: ground(GLOW.violet, { mx: 55, my: 55 }),
  fg: `${head('Hands-on', 'You run it. The guide walks with you.')}
    <div class="abs card solid" data-b="1" data-fx="left" style="left:84px;top:196px;width:372px;height:404px;padding:24px 26px">
      <div class="row">${ico('file-text', 44, 'violet')}<div><div class="tiny" style="color:#b9adff">Lab guide</div><div class="h3" style="margin-top:6px">Build the agent</div></div></div>
      <div class="seq" data-delay=".4" data-gap=".3" style="margin-top:20px">${['Open the starter project', 'Add the tool definition', 'Run the agent locally', 'Read the trace', 'Deploy it'].map((t, i) => `<div class="row" style="padding:11px 0;border-top:1px solid rgba(255,255,255,.08);font:500 16.5px/1.2 var(--body);color:${i < 3 ? '#fff' : 'var(--soft)'}"><span class="tick ${i < 3 ? '' : 'off'}"></span>${t}</div>`).join('')}</div>
    </div>
    <div class="abs win" data-b="2" data-fx="rise" style="left:488px;top:196px;width:708px;height:244px">
      <div class="bar"><b></b><b></b><b></b><span>Terminal</span></div>
      <div class="code" style="padding:16px 20px"><span class="c"># the learner types this, on their own machine</span>
<span class="b">$</span> python agent.py <span class="y">"Where is order 4821?"</span>
<span class="c">  calling tool:</span> lookup_order(order_id=4821)
<span class="g">  &#10004; Order 4821 leaves the warehouse tomorrow.</span>
<span class="b">$</span> azd deploy    <span class="g">&#10004; live</span></div>
    </div>
    <div class="abs" data-b="3" data-fx="rise" style="left:488px;top:470px;width:708px">
      <div class="row seq" data-delay=".2" data-gap=".16" style="gap:10px">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="card" style="flex:1;height:76px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px"><span class="tick"></span><span class="tiny" style="letter-spacing:.1em;color:var(--soft)">Module ${n}</span></div>`).join('')}</div>
    </div>
    <div class="abs row" data-b="4" data-fx="rise" style="left:488px;top:566px;gap:14px">${ico('rocket', 44, 'gold')}<span class="h3" style="font-size:24px">A working project at the end</span></div>
    ${go('See a project course', '/studio/ai-103', { b: 5 })}`,
})

// ------------------------------------------------------------------ 6. what you can learn
const fan = (a, b) => `<div style="position:relative;height:178px">
  <div style="position:absolute;left:8px;top:22px;transform:rotate(-6deg)">${thumb(a, 216)}</div>
  <div style="position:absolute;left:92px;top:8px;transform:rotate(4deg)">${thumb(b, 216)}</div></div>`
const ROLES = ['Finance', 'HR', 'Sales', 'Legal', 'Customer service', 'Cybersecurity', 'Operations', 'Leadership', 'Healthcare', 'Retail']
overview.push({
  id: 'learn', title: 'What you can learn',
  notes: 'There are three ways in. Certification courses: prepare for the exam and build the real thing. Project courses: one real project from start to finish. And AI Essentials: one useful skill in about an hour, for every role.',
  cues: [['o06', { 1: 0, 2: 'Build', 3: 'Or' }]],
  bg: ground(GLOW.blue, { mx: 50, my: 60 }),
  fg: `${head('What you can learn', 'Start where you are.')}
    ${[
      ['Certification courses', 'Prepare for the exam and build the real thing.', fan('ai-103', 'ai-500'), '/studio', 'award', 'gold'],
      ['Project courses', 'One real project, from start to finish.', fan('agent-ops', 'build-real-time-ai-on-microsoft-fabric'), '/studio', 'rocket', 'green'],
      ['AI Essentials', 'One useful skill, in about an hour.', `<div class="seq" data-delay=".3" data-gap=".09" style="height:178px;display:flex;flex-wrap:wrap;gap:9px;align-content:center">${ROLES.map((r, i) => `<span class="chip" style="--dot:${['#7cc0ff', '#b3a4ff', '#ffc24b', '#3ed598'][i % 4]}"><i></i>${r}</span>`).join('')}</div>`, '/ai-academy', 'sparkles', 'violet'],
    ].map(([t, line, art, href, i, tone], k) => `<div class="abs card" data-b="${k + 1}" data-href="${SITE}${href}" data-alt="${t}: ${line}" style="left:${84 + k * 372}px;top:196px;width:344px;height:388px;padding:26px 26px 0">
        ${art}<div class="row" style="margin-top:34px;gap:14px">${ico(i, 50, tone)}<div class="h3 nowrap" style="font-size:22px">${t}</div></div>
        <div class="p" style="margin-top:14px;font-size:17px">${line}</div></div>`).join('')}
    ${go('Browse the Learning Studio', '/studio', { b: 4 })}`,
})

// ------------------------------------------------------------------ 7. Claude
const CERTS = [['CCAS-F', 'Associate', 'associate-foundations'], ['CCDV-F', 'Developer', 'developer-foundations'], ['CCAR-F', 'Architect', 'architect-foundations'], ['CCAR-P', 'Architect Pro', 'architect-professional']]
overview.push({
  id: 'claude', title: 'Claude at Gennoor',
  notes: `${CPN_LINE} For each of the four Claude certifications there is a guide and a practice exam. For teams there is live training on Claude for everyday work, Claude Cowork and Claude Code, and instructor-led courses organised by use case.`,
  cues: [['o07', { 1: 'guide', 2: 'certification' }]],
  bg: ground(GLOW.claude, { mx: 66, my: 55 }),
  fg: `${head('Claude', 'Claude at Gennoor', { color: 'var(--claude)' })}
    <div class="abs" data-b="0" data-o="3" data-href="https://claude.com/partners" data-alt="Claude Partner Network: Certified Services Partner" style="left:84px;top:204px">${cpn(236)}</div>
    <div class="abs p" data-b="0" data-o="4" style="left:84px;top:356px;width:360px;font-size:21px;color:var(--text);line-height:1.35">${CPN_LINE}</div>
    <div class="abs" data-b="1" data-fx="fade" data-pad="20" style="left:500px;top:226px"><svg width="700" height="330" viewBox="0 0 700 330" style="overflow:visible">
      <defs><linearGradient id="path2" x1="0" x2="1"><stop offset="0" stop-color="#e58a62" stop-opacity=".2"/><stop offset="1" stop-color="#ffc24b"/></linearGradient></defs>
      <path class="draw" data-delay=".1" data-dur="1.6" d="M40 286 C 200 286, 190 196, 250 196 S 380 122, 440 122 S 560 44, 640 44" stroke="url(#path2)" stroke-width="3.5" stroke-dasharray="2 10"/></svg></div>
    ${CERTS.map(([code, name, slug], k) => `<div class="abs center" data-b="1" data-o="${k + 2}" data-fx="pop" data-href="${SITE}/claude/certifications/${slug}" data-alt="Claude certification: ${name}" style="left:${500 + k * 176}px;top:${440 - k * 78}px;width:140px">${sparkIco(104, code)}<div class="h3" style="margin-top:14px;font-size:19px">${name}</div></div>`).join('')}
    <div class="abs small" data-b="1" data-o="7" data-fx="fade" style="left:500px;top:206px;font-size:16px;color:var(--soft)">A guide and a practice exam<br>for every certification</div>
    ${piece(2, 'left:84px;top:446px;width:372px', feat('users', 'claude', 'Training for teams', 'Claude, Cowork and Claude Code'), 'data-fx="left" data-pad="30"')}
    ${piece(2, 'left:84px;top:534px;width:372px', feat('workflow', 'gold', 'Courses by use case', 'Instructor-led, by domain'), 'data-fx="left" data-o="1" data-pad="30"')}
    ${go('See Claude at Gennoor', '/claude', { b: 3, x: 824 })}`,
})

// ------------------------------------------------------------------ 8. for your team
overview.push({
  id: 'team', title: 'For your team',
  notes: 'For a team we go further. We learn your work first. We build the course around it, so the examples and exercises come from your own context. And we teach it live, online or at your office. We cover Claude, Microsoft AI and automation, and we deliver Microsoft official courses and exam preparation.',
  cues: [['o08', { 1: ['We', 2], 2: 'build', 3: 'teach' }]],
  bg: ground(GLOW.deep, { mx: 50, my: 55 }),
  fg: `${head('For your team', 'Built on the work your people do.')}
    ${[
      ['ear', 'blue', '01', 'We learn your work', 'We start with what your people<br>do every day.'],
      ['pencil-ruler', 'violet', '02', 'We build the course', 'Examples and exercises come<br>from your context.'],
      ['presentation', 'gold', '03', 'We teach it live', 'Online or at your office,<br>hands-on.'],
    ].map(([i, t, n, a, b], k) => `<div class="abs card" data-b="${k + 1}" style="left:${84 + k * 372}px;top:204px;width:344px;height:268px;padding:26px 28px">
        <div class="row" style="justify-content:space-between">${ico(i, 88, t)}<span style="font:650 54px/1 var(--display);letter-spacing:-.04em;color:rgba(255,255,255,.1)">${n}</span></div>
        <div class="h3" style="margin-top:24px;font-size:25px">${a}</div><div class="p" style="margin-top:9px;font-size:16.5px">${b}</div></div>`).join('')}
    <div class="abs seq row" data-b="4" data-fx="none" data-delay=".05" data-gap=".12" style="left:84px;top:508px;gap:11px;flex-wrap:wrap;width:1112px">
      ${['Claude', 'Microsoft AI', 'Automation', 'Microsoft official courses', 'Exam preparation', 'Custom courses'].map((t, i) => `<span class="chip big" style="--dot:${['#e58a62', '#7cc0ff', '#3ed598', '#7cc0ff', '#ffc24b', '#b3a4ff'][i]}"><i></i>${t}</span>`).join('')}</div>
    ${go('See team training', '/training', { b: 5 })}`,
})

// ------------------------------------------------------------------ 9. automation training
// One process, drawn twice in the same place: first done by hand (grey), then running by itself (in colour).
const STEPS = [['inbox', 'blue', 'Requests<br>arrive'], ['list-filter', 'violet', 'Sort and<br>label them'], ['file-pen-line', 'green', 'Draft<br>the reply'], ['table-2', 'gold', 'Update<br>the sheet']]
overview.push({
  id: 'automation', title: 'Automation training',
  notes: 'We also teach automation, and it is a custom course every time. We take one process your team runs every week, build the course on it with their own examples and files, and teach it live and hands-on. By the end they have automated that process themselves, with Claude and other AI tools, and a person still checks the result. Teams usually start with sorting documents and emails, routine questions, reports from several sources, or moving data between tools.',
  cues: [['o08b', { 1: 'One', 2: 'course', 3: 'automate' }]],
  bg: ground(GLOW.green, { mx: 34, my: 56 }),
  fg: `${head('Custom automation training', 'Your team learns to automate its own work.', { w: 1110 })}
    <div class="abs win" data-b="1" data-fx="left" style="left:84px;top:196px;width:640px;height:312px">
      <div class="bar"><b></b><b></b><b></b><span>One process your team runs &middot; every week</span></div>
      <div style="position:relative;padding:28px 22px 0">
        <div data-b="3" data-fx="wipe" data-dur="1.1" data-pad="18" style="position:absolute;left:80px;top:68px;width:480px;height:4px;border-radius:9px;background:linear-gradient(90deg,#3d94ff,#8f7dff 34%,#3ed598 68%,#ffc24b);box-shadow:0 0 14px rgba(120,200,255,.9)"></div>
        <div class="row" style="position:relative;gap:0;justify-content:space-between;align-items:flex-start">
          ${STEPS.map(([i, t, label], k) => `<div style="width:116px;text-align:center">
            <div style="position:relative;width:84px;height:84px;margin:0 auto">${ico(i, 84, 'ink')}
              <span data-b="3" data-o="${k + 1}" data-fx="pop" data-pad="34" style="position:absolute;inset:0">${ico(i, 84, t)}</span>
              <span data-b="3" data-o="${k + 3}" data-fx="pop" data-pad="20" style="position:absolute;right:-10px;top:-10px">${ico('zap', 32, 'gold', 'round')}</span></div>
            <div style="margin-top:13px;font:600 15px/1.25 var(--body);color:var(--soft)">${label}</div></div>`).join('')}
        </div>
        <div style="position:relative;margin-top:22px;height:58px">
          <div class="row" style="height:58px;padding:0 16px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid var(--hair);gap:14px">${ico('timer', 36, 'ink')}<span style="font:600 17px/1 var(--body);color:var(--soft)">Done by hand, every week</span></div>
          <div class="row" data-b="3" data-o="8" data-fx="pop" data-pad="34" style="position:absolute;inset:0;padding:0 14px 0 16px;border-radius:16px;background:linear-gradient(180deg,#164237,#0d2b27);border:1px solid rgba(62,213,152,.6);box-shadow:0 0 34px -6px rgba(62,213,152,.65);gap:14px">${ico('zap', 36, 'gold', 'round')}<span style="font:650 17px/1 var(--body);color:#fff">Now it runs when they ask</span><span class="chip" style="margin-left:auto;height:32px;padding:0 13px;font-size:13.5px;--dot:var(--green)"><i></i>A person checks</span></div>
        </div>
      </div>
    </div>
    ${[['target', 'blue', 'One process your team runs', 'Chosen with you, before we start'], ['pencil-ruler', 'violet', 'A course built on it', 'With your own examples and files'], ['graduation-cap', 'gold', 'They automate it themselves', 'Hands-on, with Claude and other AI tools']]
      .map(([i, t, a, b], k) => piece(2, `left:772px;top:${200 + k * 112}px;width:424px`, feat(i, t, a, b), `data-o="${k}" data-fx="right" data-pad="30"`)).join('')}
    <div class="abs seq row" data-b="4" data-fx="none" data-delay=".05" data-gap=".12" style="left:84px;top:556px;gap:11px;width:1112px">
      ${[['Sorting documents and emails', '#7cc0ff'], ['Routine questions', '#b3a4ff'], ['Reports from several sources', '#3ed598'], ['Moving data between tools', '#ffc24b']].map(([t, c]) => `<span class="chip" style="--dot:${c}"><i></i>${t}</span>`).join('')}</div>
    ${go('See automation training', '/training', { b: 5 })}`,
})

// ------------------------------------------------------------------ 10. your own platform
overview.push({
  id: 'platform', title: 'Your own platform',
  notes: 'If training is a regular need, it is worth having a home for it. We set up a learning platform for your company and build the courses that go on it: your courses, your people, your name. It can run in the cloud or on your premises, with the same assistant, question board, quizzes and certificates.',
  cues: [['o09', { 1: ['Your', 2], 2: ['Your', 3], 3: ['Your', 4] }]],
  bg: ground(GLOW.violet, { mx: 34, my: 58 }),
  fg: `${head('Your own platform', 'A home for your training.')}
    <div class="abs win" data-b="0" data-o="3" style="left:84px;top:196px;width:610px;height:404px">
      <div class="bar" style="height:54px;gap:12px"><span style="margin:0;display:inline-flex;align-items:center;gap:9px;height:32px;padding:0 13px;border-radius:9px;border:1.5px dashed rgba(255,194,75,.75);color:var(--gold);font:700 12px/1 var(--body);letter-spacing:.14em">YOUR LOGO</span><span style="font:650 15px/1 var(--display);color:#fff">Academy</span><span style="margin-left:auto;font-size:12.5px">Courses &nbsp;&middot;&nbsp; My learning &nbsp;&middot;&nbsp; Team</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 168px;gap:14px;padding:18px">
        ${[['monitor-play', 'blue', 'Onboarding', '82%'], ['flask-conical', 'violet', 'Product labs', '56%']].map(([i, t, name, pc], k) => `<div class="card" style="border-radius:16px;padding:16px;box-shadow:none">${ico(i, 46, t)}<div class="h3" style="font-size:17px;margin-top:14px">${name}</div><div class="track" style="margin-top:13px"><i class="grow" data-to="${pc}" data-delay="${0.6 + k * 0.3}" data-dur="1.6"></i></div></div>`).join('')}
        <div class="card" style="border-radius:16px;padding:14px;box-shadow:none;text-align:center"><svg width="84" height="84" viewBox="0 0 84 84" style="transform:rotate(-90deg)"><circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="9"/><circle class="draw" data-delay=".7" data-dur="1.8" cx="42" cy="42" r="34" stroke="#ffc24b" stroke-width="9" pathLength="100" style="stroke-dasharray:78 100"/></svg><div class="tiny" style="margin-top:10px;letter-spacing:.1em">Team progress</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:0 18px">
        <div class="card" style="border-radius:16px;padding:14px 16px;box-shadow:none" ><div class="row">${ico('bot-message-square', 38, 'green')}<div><div class="h3" style="font-size:15.5px">Assistant</div><div class="small" style="font-size:12.5px">Answers inside the lesson</div></div></div></div>
        <div class="card" style="border-radius:16px;padding:14px 16px;box-shadow:none"><div class="row">${ico('messages-square', 38, 'rose')}<div><div class="h3" style="font-size:15.5px">Question board</div><div class="small" style="font-size:12.5px">Answered by a trainer</div></div></div></div>
      </div>
    </div>
    ${[['book-open', 'blue', 'Your courses.'], ['users', 'violet', 'Your people.'], ['badge-check', 'gold', 'Your name.']].map(([i, t, a], k) => `<div class="abs row" data-b="${k + 1}" data-fx="right" style="left:744px;top:${214 + k * 92}px;gap:20px">${ico(i, 66, t)}<span class="h1" style="font-size:46px">${a}</span></div>`).join('')}
    <div class="abs seq row" data-b="4" data-fx="none" data-delay=".05" data-gap=".14" style="left:744px;top:508px;gap:10px;flex-wrap:wrap;width:460px">
      ${[['In the cloud', '#7cc0ff'], ['Or on your premises', '#b3a4ff'], ['Built and set up by us', '#ffc24b']].map(([t, c]) => `<span class="chip" style="--dot:${c}"><i></i>${t}</span>`).join('')}</div>
    ${go('Tell us what you need', '/contact', { b: 5 })}`,
})

// ------------------------------------------------------------------ 11. after the training (presentation only)
overview.push({
  id: 'after', title: 'After the training', film: false,
  notes: 'Two things clients ask about. Time: people learn the concepts with short lessons and practise with labs first, so trainer time is kept for the hard parts. Our aim is about sixty percent less classroom time than a usual three to five day course; how much depends on the course and the team. And support: questions start a week later, so there is a doubt desk where a trainer answers and the answer stays for the next person.',
  bg: ground(GLOW.gold, { mx: 30, my: 60 }),
  fg: `${head('After the training', 'Less classroom time. Help that stays.')}
    <div class="abs card" data-b="1" data-fx="left" style="left:84px;top:196px;width:540px;height:404px;padding:30px 32px">
      <div class="row" style="justify-content:space-between"><span class="h3">A usual course</span><span class="small">3 to 5 days in a classroom</span></div>
      <div class="track" style="height:30px;border-radius:10px;margin-top:11px"><i style="width:100%;border-radius:10px;background:linear-gradient(90deg,#1e6fe0,#5aa9f3)"></i></div>
      <div class="row" style="justify-content:space-between;margin-top:30px"><span class="h3">Lessons and labs first</span><span class="small">a trainer for the hard parts</span></div>
      <div class="track" style="height:30px;border-radius:10px;margin-top:11px"><i class="grow" data-to="40%" data-delay=".5" data-dur="1.6" style="border-radius:10px;background:linear-gradient(90deg,#f5a623,#ffd06b)"></i></div>
      <div class="row" style="margin-top:34px;gap:16px;align-items:baseline"><span class="nowrap" style="font:700 62px/1 var(--display);letter-spacing:-.04em;color:var(--gold)">about 60%</span><span class="h3" style="font-size:20px">less classroom time<br>is our aim</span></div>
      <div class="small" style="margin-top:14px;color:var(--mute)">How much depends on the course and the team.</div>
    </div>
    <div class="abs card" data-b="2" data-fx="right" style="left:656px;top:196px;width:540px;height:404px;padding:28px 30px">
      <div class="row">${ico('life-buoy', 50, 'rose')}<div class="h3" style="font-size:24px">A doubt desk for your team</div></div>
      <div class="bubble q" style="margin-top:22px;width:330px"><span class="who">Learner &middot; a week later</span>How do I do this on our own data?</div>
      <div class="bubble a" style="margin:12px 0 0 auto;width:370px"><span class="who">Trainer</span>Here is the step you need. Shall we look at it together on a call?</div>
      <div class="row" style="margin-top:20px;gap:10px"><span class="chip" style="--dot:var(--green)"><i></i>Kept for the next person</span><span class="chip" style="--dot:var(--gold)"><i></i>The course stays open</span></div>
    </div>
    ${go('Talk to us', '/contact', { b: 3 })}`,
})

// ------------------------------------------------------------------ 12. see it work first
const wire = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="rgba(125,190,255,.75)" stroke-width="1.6" stroke-dasharray="6 6"/>`
overview.push({
  id: 'prototype', title: 'See it work first',
  notes: 'Not sure yet? We take one use case and build it as a working prototype, with the scope agreed in writing before we start, tested on your own examples. The same way of working applies to automation: one process at a time, with people kept in charge of checking.',
  cues: [['o10', { 1: 0, 2: 'we' }]],
  bg: ground(GLOW.green, { mx: 60, my: 55 }),
  fg: `${head('See it first', 'See it work before you commit.')}
    <div class="abs card" data-b="1" data-fx="left" style="left:84px;top:204px;width:440px;height:320px;padding:22px;background:linear-gradient(180deg,rgba(61,148,255,.1),rgba(61,148,255,.03));border-color:rgba(125,190,255,.3)">
      <div class="tiny" style="color:var(--blue2)">The blueprint</div>
      <svg width="396" height="236" viewBox="0 0 396 236" style="margin-top:14px">${wire(0, 0, 150, 236)}${wire(166, 0, 230, 62)}${wire(166, 78, 230, 62)}${wire(166, 156, 108, 80)}${wire(288, 156, 108, 80)}
        <text x="14" y="26" fill="rgba(160,205,255,.85)" font-family="Segoe UI" font-size="12.5">document in</text><text x="180" y="26" fill="rgba(160,205,255,.85)" font-family="Segoe UI" font-size="12.5">read the fields</text><text x="180" y="104" fill="rgba(160,205,255,.85)" font-family="Segoe UI" font-size="12.5">check and flag</text><text x="180" y="182" fill="rgba(160,205,255,.85)" font-family="Segoe UI" font-size="12.5">person</text><text x="302" y="182" fill="rgba(160,205,255,.85)" font-family="Segoe UI" font-size="12.5">your system</text></svg>
    </div>
    <div class="abs" data-b="2" data-fx="fade" data-pad="20" style="left:540px;top:344px"><svg width="96" height="40" viewBox="0 0 96 40" style="overflow:visible"><path class="draw" data-delay="0" data-dur=".8" d="M4 20 H84 M68 6 L86 20 L68 34" stroke="#3ed598" stroke-width="4"/></svg></div>
    <div class="abs win" data-b="2" data-o="2" data-fx="right" style="left:652px;top:204px;width:544px;height:320px;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 40px 90px -30px rgba(0,0,0,.85),0 0 90px -26px rgba(62,213,152,.55)">
      <div class="bar"><b></b><b></b><b></b><span>Working prototype &middot; on your examples</span></div>
      <div style="display:grid;grid-template-columns:170px 1fr;gap:16px;padding:18px">
        <div style="border-radius:12px;background:#f3f5fa;height:246px;padding:14px"><div style="height:8px;width:60%;background:#2a3654;border-radius:9px"></div>${[90, 76, 84, 58, 80, 66, 72].map((w) => `<div style="height:5px;width:${w}%;background:#c3cbdc;border-radius:9px;margin-top:11px"></div>`).join('')}<div style="height:26px;border-radius:7px;background:#dfe6f5;margin-top:16px"></div></div>
        <div class="seq" data-delay=".5" data-gap=".22">${[['Supplier', 'Northwind Traders'], ['Invoice number', 'INV-20418'], ['Total', 'matches the order'], ['Tax', 'needs a person to check']].map(([k2, v], i) => `<div class="row" style="justify-content:space-between;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.06);margin-bottom:9px;font:500 14.5px/1.2 var(--body)"><span style="color:var(--soft)">${k2}</span><span class="row" style="gap:8px;color:${i === 3 ? 'var(--gold)' : '#fff'}">${v}<span class="tick" style="width:16px;height:16px${i === 3 ? ';background:var(--gold)' : ''}"></span></span></div>`).join('')}</div>
      </div>
    </div>
    <div class="abs seq row" data-b="3" data-fx="none" data-delay=".05" data-gap=".14" style="left:84px;top:552px;gap:11px">
      ${[['Scope agreed in writing', '#7cc0ff'], ['Tested on your examples', '#3ed598'], ['People stay in charge', '#ffc24b'], ['One process at a time', '#b3a4ff']].map(([t, c]) => `<span class="chip big" style="--dot:${c}"><i></i>${t}</span>`).join('')}</div>
    ${go('How automation works', '/automation', { b: 4 })}`,
})

// ------------------------------------------------------------------ 13. the AI Weekend
const WK = [
  // Seven parts over the two days, as in src/data/ai-weekend.ts. About AI, not one product.
  ['Day 1 &middot; Saturday', 'From how AI works to your own tools', ['Your context file', 'A weekly report in minutes', 'Pictures, video and sound', 'Skills and connectors'], 'blue'],
  ['Day 2 &middot; Sunday', 'Automate a task, then build agents', ['One task automated', 'Your first agent', 'A team of agents'], 'gold'],
]
const dayCard = ([day, title, builds, tone], k, b) => `<div class="abs card" data-b="${b}" data-o="${k}" style="left:${84 + k * 568}px;top:314px;width:544px;height:290px;padding:22px 28px">
    <div class="row" style="gap:16px">${ico(k ? 'bot' : 'file-text', 56, tone)}<div><div class="tiny" style="color:${k ? 'var(--gold)' : 'var(--blue2)'}">${day}</div><div class="h3" style="margin-top:7px;font-size:23px">${title}</div></div></div>
    <div class="seq" data-delay="${0.5 + k * 0.5}" data-gap=".22" style="margin-top:16px">${builds.map((t) => `<div class="row" style="padding:9px 0;border-top:1px solid rgba(255,255,255,.09);font:500 17px/1.2 var(--body)"><span class="tick" style="${k ? 'background:var(--gold)' : ''}"></span>${t}</div>`).join('')}</div></div>`
const bolt = (size) => `<div style="position:relative;width:${size}px;height:${size}px"><div data-loop="pulse" data-per="2.2" style="position:absolute;inset:-34%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,190,70,.6),transparent 70%)"></div>${ico('zap', size, 'gold', 'round')}</div>`
overview.push({
  id: 'weekend', title: 'The AI Weekend',
  notes: `On the last weekend of every month there is the ${D.weekend.name}: two live sessions, Saturday and Sunday, and seven working demos, built step by step in front of you: from how AI works to a team of agents, with the complete kit afterwards. Each day runs ${D.weekend.time}, online. The page shows the next dates.`,
  cues: [['o11', { 1: 'Two', 2: 'Seven' }]],
  bg: ground(GLOW.gold, { mx: 40, my: 50 }),
  fg: `
    <div class="abs" data-b="0" data-fx="pop" data-pad="60" style="left:84px;top:96px">${bolt(112)}</div>
    <div class="abs kicker" data-b="0" data-o="1" data-fx="fade" style="left:228px;top:106px">Live &middot; every month</div>
    <div class="abs h1 nowrap" data-b="0" data-o="2" style="left:226px;top:130px;font-size:66px">The AI Weekend</div>
    <div class="abs p" data-b="0" data-o="3" style="left:228px;top:218px;font-size:23px">Build with AI in one weekend.</div>
    ${WK.map((d, k) => dayCard(d, k, k + 1)).join('')}
    <div class="abs card lit" data-b="0" data-o="5" data-fx="right" data-href="${SITE}/ai-weekend" data-alt="The AI Weekend: the last weekend of every month, Saturday and Sunday, live online" style="left:856px;top:104px;width:340px;padding:20px 24px">
      <div class="tiny" style="color:var(--gold)">Every month</div><div class="h3" style="margin-top:9px;font-size:26px">The last weekend</div><div class="small" style="margin-top:6px;font-size:15.5px">Saturday &amp; Sunday &middot; live online</div></div>
    ${go('Reserve a seat', '/ai-weekend', { b: 3, cls: 'gold' })}`,
})

// ------------------------------------------------------------------ 14. beyond this deck (presentation only)
const PLACES = [['play', 'blue', 'Learning Studio', '/studio'], ['sparkles', 'violet', 'AI Essentials', '/ai-academy'], ['award', 'claude', 'Claude', '/claude'], ['users', 'blue', 'Training', '/training'], ['workflow', 'green', 'Automation', '/automation'], ['zap', 'gold', 'AI Weekend', '/ai-weekend'], ['video', 'rose', 'Webinars', '/webinars'], ['book-open', 'violet', 'Blog', '/resources/blog']]
overview.push({
  id: 'site', title: 'Beyond this deck', film: false,
  notes: 'What you have seen is today. New courses and programmes appear on the website first, and every part of what we do has its own page there. Each of these opens that page.',
  bg: ground(GLOW.blue, { mx: 50, my: 55 }),
  fg: `${head('Beyond this deck', 'New things appear on the website first.')}
    <div class="abs" data-b="0" data-o="3" data-fx="fade" data-pad="0" data-spin="3" style="left:${640 - 172}px;top:${400 - 172}px">${ring(152, 44, { speed: 3, dot: 2.6 })}</div>
    <div class="abs center" data-b="0" data-o="4" data-fx="pop" style="left:540px;top:354px;width:200px">${mark(74)}<div class="h3" style="margin-top:8px;font-size:18px">gennoor.com</div></div>
    ${PLACES.map(([i, t, name, path], k) => {
      const a = (-90 + k * 45) * Math.PI / 180, x = 640 + 400 * Math.cos(a) - 122, y = 400 + 196 * Math.sin(a) - 36
      return `<div class="abs card row" data-b="1" data-o="${k}" data-fx="pop" data-href="${SITE}${path}" data-alt="${name}: gennoor.com${path}" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:244px;height:72px;padding:0 14px;gap:14px;border-radius:20px">${ico(i, 46, t)}<div><div class="h3" style="font-size:18px">${name}</div><div class="small" style="font-size:13px;color:var(--blue2);margin-top:2px">${path} &rarr;</div></div></div>`
    }).join('')}`,
})

// ------------------------------------------------------------------ 15. the close
overview.push({
  id: 'close', title: 'Train. Innovate. Build.',
  notes: 'Train. Innovate. Build. The simplest way to start is to watch a preview lesson: there is nothing to sign up for. Or tell us about your team: how many people, which teams and by when, and we will suggest something sensible in twenty minutes.',
  cues: [['o12', { 1: 'Train', 2: 'Innovate', 3: 'Build' }], ['o13', { 4: 0 }]],
  bg: ground(GLOW.blue, { mx: 50, my: 42 }) + `<div class="abs" style="left:${640 - 520}px;top:${250 - 520}px;opacity:.45">${ring(500, 110, { speed: -1.1, dot: 2, alpha: .55, gold: 0 })}</div>`,
  fg: `
    <div class="abs" data-b="0" data-fx="fade" data-dur="1.4" data-pad="0" data-spin="2.4" style="left:${640 - 190}px;top:${238 - 190}px">${ring(170, 52, { speed: 2.4, dot: 2.6 })}</div>
    <div class="abs" data-b="0" data-o="1" data-fx="pop" data-pad="50" style="left:${640 - 66}px;top:${238 - 66}px">${mark(132)}</div>
    <div class="abs row" style="left:0;width:1280px;top:438px;justify-content:center;gap:34px">
      <div class="h1 nowrap" data-b="1" style="font-size:68px">Train.</div>
      <div class="h1 nowrap" data-b="2" style="font-size:68px">Innovate.</div>
      <div class="h1 nowrap" data-b="3" style="font-size:68px"><span class="grad">Build.</span></div></div>
    <div class="abs row" style="left:0;width:1280px;top:560px;justify-content:center;gap:16px">
      <div class="pill" data-b="4" data-href="${SITE}/studio" data-alt="Watch a preview lesson: gennoor.com/studio">Watch a preview lesson <small>gennoor.com/studio</small> <span>&rarr;</span></div>
      <div class="pill ghost" data-b="4" data-o="1" data-film="0" data-href="${SITE}/resources/calendar" data-alt="Book a 20-minute call">Book a 20-minute call</div></div>
    <div class="abs" data-b="4" data-o="2" data-fx="fade" data-film="0" data-href="https://claude.com/partners" data-alt="${CPN_LINE}" style="left:1010px;top:70px">${cpn(150)}</div>`,
})

window.SHOWS = { ...(window.SHOWS || {}), overview: { scenes: overview } }
