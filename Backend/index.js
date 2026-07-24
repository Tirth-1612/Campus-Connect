import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/usersRoutes.js';
import announcementsRoutes from './routes/announcementsRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import clubsRoutes from './routes/clubsRoutes.js';
import savedRoutes from './routes/savedRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import clubForumRoutes from './routes/clubForumRoutes.js';
import './database.js';

const app = express();

//CORS
const normalizeOrigin = (s) => (s || '').trim().replace(/\/+$/, '');

// If FRONTEND_ORIGINS is unset, default to localhost:5173
const originsEnv = process.env.FRONTEND_ORIGINS && process.env.FRONTEND_ORIGINS.trim()
  ? process.env.FRONTEND_ORIGINS
  : 'http://localhost:5173';

const allowed = originsEnv
  .split(',')
  .map((s) => normalizeOrigin(s))
  .filter(Boolean);

app.get('/', (_req, res) => res.json({ status: 'ok', message: 'CampusConnect API is running' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use((req, _res, next) => {
  console.log('request', req.method, req.url);
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman/server-to-server
    const o = normalizeOrigin(origin);
    const ok = allowed.some((a) => {
      // exact match or wildcard like *.vercel.app
      if (a.startsWith('*.')) return o.endsWith(a.slice(1));
      return o === a;
    });
    return ok ? callback(null, true) : callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', authRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/clubs/forum', clubForumRoutes);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server is operational'));



//user logins with email,pass.
//email pass goes to backend 
//backend verifies it and if everything good returns login token and user info
//frontend stores token
//for evreything else sends that token as authentication header ,i.e bearer <token> which is used in authMiddleware.js
//if auth checks out then loads data for that token

