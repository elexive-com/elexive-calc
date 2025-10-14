# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React 19 app surface—components in `components/`, reusable logic in `hooks/`, pricing helpers in `utils/` and `helpers/`, PDF exports in `pdf/`.
- `public/`: static entry files (`index.html`, icons) shipped as-is.
- `resources/`: strategy briefs and analyses that guide roadmap decisions.
- `scripts/`: automation helpers; `build/`: generated output—never edit by hand.

## Build, Test, and Development Commands
- `npm start` / `npm run dev`: launch the Vite dev server with fast HMR.
- `npm run build`: create an optimized production bundle in `build/`.
- `npm run preview`: serve the production build locally for validation.
- `npm test` and `npm run test:watch`: execute the Vitest suite once or in watch mode.
- `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`: enforce ESLint and Prettier rules before shipping changes.

## Coding Style & Naming Conventions
Prettier (via the format scripts) owns whitespace; avoid manual styling. Components stay in PascalCase files (`CalculatorApp.jsx`), hooks start with `use` inside `src/hooks/`, utilities stay camelCase. Keep Tailwind utilities in JSX or `src/custom.css`, and lean on Husky + lint-staged to block non-compliant commits.

## Testing Guidelines
Vitest + Testing Library cover units and UI flows; colocate specs beside subjects (e.g. `src/App.test.js`) using the `*.test.js` suffix. Assert visible behavior—pricing logic, PDF exports, routing—and keep fixtures light for fast runs. Add or update tests whenever calculator math, hooks, or PDF boundaries change.

## Commit & Pull Request Guidelines
Commits use short, imperative summaries (`added logo guideline`, `docs: update project intelligence`) and group related changes. Let Husky pass before pushing. PRs should spell out problem, solution, and impact, attach UI captures or PDFs when visuals shift, link relevant resources/issues, and call out config updates so deployments stay coordinated.

## Amazon Q Playbooks
Review `.amazonq/project-intelligence/overview.md` and `architecture.md` for context, plus `.amazonq/rules/*.md` for React, specs, and intelligence guardrails. Agent personas live in `.amazonq/cli-agents/*.json`; keep automation and prompt changes aligned with those playbooks.

## Environment & Configuration
Use `.env.local` for Vite vars. Standard dev setup: `VITE_ENV=development`, `VITE_DEBUG=true`; flip to `production/false` to mimic prod. Never commit secrets—manage them through Netlify or Amplify configs and log new keys in `resources/` so agent workflows stay in sync.
