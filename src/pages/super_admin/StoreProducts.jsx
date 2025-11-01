import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const StoreProducts = () => {
  const { store_id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch store name
        const storeRes = await fetch(
          `http://localhost:5000/api/analytics/stores-analytics/${store_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const storeData = await storeRes.json();
        setStoreName(storeData.store_name || storeData.name || "Store");

        // Fetch products
        const productsRes = await fetch(
          `http://localhost:5000/api/analytics/products-by-store?store_id=${store_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const productsData = await productsRes.json();
        setProducts(productsData.products || productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [store_id]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
      className="p-6"
    >
      {/* Back Button */}
      <Link
        to={`/super-admin-dashboard/store-analytics/${store_id}`}
        className="inline-flex items-center gap-2 mb-6 hover:text-yellow-500 transition-colors"
        style={{ color: "#d4af37" }}
      >
        <FaArrowLeft /> Back to Store
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 style={{ color: "#ffffff" }} className="text-3xl font-bold">
          Products for {storeName}
        </h1>
        <p style={{ color: "#999999" }} className="mt-2">
          Showing {products.length > 0 ? indexOfFirstItem + 1 : 0}-
          {Math.min(indexOfLastItem, products.length)} of {products.length}{" "}
          products
        </p>
      </div>

      {/* Products Table */}
      {products.length > 0 ? (
        <div
          className="shadow rounded-lg overflow-x-auto"
          style={{ backgroundColor: "#1d1d1d" }}
        >
          <table className="min-w-full">
            <thead style={{ backgroundColor: "#2d2d2d" }}>
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#d4af37" }}
                >
                  Product Name
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
              {currentProducts.map((p, idx) => (
                <tr
                  key={p.product_id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#1d1d1d" : "#2d2d2d",
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="px-4 py-4 border-t flex items-center justify-between"
              style={{ borderColor: "#2d2d2d" }}
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-80 transition-colors"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
              >
                Previous
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className="px-3 py-1 rounded text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor:
                        currentPage === i + 1 ? "#d4af37" : "#2d2d2d",
                      color: currentPage === i + 1 ? "#000000" : "#ffffff",
                      border: "1px solid #3d3d3d",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-80 transition-colors"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#ffffff",
                  border: "1px solid #3d3d3d",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className="shadow rounded-lg p-8 text-center"
          style={{ backgroundColor: "#1d1d1d", color: "#999999" }}
        >
          No products found for this store.
        </div>
      )}
    </div>
  );
};

export default StoreProducts;
