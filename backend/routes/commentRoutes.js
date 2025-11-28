import express from 'express';
import { getComments, createComment } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getComments);
router.post('/', createComment);

export default router;