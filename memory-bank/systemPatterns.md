# System Patterns

## Architectural Patterns

- **Client-Server Architecture**: React SPA frontend communicating with Flask REST API backend
- **Role-Based Access Control (RBAC)**: Three roles (customer, manager, super_admin) with role-specific UIs and permissions
- **JWT Authentication Flow**: Access tokens (2hr expiry) + refresh tokens stored in localStorage

## Design Patterns

- **Blueprint Pattern (Flask)**: API routes organized as blueprints under `/api/*` (11 blueprints: auth, products, dashboard, categories, analytics, orders, reviews, cart, wishlist, commission_rates, commissions, notifications)
- **Context-Aware Layout**: `Layout.jsx` wraps pages with Navbar + Footer + ScrollToTop
- **Utility-Based Styling**: Tailwind CSS utility classes throughout, brand colors via CSS custom properties (`src/styles/colors.css`)
- **Repository Pattern (ORM)**: SQLAlchemy models with relationships (User→Store, Store→Products, User→Orders, etc.)

## Common Idioms

- **Authenticated Fetch Wrapper**: `utils/fetchWithAuth.js` and `utils/auth.js` handle token refresh on 401 responses
- **Environment-Based Config**: `.env.development` (VITE_API_URL=http://127.0.0.1:5000), `.env.production` (VITE_API_BASE=https://api.stitchpoint.com)
- **Commission Calculation**: Tiered rates (PKR 0-500: 5%, 500-2000: 8%, 2000+: 10%) initialized in `app.py`'s `ensure_default_commission_rates()`
- **File Upload Pattern**: Uploads served from `/uploads/` with Flask static route, fallback to `server/uploads/` for legacy files
- **Conditional UI Rendering**: Frontend checks `user.role` from localStorage to show/hide role-specific features

## Database Schema Patterns

- **Hierarchical Categories**: `Category` model with `parent_id` self-relationship
- **Polymorphic-Like Notifications**: `Notification` model with `type` field for different notification kinds (commission, order status, etc.)
- **E-commerce Standard Models**: Cart/CartItem, Wishlist/WishlistItem, Order/OrderItem patterns
- **Analytics Tracking**: `ProductAnalytics` model for page views, clicks, time spent
