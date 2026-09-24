import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { language, t } = useApp();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Next-Generation FinTech Intelligence</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight">
          Smart Expense Tracker
        </h2>
        <p className="text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
          {t.aboutHero}
        </p>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>{t.techArchitecture}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              {language === 'th' ? 'แกนหลักหน้าบ้าน' : 'Frontend Core'}
            </span>
            <p className="text-slate-600 dark:text-slate-300">React 19 + TypeScript + Vite + Tailwind CSS v4</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              {language === 'th' ? 'การแสดงผลกราฟ' : 'Visualizations'}
            </span>
            <p className="text-slate-600 dark:text-slate-300">Recharts (Pie, Bar, Line, Cumulative Area & Radar)</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              {language === 'th' ? 'การสร้างเอกสารและส่งออก' : 'Document Generation'}
            </span>
            <p className="text-slate-600 dark:text-slate-300">jsPDF + jspdf-autotable + SheetJS (XLSX) + UTF-8 CSV</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              {language === 'th' ? 'ระบบบันทึกและยืนยันตัวตน' : 'Storage & Auth'}
            </span>
            <p className="text-slate-600 dark:text-slate-300">Offline-first Persistence with Cloud Backup Sync</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              {language === 'th' ? 'ฟีเจอร์ AI อัจฉริยะ' : 'AI Smart Features'}
            </span>
            <p className="text-slate-600 dark:text-slate-300">AI Receipt Slip OCR + Financial Health Scoring Engine</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              {language === 'th' ? 'รองรับหลายภาษา & สองธีม' : 'i18n & Theming'}
            </span>
            <p className="text-slate-600 dark:text-slate-300">Full Thai (ไทย) & English localization + Dark mode</p>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white">
            {t.privacyHighlight}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.privacyDesc}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white">
            {t.budgetControlHighlight}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.budgetControlDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
