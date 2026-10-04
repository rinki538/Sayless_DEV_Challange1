import Button from './Button';

export default function ErrorMessage({ title, hint, onRetry }) {
  return (
    <div role="alert" className="rounded-3xl border border-danger/40 bg-danger-soft p-5">
      <p className="font-display text-lg font-semibold text-danger">{title}</p>
      <p className="mt-1 text-base text-ink">{hint}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  );
}
