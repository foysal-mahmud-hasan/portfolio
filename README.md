# Portfolio — Next.js (app router) + Terminal UI

This repository is a small Next.js portfolio built with the App Router. It includes a terminal-style UI component (`components/terminal.tsx`) that exposes simple CLI-like commands (whoami, skills, projects, profile, contact, cat <file>, etc.).

The project centralizes personal/profile data in `lib/profile.ts` so the same content is used across the app.

## Quick start

Install dependencies and run the dev server:

```bash
pnpm install
pnpm dev
# or
npm install
npm run dev
```

Open http://localhost:3000 and try the terminal UI. Useful commands:

- `help` — lists available commands
- `whoami` — prints your profile summary
- `skills` — shows technical skills
- `projects` — shows GitHub and short private project summary
- `profile` or `cat profile.jpg` — displays a colored ASCII preview of your profile photo (requires `/public/foysal-mahmud-hasan.jpg`)
- `cat portfolio.md` — prints the portfolio markdown stored in `lib/profile.ts`
- `cat resume.pdf` — shows a download link for `public/foysal-mahmud-hasan-resume.pdf` (place your PDF there)

## Where to edit your information

- `lib/profile.ts` — primary source of truth for `whoami`, `about`, `skills`, `projects`, `contact`, and `portfolioMd`.

Edit these strings to update your public profile. Changes will be reflected instantly in the terminal UI during development.

## Make the resume download work

Place your resume PDF at `public/foysal-mahmud-hasan-resume.pdf`. The terminal command `cat foysal-mahmud-hasan-resume.pdf` will render a download link that points to `/foysal-mahmud-hasan-resume.pdf`.

## Profile image (ASCII art)

The ASCII profile command uses the image at `/public/foysal-mahmud-hasan.jpg`. If you want the ASCII preview to load, add your image at that path. If you prefer a different filename, update the path used in `components/terminal.tsx` (two places: `profile` command and `cat profile.jpg` handling).

## portfolio.md

`portfolio.md` is generated from `lib/profile.ts` as the `portfolioMd` export. The terminal command `cat portfolio.md` prints it as plain text. If you'd like rendered Markdown in the UI, we can add a renderer or a separate page to display it.

## Type-checking & production build

Run a TypeScript check and build:

```bash
pnpm build
pnpm typecheck # if you have a typecheck script
# or with npm
npm run build
```

If you run into issues after editing `lib/profile.ts`, start by running the type-check above and fix any formatting mistakes in the strings (unescaped backticks or template-literal content can break the file).

## Next recommended changes

- Add your `public/foysal-mahmud-hasan-resume.pdf` and `public/foysal-mahmud-hasan.jpg`.
- Optionally render `portfolio.md` as HTML (add a small Markdown renderer or a dedicated page).
- If you want links (GitHub, LinkedIn) clickable in the terminal output, I can convert specific command outputs to JSX anchors safely.

If you'd like, I can add a placeholder resume file now, render portfolio.md as HTML in the terminal, or make GitHub/LinkedIn clickable. Tell me which and I'll implement it.
