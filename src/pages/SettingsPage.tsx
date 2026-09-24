import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocalStorageService } from '../services/storageService';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Coins, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../utils/i18n';

export const SettingsPage: React.FC = () => {
  const { 
    user, 
    updateProfile, 
    isDarkMode, 
    toggleDarkMode, 
    resetAllUserData,
    language,
    setLanguage,
    t
  } = useApp();

  const [currency, setCurrency] = useState(user?.currency || 'THB');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [successMsg, setSuccessMsg] = useState('');
  const [importError, setImportError] = useState('');

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setLanguage(selectedLang);
    await updateProfile({
      currency,
      language: selectedLang
    });
    setSuccessMsg(language === 'th' ? 'บันทึกการตั้งค่าเรียบร้อยแล้ว!' : 'Preferences updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleResetData = async () => {
    const confirmText = language === 'th' 
      ? 'คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น? การกระทำนี้ไม่สามารถย้อนกลับได้'
      : 'Are you sure you want to reset all transactions and budgets to initial demo state? This cannot be undone.';

    if (window.confirm(confirmText)) {
      await resetAllUserData();
      setSuccessMsg(language === 'th' ? 'ข้อมูลถูกรีเซ็ตกลับสู่สถานะเริ่มต้นเรียบร้อยแล้ว' : 'All user financial data was re-initialized to clean state.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleExportBackup = () => {
    const jsonStr = LocalStorageService.exportDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-expense-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = LocalStorageService.importDatabase(content);
      if (success) {
        window.location.reload();
      } else {
        setImportError(language === 'th' ? 'ไฟล์สำรองข้อมูล JSON ไม่ถูกต้อง' : 'Invalid backup JSON schema');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.appSettings}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.settingsSubtitle}
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {importError && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{importError}</span>
        </div>
      )}

      {/* 1. Regional & Currency Settings */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-base text-slate-800 dark:text-white mb-1 flex items-center gap-2">
          <Coins className="w-4 h-4 text-indigo-500" />
          <span>{t.currencyAndRegion}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {t.currencyRegionDesc}
        </p>

        <form onSubmit={handleSavePreferences} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              {t.defaultCurrency}
            </label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="THB">THB (฿ - บาทไทย Thai Baht)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
              <option value="JPY">JPY (¥ - Japanese Yen)</option>
              <option value="SGD">SGD (S$ - Singapore Dollar)</option>
              <option value="AUD">AUD (A$ - Australian Dollar)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.systemLanguage}</span>
            </label>
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value as Language)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="th">ภาษาไทย (Thai)</option>
              <option value="en">English (United States)</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            {t.savePreferences}
          </button>
        </form>
      </div>

      {/* 2. Visual Theme & Dark Mode */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-slate-600" />}
            <span>{t.visualThemeMode}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.themeDesc}
          </p>
        </div>

        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          {isDarkMode ? t.enableLightMode : t.enableDarkMode}
        </button>
      </div>

      {/* 3. Backup & Restore Data */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-base text-slate-800 dark:text-white mb-1 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-500" />
          <span>{t.backupAndRestore}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {t.backupDesc}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadFullBackup}</span>
          </button>

          <label className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>{t.restoreBackup}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 4. Danger Zone: Reset Data */}
      <div className="p-6 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-sm">
        <h3 className="font-bold text-base text-rose-700 dark:text-rose-400 mb-1 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>{t.dangerZone}</span>
        </h3>
        <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mb-4">
          {t.dangerZoneDesc}
        </p>

        <button
          onClick={handleResetData}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          {t.resetAppData}
        </button>
      </div>
    </div>
  );
};
