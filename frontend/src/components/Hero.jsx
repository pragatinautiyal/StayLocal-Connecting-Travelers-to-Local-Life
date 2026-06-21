import { Input, Button } from "../components/ui";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="relative min-h-[70vh] sm:min-h-[85vh] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600"
          alt="Eco tourism landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Hero Card */}
        <div className="relative z-10 w-full max-w-5xl">
          <div className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl p-5 sm:p-8 lg:p-10 text-center">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              StayLocal — Discover Affordable Eco Stays & Village Life
            </h1>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Find off-season homestay deals, explore hidden eco-tourism
              destinations, and connect directly with local communities.
            </p>

            {/* Search */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Search destination" type="text" />

              <select className="w-full p-3 border border-gray-300 rounded-xl">
                <option>Budget Range</option>
                <option>₹500 - ₹1500</option>
                <option>₹1500 - ₹3000</option>
                <option>₹3000+</option>
              </select>

              <select className="w-full p-3 border border-gray-300 rounded-xl">
                <option>Experience Type</option>
                <option>Village Stay</option>
                <option>Eco Resort</option>
                <option>Farm Stay</option>
              </select>
            </div>

            {/* Button */}
            <div className="mt-6">
              <Button
                label="Explore Stays"
                onClick={() => navigate("/explore")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
