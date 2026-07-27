import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveIncome } from "../utils/storage";
import { Navbar } from "../components/Navbar";
import {
  ArrowLeft,
  ArrowDownLeft,
  Plus,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";

const SOURCES = [
  "Pocket Money",
  "Salary",
  "Gift",
];

const PRESETS = [500, 1000, 2000, 5000];

function AddIncome() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Pocket Money");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) return;

    const incomeObj = {
      amount: Number(amount),
      category,
      title: title.trim() || `${category} Received`,
      date: date || new Date().toISOString().split("T")[0],
    };

    saveIncome(incomeObj);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    setSuccess(true);

    setTimeout(() => {
      setAmount("");
      setTitle("");
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
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Add Income / Money</h1>
              <p className="text-xs text-slate-500">Log pocket money, salary, or gifts</p>
            </div>
          </div>

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Money Saved Successfully!</h3>
              <p className="text-xs text-slate-500">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Source Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Income Category / Source
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {SOURCES.map((src) => {
                    const isSelected = category === src;
                    return (
                      <button
                        type="button"
                        key={src}
                        onClick={() => setCategory(src)}
                        className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer truncate ${
                          isSelected
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-2xs"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {src}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Amount Received (₹)
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl py-3.5 pl-10 pr-4 text-xl font-extrabold text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Quick Presets */}
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

              {/* Income Title & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    Title / From Whom
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly Pocket Money"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
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
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <Link
                  to="/"
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Save Income
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddIncome;
