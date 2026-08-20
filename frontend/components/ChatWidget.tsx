import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { useSettings } from '../context/SettingsContext';

const ASSISTANT_NAME = 'Nagode';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget: React.FC = () => {
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    if (started) inputRef.current?.focus();
  }, [started]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  function handleStart() {
    setStarted(true);
    setMessages([
      {
        role: 'assistant',
        content: `Bonjour, je suis ${ASSISTANT_NAME} 👋 Je peux vous renseigner sur nos tarifs, nos horaires, nos agences ou nos services. Que puis-je faire pour vous ?`,
      },
    ]);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setSending(true);

    try {
      const res = await api.post<{ reply: string }>('/chat', { messages: nextMessages });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Désolé, une erreur est survenue. Réessayez ou contactez-nous directement.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Assistant ${ASSISTANT_NAME}`}
          className="animate-chat-panel-in fixed bottom-40 right-4 z-[90] flex h-[70vh] max-h-[600px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl sm:bottom-24 sm:right-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-[var(--brand-dark)] px-5 py-4 text-white">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="" className="h-full w-full object-contain p-1" />
              ) : (
                <Sparkles size={18} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black uppercase tracking-tight">{ASSISTANT_NAME}</p>
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Assistant {settings.siteName}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer la conversation"
              className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {!started ? (
            /* Welcome screen */
            <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[var(--brand-dark)]/10">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="" className="h-full w-full object-contain p-2" />
                  ) : (
                    <Sparkles size={24} className="text-[var(--brand-dark)]" />
                  )}
                </div>
                <h3 className="mb-2 text-lg font-black text-gray-900">
                  Bonjour, je suis {ASSISTANT_NAME} !
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-500">
                  Votre assistant virtuel {settings.siteName}. Posez-moi vos questions sur nos trajets, nos tarifs,
                  nos agences ou l'envoi de colis — je réponds 24h/24.
                </p>
                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3.5 text-xs leading-relaxed text-amber-800">
                  {ASSISTANT_NAME} est un assistant automatisé qui peut ne pas répondre à toutes vos questions.
                  Pour toute information sensible (paiement, réservation, réclamation), vérifiez toujours auprès
                  de nos agences ou du site officiel.
                </div>
              </div>
              <div className="mt-4">
                <p className="mb-3 text-center text-[11px] text-gray-400">
                  En continuant, vous acceptez les{' '}
                  <Link
                    to="/conditions-chatbot"
                    target="_blank"
                    className="font-semibold text-[var(--brand-dark)] hover:underline"
                  >
                    conditions d'utilisation du chatbot
                  </Link>
                  .
                </p>
                <button
                  onClick={handleStart}
                  className="w-full rounded-2xl bg-[var(--brand-dark)] py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-[var(--brand-dark-hover)] active:scale-[0.98]"
                >
                  Commencer
                </button>
              </div>
            </div>
          ) : (
            /* Conversation */
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`animate-chat-bubble-in flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'rounded-br-md bg-[var(--brand-dark)] text-white'
                          : 'rounded-bl-md bg-gray-100 text-gray-700'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3.5">
                      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                      <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                    </div>
                  </div>
                )}
                {error && <p className="text-center text-xs font-medium text-red-500">{error}</p>}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 p-3">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez votre message…"
                  aria-label="Votre message"
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--brand-dark)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-dark)]/10"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Envoyer le message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-dark)] text-white transition-all hover:bg-[var(--brand-dark-hover)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? `Fermer l'assistant ${ASSISTANT_NAME}` : `Ouvrir l'assistant ${ASSISTANT_NAME}`}
        aria-expanded={isOpen}
        className="animate-chat-pop-in fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-dark)] text-white shadow-xl transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
      >
        {!isOpen && (
          <span className="absolute inset-0 animate-chat-ping-soft rounded-full bg-[var(--brand-dark)]" />
        )}
        <span className="relative">{isOpen ? <X size={24} /> : <MessageCircle size={24} />}</span>
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
        )}
      </button>
    </>
  );
};

export default ChatWidget;
