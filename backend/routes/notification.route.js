import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import {
  getUserNotifications,
  readNotification,
  deleteNotification,
} from '../controllers/notification.controller.js';
const router = express.Router();

router.get('/', protectedRoute, getUserNotifications);

router.put('/:id/read', protectedRoute, readNotification);

router.delete('/:id', protectedRoute, deleteNotification);

export default router;
