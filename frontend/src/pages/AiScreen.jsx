import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button, Loader } from "../components/ui";
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

  const openListingInNewTab = (id) => {
    window.open(`/listing/${id}`, "_blank");
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
        <div className="max-w-[1800px] mx-auto px-6 py-12">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Control Column: Form Deck & Quick Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  Configure Trip
                </h2>
                <div className="space-y-5">
                  <input
                    placeholder="Destination (e.g. Rishikesh)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl border py-4 px-5 text-lg transition-colors
    bg-white text-slate-900 border-slate-300 placeholder-slate-400
    dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Budget (₹)"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full rounded-xl border py-4 px-5 text-lg transition-colors
      bg-white text-slate-900 border-slate-300 placeholder-slate-400
      dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:placeholder-slate-400
      focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      placeholder="Number of Days"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full rounded-xl border py-4 px-5 text-lg transition-colors
      bg-white text-slate-900 border-slate-300 placeholder-slate-400
      dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:placeholder-slate-400
      focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 px-5 text-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm"
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
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium py-4 text-lg rounded-xl shadow-md"
                  />
                </div>
              </div>

              {/* Sidebar Quick References Panel */}
              {itinerary && listings.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hidden lg:block shadow-sm">
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
                        <div
                          key={item.id}
                          onClick={() => openListingInNewTab(item.id)}
                          className="cursor-pointer group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                        >
                          <img
                            src={itemImg}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate group-hover:text-green-600 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Main Column Canvas: Dynamic Responses Panel */}
            <div className="lg:col-span-8">
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
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-10 md:p-14 transition-all">
                  {/* Dynamic Action Bar header containing copy option */}
                  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 gap-4">
                    <div>
                      <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        ✈️ Your Custom Adventure Map
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        Engineered securely via StayLocal AI
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(itinerary);
                        setToast("Itinerary copied successfully!");
                        setTimeout(() => setToast(""), 3000);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-base font-semibold transition-colors shadow-lg shadow-green-600/10"
                    >
                      📋 Copy Itinerary
                    </button>
                  </div>

                  {/* Core Context Badges */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { title: "Destination", value: destination },
                      { title: "Budget Set", value: `₹${budget}` },
                      { title: "Duration", value: `${days} Days` },
                      { title: "Vibe Profile", value: type },
                    ].map((badge, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800"
                      >
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {badge.title}
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-1 text-base capitalize truncate">
                          {badge.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* VISUAL BUDGET & ACCOMMODATION GALLERIES PANEL */}
                  {listings.length > 0 && (
                    <div className="mb-10 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-fade-in">
                      <div className="mb-6">
                        <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          💰 StayLocal Recommendation Breakdown
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Real available properties matching your chosen
                          location profile:
                        </p>
                      </div>

                      {/* Horizontal scroll grid deck for easy exploration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              onClick={() => openListingInNewTab(item.id)}
                              className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                            >
                              <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={displayImg}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";
                                  }}
                                />
                                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                  {item.listingType || "Verified Stay"}
                                </div>
                                <div className="absolute bottom-3 right-3 bg-green-600 text-white font-extrabold text-sm px-3 py-1.5 rounded-lg shadow-sm">
                                  ₹{item.price}/{item.priceUnit || "night"}
                                </div>
                              </div>

                              <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-green-600 transition-colors">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
                                    📍 {item.city}{" "}
                                    {item.state ? `, ${item.state}` : ""}
                                  </p>
                                  <p className="text-base text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                                  <Button
                                    label="Explore Stay"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openListingInNewTab(item.id);
                                    }}
                                  />
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
                            className="text-2xl font-bold text-green-700 dark:text-green-400 mt-8 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 tracking-tight"
                            {...props}
                          />
                        ),
                        h3: ({ ...props }) => (
                          <h3
                            className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3 uppercase tracking-wide opacity-80"
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
                            className="text-lg relative pl-6 flex items-start text-slate-600 dark:text-slate-300 mb-2 leading-relaxed"
                            {...props}
                          >
                            <span className="absolute left-0 top-3 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                            <span className="flex-1">{children}</span>
                          </li>
                        ),
                        strong: ({ ...props }) => (
                          <strong
                            className="font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 px-2 py-0.5 rounded-md text-base"
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
                                    <div className="col-span-2 relative h-56 sm:h-64 overflow-hidden rounded-l-xl">
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

                                    <div className="col-span-1 flex flex-col gap-1.5 h-56 sm:h-64">
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

                                  <div className="p-6 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        {foundListing.listingType ||
                                          "StayLocal Verified Option"}
                                      </span>
                                      <span className="text-sm text-slate-400 font-medium">
                                        📍 {foundListing.city}
                                      </span>
                                    </div>

                                    <h4 className="font-bold text-slate-900 dark:text-white mt-2 text-xl truncate tracking-tight">
                                      {foundListing.title}
                                    </h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                                      {foundListing.description}
                                    </p>

                                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                                      <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                          Estimated Price
                                        </p>
                                        <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                                          ₹{foundListing.price}{" "}
                                          <span className="text-xs font-normal text-slate-400">
                                            /{foundListing.priceUnit}
                                          </span>
                                        </p>
                                      </div>
                                      <Button
                                        label="Explore Listing"
                                        variant="secondary"
                                        onClick={() =>
                                          openListingInNewTab(foundListing.id)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }
                          return (
                            <p className="leading-relaxed mb-4 text-lg text-slate-600 dark:text-slate-300">
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
