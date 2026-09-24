import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Moon, 
  Sun, 
  Plus, 
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateSmartInsights } from '../utils/finance';

interface NavbarProps {
  onMenuClick: () => void;
  onOpenNewTx: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onOpenNewTx }) => {
  const { 
    user, 
    isDarkMode, 
    toggleDarkMode, 
    transactions, 
    budgets, 
    currency,
    language,
    setLanguage,
    t,
    activeMonth,
    setActiveMonth 
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Generate automated budget & financial alert notifications
  const alerts = generateSmartInsights(transactions, budgets, currency, language);
  const unreadCount = alerts.filter(a => a.type.startsWith('budget')).length;

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveMonth(e.target.value);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Month Selector Widget */}
        <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs">
          <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">
            {t.viewing}
          </span>
          <input
            type="month"
            value={activeMonth}
            onChange={handleMonthChange}
            className="bg-transparent font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer text-xs"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher Badge Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
        >
          <Languages className="w-3.5 h-3.5 text-indigo-500" />
          <span>{language === 'th' ? 'ไทย (TH)' : 'EN'}</span>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenNewTx}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs shadow-sm shadow-indigo-600/20 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t.addEntry}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                      {t.alertsAndTips}
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    {alerts.length} {t.updates}
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-2">
                  {alerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      {t.noAlerts}
                    </div>
                  ) : (
                    alerts.map(item => (
                      <div key={item.id} className="py-2.5 flex items-start gap-2.5">
                        {item.type === 'budget_danger' ? (
                          <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        ) : item.type === 'budget_warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Mini Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden lg:inline max-w-[100px] truncate">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};
