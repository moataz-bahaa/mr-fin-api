import { Router } from 'express';
import { getInvoices, postInvoice } from './invoice.controller.js';

const router = Router();

router.get('/:clientId', getInvoices);

router.post('/', postInvoice);

export default router;
