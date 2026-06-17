-- ERHA Trade Link - Complete Supabase Database Schema
-- Run this script in your Supabase SQL Editor to initialize all tables.

-- 1. Admins Table
create table if not exists public.admins (
    id uuid default gen_random_uuid() primary key,
    email text unique not null,
    password text not null,
    role text default 'Super Admin'::text not null,
    name text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Seed initial admin account
insert into public.admins (email, password, role, name)
values (
    'admin@erha.pk',
    'admin123',
    'Super Admin',
    'Admin User'
)
on conflict (email) do nothing;

-- Enable Row Level Security (RLS) for admins
alter table public.admins enable row level security;
create policy "Allow read access to admins" on public.admins for select using (true);


-- 2. Products Table
create table if not exists public.products (
    id text primary key,
    name text not null,
    category text,
    price numeric(12,2) default 0.00 not null,
    saleprice numeric(12,2),
    stock integer default 0 not null,
    minstock integer default 10 not null,
    status text default 'Active'::text not null,
    shortdescription text,
    image text,
    brand text default 'ERHA'::text,
    sku text,
    rating numeric(3,2) default 4.50,
    reviews integer default 0,
    badge text,
    features jsonb default '[]'::jsonb,
    specifications jsonb default '{}'::jsonb,
    costprice numeric(12,2) default 0.00,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Run this to fix existing table if columns were created with camelCase:
-- alter table public.products rename column if exists "salePrice" to saleprice;
-- alter table public.products rename column if exists "minStock" to minstock;
-- alter table public.products rename column if exists "shortDescription" to shortdescription;
-- alter table public.products rename column if exists "costPrice" to costprice;

-- Enable RLS for products
alter table public.products enable row level security;
create policy "Allow read access to products" on public.products for select using (true);
create policy "Allow write access to products" on public.products for all using (true);


-- 3. Categories Table
create table if not exists public.categories (
    id text primary key,
    name text not null,
    slug text not null,
    parentid text,
    imageurl text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Run to fix existing table if columns were created with camelCase:
-- alter table public.categories rename column if exists "parentId" to parentid;
-- alter table public.categories rename column if exists "imageUrl" to imageurl;

-- Seed default categories
insert into public.categories (id, name, slug, parentid, imageurl)
values 
  ('cat1', 'Ultra Compact', 'ultra-compact', null, 'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400'),
  ('cat2', 'High Capacity', 'high-capacity', null, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'),
  ('cat3', 'MagSafe & Wireless', 'magsafe-wireless', null, 'https://images.unsplash.com/photo-1609592424083-d5d14dfc949a?w=400'),
  ('cat4', 'Laptop Power Banks', 'laptop-power-banks', null, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'),
  ('cat5', 'Rugged & Solar', 'rugged-solar', null, 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=400')
on conflict (id) do nothing;

-- Enable RLS for categories
alter table public.categories enable row level security;
create policy "Allow read access to categories" on public.categories for select using (true);
create policy "Allow write access to categories" on public.categories for all using (true);


-- 4. Orders Table
create table if not exists public.orders (
    id text primary key,
    customer text not null,
    email text not null,
    phone text not null,
    items text[] not null,
    total numeric(12,2) not null,
    paymentstatus text not null,
    orderstatus text not null,
    date text not null,
    address text not null,
    paymentmethod text not null,
    discountamount numeric(12,2) default 0.00,
    shippingrate numeric(12,2) default 0.00,
    trackingnumber text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Run to fix existing table if columns were created with camelCase:
-- alter table public.orders rename column if exists "paymentStatus" to paymentstatus;
-- alter table public.orders rename column if exists "orderStatus" to orderstatus;
-- alter table public.orders rename column if exists "paymentMethod" to paymentmethod;
-- alter table public.orders rename column if exists "discountAmount" to discountamount;
-- alter table public.orders rename column if exists "shippingRate" to shippingrate;
-- alter table public.orders rename column if exists "trackingNumber" to trackingnumber;

-- Enable RLS for orders
alter table public.orders enable row level security;
create policy "Allow read access to orders" on public.orders for select using (true);
create policy "Allow write access to orders" on public.orders for all using (true);


-- 5. Customers Table
create table if not exists public.customers (
    id text primary key,
    name text not null,
    email text unique not null,
    phone text,
    address text,
    city text,
    totalorders integer default 0 not null,
    totalspend numeric(12,2) default 0.00 not null,
    notes text,
    status text default 'Active'::text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Run to fix existing table if columns were created with camelCase:
-- alter table public.customers rename column if exists "totalOrders" to totalorders;
-- alter table public.customers rename column if exists "totalSpend" to totalspend;

-- Enable RLS for customers
alter table public.customers enable row level security;
create policy "Allow read access to customers" on public.customers for select using (true);
create policy "Allow write access to customers" on public.customers for all using (true);


-- 6. Coupons Table
create table if not exists public.coupons (
    id text primary key,
    code text unique not null,
    discounttype text not null,
    discountvalue numeric(12,2) not null,
    minorder numeric(12,2) default 0.00 not null,
    expiry text not null,
    maxusage integer,
    usagecount integer default 0 not null,
    status text default 'Active'::text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Run to fix existing table if columns were created with camelCase:
-- alter table public.coupons rename column if exists "discountType" to discounttype;
-- alter table public.coupons rename column if exists "discountValue" to discountvalue;
-- alter table public.coupons rename column if exists "minOrder" to minorder;
-- alter table public.coupons rename column if exists "maxUsage" to maxusage;
-- alter table public.coupons rename column if exists "usageCount" to usagecount;

-- Enable RLS for coupons
alter table public.coupons enable row level security;
create policy "Allow read access to coupons" on public.coupons for select using (true);
create policy "Allow write access to coupons" on public.coupons for all using (true);


-- 7. Expenses Table
create table if not exists public.expenses (
    id text primary key,
    category text not null,
    amount numeric(12,2) not null,
    description text,
    date text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS for expenses
alter table public.expenses enable row level security;
create policy "Allow read access to expenses" on public.expenses for select using (true);
create policy "Allow write access to expenses" on public.expenses for all using (true);


-- 8. Payments Table
create table if not exists public.payments (
    id text primary key,
    orderid text not null,
    method text not null,
    amount numeric(12,2) not null,
    status text not null,
    reference text,
    date text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Run to fix existing table if columns were created with camelCase:
-- alter table public.payments rename column if exists "orderId" to orderid;

-- Enable RLS for payments
alter table public.payments enable row level security;
create policy "Allow read access to payments" on public.payments for select using (true);
create policy "Allow write access to payments" on public.payments for all using (true);


-- 9. Notifications Table
create table if not exists public.notifications (
    id text primary key,
    read boolean default false not null,
    time text not null,
    type text not null,
    title text not null,
    description text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS for notifications
alter table public.notifications enable row level security;
create policy "Allow read access to notifications" on public.notifications for select using (true);
create policy "Allow write access to notifications" on public.notifications for all using (true);
