import { UserProfile, Transaction, Budget, Wallet, FinancialGoal, NotificationItem } from '../types';

const STORAGE_KEYS = {
  USER: 'smart_expense_user',
  ALL_USERS: 'smart_expense_accounts',
  TRANSACTIONS: 'smart_expense_transactions',
  BUDGETS: 'smart_expense_budgets',
  WALLETS: 'smart_expense_wallets',
  GOALS: 'smart_expense_goals',
  NOTIFICATIONS: 'smart_expense_notifications',
  THEME: 'smart_expense_theme'
};

// Initial Seed Data to give users an immediate delightful realistic experience
const initialMockUser: UserProfile = {
  uid: 'demo-user-101',
  name: 'Alex Morgan',
  email: 'alex.morgan@finance.io',
  currency: 'THB',
  language: 'en',
  monthlyIncomeTarget: 85000,
  monthlySavingsTarget: 25000,
  darkMode: false,
  createdAt: new Date().toISOString()
};

const getDemoTransactions = (uid: string): Transaction[] => {
  const currentYear = new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1;
  const currentMonth = currentMonthNum.toString().padStart(2, '0');
  const prevMonthNum = currentMonthNum === 1 ? 12 : currentMonthNum - 1;
  const prevYear = currentMonthNum === 1 ? currentYear - 1 : currentYear;
  const prevMonth = prevMonthNum.toString().padStart(2, '0');

  return [
    {
      id: 'tx-1',
      uid,
      type: 'income',
      amount: 75000,
      category: 'Salary',
      paymentMethod: 'Bank Transfer',
      description: 'Monthly Senior Tech Lead Salary',
      date: `${currentYear}-${currentMonth}-01`,
      createdAt: new Date(`${currentYear}-${currentMonth}-01T09:00:00Z`).toISOString()
    },
    {
      id: 'tx-2',
      uid,
      type: 'income',
      amount: 15000,
      category: 'Freelance',
      paymentMethod: 'PromptPay',
      description: 'Mobile App UI/UX Consulting',
      date: `${currentYear}-${currentMonth}-05`,
      createdAt: new Date(`${currentYear}-${currentMonth}-05T14:30:00Z`).toISOString()
    },
    {
      id: 'tx-3',
      uid,
      type: 'expense',
      amount: 4500,
      category: 'Food',
      paymentMethod: 'Credit Card',
      description: 'Organic Market & Weekly Groceries',
      date: `${currentYear}-${currentMonth}-03`,
      createdAt: new Date(`${currentYear}-${currentMonth}-03T18:15:00Z`).toISOString()
    },
    {
      id: 'tx-4',
      uid,
      type: 'expense',
      amount: 3200,
      category: 'Transportation',
      paymentMethod: 'Credit Card',
      description: 'Gasoline & Expressway Toll Pass',
      date: `${currentYear}-${currentMonth}-04`,
      createdAt: new Date(`${currentYear}-${currentMonth}-04T08:45:00Z`).toISOString()
    },
    {
      id: 'tx-5',
      uid,
      type: 'expense',
      amount: 8500,
      category: 'Shopping',
      paymentMethod: 'Credit Card',
      description: 'Noise Cancelling Headphones & Work Gear',
      date: `${currentYear}-${currentMonth}-08`,
      createdAt: new Date(`${currentYear}-${currentMonth}-08T15:20:00Z`).toISOString()
    },
    {
      id: 'tx-6',
      uid,
      type: 'expense',
      amount: 3800,
      category: 'Bills',
      paymentMethod: 'Bank Transfer',
      description: 'High-speed Fiber Internet & Electricity',
      date: `${currentYear}-${currentMonth}-10`,
      createdAt: new Date(`${currentYear}-${currentMonth}-10T11:00:00Z`).toISOString()
    },
    {
      id: 'tx-7',
      uid,
      type: 'expense',
      amount: 2200,
      category: 'Entertainment',
      paymentMethod: 'E-Wallet',
      description: 'Cinema IMAX & Weekend Dining',
      date: `${currentYear}-${currentMonth}-12`,
      createdAt: new Date(`${currentYear}-${currentMonth}-12T20:30:00Z`).toISOString()
    },
    {
      id: 'tx-8',
      uid,
      type: 'expense',
      amount: 1800,
      category: 'Food',
      paymentMethod: 'Cash',
      description: 'Artisan Cafe & Team Lunch',
      date: `${currentYear}-${currentMonth}-15`,
      createdAt: new Date(`${currentYear}-${currentMonth}-15T13:10:00Z`).toISOString()
    },
    {
      id: 'tx-9',
      uid,
      type: 'expense',
      amount: 10000,
      category: 'Investment',
      paymentMethod: 'Bank Transfer',
      description: 'S&P 500 Index Mutual Fund Auto-DCA',
      date: `${currentYear}-${currentMonth}-06`,
      createdAt: new Date(`${currentYear}-${currentMonth}-06T10:00:00Z`).toISOString()
    },
    {
      id: 'tx-10',
      uid,
      type: 'income',
      amount: 5000,
      category: 'Investment',
      paymentMethod: 'Bank Transfer',
      description: 'Stock Quarterly Dividend Payout',
      date: `${currentYear}-${currentMonth}-14`,
      createdAt: new Date(`${currentYear}-${currentMonth}-14T09:40:00Z`).toISOString()
    },
    // Previous month sample for trend analysis
    {
      id: 'tx-11',
      uid,
      type: 'income',
      amount: 75000,
      category: 'Salary',
      paymentMethod: 'Bank Transfer',
      description: 'Previous Month Salary',
      date: `${prevYear}-${prevMonth}-01`,
      createdAt: new Date(`${prevYear}-${prevMonth}-01T09:00:00Z`).toISOString()
    },
    {
      id: 'tx-12',
      uid,
      type: 'expense',
      amount: 5200,
      category: 'Food',
      paymentMethod: 'Credit Card',
      description: 'Dining & Supermarket',
      date: `${prevYear}-${prevMonth}-05`,
      createdAt: new Date(`${prevYear}-${prevMonth}-05T12:00:00Z`).toISOString()
    },
    {
      id: 'tx-13',
      uid,
      type: 'expense',
      amount: 4000,
      category: 'Shopping',
      paymentMethod: 'Credit Card',
      description: 'Apparel & Books',
      date: `${prevYear}-${prevMonth}-11`,
      createdAt: new Date(`${prevYear}-${prevMonth}-11T16:00:00Z`).toISOString()
    }
  ];
};

const getDemoBudgets = (uid: string): Budget[] => {
  const currentYear = new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1;
  const currentMonth = `${currentYear}-${currentMonthNum.toString().padStart(2, '0')}`;

  return [
    { id: 'b-1', uid, month: currentMonth, category: 'Food', budgetAmount: 10000 },
    { id: 'b-2', uid, month: currentMonth, category: 'Shopping', budgetAmount: 10000 },
    { id: 'b-3', uid, month: currentMonth, category: 'Transportation', budgetAmount: 4500 },
    { id: 'b-4', uid, month: currentMonth, category: 'Bills', budgetAmount: 4500 },
    { id: 'b-5', uid, month: currentMonth, category: 'Entertainment', budgetAmount: 3000 },
    { id: 'b-6', uid, month: currentMonth, category: 'Healthcare', budgetAmount: 2500 }
  ];
};

const demoWallets: Wallet[] = [
  { id: 'w-1', name: 'Main Checking Account', type: 'Bank', balance: 54300, accountNumber: '***-***-8492', color: 'bg-emerald-500' },
  { id: 'w-2', name: 'Platinum Cash-Back Card', type: 'Credit Card', balance: -16200, accountNumber: '**** 4129', color: 'bg-indigo-600' },
  { id: 'w-3', name: 'Pocket Cash', type: 'Cash', balance: 3500, color: 'bg-amber-500' },
  { id: 'w-4', name: 'PromptPay / TrueMoney', type: 'E-Wallet', balance: 8200, accountNumber: '081-***-9921', color: 'bg-orange-500' }
];

const demoGoals: FinancialGoal[] = [
  { id: 'g-1', name: 'Emergency Fund (6 Months)', targetAmount: 200000, currentAmount: 145000, deadline: '2026-12-31', icon: 'ShieldCheck' },
  { id: 'g-2', name: 'Japan Autumn Trip', targetAmount: 60000, currentAmount: 42000, deadline: '2026-11-15', icon: 'Plane' },
  { id: 'g-3', name: 'New M3 MacBook Pro', targetAmount: 70000, currentAmount: 55000, deadline: '2026-10-30', icon: 'Laptop' }
];

// Helper to simulate asynchronous latency for realistic UX feel
const delay = (ms = 80) => new Promise(res => setTimeout(res, ms));

export class LocalStorageService {
  static getUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      // Default to demo user for instant first impression
      this.setUser(initialMockUser);
      return initialMockUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setUser(user: UserProfile | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  }

  static async getTransactions(uid: string): Promise<Transaction[]> {
    await delay();
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      const initial = getDemoTransactions(uid);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initial));
      return initial;
    }
    try {
      const all: Transaction[] = JSON.parse(raw);
      return all.filter(t => t.uid === uid);
    } catch {
      return [];
    }
  }

  static async saveTransaction(transaction: Transaction): Promise<void> {
    await delay();
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    let all: Transaction[] = [];
    try {
      all = raw ? JSON.parse(raw) : [];
    } catch {
      all = [];
    }
    const idx = all.findIndex(t => t.id === transaction.id);
    if (idx >= 0) {
      all[idx] = transaction;
    } else {
      all.unshift(transaction);
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
  }

  static async deleteTransaction(id: string): Promise<void> {
    await delay();
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return;
    try {
      const all: Transaction[] = JSON.parse(raw);
      const filtered = all.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  }

  static async getBudgets(uid: string, month?: string): Promise<Budget[]> {
    await delay();
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      const initial = getDemoBudgets(uid);
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initial));
      return month ? initial.filter(b => b.month === month) : initial;
    }
    try {
      const all: Budget[] = JSON.parse(raw);
      let userBudgets = all.filter(b => b.uid === uid);
      if (month) {
        userBudgets = userBudgets.filter(b => b.month === month);
      }
      return userBudgets;
    } catch {
      return [];
    }
  }

  static async saveBudget(budget: Budget): Promise<void> {
    await delay();
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    let all: Budget[] = [];
    try {
      all = raw ? JSON.parse(raw) : [];
    } catch {
      all = [];
    }
    const idx = all.findIndex(b => b.id === budget.id || (b.uid === budget.uid && b.month === budget.month && b.category === budget.category));
    if (idx >= 0) {
      all[idx] = budget;
    } else {
      all.push(budget);
    }
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(all));
  }

  static async deleteBudget(id: string): Promise<void> {
    await delay();
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) return;
    try {
      const all: Budget[] = JSON.parse(raw);
      const filtered = all.filter(b => b.id !== id);
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  }

  static async getWallets(): Promise<Wallet[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.WALLETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(demoWallets));
      return demoWallets;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return demoWallets;
    }
  }

  static async saveWallet(wallet: Wallet): Promise<void> {
    const wallets = await this.getWallets();
    const idx = wallets.findIndex(w => w.id === wallet.id);
    if (idx >= 0) {
      wallets[idx] = wallet;
    } else {
      wallets.push(wallet);
    }
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  }

  static async getGoals(): Promise<FinancialGoal[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(demoGoals));
      return demoGoals;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return demoGoals;
    }
  }

  static async saveGoal(goal: FinancialGoal): Promise<void> {
    const goals = await this.getGoals();
    const idx = goals.findIndex(g => g.id === goal.id);
    if (idx >= 0) {
      goals[idx] = goal;
    } else {
      goals.push(goal);
    }
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  static async deleteGoal(id: string): Promise<void> {
    const goals = await this.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
  }

  static resetAllData(uid: string): void {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.WALLETS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    // Re-seed fresh demo data
    const initialTxs = getDemoTransactions(uid);
    const initialBudgets = getDemoBudgets(uid);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTxs));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initialBudgets));
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(demoWallets));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(demoGoals));
  }

  static exportDatabase(): string {
    const data = {
      transactions: localStorage.getItem(STORAGE_KEYS.TRANSACTIONS),
      budgets: localStorage.getItem(STORAGE_KEYS.BUDGETS),
      wallets: localStorage.getItem(STORAGE_KEYS.WALLETS),
      goals: localStorage.getItem(STORAGE_KEYS.GOALS),
      user: localStorage.getItem(STORAGE_KEYS.USER),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importDatabase(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, parsed.transactions);
      if (parsed.budgets) localStorage.setItem(STORAGE_KEYS.BUDGETS, parsed.budgets);
      if (parsed.wallets) localStorage.setItem(STORAGE_KEYS.WALLETS, parsed.wallets);
      if (parsed.goals) localStorage.setItem(STORAGE_KEYS.GOALS, parsed.goals);
      if (parsed.user) localStorage.setItem(STORAGE_KEYS.USER, parsed.user);
      return true;
    } catch {
      return false;
    }
  }
}
