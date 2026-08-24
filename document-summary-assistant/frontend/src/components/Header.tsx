import React from 'react';
import { FileText, Sparkles, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { HealthStatus } from '../types';

interface HeaderProps {
  health: HealthStatus | null;
}

export default function Header({ health }: HeaderProps) {
  const isOnline = health && health.status === 'healthy';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 text-white shadow-md shadow-brand-500/20">
              <FileText className="w-6 h-6" />
              <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Document Summary Assistant
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/60">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Upload a document and get an intelligent summary in seconds.
              </p>
            </div>
          </div>

          {/* Engine Status & Badges */}
          <div className="hidden sm:flex items-center space-x-3">
            {health && (
              <div className="flex items-center space-x-2 text-xs">
                {/* Server Status */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium border ${
                    isOnline
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                      : 'bg-amber-50 text-amber-700 border-amber-200/70'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <span>{isOnline ? 'Engine Online' : 'Connecting...'}</span>
                </div>

                {/* AI Model capability */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
                  <Cpu className="w-3.5 h-3.5 text-brand-600" />
                  <span>
                    {health.geminiAvailable
                      ? 'Gemini 2.5 AI'
                      : health.openaiAvailable
                      ? 'OpenAI GPT-4o'
                      : 'Smart NLP Engine'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
