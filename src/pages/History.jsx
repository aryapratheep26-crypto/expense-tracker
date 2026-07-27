import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getIncome,
  getExpenses,
  deleteIncome,
  deleteExpense,
  resetAllData,
} from "../utils/storage";
import { formatCurrency } from "../utils/calculations";
import { Navbar } from "../components/Navbar";
import { CategoryBadge } from "../components/CategoryBadge";
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Download,
  RotateCcw,
  ArrowLeft,
  Inbox,
} from "lucide-react";

function History() {
  const [incomeList, setIncomeList] = useState(() => (Array.isArray(getIncome()) ? getIncome() : []));
  const [expenseList, setExpenseList] = useState(() => (Array.isArray(getExpenses()) ? getExpenses() : []));
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const refreshData = () => {
    setIncomeList(Array.isArray(getIncome()) ? getIncome() : []);
    setExpenseList(Array.isArray(getExpenses()) ? getExpenses() : []);
  };

  const handleDeleteIncome = (item, index) => {
    deleteIncome(item.id || index);
    refreshData();
  };

  const handleDeleteExpense = (item, index) => {
    deleteExpense(item.id || index);
    refreshData();
  };

  const handleResetData = () => {
    if (window.confirm("Reset tracker with sample expenses?")) {
      resetAllData();
      refreshData();
    }
  };

  const combinedTransactions = useMemo(() => {
    const list = [
      ...incomeList.map((item, idx) => ({ ...item, type: "income", origIdx: idx })),
      ...expenseList.map((item, idx) => ({ ...item, type: "expense", origIdx: idx })),
    ];

    return list.filter((item) => {
      if (typeFilter === "income" && item.type !== "income") return false;
      if (typeFilter === "expense" && item.type !== "expense") return false;

      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.title || "").toLowerCase().includes(query);
        const descMatch = (item.description || "").toLowerCase().includes(query);
        const catMatch = (item.category || "").toLowerCase().includes(query);
        const amountMatch = String(item.amount || "").includes(query);
        return titleMatch || descMatch || catMatch || amountMatch;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date || 0) - new Date(a.date || 0);
      if (sortBy === "oldest") return new Date(a.date || 0) - new Date(b.date || 0);
      if (sortBy === "highest") return Number(b.amount || 0) - Number(a.amount || 0);
      if (sortBy === "lowest") return Number(a.amount || 0) - Number(b.amount || 0);
      return 0;
    });
  }, [incomeList, expenseList, typeFilter, categoryFilter, searchQuery, sortBy]);

  const exportToCSV = () => {
    if (combinedTransactions.length === 0) return;

    const headers = ["Type", "Title", "Category", "Amount (INR)", "Date", "Description"];
    const rows = combinedTransactions.map((t) => [
      t.type,
      `"${(t.title || "").replace(/"/g, '""')}"`,
      t.category || "General",
      t.amount,
      t.date || "",
      `"${(t.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transaction_history_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allCategories = useMemo(() => {
    const set = new Set();
    [...incomeList, ...expenseList].forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [incomeList, expenseList]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
            <p className="text-xs text-slate-500">View, search, filter and manage all recorded entries</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              disabled={combinedTransactions.length === 0}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 disabled:opacity-40 cursor-pointer transition-colors shadow-2xs"
              title="Download CSV"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              Export CSV
            </button>

            <button
              onClick={handleResetData}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs"
              title="Reset sample data"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Sample Data
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions by title, note, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="highest">Sort: Highest Amount</option>
                <option value="lowest">Sort: Lowest Amount</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              {[
                { id: "all", label: "All Transactions" },
                { id: "expense", label: "Expenses Only" },
                { id: "income", label: "Income Only" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    typeFilter === tab.id
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {combinedTransactions.length} of {incomeList.length + expenseList.length} items
            </div>
          </div>
        </div>

        {/* Transactions Table / Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {combinedTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {combinedTransactions.map((item, idx) => {
                const isInc = item.type === "income";
                return (
                  <div
                    key={item.id || `${item.type}-${idx}`}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                          isInc
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {isInc ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900">
                            {item.title || item.description || (isInc ? "Money Received" : "Expense")}
                          </h4>
                          <CategoryBadge category={item.category} size="sm" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          <span className="font-medium text-slate-700">{item.date || "No date"}</span>
                          {item.description && ` • ${item.description}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                      <span className={`font-extrabold text-base ${isInc ? "text-emerald-600" : "text-rose-600"}`}>
                        {isInc ? "+" : "-"} {formatCurrency(item.amount)}
                      </span>

                      <button
                        onClick={() =>
                          isInc
                            ? handleDeleteIncome(item, item.origIdx)
                            : handleDeleteExpense(item, item.origIdx)
                        }
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center text-slate-400 p-6 space-y-3">
              <Inbox className="w-12 h-12 stroke-[1.5] text-slate-300" />
              <h3 className="text-base font-bold text-slate-700">No Transactions Found</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Try clearing your search query or switching filters to see past records.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default History;
