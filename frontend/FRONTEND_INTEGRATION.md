# Frontend-Backend Integration Guide

## Overview

This document outlines the integration between the React frontend and Spring Boot backend for the 3KS&T Hairdressing & Fashion website.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components
- **State Management**: React Query for server state, Context API for client state
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x with Java 17+
- **Database**: MongoDB
- **Security**: Spring Security with JWT
- **Documentation**: OpenAPI 3
- **Testing**: JUnit 5 + Mockito + TestContainers

## API Integration

### Base Configuration

The frontend communicates with the backend through the API service layer located in `src/lib/api.ts`.

```typescript
// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication Flow

1. **Login/Register**: Users authenticate through the AuthContext
2. **JWT Token**: Tokens are stored in localStorage and automatically included in requests
3. **Token Refresh**: Automatic token refresh on 401 responses
4. **Logout**: Token removal and redirect to login

### Key Components

#### 1. Authentication Context (`src/contexts/AuthContext.tsx`)
- Manages user authentication state
- Handles login, register, logout operations
- Provides user information and role-based access

#### 2. Cart Context (`src/contexts/CartContext.tsx`)
- Manages shopping cart state
- Integrates with backend cart API
- Handles cart operations (add, remove, update, clear)

#### 3. API Hooks (`src/hooks/use-api.ts`)
- React Query hooks for data fetching
- Caching and state management
- Mutation hooks for data updates

#### 4. Protected Routes (`src/components/ProtectedRoute.tsx`)
- Route protection based on authentication
- Role-based access control
- Redirect handling

## Environment Configuration

Create a `.env` file in the frontend root:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api

# Payment Gateway Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_your_flutterwave_public_key

# Environment
VITE_NODE_ENV=development

# Feature Flags
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_BOOKINGS=true
VITE_ENABLE_TESTIMONIALS=true
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search` - Search products
- `GET /api/products/available` - Get available products

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders/create` - Create order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/user/{userId}` - Get user orders
- `PUT /api/orders/{id}/cancel` - Cancel order
- `POST /api/orders/payment/initialize` - Initialize payment
- `POST /api/orders/payment/verify` - Verify payment

### Services
- `GET /api/services` - Get all services
- `GET /api/services/{id}` - Get service by ID
- `GET /api/services/available` - Get available services
- `GET /api/services/category/{category}` - Get services by category

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/user/{userId}` - Get user bookings
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking
- `GET /api/bookings/available-slots` - Get available time slots

### Testimonials
- `POST /api/testimonials` - Create testimonial
- `GET /api/testimonials/approved` - Get approved testimonials
- `GET /api/testimonials/{id}` - Get testimonial by ID
- `PUT /api/testimonials/{id}` - Update testimonial
- `DELETE /api/testimonials/{id}` - Delete testimonial
- `GET /api/testimonials/average-rating` - Get average rating

## Data Flow

### 1. Product Display
```typescript
// Fetch products using React Query
const { data: productsResponse, isLoading, error } = useAvailableProducts();

// Display products in component
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

### 2. Cart Operations
```typescript
// Add to cart
const { addToCart } = useCart();
await addToCart(productId, quantity);

// Update cart item
const { updateCartItem } = useCart();
await updateCartItem(productId, newQuantity);
```

### 3. Order Processing
```typescript
// Create order
const createOrderMutation = useCreateOrder();
await createOrderMutation.mutateAsync({
  userId: user.id,
  shippingAddressId: addressId,
  paymentMethod: 'card'
});

// Initialize payment
const initializePaymentMutation = useInitializePayment();
await initializePaymentMutation.mutateAsync({
  orderId: order.id,
  userId: user.id,
  paymentMethod: 'card',
  gateway: 'paystack'
});
```

### 4. Booking System
```typescript
// Create booking
const createBookingMutation = useCreateBooking();
await createBookingMutation.mutateAsync({
  userId: user.id,
  serviceId: serviceId,
  bookingDate: date,
  timeSlot: timeSlot,
  notes: notes
});
```

## Error Handling

### API Error Interceptor
```typescript
// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Component Error Handling
```typescript
// Using React Query error handling
const { data, error, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => productAPI.getAllProducts(),
});

if (error) {
  return <ErrorMessage message={error.message} />;
}
```

## Security Features

### 1. JWT Authentication
- Tokens stored in localStorage
- Automatic token inclusion in requests
- Token refresh on expiration

### 2. Protected Routes
- Authentication required for sensitive pages
- Role-based access control
- Automatic redirects

### 3. CORS Configuration
- Backend configured to accept frontend requests
- Secure cookie handling
- CSRF protection

## Development Setup

### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
mvn clean install
```

### 2. Start Development Servers
```bash
# Frontend (Port 5173)
npm run dev

# Backend (Port 8080)
cd backend
mvn spring-boot:run
```

### 3. Database Setup
```bash
# Start MongoDB
docker-compose up -d

# Initialize database
cd backend
mvn spring-boot:run
```

## Testing

### Frontend Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Backend Testing
```bash
# Run tests
mvn test

# Run integration tests
mvn verify
```

## Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
# Upload dist folder
```

### Backend Deployment
```bash
# Build JAR
mvn clean package

# Run with Docker
docker build -t 3kst-backend .
docker run -p 8080:8080 3kst-backend
```

## Monitoring and Logging

### Frontend
- React Query DevTools for API monitoring
- Browser DevTools for debugging
- Error boundary for crash handling

### Backend
- Spring Boot Actuator for health checks
- Logback for structured logging
- OpenAPI documentation for API exploration

## Performance Optimization

### Frontend
- React Query caching
- Code splitting with lazy loading
- Image optimization
- Bundle size optimization

### Backend
- MongoDB indexing
- JPA/Hibernate optimization
- Caching with Redis
- Connection pooling

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify API URL in frontend

2. **Authentication Issues**
   - Check JWT token validity
   - Verify token storage in localStorage
   - Check backend security configuration

3. **API Connection Issues**
   - Verify backend server is running
   - Check API base URL configuration
   - Verify network connectivity

4. **Database Connection**
   - Check MongoDB connection string
   - Verify database is running
   - Check authentication credentials

### Debug Tools

1. **Frontend**
   - React DevTools
   - React Query DevTools
   - Browser Network tab

2. **Backend**
   - Spring Boot DevTools
   - MongoDB Compass
   - Postman for API testing

## Next Steps

1. **Complete Integration**
   - Add remaining API endpoints
   - Implement error boundaries
   - Add loading states

2. **Testing**
   - Unit tests for components
   - Integration tests for API calls
   - E2E tests for user flows

3. **Performance**
   - Implement caching strategies
   - Optimize bundle size
   - Add service workers

4. **Security**
   - Add input validation
   - Implement rate limiting
   - Add security headers

5. **Monitoring**
   - Add analytics
   - Implement error tracking
   - Add performance monitoring 