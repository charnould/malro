// import { beforeEach, afterEach, describe, afterAll, expect, it } from 'bun:test'
// import puppeteer from 'puppeteer'

// describe('Test index.html', async () => {
// const browser = await puppeteer.launch({
//   defaultViewport: null,
//   headless: false,
// })

// const page = await browser.newPage()

// it('test 1', async () => {
// const browser = await puppeteer.launch({
//   defaultViewport: {
//     height: 1024,
//     width: 1200,
//   },
//   args: [`--window-size=1200,1024`],
//   headless: false,
// })
// const page = await browser.newPage()

// await page.goto('http://localhost:3000/')
// await page.type('input[type="email"]', 'test@icloud.com')

// console.log(page.url())

// // await page
// //   .click('p > a')
// //   .then((x) => console.log(x))
// //   .catch((e) => console.log(e))
// await page.waitForTimeout(4000)
// await browser.close()

//     expect(1).toBe(1)
//   })
// })
