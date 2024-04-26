import prisma from '../../prisma/client.js';
import {
  BadRequestError,
  ForbidenError,
  NotFoundError,
  UnAuthenticatedError,
} from '../../utils/errors.js';

export const getClients = async (req, res, next) => {
  // leave this to the end of the project
};

export const getClientById = async (req, res, next) => {
  // get single client withh all data (emails, tasks, ...)
};

export const postClient = async (req, res, next) => {
  // add new client
};

export const patchClient = async (req, res, next) => {};

export const deleteClient = async (req, res, next) => {
  
};
