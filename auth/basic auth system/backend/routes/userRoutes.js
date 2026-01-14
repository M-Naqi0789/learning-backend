import express from 'express';
import { signupUser, loginUser, logoutUser, refreshAccessToken, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);

router.get('/profile', protect, getProfile );

export default router;