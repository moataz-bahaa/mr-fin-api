import { Router } from 'express';
import {
  addUsersToChat,
  deleteChat,
  deleteMessage,
  deleteUsersFromChat,
  getChatById,
  getChatMessages,
  getChats,
  patchChat,
  postChat,
  postMessage,
} from './chat.controller.js';

const router = Router();

router.get('/', getChats);

router.get('/:id', getChatById);

router.get('/:id/messages', getChatMessages);

router.post('/', postChat);

router.patch('/:id', patchChat);

router.delete('/:id', deleteChat);

router.post('/users', addUsersToChat);

router.delete('/users', deleteUsersFromChat);

router.post('/messages', postMessage);

router.delete('/messages/:id', deleteMessage);

export default router;
