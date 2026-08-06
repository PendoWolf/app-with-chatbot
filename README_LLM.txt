# Clearlist — LLM context

This file is for LLMs working on this codebase. Prefer it over guessing from file names alone.

## Product

Clearlist is a single-page todo app. Brand and copy matter: the product name "Clearlist" is the hero-level brand signal; the headline is "What needs doing?"; supporting line is "Add a task, check it off, keep moving."

Core behaviors:
- Add a task (trimmed text; empty submit ignored)
- Toggle done / not done
- Delete a single task
- Filter: all | active | done
- Clear all completed tasks
- Persist todos in browser localStorage under key `clearlist-todos`

There is no backend, auth, sync, routing, or accounts.

## Stack

- React 19 (JSX, not TypeScript)
- Vite 8 + @vitejs/plugin-react
- Oxlint (not ESLint)
- No UI library, no CSS framework, no state library, no router

Entry: `index.html` → `src/main.jsx` → `src/App.jsx`

## Scripts

- `npm install` — install deps
- `npm run dev` — Vite dev server (default http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run lint` — oxlint

## Project layout

```
index.html          # title Clearlist; Google Fonts for Bricolage Grotesque + IBM Plex Sans
vite.config.js      # React plugin only
package.json
.oxlintrc.json      # react + oxc plugins; hooks rules
public/             # static assets (favicon.svg, etc.)
src/
  main.jsx          # StrictMode + createRoot
  App.jsx           # all app logic and UI
  App.css           # component/layout styles
  index.css         # CSS variables, resets, focus styles
  assets/           # leftover template SVGs (vite/react); not central to UI
```

Almost all product logic lives in `src/App.jsx`. Keep it that way unless complexity clearly warrants a split.

## Data model

Todo shape:
```js
{ id: string, text: string, done: boolean }
```

- `id` from `crypto.randomUUID()`
- New todos prepended to the list (newest first)
- Storage: `localStorage.setItem('clearlist-todos', JSON.stringify(todos))`
- Load: parse JSON; if missing/invalid/non-array → `[]`
- Filter state (`all` | `active` | `done`) is UI-only, not persisted
- Composer input text is UI-only, not persisted

## UI structure (App.jsx)

1. `.atmosphere` — fixed decorative background (aria-hidden)
2. `.shell` — main column (max ~34rem)
3. `.hero` — brand "Clearlist", h1, lede
4. `.composer` — form: text input + Add button (disabled when empty/whitespace)
5. `.toolbar` — remaining count + filter buttons
6. `.list` — todos; each row checkbox + label + delete
7. Empty-filter message when filter has no matches but todos exist
8. "Clear N completed" when any completed todos exist

Count copy:
- no todos → "No tasks yet"
- all done → "All clear"
- else → "N left"

## Design system

Defined in `src/index.css` `:root`:

| Token            | Role |
|------------------|------|
| `--ink`          | Primary text (#1a2e2a) |
| `--ink-muted`    | Secondary text |
| `--surface`      | Translucent white panels |
| `--surface-solid`| Page base |
| `--accent`       | Primary green (#0d9f6e) |
| `--accent-deep`  | Hover/pressed green |
| `--accent-soft`  | Soft green fill |
| `--danger`       | Delete/destructive |
| `--danger-soft`  | Soft danger fill |
| `--line`         | Borders |
| `--shadow`       | Elevation |
| `--radius`       | 14px |
| `--font-display` | Bricolage Grotesque (brand/headings) |
| `--font-body`    | IBM Plex Sans |

Visual direction: soft mint/sage gradients, light (not dark), calm productivity. Brand name uses display font at large size; headline is secondary to brand.

Accessibility already present:
- sr-only label for the composer input
- `useId()` for input id
- filter group has `role="group"` + aria-label
- delete buttons have `aria-label` including task text
- `:focus-visible` outline uses `--accent`

Motion: atmosphere drift animation; shell rise-in; list items use `--i` for staggered feel. Prefer intentional motion over decorative noise.

## Conventions for changes

- Match existing style: functional components, hooks, plain CSS class names, no CSS modules.
- Do not introduce TypeScript, Redux, Tailwind, or a component library unless explicitly asked.
- Prefer editing `App.jsx` / `App.css` / `index.css` over adding many new files for small features.
- Preserve brand-first hero hierarchy when changing marketing/copy layout.
- Keep localStorage key stable (`clearlist-todos`) unless migrating deliberately.
- Lint with Oxlint (`npm run lint`), not ESLint.
- package name in package.json is still `"app"`; product name is Clearlist.

## Out of scope (unless asked)

- Multi-user / cloud sync
- Due dates, priorities, tags, folders
- PWA / offline service worker
- Tests (none currently)
- i18n
