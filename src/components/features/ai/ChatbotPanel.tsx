import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../../context/FinanceContext';
import { ChatCircleDots, X, PaperPlaneRight, Robot, Key } from '@phosphor-icons/react';
import { generateGeminiResponse } from './geminiAiService';
// fallback for when no api key is available but user wants testing
import { generateMockAIResponse } from './mockAiService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export const ChatbotPanel: React.FC = () => {
  const { state: { transactions, savingsGoals }, getMonthlySummary } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('fintrack_gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Hi there! I'm your FinTrack assistant. Ask me anything about your spending or how to reach that savings goal."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, showKeyInput]);

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('fintrack_gemini_api_key', apiKey.trim());
      setShowKeyInput(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const currentMonthStr = new Date().toISOString().substring(0, 7);
    const summary = getMonthlySummary(currentMonthStr);
    const goal = savingsGoals[currentMonthStr] || 0;

    let aiResponseContent = '';

    if (apiKey) {
      aiResponseContent = await generateGeminiResponse(userMsg.content, summary, transactions, goal, apiKey);
    } else {
      // Fallback if they somehow bypassed the key input
      aiResponseContent = generateMockAIResponse(userMsg.content, summary, transactions, goal);
    }

    const aiMsg: Message = { id: Date.now().toString(), role: 'ai', content: aiResponseContent };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[calc(64px+var(--space-4))] md:bottom-[var(--space-6)] right-[var(--space-4)] md:right-[var(--space-6)] w-14 h-14 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-[var(--radius-full)] shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50 animate-in slide-in-from-bottom flex-col gap-0.5"
        >
          <ChatCircleDots size={24} weight="fill" />
          <span className="text-[9px] font-mono font-bold leading-none">Ask AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-[calc(64px+var(--space-4))] md:bottom-[var(--space-6)] right-[var(--space-4)] md:right-[var(--space-6)] w-[calc(100vw-var(--space-8))] sm:w-[360px] h-[480px] max-h-[70vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-8 duration-[var(--duration-base)] origin-bottom-right">
          
          {/* Header */}
          <div className="flex items-center justify-between p-[var(--space-4)] border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
            <div className="flex items-center gap-2">
              <Robot size={24} color="var(--color-accent)" weight="duotone" />
              <span className="font-mono font-bold text-[var(--text-md)]">fintrack_ AI</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowKeyInput(!showKeyInput)}
                className={`transition-colors p-1 ${showKeyInput ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                title="API Key Settings"
              >
                <Key size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {showKeyInput ? (
            <div className="flex-1 p-[var(--space-5)] flex flex-col gap-4 bg-[var(--color-surface)] animate-in fade-in">
              <div className="text-center">
                <Key size={48} className="mx-auto text-[var(--color-accent)] mb-2" weight="duotone" />
                <h3 className="font-mono font-bold text-[var(--text-lg)] mb-2">Configure Gemini AI</h3>
                <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                  Enter your Google Gemini API key to enable the intelligent finance advisor.
                </p>
              </div>
              
              <form onSubmit={saveApiKey} className="flex flex-col gap-3 mt-4">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-md)] py-2 px-3 text-[var(--text-sm)] focus:outline-none focus:border-[var(--color-accent)]"
                  required
                />
                <button type="submit" className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] py-2 rounded-[var(--radius-md)] font-bold text-[var(--text-sm)]">
                  Save Key
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    localStorage.removeItem('fintrack_gemini_api_key');
                    setApiKey('');
                    setShowKeyInput(false);
                  }}
                  className="w-full text-[var(--color-text-secondary)] underline text-[var(--text-xs)] pt-2"
                >
                  Continue without saving (Uses Mock data)
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-[var(--space-4)] flex flex-col gap-[var(--space-4)]">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        max-w-[85%] p-[var(--space-3)] font-mono text-[var(--text-sm)]
                        ${msg.role === 'user' 
                          ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-accent)] rounded-[var(--radius-xl)] rounded-tr-[var(--radius-sm)] shadow-[0_0_10px_rgba(var(--color-accent),0.1)]' 
                          : 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] rounded-[var(--radius-xl)] rounded-bl-[var(--radius-sm)] border border-[var(--color-border)]'
                        }
                      `}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex w-full justify-start">
                     <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-xl)] rounded-bl-[var(--radius-sm)] border border-[var(--color-border)] p-[var(--space-3)] flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-[var(--color-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-[var(--color-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-[var(--color-text-secondary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form 
                onSubmit={handleSend}
                className="p-[var(--space-3)] border-t border-[var(--color-border)] bg-[var(--color-surface)] flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent text-[var(--color-text-primary)] font-mono text-[var(--text-sm)] placeholder:text-[var(--color-text-secondary)] focus:outline-none px-2"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 text-[var(--color-accent)] disabled:opacity-50 hover:bg-[var(--color-surface-raised)] rounded-[var(--radius-md)] transition-colors"
                >
                  <PaperPlaneRight size={20} weight="fill" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
