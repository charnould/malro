import { Event } from '../schema/event'
import { LANG } from '../enums/lang'

//
//
//
//
//
//
// Sort all event calendar by start date
// Mainly used in Zod schemas
export const sort_calendar_by_start_date = (array) =>
	array.sort((a: { start: string }, b: { start: string }) => {
		if (a.start < b.start) return -1
		if (a.start > b.start) return 1
		return 0
	})

//
//
//
//
//
//
// Keep only future occurrence of an event
// Useful to display a MALRO card with useful info.
export const keep_only_future_occurrences = (calendar: Event['calendar']) => {
	calendar = calendar.filter((s: (typeof Event)['calendar'], index: number) => {
		s.index = index // Mandatory to get the correct calendar record
		return s.start > new Date().toISOString().substring(0, 16)
	})
	sort_calendar_by_start_date(calendar)
	return calendar
}

//
//
//
//
//
//
// Get relevant translation of an event description in regards of user preferred langs
// Useful to display a MALRO card with useful info.
// TODO: test
export const get_relevant_translation = (description: Event['description'], langs: typeof LANG) => {
	let relevant_description: (typeof Event)['description']
	for (const lang of langs) {
		relevant_description = description.find((d) => d.lang === lang)
		if (relevant_description !== undefined) break
	}
	return [relevant_description]
}

//
//
//
//
//
//
// Transform a date into ICAL format
// TODO: test
export const transform_date = (date?: undefined | string) => {
	if (date === undefined) {
		return `${new Date().toISOString().replace(/[-:.]/g, '').substring(0, 13)}00`
	}
	return `${date.replace(/[-:]/g, '')}00`
}

//
//
//
//
//
//
// Parse a DB query (0, 1 or more events) into a JS-event/object usable in code
//
export const turn_stringified_into_parsed_events = (events: any) => {
	for (const event of events) {
		if (event !== null) {
			event.mandatory_booking = JSON.parse(event.mandatory_booking)
			event.booking_medium = JSON.parse(event.booking_medium)
			event.description = JSON.parse(event.description)
			event.linked_to = JSON.parse(event.linked_to)
			event.featuring = JSON.parse(event.featuring)
			event.calendar = JSON.parse(event.calendar)
			event.type = JSON.parse(event.type)
		}
	}

	return events as Event[]
}

//
//
//
//
//
//
// Transform firstname `piotr illich charles-henri` into `Piotr Illich Charles-Henri`
export const capitalize_firstname = (firstname: string) => {
	const firstnames = firstname.trim().replace(/\s\s+/g, ' ').toLowerCase().split(' ')
	for (let i = 0; i < firstnames.length; i++) {
		firstnames[i] = firstnames[i].charAt(0).toUpperCase() + firstnames[i].slice(1)
		if (firstnames[i].includes('-')) {
			const hyphenated_name = firstnames[i].split('-')
			for (let i = 0; i < hyphenated_name.length; i++) {
				hyphenated_name[i] = hyphenated_name[i].charAt(0).toUpperCase() + hyphenated_name[i].slice(1)
			}
			firstnames[i] = hyphenated_name.join('-')
		}
	}
	return firstnames.join(' ')
}

//
//
//
//
//
//
// Strip Emojis
export const strip_multiple_spaces_and_emojis = (string: string) =>
	string
		.replace(
			/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
			''
		)
		.replace(/\s+/g, ' ')
		.trim()
