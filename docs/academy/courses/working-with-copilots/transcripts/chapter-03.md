# Chapter 3 — Office Copilot workflows

**Course:** Working with Copilots · **Chapter:** 03 · **Target duration:** ~7 min spoken

## Trainer persona
Emma. Tactical. Four concrete workflows, four apps, one shared trap.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. Word, Excel, Outlook, Teams. One workflow per app — the one workflow your team will actually use every day if they use anything. Plus the recurring trap that catches everyone the first time. *Copilot picks the wrong file.* We'll get to it.

> [S2 ▸ slide change · t ≈ 0:25]

> [S2 ▸ reveal 1 · word]

Word. The workflow is *"draft this document from a brief plus these three sources."* You open Word. You start Copilot. You say — *draft a project status memo. The brief is the goal section of last week's planning doc. Source one is the Acme proposal. Source two is the Q3 budget tracker. Source three is the Tuesday Teams discussion.* Copilot pulls all four, drafts a structured memo with sections it inferred from the brief, citations to each source.

*What you do* — read the draft. Fix the parts that are wrong or where the tone is off. Send. *What used to take an hour takes fifteen minutes.* That's a Word workflow you'll do every week.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · excel]

Excel. The workflow is Python in Excel. Wave Two of M365 Copilot, September 2024, added the ability to write Python code that runs *inside* the Excel cell — pivot tables, regressions, plots, all natively. The prompt is — *use Python to build the chart we always make manually showing revenue by region by quarter.* Copilot writes the Python, runs it, returns the chart. *You edit. You ship.*

The version of this people get wrong — prompting Copilot to "do the math" without specifying what cells. The version that works — point Copilot at a specific named range or table, then describe the operation. *Structure first, language second.*

> [S4 ▸ slide change · t ≈ 2:05]

> [S4 ▸ reveal 1 · outlook]

Outlook. The workflow is *"summarise this thread, draft the reply."* You open a forty-message thread. You start Copilot. You say — *summarise this thread, then draft a reply confirming we'll have the deliverable by Friday.* Copilot reads every message, pulls the thread of decisions, writes you a two-paragraph summary and a draft reply that references the specific commitments raised.

*What you do* — confirm the summary matches your read, verify Copilot didn't invent a decision that wasn't actually made, hit send. *The drafting time goes from ten minutes to ninety seconds.* That's the highest-leverage Outlook workflow.

> [S5 ▸ slide change · t ≈ 2:55]

> [S5 ▸ reveal 1 · teams]

Teams. The workflow is *"what did I miss."* You were in client meetings for half the day. The product channel has eighty new messages. You start Copilot Chat in Teams. You ask — *what did I miss in the product channel today.* Copilot summarises the threads, names the people, surfaces the open questions, flags anything addressed to you specifically.

*Time saved* — instead of scrolling twenty minutes of catch-up, you read a two-paragraph brief, click into the threads that actually need your attention. *Twenty minutes becomes three.*

> [S6 ▸ slide change · t ≈ 3:35]

> [S6 ▸ reveal 1 · the trap]

The trap. Every Copilot user hits it once. *Copilot grabs the wrong file.*

You have three files with similar names. The Acme Master Services Agreement v4. The Acme MSA — old draft v2. And a file called Acme Contract Template. You prompt Copilot — *summarise the Acme contract.* Copilot picks one. Which one did it pick? Without you noticing, it picked v2 — the old draft — because that file was opened more recently in your activity history. *Your summary is technically accurate, factually wrong.*

> [S6 ▸ reveal 2 · the fix]

The fix is simple but you have to do it every time. *Name the file explicitly in your prompt.* Use the slash-reference. Type *forward slash* and Copilot pops a file picker. Pick the v4. Now Copilot is grounded in the right document. *This is the single biggest reason teams new to Copilot produce wrong-looking outputs* — they don't realise the file picker is the actual control.

> [S7 ▸ slide change · t ≈ 4:35]

> [S7 ▸ reveal 1 · the picker]

The interactive on screen. Pick Word, Excel, Outlook, or Teams. See the workflow, see the prompt, see the trap that's specific to that app. The Outlook one is *Copilot picking the wrong email thread when you have a recurring meeting series.* The Teams one is *Copilot summarising the wrong channel.* Same shape, different surface.

> [pause for hands-on · ≈ 8 seconds]

> [S7 ▸ reveal 2 · the pattern]

The thread across all four traps — *Copilot defaults to your activity history when you don't specify a source.* Recent file, recent thread, recent channel. *Always grab the slash-picker.* Three seconds longer, hours of wrong-document cleanup avoided.

> [S8 ▸ slide change · t ≈ 5:30]

> [S8 ▸ reveal 1 · monday move]

The Monday move. Pick the app you live in most — Word, Excel, Outlook, or Teams. Run the workflow from this chapter on a real task today. *Not a test. A real task.* Use the slash-picker. Confirm the source. Read the output critically. *Ship it.*

> [S8 ▸ reveal 2 · close]

By tomorrow, you'll have one workflow you can rerun every week. *That's the whole point of this chapter.* Not the demo. The habit you build with this app, this prompt, this source, every week.

Next chapter — GitHub Copilot for non-developers. The surprising places it helps even if you've never written code.

> [end]
