# Chapter 2 — Structured outputs (JSON)

**Course:** Prompting Mastery · **Chapter:** 02 · **Target duration:** ~7
min spoken

## Trainer persona

Andrew. Same direct, senior-engineer tone. This chapter is the most
hands-on of the course — there's a real schema demo. The tone should be
*"here's how I actually do this in production, not theory"*.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

If chapter one was about *what* to prompt, chapter two is about what
comes *back*. Specifically — how to get the model to return data your
code can actually parse. Every time. Without surprise markdown wrappers,
without trailing prose, without hallucinated fields, without the model
deciding to be helpful and adding a fifth key you didn't ask for.

This is the chapter where prompting stops being a craft and starts being
engineering. The good news — by 2026, vendors finally shipped the right
tooling. The bad news — most teams are still using the wrong tooling
because they learned the old way.

> [S2 ▸ slide change · t ≈ 0:45]

> [S2 ▸ reveal 1 · the brittle prompt]

Let me show you the way most code does it today. The prompt says
something like — *"return your answer as JSON with keys name, role,
score"*. And then the developer parses the response with
`JSON.parse(response)`. Works most of the time. Fails maybe one in twenty
calls.

> [S2 ▸ reveal 2 · the failure modes]

The failure modes are familiar. The model wraps the JSON in markdown
backticks. Or it adds a sentence before the JSON — *"Sure! Here's the
JSON you asked for:"*. Or it forgets a key. Or it adds an extra key. Or
it returns a string where you wanted a number. Or the model decides — in
its infinite helpfulness — to add a sixth person to your list of five.

In a demo, this is fine. In production, this is an exception every
twenty calls — and that exception cascades. Your downstream code chokes.
Your retry logic kicks in. Your costs climb. Your latency climbs. Your
ops team learns to dread the on-call rotation.

> [S3 ▸ slide change · t ≈ 1:55]

> [S3 ▸ reveal 1 · structured outputs]

OpenAI shipped the fix in August 2024. It's called Structured Outputs.
Anthropic and Google followed with their own equivalents. By 2026,
this is the production default. If you're not using it, you're
catching exceptions you shouldn't have to catch.

> [S3 ▸ reveal 2 · the contract]

Here's the contract. You define a JSON Schema. The schema is strict —
every key is required, every type is constrained, the structure is
locked. You pass that schema to the model along with the prompt. The
model is *guaranteed* to return output matching that schema. Not "tries
to". Guaranteed.

Internally, the model's token generation is constrained at the
sampling layer — it literally cannot emit a token that would violate
the schema. That's not a prompting trick. That's the inference engine
doing the enforcement.

> [S4 ▸ slide change · t ≈ 3:10]

> [S4 ▸ reveal 1 · the schema-as-code pattern]

The way this looks in code is what I want you to remember.

In Python — you define the schema as a Pydantic model. A class.
*Class*, methods, types, the works. Then you pass that class to the
SDK as the response format. Three lines.

In TypeScript — same idea with Zod. Define a schema as a Zod object.
Pass it to the SDK with `zodResponseFormat`. Three lines.

The schema lives next to your code, in your repo, version-controlled.
Not in a prompt string somewhere. *Not in a prompt string somewhere.*
That's the upgrade. Schemas are types now. Types are how engineers
already work.

> [S4 ▸ reveal 2 · what you get]

What you get back is a parsed, validated object. Not a string you need
to JSON.parse. The SDK does it for you. If the model can't satisfy the
schema for any reason — refused, content policy, partial output — the
SDK returns a refusal field, not a malformed object you have to dig
through.

The exception path is *typed*. The success path is *typed*. Your code
gets simpler, not more complex.

> [S5 ▸ slide change · t ≈ 4:35]

> [S5 ▸ reveal 1 · legacy mode]

A small clarification, because this trips people up. There's an older
flag called `response_format: json_object`. Sometimes called JSON Mode.
That mode is *legacy*. It only guarantees that what comes back is valid
JSON syntax — not that it matches your schema. You can still get
missing keys, wrong types, extra fields. It just won't be broken JSON.

In 2026, JSON Mode is the wrong default. Use Structured Outputs with a
real schema. If you're maintaining code from 2023 that still uses JSON
Mode — that's tech debt worth paying down before it bites you.

> [S6 ▸ slide change · t ≈ 5:20]

> [S6 ▸ reveal 1 · interactive intro]

On the screen — a small schema builder. Drag fields in. Mark them
required or optional. Set their types. Watch the example output update
live. Try removing a required field and notice the model would now be
free to omit it. Try changing a number to a string and notice the
output type change.

> [pause for hands-on · ≈ 10 seconds]

> [S6 ▸ reveal 2 · the refusal field]

Notice the refusal slot in the response — that's the safety valve.
When the model can't satisfy the schema, instead of fighting it or
returning garbage, it returns a refusal message in a known shape. Your
code branches on it. Predictable error path.

> [S7 ▸ slide change · t ≈ 6:30]

> [S7 ▸ reveal 1 · the assignment]

One thing to do before chapter three.

Open your codebase. Search for `JSON.parse` against an LLM response.
Or for `response_format: { type: "json_object" }`. Anything you find
is a candidate for migration to Structured Outputs.

> [S7 ▸ reveal 2 · close]

Pick the one that breaks most often. Migrate it this week. Watch your
exception rate drop. See you in chapter three — we're going to talk
about reasoning. When chain-of-thought helps, and when it costs you
three to five times the latency for no real gain.

> [end]
