import COLOR_PALETTES from "../../../theme";

const ProductCard = ({ image, title, price, rating, brand, discount }) => {
  const palette = COLOR_PALETTES.luxuryCouture;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {discount && (
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: palette.accentButton }}
          >
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs opacity-60 mb-1">{brand}</p>
        <h3 className="text-sm font-semibold mb-2 line-clamp-2">{title}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs opacity-70">({rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-lg font-bold"
              style={{ color: palette.accentButton }}
            >
              Rs {price}
            </p>
          </div>
          <button
            className="p-2 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: palette.accentButton,
              color: palette.primaryHeader,
            }}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 13h2v8H3v-8zm4-8h2v16H7V5zm4-2h2v18h-2V3zm4 4h2v14h-2V7zm4-2h2v16h-2V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
