import express from 'express';
import auth from '../modules/authMiddleware.js';
import { listEvents, createEvent } from '../controllers/eventsController.js';

const router = express.Router();

router.get('/list', listEvents);
router.post('/create', auth, createEvent);

export default router;
