import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import { isAdmin, isAuth } from '../../middlewares/auth.middleware.js';
import {
  deleteEmployee,
  getEmployeeById,
  getEmployeeRoles,
  getEmployees,
  patchEmployee,
  postEmployee,
} from './employee.controller.js';

const router = Router();

router.get('/roles', getEmployeeRoles);

router.get('/branch/:branchId', getEmployees);

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
      name: 'workingPapers',
      maxCount: 20,
    },
  ]),
  postEmployee
);

router.patch(
  '/:id',
  isAuth,
  isAdmin,
  upload.fields([
    {
      name: 'profileImage',
      maxCount: 1,
    },
    {
      name: 'workingPapers',
      maxCount: 20,
    },
  ]),
  patchEmployee
);

router.get('/:id', getEmployeeById);

router.delete('/:id', deleteEmployee);

export default router;
