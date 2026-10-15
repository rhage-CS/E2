# E2: Workshop stations

Install [Deno](https://docs.deno.com/runtime/getting_started/installation/) (CI uses 2.9.7) and [Git](https://git-scm.com/downloads). Clone your own course repository, open a terminal in that folder, and run `deno task setup` once. Run `deno task dev` and open the local URL printed in the terminal (normally `http://localhost:3000`). Run `deno task ci` for formatting, lint, strict type checks, and a production build.

`index.html` loads three independent entrypoints: `src/allocation.ts`, `src/rover.ts`, and `src/counter.ts`. Shared presentation is in `src/style.css`. Assignment instructions are on Canvas. Rover Run/Clear controls are intentionally disabled in the baseline.

## If blocked

Setup enables checks on every commit; a failed check leaves your edits saved. Read the first failing command, fix it, and rerun `deno task ci`. For a commit body, put a blank line after the message title, then your explanation in the Git/VS Code commit editor. If a hook, commit editor, or deployment stalls you, ask course staff with the failing command or Actions step and its error text. The S01 instructions are your setup refresher; these workflow problems should not consume your design time.

## Deploy to GitHub Pages

In your repository on GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**. Commit and push your work to `main`. The included **Deploy to GitHub Pages** workflow checks and builds the project, then deploys `dist/`. Under **Actions**, open the successful workflow run and follow its deployment URL. You can also start it with **Run workflow**. The workflow supplies your repository name for the site's base path; no source-path edits are needed. Submit the deployed page URL required by the assignment.

## Credits

Tooling adapted from the instructor's D1 starter, itself derived from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. E2 scenarios and procedural graphics were instructor-authored with authorized OpenAI GPT-6 Astra agent assistance. Dependencies retain their respective licenses.
