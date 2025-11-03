// Wishlist utility functions using API calls
import { fetchWithAuth } from "./fetchWithAuth.js";

export const getWishlist = async () => {
  try {
    const response = await fetchWithAuth("http://localhost:5000/api/wishlist");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.wishlist_items || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

export const addToWishlist = async (product) => {
  try {
    const response = await fetchWithAuth(
      "http://localhost:5000/api/wishlist/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Fetch updated wishlist after adding
    return await getWishlist();
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await fetchWithAuth(
      `http://localhost:5000/api/wishlist/remove/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Fetch updated wishlist after removing
    return await getWishlist();
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

export const isInWishlist = async (productId) => {
  try {
    const response = await fetchWithAuth(
      `http://localhost:5000/api/wishlist/check/${productId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.in_wishlist || false;
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
};

export const getWishlistCount = async () => {
  try {
    const wishlist = await getWishlist();
    return wishlist.length;
  } catch (error) {
    console.error("Error getting wishlist count:", error);
    return 0;
  }
};

export const clearWishlist = async () => {
  try {
    const response = await fetchWithAuth(
      "http://localhost:5000/api/wishlist/clear",
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return [];
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    throw error;
  }
};
