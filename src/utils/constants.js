import {
  Utensils,
  Bus,
  GraduationCap,
  Gift,
  Receipt,
  ShoppingBag,
  Briefcase,
  Wallet,
  Tag,
  HeartPulse,
} from "lucide-react";

export const CATEGORY_CONFIG = {
  Food: { icon: Utensils, bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Transportation: { icon: Bus, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Transport: { icon: Bus, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  College: { icon: GraduationCap, bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Gift: { icon: Gift, bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  Bills: { icon: Receipt, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Shopping: { icon: ShoppingBag, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Freelance: { icon: Briefcase, bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  Allowance: { icon: Wallet, bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  Health: { icon: HeartPulse, bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Other: { icon: Tag, bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
};
