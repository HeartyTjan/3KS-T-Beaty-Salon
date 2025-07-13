import React, { useState, useEffect } from "react";
import { authAPI, mediaAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'react-router-dom';

export default function ProfileDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSection, setEditingSection] = useState(null); // 'personal' | 'address' | null
  const { toast } = useToast ? useToast() : { toast: () => {} };
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await authAPI.getCurrentUser();
        console.log(res);
        setProfile(res);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('changePassword') === '1') {
      setShowChangePassword(true);
    }
  }, [location.search]);

  console.log(profile);
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  // if (error) {
  //   return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  // }

  const handleChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSave = async () => {
    try {
      await authAPI.updateUser(profile.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        country: profile.country,
        city: profile.city,
        email: profile.email,
      });
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
      setEditingSection(null);
    } catch (err) {
      toast({ title: 'Update failed', description: 'Could not save changes.', variant: 'destructive' });
    }
  };
  const handleCancel = () => {
    setProfile(null);
    setEditingSection(null);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setChangingPassword(true);
    try {
      await authAPI.changePassword(profile.id, oldPassword, newPassword);
      toast({ title: 'Password changed', description: 'Your password was updated.' });
      setShowChangePassword(false);
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      toast({ title: 'Change failed', description: 'Old password is incorrect.', variant: 'destructive' });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-sm text-gray-700">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-md hidden md:block">
        <div className="p-4 text-lg font-semibold border-b">3KS&T</div>
        <div className="flex flex-col items-center gap-2 py-6 border-b">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {getInitials(profile?.firstName, profile?.lastName)}
          </div>
          <div className="text-center">
            <div className="font-medium">
              {profile?.firstName} {profile?.lastName}
            </div>
            <div className="text-xs text-gray-500">{profile?.email}</div>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem to="/dashboard/profile" active={true} danger={false}>My Profile</NavItem>
          <NavItem to="/dashboard/bookings" active={false} danger={false}>My Bookings</NavItem>
          <NavItem active={false} danger={false} onClick={() => setShowChangePassword(true)}>Change Password</NavItem>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="h-14 bg-green-900 flex items-center justify-between px-4 text-white">
          <input
            type="search"
            placeholder="Search"
            className="w-72 px-3 py-1 rounded focus:outline-none text-gray-800"
          />
          <div className="flex items-center gap-4">
            <span className="hidden sm:block">Tuesday, 18 July</span>
            <button className="relative">
              <BellIcon />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="flex items-center gap-1">
              {profile?.firstName}
              <ChevronDownIcon />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 space-y-6">
          {/* Summary card */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              {getInitials(profile?.firstName, profile?.lastName)}
            </div>
            <div className="flex-1">
              <div className="text-xl font-semibold">
                {profile?.firstName} {profile?.lastName}
              </div>
              <div className="text-sm text-gray-500">{profile?.role}</div>
              <div className="text-sm text-gray-500">{profile?.location}</div>
            </div>
          </div>

          {/* Personal information */}
          <SectionCard
            title="Personal Information"
            onEdit={() => setEditingSection("personal")}
            isEditing={editingSection === "personal"}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="First Name"
                name="firstName"
                value={profile?.firstName}
                editing={editingSection === "personal"}
                onChange={handleChange}
                disabled={false}
              />
              <Field
                label="Last Name"
                name="lastName"
                value={profile?.lastName}
                editing={editingSection === "personal"}
                onChange={handleChange}
                disabled={false}
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                value={profile?.email}
                editing={editingSection === "personal"}
                onChange={handleChange}
                disabled={true}
              />
              <Field
                label="Phone Number"
                name="phone"
                value={profile?.phone}
                editing={editingSection === "personal"}
                onChange={handleChange}
                disabled={false}
              />
            </div>
            {editingSection === "personal" && (
              <EditActions onSave={handleSave} onCancel={handleCancel} />
            )}
          </SectionCard>

          {/* Address information */}
          <SectionCard
            title="Address"
            onEdit={() => setEditingSection("address")}
            isEditing={editingSection === "address"}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="Country"
                name="country"
                value={profile?.country}
                editing={editingSection === "address"}
                onChange={handleChange}
                disabled={false}
              />
              <Field
                label="City"
                name="city"
                value={profile?.city}
                editing={editingSection === "address"}
                onChange={handleChange}
                disabled={false}
              />
            </div>
            {editingSection === "address" && (
              <EditActions onSave={handleSave} onCancel={handleCancel} />
            )}
          </SectionCard>
        </main>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white rounded-lg shadow p-8 w-full max-w-md space-y-4" onSubmit={handleChangePassword}>
            <h2 className="text-lg font-bold mb-2">Change Password</h2>
            <div>
              <label className="block text-sm mb-1">Old Password</label>
              <input type="password" className="w-full border rounded px-2 py-1" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input type="password" className="w-full border rounded px-2 py-1" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm New Password</label>
              <input type="password" className="w-full border rounded px-2 py-1" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700" disabled={changingPassword}>{changingPassword ? 'Changing...' : 'Change Password'}</button>
              <button type="button" className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400" onClick={() => setShowChangePassword(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Reusable components
function NavItem({ children, active, danger, onClick, to }) {
  const base = "block px-3 py-2 rounded hover:bg-gray-100";
  const activeCls = active ? "bg-gray-100 font-medium" : "";
  const dangerCls = danger ? "text-red-600" : "";
  if (to) {
    return <Link to={to} className={`${base} ${activeCls} ${dangerCls}`}>{children}</Link>;
  }
  return <a href="#" className={`${base} ${activeCls} ${dangerCls}`} onClick={onClick}>{children}</a>;
}

function SectionCard({ title, children, onEdit, isEditing }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="text-sm text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded flex items-center gap-1"
          >
            Edit
            <PencilIcon />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, name, value, editing, onChange, type = "text", disabled }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-500">{label}</div>
      {editing && !disabled ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded px-2 py-1 focus:outline-none focus:ring"
        />
      ) : (
        <div className="font-medium">{value}</div>
      )}
    </div>
  );
}

function EditActions({ onSave, onCancel }) {
  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={onSave}
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  );
}

// Icon placeholders – replace with lucide-react or your preferred icon set
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 24c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2zM18 16v-5c0-2.757-1.794-5.064-4.248-5.824C13.593 3.3 12.87 2.5 12 2.5s-1.593.8-1.752 2.676C7.794 5.936 6 8.243 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M7 10l5 5 5-5H7z" />
  </svg>
);
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
  </svg>
);

function getInitials(firstName, lastName) {
  if (!firstName || !lastName) return "N/A";
  return firstName.substring(0, 1).toUpperCase() + lastName.substring(0, 1).toUpperCase();
}
