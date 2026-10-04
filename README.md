# SayLess

### Find the words. Keep your voice.

SayLess is a private, local-first writing assistant for people who know what they want to say but need help putting it into words. It turns a difficult message into three short reply drafts, or helps you think through the message without drafting a reply.

**Your conversations stay on your device when you use Ollama locally.**

> Built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).

## See it in action

SayLess runs in your browser and connects directly to Ollama on your computer. There is no hosted demo because generation requires a running local Ollama model. Follow [Getting started](#getting-started) to try it.

## Why SayLess?

Awkward or sensitive messages can be hard to answer. Cloud chatbots may require sharing private conversations and can produce replies that do not sound like you. SayLess offers a local alternative: choose what you want to communicate, pick a tone, and get a few drafts to edit or ignore.

## Features

- Generate **Soft**, **Natural**, and **Direct** reply options for an incoming message.
- Choose an intent such as apologizing, explaining, saying no, or setting a boundary.
- Optionally provide a writing sample to guide sentence length, casualness, punctuation, capitalization, and emoji use.
- Use **Just help me think** to understand what a message asks and consider possible response directions, without generating a reply.
- Copy a reply, regenerate options, edit your choices, or start over.
- Use light or dark mode and keyboard-friendly controls.
- Handle missing models, connection problems, timeouts, and malformed model output with clear error states.

## How it works

```text
Your browser -> Ollama on your computer -> Local model -> Validated result -> Reply cards
```

1. The React app collects the message, intent, tone, and optional writing sample.
2. Prompt builders prepare the request and instruct the model to return structured JSON.
3. `src/services/ollama.js` sends a request to Ollama's `/api/generate` endpoint.
4. Response parsers validate and normalize the model output before the UI displays it as text.

There is no application server, database, account, or hosted AI API. By default, the app sends requests to `http://localhost:11434`. If you configure Ollama at another address, the message is sent to that address instead.

## Tech stack

- React 19
- Vite
- Tailwind CSS 4
- [Ollama](https://ollama.com/) for local inference
- Default model: `qwen3:4b` (you can configure another model supported by Ollama)

## Getting started

### Requirements

- Node.js `20.19+` or `22.12+`
- [Ollama](https://ollama.com/download) installed and running

### Install and run

In PowerShell, from the project folder:

```powershell
ollama pull qwen3:4b
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Ollama normally runs in the background after installation. If it is not running, start it in a separate terminal:

```powershell
ollama serve
```

The first response can take longer while Ollama loads the model into memory. Generation speed also depends on your computer and the selected model.

## Configure Ollama

The defaults are in `src/config.js`. To override them, copy the example environment file and edit it:

```powershell
Copy-Item .env.example .env
```

```env
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=qwen3:4b
```

Restart the Vite development server after changing `.env`. Pull the selected model first with `ollama pull <model-name>`.

If you use a non-local Ollama address, configure Ollama's CORS origins to allow the app's origin. Only use trusted Ollama servers for private conversations.

## Privacy

- Messages and generated replies stay in the open browser tab; the app does not save conversation text.
- The optional writing sample is saved in browser `localStorage` so it can be reused; clear it in the app to remove it.
- The selected theme is also saved in `localStorage`.
- The app does not include analytics or tracking.
- With the default configuration, prompts are sent to Ollama at `localhost`. If you set a remote Ollama URL, your prompts go to that server.

## Project structure

```text
src/
├── App.jsx                 App state, validation, and screen flow
├── config.js               Ollama URL, model, and timeout settings
├── components/             Form controls, result views, and shared UI
├── hooks/useTheme.js       Theme preference and document theme
├── services/ollama.js      Ollama requests and generation error handling
└── utils/
    ├── prompts.js          Reply and thinking prompt builders
    ├── parseResponse.js    Model output validation and parsing
    ├── errors.js           User-facing error descriptions
    └── storage.js          Safe localStorage helpers
```

## Build for production

```powershell
npm run build
npm run preview
```

The production build is written to `dist/`. The browser app still needs to reach an Ollama server to generate responses.

## Contributing

Suggestions, bug reports, and pull requests are welcome. For a useful bug report, include the steps to reproduce it and whether you can reproduce it with the default Ollama model.

## License

SayLess is available under the [MIT License](./LICENSE).
