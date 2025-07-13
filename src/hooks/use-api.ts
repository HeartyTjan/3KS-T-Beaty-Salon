import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, serviceAPI, bookingAPI, testimonialAPI, orderAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Product hooks
export const useProducts = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['products', page, size],
    queryFn: () => productAPI.getAllProducts(page, size),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProductById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productAPI.getProductsByCategory(category),
    enabled: !!category,
  });
};

export const useAvailableProducts = () => {
  return useQuery({
    queryKey: ['products', 'available'],
    queryFn: () => productAPI.getAvailableProducts(),
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productAPI.searchProducts(query),
    enabled: !!query && query.length > 2,
  });
};

// Service hooks
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => serviceAPI.getAllServices(),
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceAPI.getServiceById(id),
    enabled: !!id,
  });
};

export const useAvailableServices = () => {
  return useQuery({
    queryKey: ['services', 'available'],
    queryFn: () => serviceAPI.getAvailableServices(),
  });
};

export const useServicesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['services', 'category', category],
    queryFn: () => serviceAPI.getServicesByCategory(category),
    enabled: !!category,
  });
};

// Booking hooks
export const useUserBookings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bookings', 'user', user?.id],
    queryFn: () => bookingAPI.getUserBookings(user!.id),
    enabled: !!user?.id,
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingAPI.getBookingById(id),
    enabled: !!id,
  });
};

export const useAvailableSlots = (serviceId: string, date: string) => {
  return useQuery({
    queryKey: ['slots', serviceId, date],
    queryFn: () => bookingAPI.getAvailableSlots(serviceId, date),
    enabled: !!serviceId && !!date,
  });
};

// Testimonial hooks
export const useApprovedTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials', 'approved'],
    queryFn: () => testimonialAPI.getApprovedTestimonials(),
  });
};

export const useAverageRating = () => {
  return useQuery({
    queryKey: ['testimonials', 'average-rating'],
    queryFn: () => testimonialAPI.getAverageRating(),
  });
};

// Order hooks
export const useUserOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['orders', 'user', user?.id],
    queryFn: () => orderAPI.getUserOrders(user!.id),
    enabled: !!user?.id,
  });
};

export const useOrder = (id: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderAPI.getOrderById(id, user!.id),
    enabled: !!id && !!user?.id,
  });
};

// Mutation hooks
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: bookingAPI.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ userId, content, rating }: { userId: string; content: string; rating: number }) =>
      testimonialAPI.createTestimonial(userId, content, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({
        title: "Success",
        description: "Testimonial submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit testimonial",
        variant: "destructive",
      });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ userId, shippingAddressId, paymentMethod }: { 
      userId: string; 
      shippingAddressId: string; 
      paymentMethod: string; 
    }) => orderAPI.createOrder(userId, shippingAddressId, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Success",
        description: "Order created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });
};

export const useInitializePayment = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: orderAPI.initializePayment,
    onSuccess: (data) => {
      if (data.data.paymentUrl) {
        window.open(data.data.paymentUrl, '_blank');
      }
      toast({
        title: "Payment initialized",
        description: "Redirecting to payment gateway...",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    },
  });
}; 