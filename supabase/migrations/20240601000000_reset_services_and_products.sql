-- Drop all existing tables if they exist (with CASCADE to handle dependencies)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS service_products CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
-- Create services table
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    duration INTEGER NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
-- Create service_products table (many-to-many)
CREATE TABLE service_products (
    service_id BIGINT REFERENCES services(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, product_id)
);
-- Create customers table
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
-- Create staff table
CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT,
    specializations TEXT [],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
-- Create appointments table
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
    staff_id BIGINT REFERENCES staff(id) ON DELETE CASCADE,
    service_id BIGINT REFERENCES services(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
-- Create payments table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT REFERENCES appointments(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
-- Insert mock data into services
INSERT INTO services (name, description, price, duration, image_url)
VALUES ('Saç kəsimi', 'Peşəkar saç kəsimi', 20, 30, NULL),
    (
        'Manikür',
        'Klassik manikür xidməti',
        15,
        45,
        NULL
    ),
    (
        'Pedikür',
        'Rahatlaşdırıcı pedikür xidməti',
        18,
        50,
        NULL
    ),
    (
        'Saç boyama',
        'Rəngarəng saç boyama',
        40,
        90,
        NULL
    ),
    ('Masaj', 'Bədən masajı xidməti', 50, 60, NULL),
    (
        'Saç düzəldilməsi',
        'Saç düzəldilməsi xidməti',
        25,
        40,
        NULL
    ),
    (
        'Üz maskası',
        'Təravətləndirici üz maskası',
        30,
        30,
        NULL
    ),
    (
        'Qaş düzəldilməsi',
        'Qaş düzəldilməsi xidməti',
        10,
        20,
        NULL
    ),
    ('Saç yuma', 'Saç yuma xidməti', 15, 25, NULL),
    (
        'Saç qurutma',
        'Saç qurutma xidməti',
        20,
        30,
        NULL
    );
-- Insert mock data into products
INSERT INTO products (
        name,
        description,
        price,
        stock_quantity,
        image_url
    )
VALUES ('Şampun', 'Təbii tərkibli şampun', 10, 50, NULL),
    (
        'Dırnaq boyası',
        'Qırmızı rəngli dırnaq boyası',
        5,
        100,
        NULL
    ),
    (
        'Kondisioner',
        'Saç üçün kondisioner',
        12,
        40,
        NULL
    ),
    (
        'Masaj yağı',
        'Aromatik masaj yağı',
        20,
        30,
        NULL
    ),
    ('Qayçı', 'Peşəkar saç qayçısı', 25, 20, NULL),
    ('Saç spreyi', 'Saç spreyi', 8, 60, NULL),
    (
        'Üz kremi',
        'Təravətləndirici üz kremi',
        15,
        45,
        NULL
    ),
    ('Qaş boyası', 'Qaş boyası', 7, 80, NULL),
    ('Saç maskası', 'Saç maskası', 18, 35, NULL),
    (
        'Saç fırçası',
        'Peşəkar saç fırçası',
        22,
        25,
        NULL
    );
-- Link services and products (mock many-to-many)
INSERT INTO service_products (service_id, product_id)
VALUES (1, 1),
    -- Saç kəsimi - Şampun
    (1, 3),
    -- Saç kəsimi - Kondisioner
    (2, 2),
    -- Manikür - Dırnaq boyası
    (3, 2),
    -- Pedikür - Dırnaq boyası
    (4, 1),
    -- Saç boyama - Şampun
    (4, 3),
    -- Saç boyama - Kondisioner
    (5, 4),
    -- Masaj - Masaj yağı
    (6, 6),
    -- Saç düzəldilməsi - Saç spreyi
    (7, 7),
    -- Üz maskası - Üz kremi
    (8, 8);
-- Qaş düzəldilməsi - Qaş boyası
-- Insert mock data into customers
INSERT INTO customers (name, email, phone, gender)
VALUES (
        'Əli Məmmədov',
        'ali@example.com',
        '+994501234567',
        'male'
    ),
    (
        'Ayşə Əliyeva',
        'ayse@example.com',
        '+994502345678',
        'female'
    ),
    (
        'Məhəmməd Hüseynov',
        'mammad@example.com',
        '+994503456789',
        'male'
    ),
    (
        'Zeynəb Qurbanova',
        'zeyneb@example.com',
        '+994504567890',
        'female'
    ),
    (
        'Rəşad Əliyev',
        'rashad@example.com',
        '+994505678901',
        'male'
    ),
    (
        'Leyla Məmmədova',
        'leyla@example.com',
        '+994506789012',
        'female'
    ),
    (
        'Orxan Hüseynov',
        'orxan@example.com',
        '+994507890123',
        'male'
    ),
    (
        'Aynur Qurbanova',
        'aynur@example.com',
        '+994508901234',
        'female'
    ),
    (
        'Elmar Əliyev',
        'elmar@example.com',
        '+994509012345',
        'male'
    ),
    (
        'Gülşən Məmmədova',
        'gulshan@example.com',
        '+994500123456',
        'female'
    );
-- Insert mock data into staff
INSERT INTO staff (name, position, specializations)
VALUES (
        'Rəşad Əliyev',
        'Saç ustası',
        ARRAY ['Saç kəsimi', 'Saç boyama']
    ),
    (
        'Leyla Məmmədova',
        'Manikür ustası',
        ARRAY ['Manikür', 'Pedikür']
    ),
    (
        'Orxan Hüseynov',
        'Masaj ustası',
        ARRAY ['Masaj']
    ),
    (
        'Aynur Qurbanova',
        'Saç ustası',
        ARRAY ['Saç düzəldilməsi', 'Saç yuma']
    ),
    (
        'Elmar Əliyev',
        'Üz ustası',
        ARRAY ['Üz maskası', 'Qaş düzəldilməsi']
    ),
    (
        'Gülşən Məmmədova',
        'Saç ustası',
        ARRAY ['Saç kəsimi', 'Saç qurutma']
    ),
    (
        'Əli Məmmədov',
        'Manikür ustası',
        ARRAY ['Manikür', 'Pedikür']
    ),
    ('Ayşə Əliyeva', 'Masaj ustası', ARRAY ['Masaj']),
    (
        'Məhəmməd Hüseynov',
        'Saç ustası',
        ARRAY ['Saç boyama', 'Saç düzəldilməsi']
    ),
    (
        'Zeynəb Qurbanova',
        'Üz ustası',
        ARRAY ['Üz maskası', 'Qaş düzəldilməsi']
    );
-- Insert mock data into appointments
INSERT INTO appointments (
        customer_id,
        staff_id,
        service_id,
        appointment_date,
        start_time,
        end_time,
        status
    )
VALUES (
        1,
        1,
        1,
        '2024-06-01',
        '10:00',
        '10:30',
        'scheduled'
    ),
    (
        2,
        2,
        2,
        '2024-06-01',
        '11:00',
        '11:45',
        'scheduled'
    ),
    (
        3,
        3,
        5,
        '2024-06-01',
        '12:00',
        '13:00',
        'scheduled'
    ),
    (
        4,
        4,
        6,
        '2024-06-01',
        '13:00',
        '13:40',
        'scheduled'
    ),
    (
        5,
        5,
        7,
        '2024-06-01',
        '14:00',
        '14:30',
        'scheduled'
    ),
    (
        6,
        6,
        1,
        '2024-06-01',
        '15:00',
        '15:30',
        'scheduled'
    ),
    (
        7,
        7,
        2,
        '2024-06-01',
        '16:00',
        '16:45',
        'scheduled'
    ),
    (
        8,
        8,
        5,
        '2024-06-01',
        '17:00',
        '18:00',
        'scheduled'
    ),
    (
        9,
        9,
        4,
        '2024-06-01',
        '18:00',
        '19:30',
        'scheduled'
    ),
    (
        10,
        10,
        8,
        '2024-06-01',
        '19:00',
        '19:20',
        'scheduled'
    );
-- Insert mock data into payments
INSERT INTO payments (appointment_id, amount, status)
VALUES (1, 20, 'completed'),
    (2, 15, 'completed'),
    (3, 50, 'completed'),
    (4, 25, 'completed'),
    (5, 30, 'completed'),
    (6, 20, 'pending'),
    (7, 15, 'pending'),
    (8, 50, 'pending'),
    (9, 40, 'pending'),
    (10, 10, 'pending');