// File: README.md
// Purpose: Documentation and setup instructions for KaamLink MERN application

# KaamLink

KaamLink is a location-based digital marketplace that connects daily wage workers (maids, plumbers, electricians, drivers, cooks, carpenters) with households and small businesses who need them.

> **Tagline:** Your trusted local workforce, one click away.

## Features

- [x] JWT-based auth with worker, employer, and admin roles
- [x] Worker profiles with skills, categories, location, and verification status
- [x] Employer job posting and worker job discovery
- [x] Mock OTP verification and mock payment flows
- [x] Admin dashboard for approvals and platform stats
- [x] React 18 + Tailwind CSS responsive UI

## Tech Stack

| Layer     | Technologies                                                                 |
|----------|------------------------------------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios, React Hot Toast        |
| Backend  | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, multer, helmet, morgan |

## Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-url> kaamlink
cd kaamlink
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

4. Configure environment variables (already provided with sensible defaults):

- `server/.env`
- `client/.env`

5. Seed the database (MongoDB must be running locally):

```bash
cd server
npm run seed
```

6. Run the backend:

```bash
npm run dev
```

7. Run the frontend:

```bash
cd ../client
npm run dev
```

## API Overview

All endpoints are prefixed with `/api`. Key route groups:

| Area    | Base Path       | Description                      |
|--------|-----------------|----------------------------------|
| Auth   | `/api/auth`     | Registration, login, OTP, me     |
| Workers| `/api/workers`  | Profiles, search, documents      |
| Jobs   | `/api/jobs`     | Job lifecycle and status changes |
| Reviews| `/api/reviews`  | Ratings and feedback             |
| Payments| `/api/payments`| Mock payment initiation/confirm  |
| Admin  | `/api/admin`    | Approvals, stats, user/job mgmt  |

## Demo Credentials

- **Admin:** `admin@kaamlink.com` / `admin123`
- **Sample worker/employer accounts:** created via seed script.

## Screenshots

Screenshots coming soon. Add UI captures of the landing page, dashboards, and admin views here.

## Folder Structure (high level)

- `client/` – React frontend (Vite, Tailwind, React Router)
- `server/` – Express backend (models, controllers, routes)

## License

This project is licensed under the MIT License.

