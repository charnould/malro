// ALL TESTED

import type { Statement } from 'bun:sqlite'
import { spawnSync, argv } from 'bun'

import { turn_stringified_into_parsed_events } from '../helpers/transform'
import { mount_db, DB } from '../helpers/database'
import type { Event } from '../schema/event'
import type { User } from '../schema/user'

const events_db = mount_db(DB.events)
const users_db = mount_db(DB.users)

export enum Table {
	events = 'events',
	drafts = 'drafts'
}

//
//
//
//
//
//
export const get_event = (id: Event['id'], table: Table) => {
	if (table === Table.events) return events_db.prepare('SELECT * FROM events WHERE id = ?').get(id)
	if (table === Table.drafts) return users_db.prepare('SELECT * FROM drafts WHERE id = ?').get(id)
}

//
//
//
//
//
//
export const save_event = (event: Event, table: Table) => {
	let stmt: Statement

	if (table === Table.events) {
		stmt = events_db.prepare(`
    INSERT OR REPLACE INTO events (id, created_by, status, updated_at, linked_to, longitude, latitude, country, zipcode, city, street, timezone, type, image_url, video_url, min_age, max_age, door_time, mandatory_booking, booking_start, booking_medium, currency, description, calendar, support_email, support_phone, featuring)
    VALUES                        (? , ?         , ?     , ?         , ?        , ?        , ?       , ?      , ?      , ?   , ?     , ?       , ?    , ?         , ?          , ?      , ?      , ?        , ?                , ?            , ?             , ?       , ?          , ?       , ?            , ?            , ?        )`)

		users_db.prepare('DELETE FROM drafts WHERE id = ?').run(event.id)
	}

	if (table === Table.drafts) {
		stmt = users_db.prepare(`
    INSERT OR REPLACE INTO drafts (id, created_by, status, updated_at, linked_to, longitude, latitude, country, zipcode, city, street, timezone, type, image_url, video_url, min_age, max_age, door_time, mandatory_booking, booking_start, booking_medium, currency, description, calendar, support_email, support_phone, featuring)
    VALUES                        (? , ?         , ?     , ?         , ?        , ?        , ?       , ?      , ?      , ?   , ?     , ?       , ?    , ?         , ?          , ?      , ?      , ?        , ?                , ?            , ?             , ?       , ?          , ?       , ?            , ?            , ?        )`)
	}

	stmt.run(
		event.id,
		event.created_by,
		event.status,
		new Date().toISOString(),
		JSON.stringify(event.linked_to),
		event.longitude,
		event.latitude,
		event.country,
		event.zipcode,
		event.city,
		event.street,
		event.timezone,
		JSON.stringify(event.type),
		event.image_url,
		event.video_url,
		event.min_age,
		event.max_age,
		event.door_time,
		JSON.stringify(event.mandatory_booking),
		event.booking_start,
		JSON.stringify(event.booking_medium),
		event.currency,
		JSON.stringify(event.description),
		JSON.stringify(event.calendar),
		event.support_email,
		event.support_phone,
		JSON.stringify(event.featuring)
	)

	return
}

//
//
//
//
//
//
export const list_events = (domain: User['domain']) => {
	// Get published events from events.db
	const events = events_db.prepare('SELECT * FROM linked_to INNER JOIN events USING(id) WHERE domain= ?').all(domain)
	const drafts = users_db.prepare('SELECT * FROM drafts WHERE created_by = ?').all(domain)

	const all = [...events, ...drafts]
		.sort((a: Event['updated_at'], b: Event['updated_at']) => a.updated_at - b.updated_at)
		.reverse()

	return turn_stringified_into_parsed_events(all)
}

//
//
//
//
//
//
export const trash_organization = (domain: User['domain']) => {
	// First, remove any mention of `domain` in `linked_to`
	// (indeed, if an org is trashed, it must not be linked to any event)...
	let events = events_db.query('SELECT * FROM events WHERE linked_to LIKE ?').all(`%"${domain}"%`)
	events = turn_stringified_into_parsed_events(events)
	for (const event of events) {
		event.linked_to = event.linked_to.filter((d: string) => d !== domain)
		save_event(event, Table.events)
	}

	// ...trash events created by `domain`...
	events_db.query(`UPDATE events SET status = "trashed" WHERE created_by = ?`).run(domain)

	// ...and finally delete all users and drafts
	users_db.query('DELETE FROM drafts WHERE created_by = ?').run(domain)
	users_db.query('DELETE FROM users WHERE domain = ?').run(domain)

	return
}

//
//
//
//
//
// A hack to be able to trash_organization() using bash.
// Tightly link to `bash run.sh trash_organization`.
// Useful when someone has made some tests in production, is not a spam
// and you just want to keep MALRO DB clean.
if (argv[2] === 'trash_organization') {
	const domain = argv[3].trim().toLowerCase()
	trash_organization(domain)
}

//
//
//
//
//
//
export const archive_organization = (domain: User['domain']) => {
	// Delete all unneeded stuff...
	users_db.query('DELETE FROM drafts WHERE created_by = ?').run(domain)
	users_db.query('DELETE FROM users WHERE domain = ?').run(domain)

	// ...and, for each event,
	// check if we keep it for posterity
	// or if we can trash it safely
	let events = events_db.query('SELECT * FROM events WHERE created_by = ?').all(domain)
	events = turn_stringified_into_parsed_events(events)

	for (const event of events) {
		event.calendar = event.calendar.filter(
			(s: { start: string }) => s.start < new Date().toISOString().substring(0, 16)
		)

		// if `event.calendar` IS empty,
		// it means that this event did not occured in the past.
		// Hence, no need to keep this event in DB for posterity.
		// FYI: Promotional image will be removed with vaccuum cronjob
		if (event.calendar.length === 0) trash_event(event.id)
		// if `event.calendar` IS NOT empty,
		// it means that we should keep this already-occured event for posterity
		else {
			save_event(event, Table.events)
		}
	}

	return
}

//
//
//
//
//
//
export const link_an_organization_to_an_event = (id: Event['id'], domain: User['domain']) => {
	const event = get_event(id, Table.events)
	if (event !== null) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const e: Event = turn_stringified_into_parsed_events([event])[0]
		e.linked_to = [...e.linked_to, domain].sort()
		e.linked_to = [...new Set(e.linked_to)]
		save_event(e, Table.events)
		return 'ORGANIZATION_LINKED'
	}
	return 'NO_EVENT_WITH_THIS_UUID'
}

//
//
//
//
//
//
export const unlink_an_organization_from_an_event = (id: Event['id'], domain: User['domain']) => {
	const event = get_event(id, Table.events)
	if (event !== null) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const e: Event = turn_stringified_into_parsed_events([event])[0]
		e.linked_to = e.linked_to.filter((d: string) => d !== domain)
		save_event(event, Table.events)
		return 'ORGANIZATION_UNLINKED'
	}
	return 'NO_EVENT_WITH_THIS_UUID'
}

//
//
//
//
//
//
export const duplicate_event = (id: Event['id'], domain: User['domain']) => {
	let event = get_event(id, Table.events)
	event = turn_stringified_into_parsed_events([event])[0]
	event.updated_at = Math.round(Date.now() / 1000)

	for (const d of event.description) {
		d.title = `[COPY] ${d.title}`
	}
	event.linked_to = `["${domain}"]`
	event.id = crypto.randomUUID()
	event.status = 'drafted'
	save_event(event, Table.drafts)
	return
}

//
//
//
//
//
//
export const trash_event = (id: Event['id']) => {
	users_db.query('DELETE FROM drafts WHERE id = ?').run(id)
	// TODO: handle image where you delete a draft

	let event = events_db.query('SELECT * FROM events WHERE id = ?').all(id)
	event = turn_stringified_into_parsed_events(event)[0]
	event.status = 'trashed'
	event.linked_to = []
	event.calendar = []
	save_event(event, Table.events)
	return
}

//
//
//
//
//
//
export const vacuum_trashed_events = () => {
	const db = mount_db(DB.events)
	// Get a date 10 days in the past,
	// then delete all old trash events

	const d1 = new Date()
	const d2 = d1.setDate(d1.getDate() - 10)
	const ten_days_ago = new Date(d2).toISOString()

	const images_to_delete: string[] = db
		.prepare('SELECT id FROM events WHERE updated_at < ? AND status = "trashed"')
		.all(ten_days_ago)

	for (const image of images_to_delete) {
		spawnSync(['rm', `datastore/images/${image.id}.webp`])
		spawnSync(['rm', `datastore/images/originals/${image.id}.webp`])
	}

	db.prepare('DELETE FROM events WHERE updated_at < ? AND status = "trashed"').run(ten_days_ago)

	console.info('[🤖 — cronbot]: DB and datastore/images vacuumed')
	return
}

//
//
//
//
//
//
export const count_events = () => {
	const db = mount_db(DB.events)
	const published = db.prepare('SELECT COUNT(*) as count FROM events WHERE status = "published"').get()
	const trashed = db.prepare('SELECT COUNT(*) as count FROM events WHERE status = "trashed"').get()
	return { published: published.count, trashed: trashed.count }
}
