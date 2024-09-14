import { StatusCodes } from 'http-status-codes';
import {
  STATUS,
  clientDataToSelect,
  employeeDataToSelect,
} from '../../libs/constants.js';
import { DailyReportSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import { ForbidenError } from '../../utils/errors.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  toNumber,
  validateJoi,
} from '../../utils/helpers.js';
import { MESSAGES } from '../../utils/messages.js';

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
        select: clientDataToSelect,
      },
      employee: {
        select: employeeDataToSelect,
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
    throw new ForbidenError(MESSAGES.ONLY_EMPLOYEE_CAN_WRITE_REPORTS);
  }

  data.employeeId = req.account.employee.id;

  const dailyReport = await prisma.employeeDailyReport.create({
    data,
    include: {
      employee: {
        select: employeeDataToSelect,
      },
      client: {
        select: clientDataToSelect,
      },
      task: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.CREATED,
    dailyReport,
  });
};
