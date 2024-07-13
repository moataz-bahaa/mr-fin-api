import { StatusCodes } from 'http-status-codes';
import { accountDataToSelect, STATUS } from '../../libs/constants.js';
import { PostInvoiceSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  validateJoi,
} from '../../utils/helpers.js';
import { toNumber } from '../../utils/index.js';

export const getInvoices = async (req, res, next) => {
  const clientId = toNumber(req.params.clientId);
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const filter = { clientId };

  const data = await getPagination('invoice', page, limit, filter, {
    include: {
      items: {
        include: {
          service: true,
        },
      },
      client: {
        include: {
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

export const postInvoice = async (req, res, next) => {
  const data = validateJoi(PostInvoiceSchema, req.body);

  data.items = {
    create: data.items,
  };

  const invoice = await prisma.invoice.create({
    data,
    include: {
      items: {
        include: {
          service: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    invoice,
  });
};
