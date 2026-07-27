export const getCategoryTotals = (expenses = []) => {
  const totals = {};

  expenses.forEach((expense) => {
    const cat = expense.category || expense.type || "Other";
    const amt = Number(expense.amount) || 0;
    if (!totals[cat]) {
      totals[cat] = 0;
    }
    totals[cat] += amt;
  });

  return totals;
};

export const getMonthlyBreakdown = (expenses = [], incomeList = []) => {
  const months = {};

  const getMonthKey = (dateStr) => {
    if (!dateStr) return "Recent";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleString("default", { month: "short", year: "2-digit" });
  };

  incomeList.forEach((inc) => {
    const key = getMonthKey(inc.date);
    if (!months[key]) months[key] = { month: key, income: 0, expense: 0 };
    months[key].income += Number(inc.amount) || 0;
  });

  expenses.forEach((exp) => {
    const key = getMonthKey(exp.date);
    if (!months[key]) months[key] = { month: key, income: 0, expense: 0 };
    months[key].expense += Number(exp.amount) || 0;
  });

  return Object.values(months);
};

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};