import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createListing, updateListing, getListing } from "../api/listing";
import { Input, Toast } from "./ui";

export default function ListingForm({ listingId }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [listingType, setListingType] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");

  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("");

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!listingId) return;

    async function loadListing() {
      try {
        const listing = await getListing(listingId);

        setTitle(listing.title);
        setDescription(listing.description);

        setCategory(listing.category);
        setListingType(listing.listingType);

        setCity(listing.city);
        setState(listing.state);
        setAddress(listing.address);

        setPrice(listing.price);
        setPriceUnit(listing.priceUnit);
      } catch (err) {
        setToast(err.message);
      }
    }

    loadListing();
  }, [listingId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !category ||
      !listingType ||
      !city ||
      !state ||
      !address ||
      !price ||
      !priceUnit ||
      (!listingId && !image)
    ) {
      setToast("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setToast("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      formData.append("category", category);
      formData.append("listingType", listingType);

      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);

      formData.append("price", Number(price));
      formData.append("priceUnit", priceUnit);

      if (image) {
        formData.append("image", image);
      }

      if (listingId) {
        await updateListing(listingId, formData);
      } else {
        await createListing(formData);
      }

      setToast(
        listingId
          ? "Listing updated successfully!"
          : "Listing created successfully!",
      );

      setTimeout(() => {
        navigate("/my-listings");
      }, 1200);
    } catch (err) {
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
          placeholder="Listing Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows={4}
          placeholder="Description"
          className="w-full border rounded-lg p-3 dark:bg-slate-700 dark:text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="Stay">Stay</option>
          <option value="Food & Drink">Food & Drink</option>
          <option value="Experience">Experience</option>
          <option value="Workshop">Workshop</option>
          <option value="Shopping">Shopping</option>
          <option value="Event">Event</option>
          <option value="Wellness">Wellness</option>
        </select>

        <Input
          placeholder="Listing Type (e.g. Homestay, Cafe, Pottery Workshop)"
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
        />

        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <Input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <Input
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          value={priceUnit}
          onChange={(e) => setPriceUnit(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Price Unit</option>
          <option value="Per Night">Per Night</option>
          <option value="Per Person">Per Person</option>
          <option value="Per Ticket">Per Ticket</option>
          <option value="Average Spend">Average Spend</option>
          <option value="Starting From">Starting From</option>
          <option value="Free">Free</option>
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
