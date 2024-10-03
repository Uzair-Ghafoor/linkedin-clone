import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import {
  createPost,
  getFeedPost,
  deletePost,
  getPostById,
  commentOnPost,
  likePost,
} from '../controllers/post.controller.js';
const router = express.Router();

router.get('/', protectedRoute, getFeedPost);

router.post('/', protectedRoute, createPost);

router.delete('/:id', protectedRoute, deletePost);

router.get('/:id', protectedRoute, getPostById);

router.post('/:id/comment', protectedRoute, commentOnPost);
router.post('/:id/like', protectedRoute, likePost);
export default router;
