# Pixels
![CI DEPLOY](https://github.com/lexcast/pixels/workflows/CI%20DEPLOY/badge.svg)

See it in action [here](https://lexcast.github.io/pixels/).

Upload pixel art and:

- count the pixels of each sprite and of all of them together,
- match every color to the closest one in a palette (CSS, Tailwind, Artkal beads… or one generated from your images),
- choose the matching algorithm (Euclidean, ΔE76, ΔE94 or CIEDE2000),
- estimate the cost per pixel (handy for hama/perler beads).

Everything runs in the browser; images are never uploaded. Custom palettes and settings are saved in `localStorage`.

## Stack

[Vite](https://vite.dev) · [React 19](https://react.dev) · [Tailwind CSS 4](https://tailwindcss.com) · [Vitest](https://vitest.dev) + Testing Library.

## Development

Requires Node.js 22+.

```sh
npm install
npm run dev       # dev server
npm test          # tests in watch mode (npm run test:run for a single run)
npm run lint      # ESLint
npm run format    # Prettier
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Pushing to `master` runs lint, tests and the build, then deploys `dist/` to GitHub Pages.
