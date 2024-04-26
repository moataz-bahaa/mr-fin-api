import Joi from 'joi';
import { gendersEnum, rolesEnum } from '../../libs/constants.js';

export const employeeSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  personalNumber: Joi.string().allow(null),
  title: Joi.string().allow(null),
  firstName: Joi.string().allow(null),
  lastName: Joi.string().allow(null),
  streetOrHouseNumber: Joi.string().allow(null),
  zipOrCity: Joi.string().allow(null),
  country: Joi.string().allow(null),
  phone: Joi.string().allow(null),
  gender: Joi.string()
    .valid(...gendersEnum)
    .allow(null),
  role: Joi.string()
    .valid(...rolesEnum)
    .allow(null),
  birthDate: Joi.date().iso().allow(null),
  nationality: Joi.string().allow(null),
  maritalStatus: Joi.string().required(),
  entryDate: Joi.date().iso().allow(null),
  groupOfPeople: Joi.string().allow(null),
  jobTitle: Joi.string().allow(null),
  activationCode: Joi.string().max(5).allow(null),
  graduation: Joi.string().allow(null),
  vocationalTraining: Joi.string().allow(null),
  AUG: Joi.string().allow(null),
  contractForm: Joi.string().allow(null),
  employmentStatus: Joi.string().allow(null),
  multipleEmployment: Joi.string().allow(null),
  weeklyWorkHours: Joi.number().integer().allow(null),
  dailyWorkHours: Joi.number().integer().allow(null),
  typeOfEmployment: Joi.string().allow(null),
  identificationNumber: Joi.string().allow(null),
  healthOrLongTermInsurance: Joi.string().allow(null),
  healthInsurance: Joi.string().allow(null),
  parenthoodInPrimary: Joi.string().allow(null),
  pensionInsurance: Joi.string().allow(null),
  unemploymentInsurance: Joi.string().allow(null),
  socialSecurityNumber: Joi.string().allow(null),
  typeOfPayment: Joi.string().allow(null),
  hourWage: Joi.number().precision(2).allow(null),
  IBAN: Joi.string().allow(null),
  BIC: Joi.string().allow(null),
  extraInfo: Joi.string().allow(null),
});
