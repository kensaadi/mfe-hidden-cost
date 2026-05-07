# The Hidden Costs of Microfrontends — Interactive Edge Cases

## This is not a production-ready Module Federation setup. It is a React simulation built to make Microfrontend failure modes visible.



Companion app for the article *"The Hidden Costs of Microfrontends Nobody Talks About."*
Six interactive demos that make the architectural failure modes of microfrontends **visible**: design token drift, dependency mismatches, shared HTTP coupling, store synchronization issues, and the decision of whether to actually go distributed.

No real Module Federation. No real backend. Each demo simulates two or more "microfrontends" inside a single React application so the failure modes stay legible and screenshot-friendly.

## Why this exists

Most microfrontend tutorials stop at loading a remote `<HelloWorld />`. The real problems begin when you have 5 teams, 10 microfrontends, a shared design system, drifting versions, and independent releases. This app reproduces those problems on a single laptop, in a single tab.

## The six demos

| # | Tab | What it shows |
|---|---|---|
| 1 | **Token drift** | Two MFEs with their own `tailwind.config.js`. Different primary, different radius, different scale. Toggle to centralize. |
| 2 | **Shared theme** | The MUI counter-example: one `<ThemeProvider>` mutated at runtime, both MFEs update in the same frame. |
| 3 | **HTTP layer** | Isolated vs shared Axios, side by side. Rotate one token, push a breaking interceptor, watch the blast radius. |
| 4 | **Version hell** | Mount four MFEs against a host shell. Mismatched `react`/`@mui/material` versions break the singleton — simulated console shows the warnings you'd see in production. |
| 5 | **Shared store** | A Zustand-style cart shared across two MFEs. Flip "version drift" and watch the singleton silently double into two ghost stores. |
| 6 | **Should you?** | Six honest questions. Live recommendation: Modular Monolith / On the fence / Microfrontends. |

## Stack

- **Vite 5** — fast HMR, no config to fight
- **React 18 + TypeScript 5** — strict mode on
- **MUI 6** with `@emotion/react` — both the app shell *and* the "good case" in demo 2
- **Plain CSS / inline styles** in demo 1 to mimic the Tailwind-utility divergence without dual tooling

## Run it locally

```bash
npm install
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # tsc -b + production build
npm run preview  # serve the production build
```

## Project layout

```
src/
├── main.tsx
├── App.tsx                       # tabbed shell wiring the six demos
├── theme.ts                      # canonical MUI theme + design-token contract
├── components/
│   ├── DemoSection.tsx           # title + controls + takeaway wrapper
│   ├── FakeMfePane.tsx           # bordered "microfrontend" frame
│   ├── ConsoleOutput.tsx         # styled pseudo-DevTools for simulated errors
│   └── CodeBlock.tsx             # static syntax-block component
└── demos/
    ├── DesignTokenDrift.tsx
    ├── SharedThemeAdvantage.tsx
    ├── HttpLayerComparison.tsx
    ├── VersionHell.tsx
    ├── SharedStoreMinefield.tsx
    └── DecisionMatrix.tsx
```

## How the simulation works

- **Token drift / shared theme** — Both MFE panes mount in the same React tree. The "isolated" demo passes a different token object to each pane; the "shared" demo wraps them in one `ThemeProvider`. Same DOM, different sources of truth.
- **HTTP layer** — Two in-memory client objects (one per MFE for "isolated", one global for "shared") with a fake `request()` method. Buttons mutate `client.token` or `client.broken` and each pane logs what it observes.
- **Version hell** — A static table of MFE versions plus a host record. Mounting compares them and pushes simulated React / MUI warnings into the `ConsoleOutput` component.
- **Shared store** — A tiny `FakeStore` class with `subscribe` / `set`. Healthy mode: both MFE views point at the same instance. Drift mode: each points at its own instance, so increments don't cross.

The failure modes are real even if the runtime is staged — the same code paths exist in any Module Federation setup.

## Credits

Article and demos by **Ken Saadi**.
[GitHub](https://github.com/kensaadi) · [LinkedIn](https://linkedin.com/in/ken-saadi) · [dashforge-ui.com](https://dashforge-ui.com)
