import { expect, it } from 'bun:test'
import { parse } from 'json5'
import { file } from 'bun'

import { Event } from '../schema/event'

it(`SPEC.jsonc should be validated by Zod-schema`, async () => {
  const spec = await file('SPEC.jsonc').text()
  const spec_without_comments = parse(spec) // Caution, here parsing is to delete comments from spec with json5

  const parsed_spec = Event.safeParse(spec_without_comments) // Here parse() is Zod-related
  if (parsed_spec.error !== undefined) console.log(parsed_spec.error)
  expect(parsed_spec.success).toBe(true)
})
