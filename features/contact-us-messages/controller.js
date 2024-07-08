import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import prisma from '../../prisma/client.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
} from '../../utils/helpers.js';

export const getContactUsMessages = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const data = await getPagination('contactUsMessages', page, limit, {}, {
    orderBy: {
      createdAt: 'desc'
    }
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
};
