import { Router } from 'express';
import { getAppointments, postAppointment } from './controller.js';

const router = Router();

router.post('/', postAppointment);

router.get('/', getAppointments);

export default router;
