import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import { isAdmin, isAuth } from '../../middlewares/auth.middleware.js';
import {
  deleteClient,
  getClientById,
  getClients,
  patchClient,
  patchClientServices,
  postClient,
  putClientServices,
} from './client.controller.js';

const router = Router();

router.get('/branch/:branchId', getClients);

router.get('/:id', getClientById);

router.post(
  '/',
  isAuth,
  isAdmin,
  upload.fields([
    {
      name: 'profileImage',
      maxCount: 1,
    },
    {
      name: 'files',
      maxCount: 20,
    },
  ]),
  postClient
);

router.patch('/services', patchClientServices);

router.patch(
  '/:id',
  isAdmin,
  isAdmin,
  upload.fields([
    {
      name: 'profileImage',
      maxCount: 1,
    },
    {
      name: 'files',
      maxCount: 20,
    },
  ]),
  patchClient
);

router.put('/:id/services', putClientServices);

router.delete('/:id', isAuth, isAdmin, deleteClient);

export default router;
