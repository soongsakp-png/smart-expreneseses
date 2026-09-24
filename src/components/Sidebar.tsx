import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  FileSpreadsheet,
  Settings,
  User,
  LogOut,
  Sparkles,
  WalletCards,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenNewTx: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen, onOpenNewTx }) => {
  const { user, logout, t } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { label: t.dashboard, path: '/', icon: LayoutDashboard },
    { label: t.income, path: '/income', icon: TrendingUp },
    { label: t.expenses, path: '/expenses', icon: TrendingDown },
    { label: t.budgets, path: '/budgets', icon: PieChartIcon },
    { label: t.reports, path: '/reports', icon: FileSpreadsheet },
    { label: t.analytics, path: '/analytics', icon: BarChart3 },
    { label: t.wallets, path: '/wallets', icon: WalletCards },
    { label: t.profile, path: '/profile', icon: User },
    { label: t.settings, path: '/settings', icon: Settings },
    { label: t.about, path: '/about', icon: HelpCircle }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Smart Expense
            </h1>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-wider">
              {t.tagline}
            </p>
          </div>
        </div>

        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Action Button */}
      <div className="px-5 mb-4">
        <button
          onClick={() => {
            onOpenNewTx();
            if (mobileOpen) setMobileOpen(false);
          }}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.newTransaction}</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-2">
          {t.navMain}
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (mobileOpen) setMobileOpen(false);
              }}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'Logged in'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={t.logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
