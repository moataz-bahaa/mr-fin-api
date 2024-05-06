import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import { isAdmin, isAuth } from '../../middlewares/auth.middleware.js';
import {
  deleteClient,
  getClientById,
  getClients,
  patchClient,
  postClient,
} from './client.controller.js';

const router = Router();

router.get('/branch/:branchId', getClients);

router.get('/:id', getClientById);

router.post('/', isAuth, isAdmin, upload.array('files'), postClient);

router.patch('/:id', isAdmin, isAdmin, upload.array('files'), patchClient);

router.delete('/:id', isAuth, isAdmin, deleteClient);

export default router;
