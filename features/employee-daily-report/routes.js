import { Router } from 'express';
import { getDailyReports, postDailyReport } from './controller.js';

const router = Router();

router.get('/', getDailyReports);

router.post('/', postDailyReport);

export default router;
