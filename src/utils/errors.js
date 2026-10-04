import { OLLAMA_MODEL } from '../config';

// Turns an error from the Ollama service into text the person can act on.
export function describeError(error) {
  switch (error?.kind) {
    case 'connection':
      return {
        title: "Couldn't connect to your local AI.",
        hint: 'Make sure Ollama is running and try again.',
      };
    case 'model':
      return {
        title: "Your local AI doesn't have this model yet.",
        hint: `Run "ollama pull ${OLLAMA_MODEL}" in a terminal, then try again.`,
      };
    case 'timeout':
      return {
        title: 'Your local AI took too long to answer.',
        hint: 'The model may still be loading. Wait a moment and try again.',
      };
    case 'empty':
    case 'invalid':
      return {
        title: "The AI's answer didn't come through properly.",
        hint: 'This can happen with small models. Trying again usually works.',
      };
    case 'server':
      return {
        title: 'Ollama returned an error.',
        hint: error.detail || 'Check the Ollama window for details, then try again.',
      };
    default:
      return {
        title: 'Something went wrong.',
        hint: 'Please try again.',
      };
  }
}
