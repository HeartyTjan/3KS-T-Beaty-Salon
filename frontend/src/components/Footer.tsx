
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Phone, MapPin, PhoneCall } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-2">3KS&T</h3>
              <p className="text-sm opacity-80">Hair • Fashion • Beauty</p>
            </div>
            <p className="text-background/80 mb-6 max-w-md">
              Transform your hair and style with 3KS&T - where modern meets vintage, 
              eco-friendly meets beautiful, and every client is treated like family across Africa.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-primary text-primary-foreground">
                🌿 100% Eco-Friendly
              </Badge>
              <Badge className="bg-accent text-accent-foreground">
                👨‍👩‍👧‍👦 Family Treatment
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground">
                🏠 Home Service
              </Badge>
            </div>
            
            <div className="flex gap-4">
              <Button size="sm" variant="secondary" className="hover-lift">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary" className="hover-lift">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Our Services</h4>
            <ul className="space-y-3 text-background/80">
              <li><a href="#services" className="hover:text-background transition-colors">Home Service</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Hair Coloring</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Styling & Cuts</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Dreads & Braids</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Hair Making</a></li>
              <li><a href="#services" className="hover:text-background transition-colors">Nail Services</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-background/80">
              <li><a href="#services" className="hover:text-background transition-colors">Services</a></li>
              <li><a href="#products" className="hover:text-background transition-colors">Products</a></li>
              <li><a href="#portfolio" className="hover:text-background transition-colors">Portfolio</a></li>
              <li><a href="#testimonials" className="hover:text-background transition-colors">Reviews</a></li>
              <li><a href="#contact" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-background/80">
                <Phone className="w-4 h-4" />
                <span>+234 8024993364</span>                
              </div>

              <div className="flex items-center gap-2 text-sm text-background/80">
                <Phone className="w-4 h-4" />
                <span>+234 7084984039</span>                
              </div>

              
              <div className="flex items-center gap-2 text-sm text-background/80">
                <MapPin className="w-4 h-4" />
                <span>20, majolate Street ilupeju onipan, Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm text-center md:text-left">
            © 2024 3KS&T. All rights reserved. Made with 💚 for beautiful hair across Africa.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-background/60 hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="text-background/60 hover:text-background transition-colors">Terms of Service</a>
            <a href="#" className="text-background/60 hover:text-background transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
