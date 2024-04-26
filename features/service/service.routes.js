import { Router } from 'express';
import {
  deleteService,
  getServices,
  patchService,
  postService,
} from './service.controller.js';

const router = Router();

router.get('/', getServices);

router.post('/', postService);

router.patch('/:id', patchService);

router.delete('/:id', deleteService);

export default router;
