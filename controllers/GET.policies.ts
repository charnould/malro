import type { Context } from 'hono'

import { view } from '../views/policies.html'

/* Controller */
export const controller = (c: Context) => c.html(view())
