import prisma from '../../prisma/client.js';

export const getUserById = (userId) =>
  prisma.user.findUniqueOrThrow({ where: { id: userId } });

export const setUserIsOnline = (userId, value) =>
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isOnline: value,
    },
  });
