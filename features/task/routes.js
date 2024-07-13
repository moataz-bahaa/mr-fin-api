import { Router } from 'express';
import { isAdminOrBranchManager, isAdminOrEmploee, isClient } from '../../middlewares/auth.middleware.js';
import {
  deleteTask,
  getChecklist,
  getClientTasks,
  getTaskById,
  getTasks,
  getTeamsTasks,
  patchTasks,
  postTask,
} from './controller.js';

const router = Router();

router.get('/', isAdminOrEmploee, getTasks);

router.get('/client/me', isClient, getClientTasks);

router.get('/teams/:branchId', isAdminOrEmploee, getTeamsTasks);

router.get('/:id', isAdminOrEmploee, getTaskById);

router.get('/checklist/:branchId', isAdminOrEmploee, getChecklist);

router.patch('/', patchTasks);

router.post('/', postTask);

router.delete('/:id', isAdminOrBranchManager, deleteTask);

export default router;
