const SAMPLE_EXPENSES = [
  { id: "e1", title: "College Canteen & Snacks", amount: 250, category: "Food", date: new Date().toISOString().split("T")[0], description: "Lunch and tea with hostel mates" },
  { id: "e2", title: "Bus Pass & Auto Fare", amount: 180, category: "Transportation", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], description: "Monthly transport topup" },
  { id: "e3", title: "Semester Books & Printouts", amount: 650, category: "College", date: new Date(Date.now() - 172800000).toISOString().split("T")[0], description: "Engineering lab manuals" },
  { id: "e4", title: "Friend Birthday Treat", amount: 400, category: "Gift", date: new Date(Date.now() - 259200000).toISOString().split("T")[0], description: "Group gift contribution" },
  { id: "e5", title: "Hostel WiFi Bill Share", amount: 300, category: "Bills", date: new Date(Date.now() - 345600000).toISOString().split("T")[0], description: "Shared internet plan" },
];

const SAMPLE_INCOME = [
  { id: "i1", title: "Monthly Pocket Money", amount: 5000, category: "Allowance", date: new Date(Date.now() - 432000000).toISOString().split("T")[0], description: "Received from home" },
  { id: "i2", title: "Freelance Design Gig", amount: 2500, category: "Freelance", date: new Date(Date.now() - 172800000).toISOString().split("T")[0], description: "College poster layout project" },
];

const DEFAULT_BUDGETS = {
  Food: 2500,
  Transportation: 1000,
  College: 1500,
  Gift: 1000,
  Bills: 1200,
  Shopping: 1500,
};

export const getExpenses = () => {
  try {
    const data = localStorage.getItem("expenses");
    if (!data) {
      localStorage.setItem("expenses", JSON.stringify(SAMPLE_EXPENSES));
      return SAMPLE_EXPENSES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return SAMPLE_EXPENSES;
  }
};

export const saveExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    id: "exp-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
    ...expense,
    title: expense.title || expense.description || expense.category || "Expense",
    date: expense.date || new Date().toISOString().split("T")[0],
    amount: Number(expense.amount) || 0,
  };
  expenses.unshift(newExpense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  return newExpense;
};

export const getIncome = () => {
  try {
    const data = localStorage.getItem("income");
    if (!data) {
      localStorage.setItem("income", JSON.stringify(SAMPLE_INCOME));
      return SAMPLE_INCOME;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "number" || typeof parsed === "string") {
      const num = Number(parsed);
      const formatted = isNaN(num) || num === 0 ? [] : [{ id: "inc-legacy", amount: num, title: "Income", category: "Allowance", date: new Date().toISOString().split("T")[0] }];
      localStorage.setItem("income", JSON.stringify(formatted));
      return formatted;
    }
    return [];
  } catch {
    return SAMPLE_INCOME;
  }
};

export const saveIncome = (income) => {
  const incomes = getIncome();
  const newIncome =
    typeof income === "object" && income !== null
      ? {
          id: "inc-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
          title: income.title || "Money Received",
          amount: Number(income.amount) || 0,
          category: income.category || "Allowance",
          date: income.date || new Date().toISOString().split("T")[0],
          description: income.description || "",
        }
      : {
          id: "inc-" + Date.now(),
          amount: Number(income) || 0,
          title: "Money Received",
          category: "Allowance",
          date: new Date().toISOString().split("T")[0],
          description: "",
        };
  incomes.unshift(newIncome);
  localStorage.setItem("income", JSON.stringify(incomes));
  return newIncome;
};

export function deleteIncome(indexOrId) {
  const income = getIncome();
  let updated;
  if (typeof indexOrId === "number") {
    updated = income.filter((_, idx) => idx !== indexOrId);
  } else {
    updated = income.filter((item) => item.id !== indexOrId);
  }
  localStorage.setItem("income", JSON.stringify(updated));
}

export function deleteExpense(indexOrId) {
  const expenses = getExpenses();
  let updated;
  if (typeof indexOrId === "number") {
    updated = expenses.filter((_, idx) => idx !== indexOrId);
  } else {
    updated = expenses.filter((item) => item.id !== indexOrId);
  }
  localStorage.setItem("expenses", JSON.stringify(updated));
}

export const getBudgets = () => {
  try {
    const data = localStorage.getItem("budgets");
    if (!data) return DEFAULT_BUDGETS;
    return JSON.parse(data);
  } catch {
    return DEFAULT_BUDGETS;
  }
};

export const saveBudget = (category, limit) => {
  const current = getBudgets();
  current[category] = Number(limit) || 0;
  localStorage.setItem("budgets", JSON.stringify(current));
};

export const resetAllData = () => {
  localStorage.setItem("expenses", JSON.stringify(SAMPLE_EXPENSES));
  localStorage.setItem("income", JSON.stringify(SAMPLE_INCOME));
  localStorage.setItem("budgets", JSON.stringify(DEFAULT_BUDGETS));
};

export const clearAllData = () => {
  localStorage.setItem("expenses", JSON.stringify([]));
  localStorage.setItem("income", JSON.stringify([]));
};