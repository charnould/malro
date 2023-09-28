import { Context } from 'hono'

// TODO: Add an unauthorized domain to DB via a manual GH Issue
export const controller = (c: Context) => c.text('ok')
