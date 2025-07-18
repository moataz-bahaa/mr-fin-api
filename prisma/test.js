import { hashPassword } from '../libs/bcrypt.js';
import prisma from './client.js';

(async () => {
  try {
    await prisma.account.updateMany({
      data: {
        hashedPassword: await hashPassword('328221')
      }
    })
  } catch (err) {
    console.log(err);
  }
})();
