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
        className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700"
      >
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-white">
            Listing Title
          </label>

          <Input
            placeholder="e.g. Little Buddha Café"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-white">
            Description
          </label>

          <textarea
            rows={5}
            placeholder="Describe your listing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-3 dark:bg-slate-700 dark:text-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-white">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-3 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Select Category</option>
            <option value="Stay">Stay</option>
            <option value="Cafe">Cafe</option>
            <option value="Rental">Rental</option>
            <option value="Workshop">Workshop</option>
            <option value="Experience">Experience</option>
            <option value="Food & Drink">Food & Drink</option>
          </select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-white">
            Listing Type
          </label>

          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-3 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Select Listing Type</option>
            <option value="Homestay">Homestay</option>
            <option value="Service">Service</option>
          </select>
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-white">
              City
            </label>

            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-white">
              State
            </label>

            <Input
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-white">
            Full Address
          </label>

          <Input
            placeholder="Complete address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-white">
              Price (₹)
            </label>

            <Input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-white">
              Price Unit
            </label>

            <select
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-3 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select Price Unit</option>
              <option value="Per Night">Per Night</option>
              <option value="Per Day">Per Day</option>
              <option value="Per Hour">Per Hour</option>
              <option value="Per Person">Per Person</option>
              <option value="Per Ticket">Per Ticket</option>
              <option value="Fixed Price">Fixed Price</option>
              <option value="Free">Free</option>
            </select>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-white">
            Listing Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-700 dark:text-white"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
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
