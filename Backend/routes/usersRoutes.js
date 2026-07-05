import express from 'express';
import { signup, login , update } from '../controllers/usersController.js';
import auth from '../modules/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/update',auth ,update)

export default router;
