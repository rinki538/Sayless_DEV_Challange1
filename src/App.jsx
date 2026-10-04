import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import MessageInput from './components/MessageInput';
import IntentSelector from './components/IntentSelector';
import ToneSelector from './components/ToneSelector';
import StyleInput from './components/StyleInput';
import GenerateButton from './components/GenerateButton';
import Button from './components/Button';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import Results from './components/Results';
import ThinkingMode from './components/ThinkingMode';
import ResultActions from './components/ResultActions';
import PrivacyNote from './components/PrivacyNote';
import { generateReplies, generateThinking } from './services/ollama';
import { useTheme } from './hooks/useTheme';
import { describeError } from './utils/errors';
import { DEFAULT_TONE, INTENTS } from './utils/options';
import { readStored, removeStored, writeStored } from './utils/storage';

const STYLE_KEY = 'sayless-writing-style';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // What the person has entered. Never written to storage.
  const [message, setMessage] = useState('');
  const [intentId, setIntentId] = useState(null);
  const [tone, setTone] = useState(DEFAULT_TONE);

  // The optional writing sample is the only personal text we keep (in localStorage).
  const [writingStyle, setWritingStyle] = useState(() => readStored(STYLE_KEY) ?? '');
  const [styleOpen, setStyleOpen] = useState(() => Boolean(readStored(STYLE_KEY)));

  const [fieldErrors, setFieldErrors] = useState({});
  const [screen, setScreen] = useState('form'); // 'form' | 'results'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [request, setRequest] = useState(null);
  const [result, setResult] = useState(null); // { mode, data }

  useEffect(() => {
    if (writingStyle.trim()) writeStored(STYLE_KEY, writingStyle);
    else removeStored(STYLE_KEY);
  }, [writingStyle]);

  const run = useCallback(async (req) => {
    setLoading(true);
    setError(null);
    try {
      const data = req.mode === 'think' ? await generateThinking(req) : await generateReplies(req);
      setResult({ mode: req.mode, data });
      setScreen('results');
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  function submit(mode) {
    if (loading) return;

    // Validate before calling Ollama, so empty requests never reach it.
    const errors = {};
    if (!message.trim()) errors.message = 'Paste the message first.';
    if (mode === 'reply' && !intentId) errors.intent = 'Choose what you want to communicate.';
    setFieldErrors(errors);
    if (errors.message) document.getElementById('message')?.focus();
    if (Object.keys(errors).length > 0) return;

    const req = {
      mode,
      message: message.trim(),
      intent: INTENTS.find((item) => item.id === intentId),
      tone,
      writingStyle: styleOpen ? writingStyle.trim() : '',
    };
    setRequest(req);
    run(req);
  }

  function handleMessageChange(value) {
    setMessage(value);
    setFieldErrors((current) => ({ ...current, message: undefined }));
  }

  function handleIntentChange(id) {
    setIntentId(id);
    setFieldErrors((current) => ({ ...current, intent: undefined }));
  }

  function handleEdit() {
    setError(null);
    setScreen('form');
  }

  function handleStartOver() {
    setMessage('');
    setIntentId(null);
    setTone(DEFAULT_TONE);
    setFieldErrors({});
    setError(null);
    setResult(null);
    setRequest(null);
    setScreen('form');
  }

  // On the results screen "retry" repeats the same request. On the form it re-submits
  // whatever is currently entered, in case the person edited it after the error.
  const retryResults = request ? () => run(request) : undefined;
  const retryForm = () => submit(request?.mode ?? 'reply');
  const showingResults = screen === 'results' && result;

  return (
    <div className="flex min-h-screen flex-col">
      <div className={`mx-auto flex w-full flex-1 flex-col px-5 py-6 sm:px-8 ${showingResults && result.mode === 'reply' ? 'max-w-5xl' : 'max-w-2xl'}`}>
        <Header compact={Boolean(showingResults)} theme={theme} onToggleTheme={toggleTheme} />

        <main className="mt-10 sm:mt-12">
          {showingResults ? (
            <>
              {loading ? (
                <LoadingState label={request?.mode === 'think' ? 'Thinking it through...' : 'Finding the words...'} />
              ) : result.mode === 'think' ? (
                <ThinkingMode message={request.message} data={result.data} />
              ) : (
                <Results message={request.message} replies={result.data} tone={request.tone} />
              )}

              {error && (
                <div className="mt-8">
                  <ErrorMessage {...error} onRetry={retryResults} />
                </div>
              )}

              <ResultActions
                disabled={loading}
                onRegenerate={retryResults}
                onEdit={handleEdit}
                onStartOver={handleStartOver}
              />
            </>
          ) : (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                submit('reply');
              }}
            >
              <fieldset disabled={loading} className="min-w-0 space-y-10">
                <MessageInput
                  value={message}
                  onChange={handleMessageChange}
                  onClear={() => handleMessageChange('')}
                  onSubmit={() => submit('reply')}
                  error={fieldErrors.message}
                />
                <IntentSelector value={intentId} onChange={handleIntentChange} error={fieldErrors.intent} />
                <ToneSelector value={tone} onChange={setTone} />
                <StyleInput
                  open={styleOpen}
                  onToggle={() => setStyleOpen((open) => !open)}
                  value={writingStyle}
                  onChange={setWritingStyle}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <GenerateButton loading={loading} />
                  <Button onClick={() => submit('think')} className="w-full py-4 sm:w-auto">
                    Just help me think
                  </Button>
                </div>
              </fieldset>

              {loading && (
                <div className="mt-8">
                  <LoadingState label={request?.mode === 'think' ? 'Thinking it through...' : 'Finding the words...'} />
                </div>
              )}
              {error && (
                <div className="mt-8">
                  <ErrorMessage {...error} onRetry={retryForm} />
                </div>
              )}
            </form>
          )}
        </main>

        <PrivacyNote />
      </div>
    </div>
  );
}
