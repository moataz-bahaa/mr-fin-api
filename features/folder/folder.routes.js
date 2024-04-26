import { Router } from 'express';
import {
  deleteFolder,
  getFolders,
  patchFolder,
  postFolder,
} from './folder.controller.js';

const router = Router();

router.get('/', getFolders);

router.post('/', postFolder);

router.patch('/:id', patchFolder);

router.delete('/:id', deleteFolder);

export default router;
