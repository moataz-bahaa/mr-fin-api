import { StatusCodes } from 'http-status-codes';
import { STATUS } from '../../libs/constants.js';
import { PostEmailSchema } from '../../libs/joi-schemas.js';
import { sendSocketEmail } from '../../libs/socket.js';
import prisma from '../../prisma/client.js';
import { BadRequestError } from '../../utils/errors.js';
import {
  getPageAndLimitFromQurey,
  getPagination,
  getUrl,
  validateJoi,
} from '../../utils/helpers.js';
import { toNumber } from '../../utils/index.js';

export const postEmail = async (req, res, next) => {
  const { subject, content, receivers, serviceId, parentEmailId } = validateJoi(
    PostEmailSchema,
    req.body
  );

  const data = {
    senderId: req.account.id,
    subject,
    content,
    parentEmailId,
    serviceId,
  };

  if (req.files) {
    data.attachments = {
      create: req.files.map((file) => ({
        url: getUrl(req, file.path),
        userId: req.account.id,
        serviceId,
      })),
    };
  }
  data.receivers = {
    connect: receivers.map((id) => ({ id })),
  };

  const email = await prisma.email.create({
    data,
    include: {
      service: true,
      attachments: true,
      parentEmail: true,
      receivers: true,
      sender: true,
      childEmails: true,
    },
  });

  res.status(StatusCodes.OK).json({
    message: 'Email sent successfully',
    email,
  });

  // send email remeinder

  sendSocketEmail(email);
  // TODO enable or not ?
  // email.receivers.forEach((user) => {
  //   sendEmail({
  //     from: '',
  //     to: req.user.email,
  //     subject: 'Mr-fin-consulting',
  //     text: `check your email at ${process.env.NEXT_APP_BASE_URL}`,
  //   });
  // });
};

export const getEmails = async (req, res, next) => {
  const { type, branchId, search, showAll = 'true' } = req.query;

  const { page, limit: count } = getPageAndLimitFromQurey(req.query);

  const filter = {};

  if (
    (req.account.isAdmin || req.account.isBranchManager) &&
    showAll === 'true'
  ) {
    if (!branchId) {
      throw new BadRequestError(
        `for admins and branch managers branchId must be sent`
      );
    }
    filter.AND = [
      {
        OR: [
          {
            receivers: {
              some: {
                OR: [
                  {
                    client: {
                      branchId: toNumber(branchId),
                    },
                  },
                  {
                    employee: {
                      branchId: toNumber(branchId),
                    },
                  },
                ],
              },
            },
          },
          {
            sender: {
              OR: [
                {
                  client: {
                    branchId: toNumber(branchId),
                  },
                },
                {
                  employee: {
                    branchId: toNumber(branchId),
                  },
                },
              ],
            },
          },
        ],
      },
    ];
  }

  if (
    ((req.account.isAdmin || req.account.isBranchManager) &&
      showAll === 'false') ||
    (!req.account.isAdmin && !req.account.isBranchManager)
  ) {
    if (type === 'sent') {
      filter.AND = [
        {
          senderId: req.account.id,
        },
      ];
    } else if (type === 'received') {
      filter.AND = [
        {
          receivers: {
            some: {
              id: req.account.id,
            },
          },
        },
      ];
    } else {
      filter.AND = [
        {
          OR: [
            {
              receivers: {
                some: {
                  id: req.account.id,
                },
              },
            },
            {
              senderId: req.account.id,
            },
          ],
        },
      ];
    }
  }

  if (search) {
    filter.AND.push({
      OR: [
        {
          // @ts-ignore
          subject: {
            contains: search,
          },
        },
        {
          // @ts-ignore
          content: {
            contains: search,
          },
        },
      ],
    });
  }

  const data = await getPagination('email', page, count, filter, {
    select: {
      id: true,
      sender: true,
      subject: true,
      createdAt: true,
      service: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    ...data,
  });
};

export const getEmailById = async (req, res, next) => {
  const id = toNumber(req.params.id);

  const email = await prisma.email.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      attachments: true,
      childEmails: true,
      parentEmail: true,
      receivers: true,
      sender: true,
      service: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    email,
  });
};
