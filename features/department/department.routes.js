import { Router } from 'express';
import {
  addEmployeesToDepartment,
  deleteDepartment,
  deleteEmployeesFromDepartment,
  getDepartments,
  patchDepartment,
  postDepartment,
} from './department.controller.js';

const router = Router();

router.get('/', getDepartments);

router.post('/', postDepartment);

router.patch('/:id', patchDepartment);

router.delete('/:id', deleteDepartment);

router.post('/employees', addEmployeesToDepartment);

router.delete('/employees', deleteEmployeesFromDepartment);

export default router;
