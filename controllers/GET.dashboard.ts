import { Context } from 'hono'

import { list_events } from '../models/events'
import { view } from '../views/dashboard.html'

/* Controller */
export const controller = async (c: Context) => {
  const events = await list_events(c.get('user').domain)
  const domain = c.get('user').domain
  return c.html(view(domain, events))
}
