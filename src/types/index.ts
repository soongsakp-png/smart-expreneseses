export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 
  | 'Salary'
  | 'Bonus'
  | 'Investment'
  | 'Freelance'
  | 'Gift'
  | 'Other';

export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Investment'
  | 'Travel'
  | 'Other';

export type Category = IncomeCategory | ExpenseCategory;

export type PaymentMethod = 
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'Bank Transfer'
  | 'E-Wallet'
  | 'PromptPay'
  | 'Other';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  currency: string; // e.g. 'THB', 'USD', 'EUR', 'GBP', 'JPY'
  language: string; // 'en' | 'th'
  monthlyIncomeTarget?: number;
  monthlySavingsTarget?: number;
  darkMode: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  uid: string;
  type: TransactionType;
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  description: string;
  receiptUrl?: string; // base64 or URL
  date: string; // YYYY-MM-DD
  createdAt: string;
  walletId?: string;
  isRecurring?: boolean;
}

export interface Budget {
  id: string;
  uid: string;
  month: string; // YYYY-MM
  category: ExpenseCategory;
  budgetAmount: number;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'Cash' | 'Bank' | 'Credit Card' | 'E-Wallet';
  balance: number;
  accountNumber?: string;
  color?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  timestamp: string;
  read: boolean;
}
