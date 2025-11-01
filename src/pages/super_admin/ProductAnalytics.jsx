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
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
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
    top_products: productsAnalytics.slice(0, 5).map((p) => ({
      product_id: p.product_id,
      name: p.product_name,
      views: p.total_views,
    })),
  };

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
          Product Analytics
        </h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: "#cccccc" }}>
              Time Period:
            </label>
            <select
              value={filterDays}
              onChange={(e) => {
                setFilterDays(Number(e.target.value));
                setPage(1); // Reset to first page
              }}
              className="px-3 py-2 rounded"
              style={{
                backgroundColor: "#2d2d2d",
                color: "#ffffff",
                border: "1px solid #3d3d3d",
              }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: "#cccccc" }}>
              Store:
            </label>
            <select
              value={selectedStore || ""}
              onChange={(e) => {
                setSelectedStore(
                  e.target.value ? Number(e.target.value) : null
                );
                setPage(1); // Reset to first page
              }}
              className="px-3 py-2 rounded"
              style={{
                backgroundColor: "#2d2d2d",
                color: "#ffffff",
                border: "1px solid #3d3d3d",
              }}
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
        <div
          className="shadow overflow-hidden sm:rounded-md mb-8"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <div
            className="px-4 py-5 sm:px-6 border-b"
            style={{ borderColor: "#2d2d2d" }}
          >
            <h3
              className="text-lg leading-6 font-medium"
              style={{ color: "#ffffff" }}
            >
              Products Performance
            </h3>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: "#999999" }}>
              Detailed analytics for each product
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: "#2d2d2d" }}>
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Product
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Store
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Views
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Clicks
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Cart Adds
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Avg Time
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Reviews
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Avg Rating
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Comments
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#1d1d1d" }}>
                {productsAnalytics.map((product, index) => (
                  <tr
                    key={product.product_id}
                    className="transition-colors duration-150 cursor-pointer"
                    style={{
                      borderBottom: "1px solid #2d2d2d",
                      backgroundColor: index % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1f1f1f";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "#1d1d1d" : "#2d2d2d";
                    }}
                    onClick={() => navigate(`/product/${product.product_id}`)}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      style={{ color: "#ffffff" }}
                    >
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ color: "#d4af37", textDecoration: "none" }}
                        onMouseEnter={(e) =>
                          (e.target.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.textDecoration = "none")
                        }
                      >
                        {product.product_name}
                      </Link>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.store_name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.total_views}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.total_clicks}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.total_cart_adds}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.avg_time_spent}s
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.total_reviews}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.avg_rating || 0}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {product.total_comments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {productsAnalytics.length === 0 && (
              <div className="text-center py-8" style={{ color: "#999999" }}>
                No products analytics available.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.total_pages > 1 && (
            <div
              className="px-4 py-3 sm:px-6 flex items-center justify-between"
              style={{
                backgroundColor: "#1d1d1d",
                borderTop: "1px solid #2d2d2d",
              }}
            >
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #3d3d3d",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1f1f1f")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2d2d2d")
                  }
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage(Math.min(pagination.total_pages, page + 1))
                  }
                  disabled={page === pagination.total_pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #3d3d3d",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1f1f1f")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2d2d2d")
                  }
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm" style={{ color: "#cccccc" }}>
                    Showing{" "}
                    <span className="font-medium">
                      {(page - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * limit, pagination.total_count)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
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
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        color: "#cccccc",
                        backgroundColor: "#2d2d2d",
                        border: "1px solid #3d3d3d",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1f1f1f")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2d2d2d")
                      }
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
                            className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            style={{
                              color: pageNum === page ? "#d4af37" : "#cccccc",
                              backgroundColor:
                                pageNum === page ? "#2d2d2d" : "#1d1d1d",
                              border: "1px solid #3d3d3d",
                            }}
                            onMouseEnter={(e) => {
                              if (pageNum !== page)
                                e.currentTarget.style.backgroundColor =
                                  "#1f1f1f";
                            }}
                            onMouseLeave={(e) => {
                              if (pageNum !== page)
                                e.currentTarget.style.backgroundColor =
                                  "#1d1d1d";
                            }}
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
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        color: "#cccccc",
                        backgroundColor: "#2d2d2d",
                        border: "1px solid #3d3d3d",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1f1f1f")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2d2d2d")
                      }
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
