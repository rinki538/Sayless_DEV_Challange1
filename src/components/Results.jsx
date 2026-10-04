import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ReplyCard from './ReplyCard';
import { TONES } from '../utils/options';

export default function Results({ message, replies, tone }) {
  const heading = useRef(null);

  // Move focus to the heading so keyboard and screen-reader users land on the results.
  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div>
      <MessageBubble message={message} />

      <h2
        ref={heading}
        tabIndex={-1}
        className="mt-10 font-display text-4xl font-bold tracking-tight focus:outline-none"
      >
        Your options
      </h2>
      <p className="mt-2 max-w-lg text-lg text-muted">
        You don&apos;t have to use any of them. Pick the one that feels like you.
      </p>

      <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-3">
        {TONES.map((item, index) => (
          <li key={item.id}>
            <ReplyCard label={item.label} text={replies[item.id]} chosen={item.id === tone} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
}
