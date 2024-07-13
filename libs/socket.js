import { io } from '../app.js';

export const sendSocketEmail = async (email) => {
  email?.receivers?.forEach((user) => {
    if (user.id === email.senderId) return;
    console.log(`Sending email to ${user.id}`);
    io.to(user.id.toString()).emit('new-email', email);
  });
};
