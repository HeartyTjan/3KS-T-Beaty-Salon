import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, ArrowLeft, ArrowRight, Phone, MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import ThreeJSBackground from "@/components/ThreeJSBackground";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import api from "@/lib/api";
import { useAuth } from '@/contexts/AuthContext';

const mockServices = [
  { id: "1", title: "Home Service", description: "Professional hairdressing at your comfort zone across Africa", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", duration: 120, ecoFriendly: true },
  { id: "2", title: "Hair Coloring", description: "Vibrant colors and professional dyeing techniques", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", duration: 180, ecoFriendly: true },
  { id: "3", title: "Styling & Cuts", description: "Modern cuts and styling for all hair types", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", duration: 90, ecoFriendly: true },
  { id: "4", title: "Dreads & Braids", description: "Traditional and modern dreadlock and braiding services", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", duration: 150, ecoFriendly: true },
  { id: "5", title: "Hair Making", description: "Professional hair extensions and weaving services", image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", duration: 240, ecoFriendly: true },
  { id: "6", title: "Nail Services", description: "Professional manicure and nail art services", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", duration: 60, ecoFriendly: true }
];
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    firstName: customerInfo.firstName,
    lastName: customerInfo.lastName,
    email: customerInfo.email,
    password: "",
    phone: customerInfo.phone
  });
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const { user, isAuthenticated } = useAuth();
  // Set totalSteps so that for authenticated users, step 4 is confirmation
  const totalSteps = isAuthenticated ? 4 : 5;
  const navigate = useNavigate();

  console.log("user", user);
  // Check for pre-selected service from Services page
  useEffect(() => {
    const storedService = sessionStorage.getItem('selectedService');
    if (storedService) {
      try {
        const service = JSON.parse(storedService);
        // Find the matching service in our mock data
        const matchingService = mockServices.find(s => s.title === service.title);
        if (matchingService) {
          setSelectedService(matchingService);
          setCurrentStep(2); // Skip to location selection
        }
        // Clear the stored service
        sessionStorage.removeItem('selectedService');
      } catch (error) {
        console.error('Error parsing stored service:', error);
      }
    }
  }, []);

  const handleServiceSelect = (service) => setSelectedService(service);
  // Update handleNext to always advance by 1 step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Defensive: Ensure all required fields are present and valid
      if (!selectedService || !selectedService.id || !selectedService.title) throw new Error("Service selection is required");
      if (!selectedDate || !selectedTime) throw new Error("Date and time are required");
      const firstName = isAuthenticated ? user.firstName : customerInfo.firstName;
      const lastName = isAuthenticated ? user.lastName : customerInfo.lastName;
      const customerName = `${firstName || ''} ${lastName || ''}`.trim();
      const customerPhone = isAuthenticated ? user.phone : customerInfo.phone;
      const customerEmail = isAuthenticated ? user.email : customerInfo.email.trim();
      if (!customerName) throw new Error("Customer name is required");
      if (!customerPhone) throw new Error("Customer phone is required");
      if (!customerEmail) throw new Error("Customer email is required");
      // Parse and format bookingDateTime
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const isPM = timeMatch[3].toUpperCase() === 'PM';
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(hours, minutes, 0, 0);
      const bookingDateTime = combinedDateTime.toISOString();
      // Defensive: Ensure durationMinutes is valid
      const durationMinutes = selectedService.duration && selectedService.duration > 0 ? selectedService.duration : 60;
      const bookingData = {
        ...(isAuthenticated && user?.id ? { userId: user.id } : {}),
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        bookingDateTime,
        durationMinutes,
        notes: "",
        customerName,
        customerPhone,
        customerEmail,
        address: location === "home" ? address : "",
        isHomeService: location === "home"
      };
      console.log("Sending booking data:", bookingData);
      const endpoint = isAuthenticated ? "/bookings" : "/bookings/guest";
      const response = await api.post(endpoint, bookingData);
      setRegisterForm({
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        password: ""
      });
      setIsSubmitting(false);
      setIsConfirmed(true);
    } catch (error) {
      console.error("Booking failed:", error);
      setIsSubmitting(false);
      // Optionally show error to user
    }
  };
  
  const calculateTotalPrice = () => {
    return 0; // No pricing in booking flow
  };

  
  const isStepValid = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return location !== "";
      case 3: return selectedDate && selectedTime;
      case 4:
        if (isAuthenticated) return true;
        return customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone;
      default: return true;
    }
  };

  
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
            i + 1 <= currentStep 
              ? "bg-primary text-primary-foreground scale-110" 
              : "bg-muted text-muted-foreground"
          }`}>
            {i + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
              i + 1 < currentStep ? "bg-primary" : "bg-muted"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
  
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Your Service</h2>
        <p className="text-muted-foreground">Select the service that best fits your needs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServices.map((service) => (
          <Card 
            key={service.id} 
            className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl ${
              selectedService?.id === service.id 
                ? "ring-2 ring-primary bg-primary/5 transform scale-105" 
                : "hover:shadow-lg"
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
              />
              {service.ecoFriendly && (
                <Badge className="absolute top-2 left-2 bg-green-500/90 text-white border-0 animate-pulse">
                  🌿 Eco-Friendly
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration: {service.duration}min</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Location</h2>
        <p className="text-muted-foreground">Where would you like your service?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl ${
            location === "salon" ? "ring-2 ring-primary bg-primary/5 transform scale-105" : "hover:shadow-lg"
          }`}
          onClick={() => setLocation("salon")}
        > 
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Visit Our Salon</h3>
            <p className="text-muted-foreground mb-4">Experience our professional salon environment</p>
            <div className="text-sm text-muted-foreground">
              <p>20, majolate Street ilupeju onipan</p>
              <p>Lagos, Nigeria</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl ${
            location === "home" ? "ring-2 ring-primary bg-primary/5 transform scale-105" : "hover:shadow-lg"
          }`}
          onClick={() => setLocation("home")}
        > 
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Home Service</h3>
            <p className="text-muted-foreground mb-4">We come to you for ultimate convenience</p>
          </CardContent>
        </Card>
      </div>
      {location === "home" && (
        <Card className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-6">
            <Label htmlFor="address" className="text-sm font-medium mb-2 block">Your Address</Label>
            <Textarea 
              id="address" 
              placeholder="Enter your full address for home service" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              rows={3} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Date & Time</h2>
        <p className="text-muted-foreground">Choose when you'd like your appointment</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Select Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="h-12 transition-all duration-200 hover:scale-105"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Information</h2>
        <p className="text-muted-foreground">Help us get in touch with you</p>
      </div>
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={customerInfo.firstName}
                onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={customerInfo.lastName}
                onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              className="transition-all duration-200 focus:scale-105"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="transition-all duration-200 focus:scale-105"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Confirm Your Booking</h2>
        <p className="text-muted-foreground">Review your appointment details</p>
      </div>
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Service Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{selectedService?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{selectedService?.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium capitalize">{location} service</span>
                </div>
                {location === "home" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium text-right">{address}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Appointment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {selectedDate ? format(selectedDate, "PPP") : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{user?.firstName || customerInfo.firstName} {user?.lastName || customerInfo.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-medium">{user?.email || customerInfo.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setRegisterError("");
    try {
      const res = await api.post("/users/register", registerForm);
      
      // If registration is successful, link any guest bookings to this user
      if (res.data && res.data.id) {
        try {
          await api.post(`/bookings/link-all?email=${registerForm.email}&userId=${res.data.id}`);
        } catch (linkError) {
          console.error("Failed to link bookings:", linkError);
          // Don't fail the registration if linking fails
        }
      }
      
      setRegisterSuccess(true);
    } catch (err) {
      setRegisterError(err.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };
  
  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
        <p className="text-lg text-muted-foreground mb-6">
          We're excited to make you shine, {customerInfo.firstName}! 🎉
        </p>
        <p className="text-muted-foreground">
          A confirmation email has been sent to {customerInfo.email} with all the details.
        </p>
      </div>
      <Card className="max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Your Appointment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span>{selectedService?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{selectedDate ? format(selectedDate, "PPP") : ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{selectedTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Account creation prompt - only for guests */}
      {!isAuthenticated && !registerSuccess && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Create an account to track your bookings and receive updates faster!</h3>
          <p className="mb-4 text-muted-foreground">Already have an account? <a href="/login" className="text-primary underline">Log in</a></p>
          
          {/* Pre-filled indicator */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Form pre-filled with your booking information</span>
            </div>
          </div>
          
          <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="regFirstName">First Name</Label>
                <Input
                  id="regFirstName"
                  value={registerForm.firstName}
                  onChange={e => setRegisterForm(f => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="regLastName">Last Name</Label>
                <Input
                  id="regLastName"
                  value={registerForm.lastName}
                  onChange={e => setRegisterForm(f => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="regEmail">Email</Label>
              <Input
                id="regEmail"
                type="email"
                value={registerForm.email}
                onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="regPhone">Phone</Label>
              <Input
                id="regPhone"
                value={registerForm.phone}
                onChange={e => setRegisterForm(f => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="regPassword">Password</Label>
              <Input
                id="regPassword"
                type="password"
                value={registerForm.password}
                onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            {registerError && <div className="text-red-500 text-sm">{registerError}</div>}
            <Button type="submit" className="w-full" disabled={registering}>
              {registering ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      )}
      {registerSuccess && !isAuthenticated && (
        <div className="mt-8 text-green-600 font-semibold">
          Account created! Please check your email to verify your account.
        </div>
      )}
      <div className="flex gap-4 justify-center mt-8">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/"}
          className="transition-all duration-200 hover:scale-105"
        >
          Back to Home
        </Button>
        <Button 
          onClick={() => {
            setCurrentStep(1);
            setSelectedService(null);
            setLocation("");
            setAddress("");
            setSelectedDate(undefined);
            setSelectedTime("");
            setCustomerInfo({ firstName: "", lastName: "", email: "", phone: "" });
            setIsConfirmed(false);
            setRegisterSuccess(false);
            setRegisterError("");
            setRegisterForm({ firstName: "", lastName: "", email: "", password: "", phone: "" });
          }}
          className="transition-all duration-200 hover:scale-105"
        >
          Book Another Service
        </Button>
      </div>
    </div>
  );
  
  // Update renderStepContent so that for authenticated users, step 4 is confirmation
  const renderStepContent = () => {
    if (isConfirmed) return renderConfirmation();
    if (isAuthenticated) {
      switch (currentStep) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep3();
        case 4: return renderStep5(); // confirmation for logged-in users
        default: return null;
      }
    } else {
      switch (currentStep) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep3();
        case 4: return renderStep4();
        case 5: return renderStep5();
        default: return null;
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Book Your
            <span className="text-transparent bg-clip-text brand-gradient block">
              Appointment
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Experience exceptional hairdressing and beauty services that treat you like family
          </p>
        </div>
        {!isConfirmed && renderStepIndicator()}
        <div className="mb-8">{renderStepContent()}</div>
        {!isConfirmed && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex gap-4">
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="brand-gradient text-white flex items-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  {isSubmitting ? "Confirming..." : "Confirm Booking"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="brand-gradient text-white flex items-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <ThreeJSBackground />
    </div>
  );
};

export default Booking; 