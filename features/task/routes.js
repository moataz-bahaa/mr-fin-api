import { Router } from 'express';
import { isAdminOrEmploee } from '../../middlewares/auth.middleware.js';
import { getChecklist } from './controller.js';

const router = Router();

router.get('/checklist/:branchId', isAdminOrEmploee, getChecklist);

export default router;
