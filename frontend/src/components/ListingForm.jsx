import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createListing, updateListing, getListing } from "../api/listing";
import { Input, Toast } from "./ui";

export default function ListingForm({ listingId }) {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [season, setSeason] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!listingId) return;

    async function loadListing() {
      try {
        const listing = await getListing(listingId);

        setId(listing.id);
        setTitle(listing.title);
        setDescription(listing.description);
        setLocation(listing.location);
        setPrice(listing.price);
        setCategory(listing.category);
        setSeason(listing.season);
      } catch (err) {
        setToast(err.message);
      }
    }

    loadListing();
  }, [listingId]);
  async function handleSubmit(e) {
    e.preventDefault();

    console.log("🚀 Submit triggered");

    // Better debugging
    const fields = {
      id,
      title,
      description,
      location,
      price,
      category,
      season,
      image,
    };
    console.log("📦 Form data:", fields);

    if (
      !id ||
      !title ||
      !description ||
      !location ||
      !price ||
      !category ||
      !season ||
      (!listingId && !image)
    ) {
      setToast("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setToast("");

      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("price", Number(price)); // important fix
      formData.append("category", category);
      formData.append("season", season);
      if (image) {
        formData.append("image", image);
      }

      console.log("📤 Sending request...");

      if (listingId) {
        await updateListing(listingId, formData);
      } else {
        await createListing(formData);
      }

      console.log("✅ Listing created");

      setToast(
        listingId
          ? "Listing updated successfully!"
          : "Listing created successfully!",
      );

      setTimeout(() => {
        navigate("/my-listings");
      }, 1200);
    } catch (err) {
      console.error("🔥 API Error:", err);
      setToast(err?.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white dark:bg-slate-800 p-8 rounded-xl shadow"
      >
        <Input
          placeholder="Listing ID"
          value={id}
          disabled={!!listingId}
          onChange={(e) => setId(e.target.value)}
        />
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          rows={4}
          className="w-full border rounded-lg p-3 dark:bg-slate-700 dark:text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price per night"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="Adventure">Adventure</option>
          <option value="Nature">Nature</option>
          <option value="Cultural">Cultural</option>
          <option value="Luxury">Luxury</option>
          <option value="Budget">Budget</option>
        </select>

        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Season</option>
          <option value="Summer">Summer</option>
          <option value="Winter">Winter</option>
          <option value="Monsoon">Monsoon</option>
          <option value="Spring">Spring</option>
          <option value="Autumn">Autumn</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading
            ? listingId
              ? "Updating..."
              : "Creating..."
            : listingId
              ? "Update Listing"
              : "Create Listing"}
        </button>
      </form>

      <Toast message={toast} />
    </>
  );
}
