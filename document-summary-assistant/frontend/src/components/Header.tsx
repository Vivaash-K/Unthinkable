import React from 'react';
import { Sparkles, Cpu, CheckCircle2, AlertCircle, Sun, Moon } from 'lucide-react';
import { HealthStatus } from '../types';

interface HeaderProps {
  health: HealthStatus | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ health, darkMode, onToggleDarkMode }: HeaderProps) {
  const isOnline = health && health.status === 'healthy';

  return (
    <header className="bg-sand-50/90 dark:bg-espresso-900/90 backdrop-blur-md border-b border-sand-200 dark:border-espresso-700 sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and title */}
          <div className="flex items-center space-x-3.5">
            {/* Stylized Nutshell Logo Mark */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white shadow-md shadow-brand-700/20 ring-1 ring-brand-400/30">
              <svg 
                className="w-6 h-6 text-sand-100" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2C6.5 2 3 6.5 3 12s3.5 10 9 10 9-4.5 9-10S17.5 2 12 2z" />
                <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
              <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-sand-50 dark:bg-espresso-900 shadow-sm border border-sand-200 dark:border-espresso-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight text-sand-950 dark:text-sand-50 font-sans">
                  Nutshell
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-200 border border-brand-200/80 dark:border-brand-700/60">
                  AI Synthesis
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sand-600 dark:text-sand-400 font-normal">
                Distill documents to their essence in seconds.
              </p>
            </div>
          </div>

          {/* Right: Engine status badges & Dark mode toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Status pills */}
            <div className="hidden sm:flex items-center space-x-2">
              {/* Server Online Status */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  isOnline
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>{isOnline ? 'Engine Online' : 'Connecting...'}</span>
              </div>

              {/* AI Engine Status */}
              {health?.geminiAvailable ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-brand-100/70 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 border border-brand-200 dark:border-brand-800/60">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Gemini AI</span>
                </div>
              ) : health?.openaiAvailable ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>OpenAI</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-sand-100 dark:bg-espresso-800 text-sand-700 dark:text-sand-300 border border-sand-300 dark:border-espresso-700">
                  <Cpu className="w-3.5 h-3.5 text-sand-500" />
                  <span>Smart NLP Engine</span>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 dark:bg-espresso-800 dark:hover:bg-espresso-700 text-sand-700 dark:text-sand-200 border border-sand-300 dark:border-espresso-700 transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sand-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
