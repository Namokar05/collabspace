import express from 'express';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;