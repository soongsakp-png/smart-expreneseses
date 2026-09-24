import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { UserProfile, Transaction, Budget, Wallet, FinancialGoal } from '../types';
import { authService } from '../services/authService';
import { LocalStorageService } from '../services/storageService';
import { getCurrentMonthString } from '../utils/finance';
import { Language, translations } from '../utils/i18n';

interface AppContextType {
  user: UserProfile | null;
  loading: boolean;
  transactions: Transaction[];
  budgets: Budget[];
  wallets: Wallet[];
  goals: FinancialGoal[];
  currency: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['th'];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  refreshData: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'uid' | 'createdAt'> & { id?: string }) => Promise<void>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  saveBudget: (budget: Omit<Budget, 'id' | 'uid'> & { id?: string }) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  saveWallet: (wallet: Wallet) => Promise<void>;
  saveGoal: (goal: FinancialGoal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  resetAllUserData: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  activeMonth: string;
  setActiveMonth: (month: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [activeMonth, setActiveMonth] = useState<string>(getCurrentMonthString());
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('smart_expense_lang') as Language;
    if (saved === 'th' || saved === 'en') return saved;
    return (user?.language as Language) || 'th'; // default to Thai for the user request
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('smart_expense_theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const currency = user?.currency || 'THB';
  const t = translations[language] || translations.th;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smart_expense_lang', lang);
    if (user) {
      updateProfile({ language: lang });
    }
  };

  // Apply dark mode class to root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smart_expense_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smart_expense_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const loadData = async (uid: string) => {
    try {
      const [txs, bdgs, wls, gls] = await Promise.all([
        LocalStorageService.getTransactions(uid),
        LocalStorageService.getBudgets(uid),
        LocalStorageService.getWallets(),
        LocalStorageService.getGoals()
      ]);
      setTransactions(txs);
      setBudgets(bdgs);
      setWallets(wls);
      setGoals(gls);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadData(currentUser.uid);
      } else {
        setTransactions([]);
        setBudgets([]);
        setWallets([]);
        setGoals([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshData = async () => {
    if (user) {
      await loadData(user.uid);
    }
  };

  const addTransaction = async (
    txData: Omit<Transaction, 'id' | 'uid' | 'createdAt'> & { id?: string }
  ) => {
    if (!user) return;
    const newTx: Transaction = {
      ...txData,
      id: txData.id || 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      uid: user.uid,
      createdAt: new Date().toISOString()
    };
    await LocalStorageService.saveTransaction(newTx);
    await refreshData();
  };

  const updateTransaction = async (tx: Transaction) => {
    await LocalStorageService.saveTransaction(tx);
    await refreshData();
  };

  const deleteTransaction = async (id: string) => {
    await LocalStorageService.deleteTransaction(id);
    await refreshData();
  };

  const saveBudget = async (
    budgetData: Omit<Budget, 'id' | 'uid'> & { id?: string }
  ) => {
    if (!user) return;
    const budget: Budget = {
      ...budgetData,
      id: budgetData.id || 'b_' + Date.now(),
      uid: user.uid
    };
    await LocalStorageService.saveBudget(budget);
    await refreshData();
  };

  const deleteBudget = async (id: string) => {
    await LocalStorageService.deleteBudget(id);
    await refreshData();
  };

  const saveWallet = async (wallet: Wallet) => {
    await LocalStorageService.saveWallet(wallet);
    await refreshData();
  };

  const saveGoal = async (goal: FinancialGoal) => {
    await LocalStorageService.saveGoal(goal);
    await refreshData();
  };

  const deleteGoal = async (id: string) => {
    await LocalStorageService.deleteGoal(id);
    await refreshData();
  };

  const resetAllUserData = async () => {
    if (!user) return;
    LocalStorageService.resetAllData(user.uid);
    await refreshData();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await authService.updateUserProfile(updates);
    setUser(updated);
  };

  const logout = async () => {
    await authService.logout();
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      transactions,
      budgets,
      wallets,
      goals,
      currency,
      language,
      setLanguage,
      t,
      isDarkMode,
      toggleDarkMode,
      refreshData,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      saveBudget,
      deleteBudget,
      saveWallet,
      saveGoal,
      deleteGoal,
      resetAllUserData,
      updateProfile,
      logout,
      activeMonth,
      setActiveMonth
    }),
    [user, loading, transactions, budgets, wallets, goals, currency, language, t, isDarkMode, activeMonth]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
