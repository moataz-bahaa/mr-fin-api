import prisma from './client.js';

(async () => {
  try {
    const employess = await prisma.employee.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                teamId: {
                  not: 8,
                },
              },
              {
                teamId: null,
              },
            ],
          },
          {
            OR: [
              {
                leadingTeam: {
                  id: {
                    not: 8
                  }
                }
              },
              {
                leadingTeam: null
              }
            ],
          },
        ],
      },
      select: {
        id: true,
      },
    });

    console.log(employess);
  } catch (err) {
    console.log(err);
  }
})();
