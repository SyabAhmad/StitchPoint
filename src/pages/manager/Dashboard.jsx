import React, { useState, useEffect } from "react";
import {
  FaUsers, FaBox, FaShoppingCart, FaChartLine, FaCog, FaStore,
  FaUserCog, FaStar, FaMoneyBillWave, FaBars, FaTimes, FaCalendarAlt,
  FaComment,
} from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
import CostChart from "../../components/analytics/CostChart.jsx";
import SalesChart from "../../components/analytics/SalesChart.jsx";
import ProfitChart from "../../components/analytics/ProfitChart.jsx";
import SmartFooter from "../../components/footer/SmartFooter.jsx";

const ManagerDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [financialTrends, setFinancialTrends] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserData = JSON.parse(localStorage.getItem("user"));

    if (!token || !storedUserData || storedUserData.role !== "manager") {
      window.location.href = "/login";
      return;
    }

    setUserData(storedUserData);

    if (location.pathname === "/manager-dashboard") {
      Promise.all([
        fetchWithAuth("http://localhost:5000/api/dashboard/admin"),
        fetchWithAuth("http://localhost:5000/api/analytics/financial-trends"),
      ])
        .then(([dashboardResponse, trendsResponse]) => {
          if (!dashboardResponse.ok) throw new Error(`Dashboard HTTP error! status: ${dashboardResponse.status}`);
          if (!trendsResponse.ok) throw new Error(`Trends HTTP error! status: ${trendsResponse.status}`);
          return Promise.all([dashboardResponse.json(), trendsResponse.json()]);
        })
        .then(([dashboardData, trendsData]) => {
          setAnalytics(dashboardData.analytics || {});
          setRecentOrders(dashboardData.recent_orders || []);
          setFinancialTrends(trendsData.financial_trends || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
          setAnalytics({});
          setRecentOrders([]);
          setFinancialTrends([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  const navLinks = [
    { to: "/manager-dashboard", icon: FaUsers, label: "Dashboard", exact: true },
    { to: "/manager-dashboard/products", icon: FaBox, label: "Products" },
    { to: "/manager-dashboard/orders", icon: FaShoppingCart, label: "Orders" },
    { to: "/manager-dashboard/categories", icon: FaStore, label: "Categories" },
    { to: "/manager-dashboard/analytics", icon: FaChartLine, label: "Analytics" },
    { to: "/manager-dashboard/comments", icon: FaComment, label: "Comments" },
    { to: "/manager-dashboard/reviews", icon: FaStar, label: "Reviews" },
    { to: "/manager-dashboard/profile", icon: FaUserCog, label: "Profile" },
  ];

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname === link.to;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500/20 border-t-gold-500 mb-4"></div>
          <span className="text-white/50 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="h-14 bg-[#111] border-b border-white/10 px-5 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white/50 hover:text-white transition-colors"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="flex items-center gap-1.5">
            <span className="text-gold-500 font-serif text-lg font-semibold">Naqsh</span>
            <span className="text-white font-serif text-lg font-light">Couture</span>
          </Link>
          <span className="text-white/30 text-xs hidden sm:inline">Manager Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-white/50 hover:text-white transition-colors hidden sm:inline">Home</Link>
          <Link to="/shop" className="text-xs text-white/50 hover:text-white transition-colors hidden sm:inline">Shop</Link>
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="text-xs text-white/40 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-56 bg-[#0a0a0a] border-r border-white/5 flex-shrink-0 overflow-y-auto sticky top-0 h-full z-40 transition-transform duration-300 md:relative md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* User Profile */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                {userData?.name?.charAt(0)?.toUpperCase() || "M"}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{userData?.name || "Manager"}</p>
                <p className="text-[10px] text-white/25 truncate">{userData?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold-500/50 px-2.5 mb-1.5">
              Management
            </p>
            <ul className="space-y-px">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link);
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[12px] font-medium transition-all duration-150 ${
                        active
                          ? "bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 ml-0 pl-[8px]"
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                      }`}
                    >
                      <Icon className="text-[11px] w-3.5 text-center" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold-500/50 px-2.5 mb-1.5">
                Settings
              </p>
              <ul className="space-y-px">
                <li>
                  <Link to="/manager-dashboard/profile" className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[12px] font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all duration-150">
                    <FaStore className="text-[11px] w-3.5 text-center" />
                    Store Settings
                  </Link>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[12px] font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all duration-150">
                    <FaCog className="text-[11px] w-3.5 text-center" />
                    System Config
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            {location.pathname === "/manager-dashboard" ? (
              <>
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#111] border border-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                        <FaBox className="text-gold-500" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider">Total Products</p>
                        <p className="text-xl font-bold text-white">{analytics.total_products || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FaShoppingCart className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider">Total Orders</p>
                        <p className="text-xl font-bold text-white">{analytics.total_orders || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <FaUsers className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider">Cart Items</p>
                        <p className="text-xl font-bold text-white">{analytics.total_cart_items || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FaStar className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider">Wishlist Items</p>
                        <p className="text-xl font-bold text-white">{analytics.total_wishlist_items || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#111] border border-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                        <FaShoppingCart className="text-gold-500" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider">Units Sold</p>
                        <p className="text-xl font-bold text-white">{analytics.total_units_sold || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FaMoneyBillWave className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider">Total Costs</p>
                        <p className="text-xl font-bold text-white">PKR {analytics.total_costs?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <FaChartLine className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider">Total Profit</p>
                        <p className="text-xl font-bold text-white">PKR {analytics.total_profit?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#111] border border-white/5 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Sales Trends</h3>
                    <SalesChart data={financialTrends} />
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Cost Trends</h3>
                    <CostChart data={financialTrends} />
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Profit Trends</h3>
                    <ProfitChart data={financialTrends} />
                  </div>
                </div>

                {/* Top Rated Products */}
                <div className="mb-6">
                  <div className="bg-[#111] border border-white/5 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Top Rated Products</h3>
                    <div className="space-y-2.5">
                      {analytics.top_rated_products && analytics.top_rated_products.length > 0 ? (
                        analytics.top_rated_products.slice(0, 5).map((product, index) => (
                          <div key={product.product_id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-black text-[11px] font-bold flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-sm text-white truncate">{product.product_name}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gold-500/10 text-gold-500 flex items-center gap-1">
                                <FaStar size={9} /> {product.avg_rating}
                              </span>
                              <span className="text-[11px] text-white/30">{product.review_count} reviews</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white/30 text-center py-4">No review data available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-[#111] border border-white/5 rounded-lg overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Recent Orders</h3>
                      <p className="text-[11px] text-white/30 mt-0.5">Latest orders from customers</p>
                    </div>
                    <Link to="/manager-dashboard/orders" className="text-xs text-gold-500 hover:text-gold-600 font-medium transition-colors">
                      View All
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Order</th>
                          <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Customer</th>
                          <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Date</th>
                          <th className="text-right px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {recentOrders.length > 0 ? (
                          recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-3 text-gold-500 font-medium">#{order.id}</td>
                              <td className="px-5 py-3 text-white/60 truncate max-w-[200px]">{order.user_email}</td>
                              <td className="px-5 py-3">
                                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                                  order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
                                  order.status === "shipped" ? "bg-blue-500/10 text-blue-400" :
                                  order.status === "processing" ? "bg-amber-500/10 text-amber-400" :
                                  "bg-white/5 text-white/40"
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-white/40 text-xs">
                                <FaCalendarAlt className="inline mr-1 text-gold-500/50" />
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-3 text-right font-semibold text-white">PKR {order.total_amount}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-5 py-8 text-center text-white/30 text-sm">No recent orders</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <Outlet />
            )}
          </div>
          </div>
          <SmartFooter variant="simple" />
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
