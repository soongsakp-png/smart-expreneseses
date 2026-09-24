import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction, TransactionType, IncomeCategory, ExpenseCategory, PaymentMethod } from '../types';
import { getCategoryLabel } from '../utils/i18n';
import {
  X,
  TrendingUp,
  TrendingDown,
  Upload,
  Sparkles,
  Receipt,
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  FileText
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
  defaultType?: TransactionType;
}

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Bonus',
  'Investment',
  'Freelance',
  'Gift',
  'Other'
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
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

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'PromptPay',
  'Other'
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editingTransaction,
  defaultType = 'expense'
}) => {
  const { addTransaction, updateTransaction, currency, language, t } = useApp();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PromptPay');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setReceiptUrl(editingTransaction.receiptUrl || '');
    } else {
      setType(defaultType);
      setAmount('');
      setCategory(defaultType === 'income' ? 'Salary' : 'Food');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('PromptPay');
      setReceiptUrl('');
    }
  }, [editingTransaction, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food');
  };

  // Simulated AI Smart OCR slip scanning
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptUrl(reader.result as string);
      
      // Simulate intelligent OCR extraction after 700ms
      setTimeout(() => {
        setIsScanning(false);
        if (!amount) {
          // generate realistic demo amount if empty
          const detectedAmount = (Math.floor(Math.random() * 8) + 1) * 150;
          setAmount(detectedAmount.toString());
        }
        if (!description) {
          setDescription(language === 'th' ? 'สแกนจากสลิปชำระเงิน' : 'Detected from receipt slip');
        }
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (editingTransaction) {
      await updateTransaction({
        ...editingTransaction,
        type,
        amount: parsedAmount,
        category: category as any,
        description: description.trim() || category,
        date,
        paymentMethod,
        receiptUrl: receiptUrl || undefined
      });
    } else {
      await addTransaction({
        type,
        amount: parsedAmount,
        category: category as any,
        description: description.trim() || category,
        date,
        paymentMethod,
        receiptUrl: receiptUrl || undefined
      });
    }

    onClose();
  };

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {editingTransaction ? t.editTransaction : t.recordTransaction}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.transactionSubtitle}
          </p>
        </div>

        {/* Income / Expense Pill Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>{t.expenses}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.income}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.amountLabel} ({currency})</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.categoryLabel}</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
            >
              {currentCategories.map(c => (
                <option key={c} value={c}>
                  {getCategoryLabel(c, language)}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.descriptionLabel}</span>
            </label>
            <input
              type="text"
              placeholder={t.descriptionPlaceholder}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.dateLabel}</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.paymentMethodLabel}</span>
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Receipt Slip / Image Upload with simulated OCR */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.receiptLabel}</span>
            </label>

            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-indigo-500 transition bg-slate-50/50 dark:bg-slate-800/30">
              {receiptUrl ? (
                <div className="relative inline-block">
                  <img
                    src={receiptUrl}
                    alt="Receipt preview"
                    className="h-28 rounded-xl object-contain shadow-xs mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setReceiptUrl('')}
                    className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    ✓ {t.slipReady}
                  </p>
                </div>
              ) : isScanning ? (
                <div className="py-3 space-y-1">
                  <Sparkles className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                    {t.scanningReceipt}
                  </p>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {t.clickToUpload}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t.uploadHint}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-xl transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 active:scale-95 transition cursor-pointer"
            >
              {editingTransaction ? t.updateEntry : t.saveTransaction}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
