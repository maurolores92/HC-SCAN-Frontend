import * as yup from 'yup'

export const DEFAULT_COMPANY_MODULES = ['documents', 'ai_queries', 'users', 'roles', 'audit']

export const companyModalSchema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  slug: yup
    .string()
    .required('El slug identificador es obligatorio')
    .matches(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  legalName: yup.string().optional(),
  taxId: yup.string().optional(),
  address: yup.string().optional(),
  phone: yup.string().optional(),
  email: yup.string().email('Ingrese un correo válido').nullable().optional(),
  planId: yup.number().nullable().optional(),
  useCustomLimits: yup.boolean().required(),
  maxUsers: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null ? null : v))
    .min(1, 'Mínimo 1'),
  maxDocuments: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null ? null : v))
    .min(1, 'Mínimo 1'),
  maxStorageMb: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null ? null : v))
    .min(1, 'Mínimo 1 MB'),
  maxAiQueriesMonthly: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null ? null : v))
    .min(0, 'Mínimo 0'),
  enabledModules: yup.array().of(yup.string().required()).optional(),
  adminName: yup.string().optional(),
  adminLastName: yup.string().optional(),
  adminEmail: yup.string().optional(),
  adminPassword: yup.string().optional()
})

