import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";

import { getProducts } from "./services/productService";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Lazy load pages (faster loading)
const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// Owner WhatsApp number (Indian format)
export const OWNER_PHONE = "919876543210";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F5] text-[#18181B]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);



  // 🔥 Initial data preload (Firebase optimization)
  useEffect(() => {
    let isMounted = true;

    async function initializeAppData() {
      try {
        await getProducts();

        // small delay for smooth transition
        setTimeout(() => {
          if (isMounted) setIsAppLoading(false);
        }, 500);

      } catch (error) {
        console.error("Error fetching initial data:", error);
        if (isMounted) setIsAppLoading(false);
      }
    }

    initializeAppData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Global loading screen
  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>

          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}