# XiaoCai — Personal Knowledge Base

A personal site that renders an Obsidian / Git vault as a per-project
**file-tree + Markdown reader + auto TOC** knowledge base, not a traditional
blog. Built with Astro, Tailwind v4, deployed to GitHub Pages.

```
Obsidian (My_blog)  ──▶  git commit  ──▶  GitHub  ──▶  Actions  ──▶  Astro build  ──▶  GitHub Pages
```

No backend, no database, no CMS. Content is Markdown in the vault.

## Stack

- **Astro 7** static site, Content Collections
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **@astrojs/markdown-remark** for the Markdown pipeline (used by the Obsidian
  `[[wikilink]]` plugin in `astro.config.mjs`)
- GitHub Actions → GitHub Pages

## Structure

```
blog/
├── astro.config.mjs        # wikilink remark plugin + dev fs.allow
├── src/
│   ├── content.config.ts   # projects collection -> Obsidian My_blog vault
│   ├── config.ts           # name / role / GitHub link
│   ├── data/projects.json  # per-project metadata (name, tagline, tags…)
│   ├── utils/              # file tree, entry lookup, project helpers
│   ├── components/         # PillNav, FileTree, FileTreeNode, TOC, ProjectCard
│   ├── layouts/            # BaseLayout, ProjectLayout (3-column)
│   └── pages/
│       ├── index.astro          # Home (hero + pill nav)
│       ├── about.astro
│       └── projects/
│           ├── index.astro          # Projects overview (cards)
│           └── [project]/
│               ├── index.astro          # /projects/<slug> -> README
│               └── [...file].astro      # /projects/<slug>/<path>
└── .github/workflows/deploy.yml
```

## Content model

- Each top-level folder in the Obsidian `My_blog` vault is one project.
- `src/data/projects.json` holds the display metadata (slug must match the
  folder). A root `README.md` is the project landing page
  (`/projects/<slug>`); every other `.md` becomes `/projects/<slug>/<path>`.
- The left file tree mirrors the vault folder structure. The right TOC is
  generated from `#`/`##`/`###` headings and scroll-spies.
- `[[wikilinks]]` resolve to `/projects/<project>/<target>` (basename-only,
  same project). Use plain Markdown links for cross-folder targets.

## Local dev

```sh
npm install
npm run dev      # http://localhost:4321
```

`src/content.config.ts` points `PROJECTS_BASE` at the Obsidian vault:

```ts
const PROJECTS_BASE = '/Users/xiaocai/Documents/Obsidian Vault/My_blog';
```

`astro dev` reads the vault live — edits in Obsidian are reflected on save.
`astro.config.mjs` whitelists the vault path via `vite.server.fs.allow`.
**If you move the vault, update `PROJECTS_BASE` (and the `fs.allow` entry).**

The sample content lives in that vault under `kino/` and `jijiang/` — edit or
replace it. To add a project, create a folder + `README.md` and add an entry
to `src/data/projects.json`.

## Deploy to GitHub Pages

Content must live **in the repo** for CI to build it (the absolute vault path
only exists locally). Pick one:

**Option A — vault-as-repo (matches the Obsidian flow, recommended):**
move/copy the site code into the `My_blog` vault folder, `git init` there,
change `PROJECTS_BASE` to `'./src/content/projects'` and move the vault's
`.md` files under `src/content/projects/`. Commit & push → Actions deploys.

**Option B — keep code here:** copy vault content into
`src/content/projects/`, set `PROJECTS_BASE` to `'./src/content/projects'`,
commit & push this repo.

Then:
1. Push to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Set `site` in `astro.config.mjs` to your Pages URL.
   - User/org page (`user.github.io`): leave `base` unset.
   - Project page (`user.github.io/<repo>`): set `base: '/<repo>/'`
     (the workflow can also set `ASTRO_BASE`).

## Commands

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321`          |
| `npm run build`   | Build to `./dist/`                      |
| `npm run preview` | Preview the production build locally    |

## Notes / TODO

- The Obsidian wikilink plugin uses `markdown.remarkPlugins`, which Astro 7
  flags as deprecated (still works). Migrate to the `@astrojs/markdown-remark`
  `unified({...})` API when stabilised.
- Wikilink resolution is basename-only within a project; subfolder targets
  need plain Markdown links.
- Mobile shows the article only (tree/TOC hidden); a mobile file picker is a
  follow-up.
