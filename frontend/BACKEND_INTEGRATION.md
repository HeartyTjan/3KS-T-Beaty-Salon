# Backend Integration for Guest Bookings

## Overview

The backend has been updated to support guest bookings with automatic account linking. Users can now book services without creating an account first, then optionally create an account afterward to track their bookings.

## Backend Changes

### 1. Booking Model Updates
- **File**: `3kstBackend/src/main/java/com/_3kstbackend/model/Booking.java`
- **Changes**: 
  - Made `userId` optional for guest bookings
  - Added validation for guest booking fields (`customerName`, `customerPhone`, `customerEmail`)
  - Added `isGuestBooking()` helper method

### 2. New DTOs
- **BookingRequestDto**: For creating bookings (guest or authenticated)
- **BookingResponseDto**: For API responses with booking details

### 3. BookingService Updates
- **File**: `3kstBackend/src/main/java/com/_3kstbackend/service/impl/BookingServiceImpl.java`
- **New Methods**:
  - `createGuestBooking()`: Creates bookings without user authentication
  - `linkGuestBookingToUser()`: Links a single guest booking to a user account
  - `linkAllGuestBookingsToUser()`: Links all guest bookings for an email to a user account
  - `getBookingsByCustomerEmail()`: Finds bookings by customer email
- **Features**:
  - Automatic email confirmation for guest bookings
  - Integration with EmailService for notifications

### 4. BookingRepository Updates
- **File**: `3kstBackend/src/main/java/com/_3kstbackend/repository/BookingRepository.java`
- **New Queries**:
  - `findByCustomerEmail()`: Find bookings by customer email
  - `findByCustomerEmailAndUserIdIsNull()`: Find guest bookings for an email

### 5. BookingController
- **File**: `3kstBackend/src/main/java/com/_3kstbackend/controller/BookingController.java`
- **Endpoints**:
  - `POST /api/bookings/guest`: Create guest booking (no auth required)
  - `POST /api/bookings`: Create authenticated booking
  - `GET /api/bookings/email/{email}`: Get bookings by email
  - `POST /api/bookings/link-all`: Link all guest bookings to user account
  - `POST /api/bookings/{id}/link`: Link specific booking to user account

### 6. UserService Integration
- **File**: `3kstBackend/src/main/java/com/_3kstbackend/service/impl/UserServiceImpl.java`
- **Feature**: Automatically links guest bookings when a user registers with the same email

## Frontend Changes

### 1. Booking Page Updates
- **File**: `src/pages/Booking.tsx`
- **Changes**:
  - Updated to call backend API for guest bookings
  - Added registration form after booking confirmation
  - Pre-fills registration form with guest booking information
  - Links bookings to user account upon registration

### 2. API Configuration
- **File**: `src/lib/api.ts`
- **Features**:
  - Configured axios with backend base URL
  - Automatic token handling for authenticated requests
  - Token refresh logic

### 3. Route Updates
- **File**: `src/App.tsx`
- **Change**: Booking page no longer requires authentication

## Complete User Flow

### Guest Booking Flow
1. **User visits booking page** (no login required)
2. **Selects service** (hair styling, coloring, etc.)
3. **Chooses location** (salon or home service)
4. **Picks date and time**
5. **Enters contact information** (name, email, phone)
6. **Confirms booking** → Backend creates guest booking
7. **Receives confirmation email** with booking details
8. **Optionally creates account** → Backend links booking to account

### Account Creation After Booking
1. **User sees registration prompt** after booking confirmation
2. **Form pre-filled** with booking information
3. **User creates account** → Backend automatically links guest bookings
4. **User receives verification email**
5. **User can now track bookings** in their account

## API Endpoints

### Guest Booking
```http
POST /api/bookings/guest
Content-Type: application/json

{
  "serviceId": "1",
  "serviceTitle": "Hair Coloring",
  "bookingDateTime": "2024-01-15T14:00:00",
  "durationMinutes": 180,
  "price": 80.00,
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "address": "123 Main St",
  "isHomeService": true
}
```

### Link Guest Bookings
```http
POST /api/bookings/link-all?email=john@example.com&userId=user123
```

## Environment Setup

### Backend Configuration
```properties
# application.properties
spring.data.mongodb.uri=mongodb://localhost:27017/3kst
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Frontend Configuration
```env
# .env
VITE_API_URL=http://localhost:8080
```

## Testing

### Test Guest Booking
1. Start backend server
2. Navigate to booking page
3. Complete booking as guest
4. Check email for confirmation
5. Verify booking in database

### Test Account Linking
1. Complete guest booking
2. Create account with same email
3. Verify booking is linked to account
4. Check user's booking history

## Security Considerations

- Guest bookings are validated but don't require authentication
- Email verification required for account creation
- Booking linking only works with matching email addresses
- All sensitive operations require authentication
- CORS configured for frontend integration

## Error Handling

- Backend validates all booking data
- Frontend shows user-friendly error messages
- Failed booking linking doesn't break registration
- Email sending failures are logged but don't break booking creation 