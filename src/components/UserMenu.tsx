import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/50 transition"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="font-semibold text-primary">
          {user?.firstName || user?.email || 'User'}
        </span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 animate-in fade-in">
          {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <button
              className="block w-full text-left px-4 py-2 hover:bg-primary/10 text-blue-700 font-semibold"
              onClick={() => {
                setOpen(false);
                navigate('/admin');
              }}
            >
              Admin Dashboard
            </button>
          )}
          <button
            className="block w-full text-left px-4 py-2 hover:bg-primary/10 text-gray-800"
            onClick={() => {
              setOpen(false);
              navigate('/dashboard/profile');
            }}
          >
            Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-primary/10 text-gray-800"
            onClick={() => {
              setOpen(false);
              navigate('/dashboard/bookings');
            }}
          >
            My Bookings
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-primary/10 text-gray-800"
            onClick={() => {
              setOpen(false);
              navigate('/dashboard/profile?changePassword=1');
            }}
          >
            Change Password
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 