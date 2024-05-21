import { Router } from 'express';
import { isAdmin, isAuth } from '../../middlewares/auth.middleware.js';
import { deleteBranch, patchBranch, postBranch } from './branch.controller.js';

const router = Router();

router.post('/', isAuth, isAdmin, postBranch);

router.patch('/:id', isAuth, isAdmin, patchBranch);

router.delete('/:id', isAuth, isAdmin, deleteBranch);

export default router;
