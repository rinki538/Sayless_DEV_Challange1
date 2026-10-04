import { INTENTS } from '../utils/options';

export default function IntentSelector({ value, onChange, error }) {
  return (
    <fieldset aria-describedby={error ? 'intent-error' : undefined} className="min-w-0">
      <legend className="mb-3 font-display text-xl font-semibold tracking-tight">
        What do you want to communicate?
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {INTENTS.map((intent) => (
          <label key={intent.id} className="cursor-pointer">
            <input
              type="radio"
              name="intent"
              value={intent.id}
              checked={value === intent.id}
              onChange={() => onChange(intent.id)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-12 items-center rounded-full border border-line bg-surface px-5 text-base font-medium text-ink transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {intent.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id="intent-error" role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
