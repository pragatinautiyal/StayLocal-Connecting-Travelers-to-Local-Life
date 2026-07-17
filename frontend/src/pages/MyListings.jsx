import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui";
import { getMyListings, deleteListing } from "../api/listing";
import { useNavigate } from "react-router-dom";

export default function MyListings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    try {
      const data = await getMyListings();
      setListings(data.listings);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this listing?")) return;

    try {
      await deleteListing(id);
      loadListings();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Listings</h1>

          <Button
            label="Create Listing"
            onClick={() => navigate("/create-listing")}
          />
        </div>

        {listings.length === 0 ? (
          <p>No listings yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="border rounded-xl p-4 shadow">
                <img
                  src={listing.images?.[0]}
                  alt={listing.title}
                  className="h-52 w-full object-cover rounded"
                />

                <h2 className="font-bold text-xl mt-4">{listing.title}</h2>

                <p className="text-gray-500">{listing.listingType}</p>

                <p className="text-sm text-gray-600 mt-1">
                  {listing.city}, {listing.state}
                </p>

                <p className="font-semibold mt-2">
                  ₹{listing.price} / {listing.priceUnit}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Category: {listing.category}
                </p>

                <div className="flex gap-3 mt-5">
                  <Button
                    label="Edit"
                    onClick={() => navigate(`/edit-listing/${listing.id}`)}
                  />

                  <Button
                    label="Delete"
                    onClick={() => handleDelete(listing.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
