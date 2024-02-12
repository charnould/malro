import { Context } from 'hono'

import { turn_stringified_into_parsed_events } from '../helpers/transform'
import { get_event, Table } from '../models/events'
import { view } from '../views/form.html'

export const controller = async (c: Context) => {
	const kind = c.req.param('kind')
	const id = c.req.param('id')
	let does_image_exist = false
	let event = {}

	if (kind === 'event') event = get_event(id, Table.events)
	if (kind === 'draft') event = get_event(id, Table.drafts)

	if (kind === 'draft' || kind === 'event') {
		event = turn_stringified_into_parsed_events([event])[0]
		if (event.booking_medium === null) event.booking_medium = [{}]
		if (event.featuring === null) event.featuring = [{}]
		does_image_exist = true
	}

	if (kind === 'new') {
		event.description = [{}]
		event.booking_medium = [{}]
		event.calendar = [{}]
		event.featuring = [{}]
	}

	const lang: string = c.get('user').lang as string

	return c.html(await view(lang, event, null, does_image_exist))
}
