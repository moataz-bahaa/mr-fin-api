import { Router } from 'express';
import { isAdminOrEmploee, isClient } from '../../middlewares/auth.middleware.js';
import {
  getChecklist,
  getClientTasks,
  getTaskById,
  getTasks,
  getTeamsTasks,
  patchTasks,
} from './controller.js';

const router = Router();

router.get('/', isAdminOrEmploee, getTasks);

router.get('/client/me', isClient, getClientTasks);

router.get('/teams/:branchId', isAdminOrEmploee, getTeamsTasks);

router.get('/:id', isAdminOrEmploee, getTaskById);

router.get('/checklist/:branchId', isAdminOrEmploee, getChecklist);

router.patch('/', patchTasks);

export default router;
