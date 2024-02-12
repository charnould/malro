import { html } from 'hono/html'

import { layout } from './_layout'

export const click_magic_link = (magic_link: string) =>
	layout(
		html`<p>Hello 👋,</p>
      <p>Click on <a href="${magic_link}">this link</a> to login.</p>
      <p>If you didn't request to login, you can safely ignore this email.</p> `
	)

export const ask_admin = (admin_emails: string[]) =>
	layout(
		html`<p>Hello 👋,</p>
      <p>
        Ask one of these people to grant you access.<br />
        ${admin_emails.map((email) => html`<a href="mailto:${email}">${email}</a><br />`)}
      </p>
      <p>If you didn't request to login, you can safely ignore this email.</p> `
	)
