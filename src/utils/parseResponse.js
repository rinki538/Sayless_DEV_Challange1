import { TONES } from './options';

// Small models sometimes wrap JSON in fences, add <think> blocks, or ignore the
// format entirely. These helpers turn whatever came back into clean data, or null.

const THINK_BLOCK = /<think>[\s\S]*?<\/think>/gi;

function clean(text) {
  return text.replace(THINK_BLOCK, '').replace(/```(?:json)?/gi, '').trim();
}

function parseJson(text) {
  const cleaned = clean(text);
  const candidates = [cleaned];

  // Models sometimes add a sentence before or after the JSON object.
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end > start) candidates.push(cleaned.slice(start, end + 1));

  for (const candidate of candidates) {
    try {
      const value = JSON.parse(candidate);
      if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    } catch {
      // Not valid JSON, try the next candidate.
    }
  }
  return null;
}

// Last resort: plain text such as "SOFT: ...\nNATURAL: ...\nDIRECT: ...".
function parseLabeled(text) {
  const labels = '(soft|natural|direct)';
  const pattern = new RegExp(
    `(?:^|\\n)\\s*[*#]*${labels}[*#]*\\s*[:\\-]\\s*([\\s\\S]*?)(?=\\n\\s*[*#]*${labels}[*#]*\\s*[:\\-]|$)`,
    'gi',
  );
  const found = {};
  for (const match of clean(text).matchAll(pattern)) {
    // Drop leftover markdown such as the closing ** of a bold label.
    found[match[1].toLowerCase()] = match[2].replace(/^[\s*#]+/, '');
  }
  return found;
}

function tidyReply(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^["“”]+|["“”]+$/g, '').trim();
}

function tidyList(value) {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
  return items
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim().replace(/^[•\-*]\s*/, ''))
    .filter(Boolean)
    .slice(0, 5);
}

export function parseReplies(text) {
  const source = parseJson(text) ?? parseLabeled(text);
  const replies = {};
  for (const { id } of TONES) {
    const reply = tidyReply(source[id]);
    if (!reply) return null;
    replies[id] = reply;
  }
  return replies;
}

export function parseThinking(text) {
  const source = parseJson(text);
  if (!source) return null;

  const asking = typeof source.asking === 'string' ? source.asking.trim() : '';
  const address = tidyList(source.address);
  const directions = tidyList(source.directions);
  if (!asking || (address.length === 0 && directions.length === 0)) return null;

  return { asking, address, directions };
}
