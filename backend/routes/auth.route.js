import express from 'express';
import {
  signupController,
  loginController,
  logoutController,
  getCurrentUser,
} from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);

router.get('/me', protectedRoute, getCurrentUser);
export default router;
