-- Insert test services
INSERT INTO services (name, description, price, duration, image_url)
VALUES (
        'Haircut',
        'Professional haircut service',
        30.00,
        30,
        'https://example.com/haircut.jpg'
    ),
    (
        'Hair Coloring',
        'Professional hair coloring service',
        80.00,
        120,
        'https://example.com/hair-coloring.jpg'
    ),
    (
        'Manicure',
        'Professional nail care service',
        25.00,
        45,
        'https://example.com/manicure.jpg'
    ),
    (
        'Pedicure',
        'Professional foot care service',
        35.00,
        60,
        'https://example.com/pedicure.jpg'
    ),
    (
        'Facial',
        'Professional facial treatment',
        50.00,
        60,
        'https://example.com/facial.jpg'
    );
-- Insert test products
INSERT INTO products (
        name,
        description,
        price,
        image_url,
        stock_quantity
    )
VALUES (
        'Shampoo',
        'Professional hair care shampoo',
        15.00,
        'https://example.com/shampoo.jpg',
        50
    ),
    (
        'Hair Color',
        'Professional hair coloring product',
        25.00,
        'https://example.com/hair-color.jpg',
        30
    ),
    (
        'Nail Polish',
        'Professional nail polish',
        10.00,
        'https://example.com/nail-polish.jpg',
        100
    ),
    (
        'Face Mask',
        'Professional facial mask',
        20.00,
        'https://example.com/face-mask.jpg',
        40
    ),
    (
        'Hair Styling Gel',
        'Professional hair styling product',
        12.00,
        'https://example.com/hair-gel.jpg',
        60
    );
-- Link services with related products
INSERT INTO service_products (service_id, product_id)
VALUES (1, 1),
    -- Haircut -> Shampoo
    (1, 5),
    -- Haircut -> Hair Styling Gel
    (2, 1),
    -- Hair Coloring -> Shampoo
    (2, 2),
    -- Hair Coloring -> Hair Color
    (3, 3),
    -- Manicure -> Nail Polish
    (4, 3),
    -- Pedicure -> Nail Polish
    (5, 4);
-- Facial -> Face Mask