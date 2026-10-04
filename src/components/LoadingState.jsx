export default function LoadingState({ label = 'Finding the words...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-5 rounded-[1.75rem_1.75rem_0.5rem_1.75rem] bg-accent-soft px-6 py-5 text-accent-ink"
    >
      <span className="typing-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <div>
        <p className="font-display text-lg font-semibold">{label}</p>
        <p className="text-sm opacity-80">The first request can take longer while the model loads.</p>
      </div>
    </div>
  );
}
