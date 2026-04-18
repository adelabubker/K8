# K8 Automation

![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js%2018+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

K8 Automation is a full-stack web application for showcasing and managing automation services. It combines a polished public-facing website with a secure admin dashboard, role-based user management, and a MongoDB-backed API for authentication and service operations.

The project is organized as a single repository with a React/Vite frontend and an Express/MongoDB backend, making it straightforward to develop locally and deploy as two coordinated applications.

---

## Features

### Public website
- Modern landing page for the K8 Automation brand
- Public services catalog with category filtering, search, and pagination
- Contact and success pages for lead-generation flow
- Fallback featured services displayed even when the API has no data

### Authentication and authorization
- User registration and login
- JWT-based authentication
- Session restore on refresh using `/api/auth/me`
- Logout invalidation backed by token verification against the database
- Role-based access control for `user`, `admin`, and `fullAdmin`

### Admin dashboard
- Protected dashboard for signed-in admin users
- Create, edit, activate, and manage services
- Search and paginate service records
- Quick-action navigation for common admin workflows

### Full admin controls
- View all users with pagination
- Change user roles
- Delete users with safety guards
- Prevent self-deletion, self-role-changes, and deletion of other `fullAdmin` accounts

### Backend protections
- Helmet security headers
- CORS configuration via environment variables
- API rate limiting
- Password hashing with bcrypt
- Centralized error handling

---

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- React Hot Toast
- Lucide React

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- dotenv
- Helmet
- CORS
- express-rate-limit
- Morgan

---

## Project Structure

```text
k8-main/
├── backend/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── logs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── .gitattributes
```

---

## User Roles

The application defines three roles:

- **user** — standard authenticated user
- **admin** — can access the dashboard and manage services
- **fullAdmin** — can manage services and perform user administration

### Route access summary

#### Public routes
- `/`
- `/services-page`
- `/success-page`
- `/contact-page`
- `/login`
- `/register`

#### Admin routes
- `/dashboard`
- `/dashboard/services`
- `/dashboard/services/add`
- `/dashboard/services/edit/:id`

#### Full admin routes
- `/dashboard/users`
- `/dashboard/settings`

---

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Services
- `GET /api/services`
- `GET /api/services/:id`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

### Users
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id/role`
- `DELETE /api/users/:id`

### Health check
- `GET /api/health`

---

## Environment Variables

### Backend
Create a `backend/.env` file from `backend/.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/k8automation
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
ENCRYPTION_KEY=64_character_hex_string_for_32_bytes_key
FRONTEND_URL=http://localhost:5173
```

### Frontend
Create a `frontend/.env` file from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started

### Prerequisites
Make sure you have the following installed:

- Node.js 18 or newer
- npm 9 or newer
- MongoDB local instance or MongoDB Atlas connection

### 1) Clone the repository

```bash
git clone https://github.com/your-username/k8-automation.git
cd k8-automation
```

### 2) Install dependencies

In one terminal:

```bash
cd backend
npm install
```

In a second terminal:

```bash
cd frontend
npm install
```

### 3) Configure environment variables
Create the `.env` files in `backend/` and `frontend/` using the examples above.

### 4) Start the backend

```bash
cd backend
npm run dev
```

### 5) Start the frontend

```bash
cd frontend
npm run dev
```

### 6) Open the application

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/api/health`

---

## Authentication Flow

1. A user registers or logs in from the frontend.
2. The backend returns a JWT token.
3. The frontend stores the token in `localStorage`.
4. Axios automatically attaches the token to authenticated requests.
5. On refresh, the app calls `/api/auth/me` to restore the session.
6. If the backend returns `401`, the frontend clears session data and redirects the user to the login page.

---

## Service Data Model

Each service record includes:

- `title`
- `description`
- `category`
- `location`
- `icon`
- `isActive`
- `createdBy`
- `createdAt`
- `updatedAt`

Supported `location` values:
- `home`
- `services`
- `hero`
- `featured`

---

## Security Notes

This project includes several built-in security practices:

- Password hashing using bcrypt
- JWT validation for protected endpoints
- Server-side token comparison for logout invalidation
- CORS allowlist support with `FRONTEND_URL`
- Helmet for common HTTP security headers
- Rate limiting on `/api/*`

---

## Important Setup Notes

- Do **not** commit `.env` files to GitHub
- Do **not** commit `node_modules`
- Keep `.env.example` in the repository
- If you need your first administrator account, register normally and then promote that account manually in MongoDB to `admin` or `fullAdmin`
- If the project was copied from another machine, delete both `node_modules` folders and reinstall dependencies locally before running build scripts

Example cleanup before pushing to GitHub:

```bash
rm -rf backend/node_modules frontend/node_modules
```

Then reinstall:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## Suggested Improvements

If you continue developing this project, strong next steps would be:

- add a seed script for creating the first `fullAdmin`
- add automated API and frontend tests
- add Docker support
- add CI/CD workflows
- add deployment instructions for frontend and backend hosting
- add screenshots to this README
- add a live demo link

---

## License

This project is licensed under the MIT License.

---

## Author

Built for the **K8 Automation** brand and admin workflow use case.

If you publish this repository, consider replacing this section with:
- your name
- your GitHub profile
- your portfolio or LinkedIn
