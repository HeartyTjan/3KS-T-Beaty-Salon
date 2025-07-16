
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
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ServiceManager from './ServiceManager';
import ProductManager from './ProductManager';
import TestimonialManager from './TestimonialManager';
import MediaManager from './MediaManager';
import UserMenu from '../UserMenu';

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

  // Mobile section nav (only on mobile)
  const SectionNavMobile = ({ sections, activeSection, onSectionChange }) => (
    <div className="flex flex-col gap-2 mb-6 md:hidden">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            className={
              activeSection === section.id
                ? `${section.color} text-white`
                : ""
            }
            onClick={() => onSectionChange(section.id)}
          >
            <Icon className="w-4 h-4 mr-2" />
            {section.name}
          </Button>
        );
      })}
    </div>
  );

  const [stats, setStats] = useState({
    services: 0,
    products: 0,
    testimonials: 0,
    media: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [servicesRes, productsRes, testimonialsRes, mediaRes] = await Promise.all([
          api.get('/services/count'),
          api.get('/products/count'),
          api.get('/testimonials/count'),
          api.get('/media/count'),
        ]);
        setStats({
          services: servicesRes.data.count,
          products: productsRes.data.count,
          testimonials: testimonialsRes.data.count,
          media: mediaRes.data.count,
        });
      } catch (err) {
      }
    }
    fetchStats();
  }, []);

  const statsArray = [
    { label: "Active Services", value: stats.services, color: "text-green-600" },
    { label: "Products", value: stats.products, color: "text-purple-600" },
    { label: "Testimonials", value: stats.testimonials, color: "text-orange-600" },
    { label: "Media Files", value: stats.media, color: "text-pink-600" },
  ];

  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Hamburger menu button for mobile (no extra margin)
  const MobileMenuButton = () => (
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="md:hidden bg-white rounded-full shadow p-2 border border-gray-200"
      aria-label="Open menu"
    >
      {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );

  // Toggleable section nav for mobile - now as a side drawer
  const SectionNavMobileToggle = () => (
    menuOpen ? (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className="fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-lg flex flex-col gap-2 p-4 transition-transform duration-300 md:hidden"
          style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                className={
                  activeSection === section.id
                    ? `${section.color} text-white`
                    : ""
                }
                onClick={() => {
                  onSectionChange(section.id);
                  setMenuOpen(false);
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.name}
              </Button>
            );
          })}
        </div>
      </>
    ) : null
  );

  return (
    <div className="min-h-screen bg-muted/30 relative">
      {/* Admin dashboard header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md fixed top-0 left-0 w-full z-40">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center">
          <MobileMenuButton />
          <span className="font-bold text-xl text-primary ml-2">3KS&T</span>
        </div>
        {/* Right: User info/menu */}
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
      <div className="pt-16"> {/* Add padding to push content below fixed header */}
        <SectionNavMobileToggle />
        {/* Desktop section nav (hidden on mobile) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsArray.map((stat, index) => (
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
          {activeSection === "services" && <ServiceManager />}
          {activeSection === "products" && <ProductManager />}
          {activeSection === "testimonials" && <TestimonialManager />}
          {activeSection === "media" && <MediaManager />}

          {/* Admin Management (Super Admin Only) - only show in overview */}
          {activeSection === 'overview' && user?.role === 'SUPER_ADMIN' && (
            <div className="mt-8 p-6 bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-4">Admin Management (Super Admin Only)</h2>
              <form onSubmit={handleAddAdmin} className="flex items-center gap-2 mb-4">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  placeholder="Admin email"
                  className="border rounded px-2 h-9 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-2 h-9 rounded flex items-center justify-center text-sm flex-shrink-0"
                  style={{ minWidth: '80px' }}
                  disabled={adding}
                >
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
    </div>
  );
};

export default AdminDashboard;
