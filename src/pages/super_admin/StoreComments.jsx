import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const StoreComments = () => {
  const { store_id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreComments = async () => {
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
        console.error("Error fetching store comments:", error);
        setStore(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreComments();
  }, [store_id]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading store comments...</span>
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
            The requested store could not be found.
          </p>
          <Link
            to={`/super-admin-dashboard/store-analytics/${store_id}`}
            className="mt-4 inline-block"
            style={{ color: "#d4af37" }}
          >
            Back to Store Analytics
          </Link>
        </div>
      </div>
    );
  }

  const productsWithComments = products.filter((p) => p.total_comments > 0);

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#d4af37" }}>
              {store.store_name} - Comments
            </h1>
            <p className="text-sm" style={{ color: "#999999" }}>
              Products with comments for this store
            </p>
          </div>
          <Link
            to={`/super-admin-dashboard/store-analytics/${store_id}`}
            className="px-3 py-1 rounded-md text-sm"
            style={{ backgroundColor: "#d4af37", color: "#000" }}
          >
            Back
          </Link>
        </div>

        {productsWithComments.length > 0 ? (
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
                    Total Comments
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
                    Reviews
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#d4af37" }}
                  >
                    Avg Rating
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#1d1d1d" }}>
                {productsWithComments.map((p, idx) => (
                  <tr
                    key={p.product_id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                    }}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#ffffff" }}
                    >
                      <Link
                        to={`/product/${p.product_id}`}
                        style={{ color: "#d4af37" }}
                        className="hover:underline"
                      >
                        {p.product_name}
                      </Link>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {p.total_comments}
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
                      {p.total_reviews}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "#cccccc" }}
                    >
                      {p.avg_rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: "#999999" }} className="py-8 text-center">
            No products with comments found for this store.
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreComments;
