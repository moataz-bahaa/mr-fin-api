import { Router } from 'express';
import { deleteUseFile, getClientFiles } from './controller.js';

const router = Router();

router.get('/:clientId', getClientFiles);

router.delete('/:id', deleteUseFile);

export default router;
