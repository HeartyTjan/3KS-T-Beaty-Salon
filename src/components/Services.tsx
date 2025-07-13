import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Scissors, Palette, Sparkles, Heart, Shield, Star, Loader2 } from "lucide-react";
import { useAvailableServices } from "@/hooks/use-api";

const Services = () => {
  const navigate = useNavigate();

  // Fetch services from backend
  const { data: servicesResponse, isLoading, error } = useAvailableServices();
   console.log("servicesResponse", servicesResponse);
  const services = servicesResponse || [];

  const serviceIcons = {
    'Hair Styling': Scissors,
    'Hair Coloring': Palette,
    'Hair Treatments': Sparkles,
    'Bridal Services': Heart,
    'Hair Extensions': Shield,
    'Consultation': Star,
    'default': Star,
    
  };

  const handleBookService = (serviceId: string) => {
    // Navigate to booking page with service pre-selected
    navigate(`/booking?service=${serviceId}`);
  };

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Professional Hair &
              <span className="text-transparent bg-clip-text brand-gradient block">
                Beauty Services
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the finest hair and beauty services tailored to your unique style. 
              Our expert stylists are here to make you look and feel your best.
            </p>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Professional Hair &
              <span className="text-transparent bg-clip-text brand-gradient block">
                Beauty Services
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the finest hair and beauty services tailored to your unique style. 
              Our expert stylists are here to make you look and feel your best.
            </p>
          </div>
          
          <div className="text-center py-20">
            <p className="text-muted-foreground">Failed to load services. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Professional Hair &
            <span className="text-transparent bg-clip-text brand-gradient block">
              Beauty Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience the finest hair and beauty services tailored to your unique style. 
            Our expert stylists are here to make you look and feel your best.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.category as keyof typeof serviceIcons] || serviceIcons.default;
              
              return (
                <Card key={service.id} className="rounded-2xl shadow-lg bg-[#faf7f2] p-0 overflow-hidden">
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.name || service.title}
                      className="object-cover w-full h-48 rounded-t-2xl"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{service.name || service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.features && service.features.length > 0 && service.features.map((feature, idx) => (
                        <span key={idx} className="bg-[#e5d3b3] text-[#6d4c1b] px-4 py-2 rounded-full text-sm font-medium">{feature}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover-lift transition-all duration-200 hover:scale-105">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
