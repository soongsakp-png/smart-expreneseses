import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200);
          return 100;
        }
        return p + 25;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none">
      <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/50">
            <Sparkles className="w-10 h-10 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-slate-950">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-200 via-white to-violet-200 bg-clip-text text-transparent">
            Smart Expense Tracker
          </h1>
          <p className="text-xs text-indigo-200/60 mt-1 uppercase tracking-widest font-semibold">
            Next-Gen Personal Finance Intelligence
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
