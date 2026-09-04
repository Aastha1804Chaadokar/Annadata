import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../controllers/auth.controller.js';

const router = Router();

// /api/v1/auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getCurrentUser);

export default router;
