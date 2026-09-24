import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, DollarSign, Calendar, Shield, Save, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, currency, language, t } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [monthlyIncomeTarget, setMonthlyIncomeTarget] = useState(
    user?.monthlyIncomeTarget?.toString() || '80000'
  );
  const [monthlySavingsTarget, setMonthlySavingsTarget] = useState(
    user?.monthlySavingsTarget?.toString() || '25000'
  );
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim(),
      monthlyIncomeTarget: parseFloat(monthlyIncomeTarget) || 0,
      monthlySavingsTarget: parseFloat(monthlySavingsTarget) || 0
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.userProfile}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.profileSubtitle}
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{language === 'th' ? 'บันทึกข้อมูลโปรไฟล์และเป้าหมายเรียบร้อยแล้ว!' : 'Profile and financial targets saved successfully!'}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            {name ? name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {name || 'Alex Morgan'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {user?.email}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              {t.verifiedAccount}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> {t.fullName}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {t.emailAddress}
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-500" /> {t.monthlyIncomeGoal} ({currency})
              </label>
              <input
                type="number"
                step="any"
                value={monthlyIncomeTarget}
                onChange={e => setMonthlyIncomeTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> {t.monthlySavingsTarget} ({currency})
              </label>
              <input
                type="number"
                step="any"
                value={monthlySavingsTarget}
                onChange={e => setMonthlySavingsTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
