
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Amara Johnson",
      location: "Lagos, Nigeria",
      service: "Home Service Hair Styling",
      rating: 5,
      text: "3KS&T truly treats you like family! Their home service was exceptional - professional, friendly, and my hair has never looked better. The eco-friendly products they use are amazing!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Kemi Adebayo",
      location: "Accra, Ghana",
      service: "Hair Coloring & Styling",
      rating: 5,
      text: "The color transformation was incredible! The team is so talented and they really listen to what you want. The vintage-modern vibe of their service is exactly what I was looking for.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "David Okafor",
      location: "Nairobi, Kenya",
      service: "Dreadlock Maintenance",
      rating: 5,
      text: "As a guy, I was impressed by how welcoming and professional they are. My locs look amazing and the maintenance tips they gave me were spot on. Definitely recommend!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Fatima Al-Hassan",
      location: "Cairo, Egypt",
      service: "Nail Art & Hair Extensions",
      rating: 5,
      text: "The attention to detail is incredible! Both my nails and hair extensions look so natural and beautiful. The eco-friendly approach aligns perfectly with my values.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Grace Mwangi",
      location: "Johannesburg, South Africa",
      service: "Complete Hair Makeover",
      rating: 5,
      text: "From consultation to final styling, everything was perfect. They understood exactly what I wanted and delivered beyond my expectations. The products they use smell amazing too!",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Omar Diallo",
      location: "Dakar, Senegal",
      service: "Hair Products & Styling",
      rating: 5,
      text: "The hair products I bought are fantastic quality and the styling session was top-notch. It's rare to find such genuine care and professionalism. They really do treat you like family!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
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
