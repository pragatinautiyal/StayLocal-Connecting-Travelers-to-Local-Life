import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Host Portal Hero Banner */}
        <section className="bg-gradient-to-b from-green-100 to-green-50 dark:from-slate-800 dark:to-slate-900 py-16 px-4 text-center border-b border-gray-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider dark:bg-green-900/40 dark:text-green-300">
              Host Portal
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mt-4 leading-tight">
              Grow Your Business & Manage Your Listings
            </h1>

            <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              StayLocal connects authentic local hosts directly with conscious
              travelers. Easily manage your homestays, rentals, and local
              experiences all in one place.
            </p>

            {/* Single Primary Action Button */}
            <div className="mt-8 flex justify-center">
              <Button
                label="Create New Listing"
                onClick={() => navigate("/create-listing")}
              />
            </div>
          </div>
        </section>

        {/* Host Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
              Host Management Tools
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
              Everything you need to showcase, update, and grow your local
              hospitality service.
            </p>
          </div>

          {/* Interactive Management Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Add Offerings */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="text-3xl">🌿</div>

                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  Publish Local Offerings
                </h3>

                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  List homestays, rural tours, bike rentals, cultural workshops,
                  or traditional food experiences effortlessly.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                  ✓ Instant Publishing
                </p>
              </div>
            </div>

            {/* Card 2: Edit & Update */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="text-3xl">✏️</div>

                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  Edit & Update Details
                </h3>

                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  Update seasonal pricing, refresh photo galleries, adjust
                  availability, and edit service descriptions anytime.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate("/my-listings")}
                  className="w-full py-2.5 rounded-xl border-2 border-green-600 text-green-700 font-semibold hover:bg-green-600 hover:text-white transition duration-200 text-sm flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Edit My Listings →
                </button>
              </div>
            </div>

            {/* Card 3: Dashboard & Stats */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="text-3xl">📊</div>

                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  Monitor Dashboard
                </h3>

                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  Keep track of your total listings, check average price
                  metrics, and monitor destinations covered across your
                  business.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-2.5 rounded-xl border-2 border-green-600 text-green-700 font-semibold hover:bg-green-600 hover:text-white transition duration-200 text-sm flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Go to Dashboard →
                </button>
              </div>
            </div>
          </div>

          {/* About StayLocal Card */}
          <div className="mt-14">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 text-center max-w-3xl mx-auto hover:shadow-lg transition-all">
              <span className="text-4xl">🏡</span>

              <h3 className="text-2xl font-bold text-gray-800 mt-3">
                About StayLocal
              </h3>

              <p className="mt-3 text-gray-600 max-w-xl mx-auto leading-relaxed text-base">
                StayLocal was built to empower local hosts and rural
                entrepreneurs. Our mission is to eliminate middlemen, allowing
                travelers to experience real community-led tourism while helping
                you retain full ownership of your earnings and hospitality
                business.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="mt-16 sm:mt-20 text-center px-4 mb-10">
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Empowering local hosts to build thriving, community-led tourism.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
