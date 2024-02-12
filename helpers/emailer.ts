import { env } from 'bun'

// For sending emails through MailPace (privacy-first emailer)
export const send_email = async (metadata: { subject: string; email: string; to: string }) => {
	if (env.NODE_ENV === 'production') {
		const endpoint = env.EMAILER_ENDPOINT!
		const token = env.EMAILER_TOKEN!

		return await fetch(endpoint, {
			body: JSON.stringify({
				from: 'MALRO.org <robot@malro.org>',
				subject: metadata.subject,
				htmlbody: metadata.email,
				to: metadata.to
			}),
			// prettier-ignore
			headers: {
				'Content-Type': 'application/json',
				'MailPace-Server-Token': token,
				Accept: 'application/json'
			},
			method: 'POST'
		})
	}
	console.log(`In Production, ${metadata.to} receives this email:
    ${metadata.email}`)
}
