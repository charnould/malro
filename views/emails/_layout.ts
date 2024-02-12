import { html } from 'hono/html'

export const layout = (body: string) => {
	return html`<html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <style>
        body {
          font-family: sans-serif;
          max-width: 550px;
        }
        small {
          line-height: 1.3;
          color: rgb(170, 170, 170);
          font-size: 13px;
        }
        p {
          font-size: 17px;
          line-height: 1.5;
          margin-bottom: 4px;
        }
      </style>
    </head>
    <body>
      ${body}
      <small>―<br />This email has been automatically generated.</small>
    </body>
  </html>`
}
