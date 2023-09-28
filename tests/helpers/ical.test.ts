import { setSystemTime, expect, it } from 'bun:test'

import { generate_ical_event, escape_character } from '../../helpers/ical'
import { save_event, Table } from '../../models/events'
import { dummy_event } from '../dummy/events'

//
//
//
//
//
//
it('should generate a valid ical event', async () => {
  // Fill DB with an event...
  save_event(dummy_event, Table.events)

  // ... and mock new Date()
  setSystemTime(new Date('2023-11-27T19:37:00.000Z'))

  // Check if ical file is well-formed
  const ical_0 = await generate_ical_event(dummy_event.id, 0)
  const ical_1 = await generate_ical_event(dummy_event.id, 1)
  expect(ical_0).toMatchSnapshot()
  expect(ical_1).toMatchSnapshot()
})

//
//
//
//
//
//
// prettier-ignore
it('should escape forbidden characters', () => {
  const input = escape_character('18, rue de, la république ; Paris')
  // eslint-disable-next-line no-useless-escape
  const output = '18\\, rue de\\, la république \\; Paris'
  expect(input).toBe(output)
})
