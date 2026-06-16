export default function Card({ title, description, image, price }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="h-40 sm:h-44 w-full object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h2 className="text-base sm:text-lg font-semibold text-green-800 break-words">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mt-1 leading-relaxed break-words">
          {description}
        </p>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
          <p className="text-green-700 font-bold text-base">₹{price}/night</p>

          <button className="w-full sm:w-auto px-4 py-2 bg-green-800 text-white text-sm rounded-full hover:bg-green-900 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
