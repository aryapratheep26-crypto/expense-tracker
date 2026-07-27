import { useMemo } from "react";
import { Sparkles, X, Lightbulb, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../utils/calculations";

export function AiAdvisorModal({ isOpen, onClose, expenses, income }) {
  const advice = useMemo(() => {
    if (!isOpen) return null;

    const totalInc = income.reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalExp = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const balance = totalInc - totalExp;
    const savingsRate = totalInc > 0 ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0;

    const catTotals = {};
    expenses.forEach((e) => {
      catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount || 0);
    });

    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0] || ["Food", 0];

    let status;
    let statusColor;
    const tips = [];

    if (savingsRate >= 40) {
      status = "Excellent Savings Rate!";
      statusColor = "text-emerald-600";
      tips.push(`You are saving ${savingsRate}% of your allowance! Outstanding financial discipline.`);
    } else if (savingsRate >= 15) {
      status = "Healthy Budgeting";
      statusColor = "text-blue-600";
      tips.push(`Your net cash flow is positive with a ${savingsRate}% savings buffer.`);
    } else if (savingsRate >= 0) {
      status = "Tight Budget Alert";
      statusColor = "text-amber-600";
      tips.push("Your expenses are close to your income. Consider reviewing non-essential spending.");
    } else {
      status = "Deficit Warning!";
      statusColor = "text-rose-600";
      tips.push(`You have overspent by ${formatCurrency(Math.abs(balance))}! Immediate adjustment needed.`);
    }

    if (topCategory[1] > 0) {
      const pct = Math.round((topCategory[1] / (totalExp || 1)) * 100);
      tips.push(
        `Your highest expense area is ${topCategory[0]} at ${formatCurrency(topCategory[1])} (${pct}% of total spending).`
      );
    }

    if (catTotals.Food && catTotals.Food > 1500) {
      tips.push("Dining Tip: Pre-planning weekly meals or opting for mess plans can save up to ₹800 monthly.");
    }

    if (catTotals.Transportation && catTotals.Transportation > 800) {
      tips.push("Transport Savings: Look into monthly student bus passes or carpooling.");
    }

    return {
      savingsRate,
      balance,
      status,
      statusColor,
      topCategoryName: topCategory[0],
      topCategoryAmount: topCategory[1],
      tips,
    };
  }, [isOpen, expenses, income]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">AI Financial Advisor</h3>
              <p className="text-xs text-slate-500">Personalized Budget Insights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {advice && (
          <div className="mt-4 space-y-4">
            {/* Status Summary Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Health Score</span>
                <p className={`text-base font-bold ${advice.statusColor}`}>{advice.status}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Savings Buffer</span>
                <p className="text-base font-bold text-slate-900">{advice.savingsRate}%</p>
              </div>
            </div>

            {/* Smart Action Tips */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Actionable Recommendations
              </h4>

              {advice.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            {/* Quick Rules of Thumb */}
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
              <span className="font-semibold block mb-1">💡 50/30/20 Budgeting Rule:</span>
              Try allocating 50% for Essentials (Bills, Food, Commute), 30% for Personal Spending, and 20% for Emergency Savings.
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
