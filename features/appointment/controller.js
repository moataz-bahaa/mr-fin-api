import { StatusCodes } from 'http-status-codes';
import { accountDataToSelect, STATUS } from '../../libs/constants.js';
import { PostAppointmentSchema } from '../../libs/joi-schemas.js';
import prisma from '../../prisma/client.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  validateJoi,
} from '../../utils/helpers.js';

export const postAppointment = async (req, res, next) => {
  const { createMeeting, ...data } = validateJoi(
    PostAppointmentSchema,
    req.body
  );

  let url = null;
  if (createMeeting) {
    // TODO create zoom meeting
    url = 'https://zoom.com';
  }

  if (!data.employeeId) {
    data.employeeId = req.account.id;
  }

  if (!data.clientId) {
    data.clientId = req.account.id;
  }

  if (url) {
    const meeting = await prisma.meeting.create({
      data: {
        url,
        timestamp: data.date,
        accounts: {
          connect: [
            {
              id: data.employeeId,
            },
            {
              id: data.clientId,
            },
          ],
        },
      },
    });
    data.meetingId = meeting.id;
  }

  const appointment = await prisma.appointment.create({
    data: {
      ...data,
    },
    include: {
      meeting: true,
    },
  });

  res.status(StatusCodes.CREATED).json({
    status: STATUS.SUCCESS,
    appointment,
  });
};

export const getAppointments = async (req, res, next) => {
  const { page, limit } = getPageAndLimitFromQurey(req.query);
  const { startDate, endDate } = req.query;

  const data = await getPagination(
    'appointment',
    page,
    limit,
    {
      OR: [
        {
          clientId: req.account.id,
        },
        {
          employeeId: req.account.id,
        },
      ],
      AND: [
        {
          date: startDate ? { gte: new Date(startDate) } : undefined,
        },
        {
          date: endDate ? { gte: new Date(endDate) } : undefined,
        },
      ],
    },
    {
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
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            salutation: true,
            personalNumber: true,
            jobTitle: true,
            gender: true,
            phone: true,
            account: {
              select: accountDataToSelect,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }
  );

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};
