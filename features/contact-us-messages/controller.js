import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import { sendSocketNotification } from '../../libs/socket.js';
import prisma from '../../prisma/client.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
} from '../../utils/helpers.js';
import { MESSAGES } from '../../utils/messages.js';

export const getContactUsMessages = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);
  const { search } = req.query;

  let filter = {};

  if (search) {
    filter = {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
          },
        },
      ],
    };
  }

  const data = await getPagination('contactUsMessages', page, limit, filter, {
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const postContactUsMessage = async (req, res, next) => {
  const message = await prisma.contactUsMessages.create({
    data: req.body,
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message,
  });

  const admin = await prisma.admin.findFirst();

  sendSocketNotification(admin.id, MESSAGES.NEW_CONTACT_US_MESSAGE);
};
