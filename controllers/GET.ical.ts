import type { Context } from 'hono'

import { generate_ical_event } from '../helpers/ical'

/** Controller */
export const controller = async (c: Context) => {
	const event_id = c.req.param('event')
	const calendar_index = Number(c.req.param('calendar_index'))
	const ical_event = await generate_ical_event(event_id, calendar_index)

	c.header('Content-Disposition', 'attachment')
	c.header('Content-Type', 'text/calendar')
	c.header('filename', 'event.ics')

	return c.body(ical_event)
}
