import { html } from 'hono/html'
import { env } from 'bun'

import { Message } from '../controllers/POST.index'
import { translate } from '../helpers/translate'
import { layout } from '../views/_layout'
import { Options } from '../schema/api'

export const view = async (lang: string, message?: Message, options?: Options) =>
	layout(html`
    <div class="i-background">
      <p class="i-notification">${await translate('028', 'index', lang)}</p>

      <script>
        function check_query() {
          var link = document.querySelector('#embed-button')
          var check = document.createElement('input')
          check.className = 'i-embed__button'
          check.type = 'submit'
          check.value = 'Check'
          link.parentNode.replaceChild(check, link)
        }
      </script>

      <div class="i-header">
        <nav class="i-nav">
          <p class="i-logo">MALRO</p>
          <p class="i-nav__text">${await translate('001', 'index', lang)}</p>
        </nav>
        <nav class="i-nav">
          <a class="i-nav__link" href="${env.BASE_URL}?lang=fr">fr</a>
          <a class="i-nav__link" href="${env.BASE_URL}?lang=en">en</a>
          <p class="i-nav__text">·</p>
          <a class="i-nav__link" target="_blank" href="https://github.com/charnould/malro">GitHub</a>
        </nav>
      </div>

      <h1 class="i-headlines__title">${await translate('002', 'index', lang)}</h1>
      <h2 class="i-headlines__subtitle">${await translate('003', 'index', lang)}</h2>

      <form class="i-signup" method="post" action="/" enctype="multipart/form-data">
        <input
          placeholder="${await translate('email_placeholder', 'index', lang)}"
          class="i-signup__input"
          autocomplete="email"
          name="email"
          type="email"
          id="email"
          required
        />
        <input class="i-signup__submit" type="submit" value="${await translate('call_to_action', 'index', lang)}" />
      </form>

      ${
				message === Message.check_mailbox
					? html`<p class="i-signup__message i-signup__message--ok">
            ${await translate('check_mailbox', 'index', lang)}
          </p>`
					: message === Message.banned_domain
					  ? html`<p class="i-signup__message i-signup__message--ko">
              ${await translate('banned_domain', 'index', lang)}
            </p>`
					  : html`<p class="i-signup__message">&nbsp;</p>`
			}

      <div class="i-benefits">
        <p class="i-benefits__item">${await translate('004', 'index', lang)}</p>
        <p class="i-benefits__item">${await translate('005', 'index', lang)}</p>
      </div>

      <div class="i-hero">
        <iframe
          src="${env.BASE_URL}/sql/select * from events where status = 'published' order by random() limit 1?format=json"
          title="MALRO json data"
          frameborder="0"
          loading="lazy"
          height="400"
          width="330"
        >
        </iframe>

        <iframe
          src="${env.BASE_URL}/sql/select%20*,%20min(start)%20as%20next%20from%20calendar%20inner%20join%20events%20using%20(id)%20where%20status='published'%20and%20calendar.start%3Estrftime('%25Y-%25m-%25d',%20'now')%20group%20by%20id%20order%20by%20random()%20limit%201?embed=true"
          title="MALRO event"
          frameborder="0"
          loading="lazy"
          scrolling="no"
          height="460"
          width="330"
        ></iframe>

        <iframe
          src="${env.BASE_URL}/sql/select * from events where status = 'published' order by random() limit 1?format=json"
          title="MALRO json data"
          frameborder="0"
          loading="lazy"
          height="400"
          width="330"
        >
        </iframe>

        <iframe
          src="${env.BASE_URL}/sql/select%20*,%20min(start)%20as%20next%20from%20calendar%20inner%20join%20events%20using%20(id)%20where%20status='published'%20and%20calendar.start%3Estrftime('%25Y-%25m-%25d',%20'now')%20group%20by%20id%20order%20by%20random()%20limit%201?embed=true"
          title="MALRO event"
          frameborder="0"
          loading="lazy"
          scrolling="no"
          height="460"
          width="330"
        ></iframe>
      </div>

      <hr class="i-separator" />
      <h1 class="i-title">${await translate('006', 'index', lang)}</h1>
      <p class="i-text">${await translate('007', 'index', lang)}</p>
      <p class="i-text">${await translate('008', 'index', lang)}</p>
      <p class="i-text">${await translate('009', 'index', lang)}</p>
      <p class="i-text">${await translate('010', 'index', lang)}</p>
      <p class="i-text">${await translate('011', 'index', lang)}</p>

      <hr class="i-separator" />
      <h1 class="i-title">${await translate('012', 'index', lang)}</h1>
      <p class="i-subtitle">${await translate('013', 'index', lang)}</p>
      <p class="i-text">${await translate('014', 'index', lang)}</p>
      <p class="i-subtitle">${await translate('015', 'index', lang)}</p>
      <p class="i-text">${await translate('016', 'index', lang)}</p>
      <p class="i-subtitle">${await translate('017', 'index', lang)}</p>
      <p class="i-text">${await translate('018', 'index', lang)}</p>
      <p class="i-subtitle">${await translate('019', 'index', lang)}</p>
      <p class="i-text">${await translate('020', 'index', lang)}</p>

      <hr class="i-separator" />
      <h1 class="i-title" id="embed">${await translate('021', 'index', lang)}</h1>
      <p class="i-text">${await translate('022', 'index', lang)}</p>

      <form method="post" action="/embed" enctype="multipart/form-data" data-turbo="false">
        <ul class="i-examples">
          <li>
            <button class="i-example" name="example" value="1" type="submit">
              ${await translate('024', 'index', lang)}
            </button>
          </li>
          <li>
            <button class="i-example" name="example" value="2" type="submit">
              ${await translate('025', 'index', lang)}
            </button>
          </li>
          <li>
            <button class="i-example" name="example" value="3" type="submit">
              ${await translate('026', 'index', lang)}
            </button>
          </li>
          <li>
            <button class="i-example" name="example" value="4" type="submit">
              ${await translate('027', 'index', lang)}
            </button>
          </li>
        </ul>

        <p class="i-text">${await translate('023', 'index', lang)}</p>

        <textarea
          placeholder="SELECT&#10;  *&#10;FROM&#10;  events&#10;  INNER JOIN calendar USING (id)&#10;WHERE&#10;  status = 'published'&#10;  AND calendar.start > STRFTIME('%Y-%m-%dT%H:%M', 'now')&#10;GROUP BY&#10;  id&#10;LIMIT&#10;  10"
          onkeydown="check_query()"
          spellcheck="false"
          name="query"
          class="${
						options?.is_valid === undefined
							? 'i-embed'
							: options?.is_valid === true
							  ? 'i-embed i-embed--valid'
							  : 'i-embed i-embed--invalid'
					}"
        >
${options?.display_formatted_query}</textarea
        >

        ${
					options?.is_valid === true
						? html`<a id="embed-button" class="i-embed__button" href="${options?.html_link}" target="_blank">Embed 🎉</a>`
						: html`<input class="i-embed__button" type="submit" value="Check" />`
				}
      </form>

      <hr class="i-separator" />
      <p class="i-footer">
        MALRO is a tribute to the Decree of July 24, 1959, written by André Malraux, which gives the newly created
        French Ministry of Culture the mission to make accessible the capital works of humanity to the greatest possible
        number and ensure the largest audience for cultural heritage.
      </p>
      <p class="i-footer">
        Except as otherwise noted, content of MALRO GitHub repos and websites are licensed under the
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a> and code under the
        <a href="https://github.com/charnould/malro/blob/main/license.md" target="_blank">MIT</a>.
      </p>
      <p class="i-footer">
        MALRO is open source and hosted in the EU on a VPS. See something that's wrong or unclear?
        <a href="https://github.com/charnould/malro" target="_blank">Submit a pull request.</a>
      </p>
      <p class="i-footer">
        Copyright (c) 2023-present, Charles-Henri Arnould · <a href="mailto:info@malro.org">info@malro.org</a> ·
        <a href="/policies">Legal</a> (EN) · <a href="https://github.com/charnould/malro" target="_blank">GitHub</a>
      </p>
    </div>
  `)
