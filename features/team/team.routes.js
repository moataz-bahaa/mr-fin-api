import { Router } from 'express';
import {
  addEmployeesToTeam,
  deleteEmployeesFromTeam,
  deleteTeam,
  getTeams,
  patchTeam,
  postTeam,
} from './team.controller.js';

const router = Router();

router.get('/:branchId', getTeams);

router.post('/', postTeam);

router.patch('/:teamId', patchTeam);

router.delete('/:teamId', deleteTeam);

router.post('/employees', addEmployeesToTeam);

router.delete('/employees', deleteEmployeesFromTeam);

export default router;
