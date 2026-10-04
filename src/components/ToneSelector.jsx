import { TONES } from '../utils/options';

export default function ToneSelector({ value, onChange }) {
  const selected = TONES.find((tone) => tone.id === value);

  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 font-display text-xl font-semibold tracking-tight">
        How should it sound?
      </legend>
      <div className="grid grid-cols-3 gap-1.5 rounded-full bg-bubble p-1.5">
        {TONES.map((tone) => (
          <label key={tone.id} className="cursor-pointer">
            <input
              type="radio"
              name="tone"
              value={tone.id}
              checked={value === tone.id}
              onChange={() => onChange(tone.id)}
              className="peer sr-only"
            />
            <span className="flex min-h-12 items-center justify-center rounded-full px-2 text-base font-semibold text-ink transition-colors hover:bg-surface peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {tone.label}
            </span>
          </label>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">{selected?.hint}</p>
    </fieldset>
  );
}
