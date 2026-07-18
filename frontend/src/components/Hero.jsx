import { useState } from "react";
import { Input, Button } from "../components/ui";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("All");
  const [listingType, setListingType] = useState("All");
  const [budget, setBudget] = useState("Any");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (city.trim()) {
      params.append("city", city.trim());
    }

    if (category !== "All") {
      params.append("category", category);
    }

    if (listingType !== "All") {
      params.append("listingType", listingType);
    }

    if (budget !== "Any") {
      params.append("budget", budget);
    }

    navigate(`/explore?${params.toString()}`);
  };

  const categories = [
    { icon: "🏡", name: "Stay" },
    { icon: "☕", name: "Cafe" },
    { icon: "🚲", name: "Rental" },
    { icon: "🧘", name: "Workshop" },
    { icon: "🌄", name: "Experience" },
    { icon: "🍽️", name: "Food & Drink" },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="relative min-h-[70vh] sm:min-h-[85vh] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600"
          alt="StayLocal"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Card */}
        <div className="relative z-10 w-full max-w-6xl">
          <div className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl p-6 sm:p-8 lg:p-10">
            {/* Heading */}
            <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Discover Authentic Local Experiences Across India
            </h1>

            {/* Description */}
            <p className="mt-5 text-center text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find homestays, cafés, rentals, workshops, food spots, and unique
              experiences hosted by local communities—all in one place.
            </p>

            {/* Search Filters */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination
                </label>

                <Input
                  type="text"
                  placeholder="Search city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Stay">Stay</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Rental">Rental</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Experience">Experience</option>
                  <option value="Food & Drink">Food & Drink</option>
                </select>
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Listing Type
                </label>

                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Types</option>
                  <option value="Homestay">Homestay</option>
                  <option value="Service">Service</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget
                </label>

                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Any">Any Budget</option>
                  <option value="0-1000">₹0 - ₹1000</option>
                  <option value="1000-3000">₹1000 - ₹3000</option>
                  <option value="3000+">₹3000+</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-8 flex justify-center">
              <Button label="🔍 Search Listings" onClick={handleSearch} />
            </div>

            {/* Popular Categories */}
            <div className="mt-14">
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                Explore by Category
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    onClick={() =>
                      navigate(
                        `/explore?category=${encodeURIComponent(item.name)}`,
                      )
                    }
                    className="bg-green-50 hover:bg-green-100 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="text-4xl">{item.icon}</div>

                    <p className="mt-3 font-medium text-gray-700">
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
