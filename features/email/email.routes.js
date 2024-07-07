import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import { getEmailById, getEmails, postEmail } from './email.controller.js';

const router = Router();

router.get('/', getEmails);

router.get('/:id', getEmailById);

router.post('/', upload.array('attachments'), postEmail);

export default router;
