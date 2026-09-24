import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';
import { Transaction } from '../types';
import { TrendingUp, Plus, ArrowUpRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

export const IncomePage: React.FC = () => {
  const { transactions, activeMonth, currency, t } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const incomeTxs = transactions.filter(
    t => t.type === 'income' && t.date.startsWith(activeMonth)
  );
  const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-emerald-600/10 dark:bg-emerald-950/30 rounded-3xl border border-emerald-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.income} ({activeMonth})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.activeMonthInflow}: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatCurrency(totalIncome, currency)}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addEntry}</span>
        </button>
      </div>

      {/* Income Table */}
      <TransactionTable
        forcedType="income"
        title={t.income}
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
        defaultType="income"
      />
    </div>
  );
};
