import Joi from 'joi';

export const GenderSchema = Joi.string().valid('male', 'female').lowercase();

export const BranchSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string(),
});

export const ForeignKeySchema = Joi.number().integer().positive();

const OptionalAccountSchema = Joi.object({
  email: Joi.string().optional(),
  password: Joi.string().optional(),
  status: Joi.string().valid('active', 'archive').optional(),
});

export const AdminSchema = Joi.object({
  name: Joi.string().required(),
  profileImageUrl: Joi.string(),
});

export const AccountSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.string().valid('active', 'archive').optional(),
});
export const EmployeeSchema = Joi.object({
  account: AccountSchema.required(),
  personalNumber: Joi.string(),
  salutation: Joi.string(),
  title: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  street: Joi.string(),
  houseNumber: Joi.string(),
  city: Joi.string(),
  postalCode: Joi.string(),
  country: Joi.string(),
  phone: Joi.string(),
  gender: GenderSchema,
  birthDate: Joi.date(),
  nationality: Joi.string(),
  username: Joi.string(),
  maritalStatus: Joi.string(),

  entryDate: Joi.date(),
  groupOfPeople: Joi.string(),
  jobTitle: Joi.string(),
  jobCode: Joi.string(),
  graduation: Joi.string(),
  vocationalTraining: Joi.string(),
  AUG: Joi.string(),
  contractForm: Joi.string(),
  employmentStatus: Joi.string(),
  multipleEmployment: Joi.string(),
  weeklyWorkHours: ForeignKeySchema,
  dailyWorkHours: ForeignKeySchema,

  typeOfEmployment: Joi.string(),
  taxIdentificationNumber: Joi.string(),

  healthOrLongTermInsurance: Joi.string(),
  healthInsurance: Joi.string(),
  parenthoodInPrimary: Joi.string(),
  pensionInsurance: Joi.string(),
  unemploymentInsurance: Joi.string(),
  socialSecurityNumber: Joi.string(),

  typeOfPayment: Joi.string(),
  hourWage: Joi.number().positive(),
  IBAN: Joi.string(),
  BIC: Joi.string(),

  extraInfo: Joi.string(),
  approvalForInclusionInPayroll: Joi.boolean().default(false),
  roleId: ForeignKeySchema.required(),
  branchId: ForeignKeySchema.required(),
  teamId: ForeignKeySchema.optional(),
});

export const TeamSchema = Joi.object({
  name: Joi.string(),
  teamLeaderId: ForeignKeySchema,
  branchId: ForeignKeySchema,
  employees: Joi.array().items(ForeignKeySchema),
});

export const ClientSchema = Joi.object({
  account: AccountSchema.required(),
  salutation: Joi.string().optional(),
  title: Joi.string().optional(),
  username: Joi.string().optional(),
  name: Joi.string().optional(),
  companyName: Joi.string().optional(),
  abbreviation: Joi.string().optional(),
  comment: Joi.string().optional(),

  address1: Joi.string().optional(),
  address2: Joi.string().optional(),
  zipCodeAndCity: Joi.string().optional(),
  countryCode: Joi.string().optional(),
  addressComment: Joi.string().optional(),
  phoneLandline: Joi.string().optional(),
  phoneMobile: Joi.string().optional(),
  fax: Joi.string().optional(),

  gender: Joi.string().optional(),
  maidenName: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  placeOfBirth: Joi.string().optional(),
  placeOfDeath: Joi.string().optional(),
  dateOfDeath: Joi.date().optional(),
  religion: Joi.string().optional(),
  federalState: Joi.string().optional(),
  maritalStatus: Joi.string().optional(),
  since: Joi.date().optional(),
  maritalPropertyRegime: Joi.string().optional(),
  unlimitedTaxLiability: Joi.boolean().optional(),
  taxation: Joi.string().optional(),
  taxIdentificationNumber: Joi.string().optional(),
  profession: Joi.string().optional(),
  employer: Joi.string().optional(),
  socialSecurityNumber: Joi.string().optional(),
  socialSecurityOrganization: Joi.string().optional(),
  IBAN: Joi.string().optional(),
  bankCustomerNumber: Joi.string().optional(),
  bankCode: Joi.string().optional(),
  taxNumber: Joi.string().optional(),
  elsterTaxNumber: Joi.string().optional(),
  deliveryAuthority: Joi.string().optional(),
  validFrom: Joi.date().optional(),
  validUntil: Joi.date().optional(),
  taxNumberComment: Joi.string().optional(),
  officialNumberName: Joi.string().optional(),
  taxOfficeDesignation: Joi.string().optional(),
  taxOfficeComment: Joi.string().optional(),

  branchId: ForeignKeySchema.required(),
  teamId: ForeignKeySchema,
});

export const UpdateClientSchema = ClientSchema.keys({
  account: OptionalAccountSchema.optional().default({}),
  branchId: ForeignKeySchema,
  name: Joi.string(),
  postleitzahlOrt: Joi.string(),
  benutzername: Joi.string(),
});

export const UpdateEmployeeSchema = EmployeeSchema.keys({
  account: OptionalAccountSchema.optional().default({}),
  branchId: ForeignKeySchema,
  roleId: ForeignKeySchema,
});

export const UpdateTeamSchema = Joi.object({
  name: Joi.string(),
  teamLeaderId: ForeignKeySchema.allow(null),
  branchId: ForeignKeySchema,
});

export const UpdateBranchSchema = Joi.object({
  name: Joi.string(),
  location: Joi.string(),
  managerId: ForeignKeySchema,
});

export const AssingClientToTeamSchema = Joi.object({
  clientId: ForeignKeySchema.required(),
  teamId: ForeignKeySchema.required(),
  services: Joi.array().items(Joi.number()).default([]),
});

export const ClientServicesSchema = Joi.array().items(Joi.number()).default([]);

export const PatchClientService = Joi.array().items(
  Joi.object({
    id: Joi.number().required(),
    isCompleted: Joi.boolean().required(),
  })
);
