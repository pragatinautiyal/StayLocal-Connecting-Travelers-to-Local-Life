import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
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

          <div className="mt-8 p-6 border rounded-2xl shadow-sm">
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 mb-4 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-700"
            />

            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-700"
            />

            <button className="w-full mt-6 bg-green-800 text-white py-3 rounded-full hover:bg-green-900 transition">
              Login
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
              Don’t have an account?{" "}
              <span className="text-green-800 font-medium cursor-pointer">
                Register
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
