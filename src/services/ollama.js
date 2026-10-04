// Everything that talks to Ollama lives in this file.
// API reference: POST /api/generate with "stream": false returns one JSON object
// whose "response" field holds the model's text.

import { OLLAMA_GENERATE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT_MS } from '../config';
import {
  REPLY_SYSTEM,
  THINK_SYSTEM,
  STRICT_REMINDER,
  buildReplyPrompt,
  buildThinkPrompt,
} from '../utils/prompts';
import { parseReplies, parseThinking } from '../utils/parseResponse';

// kind: 'connection' | 'timeout' | 'model' | 'server' | 'empty' | 'invalid'
export class OllamaError extends Error {
  constructor(kind, detail = '') {
    super(detail || kind);
    this.name = 'OllamaError';
    this.kind = kind;
    this.detail = detail;
  }
}

// JSON schemas let Ollama force the shape of the answer (Ollama 0.5 or newer).
const REPLIES_SCHEMA = {
  type: 'object',
  properties: {
    soft: { type: 'string' },
    natural: { type: 'string' },
    direct: { type: 'string' },
  },
  required: ['soft', 'natural', 'direct'],
};

const THINKING_SCHEMA = {
  type: 'object',
  properties: {
    asking: { type: 'string' },
    address: { type: 'array', items: { type: 'string' } },
    directions: { type: 'array', items: { type: 'string' } },
  },
  required: ['asking', 'address', 'directions'],
};

// Natural-sounding text wants some randomness, which also makes "Regenerate" useful.
const SAMPLING = { temperature: 0.8, top_p: 0.9 };

async function callOllama(body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(OLLAMA_GENERATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail = typeof data.error === 'string' ? data.error : '';
      if (response.status === 404 || /not found/i.test(detail)) throw new OllamaError('model', detail);
      throw new OllamaError('server', detail);
    }
    return typeof data.response === 'string' ? data.response : '';
  } catch (error) {
    if (error instanceof OllamaError) throw error;
    if (error.name === 'AbortError') throw new OllamaError('timeout');
    // fetch() rejects with a TypeError when nothing is listening on the port.
    throw new OllamaError('connection');
  } finally {
    clearTimeout(timer);
  }
}

async function postGenerate(body) {
  try {
    return await callOllama(body);
  } catch (error) {
    // Some models do not support the "think" option. Retry once without it.
    if (error.kind === 'server' && /think/i.test(error.detail)) {
      const withoutThink = { ...body };
      delete withoutThink.think;
      return callOllama(withoutThink);
    }
    throw error;
  }
}

// Asks the model, parses the answer, and retries once with a stricter prompt.
async function generateStructured({ system, prompt, schema, parse, maxTokens }) {
  const base = {
    model: OLLAMA_MODEL,
    system,
    stream: false,
    think: false, // qwen3 can "think" first; we only want the final answer.
    keep_alive: '10m',
  };

  const attempts = [
    { prompt, format: schema, options: { ...SAMPLING, num_predict: maxTokens } },
    {
      prompt: prompt + STRICT_REMINDER,
      format: 'json',
      options: { ...SAMPLING, temperature: 0.4, num_predict: maxTokens },
    },
  ];

  let failure = 'empty';
  for (const attempt of attempts) {
    const text = await postGenerate({ ...base, ...attempt });
    const parsed = parse(text);
    if (parsed) return parsed;
    failure = text.trim() ? 'invalid' : 'empty';
  }
  throw new OllamaError(failure);
}

export function generateReplies({ message, intent, tone, writingStyle }) {
  return generateStructured({
    system: REPLY_SYSTEM,
    prompt: buildReplyPrompt({ message, intent, tone, writingStyle }),
    schema: REPLIES_SCHEMA,
    parse: parseReplies,
    maxTokens: 600,
  });
}

export function generateThinking({ message }) {
  return generateStructured({
    system: THINK_SYSTEM,
    prompt: buildThinkPrompt({ message }),
    schema: THINKING_SCHEMA,
    parse: parseThinking,
    maxTokens: 700,
  });
}
