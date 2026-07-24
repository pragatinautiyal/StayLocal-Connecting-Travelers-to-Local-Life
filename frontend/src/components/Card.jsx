import { useNavigate } from "react-router-dom";

export default function Card({
  id,
  title,
  description,
  image,
  price,
  priceUnit,
  category,
  listingType,
  city,
  state,
  isWishlisted,
  onWishlistToggle,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/listing/${id}`)}
      className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Heart Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents navigating to details page
            onWishlistToggle(id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow hover:scale-110 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-colors ${
              isWishlisted
                ? "fill-red-500 stroke-red-500"
                : "fill-transparent stroke-slate-700 dark:stroke-slate-200"
            }`}
            strokeWidth="2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              📍 {city}, {state}
            </span>
            <span className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full font-medium text-slate-700 dark:text-slate-300">
              {category}
            </span>
          </div>

          <h3 className="mt-3 font-bold text-lg text-slate-800 dark:text-white line-clamp-1">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
            {listingType}
          </span>
          <span className="font-bold text-green-600 dark:text-green-400">
            ₹{price}{" "}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              / {priceUnit}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
