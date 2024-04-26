import { Server } from 'socket.io';
import { setUserIsOnline } from '../features/user/user.service.js';
import prisma from '../prisma/client.js';

let io;

export const initSocket = (app) => {
  io = new Server(app, {
    cors: {
      origin: '*',
    },
  });

  // room -> chatId
  io.on('connection', (socket) => {
    socket.on('setup', (userId) => {
      socket.join(userId);
      socket.emit('connected');
      setUserIsOnline(userId, true);
    });

    socket.on('typing', (chat) => socket.in(chat).emit('typing'));
    socket.on('stop-typing', (chat) => socket.in(chat).emit('stop-typing'));

    socket.on('disconnect', () => {
      // Remove the user from any rooms they are in
      Object.keys(socket.rooms).forEach((room) => {
        socket.leave(room);

        // TODO: set user isOnline = false
      });
    });
  });
};

export const sendMessage = async (msg) => {
  msg?.chat?.users?.forEach((user) => {
    if (user.id === msg.senderId) return;
    io?.to(user.id).emit('msg', msg);
  });
};

export const sendNotification = async (userId, title, content) => {
  if (userId === 'admin') {
    // TODO: send notification for all admins
    return;
  }

  const notification = await prisma.notification.create({
    data: {
      title,
      content,
      userId,
    },
  });

  io?.to(userId).emit('notification', notification);
};
