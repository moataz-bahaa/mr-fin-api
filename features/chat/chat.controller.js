import { StatusCodes } from 'http-status-codes';
import { sendMessage } from '../../libs/socket.js';
import prisma from '../../prisma/client.js';
import { ForbidenError } from '../../utils/errors.js';
import { toNumber } from '../../utils/index.js';
import { getChatByIdOrThrow } from './chat.service.js';

export const getChats = async (req, res, next) => {
  // get user chats
  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          id: req.user.id,
        },
      },
    },
    include: {
      lastMessage: true,
    },
    orderBy: {
      lastMessage: {
        createdAt: 'desc',
      },
    },
  });

  res.status(StatusCodes.OK).json({
    chats,
  });
};

export const getChatById = async (req, res, next) => {
  const chatId = toNumber(req.params.id);

  const chat = await prisma.chat.findUniqueOrThrow({
    where: {
      id: chatId,
    },
    include: {
      users: true,
      lastMessage: true,
    },
  });

  res.status(StatusCodes.OK).json({
    chat,
  });
};

export const getChatMessages = async (req, res, next) => {
  const chatId = toNumber(req.params.id);

  const page = toNumber(req.query.page ?? 1);
  const count = toNumber(req.query.count ?? 50);

  const totalCount = await prisma.message.count({
    where: {
      chatId,
    },
  });

  const messages = await prisma.message.findMany({
    where: {
      chatId,
    },
    include: {
      seenBy: true,
      sender: true,
      parentMessage: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: count,
    skip: (page - 1) * count,
  });

  messages.reverse();

  res.status(StatusCodes.OK).json({
    messages,
    hashNext: totalCount >= page * count,
  });
};

export const postChat = async (req, res, next) => {
  const data = req.body;

  const chat = await prisma.chat.create({
    data,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'chated created',
    chat,
  });
};

export const patchChat = async (req, res, next) => {
  const chatId = toNumber(req.params.id);

  await getChatByIdOrThrow(chatId);

  const data = req.body;

  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data,
  });

  res.status(StatusCodes.OK).json({
    message: 'chat updated',
    chat: updatedChat,
  });
};

export const deleteChat = async (req, res, next) => {
  const chatId = toNumber(req.params.id);

  await getChatByIdOrThrow(chatId);

  await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'chat deleted',
  });
};

export const addUsersToChat = async (req, res, next) => {
  const users = req.body.users, // list of ids [1, 2, 3]
    chatId = req.body.chatId;

  await getChatByIdOrThrow(chatId);

  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      users: {
        connect: users.map((id) => ({ id })),
      },
    },
    include: {
      users: true,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'users added successfully',
    chatId: updatedChat,
  });
};

export const deleteUsersFromChat = async (req, res, next) => {
  const users = req.body.users, // list of ids [1, 2, 3]
    chatId = req.body.chatId;

  await getChatByIdOrThrow(chatId);

  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      users: {
        disconnect: users.map((id) => ({ id })),
      },
    },
    include: {
      users: true,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'users deleted successfully',
    chatId: updatedChat,
  });
};

export const postMessage = async (req, res, next) => {
  const data = req.body;

  if (req.files) {
    data.attchments = req.files.map((f) => f.path);
  }

  const messasge = await prisma.message.create({
    data,
    include: {
      chat: {
        include: {
          users: true,
        },
      },
      parentMessage: true,
      sender: true,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'message sended',
    messasge,
  });

  // send messge to all online sockets
  sendMessage(messasge);
};

export const deleteMessage = async (req, res, next) => {
  const messageId = req.params.id;

  const message = await prisma.message.findUniqueOrThrow({
    where: {
      id: messageId,
    },
  });

  if (message.senderId !== req.user.id) {
    throw new ForbidenError(`you can't delete this message`);
  }

  await prisma.message.delete({
    where: {
      id: message.id,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'message deleted successfully',
  });
};
