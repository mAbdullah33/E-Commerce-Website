# PVC eCommerce — Backend API

Node.js + Express.js + MongoDB REST API for the PVC Wall Panel eCommerce platform.

---

## 📁 Folder Structure

```
backend/
├── server.js                 # Entry point
├── package.json
├── .env.example              # Environment variable template
├── config/
│   ├── db.js                 # MongoDB connection
│   ├── cloudinary.js         # Image upload (Cloudinary + Multer)
│   └── seeder.js             # Database seeder (17 products + admin + orders)
├── models/
│   ├── User.js               # Users (admin + customers)
│   ├── Product.js            # PVC/Hard Panel products
│   ├── Order.js              # Orders with status history
│   ├── Cart.js               # Cart (guest + logged-in)
│   ├── Wishlist.js           # Wishlist (guest + logged-in)
│   └── Contact.js            # Contact form submissions
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── cartController.js
│   ├── wishlistController.js
│   └── dashboardController.js
├── middleware/
│   └── auth.js               # JWT protect / adminOnly / optionalAuth
└── routes/
    ├── authRoutes.js
    ├── productRoutes.js
    ├── orderRoutes.js
    ├── cartRoutes.js
    ├── wishlistRoutes.js
    ├── dashboardRoutes.js
    └── contactRoutes.js
```

---

## ⚙️ Setup & Installation

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pvc_ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Cloudinary (for image uploads — get free account at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
ADMIN_EMAIL=admin@pvcpanels.com
ADMIN_PASSWORD=Admin@123456
```

### 3. Seed the database
```bash
npm run seed
# To destroy all data:
node config/seeder.js -d
```

### 4. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

## 🔑 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint       | Access  | Description          |
|--------|----------------|---------|----------------------|
| POST   | `/register`    | Public  | Register new user    |
| POST   | `/login`       | Public  | Login (get JWT)      |
| GET    | `/me`          | Private | Get current user     |
| PUT    | `/profile`     | Private | Update profile       |

**Login Request:**
```json
POST /api/auth/login
{
  "email": "admin@pvcpanels.com",
  "password": "Admin@123456"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "Admin", "email": "...", "role": "admin" }
}
```

---

### Products — `/api/products`

| Method | Endpoint              | Access  | Description                  |
|--------|-----------------------|---------|------------------------------|
| GET    | `/`                   | Public  | Get all products (filterable)|
| GET    | `/featured`           | Public  | Get featured products        |
| GET    | `/hot-sale`           | Public  | Get hot-sale products        |
| GET    | `/:id`                | Public  | Get single product           |
| GET    | `/slug/:slug`         | Public  | Get product by URL slug      |
| POST   | `/`                   | Admin   | Create new product           |
| PUT    | `/:id`                | Admin   | Update product               |
| DELETE | `/:id`                | Admin   | Delete product               |
| DELETE | `/:id/image/:pubId`   | Admin   | Delete product image         |

**Query Parameters for GET `/api/products`:**
```
?category=PVC Panel        # Filter by category (PVC Panel | Hard Panel | Accessories)
?inStock=true              # Filter by stock status
?isNewDesign=true          # Show new designs only
?isHotSale=true            # Show hot sale items
?isFeatured=true           # Show featured items
?minPrice=500&maxPrice=2000 # Price range filter
?sort=price_asc            # Sort: price_asc | price_desc | popular | rating
?page=1&limit=12           # Pagination
?search=marble             # Full-text search
```

**Create Product (Admin, multipart/form-data):**
```
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

name: "3D Marble PVC Panel"
description: "Beautiful marble texture..."
price: 1200
originalPrice: 1500
category: PVC Panel
stock: 100
isNewDesign: true
isFeatured: false
isHotSale: true
images: [file1.jpg, file2.jpg]   ← up to 5 images
specifications: {"size":"60x60cm","thickness":"8mm"}
tags: marble,white,3d
```

---

### Orders — `/api/orders`

| Method | Endpoint           | Access  | Description                |
|--------|--------------------|---------|----------------------------|
| POST   | `/`                | Public  | Create new order           |
| GET    | `/my-orders`       | Private | Get current user's orders  |
| GET    | `/:id`             | Private | Get single order           |
| GET    | `/`                | Admin   | Get all orders             |
| PUT    | `/:id/status`      | Admin   | Update order status        |
| DELETE | `/:id`             | Admin   | Delete order               |

**Create Order:**
```json
POST /api/orders
{
  "customer": {
    "name": "Ahmed Khan",
    "email": "ahmed@example.com",
    "phone": "+92-300-1234567",
    "address": {
      "street": "45 Model Town",
      "city": "Lahore",
      "state": "Punjab",
      "postalCode": "54000"
    }
  },
  "items": [
    { "product": "<productId>", "quantity": 2 }
  ],
  "paymentMethod": "COD",
  "notes": "Please call before delivery"
}
```

**Order Status Values:** `pending` → `confirmed` → `processing` → `shipped` → `delivered` | `cancelled`

---

### Cart — `/api/cart`

Supports **guest users** via `x-session-id` header, and **logged-in users** via JWT.

| Method | Endpoint           | Access  | Description          |
|--------|--------------------|---------|----------------------|
| GET    | `/`                | Public  | Get cart             |
| POST   | `/add`             | Public  | Add item to cart     |
| PUT    | `/update`          | Public  | Update item quantity |
| DELETE | `/remove/:id`      | Public  | Remove single item   |
| DELETE | `/clear`           | Public  | Clear entire cart    |

```json
POST /api/cart/add
Headers: x-session-id: guest-abc123   ← for guest users
{
  "productId": "<productId>",
  "quantity": 2
}
```

---

### Wishlist — `/api/wishlist`

| Method | Endpoint           | Access  | Description               |
|--------|--------------------|---------|---------------------------|
| GET    | `/`                | Public  | Get wishlist              |
| POST   | `/toggle`          | Public  | Add/remove product toggle |
| DELETE | `/remove/:id`      | Public  | Remove specific product   |

---

### Dashboard — `/api/dashboard` (Admin only)

| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| GET    | `/stats`            | Total products, orders, revenue |
| GET    | `/top-products`     | Best-selling products           |
| GET    | `/category-sales`   | Sales broken down by category   |
| GET    | `/recent-orders`    | Last 10 orders                  |

---

### Contact — `/api/contact`

| Method | Endpoint     | Access | Description           |
|--------|--------------|--------|-----------------------|
| POST   | `/`          | Public | Submit contact form   |
| GET    | `/`          | Admin  | Get all messages      |
| PUT    | `/:id/read`  | Admin  | Mark message as read  |
| DELETE | `/:id`       | Admin  | Delete message        |

---

## 🏗️ MongoDB Schemas Summary

### Product
```
name, description, price, originalPrice, category (PVC Panel|Hard Panel|Accessories),
images[], stock, inStock (auto), isNewDesign, isFeatured, isHotSale,
specifications{size,thickness,material,finish,color,pattern},
tags[], sold, ratings{average,count}, reviews[], slug (auto-generated)
```

### Order
```
orderNumber (auto), customer{name,email,phone,address}, user (ref),
items[{product,name,image,price,quantity}],
subtotal, shippingCost, discount, total,
status (pending→delivered), paymentMethod, paymentStatus,
statusHistory[], notes
```

### Cart / Wishlist
```
user (ref) OR sessionId (for guests)
items[{product, quantity, price}] / products[]
totalPrice (auto-calculated)
```

---

## 🌱 Seeder Data Summary

After running `npm run seed`:

| Data          | Count  | Details                                      |
|---------------|--------|----------------------------------------------|
| Users         | 2      | 1 admin + 1 test user                        |
| Products      | 17     | 10 PVC Panels, 5 Hard Panels, 2 Accessories  |
| Orders        | 4      | Mixed statuses (pending/processing/shipped/delivered) |

---

## 🔒 Security Features
- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens with configurable expiry
- Admin-only routes protected at middleware level
- Input validation on all endpoints
- File upload type + size restrictions (images only, max 5MB)
- CORS configured for frontend origins only