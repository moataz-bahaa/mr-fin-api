import { StatusCodes } from 'http-status-codes';
import { getPageAndLimitFromQurey, getPagination } from '../../utils/helpers.js';
import { STATUS } from '../../libs/constants.js';

export const getContactUsMessages = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);

  const data = await getPagination('contactUsMessages', page, limit, {}, { });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};