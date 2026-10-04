import Button from './Button';

export default function MessageInput({ value, onChange, onSubmit, onClear, error }) {
  function handleKeyDown(event) {
    // Ctrl+Enter (or Cmd+Enter on Mac) submits from the textarea.
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div>
      <label htmlFor="message" className="mb-3 block font-display text-xl font-semibold tracking-tight">
        What did they say?
      </label>
      <textarea
        id="message"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={6}
        placeholder="Paste the message here..."
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? 'message-error' : 'message-tip'}
        className="block min-h-44 w-full resize-y rounded-[1.75rem_1.75rem_1.75rem_0.5rem] border border-transparent bg-bubble px-6 py-5 text-lg leading-relaxed text-ink placeholder:text-muted"
      />
      {error && (
        <p id="message-error" role="alert" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between gap-3">
        <p id="message-tip" className="hidden text-sm text-muted sm:block">
          Ctrl + Enter (⌘ + Enter on Mac) finds your words.
        </p>
        <Button
          variant="ghost"
          onClick={onClear}
          disabled={!value}
          aria-label="Reset message"
          className="px-3 py-1 text-sm"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
