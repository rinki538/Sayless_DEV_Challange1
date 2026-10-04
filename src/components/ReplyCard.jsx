import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { copyText } from '../utils/clipboard';

export default function ReplyCard({ label, text, chosen, index }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'copied' | 'failed'
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy() {
    const ok = await copyText(text);
    setStatus(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 1800);
  }

  return (
    <article
      className="arrive flex h-full flex-col rounded-[1.75rem_1.75rem_0.5rem_1.75rem] bg-accent-soft p-6 text-accent-ink"
      style={{ animationDelay: `${index * 110}ms` }}
    >
      <h3 className="font-display text-sm font-bold uppercase tracking-widest">{label}</h3>
      {chosen && <p className="mt-1 text-sm opacity-80">The tone you chose</p>}
      <p className="my-5 whitespace-pre-wrap break-words text-xl leading-relaxed">{text}</p>
      <div className="mt-auto">
        <Button onClick={handleCopy} className="px-5 py-2.5">
          {status === 'copied' ? 'Copied!' : status === 'failed' ? 'Copy failed' : 'Copy'}
          <span className="sr-only"> {label.toLowerCase()} reply</span>
        </Button>
        <span role="status" className="sr-only">
          {status === 'copied' ? 'Copied to clipboard' : ''}
        </span>
      </div>
    </article>
  );
}
