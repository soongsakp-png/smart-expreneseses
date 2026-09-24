import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Transaction } from '../types';
import { CATEGORY_COLORS, formatCurrency } from '../utils/finance';
import { useApp } from '../context/AppContext';
import { getCategoryLabel } from '../utils/i18n';

interface DashboardChartsProps {
  transactions: Transaction[];
  activeMonth: string;
  currency: string;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  transactions,
  activeMonth,
  currency
}) => {
  const { t, language } = useApp();

  // 1. Pie Chart: Expenses by Category for Active Month
  const activeMonthExpenses = transactions.filter(
    t => t.type === 'expense' && t.date.startsWith(activeMonth)
  );

  const categoryTotals: Record<string, number> = {};
  activeMonthExpenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: getCategoryLabel(name, language),
    rawName: name,
    value
  })).sort((a, b) => b.value - a.value);

  // 2. Bar Chart: Income vs Expense by Month (Last 6 Months)
  const last6MonthsData: Array<{ month: string; income: number; expense: number }> = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    const label = d.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { month: 'short' });

    const monthTxs = transactions.filter(t => t.date.startsWith(key));
    const income = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    last6MonthsData.push({ month: label, income, expense });
  }

  // 3. Line Chart: Monthly Spending Trend (Day by Day cumulative for Active Month)
  const daysInMonth = 31;
  const dailySpendingMap: Record<number, number> = {};
  for (let day = 1; day <= daysInMonth; day++) dailySpendingMap[day] = 0;

  activeMonthExpenses.forEach(t => {
    const day = parseInt(t.date.split('-')[2], 10);
    if (day) {
      dailySpendingMap[day] = (dailySpendingMap[day] || 0) + t.amount;
    }
  });

  let runningTotal = 0;
  const lineTrendData = Object.entries(dailySpendingMap)
    .filter(([day]) => parseInt(day) <= new Date().getDate() || activeMonth < today.toISOString().substring(0, 7))
    .map(([day, val]) => {
      runningTotal += val;
      return {
        day: language === 'th' ? `วันที่ ${day}` : `Day ${day}`,
        daily: val,
        cumulative: runningTotal
      };
    });

  const topCategories = pieData.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Category Pie Chart */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              {t.expensesByCategory}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{t.thisMonth}</span>
          </div>
          
          <div className="h-64 w-full relative">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                {t.noExpenseRecords}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value), currency), t.amount]}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px'
                    }}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {pieData.map(entry => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={CATEGORY_COLORS[entry.rawName] || '#6366f1'}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Legend / Top Categories breakdown */}
        <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {topCategories.map(cat => (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.rawName] || '#6366f1' }}
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{cat.name}</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrency(cat.value, currency)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Bar Chart: Income vs Expense by Month */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              {t.incomeVsExpense}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{t.last6Months}</span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last6MonthsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v >= 1000 ? `${v / 1000}k` : v}`} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value), currency), '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="income" name={t.income} fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name={t.expenses} fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-3">
          {t.comparingCashflow}
        </p>
      </div>

      {/* 3. Line Chart: Monthly Spending Trend */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              {t.cumulativeSpending}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{t.trajectory}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v >= 1000 ? `${v / 1000}k` : v}`} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value), currency), t.cumulativeSpending]}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#6366f1' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-3">
          {t.cumulativeBurnRate}
        </p>
      </div>
    </div>
  );
};
