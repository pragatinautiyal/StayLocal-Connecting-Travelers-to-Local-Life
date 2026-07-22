import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ComponentsDemo from "./pages/ComponentsDemo";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleRegister from "./pages/GoogleRegister";
import Settings from "./pages/Settings";
import AiScreen from "./pages/AiScreen";
import HostHome from "./pages/HostHome";

import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";
import ListingDetails from "./pages/ListingDetails";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <div className="w-full min-h-screen overflow-x-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/google-register" element={<GoogleRegister />} />

                  <Route
                    path="/explore"
                    element={
                      <ProtectedRoute allowedRoles={["traveller"]}>
                        <Explore />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["host"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/HostHome"
                    element={
                      <ProtectedRoute allowedRoles={["host"]}>
                        <HostHome />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute allowedRoles={["traveller", "host"]}>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/ai"
                    element={
                      <ProtectedRoute allowedRoles={["traveller"]}>
                        <AiScreen />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/components" element={<ComponentsDemo />} />

                  <Route
                    path="/create-listing"
                    element={
                      <ProtectedRoute allowedRoles={["host"]}>
                        <CreateListing />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/edit-listing/:id"
                    element={
                      <ProtectedRoute allowedRoles={["host"]}>
                        <EditListing />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/my-listings"
                    element={
                      <ProtectedRoute allowedRoles={["host"]}>
                        <MyListings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/listing/:id"
                    element={
                      <ProtectedRoute allowedRoles={["traveller"]}>
                        <ListingDetails />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute allowedRoles={["traveller"]}>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </div>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
