import { Buffer } from 'node:buffer'
import { file, env } from 'bun'
import type { Context } from 'hono'
import qs from 'qs'

import { save_event, get_event, Table } from '../models/events'
import { resize_image } from '../helpers/resize_image'
import { view } from '../views/form.html'
import { Event } from '../schema/event'

export const controller = async (c: Context) => {
	let event = await c.req.parseBody()

	event.updated_at = new Date().toISOString()
	event.mandatory_booking = event.mandatory_booking === 'true' ? true : false
	event.created_by = c.get('user').domain as string
	event.id = c.req.param('id')

	// Get linked_to from DB
	// People could have been linked to an event during event owner update.
	const event_from_db = get_event(event.id, Table.events)
	if (event_from_db) event.linked_to = JSON.parse(event_from_db.linked_to)
	else event.linked_to = [c.get('user').domain]

	// If an image is posted,
	// transform and save it
	if (event.image_url.size !== 0) {
		const blob = Buffer.from(await event.image_url.arrayBuffer())
		await resize_image(blob, event.id)
	}

	// Check if image exists
	const does_image_exist = await file(`./datastore/images/${event.id}.webp`).exists()
	if (does_image_exist === true) event.image_url = `${env.BASE_URL}/datastore/images/${event.id}.webp?v=${Date.now()}`

	try {
		// Parse event and throw error if it doesn't validate
		event = qs.parse(event, { arrayLimit: 80 })
		event = Event.parse(event)

		// Stringify then save event
		const table = event.status === 'published' ? Table.events : Table.drafts
		save_event(event, table)

		return c.redirect('/dashboard')
	} catch (errors) {
		console.log(errors)

		const lang: string = c.get('user').lang as string
		return c.html(await view(lang, event, errors.issues, does_image_exist), 422)
	}
}
