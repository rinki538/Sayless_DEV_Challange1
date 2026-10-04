export default function PrivacyNote() {
  return (
    <footer className="mt-20 border-t border-line pt-6 text-sm leading-relaxed text-muted">
      <p className="flex items-start gap-2">
        <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Your conversations stay on your device.
      </p>
    </footer>
  );
}
