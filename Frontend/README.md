# CampusConnect Frontend (React + Vite)

A production-ready React frontend for CampusConnect. This app will connect to an existing Node.js/Express/PostgreSQL backend. Dark mode by default, Context-based auth and theme, and React Router for navigation.

## Tech Stack
- React (JSX)
- React Router DOM
- Plain CSS (CSS variables, responsive)
- react-icons
- Context API (Auth + Theme)
- fetch for API (stubbed)

## Scripts
- npm run dev
- npm run build
- npm run preview

## Install
npm i
npm i react-router-dom react-icons

## Structure
src/
- api/: fetch wrappers (auth, clubs, announcements, events, saved)
- components/: common UI, forms, cards
- contexts/: ThemeContext, AuthContext
- layouts/: PublicLayout, DashboardLayout
- pages/: public/student/faculty/admin sections
- routes/: ProtectedRoute
- styles/: theme.css (CSS variables, dark default)
- utils/: storage helpers
- App.jsx: routes
- main.jsx: providers + theme import

## Theme
- Default dark theme via data-theme
- Toggle in header (stored in localStorage)
- CSS variables in styles/theme.css

## Auth
- AuthContext holds token + user
- Stored in localStorage
- Login/Signup pages; redirect by role
- ProtectedRoute enforces access and redirects

## Pages
- Public: Landing, Login, Signup
- Student: Dashboard, Profile, Clubs, Saved
- Faculty: Dashboard, Profile, Create Announcement/Event, Saved
- Admin: Dashboard, Profile, Join Requests, Club Members

## API Integration (Stubbed)
- api/auth.js: signup, login, updateProfile
- api/clubs.js: list, join, fetch pending requests, update request status
- api/announcements.js: list, create
- api/events.js: list, create
- api/saved.js: list, save
- api/admin.js: user count


Match backend endpoints:
- /api/users → signup, login, update
- /api/clubs → list, join, pending requests, approve/reject
- /api/announcements → list, create
- /api/events → list, create
- /api/saved → list, save
- api/admin -> user count


Replace stub calls with real URLs and handle tokens when backend is available.

## Connecting Backend Later
- Ensure CORS and base URL as needed
- Pass Authorization: Bearer <token> on protected routes
- Replace stub fallbacks with real payloads