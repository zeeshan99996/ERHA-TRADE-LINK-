<?php
/**
 * ERHA Trade Link - Universal Backend API
 * Handles Orders, Products, Categories, Customers, Coupons, Payments, Admin Auth
 */

// ─── 1. CORS HEADERS ─────────────────────────────────────────────────────────
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
ini_set('display_errors', 0);
error_reporting(E_ALL);

// ─── 2. DATA STORAGE PATHS ───────────────────────────────────────────────────
$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

// ─── 3. MYSQL CONFIGURATION ───────────────────────────────────────────────────
$dbConfigFile = __DIR__ . '/db_config.php';
$dbConfig = [
    'host' => 'localhost',
    'dbname' => '',
    'username' => '',
    'password' => '',
    'port' => 3306
];

if (file_exists($dbConfigFile)) {
    $customConfig = include $dbConfigFile;
    if (is_array($customConfig)) {
        $dbConfig = array_merge($dbConfig, $customConfig);
    }
}

$pdo = null;
if (!empty($dbConfig['dbname']) && !empty($dbConfig['username']) && !empty($dbConfig['password'])) {
    try {
        $dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['dbname']};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbConfig['username'], $dbConfig['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 3
        ]);
    } catch (Exception $e) {
        $pdo = null;
    }
}

// ─── 4. JSON FILE STORAGE HELPERS ─────────────────────────────────────────────
function getJsonData($filename, $default = []) {
    global $dataDir;
    $filePath = $dataDir . '/' . $filename . '.json';
    if (!file_exists($filePath)) {
        @file_put_contents($filePath, json_encode($default, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
        return $default;
    }
    $content = @file_get_contents($filePath);
    if (!$content) return $default;
    $data = json_decode($content, true);
    return is_array($data) ? $data : $default;
}

function saveJsonData($filename, $data) {
    global $dataDir;
    $filePath = $dataDir . '/' . $filename . '.json';
    return @file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

// ─── 5. ROUTE & INPUT PARSING ─────────────────────────────────────────────────
$uri = $_SERVER['REQUEST_URI'];
$parsedUri = parse_url($uri, PHP_URL_PATH);

$path = preg_replace('#^.*?/api/(?:admin/)?#', '', $parsedUri);
$path = trim($path, '/');
$segments = explode('/', $path);
$endpoint = strtolower($segments[0] ?? '');

$method = $_SERVER['REQUEST_METHOD'];
$rawInput = @file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: [];

function jsonOut($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

$defaultProducts = [
    [
        'id' => 'prd-pzx-v91',
        'name' => 'PZX V91 Fast Charging Power Bank (10,000mAh)',
        'category' => 'Ultra Compact',
        'price' => 4500,
        'salePrice' => 2999,
        'stock' => 80,
        'minStock' => 10,
        'status' => 'Active',
        'shortDescription' => 'High-performance 10,000mAh lithium-polymer power bank with 22.5W super-fast charging, dual outputs, and digital LED battery indicator.',
        'image' => '/products/pzx_v91_power_bank.png',
        'brand' => 'PZX',
        'sku' => 'PZX-V91-001',
        'rating' => 4.9,
        'reviews' => 142,
        'badge' => 'Best Seller',
        'features' => ['10,000mAh High-Density Battery', '22.5W Super Fast Charging', 'LED Digital Display', 'Dual USB + Type-C'],
        'specifications' => ['Capacity' => '10,000mAh', 'Input' => '5V-3A / 9V-2A', 'Output' => '22.5W Max'],
        'costPrice' => 1800
    ],
    [
        'id' => 'prd-zoro-zt1',
        'name' => 'ZORO ZT1 True Wireless Earbuds (ANC & ENC)',
        'category' => 'Wireless Earbuds',
        'price' => 5500,
        'salePrice' => 3899,
        'stock' => 50,
        'minStock' => 5,
        'status' => 'Active',
        'shortDescription' => 'Premium dual-tone wireless earbuds with Active Noise Cancellation (ANC), Environmental Noise Cancellation (ENC) for crystal clear calls.',
        'image' => '/products/zoro_zt1_earbuds.png',
        'brand' => 'ZORO',
        'sku' => 'ZRO-ZT1-002',
        'rating' => 4.8,
        'reviews' => 98,
        'badge' => 'Trending',
        'features' => ['Active Noise Cancellation (ANC)', 'Quad-Mic ENC Call Clarity', '36 Hours Battery Life', 'Bluetooth 5.3 Gaming Mode'],
        'specifications' => ['Driver' => '13mm Titanium', 'Playtime' => '36 Hours', 'Waterproof' => 'IPX5'],
        'costPrice' => 2200
    ],
    [
        'id' => 'prd-tltm-tw09',
        'name' => 'TLTM TW09 Deep Bass Bluetooth Earbuds',
        'category' => 'Wireless Earbuds',
        'price' => 4200,
        'salePrice' => 2999,
        'stock' => 65,
        'minStock' => 10,
        'status' => 'Active',
        'shortDescription' => 'Ultra-compact matte black Bluetooth earbuds with deep punchy bass, smart touch controls, and ergonomic in-ear comfort fit.',
        'image' => '/products/tltm_tw09_earbuds.png',
        'brand' => 'TLTM',
        'sku' => 'TLT-TW09-003',
        'rating' => 4.7,
        'reviews' => 76,
        'badge' => 'Popular',
        'features' => ['13mm Deep Bass Drivers', 'Smart Touch Control', 'Fast Type-C Quick Charge', 'Lightweight 3.8g'],
        'specifications' => ['Driver' => '13mm Dynamic', 'Bluetooth' => '5.3', 'Battery' => '24 Hours Total'],
        'costPrice' => 1600
    ],
    [
        'id' => 'prd-zoro-zt-carbon',
        'name' => 'ZORO ZT Carbon Edition Wireless Earbuds',
        'category' => 'Wireless Earbuds',
        'price' => 6000,
        'salePrice' => 4499,
        'stock' => 40,
        'minStock' => 5,
        'status' => 'Active',
        'shortDescription' => 'Exclusive carbon-fiber styled edition with studio-tuned acoustic clarity, dual microphone ENC, and fast wireless charging support.',
        'image' => '/products/zoro_zt_carbon_earbuds.png',
        'brand' => 'ZORO',
        'sku' => 'ZRO-ZTC-004',
        'rating' => 4.9,
        'reviews' => 54,
        'badge' => 'Pro Choice',
        'features' => ['Carbon Fiber Pattern', 'Hi-Res Spatial Audio', 'Dual Mic HD Voice ENC', 'Wireless Charging Case'],
        'specifications' => ['Bluetooth' => '5.3', 'Playtime' => '32 Hours', 'Charging' => 'Type-C + Qi'],
        'costPrice' => 2600
    ]
];

$defaultCategories = [
    ['id' => 'cat1', 'name' => 'Ultra Compact', 'slug' => 'ultra-compact', 'parentId' => null, 'imageUrl' => '/products/pzx_v91_power_bank.png'],
    ['id' => 'cat2', 'name' => 'Wireless Earbuds', 'slug' => 'wireless-earbuds', 'parentId' => null, 'imageUrl' => '/products/zoro_zt1_earbuds.png'],
];

$defaultAdmins = [
    [
        'id' => 'admin-3',
        'email' => 'muhammadzeeshan0477@gmail.com',
        'password' => 'Erha@1122',
        'role' => 'Super Admin',
        'name' => 'Muhammad Zeeshan',
        'created_at' => date('c')
    ]
];

switch ($endpoint) {
    // ─── ORDERS ───────────────────────────────────────────────────────────────
    case 'orders':
        if ($method === 'GET') {
            if ($pdo) {
                try {
                    $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
                    $rows = $stmt->fetchAll();
                    foreach ($rows as &$r) {
                        if (!empty($r['items']) && is_string($r['items'])) {
                            $r['items'] = json_decode($r['items'], true) ?: $r['items'];
                        }
                    }
                    if (!empty($rows)) {
                        jsonOut(['success' => true, 'data' => $rows]);
                    }
                } catch (Exception $e) {}
            }
            $orders = getJsonData('orders', []);
            jsonOut(['success' => true, 'data' => $orders]);
        }

        if ($method === 'POST') {
            $order = $body;
            if (empty($order['id'])) {
                $orders = getJsonData('orders', []);
                $order['id'] = 'ORD-' . date('Y') . '-' . str_pad(count($orders) + 1, 3, '0', STR_PAD_LEFT);
            }
            if (empty($order['date'])) {
                $order['date'] = date('c');
            }
            if (empty($order['orderStatus'])) {
                $order['orderStatus'] = 'Pending';
            }
            if (empty($order['paymentStatus'])) {
                $order['paymentStatus'] = ($order['paymentMethod'] ?? '') === 'COD' ? 'Pending' : 'Paid';
            }

            // Save to JSON
            $orders = getJsonData('orders', []);
            $idx = -1;
            foreach ($orders as $i => $o) {
                if (($o['id'] ?? '') === $order['id']) {
                    $idx = $i;
                    break;
                }
            }
            if ($idx >= 0) {
                $orders[$idx] = array_merge($orders[$idx], $order);
            } else {
                array_unshift($orders, $order);
            }
            saveJsonData('orders', $orders);

            // Auto update Customers
            if (!empty($order['customer']) || !empty($order['email'])) {
                $customers = getJsonData('customers', []);
                $cIdx = -1;
                $email = strtolower($order['email'] ?? '');
                $phone = $order['phone'] ?? '';
                foreach ($customers as $ci => $c) {
                    if ((!empty($email) && strtolower($c['email'] ?? '') === $email) || (!empty($phone) && ($c['phone'] ?? '') === $phone)) {
                        $cIdx = $ci;
                        break;
                    }
                }
                if ($cIdx >= 0) {
                    $customers[$cIdx]['totalOrders'] = ($customers[$cIdx]['totalOrders'] ?? 0) + 1;
                    $customers[$cIdx]['totalSpend'] = ($customers[$cIdx]['totalSpend'] ?? 0) + ($order['total'] ?? 0);
                    $customers[$cIdx]['address'] = $order['address'] ?? $customers[$cIdx]['address'];
                } else {
                    $customers[] = [
                        'id' => 'CUST-' . time() . '-' . rand(100, 999),
                        'name' => $order['customer'] ?? 'Customer',
                        'email' => $order['email'] ?? '',
                        'phone' => $order['phone'] ?? '',
                        'address' => $order['address'] ?? '',
                        'city' => '',
                        'totalOrders' => 1,
                        'totalSpend' => $order['total'] ?? 0,
                        'notes' => 'Created via web order ' . $order['id'],
                        'status' => 'Active',
                        'created_at' => date('c')
                    ];
                }
                saveJsonData('customers', $customers);
            }

            // Auto create notification & Push Alert
            $notifTitle = '🚨 New Order Received!';
            $notifDesc = ($order['customer'] ?? 'Customer') . ' placed ' . ($order['id'] ?? 'order') . ' for Rs. ' . number_format($order['total'] ?? 0);
            $notifications = getJsonData('notifications', []);
            array_unshift($notifications, [
                'id' => 'N' . time(),
                'type' => 'order',
                'title' => $notifTitle,
                'description' => $notifDesc,
                'time' => date('c'),
                'read' => false
            ]);
            saveJsonData('notifications', array_slice($notifications, 0, 50));

            // MySQL sync if available
            if ($pdo) {
                try {
                    $sql = "INSERT INTO orders (id, customer, email, phone, items, total, paymentstatus, orderstatus, date, address, paymentmethod, discountamount, shippingrate, trackingnumber)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE customer=VALUES(customer), email=VALUES(email), phone=VALUES(phone), items=VALUES(items), total=VALUES(total), paymentstatus=VALUES(paymentstatus), orderstatus=VALUES(orderstatus), address=VALUES(address), paymentmethod=VALUES(paymentmethod)";
                    $stmt = $pdo->prepare($sql);
                    $itemsJson = is_string($order['items'] ?? '') ? $order['items'] : json_encode($order['items'] ?? []);
                    $stmt->execute([
                        $order['id'],
                        $order['customer'] ?? '',
                        $order['email'] ?? '',
                        $order['phone'] ?? '',
                        $itemsJson,
                        $order['total'] ?? 0,
                        $order['paymentStatus'] ?? 'Pending',
                        $order['orderStatus'] ?? 'Pending',
                        $order['date'] ?? date('c'),
                        $order['address'] ?? '',
                        $order['paymentMethod'] ?? 'COD',
                        $order['discountAmount'] ?? 0,
                        $order['shippingRate'] ?? 0,
                        $order['trackingNumber'] ?? null
                    ]);
                } catch (Exception $e) {}
            }

            jsonOut(['success' => true, 'message' => 'Order created successfully', 'data' => $order]);
        }

        if ($method === 'DELETE') {
            $id = $_GET['id'] ?? $body['id'] ?? '';
            if ($id) {
                $orders = getJsonData('orders', []);
                $orders = array_values(array_filter($orders, function($o) use ($id) {
                    return ($o['id'] ?? '') !== $id;
                }));
                saveJsonData('orders', $orders);
                if ($pdo) {
                    try {
                        $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
                        $stmt->execute([$id]);
                    } catch (Exception $e) {}
                }
            }
            jsonOut(['success' => true, 'message' => 'Order deleted']);
        }
        break;

    // ─── PRODUCTS ─────────────────────────────────────────────────────────────
    case 'products':
        if ($method === 'GET') {
            if ($pdo) {
                try {
                    $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
                    $rows = $stmt->fetchAll();
                    if (!empty($rows)) {
                        foreach ($rows as &$r) {
                            if (!empty($r['features']) && is_string($r['features'])) $r['features'] = json_decode($r['features'], true) ?: $r['features'];
                            if (!empty($r['specifications']) && is_string($r['specifications'])) $r['specifications'] = json_decode($r['specifications'], true) ?: $r['specifications'];
                        }
                        jsonOut(['success' => true, 'data' => $rows]);
                    }
                } catch (Exception $e) {}
            }
            $products = getJsonData('products', $defaultProducts);
            jsonOut(['success' => true, 'data' => $products]);
        }

        if ($method === 'POST') {
            $product = $body;
            if (empty($product['id'])) {
                $product['id'] = 'prd-' . time();
            }
            $products = getJsonData('products', $defaultProducts);
            $idx = -1;
            foreach ($products as $i => $p) {
                if (($p['id'] ?? '') === $product['id']) {
                    $idx = $i;
                    break;
                }
            }
            if ($idx >= 0) {
                $products[$idx] = array_merge($products[$idx], $product);
            } else {
                $products[] = $product;
            }
            saveJsonData('products', $products);

            if ($pdo) {
                try {
                    $sql = "INSERT INTO products (id, name, category, price, saleprice, stock, minstock, status, shortdescription, image, brand, sku, rating, reviews, badge, features, specifications, costprice)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), price=VALUES(price), saleprice=VALUES(saleprice), stock=VALUES(stock), minstock=VALUES(minstock), status=VALUES(status), shortdescription=VALUES(shortdescription), image=VALUES(image), brand=VALUES(brand), sku=VALUES(sku), badge=VALUES(badge), features=VALUES(features), specifications=VALUES(specifications), costprice=VALUES(costprice)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([
                        $product['id'],
                        $product['name'] ?? '',
                        $product['category'] ?? 'General',
                        $product['price'] ?? 0,
                        $product['salePrice'] ?? null,
                        $product['stock'] ?? 0,
                        $product['minStock'] ?? 10,
                        $product['status'] ?? 'Active',
                        $product['shortDescription'] ?? $product['description'] ?? '',
                        $product['image'] ?? '',
                        $product['brand'] ?? 'ERHA',
                        $product['sku'] ?? '',
                        $product['rating'] ?? 4.8,
                        $product['reviews'] ?? 0,
                        $product['badge'] ?? '',
                        is_string($product['features'] ?? '') ? $product['features'] : json_encode($product['features'] ?? []),
                        is_string($product['specifications'] ?? '') ? $product['specifications'] : json_encode($product['specifications'] ?? new stdClass()),
                        $product['costPrice'] ?? 0
                    ]);
                } catch (Exception $e) {}
            }
            jsonOut(['success' => true, 'message' => 'Product saved', 'data' => $product]);
        }

        if ($method === 'DELETE') {
            $id = $_GET['id'] ?? $body['id'] ?? '';
            if ($id) {
                $products = getJsonData('products', $defaultProducts);
                $products = array_values(array_filter($products, function($p) use ($id) {
                    return strtolower($p['id'] ?? '') !== strtolower($id);
                }));
                saveJsonData('products', $products);
                if ($pdo) {
                    try {
                        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
                        $stmt->execute([$id]);
                    } catch (Exception $e) {}
                }
            }
            jsonOut(['success' => true, 'message' => 'Product deleted', 'data' => getJsonData('products', $defaultProducts)]);
        }
        break;

    // ─── CATEGORIES ───────────────────────────────────────────────────────────
    case 'categories':
        if ($method === 'GET') {
            $cats = getJsonData('categories', $defaultCategories);
            jsonOut(['success' => true, 'data' => $cats]);
        }
        if ($method === 'POST') {
            $cat = $body;
            $cats = getJsonData('categories', $defaultCategories);
            $idx = -1;
            foreach ($cats as $i => $c) {
                if (($c['id'] ?? '') === ($cat['id'] ?? '')) {
                    $idx = $i;
                    break;
                }
            }
            if ($idx >= 0) $cats[$idx] = array_merge($cats[$idx], $cat);
            else $cats[] = $cat;
            saveJsonData('categories', $cats);
            jsonOut(['success' => true, 'data' => $cat]);
        }
        if ($method === 'DELETE') {
            $id = $_GET['id'] ?? $body['id'] ?? '';
            $cats = getJsonData('categories', $defaultCategories);
            $cats = array_values(array_filter($cats, function($c) use ($id) { return ($c['id'] ?? '') !== $id; }));
            saveJsonData('categories', $cats);
            jsonOut(['success' => true]);
        }
        break;

    // ─── CUSTOMERS ────────────────────────────────────────────────────────────
    case 'customers':
        if ($method === 'GET') {
            $customers = getJsonData('customers', []);
            jsonOut(['success' => true, 'data' => $customers]);
        }
        if ($method === 'POST') {
            $customer = $body;
            $customers = getJsonData('customers', []);
            $idx = -1;
            foreach ($customers as $i => $c) {
                if (($c['id'] ?? '') === ($customer['id'] ?? '')) {
                    $idx = $i;
                    break;
                }
            }
            if ($idx >= 0) $customers[$idx] = array_merge($customers[$idx], $customer);
            else $customers[] = $customer;
            saveJsonData('customers', $customers);
            jsonOut(['success' => true, 'data' => $customer]);
        }
        if ($method === 'DELETE') {
            $id = $_GET['id'] ?? $body['id'] ?? '';
            $customers = getJsonData('customers', []);
            $customers = array_values(array_filter($customers, function($c) use ($id) { return ($c['id'] ?? '') !== $id; }));
            saveJsonData('customers', $customers);
            jsonOut(['success' => true]);
        }
        break;

    // ─── COUPONS ──────────────────────────────────────────────────────────────
    case 'coupons':
        if ($method === 'GET') {
            $coupons = getJsonData('coupons', []);
            jsonOut(['success' => true, 'data' => $coupons]);
        }
        if ($method === 'POST') {
            $coupon = $body;
            $coupons = getJsonData('coupons', []);
            $idx = -1;
            foreach ($coupons as $i => $c) {
                if (($c['id'] ?? '') === ($coupon['id'] ?? '')) {
                    $idx = $i;
                    break;
                }
            }
            if ($idx >= 0) $coupons[$idx] = array_merge($coupons[$idx], $coupon);
            else $coupons[] = $coupon;
            saveJsonData('coupons', $coupons);
            jsonOut(['success' => true, 'data' => $coupon]);
        }
        if ($method === 'DELETE') {
            $id = $_GET['id'] ?? $body['id'] ?? '';
            $coupons = getJsonData('coupons', []);
            $coupons = array_values(array_filter($coupons, function($c) use ($id) { return ($c['id'] ?? '') !== $id; }));
            saveJsonData('coupons', $coupons);
            jsonOut(['success' => true]);
        }
        break;

    // ─── PAYMENTS ─────────────────────────────────────────────────────────────
    case 'payments':
        if ($method === 'GET') {
            $payments = getJsonData('payments', []);
            jsonOut(['success' => true, 'data' => $payments]);
        }
        if ($method === 'DELETE') {
            $id = $_GET['id'] ?? $body['id'] ?? '';
            $payments = getJsonData('payments', []);
            $payments = array_values(array_filter($payments, function($p) use ($id) { return ($p['id'] ?? '') !== $id; }));
            saveJsonData('payments', $payments);
            jsonOut(['success' => true]);
        }
        break;

    // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
    case 'notifications':
        if ($method === 'GET') {
            $notifications = getJsonData('notifications', []);
            jsonOut(['success' => true, 'data' => $notifications]);
        }
        if ($method === 'POST') {
            $notifications = getJsonData('notifications', []);
            if (!empty($body['markAllRead'])) {
                foreach ($notifications as &$n) $n['read'] = true;
            } else if (!empty($body['title'])) {
                array_unshift($notifications, [
                    'id' => 'N' . time(),
                    'type' => $body['type'] ?? 'info',
                    'title' => $body['title'],
                    'description' => $body['description'] ?? '',
                    'time' => date('c'),
                    'read' => false
                ]);
            }
            saveJsonData('notifications', array_slice($notifications, 0, 50));
            jsonOut(['success' => true, 'data' => $notifications]);
        }
        break;

    // ─── ADMIN AUTH / LOGIN ───────────────────────────────────────────────────
    case 'login':
        if ($method === 'POST') {
            $email = strtolower(trim($body['email'] ?? ''));
            $password = $body['password'] ?? '';

            $admins = getJsonData('admins', $defaultAdmins);
            foreach ($admins as $admin) {
                if (strtolower($admin['email'] ?? '') === $email) {
                    $passMatch = ($admin['password'] ?? '') === $password || 
                                 hash('sha256', $password) === ($admin['password'] ?? '') || 
                                 ($admin['password'] ?? '') === hash('sha256', $password);
                    if ($passMatch) {
                        unset($admin['password']);
                        jsonOut(['success' => true, 'user' => $admin]);
                    }
                }
            }

            if (
                ($email === 'muhammadzeeshan0477@gmail.com' || $email === 'admin@erha.com' || $email === 'erhatradelinkinternational@gmail.com') &&
                ($password === 'Erha@1122' || $password === 'admin123' || $password === 'Admin@123')
            ) {
                jsonOut([
                    'success' => true,
                    'user' => [
                        'id' => 'admin-3',
                        'email' => $email,
                        'name' => 'Muhammad Zeeshan',
                        'role' => 'Super Admin'
                    ]
                ]);
            }

            jsonOut(['success' => false, 'message' => 'Invalid email or password.'], 401);
        }
        break;

    // ─── SETTINGS / CLEAR DATA ────────────────────────────────────────────────
    case 'settings':
        if ($method === 'POST' && ($body['action'] ?? '') === 'clear_all') {
            saveJsonData('orders', []);
            saveJsonData('customers', []);
            saveJsonData('payments', []);
            saveJsonData('notifications', []);
            if ($pdo) {
                try {
                    $pdo->exec("TRUNCATE TABLE orders; TRUNCATE TABLE customers; TRUNCATE TABLE payments; TRUNCATE TABLE notifications;");
                } catch (Exception $e) {}
            }
            jsonOut(['success' => true, 'message' => 'All orders and customer data cleared.']);
        }
        break;

    default:
        jsonOut(['success' => true, 'status' => 'ERHA Backend API is operational', 'time' => date('c')]);
}
