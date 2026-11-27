# The one-page catalogue

What Gennoor Tech does, on one page: the hub in the middle (who we are, our credentials, the Claude Partner card),
four things to learn on the left, four things built for a team on the right, how we work, and how to reach us.
Every card and every contact is a link.

| File | What it is for |
|---|---|
| `Gennoor-Tech-Catalogue.pdf` | A4 landscape, one page, links clickable. Attach it to an email. |
| `Gennoor-Tech-Catalogue.png` | The same page as a picture (2246 x 1588): a slide, a post, a print. |
| `Gennoor-Tech-Catalogue-email.png` | The same words in one tall column, 600 wide (drawn at twice that): to put inside an email. |
| `catalogue.html` | **The source.** Change the words here. |
| `build.mjs` | Makes the three files above from the source. |

The PDF and the email picture are also copied to `public/Gennoor-Tech-Catalog/`, so once merged they are on the site
(`https://www.gennoor.com/Gennoor-Tech-Catalog/Gennoor-Tech-Catalogue.pdf`) and an email can show the picture.

## Changing it

1. Open `catalogue.html` in any text editor and change the words. Each card is one `<a class="card ...">` block.
   An icon is written `{{icon:Name}}` with a name from lucide.dev/icons; the colour of a card is its class
   (`blue`, `cyan`, `claude`, `gold`, `violet`, `green`, `rose`).
2. Run `node catalog/build.mjs` (needs Chrome and the internet, for the brand's fonts).
3. Open the PNG and the PDF and look at them: the page must not run over, and nothing may be cut.

## Editing it in Canva instead

Canva opens a PDF as a design you can edit: in Canva, **Create a design > Import file**, choose
`Gennoor-Tech-Catalogue.pdf`. Text, shapes and colours become editable; the icons and the logo come in as
pictures. Check the fonts after import (Plus Jakarta Sans and Sora are both in Canva) and the links (Canva keeps
them on the text; check each one before you share). Download from Canva as "PDF Standard" to keep the links.

## The rules for the words (AGENTS.md)

Only what we really offer. No prices, no customer names, nothing called "free", nobody named as the trainer
("an industry expert"). The Claude Partner line, "Gennoor is Certified in the Claude Partner Network.", word for
word on its cream card, the badge never recoloured. "About 60% less classroom time" is always our aim, never a
promise. The AI Weekend is "the last weekend of every month, Saturday & Sunday".
