import { hashPassword } from '../libs/bcrypt.js';
import { getAdminAccountId } from '../utils/helpers.js';
import prisma from './client.js';

(async () => {
  try {
    const adminAccountId = await getAdminAccountId();
    if (!adminAccountId) {
      await prisma.admin.create({
        data: {
          name: 'Admin Test',
          account: {
            create: {
              userNameOrEmail: 'admin',
              hashedPassword: await hashPassword('328221'),
            },
          },
        },
      });
    }

    // await prisma.branch.createMany({
    //   data: [
    //     {
    //       name: 'Minya',
    //     },
    //     {
    //       name: 'Cairo',
    //     },
    //     {
    //       name: 'German',
    //     },
    //     {
    //       name: 'Gaza',
    //     },
    //   ],
    // });

  } catch (err) {
    console.log(err);
  }
})();
