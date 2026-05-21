# Chapter 4 — GitHub Copilot for non-developers

**Course:** Working with Copilots · **Chapter:** 04 · **Target duration:** ~7 min spoken

## Trainer persona
Emma. Surprising-angle chapter. Non-devs assume GitHub Copilot isn't for them — wrong.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. GitHub Copilot. *Wait — I'm not a developer.* That's the response most people in marketing, ops, finance, and HR give when I tell them to pay attention to GitHub Copilot. The mistake is assuming GitHub Copilot is about writing code. It's about *getting computers to do things you can describe in English.* That's a much bigger surface than you think.

> [S2 ▸ slide change · t ≈ 0:30]

> [S2 ▸ reveal 1 · what changed]

What changed in 2025 and 2026. Two features that broke GitHub Copilot out of the developer-only tool. *One* — Copilot Spaces, generally available since September 2025. Spaces let you bundle files, documents, PRs, and notes into a curated context, then ask Copilot questions against that bundle. It works in the IDE, on github dot com, and inside the GitHub MCP server connected to any other Copilot surface.

*Two* — Agent Mode, generally available on VS Code and JetBrains by March 2026. Agent Mode plans and executes multi-step tasks. *It edits files, runs terminal commands, checks its output, iterates.* For a developer that means "build this feature." For a non-developer that means "wrangle this spreadsheet."

> [S3 ▸ slide change · t ≈ 1:35]

> [S3 ▸ reveal 1 · spreadsheets]

Use case one — spreadsheets. You have a CSV with twelve thousand rows of customer survey responses. You need a column that classifies each one as "positive," "negative," or "mixed." In M365 Copilot's Python in Excel, you could do this — but Python in Excel hit licence caps for usage. GitHub Copilot in VS Code, on the same CSV, can write a Python script that classifies all twelve thousand rows in under a minute, runs it, hands back the file. *You didn't write code. You described an outcome.*

> [S4 ▸ slide change · t ≈ 2:20]

> [S4 ▸ reveal 1 · regex]

Use case two — regex. Regular expressions. The kind of pattern matching that's everywhere — find all phone numbers in this document, extract every email mentioned in these support tickets, strip out the timestamps from these logs. *Regex is the syntax most people fail at the first try.* GitHub Copilot turns natural language into regex. *"Match a US phone number including parentheses or hyphens"* — and it writes the pattern. You paste it into Excel, Word, your CRM search bar, wherever. The whole "I'll just clean this manually" trap collapses.

> [S5 ▸ slide change · t ≈ 3:05]

> [S5 ▸ reveal 1 · scripts]

Use case three — scripts that automate the boring thing. The same operation, every week. *Renaming three hundred files to a consistent format.* *Pulling the same five fields from a webpage every Monday.* *Generating a report that combines two CSVs with a join.* These are five-line scripts. *You don't write them. Agent Mode does — and runs them.* Non-developers can now own these automations without filing a ticket to engineering.

> [S6 ▸ slide change · t ≈ 3:50]

> [S6 ▸ reveal 1 · the limits]

Where you still need a developer. Three patterns. *One* — anything that touches production data your team owns. Your CRM. Your financial system. Your customer database. *Even if Agent Mode can write the script, you need a person who's accountable for what happens when it runs at three a.m.* That's not Copilot's job.

*Two* — anything that runs on a schedule and emails people. If something breaks, who gets the page? If you don't have an answer, you have a developer-in-the-loop problem, not a Copilot problem.

*Three* — anything that needs to be audited, signed off, or pass review. Compliance code. SOX-bounded reporting. Things where the question *"who wrote this and how was it tested"* will be asked. *Copilot isn't the answer. Your engineering team is.*

> [S7 ▸ slide change · t ≈ 4:55]

> [S7 ▸ reveal 1 · the sorter]

The interactive. Six tasks. For each — *can a non-developer with GitHub Copilot ship this, or do you need a developer in the loop?* The wrong answers are clustered around things that *look* doable but break the moment they fail unattended.

> [pause for hands-on · ≈ 10 seconds]

> [S7 ▸ reveal 2 · the pattern]

The pattern across the developer-in-the-loop ones — *unattended execution, production data, or audit requirements*. The pattern across the Copilot-yourself ones — *one-shot, on your own machine, with data you already own*.

> [S8 ▸ slide change · t ≈ 5:45]

> [S8 ▸ reveal 1 · monday move]

The Monday move. Spend twenty minutes in GitHub Copilot Chat — not Code, *Chat*. Available at github dot com slash copilot. Ask it to write you a regex for something you've cleaned manually before. Ask it to generate a Python script for a spreadsheet task you do every week.

> [S8 ▸ reveal 2 · close]

Even if you never run the code — even if you just hand it to someone else to validate — you'll have a clearer sense of what's possible. *And the moment one of those scripts does work for you, you've taken an hour off your weekly load.*

Next chapter — ChatGPT Enterprise. The edge cases your M365 Copilot doesn't cover.

> [end]
