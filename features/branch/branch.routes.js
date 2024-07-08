import { Router } from 'express';
import {
  isAdminOrBranchManager,
  isAuth,
} from '../../middlewares/auth.middleware.js';
import { deleteBranch, patchBranch, postBranch } from './branch.controller.js';

const router = Router();

router.post('/', isAuth, isAdminOrBranchManager, postBranch);

router.patch('/:id', isAuth, isAdminOrBranchManager, patchBranch);

router.delete('/:id', isAuth, isAdminOrBranchManager, deleteBranch);

export default router;
