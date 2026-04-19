# jvining.com — Site Instructions

## Overview

Static site at jvining.com, hosted on GitHub Pages from the `johnvining.github.io` repo. Built with Jekyll. Source files live in collection directories; built HTML is committed alongside them so `git diff` shows readable diffs.

## Structure

```
_notes/          ← source Markdown for essays and short pieces
_reading/        ← source Markdown for monthly reading notes
_pages/          ← source for top-level pages (index, projects, contact)
_layouts/
  article.html   ← layout for notes and reading entries (links up to ../)
  page.html      ← layout for top-level pages (links at ./)
_includes/       ← (unused currently)
notes/           ← built HTML, committed to repo
reading/         ← built HTML, committed to repo
index.html       ← hand-maintained; also copied back from docs/ after build
projects.html    ← same
contact.html     ← same
docs/            ← Jekyll's output directory (excluded from source)
style.css        ← single stylesheet, shared across all pages
build.sh         ← build script (run this, not jekyll directly)
diff.sh          ← shows diff of built HTML before committing
```

## Publishing Workflow

1. Write or edit source file in `_notes/` or `_reading/`
2. Run `./build.sh` — this builds Jekyll into `docs/` then copies built files back to `notes/`, `reading/`, `index.html`, `projects.html`, `contact.html`
3. Run `./diff.sh` to review what changed in the built HTML
4. Update `index.html` manually to add the new entry to the table (see Index format below)
5. Commit everything — source files and built HTML together
6. Push to GitHub; Pages serves from main branch automatically

Do not run `jekyll build` directly — use `build.sh`, which sets a clean environment path for the Homebrew Ruby installation.

## Writing a New Essay (notes)

Create `_notes/slug.md`:

```markdown
---
layout: article
title: Your Title Here
slug: your-title-here
display_date: 4/19/26
---

Body text here. Footnotes use standard Markdown syntax.[^1]

[^1]: Author, *Title*, Chapter or page.
```

Builds to `notes/slug.html`. Permalink configured in `_config.yml` as `/notes/:name.html`.

## Writing a New Reading Entry

Create `_reading/YYYY-MM.md` (e.g. `_reading/2026-04.md`):

```markdown
---
layout: article
title: Reading Notes, April 2026
slug: title
display_date: 4/19/26
---

#### Author Name, *Book Title*.

Review text here.[^1]

[^1]: Author, *Title*, Chapter or page.
```

Builds to `reading/YYYY-MM.html`.

## Index Format (index.html)

The index is a hand-maintained HTML table. Add new entries at the top:

```html
<tr>
  <td class="date-cell"><span class="date">4/19/26</span></td>
  <td class="title-cell"><a href="notes/slug.html">Essay Title</a>, short description</td>
</tr>
```

For reading entries, include the book list in a `<small>` tag:

```html
<tr>
  <td class="date-cell"><span class="date">4/19/26</span></td>
  <td class="title-cell"><a href="reading/2026-04.html">April 2026</a><br><small class="book-titles">Book One, Book Two, Book Three</small></td>
</tr>
```

## Footnotes

Kramdown GFM footnote syntax. Use `[^N]` inline and `[^N]: citation` at the bottom. The backlink character is configured as `&#160;&#8617;` in `_config.yml`. For citations, the convention is: Author, *Title*, Chapter or page — with a link if online.

## RSS

`feed.xml` is generated automatically by Jekyll from the `_notes` and `_reading` collections, sorted by `date` descending, capped at 20 items. `build.sh` copies the built file back to the root alongside the other built files.

To include a new article in the feed, add `date: YYYY-MM-DD` to its front matter — this is also what controls sort order. All existing entries already have this field. Without it, an article will be excluded from the feed.

## Styles

Single `style.css` at the root. Articles link to it as `../style.css`; top-level pages link as `./style.css`. No build step for CSS — edit directly.
