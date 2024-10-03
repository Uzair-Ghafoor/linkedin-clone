import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  removeConnection,
  getUsersConnections,
} from '../controllers/connection.controller.js';
const router = express.Router();

router.post('/request/:userId', protectedRoute, sendConnectionRequest);
router.put('/accept/:requestId', protectedRoute, acceptConnectionRequest);
router.put('/decline/:userId', protectedRoute, declineConnectionRequest);
//get all requests for current user
router.get('/', protectedRoute, getConnectionRequests);
//get all connectinons for current user
router.get('/', protectedRoute, getUsersConnections);
router.delete('/:id', protectedRoute, removeConnection);

router.get('/status/:id', protectedRoute, getConnectionStatus);

export default router;
