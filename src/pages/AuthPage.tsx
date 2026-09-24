import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User as UserIcon, Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const { language, setLanguage, t } = useApp();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@finance.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.loginWithEmail(email, password);
      } else {
        if (!name.trim()) throw new Error(language === 'th' ? 'กรุณากรอกชื่อ-นามสกุลของคุณ' : 'Please enter your full name');
        await authService.registerWithEmail(name, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || (language === 'th' ? 'การเข้าสู่ระบบล้มเหลว' : 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authService.loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(language === 'th' ? 'การเข้าสู่ระบบด้วย Google ล้มเหลว' : 'Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await authService.sendPasswordResetEmail(forgotEmail);
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModal(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Language switch on Auth page */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === 'th' ? 'ไทย (TH)' : 'English (EN)'}</span>
          </button>
        </div>

        {/* Brand Icon Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.appName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? t.signInSubtitle : t.createAccountSubtitle}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              isLogin ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            {t.signInBtn}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              !isLogin ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            {t.registerBtn}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" /> {t.fullName}
              </label>
              <input
                type="text"
                required
                placeholder={language === 'th' ? 'เช่น สมชาย ใจดี' : 'e.g. Alex Morgan'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {t.emailAddress}
            </label>
            <input
              type="email"
              required
              placeholder="alex@finance.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> {language === 'th' ? 'รหัสผ่าน' : 'Password'}
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  {t.forgotPassword}
                </button>
              )}
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? (language === 'th' ? 'กำลังตรวจสอบ...' : 'Please wait...') : isLogin ? t.signInBtn : t.registerBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400">
              {t.orContinueWith}
            </span>
          </div>
        </div>

        {/* Google Single Sign-On */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.25C.45 8.19 0 9.99 0 12s.45 3.81 1.25 5.41l4.03-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.97 6.72-4.97z"
            />
          </svg>
          <span>{t.continueWithGoogle}</span>
        </button>

        {/* Demo Fast Login Banner */}
        <div className="mt-6 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t.demoHint}
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
              {t.resetPasswordTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {t.resetPasswordDesc}
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl">
                {t.resetSuccess}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="px-4 py-2 text-xs text-slate-500 rounded-xl"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-xs"
                  >
                    {t.sendResetEmail}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
