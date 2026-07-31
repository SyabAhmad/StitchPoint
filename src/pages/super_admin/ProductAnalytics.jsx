import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OverviewStats from "../../components/analytics/OverviewStats";
import AnalyticsPieChart from "../../components/analytics/AnalyticsPieChart";
import TopProductsList from "../../components/analytics/TopProductsList";
import ProductViewsChart from "../../components/analytics/ProductViewsChart";
import ProductClicksChart from "../../components/analytics/ProductClicksChart";
import ReviewTrendsChart from "../../components/analytics/ReviewTrendsChart";
import CommentTrendsChart from "../../components/analytics/CommentTrendsChart";

const ProductAnalytics = () => {
  const navigate = useNavigate();
  const [productsAnalytics, setProductsAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(30);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setStores(data.stores || []);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    const fetchProductsAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let url = `http://localhost:5000/api/analytics/products-analytics?days=${filterDays}&page=${page}&limit=${limit}`;
        if (selectedStore) {
          url += `&store_id=${selectedStore}`;
        }
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setProductsAnalytics(data.products_analytics || []);
        setPagination(data.pagination || {});
      } catch (error) {
        console.error("Error fetching products analytics:", error);
        setProductsAnalytics([]);
        setPagination({});
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAnalytics();
  }, [filterDays, page, limit, selectedStore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500/20 border-t-gold-500 mb-4"></div>
          <span>Loading products analytics...</span>
        </div>
      </div>
    );
  }

  // Calculate overview stats from products analytics
  const overview = {
    total_views: productsAnalytics.reduce((sum, p) => sum + p.total_views, 0),
    total_clicks: productsAnalytics.reduce((sum, p) => sum + p.total_clicks, 0),
    total_cart_adds: productsAnalytics.reduce(
      (sum, p) => sum + p.total_cart_adds,
      0
    ),
    avg_time_spent:
      productsAnalytics.length > 0
        ? productsAnalytics.reduce((sum, p) => sum + p.avg_time_spent, 0) /
          productsAnalytics.length
        : 0,
    total_reviews: productsAnalytics.reduce(
      (sum, p) => sum + p.total_reviews,
      0
    ),
    avg_rating:
      productsAnalytics.length > 0
        ? productsAnalytics.reduce((sum, p) => sum + (p.avg_rating || 0), 0) /
          productsAnalytics.length
        : 0,
    total_comments: productsAnalytics.reduce(
      (sum, p) => sum + p.total_comments,
      0
    ),
    avg_comments_per_product:
      productsAnalytics.length > 0
        ? productsAnalytics.reduce((sum, p) => sum + p.total_comments, 0) /
          productsAnalytics.length
        : 0,
    // Financial metrics
    total_revenue: productsAnalytics.reduce(
      (sum, p) => sum + (p.total_revenue || 0),
      0
    ),
    total_profit: productsAnalytics.reduce(
      (sum, p) => sum + (p.total_profit || 0),
      0
    ),
    total_units_sold: productsAnalytics.reduce(
      (sum, p) => sum + (p.total_units_sold || 0),
      0
    ),
    total_costs: productsAnalytics.reduce(
      (sum, p) => sum + (p.total_costs || 0),
      0
    ),
    top_products: productsAnalytics.slice(0, 5).map((p) => ({
      product_id: p.product_id,
      name: p.product_name,
      views: p.total_views,
    })),
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gold-500">
          Product Analytics
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm mb-2 text-white/50">
              Time Period:
            </label>
            <select
              value={filterDays}
              onChange={(e) => {
                setFilterDays(Number(e.target.value));
                setPage(1); // Reset to first page
              }}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2 text-white/50">Store:</label>
            <select
              value={selectedStore || ""}
              onChange={(e) => {
                setSelectedStore(
                  e.target.value ? Number(e.target.value) : null
                );
                setPage(1); // Reset to first page
              }}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/40 transition-colors"
            >
              <option value="">All Stores</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <OverviewStats data={overview} />

        {/* Products Table */}
        <div className="bg-[#111] border border-white/5 rounded-lg shadow overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-white/5">
            <h3 className="text-lg leading-6 font-medium text-white">
              Products Performance
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-white/30">
              Detailed analytics for each product
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Cart Adds
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Avg Time
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Avg Rating
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Comments
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Costs
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {productsAnalytics.map((product) => (
                  <tr
                    key={product.product_id}
                    className="transition-colors duration-150 cursor-pointer hover:bg-white/[0.02]"
                    onClick={() => navigate(`/product/${product.product_id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/product/${product.product_id}`}
                        className="text-gold-500 hover:underline"
                      >
                        {product.product_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.store_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.total_views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.total_clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.total_cart_adds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.avg_time_spent}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.total_reviews}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.avg_rating || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.total_comments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-500">
                      PKR {product.total_revenue || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      {product.total_units_sold || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                      PKR {product.total_costs || 0}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        product.total_profit >= 0
                          ? "text-teal-400"
                          : "text-red-400"
                      }`}
                    >
                      PKR {product.total_profit || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {productsAnalytics.length === 0 && (
              <div className="text-center py-8 text-white/30">
                No products analytics available.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.total_pages > 1 && (
            <div className="px-4 py-3 sm:px-6 flex items-center justify-between border-t border-white/5">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage(Math.min(pagination.total_pages, page + 1))
                  }
                  disabled={page === pagination.total_pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-white/50">
                    Showing{" "}
                    <span className="font-medium text-white">
                      {(page - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-white">
                      {Math.min(page * limit, pagination.total_count)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">
                      {pagination.total_count}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-white/30 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from(
                      { length: Math.min(5, pagination.total_pages) },
                      (_, i) => {
                        const pageNum =
                          Math.max(
                            1,
                            Math.min(pagination.total_pages - 4, page - 2)
                          ) + i;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                              pageNum === page
                                ? "z-10 bg-gold-500 border-gold-500 text-black"
                                : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() =>
                        setPage(Math.min(pagination.total_pages, page + 1))
                      }
                      disabled={page === pagination.total_pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-white/30 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;
