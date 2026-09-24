import { Transaction, Budget } from '../types';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  THB: '฿',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  SGD: 'S$',
  AUD: 'A$'
};

export const formatCurrency = (amount: number, currency = 'THB'): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency + ' ';
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getCurrentMonthString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

export const getMonthName = (monthStr: string): string => {
  try {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return monthStr;
  }
};

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', // emerald
  Transportation: '#3b82f6', // blue
  Shopping: '#f59e0b', // amber
  Bills: '#ef4444', // red
  Entertainment: '#8b5cf6', // purple
  Healthcare: '#ec4899', // pink
  Education: '#06b6d4', // cyan
  Investment: '#6366f1', // indigo
  Travel: '#14b8a6', // teal
  Salary: '#10b981',
  Bonus: '#3b82f6',
  Freelance: '#8b5cf6',
  Gift: '#f43f5e',
  Other: '#64748b' // slate
};

export const CATEGORY_BG_COLORS: Record<string, string> = {
  Food: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30',
  Transportation: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
  Shopping: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/30',
  Bills: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/30',
  Entertainment: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/30',
  Healthcare: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/30',
  Education: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/30',
  Investment: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30',
  Travel: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/30',
  Salary: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30',
  Bonus: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
  Freelance: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/30',
  Gift: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/30',
  Other: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/30'
};

export interface FinancialInsight {
  id: string;
  type: 'increase' | 'saving' | 'budget_warning' | 'budget_danger' | 'tip' | 'good_habit';
  title: string;
  description: string;
  impactScore?: number;
}

export function generateSmartInsights(
  transactions: Transaction[],
  budgets: Budget[],
  currency = 'THB',
  language: 'th' | 'en' = 'th'
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const currentMonth = getCurrentMonthString();
  const isTh = language === 'th';
  
  const d = new Date();
  const prevMonthNum = d.getMonth() === 0 ? 12 : d.getMonth();
  const prevYear = d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear();
  const prevMonthStr = `${prevYear}-${prevMonthNum.toString().padStart(2, '0')}`;

  const currentTxs = transactions.filter(t => t.date.startsWith(currentMonth));
  const prevTxs = transactions.filter(t => t.date.startsWith(prevMonthStr));

  const currentIncome = currentTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const currentExpense = currentTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const currentSavings = currentIncome - currentExpense;

  if (currentSavings > 0) {
    const rate = currentIncome > 0 ? ((currentSavings / currentIncome) * 100).toFixed(0) : '0';
    insights.push({
      id: 'ins-saving',
      type: 'saving',
      title: isTh ? 'กระแสเงินสดออมสุทธิเป็นบวก' : 'Positive Cash Reserve',
      description: isTh 
        ? `คุณมีเงินออมสุทธิ ${formatCurrency(currentSavings, currency)} ในเดือนนี้! คิดเป็นอัตราการออม ${rate}% ของรายได้รวม`
        : `You have saved ${formatCurrency(currentSavings, currency)} this month! That's a ${rate}% savings rate.`
    });
  }

  // Budget checks
  budgets.forEach(b => {
    const spent = currentTxs
      .filter(t => t.type === 'expense' && t.category === b.category)
      .reduce((s, t) => s + t.amount, 0);
    const pct = b.budgetAmount > 0 ? (spent / b.budgetAmount) * 100 : 0;

    if (pct >= 100) {
      insights.push({
        id: `ins-bdg-${b.category}`,
        type: 'budget_danger',
        title: isTh ? `เกินงบประมาณหมวด ${b.category}` : `Over Budget in ${b.category}`,
        description: isTh
          ? `คุณใช้จ่ายหมวด ${b.category} เกินเพดานไปแล้ว ${formatCurrency(spent - b.budgetAmount, currency)} (ใช้ไป ${pct.toFixed(0)}%)`
          : `You exceeded your ${b.category} budget by ${formatCurrency(spent - b.budgetAmount, currency)} (${pct.toFixed(0)}% used).`
      });
    } else if (pct >= 80) {
      insights.push({
        id: `ins-bdg-warn-${b.category}`,
        type: 'budget_warning',
        title: isTh ? `แจ้งเตือนงบหมวด ${b.category}` : `${b.category} Budget Alert`,
        description: isTh
          ? `คุณใช้จ่ายไปแล้ว ${pct.toFixed(0)}% ของงบ ${b.category} คงเหลือที่ใช้ได้อีก ${formatCurrency(b.budgetAmount - spent, currency)}`
          : `You've utilized ${pct.toFixed(0)}% of your ${b.category} budget. Remaining: ${formatCurrency(b.budgetAmount - spent, currency)}.`
      });
    }
  });

  // Category comparison vs previous month
  const categories: Array<Transaction['category']> = ['Food', 'Shopping', 'Transportation', 'Entertainment'];
  categories.forEach(cat => {
    const thisSpent = currentTxs
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((s, t) => s + t.amount, 0);
    const lastSpent = prevTxs
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((s, t) => s + t.amount, 0);

    if (lastSpent > 0 && thisSpent > lastSpent) {
      const incPct = Math.round(((thisSpent - lastSpent) / lastSpent) * 100);
      if (incPct >= 15) {
        insights.push({
          id: `ins-inc-${cat}`,
          type: 'increase',
          title: isTh ? `ยอดใช้จ่ายหมวด ${cat} เพิ่มขึ้น` : `Spending Surge on ${cat}`,
          description: isTh
            ? `คุณใช้จ่ายในหมวด ${cat} เพิ่มขึ้น ${incPct}% เมื่อเทียบกับเดือนที่แล้ว (${formatCurrency(thisSpent, currency)} เทียบกับ ${formatCurrency(lastSpent, currency)})`
            : `You spent ${incPct}% more on ${cat} this month compared to last month (${formatCurrency(thisSpent, currency)} vs ${formatCurrency(lastSpent, currency)}).`
        });
      }
    }
  });

  // Actionable tips
  if (currentExpense > currentIncome && currentIncome > 0) {
    insights.push({
      id: 'ins-deficit',
      type: 'budget_danger',
      title: isTh ? 'ระวัง! รายจ่ายมากกว่ารายรับ' : 'Monthly Deficit Warning',
      description: isTh
        ? 'รายจ่ายเดือนนี้สูงเกินกว่ารายรับที่เข้ามา ควรชะลอการช้อปปิ้งและค่าใช้จ่ายที่ไม่จำเป็น'
        : 'Your expenses currently exceed your income. Consider curbing discretionary shopping and leisure entertainment.'
    });
  } else {
    insights.push({
      id: 'ins-tip-invest',
      type: 'tip',
      title: isTh ? 'คำแนะนำเพื่อสร้างความมั่งคั่ง' : 'Smart Wealth Recommendation',
      description: isTh
        ? 'แนะนำให้แบ่งเงินออมอัตโนมัติอย่างน้อย 20% ทันทีที่เงินเดือนเข้า เข้าบัญชีเงินสำรองฉุกเฉินหรือกองทุนดัชนี'
        : 'Consider setting up an automated transfer of 20% of income right after payday into your Emergency Fund or Index Fund.'
    });
  }

  return insights;
}

export function calculateFinancialScore(transactions: Transaction[], budgets: Budget[]): number {
  const currentMonth = getCurrentMonthString();
  const currentTxs = transactions.filter(t => t.date.startsWith(currentMonth));
  const income = currentTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = currentTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  let score = 70; // baseline

  // Factor 1: Savings rate
  if (income > 0) {
    const savingsRate = (income - expense) / income;
    if (savingsRate >= 0.3) score += 15;
    else if (savingsRate >= 0.15) score += 10;
    else if (savingsRate >= 0) score += 5;
    else score -= 20; // deficit
  }

  // Factor 2: Budget compliance
  let overBudgetCount = 0;
  budgets.forEach(b => {
    const spent = currentTxs
      .filter(t => t.type === 'expense' && t.category === b.category)
      .reduce((s, t) => s + t.amount, 0);
    if (spent > b.budgetAmount) overBudgetCount++;
  });

  if (overBudgetCount === 0 && budgets.length > 0) score += 15;
  else score -= overBudgetCount * 7;

  return Math.min(100, Math.max(10, Math.round(score)));
}
