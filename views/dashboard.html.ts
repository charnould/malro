import { randomUUID } from 'node:crypto'
import { html } from 'hono/html'
import { env } from 'bun'

import { layout } from '../views/_layout'
import { Event } from '../schema/event'

export const view = (domain: string, events: Event[]) =>
	layout(
		html`
      <div class="d-menu">
        <a class="d-menu__link" href="/new/${randomUUID()}/edit">Créer un événement</a>
        ${
					events.length !== 0
						? html`<a
                target="_blank"
                class="d-menu__link d-menu__link--small"
                href="${env.BASE_URL}/sql/select%20*,%20min(start)%20as%20next%20from%20calendar%20inner%20join%20events%20using%20(id)%20inner%20join%20linked_to%20using%20(id)%20where%20status='published'%20and%20linked_to.domain='${domain}'%20and%20calendar.start%3Estrftime('%25Y-%25m-%25d',%20'now')%20group%20by%20id%20order%20by%20next%20limit%201"
                >Partager votre prochain événement</a
              >
              <a
                target="_blank"
                class="d-menu__link d-menu__link--small"
                href="${env.BASE_URL}/sql/select%20*,%20min(start)%20as%20next%20from%20calendar%20inner%20join%20events%20using%20(id)%20inner%20join%20linked_to%20using%20(id)%20where%20status='published'%20and%20linked_to.domain='${domain}'%20and%20calendar.start%3Estrftime('%25Y-%25m-%25d',%20'now')%20group%20by%20id%20order%20by%20next"
                >Partager vos prochains événements</a
              >
              <a class="d-menu__link d-menu__link--small" href="/#embed" target="_blank"
                >Partager un flux personnalisé</a
              >`
						: null
				}
        <a class="d-menu__link d-menu__link--small" href="/settings">Paramètres</a>
      </div>

      <table class="d-events">
        <tr>
          <td class="d-event__cell--header">ID</td>
          <td class="d-event__cell--header">DERNIÈRE MODIF.</td>
          <td class="d-event__cell--header">STATUT</td>
          <td class="d-event__cell--header">CRÉÉ PAR</td>
          <td class="d-event__cell--header">ACTION</td>
          <td class="d-event__cell--header">ÉVÉNEMENT</td>
        </tr>

        ${events.map(
					(f) =>
						html`<tr>
              <td class="d-event__cell--uuid">${f.id}</td>
              <td>${new Date(f.updated_at).toISOString().substring(0, 16)}</td>
              <td>
                ${
									f.status === 'published'
										? html`<span class="d-event__status d-event__status--published">Publié</span>`
										: html`<span class="d-event__status">Brouillon</span>`
								}
              </td>
              <td>${f.created_by}</td>

              <td>
                <div class="d-event__dropdown">
                  <button class="d-event__dropdown--button">&nbsp;•••&nbsp;</button>
                  <form class="d-event__dropdown--content" method="post" enctype="multipart/form-data">
                    ${
											f.status === 'published'
												? html`<a
                          href="/sql/SELECT%20*%20FROM%20events%20WHERE%20id='${f.id}'?embed=false"
                          target="_blank"
                          >Voir + Partager</a
                        >`
												: null
										}
                    ${
											f.created_by === domain && f.status === 'published'
												? html`<a href="event/${f.id}/edit">Modifier</a>`
												: null
										}
                    ${
											f.created_by === domain && f.status === 'drafted'
												? html`<a href="draft/${f.id}/edit">Modifier</a>`
												: null
										}
                    ${
											f.created_by !== domain
												? html`<button
                          formaction="./settings?action=unlink_from_an_event"
                          name="event_id"
                          value="${f.id}"
                        >
                          Se dissocier
                        </button>`
												: null
										}
                    ${
											f.created_by === domain && f.status === 'published'
												? html`<button formaction="./settings?action=duplicate_event" name="event_id" value="${f.id}">
                          Dupliquer
                        </button>`
												: null
										}
                    ${
											f.created_by === domain
												? html`<button formaction="./settings?action=trash_event" name="event_id" value="${f.id}">
                          Supprimer
                        </button>`
												: null
										}
                  </form>
                </div>
              </td>

              <td class="d-event__cell--title">${f.description[0].title}</td>
            </tr> `
				)}
        ${add_blank_state(events)}
      </table>
    ` as unknown as string
	)

// Add blank lines to fill Dashboard and make it look clean
export const add_blank_state = (events: Event[]) => {
	const missing_rows = 50 - events.length
	const filler = []
	for (let index = 0; index < missing_rows; index++) {
		const row = html`<tr class="d-event__blankrow">
      <td class="d-event__blankcell">&nbsp;</td>
      <td class="d-event__blankcell">&nbsp;</td>
      <td class="d-event__blankcell">&nbsp;</td>
      <td class="d-event__blankcell">&nbsp;</td>
      <td class="d-event__blankcell">&nbsp;</td>
      <td class="d-event__blankcell">&nbsp;</td>
    </tr>`
		filler.push(row)
	}
	return filler
}
