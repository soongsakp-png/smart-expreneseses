import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateSmartInsights, calculateFinancialScore } from '../utils/finance';

export const SmartInsightsPanel: React.FC = () => {
  const { transactions, budgets, currency, language, t } = useApp();

  const insights = generateSmartInsights(transactions, budgets, currency, language);
  const financialScore = calculateFinancialScore(transactions, budgets);

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: t.excellentHealth, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    if (score >= 60) return { label: t.goodStanding, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' };
    return { label: t.needsOptimization, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
  };

  const badge = getScoreBadge(financialScore);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Financial Health Score & Forecast */}
      <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-lg shadow-indigo-950/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
                <Award className="w-5 h-5 text-indigo-300" />
              </div>
              <h3 className="font-bold text-base text-white">{t.financialScore}</h3>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${badge.color} bg-white/10 text-white`}>
              {badge.label}
            </span>
          </div>

          <div className="flex items-center gap-6 my-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - financialScore / 100)}
                  strokeLinecap="round"
                  className="stroke-indigo-400 transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-white">{financialScore}</span>
                <span className="text-[10px] text-indigo-200 block font-medium">/ 100</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-indigo-100">
              <p className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.cashflowSurplus}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.budgetTracking}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span>{t.aiPredictiveRisk}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 text-[11px] text-indigo-200">
          {t.scoreDesc}
        </div>
      </div>

      {/* Smart Automated Insights */}
      <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white">
                  {t.smartAiInsights}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.smartAiDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.slice(0, 4).map(item => {
              const isWarning = item.type === 'budget_warning' || item.type === 'budget_danger' || item.type === 'increase';
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isWarning
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : item.type === 'tip' ? (
                      <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{t.aiEngineRunning}</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{t.automaticSync}</span>
        </div>
      </div>
    </div>
  );
};
