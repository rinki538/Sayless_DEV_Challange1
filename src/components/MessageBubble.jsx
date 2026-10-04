// Shows the message the person received, as plain text.
export default function MessageBubble({ message }) {
  return (
    <blockquote
      aria-label="The message you received"
      className="m-0 max-w-xl whitespace-pre-wrap break-words rounded-[1.5rem_1.5rem_1.5rem_0.4rem] bg-bubble px-5 py-4 text-base leading-relaxed text-ink line-clamp-4"
    >
      {message}
      
    </blockquote>
    
  );
}
