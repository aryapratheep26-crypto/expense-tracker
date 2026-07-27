import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getExpenses,
  getIncome,
  deleteExpense,
  deleteIncome,
} from "../utils/storage";
import {
  getCategoryTotals,
  formatCurrency,
} from "../utils/calculations";
import { CategoryBadge } from "../components/CategoryBadge";
import { Navbar } from "../components/Navbar";
import { AiAdvisorModal } from "../components/AiAdvisorModal";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  Sparkles,
  ChevronRight,
  PiggyBank,
  PieChart as PieIcon,
} from "lucide-react";

function Dashboard() {
  const [expenses, setExpenses] = useState(() => (Array.isArray(getExpenses()) ? getExpenses() : []));
  const [income, setIncome] = useState(() => (Array.isArray(getIncome()) ? getIncome() : []));
  const [isAiOpen, setIsAiOpen] = useState(false);

  const refreshData = () => {
    setExpenses(Array.isArray(getExpenses()) ? getExpenses() : []);
    setIncome(Array.isArray(getIncome()) ? getIncome() : []);
  };

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const balance = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  const categoryTotals = getCategoryTotals(expenses);

  const categoryEntries = Object.entries(categoryTotals)
    .filter(([, val]) => val > 0)
    .sort((a, b) => b[1] - a[1]);

  const recentTransactions = [
    ...income.map((item) => ({ ...item, type: "income" })),
    ...expenses.map((item) => ({ ...item, type: "expense" })),
  ]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 6);

  const handleDeleteItem = (item) => {
    if (item.type === "income") {
      deleteIncome(item.id || item);
    } else {
      deleteExpense(item.id || item);
    }
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar onOpenAi={() => setIsAiOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900">
              Financial Overview
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal income, expenses, and budget tracker
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/income"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Add Money
            </Link>

            <Link
              to="/add"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all shadow-xs active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              Add Expense
            </Link>

            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              Insights
            </button>
          </div>
        </div>

        {/* 4 Cards Stat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Balance */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Remaining Balance
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {formatCurrency(balance)}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <span className={`font-semibold ${balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {balance >= 0 ? "Positive Balance" : "In Deficit!"}
              </span>
            </div>
          </div>

          {/* Card 2: Total Income */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Income
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {formatCurrency(totalIncome)}
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              {income.length} income entries
            </div>
          </div>

          {/* Card 3: Total Expenses */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Expenses
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-rose-600">
              {formatCurrency(totalExpense)}
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              {expenses.length} expense entries
            </div>
          </div>

          {/* Card 4: Savings Rate */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Savings Rate
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <PiggyBank className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-indigo-600">
              {savingsRate}%
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, savingsRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">
                Category Spending Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">By Category</span>
          </div>

          {categoryEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
              {categoryEntries.map(([category, amount]) => {
                const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <CategoryBadge category={category} size="sm" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{formatCurrency(amount)}</span>
                        <span className="text-slate-500 text-[11px]">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No expense categories recorded yet.
            </div>
          )}
        </div>

        {/* Recent Activity List */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Recent Activity</h3>
              <p className="text-xs text-slate-500">Latest transactions logged in your wallet</p>
            </div>
            <Link
              to="/history"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Full History
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((item, idx) => {
                const isInc = item.type === "income";
                return (
                  <div
                    key={item.id || idx}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isInc
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {isInc ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-slate-900">
                            {item.title || item.description || (isInc ? "Money Received" : "Expense")}
                          </p>
                          <CategoryBadge category={item.category} size="sm" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.date || "Today"} {item.description && `• ${item.description}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-sm ${isInc ? "text-emerald-600" : "text-rose-600"}`}>
                        {isInc ? "+" : "-"} {formatCurrency(item.amount)}
                      </span>

                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No recent transactions. Click "Add Money" or "Add Expense" to get started!
            </div>
          )}
        </div>
      </main>

      {/* AI Advisor Modal */}
      <AiAdvisorModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        expenses={expenses}
        income={income}
      />
    </div>
  );
}

export default Dashboard;
