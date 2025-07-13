import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, XCircle, Calendar as CalendarIcon, Clock, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import ThreeJSBackground from "@/components/ThreeJSBackground";
import api from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { bookingAPI } from '@/lib/api';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const BookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editedDate, setEditedDate] = useState(null);
  const [editedTime, setEditedTime] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { user } = useAuth();


   useEffect(() => {
    const fetchBookings = async () => {
      try {
        let res;
        if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
          res = await bookingAPI.getAllBookings();
        } else if (user?.id) {
          res = await bookingAPI.getUserBookings(user.id);
        }
        setBookings(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      } catch (err: any) {
        setError('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  console.log("bookings", bookings);

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setEditedDate(new Date(booking.bookingDateTime));
    setEditedTime(format(new Date(booking.bookingDateTime), "h:mm a"));
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditedDate(null);
    setEditedTime("");
  };

    const handleCancel = async (id: string) => {
    setCancelling(id);
    try {
      const response = await bookingAPI.cancelBooking(id);
      setBookings(bookings => bookings.map(b => b.id === id ? response.data : b));
      toast({ title: 'Booking cancelled', description: 'Your booking was cancelled successfully.' });
    } catch (err) {
      console.error('Cancel booking error:', err);
      toast({ title: 'Cancel failed', description: 'Could not cancel booking. Please try again.', variant: 'destructive' });
    } finally {
      setCancelling(null);
      setCancelDialog({ open: false, id: null });
    }
  };

  const handleUpdateBooking = async () => {
    if (!editingBooking || !editedDate || !editedTime) return;

    setIsSubmitting(true);
    try {
      const timeMatch = editedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const isPM = timeMatch[3].toUpperCase() === 'PM';

      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;

      const combinedDateTime = new Date(editedDate);
      combinedDateTime.setHours(hours, minutes, 0, 0);

      const updatedBooking = {
        ...editingBooking,
        bookingDateTime: combinedDateTime.toISOString(),
      };

      console.log("bookingd", bookings);
      const response = await api.put(`/bookings/${editingBooking.id}`, updatedBooking);
      setBookings(bookings.map(b => b.id === editingBooking.id ? response.data : b));
      setEditingBooking(null);
      setEditedDate(null);
      setEditedTime("");
      toast({
        title: "Success",
        description: "Booking updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to update booking:", error);
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderBookingCard = (booking) => (
    <Card key={booking.id} className="transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-6 space-y-4">
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <div className="mb-2">
            <div><b>Customer:</b> {booking.customerName}</div>
            <div><b>Email:</b> {booking.customerEmail}</div>
            <div><b>Phone:</b> {booking.customerPhone}</div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{booking.serviceTitle}</h3>
          <div className="flex gap-2">
            {!(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditBooking(booking)}
                className="transition-all duration-200 hover:scale-105"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCancel(booking.id)}
              disabled={isSubmitting}
              className="transition-all duration-200 hover:scale-105"
            >
              <Trash className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{format(new Date(booking.bookingDateTime), "PPP")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{format(new Date(booking.bookingDateTime), "h:mm a")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>{booking.durationMinutes} minutes</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="capitalize">{booking.isHomeService ? "Home Service" : "Salon"}</span>
            </div>
            {booking.isHomeService && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span className="text-right">{booking.address}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold">
                {booking.price ? `₦${booking.price.toLocaleString()}` : "Contact for pricing"}
              </span>
            </div>
          </div>
        </div>
        {/* Remove travel fee badge since pricing is removed */}
      </CardContent>
    </Card>
  );

  const renderEditForm = () => (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Edit Booking: {editingBooking.serviceTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5" />
              Select New Date
            </Label>
            <Calendar
              mode="single"
              selected={editedDate}
              onSelect={setEditedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              Select New Time
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={editedTime === time ? "default" : "outline"}
                  className="h-12 transition-all duration-200 hover:scale-105"
                  onClick={() => setEditedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateBooking}
            disabled={!editedDate || !editedTime || isSubmitting}
            className="brand-gradient text-white transition-all duration-200 hover:scale-105"
          >
            {isSubmitting ? "Updating..." : "Update Booking"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-20">
      <ThreeJSBackground />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold">My Bookings</h2>
          <Button className="brand-gradient text-white font-semibold px-6 py-2 rounded-lg shadow hover-lift" onClick={() => navigate('/booking')}>Book a Service</Button>
        </div>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading bookings...</div>
        ) : editingBooking ? (
          renderEditForm()
        ) : bookings.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">No bookings found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => renderBookingCard(booking))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;