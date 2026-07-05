import express from 'express';
import auth from '../modules/authMiddleware.js';
import { getUsersCount } from '../controllers/adminController.js';
const router = express.Router();

// Read-only users count
router.get('/users/count', auth, getUsersCount);
export default router;
