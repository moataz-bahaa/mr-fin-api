import { verifyToken } from '../libs/jwt-utils.js';
import prisma from '../prisma/client.js';
import { ForbidenError, UnAuthenticatedError } from '../utils/errors.js';

export const isAuth = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    throw new UnAuthenticatedError();
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      throw new UnAuthenticatedError();
    }
    const account = await prisma.account.findUnique({
      where: {
        // @ts-ignore
        id: payload.id,
      },
      include: {
        admin: true,
        client: true,
        employee: true,
      },
    });

    if (!account) {
      throw new UnAuthenticatedError();
    }

    req.account = account;
    req.account.isAdmin = account.admin ? true : false;
    req.account.isEmployee = account.employee ? true : false;
    req.account.isClient = account.client ? true : false;
    req.account.isBranchManager = req.account.employee?.roleId === 1;
    req.account.isTeamLeader = req.account.employee?.roleId === 2;
  } catch (err) {
    throw new UnAuthenticatedError(
      typeof err.message === 'string' ? err.message : undefined
    );
  }

  // just for testing
  return next();
};

export const isAdmin = (req, res, next) => {
  if (!req.account.isAdmin) {
    throw new ForbidenError();
  }
  next();
};
export const isAdminOrBranchManager = (req, res, next) => {
  if (!req.account.isAdmin && !req.account.isBranchManager) {
    throw new ForbidenError();
  }
  next();
};
export const isAdminOrBranchManagerOrClient = (req, res, next) => {
  if (
    !req.account.isAdmin &&
    !req.account.isBranchManager &&
    !req.acccount.isClient
  ) {
    throw new ForbidenError();
  }
  next();
};

export const isEmployee = (req, res, next) => {
  if (!req.account.isEmployee) {
    throw new ForbidenError();
  }
  next();
};

export const isClient = (req, res, next) => {
  if (!req.account.isClient) {
    throw new ForbidenError();
  }
  next();
};

export const isAdminOrEmploee = (req, res, next) => {
  if (
    !req.account.isAdmin &&
    !req.account.isBranchManager &&
    !req.account.isEmployee
  ) {
    throw new ForbidenError();
  }
  next();
};
