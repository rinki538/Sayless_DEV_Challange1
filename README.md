# SayLess

**Find the words. Keep your voice.** A private writing helper that suggests ways to reply to a difficult message, powered by an open-weight AI running on your own computer.

*Built for the "Build for a Friend" hackathon.*

## Problem

A friend of mine often gets messages that are awkward or hard to answer. They know what they feel, but they struggle to find the right words. Asking a cloud chatbot means pasting private conversations into someone else's servers, and the answers often sound like nobody they know.

## Solution

SayLess takes the message you received, what you want to communicate, and how you want it to sound. It then offers three possible replies:

- **Soft**: gentle and empathetic
- **Natural**: how you would really text it
- **Direct**: clear and straightforward

You choose what to send, or nothing at all. The AI is told never to pick a "right" answer, never to invent facts, and never to guess what the other person feels.

## Why Open Source AI?

- **Local inference.** The model runs on your machine through [Ollama](https://ollama.com). The app never talks to a hosted AI provider.
- **Privacy.** Conversations are processed by your own Ollama instance instead of a cloud AI service.
- **No paid AI API.** No API keys, no usage bills, no account.
- **Swappable model.** Change one setting to try `llama3.2:3b`, `gemma3:4b`, `mistral` or any other model Ollama can run.
- **Runs on your own hardware.** A small 4B model runs on an ordinary laptop.
- **Easy experiments.** Open-weight models can be downloaded, compared and replaced freely, which makes tuning prompts for this use case fast.

## Features

- Paste a message, pick an intent (Apologize, Explain, Say No, Set a Boundary, Thank Them, Cheer Them Up, Ask for More Time, Make Things Right) and a tone
- Three reply options with one-click **Copy**
- **Regenerate** and **Start Over**
- **Make it sound like me**: paste a few of your own texts and the replies follow your sentence length, casualness, punctuation, capitalization and emoji use
- **Just help me think**: explains what the message is asking and what you could address, without writing a reply
- Loading, empty and error states (Ollama not running, missing model, timeout, malformed or empty AI output)
- One automatic retry with a stricter prompt, plus a fallback parser, when the model returns bad JSON
- Light and dark mode, `Ctrl/⌘ + Enter` shortcut, responsive layout, keyboard and screen-reader friendly

## Tech Stack

- React 19 and Vite
- Tailwind CSS 4
- Ollama
- A local open-weight model (default `qwen3:4b`)

No database, no authentication, no backend.

## Architecture

```
React (browser)  ->  Ollama (localhost:11434)  ->  Local AI model  ->  JSON response  ->  3 reply cards
```

1. The form collects the message, intent, tone and optional writing sample.
2. `src/utils/prompts.js` builds the prompt.
3. `src/services/ollama.js` is the only file that calls Ollama (`POST /api/generate`, `stream: false`, JSON schema in `format`).
4. `src/utils/parseResponse.js` validates the answer (and repairs common problems).
5. The result renders as plain text. AI output is never inserted as HTML.

## Setup (Windows)

You need [Node.js](https://nodejs.org) 20.19 or newer and [Ollama](https://ollama.com/download).

1. **Install Ollama** from https://ollama.com/download (or in PowerShell: `winget install Ollama.Ollama`).
2. **Download the model** (about 2.5 GB, once):

   ```
   ollama pull qwen3:4b
   ```

3. **Make sure Ollama is running.** After installing, Ollama normally starts by itself and sits in the system tray. If the app later says it can't connect, start it manually:

   ```
   ollama serve
   ```

   (If this says the address is already in use, Ollama is already running. That is fine.)

4. **Install and start the app** from this folder:

   ```
   npm install
   npm run dev
   ```

5. Open the address Vite prints, usually http://localhost:5173.

### Change the model or address

Copy the example settings file, edit it, and restart `npm run dev`:

```
copy .env.example .env
```

```
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=qwen3:4b
```

The defaults live in `src/config.js`. Remember to `ollama pull` any new model first.

### Troubleshooting

- **"Couldn't connect to your local AI."** Ollama isn't running. Start it (step 3). Check with `ollama list`.
- **"Your local AI doesn't have this model yet."** Run `ollama pull qwen3:4b` (or the model you configured).
- **First answer is slow.** The model is loading into memory. Later answers are faster.
- **Browser blocks the request (CORS).** Ollama allows `localhost` by default. If you open the app from another address, allow it with `setx OLLAMA_ORIGINS "http://your-address:5173"` and restart Ollama.

## Project Structure

```
sayless/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx                  state and screen flow
    ├── config.js                Ollama URL, model, timeout
    ├── index.css                theme tokens, animations
    ├── components/
    │   ├── Header.jsx
    │   ├── MessageInput.jsx
    │   ├── IntentSelector.jsx
    │   ├── ToneSelector.jsx
    │   ├── StyleInput.jsx
    │   ├── GenerateButton.jsx
    │   ├── Button.jsx
    │   ├── LoadingState.jsx
    │   ├── ErrorMessage.jsx
    │   ├── MessageBubble.jsx
    │   ├── Results.jsx
    │   ├── ReplyCard.jsx
    │   ├── ThinkingMode.jsx
    │   ├── ResultActions.jsx
    │   └── PrivacyNote.jsx
    ├── hooks/
    │   └── useTheme.js
    ├── services/
    │   └── ollama.js            all Ollama calls live here
    └── utils/
        ├── options.js           intents and tones
        ├── prompts.js           prompt builders
        ├── parseResponse.js     JSON validation and fallback parsing
        ├── errors.js            error text shown to the user
        ├── clipboard.js
        └── storage.js
```

## Demo

Message received:

> Why do you always reply so late?

Choose **Explain**, tone **Natural**, then **Find My Words**. You get three options, for example (wording varies by model and run):

- **Soft**: "Sorry for the slow replies. I don't mean to leave you hanging."
- **Natural**: "yeah I'm bad at replying, sorry. I'll try to be quicker"
- **Direct**: "I reply late because I don't always see messages right away."

Choose **Just help me think** instead and you get a short breakdown (what they're asking, things you could address, directions you could take) that ends with "You decide what you want to say."

## Privacy

- Messages are sent only to the Ollama address you configure (`http://localhost:11434` by default), so they are processed by your local Ollama instance rather than a cloud AI provider.
- Conversations are held in memory while the page is open. They are never saved and never logged.
- `localStorage` holds only your theme and, if you use "Make it sound like me", your writing sample. Clear the box to remove it.
- Fonts are bundled with the app, and there is no analytics or tracking.
- If you point `VITE_OLLAMA_BASE_URL` at another computer, your messages travel to that computer. Keep it on `localhost` for the privacy described above.
