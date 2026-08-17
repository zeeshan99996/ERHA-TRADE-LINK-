-- ERHA Trade Link - Hostinger MySQL / MariaDB Database Schema
-- Run this script in Hostinger phpMyAdmin (SQL Tab) to initialize all tables.

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
) ON DUPLICATE KEY UPDATE `email` = `email`;


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
ON DUPLICATE KEY UPDATE `id` = `id`;


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
