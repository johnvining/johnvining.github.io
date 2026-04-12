# jvining.com

Personal website at [jvining.com](https://jvining.com).

## Workflow

Content is written in Markdown (`_notes/`, `_reading/`) and built with Jekyll.

**To publish changes:**

1. Edit or create a Markdown file in `_notes/` or `_reading/`
2. Run `./build.sh` — this builds the site and copies built HTML to the canonical paths (`index.html`, `notes/`, `reading/`)
3. Review the diff: `./diff.sh` shows what changed in the committed HTML files
4. Commit and push — GitHub Pages serves the static HTML directly from the repo

**Why commit the HTML?**

The built HTML lives at the same paths as before (`notes/blaineofmaine.html`, etc.) so GitHub's diff tool shows inline diffs between versions. This makes it easy to verify that template changes affect only what you intended.

## Structure

- `_notes/` — Article source files (Markdown)
- `_reading/` — Reading notes source files (Markdown)
- `_pages/` — Page source files
- `_layouts/` — Jekyll layout templates
- `notes/`, `reading/`, `index.html` — Built HTML committed to the repo
- `style.css` — Stylesheet
- `build.sh` — Build script (run this to build)
- `diff.sh` — Show diff of built HTML files
