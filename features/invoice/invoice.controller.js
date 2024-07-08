import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import { PostInvoiceSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import { toNumber } from '../../utils/index.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  validateJoi,
} from '../../utils/helpers.js';

// TODO
export const getInvoices = async (req, res, next) => {
  const clientId = toNumber(req.params.clientId);
  const {} = req.query;
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const filter = {};

  const data = await getPagination('invoice', page, limit, filter);

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const postInvoice = async (req, res, next) => {
  const data = validateJoi(PostInvoiceSchema, req.body);

  const invoice = await prisma.invoice.create({
    data,
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
  });
};
