import React, { useState } from "react";
import { FaStar, FaTimes, FaImage } from "react-icons/fa";
import toast from "react-hot-toast";

const ReviewModal = ({ order, orderItem, product, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build product object from orderItem if product not provided
  const productData = product || {
    id: orderItem?.product_id,
    name: orderItem?.product_name || `Product #${orderItem?.product_id}`,
  };

  // Guard against missing orderItem
  if (!orderItem) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-red-600 font-semibold">
            Error: No item selected for review
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("product_id", productData.id);
      formData.append("order_item_id", orderItem.id);
      formData.append("order_id", order.id);
      formData.append("rating", rating);
      formData.append("comment", comment);

      images.forEach((image) => {
        formData.append(`images`, image);
      });

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Review submitted successfully! ⭐");
        setIsSubmitting(false);
        onSubmit();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to submit review");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            ⭐ Review: {productData.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Order #:</span> {order.id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Quantity:</span>{" "}
              {orderItem.quantity}
            </p>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              How would you rate this product?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition transform hover:scale-110"
                >
                  <FaStar
                    size={40}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {rating === 5 && "Excellent! 🎉"}
              {rating === 4 && "Very Good! 😊"}
              {rating === 3 && "Good 👍"}
              {rating === 2 && "Okay 🤔"}
              {rating === 1 && "Poor 😞"}
            </p>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Write your review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              rows="5"
              maxLength="1000"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/1000 characters
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              📸 Add Photos (Optional - Max 3)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FaImage className="mx-auto text-4xl text-gray-400 mb-3" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-gray-900 font-semibold hover:text-gray-600"
              >
                Click to upload images
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 5MB each
              </p>
            </div>

            {/* Preview Images */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
