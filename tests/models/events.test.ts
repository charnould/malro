import { setSystemTime, beforeEach, afterAll, expect, it } from 'bun:test'

import {
	unlink_an_organization_from_an_event,
	link_an_organization_to_an_event,
	archive_organization,
	trash_organization,
	duplicate_event,
	count_events,
	list_events,
	trash_event,
	save_event,
	get_event,
	Table
} from '../../models/events'
import { turn_stringified_into_parsed_events } from '../../helpers/transform'
import { mount_db, DB } from '../../helpers/database'
import { insert_user } from '../../models/users'
import { dummy_event } from '../dummy/events'
import { Event } from '../../schema/event'
import { User } from '../../schema/user'
import { u1, u2 } from '../dummy/users'

const events_db = mount_db(DB.events, { readwrite: true, create: false })
const users_db = mount_db(DB.users, { readwrite: true, create: false })

afterAll(() => setSystemTime())

beforeEach(() => {
	Event.parse(dummy_event)
	setSystemTime(new Date('2024-07-22T12:30:00.000Z'))
	events_db.query('DELETE FROM events').run()
	events_db.query('DELETE FROM calendar').run()
	events_db.query('DELETE FROM linked_to').run()
	users_db.query('DELETE FROM users').run()
	users_db.query('DELETE FROM drafts').run()
})

//
//
//
//
//
//
it('should insert and get 1 event from DRAFTS', () => {
	save_event(dummy_event, Table.drafts)
	const event = get_event(dummy_event.id, Table.drafts)
	expect(event).toMatchSnapshot()
})

//
//
//
//
//
//
it('should insert and get 1 event from EVENTS', () => {
	save_event(dummy_event, Table.events)

	const event = get_event(dummy_event.id, Table.events)
	const calendar = events_db.prepare('SELECT * FROM calendar WHERE id = ?').all(dummy_event.id)
	const linked_to = events_db.prepare('SELECT * FROM linked_to WHERE id = ?').all(dummy_event.id)

	expect(event).toMatchSnapshot()
	expect(calendar).toMatchSnapshot()
	expect(linked_to).toMatchSnapshot()
})

//
//
//
//
//
//
it('should update 1 event in EVENTS', () => {
	const e1 = { ...dummy_event }
	const e1_mod = { ...dummy_event }
	e1_mod.calendar = [
		{
			start: '2023-10-01T19:30',
			end: '2023-10-01T21:00',
			audio_lang: 'fr',
			adult_fee: 150,
			child_fee: 50,
			feature: null
		},
		{
			start: '2200-06-12T12:30',
			end: '2200-06-12T14:30',
			audio_lang: 'fr',
			child_fee: 10,
			adult_fee: 35,
			feature: null
		}
	]
	e1_mod.mandatory_booking = false
	e1_mod.linked_to = ['google.org', 'example.org', 'test.org']

	save_event(e1, Table.events)

	setSystemTime(new Date('2025-07-22T12:30:00.000Z'))
	save_event(e1_mod, Table.events)

	const event = get_event(e1.id, Table.events)
	const calendar = events_db.prepare('SELECT * FROM calendar WHERE id = ?').all(e1.id)
	const linked_to = events_db.prepare('SELECT * FROM linked_to WHERE id = ?').all(e1.id)

	expect(event).toMatchSnapshot()
	expect(calendar).toMatchSnapshot()
	expect(linked_to).toMatchSnapshot()
})

//
//
//
//
//
//
it('should trash an organization', () => {
	// Insert some users
	insert_user(User.parse(u1))
	insert_user(User.parse(u2))

	// Insert some events in EVENTS and DRAFTS
	const e1 = { ...dummy_event }
	const e2 = { ...dummy_event }
	e2.id = 'dcfafd73-d2d6-4068-b608-1985a98d3f04'
	const e3 = { ...dummy_event }
	e3.id = '0c7d71f8-24f9-4132-8569-0a4c5d9ff194'
	const e4 = { ...dummy_event }
	e4.id = '0ff20377-7c95-46c8-8e05-8966bd3309db'

	save_event(e1, Table.events)
	save_event(e2, Table.events)
	save_event(e3, Table.drafts)
	save_event(e4, Table.drafts)

	const domain = e1.created_by

	// Trash organization
	setSystemTime(new Date('2026-07-22T12:30:00.000Z'))
	trash_organization(domain)

	// Check if all is OK
	const users = users_db.prepare('SELECT * FROM users WHERE domain = ?').all(domain)
	expect(users).toStrictEqual([])

	const drafts = users_db.prepare('SELECT * FROM drafts WHERE created_by = ?').all(domain)
	expect(drafts).toStrictEqual([])

	const events = events_db.prepare('SELECT * FROM events WHERE created_by = ?').all(domain)
	const parsed_events = turn_stringified_into_parsed_events(events)

	for (const e of parsed_events) {
		expect(e.status).toBe('trashed')
		expect(e.updated_at).toBe(new Date().toISOString())
	}

	const calendar = events_db.prepare(`SELECT * FROM calendar WHERE id IN ('${e1.id}','${e2.id}')`).all()
	expect(calendar).toStrictEqual([])

	const linked_to = events_db.prepare(`SELECT * FROM linked_to WHERE id IN ('${e1.id}','${e2.id}')`).all()
	expect(linked_to).toStrictEqual([])

	const c = events_db.prepare(`SELECT * FROM events WHERE linked_to LIKE '%${domain}%'`).all()
	expect(c).toStrictEqual([])
})

//
//
//
//
//
//
it('should archive an organization', () => {
	insert_user(User.parse(u1))

	// Insert some events in EVENTS and DRAFTS
	const e1 = { ...dummy_event }
	const e2 = { ...dummy_event }
	const e3 = { ...dummy_event }
	e3.id = 'dcfafd73-d2d6-4068-b608-1985a98d3f04'
	e3.calendar = [
		{
			start: '2200-10-01T19:30',
			end: '2200-10-01T21:00',
			audio_lang: 'fr',
			child_fee: 0,
			adult_fee: 0,
			feature: []
		}
	]

	save_event(e1, Table.drafts)
	save_event(e2, Table.events)
	save_event(e3, Table.events)

	const domain = u1.domain

	setSystemTime(new Date('2027-07-22T12:30:00.000Z'))
	archive_organization(domain)

	const users = users_db.prepare('SELECT * FROM users WHERE domain = ?').all(domain)
	expect(users).toStrictEqual([])

	const drafts = users_db.prepare('SELECT * FROM drafts WHERE created_by = ?').all(domain)
	expect(drafts).toStrictEqual([])

	const events = events_db.prepare('SELECT * FROM events WHERE created_by = ?').all(domain)
	const parsed_events = turn_stringified_into_parsed_events(events)

	expect(parsed_events).toMatchSnapshot()

	for (const e of parsed_events) {
		expect(e.calendar).toMatchSnapshot()
		expect(e.updated_at).toBe(new Date().toISOString())
	}

	const calendar = events_db.prepare(`SELECT * FROM calendar WHERE id IN ('${e1.id}','${e2.id}')`).all()
	expect(calendar).toMatchSnapshot()

	const linked_to = events_db.prepare(`SELECT * FROM linked_to WHERE id IN ('${e1.id}','${e2.id}')`).all()
	expect(linked_to).toMatchSnapshot()
})

//
//
//
//
//
//
it('should link an organization to an event', () => {
	const e1 = { ...dummy_event }
	save_event(e1, Table.events)
	const fn = link_an_organization_to_an_event(e1.id, 'test.org')
	const event = get_event(e1.id, Table.events)
	expect(event.linked_to).toMatchSnapshot()
	expect(fn).toBe('ORGANIZATION_LINKED')
	expect(link_an_organization_to_an_event('non-existing-uuid', 'test.org')).toBe('NO_EVENT_WITH_THIS_UUID')
})

//
//
//
//
//
//
it('should unlink an organization from event', () => {
	const e1 = { ...dummy_event }
	save_event(e1, Table.events)
	const fn = unlink_an_organization_from_an_event(e1.id, 'example.org')
	const event = get_event(e1.id, Table.events)
	expect(event.linked_to).toMatchSnapshot()
	expect(fn).toBe('ORGANIZATION_UNLINKED')
	expect(unlink_an_organization_from_an_event('non-existing-uuid', 'test.org')).toBe('NO_EVENT_WITH_THIS_UUID')
})

//
//
//
//
//
//
it('should trash an event or a draft', () => {
	const e1 = { ...dummy_event }
	const e2 = { ...dummy_event }
	save_event(e1, Table.events)
	save_event(e2, Table.drafts)

	setSystemTime(new Date('2027-07-22T12:30:00.000Z'))
	trash_event(e1.id)
	trash_event(e2.id)

	const a = events_db.prepare('SELECT * FROM events WHERE id = ?').all(e1.id)
	const b = events_db.prepare('SELECT * FROM calendar WHERE id = ?').all(e1.id)
	const c = events_db.prepare('SELECT * FROM linked_to WHERE id = ?').all(e1.id)
	expect(a).toMatchSnapshot()
	expect(b).toStrictEqual([])
	expect(c).toStrictEqual([])

	const d = users_db.prepare('SELECT * FROM drafts WHERE id = ?').all(e2.id)
	expect(d).toStrictEqual([])
})

//
//
//
//
//
//
it('should list events for Dashboard', () => {
	const e1 = { ...dummy_event }
	const e2 = { ...dummy_event }

	save_event(e2, Table.events)
	save_event(e1, Table.drafts)

	const a = list_events(e1.created_by)
	expect(a.length).toBe(2)
	expect(a).toMatchSnapshot()
})

//
//
//
//
//
//
it('should copy an event', () => {
	const e1 = { ...dummy_event }
	save_event(e1, Table.events)
	duplicate_event(e1.id, e1.created_by)

	const a = users_db.prepare('SELECT * FROM drafts').all()
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const parsed_a: Event = turn_stringified_into_parsed_events(a)[0]

	expect(a.length).toBe(1)
	for (const i of parsed_a.description) {
		expect(i.title).toStartWith('[COPY]')
	}
})

//
//
//
//
//
//
it('should count events', () => {
	const e1 = { ...dummy_event }
	const e2 = { ...dummy_event }
	e2.id = 'c19dda33-36d8-44ea-8774-a939bb5b3386'
	const e3 = { ...dummy_event }
	e3.id = 'dcfafd73-d2d6-4068-b608-1985a98d3f04'
	e3.status = 'trashed'

	save_event(e1, Table.events)
	save_event(e2, Table.events)
	save_event(e3, Table.events)

	const count = count_events()
	expect(count.published).toBe(2)
	expect(count.trashed).toBe(1)
})
