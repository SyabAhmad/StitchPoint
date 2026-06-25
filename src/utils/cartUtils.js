import { fetchWithAuth } from "./fetchWithAuth.js";

// Cart utility functions using API
export const getCart = async () => {
  try {
    const response = await fetchWithAuth("http://localhost:5000/api/cart");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.cart_items || [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

export const addToCart = async (product, quantity = 1) => {
  try {
    const response = await fetchWithAuth("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: quantity,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Return updated cart
    return await getCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await fetchWithAuth(
      `http://localhost:5000/api/cart/remove/${productId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Return updated cart
    return await getCart();
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (productId, quantity) => {
  try {
    const response = await fetchWithAuth(
      "http://localhost:5000/api/cart/update",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Return updated cart
    return await getCart();
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const getCartTotal = async () => {
  const cart = await getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getCartItemCount = async () => {
  const cart = await getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const clearCart = async () => {
  try {
    const response = await fetchWithAuth(
      "http://localhost:5000/api/cart/clear",
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return [];
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
