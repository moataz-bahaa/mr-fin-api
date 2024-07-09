import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import {
  isAdminOrBranchManager,
  isAuth,
} from '../../middlewares/auth.middleware.js';
import {
  deleteClient,
  getClientById,
  getClients,
  patchClient,
  patchClientTasks,
  postClient,
  putClientServices,
} from './client.controller.js';

const router = Router();

router.get('/branch/:branchId', getClients);

router.get('/:id', getClientById);

router.post(
  '/',
  isAuth,
  isAdminOrBranchManager,
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

router.patch('/services', patchClientTasks);

router.patch(
  '/:id',
  isAdminOrBranchManager,
  isAdminOrBranchManager,
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

router.delete('/:id', isAuth, isAdminOrBranchManager, deleteClient);

export default router;
