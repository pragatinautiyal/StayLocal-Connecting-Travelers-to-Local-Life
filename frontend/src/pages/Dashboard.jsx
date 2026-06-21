import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Provider Dashboard
          </h1>

          <p className="mt-3 text-gray-600 text-center max-w-2xl mx-auto">
            Manage your homestay listings, monitor bookings, and update seasonal
            pricing to attract more travelers.
          </p>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
              <h2 className="text-green-800 font-semibold text-lg">
                Total Listings
              </h2>
              <p className="text-3xl font-bold mt-2">5</p>
              <p className="text-sm text-gray-500">Active homestays</p>
            </div>

            <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
              <h2 className="text-green-800 font-semibold text-lg">
                Monthly Bookings
              </h2>
              <p className="text-3xl font-bold mt-2">18</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>

            <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
              <h2 className="text-green-800 font-semibold text-lg">Earnings</h2>
              <p className="text-3xl font-bold mt-2">₹24,500</p>
              <p className="text-sm text-gray-500">Estimated revenue</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-800">
                Manage Listings
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Add new homestays, edit details, and update availability.
              </p>

              <div className="mt-4">
                <Button label="Go to Listings" />
              </div>
            </div>

            <div className="p-6 border rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-800">
                Seasonal Pricing
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Adjust prices based on demand, season, and tourism flow.
              </p>

              <div className="mt-4">
                <Button label="Update Pricing" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
