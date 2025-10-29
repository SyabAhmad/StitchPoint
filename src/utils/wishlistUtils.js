// Wishlist utility functions
export const getWishlist = () => {
  const wishlist = localStorage.getItem("wishlist");
  return wishlist ? JSON.parse(wishlist) : [];
};

export const addToWishlist = (product) => {
  const wishlist = getWishlist();
  const existingItem = wishlist.find((item) => item.id === product.id);

  if (!existingItem) {
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      store: product.store,
      added_at: new Date().toISOString(),
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  return wishlist;
};

export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter((item) => item.id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  return updatedWishlist;
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === productId);
};

export const getWishlistCount = () => {
  const wishlist = getWishlist();
  return wishlist.length;
};
