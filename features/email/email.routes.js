import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import { getEmails, postEmail } from './email.controller.js';

const router = Router();

router.get('/', getEmails);

router.post('/', upload.array('files'), postEmail);

export default router;
