# Diego Cayupil · portfolio

Personal site of Diego Cayupil, data analyst (SQL in BigQuery, Power BI, Python and Claude).
Live at **https://diegocayupil.github.io/** · English at the root, Spanish under `/es/`.

## How it is built
- Plain HTML, CSS and JavaScript. No framework and no build step on the server.
- Each page is a deck: one view per scroll gesture, with an index on the left.
- The site is written and reviewed with Claude Code; a script checks every view at seven screen sizes, in light and dark mode, before each version.
- Fonts (Geist, Geist Mono, Shippori Mincho, Caveat; SIL Open Font License) are served from this repository.
- `assets/medir.js` counts visits with Google Analytics 4 (no ads, no Google signals). It respects Global Privacy Control and asks first to visitors in Europe.

## Versions
Each published version is a commit and a tag (`v5.26`, `v5.27`, …). Earlier versions were built and reviewed locally; the table keeps what each one changed.

| Version | What changed |
|---|---|
| v5.24 | First public version: night mode, five phases (Define, Review, Model, Analyze, Communicate), three projects. |
| v5.25 | AI row of the dashboard shows question and answer, "How I use AI" as a cycle, catalogue of 10 cases, career timeline, Notes removed, fixes for phones and 1024 × 768. |
| v5.26 | Photo on About, "How I use AI" with a Power BI case, a smaller "Ask me" with fixed questions; visit counting on (GA4 + Clarity, asks first in Europe); downloadable CVs without phone number. |
| v5.26.1 | New address: diegocayupil.github.io (GitHub user renamed). |
| v5.27 | Home: "From problem to decision" with a one-page OTIF dashboard; Projects: the fill-rate case step by step (plus the full case, in Spanish) and nine cases coming soon; Contact: one contact view and a new message composer. |
