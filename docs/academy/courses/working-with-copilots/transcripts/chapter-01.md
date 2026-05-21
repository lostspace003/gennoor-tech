# Chapter 1 — The Copilot mental model

**Course:** Working with Copilots · **Chapter:** 01 · **Target duration:** ~7 min spoken

## Trainer persona
Emma. Opening chapter. Calm, practitioner, no hype. Sets up the three-layer model that the whole course leans on.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Welcome to Working with Copilots. If you're here, you already have the licence — Microsoft 365 Copilot, GitHub Copilot, ChatGPT Enterprise, sometimes all three. This course isn't about whether to buy them. It's about getting them to actually save you time without leaking what they shouldn't and without you babysitting every output.

Chapter one is the mental model the rest of the course leans on. *Copilot is not one thing.* It's three different things wearing similar branding, and the trick to using them well is knowing which one you're talking to.

> [S2 ▸ slide change · t ≈ 0:35]

> [S2 ▸ reveal 1 · three layers]

The three layers. *Layer one* — chat-only assistants. The free tier ChatGPT. Claude on the web. Gemini on the web. They have no idea who you are. They can't see your files. They guess at everything based only on what you type into the box.

*Layer two* — grounded assistants. Microsoft 365 Copilot is the canonical one. It sits inside your tenant. It reads your emails, your SharePoint files, your Teams messages, your calendar — but only the ones *you* already have permission to see. It grounds its answer in your actual stuff before it generates a response.

*Layer three* — agentic Copilots. These don't just answer — they take actions. Researcher and Analyst inside M365 Copilot. GitHub Copilot Spaces and Agent Mode. ChatGPT's deep research and Operator. They plan a multi-step task, execute it, check their work, iterate. *That's the new shape of the surface.*

> [S3 ▸ slide change · t ≈ 1:35]

> [S3 ▸ reveal 1 · layer 1 chat]

Layer one. Chat-only. The simplest mental model — you type, the model guesses, you read.

What it's good for — drafting things from a blank page. Brainstorming. Explaining a concept you don't understand. Translating tone. *None of which requires it knowing anything about your specific situation.*

What it's bad for — anything that needs to know what's in your calendar, what your team agreed last week, what a specific contract said, who reports to whom. *It doesn't know. It will guess.* And it will guess confidently, which is the dangerous bit.

> [S4 ▸ slide change · t ≈ 2:25]

> [S4 ▸ reveal 1 · layer 2 grounded]

Layer two. Grounded. This is what Microsoft 365 Copilot actually is. Microsoft's own architecture documentation, last updated May 2026, describes a four-step flow. You prompt. It queries the Microsoft Graph in *your tenant* — your emails, files, Teams, calendar. It bundles what it found together with your prompt. It sends that bundled prompt to the language model. You get back an answer grounded in your actual data.

> [S4 ▸ reveal 2 · the boundary]

The key constraint, in Microsoft's words — *Copilot only accesses data that an individual user is authorized to access.* Conditional Access, MFA, sensitivity labels, the whole permissions stack — Copilot honours all of it. *That's the boundary.* It's also where the oversharing problem hides, which is chapter six.

> [S5 ▸ slide change · t ≈ 3:25]

> [S5 ▸ reveal 1 · layer 3 agentic]

Layer three. Agentic. This is the layer that became real in 2025 and matured through 2026.

Inside M365 Copilot — Researcher and Analyst. Researcher is built on OpenAI's deep research model plus Microsoft 365's orchestration. Analyst is built on OpenAI's o3 line of reasoning models. *Both think before they answer.* Researcher synthesises across emails, files, and the web in a single multi-step task that can take five to thirty minutes.

> [S5 ▸ reveal 2 · github + openai agentic]

Inside GitHub Copilot — Spaces and Agent Mode. Spaces is curated context — a bundle of files, PRs, issues, docs the model uses as ground truth. Agent Mode plans and executes multi-step coding tasks across files. *It's not autocomplete anymore.*

Inside ChatGPT Enterprise — deep research, Operator-style agents, Canvas. Same shape. Multi-step, iterative, autonomous.

*The thing that unites all three* — the user gives a task, the Copilot decides how to break it down, runs the steps, hands back results. The interaction model changed. You're not prompting and reading. You're *briefing* and *reviewing*.

> [S6 ▸ slide change · t ≈ 4:35]

> [S6 ▸ reveal 1 · the demo]

The interactive. Same prompt — *"summarise where we are on the Acme contract and what I should send the client today."* Three engines. Three completely different answers.

Layer one — chat-only — has to ask you what the Acme contract is. It can guess at template structures. It cannot tell you where you are.

Layer two — M365 Copilot — pulls the contract from SharePoint, the email thread from Outlook, the latest Teams discussion. Writes you a draft email referencing the actual deal terms. *Grounded.*

Layer three — agentic, say Researcher — does all of that *and* looks up the counterparty's latest news, identifies a regulatory filing change that affects clause four, surfaces it in the brief. *Multi-step.*

> [S6 ▸ reveal 2 · the test]

*That's the test.* When you're about to prompt, ask yourself which layer you actually need. If the answer is "the model just needs to write the thing" — layer one is fine. If you need it to know your context — layer two. If it's a task that requires research, multi-step work, or pulling threads together — layer three.

> [S7 ▸ slide change · t ≈ 5:40]

> [S7 ▸ reveal 1 · the implication]

The implication for the rest of this course. Every chapter assumes you'll choose the right layer for the task. *Chapter two is when to use Copilot at all.* Chapter three is the four core Office workflows. Chapter four is GitHub Copilot for non-developers. Chapter five is the ChatGPT Enterprise edge cases your M365 Copilot doesn't cover. Chapter six is the security and data-exposure boundaries you should know cold. Chapter seven is your one-page operating manual.

> [S7 ▸ reveal 2 · monday move]

The Monday move from this chapter. Look at the three Copilot tools you have access to. Write down — for each one — *what layer is it?* If you don't know whether your tool is grounded or agentic, you don't yet know what to ask of it. Five minutes of clarity now saves an hour of frustration this week.

See you in chapter two.

> [end]
