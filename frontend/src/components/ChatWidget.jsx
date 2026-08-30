import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send, Mic, Volume2, Trash2, RotateCcw, StopCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useVoice } from '../hooks/useVoice.js';
import { sendChatMessage } from '../services/chatService.js';

const SESSION_KEY = 'upliftai_chat_history';

function loadHistory() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

export default function ChatWidget({ initialContext = null }) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [micError, setMicError] = useState(null);
  const listRef = useRef(null);

  const voice = useVoice(language);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    setError(null);
    setInput('');
    const nextMessages = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const reply = await sendChatMessage({
        message: text,
        language,
        history: nextMessages.slice(-12),
        context: initialContext,
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setError(err.message || t('chat.error'));
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessages([]);
    setError(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }

  function handleMic() {
    setMicError(null);
    voice.listen({
      onResult: (transcript) => {
        setInput(transcript);
        handleSend(transcript);
      },
      onError: (err) => {
        if (err === 'unsupported') setMicError(t('chat.micUnsupported'));
      },
    });
  }

  return (
    <>
      <button
        id="chat-widget-trigger"
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-uplift-500 to-uplift-600 px-5 py-3.5 font-semibold text-white shadow-glass-lg transition hover:scale-105 sm:right-6"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Sparkles size={20} />
        <span className="hidden sm:inline">{t('chat.launcher')}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('chat.title')}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            className="glass-strong fixed inset-x-3 bottom-3 z-50 flex h-[80vh] max-h-[640px] flex-col rounded-3xl sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px]"
          >
            <div className="flex items-center justify-between rounded-t-3xl border-b border-white/60 bg-white/70 px-5 py-4">
              <div>
                <h2 className="flex items-center gap-1.5 text-base font-bold text-uplift-800">
                  <Sparkles size={18} /> {t('chat.title')}
                </h2>
                <p className="text-xs text-slate-500">{t('chat.subtitle')}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label={t('chat.clear')}
                  title={t('chat.clear')}
                  className="focus-ring rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('common.close')}
                  className="focus-ring rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="rounded-2xl bg-uplift-50 p-4 text-sm text-uplift-900">{t('chat.greeting')}</div>
              )}
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} text={m.text} onReadAloud={() => voice.speak(m.text)} canSpeak={voice.speechSynthesisSupported} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-500">
                  <span className="flex gap-1">
                    <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
                  </span>
                  {t('chat.thinking')}
                </div>
              )}
              {error && (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => handleSend(messages[messages.length - 1]?.text)}
                    className="focus-ring flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 font-semibold hover:bg-red-200"
                  >
                    <RotateCcw size={14} /> {t('chat.retry')}
                  </button>
                </div>
              )}
              {micError && <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{micError}</div>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 border-t border-white/60 bg-white/70 p-3"
            >
              <button
                type="button"
                onClick={voice.isListening ? voice.stopListening : handleMic}
                aria-label={t('chat.mic')}
                title={t('chat.mic')}
                className={`focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                  voice.isListening ? 'border-red-400 bg-red-50 text-red-600' : 'border-uplift-200 text-uplift-700 hover:bg-uplift-50'
                }`}
              >
                {voice.isListening ? <StopCircle size={18} /> : <Mic size={18} />}
              </button>
              <label htmlFor="chat-input" className="sr-only">
                {t('chat.placeholder')}
              </label>
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                className="focus-ring min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t('chat.send')}
                className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-uplift-600 text-white transition hover:bg-uplift-700 disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatBubble({ role, text, onReadAloud, canSpeak }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser ? 'bg-uplift-600 text-white' : 'bg-white/90 text-slate-700 shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {!isUser && canSpeak && (
          <button
            type="button"
            onClick={onReadAloud}
            className="focus-ring mt-1.5 flex items-center gap-1 text-xs font-medium text-uplift-600 hover:text-uplift-800"
          >
            <Volume2 size={13} /> Read aloud
          </button>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = '0s' }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-uplift-400"
      style={{ animationDelay: delay }}
    />
  );
}
