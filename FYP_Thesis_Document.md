# StitchPoint (Naqsh Couture) — FYP Thesis Context Document

> **Project Name:** StitchPoint — A Multi-Vendor Fashion E-Commerce Platform  
> **Brand Name:** Naqsh Couture  
> **Currency:** PKR (Pakistani Rupee)  
> **Project Type:** Full-Stack Web Application  
> **Academic Level:** Final Year Project (FYP)

---

## 1. ABSTRACT

StitchPoint (branded as **Naqsh Couture**) is a full-stack, multi-vendor e-commerce web application designed for the fashion and textile industry. The platform enables multiple store managers (artisans, designers, and fashion vendors) to sell their products through a unified marketplace while providing customers with a seamless shopping experience. The system implements a three-tier role-based access control architecture (Customer, Store Manager, Super Admin), comprehensive product management, a multi-step checkout workflow, real-time analytics dashboards, a tiered commission system, and a notification engine. The backend is built on Python/Flask with PostgreSQL and JWT-based authentication, while the frontend is built on React 19 with Tailwind CSS 4, utilizing Vite as the build tool. The platform tracks user behavior through a custom analytics pipeline capturing page views, product interactions, and financial metrics, providing actionable insights at both the store and platform levels.

---

## 2. TECH STACK

### 2.1 Frontend

| Technology              | Version       | Purpose                     |
| ----------------------- | ------------- | --------------------------- |
| React                   | 19.1.1        | UI component library        |
| React Router DOM        | 7.9.4         | Client-side routing (SPA)   |
| Tailwind CSS            | 4.1.14        | Utility-first CSS framework |
| Vite                    | 7.1.7         | Build tool & dev server     |
| Recharts                | 3.3.0         | Data visualization / charts |
| React Icons             | 5.5.0         | Icon library                |
| React Hot Toast         | 2.6.0         | Toast notifications         |
| Leaflet / React-Leaflet | 1.9.4 / 5.0.0 | Interactive maps            |
| Three.js                | 0.181.0       | 3D graphics (experimental)  |
| ESLint                  | 9.36.0        | Code linting                |

### 2.2 Backend

| Technology              | Purpose                         |
| ----------------------- | ------------------------------- |
| Python (Flask)          | REST API framework              |
| Flask-SQLAlchemy        | ORM for database operations     |
| Flask-Migrate (Alembic) | Database migrations             |
| Flask-JWT-Extended      | JWT authentication              |
| Flask-CORS              | Cross-origin resource sharing   |
| Werkzeug                | Password hashing (PBKDF2)       |
| psycopg2-binary         | PostgreSQL adapter              |
| python-dotenv           | Environment variable management |

### 2.3 Database

| Technology | Purpose                     |
| ---------- | --------------------------- |
| PostgreSQL | Primary relational database |

### 2.4 DevOps & Tooling

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| Git / GitHub  | Version control             |
| Node.js / npm | Frontend package management |
| pip           | Python package management   |

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Architecture Pattern

The application follows a **Client-Server architecture** with a clear separation between:

- **Frontend (Client):** React SPA served via Vite, communicating with the backend through RESTful API calls
- **Backend (Server):** Flask REST API with JWT authentication, serving both API endpoints and static files
- **Database:** PostgreSQL relational database accessed through SQLAlchemy ORM

### 3.2 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                    CLIENT                        │
│  ┌─────────────────────────────────────────────┐ │
│  │         React SPA (Vite Build)              │ │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │ │
│  │  │ Customer │ │ Manager  │ │ Super Admin │ │ │
│  │  │  Portal  │ │  Portal  │ │   Portal    │ │ │
│  │  └────┬─────┘ └────┬─────┘ └──────┬──────┘ │ │
│  └───────┼─────────────┼──────────────┼────────┘ │
│          │   REST API (JSON)           │          │
└──────────┼─────────────┼──────────────┼──────────┘
           │             │              │
┌──────────▼─────────────▼──────────────▼──────────┐
│              Flask Backend Server                 │
│  ┌──────────────────────────────────────────────┐ │
│  │  JWT Auth │ Blueprints │ SQLAlchemy │ CORS   │ │
│  └──────────────────────┬───────────────────────┘ │
└─────────────────────────┼─────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────┐
│              PostgreSQL Database                   │
│  Users │ Products │ Orders │ Analytics │ etc.     │
└───────────────────────────────────────────────────┘
```

### 3.3 Folder Structure

```
StitchPoint/
├── server/                    # Backend (Flask)
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration (DB, JWT, etc.)
│   ├── models.py              # SQLAlchemy ORM models (20+ models)
│   ├── logger.py              # Logging setup
│   ├── requirements.txt       # Python dependencies
│   ├── update_role.py         # Utility: role update script
│   └── routes/                # API Blueprint modules
│       ├── auth.py            # Authentication (signup, login, refresh)
│       ├── products.py        # Product CRUD, reviews, comments
│       ├── orders.py          # Order management & delivery confirmation
│       ├── cart.py            # Shopping cart operations
│       ├── wishlist.py        # Wishlist operations
│       ├── dashboard.py       # Dashboard data & user management
│       ├── analytics.py       # Analytics tracking & reporting
│       ├── categories.py      # Product categories
│       ├── commissions.py     # Commission management
│       ├── commission_rates.py# Tiered commission rate management
│       ├── notifications.py   # Notification system
│       ├── reviews.py         # Review management
│       └── misc.py            # Miscellaneous endpoints (profile, addresses, etc.)
├── src/                       # Frontend (React)
│   ├── App.jsx                # Main app with all routes
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles + Tailwind import
│   ├── App.css                # App-level layout styles
│   ├── components/
│   │   ├── Layout.jsx         # Public page layout (Navbar + Footer)
│   │   ├── header/            # Navigation bar component
│   │   ├── footer/            # Footer components (Footer, SmartFooter)
│   │   ├── home/              # Homepage sections
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedServices.jsx
│   │   │   ├── CollectionsSection.jsx
│   │   │   ├── NewArrivals.jsx
│   │   │   ├── TopSaleProducts.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── Newsletter.jsx
│   │   ├── shop/              # Shop page components
│   │   ├── analytics/         # Dashboard chart components (12 charts)
│   │   ├── auth/              # Login & Signup forms
│   │   ├── common/            # Shared components (RoleDropdown)
│   │   ├── NotificationCenter.jsx
│   │   ├── DeliveryConfirmationModal.jsx
│   │   ├── ReviewModal.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── AnalyticsAside.jsx
│   ├── pages/
│   │   ├── HomePage.jsx       # Public homepage
│   │   ├── Shop.jsx           # Product listing with filters
│   │   ├── ShopImprovedFilters.jsx
│   │   ├── Collections.jsx    # Category-grouped collections
│   │   ├── ProductDetails.jsx # Single product view
│   │   ├── StoreDetails.jsx   # Public store profile page
│   │   ├── Cart.jsx           # Shopping cart
│   │   ├── Checkout.jsx       # Multi-step checkout
│   │   ├── Wishlist.jsx       # User wishlist
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx / Signup.jsx
│   │   ├── customer/          # Customer dashboard pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Profile.jsx
│   │   ├── manager/           # Store Manager dashboard pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Comments.jsx
│   │   │   ├── Reviews.jsx
│   │   │   └── Profile.jsx
│   │   └── super_admin/       # Super Admin dashboard pages (15+)
│   │       ├── Dashboard.jsx
│   │       ├── Analytics.jsx
│   │       ├── UserManagement.jsx
│   │       ├── Products.jsx
│   │       ├── Orders.jsx
│   │       ├── ProductAnalytics.jsx
│   │       ├── StoreAnalytics.jsx
│   │       ├── StoreAnalyticsDetail.jsx
│   │       ├── StoreProducts.jsx
│   │       ├── StoreReviews.jsx
│   │       ├── StoreComments.jsx
│   │       ├── Comments.jsx
│   │       ├── Reviews.jsx
│   │       ├── ReviewDetails.jsx
│   │       ├── CommissionRates.jsx
│   │       ├── Commissions.jsx
│   │       ├── QuickActions.jsx
│   │       ├── systemsettings.jsx
│   │       └── storeconfig.jsx
│   ├── utils/                 # Frontend utility functions
│   │   ├── auth.js            # Token refresh & logout
│   │   ├── fetchWithAuth.js   # Authenticated fetch wrapper
│   │   ├── cartUtils.js       # Cart API helpers
│   │   └── wishlistUtils.js   # Wishlist API helpers
│   ├── data/
│   │   └── ConstantValues.js  # Navigation, footer, app constants
│   └── styles/
│       └── colors.css         # CSS custom properties (design tokens)
├── tailwind.config.js         # Tailwind theme (gold palette)
├── vite.config.js             # Vite configuration
├── eslint.config.js           # ESLint rules
├── package.json               # Node.js dependencies
├── theme.js                   # Color palette definitions (5 palettes)
├── check_users.py             # Utility script
├── TODO_roles.md              # Development planning document
└── README.md
```

---

## 4. DATABASE DESIGN

### 4.1 Entity-Relationship Diagram (ERD) — Textual Description

The database consists of **20 tables** organized around core e-commerce entities:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    USERS     │     │    STORES    │     │  PRODUCTS    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │────▶│ id (PK)      │────▶│ id (PK)      │
│ email        │     │ name         │     │ name         │
│ password_hash│     │ address      │     │ description  │
│ name         │     │ logo_url     │     │ price        │
│ role         │     │ contact_num  │     │ cost_price   │
│ profile_pic  │     │ description  │     │ stock_qty    │
│ created_at   │     │ manager_id(FK)│    │ image_url    │
└──────┬───────┘     │ created_at   │     │ category     │
       │             │ updated_at   │     │ district     │
       │             └──────────────┘     │ store_id(FK) │
       │                                  │ sale_type    │
       ├──────────┐                       │ sale_discount│
       │          │                       │ is_featured  │
       ▼          ▼                       │ created_at   │
┌──────────┐ ┌──────────┐                └──────┬───────┘
│  CARTS   │ │ WISHLISTS│                       │
├──────────┤ ├──────────┤    ┌──────────┐       │
│ id (PK)  │ │ id (PK)  │    │ CART_ITEMS│       │
│ user_id  │ │ user_id  │    ├──────────┤       │
│ created  │ │ name     │    │ id (PK)  │       │
└────┬─────┘ │ created  │    │ cart_id  │       │
     │       └────┬─────┘    │ product_id◀──────┘
     │            │          │ quantity │
     │            ▼          └──────────┘
     │       ┌──────────────┐
     │       │WISHLIST_ITEMS│
     │       ├──────────────┤
     │       │ id (PK)      │
     │       │ wishlist_id  │
     │       │ product_id   │
     │       └──────────────┘
     │
     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   ORDERS     │────▶│ ORDER_ITEMS  │     │   PAYMENTS   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ user_id(FK)  │     │ order_id(FK) │     │ order_id(FK) │
│ store_id(FK) │     │ product_id   │     │ amount       │
│ total_amount │     │ quantity     │     │ pay_method   │
│ status       │     │ price        │     │ txn_id       │
│ shipping_addr│     └──────────────┘     │ status       │
│ is_delivered │                          │ created_at   │
│ delivery_conf│     ┌──────────────┐     └──────────────┘
│ created_at   │     │   REVIEWS    │
│ updated_at   │     ├──────────────┤
└──────────────┘     │ id (PK)      │
                     │ product_id   │
┌──────────────┐     │ user_id(FK)  │
│  ADDRESSES   │     │ user_name    │
├──────────────┤     │ rating       │
│ id (PK)      │     │ comment      │
│ user_id(FK)  │     │ created_at   │
│ name         │     └──────────────┘
│ street_addr  │
│ city         │     ┌──────────────┐
│ state        │     │  COMMENTS    │
│ postal_code  │     ├──────────────┤
│ country      │     │ id (PK)      │
│ is_default   │     │ product_id   │
└──────────────┘     │ user_id(FK)  │
                     │ user_name    │
┌──────────────┐     │ comment      │
│PAYMENT_METHOD│     │ created_at   │
├──────────────┤     └──────────────┘
│ id (PK)      │
│ user_id(FK)  │     ┌──────────────┐     ┌──────────────┐
│ cardholder   │     │ COMMISSIONS  │     │COMMISSION_   │
│ last_four    │     ├──────────────┤     │   RATES      │
│ card_type    │     │ id (PK)      │     ├──────────────┤
│ expiry_m/y   │     │ product_id   │     │ id (PK)      │
│ is_default   │     │ store_id     │     │ name         │
└──────────────┘     │ comm_pct     │     │ min_price    │
                     │ comm_amount  │     │ max_price    │
┌──────────────┐     │ is_manual    │     │ comm_pct     │
│  CATEGORIES  │     │ created_at   │     │ is_active    │
├──────────────┤     └──────────────┘     │ eff_date     │
│ id (PK)      │                          └──────────────┘
│ name         │     ┌──────────────┐
│ description  │     │NOTIFICATIONS │
│ parent_id(FK)│     ├──────────────┤
│ created_at   │     │ id (PK)      │
│ updated_at   │     │ user_id(FK)  │
└──────────────┘     │ title        │
                     │ message      │
┌──────────────┐     │ type         │
│PAGE_VIEWS    │     │ is_read      │
├──────────────┤     │ data (JSON)  │
│ id (PK)      │     │ created_at   │
│ user_id(FK)  │     └──────────────┘
│ page_url     │
│ referrer     │     ┌────────────────┐
│ user_agent   │     │PRODUCT_ANALYTICS│
│ ip_address   │     ├────────────────┤
│ viewed_at    │     │ id (PK)        │
└──────────────┘     │ product_id(FK) │
                     │ user_id(FK)    │
┌──────────────┐     │ action         │
│BUTTON_CLICKS │     │ timestamp      │
├──────────────┤     │ time_spent     │
│ id (PK)      │     │ referrer       │
│ user_id(FK)  │     │ user_agent     │
│ button_name  │     └────────────────┘
│ page_url     │
│ element_id   │
│ clicked_at   │
└──────────────┘
```

### 4.2 Detailed Table Schemas

#### 4.2.1 Users Table

| Column          | Type         | Constraints         | Description                              |
| --------------- | ------------ | ------------------- | ---------------------------------------- |
| id              | INTEGER      | PK, Auto Increment  | Unique user identifier                   |
| email           | VARCHAR(120) | UNIQUE, NOT NULL    | User email address                       |
| password_hash   | VARCHAR(256) | NOT NULL            | Hashed password (PBKDF2)                 |
| name            | VARCHAR(100) | Nullable            | Display name                             |
| role            | VARCHAR(20)  | Default: 'customer' | User role (customer/manager/super_admin) |
| profile_picture | VARCHAR(500) | Nullable            | Profile image URL                        |
| created_at      | DATETIME     | Default: utcnow     | Registration timestamp                   |

**Relationships:** One-to-Many with Cart, Wishlist, Orders, PageViews, ButtonClicks, Addresses, PaymentMethods. One-to-One with Store (for managers).

#### 4.2.2 Store Table

| Column         | Type         | Constraints                | Description           |
| -------------- | ------------ | -------------------------- | --------------------- |
| id             | INTEGER      | PK                         | Store identifier      |
| name           | VARCHAR(200) | NOT NULL                   | Store name            |
| address        | TEXT         | Nullable                   | Physical address      |
| logo_url       | VARCHAR(500) | Nullable                   | Store logo image      |
| contact_number | VARCHAR(20)  | Nullable                   | Contact phone         |
| description    | TEXT         | Nullable                   | Store description     |
| manager_id     | INTEGER      | FK→Users, UNIQUE, NOT NULL | One manager per store |
| created_at     | DATETIME     | Default: utcnow            | Creation timestamp    |
| updated_at     | DATETIME     | Default: utcnow            | Last update timestamp |

#### 4.2.3 Product Table

| Column                   | Type         | Constraints        | Description                         |
| ------------------------ | ------------ | ------------------ | ----------------------------------- |
| id                       | INTEGER      | PK                 | Product identifier                  |
| name                     | VARCHAR(200) | NOT NULL           | Product name                        |
| description              | TEXT         | Nullable           | Product description                 |
| price                    | FLOAT        | NOT NULL           | Selling price (PKR)                 |
| cost_price               | FLOAT        | Nullable           | Cost to store (for profit calc)     |
| stock_quantity           | INTEGER      | Default: 0         | Available inventory                 |
| image_url                | VARCHAR(500) | Nullable           | Primary image path                  |
| category                 | VARCHAR(100) | Nullable           | Category name                       |
| district                 | VARCHAR(100) | Nullable           | Geographic region                   |
| store_id                 | INTEGER      | FK→Store, NOT NULL | Owning store                        |
| sale_type                | VARCHAR(100) | Nullable           | Sale event name (EID, Friday, etc.) |
| sale_start_date          | DATETIME     | Nullable           | Sale period start                   |
| sale_end_date            | DATETIME     | Nullable           | Sale period end                     |
| sale_discount_percentage | FLOAT        | Nullable           | Discount percentage (0-100)         |
| is_featured              | BOOLEAN      | Default: false     | Featured on homepage                |
| is_new_arrival           | BOOLEAN      | Default: true      | Shown in new arrivals               |
| featured_order           | INTEGER      | Default: 0         | Display ordering                    |
| new_arrival_order        | INTEGER      | Default: 0         | Display ordering                    |
| created_at               | DATETIME     | Default: utcnow    | Creation timestamp                  |
| updated_at               | DATETIME     | Default: utcnow    | Last update timestamp               |

#### 4.2.4 Order Table

| Column                         | Type        | Constraints        | Description            |
| ------------------------------ | ----------- | ------------------ | ---------------------- |
| id                             | INTEGER     | PK                 | Order identifier       |
| user_id                        | INTEGER     | FK→Users, NOT NULL | Ordering customer      |
| store_id                       | INTEGER     | FK→Store, NOT NULL | Target store           |
| total_amount                   | FLOAT       | NOT NULL           | Order total (PKR)      |
| status                         | VARCHAR(50) | Default: 'pending' | Order status           |
| shipping_address               | TEXT        | Nullable           | Delivery address       |
| is_delivered                   | BOOLEAN     | Default: false     | Delivery flag          |
| delivery_confirmed_at          | DATETIME    | Nullable           | Confirmation timestamp |
| delivery_confirmed_by_customer | BOOLEAN     | Default: false     | Customer confirmation  |
| created_at                     | DATETIME    | Default: utcnow    | Order date             |
| updated_at                     | DATETIME    | Default: utcnow    | Last update            |

**Order Status Flow:** `pending` → `processing` → `shipped` → `delivered` | `cancelled` | `delivery_issue`

#### 4.2.5 Additional Tables

- **CartItem:** Links Cart to Products with quantity (unique constraint on cart_id + product_id)
- **WishlistItem:** Links Wishlist to Products with added_at timestamp
- **OrderItem:** Links Orders to Products with quantity and price at time of purchase
- **Payment:** Records payment for each Order (amount, method, transaction_id, status)
- **Address:** User shipping addresses (street, city, state, postal code, country, is_default)
- **PaymentMethod:** Stored card info (last 4 digits only, card type, expiry)
- **Category:** Hierarchical categories (parent_id self-referencing FK)
- **Review:** Product reviews (1-5 stars + comment, linked to user or anonymous)
- **Comment:** Product comments (linked to user or anonymous)
- **Commission:** Per-product commission overrides (percentage or fixed amount, is_manual flag)
- **CommissionRate:** Tiered commission rate definitions (min_price, max_price, percentage)
- **Notification:** System/user notifications (type, title, message, is_read, JSON data)
- **PageView:** Page view tracking (URL, referrer, user_agent, IP, timestamp)
- **ButtonClick:** UI interaction tracking (button name, page URL, element ID, timestamp)
- **ProductAnalytics:** Product-specific analytics (action type, time_spent, referrer, user_agent)

---

## 5. DATABASE DIAGRAMS (DFD)

### 5.1 Level 0 — Context Diagram (DFD)

```
                    ┌─────────────┐
                    │  CUSTOMER   │
                    └──────┬──────┘
                           │ Browse, Buy, Review
                           ▼
┌──────────┐    ┌──────────────────────┐    ┌──────────────┐
│ MANAGER  │───▶│    STITCHPOINT       │◀───│  SUPER ADMIN │
│          │    │   E-Commerce System  │    │              │
└──────────┘    └──────────┬───────────┘    └──────────────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │  Database   │
                    └─────────────┘
```

### 5.2 Level 1 — Major Process Decomposition (DFD)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STITCHPOINT SYSTEM                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  1.0         │  │  2.0         │  │  3.0         │              │
│  │  User Auth   │  │  Product     │  │  Order       │              │
│  │  & Management│  │  Management  │  │  Processing  │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                  │                       │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐              │
│  │  4.0         │  │  5.0         │  │  6.0         │              │
│  │  Analytics   │  │  Commission  │  │  Notification│              │
│  │  & Tracking  │  │  Engine      │  │  System      │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                  │                       │
└─────────┼─────────────────┼──────────────────┼──────────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
   ┌─────────────────────────────────────────────┐
   │           PostgreSQL Database               │
   └─────────────────────────────────────────────┘
```

### 5.3 Data Flow Descriptions

#### Process 1.0 — User Authentication & Management

- **Inputs:** User credentials (email, password), JWT tokens
- **Outputs:** Access tokens, refresh tokens, user profile data
- **Processes:** Registration, login, password hashing (PBKDF2), JWT token generation/validation, role assignment, profile CRUD, address management, payment method management

#### Process 2.0 — Product Management

- **Inputs:** Product data, images, categories, sale configurations
- **Outputs:** Product listings, search results, recommendations
- **Processes:** CRUD operations, image upload/storage, category management, featured/new-arrival designation, sale/discount configuration, product search & filtering, recommendation engine (category-based + popularity scoring)

#### Process 3.0 — Order Processing

- **Inputs:** Cart items, shipping address, payment method
- **Outputs:** Order confirmations, order status updates
- **Processes:** Multi-store order splitting, stock validation & decrement, payment record creation, order status management (pending→processing→shipped→delivered), delivery confirmation, issue reporting

#### Process 4.0 — Analytics & Tracking

- **Inputs:** Page views, button clicks, product interactions (view/click/add_to_cart)
- **Outputs:** Analytics dashboards, trend reports, financial summaries
- **Processes:** Event logging, aggregation (daily/weekly/monthly), store-scoped filtering, financial metrics (revenue, costs, profit), product-level analytics, review/comment trend analysis

#### Process 5.0 — Commission Engine

- **Inputs:** Product prices, order amounts, commission rate tiers
- **Outputs:** Commission calculations, earnings reports
- **Processes:** Tier-based rate matching (PKR 0-500 → 5%, PKR 500-2000 → 8%, PKR 2000+ → 10%), per-product overrides (manual commission), commission earnings aggregation, store-level commission breakdown

#### Process 6.0 — Notification System

- **Inputs:** System events (order status changes, commission changes, product updates)
- **Outputs:** User notifications, unread counts
- **Processes:** Notification creation, type classification (commission_change, order_status, product, system), read/unread tracking, batch mark-as-read

---

## 6. FEATURES & FUNCTIONAL REQUIREMENTS

### 6.1 Customer Features (FR-C)

| ID     | Feature                   | Description                                                                   |
| ------ | ------------------------- | ----------------------------------------------------------------------------- |
| FR-C01 | User Registration         | Email + password signup with automatic customer role assignment               |
| FR-C02 | User Login                | Email/password authentication with JWT access & refresh tokens                |
| FR-C03 | Browse Products           | View products with images, prices, ratings, sale discounts                    |
| FR-C04 | Product Search            | Search by name and description with case-insensitive matching                 |
| FR-C05 | Product Filtering         | Filter by category, district, price range, stock status                       |
| FR-C06 | Product Details           | Full product page with images, description, specifications, reviews, comments |
| FR-C07 | Shopping Cart             | Add, update quantity, remove items; cart persists across sessions             |
| FR-C08 | Wishlist                  | Add/remove products to/from wishlist; wishlist page view                      |
| FR-C09 | Multi-Step Checkout       | 3-step process: Shipping → Payment → Review → Success                         |
| FR-C10 | Address Management        | Save, edit, set default shipping addresses                                    |
| FR-C11 | Payment Method Management | Store payment cards (last 4 digits only), set default                         |
| FR-C12 | Order Placement           | Orders auto-split by store; stock validation before confirmation              |
| FR-C13 | Order Tracking            | View order history, status, and details                                       |
| FR-C14 | Order Cancellation        | Cancel orders in pending/processing status                                    |
| FR-C15 | Delivery Confirmation     | Confirm receipt or report delivery issues                                     |
| FR-C16 | Product Reviews           | Rate (1-5 stars) and comment on products (logged-in or anonymous)             |
| FR-C17 | Product Comments          | Post comments on products                                                     |
| FR-C18 | Product Recommendations   | "You Might Also Like" — category-based + popularity + recency scoring         |
| FR-C19 | Store Browsing            | View individual store pages with products and ratings                         |
| FR-C20 | Customer Dashboard        | Overview of cart, wishlist, orders, spending, and recommendations             |
| FR-C21 | Profile Management        | Update name, email, profile picture, addresses, payment methods               |

### 6.2 Store Manager Features (FR-M)

| ID     | Feature                  | Description                                                            |
| ------ | ------------------------ | ---------------------------------------------------------------------- |
| FR-M01 | Product CRUD             | Create, read, update, delete products with image upload                |
| FR-M02 | Product Image Upload     | Upload product images to server (timestamped filenames)                |
| FR-M03 | Sale Configuration       | Set sale type, dates, and discount percentage per product              |
| FR-M04 | Featured Products        | Mark products as featured for homepage display                         |
| FR-M05 | Category Management      | Create and manage product categories                                   |
| FR-M06 | Order Management         | View store orders, update order status                                 |
| FR-M07 | Comment Management       | View and delete comments on store products                             |
| FR-M08 | Review Management        | View reviews for store products                                        |
| FR-M09 | Analytics Dashboard      | Product views, clicks, add-to-cart events, time spent                  |
| FR-M10 | Financial Metrics        | Revenue, costs, profit calculations (store-scoped)                     |
| FR-M11 | Sales/Cost/Profit Charts | Interactive trend charts (Recharts)                                    |
| FR-M12 | Manager Dashboard        | Overview with metrics cards, charts, recent orders, top-rated products |
| FR-M13 | Store Profile            | Edit store name, address, logo, description, contact                   |

### 6.3 Super Admin Features (FR-S)

| ID     | Feature                    | Description                                                |
| ------ | -------------------------- | ---------------------------------------------------------- |
| FR-S01 | User Management            | Create, view, manage all users with pagination             |
| FR-S02 | Role Assignment            | Assign customer/manager/super_admin roles                  |
| FR-S03 | Manager + Store Creation   | Create manager accounts with associated stores             |
| FR-S04 | Global Product View        | View all products across all stores                        |
| FR-S05 | Global Order View          | View all orders across all stores                          |
| FR-S06 | Store Analytics            | Compare analytics across all stores                        |
| FR-S07 | Store-Level Drill-Down     | Detailed analytics per store (products, reviews, comments) |
| FR-S08 | Product Analytics          | Cross-store product performance comparison                 |
| FR-S09 | Commission Rate Management | Create/edit tiered commission rate tiers                   |
| FR-S10 | Commission Tracking        | View commission earnings per product/store                 |
| FR-S11 | Commission Trends          | Daily commission earnings over time                        |
| FR-S12 | Financial Trends           | Sales, costs, profit, commission trends                    |
| FR-S13 | Review Details             | Detailed review inspection across the platform             |
| FR-S14 | System Dashboard           | Platform-wide metrics, charts, commission analytics        |

### 6.4 Cross-Cutting Features

| ID     | Feature                   | Description                                                       |
| ------ | ------------------------- | ----------------------------------------------------------------- |
| FR-X01 | JWT Authentication        | Access tokens (2hr expiry) + refresh tokens                       |
| FR-X02 | Auto Token Refresh        | Seamless token renewal on 401 responses                           |
| FR-X03 | Role-Based Access Control | Three-tier authorization (Customer, Manager, Super Admin)         |
| FR-X04 | Store Data Isolation      | Managers see only their store's data; Super Admin sees all        |
| FR-X05 | Responsive Design         | Mobile-first responsive layouts with sidebar navigation           |
| FR-X06 | Toast Notifications       | Real-time user feedback via react-hot-toast                       |
| FR-X07 | Scroll to Top             | Auto-scroll behavior on page navigation                           |
| FR-X08 | Notification Center       | Real-time notification bell with unread count and dropdown        |
| FR-X09 | Dynamic Theming           | Multiple color palette definitions (gold/black silk theme active) |
| FR-X10 | Error Handling            | Consistent error responses and user-facing error messages         |

---

## 7. API ENDPOINTS

### 7.1 Authentication (`/api/auth`)

| Method | Endpoint            | Auth          | Description                           |
| ------ | ------------------- | ------------- | ------------------------------------- |
| POST   | `/api/auth/signup`  | No            | Register new user (default: customer) |
| POST   | `/api/auth/login`   | No            | Login, receive JWT tokens + user data |
| POST   | `/api/auth/refresh` | Refresh Token | Get new access token                  |

### 7.2 Products (`/api`)

| Method | Endpoint                            | Auth     | Description                               |
| ------ | ----------------------------------- | -------- | ----------------------------------------- |
| GET    | `/api/products`                     | No       | List products with filtering & pagination |
| GET    | `/api/products/:id`                 | No       | Get single product with reviews           |
| POST   | `/api/products`                     | Manager  | Create product with image upload          |
| PUT    | `/api/products/:id`                 | Manager  | Update product                            |
| DELETE | `/api/products/:id`                 | Manager  | Delete product                            |
| GET    | `/api/products/featured`            | No       | Featured products for homepage            |
| GET    | `/api/products/new-arrivals`        | No       | New arrival products                      |
| GET    | `/api/products/top-sales`           | No       | Active sale products                      |
| GET    | `/api/products/:id/recommendations` | No       | Product recommendations                   |
| GET    | `/api/products/:id/reviews`         | No       | Product reviews                           |
| POST   | `/api/products/:id/reviews`         | Optional | Submit review                             |
| GET    | `/api/products/:id/comments`        | No       | Product comments                          |
| POST   | `/api/products/:id/comments`        | Optional | Submit comment                            |

### 7.3 Orders (`/api/orders`)

| Method | Endpoint                           | Auth        | Description                        |
| ------ | ---------------------------------- | ----------- | ---------------------------------- |
| POST   | `/api/orders`                      | Customer    | Create order (auto-split by store) |
| GET    | `/api/orders`                      | Customer    | Get user's orders                  |
| GET    | `/api/orders/:id`                  | Customer    | Get order details                  |
| PUT    | `/api/orders/:id`                  | Manager     | Update order status                |
| PUT    | `/api/orders/:id/cancel`           | Customer    | Cancel order                       |
| PUT    | `/api/orders/:id/confirm-delivery` | Customer    | Confirm delivery or report issue   |
| GET    | `/api/orders/manager/all`          | Manager     | Get store orders                   |
| GET    | `/api/orders/admin/all`            | Super Admin | Get all orders                     |

### 7.4 Cart (`/api/cart`)

| Method | Endpoint                       | Auth     | Description          |
| ------ | ------------------------------ | -------- | -------------------- |
| GET    | `/api/cart`                    | Customer | Get cart items       |
| POST   | `/api/cart/add`                | Customer | Add item to cart     |
| PUT    | `/api/cart/update`             | Customer | Update item quantity |
| DELETE | `/api/cart/remove/:product_id` | Customer | Remove item          |
| DELETE | `/api/cart/clear`              | Customer | Clear cart           |

### 7.5 Wishlist (`/api/wishlist`)

| Method | Endpoint                           | Auth     | Description          |
| ------ | ---------------------------------- | -------- | -------------------- |
| GET    | `/api/wishlist`                    | Customer | Get wishlist items   |
| POST   | `/api/wishlist/add`                | Customer | Add to wishlist      |
| DELETE | `/api/wishlist/remove/:product_id` | Customer | Remove from wishlist |
| GET    | `/api/wishlist/check/:product_id`  | Customer | Check if in wishlist |
| DELETE | `/api/wishlist/clear`              | Customer | Clear wishlist       |

### 7.6 Dashboard (`/api/dashboard`)

| Method | Endpoint                           | Auth        | Description                            |
| ------ | ---------------------------------- | ----------- | -------------------------------------- |
| GET    | `/api/dashboard/customer`          | Customer    | Customer dashboard data                |
| GET    | `/api/dashboard/admin`             | Manager/SA  | Admin dashboard with financial metrics |
| GET    | `/api/dashboard/users`             | Super Admin | Paginated user list                    |
| POST   | `/api/dashboard/users`             | Super Admin | Create user (with store for managers)  |
| GET    | `/api/dashboard/commissions`       | Super Admin | Commission analytics                   |
| GET    | `/api/dashboard/commission-trends` | Super Admin | Commission trends over time            |

### 7.7 Analytics (`/api/analytics`)

| Method | Endpoint                                    | Auth       | Description                                         |
| ------ | ------------------------------------------- | ---------- | --------------------------------------------------- |
| POST   | `/api/analytics/log`                        | Optional   | Log product analytics event                         |
| GET    | `/api/analytics/overview`                   | Manager/SA | Analytics overview (views, clicks, cart adds, time) |
| GET    | `/api/analytics/product-views`              | Manager/SA | Product view analytics                              |
| GET    | `/api/analytics/product-clicks`             | Manager/SA | Product click analytics                             |
| GET    | `/api/analytics/reviews-overview`           | Manager/SA | Review statistics                                   |
| GET    | `/api/analytics/reviews-trends`             | Manager/SA | Review trends over time                             |
| GET    | `/api/analytics/comments-overview`          | Manager/SA | Comment statistics                                  |
| GET    | `/api/analytics/comments-trends`            | Manager/SA | Comment trends over time                            |
| GET    | `/api/analytics/products-analytics`         | Manager/SA | Product-level analytics with financials             |
| GET    | `/api/analytics/stores-analytics`           | Manager/SA | Store-level analytics                               |
| GET    | `/api/analytics/stores-analytics/:store_id` | Manager/SA | Single store analytics                              |
| GET    | `/api/analytics/products-by-store`          | Manager/SA | Products for a specific store                       |
| GET    | `/api/analytics/financial-trends`           | Manager/SA | Daily sales/costs/profit trends                     |
| GET    | `/api/analytics/comments`                   | Manager/SA | All comments with pagination                        |
| GET    | `/api/analytics/reviews`                    | Manager/SA | All reviews with search & filter                    |
| GET    | `/api/analytics/reviews/:review_id`         | Manager/SA | Single review details                               |

### 7.8 Other Endpoints

| Module           | Endpoints                                                        |
| ---------------- | ---------------------------------------------------------------- |
| Categories       | CRUD for product categories                                      |
| Notifications    | List, unread count, mark read, mark all read                     |
| Commissions      | Commission records CRUD                                          |
| Commission Rates | Tiered rate management CRUD                                      |
| Misc/Profile     | User profile CRUD, address management, payment method management |

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### 8.1 Performance (NFR-P)

- **NFR-P01:** Frontend shall load within 3 seconds on a standard broadband connection
- **NFR-P02:** API response time shall be under 500ms for 95% of requests
- **NFR-P03:** Database queries shall use proper indexing and pagination (max 100 items per page)
- **NFR-P04:** Analytics queries shall aggregate data server-side to minimize data transfer

### 8.2 Security (NFR-S)

- **NFR-S01:** Passwords shall be hashed using PBKDF2 via Werkzeug's `generate_password_hash`
- **NFR-S02:** JWT access tokens shall expire after 2 hours; refresh tokens for renewal
- **NFR-S03:** All API endpoints (except public ones) shall require JWT authentication
- **NFR-S04:** Role-based authorization shall restrict data access (store isolation for managers)
- **NFR-S05:** Payment card numbers shall only store last 4 digits (PCI DSS consideration)
- **NFR-S06:** CORS shall be configured for cross-origin API access
- **NFR-S07:** User input shall be validated and sanitized on the backend
- **NFR-S08:** SQL injection prevention through SQLAlchemy ORM parameterized queries

### 8.3 Usability (NFR-U)

- **NFR-U01:** Responsive design supporting desktop, tablet, and mobile viewports
- **NFR-U02:** Consistent gold/black color scheme across all pages
- **NFR-U03:** Toast notifications for all user actions (success/error feedback)
- **NFR-U04:** Loading states and spinners for asynchronous operations
- **NFR-U05:** Empty state messages for lists with no data
- **NFR-U06:** Form validation with inline error messages

### 8.4 Reliability (NFR-R)

- **NFR-R01:** Database transactions with rollback on failure
- **NFR-R02:** Graceful error handling with consistent JSON error responses
- **NFR-R03:** Automatic token refresh on authentication failures
- **NFR-R04:** Server-side logging for debugging and audit trails

### 8.5 Maintainability (NFR-M)

- **NFR-M01:** Modular backend with Flask Blueprints (separate route files per domain)
- **NFR-M02:** Component-based frontend with reusable React components
- **NFR-M03:** Utility functions extracted (cartUtils, wishlistUtils, fetchWithAuth)
- **NFR-M04:** Database migrations via Alembic/Flask-Migrate
- **NFR-M05:** Environment-based configuration via .env files

### 8.6 Scalability (NFR-SC)

- **NFR-SC01:** Stateless API design (JWT-based) enables horizontal scaling
- **NFR-SC02:** Database pagination for all list endpoints
- **NFR-SC03:** Store-based data partitioning for multi-tenancy
- **NFR-SC04:** Image uploads stored on filesystem (can be migrated to cloud storage)

---

## 9. USER ROLES & ACCESS CONTROL

### 9.1 Role Hierarchy

```
┌───────────────────────────────────────────┐
│              SUPER ADMIN                  │
│  • Full platform access                  │
│  • All stores' data visible              │
│  • User management                       │
│  • Commission rate management            │
│  • Global analytics                      │
├───────────────────────────────────────────┤
│              STORE MANAGER                │
│  • Single store access (1:1 mapping)     │
│  • Own products CRUD                     │
│  • Own orders management                 │
│  • Store-scoped analytics                │
│  • Comment/review management             │
├───────────────────────────────────────────┤
│              CUSTOMER                     │
│  • Browse all products (unified catalog) │
│  • Shopping cart & wishlist              │
│  • Order placement & tracking            │
│  • Reviews & comments                    │
│  • Profile management                    │
└───────────────────────────────────────────┘
```

### 9.2 Access Control Matrix

| Resource                | Customer                    | Manager      | Super Admin    |
| ----------------------- | --------------------------- | ------------ | -------------- |
| Browse Products         | ✅ All                      | ✅ All       | ✅ All         |
| Create Product          | ❌                          | ✅ Own Store | ✅ Any         |
| Delete Product          | ❌                          | ✅ Own Store | ✅ Any         |
| View Orders             | ✅ Own                      | ✅ Own Store | ✅ All         |
| Update Order Status     | ❌                          | ✅ Own Store | ❌ (View only) |
| View Analytics          | ❌                          | ✅ Own Store | ✅ All         |
| Manage Users            | ❌                          | ❌           | ✅ All         |
| Manage Commission Rates | ❌                          | ❌           | ✅ All         |
| Manage Categories       | ❌                          | ✅ Own Store | ✅ All         |
| Delivery Confirmation   | ✅ Own Orders               | ❌           | ❌             |
| Cancel Order            | ✅ Own (pending/processing) | ❌           | ❌             |

---

## 10. BUSINESS LOGIC & ALGORITHMS

### 10.1 Commission Calculation Algorithm

```
FOR each delivered order item:
  1. Check for per-product manual commission override
     IF manual commission exists:
       IF commission_amount is set → commission = commission_amount × quantity
       ELSE IF commission_percentage is set → commission = (price × quantity × percentage) / 100
  2. ELSE, fall back to tiered commission rate:
     Find active CommissionRate where:
       min_price ≤ product_price ≤ max_price (or max_price is NULL for unlimited)
     commission = (price × quantity × rate.commission_percentage) / 100
  3. If no applicable rate → commission = 0
```

### 10.2 Product Recommendation Algorithm

```
FOR a given product P:
  1. Find all products in the same category (excluding P)
  2. Score each candidate C:
     same_store_bonus = 100 if C.store_id == P.store_id else 0
     popularity = SUM(C.order_items.quantity)
     recency = max(0, -(P.created_at - C.created_at).days)
     score = same_store_bonus + (popularity × 2) + recency
  3. Sort by score descending
  4. Return top 8
```

### 10.3 Multi-Store Order Splitting

```
FOR checkout with cart items:
  1. Group items by store_id
  2. FOR each store group:
     a. Validate stock availability for each item
     b. Calculate store subtotal
     c. Split tax and shipping proportionally:
        proportion = store_subtotal / cart_subtotal
        store_tax = total_tax × proportion
        store_shipping = total_shipping × proportion
     d. Create separate Order record per store
     e. Create Payment record per order
     f. Decrement stock for each item
  3. Return list of created orders
```

### 10.4 Order Status Flow

```
                    ┌──────────┐
                    │ PENDING  │
                    └────┬─────┘
                         │
                    ┌────▼─────┐     ┌───────────┐
                    │PROCESSING│────▶│ CANCELLED │
                    └────┬─────┘     └───────────┘
                         │
                    ┌────▼─────┐     ┌───────────────┐
                    │ SHIPPED  │────▶│DELIVERY_ISSUE │
                    └────┬─────┘     └───────────────┘
                         │
                    ┌────▼─────┐
                    │DELIVERED │
                    └──────────┘
```

---

## 11. FRONTEND ROUTING STRUCTURE

### 11.1 Public Routes (Layout: Navbar + Footer)

| Route              | Component      | Description                                             |
| ------------------ | -------------- | ------------------------------------------------------- |
| `/`                | HomePage       | Homepage with hero, collections, arrivals, testimonials |
| `/about`           | About          | About page                                              |
| `/shop`            | Shop           | Product listing with filters                            |
| `/collections`     | Collections    | Category-grouped product display                        |
| `/product/:id`     | ProductDetails | Single product with reviews/comments                    |
| `/store/:store_id` | StoreDetails   | Public store profile                                    |
| `/contact`         | Contact        | Contact page                                            |
| `/cart`            | Cart           | Shopping cart                                           |
| `/checkout`        | Checkout       | Multi-step checkout                                     |
| `/wishlist`        | Wishlist       | User wishlist                                           |
| `/login`           | Login          | Login form                                              |
| `/signup`          | Signup         | Registration form                                       |

### 11.2 Customer Dashboard Routes

| Route                                 | Component                    |
| ------------------------------------- | ---------------------------- |
| `/customer-dashboard`                 | CustomerDashboard (Overview) |
| `/customer-dashboard/orders`          | CustomerOrders               |
| `/customer-dashboard/orders/:orderId` | CustomerOrders (detail view) |
| `/customer-dashboard/profile`         | CustomerProfile              |
| `/customer-dashboard/cart`            | Cart                         |
| `/customer-dashboard/wishlist`        | Wishlist                     |

### 11.3 Manager Dashboard Routes

| Route                           | Component                   |
| ------------------------------- | --------------------------- |
| `/manager-dashboard`            | ManagerDashboard (Overview) |
| `/manager-dashboard/products`   | ManagerProducts             |
| `/manager-dashboard/orders`     | ManagerOrders               |
| `/manager-dashboard/categories` | ManagerCategories           |
| `/manager-dashboard/analytics`  | ManagerAnalytics            |
| `/manager-dashboard/comments`   | ManagerComments             |
| `/manager-dashboard/reviews`    | ManagerReviews              |
| `/manager-dashboard/profile`    | ManagerProfile              |

### 11.4 Super Admin Dashboard Routes

| Route                                                       | Component                      |
| ----------------------------------------------------------- | ------------------------------ |
| `/super-admin-dashboard`                                    | SuperAdminDashboard (Overview) |
| `/super-admin-dashboard/analytics`                          | Analytics                      |
| `/super-admin-dashboard/user-management`                    | UserManagement                 |
| `/super-admin-dashboard/products`                           | Products                       |
| `/super-admin-dashboard/orders`                             | Orders                         |
| `/super-admin-dashboard/product-analytics`                  | ProductAnalytics               |
| `/super-admin-dashboard/store-analytics`                    | StoreAnalytics                 |
| `/super-admin-dashboard/store-analytics/:store_id`          | StoreAnalyticsDetail           |
| `/super-admin-dashboard/store-analytics/:store_id/reviews`  | StoreReviews                   |
| `/super-admin-dashboard/store-analytics/:store_id/comments` | StoreComments                  |
| `/super-admin-dashboard/store-analytics/:store_id/products` | StoreProducts                  |
| `/super-admin-dashboard/comments`                           | Comments                       |
| `/super-admin-dashboard/reviews`                            | Reviews                        |
| `/super-admin-dashboard/reviews/:review_id`                 | ReviewDetails                  |
| `/super-admin-dashboard/commission-rates`                   | CommissionRates                |
| `/super-admin-dashboard/commissions`                        | Commissions                    |

---

## 12. ANALYTICS & DATA TRACKING

### 12.1 Events Tracked

| Event           | Data Captured                                         | Trigger               |
| --------------- | ----------------------------------------------------- | --------------------- |
| Product View    | product_id, user_id, time_spent, referrer, user_agent | Product page visit    |
| Product Click   | product_id, user_id, referrer, user_agent             | Product card click    |
| Add to Cart     | product_id, user_id, referrer, user_agent             | Add to cart button    |
| Add to Wishlist | product_id, user_id, referrer, user_agent             | Wishlist button click |
| Page View       | page_url, user_id, referrer, user_agent, ip_address   | Any page load         |
| Button Click    | button_name, page_url, element_id, user_id            | Interactive element   |

### 12.2 Dashboard Metrics

**Customer Dashboard:**

- Cart items count & total value
- Wishlist items count
- Order count & total spent
- Personalized product recommendations

**Manager Dashboard:**

- Total products, orders, cart items, wishlist items
- Units sold, total costs, total profit
- Sales, cost, and profit trend charts (daily)
- Top-rated products by review score
- Recent orders table

**Super Admin Dashboard:**

- All manager metrics (platform-wide)
- Total users count
- Commission revenue
- Commission earnings trend chart
- Cost analysis chart
- Revenue performance chart
- Store performance comparison
- Top commission earners

### 12.3 Financial Metrics Calculated

- **Revenue:** Sum of Order.total_amount where status = 'delivered'
- **Costs:** Sum of (Product.cost_price × OrderItem.quantity) for delivered orders
- **Profit:** Revenue - Costs
- **Commission Earnings:** Calculated using tiered rates or manual overrides
- **Stock Value:** Sum of (Product.cost_price × Product.stock_quantity)

---

## 13. UI/UX DESIGN SYSTEM

### 13.1 Color Palette (Active Theme: "Naqsh Couture")

| Token       | Hex     | Usage                               |
| ----------- | ------- | ----------------------------------- |
| gold-500    | #D4AF37 | Primary accent, CTAs, active states |
| gold-600    | #B8860B | Hover states, secondary gold        |
| black-silk  | #000000 | Primary backgrounds                 |
| black-naqsh | #1D1D1D | Card backgrounds, sidebar           |
| gray-silk   | #2D2D2D | Borders, secondary backgrounds      |
| gray-600    | #1F1F1F | Darker hover fallback               |
| white       | #FFFFFF | Text on dark backgrounds            |

### 13.2 Typography

- **Headings:** Playfair Display (serif) — Elegant, luxury feel
- **Body/Navigation:** Inter (sans-serif) — Clean, readable

### 13.3 Design Principles

- **Dark Mode by Default:** Dashboard and admin areas use dark backgrounds
- **Gold Accents:** All interactive elements use the gold (#D4AF37) accent
- **Minimalist Luxury:** Clean layouts with generous whitespace
- **Mobile-First Responsive:** Collapsible sidebars, responsive grids
- **Micro-interactions:** Hover states, scale transforms, color transitions on buttons and cards
- **Consistent Border Radius:** Rounded corners (rounded-lg, rounded-xl, rounded-2xl)
- **Shadow Hierarchy:** Shadow-sm → shadow-lg → shadow-xl for depth

### 13.4 Available Color Palettes (Defined in theme.js)

1. **Artisan Earth** — Warm browns, cream, burnt honey
2. **Modern Craft** — Navy, white, tangerine
3. **Botanical Stitch** — Olive, pale lemon, rose pink
4. **Midnight Thread** — Midnight blue, coral red
5. **Terracotta Studio** — Rich terracotta, gold

---

## 14. SUMMARY STATISTICS

| Metric                     | Count |
| -------------------------- | ----- |
| Database Tables            | 20    |
| Backend Route Files        | 13    |
| API Endpoints              | 50+   |
| Frontend Pages             | 40+   |
| React Components           | 30+   |
| Analytics Chart Components | 12    |
| User Roles                 | 3     |
| Frontend Utility Modules   | 4     |

---

_This document serves as a comprehensive context reference for writing a Final Year Project thesis based on the StitchPoint (Naqsh Couture) e-commerce platform._
