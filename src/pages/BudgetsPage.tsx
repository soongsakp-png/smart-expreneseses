import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Budget, ExpenseCategory } from '../types';
import { formatCurrency } from '../utils/finance';
import { getCategoryLabel } from '../utils/i18n';
import { 
  PieChart, 
  Plus, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Trash2, 
  Edit3,
  ShieldCheck
} from 'lucide-react';

const ALL_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Investment',
  'Travel',
  'Other'
];

export const BudgetsPage: React.FC = () => {
  const { budgets, transactions, activeMonth, saveBudget, deleteBudget, currency, language, t } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('Food');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Active month budgets & expenses
  const monthBudgets = budgets.filter(b => b.month === activeMonth);
  const monthExpenses = transactions.filter(
    t => t.type === 'expense' && t.date.startsWith(activeMonth)
  );

  const totalCap = monthBudgets.reduce((s, b) => s + b.budgetAmount, 0);
  const totalSpentInCap = monthBudgets.reduce((s, b) => {
    const spent = monthExpenses
      .filter(t => t.category === b.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return s + spent;
  }, 0);

  const overallPercentage = totalCap > 0 ? Math.round((totalSpentInCap / totalCap) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingId(null);
    setSelectedCategory('Food');
    setBudgetAmount('');
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Budget) => {
    setEditingId(b.id);
    setSelectedCategory(b.category);
    setBudgetAmount(b.budgetAmount.toString());
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) return;

    await saveBudget({
      id: editingId || undefined,
      month: activeMonth,
      category: selectedCategory,
      budgetAmount: amount
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.budgetPlanner}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.budgetSubtitle}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.setCategoryBudget}</span>
        </button>
      </div>

      {/* Overview Progress Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.budgetCapOverview} ({activeMonth})
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalSpentInCap, currency)} <span className="text-sm font-medium text-slate-400">/ {formatCurrency(totalCap, currency)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl">
              {overallPercentage}% {t.ofCap}
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallPercentage >= 100
                ? 'bg-rose-500'
                : overallPercentage >= 80
                ? 'bg-amber-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(100, overallPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{overallPercentage}% {t.allocationUtilized}</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> {t.smartCapProtection}
          </span>
        </div>
      </div>

      {/* Category Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {monthBudgets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            {language === 'th' ? `ยังไม่ได้กำหนดงบประมาณสำหรับเดือน ${activeMonth}` : `No budgets configured for ${activeMonth} yet.`}
          </div>
        ) : (
          monthBudgets.map(b => {
            const spent = monthExpenses
              .filter(t => t.category === b.category)
              .reduce((s, t) => s + t.amount, 0);

            const percentage = b.budgetAmount > 0 ? Math.round((spent / b.budgetAmount) * 100) : 0;
            const remaining = b.budgetAmount - spent;

            const isOverBudget = percentage >= 100;
            const isWarning = percentage >= 80 && percentage < 100;

            return (
              <div
                key={b.id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition hover:shadow-md ${
                  isOverBudget
                    ? 'border-rose-300 dark:border-rose-900/60 shadow-xs shadow-rose-500/5'
                    : isWarning
                    ? 'border-amber-300 dark:border-amber-900/60 shadow-xs shadow-amber-500/5'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    <h4 className="font-bold text-base text-slate-800 dark:text-white">
                      {getCategoryLabel(b.category, language)}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteBudget(b.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amount stats */}
                <div className="my-4">
                  <div className="flex items-baseline justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">
                      {t.spent} <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(spent, currency)}</strong>
                    </span>
                    <span className="text-slate-400">
                      {t.cap} {formatCurrency(b.budgetAmount, currency)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs mt-1.5">
                    <span className={`font-semibold ${remaining >= 0 ? 'text-slate-500' : 'text-rose-500 font-bold'}`}>
                      {remaining >= 0 ? `${t.remaining} ${formatCurrency(remaining, currency)}` : `${t.exceededBy} ${formatCurrency(Math.abs(remaining), currency)}`}
                    </span>
                    <span className={`font-extrabold ${isOverBudget ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  {isOverBudget ? (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl">
                      <AlertOctagon className="w-4 h-4 shrink-0" />
                      <span>{t.budgetDangerText}</span>
                    </div>
                  ) : isWarning ? (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{t.budgetWarningText}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t.budgetHealthyText}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add/Edit Budget */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">
              {editingId ? t.updateBudgetCap : t.newCategoryBudget}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.categoryLabel}
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white"
                >
                  {ALL_EXPENSE_CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {getCategoryLabel(c, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.amountLabel} ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 10000"
                  value={budgetAmount}
                  onChange={e => setBudgetAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs shadow-indigo-600/20"
                >
                  {t.saveBudget}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
