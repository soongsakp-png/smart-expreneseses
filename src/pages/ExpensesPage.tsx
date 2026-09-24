import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';
import { Transaction } from '../types';
import { TrendingDown, Plus, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

export const ExpensesPage: React.FC = () => {
  const { transactions, activeMonth, currency, t } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const expenseTxs = transactions.filter(
    t => t.type === 'expense' && t.date.startsWith(activeMonth)
  );
  const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTx(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-rose-500/10 dark:bg-rose-950/30 rounded-3xl border border-rose-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.expenses} ({activeMonth})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.activeMonthOutflow}: <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{formatCurrency(totalExpense, currency)}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/25 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addEntry}</span>
        </button>
      </div>

      {/* Expenses Table */}
      <TransactionTable
        forcedType="expense"
        title={t.expenses}
        onEdit={handleEdit}
        onAddNew={handleAddNew}
      />

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTx(null);
        }}
        editingTransaction={editingTx}
        defaultType="expense"
      />
    </div>
  );
};
