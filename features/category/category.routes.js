import { Router } from 'express';
import {
  deleteCategory,
  getCategories,
  patchCategory,
  postCategory,
} from './category.controller.js';

const router = Router();

router.get('/', getCategories);

router.post('/', postCategory);

router.patch('/:id', patchCategory);

router.delete('/:id', deleteCategory);

export default router;
