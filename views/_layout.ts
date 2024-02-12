import { html } from 'hono/html'
import { env } from 'bun'

export const layout = (body: string) => {
	return html` <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        <meta
          name="description"
          content="MALRO (pronounced /mal-ROH/) lets cultural operators publish freely, quickly, once, worldwide and in an open way their events (while staying forever in full control), and developers freely consume these data to build innovative services."
        />
        <meta
          property="og:description"
          content="MALRO (pronounced /mal-ROH/) lets cultural operators publish freely, quickly, once, worldwide and in an open way their events (while staying forever in full control), and developers freely consume these data to build innovative services."
        />
        <title>MALRO — Making Cultural Event Data Universally Accessible</title>
        <meta property="og:title" content="MALRO — Making Cultural Event Data Universally Accessible" />
        <meta property="og:image" content="${env.BASE_URL}/assets/malro.webp" />
        <meta property="og:url" content="https://www.malro.org" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#1D2D35" />
        <link rel="icon" href="data:," />
        <style>
          @font-face {
            font-family: 'Inter';
            font-weight: 100 900;
            font-display: swap;
            font-style: normal;
            font-named-instance: 'Regular';
            src: url('/assets/font/Inter.woff2') format('woff2');
          }
        </style>
        <script defer src="/assets/js/turbo.js"></script>
        ${
					env.NODE_ENV === 'production'
						? html`<link href="/assets/css/dist/app.css" rel="stylesheet" />`
						: html`<link href="/assets/css/src/app.css" rel="stylesheet" />`
				}
        <script defer data-domain="malro.org" src="https://plausible.io/js/script.js"></script>
      </head>
      <body>
        ${body}
      </body>
    </html>`
}
