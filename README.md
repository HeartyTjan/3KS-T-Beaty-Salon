# 3KS&T Beauty Salon

A full-stack web application for managing and showcasing Afro-centric beauty, hair, and fashion services and products. Built with a Java Spring Boot backend and a modern React/TypeScript frontend.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [API Endpoints](#api-endpoints)
- [Admin Dashboard](#admin-dashboard)
- [Deployment](#deployment)

---

## Features
- User registration, login, and authentication
- Product catalog and management
- Service catalog and management
- Testimonials and media gallery
- Shopping cart and checkout flow
- Admin dashboard for managing all resources
- Responsive, mobile-friendly UI
- Live dashboard stats (services, products, testimonials, media)

---

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui, React Query
- **Backend:** Java 17, Spring Boot, Spring Security, JPA/Hibernate
- **Database:** MongoDb

---

## Project Structure
```
sleek-afro-style-hub/
  ├── 3kstBackend/         # Java Spring Boot backend
  └── frontend/           # React/TypeScript frontend
```

---

## Setup & Installation

### Backend
1. Navigate to the backend directory:
   ```sh
   cd 3kstBackend
   ```
2. Build and run the Spring Boot app:
   ```sh
   ./mvnw spring-boot:run
   # or on Windows
   mvnw.cmd spring-boot:run
   ```
3. The backend will start on [http://localhost:8080](http://localhost:8080) by default.

### Frontend
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   bun install
   ```
3. Start the development server:
   ```sh
   npm run dev
   # or
   bun run dev
   ```
4. The frontend will start on [http://localhost:5173](http://localhost:5173) by default.

---

## API Endpoints (Selected)

### Products
- `GET /api/products` — List all products
- `GET /api/products/count` — **Get product count**

### Services
- `GET /api/services` — List all services
- `GET /api/services/count` — **Get service count**

### Testimonials
- `GET /api/testimonials` — List all testimonials
- `GET /api/testimonials/count` — **Get testimonial count**

### Media
- `GET /api/media` — List all media items
- `GET /api/media/count` — **Get media count**

### Auth & Users
- `POST /api/users/register` — Register user
- `POST /api/users/login` — Login
- `GET /api/users/me` — Get current user

> See backend controller files for more endpoints and details.

---

## Admin Dashboard
- Accessible at `/admin` (login required, admin or super admin role)
- Features:
  - Overview with live stats
  - Manage services, products, testimonials, media
  - Super admin: manage admin users
  - Mobile-friendly with hamburger menu

---

## Deployment
- Deploy backend to your preferred Java hosting (Heroku, AWS, etc.)
- Deploy frontend to Vercel, Netlify, or your own server
- Configure environment variables as needed for API URLs and database

---

## License
MIT or your chosen license.

---

## Contributors
- [Your Name]
- [Other contributors]

---

## Notes
- For local development, ensure both backend and frontend are running.
- Update API URLs in `frontend/.env` or `frontend/src/lib/api.ts` if needed.
- For questions or issues, open an issue in this repo. 