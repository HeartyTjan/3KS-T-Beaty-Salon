import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/booking");
  };

  const handleCallNow = () => {
    window.location.href = "tel:+2341234567890";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 brand-gradient opacity-10"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              ✨ Eco-Friendly • Gen-Z Focused • Family Treatment
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-emerald-600 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Hair & Style
              </span>
              With 3KS&T
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Experience exceptional hairdressing and fashion services that treat you like family. 
              From home visits to salon styling, nails to fashion products - we've got you covered across Africa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                size="lg" 
                className="brand-gradient text-white hover-lift flex items-center gap-2"
                onClick={handleBookAppointment}
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="hover-lift flex items-center gap-2"
                onClick={handleCallNow}
              >
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>5.0 Rating</span>
              </div>
              <div className="w-px h-4 bg-border"></div>
              <span>500+ Happy Clients</span>
              <div className="w-px h-4 bg-border"></div>
              <span>Home Service Available</span>
            </div>
          </div>
          
          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative bg-card rounded-3xl p-8 vintage-shadow hover-lift">
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Professional hairdressing services"
                className="w-full h-[400px] object-cover rounded-2xl"
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 vintage-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Home Service</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 vintage-shadow">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-xs text-muted-foreground">Eco-Friendly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
    </section>
  );
};

export default Hero;
