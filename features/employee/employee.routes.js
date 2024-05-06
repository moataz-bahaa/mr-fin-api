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

router.post('/', isAuth, isAdmin, upload.array('workingPapers'), postEmployee);

router.patch(
  '/:id',
  isAuth,
  isAdmin,
  upload.array('workingPapers'),
  patchEmployee
);

router.get('/:id', getEmployeeById);

router.delete('/:id', deleteEmployee);

export default router;
