# Supabase Setup (Detailed)

This guide covers a full Supabase setup for the `cosmetic_project` stack:

- Next.js client (`client`)
- Node.js/Express API (`server`)
- Supabase Postgres + Storage

It includes local setup, production notes, security guidance, and troubleshooting.

---

## 1) Create Your Supabase Project

1. Open [Supabase](https://supabase.com/), sign in, and create a new project.
2. Choose:
   - Organization
   - Region (pick closest to your users and your backend host)
   - Strong database password
3. Wait until project status is healthy.

Recommended:

- Use one Supabase project per environment:
  - `dev` (local testing)
  - `staging` (pre-release)
  - `prod` (live)

---

## 2) Collect Required API Credentials

Go to **Project Settings -> API** and copy these:

- **Project URL** -> `SUPABASE_URL`
- **anon public key** -> `SUPABASE_ANON_KEY`
- **service_role key** -> `SUPABASE_SERVICE_KEY`

Important:

- `SUPABASE_SERVICE_KEY` is highly privileged.
- Never expose service key in frontend code or browser bundles.

---

## 3) Apply Database Schema

### 3.1 Run main schema

1. Open **SQL Editor** in Supabase.
2. Paste contents of:
   - `supabase/schema.sql`
3. Execute query.

This creates all core tables used by the app:

- `users`
- `categories`
- `products`
- `cart`
- `cart_items`
- `wishlist`
- `orders`
- `order_items`
- `reviews`

It also configures:

- indexes
- product rating trigger/function
- row level security enablement
- baseline policies

### 3.2 Validate table creation

Run:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

You should see the tables above.

---

## 4) Seed Initial Data (Optional but Recommended)

1. In SQL Editor, create a new query.
2. Paste content of:
   - `supabase/seed.sql`
3. Execute.

This seeds:

- categories: Makeup, Skincare, Haircare, Fragrance
- sample cosmetic products with realistic metadata

Quick check:

```sql
select name, brand, price, rating
from products
order by created_at desc
limit 10;
```

---

## 5) Storage Setup for Product Images

The app expects a bucket named `products`.

### 5.1 Create bucket

1. Open **Storage** in Supabase dashboard.
2. Click **Create bucket**.
3. Bucket name: `products`
4. For current app flow, set to **Public**.

### 5.2 Optional storage policy hardening

If you prefer private bucket + signed URLs:

- keep bucket private
- generate signed URLs in backend
- do not expose direct object paths in client

For public bucket with admin-only writes, use Storage policies similar to:

```sql
-- Example only; adapt to your auth model
-- Read for everyone
create policy "Public read for products bucket"
on storage.objects for select
to public
using (bucket_id = 'products');

-- Write only for authenticated admin users (if using Supabase Auth claims)
-- This policy may differ if you're not using Supabase Auth sessions directly.
```

Because this project uses backend service-role operations for privileged actions,
you can keep frontend storage writes disabled and upload via backend-only APIs.

---

## 6) Backend Environment Configuration

Create `server/.env` from example:

```bash
cd /c/Users/Administrator/Desktop/cosmetic_project/server
cp .env.example .env
```

Set values in `server/.env`:

```env
PORT=5000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=replace_with_long_random_secret
```

Guidelines:

- `JWT_SECRET` should be long and random in production.
- Never commit `.env` files.
- Rotate secrets if leaked.

---

## 7) Frontend Environment Configuration

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If you later use Supabase directly in frontend code, also add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
```

For this architecture, the frontend mostly talks to the Node API, not directly to DB.

---

## 8) RLS Strategy for This Architecture

This project follows:

- **Primary data access via backend** (`server`) using `SUPABASE_SERVICE_KEY`
- Client does not need broad direct table permissions

Implications:

- Service role bypasses RLS; backend must enforce authorization itself
- Middleware (`authMiddleware`, `adminMiddleware`) is your enforcement layer

Recommended production improvements:

1. Keep all mutation routes protected server-side.
2. Validate ownership on reads/updates/deletes.
3. Log admin actions.
4. Add API-level rate limiting.
5. Add input validation schema layer (e.g., Zod/Joi).

---

## 9) Start Services Locally

From root:

```bash
cd /c/Users/Administrator/Desktop/cosmetic_project
npm run dev
```

Expected:

- Next.js app: `http://localhost:3000`
- API server: `http://localhost:5000`

---

## 10) Verify End-to-End Connection

### 10.1 Health endpoint

```bash
curl http://localhost:5000/api/health
```

Expected:

```json
{"status":"ok"}
```

### 10.2 Product fetch

```bash
curl http://localhost:5000/api/products
```

Expected:

- Seeded data list if `seed.sql` ran
- Empty array if no products inserted yet

### 10.3 App UI check

Open `http://localhost:3000` and confirm:

- home page loads
- product listing loads
- product detail page loads without API errors

---

## 11) Create Admin User

Use provided script:

```bash
cd /c/Users/Administrator/Desktop/cosmetic_project/server
node scripts/createAdmin.js admin@yourdomain.com yourpassword
```

Then login from `/auth/login` and open:

- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`
- `/admin/categories`
- `/admin/users`

---

## 12) Production Deployment Notes

### 12.1 Frontend (Vercel)

Set env:

- `NEXT_PUBLIC_API_URL=https://your-api-domain.com`

### 12.2 Backend (Node host or serverless)

Set env:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `PORT` (if required by host)

### 12.3 Security checklist

- Do not expose service role key to client.
- Restrict CORS to known domains in production.
- Use HTTPS only.
- Rotate JWT secret periodically.
- Monitor failed auth attempts and suspicious request patterns.

---

## 13) Common Errors and Fixes

### Error: `supabaseUrl is required`

Cause:

- `server/.env` missing or `SUPABASE_URL` empty.

Fix:

1. Create `server/.env` from `server/.env.example`.
2. Fill valid `SUPABASE_URL`.
3. Restart backend process.

### Error: invalid API key / unauthorized from Supabase

Cause:

- wrong key in backend (`anon` key used instead of `service_role`, or typo)

Fix:

- Re-copy `SUPABASE_SERVICE_KEY` from Supabase API settings.

### 401 from your API protected routes

Cause:

- missing/invalid JWT token in `Authorization: Bearer <token>`

Fix:

- login first from `/api/auth/login`
- confirm token is stored in browser local storage

### Storage image not loading

Cause:

- bucket/object path incorrect
- bucket not public (while expecting public URL)

Fix:

- verify bucket name `products`
- verify object exists and URL is correct
- adjust bucket visibility/policies

---

## 14) Suggested Next Enhancements

1. Add migration tooling (Supabase CLI) for versioned schema changes.
2. Add DB backup strategy and retention policy.
3. Add audit log table for admin actions.
4. Add stricter SQL constraints and check policies for data quality.
5. Add observability (structured logs + uptime + error tracking).

---

## Quick Setup Checklist

- [ ] Supabase project created
- [ ] `supabase/schema.sql` executed
- [ ] `supabase/seed.sql` executed (optional)
- [ ] Storage bucket `products` created
- [ ] `server/.env` created and filled
- [ ] `client/.env.local` created and filled
- [ ] `npm run dev` runs both services
- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] `/api/products` returns data
- [ ] admin user created (optional)

# Supabase Setup Guide

This guide walks you through setting up Supabase for the cosmetics e-commerce project.

## 1) Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Wait for project provisioning to complete.
3. Open your project dashboard.

## 2) Get Required Keys

From **Project Settings -> API**, copy:

- `Project URL` -> `SUPABASE_URL`
- `anon public` key -> `SUPABASE_ANON_KEY` (client-side usage)
- `service_role` key -> `SUPABASE_SERVICE_KEY` (server-side only)

## 3) Run Database Schema

1. Open **SQL Editor** in Supabase.
2. Copy content from `supabase/schema.sql`.
3. Run the SQL.

This creates:

- `users`
- `categories`
- `products`
- `cart`
- `cart_items`
- `wishlist`
- `orders`
- `order_items`
- `reviews`

It also enables RLS and creates product-rating trigger logic.

## 4) Seed Initial Data (Optional)

1. In **SQL Editor**, open a new query.
2. Copy content from `supabase/seed.sql`.
3. Run the SQL.

This inserts:

- Core categories (Makeup, Skincare, Haircare, Fragrance)
- Sample cosmetics products with images, pricing, and ratings

## 5) Create Storage Bucket for Product Images

1. Go to **Storage** in Supabase dashboard.
2. Create bucket named `products`.
3. Set visibility to **Public** (for direct image URLs), or keep private and serve signed URLs from backend.

Recommended for current codebase: **Public** bucket.

## 6) Configure Backend Environment

Create `server/.env` (copy from `server/.env.example`) and fill:

```env
PORT=5000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_strong_jwt_secret
```

Important:

- Never expose `SUPABASE_SERVICE_KEY` in frontend code.
- Keep server `.env` private and out of git.

## 7) Configure Frontend Environment

Create `client/.env.local` and fill:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If needed for direct frontend Supabase usage later, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 8) Start the App

From project root:

```bash
npm run dev
```

Expected:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 9) Verify Supabase Connection

Check server health:

```bash
GET http://localhost:5000/api/health
```

Then test products endpoint:

```bash
GET http://localhost:5000/api/products
```

If schema and env are correct, you should receive product data (or an empty list if not seeded).

## 10) Create Admin User

From `server` folder:

```bash
node scripts/createAdmin.js admin@yourdomain.com yourpassword
```

Login using this admin account to access admin routes.

## Common Issues

### Error: `supabaseUrl is required`

- `server/.env` missing or `SUPABASE_URL` not set.
- Fix by creating `server/.env` and restarting backend.

### Error: invalid API key / unauthorized

- Wrong `SUPABASE_SERVICE_KEY` in backend env.
- Ensure you used the **service_role** key, not anon key.

### RLS policy errors on direct frontend queries

- Current architecture expects most DB access through backend using service key.
- If querying from frontend directly, define explicit policies for `anon`/`authenticated`.

## Security Notes

- Use backend API for privileged operations.
- Do not commit `.env` files.
- Rotate keys if leaked.
- Use a strong `JWT_SECRET` in production.

