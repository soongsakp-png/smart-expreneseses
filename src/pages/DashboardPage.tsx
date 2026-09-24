import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SummaryCards } from '../components/SummaryCards';
import { DashboardCharts } from '../components/DashboardCharts';
import { SmartInsightsPanel } from '../components/SmartInsightsPanel';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';
import { Transaction } from '../types';
import { Sparkles, ArrowRight, Wallet, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/finance';

export const DashboardPage: React.FC = () => {
  const { transactions, budgets, wallets, goals, activeMonth, currency, t } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Month-filtered transactions for active summary
  const monthTransactions = transactions.filter(t => t.date.startsWith(activeMonth));
  
  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  // Cumulative all-time balance
  const allTimeIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const allTimeExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = allTimeIncome - allTimeExpense;

  const savings = totalIncome - totalExpense;

  // Active month total budget vs spent
  const monthBudgets = budgets.filter(b => b.month === activeMonth);
  const totalBudgetPlanned = monthBudgets.reduce((s, b) => s + b.budgetAmount, 0);
  const budgetRemaining = totalBudgetPlanned - totalExpense;

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTx(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.tagline}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t.welcomeBack}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              {t.welcomeDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddNew}
              className="px-5 py-3 rounded-2xl bg-white text-indigo-700 font-bold text-xs shadow-lg hover:bg-indigo-50 active:scale-95 transition cursor-pointer"
            >
              {t.quickAdd}
            </button>
            <Link
              to="/budgets"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
            >
              <span>{t.manageBudgets}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
        savings={savings}
        budgetRemaining={budgetRemaining}
        currency={currency}
      />

      {/* Recharts Visualizations */}
      <DashboardCharts
        transactions={transactions}
        activeMonth={activeMonth}
        currency={currency}
      />

      {/* Smart Insights & Financial Health Score */}
      <SmartInsightsPanel />

      {/* Quick Wallets & Goals Summary widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallets snapshot */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                <Wallet className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">{t.activeAccounts}</h3>
            </div>
            <Link to="/wallets" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              {t.manageAll}
            </Link>
          </div>
          <div className="space-y-3">
            {wallets.slice(0, 3).map(w => (
              <div key={w.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{w.name}</p>
                  <p className="text-[11px] text-slate-400">{w.type} {w.accountNumber ? `• ${w.accountNumber}` : ''}</p>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatCurrency(w.balance, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals snapshot */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">{t.savingsTargets}</h3>
            </div>
            <Link to="/wallets" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              {t.viewAll}
            </Link>
          </div>
          <div className="space-y-3">
            {goals.slice(0, 3).map(g => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <div key={g.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{g.name}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions List with Full Filters */}
      <TransactionTable
        title={t.recentActivity}
        onEdit={handleEdit}
        onAddNew={handleAddNew}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTx(null);
        }}
        editingTransaction={editingTx}
      />
    </div>
  );
};
