import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button, Toast } from "../components/ui";

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function GoogleRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [role, setRole] = useState("traveller");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const userData = location.state;
  console.log("Received state:", userData);

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, []);

  const handleContinue = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/google/complete-registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            fullName: userData.fullName,
            profileImage: userData.profileImage,
            role,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }

      login(data.user, data.token);

      if (data.user.role === "host") {
        navigate("/dashboard");
      } else {
        navigate("/explore");
      }
    } catch (err) {
      setToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navbar />

      <main className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-md p-8 rounded-2xl shadow bg-white dark:bg-slate-800">
          <h1 className="text-3xl font-bold text-center">
            Complete Registration
          </h1>

          <p className="text-center mt-3 text-gray-600 dark:text-gray-400">
            Welcome {userData?.fullName}
          </p>

          <div className="flex justify-center mt-5">
            <img
              src={userData?.profileImage}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full border"
            />
          </div>

          <div className="mt-8">
            <label className="text-sm font-medium">Register As</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-2 border rounded-lg p-2"
            >
              <option value="traveller">Traveller</option>

              <option value="host">Host</option>
            </select>
          </div>

          <Button
            className="w-full mt-6"
            label={loading ? "Creating Account..." : "Continue"}
            disabled={loading}
            onClick={handleContinue}
          />
        </div>
      </main>

      <Toast message={toast} />

      <Footer />
    </div>
  );
}
