## Goal

Convert this TanStack Start project from Cloudflare Workers / static Vite output to a Vercel SSR deployment via GitHub integration.

## Why you're getting 404: NOT_FOUND on Vercel

Vercel auto-detects Vite and serves only the static `dist/` output. The current build produces a Cloudflare Worker bundle (via `@cloudflare/vite-plugin` baked into `@lovable.dev/vite-tanstack-config`), not Vercel serverless functions. There's no `index.html` at a path Vercel recognizes and no SSR function, so every request 404s.

## Changes

### 1. Swap the Vite config to TanStack Start + Nitro for Vercel

Use Nitro's Vercel preset. This is the current supported path for TanStack Start SSR on Vercel and writes the Vercel Build Output API structure under `.vercel/output`:

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: 'vercel' }),
    viteReact(),
  ],
})
```

### 2. Remove Cloudflare-specific files & deps

- Delete `wrangler.jsonc`
- Delete `src/server.ts` (Cloudflare Worker wrapper — Vercel preset emits its own entry)
- Simplify `src/start.ts` (keep the error middleware, drop Cloudflare assumptions)
- `package.json`: remove `@cloudflare/vite-plugin`, `@lovable.dev/vite-tanstack-config`; add `nitro`

### 3. Add `vercel.json`

```json
{
  "framework": null,
  "installCommand": "bun install --frozen-lockfile",
  "buildCommand": "bun run build"
}
```

Nitro writes the proper `.vercel/output/` structure (functions + static assets + config.json) so Vercel routes SSR correctly with no SPA fallback rewrite.

### 4. Keep root error boundary

`src/routes/__root.tsx` already has `errorComponent` / `notFoundComponent` — no change.

### 5. Deployment steps (you do these after I push)

1. Connect this Lovable project to GitHub (Plus menu → GitHub → Connect)
2. In Vercel: New Project → Import the GitHub repo
3. Leave framework preset as "Other" — `vercel.json` handles it
4. Deploy

## Trade-offs (confirming you accept these)

- Lovable's **Publish** button will no longer work — this project will only deploy via Vercel + GitHub.
- The previous Cloudflare-only SSR error wrapper (`src/server.ts` + h3 swallow normalization) is removed. Vercel's Node runtime surfaces SSR errors directly in Vercel logs, so it's not needed.
- Live preview inside Lovable should still work (Vite dev server is framework-agnostic), but if it breaks, it can be restored.

## Files touched

- ✏️ `vite.config.ts` — rewritten
- ✏️ `src/start.ts` — simplified
- ✏️ `package.json` — deps swap
- ➕ `vercel.json`
- 🗑️ `wrangler.jsonc`
- 🗑️ `src/server.ts`
- 🗑️ `src/lib/error-capture.ts` (Cloudflare-only)
