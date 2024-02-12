// TODO: clean CSS/UI
// TODO: locales + translation fr/en

import { html } from 'hono/html'
import { ZodError } from 'zod'

import { translate } from '../helpers/translate'
import { CURRENCY } from '../enums/currency'
import { TIMEZONE } from '../enums/timezone'
import { BOOKING } from '../enums/booking'
import { FEATURE } from '../enums/feature'
import { COUNTRY } from '../enums/country'
import { layout } from '../views/_layout'
import { Event } from '../schema/event'
import { LANG } from '../enums/lang'
import { TYPE } from '../enums/type'

//
//
//
//
//
//
export const get_error = (errors: ZodError[], key: string) =>
	html` <ul>
    ${errors?.map((error) =>
			error.path.length <= 2 && error.path[0] === key ? html`<li class="input-error">${error.message}</li>` : null
		)}
  </ul>`

//
//
//
//
//
//
export const other_error = (errors: ZodError[], path_0: string, index: number, path_2: string) =>
	html` <ul class="input-errors">
    ${errors?.map((error) =>
			error.path[0] === path_0 && error.path[1] === index && error.path[2] === path_2
				? html`<li class="input-error">${error.message}</li>`
				: null
		)}
  </ul>`

//
//
//
//
//
//
export const view = async (lang: string, data: Event, errors: ZodError, does_image_exist: boolean) =>
	layout(
		html` <a class="s-back" href="/dashboard">← Tableau de bord</a>

      ${errors ? html`<p class="f-error">Le formulaire contient une ou des erreurs signalées en rouge</p>` : null}

      <form method="post" enctype="multipart/form-data" action="edit">
        <!-- START: Event language-specific description -->
        <h1 class="f-title">Description de l'événement</h1>

        <p class="f-text">
          <b>Décrivez votre événement.</b> Ces éléments sont tous susceptibles d'être présentés aux internautes ;
          rédigez les donc de façon à les éclairer efficacement. Les émojis et les sauts de ligne ne seront pas
          affichés.
        </p>

        ${data.description.map(
					(b, index) => html`
            <div class="f-description" data-id="description">
              <label class="f-input__label f-input__label--full-width"
                ><span class="f-input__label--label">Dans quelle langue est rédigée cette description ?</span>
                <select class="f-input__text" name="description[${index}][lang]">
                  <option value="" selected>?</option>
                  ${LANG.map(
										(lang) => html` <option value="${lang}" ${lang === b.lang ? 'selected' : null}>${lang}</option>`
									)}
                </select>
                ${other_error(errors, 'description', index, 'lang')}
              </label>

              <label class="f-input__label f-input__label--full-width"
                ><span class="f-input__label--label">Titre de l'événement</span>
                <input
                  class="f-input__text f-input__text--bold"
                  name="description[${index}][title]"
                  placeholder="1825-2023 : Rétrospective du Louvre"
                  value="${b.title}"
                  type="text"
                />
                ${other_error(errors, 'description', index, 'title')}
              </label>

              <label class="f-input__label f-input__label--full-width"
                ><span class="f-input__label--label">Organisateur de l'événement</span>
                <input
                  name="description[${index}][organizer]"
                  placeholder="Musée du Louvre"
                  class="f-input__text"
                  value="${b.organizer}"
                  type="text"
                />
                ${other_error(errors, 'description', index, 'organizer')}
              </label>

              <label class="f-input__label f-input__label--full-width"
                ><span class="f-input__label--label">Page web (doit inclure https:// ou http://)</span>
                <input
                  placeholder="https://www.louvre.fr/xyz"
                  name="description[${index}][url]"
                  class="f-input__text"
                  value="${b.url}"
                  type="url"
                />
                ${other_error(errors, 'description', index, 'url')}
              </label>

              <label class="f-input__label f-input__label--full-width"
                ><span class="f-input__label--label"
                  >Description de l'événement (les émojis et sauts de ligne seront automatiquement supprimés)</span
                >
                <textarea class="f-input__text" name="description[${index}][content]" rows="7">${b.content}</textarea>
                ${other_error(errors, 'description', index, 'content')}
              </label>

              <label class="f-input__label f-input__label--full-width"
                ><span class="f-input__label--label">Détails (ou mentions de bas de page)</span>
                <textarea class="f-input__text f-input__text--small" name="description[${index}][detail]" rows="5">
${b.detail}</textarea
                >
                ${other_error(errors, 'description', index, 'detail')}
              </label>

              <p class="f-remove-item" onclick="delete_node(this)">Supprimer</p>
            </div>
          `
				)}

        <div class="center-error">${get_error(errors, 'description')}</div>
        <p class="f-add-item" onclick="clone('description', 'reset')">Ajouter une description dans une autre langue</p>
        <!-- END: Event language-specific description -->

        <h1 class="f-title">Où se déroule l'événement ?</h1>

        <p class="f-text"><b>L'adresse</b> doit être renseignée dans la langue du pays où se déroule l'événement.</p>

        <div class="f-inputs__row">
          <label class="f-input__label">
            <span class="f-input__label--label">Rue</span>

            <input
              placeholder="1, rue de la République"
              class="f-input__text"
              value="${data.street}"
              name="street"
              type="text"
            />
            ${get_error(errors, 'street')}
          </label>

          <label class="f-input__label">
            <span class="f-input__label--label">Code postal</span>
            <input class="f-input__text" name="zipcode" type="text" value="${data.zipcode}" placeholder="75001" />
            ${get_error(errors, 'zipcode')}
          </label>

          <label class="f-input__label">
            <span class="f-input__label--label">Ville</span>
            <input class="f-input__text" name="city" type="text" value="${data.city}" placeholder="Paris" />
            ${get_error(errors, 'city')}
          </label>

          <label class="f-input__label">
            <span class="f-input__label--label">Pays</span>
            <select class="f-input__text" name="country">
              <option value="">?</option>
              ${COUNTRY.map(
								(iso) => html`<option value="${iso}" ${iso === data.country ? 'selected' : null}>${iso}</option> `
							)}
            </select>
            ${get_error(errors, 'country')}
          </label>
        </div>

        <p class="f-text">
          Les <b>coordonnées géographiques</b> doivent être renseignées selon le référentiel géodésique
          <code>WGS84</code>. Pour les obtenir, nous vous recommandons
          <a href="https://www.coordonnees-gps.fr/" target="_blank">ce site</a>. Attention à ne pas inverser longitude
          et latitude, et à utiliser un point pour marquer les décimales !
        </p>

        <div class="f-inputs__row">
          <label class="f-input__label">
            <span class="f-input__label--label">Latitude</span>

            <input
              placeholder="45.3857837"
              value="${data.latitude}"
              class="f-input__text"
              name="latitude"
              type="number"
              step="any"
            />
            ${get_error(errors, 'latitude')}
          </label>

          <label class="f-input__label">
            <span class="f-input__label--label">Longitude</span>
            <input
              placeholder="2.389271"
              value="${data.longitude}"
              class="f-input__text"
              name="longitude"
              type="number"
              step="any"
            />
            ${get_error(errors, 'longitude')}
          </label>
        </div>

        <p class="f-text">Dans quel <b>fuseau horaire</b> se déroule l'événement ?</p>

        <label class="f-input__label f-inputs__single">
          <span class="f-input__label--label">Fuseau horaire</span>

          <select class="f-input__text" name="timezone">
            <option value=""></option>
            ${TIMEZONE.map(
							(utc) => html`<option value="${utc}" ${utc === data.timezone ? 'selected' : null}>${utc}</option>`
						)}
          </select>
          ${get_error(errors, 'timezone')}
        </label>
        <!-- END: Event Location -->

        <!-- START: Event generic description -->
        <h1 class="f-title">Description générique</h1>

        <p class="f-text">De quel <b>type d'événement</b> s'agit-il ? 3 choix maximum.</p>

        <div class="f-cloud">
          ${await Promise.all(
						TYPE.map(
							async (type, index) =>
								html` <input
                    ${data?.type?.includes(type) ? 'checked' : null}
                    name="type[${index}]"
                    class="f-input__check"
                    type="checkbox"
                    value="${type}"
                    id="${type}"
                  />
                  <label class="f-input__checkbox" for="${type}">${await translate(type, 'enums', lang)}</label>`
						)
					)}
        </div>
        <div class="center-error">${get_error(errors, 'type')}</div>

        <p class="f-text">
          <b>Restriction liée à l'âge</b> - Quels âges minimum et maximum pour assister à l'événement ?
        </p>

        <div class="f-inputs__row">
          <label class="f-input__label"
            ><span class="f-input__label--label">Âge minimum</span>
            <input class="f-input__text" name="min_age" type="number" placeholder="0" value="${data.min_age}" />
            ${get_error(errors, 'min_age')}
          </label>

          <label class="f-input__label"
            ><span class="f-input__label--label">Âge maximum</span>
            <input class="f-input__text" name="max_age" type="number" placeholder="99" value="${data.max_age}" />
            ${get_error(errors, 'max_age')}
          </label>
        </div>

        <p class="f-text">
          <b>Personnalités associés à l'événement</b> - Vous pouvez renseigner ici les acteurs d'un film, les premiers
          rôles d'un ballet, le commissaire d'une exposition... S'il existe plusieurs graphies pour un même nom,
          n'hésitez pas à les inclure (ex : Tchaïkovski/y).
        </p>

        ${data.featuring?.map(
					(b, index: number) =>
						html` <div class="f-inputs__row" data-id="featuring">
              <label class="f-input__label"
                ><span class="f-input__label--label">Prénom</span>
                <input
                  class="f-input__text"
                  name="featuring[${index}][firstname]"
                  type="text"
                  value="${b.firstname}"
                  placeholder="Gustave"
                />
              </label>

              <label class="f-input__label"
                ><span class="f-input__label--label">Nom (ou nom d'artiste)</span>
                <input
                  class="f-input__text"
                  name="featuring[${index}][lastname]"
                  type="text"
                  value="${b.lastname}"
                  placeholder="Courbet"
                />
              </label>

              <p class="f-remove-item-cross" onclick="delete_node(this)">✕</p>
            </div>`
				)}

        <div class="center-error">${get_error(errors, 'featuring')}</div>

        <p class="f-add-item" onclick="clone('featuring', 'reset')">Ajouter une personnalité</p>
        <!-- END: Event generic description -->

        <!-- START: Event calendar -->
        <h1 class="f-title">Calendrier, tarification et accessibilité</h1>

        <p class="f-text">Dans quelle <b>devise</b> les tarifs sont-ils libellés ?</p>

        <label class="f-input__label f-inputs__single">
          <span class="f-input__label--label">Devise</span>

          <select class="f-input__text" name="currency">
            <option value=""></option>
            ${CURRENCY.map(
							(currency) =>
								html`<option value="${currency}" ${currency === data.currency ? 'selected' : null}>${currency}</option>`
						)}
          </select>
          ${get_error(errors, 'currency')}
        </label>

        <p class="f-text">Combien de <b>minutes</b> avant l'événement les portes ouvrent-elles ?</p>

        <label class="f-input__label f-inputs__single">
          <span class="f-input__label--label">Minutes</span>

          <input class="f-input__text" name="door_time" type="number" placeholder="30" value="${data.door_time}" />
          ${get_error(errors, 'door_time')}
        </label>

        <p class="f-text"><b>Quand</b> a lieu l'événement et quelles sont ses <b>caractéristiques</b> ?</p>

        ${
					data.calendar
						? await Promise.all(
								data.calendar.map(
									async (c, index: number) => html`
                  <div class="f-inputs__column" data-id="calendar">
                    <div class="f-inputs__row--calendar">
                      <label class="f-input__label"
                        ><span class="f-input__label--label">Début de l'événement</span>
                        <input
                          name="calendar[${index}][start]"
                          class="f-input__text"
                          type="datetime-local"
                          value="${c.start}"
                        />
                        ${other_error(errors, 'calendar', index, 'start')}
                      </label>

                      <label class="f-input__label"
                        ><span class="f-input__label--label">Fin de l'événement</span>
                        <input
                          name="calendar[${index}][end]"
                          class="f-input__text"
                          type="datetime-local"
                          value="${c.end}"
                        />
                        ${other_error(errors, 'calendar', index, 'end')}
                      </label>
                      &nbsp;&nbsp;&nbsp;
                      <label class="f-input__label"
                        ><span class="f-input__label--label">Prix adulte</span>
                        <input
                          name="calendar[${index}][adult_fee]"
                          value="${c.adult_fee}"
                          class="f-input__text"
                          style="width:100px"
                          placeholder="20"
                          type="number"
                          min="0"
                        />
                        ${other_error(errors, 'calendar', index, 'adult_fee')}
                      </label>

                      <label class="f-input__label"
                        ><span class="f-input__label--label">Prix enfant</span>
                        <input
                          name="calendar[${index}][child_fee]"
                          class="f-input__text"
                          value="${c.child_fee}"
                          style="width:100px"
                          placeholder="10"
                          type="number"
                          min="0"
                        />
                        ${other_error(errors, 'calendar', index, 'child_fee')}
                      </label>
                      &nbsp;&nbsp;&nbsp;
                      <label class="f-input__label"
                        ><span class="f-input__label--label">Langue audio</span>
                        <select class="f-input__text" name="calendar[${index}][audio_lang]">
                          <option value=""></option>
                          ${LANG.map(
														(lang) =>
															html` <option value="${lang}" ${lang === c.audio_lang ? 'selected' : null}>
                                ${lang}
                              </option>`
													)}
                        </select>
                        ${other_error(errors, 'calendar', index, 'audio_lang')}
                      </label>
                    </div>

                    <div class="f-features">
                      ${await Promise.all(
												FEATURE.map(
													async (feature, index2) =>
														html` <label class="f-feature">
                              <input
                                ${c.feature?.includes(feature) ? 'checked' : null}
                                name="calendar[${index}][feature][${index2}]"
                                value="${feature}"
                                type="checkbox"
                              />
                              <div>
                                <span>${await translate(feature, 'enums', lang)}</span>
                                <span>${await translate(`${feature}_definition`, 'app', lang)}</span>
                              </div>
                            </label>`
												)
											)}
                    </div>

                    <p class="f-remove-item" onclick="delete_node(this)">Supprimer</p>
                  </div>
                `
								)
						  )
						: null
				}

        <div class="center-error">${get_error(errors, 'calendar')}</div>
        <p class="f-add-item" onclick="clone('calendar', 'reset')">Ajouter une date</p>

        <!-- START: Booking -->
        <h1 class="f-title">Modalités de réservation</h1>

        <p class="f-text">La <b>réservation</b> est-elle obligatoire ?</p>

        <div class="f-cloud">
          ${await Promise.all(
						['true', 'false'].map(
							async (bool) =>
								html` <input
                    ${bool === String(data.mandatory_booking) ? 'checked' : null}
                    class="f-input__check"
                    name="mandatory_booking"
                    value="${bool}"
                    id="bm_${bool}"
                    type="radio"
                  />
                  <label for="bm_${bool}" class="f-input__checkbox">${await translate(bool, 'app', lang)}</label>`
						)
					)}
        </div>
        ${get_error(errors, 'mandatory_booking')}

        <p class="f-text"><b>Quand</b> les réservations débutent-elles ?</p>

        <label class="f-input__label f-inputs__single">
          <span class="f-input__label--label">Début des réservations</span>

          <input class="f-input__text" name="booking_start" type="datetime-local" value="${data.booking_start}" />
          ${get_error(errors, 'booking_start')}
        </label>

        <p class="f-text">
          Sur <b>quelles plateformes</b> et par <b>quels moyens</b> est-il possible de réserver ? Pour les liens
          internet, il faut inclure <code>https://www...</code>
        </p>

        ${
					data.booking_medium
						? await Promise.all(
								data.booking_medium?.map(
									async (b, index: number) =>
										html` <div class="f-inputs__row" data-id="booking">
                    <label class="f-input__label"
                      ><span class="f-input__label--label">Type</span>
                      <select class="f-input__text" name="booking_medium[${index}][type]">
                        <option value=""></option>
                        ${await Promise.all(
													BOOKING.map(
														async (t) =>
															html`<option value="${t}" ${t === b.type ? 'selected' : null}>
                                ${await translate(`booking_medium_${t}`, 'app', lang)}
                              </option> `
													)
												)}
                      </select>
                      ${other_error(errors, 'booking_medium', index, 'type')}
                    </label>

                    <label class="f-input__label"
                      ><span class="f-input__label--label">Contenu</span>
                      <input
                        name="booking_medium[${index}][data]"
                        class="f-input__text"
                        value="${b.data}"
                        type="text"
                      />
                      ${other_error(errors, 'booking_medium', index, 'data')}
                    </label>

                    <label class="f-input__label"
                      ><span class="f-input__label--label">Programme d'affiliation</span>
                      <select class="f-input__text" name="booking_medium[${index}][allows_affiliate_partnership]">
                        <option value=""></option>
                        ${await Promise.all(
													['true', 'false', 'null'].map(
														async (a) =>
															html`<option
                                value="${a}"
                                ${a === String(b.allows_affiliate_partnership) ? 'selected' : null}
                              >
                                ${await translate(`booking_medium_${a}`, 'app', lang)}
                              </option> `
													)
												)}
                      </select>
                    </label>

                    <p class="f-remove-item-cross" onclick="delete_node(this)">✕</p>
                  </div>`
								)
						  )
						: null
				}
        <div class="center-error">${get_error(errors, 'booking_medium')}</div>
        <p class="f-add-item" onclick="clone('booking', 'reset')">Ajouter une modalité de réservation</p>
        <!-- END: Booking -->

        <!-- START: Customer service -->
        <h1 class="f-title">Comment le public peut-il vous contacter ?</h1>

        <p class="f-text">
          <b>L'email</b> est celui auquel les publics peuvent vous contacter, peu importe la langue d'échange et le
          <b>téléphone</b> doit être correctement formaté et contenir l'extension internationale adéquate.
        </p>

        <div class="f-inputs__row">
          <label class="f-input__label">
            <span class="f-input__label--label">Email</span>
            <input
              placeholder="contact@jubilons.org"
              value="${data.support_email}"
              class="f-input__text"
              name="support_email"
              type="email"
            />
            ${get_error(errors, 'support_email')}
          </label>

          <label class="f-input__label">
            <span class="f-input__label--label">Téléphone (optionel)</span>
            <input
              placeholder="+33 (0)4 90 29 57 89"
              value="${data.support_phone}"
              class="f-input__text"
              name="support_phone"
              type="text"
            />
            ${get_error(errors, 'support_phone')}
          </label>
        </div>
        <!-- END: Customer service-->

        <!-- START: Illustration -->
        <h1 class="f-title">Illustrer votre événement</h1>

        <p class="f-text">
          <b>Choississez votre illustration.</b> Votre illustration sera automatiquement modifiée si elle n'est pas au
          bon format : 636x340px au format paysage.
        </p>

        <label class="f-inputs__single" id="image_url">
          <input class="f-image__upload" type="file" name="image_url" accept="image/*" />
          ${get_error(errors, 'image_url')}
        </label>
        ${does_image_exist ? html`<img src="${data.image_url}" class="f-image__display" alt="event image" />` : null}

        <p class="f-text">Avez-vous une <b>vidéo YouTube</b> qui illustre votre événement (optionnel) ?</p>

        <label class="f-input__label f-inputs__single">
          <span class="f-input__label--label">URL de la vidéo</span>

          <input
            class="f-input__text"
            style="width:340px"
            name="video_url"
            type="text"
            placeholder="https://www.youtube.com/watch?v=f7TCuxfEitw"
            value="${data.video_url}"
          />
          ${get_error(errors, 'video_url')}
        </label>

        <!-- END: Illustration -->

        <!-- START: Submit -->
        <h1 class="f-title">Tout est OK ?</h1>

        <div class="f-submit__buttons">
          ${
						data.status !== 'published'
							? html` <button class="f-submit__button" name="status" value="drafted" type="submit">
                <span class="show-when-enabled">
                  <span class="f-submit__button--big">Enregistrer comme brouillon</span>
                  <span class="f-submit__button--small">
                    Généralement, on enregistre en brouillon lorsque l'on souhaite effectuer une relecture plus tard ou
                    valider un élément avant la publication finale au monde entier.
                  </span>
                </span>
                <span class="show-when-disabled"></span>
              </button>`
							: null
					}

          <button class="f-submit__button" name="status" value="published" type="submit">
            <span class="show-when-enabled">
              <span class="f-submit__button--big">Publier au monde entier</span>
              <span class="f-submit__button--small"
                >Pas d'inquiétude, vous pourrez modifier ou supprimer l'événement à tout moment si nécessaire. Par
                contre, il vous sera impossible de le repasser en Brouillon.
              </span>
            </span>
            <span class="show-when-disabled"></span>
          </button>
        </div>
      </form>

      <script>
        // Remove node
        function delete_node(e) {
          var attr = e.parentNode.getAttribute('data-id')
          if (document.querySelectorAll('[data-id=' + attr + ']').length > 1) {
            e.parentNode.remove()
          }
        }

        // Clone node
        function clone(attr, reset) {
          var name = '[data-id=' + attr + ']'
          var name_selector = '[name^=' + attr + ']'

          // get nodes "description"
          var nodes = document.querySelectorAll(name)

          // et cloner le dernier
          var node = nodes[nodes.length - 1]
          var clone = node.cloneNode(true)

          var test = clone.querySelectorAll(name_selector)

          var input_errors = clone.getElementsByTagName('input-error')
          for (var i = 0; i < input_errors.length; i++) {
            input_errors[i].remove()
          }

          test.forEach(function (node, index) {
            var attr = node.getAttribute('name').replaceAll(']', '').split('[')
            attr[1] = Number(attr[1]) + 1

            var new_name = attr[0] + '[' + attr[1] + ']' + '[' + attr[2] + ']'
            if (attr[3]) new_name = new_name + '[' + attr[3] + ']'

            node.setAttribute('name', new_name)
            if (!node.matches('[type="checkbox"]')) node.value = ''
            node.checked = false
          })

          node.parentNode.insertBefore(clone, node.nextSibling)
        }
      </script>`
	)
