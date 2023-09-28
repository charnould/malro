import { z } from 'zod'

export const User = z.object({
  created_at: z.string().default(new Date().toISOString().substring(0, 16)),
  created_by: z.string().toLowerCase().trim().default('auto'),
  is_admin: z.enum(['true', 'false']).default('false'),
  domain: z.string().toLowerCase().trim().default(''),
  lang: z.string().toLowerCase().trim().default(''),
  email: z.string().toLowerCase().email()
})

// eslint-disable-next-line no-redeclare
export type User = z.infer<typeof User>
