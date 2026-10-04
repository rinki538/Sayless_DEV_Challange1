// Central place for the Ollama settings.
// Change the defaults below, or override them with a .env file (see .env.example).

export const OLLAMA_BASE_URL = (
  import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434'
).replace(/\/+$/, '');

// Any model you have pulled locally works, e.g. "llama3.2:3b" or "gemma3:4b".
export const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'qwen3:4b';

export const OLLAMA_GENERATE_URL = `${OLLAMA_BASE_URL}/api/generate`;

// The first request can be slow while the model loads into memory.
export const OLLAMA_TIMEOUT_MS = 120_000;
