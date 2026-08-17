-- ERHA Trade Link - Complete Hostinger MySQL / MariaDB Database Schema & Seed Data
-- Run this script in Hostinger phpMyAdmin (SQL Tab) to initialize all tables and initial data.

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` TEXT NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'Super Admin',
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default admin account
INSERT INTO `admins` (`id`, `email`, `password`, `role`, `name`)
VALUES (
    'admin-3',
    'muhammadzeeshan0477@gmail.com',
    'Erha@1122',
    'Super Admin',
    'Muhammad Zeeshan'
) ON DUPLICATE KEY UPDATE `email` = VALUES(`email`), `password` = VALUES(`password`);


-- 2. Products Table
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) DEFAULT NULL,
    `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `saleprice` DECIMAL(12,2) DEFAULT NULL,
    `stock` INT NOT NULL DEFAULT 0,
    `minstock` INT NOT NULL DEFAULT 10,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Active',
    `shortdescription` TEXT DEFAULT NULL,
    `image` TEXT DEFAULT NULL,
    `brand` VARCHAR(100) DEFAULT 'ERHA',
    `sku` VARCHAR(100) DEFAULT NULL,
    `rating` DECIMAL(3,2) DEFAULT 4.50,
    `reviews` INT DEFAULT 0,
    `badge` VARCHAR(100) DEFAULT NULL,
    `features` JSON DEFAULT NULL,
    `specifications` JSON DEFAULT NULL,
    `costprice` DECIMAL(12,2) DEFAULT 0.00,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default products
INSERT INTO `products` (`id`, `name`, `category`, `price`, `saleprice`, `stock`, `minstock`, `status`, `shortdescription`, `image`, `brand`, `sku`, `rating`, `reviews`, `badge`, `features`, `specifications`, `costprice`)
VALUES 
(
  'prd-pzx-v91',
  'PZX V91 Power Bank (10,000mAh)',
  'Ultra Compact',
  4500.00,
  3000.00,
  100,
  10,
  'Active',
  'Stay powered all day with the PZX V91 - a high-capacity 10,000mAh lithium battery power bank. Ultra-compact, fast-charging, and built for reliability.',
  'https://images.unsplash.com/photo-1609592424083-d5d14dfc949a?w=600',
  'PZX',
  'PZX-V91-001',
  4.80,
  95,
  'Featured',
  '[\"10,000mAh lithium polymer battery\", \"Dual USB outputs with smart charging\", \"Micro-USB and USB-C inputs\", \"LED indicators for battery status\"]',
  '{\"Capacity\": \"10,000mAh\", \"Input\": \"5V-2A (Type-C / Micro-USB)\", \"Output\": \"5V-2A Max (Dual USB-A)\", \"Battery Type\": \"Lithium Polymer\"}',
  1800.00
),
(
  'PRD-1784188637864',
  'ERHA MagSafe 10K Wireless Power Bank',
  'MagSafe & Wireless',
  6500.00,
  4999.00,
  45,
  5,
  'Active',
  'Ultra-slim 10,000mAh magnetic wireless power bank with premium leather finish and built-in kickstand.',
  'https://images.unsplash.com/photo-1609592424083-d5d14dfc949a?w=600',
  'ERHA',
  'ERH-PRD-SEED-001',
  4.80,
  124,
  'Best Seller',
  '[\"15W MagSafe compatible wireless charging\", \"20W Power Delivery USB-C port for fast input/output\", \"Foldable leather kickstand for hands-free viewing\", \"Smart LED battery percentage display\"]',
  '{\"Capacity\": \"10,000mAh / 37Wh\", \"Wireless Output\": \"5W / 7.5W / 10W / 15W\", \"USB-C Input/Output\": \"5V-3A / 9V-2.22A / 12V-1.67A (20W Max)\", \"Dimensions\": \"104 x 68 x 16 mm\", \"Weight\": \"185g\"}',
  3000.00
),
(
  'PRD-1784188637865',
  'ERHA AeroCompact 10K Mini Charger',
  'Ultra Compact',
  3500.00,
  2499.00,
  85,
  10,
  'Active',
  'Pocket-sized credit-card format 10,000mAh power bank featuring dual port fast charging and premium aluminum casing.',
  'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=600',
  'ERHA',
  'ERH-PRD-SEED-002',
  4.60,
  89,
  'Trending',
  '[\"Ultra-compact credit card footprint\", \"Dual USB-A and USB-C output ports\", \"22.5W Super Fast Charging support\", \"Ergonomic anodized aluminum body\"]',
  '{\"Capacity\": \"10,000mAh / 37Wh\", \"USB-C Output (PD 3.0)\": \"20W Max\", \"USB-A Output (QC 4.0)\": \"22.5W Max\", \"Dimensions\": \"79 x 56 x 22 mm\", \"Weight\": \"165g\"}',
  1500.00
),
(
  'PRD-1784188637866',
  'ERHA PowerStation 20K SuperPD 65W',
  'Laptop Power Banks',
  9999.00,
  7499.00,
  30,
  5,
  'Active',
  'Heavy-duty 20,000mAh laptop-class power bank with huge 65W Power Delivery output, perfect for MacBooks and iPads.',
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600',
  'ERHA',
  'ERH-PRD-SEED-003',
  4.90,
  67,
  'Pro Choice',
  '[\"Massive 65W USB-C output to charge laptops at full speed\", \"Huge 20,000mAh capacity to double your laptop battery life\", \"Low current mode for AirPods and smartwatches\", \"Flame-retardant PC/ABS shell with carbon texture\"]',
  '{\"Capacity\": \"20,000mAh / 74Wh\", \"USB-C Output (PD 65W)\": \"5V-3A / 9V-3A / 12V-3A / 15V-3A / 20V-3.25A\", \"Total Ports\": \"2x USB-C, 1x USB-A\", \"Dimensions\": \"145 x 68 x 28 mm\", \"Weight\": \"380g\"}',
  4800.00
)
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `category` = VALUES(`category`),
  `price` = VALUES(`price`),
  `saleprice` = VALUES(`saleprice`),
  `stock` = VALUES(`stock`),
  `minstock` = VALUES(`minstock`),
  `status` = VALUES(`status`),
  `shortdescription` = VALUES(`shortdescription`),
  `brand` = VALUES(`brand`),
  `sku` = VALUES(`sku`),
  `rating` = VALUES(`rating`),
  `reviews` = VALUES(`reviews`),
  `badge` = VALUES(`badge`),
  `features` = VALUES(`features`),
  `specifications` = VALUES(`specifications`),
  `costprice` = VALUES(`costprice`);


-- 3. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `parentid` VARCHAR(100) DEFAULT NULL,
    `imageurl` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default categories
INSERT INTO `categories` (`id`, `name`, `slug`, `parentid`, `imageurl`)
VALUES 
  ('cat1', 'Ultra Compact', 'ultra-compact', NULL, 'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400'),
  ('cat2', 'High Capacity', 'high-capacity', NULL, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'),
  ('cat3', 'MagSafe & Wireless', 'magsafe-wireless', NULL, 'https://images.unsplash.com/photo-1609592424083-d5d14dfc949a?w=400'),
  ('cat4', 'Laptop Power Banks', 'laptop-power-banks', NULL, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'),
  ('cat5', 'Rugged & Solar', 'rugged-solar', NULL, 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=400')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `slug` = VALUES(`slug`), `imageurl` = VALUES(`imageurl`);


-- 4. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `customer` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `items` JSON NOT NULL,
    `total` DECIMAL(12,2) NOT NULL,
    `paymentstatus` VARCHAR(50) NOT NULL,
    `orderstatus` VARCHAR(50) NOT NULL,
    `date` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `paymentmethod` VARCHAR(50) NOT NULL,
    `discountamount` DECIMAL(12,2) DEFAULT 0.00,
    `shippingrate` DECIMAL(12,2) DEFAULT 0.00,
    `trackingnumber` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. Customers Table
CREATE TABLE IF NOT EXISTS `customers` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(50) DEFAULT NULL,
    `address` TEXT DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `totalorders` INT NOT NULL DEFAULT 0,
    `totalspend` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `notes` TEXT DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. Coupons Table
CREATE TABLE IF NOT EXISTS `coupons` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `code` VARCHAR(100) NOT NULL UNIQUE,
    `discounttype` VARCHAR(50) NOT NULL,
    `discountvalue` DECIMAL(12,2) NOT NULL,
    `minorder` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `expiry` VARCHAR(100) NOT NULL,
    `maxusage` INT DEFAULT NULL,
    `usagecount` INT NOT NULL DEFAULT 0,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 7. Expenses Table
CREATE TABLE IF NOT EXISTS `expenses` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `category` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `date` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 8. Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `orderid` VARCHAR(100) NOT NULL,
    `method` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `reference` VARCHAR(255) DEFAULT NULL,
    `date` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `read` TINYINT(1) NOT NULL DEFAULT 0,
    `time` VARCHAR(100) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
