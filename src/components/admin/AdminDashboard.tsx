
import { useEffect, useState, useRef } from 'react';
import { serviceAPI } from '@/lib/api';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Scissors, 
  ShoppingBag, 
  MessageSquare, 
  Images, 
  Users,
  LogOut,
  Plus,
  Eye,
  User,
  Calendar,
  ChevronDown
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface AdminDashboardProps {
  onLogout: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any; // Assuming user object has at least 'role' property
}

const AdminDashboard = ({ onLogout, activeSection, onSectionChange, user }: AdminDashboardProps) => {
  const sections = [
    { id: "overview", name: "Overview", icon: LayoutDashboard, color: "bg-blue-500" },
    { id: "services", name: "Services", icon: Scissors, color: "bg-green-500" },
    { id: "products", name: "Products", icon: ShoppingBag, color: "bg-purple-500" },
    { id: "testimonials", name: "Testimonials", icon: MessageSquare, color: "bg-orange-500" },
    { id: "media", name: "Media", icon: Images, color: "bg-pink-500" },
  ];

  const stats = [
    { label: "Active Services", value: "6", color: "text-green-600" },
    { label: "Products", value: "12", color: "text-purple-600" },
    { label: "Testimonials", value: "25", color: "text-orange-600" },
    { label: "Media Files", value: "48", color: "text-pink-600" },
  ];

  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/dashboard/profile');
  };

  const handleBookingsClick = () => {
    setShowUserMenu(false);
    navigate('/dashboard/bookings');
  };

  // Fetch all admins (SUPER_ADMIN only)
  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      setLoadingAdmins(true);
      api.get('/users')
        .then(res => {

          setAdmins(res.data.filter(u => u.role === 'ADMIN'));
        })
        .catch(() => toast.error('Failed to load admins'))
        .finally(() => setLoadingAdmins(false));
    }
  }, [user]);


  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post('/users/admins', { email: newAdminEmail });
      toast.success('Admin created! Password was logged to server.');
      setAdmins(prev => [...prev, { email: newAdminEmail, role: 'ADMIN' }]);
      setNewAdminEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add admin');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdmin = async (id) => {
    setRemovingId(id);
    try {
      await api.delete(`/users/admins/${id}`);
      toast.success('Admin removed');
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove admin');
    } finally {
      setRemovingId('');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sticky Top Navigation Bar - always visible */}
      <div className="sticky top-0 z-30 bg-white border-b-4 border-red-500 py-2 mb-8">
        <div className="flex flex-wrap gap-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                onClick={() => onSectionChange(section.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {section.name}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="vintage-shadow">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    className="brand-gradient text-white flex items-center gap-2 h-12"
                    onClick={() => onSectionChange("services")}
                  >
                    <Plus className="w-4 h-4" />
                    Add Service
                  </Button>
                  <Button 
                    className="brand-gradient text-white flex items-center gap-2 h-12"
                    onClick={() => onSectionChange("products")}
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                  <Button 
                    className="brand-gradient text-white flex items-center gap-2 h-12"
                    onClick={() => onSectionChange("testimonials")}
                  >
                    <Plus className="w-4 h-4" />
                    Add Testimonial
                  </Button>
                  <Button 
                    className="brand-gradient text-white flex items-center gap-2 h-12"
                    onClick={() => onSectionChange("media")}
                  >
                    <Plus className="w-4 h-4" />
                    Upload Media
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="vintage-shadow">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">New testimonial added from Sarah M.</span>
                    <Badge variant="secondary" className="ml-auto">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Hair Coloring service updated</span>
                    <Badge variant="secondary" className="ml-auto">5 hours ago</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">New product added: Eco Hair Oil</span>
                    <Badge variant="secondary" className="ml-auto">1 day ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeSection === "services" && (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Services Management</h2>
            <p className="text-muted-foreground">Manage your services here.</p>
          </div>
        )}
        {activeSection === "products" && (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Products Management</h2>
            <p className="text-muted-foreground">Manage your products here.</p>
          </div>
        )}
        {activeSection === "testimonials" && (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Testimonials Management</h2>
            <p className="text-muted-foreground">Manage your testimonials here.</p>
          </div>
        )}
        {activeSection === "media" && (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Media Management</h2>
            <p className="text-muted-foreground">Manage your media files here.</p>
          </div>
        )}

        {user?.role === 'SUPER_ADMIN' && (
          <div className="mt-8 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Admin Management (Super Admin Only)</h2>
            <form onSubmit={handleAddAdmin} className="flex gap-2 mb-4">
              <input
                type="email"
                value={newAdminEmail}
                onChange={e => setNewAdminEmail(e.target.value)}
                placeholder="Admin email"
                className="border rounded px-3 py-1"
                required
              />
              <button type="submit" className="bg-primary text-white px-4 py-1 rounded" disabled={adding}>
                {adding ? 'Adding...' : 'Add Admin'}
              </button>
            </form>
            <div>
              {loadingAdmins ? (
                <div>Loading admins...</div>
              ) : (
                <table className="w-full text-left border">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Email</th>
                      <th className="p-2 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(a => (
                      <tr key={a.email}>
                        <td className="p-2 border-b">{a.email}</td>
                        <td className="p-2 border-b">
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => handleRemoveAdmin(a.id)}
                            disabled={removingId === a.id}
                          >
                            {removingId === a.id ? 'Removing...' : 'Remove'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
