import { type BunFile, file, env } from 'bun'
import { raw } from 'hono/html'

// A simple function to "internalize" css styles into widget html view.
// It allows to save a request and get a better lighthouse score!
export const internalize_css = async (stylesheet: string) => {
	let css: BunFile
	if (env.NODE_ENV === 'production') {
		css = file(`./assets/css/dist/${stylesheet}.css`)
	} else {
		css = file(`./assets/css/src/${stylesheet}.css`)
	}
	return raw(await css.text())
}
