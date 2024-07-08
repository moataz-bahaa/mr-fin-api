import { StatusCodes } from 'http-status-codes';
import { accountDataToSelect, STATUS } from '../../libs/constants.js';
import { PutReviewSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  toNumber,
  validateJoi,
} from '../../utils/helpers.js';

export const putReview = async (req, res, next) => {
  const data = validateJoi(PutReviewSchema, req.body);

  const clientId = req.account.client?.id;

  const review = await prisma.review.upsert({
    where: {
      clientId,
    },
    create: {
      ...data,
      clientId,
    },
    update: data,
  });

  res.status(StatusCodes.CREATED).json({
    status: STATUS.SUCCESS,
    review,
  });
};

export const getReviewByClientId = async (req, res, next) => {
  const clientId = toNumber(req.params.clientId);

  const review = await prisma.review.findUniqueOrThrow({
    where: {
      clientId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          companyName: true,
          employer: true,
          gender: true,
          phoneLandline: true,
          phoneMobile: true,
          account: {
            select: accountDataToSelect,
          },
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    review,
  });
};

export const getReviews = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const { rate, search } = req.query;

  const filter = {};

  if (rate) {
    filter.rate = toNumber(rate);
  }

  if (search) {
    filter.client = {
      name: {
        contains: search
      }
    }
  }
  const data = await getPagination('review', page, limit, filter, {
    include: {
      client: {
        select: {
          id: true,
          name: true,
          companyName: true,
          employer: true,
          gender: true,
          phoneLandline: true,
          phoneMobile: true,
          account: {
            select: accountDataToSelect,
          },
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};
