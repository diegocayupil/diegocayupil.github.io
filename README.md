# Diego Cayupil · portfolio

Personal site of Diego Cayupil, data analyst (SQL in BigQuery, Power BI, Python and Claude).
Live at **https://diegocayupil.github.io/** · English at the root, Spanish under `/es/`.

## How it is built
- Plain HTML, CSS and JavaScript. No framework and no build step on the server.
- Each page is a deck: one view per scroll gesture, with an index on the left.
- The site is written and reviewed with Claude Code; a script checks every view at seven screen sizes, in light and dark mode, before each version.
- Fonts (Geist, Geist Mono, Shippori Mincho, Caveat; SIL Open Font License) are served from this repository.
- `assets/medir.js` counts visits with Google Analytics 4 (no ads, no Google signals). It respects Global Privacy Control and asks first to visitors in Europe.
- `m/` is a mobile version in progress (a mockup): one app-like page where every view fits the phone screen and you move by tapping — five tabs, the case told as stories, each phase as four swipeable cards, contact as three questions. Spanish and English, same fonts, colours and `medir.js`. Texts live in `m/contenido.js`. It is not linked from the site yet and is marked `noindex`: open `/m/` to try it.

## Versions
Each published version is a commit and a tag (`v5.26`, `v5.27`, …). Earlier versions were built and reviewed locally; the table keeps what each one changed.

| Version | What changed |
|---|---|
| v5.24 | First public version: night mode, five phases (Define, Review, Model, Analyze, Communicate), three projects. |
| v5.25 | AI row of the dashboard shows question and answer, "How I use AI" as a cycle, catalogue of 10 cases, career timeline, Notes removed, fixes for phones and 1024 × 768. |
| v5.26 | Photo on About, "How I use AI" with a Power BI case, a smaller "Ask me" with fixed questions; visit counting on (GA4 + Clarity, asks first in Europe); downloadable CVs without phone number. |
| v5.26.1 | New address: diegocayupil.github.io (GitHub user renamed). |
| v5.27 | Home: "From problem to decision" with a one-page OTIF dashboard; Projects: the fill-rate case step by step (plus the full case, in Spanish) and nine cases coming soon; Contact: one contact view and a new message composer. |
| v5.28 | Home: the dashboard as a real report and a plainer sentence; What I solve: pain 01 no longer repeats pain 04; Projects: index with Part 1 and Part 2, each step told as "I get → I deliver" with guided visuals (full case removed for now); Contact: quick questions redone; CV with Portfolio first. CSS and JS carry the version to avoid stale caches. |
| v5.29 | Always opens in light mode; home: plainer sentence, most-requested tools, numbered 1-2-3 linking the headline words and the report; pain 04 as an AI chat; About: experience-based intro, career line, square photo, only About and Contact; Projects: "The problem" first with the live dashboard, a "Live dashboard" button on every step, and each step told as problem → what I did → result. Analytics: consent asked to everyone, plus project-step and live-dashboard events. |
| v5.29.1 | About: the long paragraph becomes one short line plus four numbered steps of what I do. |
