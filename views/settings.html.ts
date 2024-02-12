import { html } from 'hono/html'

import { layout } from '../views/_layout'
import { User } from '../schema/user'

export const view = (user: User, users: User[], need_setup: boolean, can_delete_own_account: boolean) =>
	layout(html`
    <a class="s-back" href="./dashboard">← Tableau de bord</a>

    ${
			need_setup
				? null
				: html`
          <div class="s-setting">
            <div class="s-setting__header">
              <p class="s-header__title">S'associer à un événement-tiers</p>
              <form method="post" action="./settings?action=link_to_an_event" enctype="multipart/form-data">
                <input
                  placeholder="6053cfa4-7bbc-4994-9b8c-3d4b67e48652"
                  class="s-header__input"
                  name="event_id"
                  type="text"
                  required
                />
                <input class="s-header__submit" type="submit" value="Ajouter" />
              </form>
            </div>
            <p class="s-setting__text">
              Si <span class="s-domain">${users[0].domain}</span> souhaite publier un événement (ex : un concert de
              piano) qui <b>a déjà été publié</b> sur MALRO par <b>une autre organisation</b> (ex : le pianiste), vous
              pouvez associer cet événement aux vôtres grâce à son identifiant (disponible sur le tableau de bord de
              <b>cette organisation</b>).
            </p>
            <p class="s-setting__text">
              Vous pouvez vous dissocier d'un événément à tout moment depuis votre tableau de bord.
            </p>
          </div>
        `
		}
    ${
			need_setup
				? null
				: html`
          <div class="s-setting">
            <div class="s-setting__header">
              <p class="s-header__title">Modifier les utilisateurs</p>
              <form method="post" action="./settings?action=add_user" enctype="multipart/form-data">
                <input
                  placeholder="email@${users[0].domain}"
                  pattern=".+@${users[0].domain}"
                  class="s-header__input"
                  name="email"
                  type="email"
                  required
                />
                <input class="s-header__submit" type="submit" value="Ajouter" />
              </form>
            </div>
            <p class="s-setting__text">
              Un administrateur est le seul à pouvoir donner accès à MALRO à d'autres utilisateurs, lui accorder ou non
              des droits administrateur et supprimer le compte de votre organisation.
            </p>
            <br />

            <form method="post" enctype="multipart/form-data">
              ${users.map((u) => {
								return html`
                  <div class="s-user">
                    <p class="s-user__text">${u.email}</p>

                    <button
                      class="s-switch ${u.is_admin === 'true' ? 's-switch--on' : null}"
                      formaction="./settings?action=change_admin_status"
                      ${user.email === u.email ? 'disabled' : null}
                      value="${u.email}"
                      type="submit"
                      name="email"
                    >
                      administrateur
                    </button>

                    ${
											user.email !== u.email
												? html`<button
                          formaction="./settings?action=remove_user"
                          value="${u.email}"
                          class="s-button"
                          name="email"
                          type="submit"
                        >
                          ✕&nbsp; supprimer
                        </button>`
												: null
										}
                  </div>
                `
							})}
            </form>
          </div>
        `
		}

    <!--  -->
    <div class="s-setting">
      <div class="s-setting__header">
        <p class="s-header__title">Choisir la langue de l'interface</p>
        <form method="post" action="./settings?action=change_lang" enctype="multipart/form-data">
          <button type="submit" name="lang" value="fr" class="s-button">français</button>
          <!-- <button type="submit" name="lang" value="en" class="s-button">english</button> -->
        </form>
      </div>
    </div>

    ${
			need_setup
				? null
				: html`
          <form class="s-setting" method="post" enctype="multipart/form-data">
            <div class="s-setting__header">
              <p class="s-header__title">Se déconnecter</p>
              <input
                formaction="./settings?action=logout"
                value="Se déconnecter"
                class="s-header__submit"
                type="submit"
                name="email"
              />
            </div>
          </form>
        `
		}

    <!--  -->
    ${
			need_setup
				? null
				: html`
          ${
						can_delete_own_account
							? html`
                <form class="s-setting s-setting--danger" method="post" enctype="multipart/form-data">
                  <div class="s-setting__header">
                    <p class="s-header__title">Supprimer <span class="s-domain">${user.email}</span></p>
                    <button
                      class="s-header__submit s-header__submit--danger"
                      formaction="./settings?action=remove_user"
                      name="email"
                      value="self"
                    >
                      Supprimer votre compte
                    </button>
                  </div>
                  <p class="s-setting__text">
                    Uniquement votre compte-utilisateur sera supprimé. Tous les autres comptes-utilisateurs, ainsi que
                    tous les événements publiés par votre organisation seront conservés intacts. Vous pourrez créer un
                    nouveau compte à tout moment avec l'accord d'un administrateur.
                  </p>
                </form>
              `
							: null
					}

          <!--  -->
          ${
						user.is_admin === 'true'
							? html`
                <form class="s-setting s-setting--danger" method="post" enctype="multipart/form-data">
                  <div class="s-setting__header">
                    <p class="s-header__title">Archiver <span class="s-domain">${user.domain}</span></p>
                    <button
                      class="s-header__submit s-header__submit--danger"
                      formaction="./settings?action=archive_organization"
                    >
                      Archiver votre organisation
                    </button>
                  </div>
                  <p class="s-setting__text">
                    L'intégralité des utilisateurs et brouillons sera supprimée. Tous les événements passés de votre
                    organisation seront conservés et resteront accessibles en open data. Les événements en cours et à
                    venir seront supprimés. Vous pourrez recréer un compte à tout moment.
                  </p>
                  <p class="s-setting__text">
                    Généralement, il convient d'archiver <span class="s-domain">${user.domain}</span> lorsque son
                    activité prend fin.
                  </p>
                </form>
                <form class="s-setting s-setting--danger" method="post" enctype="multipart/form-data">
                  <div class="s-setting__header">
                    <p class="s-header__title">Supprimer <span class="s-domain">${user.domain}</span></p>
                    <button
                      class="s-header__submit s-header__submit--danger"
                      formaction="./settings?action=trash_organization"
                    >
                      Supprimer votre organisation
                    </button>
                  </div>
                  <p class="s-setting__text">
                    L'intégralité des utilisateurs, brouillons et événements associés à votre organisation sera
                    supprimée. Comme si votre organisation n'avait jamais utilisé MALRO. Vous pourrez recréer un compte
                    pour votre organisation à tout moment.
                  </p>
                </form>
              `
							: null
					}
        `
		}
  `)
