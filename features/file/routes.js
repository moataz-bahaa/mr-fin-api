import { Router } from 'express';
import { getClientFiles } from './controller.js';

const router = Router();

router.get('/:clientId', getClientFiles);

export default router;
