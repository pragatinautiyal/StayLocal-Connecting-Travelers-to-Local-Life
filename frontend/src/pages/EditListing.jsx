import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingForm from "../components/ListingForm";
import { useParams } from "react-router-dom";

export default function EditListing() {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Edit Listing #{id}</h1>

        <ListingForm listingId={id} />
      </div>

      <Footer />
    </>
  );
}
