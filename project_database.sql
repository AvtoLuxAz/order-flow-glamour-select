-- Supabase table definitions for the project

-- Drop existing tables if they exist (with CASCADE)
drop table if exists staff cascade;
drop table if exists cash cascade;
drop table if exists order_services cascade;
drop table if exists order_products cascade;
drop table if exists orders cascade;
drop table if exists customers cascade;
drop table if exists services cascade;
drop table if exists products cascade;
drop table if exists profiles cascade;
drop table if exists bookings cascade;
drop table if exists booking_services cascade;
drop table if exists booking_products cascade;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (users)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text check (role in ('admin', 'staff', 'cashier')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  quantity integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Services
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  duration integer not null, -- Duration in minutes
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Customers
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  gender text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Bookings
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) not null,
  date date not null,
  time time not null,
  notes text,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Booking Services
create table if not exists booking_services (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) not null,
  service_id uuid references services(id) not null,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Booking Products
create table if not exists booking_products (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. Cash
create table if not exists cash (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  amount numeric not null,
  type text check (type in ('in', 'out')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. Staff
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  name text not null,
  position text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert some initial services
INSERT INTO services (name, description, price, duration) VALUES
('Haircut', 'Professional haircut service', 50.00, 60),
('Hair Coloring', 'Professional hair coloring service', 100.00, 120),
('Manicure', 'Basic manicure service', 30.00, 45),
('Pedicure', 'Basic pedicure service', 40.00, 60),
('Facial', 'Basic facial treatment', 80.00, 90);

-- Insert some initial products
INSERT INTO products (name, description, price, quantity) VALUES
('Shampoo', 'Professional hair shampoo', 25.00, 50),
('Conditioner', 'Professional hair conditioner', 25.00, 50),
('Hair Spray', 'Professional hair styling spray', 20.00, 30),
('Nail Polish', 'Professional nail polish', 15.00, 100),
('Face Cream', 'Professional face cream', 40.00, 30);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_booking_services_booking_id ON booking_services(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_services_service_id ON booking_services(service_id);
CREATE INDEX IF NOT EXISTS idx_booking_products_booking_id ON booking_products(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_products_product_id ON booking_products(product_id);