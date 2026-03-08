# Cosmetics E-Commerce Application

Production-ready full-stack cosmetics e-commerce app built with Next.js, Node.js, and Supabase. Designed for deployment on Vercel.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, REST API
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT, bcrypt
- **Storage:** Supabase Storage (product images)
- **Deployment:** Vercel

## Project Structure

```
cosmetic_project/
├── client/          # Next.js frontend
├── server/          # Node.js Express API
├── supabase/        # Database schema & migrations
└── package.json
```

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in `supabase/schema.sql` in the SQL Editor.
3. Run `supabase/seed.sql` for sample data (optional).
4. Create a Storage bucket named `products` (public) for product images.
5. Copy `.env.example` to `.env` in both `client` and `server`, fill in:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`

### 3. Environment variables

**client/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**server/.env**
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

### 4. Create admin user (optional)

From the `server` folder, run:

```bash
node scripts/createAdmin.js admin@yourdomain.com yourpassword
```

### 5. Run locally

```bash
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:5000

## Deployment (Vercel)

- **Frontend:** Deploy the `client` folder as a Vercel project. Set `NEXT_PUBLIC_API_URL` to your API URL.
- **Backend:** Deploy `server` as a separate Node.js service (e.g. Railway, Render, or Vercel Serverless via `api/`). Set all env vars including `SUPABASE_*` and `JWT_SECRET`.

## Features

- User auth (register, login, JWT, protected routes)
- Product catalog with categories, search, filters, sorting
- Cart, checkout, order history
- Reviews and ratings
- Wishlist
- Admin panel: products, orders, categories, users
