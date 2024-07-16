import { DateTime } from 'luxon';
import prisma from '../prisma/client.js';
import { getNextNMonths } from '../utils/helpers.js';

const handleAddTasks = async () => {
  const clients = await prisma.client.findMany({
    include: {
      services: true,
    },
  });

  const now = DateTime.now().setZone('utc');
  console.log(`Running script at ${now}`)
  const currentMonth = now.toFormat('LLL yyyy');

  console.log({ currentMonth });

  for (const client of clients) {
    const services = client.services;

    for (const service of services) {
      const lastTask = await prisma.task.findFirst({
        where: {
          serviceId: service.id,
          clientId: client.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      let shouldCreateTask = true;

      // @ts-ignore
      if (lastTask?.months?.includes?.(currentMonth)) {
        shouldCreateTask = false;
      }

      if (shouldCreateTask) {
        await prisma.task.create({
          data: {
            clientId: client.id,
            serviceId: service.id,
            months: getNextNMonths(service.repeatedEvery ?? 0),
          },
        });
      }
    }
  }

  console.log(`End at ${DateTime.now().setZone('utc')}`)
};

(async () => {
  try {
    await handleAddTasks();
  } catch (error) {
    console.log(error);
  }
})();
