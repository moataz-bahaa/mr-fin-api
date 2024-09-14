import { StatusCodes } from 'http-status-codes';
import {
  accountDataToSelect,
  clientFieldsToSelectWithoutAccount,
  employeeFieldsToSelectWithoutAccount,
  STATUS,
} from '../../libs/constants.js';
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
import { MESSAGES } from '../../utils/messages.js';
import { sendEmail } from '../../utils/email.js';

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
  // email.receivers.forEach((user) => {
  //   sendEmail({
  //     from: '',
  //     to: req.user.email,
  //     subject: 'Mr-fin-consulting',
  //     text: `check your email at ${process.env.NEXT_APP_BASE_URL}`,
  //   });
  // });

  sendSocketEmail(email);
};

export const getEmails = async (req, res, next) => {
  const {
    type,
    branchId,
    search,
    serviceId,
    showAll = 'false',
    isReaded,
    fetchFor, // client or employee
  } = req.query;

  const { page, limit: count } = getPageAndLimitFromQurey(req.query);

  const filter = {};

  if (serviceId) {
    filter.serviceId = toNumber(serviceId);
  }

  if (isReaded) {
    filter.isReaded = isReaded === 'true';
  }

  if (
    (req.account.isAdmin || req.account.isBranchManager) &&
    showAll === 'true'
  ) {
    if (!branchId) {
      throw new BadRequestError(
        MESSAGES.BRANCH_ID_MUST_BE_SENT
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

      if (fetchFor === 'client') {
        // @ts-ignore
        filter.AND.push({
          receivers: {
            some: {
              client: {
                isNot: null,
              },
            },
          },
        });
      } else if (fetchFor === 'employee') {
        // @ts-ignore
        filter.AND.push({
          receivers: {
            some: {
              employee: {
                isNot: null,
              },
            },
          },
        });
      }
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

      if (fetchFor === 'client') {
        // @ts-ignore
        filter.AND.push({
          sender: {
            client: {
              isNot: null,
            },
          },
        });
      } else if (fetchFor === 'employee') {
        // @ts-ignore
        filter.AND.push({
          sender: {
            employee: {
              isNot: null,
            },
          },
        });
      }
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
        {
          receivers: {
            some: {
              // @ts-ignore
              email: {
                contains: search,
              },
            },
          },
        },
        {
          // @ts-ignore
          sender: {
            email: {
              contains: search,
            },
          },
        },
      ],
    });
  }

  const data = await getPagination('email', page, count, filter, {
    select: {
      id: true,
      sender: {
        select: {
          ...accountDataToSelect,
          admin: true,
          employee: {
            select: employeeFieldsToSelectWithoutAccount,
          },
          client: {
            select: clientFieldsToSelectWithoutAccount,
          },
        },
      },
      subject: true,
      createdAt: true,
      service: true,
      receivers: {
        select: {
          ...accountDataToSelect,
          admin: true,
          employee: {
            select: employeeFieldsToSelectWithoutAccount,
          },
          client: {
            select: clientFieldsToSelectWithoutAccount,
          },
        },
      },
    },
  });

  data.emails = data.emails.map((email) => {
    return {
      ...email,
      sender: {
        ...email.sender,
        admin: undefined,
        client: undefined,
        employee: undefined,
        name:
          email.sender?.admin?.name ??
          email.sender?.client?.name ??
          `${email.sender?.employee?.firstName} ${email.sender?.employee?.lastName}`,
      },
      receivers: email.receivers.map((a) => {
        return {
          ...a,
          admin: undefined,
          client: undefined,
          employee: undefined,
          name:
            a?.admin?.name ??
            a?.client?.name ??
            `${a?.employee?.firstName} ${a?.employee?.lastName}`,
        };
      }),
    };
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

export const patchMarkEmailAsReaded = async (req, res, next) => {
  const id = toNumber(req.params.id);

  await prisma.email.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.email.update({
    where: {
      id,
    },
    data: {
      isReaded: true,
    },
  });

  res.status(StatusCodes.OK).json({
    status: STATUS.SUCCESS,
    message: MESSAGES.UPDATED,
  });
};
