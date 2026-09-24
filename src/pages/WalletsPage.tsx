import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, FinancialGoal } from '../types';
import { formatCurrency, formatDate } from '../utils/finance';
import { 
  WalletCards, 
  Target, 
  Trash2, 
  CreditCard, 
  Building2, 
  Banknote, 
  Smartphone,
  Calendar
} from 'lucide-react';

export const WalletsPage: React.FC = () => {
  const { wallets, goals, saveWallet, saveGoal, deleteGoal, currency, language, t } = useApp();

  const [walletModal, setWalletModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);

  // New Wallet form state
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState<Wallet['type']>('Bank');
  const [walletBalance, setWalletBalance] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // New Goal form state
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(walletBalance);
    if (isNaN(bal) || !walletName.trim()) return;

    await saveWallet({
      id: 'w_' + Date.now(),
      name: walletName.trim(),
      type: walletType,
      balance: bal,
      accountNumber: accountNumber.trim() || undefined
    });

    setWalletName('');
    setWalletBalance('');
    setAccountNumber('');
    setWalletModal(false);
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const curr = parseFloat(currentAmount) || 0;
    if (isNaN(target) || target <= 0 || !goalName.trim()) return;

    await saveGoal({
      id: 'g_' + Date.now(),
      name: goalName.trim(),
      targetAmount: target,
      currentAmount: curr,
      deadline: deadline || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
    });

    setGoalName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setGoalModal(false);
  };

  const getWalletIcon = (type: Wallet['type']) => {
    switch (type) {
      case 'Bank': return <Building2 className="w-5 h-5" />;
      case 'Credit Card': return <CreditCard className="w-5 h-5" />;
      case 'E-Wallet': return <Smartphone className="w-5 h-5" />;
      default: return <Banknote className="w-5 h-5" />;
    }
  };

  const getWalletTypeName = (type: Wallet['type']) => {
    if (language !== 'th') return type;
    switch (type) {
      case 'Bank': return 'บัญชีธนาคาร';
      case 'Credit Card': return 'บัตรเครดิต';
      case 'E-Wallet': return 'อีวอลเล็ต / PromptPay';
      case 'Cash': return 'เงินสดในมือ';
      default: return type;
    }
  };

  const totalLiquid = wallets.reduce((s, w) => s + w.balance, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.multiWalletsAndGoals}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.walletsSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWalletModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition cursor-pointer"
          >
            {t.addWallet}
          </button>
          <button
            onClick={() => setGoalModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition cursor-pointer"
          >
            {t.newGoal}
          </button>
        </div>
      </div>

      {/* SECTION 1: WALLETS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <WalletCards className="w-4 h-4 text-indigo-500" />
            <span>{t.activeAccounts}</span>
          </h3>
          <span className="text-xs text-slate-500">
            {t.totalNetHoldings} <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formatCurrency(totalLiquid, currency)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wallets.map(w => (
            <div
              key={w.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    {getWalletIcon(w.type)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {getWalletTypeName(w.type)}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                    {w.name}
                  </h4>
                  {w.accountNumber && (
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {w.accountNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {language === 'th' ? 'ยอดคงเหลือ' : 'Balance'}
                </span>
                <div className={`text-xl font-black ${w.balance < 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                  {formatCurrency(w.balance, currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SAVINGS GOALS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>{t.targetMilestones}</span>
          </h3>
          <span className="text-xs text-slate-500">
            {goals.length} {t.goalsActive}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {goals.map(g => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            const remaining = Math.max(0, g.targetAmount - g.currentAmount);

            return (
              <div
                key={g.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-base text-slate-800 dark:text-white">
                        {g.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {t.due} {formatDate(g.deadline)}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="my-5">
                    <div className="flex items-baseline justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(g.currentAmount, currency)}
                      </span>
                      <span className="text-slate-400">
                        {language === 'th' ? 'เป้าหมาย:' : 'Target:'} {formatCurrency(g.targetAmount, currency)}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-slate-500">
                        {remaining > 0 
                          ? (language === 'th' ? `ยังขาดอีก ${formatCurrency(remaining, currency)}` : `${formatCurrency(remaining, currency)} remaining`)
                          : (language === 'th' ? 'บรรลุเป้าหมายแล้ว! 🎉' : 'Target achieved! 🎉')}
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
                  <button
                    onClick={() => {
                      const deposit = prompt(
                        language === 'th' ? 'กรอกจำนวนเงินที่ต้องการเติมเข้าเป้าหมายนี้:' : 'Enter deposit amount to allocate to goal:', 
                        '1000'
                      );
                      if (deposit && !isNaN(parseFloat(deposit))) {
                        saveGoal({
                          ...g,
                          currentAmount: g.currentAmount + parseFloat(deposit)
                        });
                      }
                    }}
                    className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 transition text-center cursor-pointer"
                  >
                    {t.depositFunds}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: New Wallet */}
      {walletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">
              {t.createWallet}
            </h3>
            <form onSubmit={handleAddWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.accountName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'th' ? 'เช่น บัญชีออมทรัพย์กสิกร หรือ เงินสด' : 'e.g. Kasikorn Savings or Apple Pay'}
                  value={walletName}
                  onChange={e => setWalletName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.walletType}
                </label>
                <select
                  value={walletType}
                  onChange={e => setWalletType(e.target.value as Wallet['type'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="Bank">{language === 'th' ? 'บัญชีธนาคาร' : 'Bank Account'}</option>
                  <option value="Credit Card">{language === 'th' ? 'บัตรเครดิต' : 'Credit Card'}</option>
                  <option value="Cash">{language === 'th' ? 'เงินสดในมือ' : 'Cash in Hand'}</option>
                  <option value="E-Wallet">{language === 'th' ? 'อีวอลเล็ต / PromptPay' : 'E-Wallet / PromptPay'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.startingBalance} ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={walletBalance}
                  onChange={e => setWalletBalance(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.accountNumber}
                </label>
                <input
                  type="text"
                  placeholder="e.g. **** 1234"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWalletModal(false)}
                  className="px-4 py-2 text-xs text-slate-500 rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-sm"
                >
                  {t.createWallet}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Goal */}
      {goalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4">
              {t.createGoal}
            </h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.goalName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'th' ? 'เช่น เงินดาวน์คอนโด, เที่ยวญี่ปุ่น' : 'e.g. Down payment for Condo'}
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.targetAmount} ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="50000"
                  value={targetAmount}
                  onChange={e => setTargetAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.currentSavedAmount} ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0"
                  value={currentAmount}
                  onChange={e => setCurrentAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t.targetDate}
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGoalModal(false)}
                  className="px-4 py-2 text-xs text-slate-500 rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl shadow-sm"
                >
                  {t.createGoal}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
