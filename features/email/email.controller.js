import prisma from '../../prisma/client.js';
import {
  BadRequestError,
  ForbidenError,
  NotFoundError,
  UnAuthenticatedError,
} from '../../utils/errors.js';
import { sendNotification } from '../../libs/socket.js';
import { StatusCodes } from 'http-status-codes';
import { sendEmail } from '../../utils/email.js';
import { calcNumberOfPages, toNumber } from '../../utils/index.js';

export const postEmail = async (req, res, next) => {
  const { subject, content, receivers, categoryId, parentEmailId } = req.body;

  if (!subject || !receivers || !categoryId) {
    throw new BadRequestError('please provide all data');
  }

  const data = {
    senderId: req.user.id,
    subject,
    content,
    parentEmailId,
    categoryId,
  };

  if (req.files) {
    data.files = {
      create: req.files.map((file) => ({
        url: file.path,
        userId: req.user.id,
        categoryId,
      })),
    };
  }

  const email = await prisma.email.create({
    data,
    include: {
      category: true,
      files: true,
      parentEmail: true,
      receivers: true,
      sender: true,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'email sended successfully',
    email,
  });

  // notification
  receivers.map((recieverId) => {
    sendNotification(recieverId, 'new email receive');
  });

  // send email remeinder
  sendEmail({
    from: '',
    to: req.user.email,
    subject: 'Mr-fin-consulting',
    text: `check your email at https://example.com`,
  });
};

export const getEmails = async (req, res, next) => {
  const { sended, received } = req.query;

  const page = toNumber(req.query?.page ?? 1),
    count = toNumber(req.query?.count ?? 10);

  const filter = {};

  if (sended === 'true') {
    filter.senderId = req.user.id;
  } else if (received === 'true') {
    filter.receivers = {
      some: {
        id: req.user.id,
      },
    };
  } else {
    filter.OR = [
      {
        receivers: {
          some: {
            id: req.user.id,
          },
        },
      },
      {
        senderId: req.user.id,
      },
    ];
  }

  const totalCount = await prisma.email.count({
    where: filter,
  });

  const emails = await prisma.email.findMany({
    where: filter,
    orderBy: {
      createdAt: 'desc',
    },
    take: count,
    skip: (page - 1) * count,
  });

  res.status(StatusCodes.OK).json({
    emails,
    totalCount,
    numberOfPages: calcNumberOfPages(totalCount, count),
  });
};
