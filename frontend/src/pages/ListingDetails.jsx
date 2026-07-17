import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader } from "../components/ui";

export default function ListingDetails() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!listing) {
    return <h2>Listing not found</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        <img
          src={listing.images?.[0]}
          className="w-full h-96 object-cover rounded-xl"
        />

        <h1 className="text-3xl font-bold mt-6">{listing.title}</h1>

        <p className="text-gray-500">{listing.listingType}</p>

        <p className="mt-3">
          📍 {listing.city}, {listing.state}
        </p>

        <p className="mt-5">{listing.description}</p>

        <div className="mt-5 text-xl font-bold text-green-700">
          ₹{listing.price} / {listing.priceUnit}
        </div>

        <div className="mt-5">
          <span className="bg-green-100 px-3 py-1 rounded-full">
            {listing.category}
          </span>
        </div>
      </div>

      <Footer />
    </>
  );
}
