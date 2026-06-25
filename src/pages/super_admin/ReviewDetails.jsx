import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ReviewDetails = () => {
  const { review_id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviewDetails();
  }, [review_id]);

  const fetchReviewDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/analytics/reviews/${review_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch review details");
      }

      const data = await response.json();
      setReview(data.review);
    } catch (error) {
      console.error("Error fetching review details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  const handleBack = () => {
    navigate("/super-admin-dashboard/reviews");
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <span>Loading review details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-8"
        style={{ backgroundColor: "#000000", minHeight: "100vh" }}
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center mb-6 px-4 py-2 rounded"
            style={{
              backgroundColor: "#2d2d2d",
              color: "#ffffff",
              border: "1px solid #3d3d3d",
            }}
          >
            <FaArrowLeft className="mr-2" />
            Back to Reviews
          </button>
          <div className="text-center py-8" style={{ color: "#ff6b6b" }}>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div
        className="p-8"
        style={{ backgroundColor: "#000000", minHeight: "100vh" }}
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center mb-6 px-4 py-2 rounded"
            style={{
              backgroundColor: "#2d2d2d",
              color: "#ffffff",
              border: "1px solid #3d3d3d",
            }}
          >
            <FaArrowLeft className="mr-2" />
            Back to Reviews
          </button>
          <div className="text-center py-8" style={{ color: "#999999" }}>
            Review not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-8"
      style={{ backgroundColor: "#000000", minHeight: "100vh" }}
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center mb-6 px-4 py-2 rounded"
          style={{
            backgroundColor: "#2d2d2d",
            color: "#ffffff",
            border: "1px solid #3d3d3d",
          }}
        >
          <FaArrowLeft className="mr-2" />
          Back to Reviews
        </button>

        <h1 className="text-3xl font-bold mb-6" style={{ color: "#d4af37" }}>
          Review Details
        </h1>

        <div
          className="shadow overflow-hidden sm:rounded-md"
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
              Review #{review.id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: "#999999" }}>
              Detailed information about this review
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt
                  className="text-sm font-medium"
                  style={{ color: "#d4af37" }}
                >
                  Rating
                </dt>
                <dd className="mt-1 text-sm" style={{ color: "#ffffff" }}>
                  <div className="flex items-center">
                    <span className="mr-2">{renderStars(review.rating)}</span>
                    <span>({review.rating}/5)</span>
                  </div>
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt
                  className="text-sm font-medium"
                  style={{ color: "#d4af37" }}
                >
                  Date Created
                </dt>
                <dd className="mt-1 text-sm" style={{ color: "#ffffff" }}>
                  {new Date(review.created_at).toLocaleString()}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt
                  className="text-sm font-medium"
                  style={{ color: "#d4af37" }}
                >
                  Review Comment
                </dt>
                <dd className="mt-1 text-sm" style={{ color: "#ffffff" }}>
                  {review.comment || "No comment provided"}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt
                  className="text-sm font-medium"
                  style={{ color: "#d4af37" }}
                >
                  User
                </dt>
                <dd className="mt-1 text-sm" style={{ color: "#cccccc" }}>
                  <div>
                    <div className="font-medium">{review.user_name}</div>
                    <div className="text-xs">{review.user_email}</div>
                  </div>
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt
                  className="text-sm font-medium"
                  style={{ color: "#d4af37" }}
                >
                  Product
                </dt>
                <dd className="mt-1 text-sm" style={{ color: "#cccccc" }}>
                  {review.product_name}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt
                  className="text-sm font-medium"
                  style={{ color: "#d4af37" }}
                >
                  Store
                </dt>
                <dd className="mt-1 text-sm" style={{ color: "#cccccc" }}>
                  {review.store_name}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt
                  className="text-sm font-medium"
                  style={{ color: "#d4af37" }}
                >
                  Product ID
                </dt>
                <dd className="mt-1 text-sm" style={{ color: "#cccccc" }}>
                  {review.product_id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
