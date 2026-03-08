# Cosmetics E-Commerce Project Overview

## 1. Project Summary

This project is a full-stack **Cosmetics E-Commerce Application** designed with a production-style architecture.

It allows customers to:

- browse products
- search, filter, and sort items
- add products to cart/wishlist
- place orders
- review products

It also includes an **admin panel** to manage products, categories, orders, and users.

---

## 2. Tech Stack

### Frontend

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express
- REST API architecture

### Database and Storage

- Supabase (PostgreSQL)
- Supabase Storage (for product images)

### Security / Auth

- JWT authentication
- bcrypt password hashing

### Deployment

- Vercel-ready frontend
- Backend deployable as separate Node service or serverless

---

## 3. High-Level Architecture

The project is split into two main applications:

- `client/` -> frontend (UI)
- `server/` -> backend APIs (business logic + DB access)

This separation provides:

- clean code organization
- easier scaling and maintenance
- independent deployment for frontend/backend

---

## 4. Main Features

### Customer Features

- Register / Login
- Product listing and product detail page
- Product search
- Filters (price, brand, rating, category)
- Sorting (price, rating, newest)
- Cart operations (add/update/remove)
- Checkout and order placement
- Profile and order history
- Wishlist
- Product reviews and ratings

### Admin Features

- Admin dashboard
- Add / edit / delete products
- Manage categories
- Manage orders and update order status
- View/manage users

---

## 5. API Structure

The backend exposes modular REST routes:

- `/api/auth`
- `/api/products`
- `/api/cart`
- `/api/orders`
- `/api/reviews`
- `/api/categories`
- `/api/wishlist`
- `/api/users`

Protected route logic:

- `authMiddleware` -> validates JWT and user session
- `adminMiddleware` -> allows admin-only access

---

## 6. Database Design (Supabase)

Core tables:

- `users`
- `categories`
- `products`
- `orders`
- `order_items`
- `cart`
- `cart_items`
- `reviews`
- `wishlist`

Additional improvements:

- Row Level Security (RLS) enabled
- Indexes for fast querying
- Trigger function to keep product average rating updated

---

## 7. External API Integration

To ensure demo reliability, the project includes an external-data fallback:

- If Supabase product/category tables are missing or empty, backend fetches products from external APIs.
- Those products and image URLs are mapped to the existing product structure.
- Frontend continues to work without changing UI logic.

This guarantees visible data and images during demos/testing.

---

## 8. Project Strengths (What to Explain)

- Full-stack architecture with clear separation of concerns
- Real authentication and authorization flow
- Scalable folder structure
- Database-backed commerce features
- Admin workflow support
- Production-oriented environment setup
- Resilient fallback data strategy for uninterrupted demos

---

## 9. How to Run (Quick)

1. Configure env files:
   - `server/.env`
   - `client/.env.local`
2. Start app:

```bash
npm run dev
```

3. Access:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

---

## 10. Short Viva Pitch (30-45 sec)

This is a production-style full-stack cosmetics e-commerce platform built with Next.js, Node.js, and Supabase.  
I separated frontend and backend into independent services, used JWT + bcrypt for secure authentication, and designed REST APIs for products, cart, orders, reviews, wishlist, and admin operations.  
The database is modeled with relational commerce tables and includes RLS and rating triggers.  
The app is responsive, scalable, and deployment-ready. I also added an external API fallback so the catalog still shows products and images even if database seed/schema is not available, making demos reliable.

