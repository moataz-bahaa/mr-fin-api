import prisma from '../../prisma/client.js';

export const getChatByIdOrThrow = (id) =>
  prisma.chat.findUniqueOrThrow({ where: { id } });
