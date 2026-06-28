import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { Input, Button, Loader } from "../components/ui";
import { useState } from "react";

export default function AIPlanner() {
  const [budget, setBudget] = useState("");
  const [season, setSeason] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const handleGenerate = async () => {
    setResults([]);
    if (!budget || !season || !type) {
      setToast("Please fill all fields");

      setTimeout(() => {
        setToast("");
      }, 3000);

      return;
    }
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/ai-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget: Number(budget),
          season,
          travel_type: type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }

      const data = await response.json();

      setResults(data.recommendations);
    } catch (error) {
      console.error(error);

      setToast("Failed to load recommendations");

      setTimeout(() => {
        setToast("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      {toast && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-slate-100">
            AI Travel Planner
          </h1>

          <p className="mt-3 text-center text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Let AI suggest the best StayLocal experiences based on your budget,
            season, and travel preferences.
          </p>

          <div className="mt-10 max-w-xl mx-auto p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm">
            <div className="space-y-4">
              <Input
                placeholder="Enter Budget (₹)"
                onChange={(e) => setBudget(e.target.value)}
              />

              <Input
                placeholder="Season (Summer/Winter)"
                onChange={(e) => setSeason(e.target.value)}
              />

              <Input
                placeholder="Travel Type"
                onChange={(e) => setType(e.target.value)}
              />

              <Button
                label={loading ? "Generating..." : "Generate"}
                onClick={handleGenerate}
              />
            </div>
          </div>

          {loading && (
            <div className="mt-8 flex justify-center">
              <Loader />
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-slate-100 mb-6">
                Recommended Stays
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                  <div key={item.id}>
                    <div className="mb-2 text-center text-green-600 font-semibold">
                      Match Score: {item.score}%
                    </div>

                    <Card
                      title={item.title}
                      description={item.description}
                      image={item.image}
                      price={item.price}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {!loading && results.length === 0 && budget && season && type && (
            <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
              No matching stays found.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
