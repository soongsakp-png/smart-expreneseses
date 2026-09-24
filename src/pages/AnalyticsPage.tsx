import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { formatCurrency, CATEGORY_COLORS } from '../utils/finance';
import { getCategoryLabel } from '../utils/i18n';
import {
  TrendingUp,
  Percent,
  Calendar,
  Flame,
  Scale,
  Sparkles
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { transactions, activeMonth, currency, language, t } = useApp();

  const activeMonthTxs = transactions.filter(tr => tr.date.startsWith(activeMonth));
  const incomeTxs = activeMonthTxs.filter(tr => tr.type === 'income');
  const expenseTxs = activeMonthTxs.filter(tr => tr.type === 'expense');

  const totalIncome = incomeTxs.reduce((s, tr) => s + tr.amount, 0);
  const totalExpense = expenseTxs.reduce((s, tr) => s + tr.amount, 0);
  const savings = totalIncome - totalExpense;

  // 1. Most expensive category
  const categoryTotals: Record<string, number> = {};
  expenseTxs.forEach(tr => {
    categoryTotals[tr.category] = (categoryTotals[tr.category] || 0) + tr.amount;
  });
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const mostExpensiveCat = sortedCategories[0] || [language === 'th' ? 'ไม่มี' : 'None', 0];

  // 2. Average daily spending
  const currentDay = Math.min(new Date().getDate(), 30);
  const avgDailySpending = currentDay > 0 ? totalExpense / currentDay : 0;

  // 3. Saving Rate
  const savingRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  // 4. Income vs Expense Ratio
  const ratio = totalExpense > 0 ? (totalIncome / totalExpense).toFixed(2) : 'N/A';

  // 5. Radar chart data for Category Distribution
  const radarData = sortedCategories.slice(0, 6).map(([category, amount]) => ({
    category: getCategoryLabel(category, language),
    rawCategory: category,
    amount,
    fullMark: totalExpense
  }));

  // 6. Cash Flow Area Chart (Cumulative daily inflows vs outflows)
  const cashFlowData: Array<{ day: number; dayLabel: string; income: number; expense: number; netFlow: number }> = [];
  let cumIncome = 0;
  let cumExpense = 0;

  for (let d = 1; d <= 30; d++) {
    const dayStr = d.toString().padStart(2, '0');
    const dayTxs = activeMonthTxs.filter(tr => tr.date.endsWith(`-${dayStr}`));
    const inc = dayTxs.filter(tr => tr.type === 'income').reduce((s, tr) => s + tr.amount, 0);
    const exp = dayTxs.filter(tr => tr.type === 'expense').reduce((s, tr) => s + tr.amount, 0);

    cumIncome += inc;
    cumExpense += exp;

    cashFlowData.push({
      day: d,
      dayLabel: language === 'th' ? `วันที่ ${d}` : `Day ${d}`,
      income: cumIncome,
      expense: cumExpense,
      netFlow: cumIncome - cumExpense
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.financialAnalytics}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.analyticsSubtitle}
        </p>
      </div>

      {/* 4 Core Quantitative KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Most Expensive Category */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.mostExpensive}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2 truncate">
            {getCategoryLabel(mostExpensiveCat[0], language)}
          </div>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 block">
            {formatCurrency(mostExpensiveCat[1], currency)}
          </span>
        </div>

        {/* Avg Daily Spending */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.avgDailyBurn}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
            {formatCurrency(avgDailySpending, currency)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {t.dailyVelocity}
          </span>
        </div>

        {/* Saving Rate */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.monthlySavings}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {savingRate}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {t.targetBenchmark}
          </span>
        </div>

        {/* Income vs Expense Ratio */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Inflow/Outflow Ratio</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
            {ratio}x
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {language === 'th' ? 'อัตราคูณ (มากกว่า 1 = ได้กำไร)' : 'Multiplier (>1 is profitable)'}
          </span>
        </div>
      </div>

      {/* Cash Flow Cumulative Area Chart */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              {t.cashflowProgression}
            </h3>
            <p className="text-xs text-slate-400">
              {t.cashflowProgressionDesc}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-full">
            {activeMonth}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="dayLabel" tick={{ fontSize: 10 }} interval={3} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v >= 1000 ? `${v / 1000}k` : v}`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val), currency), '']}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px'
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Area
                type="monotone"
                dataKey="income"
                name={t.totalIncome}
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#incomeColor)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name={t.totalExpense}
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expenseColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Category Spread & Category Ranked Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Analysis */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white mb-2">
              {t.spendingDistributionRadar}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t.radarDesc}
            </p>

            <div className="h-64 w-full">
              {radarData.length < 3 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  {language === 'th' ? 'ต้องมีรายจ่ายอย่างน้อย 3 หมวดเพื่อแสดงเรดาร์วิเคราะห์' : 'Add expenses in at least 3 categories to see radar analysis'}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid opacity={0.3} />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 9 }} />
                    <Radar
                      name={t.amount}
                      dataKey="amount"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Category Ranked Table */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-base text-slate-800 dark:text-white mb-2">
            {t.categoryExpenditureRankings}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {t.categoryRankingsDesc}
          </p>

          <div className="space-y-3">
            {sortedCategories.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                {t.noExpenseRecords}
              </p>
            ) : (
              sortedCategories.map(([cat, amt]) => {
                const share = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {getCategoryLabel(cat, language)}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(amt, currency)} ({share}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${share}%`,
                          backgroundColor: CATEGORY_COLORS[cat] || '#6366f1'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
