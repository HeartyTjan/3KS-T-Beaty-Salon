import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Scissors, ShoppingBag, MessageSquare, Images } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Admin section tabs
  const adminSections = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "services", name: "Services", icon: Scissors },
    { id: "products", name: "Products", icon: ShoppingBag },
    { id: "testimonials", name: "Testimonials", icon: MessageSquare },
    { id: "media", name: "Media", icon: Images },
  ];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  // Get current section from query param
  const params = new URLSearchParams(location.search);
  const currentSection = params.get('section') || 'overview';

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center w-full">
        <div className="font-bold text-xl text-primary cursor-pointer mr-8 ml-100" onClick={() => window.location.href = '/'}>
          3KS&T
        </div>
        {/* Admin Tabs Navigation - centered */}
        {isAdminRoute && isAdmin && (
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex flex-wrap gap-2">
              {adminSections.map((section) => {
                const Icon = section.icon;
                const isActive = currentSection === section.id;
                return (
                  <button
                    key={section.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded ${isActive ? 'bg-green-600 text-white' : 'bg-muted text-foreground'} font-semibold`}
                    onClick={() => navigate(`/admin?section=${section.id}`)}
                  >
                    <Icon className="w-4 h-4" />
                    {section.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 ml-auto">
          {!isAuthenticated ? (
            <>
              <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
            </>
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 