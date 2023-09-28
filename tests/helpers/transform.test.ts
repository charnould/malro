import { expect, it } from 'bun:test'

import {
  strip_multiple_spaces_and_emojis,
  keep_only_future_occurrences,
  sort_calendar_by_start_date,
  capitalize_firstname
} from '../../helpers/transform'
import { turn_stringified_into_parsed_events } from '../../helpers/transform'
import { save_event, get_event, Table } from '../../models/events'
import { dummy_event } from '../dummy/events'

//
//
//
//
//
//
it('should sort calendar by start date', () => {
  const input = [
    { start: '2023-01-02T12:00', end: '2023-01-02T21:00' },
    { start: '2001-01-01T12:00', end: '2001-01-01T21:00' },
    { start: '2022-01-01T12:00', end: '2022-01-01T21:00' }
  ]
  expect(sort_calendar_by_start_date(input)).toMatchSnapshot()
})

//
//
//
//
//
//
it('should keep only future occurrences of an event', () => {
  save_event(dummy_event, Table.drafts)
  const stringified_event = get_event(dummy_event.id, Table.drafts)

  const event = turn_stringified_into_parsed_events([stringified_event])[0]
  const only_future_occurrences = keep_only_future_occurrences(event.calendar)
  expect(only_future_occurrences).toMatchSnapshot()
})

//
//
//
//
//
//
it('should capitalize firstname', () => {
  const input = ' piotr ILlich d. j michel-ange jean-sébastien  '
  const output = capitalize_firstname(input)
  expect(output).toBe('Piotr Illich D. J Michel-Ange Jean-Sébastien')
})

//
//
//
//
//
//
it('should strip multiple spaces and emojis', () => {
  const input = ' 👍 This 👍👍 is a     👍 👍  👍 test 👍  '
  const output = strip_multiple_spaces_and_emojis(input)
  expect(output).toBe('This is a test')
})
