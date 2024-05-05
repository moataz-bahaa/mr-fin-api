import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import {
  deleteEmployee,
  getEmployees,
  patchEmployee,
  postEmployee,
} from './employee.controller.js';

const router = Router();

router.get('/', getEmployees);

router.post('/', upload.array('workingPapersUrls'), postEmployee);

router.patch('/:id', upload.single('file'), patchEmployee);

router.delete('/:id', deleteEmployee);

export default router;
