function ThemeToggle({ theme, onToggle }) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:border-accent"
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        </svg>
      )}
    </button>
  );
}

// Full header on the start screen; a slim wordmark once results are showing.
export default function Header({ compact, theme, onToggleTheme }) {
  return (
    <header>
      <div className="flex h-11 items-center justify-between">
        {compact ? (
          <p className="font-display text-xl font-bold tracking-tight">SayLess</p>
        ) : (
          <span />
        )}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      {!compact && (
        <div className="mt-10 sm:mt-14">
          <h1 className="font-display text-[clamp(3.5rem,13vw,6.5rem)] font-extrabold leading-none tracking-[-0.045em]">
            SayLess
          </h1>
          <p className="mt-5 font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Find the words. Keep your voice.
          </p>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-muted">
            Turn difficult conversations into words that actually sound like you.
          </p>
        </div>
      )}
    </header>
  );
}
