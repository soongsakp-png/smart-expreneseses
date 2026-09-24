import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/finance';
import { getCategoryLabel } from '../utils/i18n';

type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const ReportsPage: React.FC = () => {
  const { transactions, activeMonth, currency, language, t } = useApp();
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const [exporting, setExporting] = useState<string | null>(null);

  // Filter transactions based on chosen period
  const getFilteredTransactions = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (period) {
      case 'daily':
        return transactions.filter(t => t.date === todayStr);
      case 'weekly': {
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
      }
      case 'monthly':
        return transactions.filter(t => t.date.startsWith(activeMonth));
      case 'yearly': {
        const year = activeMonth.split('-')[0];
        return transactions.filter(t => t.date.startsWith(year));
      }
    }
  };

  const periodTxs = getFilteredTransactions();
  const totalIncome = periodTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = periodTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netSavings = totalIncome - totalExpense;

  // 1. Export PDF
  const handleExportPDF = () => {
    setExporting('pdf');
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Smart Expense Tracker - Financial Statement', 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Period: ${period.toUpperCase()} | Generated: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Total Income: ${formatCurrency(totalIncome, currency)} | Total Expense: ${formatCurrency(totalExpense, currency)} | Net: ${formatCurrency(netSavings, currency)}`, 14, 36);

        const tableRows = periodTxs.map(t => [
          t.date,
          t.type.toUpperCase(),
          getCategoryLabel(t.category, language),
          t.description || '-',
          t.paymentMethod,
          formatCurrency(t.amount, currency)
        ]);

        autoTable(doc, {
          startY: 42,
          head: [['Date', 'Type', 'Category', 'Description', 'Method', 'Amount']],
          body: tableRows,
          theme: 'striped',
          headStyles: { fillColor: [99, 102, 241] }
        });

        doc.save(`smart-expense-${period}-${Date.now()}.pdf`);
      } catch (err) {
        console.error('PDF error', err);
      } finally {
        setExporting(null);
      }
    }, 200);
  };

  // 2. Export Excel (.xlsx)
  const handleExportExcel = () => {
    setExporting('excel');
    setTimeout(() => {
      try {
        const worksheetData = periodTxs.map(t => ({
          'Date': t.date,
          'Type': t.type === 'income' ? 'Income' : 'Expense',
          'Category': getCategoryLabel(t.category, language),
          'Description': t.description,
          'Payment Method': t.paymentMethod,
          'Amount': t.amount,
          'Currency': currency
        }));

        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Statement');
        XLSX.writeFile(wb, `smart-expense-${period}-${Date.now()}.xlsx`);
      } catch (err) {
        console.error('Excel error', err);
      } finally {
        setExporting(null);
      }
    }, 200);
  };

  // 3. Export CSV
  const handleExportCSV = () => {
    setExporting('csv');
    setTimeout(() => {
      try {
        const headers = ['Date,Type,Category,Description,Payment Method,Amount,Currency'];
        const rows = periodTxs.map(t => 
          `"${t.date}","${t.type}","${getCategoryLabel(t.category, language)}","${t.description.replace(/"/g, '""')}","${t.paymentMethod}","${t.amount}","${currency}"`
        );
        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `smart-expense-${period}-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('CSV error', err);
      } finally {
        setExporting(null);
      }
    }, 200);
  };

  const periodLabel = period === 'daily' ? t.daily : period === 'weekly' ? t.weekly : period === 'monthly' ? t.monthly : t.yearly;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.financialReports}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.reportsSubtitle}
        </p>
      </div>

      {/* Period Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        {(['daily', 'weekly', 'monthly', 'yearly'] as ReportPeriod[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition cursor-pointer ${
              period === p
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {p === 'daily' ? t.daily : p === 'weekly' ? t.weekly : p === 'monthly' ? t.monthly : t.yearly}
          </button>
        ))}
      </div>

      {/* Export Action Card */}
      <div className="p-6 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white rounded-3xl shadow-xl shadow-indigo-600/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-indigo-100 uppercase tracking-wider">
            {t.exportCenter}
          </span>
          <h3 className="text-xl font-black mt-2">
            {t.downloadStatement.replace('{period}', periodLabel)}
          </h3>
          <p className="text-xs text-indigo-100/90 mt-1 max-w-lg leading-relaxed">
            {t.reportAuditReady.replace('{count}', periodTxs.length.toString())}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            disabled={!!exporting}
            className="px-4 py-2.5 bg-white text-indigo-700 rounded-xl text-xs font-bold shadow-md hover:bg-indigo-50 active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-rose-500" />
            <span>{exporting === 'pdf' ? t.generatingPDF : t.exportPDF}</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={!!exporting}
            className="px-4 py-2.5 bg-white text-indigo-700 rounded-xl text-xs font-bold shadow-md hover:bg-indigo-50 active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{exporting === 'excel' ? t.buildingExcel : t.exportExcel}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!!exporting}
            className="px-4 py-2.5 bg-indigo-900/60 hover:bg-indigo-900/80 text-white rounded-xl text-xs font-bold border border-white/20 active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting === 'csv' ? t.exportingCSV : t.exportCSV}</span>
          </button>
        </div>
      </div>

      {/* Period Financial Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">{t.periodIncome}</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {formatCurrency(totalIncome, currency)}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">{t.periodExpense}</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {formatCurrency(totalExpense, currency)}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold">{t.netPeriodSavings}</span>
          <div className={`text-2xl font-black mt-2 ${netSavings >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600'}`}>
            {formatCurrency(netSavings, currency)}
          </div>
        </div>
      </div>

      {/* Preview Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-4">
          {t.reportPreview} ({periodTxs.length})
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">{t.date}</th>
                <th className="pb-3 font-semibold">{t.category}</th>
                <th className="pb-3 font-semibold">{t.description}</th>
                <th className="pb-3 font-semibold">{t.paymentMethod}</th>
                <th className="pb-3 font-semibold text-right">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {periodTxs.slice(0, 10).map(t => (
                <tr key={t.id} className="text-slate-700 dark:text-slate-300">
                  <td className="py-2.5 font-medium">{formatDate(t.date)}</td>
                  <td className="py-2.5 font-semibold text-slate-900 dark:text-white">
                    {getCategoryLabel(t.category, language)}
                  </td>
                  <td className="py-2.5 text-slate-500">{t.description}</td>
                  <td className="py-2.5">{t.paymentMethod}</td>
                  <td className={`py-2.5 text-right font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
