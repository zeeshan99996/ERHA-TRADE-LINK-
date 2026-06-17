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
    salePrice numeric(12,2),
    stock integer default 0 not null,
    minStock integer default 10 not null,
    status text default 'Active'::text not null,
    shortDescription text,
    image text,
    brand text default 'ERHA'::text,
    sku text,
    rating numeric(3,2) default 4.50,
    reviews integer default 0,
    badge text,
    features jsonb default '[]'::jsonb,
    specifications jsonb default '{}'::jsonb,
    costPrice numeric(12,2) default 0.00,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS for products
alter table public.products enable row level security;
create policy "Allow read access to products" on public.products for select using (true);
create policy "Allow write access to products" on public.products for all using (true);


-- 3. Categories Table
create table if not exists public.categories (
    id text primary key,
    name text not null,
    slug text not null,
    parentId text,
    imageUrl text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Seed default categories
insert into public.categories (id, name, slug, parentId, imageUrl)
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
    paymentStatus text not null,
    orderStatus text not null,
    date text not null,
    address text not null,
    paymentMethod text not null,
    discountAmount numeric(12,2) default 0.00,
    shippingRate numeric(12,2) default 0.00,
    trackingNumber text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

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
    totalOrders integer default 0 not null,
    totalSpend numeric(12,2) default 0.00 not null,
    notes text,
    status text default 'Active'::text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS for customers
alter table public.customers enable row level security;
create policy "Allow read access to customers" on public.customers for select using (true);
create policy "Allow write access to customers" on public.customers for all using (true);


-- 6. Coupons Table
create table if not exists public.coupons (
    id text primary key,
    code text unique not null,
    discountType text not null,
    discountValue numeric(12,2) not null,
    minOrder numeric(12,2) default 0.00 not null,
    expiry text not null,
    maxUsage integer,
    usageCount integer default 0 not null,
    status text default 'Active'::text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

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
    orderId text not null,
    method text not null,
    amount numeric(12,2) not null,
    status text not null,
    reference text,
    date text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

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
