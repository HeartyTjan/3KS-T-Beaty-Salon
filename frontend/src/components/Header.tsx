import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="font-bold text-xl text-primary cursor-pointer" onClick={() => window.location.href = '/'}>
        3KS&T
      </div>
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            {/* <button
              className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button> */}
            <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
          </>
        ) : (
          <UserMenu />
        )}
      </div>
    </header>
  );
};

export default Header; 