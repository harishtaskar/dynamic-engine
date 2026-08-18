# Dynamic Engine — Generative AI Dashboard & Widget Builder

A small BI workspace that renders real-time, customizable widgets from a mocked "LLM" backend. You type a request, the server streams back a list of widget configs, and the frontend resolves each one to a React component at runtime — with error isolation, optimistic updates, theming, and skeletons that hold their space while the stream fills in.

The sample this was built against is a risk-review dashboard (high-risk accounts, a table, a distribution chart, a parameter form, recommended actions), so the demo data leans that way.

## Stack

- **Client:** React 19 + TypeScript, Vite, Tailwind CSS v4, Zustand, TanStack Query, React Hook Form, TanStack Table + Virtual, Recharts, Framer Motion, Zod.
- **Server:** Node + Express 5, Mongoose (MongoDB), Zod. TypeScript throughout, run with `tsx`.
- **Package manager:** pnpm.

## Running it locally

You'll need Node 20+, pnpm, and a MongoDB running locally (the default connection string points at `mongodb://localhost:27017`).

### 1. Server

```bash
cd server
pnpm install
```

Copy the example env file — `.env` itself is gitignored, and the server exits on boot without `MONGODB_URI`:

```bash
cp .env.example .env
```

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/dynamic-engine
```

Then:

```bash
pnpm dev
```

The generate endpoint creates and persists a dashboard on the fly, so you don't strictly need to seed anything to see it work. If you want some rows in the `dashboards` collection up front, there's a seed script:

```bash
pnpm seed
```

### 2. Client

In a second terminal:

```bash
cd client
pnpm install
cp .env.example .env
pnpm dev          # Vite dev server on http://localhost:5173
```

The client reads the API base URL from its `.env`, falling back to `http://localhost:4000/api` if it's missing:

```
VITE_API_URL=http://localhost:4000/api
```

Open http://localhost:5173. On first load the workspace fetches `GET /api/dashboards` and renders the most recent one; if the collection is empty (or the request fails) it runs a generation instead, so you always land on a populated dashboard. To watch the stream and the skeletons fill in, submit a prompt from the bar at the bottom.

## API

| Method | Route | What it does |
| --- | --- | --- |
| `POST` | `/api/generate-dashboard` | Streams the dashboard back as NDJSON. Emits a `meta` event (id, headline, layout, expected widget count), then one `widget` event per widget every ~500ms, then `done`. |
| `POST` | `/api/widget-action` | Applies an interaction to a persisted widget — `UPDATE_FIELDS` (form) or `EXECUTE_COMMAND` (command panel). Form values are re-validated against the widget's own rules; a violation returns `422` with a `fieldErrors` map. |
| `GET` | `/api/dashboards` | List persisted dashboards. |
| `GET` | `/api/dashboards/:id` | Fetch one, validated with Zod. |
| `GET` | `/health` | Liveness check. |

Streaming is plain NDJSON over `fetch` + a `ReadableStream` reader rather than SSE — it kept the server trivial (just `res.write(JSON.stringify(event) + "\n")`) and the client parser is a few lines.

## How the frontend is put together

### Dynamic component registry

The heart of it is `client/src/registry`. Incoming widgets are never rendered directly — they go through a resolver:

- `widget-registry.ts` is a plain map of `type -> React component` (`METRIC_CARD`, `DATA_TABLE`, `DYNAMIC_FORM`, `COMMAND_PANEL`, `BAR_CHART`).
- `WidgetRenderer.tsx` looks up the component for a widget's `type`. If there's no match it renders `UnknownWidget` instead of throwing. If there is a match, it renders it inside a `WidgetErrorBoundary` so one broken widget can't take down the rest of the board.
- Every widget coming off the stream is validated per-item with Zod (`schemas/stream-widget.schema.ts`). Each one is classified as `known` (matches a widget schema), `unknown` (has an id/type but an unfamiliar shape → graceful fallback), or `invalid` (dropped and logged). Adding a new widget type is: write the component, add a Zod schema, add one line to the registry.

Because the registry is the single place that maps a type to a component, it's also the natural code-splitting boundary. Every entry is a `React.lazy` import, so each widget type ships as its own chunk and a dashboard downloads only what it renders — a board with no table never fetches TanStack Table. `WidgetRenderer` puts the Suspense boundary *inside* the error boundary, with the same skeleton used during streaming as the fallback: the widget's footprint is identical whether it's waiting on the network stream or on its own chunk, and a chunk that fails to load degrades to the widget error card instead of a blank dashboard.

The split (gzipped): main bundle 152 kB, Recharts core 82 kB, bar chart 24 kB, data table 21 kB, dynamic form 13 kB, metric card 7 kB. Before splitting the single bundle was 295 kB.

### State and streaming

Generated widgets live in a single Zustand store (`stores/dashboard.store.ts`). The generate hook reads the NDJSON stream and, on the `meta` event, seeds an empty dashboard with the real Mongo id; each `widget` event appends to the store. Because the dashboard is persisted server-side first, the `dashboardId` the client holds is real — which is what makes widget actions work against it.

### Optimistic updates

All widget interactions share one hook, `hooks/use-optimistic-action.ts`. The pattern is: snapshot the widget from the store, apply the optimistic change immediately, fire the API call in the background, and on failure roll the widget back to the snapshot and raise a toast. On success it raises a success toast. The dynamic form and the command panel both go through this, so there's exactly one place that owns the snapshot/rollback/notify flow. Notifications are non-intrusive toasts (`stores/toast.store.ts` + a Framer `AnimatePresence` viewport), not inline error text.

### Dynamic form validation

Validation rules are data, not code. Each form field in the backend payload can carry `required`, `min`, `max`, `minLength`, `maxLength`, `pattern` (+ `patternMessage`), `helpText` and `placeholder`. On the client, `schemas/dynamic-form.schema.ts` compiles those rules into a Zod object at runtime and hands it to React Hook Form via `zodResolver` — so a form the backend has never sent before still validates correctly without touching `DynamicForm.tsx`. Errors render inline under the field with `aria-invalid` / `aria-describedby` wired up, and validation runs `onBlur`, then `onChange` once a field has already failed.

The server enforces the same rules a second time in `utils/validate-form-values.ts`, because `/api/widget-action` can be called without ever passing through the form. A rule violation returns `422` with a `fieldErrors` map; the form pushes those onto the matching inputs via `setError`, while the optimistic hook rolls the widget back and toasts. Backend-supplied regexes are compiled defensively — an invalid pattern is skipped with a warning rather than throwing.

### Theming with CSS variables

Colors are semantic tokens (`--color-surface`, `--color-fg`, `--color-border`, `--color-accent`, …) declared in `styles/global.css` and registered with Tailwind v4 via `@theme`, so utilities like `bg-surface` / `text-muted` compile to `var(--color-*)`. Switching theme just flips `data-theme` on `<html>`, which re-points every token — no per-component logic. Three themes ship (dark, light, high contrast), persisted to `localStorage`. High contrast is a token swap like the others — pure black surfaces separated by solid white borders instead of fills, a yellow accent, and a 3px `focus-visible` outline so keyboard focus survives on a monochrome background. Nothing in the widgets hardcodes a hex value, which keeps the whole thing theme-able for free.

### Layout-shift (CLS)

The `meta` event includes how many content widgets to expect. While the stream is still arriving, the grid fills the remaining slots with skeleton placeholders that carry the same column spans as the real widgets (a full-width table slot, half-width chart/form slots, etc.). So widgets swap into their final position instead of pushing the layout around as they arrive.

## Project layout

```
server/
  .env.example      copy to .env
  src/
    controllers/      route handlers (generation, dashboards, widget-action)
    services/         generation + persistence logic
    schemas/          Zod schemas for payloads and widgets
    models/           Mongoose dashboard model
    utils/            form-rule validation, AppError, async handler
    routes/  middlewares/
client/
  .env.example      copy to .env
  src/
    registry/         widget resolver, error boundary, fallback
    components/widgets/  the five widget types
    components/layout/   app shell, sidebar, history panel
    features/generation/ workspace + prompt bar
    hooks/            generation stream, optimistic action, form update
    stores/           dashboard, theme, toast, ui (zustand)
    schemas/          stream/widget validation + runtime form rules
    types/  styles/
```

## Deployment

The client is a static Vite bundle and the server is a long-lived Node process, so they go to different places.

### Client → Vercel

Point Vercel at the `client/` directory (it auto-detects Vite + pnpm):

- **Root Directory:** `client`
- **Build command:** `pnpm build`, **Output:** `dist`
- **Env var:** `VITE_API_URL` = your deployed API URL, e.g. `https://your-api.northflank.app/api`

`VITE_*` vars are baked in at build time, so set it before the build and redeploy when it changes.

### Server → Northflank (Docker)

There's a `server/Dockerfile` (multi-stage: build with the dev deps, run with prod deps only) and a `.dockerignore`. The generate endpoint streams NDJSON, which is why it wants a real Node host rather than a serverless function.

1. **MongoDB** — either a Northflank MongoDB addon or MongoDB Atlas. Copy the connection string.
2. **Combined service** → build from this Git repo:
   - Build type **Dockerfile**, build context `/server`, Dockerfile `/server/Dockerfile`.
3. **Ports** — expose `4000` (HTTP, public).
4. **Environment** — `MONGODB_URI`, `PORT=4000`, `NODE_ENV=production`.
5. Deploy, then check the logs for `MongoDB connected successfully` and hit `GET /health`.
6. Optional: seed the five dashboards with a one-off job running `node dist/seed.js` (compiled from `seed.ts`) against the same `MONGODB_URI`.

Then set the client's `VITE_API_URL` to the service URL. CORS is already open, so nothing else is needed.

## Trade-offs and things I'd do next

A few decisions worth calling out, since not all of them are obvious from the code:

- **The "LLM" is mocked.** There are five hand-written dashboard datasets (risk, system analytics, sales, fraud, web traffic). The generator matches the prompt against each dataset's keywords and, failing a match, rotates through them so every generation returns something different. The prompt bar suggests these as you type. It's all schema-valid widgets streamed on a timer — the point of the exercise was the rendering pipeline, so the interesting work is on the receiving end. Swapping in a real model would only touch the generation service; the same five datasets also back the seed script.
- **Optimistic form rollback is slightly asymmetric.** React Hook Form owns the input state, so a rollback reverts the *store* copy of the widget; the visible field keeps the value the user typed. In practice the toast is what communicates failure, and re-submitting is cheap, so I left it. Fully syncing RHF back to the snapshot would be the clean fix.
- **Charts are Recharts, and that isn't free.** The bar chart and the metric-card sparkline were hand-rolled SVG at first. Recharts buys a real axis, a hover layer, and sane resize behaviour, but it costs ~110 kB gzipped. That's paid for by code-splitting the registry (below) rather than by the initial load. Both charts stay on design tokens (`var(--color-accent)`, `var(--color-border)`) rather than literal hex, so they follow the theme — including high contrast — for free. Single series means no legend; the title names it. Values are readable from the y-axis and a direct label on the tallest bar, so the tooltip enhances rather than gates.
- **Reorder got cut.** I had drag-and-drop with dnd-kit working, but the interaction felt fiddly against the grouped grid, so I pulled it out (and the dependency) rather than ship something half-right. The layout is still a single responsive CSS grid with per-type column spans, which covers the "auto-layout" requirement without the drag.
- **Persistence is partial.** Dashboards and widget-action results are persisted to Mongo. Theme choice is client-only (localStorage), and the sidebar/history are static mock content — they're there for the shell, not wired to real data.
- **Two schema layers.** The stream is validated with a lenient per-widget schema (so unknown widgets degrade gracefully), while `GET /dashboards/:id` uses a stricter one. Metric `value` is intentionally `string | number` across both to avoid a format mismatch between the mock data and the sample payload.

If I kept going: back the reorder with a persisted layout, drive the sidebar/history from real records, and add a couple more widget archetypes to prove the registry scales.
