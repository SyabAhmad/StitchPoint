import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingBag, FaHeart, FaBox, FaUser, FaArrowRight, FaStar, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [localUser, setLocalUser] = useState({});
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getProfileImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setLocalUser(userData);

    if (!token || !userData || userData.role !== "customer") {
      window.location.href = "/login";
      return;
    }

    fetchWithAuth("http://localhost:5000/api/dashboard/customer")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders || []);
        setCartItems(data.cart_items || []);
        setWishlistItems(data.wishlist_items || []);
        setTotalSpent(data.total_spent || 0);
        setTotalOrders(data.total_orders || 0);
        setRecommendedProducts(data.recommended_products || []);
        if (data.user) {
          setProfilePicture(data.user.profile_picture || null);
          if (data.user.profile_picture) {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            storedUser.profile_picture = data.user.profile_picture;
            localStorage.setItem("user", JSON.stringify(storedUser));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#000000" }}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#d4af37" }}></div>
          <p className="mt-4" style={{ color: "#aaa" }}>Loading...</p>
        </div>
      </div>
    );
  }

  const userData = localUser;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#000000" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="p-2 rounded-lg lg:hidden" style={{ backgroundColor: "#141414" }}>
                {sidebarOpen ? <FaTimes style={{ color: "#d4af37" }} /> : <FaBars style={{ color: "#d4af37" }} />}
              </button>
              <Link to="/" className="text-xl font-bold tracking-[0.2em]" style={{ fontFamily: '"Playfair Display", serif', color: "#d4af37" }}>
                NAQSH
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {[{ to: "/", label: "HOME" }, { to: "/shop", label: "SHOP" }, { to: "/customer-dashboard/profile", label: "PROFILE", highlight: true }].map((item) => (
                <Link key={item.to} to={item.to} className="px-4 py-2 rounded-lg text-sm font-bold tracking-widest transition-colors" 
                  style={{ color: item.highlight ? "#d4af37" : "#888" }}>
                  {item.label}
                </Link>
              ))}
              <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="px-4 py-2 rounded-lg text-sm font-bold tracking-widest" style={{ color: "#dc3545" }}>LOGOUT</button>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {sidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 shadow-2xl lg:static lg:shadow-none lg:translate-x-0 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ backgroundColor: "#0a0a0a" }}>
          <div className="p-6 border-b" style={{ borderColor: "#1a1a1a" }}>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#141414", border: "2px solid #d4af37" }}>
              {profilePicture || localUser?.profile_picture || userData?.profile_picture ? (
                <img 
                  src={getProfileImageUrl(profilePicture || localUser?.profile_picture || userData?.profile_picture)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => { console.error("Image load error:", e.target.src); e.target.style.display='none'; }}
                />
              ) : (
                <FaUser className="text-xl" style={{ color: "#d4af37" }} />
              )}
              </div>
              <div>
                <p className="font-bold tracking-wider" style={{ color: "#fff" }}>{userData?.name || "Guest"}</p>
                <p className="text-xs" style={{ color: "#555" }}>{userData?.email}</p>
              </div>
            </div>
          </div>

          <nav className="p-3">
            <ul className="space-y-1">
              {[
                { path: "/customer-dashboard", label: "DASHBOARD", icon: "✦" },
                { path: "/customer-dashboard/cart", label: "CART", icon: <FaShoppingBag />, badge: cartItems.length },
                { path: "/customer-dashboard/wishlist", label: "WISHLIST", icon: <FaHeart />, badge: wishlistItems.length },
                { path: "/customer-dashboard/orders", label: "ORDERS", icon: <FaBox />, badge: totalOrders }
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} onClick={() => setSidebarOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg transition-all"
                    style={{ 
                      color: location.pathname === item.path ? "#d4af37" : "#888",
                      backgroundColor: location.pathname === item.path ? "#141414" : "transparent"
                    }}
                  >
                    <span className="mr-3" style={{ color: location.pathname === item.path ? "#d4af37" : "#444" }}>{item.icon}</span>
                    <span className="flex-1 text-sm font-bold tracking-widest">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full" style={{ backgroundColor: "#d4af37", color: "#000" }}>{item.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t" style={{ borderColor: "#1a1a1a" }}>
              <p className="px-4 text-xs font-bold tracking-widest mb-2" style={{ color: "#d4af37" }}>ACCOUNT</p>
              <ul className="space-y-1">
                <li>
                  <Link to="/customer-dashboard/profile" onClick={() => setSidebarOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg transition-all"
                    style={{ 
                      color: location.pathname.includes("profile") ? "#d4af37" : "#888",
                      backgroundColor: location.pathname.includes("profile") ? "#141414" : "transparent"
                    }}
                  >
                    <FaUser className="mr-3" style={{ color: location.pathname.includes("profile") ? "#d4af37" : "#444" }} />
                    <span className="text-sm font-bold tracking-widest">PROFILE</span>
                  </Link>
                </li>
                <li>
                  <Link to="/collections" onClick={() => setSidebarOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg transition-all" style={{ color: "#888" }}
                  >
                    <span className="mr-3" style={{ color: "#444" }}>✦</span>
                    <span className="text-sm font-bold tracking-widest">COLLECTIONS</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {location.pathname === "/customer-dashboard" && (
              <>
                {/* Welcome Hero */}
                <div className="rounded-2xl p-6 md:p-10 mb-8 relative overflow-hidden" style={{ backgroundColor: "#0a0a0a", backgroundImage: "radial-gradient(circle at 80% 50%, rgba(212,175,55,0.05) 0%, transparent 50%)" }}>
                  <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}></div>
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#141414", border: "3px solid #d4af37", boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)" }}>
                      {profilePicture || localUser?.profile_picture || userData?.profile_picture ? (
                        <img 
                          src={getProfileImageUrl(profilePicture || localUser?.profile_picture || userData?.profile_picture)} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => { console.error("Image load error:", e.target.src); e.target.style.display='none'; }}
                        />
                      ) : (
                        <FaUser className="text-4xl" style={{ color: "#d4af37" }} />
                      )}
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-widest" style={{ color: "#555" }}>WELCOME BACK</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-widest" style={{ fontFamily: '"Playfair Display", serif', color: "#fff" }}>
                          {userData?.name || "Guest"}
                        </h2>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm" style={{ color: "#555" }}>{userData?.email}</p>
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "#333" }}></span>
                          <p className="text-sm font-bold tracking-widest" style={{ color: "#d4af37" }}>VIP CUSTOMER</p>
                        </div>
                      </div>
                    </div>
                    <Link to="/customer-dashboard/profile"
                      className="px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#d4af37]/30"
                      style={{ backgroundColor: "#d4af37", color: "#000000", boxShadow: "0 4px 20px rgba(212, 175, 55, 0.4)" }}
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                  {[
                    { label: "CART ITEMS", value: cartItems.length, icon: <FaShoppingBag />, color: "#d4af37", path: "/customer-dashboard/cart" },
                    { label: "WISHLIST", value: wishlistItems.length, icon: <FaHeart />, color: "#ec4899", path: "/customer-dashboard/wishlist" },
                    { label: "TOTAL ORDERS", value: totalOrders, icon: <FaBox />, color: "#3b82f6", path: "/customer-dashboard/orders" },
                    { label: "TOTAL SPENT", value: `PKR ${totalSpent.toLocaleString()}`, icon: "✦", color: "#10b981", path: null }
                  ].map((stat, idx) => (
                    <div key={idx} onClick={() => stat.path && navigate(stat.path)}
                      className="rounded-xl p-5 md:p-6 transition-all hover:scale-[1.02] hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/10 cursor-pointer group"
                      style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#d4af37]/10" style={{ backgroundColor: "#141414", color: stat.color }}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#444" }}>{stat.label}</p>
                          <p className="text-xl md:text-2xl font-bold" style={{ color: "#fff" }}>{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended Products */}
                {recommendedProducts.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: '"Playfair Display", serif', color: "#fff" }}>
                          You Might Also Like
                        </h3>
                        <p className="text-sm mt-1" style={{ color: "#555" }}>Based on your shopping history</p>
                      </div>
                      <Link to="/shop" className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-lg transition-colors" style={{ color: "#d4af37", border: "1px solid #1a1a1a" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#141414"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        View All <FaArrowRight />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {recommendedProducts.slice(0, 4).map((product) => (
                        <div key={product.id} onClick={() => navigate(`/product/${product.id}`)}
                          className="rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-[#d4af37]/50 cursor-pointer group"
                          style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}
                        >
                          <div className="aspect-square overflow-hidden relative">
                            <img src={product.image_url || "/placeholder-product.jpg"} alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-4 py-2 rounded-lg font-bold tracking-widest uppercase text-sm" style={{ backgroundColor: "#d4af37", color: "#000" }}>View</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-sm truncate" style={{ color: "#fff" }}>{product.name}</h4>
                            <p className="text-xs truncate mt-1" style={{ color: "#555" }}>{product.store_name}</p>
                            <p className="text-xl font-bold mt-3" style={{ color: "#d4af37" }}>PKR {product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Orders */}
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a" }}>
                  <div className="p-5 md:p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4" style={{ borderColor: "#1a1a1a" }}>
                    <div>
                      <h3 className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: '"Playfair Display", serif', color: "#fff" }}>Recent Orders</h3>
                      <p className="text-sm mt-1" style={{ color: "#555" }}>Your latest order history</p>
                    </div>
                    <button onClick={() => navigate("/customer-dashboard/orders")}
                      className="px-5 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors"
                      style={{ backgroundColor: "#141414", color: "#fff", border: "1px solid #2a2a2a" }}
                    >
                      View All
                    </button>
                  </div>
                  <div>
                    {orders.length > 0 ? orders.slice(0, 5).map((order) => (
                      <div key={order.id} onClick={() => navigate(`/customer-dashboard/orders/${order.id}`)}
                        className="p-4 md:p-5 border-b transition-colors cursor-pointer hover:bg-[#141414] hover:border-l-2 hover:border-l-[#d4af37]"
                        style={{ borderColor: "#1a1a1a" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#141414" }}>
                              <FaBox style={{ color: "#d4af37" }} />
                            </div>
                            <div>
                              <p className="font-bold tracking-widest uppercase" style={{ color: "#fff" }}>Order #{order.id}</p>
                              <p className="text-sm" style={{ color: "#555" }}>
                                {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold" style={{ color: "#fff" }}>PKR {order.total_amount}</p>
<span className="inline-block mt-2 px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full"
  style={{ 
    backgroundColor: order.status === "delivered" ? "#064e3b" : order.status === "shipped" ? "#1e3a5f" : order.status === "processing" ? "#451a03" : order.status === "cancelled" ? "#450a0a" : "#1a1a1a",
    color: order.status === "delivered" ? "#34d399" : order.status === "shipped" ? "#60a5fa" : order.status === "processing" ? "#fbbf24" : order.status === "cancelled" ? "#f87171" : "#666",
    border: `1px solid ${order.status === "delivered" ? "#34d399" : order.status === "shipped" ? "#60a5fa" : order.status === "processing" ? "#fbbf24" : order.status === "cancelled" ? "#f87171" : "#333"}`
  }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-10 md:p-14 text-center">
                        <div className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#141414" }}>
                          <span className="text-3xl" style={{ color: "#d4af37" }}>✦</span>
                        </div>
                        <p className="text-xl font-bold tracking-widest uppercase mb-3" style={{ color: "#fff" }}>No orders yet</p>
                        <p className="mb-6" style={{ color: "#555" }}>Start shopping to see your orders here</p>
                        <Link to="/collections" className="inline-block px-8 py-4 rounded-xl font-bold tracking-widest uppercase transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#d4af37]/30"
                          style={{ backgroundColor: "#d4af37", color: "#000" }}>
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;