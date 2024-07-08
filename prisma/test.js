import prisma from './client.js';

(async () => {
  try {
    await prisma.review.deleteMany();
  } catch (err) {
    console.log(err);
  }
})();
