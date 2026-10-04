import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

function Section({ title, children }) {
  return (
    <section className="mt-7 first:mt-0">
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-muted">{title}</h3>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="m-0 list-none space-y-2 p-0">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-lg leading-relaxed">
          <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// "Just help me think": explains the message without writing a reply.
export default function ThinkingMode({ message, data }) {
  const heading = useRef(null);

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div className="max-w-2xl">
      <MessageBubble message={message} />

      <h2
        ref={heading}
        tabIndex={-1}
        className="mt-10 font-display text-4xl font-bold tracking-tight focus:outline-none"
      >
        Let&apos;s think it through
      </h2>

      <div className="mt-8 rounded-[1.75rem] border border-line bg-surface p-6 sm:p-8">
        <Section title="What they're asking">
          <p className="text-xl leading-relaxed">{data.asking}</p>
        </Section>

        {data.address.length > 0 && (
          <Section title="Things you could address">
            <BulletList items={data.address} />
          </Section>
        )}

        {data.directions.length > 0 && (
          <Section title="Directions you could take">
            <BulletList items={data.directions} />
          </Section>
        )}
      </div>

      <p className="mt-6 font-display text-xl font-semibold tracking-tight">You decide what you want to say.</p>
    </div>
  );
}
