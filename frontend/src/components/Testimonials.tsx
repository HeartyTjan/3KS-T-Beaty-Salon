
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { testimonialAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from '@/hooks/use-toast';

const Testimonials = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ content: "", rating: 5 });
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    testimonialAPI.getAllTestimonials().then(res => {
      console.log(res);
      const mapped = (res || []).map(t => ({
        id: t.id,
        name: t.userName || t.name || 'Anonymous',
        rating: t.rating,
        text: t.content || t.text,
        image: t.imageUrl || t.image || '',
        service: t.service || '',
        date: t.createdAt ? t.createdAt.split('T')[0] : (t.date || ''),
        location: t.location || '',
      }));
      setTestimonials(mapped);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await testimonialAPI.createTestimonial(user.id, user.firstName + ' ' + user.lastName, form.content, form.rating);
      toast({ title: 'Thank you for your testimonial!', status: 'success' });
      setForm({ content: "", rating: 5 });
    } catch (err) {
      toast({ title: 'Failed to submit testimonial', status: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Testimonial Submission Form */}
        <div className="mb-12">
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">
              <textarea
                className="flex-1 border rounded p-2 min-h-[60px]"
                placeholder="Share your experience..."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                required
                disabled={submitting}
              />
              <select
                className="border rounded p-2"
                value={form.rating}
                onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
                disabled={submitting}
              >
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <button
                type="submit"
                className="brand-gradient text-white px-6 py-2 rounded font-bold disabled:opacity-60"
                disabled={submitting || !form.content.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Testimonial'}
              </button>
            </form>
          ) : (
            <div className="text-center text-muted-foreground">
              <span className="font-semibold">Log in to share your experience!</span>
            </div>
          )}
        </div>

        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Client Reviews
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            What Our Family
            <span className="text-transparent bg-clip-text brand-gradient block">
              Says About Us
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it - hear from our amazing clients across Africa 
            who have experienced the 3KS&T difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-lift bg-card border-border h-full">
              <CardContent className="p-6 flex flex-col h-full">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-foreground mb-6 flex-grow">
                  "{testimonial.text}"
                </blockquote>
                
                {/* Client Info */}
                <div className="flex items-center gap-4">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-primary">
                      {testimonial.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {testimonial.service}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-card rounded-3xl vintage-shadow">
          <h3 className="text-2xl font-bold mb-4">Join Our Happy Family</h3>
          <p className="text-muted-foreground mb-6">
            Experience the 3KS&T difference and become part of our growing family of satisfied clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              500+ Happy Clients
            </Badge>
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              5.0 Average Rating
            </Badge>
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              100% Eco-Friendly
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
