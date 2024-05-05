import { Router } from 'express';
import { upload } from '../../libs/upload.js';
import { deleteFile, getFilesInFolder, postFile } from './file.controller.js';

const router = Router();

router.get('/folder/:id', getFilesInFolder);

router.post('/', upload.single('file'), postFile);

router.delete('/:id', deleteFile);

export default router;
