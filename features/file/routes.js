import { Router } from 'express';
import { deleteUserFile, getClientFiles } from './controller.js';

const router = Router();

router.get('/:clientId', getClientFiles);

router.delete('/:id', deleteUserFile);

export default router;
