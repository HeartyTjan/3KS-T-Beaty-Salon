import axios from 'axios';

// Debug environment variables
console.log('Environment variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('All env vars:', import.meta.env);

// Configure axios defaults
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8084') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API Base URL:', api.defaults.baseURL);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', {
            refreshToken: refreshToken
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  available: boolean;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  available: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  cartId: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Order types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  paymentMethod: string;
  shippingAddressId: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  timeSlot: string;
  notes?: string;
  status: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  // Add customer info for admin/super admin
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment types
export interface PaymentRequest {
  orderId: string;
  userId: string;
  paymentMethod: string;
  gateway?: string;
  callbackUrl?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  gateway: string;
  status: string;
  reference: string;
  paymentUrl?: string;
  verifiedAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API service functions
export const authAPI = {
  // Login
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/users/login', data);
    return response.data;
  },

  // Register
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse<string>> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await api.get('/users/me');
    return response.data; // response.data is the user object
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<string>> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<string>> => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // Update user profile
  updateUser: async (id: string, data: { firstName: string; lastName: string; phone?: string; country?: string; city?: string; }) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Change password
  changePassword: async (id: string, oldPassword: string, newPassword: string) => {
    const response = await api.post(`/users/${id}/change-password`, { oldPassword, newPassword });
    return response.data;
  },
};

export const productAPI = {
  // Get all products
  getAllProducts: async (page = 0, size = 10): Promise<ApiResponse<{ content: Product[]; totalElements: number }>> => {
    const response = await api.get(`/products?page=${page}&size=${size}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<ApiResponse<Product[]>> => {
    const response = await api.get(`/products/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get available products
  getAvailableProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/products/available');
    return response.data;
  },
};

export const cartAPI = {
  // Get cart
  getCart: async (userId: string): Promise<ApiResponse<Cart>> => {
    const response = await api.get(`/cart?userId=${userId}`);
    return response.data;
  },

  // Add item to cart
  addToCart: async (userId: string, productId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    const response = await api.post('/cart/add', { userId, productId, quantity });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (userId: string, productId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    const response = await api.put('/cart/update', { userId, productId, quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (userId: string, productId: string): Promise<ApiResponse<Cart>> => {
    const response = await api.delete(`/cart/remove?userId=${userId}&productId=${productId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (userId: string): Promise<ApiResponse<string>> => {
    const response = await api.delete(`/cart/clear?userId=${userId}`);
    return response.data;
  },

  // Get cart item count
  getCartItemCount: async (userId: string): Promise<ApiResponse<number>> => {
    const response = await api.get(`/cart/count?userId=${userId}`);
    return response.data;
  },

  // Check if cart is empty
  isCartEmpty: async (userId: string): Promise<ApiResponse<boolean>> => {
    const response = await api.get(`/cart/empty?userId=${userId}`);
    return response.data;
  },
};

export const orderAPI = {
  // Create order
  createOrder: async (userId: string, shippingAddressId: string, paymentMethod: string): Promise<ApiResponse<Order>> => {
    const response = await api.post('/orders/create', { userId, shippingAddressId, paymentMethod });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string, userId: string): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/orders/${orderId}?userId=${userId}`);
    return response.data;
  },

  // Get user orders
  getUserOrders: async (userId: string): Promise<ApiResponse<Order[]>> => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string, userId: string): Promise<ApiResponse<Order>> => {
    const response = await api.put(`/orders/${orderId}/cancel?userId=${userId}`);
    return response.data;
  },

  // Initialize payment
  initializePayment: async (data: PaymentRequest): Promise<ApiResponse<Payment>> => {
    const response = await api.post('/orders/payment/initialize', data);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentId: string, reference: string): Promise<ApiResponse<Payment>> => {
    const response = await api.post('/orders/payment/verify', { paymentId, reference });
    return response.data;
  },
};

export const serviceAPI = {
  // Get all services
  getAllServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await api.get('/services');
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Get available services
  getAvailableServices: async (): Promise<ApiResponse<Service[]>> => {
    const response = await api.get('/services/available');
    return response.data;
  },

  // Get services by category
  getServicesByCategory: async (category: string): Promise<ApiResponse<Service[]>> => {
    const response = await api.get(`/services/category/${category}`);
    return response.data;
  },

  // Create a new service
  createService: async (service: Partial<Service>): Promise<ApiResponse<Service>> => {
    const response = await api.post('/services', service);
    return response.data;
  },

  // Update a service
  updateService: async (id: string, service: Partial<Service>): Promise<ApiResponse<Service>> => {
    const response = await api.put(`/services/${id}`, service);
    return response.data;
  },

  // Delete a service
  deleteService: async (id: string): Promise<ApiResponse<string>> => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

export const bookingAPI = {
  // Create booking
  createBooking: async (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Booking>> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Get all bookings (admin/super admin)
  getAllBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (userId: string): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (id: string, data: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Get available slots
  getAvailableSlots: async (serviceId: string, date: string): Promise<ApiResponse<string[]>> => {
    const response = await api.get(`/bookings/available-slots?serviceId=${serviceId}&date=${date}`);
    return response.data;
  },
};

export const testimonialAPI = {
  // Create testimonial
  createTestimonial: async (userId: string, content: string, rating: number): Promise<ApiResponse<Testimonial>> => {
    const response = await api.post('/testimonials', { userId, content, rating });
    return response.data;
  },

  // Get approved testimonials
  getApprovedTestimonials: async (): Promise<ApiResponse<Testimonial[]>> => {
    const response = await api.get('/testimonials/approved');
    return response.data;
  },

  // Get testimonial by ID
  getTestimonialById: async (id: string): Promise<ApiResponse<Testimonial>> => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Get user testimonial
  getUserTestimonial: async (userId: string): Promise<ApiResponse<Testimonial>> => {
    const response = await api.get(`/testimonials/user/${userId}`);
    return response.data;
  },

  // Update testimonial
  updateTestimonial: async (id: string, userId: string, content: string, rating: number): Promise<ApiResponse<Testimonial>> => {
    const response = await api.put(`/testimonials/${id}`, { userId, content, rating });
    return response.data;
  },

  // Delete testimonial
  deleteTestimonial: async (id: string, userId: string): Promise<ApiResponse<string>> => {
    const response = await api.delete(`/testimonials/${id}?userId=${userId}`);
    return response.data;
  },

  // Get average rating
  getAverageRating: async (): Promise<ApiResponse<number>> => {
    const response = await api.get('/testimonials/average-rating');
    return response.data;
  },
};

export const mediaAPI = {
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // { success, blobId, mediaId, url }
  },
};

export default api; 