import { Outlet, NavLink } from 'react-router-dom';
import { ChartDonut, Receipt, Wallet, Palette, SignOut } from '@phosphor-icons/react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { ChatbotPanel } from '../features/ai/ChatbotPanel';

export const Layout = () => {
  const { state: { theme }, setTheme } = useFinance();
  const { user, signOut } = useAuth();
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const THEMES = [
    { id: 'default', name: 'Obsidian' },
    { id: 'ember', name: 'Ember' },
    { id: 'frost', name: 'Frost' },
    { id: 'circuit', name: 'Circuit' },
    { id: 'void', name: 'Void' },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col pt-[var(--space-16)]">
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[64px] bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] z-50 flex items-center justify-between px-[var(--space-4)] md:px-[var(--space-8)]">
        
        {/* Logo */}
        <div className="flex items-center gap-[var(--space-3)]">
          <div className="w-[32px] h-[32px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center">
            <span className="text-[var(--color-accent)] font-bold font-mono text-lg leading-none -mt-0.5 ml-0.5">₹</span>
          </div>
          <span className="font-mono font-bold text-[var(--color-text-primary)] text-[var(--text-lg)] tracking-tight">
            fintrack<span className="animate-pulse">_</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-[var(--space-6)] font-mono text-[var(--text-sm)]">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-[var(--space-2)] transition-colors duration-[var(--duration-fast)] ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>
            <ChartDonut weight="duotone" size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `flex items-center gap-[var(--space-2)] transition-colors duration-[var(--duration-fast)] ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>
            <Receipt weight="duotone" size={20} />
            Transactions
          </NavLink>
          <NavLink to="/goals" className={({ isActive }) => `flex items-center gap-[var(--space-2)] transition-colors duration-[var(--duration-fast)] ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>
            <Wallet weight="duotone" size={20} />
            Goals
          </NavLink>
        </div>

        {/* Right side / Theme Switcher & Profile */}
        <div className="flex items-center gap-1 md:gap-2 relative">
          <button 
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[var(--radius-full)] hover:bg-[var(--color-surface-raised)] transition-colors flex items-center gap-2"
          >
             <Palette weight={isThemeOpen ? 'fill' : 'duotone'} size={20} />
             <span className="hidden md:block text-[var(--text-xs)] font-mono capitalize">{theme === 'default' ? 'Obsidian' : theme}</span>
          </button>
          
          {user && (
            <button
              onClick={signOut}
              title="Sign Out"
              className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 rounded-[var(--radius-full)] hover:bg-red-500/10 transition-colors flex items-center gap-2"
            >
              <SignOut weight="duotone" size={20} />
            </button>
          )}
          
          {isThemeOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-xl overflow-hidden flex flex-col z-50 animate-in fade-in zoom-in-95">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`px-[var(--space-4)] py-[var(--space-3)] text-left font-mono text-[var(--text-sm)] transition-colors ${theme === t.id ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]'}`}
                  onClick={() => {
                    setTheme(t.id);
                    setIsThemeOpen(false);
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-[var(--space-4)] md:px-[var(--space-8)] pt-[var(--space-8)] pb-[calc(64px+var(--space-8))] md:pb-[var(--space-8)] flex flex-col">
        <div className="flex-1 pb-[var(--space-8)]">
          <Outlet />
        </div>
        
        {/* Copyright Footer */}
        <div className="w-full mt-[var(--space-8)] pt-[var(--space-6)] pb-[var(--space-4)] md:pb-0 border-t border-[var(--color-border)] flex items-center justify-start">
          <span className="font-mono text-[var(--text-xs)] text-[var(--color-text-secondary)] opacity-60">
            Copyright © Ommkunn 2026
          </span>
        </div>
      </main>
      
      {/* Mobile Tab Bar (sticky bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[var(--color-surface)] border-t border-[var(--color-border)] z-40 flex items-center justify-around pb-safe">
         <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center p-2 font-mono text-[10px] gap-1 transition-colors ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
            {({ isActive }) => (
              <>
                <ChartDonut weight={isActive ? 'fill' : 'duotone'} size={24} />
                Dash
              </>
            )}
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `flex flex-col items-center justify-center p-2 font-mono text-[10px] gap-1 transition-colors ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
            {({ isActive }) => (
              <>
                <Receipt weight={isActive ? 'fill' : 'duotone'} size={24} />
                Activity
              </>
            )}
          </NavLink>
          <NavLink to="/goals" className={({ isActive }) => `flex flex-col items-center justify-center p-2 font-mono text-[10px] gap-1 transition-colors ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
             {({ isActive }) => (
               <>
                 <Wallet weight={isActive ? 'fill' : 'duotone'} size={24} />
                 Goals
               </>
             )}
          </NavLink>
      </div>

      {/* Global AI Chatbot for authenticated users */}
      <ChatbotPanel />
    </div>
  );
};
