import { Router } from 'express';
import { getContactUsMessages } from './controller.js';

const router = Router();

router.get('/', getContactUsMessages);

export default router