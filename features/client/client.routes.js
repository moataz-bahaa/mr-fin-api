import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import {
  isAdmin,
  isAdminOrBranchManager,
  isAdminOrBranchManagerOrClient,
  isAuth,
} from '../../middlewares/auth.middleware.js';
import {
  deleteClient,
  getClientById,
  getClientOrdersDetails,
  getClients,
  getClientServices,
  patchClient,
  postClient,
  putClientServices,
} from './client.controller.js';

const router = Router();

router.get('/branch/:branchId', getClients);

router.get('/:id', getClientById);
router.get('/:id/services', getClientServices);
router.get('/:id/orders', getClientOrdersDetails);

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

router.patch(
  '/:id',
  isAdminOrBranchManagerOrClient,
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
