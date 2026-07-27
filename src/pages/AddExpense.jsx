import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveExpense } from "../utils/storage";
import { Navbar } from "../components/Navbar";
import { CATEGORY_CONFIG } from "../utils/constants";
import {
  ArrowLeft,
  Plus,
  Calendar,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";

const CATEGORIES = [
  "Food",
  "Transportation",
  "College",
  "Gift",
  "Bills",
  "Shopping",
  "Health",
  "Other",
];

const PRESETS = [50, 100, 200, 500, 1000];

function AddExpense() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) return;

    const expense = {
      amount: Number(amount),
      category,
      title: title.trim() || `${category} Expense`,
      description: description.trim(),
      date: date || new Date().toISOString().split("T")[0],
    };

    saveExpense(expense);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    setSuccess(true);

    setTimeout(() => {
      setAmount("");
      setTitle("");
      setDescription("");
      setSuccess(false);
      navigate("/");
    }, 1200);
  };

  const addPreset = (val) => {
    const current = Number(amount) || 0;
    setAmount(String(current + val));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Add New Expense</h1>
              <p className="text-xs text-slate-500">Log money spent for food, travel, college, or daily items</p>
            </div>
          </div>

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Expense Saved Successfully!</h3>
              <p className="text-xs text-slate-500">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Pill Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Select Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other;
                    const Icon = cfg.icon;
                    const isSelected = category === cat;

                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-rose-50 text-rose-700 border-rose-300 shadow-2xs font-bold"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Input & Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    step="any"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-2xl py-3.5 pl-10 pr-4 text-xl font-extrabold text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium">Quick add:</span>
                  {PRESETS.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => addPreset(val)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title / Short Note */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Expense Title / Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lunch, Bus Pass, Books"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Description & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    Description / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Optional notes or split"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <Link
                  to="/"
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Save Expense
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddExpense;
