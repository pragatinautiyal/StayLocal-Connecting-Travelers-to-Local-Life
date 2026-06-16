import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 w-full">
        <Hero />

        {/* Feature Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-20">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Why StayLocal?
          </h2>

          <p className="text-center text-gray-500 mt-2 max-w-2xl mx-auto">
            Travel deeper, stay local, and experience eco-friendly hospitality
            built around real communities.
          </p>

          {/* Responsive Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
              <div className="text-3xl">🌿</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                Eco-Friendly Stays
              </h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Handpicked sustainable homes surrounded by nature for peaceful
                travel experiences.
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
              <div className="text-3xl">🏡</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                Village Experiences
              </h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Live like a local, enjoy traditional food, culture, and
                authentic rural life.
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
              <div className="text-3xl">🤝</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                Direct Host Connection
              </h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                No middlemen — connect directly with local hosts and support
                communities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-16 sm:mt-20 text-center px-4">
          <p className="text-gray-500 text-sm">
            Built for travelers who want meaningful journeys, not just bookings.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
