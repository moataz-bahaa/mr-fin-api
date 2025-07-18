import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import {
  isAdmin,
  isAdminOrBranchManager,
  isAuth,
} from '../../middlewares/auth.middleware.js';
import {
  deleteEmployee,
  getEmployeeById,
  getEmployeeRoles,
  getEmployees,
  getEmployeesProductavity,
  patchEmployee,
  postEmployee,
} from './employee.controller.js';

const router = Router();

router.get('/roles', getEmployeeRoles);

router.get('/branch/:branchId', getEmployees);

router.get('/productivity/:branchId', getEmployeesProductavity);

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
      name: 'workingPapers',
      maxCount: 20,
    },
  ]),
  postEmployee
);

router.patch(
  '/:id',
  isAuth,
  isAdminOrBranchManager,
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

router.delete('/:id', isAdmin, deleteEmployee);

export default router;
