import { Router } from 'express';
import {
  deleteClient,
  getClientById,
  getClients,
  patchClient,
  postClient,
} from './client.controller.js';

const router = Router();

router.get('/', getClients);

router.get('/:id', getClientById);

router.post('/', postClient);

router.patch('/:id', patchClient);

router.delete('/:id', deleteClient);

export default router;
