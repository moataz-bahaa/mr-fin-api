import { Router } from 'express';
import { getMessages, postMessage } from './contactUsMessage.controller.js';

const router = Router();

router.get('/', getMessages);

router.post('/', postMessage);

export default router;
