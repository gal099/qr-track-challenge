/**
 * Zod schemas for request validation
 */

import { z } from 'zod'

const MAX_URL_LENGTH = 2048

export const generateQRCodeSchema = z.object({
  target_url: z
    .string()
    .min(1, 'URL is required')
    .max(MAX_URL_LENGTH, `URL must be less than ${MAX_URL_LENGTH} characters`)
    .url('Please enter a valid URL (e.g., https://example.com)')
    .refine(
      (url) => {
        try {
          const parsed = new URL(url)
          return ['http:', 'https:'].includes(parsed.protocol)
        } catch {
          return false
        }
      },
      { message: 'URL must start with http:// or https://' }
    ),
  fg_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Foreground color must be a valid hex color (e.g., #000000)')
    .default('#000000'),
  bg_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Background color must be a valid hex color (e.g., #FFFFFF)')
    .default('#FFFFFF'),
})

export type GenerateQRCodeInput = z.infer<typeof generateQRCodeSchema>

export const adminAuthSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export type AdminAuthInput = z.infer<typeof adminAuthSchema>
