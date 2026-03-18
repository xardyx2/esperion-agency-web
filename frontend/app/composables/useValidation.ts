import { z } from 'zod'

// This project stays on zod v4 for MCP Toolkit compatibility.
// `@vee-validate/zod` currently peers on zod v3, so we use a small
// local typed-schema bridge instead of the official adapter.

type Translate = (key: string, params?: Record<string, unknown>) => string

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type TypedSchemaError = {
  path?: string
  errors: string[]
}

type TypedSchemaResult<TOutput> = {
  value?: TOutput
  errors: TypedSchemaError[]
}

type VeeTypedSchema<TInput, TOutput> = {
  __type: 'VVTypedSchema'
  parse(values: TInput): Promise<TypedSchemaResult<TOutput>>
}

export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterFormValues {
  fullName: string
  username: string
  email: string
  phone: string
  password: string
  acceptTerms: boolean
}

export interface ContactFormValues {
  fullName: string
  companyName: string
  email: string
  phone: string
  service: string
  description: string
}

export interface UserFormValues {
  full_name: string
  username: string
  email: string
  phone: string
  role: string
  password: string
}

const requiredMessage = (label: string, locale: string) => {
  return locale === 'en' ? `${label} is required` : `${label} wajib diisi`
}

const invalidEmailMessage = (locale: string) => {
  return locale === 'en'
    ? 'Please enter a valid email address'
    : 'Mohon masukkan alamat email yang valid'
}

const minLengthMessage = (label: string, minimum: number, locale: string) => {
  return locale === 'en'
    ? `${label} must be at least ${minimum} characters`
    : `${label} minimal ${minimum} karakter`
}

const maxLengthMessage = (label: string, maximum: number, locale: string) => {
  return locale === 'en'
    ? `${label} must be less than ${maximum} characters`
    : `${label} maksimal ${maximum} karakter`
}

export function toVeeTypedSchema<TSchema extends z.ZodTypeAny>(schema: TSchema): VeeTypedSchema<z.input<TSchema>, z.output<TSchema>> {
  return {
    __type: 'VVTypedSchema',
    async parse(values) {
      const result = await schema.safeParseAsync(values)

      if (result.success) {
        return {
          value: result.data,
          errors: []
        }
      }

      const mapped = new Map<string, string[]>()

      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        const existing = mapped.get(path) ?? []
        existing.push(issue.message)
        mapped.set(path, existing)
      }

      return {
        errors: Array.from(mapped.entries()).map(([path, errors]) => ({
          path,
          errors
        }))
      }
    }
  }
}

export function createLoginSchema(t: Translate) {
  return z.object({
    email: z
      .string()
      .min(1, t('auth.login.errors.emailRequired'))
      .refine(value => EMAIL_REGEX.test(value), t('auth.login.errors.emailInvalid')),
    password: z
      .string()
      .min(1, t('auth.login.errors.passwordRequired'))
  })
}

export function createRegisterSchema(t: Translate) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, t('auth.register.errors.fullNameRequired')),
    username: z
      .string()
      .trim()
      .min(1, t('auth.register.errors.usernameRequired')),
    email: z
      .string()
      .min(1, t('auth.register.errors.emailRequired'))
      .refine(value => EMAIL_REGEX.test(value), t('auth.register.errors.emailInvalid')),
    phone: z.string(),
    password: z
      .string()
      .min(1, t('auth.register.errors.passwordRequired'))
      .min(8, t('auth.register.errors.passwordMinLength')),
    acceptTerms: z
      .boolean()
      .refine(value => value, t('auth.register.errors.acceptTermsRequired'))
  })
}

export function createContactSchema(t: Translate, locale: string) {
  const fullNameLabel = t('contact.form.fullNameLabel')
  const emailLabel = t('contact.form.emailLabel')
  const serviceLabel = t('contact.form.serviceLabel')
  const descriptionLabel = t('contact.form.descriptionLabel')

  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, requiredMessage(fullNameLabel, locale)),
    companyName: z.string(),
    email: z
      .string()
      .min(1, requiredMessage(emailLabel, locale))
      .refine(value => EMAIL_REGEX.test(value), invalidEmailMessage(locale)),
    phone: z.string(),
    service: z
      .string()
      .min(1, requiredMessage(serviceLabel, locale)),
    description: z
      .string()
      .trim()
      .min(1, requiredMessage(descriptionLabel, locale))
      .max(2000, maxLengthMessage(descriptionLabel, 2000, locale))
  })
}

export function createUserSchema(t: Translate, locale: string, requirePassword: boolean) {
  const fullNameLabel = t('dashboard.users.create.fullNameTitle')
  const usernameLabel = t('dashboard.users.create.usernameTitle')
  const emailLabel = t('dashboard.users.create.emailTitle')
  const roleLabel = t('dashboard.users.create.roleTitle')
  const passwordLabel = t('dashboard.users.create.passwordTitle')

  return z.object({
    full_name: z
      .string()
      .trim()
      .min(1, requiredMessage(fullNameLabel, locale)),
    username: z
      .string()
      .trim()
      .min(1, requiredMessage(usernameLabel, locale)),
    email: z
      .string()
      .min(1, requiredMessage(emailLabel, locale))
      .refine(value => EMAIL_REGEX.test(value), invalidEmailMessage(locale)),
    phone: z.string(),
    role: z
      .string()
      .min(1, requiredMessage(roleLabel, locale)),
    password: requirePassword
      ? z
          .string()
          .min(1, requiredMessage(passwordLabel, locale))
          .min(8, minLengthMessage(passwordLabel, 8, locale))
      : z.string()
  })
}
