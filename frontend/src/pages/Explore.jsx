import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

import mountain from "../assets/mountain.jpg";
import village from "../assets/village.jpg";
import forest from "../assets/forest.jpeg";

export default function Explore() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 text-center">
            Explore Homestays
          </h1>

          <p className="mt-3 text-gray-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
            Discover eco-friendly stays, village homes, and nature retreats
            across India based on your budget and travel style.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Village Life Homestay"
              description="Peaceful balcony stay surrounded by rural fields and authentic village life."
              image={village}
              price="800"
            />

            <Card
              title="Mountain View Homestay"
              description="Luxury balcony room overlooking majestic Himalayan mountains."
              image={mountain}
              price="1200"
            />

            <Card
              title="Forest View Homestay"
              description="Cozy balcony room surrounded by forests, greenery, and natural waterfalls."
              image={forest}
              price="1500"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
