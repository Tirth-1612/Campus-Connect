import express from 'express';
import auth from '../modules/authMiddleware.js';
import { saveItem, listSaved, listSavedAnnouncements, listSavedEvents } from '../controllers/savedController.js';

const router = express.Router();

// Alias: allow POST /api/saved to save an item
router.post('/', auth, saveItem);
router.post('/saveItem', auth, saveItem);
router.get('/listSavedItem', auth, listSaved);
router.get('/announcements', auth, listSavedAnnouncements);
router.get('/events', auth, listSavedEvents);

export default router;
