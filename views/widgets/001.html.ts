import { html, raw } from 'hono/html'
import { env } from 'bun'

import { internalize_css } from '../../helpers/internalize_css'
import { iframe_video } from '../../helpers/iframe_video'
import { translate } from '../../helpers/translate'
import { Event } from '../../schema/event'
import { Options } from '../../schema/api'

//
//
//
//
// prettier-ignore
export const view = async (data: Event[], options: Options) => html`
  <!doctype html>
  <html lang=${options.lang}>

    <head>
      <link rel="icon" href="data:," />
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="description" content="${data[0].description[0].title} (${data[0].description[0].organizer})${data.length >= 2 ? '...' : null}" />
      <meta property="og:description" content="${data[0].description[0].title} (${data[0].description[0].organizer})${data.length >= 2 ? '...' : null}" />
      <meta property="og:title" content="${data[0].description[0].title}${data.length >= 2 ? '...' : null}" />
      <meta property="og:image" content="${data[0].image_url}" />
      <meta property="og:url" content="${options.html_link}" />
      <meta property="og:type" content="website" />
      <title>${data[0].description[0].title}${data.length >= 2 ? '...' : null}</title>
      <style>${await internalize_css('w001')}</style>
      <script defer data-domain="malro.org" src="https://plausible.io/js/script.js"></script>
    </head>
    
    <body ${options.embed === true ? null : 'class=padded'}>
    
      ${data.length === 1 ? null : html`${await build_sharing_links(options)}`}

      ${await Promise.all(data.map(async (e) => html`
      <div class="card">

        ${e.video_url !== null
          ? html`<div class="photo">${raw(iframe_video(e.video_url))}</div>`
          : html`<img class="photo" src="${e.image_url}" loading="lazy" height="170" width="318" alt="malro.org"/>`}
        
        <div class="content">${e.status === 'trashed' ? html`<p class="danger">${await translate('trash', 'widget', options.lang)}</p>`  : null}
          <p class="organizer">${e.description[0].organizer}</p>
          <p class="address">${e.street} · ${e.city} (${e.zipcode})</p>
          <p class="title">${e.description[0].title}</p>
          <p class="tags">${await Promise.all(e.type.map(async (t) => html`<span>${await translate(t, 'enums', options.lang)}</span>`))}</p>
        
          <div class="calendar-table">
          ${await Promise.all(e.calendar.slice(0, 5).map(async (ts) => html`
          <a class="calendar-row" href="/ical/${e.id}/${ts.index}" download="event">
            <span>${new Intl.DateTimeFormat(options.lang, { weekday: 'short' }).format(new Date(ts.start))}</span>
            <span>${new Intl.DateTimeFormat(options.lang, { month: 'short', day: '2-digit' }).format(new Date(ts.start))}</span>
            <span>${new Intl.DateTimeFormat(options.lang, { minute: '2-digit', hour: '2-digit', hour12: false }).format(new Date(ts.start))} &rarr; ${new Intl.DateTimeFormat(options.lang, { minute: '2-digit', hour: '2-digit', hour12: false}).format(new Date(ts.end))}</span>
            <span>€</span>
            <span>${ts.adult_fee}</span>
            <span>(${await translate('child', 'widget', options.lang)} ${ts.child_fee})</span>
          </a>`))}
        </div>
        
          <p class="paragraph"><b>${await translate('about', 'widget', options.lang)}</b> ― ${e.description[0].content}</p>
          ${raw(await build_booking(e, options))}
          <p class="paragraph paragraph--small">${e.description[0]?.detail}</p>
        </div>
        <div class="footer">
          <p><a href="${e.description[0].url}/?utm_source=malro.org" target="_blank">${await translate('info', 'widget', options.lang)}</a> &nbsp; <a href="${env.BASE_URL}/sql/select%20*%20from%20events%20where%20id='${e.id}'" target="_blank">${await translate('share', 'widget', options.lang)}</a></p>
          <p><a href="${env.BASE_URL}/sql/select%20*%20from%20events%20where%20id='${e.id}'?format=json" target="_blank">Open data</a> by <a href="${env.BASE_URL}?utm_source=malro_widget" target="_blank">MALRO</a></p>
        </div>
      </div>`))}

      ${data.length === 1 ? html`${await build_sharing_links(options)}` : null}

    </body>
  </html>`

//
//
//
//
// Build sharing links
export const build_sharing_links = async (options: Options) =>
  html`${options.embed === true
    ? null
    : html` <div class="links">
        ${options.referral !== null ? raw(options.referral) : null}
        <div>
          <p>${await translate('share_with', 'widget', options.lang)}</p>
          <div contenteditable spellcheck="false">${options.html_link}</div>
        </div>
        <div>
          <p>${await translate('embed_with', 'widget', options.lang)}</p>
          <div contenteditable spellcheck="false">${options.embed_code}</div>
        </div>
        <div>
          <p>${await translate('get_raw_data', 'widget', options.lang)}</p>
          <div contenteditable spellcheck="false">${options.json_link}</div>
        </div>
      </div>`}`

//
//
//
//
// Build booking stuff
export const build_booking = async (e: Event, options: Options) => {
  const output = []
  if (e.booking_medium !== null) {
    for (const b of e.booking_medium) {
      if (b.type === 'url') {
        const url = new URL(b.data)
        const domain = url.hostname.replace(/^[^.]+\./g, '')
        output.push(`<a href="${b.data}" target="_blank">${domain}</a>`)
      }
      if (b.type === 'email') output.push(`<a href="mailto:${b.data}">${b.data}</a>`)
      if (b.type === 'phone') output.push(`<a href="tel:${b.data}" data-type="phone">${b.data}</a>`)
      if (b.type === 'string') output.push(`${b.data}`)
    }
  }
  const result = `<p class="paragraph"><b>${
    e.mandatory_booking === true
      ? await translate('mandatory_booking', 'widget', options.lang)
      : await translate('booking', 'widget', options.lang)
  }</b> ― ${output.join(', ') + '.'}`
  return result
}
