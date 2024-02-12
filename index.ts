// import { secureHeaders } from 'hono/secure-headers'
import { serveStatic } from 'hono/bun'
import { Hono } from 'hono'

import { controller as save_settings } from './controllers/POST.settings'
import { controller as get_dashboard } from './controllers/GET.dashboard'
import { controller as get_settings } from './controllers/GET.settings'
import { controller as run_auto_tasks } from './controllers/POST.robot'
import { controller as get_policies } from './controllers/GET.policies'
import { controller as get_ical_event } from './controllers/GET.ical'
import { controller as save_article } from './controllers/POST.form'
import { controller as post_embed } from './controllers/POST.embed'
import { controller as get_index } from './controllers/GET.index'
import { controller as get_token } from './controllers/GET.token'
import { controller as get_events } from './controllers/GET.sql'
import { controller as get_form } from './controllers/GET.form'
import { controller as index } from './controllers/POST.index'
import { is_setup, is_auth } from './helpers/auth'
import { translate_in } from './helpers/translate'
import { launch_cronjobs } from './helpers/cron'

launch_cronjobs()

const app = new Hono()

// Serve static files
// BTW, `datastore` is a Docker Volume (see kamal.yaml)
app.use('/datastore/archives/*', serveStatic({ root: './' }))
app.use('/datastore/images/*', serveStatic({ root: './' }))
app.use('/assets/*', serveStatic({ root: './' }))

// Routes
// app.get('*', secureHeaders())

app.get('/ical/:event/:calendar_index', get_ical_event)
app.get('/sql/:sql', translate_in, get_events)
app.get('/', translate_in, get_index)
app.get('/policies', get_policies)
app.get('/token', get_token)

app.post('/', translate_in, index)
app.post('/robot', run_auto_tasks)
app.post('/embed', post_embed)

app.get('/dashboard', is_auth, is_setup, get_dashboard)
app.get('/:kind/:id/edit', is_auth, get_form)
app.get('/settings', is_auth, get_settings)

app.post('/:kind/:id/edit', is_auth, save_article)
app.post('/settings', is_auth, save_settings)

app.onError((err, c) => {
	console.error(err)
	return c.redirect('/')
})

export default app
