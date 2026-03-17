import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export const Auth: React.FC = () => {
  const [fullName, setFullName] = useState('');
  
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) {
      login(fullName.trim());
      navigate('/');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-mono animate-in fade-in duration-[var(--duration-slow)] relative"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.4), rgba(10, 10, 10, 0.75)), url("/auth-bg.jpg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="z-10 sm:mx-auto lg:mr-auto lg:ml-[10%] xl:ml-[15%] sm:w-full sm:max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-6)]">
          <div className="w-[48px] h-[48px] rounded-[var(--radius-lg)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center shadow-[0_0_20px_rgba(var(--color-accent),0.15)]">
            <span className="text-[var(--color-accent)] font-bold text-2xl leading-none -mt-1 ml-0.5">₹</span>
          </div>
          <span className="font-bold text-[var(--color-text-primary)] text-3xl tracking-tight">
            fintrack<span className="animate-pulse text-[var(--color-accent)]">_</span>
          </span>
        </div>
        
        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Welcome to FinTrack
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
          Your simple, local, and private finance dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto lg:mr-auto lg:ml-[10%] xl:ml-[15%] sm:w-full sm:max-w-[440px] z-10 relative">
        <div className="bg-[var(--color-surface)] py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--color-border)] sm:rounded-[var(--radius-xl)] sm:px-10 relative overflow-hidden backdrop-blur-sm bg-opacity-95">
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[var(--color-accent)] opacity-5 rounded-full blur-xl pointer-events-none"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <Input
              label="What should we call you?"
              type="text"
              placeholder="E.g. Bishwarup (Ren)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full h-12 text-lg uppercase tracking-wider font-bold shadow-[0_4px_14px_0_rgba(var(--color-accent),0.39)] hover:shadow-[0_6px_20px_rgba(var(--color-accent),0.23)] hover:-translate-y-0.5 transition-all">
                Start Tracking
              </Button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};
