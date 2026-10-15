const Logo = () => (
  <svg
    viewBox="0 0 4 4"
    className="size-8"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect width="2" height="2" fill="#f472b6" />
    <rect x="2" width="2" height="2" fill="#a78bfa" />
    <rect y="2" width="2" height="2" fill="#38bdf8" />
    <rect x="2" y="2" width="2" height="2" fill="#facc15" />
  </svg>
);

const Header = () => (
  <header className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 pt-6 pb-2 sm:px-6">
    <Logo />
    <div className="flex-1">
      <h1 className="font-pixel text-2xl leading-none tracking-wide">Pixels</h1>
      <p className="mt-1 text-xs text-ink-400">
        Count pixels, match them to a bead palette and estimate the cost.
      </p>
    </div>
    <a
      href="https://github.com/lexcast/pixels"
      target="_blank"
      rel="noreferrer"
      className="rounded-lg border border-ink-700 px-3 py-1.5 text-xs text-ink-300 transition hover:border-ink-600 hover:text-ink-100"
    >
      GitHub
    </a>
  </header>
);

export default Header;
