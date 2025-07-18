import { Router } from 'express';
import { isAdminOrBranchManager } from '../../middlewares/auth.middleware.js';
import {
  deleteTeam,
  getTeamById,
  getTeams,
  patchTeam,
  postAddEmployeesToTeam,
  postRemoveEmployeesFromTeam,
  postTeam,
} from './team.controller.js';

const router = Router();

router.get('/branch/:branchId', getTeams);

router.get('/:id', getTeamById);

router.post('/', postTeam);

router.patch('/:id', patchTeam);

router.delete('/:id', isAdminOrBranchManager, deleteTeam);

router.post('/remove-employees', postRemoveEmployeesFromTeam);

router.post('/add-employees', postAddEmployeesToTeam);

export default router;
