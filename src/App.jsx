import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "./services/productService"; // Import your data service
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen"; 

export const OWNER_PHONE = "601234567890";

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

  useEffect(() => {
    async function initializeAppData() {
      try {
        // ─── WAITING FOR FIREBASE ───
        // This will wait until getProducts() completely finishes fetching from Firebase
        await getProducts(); 
        
        // Add a small artificial delay (800ms) for a smoother GSAP transition
        setTimeout(() => {
          setIsAppLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        // Even if it fails, we show the app so it doesn't stay stuck on loading
        setIsAppLoading(false);
      }
    }

    initializeAppData();
  }, []);

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

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
    </BrowserRouter>
  );
}