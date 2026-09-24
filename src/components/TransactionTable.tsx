import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction, TransactionType, IncomeCategory, ExpenseCategory, PaymentMethod } from '../types';
import { formatCurrency, formatDate } from '../utils/finance';
import { getCategoryLabel } from '../utils/i18n';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Receipt,
  Eye,
  X
} from 'lucide-react';

interface TransactionTableProps {
  forcedType?: TransactionType;
  title?: string;
  onEdit: (tx: Transaction) => void;
  onAddNew?: () => void;
}

const ALL_CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Investment',
  'Travel',
  'Salary',
  'Bonus',
  'Freelance',
  'Gift',
  'Other'
];

export const TransactionTable: React.FC<TransactionTableProps> = ({
  forcedType,
  title,
  onEdit,
  onAddNew
}) => {
  const { transactions, deleteTransaction, currency, activeMonth, language, t } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>(forcedType || 'all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  const pageSize = 8;

  // Filter transactions
  const filtered = transactions.filter(tx => {
    if (forcedType && tx.type !== forcedType) return false;
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterCategory !== 'all' && tx.category !== filterCategory) return false;
    if (filterPayment !== 'all' && tx.paymentMethod !== filterPayment) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchCat = tx.category.toLowerCase().includes(q);
      const matchCatTh = getCategoryLabel(tx.category, 'th').toLowerCase().includes(q);
      const matchAmt = tx.amount.toString().includes(q);
      if (!matchDesc && !matchCat && !matchCatTh && !matchAmt) return false;
    }
    return true;
  });

  // Sort transactions
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortOrder === 'desc' ? diff : -diff;
    } else {
      const diff = b.amount - a.amount;
      return sortOrder === 'desc' ? diff : -diff;
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const paymentMethods: PaymentMethod[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'PromptPay', 'Other'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {title || t.recentActivity}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'th' ? `พบทั้งหมด ${filtered.length} รายการ` : `Showing ${filtered.length} total entries`}
            </p>
          </div>

          {onAddNew && (
            <button
              onClick={onAddNew}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
            >
              + {t.newTransaction}
            </button>
          )}
        </div>

        {/* Search, Filter, Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter (if not forced) */}
          {!forcedType && (
            <select
              value={filterType}
              onChange={e => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{t.allTypes}</option>
              <option value="income">{t.incomeOnly}</option>
              <option value="expense">{t.expenseOnly}</option>
            </select>
          )}

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={e => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">{t.allCategories}</option>
            {ALL_CATEGORIES.map(c => (
              <option key={c} value={c}>
                {getCategoryLabel(c, language)}
              </option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={filterPayment}
            onChange={e => {
              setFilterPayment(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">{t.allPaymentMethods}</option>
            {paymentMethods.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
              <th className="py-3 px-6 font-semibold cursor-pointer select-none" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-1.5">
                  <span>{t.date}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold">{t.description}</th>
              <th className="py-3 px-4 font-semibold">{t.category}</th>
              <th className="py-3 px-4 font-semibold">{t.paymentMethod}</th>
              <th className="py-3 px-4 font-semibold text-right cursor-pointer select-none" onClick={() => toggleSort('amount')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>{t.amountLabel}</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-center">{t.receipt}</th>
              <th className="py-3 px-6 font-semibold text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                  {t.noTransactionsFound}
                </td>
              </tr>
            ) : (
              paginated.map(tx => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                >
                  {/* Date */}
                  <td className="py-3.5 px-6 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {tx.description}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {getCategoryLabel(tx.category, language)}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {tx.paymentMethod}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-black text-sm ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                    </span>
                  </td>

                  {/* Receipt Slip Preview */}
                  <td className="py-3.5 px-4 text-center">
                    {tx.receiptUrl ? (
                      <button
                        onClick={() => setViewingReceipt(tx.receiptUrl || null)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                        title="View slip"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>{t.viewSlip}</span>
                      </button>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700 text-xs">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          {t.pageOf.replace('{curr}', currentPage.toString()).replace('{total}', totalPages.toString())}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Receipt Modal Preview */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-indigo-500" />
                <span>{language === 'th' ? 'สลิปหลักฐานการเงิน' : 'Attached Slip / Receipt'}</span>
              </h4>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-80 bg-slate-50 flex items-center justify-center">
              <img
                src={viewingReceipt}
                alt="Receipt Slip"
                className="max-h-80 object-contain w-full"
              />
            </div>
            <button
              onClick={() => setViewingReceipt(null)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {t.doneViewing}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
