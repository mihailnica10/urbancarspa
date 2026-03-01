/**
 * Zod validation schemas for authentication
 */

import { z } from 'zod'

// Email validation regex (RFC 5322 compliant but simplified)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Password requirements
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit')
  .refine(
    (password) => {
      const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123', 'password1', 'welcome1']
      return !commonPasswords.some(common => password.toLowerCase().includes(common))
    },
    'Password is too common'
  )

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Invalid email format')
    .email('Invalid email format')
    .max(254, 'Email is too long'),
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  }
)

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Invalid email format'),
})

export const passwordResetConfirmSchema = z.object({
  token: z
    .string()
    .min(1, 'Reset token is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  }
)

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>
