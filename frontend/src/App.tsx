import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./components/admin/AdminLogin";
import Booking from "./pages/Booking";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from './components/Header';
import ProfileDashboard from './pages/dashboard/ProfileDashboard';
import BookingDashboard from './pages/dashboard/BookingDashboard';
import { useEffect, useState } from "react";
import axios from "axios";

const queryClient = new QueryClient();

// Route wrapper for /admin that handles login and redirect
const AdminLoginRoute = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    await login(email, password);
    navigate("/admin");
  };

  return <AdminLogin onLogin={handleLogin} />;
};

const AppContent = () => {
  const { isLoading } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Show loading state during initial authentication check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/verify-email" element={
          <ProtectedRoute requireAuth={false}>
            <EmailVerification />
          </ProtectedRoute>
        } />
            <Route path="/admin" element={<Admin />} />
        <Route path="/booking" element={
          // <ProtectedRoute requireAuth={false}>
            <Booking />
          // </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute requireAuth={true}>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={<ProtectedRoute requireAuth={true}><ProfileDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/bookings" element={<ProtectedRoute requireAuth={true}><BookingDashboard /></ProtectedRoute>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
