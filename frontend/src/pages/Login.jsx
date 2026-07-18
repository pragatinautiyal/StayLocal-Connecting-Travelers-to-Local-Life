import { login } from "../api/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Input, Button, Toast } from "../components/ui";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = async () => {
    if (!email || !password) {
      setToast("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      // Save authentication data
      authLogin(data.user, data.token);

      setToast("Login successful!");

      // Redirect after successful login
      setTimeout(() => {
        if (data.user.role === "host") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error) {
      setToast(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();
      console.log("Google API response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Google login failed");
      }

      // Existing Google user
      if (!data.newUser) {
        authLogin(data.user, data.token);

        if (data.user.role === "host") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }

        return;
      }

      // First time Google user
      navigate("/google-register", {
        state: {
          email: data.email,
          fullName: data.fullName,
          profileImage: data.profileImage,
        },
      });
    } catch (error) {
      setToast(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 text-center">
            Welcome Back
          </h1>

          <p className="text-center text-gray-600 dark:text-slate-400 mt-2">
            Login to access your StayLocal account or manage your homestays.
          </p>

          <div className="mt-8 p-6 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm bg-white dark:bg-slate-800 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
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

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 dark:text-slate-200">
                Password
              </label>

              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              label={loading ? "Logging in..." : "Login"}
              onClick={handleLogin}
              disabled={loading}
              className="w-full"
            />

            <div className="flex items-center my-3">
              <hr className="flex-1" />
              <span className="px-2 text-gray-500">OR</span>
              <hr className="flex-1" />
            </div>

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setToast("Google login failed")}
            />

            <div className="text-center text-sm text-gray-600 dark:text-slate-400">
              Don't have an account?{" "}
              <span
                className="text-green-700 dark:text-green-400 font-medium cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register
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
