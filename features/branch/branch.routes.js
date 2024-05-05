import { Router } from 'express';
import { isAdmin, isAuth } from '../../middlewares/auth.middleware.js';
import { postBranch } from './branch.controller.js';

const router = Router();

router.post('/', isAuth, isAdmin, postBranch);

export default router;
