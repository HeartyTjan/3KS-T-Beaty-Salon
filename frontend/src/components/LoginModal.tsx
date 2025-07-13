import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/40 pt-20" style={{ zIndex: 100 }}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative animate-in slide-in-from-top-4">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="login-password"
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 