import { Link, useLocation } from "react-router-dom";
import { Wallet, History, ArrowDownLeft, ArrowUpRight, LayoutDashboard, Sparkles } from "lucide-react";

export function Navbar({ onOpenAi }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/income", label: "Add Income", icon: ArrowDownLeft, color: "text-emerald-600" },
    { path: "/add", label: "Add Expense", icon: ArrowUpRight, color: "text-rose-600" },
    { path: "/history", label: "History", icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900">
              Hostel Wallet
            </span>
            <span className="block text-[11px] text-slate-500 font-medium">Smart Personal Expense Tracker</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.color || "text-slate-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* AI Insight trigger button */}
        {onOpenAi && (
          <button
            onClick={onOpenAi}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="hidden md:inline">AI Financial Advisor</span>
          </button>
        )}
      </div>

      {/* Mobile nav bar */}
      <div className="sm:hidden flex items-center justify-around mt-2 pt-2 border-t border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-1 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive ? "text-indigo-600 font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
