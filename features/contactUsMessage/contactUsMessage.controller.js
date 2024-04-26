import { StatusCodes } from 'http-status-codes';
import { sendNotification } from '../../libs/socket.js';
import prisma from '../../prisma/client.js';
import { calcNumberOfPages, toNumber } from '../../utils/index.js';

export const getMessages = async (req, res, next) => {
  const page = toNumber(req.query.page ?? 1);
  const count = toNumber(req.query.count ?? 20);

  const totalCount = await prisma.contactUsMessages.count();

  const messages = await prisma.contactUsMessages.findMany({
    take: count,
    skip: (page - 1) * count,
  });

  res.status(StatusCodes.OK).json({
    messages,
    totalCount,
    numberOfPages: calcNumberOfPages(totalCount, count),
  });

  // mark the spsecified messages as readed
  await prisma.contactUsMessages.updateMany({
    where: {
      id: {
        in: messages.map((msg) => msg.id),
      },
    },
    data: {
      isReaded: true,
    },
  });
};

export const postMessage = async (req, res, next) => {
  const service = await prisma.contactUsMessages.create({
    data: req.bod,
  });

  res.status(StatusCodes.CREATED).json({
    message: 'message sended',
    service,
  });

  sendNotification('admin', 'new message recieve, check contact us');
};
