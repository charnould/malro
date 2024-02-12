import { expect, it } from 'bun:test'
import { file } from 'bun'

import { resize_image } from '../../helpers/resize_image'

it('should resize and save image', async () => {
	const buffer = await file('./tests/dummy/image.jpg').arrayBuffer()
	await resize_image(buffer, '6ad3bf9a-138d-49fd-bd73-881c747db312')

	const temp = file('./datastore/images/tmp/6ad3bf9a-138d-49fd-bd73-881c747db312')
	const original = file('./datastore/images/originals/6ad3bf9a-138d-49fd-bd73-881c747db312.webp')
	const thumbnail = file('./datastore/images/6ad3bf9a-138d-49fd-bd73-881c747db312.webp')

	expect(await temp.exists()).toBe(false)

	expect(await original.exists()).toBe(true)
	expect(original.type).toBe('image/webp')
	expect(original.size).toBeGreaterThan(100000)
	expect(original.size).toBeLessThan(160000)

	expect(await thumbnail.exists()).toBe(true)
	expect(thumbnail.type).toBe('image/webp')
	expect(thumbnail.size).toBeGreaterThan(18000)
	expect(thumbnail.size).toBeLessThan(25000)
})
