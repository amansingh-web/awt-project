/*
  # Seed Sample Data for E-Commerce Platform

  1. Sample Users
    - Admin user for product management
    - Sample customers for testing

  2. Sample Products
    - Electronics category
    - Fashion category
    - Home & Kitchen category
    - Books category

  This migration populates the database with realistic test data for demonstration.
*/

DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Insert admin user
  INSERT INTO users (email, password_hash, full_name, role)
  VALUES ('admin@eshop.com', 'admin123', 'Admin User', 'admin')
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_id;

  -- If admin_id is NULL, get existing admin
  IF admin_id IS NULL THEN
    SELECT id INTO admin_id FROM users WHERE email = 'admin@eshop.com' LIMIT 1;
  END IF;

  -- Insert customer users
  INSERT INTO users (email, password_hash, full_name, role)
  VALUES 
    ('customer1@eshop.com', 'customer123', 'John Doe', 'customer'),
    ('customer2@eshop.com', 'customer456', 'Jane Smith', 'customer')
  ON CONFLICT (email) DO NOTHING;

  -- Insert sample products
  INSERT INTO products (name, description, price, stock_quantity, category, image_url, created_by)
  VALUES 
    (
      'Wireless Headphones',
      'High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.',
      79.99,
      50,
      'Electronics',
      'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg',
      admin_id
    ),
    (
      'Smart Watch',
      'Feature-rich smartwatch with heart rate monitor, sleep tracking, and 7-day battery life.',
      149.99,
      30,
      'Electronics',
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      admin_id
    ),
    (
      'Premium Coffee Maker',
      'Programmable coffee maker with thermal carafe, brew strength control, and quick brew feature.',
      89.99,
      25,
      'Home & Kitchen',
      'https://images.pexels.com/photos/2313782/pexels-photo-2313782.jpeg',
      admin_id
    ),
    (
      'Yoga Mat',
      'Non-slip yoga mat made from eco-friendly TPE material, 6mm thickness for comfort.',
      29.99,
      100,
      'Fitness',
      'https://images.pexels.com/photos/4326991/pexels-photo-4326991.jpeg',
      admin_id
    ),
    (
      'USB-C Charging Cable',
      'Durable USB-C charging cable, 6ft length, supports fast charging up to 100W.',
      12.99,
      200,
      'Electronics',
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      admin_id
    ),
    (
      'Portable Speaker',
      'Waterproof Bluetooth speaker with 360-degree sound, 12-hour battery life.',
      49.99,
      40,
      'Electronics',
      'https://images.pexels.com/photos/3721646/pexels-photo-3721646.jpeg',
      admin_id
    ),
    (
      'Phone Stand',
      'Adjustable phone stand for desk, compatible with all smartphones and tablets.',
      15.99,
      150,
      'Electronics',
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      admin_id
    ),
    (
      'LED Desk Lamp',
      'Dimmable LED desk lamp with USB charging port, touch control, and flexible arm.',
      39.99,
      45,
      'Home & Kitchen',
      'https://images.pexels.com/photos/3394097/pexels-photo-3394097.jpeg',
      admin_id
    )
  ON CONFLICT DO NOTHING;

END $$;
