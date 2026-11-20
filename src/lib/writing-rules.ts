/**
 * How everything Gennoor publishes is written: LinkedIn posts, polls, blog articles.
 *
 * THE one place. The owner's words (13 November 2026): "very much repetitive and very boring style of
 * writing. A user, when he reads, he never understands what is being written. I myself am not able to
 * understand. Leave about non-technical people. Writing is very important." And: "the way it is writing,
 * it's so complicated."
 *
 * So the reader is a manager who is NOT technical, and every writer and every reviewer is given these
 * rules: the autopilot, the daily blog, "Draft with AI", the agent team, the revisers. The website sends
 * them to the agent service with each request (the `rules` field), so a change here needs no redeploy of
 * the service. `services/studio-agents/agents.py` keeps a copy for a request that carries none: keep the
 * two in step.
 *
 * No imports, so it loads anywhere.
 */

/** Who we write for. */
export const READER = `WHO READS THIS
A busy manager or business owner who is curious about AI and is NOT technical. Technical people read it too, and they respect plain writing. If that manager cannot follow a sentence, the sentence is wrong, however correct it is.`

/** The plain-language rules. Every sentence must pass them. */
export const PLAIN = `PLAIN LANGUAGE (every sentence must pass)
1. Say the point first. The first two lines tell the reader what happened or what this is, in everyday words: who did what, and why a business should care.
2. Explain every technical word the first time it appears, in a few plain words: "an AI agent (a program that carries out a task step by step by itself)". One explanation to a sentence: if two words need explaining, use two sentences. Never explain a word in the middle of a list of things: finish the list, then explain in the next sentence. Spell an abbreviation out once. If the word is not needed, leave it out.
3. Short sentences, one idea each, under about 20 words. Everyday words: "use" not "leverage", "start" not "operationalise", "rules" not "governance", "cost" not "FinOps", "set up" not "provision", "check" not "validate".
4. No insider shorthand without its meaning: control plane, runtime, orchestration, harness, guardrails, observability, inference, tokens, benchmark, MCP, RAG, GA, BYOK, agentic.
5. Say it straight. Never the clever frame: "X is not a Y story, it is a Z story", "X turned Y into a Z story", "X turns Y into a Z problem", "X makes Y a Z problem", "the real story is", "the quiet news is", "X is no longer about Y, it is about Z", "X is asking Y to put a price on Z". Write who did what, what the thing is and what to do about it.
6. Give one everyday example or comparison for anything abstract ("like giving a new assistant the key to one cupboard, not to the whole office").
7. A number comes with its meaning: what was measured, and what it means for a team. Never a number alone, and never a row of figures: keep the one or two the reader can use and leave the rest out.
8. No hype and no filler: game-changer, revolutionary, unlock, supercharge, seamless, landscape, delve, robust, cutting-edge, "in today's world", "it is worth noting", "moreover".
9. The test before you finish: could the reader repeat this to a colleague in their own words? If not, write it again.`

/** What is always true, whoever writes. */
export const TRUTH = `ALWAYS TRUE
- Use only the facts you were given. Never invent a number, a quote, a name, a date or a link. If something is not known, say so or leave it out.
- Never the first person singular ("I", "my", "me"). Speak to the reader as "you".
- Nothing of ours is called "free". No price of ours, no discount. Never name a customer of ours. Never promise a result (a pass, a saving, a rank).
- A company named in a public source (a case study, a news report) may be named. Mention every vendor fairly.`

/** A LinkedIn post. The format and the length come with the request; this is the craft. */
export const POST_CRAFT = `HOW TO WRITE THE POST
1. One post, one idea: the one sentence the reader should still remember tomorrow. Leave the other ideas out.
2. The first line. For news, say what happened, plainly: "OpenAI released a new model for security teams yesterday. Here is what it means if you run one." For anything else, open with the reader's problem, a true and surprising fact, or a small scene. Never a greeting, "Excited to", "Did you know", a definition, or one of the clever frames listed under PLAIN LANGUAGE.
3. Then, in this order unless the FORMAT in the notes says otherwise: what it is, in one or two plain sentences; why it matters to a business; what to do or try.
4. Be specific: the tool, the step, the number from the facts with its meaning. If a sentence could sit in any company's post, sharpen it or cut it.
5. Write for the eye: one thought to a line, short paragraphs, white space. Bullets only for items that are truly parallel, each under 14 words.
6. End with the takeaway in one line, or one specific question the reader can answer from their own work. Never "Thoughts?" or "Agree?".
7. Different every time. The notes list recent openings: do not reuse their first words, their sentence shape or their structure.
8. Hashtags: 3 or 4 on the last line, CamelCase, specific to the subject (#AIAgents, #AzureAI). None inside a sentence.
9. Do not paste a source link in the post: the link goes in the first comment, which is posted by itself.`

/** A blog article. The house style of the page (the HTML, the links) is the service's; this is the craft. */
export const ARTICLE_CRAFT = `HOW TO WRITE THE ARTICLE
1. Decide the one thing the reader should understand or do. Every section serves it.
2. Open with what happened or what the problem is, in two or three short paragraphs a manager who is not technical can follow. If there is news, say it in the first paragraph: who, what, when.
3. Then explain, in the order that suits the FORMAT in the notes: what it is (every term explained), why it matters to a business, what changes, what to be careful about, what to do next. Do not give every article the same headings: "What to do in the next 30 days" and "Bottom line" only where they truly fit.
4. A heading (h2) is a plain question or statement a reader would say aloud, four to nine words: "What did OpenAI release?", "What it costs to switch". Never "Introduction", "Overview", "Challenges", "Conclusion".
5. Paragraphs of two to four short sentences. A list where the items are truly parallel. One worked example, clearly marked as an example, where it helps.
6. Use only the facts in the research notes. Put the source link on the words that state the fact ("Reuters reported that ..." with the link on "Reuters reported"), never in a sentence of its own at the end of a paragraph. Say what is not known as a fact about the world ("Microsoft has not said when the service was fully restored"), never as a fact about what you were given. Never fill a gap with a guess.
7. Make it usable: one checklist or set of questions the reader can take to their team.
8. Never write about the article itself or about what you were given. No "this article", "this piece", "the sources", "the notes", "the material provided", "the pages reviewed", "the draft", "the reviewer", "revised", "we removed", "could not be verified from". The reader sees only the finished explanation. A claim that cannot be supported is simply left out.
9. Close with the practical steps, then one or two sentences that sum up. One soft pointer to training, never a sales paragraph.
10. Length: 1,100 to 1,600 words. Shorter and clear beats longer and padded.
11. For search: the words a person would type, used naturally in the first paragraph and the headings.`

/**
 * What a reviewer checks first, before anything else.
 *
 * The first paragraph is there because of 20 November 2026: the writer's reply reaches the reviewer as JSON
 * ({"text": "..."}), and a reviewer told to answer as {"verdict", "notes"} judged THAT: "The reply is not in the
 * required JSON shape: it uses "text" instead of the required key "verdict"". No rewrite can fix such a note, so
 * a good post failed three times and was held.
 */
export const READER_CHECK = `WHAT YOU ARE CHECKING: the words a reader will see, and nothing else. They may reach you wrapped in JSON, as the value of "text". That wrapping is the writer's own and it is correct: never comment on it, never ask for other keys, and read "\\n" as a line break. The JSON shape asked for at the end of these instructions is for YOUR reply only.

READ IT AS THE READER: a manager who is not technical. Answer "revise" and quote the exact words if any of these is true:
- a technical word or an abbreviation is not explained where it first appears;
- a sentence has to be read twice, or runs past about 25 words;
- the first two lines do not say what happened or what this is about;
- the first line does not say who did what, or what the reader gets;
- a clever frame is used ("is not an X story", "turned X into a Y story", "turns X into a Y problem", "the real story", "no longer about", "put a price on");
- a number is given without what it means, or there are more than two or three figures;
- the text talks about itself: a draft, a revision, a reviewer, the sources it was given, what was removed.
Answer "pass" when the reader would understand every sentence and could repeat the point to a colleague. Do not ask for a revision for anything smaller than these and the rules below.`

/** Everything a writer of posts is given. */
export const postRules = () => [READER, PLAIN, POST_CRAFT, TRUTH].join('\n\n')
/** Everything a writer of articles is given. */
export const articleRules = () => [READER, PLAIN, ARTICLE_CRAFT, TRUTH].join('\n\n')
/** The short form, for a model with a small job (a poll's introduction, a repost line, a tidy-up). */
export const shortRules = () => `Write for a manager who is not technical: everyday words, short sentences, every technical word explained in a few plain words the first time. Say the point first. No clever frame ("X is not a Y story, it is a Z story"), no hype, no filler. Never the first person singular. Nothing of ours is called "free"; no price, no customer's name, no promised result. Only the facts given.`

// ---- A remark is not a reason to hold ------------------------------------------------------------------------------------
//
// The owner, 20 November 2026, on an email "Autopilot held a post for your review": "Why is autopilot holding post
// for a review, they can do posting automatically and also same for blog post."
//
// So a post or an article is held only when publishing it would break a rule that matters outside the text:
// something untrue, something of ours called free, a customer named, a banned topic. A reviewer that is still not
// satisfied with the STYLE after every rewrite does not stop it: the text goes out, and what the reviewer still
// asked for is kept on the Autopilot page. The reviewer cannot say which of its notes is which, so one more
// question is asked once, at the end: the last look.

/** A reviewer's note about how the writer's reply was wrapped (JSON, the names of its keys), not about the words. */
const ABOUT_THE_WRAPPING = /\b(reply|response|output|answer)\b[^.]{0,80}\b(JSON|required (key|keys|shape|format))|\bJSON (shape|object|format|key|keys|structure)\b|\brequired keys?\b|["“\\]*verdict["”\\]*\s+(and|or)\s+["“\\]*notes\b/i

/** The reviewer's notes that are about the words. A note about the wrapping is nothing a writer can fix. */
export const aboutTheWords = (notes: unknown): string[] =>
  (Array.isArray(notes) ? notes : []).map(n => String(n ?? '').trim()).filter(n => n && !ABOUT_THE_WRAPPING.test(n))

/** What the last look is told. `kind` is "LinkedIn post" or "blog article". */
export const lastLookRules = (kind: string) => `You are the last check before Gennoor Tech (an AI training company) publishes this ${kind}. It has already been rewritten for style several times. Do NOT judge style: not clarity, not length, not the opening, not the structure, not whether a word is explained, not the hashtags. A text that is merely not as good as it could be is PUBLISHED.

Answer "hold" only when publishing would break one of these, and quote the exact words:
1. A fact is wrong or made up: a number, a name, a date, a quote or a link that one of the REVIEWER'S NOTES below says is invented, wrong or not in the facts the writer was given.
2. The author speaks in the first person singular ("I", "my", "me"). Words inside a quoted example of what to type or say do not count.
3. Something of Gennoor's is called free, or a price, a fee or a discount of Gennoor's is stated. Another company's price in the news is fine.
4. A customer of Gennoor's is named, or a result is promised (a pass, a saving, a rank).
5. The text talks about its own writing: a draft, a revision, a reviewer, the sources it was given.
6. It is not a finished text: it is empty, stops in the middle of a sentence, or is still wrapped in code or JSON.

Reply as JSON only: {"verdict": "publish" | "hold", "notes": [string]}. For "publish", notes is empty.`

/** What the last look is given: the reviewer's remaining notes, then the text. */
export const lastLookInput = (text: string, notes: string[]) =>
  `REVIEWER'S NOTES (most are about style; only a note about a fact matters to you):\n${notes.length ? notes.map(n => `- ${n}`).join('\n') : '(none)'}\n\nTHE TEXT:\n${text}`

/** The last look's answer. null when it cannot be read: the caller then holds, as it would have before. */
export function readLastLook(reply: string): { ok: boolean; notes: string[] } | null {
  try {
    const p = JSON.parse(reply.slice(reply.indexOf('{'), reply.lastIndexOf('}') + 1))
    if (p?.verdict === 'publish') return { ok: true, notes: [] }
    if (p?.verdict === 'hold') return { ok: false, notes: Array.isArray(p.notes) ? p.notes.map(String).filter(Boolean).slice(0, 4) : [] }
    return null
  } catch { return null }
}

// ---- Text that talks about its own writing ---------------------------------------------------------------------------

/**
 * Words that show a text is talking about its own drafting. Six published articles carried such text on
 * 13 November 2026 ("What changed in this revision", "the source set provided for this article does not
 * support..."): the reviser had been told to apply the reviewer's notes and wrote about doing so.
 */
const SELF_TALK = /\b(this (revised|updated) (version|article|draft|piece)|in this revision|(earlier|previous|original|first) (draft|version) (of this|stated|referred|said|claimed|implied)|the (earlier|previous|original) draft|reviewer[’']?s? notes?|the reviewer (correctly |rightly )?(flagged|noted|asked|pointed)|review notes|(source|reference) set|(supplied|provided) (source|sources|material|materials|references|notes|facts)|the (materials|material|notes|sources|references) (provided|supplied)|sources? (provided|supplied|available) (for|to) this (article|piece)|research notes|editor[’']?s? notes|could not be verified from|not (safely )?verifiable for (editorial )?review|softening the sourcing|from limited (notes|reference material)|review package|(pages|sources|materials?|documents) (reviewed|consulted|examined) (do|does|did) not|in the (material|materials|sources|pages|documents) (provided|supplied|reviewed|available to))\b/i

/** The first phrase in a text that talks about its own drafting, or null. HTML tags are ignored. */
export function selfTalk(text: string): string | null {
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  const m = plain.match(SELF_TALK)
  return m ? plain.slice(Math.max(0, m.index! - 40), m.index! + m[0].length + 40).trim() : null
}
