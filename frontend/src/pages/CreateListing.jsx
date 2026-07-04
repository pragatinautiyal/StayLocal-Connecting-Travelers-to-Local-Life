import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingForm from "../components/ListingForm";

export default function CreateListing() {
  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Create Listing</h1>

        <ListingForm />
      </div>

      <Footer />
    </>
  );
}
