import Button from './Button';

const PLACEHOLDER = 'yeah sorry 😭\nwill call u later\nokay I\'ll check';

export default function StyleInput({ open, onToggle, value, onChange }) {
  return (
    <div>
      <Button
        variant="secondary"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="style-panel"
        className="border-dashed"
      >
        Make it sound like me
      </Button>

      {open && (
        <div id="style-panel" className="mt-4">
          <label htmlFor="writing-style" className="mb-2 block text-base font-medium">
            Paste 2–3 examples of how you normally text.
          </label>
          <textarea
            id="writing-style"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={4}
            placeholder={PLACEHOLDER}
            className="block w-full resize-y rounded-3xl border border-line bg-surface px-5 py-4 text-base leading-relaxed text-ink placeholder:text-muted"
          />
          <p className="mt-2 text-sm text-muted">
            Saved in this browser only. Clear the box to remove it.
          </p>
        </div>
      )}
    </div>
  );
}
