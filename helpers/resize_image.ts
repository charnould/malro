import { spawnSync, spawn, write, sleep } from 'bun'

import type { Event } from '../schema/event'

export const resize_image = async (blob: ArrayBuffer, id: Event['id']) => {
	// Write uploaded image into tmp/.
	await write(`datastore/images/tmp/${id}`, blob)

	// Save uploaded kind-of HD image into originals/.
	// Image is resized, converted to .webp and exif metadata removed.
	const process_1 = spawn({
		cmd: [
			'convert',
			`datastore/images/tmp/${id}`,
			'-resize',
			'1500x1200>',
			'-strip',
			`datastore/images/originals/${id}.webp`
		],
		stderr: 'pipe'
	})

	// Transform original image into a .webp thumbnail without exif metadata.
	const process_2 = spawn({
		cmd: [
			'convert',
			`datastore/images/tmp/${id}`,
			'-thumbnail',
			'636x340^',
			'-gravity',
			'center',
			'-extent',
			'636x340',
			'-strip',
			`datastore/images/${id}.webp`
		],
		stderr: 'pipe'
	})

	// While exitCodes aren't 0, wait a few ms (see: https://github.com/oven-sh/bun/issues/4369)
	while (process_1.exitCode === null || process_2.exitCode === null) {
		await sleep(10)
	}

	// Then, when exitCodes are 0, delete image from tmp/ folder and return
	if (process_1.exitCode === 0 && process_2.exitCode === 0) {
		spawnSync(['rm', `datastore/images/tmp/${id}`])
		return
	}
}
