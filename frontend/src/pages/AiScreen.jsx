import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Input, Button, Loader } from "../components/ui";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIPlanner() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [type, setType] = useState("");

  const [itinerary, setItinerary] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(
    "Finding the best local experiences...",
  );

  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Finding the best local experiences...",
      "Checking your budget...",
      "Planning your itinerary...",
      "Almost ready...",
    ];

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingMessage(messages[index]);
    }, 1800);

    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    setItinerary("");
    setListings([]);

    if (!destination || !budget || !days || !type) {
      setToast("Please fill all fields");
      setTimeout(() => setToast(""), 3000);
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
          destination,
          budget: Number(budget),
          days: Number(days),
          travel_type: type,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate itinerary");
      }

      setItinerary(String(data.data.itinerary));
      setListings(data.data.recommendedListings || []);
    } catch (error) {
      console.error(error);
      setToast(error.message);
      setTimeout(() => setToast(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Toast Notification Deck */}
      {toast && (
        <div className="fixed top-5 right-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-3 rounded-xl shadow-xl border border-slate-800 dark:border-slate-200 z-50 animate-fade-in">
          {toast}
        </div>
      )}

      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Dashboard Headings */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
              AI Travel Planner
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Plan your perfect trip with authentic StayLocal experiences
              powered by AI.
            </p>
          </div>

          {/* Adaptive Presentation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Control Column: Form Deck & Quick Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  Configure Trip
                </h2>
                <div className="space-y-4">
                  <Input
                    placeholder="Destination (e.g. Rishikesh)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Budget (₹)"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                    <Input
                      placeholder="Number of Days"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                    />
                  </div>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm"
                  >
                    <option value="" disabled>
                      Select Travel Type
                    </option>
                    <option>Solo</option>
                    <option>Couple</option>
                    <option>Friends</option>
                    <option>Family</option>
                  </select>

                  <Button
                    label={
                      loading ? "✨ Planning..." : "✨ Generate AI Itinerary"
                    }
                    onClick={handleGenerate}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium py-3 rounded-xl shadow-md"
                  />
                </div>
              </div>

              {/* Sidebar Quick References Panel */}
              {itinerary && listings.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hidden lg:block shadow-sm">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 text-sm tracking-wide uppercase">
                    🏠 Quick Links
                  </h3>
                  <div className="space-y-4">
                    {listings.map((item) => {
                      let itemImg =
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80";
                      if (itemImg.includes("127.0.0.1:8000")) {
                        itemImg = itemImg.replace(
                          "http://127.0.0.1:8000",
                          window.location.origin.replace("5173", "8000"),
                        );
                      }
                      return (
                        <a
                          href={`/listings/${item.id}`}
                          key={item.id}
                          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                        >
                          <img
                            src={itemImg}
                            alt={item.title}
                            className="w-14 h-14 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold truncate group-hover:text-green-600 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              ₹{item.price}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Main Column Canvas: Dynamic Responses Panel */}
            <div className="lg:col-span-2">
              {loading && (
                <div className="flex flex-col items-center gap-4 text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
                  <Loader className="w-10 h-10 text-green-600 animate-spin" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    ✨ Compiling Your Custom Plan...
                  </h3>
                  <p className="text-sm text-slate-400 italic">
                    "{loadingMessage}"
                  </p>
                </div>
              )}

              {!loading && !itinerary && (
                <div className="text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-20 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="text-6xl mb-4">🌍</div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Ready to Explore?
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Enter your destination parameters on the left pane to
                    initialize our localized stay engine.
                  </p>
                </div>
              )}

              {itinerary && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-10 transition-all">
                  {/* Dynamic Action Bar header containing copy option */}
                  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        ✈️ Your Custom Adventure Map
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Engineered securely via StayLocal AI
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(itinerary);
                        setToast("Itinerary copied successfully!");
                        setTimeout(() => setToast(""), 3000);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors shadow-lg shadow-green-600/10"
                    >
                      📋 Copy Itinerary
                    </button>
                  </div>

                  {/* Core Context Badges */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[
                      { title: "Destination", value: destination },
                      { title: "Budget Set", value: `₹${budget}` },
                      { title: "Duration", value: `${days} Days` },
                      { title: "Vibe Profile", value: type },
                    ].map((badge, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800"
                      >
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {badge.title}
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 text-sm capitalize truncate">
                          {badge.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* NEW ADDITION: VISUAL BUDGET & ACCOMMODATION GALLERIES PANEL */}
                  {listings.length > 0 && (
                    <div className="mb-10 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm animate-fade-in">
                      <div className="mb-4">
                        <h3 className="text-base font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          💰 StayLocal Recommendation Breakdown
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Real available properties matching your chosen
                          location profile:
                        </p>
                      </div>

                      {/* Horizontal scroll grid deck for easy exploration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {listings.map((item) => {
                          const rawImages =
                            item.images || (item.image ? [item.image] : []);
                          let displayImg =
                            rawImages[0] ||
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";

                          if (displayImg.includes("127.0.0.1:8000")) {
                            displayImg = displayImg.replace(
                              "http://127.0.0.1:8000",
                              window.location.origin.replace("5173", "8000"),
                            );
                          }

                          return (
                            <div
                              key={item.id}
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                              <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={displayImg}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";
                                  }}
                                />
                                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {item.listingType || "Verified Stay"}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-green-600 text-white font-extrabold text-xs px-2 py-1 rounded-md shadow-sm">
                                  ₹{item.price}/{item.priceUnit || "night"}
                                </div>
                              </div>

                              <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                                    📍 {item.city}{" "}
                                    {item.state ? `, ${item.state}` : ""}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                                  <a
                                    href={`/listings/${item.id}`}
                                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs transition-colors"
                                  >
                                    Explore Stay →
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Markdown Display Engine for the text itinerary details */}
                  <article className="max-w-none text-slate-700 dark:text-slate-300">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({ ...props }) => (
                          <h2
                            className="text-xl font-bold text-green-700 dark:text-green-400 mt-8 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 tracking-tight"
                            {...props}
                          />
                        ),
                        h3: ({ ...props }) => (
                          <h3
                            className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-5 mb-2 uppercase tracking-wide opacity-80"
                            {...props}
                          />
                        ),
                        ul: ({ ...props }) => (
                          <ul
                            className="space-y-3 my-4 list-none pl-0"
                            {...props}
                          />
                        ),
                        li: ({ node, children, ...props }) => (
                          <li
                            className="text-[15px] relative pl-5 flex items-start text-slate-600 dark:text-slate-300 mb-1"
                            {...props}
                          >
                            <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                            <span className="flex-1">{children}</span>
                          </li>
                        ),
                        strong: ({ ...props }) => (
                          <strong
                            className="font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 px-1.5 py-0.5 rounded-md text-[13px]"
                            {...props}
                          />
                        ),

                        // Custom paragraph parser targeting inline tokens if mentioned inside text block
                        p: ({ children }) => {
                          const textStr = String(children);
                          const regex = /\[\[(.*?)\]\]/g;

                          if (regex.test(textStr)) {
                            const match = textStr.match(/\[\[(.*?)\]\]/);
                            const matchedTitle = match ? match[1] : "";

                            const foundListing = listings.find((l) =>
                              l.title
                                .toLowerCase()
                                .includes(matchedTitle.toLowerCase()),
                            );

                            if (foundListing) {
                              const rawImages =
                                foundListing.images ||
                                (foundListing.image
                                  ? [foundListing.image]
                                  : []);
                              const processedImages = rawImages.map((img) => {
                                if (img.includes("127.0.0.1:8000")) {
                                  return img.replace(
                                    "http://127.0.0.1:8000",
                                    window.location.origin.replace(
                                      "5173",
                                      "8000",
                                    ),
                                  );
                                }
                                return img;
                              });

                              const finalImages =
                                processedImages.length > 0
                                  ? processedImages
                                  : [
                                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
                                    ];

                              return (
                                <div className="my-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 overflow-hidden shadow-md group/card transition-all hover:shadow-lg">
                                  <div className="grid grid-cols-3 gap-1.5 p-2 bg-white dark:bg-slate-900 border-b border-emerald-50 dark:border-slate-800">
                                    <div className="col-span-2 relative h-48 sm:h-56 overflow-hidden rounded-l-xl">
                                      <img
                                        src={finalImages[0]}
                                        alt={`${foundListing.title} Main`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                        onError={(e) => {
                                          e.target.src =
                                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";
                                        }}
                                      />
                                    </div>

                                    <div className="col-span-1 flex flex-col gap-1.5 h-48 sm:h-56">
                                      <div className="flex-1 relative overflow-hidden rounded-tr-xl">
                                        <img
                                          src={finalImages[1] || finalImages[0]}
                                          alt="Gallery Offset 2"
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                          }}
                                        />
                                      </div>
                                      <div className="flex-1 relative overflow-hidden rounded-br-xl bg-slate-900">
                                        <img
                                          src={finalImages[2] || finalImages[0]}
                                          alt="Gallery Offset 3"
                                          className="w-full h-full object-cover opacity-60 group-hover/card:opacity-80 transition-opacity"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                          }}
                                        />
                                        {finalImages.length > 3 && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-xs pointer-events-none">
                                            +{finalImages.length - 3} More
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-5 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {foundListing.listingType ||
                                          "StayLocal Verified Option"}
                                      </span>
                                      <span className="text-xs text-slate-400 font-medium">
                                        📍 {foundListing.city}
                                      </span>
                                    </div>

                                    <h4 className="font-bold text-slate-900 dark:text-white mt-1.5 text-lg truncate tracking-tight">
                                      {foundListing.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                      {foundListing.description}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                                      <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                          Estimated Price
                                        </p>
                                        <p className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                                          ₹{foundListing.price}{" "}
                                          <span className="text-xs font-normal text-slate-400">
                                            /{foundListing.priceUnit}
                                          </span>
                                        </p>
                                      </div>
                                      <a
                                        href={`/listings/${foundListing.id}`}
                                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all hover:translate-x-0.5"
                                      >
                                        Explore Listing →
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }
                          return (
                            <p className="leading-relaxed mb-4 text-[15px] text-slate-600 dark:text-slate-300">
                              {children}
                            </p>
                          );
                        },
                      }}
                    >
                      {itinerary}
                    </ReactMarkdown>
                  </article>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
