import React from "react";
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

export default function ShopProductCard({
  product,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onClick,
}) {
  const hasDiscount = product.sale_type && product.sale_discount_percentage > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - product.sale_discount_percentage / 100))
    : null;

  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/[0.03] mb-3">
        {product.image_url ? (
          <img
            src={`http://127.0.0.1:5000${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 items-center justify-center bg-gradient-to-b from-black/[0.02] to-black/[0.06] ${
            product.image_url ? "hidden" : "flex"
          }`}
        >
          <span className="text-5xl font-serif text-black/10">
            {product.name?.charAt(0)}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              {product.sale_discount_percentage}% Off
            </span>
          )}
          {product.stock_quantity === 0 && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200"
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500 text-xs" />
          ) : (
            <FaRegHeart className="text-black/30 text-xs hover:text-red-400 transition-colors" />
          )}
        </button>

        {/* Quick Add */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          disabled={product.stock_quantity === 0}
          className="absolute bottom-3 left-3 right-3 py-2.5 bg-white/95 backdrop-blur-sm text-black text-xs font-semibold rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold-500 hover:text-white disabled:opacity-0 disabled:pointer-events-none"
        >
          <FaShoppingCart className="text-[10px]" />
          Add to Cart
        </button>

        {/* Sale Badge - Bottom Right */}
        {hasDiscount && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-0 transition-opacity">
            {/* Hidden on hover since Quick Add replaces it */}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5">
        {/* Store */}
        <p className="text-[11px] text-black/30 uppercase tracking-wider mb-1">
          {product.store_name}
        </p>

        {/* Name */}
        <h3 className="text-sm font-semibold text-black leading-snug mb-1.5 line-clamp-1 group-hover:text-gold-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-px">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-[10px] ${
                  i < Math.floor(product.average_rating || 0)
                    ? "text-gold-500"
                    : "text-black/10"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-black/25 ml-0.5">
            ({product.review_count || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-black font-bold">
                PKR {discountedPrice.toLocaleString()}
              </span>
              <span className="text-black/25 text-xs line-through">
                PKR {product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-black font-bold">
              PKR {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
