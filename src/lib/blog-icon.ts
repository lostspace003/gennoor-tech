import {
  Archive, BadgeCheck, Banknote, BarChart3, Bell, BookOpen, Bot, Brain, Briefcase, Building2, Calculator, CalendarDays, CheckCircle2,
  ClipboardList, Cloud, Code2, Coins, Compass, Cpu, CreditCard, Database, Dna, Eye, Factory, FileText, Files, Fingerprint, Flag, Flame,
  FlaskConical, FolderOpen, Gauge, GitBranch, Globe, GraduationCap, Handshake, HeartPulse, Home, Hotel, Image, KeyRound, Landmark, Languages,
  Laptop, Layers, Leaf, Lightbulb, Link2, Lock, LockKeyhole, Mail, Map, MessageSquare, Mic, Microscope, Network, Package, PenLine, Phone,
  Pill, Plane, Plug, Presentation, Puzzle, RadioTower, Receipt, RefreshCw, Rocket, Satellite, Scale, Search, Server, Settings, ShieldAlert,
  ShieldCheck, ShoppingCart, Siren, SlidersHorizontal, Smile, Sparkles, Sprout, Stethoscope, Tag, Target, Telescope, Timer, TrendingUp,
  TriangleAlert, Trophy, Truck, Users, Video, Wheat, Workflow, Wrench, Zap, type LucideIcon,
} from 'lucide-react'
import type { Tone } from '@/components/stage/Ico'

/**
 * The picture of a blog post: an icon tile in a colour, and two smaller tiles beside it.
 *
 * A post already carries an emoji (`icon`), chosen by whoever wrote it for what the post is
 * about. The site does not show the emoji: it draws the matching icon as one of its own glass
 * tiles, so every post has a picture in the look of the site. Nothing is stored for this and
 * nothing has to be made by hand: a new post gets its picture the moment it is published.
 *
 *  - the tile's ICON comes from the emoji; when the emoji is unknown, from the words of the
 *    title, the category and the tags;
 *  - its COLOUR says what family the post belongs to (see `toneOf`), and gold is kept for the
 *    one post featured at the top of the blog;
 *  - the two SMALLER tiles come from the tags (then the category and the title), in other colours.
 *
 * The writing agent is told to choose its emoji from `BLOG_EMOJI` (src/lib/blog-studio.ts
 * passes the list), so its choice is always one the site can draw.
 */

const EMOJI: Record<string, LucideIcon> = {
  '🛡️': ShieldCheck, '🧭': Compass, '🧩': Puzzle, '🧠': Brain, '🏗️': Layers, '🤖': Bot, '🔒': Lock, '⚡': Zap, '⚖️': Scale, '🎯': Target,
  '🏦': Landmark, '🎓': GraduationCap, '📦': Package, '🧾': Receipt, '🛠️': Wrench, '⚙️': Settings, '💼': Briefcase, '🔗': Link2, '🗄️': Database,
  '📊': BarChart3, '🔍': Search, '🏆': Trophy, '💻': Laptop, '🔬': Microscope, '🤗': Smile, '🕸️': Network, '☁️': Cloud, '🔄': RefreshCw,
  '🏥': HeartPulse, '🏭': Factory, '🛒': ShoppingCart, '🏛️': Landmark, '📋': ClipboardList, '🤝': Handshake, '🔮': Sparkles, '🧬': Dna,
  '🗃️': Archive, '✍️': PenLine, '💰': Coins, '💬': MessageSquare, '📄': FileText, '📑': Files, '🚀': Rocket, '📚': BookOpen, '👥': Users,
  '💡': Lightbulb, '🚛': Truck, '🔧': Wrench, '👁️': Eye, '🩺': Stethoscope, '🏢': Building2, '📡': RadioTower, '💊': Pill, '🏨': Hotel,
  '🌾': Wheat, '🧪': FlaskConical,
  // not used yet, but likely: so a new post is never left without a picture
  '📈': TrendingUp, '🔑': KeyRound, '🗺️': Map, '⏱️': Timer, '🔔': Bell, '🎙️': Mic, '🎥': Video, '🖼️': Image, '🧮': Calculator, '🔌': Plug,
  '🌐': Globe, '🪪': BadgeCheck, '✅': CheckCircle2, '⚠️': TriangleAlert, '🚨': Siren, '🔥': Flame, '🌱': Sprout, '🏁': Flag, '🧑‍💻': Code2,
  '🔐': LockKeyhole, '🧵': Workflow, '🔀': GitBranch, '✉️': Mail, '📞': Phone, '🛰️': Satellite, '🧯': ShieldAlert, '💳': CreditCard,
  '🏷️': Tag, '📅': CalendarDays, '🧑‍🏫': Presentation, '🎛️': SlidersHorizontal, '🔭': Telescope, '🗂️': FolderOpen, '🧰': Wrench,
  '💵': Banknote, '🍃': Leaf, '✈️': Plane, '🏠': Home, '🖥️': Server, '🫆': Fingerprint, '🈯': Languages, '🧱': Layers, '📝': PenLine,
}

/** The emoji a writer may choose from: every one has a tile. */
export const BLOG_EMOJI = Object.keys(EMOJI)

/** The writer's emoji if the site can draw it, otherwise nothing: the picture then comes from the post's words. */
export function knownEmoji(icon: string | undefined): string {
  const e = (icon || '').trim()
  for (const form of [e, e.replace(/️/g, ''), `${e}️`]) if (form && EMOJI[form]) return form
  return ''
}

/**
 * The line that asks the writing agent for an emoji the site can draw. It travels with each
 * request, so it works without the agent service being put out again. The service accepts a
 * brief of 2,000 characters at most; the line is left off rather than risk a refused request.
 */
export function briefWithIconRule(brief: string): string {
  const rule = `Icon: for "icon" choose the ONE emoji from this list that best fits the subject of the article, and no other emoji: ${BLOG_EMOJI.join(' ')}`
  const joined = brief.trim() ? `${brief.trim()}
${rule}` : rule
  return joined.length <= 1900 ? joined : brief
}

/** Words that say what a post, or one of its tags, is about. The first that fits wins, so the order matters. */
const WORDS: Array<[RegExp, LucideIcon]> = [
  [/\bmcp\b|connector|integration|plugin/, Plug],
  [/security|guardrail|threat|attack|zero.trust|red.team/, ShieldCheck],
  [/privacy|confidential|pii\b/, LockKeyhole],
  [/governance|compliance|regulat|legal|audit|policy|responsible/, Scale],
  [/agent/, Bot],
  [/orchestrat|workflow|automation|pipeline/, Workflow],
  [/rag\b|retrieval|search|knowledge/, Search],
  [/evaluat|benchmark|testing|quality/, Gauge],
  [/observab|monitor|telemetry|llm ?ops|mlops|production/, RefreshCw],
  [/cost|finops|roi\b|pricing|procurement|budget/, Coins],
  [/strategy|leader|c-suite|board|executive|transformation/, Compass],
  [/architecture|platform|infrastructure/, Layers],
  [/model|llm\b|gpt|reasoning/, Brain],
  [/chip|gpu|compute|hardware/, Cpu],
  [/code|developer|engineering|sdk\b|api\b/, Code2],
  [/data|lakehouse|vector|analytics/, Database],
  [/cloud|azure|aws\b|google cloud/, Cloud],
  [/copilot|assistant|chat/, MessageSquare],
  [/voice|speech|audio/, Mic],
  [/vision|image|video|multimodal/, Eye],
  [/health|clinical|hospital|patient/, HeartPulse],
  [/pharma|drug/, Pill],
  [/bank|bfsi|financ|insur/, Landmark],
  [/retail|commerce|shopping/, ShoppingCart],
  [/manufactur|factory|industrial/, Factory],
  [/logistic|supply chain|transport/, Truck],
  [/education|learning|training|skills/, GraduationCap],
  [/government|public sector/, Building2],
  [/telecom|network/, RadioTower],
  [/energy|sustainab/, Zap],
  [/agricultur|farm/, Wheat],
  [/hospitality|hotel|travel/, Hotel],
  [/real estate|property/, Home],
  [/research|science/, Microscope],
  [/team|people|hr\b|talent/, Users],
  [/launch|release|new\b/, Rocket],
  // narrower things a tag may name
  [/fraud|anomal/, ShieldAlert],
  [/zero.day|vulnerab/, TriangleAlert],
  [/soc\b|incident|detection/, Siren],
  [/claim|contract|document|ocr\b|paper/, FileText],
  [/forecast|predict|trend|future/, TrendingUp],
  [/personali[sz]|recommend|customer|churn|retention|citizen/, Users],
  [/workforce|upskill|jobs?\b|change management/, Users],
  [/open.source|fine.tun/, GitBranch],
  [/\bedge\b|on.device|\bslm\b|small language/, Cpu],
  [/imaging|medical|diagnos/, Stethoscope],
  [/\bgrid\b|power plant|utilit/, Zap],
  [/renewab|carbon|climate|solar/, Leaf],
  [/maintenance|repair/, Wrench],
  [/bias|fairness|ethic|\brisk/, Scale],
  [/prompt/, PenLine],
  [/\bux\b|user experience|design/, Smile],
  [/resilien|reliab/, ShieldCheck],
  [/deploy|\bpoc\b|rollout/, Rocket],
  [/\bloan|fintech|lending|payment/, Banknote],
  [/campus|tutor/, BookOpen],
  [/assess|grading/, ClipboardList],
  [/hugging face|llama|mistral|qwen|deepseek|\bphi\b|gemma/, Brain],
  [/mlflow|experiment/, FlaskConical],
  [/graph/, Network],
  [/digital twin|industry 4/, Layers],
  [/efficien|optimi[sz]/, Gauge],
  [/\.net\b|semantic kernel|langgraph|crewai|autogen|framework/, Code2],
]
/** Wider words, used only when a post has named too little for its two smaller tiles. */
const GENERAL: Array<[RegExp, LucideIcon]> = [
  [/enterprise|business|compan/, Building2],
  [/guide|playbook|practice|lesson|checklist|principle/, BookOpen],
  [/idea|insight|why\b|how\b/, Lightbulb],
  [/\bai\b/, Sparkles],
]
/** Every icon the text names, in the order of the list. */
const allFrom = (list: Array<[RegExp, LucideIcon]>, text: string): LucideIcon[] => {
  const t = text.toLowerCase()
  const found: LucideIcon[] = []
  for (const [re, icon] of list) if (re.test(t) && !found.includes(icon)) found.push(icon)
  return found
}
const fromWords = (text: string): LucideIcon | null => allFrom(WORDS, text)[0] || null

export interface BlogIconSource { title: string; category: string; tags: string[]; icon?: string; featured?: 'hero' | 'spotlight' | null }

/**
 * The colour of a post's tile: the family it belongs to.
 *   rose    a judgement to make: security, privacy, governance, law, risk
 *   green   something that runs by itself: agents, automation
 *   violet  something to build: architecture, engineering, MLOps, models, tools
 *   blue    something to read and decide: strategy, Microsoft and Azure
 *   cyan    a line of work: banking, health, retail and the other industries
 *   claude  anything Claude
 *   gold    the one post featured at the top of the blog
 */
export function toneOf(post: BlogIconSource): Tone {
  if (post.featured === 'hero') return 'gold'
  if (/\bclaude\b|anthropic/i.test(post.title)) return 'claude'
  const c = post.category.toLowerCase()
  if (/security|privacy|governance|legal|risk|compliance/.test(c)) return 'rose'
  if (/agent|automation/.test(c)) return 'green'
  if (/architecture|engineering|mlops|tools|models|data/.test(c)) return 'violet'
  if (/strategy|microsoft|azure|leadership/.test(c)) return 'blue'
  return 'cyan'
}

/** What `--art` is set to for each tone: the middle colour of its tile. */
export const TONE_COLOR: Record<Tone, string> = {
  blue: '#2a7bff', violet: '#7a66ff', green: '#22b47e', gold: '#ffab2e', claude: '#e0764a', rose: '#f0527a', cyan: '#25b8c4', ink: '#5a6c94',
}
const OTHERS: Tone[] = ['violet', 'cyan', 'green', 'rose', 'blue']

export interface BlogIcon {
  icon: LucideIcon
  tone: Tone
  /** Two smaller tiles, from the tags (then the category and the title) */
  beside: Array<{ icon: LucideIcon; tone: Tone }>
}

export function blogIcon(post: BlogIconSource): BlogIcon {
  const emoji = (post.icon || '').trim()
  const icon = EMOJI[emoji] || EMOJI[emoji.replace(/️/g, '')] || EMOJI[`${emoji}️`]
    || fromWords(post.title) || fromWords(post.category) || fromWords(post.tags.join(' ')) || Sparkles
  const tone = toneOf(post)
  const tones = OTHERS.filter((t) => t !== tone)
  const beside: BlogIcon['beside'] = []
  const add = (other: LucideIcon) => {
    if (beside.length === 2 || other === icon || beside.some((b) => b.icon === other)) return
    beside.push({ icon: other, tone: tones[beside.length % tones.length] })
  }
  // what the post names, tag by tag, then its category and its title; the wider words only if two are still not found
  const said = [...post.tags, post.category, post.title]
  for (const text of said) for (const other of allFrom(WORDS, text)) add(other)
  for (const text of said) for (const other of allFrom(GENERAL, text)) add(other)
  return { icon, tone, beside }
}
