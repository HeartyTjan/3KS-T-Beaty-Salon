
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
  const initialSection = searchParams.get('section') || "overview";
  const [activeSection, setActiveSection] = useState(initialSection);
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
      setActiveSection(sectionParam);
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
    setActiveSection("overview");
    setSearchParams({ section: "overview" });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "services":
        return <ServiceManager />;
      case "products":
        return <ProductManager />;
      case "testimonials":
        return <TestimonialManager />;
      case "media":
        return <MediaManager />;
      default:
        return (
          <AdminDashboard 
            onLogout={handleLogout}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            user={user}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onLogin={handleLogin}
        isLoading={isLoading}
        error={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header with UserMenu */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {activeSection !== "overview" && (
                <button
                  onClick={() => setActiveSection("overview")}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  ← Back to Dashboard
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Debug info */}
              <div className="text-sm text-gray-500">
                User: {user?.firstName || user?.email || 'No user'} | Section: {activeSection}
              </div>
              {/* Shared UserMenu dropdown */}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPortal;
