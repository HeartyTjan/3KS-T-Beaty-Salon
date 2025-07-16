
import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ServiceManager from "./ServiceManager";
import ProductManager from "./ProductManager";
import TestimonialManager from "./TestimonialManager";
import MediaManager from "./MediaManager";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu'; 

const AdminPortal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('section') || "overview";
  const [loginError, setLoginError] = useState("");
  const { login: contextLogin, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      await contextLogin(username, password);
      setLoginError("");
    } catch (error) {
      setLoginError(error.message || "Invalid username or password");
    }
  };

  // Sync section from query param on mount and when it changes
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam && sectionParam !== activeSection) {
      setSearchParams({ section: activeSection });
    }
    // eslint-disable-next-line
  }, [searchParams]);

  // Update query param when section changes
  useEffect(() => {
    if (activeSection !== searchParams.get('section')) {
      setSearchParams({ section: activeSection });
    }
    // eslint-disable-next-line
  }, [activeSection]);

  const handleLogout = () => {
    setSearchParams({ section: "overview" });
  };

  const handleSectionChange = (section: string) => setSearchParams({ section });

  const renderContent = () => {
    // Always render AdminDashboard for all sections so the hamburger/nav is always present
    return (
      <AdminDashboard 
        onLogout={handleLogout}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        user={user}
      />
    );
  };

  // Only allow ADMIN or SUPER_ADMIN
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  if (!isAuthenticated || !isAdmin) {
    return (
      <AdminLogin 
        onLogin={handleLogin}
        isLoading={isLoading}
        error={!isAuthenticated ? loginError : "You must be an admin to access this page."}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPortal;
