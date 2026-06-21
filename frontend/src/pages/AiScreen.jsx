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

  const handleGenerate = () => {
    setLoading(true);

    setTimeout(() => {
      setResults([
        {
          title: "Himalayan Retreat",
          description: "Perfect for peaceful mountain experience.",
          price: "1200",
        },
        {
          title: "Kerala Village Stay",
          description: "Relaxing backwater and village lifestyle.",
          price: "900",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-center">AI Travel Planner</h1>

          <div className="mt-10 max-w-xl mx-auto space-y-4">
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

            <Button label="Generate" onClick={handleGenerate} />
          </div>

          {loading && <Loader />}

          {results.length > 0 && (
            <div className="mt-10 grid grid-cols-3 gap-6">
              {results.map((item, i) => (
                <Card key={i} {...item} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
