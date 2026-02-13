/**
 * Zod schemas for request validation
 */

import { z } from 'zod'

export const generateQRCodeSchema = z.object({
  target_url: z.string().url('Invalid URL format').min(1, 'URL is required'),
  fg_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format')
    .default('#000000'),
  bg_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format')
    .default('#FFFFFF'),
})

export type GenerateQRCodeInput = z.infer<typeof generateQRCodeSchema>
