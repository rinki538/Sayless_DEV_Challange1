import Button from './Button';

export default function ResultActions({ disabled, onRegenerate, onEdit, onStartOver }) {
  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
      <Button onClick={onRegenerate} disabled={disabled}>
        Regenerate
      </Button>
      <Button onClick={onEdit} disabled={disabled}>
        Edit my choices
      </Button>
      <Button variant="ghost" onClick={onStartOver} disabled={disabled}>
        Start Over
      </Button>
    </div>
  );
}
