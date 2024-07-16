import prisma from '../prisma/client.js';
import { BadRequestError } from './errors.js';

/**
 * @param {number} totalCount
 * @param {number} count
 * @returns {number}
 */
export const calcNumberOfPages = (totalCount, count) =>
  Math.ceil(totalCount / count);

/**
 *
 * @param {string} str
 * @returns {object}
 */
export const parseJson = (str) => {
  if (typeof str === 'object') return str;
  return JSON.parse(str ? str : '{}');
};

/**
 * @param {any} value
 * @returns {number}
 */
export const toNumber = (value) => {
  const number = Number(value);
  if (isNaN(number)) {
    throw new BadRequestError('plz provide correct number');
  }

  return number;
};

export const getPageAndLimitFromQurey = (query) => {
  let page = query.page ?? 1;
  page = toNumber(page);

  let limit = query.limit ?? 20;
  limit = toNumber(limit);

  return {
    page,
    limit,
  };
};

/**
 * @param {object} req
 * @returns {string}
 */
const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

/**
 * @param {object} req
 * @param {string} path
 * @returns {string}
 */
export const getUrl = (req, path) => `${getBaseUrl(req)}/${path}`;

export const validateJoi = (JoiSchema, data) => {
  const { error, value } = JoiSchema.validate(data);
  if (error) {
    throw new BadRequestError(error);
  }
  return value;
};

/**
 * @param {number} totalCount
 * @param {number} count
 * @returns {object}
 */
export const paginationInfo = (totalCount, count, page) => {
  const numberOfPages = Math.ceil(totalCount / count);
  return {
    totalCount,
    numberOfPages,
    currentPage: page,
    currentLimit: count,
    hasNext: page < numberOfPages,
    hasPrev: page > 1,
  };
};

/**
 *
 * @param {string} name
 * @param {number} limit
 * @param {number} page
 * @param {object | undefined} filter
 * @param {object | undefined} params
 * @returns
 */
export const getPagination = async (
  name,
  page,
  limit,
  filter = {},
  params = {}
) => {
  // @ts-ignore
  const totalCount = await prisma[name].count({
    where: filter,
  });

  // @ts-ignore
  const data = await prisma[name].findMany({
    where: filter,
    take: limit,
    skip: (page - 1) * limit,
    ...params,
  });

  return {
    paginationInfo: paginationInfo(totalCount, limit, page),
    [`${name}s`]: data,
  };
};

export const getAdminAccountId = async () => {
  const admin = await prisma.admin.findFirst();
  return admin?.id;
};

/**
 * 
 * @param {number} n 
 * @returns 
 */
export function getNextNMonths(n) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  let result = [];
  
  for (let i = 0; i < n; i++) {
      result.push(`${months[currentMonth]} ${currentYear}`);
      currentMonth++;
      if (currentMonth === 12) {
          currentMonth = 0;
          currentYear++;
      }
  }
  
  return result;
}
