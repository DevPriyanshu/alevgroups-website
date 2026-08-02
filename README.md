# alevgroupss Website

The public website for alevgroupss, built with React, TypeScript, Vite, and React Router.

## Requirements

- Node.js 20 or later
- npm 10 or later

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

`npm run build` writes the production site to `dist/`.

## Deployment

Deploy with:

```bash
npm run deploy
```

The project uses browser-based URLs such as `/home` and `/about`. The included `public/404.html` restores these routes when GitHub Pages serves a direct link or page refresh.

The production custom domain is configured in `public/CNAME`.
