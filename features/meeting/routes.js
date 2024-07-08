import { Router } from 'express';
import { getMeetings } from './controller.js';

const router = Router();

router.get('/', getMeetings);

export default router;
