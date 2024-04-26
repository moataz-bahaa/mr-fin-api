import { Router } from 'express';
import {
  deleteInvoice,
  getInvoices,
  patchInvoice,
  postInvoice,
} from './invoice.controller.js';

const router = Router();

router.get('/', getInvoices);

router.post('/', postInvoice);

router.patch('/:id', patchInvoice);

router.delete('/:id', deleteInvoice);

export default router;
