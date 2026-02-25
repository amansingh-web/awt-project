# E-Commerce Product Management System - Project Documentation

**Course**: AWT (01CE1412)
**Faculty**: Prof. Kunal Khimani, Prof. Kajal Tanchak, Prof. Sweta Khatana, Prof. Rupesh Kanojiya, Prof. Charmy Vora
**Semester**: 4
**Branch**: Computer Engineering
**Submission Date**: April 10, 2026

---

## 1. PROJECT DEFINITION

### Problem Statement
The objective is to design and develop a secured, full-stack e-commerce web application using modern web technologies (React, Node.js/Express, and Supabase) with proper authentication, authorization, and database management. The application should provide a dual interface for both customers and administrators, allowing customers to browse and purchase products while admins manage the product catalog.

### Functional Requirements

#### User Management
- User registration with email and password
- User login/logout functionality
- Role-based user classification (Admin/Customer)
- User profile viewing and management
- Session management with JWT tokens

#### Customer Features
- Browse product catalog
- Search products by name/description
- Filter products by category
- Add products to shopping cart
- Checkout and order placement
- View order history
- User profile management

#### Admin Features
- Complete product management (CRUD operations)
- Add new products with details (name, description, price, stock, category, image)
- Edit existing products
- Delete products from catalog
- View all products and inventory levels
- Manage product categories

#### Security Features
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control (RBAC)
- Row-Level Security (RLS) on database
- Environment variable management
- Protected API routes

---

## 2. DESIGN & ARCHITECTURE

### Frontend Architecture

**Framework**: React 18.3 with TypeScript

**Component Structure**:
```
App.tsx (Router Setup)
├── pages/
│   ├── Home.tsx (Landing Page)
│   ├── Login.tsx (Authentication)
│   ├── Signup.tsx (User Registration)
│   ├── ProductCatalog.tsx (Customer Shopping)
│   ├── AdminDashboard.tsx (Admin Panel)
│   ├── Checkout.tsx (Order Processing)
│   ├── Orders.tsx (Order History)
│   └── Profile.tsx (User Profile)
├── components/
│   └── ProtectedRoute.tsx (Route Protection)
├── hooks/
│   └── useAuth.ts (Authentication Context)
└── lib/
    └── supabase.ts (API Client)
```

**Key Design Decisions**:
1. **Context API** for global state management instead of Redux for simplicity
2. **Protected Routes** for role-based access control
3. **Supabase Client** for database operations
4. **Responsive Tailwind CSS** for all styling
5. **Lucide React** icons for consistent UI

### Backend Architecture

**Backend**: Supabase (PostgreSQL + Auto-generated REST APIs)

**Database Design**:

#### Tables
1. **users** - User accounts with roles
2. **products** - Product inventory
3. **orders** - Customer orders
4. **order_items** - Order line items

#### Relationships
- Users → Orders (1:Many)
- Users → Products (1:Many, created_by)
- Orders → OrderItems (1:Many)
- Products ← OrderItems (1:Many)

### Security Architecture

**Authentication Flow**:
```
User Input (Email/Password)
    ↓
Supabase Auth Service
    ↓
JWT Token Generated
    ↓
Stored in Session/Context
    ↓
Included in API Requests
    ↓
RLS Policies Validate Access
```

**Authorization Flow**:
```
Request to Protected Route
    ↓
Check User Authentication
    ↓
Verify User Role
    ↓
Grant/Deny Access
    ↓
RLS Policies Enforce Data Access
```

---

## 3. DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes**:
- Primary key on `id`
- Unique index on `email`

**RLS Policies**:
- Users can view all user data (for display purposes)

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  category TEXT NOT NULL,
  image_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes**:
- Index on `category` for fast filtering
- Index on `created_by` for admin queries

**RLS Policies**:
- SELECT: Everyone can view all products
- INSERT: Only admins can create
- UPDATE: Only admins can update
- DELETE: Only admins can delete

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes**:
- Index on `user_id` for fast user order lookup

**RLS Policies**:
- SELECT: Users can view only their own orders
- INSERT: Users can create orders
- UPDATE: Users can update their own orders

### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10,2) NOT NULL CHECK (price_at_purchase > 0)
);
```

**Indexes**:
- Index on `order_id` for order queries
- Index on `product_id` for product tracking

**RLS Policies**:
- SELECT: Users can view items in their orders
- INSERT: Users can add items to their orders

---

## 4. API ENDPOINTS

All endpoints are auto-generated by Supabase REST API.

### Authentication Endpoints
- `POST /auth/v1/signup` - Register new user
- `POST /auth/v1/signin` - Login user
- `POST /auth/v1/logout` - Logout user
- `GET /auth/v1/user` - Get current user

### Products Endpoints
- `GET /rest/v1/products` - List all products
- `GET /rest/v1/products?category=eq.Electronics` - Filter by category
- `POST /rest/v1/products` - Create product (Admin only)
- `PATCH /rest/v1/products?id=eq.{id}` - Update product (Admin only)
- `DELETE /rest/v1/products?id=eq.{id}` - Delete product (Admin only)

### Orders Endpoints
- `GET /rest/v1/orders?user_id=eq.{user_id}` - Get user orders
- `POST /rest/v1/orders` - Create order
- `GET /rest/v1/order_items?order_id=eq.{order_id}` - Get order items

---

## 5. FRONTEND IMPLEMENTATION

### Authentication Hook (`useAuth.ts`)
- Global authentication state management
- Provides: `user`, `loading`, `login()`, `signup()`, `logout()`
- Uses React Context API
- Auto-refresh on session change

### Protected Routes (`ProtectedRoute.tsx`)
- Checks user authentication
- Validates user role (admin/customer)
- Redirects to login if unauthorized
- Shows loading state while checking

### Pages

#### Home Page
- Landing page with feature overview
- Navigation based on auth status
- Call-to-action buttons for signup/login

#### Login/Signup Pages
- Email and password validation
- Error handling and display
- Success messages
- Responsive forms with icons

#### Product Catalog (Customer)
- Product grid with search/filter
- Shopping cart management
- Add to cart functionality
- Checkout button
- Responsive design

#### Admin Dashboard
- Product management interface
- Add/Edit/Delete products
- Form validation
- Success/error notifications
- Product list view

#### Checkout Page
- Order summary
- Total calculation
- Place order button
- Order confirmation

#### Orders Page
- Order history display
- Order status indicators
- Order date and amount
- Empty state handling

#### Profile Page
- User information display
- Account details
- Logout functionality

---

## 6. SECURITY IMPLEMENTATION

### Authentication
- **JWT Tokens**: Supabase handles JWT generation
- **Session Storage**: Maintained in React Context
- **Auto-Refresh**: Session refreshed on browser reload
- **Token Validation**: Checked on protected routes

### Authorization
- **Role-Based**: Admin/Customer roles
- **RLS Policies**: Database-level enforcement
- **Protected Routes**: Frontend route protection
- **API Validation**: Backend policy validation

### Password Security
- **Bcrypt Hashing**: Supabase default
- **Salt Rounds**: Secure by default
- **Never Stored**: Plain passwords never stored
- **Secure Transmission**: HTTPS/TLS

### Data Protection
- **Row-Level Security**: Database policies
- **User Isolation**: Users see only their data
- **Admin Override**: Admins can see all products
- **Environment Variables**: Secrets in .env

### Input Validation
- **Email Format**: RFC 5322 validation
- **Password Requirements**: Minimum 6 characters
- **Type Safety**: TypeScript throughout
- **Form Validation**: React form validation

---

## 7. RESPONSIVE DESIGN

### Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Design Features
- **Mobile-First**: Built for mobile first
- **Flexible Layouts**: CSS Grid and Flexbox
- **Responsive Images**: Adaptive image sizing
- **Touch-Friendly**: Large tap targets
- **Readable Fonts**: 16px+ base size
- **Dark Theme**: Professional dark mode

### Components
- Navigation bars that collapse on mobile
- Product grids that adapt to screen size
- Forms optimized for touch input
- Modal dialogs instead of overlays

---

## 8. ERROR HANDLING

### Frontend Error Handling
- Try-catch blocks for API calls
- User-friendly error messages
- Error state management
- Network error handling
- Validation error display

### Backend Error Handling
- Supabase error responses
- RLS policy violations
- Database constraints
- Authentication failures
- Input validation

### Error Messages
- Clear, non-technical language
- Actionable suggestions
- Error recovery options
- Alert notifications

---

## 9. PERFORMANCE OPTIMIZATION

### Code Optimization
- React hooks for efficient rendering
- Memoization where needed
- Lazy loading of routes
- Efficient event handling

### Database Optimization
- Proper indexes on frequently queried columns
- Query optimization via RLS
- Connection pooling via Supabase
- Caching strategies

### Frontend Optimization
- Tailwind CSS for minimal bundle size
- Tree-shaking of unused code
- Image optimization
- Code splitting via Vite

---

## 10. DEPLOYMENT

### Technology Stack Versions
- Node.js: 16+
- React: 18.3.1
- React Router: 6.20.0
- Tailwind CSS: 3.4.1
- TypeScript: 5.5.3
- Vite: 5.4.2

### Build Process
```bash
npm install    # Install dependencies
npm run build  # Build for production
npm run dev    # Development server
npm run lint   # Code linting
```

### Deployment Steps
1. Build React application: `npm run build`
2. Output in `dist/` directory
3. Deploy to hosting platform:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS Amplify

### Environment Configuration
Create `.env` file with:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## 11. TESTING

### Manual Testing Checklist

**Authentication**:
- [x] User signup creates account
- [x] User login with correct credentials
- [x] User login fails with wrong credentials
- [x] User logout clears session
- [x] Protected routes redirect to login

**Customer Features**:
- [x] Browse product catalog
- [x] Search products
- [x] Filter by category
- [x] Add to cart
- [x] View cart
- [x] Checkout
- [x] Place order
- [x] View order history

**Admin Features**:
- [x] Access admin dashboard
- [x] Add product
- [x] Edit product
- [x] Delete product
- [x] View all products
- [x] Manage inventory

**Responsive Design**:
- [x] Mobile layout (320px)
- [x] Tablet layout (768px)
- [x] Desktop layout (1920px)
- [x] Touch interactions work
- [x] Forms are usable on mobile

---

## 12. CODE STRUCTURE & ORGANIZATION

### File Organization
```
src/
├── components/         # Reusable components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── pages/             # Page components
├── App.tsx            # Main app with routing
├── main.tsx           # React entry point
└── index.css          # Global styles

public/
└── index.html         # HTML template

dist/                  # Built output

supabase/
└── migrations/        # Database migrations
```

### Code Conventions
- **Naming**: camelCase for variables, PascalCase for components
- **Imports**: Group by external, internal, then relative
- **Comments**: Only for complex logic
- **Types**: Full TypeScript typing
- **Exports**: Named exports preferred

---

## 13. MEETING REQUIREMENTS

### Requirement Checklist

**Problem Statement** (5 marks):
- [x] Clear problem identification
- [x] Functional requirements defined
- [x] System objectives stated

**Frontend Design & Development** (15 marks):
- [x] React component-based UI
- [x] Client interface for customers
- [x] Admin interface for product management
- [x] Responsive design (mobile, tablet, desktop)
- [x] React Router for navigation
- [x] Form validation and error handling

**Backend Development & Database** (15 marks):
- [x] Supabase (PostgreSQL) database
- [x] Database schema design
- [x] CRUD operations on products
- [x] REST APIs (auto-generated by Supabase)
- [x] Error handling and validation
- [x] Proper database relationships

**Authentication & Security** (10 marks):
- [x] JWT-based authentication
- [x] Password hashing (bcrypt via Supabase)
- [x] Role-based access control (Admin/Customer)
- [x] Row-Level Security policies
- [x] Environment variable usage
- [x] Protected routes

**Final Submission & Deployment** (5 marks):
- [x] Fully functional full-stack application
- [x] Source code organized and commented
- [x] GitHub repository with README
- [x] Deployed application link
- [x] Documentation files

---

## 14. PROJECT STATISTICS

- **Total Files**: 27
- **Components**: 8 pages + 2 utility components
- **Lines of Code**: ~2000+
- **Dependencies**: 5 main + 10 dev
- **Database Tables**: 4
- **API Endpoints**: 10+
- **User Roles**: 2
- **Build Time**: ~8 seconds
- **Bundle Size**: 327 KB (gzipped: 94 KB)

---

## 15. FUTURE ENHANCEMENTS

### Phase 2 Features
- Payment gateway integration (Stripe)
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- Order tracking
- Customer support chat

### Phase 3 Features
- Advanced analytics dashboard
- Inventory management alerts
- Product recommendations
- Bulk import/export
- Multi-currency support
- Admin user management

### Phase 4 Features
- Mobile app (React Native)
- GraphQL API
- Real-time inventory sync
- Advanced search with filters
- Product variants (size, color)
- Promotional codes/coupons

---

## 16. CONCLUSION

This E-commerce Product Management System successfully demonstrates a complete full-stack web application with:

✅ Modern frontend using React and TypeScript
✅ Secure backend with Supabase and Row-Level Security
✅ Role-based access control for admin and customers
✅ Comprehensive product management system
✅ User authentication and authorization
✅ Responsive, production-ready design
✅ Proper error handling and validation
✅ Well-documented codebase

The application is ready for deployment and can be extended with additional features as needed.

---

**Submission Package**:
- Source Code (ZIP)
- GitHub Repository
- This Documentation
- README with screenshots
- Database migrations
- Deployment instructions

**Date**: February 25, 2026
**Status**: Complete and Ready for Submission
