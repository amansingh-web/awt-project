# EShop - E-Commerce Product Management System

A secure, full-stack e-commerce platform built with React, Supabase, and modern web technologies for managing products, orders, and user authentication with role-based access control.

## Overview

EShop is a comprehensive e-commerce solution featuring:

- **Dual Interface**: Separate customer and admin interfaces
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and Customer roles with different permissions
- **Product Management**: Full CRUD operations for products
- **Shopping Cart**: Add products to cart and proceed to checkout
- **Order Management**: Track customer orders and history
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Features

### Customer Features
- User registration and login
- Browse product catalog with search and filtering by category
- Add products to shopping cart
- Checkout and place orders
- View order history
- User profile management

### Admin Features
- Complete product management (Create, Read, Update, Delete)
- View all products with stock quantities
- Add/Edit/Delete products with images and descriptions
- Manage product categories and pricing
- Monitor inventory levels

### Security Features
- JWT-based authentication
- Bcrypt password hashing (via Supabase Auth)
- Row-Level Security (RLS) on database tables
- Environment variable management for sensitive data
- Protected routes based on user roles

## Technology Stack

### Frontend
- **React 18.3**: Modern UI library
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Lucide React**: Modern icon library
- **Vite**: Lightning-fast build tool

### Backend & Database
- **Supabase**: PostgreSQL database with built-in authentication
- **Row-Level Security**: Database-level access control
- **RESTful API**: Supabase auto-generated REST APIs

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx       # Route protection component
├── hooks/
│   └── useAuth.ts              # Authentication hook with context
├── lib/
│   └── supabase.ts             # Supabase client setup
├── pages/
│   ├── Home.tsx                # Landing page
│   ├── Login.tsx               # User login page
│   ├── Signup.tsx              # User registration page
│   ├── ProductCatalog.tsx      # Customer product browsing
│   ├── AdminDashboard.tsx      # Admin product management
│   ├── Checkout.tsx            # Order checkout page
│   ├── Orders.tsx              # Order history page
│   └── Profile.tsx             # User profile management
├── App.tsx                     # Main app with routing
├── main.tsx                    # React entry point
└── index.css                   # Global styles
```

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eshop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Database Schema

### Users Table
- `id` (UUID): Primary key
- `email` (Text, Unique): User email
- `password_hash` (Text): Hashed password
- `full_name` (Text): User's full name
- `role` (Enum): 'admin' or 'customer'
- `created_at` (Timestamp): Account creation time

### Products Table
- `id` (UUID): Primary key
- `name` (Text): Product name
- `description` (Text): Product description
- `price` (Numeric): Product price
- `stock_quantity` (Integer): Available stock
- `category` (Text): Product category
- `image_url` (Text): Product image URL
- `created_by` (UUID): Admin who created the product
- `created_at` (Timestamp): Creation time
- `updated_at` (Timestamp): Last update time

### Orders Table
- `id` (UUID): Primary key
- `user_id` (UUID): Customer reference
- `total_amount` (Numeric): Order total
- `status` (Enum): 'pending', 'completed', or 'cancelled'
- `created_at` (Timestamp): Order date

### Order Items Table
- `id` (UUID): Primary key
- `order_id` (UUID): Order reference
- `product_id` (UUID): Product reference
- `quantity` (Integer): Item quantity
- `price_at_purchase` (Numeric): Price at purchase time

## API Routes

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/logout` - User logout

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (Admin only)
- `PATCH /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### Orders
- `GET /orders` - Get user's orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order details

## Authentication Flow

1. User signs up or logs in
2. Supabase generates JWT token
3. Token stored in browser session
4. Protected routes check token validity
5. Unauthorized requests redirect to login

## Security Considerations

- Passwords are hashed using Supabase's bcrypt implementation
- JWT tokens are validated on each request
- Row-Level Security restricts data access
- Admin operations require verified role
- Environment variables prevent exposure of secrets
- All user inputs are validated

## Usage Examples

### Customer Workflow
1. Sign up for an account
2. Browse products with search/filter
3. Add desired items to cart
4. Proceed to checkout
5. Complete order
6. View order history in profile

### Admin Workflow
1. Sign up/Login as admin (requires admin role setup)
2. Navigate to Admin Dashboard
3. Add new products with details and pricing
4. Edit existing products
5. Manage inventory levels
6. Delete discontinued products

## Deployment

### Supabase
1. Create a Supabase project
2. Run migrations to create database schema
3. Copy URL and anon key to environment variables

### Frontend Hosting Options
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

## Testing Credentials

### Sample Admin Account
- Email: `admin@eshop.com`
- Password: (Set during account creation)

### Sample Customer Account
- Email: `customer@eshop.com`
- Password: (Set during account creation)

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Product reviews and ratings
- Wishlist functionality
- Advanced search and filtering
- Order tracking
- Email notifications
- Admin analytics dashboard
- Inventory alerts

## Troubleshooting

### Build Errors
- Clear `node_modules` and reinstall: `npm install`
- Check Node.js version compatibility

### Authentication Issues
- Verify Supabase credentials in `.env`
- Check Row-Level Security policies
- Clear browser cache/cookies

### Database Connection
- Ensure Supabase project is active
- Verify network connectivity
- Check firewall/VPN settings

## License

This project is created for educational purposes as part of the MU CSE AWT (01CE1412) course assignment.

## Contributors

- Faculty: Prof. Kunal Khimani, Prof. Kajal Tanchak, Prof. Sweta Khatana, Prof. Rupesh Kanojiya, Prof. Charmy Vora

## Support

For issues and questions, please refer to the documentation or contact the development team.

---

**Submission Date**: April 10, 2026
**Total Marks**: 50 points
