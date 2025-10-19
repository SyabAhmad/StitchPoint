import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import COLOR_PALETTES from '../../theme';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/auth');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'seller' && userData.role !== 'admin') {
      navigate('/');
      return;
    }

    setUser(userData);
  }, [navigate]);

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLOR_PALETTES.black }}
      >
        <div
          className="text-2xl font-bold"
          style={{ color: COLOR_PALETTES.gold }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Welcome Section */}
        <div
          className="rounded-2xl p-12 mb-12 overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)`,
            border: `2px solid ${COLOR_PALETTES.gold}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          {/* Decorative Elements */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5"
            style={{
              backgroundColor: COLOR_PALETTES.gold,
              filter: 'blur(40px)',
            }}
          ></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <h1
                  className="text-5xl font-bold mb-2"
                  style={{ color: COLOR_PALETTES.black }}
                >
                  {user?.store_name || 'My Store'}
                </h1>
                <p style={{ color: '#666' }} className="text-lg">
                  Welcome back, <span className="font-semibold">{user?.first_name}</span>
                </p>
              </div>
            </div>

            {user?.store_description && (
              <p
                style={{ color: '#777' }}
                className="text-base leading-relaxed max-w-2xl mb-6"
              >
                {user.store_description}
              </p>
            )}

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate('/seller/products/upload')}
                className="px-8 py-3 rounded-lg font-semibold text-lg transition hover:shadow-lg hover:-translate-y-0.5 transform"
                style={{
                  backgroundColor: COLOR_PALETTES.gold,
                  color: COLOR_PALETTES.white,
                }}
              >
                Upload New Product
              </button>
              <button
                onClick={() => navigate('/seller/products')}
                className="px-8 py-3 rounded-lg font-semibold text-lg transition hover:shadow-lg border-2"
                style={{
                  borderColor: COLOR_PALETTES.gold,
                  color: COLOR_PALETTES.gold,
                  backgroundColor: 'transparent',
                }}
              >
                View All Products
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Products */}
          <div
            className="rounded-xl p-8 relative overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
            style={{
              backgroundColor: COLOR_PALETTES.white,
              border: `1px solid #e0e0e0`,
            }}
          >
            <div className="relative z-10">
              <p
                style={{ color: '#999' }}
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
              >
                Total Products
              </p>
              <p
                className="text-5xl font-bold mb-2"
                style={{ color: COLOR_PALETTES.gold }}
              >
                0
              </p>
              <p
                style={{ color: '#aaa' }}
                className="text-xs"
              >
                Ready to sell
              </p>
            </div>
          </div>

          {/* Active Orders */}
          <div
            className="rounded-xl p-8 relative overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
            style={{
              backgroundColor: COLOR_PALETTES.white,
              border: `1px solid #e0e0e0`,
            }}
          >
            <div className="relative z-10">
              <p
                style={{ color: '#999' }}
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
              >
                Active Orders
              </p>
              <p
                className="text-5xl font-bold mb-2"
                style={{ color: COLOR_PALETTES.gold }}
              >
                0
              </p>
              <p
                style={{ color: '#aaa' }}
                className="text-xs"
              >
                Pending fulfillment
              </p>
            </div>
          </div>

          {/* Total Revenue */}
          <div
            className="rounded-xl p-8 relative overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
            style={{
              backgroundColor: COLOR_PALETTES.white,
              border: `1px solid #e0e0e0`,
            }}
          >
            <div className="relative z-10">
              <p
                style={{ color: '#999' }}
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
              >
                Total Revenue
              </p>
              <p
                className="text-5xl font-bold mb-2"
                style={{ color: COLOR_PALETTES.gold }}
              >
                $0
              </p>
              <p
                style={{ color: '#aaa' }}
                className="text-xs"
              >
                This month
              </p>
            </div>
          </div>

          {/* Store Rating */}
          <div
            className="rounded-xl p-8 relative overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
            style={{
              backgroundColor: COLOR_PALETTES.white,
              border: `1px solid #e0e0e0`,
            }}
          >
            <div className="relative z-10">
              <p
                style={{ color: '#999' }}
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
              >
                Store Rating
              </p>
              <p
                className="text-5xl font-bold mb-2"
                style={{ color: COLOR_PALETTES.gold }}
              >
                4.9
              </p>
              <p
                style={{ color: '#aaa' }}
                className="text-xs"
              >
                98 customer reviews
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sales Overview */}
            <div
              className="rounded-xl p-8"
              style={{
                backgroundColor: COLOR_PALETTES.white,
                border: `1px solid #e0e0e0`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: COLOR_PALETTES.black }}
              >
                Sales Overview (Last 30 Days)
              </h2>

              <div className="space-y-4">
                {[
                  { label: 'Total Sales', value: '$0', percentage: 0 },
                  { label: 'Total Orders', value: '0', percentage: 0 },
                  { label: 'Total Views', value: '0', percentage: 0 },
                  { label: 'Conversion Rate', value: '0%', percentage: 0 },
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: '#666' }} className="font-semibold">
                        {stat.label}
                      </span>
                      <span
                        style={{ color: COLOR_PALETTES.gold }}
                        className="font-bold"
                      >
                        {stat.value}
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: '#e8e8e8' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: COLOR_PALETTES.gold,
                          width: `${stat.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div
              className="rounded-xl p-8"
              style={{
                backgroundColor: COLOR_PALETTES.white,
                border: `1px solid #e0e0e0`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: COLOR_PALETTES.black }}
              >
                Recent Orders
              </h2>

              <div
                className="p-6 rounded-lg text-center"
                style={{ backgroundColor: '#fafafa' }}
              >
                <p
                  style={{ color: '#999' }}
                  className="text-base"
                >
                  No orders yet. Start by uploading products to get started.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div
              className="rounded-xl p-8"
              style={{
                backgroundColor: COLOR_PALETTES.white,
                border: `1px solid #e0e0e0`,
              }}
            >
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: COLOR_PALETTES.black }}
              >
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/seller/products/upload')}
                  className="w-full py-3 rounded-lg font-semibold transition hover:shadow-md"
                  style={{
                    backgroundColor: COLOR_PALETTES.gold,
                    color: COLOR_PALETTES.white,
                  }}
                >
                  Upload Product
                </button>

                <button
                  onClick={() => navigate('/seller/products')}
                  className="w-full py-3 rounded-lg font-semibold transition hover:bg-gray-50 border-2"
                  style={{
                    borderColor: COLOR_PALETTES.gold,
                    color: COLOR_PALETTES.gold,
                  }}
                >
                  My Products
                </button>

                <button
                  onClick={() => navigate('/seller/orders')}
                  className="w-full py-3 rounded-lg font-semibold transition hover:bg-gray-50 border-2"
                  style={{
                    borderColor: COLOR_PALETTES.gold,
                    color: COLOR_PALETTES.gold,
                  }}
                >
                  Manage Orders
                </button>
              </div>
            </div>

            {/* Store Performance */}
            <div
              className="rounded-xl p-8"
              style={{
                backgroundColor: COLOR_PALETTES.white,
                border: `1px solid #e0e0e0`,
              }}
            >
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: COLOR_PALETTES.black }}
              >
                Performance
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: '#666' }} className="text-sm">
                      Profile Completion
                    </span>
                    <span style={{ color: COLOR_PALETTES.gold }}>100%</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: '#e8e8e8' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: COLOR_PALETTES.gold,
                        width: '100%',
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: '#666' }} className="text-sm">
                      Response Time
                    </span>
                    <span style={{ color: COLOR_PALETTES.gold }}>Excellent</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: '#e8e8e8' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: COLOR_PALETTES.gold,
                        width: '95%',
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: '#666' }} className="text-sm">
                      Seller Rating
                    </span>
                    <span style={{ color: COLOR_PALETTES.gold }}>4.9/5.0</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: '#e8e8e8' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: COLOR_PALETTES.gold,
                        width: '98%',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpful Resources */}
            <div
              className="rounded-xl p-8"
              style={{
                backgroundColor: COLOR_PALETTES.white,
                border: `1px solid #e0e0e0`,
              }}
            >
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: COLOR_PALETTES.black }}
              >
                Resources
              </h3>

              <div className="space-y-2">
                <a
                  href="#"
                  className="block px-4 py-2 rounded transition hover:bg-gray-100"
                  style={{ color: COLOR_PALETTES.gold }}
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 rounded transition hover:bg-gray-100"
                  style={{ color: COLOR_PALETTES.gold }}
                >
                  Seller Guide
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 rounded transition hover:bg-gray-100"
                  style={{ color: COLOR_PALETTES.gold }}
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
