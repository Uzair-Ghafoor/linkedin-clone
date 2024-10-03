import express from 'express';
import {
  getSuggestedUsers,
  getUserProfile,
  updateProfile,
} from '../controllers/user.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
const router = express.Router();
router.get('/suggestions', protectedRoute, getSuggestedUsers);
router.get('/:username', protectedRoute, getUserProfile);
router.post('/profile', protectedRoute, updateProfile);

export default router;
