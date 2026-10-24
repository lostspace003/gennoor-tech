# Learning Studio: course text format and learner rules

What a course package (`<CODE> Studio\studio.json`, imported in `/admin/lms` from a SAS URL) has to carry for the lesson page to
show it properly, and the rules the site applies to every course.

## Text is markdown

The quiz (question, answers, explanation) and the lesson description are rendered as markdown by `src/components/academy/RichText.tsx`
(built on `ChatMarkdown`). Nothing is passed to the page as HTML.

| Write | Shows as |
|---|---|
| a blank line between paragraphs | separate paragraphs |
| `- item` or `* item` | bullet list |
| `1. item` | numbered list |
| `**label**` | bold |
| `` `name` `` | inline code |
| three backticks, the code, three backticks | a code block (indentation and line breaks kept) |
| `[text](https://...)` | a link |
| `## heading` | a bold heading line |

An answer can be a short text or several paragraphs with a code block. The importer keeps the text exactly as it is in `studio.json`.

Descriptions that arrive as one long paragraph (older courses) get paragraph breaks every couple of sentences when they are shown
(`paragraphize` in `RichText.tsx`). Text with line breaks is shown as written.

## Where it comes from (Course Factory)

`recording\tools\quiz_parse.py` reads the Knowledge check .docx: a paragraph in a monospace font or a Code style becomes a fenced code
block, a monospace run inside a sentence becomes inline code. `make_studio_package.py` builds each description as two short paragraphs from
the narration (a bold label line for labs and demos), or uses `<CODE> Studio\descriptions.json` (`{"M1-1.01": "markdown"}`). Its readiness
report lists "format warnings": clear them before sharing the SAS URL.

## Course map bars

`CourseStrip` draws one thin bar per lesson, all the same width, coloured by type and as TALL as the video is long (`durationSec`, on the
scale of the longest lesson of the course, eased so short demos stay visible); a quiz has no video and gets one fixed lower height.
Every lecture, lab and demo in the package needs its duration.

## Learner rules

- A lesson always opens **paused at 0:00**. Only the **Resume** button (`?resume=1`) continues where the learner stopped. Once the learner
  has pressed play in a visit, the next lesson they pick plays by itself, still from the start.
- Clicking a lesson in the **course outline** (course page): signed in and enrolled goes straight to the lesson; signed out opens the sign-in,
  then enrolls and opens that lesson; signed in but not enrolled enrolls and opens it. The lesson is kept as `?open=<id>` in the address so
  the full-page Microsoft sign-in comes back to it. The Microsoft callback only returns to paths on this site.
- Never write the word "free" in course text (courses may become paid).
