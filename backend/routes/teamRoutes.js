import express from 'express';
import { getAllTeams, createTeam, updateTeam } from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);

export default router;