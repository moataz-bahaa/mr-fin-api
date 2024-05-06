import Joi from 'joi';

export const GenderSchema = Joi.string().valid('male', 'female').lowercase();

export const BranchSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string(),
});

export const ForeignKeySchema = Joi.number().integer().positive();
export const AccountSchema = Joi.object({
  userNameOrEmail: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.string().valid('active', 'archive').optional(),
});

const OptionalAccountSchema = Joi.object({
  userNameOrEmail: Joi.string().optional(),
  password: Joi.string().optional(),
  status: Joi.string().valid('active', 'archive').optional(),
});

export const AdminSchema = Joi.object({
  name: Joi.string().required(),
  profileImageUrl: Joi.string(),
});

export const EmployeeSchema = Joi.object({
  account: AccountSchema.required(),
  personalNumber: Joi.string(),
  title: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  streetOrHouseNumber: Joi.string(),
  zipOrCity: Joi.string(),
  country: Joi.string(),
  phone: Joi.string(),
  gender: GenderSchema,
  birthDate: Joi.date(),
  nationality: Joi.string(),
  maritalStatus: Joi.string(),
  entryDate: Joi.date(),
  groupOfPeople: Joi.string(),
  jobTitle: Joi.string(),
  activationCode: Joi.string(),
  graduation: Joi.string(),
  vocationalTraining: Joi.string(),
  AUG: Joi.string(),
  contractForm: Joi.string(),
  employmentStatus: Joi.string(),
  multipleEmployment: Joi.string(),
  weeklyWorkHours: ForeignKeySchema,
  dailyWorkHours: ForeignKeySchema,
  typeOfEmployment: Joi.string(),
  identificationNumber: Joi.string(),
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
  anrede: Joi.string(),
  title: Joi.string(),
  benutzername: Joi.string().required(),
  name: Joi.string().required(),
  vomame: Joi.string(),
  kurzbezeichnung: Joi.string(),
  bemerkung: Joi.string(),
  strasseHausnrZusatz: Joi.string(),
  adresserganzung: Joi.string(),
  postleitzahlOrt: Joi.string().required(),
  landLaenderkuerzel: Joi.string(),
  bemerkungAddress: Joi.string(),
  telefonFestnetz: Joi.string(),
  telefonMobil: Joi.string(),
  fax: Joi.string(),
  gender: GenderSchema,
  birthName: Joi.string(),
  gabatiot: Joi.string(),
  gebunsatum: Joi.string(),
  placeOfDeath: Joi.string(),
  diedOn: Joi.date(),
  retion: Joi.string(),
  federalState: Joi.string(),
  maritalStatus: Joi.string(),
  sinceThen: Joi.date(),
  propertyRegime: Joi.string(),
  unlimitedTaxLiability: Joi.boolean(),
  taxIdentificationNumber: Joi.string(),
  employer: Joi.string(),
  pensionInsuranceNumber: Joi.string(),
  pensionInsuranceProvider: Joi.string(),
  predisposition: Joi.string(),
  iban: Joi.string(),
  customerNumber: Joi.string(),
  bankCodeName: Joi.string(),
  taxNumber: Joi.string(),
  magpieTaxNumber: Joi.string(),
  powerOfDelivery: Joi.string(),
  validFrom: Joi.date(),
  validUntil: Joi.date(),
  commentTaxNumber: Joi.string(),
  officialNumberName: Joi.string(),
  designationTaxOffice: Joi.string(),
  commentTaxOffice: Joi.string(),
  taxAccount: Joi.string(),
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
  teamLeaderId: ForeignKeySchema,
  branchId: ForeignKeySchema,
})