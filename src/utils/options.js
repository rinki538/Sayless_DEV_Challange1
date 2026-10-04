// The choices shown in the UI. `goal` is only used inside the prompt.

export const INTENTS = [
  { id: 'apologize', label: 'Apologize', goal: 'say sorry and own my part, without excuses or over-explaining' },
  { id: 'explain', label: 'Explain', goal: 'explain my side or what happened, clearly and without making excuses' },
  { id: 'say-no', label: 'Say No', goal: 'turn something down, clearly and without being harsh' },
  { id: 'boundary', label: 'Set a Boundary', goal: 'state a limit about what I can or cannot do, calmly and without attacking them' },
  { id: 'thank', label: 'Thank Them', goal: 'thank them and show I genuinely appreciate it' },
  { id: 'cheer-up', label: 'Cheer Them Up', goal: 'show I care and lift their mood, without claiming to know exactly how they feel' },
  { id: 'more-time', label: 'Ask for More Time', goal: 'ask for more time honestly, without making up a reason' },
  { id: 'make-right', label: 'Make Things Right', goal: 'take responsibility and offer to fix things, without promising specifics I have not mentioned' },
];

// The tone ids double as the keys of the AI's JSON answer: soft / natural / direct.
export const TONES = [
  { id: 'soft', label: 'Soft', hint: 'Gentle and warm.', brief: 'a gentle, warm and empathetic version' },
  { id: 'natural', label: 'Natural', hint: 'How you would really text it.', brief: 'a realistic everyday texting version' },
  { id: 'direct', label: 'Direct', hint: 'Clear and to the point.', brief: 'a clear, straightforward version that says it plainly but is never rude' },
];

export const DEFAULT_TONE = 'natural';
