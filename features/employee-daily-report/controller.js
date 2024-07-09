import { StatusCodes } from 'http-status-codes';
import { STATUS, accountDataToSelect } from '../../libs/constants.js';
import { DailyReportSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  toNumber,
  validateJoi,
} from '../../utils/helpers.js';
import { MESSAGES } from '../../utils/messages.js';
import { ForbidenError } from '../../utils/errors.js';

export const getDailyReports = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);
  const { clientId, employeeId } = req.query;

  const filter = {};

  if (clientId) {
    filter.clientId = toNumber(clientId);
  }
  if (employeeId) {
    filter.employeeId = toNumber(employeeId);
  }

  const data = await getPagination('employeeDailyReport', page, limit, filter, {
    include: {
      client: {
        include: {
          account: {
            select: accountDataToSelect,
          }
        }
      },
      employee: {
        include: {
          account: {
            select: accountDataToSelect,
          }
        }
      },
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const postDailyReport = async (req, res, next) => {
  const data = validateJoi(DailyReportSchema, req.body);

  if (!req.account.employee) {
    throw new ForbidenError('Only employees can write Daily reports');
  }

  data.employeeId = req.account.employee.id;

  const dailyReport = await prisma.employeeDailyReport.create({
    data,
    include: {
      employee: {
        include: {
          account: {
            select: accountDataToSelect,
          }
        }
      },
      client: true,
      task: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.CREATED,
    dailyReport,
  });
};
