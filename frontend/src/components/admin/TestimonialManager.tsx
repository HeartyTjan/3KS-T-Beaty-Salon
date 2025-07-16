
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, User } from "lucide-react";
import { testimonialAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  image?: string;
  service: string;
  date: string;
}

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rating: "5",
    text: "",
    image: "",
    service: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    testimonialAPI.getAllTestimonials().then(res => {
      const mapped = (res || []).map(t => ({
        id: t.id,
        name: t.userName || t.name || 'Anonymous',
        rating: t.rating,
        text: t.content || t.text,
        image: t.imageUrl || t.image || '',
        service: t.service || '',
        date: t.createdAt ? t.createdAt.split('T')[0] : (t.date || ''),
      }));
      setTestimonials(mapped);
    });
  }, []);

  const services = ["Home Service", "Hair Coloring", "Styling & Cuts", "Dreads & Braids", "Hair Making", "Nail Services"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await testimonialAPI.createTestimonial(
        user?.id || "admin",
        formData.text,
        parseInt(formData.rating)
      );
      toast({ title: 'Testimonial added!', status: 'success' });
      const res = await testimonialAPI.getAllTestimonials();
      const mapped = (res.data || []).map(t => ({
        id: t.id,
        name: t.userName || t.name || 'Anonymous',
        rating: t.rating,
        text: t.content || t.text,
        image: t.imageUrl || t.image || '',
        service: t.service || '',
        date: t.createdAt ? t.createdAt.split('T')[0] : (t.date || ''),
      }));
      setTestimonials(mapped);
      resetForm();
    } catch (err) {
      toast({ title: 'Failed to add testimonial', status: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      rating: "5",
      text: "",
      image: "",
      service: "",
      date: new Date().toISOString().split('T')[0]
    });
    setEditingTestimonial(null);
    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await testimonialAPI.deleteTestimonial(id, user?.id || "admin");
      toast({ title: 'Testimonial deleted!', status: 'success' });
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      toast({ title: 'Failed to delete testimonial', status: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonial Management</h2>
      </div>

      {/* Testimonial Form */}
      {isFormOpen && (
        <Card className="vintage-shadow">
          <CardHeader>
            <CardTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Sarah M."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text">Testimonial Text</Label>
                <textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  placeholder="Share the customer's experience..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service Used</Label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Customer Photo URL (Optional)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/customer-photo.jpg"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="brand-gradient text-white">
                  {editingTestimonial ? "Update Testimonial" : "Add Testimonial"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{testimonial.service}</Badge>
                    <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 italic">
                "{testimonial.text}"
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(testimonial.id)}
                  className="flex items-center gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialManager;
