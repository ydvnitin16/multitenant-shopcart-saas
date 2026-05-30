# ShopCart – Multi-Tenant MERN E-Commerce SaaS

ShopCart is a full-stack multi-tenant e-commerce platform built with the MERN stack. It supports three primary roles—Customer, Vendor, and Admin—and implements a marketplace architecture where vendors can create storefronts, manage products, process orders, and subscribe to paid plans while customers can purchase products from multiple vendors through a unified checkout experience.

The project focuses on solving real marketplace challenges such as vendor onboarding, multi-vendor order processing, inventory synchronization, subscription billing, payment verification, and role-based access control.

## Live Demo

* Live On: https://shopcart-saas.vercel.app/

---

# What Is Already Built

This repository already includes production-style marketplace features.

## Authentication & Authorization

* JWT cookie authentication
* Protected frontend routes
* Protected backend APIs
* Role-based access control
* Vendor ownership validation
* Admin-only management routes

## Customer Features

* Product catalog browsing
* Product search, filtering, and pagination
* Product detail pages
* Public vendor storefronts
* Shopping cart management
* Address management
* Cash on Delivery (COD)
* Stripe card payments
* Order history
* Order cancellation
* Reorder support

## Vendor Features

* Store request workflow
* Store approval lifecycle
* Product management dashboard
* Product image uploads
* Inventory management
* Store order management
* Revenue and sales analytics
* Stripe subscription plans

## Admin Features

* Store approval and rejection
* Store activation and deactivation
* Vendor management
* Platform analytics dashboard
* Subscription monitoring

---

# Why This Project Has Value

ShopCart is not a basic CRUD application.

The project demonstrates:

* Multi-tenant architecture
* Marketplace order processing
* Multi-vendor checkout
* Stripe payment integration
* Subscription billing
* Inventory synchronization
* SaaS-style vendor onboarding
* Role-based authorization
* Service-layer backend architecture

The system solves many problems commonly found in real marketplace products.

---

# Core Marketplace Flows

## Vendor Onboarding Flow

```text
User
 ↓
Store Request
 ↓
Admin Review
 ↓
Approve / Reject
 ↓
Vendor Dashboard Access
```

## Customer Checkout Flow

```text
Browse Products
 ↓
Add To Cart
 ↓
Select Address
 ↓
Choose Payment Method
 ↓
Create Parent Order
 ↓
Split Into Store Orders
 ↓
Vendor Fulfillment
```

## Stripe Payment Flow

```text
Create Order
 ↓
Reserve Stock
 ↓
Stripe Checkout
 ↓
Webhook Verification
 ↓
Mark Orders Paid
```

## Vendor Subscription Flow

```text
Select Plan
 ↓
Stripe Billing Checkout
 ↓
Webhook Sync
 ↓
Update Subscription Status
```

---

# Multi-Vendor Checkout Architecture

One of the most important parts of the project is the marketplace checkout system.

Instead of creating a single order:

```text
Customer Checkout
        ↓
    Parent Order
        ↓
 ┌──────┼──────┐
 ↓      ↓      ↓
Store A Store B Store C
Order   Order   Order
```

The system:

* Groups cart items by vendor
* Creates vendor-specific orders
* Tracks vendor earnings independently
* Synchronizes payment status
* Restores inventory on failed payments
* Supports independent vendor fulfillment

This architecture is closer to real marketplace platforms than traditional single-vendor stores.

---

# Tech Stack

## Frontend

* React
* Vite
* React Router
* Zustand
* Tailwind CSS
* React Hook Form
* Yup
* Recharts
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Bcrypt
* Multer
* Cloudinary
* Stripe

## Security & Infrastructure

* Helmet
* Express Rate Limit
* Express Mongo Sanitize
* HTTP-only Cookies
* Role-Based Authorization
* Centralized Error Handling

---

# Project Structure

```text
ShopCart/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   └── utils/
│
├── README.md
└── docs/
```


---

# Main Backend Modules

| Module        | Responsibility                                  |
| ------------- | ----------------------------------------------- |
| Auth          | Registration, login, logout, session management |
| Stores        | Store onboarding and vendor operations          |
| Products      | Catalog and product management                  |
| Orders        | Parent orders and store orders                  |
| Addresses     | Shipping address management                     |
| Stripe        | Payments and webhooks                           |
| Subscriptions | Vendor billing plans                            |
| Admin         | Platform administration                         |

---

# Important API Routes

## Authentication

```http
POST   /api/auth/register
POST   /api/auth/login
DELETE /api/auth/logout
```

## Stores

```http
POST   /api/stores/request
GET    /api/stores
GET    /api/stores/:slug
GET    /api/stores/:storeId/stats
```

## Products

```http
GET    /api/products
GET    /api/products/:id

POST   /api/stores/:storeId/products
PUT    /api/stores/:storeId/products/:productId
DELETE /api/stores/:storeId/products/:productId
```

## Orders

```http
POST   /api/orders
GET    /api/orders
PATCH  /api/orders/:id/cancel
```

## Stripe

```http
POST   /api/stripe/checkout
POST   /api/stripe/billing/checkout
POST   /api/stripe/webhook
```

## Admin

```http
GET    /api/admin/stats
GET    /api/admin/stores
PATCH  /api/admin/stores/:storeId/status
PATCH  /api/admin/stores/:storeId/activation
```

---

# Current Strengths In The Codebase

## Marketplace Features

* Vendor approval workflow
* Multi-vendor checkout
* Store-specific order management
* Inventory synchronization
* Stripe payment verification
* Subscription billing support

## Security

* JWT authentication
* Ownership validation
* Role-based permissions
* Protected routes
* API rate limiting
* NoSQL injection protection

## Architecture

* Service-layer architecture
* Modular backend structure
* Feature-based frontend organization
* Centralized error handling
* Reusable UI components

---

# Environment Variables

## Backend (.env)

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

STRIPE_STARTER_PRICE_ID=your_starter_plan_price_id
STRIPE_PRO_PRICE_ID=your_pro_plan_price_id
```

## Frontend (.env)

```env
VITE_SERVER_URL=http://localhost:3000
```

---

# Local Setup

## Clone Repository

```bash
git clone <repository-url>
cd ShopCart
```

## Backend Setup

```bash
cd Backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Future Improvements

* Redis caching
* Queue-based background jobs
* Docker support
* Automated testing
* Product reviews and ratings
* Coupons and promotions
* Vendor payout management
* Queue-based background jobs

---
