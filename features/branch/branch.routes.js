import { Router } from 'express';
import {
  addEmployeesToBranch,
  deleteBranch,
  deleteEmployeesFromBranch,
  getBranches,
  patchBranch,
  postBranch,
} from './branch.controller.js';

const router = Router();

router.get('/', getBranches);

router.post('/', postBranch);

router.patch('/:id', patchBranch);

router.delete('/:id', deleteBranch);

router.post('/employees', addEmployeesToBranch);

router.delete('/employees', deleteEmployeesFromBranch);

export default router;
