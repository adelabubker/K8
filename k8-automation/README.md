# K8 Automation — Enterprise Automation Agency Platform

A production-ready, full-stack web application for a professional automation agency. Built with **React + Node.js + MongoDB** with JWT authentication and role-based access control.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Node.js, Express.js, MVC Architecture |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (JSON Web Tokens), bcrypt |
| Styling | Custom CSS Design System (dark SaaS UI) |

---

## 📁 Project Structure

```
k8-automation/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, logout
│   │   ├── serviceController.js # Services CRUD
│   │   └── userController.js  # User management
│   ├── middleware/
│   │   ├── auth.js            # JWT + role middleware
│   │   └── errorHandler.js    # Global error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Service.js         # Service schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js   # JWT utility
│   │   └── seed.js            # Database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── DashboardLayout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── HomePage.jsx     # Public landing page
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ServicesPage.jsx
    │   │   ├── AddServicePage.jsx
    │   │   ├── EditServicePage.jsx
    │   │   ├── UsersPage.jsx
    │   │   └── SettingsPage.jsx
    │   ├── utils/
    │   │   └── api.js           # Axios instance + interceptors
    │   ├── App.jsx              # Routes
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Design system
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 👥 Role System

| Role | Permissions |
|------|------------|
| **fullAdmin** | All access: users, services, delete, role management, settings |
| **admin** | Add/edit services only. No user management. |
| **user** | Public site only. No dashboard access. |

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Private |
| GET | `/api/auth/me` | Private |

### Services
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/services` | Public |
| GET | `/api/services/:id` | Public |
| POST | `/api/services` | Admin+ |
| PUT | `/api/services/:id` | Admin+ |
| DELETE | `/api/services/:id` | Full Admin |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Full Admin |
| GET | `/api/users/:id` | Full Admin |
| DELETE | `/api/users/:id` | Full Admin |
| PUT | `/api/users/:id/role` | Full Admin |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
```

### 2. Setup Frontend

```bash
cd frontend
cp .env.example .env
npm install
```

### 3. Seed Database (Optional)

```bash
cd backend
node utils/seed.js
```

This creates:
- **Admin Email:** `admin@k8automation.io`
- **Admin Password:** `admin123456`
- 6 sample services

### 4. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Pages

| URL | Page | Access |
|-----|------|--------|
| `/` | Home (Landing) | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Overview | Admin+ |
| `/dashboard/services` | Services List | Admin+ |
| `/dashboard/services/add` | Add Service | Admin+ |
| `/dashboard/services/edit/:id` | Edit Service | Admin+ |
| `/dashboard/users` | User Management | Full Admin |
| `/dashboard/settings` | Settings | Full Admin |

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT tokens** with configurable expiration
- Tokens stored in DB for **server-side invalidation** on logout
- **Role middleware** on all protected routes
- Input validation and sanitization
- HTTP request rate limiting (add express-rate-limit for production)
- Environment variables for all secrets

---

## 🚢 Production Deployment

### Backend (e.g., Railway, Render, Fly.io)
1. Set environment variables from `.env.example`
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas for database

### Frontend (e.g., Vercel, Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Build: `npm run build`
3. Deploy the `dist/` folder

---

## 📄 License

MIT — Free to use and modify for commercial projects.

---

**Built with ❤️ by K8 Automation**
