import { faker } from '@faker-js/faker';
import { hashPassword } from '../libs/bcrypt.js';
import prisma from './client.js';

(async () => {
  const employees = [];
  const branches = [];
  const teams = [];

  console.log(faker.helpers.arrayElement);

  // genere 10 employees
  for (let i = 0; i < 10; i++) {
    const employee = await prisma.employee.create({
      data: {
        user: {
          create: {
            email: faker.internet.email(),
            hashedPassword: await hashPassword(faker.internet.password()),
            name: faker.person.fullName(),
          },
        },
      },
    });

    // branches
    for (let i = 0; i < 10; i++) {
      const branch = await prisma.branch.create({
        data: {
          name: `branch - ${i + 1}`,
          supervisorId: faker.helpers.arrayElement(employees).id,
        },
      });

      branches.push(branch);
    }

    // teams
    for (let i = 0; i < 10; i++) {
      const branch = await prisma.team.create({
        data: {
          name: `team - ${i + 1}`,
          teamLeaderId: faker.helpers.arrayElement(employees).id,
          branchId: faker.helpers.arrayElement(branches).id,
        },
      });

      branches.push(branch);
    }

    // const admin = await prisma.admin.create({
    //   data: {
    //     user: {
    //       create: {
    //         name: 'admin',
    //         email: 'admin@gamil.com',
    //         hashedPassword: await hashPassword('328221'),
    //       },
    //     },
    //   },
    // });

    // console.log(admin);

    employees.push(employee);
  }

  console.log('dummy data inserted successfully');
})();
