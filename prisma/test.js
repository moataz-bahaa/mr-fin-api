import prisma from './client.js';

(async () => {
  try {
    const meetings = await prisma.meeting.findMany({
      where: {
        accounts: {
          some: {
            client: {
              isNot: null
            }
          }
        }
      }
    });

    console.log(meetings);
  } catch (err) {
    console.log(err);
  }
})();
