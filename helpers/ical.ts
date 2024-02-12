import { Buffer } from 'buffer'

import { turn_stringified_into_parsed_events } from '../helpers/transform'
import { get_event, Table } from '../models/events'
import { transform_date } from './transform'
import { Event } from '../schema/event'

//
//
//
//
//
//
export const escape_character = (string: string) => string.replace(/,/g, '\\,').replace(/;/g, '\\;')

//
//
//
//
//
//
export const generate_ical_event = async (event_id: Event['id'], index: number) => {
	const event_data = await get_event(event_id, Table.events)
	const event = turn_stringified_into_parsed_events([event_data])[0]

	// TODO: add timezone
	const ical =
		`BEGIN:VCALENDAR\n` +
		`PRODID:-//www.MALRO.org//Calendar//EN\n` +
		`VERSION:2.0\n` +
		`BEGIN:VEVENT\n` +
		`UID:${event.id}\n` +
		`DTSTAMP:${transform_date()}\n` +
		`DTSTART:${transform_date(event.calendar[index].start)}\n` +
		`DTEND:${transform_date(event.calendar[index].end)}\n` +
		`ORGANIZER;CN=${event.created_by}:MAILTO:${event.support_email}\n` +
		`SUMMARY:${escape_character(event.description[0].title)}\n` +
		`DESCRIPTION:${event.description[0].content}\n` +
		`URL:${event.description[0].url}\n` +
		`LOCATION: ${escape_character(event.street)} • ${escape_character(event.zipcode)} ${escape_character(
			event.city
		)}\n` +
		`END:VEVENT\n` +
		`END:VCALENDAR\n`

	return Buffer.from(ical).toString()
}
