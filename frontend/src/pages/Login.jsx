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

              <Input type="email" placeholder="Enter your email" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 dark:text-slate-200">
                Password
              </label>

              <Input type="password" placeholder="Enter your password" />
            </div>

            <Button
              label="Login"
              onClick={() => setToast("Login successful!")}
              className="w-full"
            />

            <div className="text-center text-sm text-gray-600 dark:text-slate-400">
              Don’t have an account?{" "}
              <span className="text-green-700 dark:text-green-400 font-medium cursor-pointer">
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
