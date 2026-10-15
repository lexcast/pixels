const Panel = ({ title, description, action, children, className = "" }) => (
  <section
    className={`rounded-2xl border border-ink-700/70 bg-ink-850/80 p-4 shadow-lg shadow-black/20 backdrop-blur ${className}`}
  >
    {(title || action) && (
      <header className="mb-3 flex items-start gap-2">
        <div className="flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-400">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-xs text-ink-400/80">{description}</p>
          )}
        </div>
        {action}
      </header>
    )}
    {children}
  </section>
);

export default Panel;
