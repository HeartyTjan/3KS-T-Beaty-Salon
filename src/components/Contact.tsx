import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Calendar, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBookAppointment = () => {
    navigate("/booking");
  };

  const handleCallNow = () => {
    window.location.href = "whatsapp:+2348024993364";
  };

  const handleQuickBook = () => {
    navigate("/booking");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Contact form submitted:", formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        service: "",
        message: ""
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Get In Touch
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Transform Your Look?
            <span className="text-transparent bg-clip-text brand-gradient block mt-5">
                ....
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-3">
            Book your appointment today or get in touch with our team. 
            We're here to make you look and feel amazing!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="vintage-shadow hover-lift">
            <CardHeader>
              <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input 
                      placeholder="Enter your first name" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input 
                      placeholder="Enter your last name" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input 
                    placeholder="Enter your phone number" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Service Needed</label>
                  <select 
                    className="w-full p-3 border border-input rounded-md bg-background"
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Home Service">Home Service</option>
                    <option value="Hair Coloring">Hair Coloring</option>
                    <option value="Styling & Cuts">Styling & Cuts</option>
                    <option value="Dreads & Braids">Dreads & Braids</option>
                    <option value="Hair Making">Hair Making</option>
                    <option value="Nail Services">Nail Services</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us about your desired look or any specific requirements"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full brand-gradient text-white hover-lift"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : isSubmitted ? "Message Sent!" : "Book Appointment"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                className="brand-gradient text-white hover-lift flex items-center gap-2"
                onClick={handleCallNow}
              >
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="hover-lift flex items-center gap-2"
                onClick={handleQuickBook}
              >
                <Calendar className="w-5 h-5" />
                Quick Book
              </Button>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <Card className="vintage-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+234 802 499 3364</p>
                    <p className="text-muted-foreground">+234 708 498 4039</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="vintage-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Visit Our Salon</h3>
                    <p className="text-muted-foreground">20, majolate Street ilupeju onipan</p>
                    <p className="text-muted-foreground">Lagos, Nigeria</p>
                    <Badge className="mt-2 bg-green-500/10 text-green-700 border-green-500/20">
                      Home Service Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="vintage-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Opening Hours</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                      <p>Sunday: 10:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
