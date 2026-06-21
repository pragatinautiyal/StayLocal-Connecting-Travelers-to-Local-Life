import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Input, Button, Toast } from "../components/ui";
import { useState, useEffect } from "react";

export default function Login() {
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Welcome Back
          </h1>

          <p className="text-center text-gray-600 mt-2">
            Login to access your StayLocal account or manage your homestays.
          </p>

          <div className="mt-8 p-6 border rounded-2xl shadow-sm flex flex-col gap-5 bg-white border-gray-200">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Email</label>
              <Input type="email" placeholder="Enter your email" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Password</label>
              <Input type="password" placeholder="Enter your password" />
            </div>

            <Button
              label="Login"
              onClick={() => setToast("Login successful!")}
              className="w-full"
            />

            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <span className="text-green-800 font-medium cursor-pointer">
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
