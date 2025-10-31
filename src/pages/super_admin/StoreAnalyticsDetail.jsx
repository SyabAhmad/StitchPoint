import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const StoreAnalyticsDetail = () => {
  const { store_id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const [storeRes, productsRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/analytics/stores-analytics/${store_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `http://localhost:5000/api/analytics/products-by-store?store_id=${store_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const storeData = await storeRes.json();
        const productsData = await productsRes.json();

        setStore(storeData.store || storeData);
        setProducts(productsData.products || productsData);
      } catch (error) {
        console.error("Error fetching store detail:", error);
        setStore(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetail();
  }, [store_id]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading store analytics...</span>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div
        className="p-8"
        style={{ backgroundColor: "#000000", minHeight: "100vh" }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold" style={{ color: "#d4af37" }}>
            Store Not Found
          </h1>
          <p style={{ color: "#999999" }} className="mt-4">
            The requested store analytics could not be found.
          </p>
          <Link
            to="/super-admin-dashboard/store-analytics"
            className="mt-4 inline-block"
            style={{ color: "#d4af37" }}
          >
            Back to Stores Analytics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#d4af37" }}>
              {store.store_name}
            </h1>
            <p className="text-sm" style={{ color: "#999999" }}>
              Detailed analytics and products for this store
            </p>
          </div>
          <Link
            to="/super-admin-dashboard/store-analytics"
            className="px-3 py-1 rounded-md text-sm"
            style={{ backgroundColor: "#d4af37", color: "#000" }}
          >
            Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="shadow rounded-lg p-6"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <h3
              style={{ color: "#ffffff" }}
              className="text-lg font-semibold mb-2"
            >
              Store Summary
            </h3>
            <div style={{ color: "#cccccc" }}>
              <p>Total Products: {store.total_products}</p>
              <p>Total Views: {store.total_views}</p>
              <p>Total Clicks: {store.total_clicks}</p>
              <p>Cart Adds: {store.total_cart_adds}</p>
              <p>Avg Time Spent: {store.avg_time_spent}s</p>
              <p>Total Reviews: {store.total_reviews}</p>
              <p>Avg Rating: {store.avg_rating}</p>
              <p>Total Comments: {store.total_comments}</p>
            </div>
          </div>

          <div
            className="shadow rounded-lg p-6 lg:col-span-2"
            style={{ backgroundColor: "#1d1d1d" }}
          >
            <h3
              style={{ color: "#ffffff" }}
              className="text-lg font-semibold mb-2"
            >
              Products
            </h3>
            {products.length > 0 ? (
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
                    {products.map((p, idx) => (
                      <tr
                        key={p.product_id}
                        style={{
                          backgroundColor:
                            idx % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                        }}
                      >
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: "#ffffff" }}
                        >
                          {p.product_name}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: "#cccccc" }}
                        >
                          {p.total_views}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: "#cccccc" }}
                        >
                          {p.total_clicks}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: "#cccccc" }}
                        >
                          {p.total_cart_adds}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: "#cccccc" }}
                        >
                          {p.avg_time_spent}s
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: "#cccccc" }}
                        >
                          {p.total_reviews}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: "#cccccc" }}
                        >
                          {p.avg_rating}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: "#cccccc" }}
                        >
                          {p.total_comments}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ color: "#999999" }} className="py-8 text-center">
                No products found for this store.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalyticsDetail;
