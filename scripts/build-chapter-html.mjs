#!/usr/bin/env node
// Generate chapter HTML from a JSON spec.
// Usage: node scripts/build-chapter-html.mjs path/to/spec.json
//
// Spec format (see schema in /scripts/chapter-spec.example.json):
// {
//   "courseSlug": "...",
//   "courseTagline": "Function · …",
//   "chapter": { "number": "01 / 06", "id": "chapter-01-foo", "title": "..." },
//   "audioSrc": "../audio/chapter-01/chapter-01.mp3",
//   "slides": [
//     { "type": "title", "eyebrow": "...", "h1Html": "...", "subtitleHtml": "..." },
//     { "type": "content", "num": "02 / 06", "eyebrow": "...", "icon": "1", "iconRed": false,
//       "headlineHtml": "...",
//       "blocks": [ { "atStep": 1, "html": "<div class='card'>...</div>" }, ... ] }
//   ],
//   "cues": [ { "at": 0.0, "slide": 1 }, { "at": 15.0, "slide": 2 }, ... ]
// }

import fs from 'node:fs';
import path from 'node:path';

const STYLES = `
:root{--bg:#FAFAFA;--paper:#FFFFFF;--ink:#0F172A;--ink-soft:#475569;--ink-mute:#64748B;--ink-soft-2:#94A3B8;--line:#E2E8F0;--c-primary:#475569;--c-primary-deep:#334155;--c-dark:#1E293B;--c-accent:#F97316;--c-accent-light:#FDBA74;--c-tint:#F8FAFC;--c-accent-tint:#FFF7ED;--semantic-green:#10B981;--semantic-red:#EF4444;--semantic-amber:#D97706}
*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}body{background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;font-size:18px;line-height:1.55;-webkit-font-smoothing:antialiased}h1,h2,h3,h4,.slide-h,.brand-name{font-family:'Plus Jakarta Sans',sans-serif}.app{position:fixed;inset:0;display:flex;flex-direction:column}.topbar{height:56px;background:var(--c-dark);color:#fff;display:flex;align-items:center;padding:0 22px;gap:18px;z-index:10;flex-shrink:0}.brand-lockup{display:flex;align-items:center;gap:12px}.brand-text{display:flex;flex-direction:column;line-height:1.1}.brand-name{font-size:16px;font-weight:600;color:#fff}.brand-name .b-c1{color:var(--c-accent)}.brand-name .b-c2{color:var(--c-accent-light)}.brand-name .b-w-soft{color:rgba(255,255,255,.7);font-weight:500}.brand-sub{font-size:10px;color:var(--c-accent);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;font-family:'JetBrains Mono',monospace;margin-top:2px}.topbar .divider{width:1px;height:22px;background:rgba(255,255,255,.15)}.topbar .chapter-title{font-size:15px;opacity:.78;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.slide-nav{display:flex;gap:6px;align-items:center}.slide-nav button{width:30px;height:30px;border-radius:6px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.15);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px}.slide-nav .pill{padding:3px 11px;background:rgba(255,255,255,.10);border-radius:4px;font-size:13px;font-weight:600;font-family:'JetBrains Mono',monospace;min-width:64px;text-align:center}.slide-nav .nav-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;color:rgba(255,255,255,.55);text-transform:uppercase;font-weight:700;margin-right:4px}.topbar-divider{width:1px;height:20px;background:rgba(255,255,255,.15);margin:0 6px}.play-btn{height:32px;padding:0 14px 0 12px;border-radius:6px;background:var(--c-accent);border:0;color:#fff;cursor:pointer;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700}.audio-status{position:absolute;top:60px;right:24px;background:var(--c-dark);color:#fff;padding:6px 12px;border-radius:6px;font-size:11.5px;font-family:'JetBrains Mono',monospace;z-index:30;max-width:360px;display:none}.audio-status.is-visible{display:block}.audio-status .label{color:var(--c-accent-light);text-transform:uppercase;font-size:10px;font-weight:700;display:block;margin-bottom:3px}.progress{height:3px;background:rgba(0,0,0,.05);flex-shrink:0}#progressFill{height:100%;width:0%;background:linear-gradient(90deg,var(--c-primary),var(--c-accent));transition:width .5s}.stage{flex:1;position:relative;overflow:hidden;background:var(--bg)}.slides{width:100%;height:100%;position:relative}.slide{position:absolute;inset:0;padding:42px 64px 100px;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity .35s ease;overflow-y:auto}.slide.active{opacity:1;pointer-events:auto}.slide-num{position:absolute;top:16px;right:24px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ink-soft-2);letter-spacing:1.5px;font-weight:600;z-index:5}[data-step]{opacity:0;transform:translateY(14px);transition:opacity .55s cubic-bezier(.2,.7,.3,1),transform .55s cubic-bezier(.2,.7,.3,1);pointer-events:none}[data-step].revealed{opacity:1;transform:translateY(0);pointer-events:auto}.slide.title-slide{background:linear-gradient(135deg,#1E293B 0%,#334155 38%,#475569 72%,#F97316 132%);color:#fff;justify-content:center;padding:120px 80px;overflow:hidden}.slide.title-slide::before{content:"";position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,#F9731633 0%,transparent 70%);top:-200px;right:-200px}.slide.title-slide::after{content:"";position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,#FDBA743F 0%,transparent 70%);bottom:-160px;left:-160px}.slide.title-slide .brand-full{position:absolute;top:42px;left:64px;display:flex;align-items:center;gap:16px;z-index:2}.slide.title-slide .brand-wordmark .name{font-size:24px;font-weight:600;color:#fff;font-family:'Plus Jakarta Sans',sans-serif}.slide.title-slide .brand-wordmark .name .b-c1{color:var(--c-accent)}.slide.title-slide .brand-wordmark .name .b-c2{color:var(--c-accent-light)}.slide.title-slide .brand-wordmark .tag{font-size:11px;color:var(--c-accent-light);letter-spacing:3px;font-weight:600;font-family:'JetBrains Mono',monospace;margin-top:5px;text-transform:uppercase}.slide.title-slide .title-inner{position:relative;z-index:2;max-width:1100px}.slide.title-slide .eyebrow{font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:3px;color:var(--c-accent-light);margin-bottom:18px;font-weight:600;text-transform:uppercase}.slide.title-slide h1{font-size:54px;line-height:1.1;font-weight:700;letter-spacing:-1.2px;margin-bottom:22px;color:#fff}.slide.title-slide h1 em{color:var(--c-accent-light);font-style:normal}.slide.title-slide .subtitle{font-size:21px;line-height:1.55;color:rgba(255,255,255,.92);max-width:880px}.slide.title-slide .subtitle em{color:var(--c-accent-light);font-style:italic;font-weight:600}.slide.title-slide .subtitle strong{color:#fff;font-weight:600}.slide.content-slide{padding:42px 64px 100px}.slide .eyebrow{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:2.5px;color:var(--c-accent);margin-bottom:12px;font-weight:700;text-transform:uppercase}.slide-head{display:flex;align-items:flex-start;gap:16px;margin-bottom:18px}.slide-icon{width:48px;height:48px;flex-shrink:0;border-radius:10px;background:linear-gradient(135deg,var(--c-primary),var(--c-primary-deep));color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:700}.slide-icon.red{background:linear-gradient(135deg,var(--semantic-red),#B91C1C)}.slide-icon.green{background:linear-gradient(135deg,var(--semantic-green),#047857)}.slide h2.slide-h{font-size:32px;font-weight:700;letter-spacing:-.6px;line-height:1.15;color:var(--c-dark);flex-grow:1;padding-top:4px}.slide h2.slide-h em{color:var(--c-accent);font-style:normal}.slide p{font-size:17px;color:var(--ink-soft);margin-bottom:14px}.slide em{color:var(--c-accent);font-style:italic;font-weight:600}.slide strong{color:var(--c-dark);font-weight:700}
.card{background:#fff;border:1px solid var(--line);border-left:3px solid var(--c-accent);border-radius:8px;padding:18px 24px;max-width:1100px;margin-top:6px}.card.red{border-left-color:var(--semantic-red)}.card.green{border-left-color:var(--semantic-green)}
.card .ct{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.8px;text-transform:uppercase;font-weight:700;color:var(--c-accent);margin-bottom:6px}.card.red .ct{color:var(--semantic-red)}.card.green .ct{color:var(--semantic-green)}
.card h3{font-size:19px;color:var(--c-dark);margin:0 0 6px 0;font-weight:700}
.card p{font-size:14px;color:var(--ink-soft);margin:0 0 6px 0;line-height:1.6}.card p strong{color:var(--c-dark)}
.card .big{font-family:'Plus Jakarta Sans',sans-serif;font-size:32px;font-weight:700;color:var(--c-accent);letter-spacing:-.8px;line-height:1.1;padding:6px 0}.card.red .big{color:var(--semantic-red)}.card.green .big{color:var(--semantic-green)}
.card .takeaway{margin-top:6px;padding:9px 13px;background:var(--c-accent-tint);border-left:3px solid var(--c-accent);border-radius:5px;font-size:13px;color:var(--c-dark);font-style:italic;font-weight:500}
.card .src{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--ink-mute);margin-top:4px}
.grid{display:grid;gap:10px;max-width:1320px;margin-top:6px}.grid.cols-2{grid-template-columns:repeat(2,1fr)}.grid.cols-3{grid-template-columns:repeat(3,1fr)}.grid.cols-4{grid-template-columns:repeat(4,1fr)}.grid.cols-5{grid-template-columns:repeat(5,1fr)}
.cell{background:#fff;border:1px solid var(--line);border-top:3px solid var(--c-accent);border-radius:8px;padding:12px 14px}.cell.red{border-top-color:var(--semantic-red)}.cell.green{border-top-color:var(--semantic-green)}.cell.amber{border-top-color:var(--semantic-amber)}
.cell .cn{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--c-accent);letter-spacing:1.2px;font-weight:700;text-transform:uppercase;margin-bottom:4px}.cell.red .cn{color:var(--semantic-red)}.cell.green .cn{color:var(--semantic-green)}.cell.amber .cn{color:var(--semantic-amber)}
.cell h4{font-size:14px;color:var(--c-dark);margin:0 0 4px 0;font-weight:700;line-height:1.25}
.cell .num{font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:700;color:var(--c-dark);letter-spacing:-.6px;padding:2px 0;line-height:1}.cell.red .num{color:var(--semantic-red)}.cell.green .num{color:var(--semantic-green)}
.cell p{font-size:12px;color:var(--ink-soft);margin:0;line-height:1.55}.cell p strong{color:var(--c-dark)}
.cell ul{margin:6px 0 0 16px;font-size:12.5px;color:var(--ink-soft);line-height:1.7}.cell ul li strong{color:var(--c-dark)}
.builder{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px 24px;max-width:1320px;margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:18px}
.builder .fields{display:flex;flex-direction:column;gap:12px}
.builder .group h5{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--c-primary-deep);letter-spacing:1.5px;text-transform:uppercase;font-weight:700;margin:0 0 6px 0}
.builder .preset{display:flex;flex-wrap:wrap;gap:5px}
.builder .preset button{font-family:'Inter',sans-serif;font-size:11.5px;padding:5px 9px;border:1px solid var(--line);border-radius:5px;background:#fff;color:var(--ink-soft);cursor:pointer;font-weight:500}
.builder .preset button:hover{border-color:var(--c-accent);color:var(--c-accent)}
.builder .preset button.picked{background:var(--c-accent);color:#fff;border-color:var(--c-accent)}
.builder .preview{background:#0F172A;color:#E2E8F0;border-radius:10px;padding:18px 22px;font-family:'JetBrains Mono',monospace;font-size:11.5px;line-height:1.6;overflow-y:auto;max-height:500px;white-space:pre-wrap}
.builder .dl-btn{margin-top:6px;padding:11px 18px;background:var(--c-accent);color:#fff;border:0;border-radius:7px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;width:100%}
.final-close{background:linear-gradient(135deg,#1E293B 0%,#334155 60%,#7C2D12 130%);color:#fff;border-radius:14px;padding:38px 48px;max-width:1100px;margin-top:8px;position:relative;overflow:hidden}
.final-close::after{content:"";position:absolute;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,#F9731633 0%,transparent 65%);bottom:-180px;right:-100px}
.final-close .eyebrow{color:var(--c-accent-light);margin-bottom:8px}.final-close h2{font-size:26px;font-weight:700;letter-spacing:-.4px;color:#fff;margin-bottom:14px;line-height:1.2;position:relative;z-index:2}.final-close h2 em{color:var(--c-accent-light);font-style:normal}.final-close p{font-size:15px;color:rgba(255,255,255,.92);line-height:1.6;margin-bottom:10px;position:relative;z-index:2}.final-close p strong{color:#fff;font-weight:700}
.close-list{display:flex;flex-direction:column;gap:6px;margin-top:14px;position:relative;z-index:2}
.close-list .row{font-family:'Plus Jakarta Sans',sans-serif;font-size:15.5px;font-weight:600;color:#fff}.close-list .row .arr{color:var(--c-accent-light);margin-right:10px}
.close-final{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--c-accent-light);letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-top:18px;position:relative;z-index:2}
audio#chapterAudio{display:none}
`.trim();

const PLAYER_JS = `
(function(){
var slides=document.querySelectorAll('.slide');var totalSlides=slides.length;
var currentCueIdx=0;
var audio=document.getElementById('chapterAudio'),counterTop=document.getElementById('counterTop'),progressFill=document.getElementById('progressFill'),prevSlideBtn=document.getElementById('prevSlideBtn'),nextSlideBtn=document.getElementById('nextSlideBtn'),playPauseBtn=document.getElementById('playPauseBtn'),playPauseIcon=document.getElementById('playPauseIcon'),playPauseLabel=document.getElementById('playPauseLabel'),audioStatus=document.getElementById('audioStatus'),audioAvailable=false;
function pad(n){return String(n).padStart(2,'0')}
function applyCue(idx,seekAudio,fillSlide){if(idx<0||idx>=cues.length)return;currentCueIdx=idx;var cue=cues[idx],n=cue.slide;slides.forEach(function(s,i){s.classList.toggle('active',i===n-1)});if(counterTop)counterTop.textContent=pad(n)+' / '+pad(totalSlides);if(progressFill)progressFill.style.width=((n/totalSlides)*100)+'%';var active=slides[n-1],stepEls=active.querySelectorAll('[data-step]');if(cue.step!==undefined){stepEls.forEach(function(el){var s=parseInt(el.getAttribute('data-step'),10);el.classList.toggle('revealed',s<=cue.step)})}else if(fillSlide){stepEls.forEach(function(el){el.classList.add('revealed')})}else{stepEls.forEach(function(el){el.classList.remove('revealed')})}if(seekAudio&&audio&&!isNaN(cue.at)){try{audio.currentTime=cue.at}catch(e){}}if(cue.slide===__BUILDER_SLIDE__&&cue.step===__BUILDER_STEP__){if(typeof initBuilderOnce==='function')initBuilderOnce()}}
function nextSlide(){var c=cues[currentCueIdx].slide;for(var i=currentCueIdx+1;i<cues.length;i++){if(cues[i].slide>c&&cues[i].step===undefined){applyCue(i,true,false);return}}}
function prevSlide(){var cc=cues[currentCueIdx];if(cc.step!==undefined){for(var i=currentCueIdx-1;i>=0;i--){if(cues[i].slide===cc.slide&&cues[i].step===undefined){applyCue(i,true,false);return}}}for(var j=currentCueIdx-1;j>=0;j--){if(cues[j].slide<cc.slide&&cues[j].step===undefined){applyCue(j,true,true);return}}}
function onTimeUpdate(){if(!audio)return;var t=audio.currentTime,tg=currentCueIdx;for(var i=currentCueIdx+1;i<cues.length;i++){if(cues[i].at<=t+0.05)tg=i;else break}if(tg>currentCueIdx)applyCue(tg,false,false)}
function setUnavailable(){audioAvailable=false;if(playPauseBtn)playPauseBtn.classList.add('is-unavailable');if(playPauseIcon)playPauseIcon.textContent='○';if(playPauseLabel)playPauseLabel.textContent='No audio';if(audioStatus)audioStatus.classList.add('is-visible')}
function setAvailable(){audioAvailable=true;if(playPauseBtn)playPauseBtn.classList.remove('is-unavailable');if(playPauseIcon)playPauseIcon.textContent='▶';if(playPauseLabel)playPauseLabel.textContent='Play';if(audioStatus)audioStatus.classList.remove('is-visible')}
function togglePlay(){if(!audio||!audioAvailable){if(audioStatus)audioStatus.classList.add('is-visible');return}if(audio.paused)audio.play().catch(function(){});else audio.pause()}
if(audio){audio.addEventListener('timeupdate',onTimeUpdate);audio.addEventListener('play',function(){if(playPauseIcon)playPauseIcon.textContent='❚❚';if(playPauseLabel)playPauseLabel.textContent='Pause'});audio.addEventListener('pause',function(){if(playPauseIcon)playPauseIcon.textContent='▶';if(playPauseLabel)playPauseLabel.textContent='Play'});audio.addEventListener('loadedmetadata',setAvailable);audio.addEventListener('canplay',setAvailable);audio.addEventListener('error',setUnavailable);setTimeout(function(){if(!audioAvailable)setUnavailable()},2500)}else{setUnavailable()}
if(prevSlideBtn)prevSlideBtn.addEventListener('click',prevSlide);if(nextSlideBtn)nextSlideBtn.addEventListener('click',nextSlide);if(playPauseBtn)playPauseBtn.addEventListener('click',togglePlay);
document.addEventListener('keydown',function(e){if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'))return;if(e.key==='ArrowRight'){e.preventDefault();nextSlide()}else if(e.key==='ArrowLeft'){e.preventDefault();prevSlide()}else if(e.key==='PageDown'){e.preventDefault();nextSlide()}else if(e.key==='PageUp'){e.preventDefault();prevSlide()}else if(e.key===' '){e.preventDefault();togglePlay()}});
__BUILDER_INIT_FN__
if(window.parent!==window){if(playPauseBtn)playPauseBtn.style.display='none';if(audioStatus)audioStatus.style.display='none';var sn=document.querySelector('.slide-nav');if(sn)sn.style.display='none';if(audio){try{audio.muted=true;audio.pause()}catch(e){}}window.addEventListener('message',function(e){if(!e||!e.data||e.data.type!=='gennoor-academy:cue')return;var slide=e.data.slide,step=e.data.step;for(var i=0;i<cues.length;i++){if(cues[i].slide===slide&&cues[i].step===step){applyCue(i,false,false);return}}});}
applyCue(0,false,false);
})();
`.trim();

function renderTitleSlide(slide, num, courseTagline) {
  return `<section class="slide title-slide active" data-slide="${num}"><div class="slide-num">${num} / __TOTAL__</div>
<div class="brand-full"><svg width="52" height="52" viewBox="0 0 130 130"><circle cx="80" cy="65" r="6" fill="#FDBA74"/><circle cx="95" cy="65" r="6" fill="#FDBA74"/></svg><div class="brand-wordmark"><span class="name"><span class="b-w">Ge</span><span class="b-c1">nn</span><span class="b-c2">oo</span><span class="b-c1">r</span><span class="b-w-soft"> Academy</span></span><span class="tag">${escapeHtml(courseTagline)}</span></div></div>
<div class="title-inner"><div class="eyebrow">${escapeHtml(slide.eyebrow)}</div><h1>${slide.h1Html}</h1><p class="subtitle">${slide.subtitleHtml}</p></div>
</section>`;
}

function renderContentSlide(slide, num) {
  const iconClass = slide.iconRed ? 'slide-icon red' : (slide.iconGreen ? 'slide-icon green' : 'slide-icon');
  const blocks = (slide.blocks || []).map(b => {
    const step = b.atStep ? ` data-step="${b.atStep}"` : '';
    // wrap as a div if no enclosing element to receive data-step
    if (/^\s*<(div|section|article|aside|ul|ol|table|form)/.test(b.html)) {
      return b.html.replace(/^(\s*<[a-z][a-z0-9]*)([^>]*)>/, (_m, tag, attrs) => {
        if (b.atStep) return `${tag}${attrs} data-step="${b.atStep}">`;
        return `${tag}${attrs}>`;
      });
    }
    return `<div${step}>${b.html}</div>`;
  }).join('\n');
  return `<section class="slide content-slide" data-slide="${num}"><div class="slide-num">${num} / __TOTAL__</div>
<div class="eyebrow">${escapeHtml(slide.eyebrow)}</div>
<div class="slide-head"><div class="${iconClass}">${slide.icon || num}</div><h2 class="slide-h">${slide.headlineHtml}</h2></div>
${blocks}
</section>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function pad2(n) { return String(n).padStart(2, '0'); }

export function build(spec) {
  const total = spec.slides.length;
  const slidesHtml = spec.slides.map((s, i) => {
    const num = pad2(i + 1);
    if (s.type === 'title') return renderTitleSlide({ ...s, num }, num, spec.courseTagline);
    return renderContentSlide({ ...s, num }, num);
  }).join('\n').replace(/__TOTAL__/g, pad2(total));

  const cuesJson = JSON.stringify(spec.cues, null, 0)
    .replace(/\}\,\{/g, '},\n{')
    .replace(/\[\{/, '[\n{')
    .replace(/\}\]$/, '}\n]');

  const builderInitFn = spec.builderInitFn || '';
  const builderSlide = spec.builderSlide || -1;
  const builderStep = spec.builderStep || -1;

  const js = PLAYER_JS
    .replace('__BUILDER_SLIDE__', String(builderSlide))
    .replace('__BUILDER_STEP__', String(builderStep))
    .replace('__BUILDER_INIT_FN__', builderInitFn);

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(spec.chapter.title)} · Gennoor Academy</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap">
<style>
${STYLES}
${spec.extraCss || ''}
</style></head><body>
<div class="app">
<div class="topbar">
<div class="brand-lockup"><svg width="36" height="36" viewBox="0 0 130 130"><circle cx="80" cy="65" r="6" fill="#F97316"/><circle cx="95" cy="65" r="6" fill="#F97316"/></svg><div class="brand-text"><span class="brand-name"><span class="b-w">Ge</span><span class="b-c1">nn</span><span class="b-c2">oo</span><span class="b-c1">r</span><span class="b-w-soft"> Academy</span></span><span class="brand-sub">${escapeHtml(spec.courseTagline)}</span></div></div>
<div class="divider"></div>
<div class="chapter-title">${escapeHtml(spec.chapter.title)}</div>
<div class="slide-nav"><span class="nav-label">Slide</span><button id="prevSlideBtn">‹</button><span class="pill" id="counterTop">01 / ${pad2(total)}</span><button id="nextSlideBtn">›</button><div class="topbar-divider"></div><button id="playPauseBtn" class="play-btn"><span id="playPauseIcon">▶</span><span id="playPauseLabel">Play</span></button></div>
</div>
<audio id="chapterAudio" src="${escapeHtml(spec.audioSrc)}" preload="metadata"></audio>
<div class="audio-status" id="audioStatus"><span class="label">Audio status</span>MP3 not yet recorded.</div>
<div class="progress"><div id="progressFill"></div></div>
<div class="stage"><div class="slides">

${slidesHtml}

</div></div>
</div>

<script>
var cues = ${cuesJson};
${js}
</script>
</body></html>`;
}

export function emit(spec) {
  const outPath = spec.outPath;
  if (!outPath) throw new Error('Spec missing outPath');
  const html = build(spec);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  const sizeKb = (html.length / 1024).toFixed(1);
  console.log(`✓ ${path.basename(outPath)} · ${sizeKb} KB · ${spec.slides.length} slides`);
}

// CLI mode (only when run directly with JSON specs)
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) {
  const args = process.argv.slice(2);
  for (const specPath of args) {
    if (!specPath.endsWith('.json')) continue;
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    emit(spec);
  }
}
