import React from "react";
import {
  FaUsers,
  FaBox,
  FaStar,
  FaBuilding,
  FaComments,
  FaChartBar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user || user.role !== "super_admin") return null;

  const actions = [
    { icon: FaUsers, label: "Add New User", color: "text-gold-500", bg: "bg-gold-500/10", to: "/super-admin-dashboard/user-management" },
    { icon: FaBox, label: "View Products", color: "text-gold-600", bg: "bg-gold-600/10", to: "/super-admin-dashboard/products" },
    { icon: FaStar, label: "View Reviews", color: "text-amber-400", bg: "bg-amber-400/10", to: "/super-admin-dashboard/reviews" },
    { icon: FaBuilding, label: "View Stores", color: "text-amber-500", bg: "bg-amber-500/10", to: "/super-admin-dashboard/store-analytics" },
    { icon: FaComments, label: "View Comments", color: "text-orange-400", bg: "bg-orange-400/10", to: "/super-admin-dashboard/comments" },
    { icon: FaChartBar, label: "View Analytics", color: "text-yellow-300", bg: "bg-yellow-300/10", to: "/super-admin-dashboard/analytics" },
  ];

  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={() => navigate(a.to)}
              className="bg-[#111] border border-white/5 rounded-lg p-4 text-left hover:border-gold-500/20 hover:bg-white/[0.02] transition-all duration-200 group"
            >
              <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`${a.color} text-sm`} />
              </div>
              <p className="text-[13px] font-medium text-white/70 group-hover:text-white transition-colors">{a.label}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
