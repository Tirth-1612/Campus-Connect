import express from 'express';
import auth from '../modules/authMiddleware.js';
import authorize from '../modules/authorize.js';
import { listAnnouncements, createAnnouncement } from '../controllers/announcementsController.js';

const router = express.Router();

router.get('/list', listAnnouncements);
router.post('/create', auth, createAnnouncement);

export default router;
