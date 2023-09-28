import { expect, it } from 'bun:test'

import { extract_domain_from_email } from '../../helpers/auth'

it('should extract_domain_from_email()', () => {
  expect(extract_domain_from_email('email@fake.com')).toBe('fake.com')
  expect(extract_domain_from_email('email@FAKE.COM')).toBe('fake.com')
  expect(extract_domain_from_email('email@FAKE.COM ')).toBe('fake.com')
  expect(extract_domain_from_email('email@app.fake.com')).toBe('fake.com')
  expect(extract_domain_from_email('a.b-c@email-app.fake.com')).toBe('fake.com')
})
