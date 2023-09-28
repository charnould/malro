import { setCookie } from 'hono/cookie'
import { Context } from 'hono'

import { mount_db, DB } from '../helpers/database'
import { build_options } from '../helpers/embed'
import { Options } from '../schema/api'

const db = mount_db(DB.events, { readonly: true })

export const controller = async (c: Context) => {
  try {
    const body = await c.req.parseBody()

    const opts = {
      query: body.query === '' ? null : (body.query as string),
      origin: body.example ? 'example' : 'embed',
      display_formatted_query: null,
      lang: c.get('lang') as string,
      embed_code: null,
      html_link: null,
      json_link: null,
      format: 'html',
      embed: false
    }

    if (body.example) {
      switch (body.example) {
        case '1':
          opts.query = `  SELECT    *, MIN(start) AS next
                          FROM      calendar
                          INNER     JOIN events USING (id)
                          INNER     JOIN linked_to USING (id)
                          WHERE     status = 'published'
                          AND       linked_to.domain = 'jubilons.org'
                          AND       calendar.start > STRFTIME('%Y-%m-%d', 'now')
                          GROUP BY  id
                          ORDER BY  next`
          break

        case '2':
          opts.query = `  SELECT    *
                          FROM      events
                          INNER     JOIN calendar USING (id)
                          WHERE     status = 'published'
                          AND       longitude > 4.207327530737112
                          AND       longitude < 4.397742469262887
                          AND       latitude > 45.016154954954956
                          AND       latitude < 45.10624504504504
                          AND       calendar.start > STRFTIME('%Y-%m-%dT%H:%M', 'now')
                          GROUP BY  id
                          LIMIT     50`
          break

        case '3':
          opts.query = `  SELECT    *
                          FROM      events
                          INNER     JOIN calendar USING (id)
                          WHERE     status = 'published'
                          AND       type LIKE '%concert%'
                          AND       calendar.adult_fee < 25
                          AND       calendar.start > STRFTIME('%Y-%m-%dT%H:%M', 'now')
                          AND       longitude > 4.207327530737112
                          AND       longitude < 4.397742469262887
                          AND       latitude > 45.016154954954956
                          AND       latitude < 45.10624504504504
                          GROUP BY  id
                          LIMIT     1`
          break

        case '4':
          opts.query = `  SELECT    *
                          FROM      events
                          INNER     JOIN calendar USING (id)
                          WHERE     status = 'published'
                          AND       country = "FR"
                          AND       zipcode = "84140"
                          AND       calendar.feature LIKE '%relax%'
                          AND       calendar.start > STRFTIME('%Y-%m-%dT%H:%M', 'now')
                          GROUP BY  id`
          break
      }
    }

    const options: Options = build_options(opts)

    try {
      db.query(options.query!).run()
      options.is_valid = true
    } catch {
      options.is_valid = false
    }

    setCookie(c, 'malro_embed', JSON.stringify(options))
    return c.redirect('/#embed')
  } catch (e) {
    console.log(e)
    return c.redirect('/')
  }
}
