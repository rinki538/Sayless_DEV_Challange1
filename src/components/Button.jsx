const VARIANTS = {
  primary: 'bg-accent text-on-accent hover:brightness-110',
  secondary: 'border border-line bg-surface text-ink hover:border-accent',
  ghost: 'text-muted hover:text-ink',
};

// Shared button styling. Pass type="submit" when needed; it defaults to "button".
export default function Button({ variant = 'secondary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
