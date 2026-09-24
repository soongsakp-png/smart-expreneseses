import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '../utils/finance';
import { useApp } from '../context/AppContext';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savings: number;
  budgetRemaining: number;
  currency: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpense,
  balance,
  savings,
  budgetRemaining,
  currency
}) => {
  const { t } = useApp();
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Income */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.totalIncome}</span>
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalIncome, currency)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t.activeMonthInflow}</span>
          </div>
        </div>
      </div>

      {/* 2. Total Expense */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.totalExpense}</span>
          <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalExpense, currency)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-rose-500 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{t.activeMonthOutflow}</span>
          </div>
        </div>
      </div>

      {/* 3. Current Net Balance */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md shadow-indigo-600/20">
        <div className="flex items-center justify-between text-indigo-100">
          <span className="text-xs font-medium">{t.currentBalance}</span>
          <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold tracking-tight">
            {formatCurrency(balance, currency)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-indigo-100">
            <span>{t.netLiquid}</span>
          </div>
        </div>
      </div>

      {/* 4. Monthly Savings */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.monthlySavings}</span>
          <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-extrabold tracking-tight ${savings >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
            {formatCurrency(savings, currency)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{t.savingsRateLabel} <strong className={savingsRate >= 20 ? 'text-emerald-500' : 'text-amber-500'}>{savingsRate}%</strong> {t.ofIncome}</span>
          </div>
        </div>
      </div>

      {/* 5. Budget Remaining */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.budgetRemaining}</span>
          <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-extrabold tracking-tight ${budgetRemaining >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600'}`}>
            {formatCurrency(budgetRemaining, currency)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{budgetRemaining >= 0 ? t.safeToSpend : t.budgetOverrun}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
