import { register } from "../api/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Input, Button, Toast } from "../components/ui";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("traveller");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setToast("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setToast("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setToast("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const data = await register({
        fullName,
        email,
        password,
        role,
      });

      setToast(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-slate-100">
            Create Account
          </h1>

          <p className="text-center text-gray-600 dark:text-slate-400 mt-2">
            Join StayLocal as a Traveller or Host.
          </p>

          <div className="mt-8 p-6 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm bg-white dark:bg-slate-800 flex flex-col gap-5">
            <div>
              <label className="text-sm text-gray-700 dark:text-slate-200">
                Full Name
              </label>

              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-slate-200">
                Email
              </label>

              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-slate-200">
                Password
              </label>

              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-slate-200">
                Confirm Password
              </label>

              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-slate-200">
                Register As
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
              >
                <option value="traveller">Traveller</option>
                <option value="host">Host</option>
              </select>
            </div>

            <Button
              label={loading ? "Creating Account..." : "Register"}
              onClick={handleRegister}
              disabled={loading}
              className="w-full"
            />

            <div className="text-center text-sm text-gray-600 dark:text-slate-400">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-green-700 dark:text-green-400 font-medium cursor-pointer"
              >
                Login
              </span>
            </div>
          </div>
        </div>
      </main>

      <Toast message={toast} />

      <Footer />
    </div>
  );
}
