// Generates the card thumbnails for the AI Essentials interactive courses
// (/ai-academy) with gpt-image-2 on the gennoor-image Foundry resource.
//
// Each course gets one plain scene that anyone can read at a glance; the
// shared STYLE keeps all 48 cards in one visual language. Output is a
// 1280x720 WebP at public/courses/<id>/thumbnail.webp, which is the path
// `thumbnail` points to in src/config/courses.ts.
//
// Usage:
//   GENNOOR_IMAGE_KEY=$(az cognitiveservices account keys list -g rg-gennoor-tech -n gennoor-image --query key1 -o tsv) \
//     node scripts/generate-course-thumbnails.mjs [course-id ...] [--force]
//
// Without ids it fills every course that has no thumbnail yet; --force
// regenerates the named (or all) courses. A new interactive course needs a
// line in SCENES before it can get an image.

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const ENDPOINT = process.env.GENNOOR_IMAGE_ENDPOINT || 'https://gennoor-image.openai.azure.com'
const DEPLOYMENT = process.env.GENNOOR_IMAGE_DEPLOYMENT || 'gpt-image-2'
const KEY = process.env.GENNOOR_IMAGE_KEY
const OUT_DIR = path.join(process.cwd(), 'public', 'courses')

const STYLE =
  'A clean modern editorial illustration in soft 3D style. Rounded shapes, matte materials, gentle studio lighting, ' +
  'light off-white background with a soft blue tint, palette of slate grey, calm blue and a small touch of warm orange. ' +
  'One clear focal scene in the centre with generous space around it, nothing cut off at the edges. ' +
  'Simple stylised people without detailed faces. No text, no letters, no numbers, no logos, no brand marks, no watermarks.'

const SCENES = {
  'ab-100': 'several small friendly robot assistants passing documents, an invoice and a calendar along a connected workflow, coordinated by a central glowing hub, laid out like an architect\'s blueprint on a desk',
  'ai-foundations': 'a person and a friendly simple robot sitting side by side at a desk, looking together at an open book, with a softly glowing lightbulb above them',
  'ai-strategy-c-suite': 'a boardroom table seen at an angle with a chess board in the middle, one chess piece is a small glowing robot, and a rising chart on a screen behind',
  'ai-governance-risk-boards': 'a balanced scale on a boardroom table, one side holding a glowing computer chip and the other a shield with a check mark, a few board members seated around it',
  'ai-for-finance-accounting': 'a calculator, a ledger book and stacked coins next to a laptop showing a rising forecast chart, with a small friendly robot helper pointing at the chart',
  'ai-in-financial-services': 'a classic bank building with columns, a credit card and a shield with a padlock in front of it, joined by soft glowing network lines',
  'generative-ai-for-business': 'a manager at a desk with an open laptop from which a document, a picture, a chart and a speech bubble float upward',
  'ai-for-hr-people-teams': 'a small team of diverse people around a simple organisation chart, with a magnifying glass over a resume and a friendly robot helper',
  'ai-in-healthcare': 'a friendly doctor talking with a patient in a bright clinic room, a stethoscope and a clipboard with a heartbeat line on the desk, a small microphone quietly capturing notes',
  'm365-copilot-adoption': 'office workers at desks with laptops showing documents, spreadsheets, email and slides, a growing bar chart of people taking up the new tools behind them',
  'ai-for-sales-marketing': 'a megaphone, a target with an arrow in the bullseye and a sales funnel with a rising arrow',
  'ai-for-customer-service-support': 'a customer service agent wearing a headset at a desk, chat bubbles and a happy rating star, with a small robot helper suggesting a reply',
  'ai-for-operations-supply-chain': 'a warehouse with shelves of boxes, a delivery truck and a globe with route lines connecting cargo containers',
  'ai-in-manufacturing': 'a modern factory floor with a robotic arm assembling parts on a conveyor belt, gears and a monitoring screen',
  'building-ai-agents-copilot-studio': 'building blocks being assembled into a friendly robot assistant on a workbench, with a checklist clipboard beside it',
  'ai-roi-business-case-building': 'a balance between a stack of coins and a glowing lightbulb, with a report showing a rising return arrow and a calculator',
  'building-an-hr-copilot-case-study': 'an HR employee at a laptop chatting with a friendly assistant robot, with folders marked by a calendar icon, a document icon and a people icon',
  'banking-multimodal-rag-case-study': 'a bank building with scanned forms, photos of cheques and documents flowing into a large magnifying glass that finds the right page',
  'ai-risk-for-audit-committees': 'an auditor\'s magnifying glass examining a glowing computer chip on a desk, a checklist and a small red warning flag beside it',
  'ai-strategy-for-cio': 'a technology leader looking at a roadmap path that links servers, a cloud and a small robot head as milestones',
  'ai-strategy-for-cdo': 'streams of data cubes flowing from databases into a large compass on a strategy map, with charts around it',
  'ai-vendor-management': 'a handshake over a contract with a checklist, and a row of supplier boxes each with a small robot icon being weighed on a scale',
  'ai-decision-making': 'a person standing at a crossroads signpost holding a compass, while a friendly robot beside them holds a map and offers advice',
  'open-source-llms-for-enterprise': 'an open box with glowing building blocks and a padlock, next to company server racks in a tidy data centre',
  'azure-ai-foundry-essentials': 'a workshop bench floating among soft clouds where a glowing AI model is being assembled with tools and small sparks',
  'mlops-for-llms': 'an infinity-shaped conveyor loop carrying a glowing AI model through stages with a wrench, a test tube, a rocket and a monitoring gauge',
  'rag-architectures-foundations': 'a friendly robot librarian pulling the right book from a tall library shelf and handing it to a chat bubble',
  'ai-in-education': 'a bright classroom with a teacher and students, a chalkboard with simple drawings, books and a tablet with a lightbulb',
  'ai-literacy-non-technical-teams': 'four colleagues around a table while a friendly robot in the middle explains with a simple picture board',
  'prompting-mastery': 'a large chat input box with a pencil writing into it and a neat structured reply appearing in a chat bubble, a target in the corner',
  'working-with-copilots': 'a professional at a laptop in an airplane-cockpit style seat, with a small friendly robot co-pilot in the seat beside them',
  'evaluating-ai-output': 'a magnifying glass over a document handed over by a robot, with green check marks and one red cross highlighting a mistake',
  'recruiting-ai-in-practice': 'a recruiter reviewing candidate profile cards, a handshake, a job offer envelope and a small balanced scale for fairness',
  'revops-automation-with-ai': 'a pipeline of connected pipes carrying coins into a rising chart, with gears turning to automate the flow',
  'building-trusted-support-bots': 'a friendly support chatbot robot wearing a headset, a shield with a check mark, and a hand-off arrow to a human agent',
  'ai-for-legal-compliance': 'a judge\'s gavel, scales of justice and a contract under a magnifying glass on a desk',
  'ai-augmented-month-end-close': 'a desk calendar showing the last day of the month with a check mark, stacks of ledgers, a balanced sheet and a calculator',
  'demand-forecasting-in-practice': 'store shelves with products and boxes, a forecast line chart rising above them and a calendar beside it',
  'ai-readiness-assessment-deep-dive': 'a checklist clipboard and a gauge showing a readiness level, with a small rocket waiting on a launch pad',
  'enterprise-data-foundations-for-ai': 'a strong foundation made of neat data cubes with a small house and a friendly robot built on top',
  'ai-program-management-pmo': 'a project board with columns of cards and milestone flags on a timeline, with team members moving the cards',
  'ai-talent-strategy': 'a group of people climbing a staircase of skill blocks, with puzzle pieces fitting together beside them',
  'ai-for-energy-utilities': 'wind turbines, solar panels and power lines on a green hill, linked by a glowing smart-grid network',
  'ai-for-retail-ecommerce': 'a shop front, a shopping cart, a phone showing an online store and parcel boxes ready for delivery',
  'ai-for-cybersecurity-soc': 'a security operations desk with monitors, a large shield with a padlock and a small robot helper flagging an alert',
  'ai-for-public-sector': 'a government building with columns and a plain flag, citizens walking up the steps, with helpful service icons floating nearby',
  'ai-in-pharma-life-sciences': 'a laboratory bench with test tubes, a microscope, a DNA helix and medicine capsules',
  'ai-product-management': 'a product manager at a whiteboard with sticky notes, simple wireframes and a roadmap, a small robot helping',
}

const argv = process.argv.slice(2)
const force = argv.includes('--force')
const only = argv.filter(a => !a.startsWith('--'))

if (!KEY) {
  console.error('Set GENNOOR_IMAGE_KEY (see the usage note at the top of this file).')
  process.exit(1)
}
for (const id of only) {
  if (!SCENES[id]) {
    console.error(`No scene for "${id}". Add one to SCENES first.`)
    process.exit(1)
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function generate(prompt) {
  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/images/generations?api-version=2025-04-01-preview`
  for (let attempt = 1; attempt <= 5; attempt++) {
    let res
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'api-key': KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ prompt, size: '1536x864', quality: 'high', n: 1, output_format: 'png' }),
      })
    } catch (err) {
      console.log(`  ${err.message}, retrying in 60s`)
      await sleep(60_000)
      continue
    }
    if (res.ok) {
      const body = await res.json()
      return Buffer.from(body.data[0].b64_json, 'base64')
    }
    const text = await res.text()
    // The deployment allows one request a minute; wait it out and retry.
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get('retry-after')) || 60
      console.log(`  ${res.status}, retrying in ${wait}s`)
      await sleep(wait * 1000)
      continue
    }
    throw new Error(`${res.status}: ${text.slice(0, 300)}`)
  }
  throw new Error('gave up after 5 attempts')
}

const ids = only.length ? only : Object.keys(SCENES)
let made = 0
for (const id of ids) {
  const out = path.join(OUT_DIR, id, 'thumbnail.webp')
  if (!force && fs.existsSync(out)) continue
  process.stdout.write(`${id} ... `)
  const started = Date.now()
  try {
    const png = await generate(`${STYLE} Scene: ${SCENES[id]}.`)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    await sharp(png).resize(1280, 720, { fit: 'cover' }).webp({ quality: 82 }).toFile(out)
    made++
    console.log(`done in ${Math.round((Date.now() - started) / 1000)}s`)
  } catch (err) {
    console.log(`failed: ${err.message}`)
  }
}
console.log(`${made} thumbnail(s) written to public/courses/<id>/thumbnail.webp`)
