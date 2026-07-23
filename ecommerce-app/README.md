# ShopEase — Full-Stack E-commerce Application

A complete e-commerce web app built with **React** (frontend), **Node.js/Express** (backend REST API), and **MongoDB** (database). Includes **45 API endpoints** covering authentication, products, categories, cart, wishlist, orders, reviews, and addresses, plus a customer-facing storefront and an admin dashboard.

## Project structure

```
ecommerce-app/
├── backend/          Node/Express/MongoDB REST API
│   ├── config/        DB connection
│   ├── controllers/   Business logic
│   ├── middleware/     Auth (JWT) + error handling
│   ├── models/         Mongoose schemas
│   ├── routes/         Express routers
│   ├── utils/          Token helper + DB seeder
│   └── server.js       App entry point
└── frontend/         React (Vite) storefront + admin panel
    └── src/
        ├── api/         Axios instance
        ├── context/     Auth & Cart state (React Context)
        ├── components/  Navbar, Footer, ProductCard, route guards
        ├── pages/       Customer-facing pages
        └── admin/       Admin dashboard pages
```

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

### 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET as needed
npm run seed               # optional: creates sample admin/customer users, categories, products
npm run dev                 # starts API on http://localhost:5000
```
Seeded demo logins (after `npm run seed`):
- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

### 2. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL defaults to http://localhost:5000/api
npm run dev                 # starts React app on http://localhost:5173
```

The Vite dev server also proxies `/api` requests to `localhost:5000`, so the app works even without setting `VITE_API_URL` explicitly during local development.

### 3. Build for production
```bash
cd frontend && npm run build     # outputs static files to frontend/dist
cd backend  && npm start          # run the API with node (use pm2/systemd in real production)
```

## API reference (45 endpoints)

**Auth** — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /register | — | Create account |
| POST | /login | — | Log in, returns JWT |
| POST | /logout | — | Clear auth cookie |
| GET | /me | User | Get current user |
| PUT | /profile | User | Update name/phone/avatar |
| PUT | /change-password | User | Change password |

**Categories** — `/api/categories`
| Method | Endpoint | Auth |
|---|---|---|
| GET | / | — |
| GET | /:id | — |
| POST | / | Admin |
| PUT | /:id | Admin |
| DELETE | /:id | Admin |

**Products** — `/api/products`
| Method | Endpoint | Auth |
|---|---|---|
| GET | / (search/filter/sort/paginate via query params) | — |
| GET | /featured | — |
| GET | /category/:categoryId | — |
| GET | /:id | — |
| POST | / | Admin |
| PUT | /:id | Admin |
| DELETE | /:id | Admin |
| POST | /:id/images | Admin |

**Cart** — `/api/cart` (all require login)
| Method | Endpoint |
|---|---|
| GET | / |
| POST | /add |
| PUT | /update/:itemId |
| DELETE | /remove/:itemId |
| DELETE | /clear |

**Wishlist** — `/api/wishlist` (all require login)
| Method | Endpoint |
|---|---|
| GET | / |
| POST | /add |
| DELETE | /remove/:productId |
| DELETE | /clear |

**Orders** — `/api/orders` (all require login)
| Method | Endpoint | Auth |
|---|---|---|
| POST | / | User |
| GET | /myorders | User |
| GET | /:id | Owner or Admin |
| PUT | /:id/pay | User |
| PUT | /:id/cancel | Owner or Admin |
| GET | /admin/all | Admin |
| GET | /admin/stats | Admin |
| PUT | /:id/status | Admin |

**Reviews** — `/api/reviews`
| Method | Endpoint | Auth |
|---|---|---|
| GET | /product/:productId | — |
| POST | / | User |
| PUT | /:id | Owner |
| DELETE | /:id | Owner or Admin |

**Addresses** — `/api/addresses` (all require login)
| Method | Endpoint |
|---|---|
| GET | / |
| POST | / |
| PUT | /:id |
| DELETE | /:id |
| PUT | /:id/default |

Plus `GET /api/health` for a simple uptime check.

## Key features
- JWT authentication with role-based access control (user/admin)
- Server-side cart & wishlist persistence per user
- Product search, category/price filters, sorting, pagination
- Full checkout flow: address selection, order creation with server-computed pricing (tax/shipping), stock decrement, cart clearing
- Order lifecycle: pending → processing → shipped → delivered, with cancellation + automatic restocking
- Product reviews with automatic average rating recalculation
- Admin dashboard: revenue/order stats, product CRUD, category CRUD, order status management
- Centralized error handling and consistent JSON response shape (`{ success, data, message }`)

## Notes / next steps for production
- Swap the placeholder image URLs / add real file uploads (e.g. S3 + multer, or Cloudinary)
- Add a real payment gateway integration (Stripe/Razorpay) — `paymentMethod` and `isPaid` fields are already modeled
- Add request validation (e.g. `zod`/`joi`) and rate limiting on auth routes
- Add automated tests (Jest + Supertest for the API, React Testing Library for the frontend)
