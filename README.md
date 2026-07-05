# CampusConnect

[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> A modern, role-aware campus engagement platform designed to connect students, faculty, and administrators through announcements, events, clubs, and personalized dashboards.

CampusConnect brings campus communication into one intelligent experience. Whether you are a student tracking updates, a faculty member publishing events, or an admin managing community operations, the platform is built to make campus life more organized, interactive, and engaging.

## Why CampusConnect?

- Unified experience for campus communication and engagement
- Role-based access for students, faculty, and admins
- Fast and responsive interface powered by React + Vite
- Secure authentication and protected routes
- Scalable backend architecture with Supabase as the data layer

---

## ✨ Core Features

- Personalized dashboards tailored to user roles
- Announcements management for students, faculty, and admins
- Event creation and browsing with role-aware visibility
- Club discovery and membership workflows
- Saved announcements and saved events for quick access
- Protected routes and secure auth flow
- Clean, modular frontend architecture for future expansion

---

## 🧱 Architecture Overview

CampusConnect follows a modern full-stack pattern:

- Frontend: React + Vite + React Router for a fast, dynamic user experience
- Backend: Node.js + Express for API handling, auth, and business logic
- Database: Supabase PostgreSQL for structured storage and querying
- Auth: JWT-based authentication with protected routes and role checks

```text
Frontend (React/Vite)  <---->  Backend (Express/Node.js)  <---->  Supabase Database
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, React Icons |
| Backend | Node.js, Express 5, JWT, bcrypt, CORS |
| Database | Supabase PostgreSQL |
| Tooling | ESLint, Vite Preview |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- A Supabase project

### 1) Clone the repository

```bash
git clone https://github.com/your-username/CampusConnect.git
cd CampusConnect
```

### 2) Install dependencies

```bash
# Frontend
cd Frontend
npm install

# Backend
cd ../Backend
npm install
```

### 3) Configure environment variables

Create the required environment variables in the backend environment file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5001
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
JWT_SECRET=your_secret_key
```

For the frontend, make sure your Vite environment contains the Supabase anon values if you plan to use the client directly.

### 4) Run the app

Start the backend:

```bash
cd Backend
npm start
```

Start the frontend:

```bash
cd Frontend
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

---

## 📂 Project Structure

```text
CampusConnect/
├── Backend/
│   ├── controllers/
│   ├── modules/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── routes/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 👥 User Roles

- Student: Explore announcements, events, clubs, and saved content
- Faculty: Publish announcements and events, manage campus updates
- Admin: Manage clubs, review requests, and oversee platform content

---

## 🔐 Authentication Flow

The app uses a secure JWT-based flow:

1. User signs up or logs in
2. Backend validates credentials
3. A token is issued and stored client-side
4. Protected routes verify the token before granting access

---

## 📈 Future Roadmap

- AI-based recommendations for announcements and events
- Real-time notifications and activity feeds
- Advanced analytics for campus engagement
- Mobile-first enhancements and PWA support
- Expanded moderation and role management tools

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with focus on clarity, scalability, and the modern experience students and faculty expect from a campus platform.



