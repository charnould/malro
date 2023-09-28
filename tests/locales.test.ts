/* eslint-disable @typescript-eslint/no-misused-promises */

import { expect, it } from 'bun:test'
import { readdirSync } from 'node:fs'
import { file } from 'bun'

import { FEATURE } from '../enums/feature'
import { TYPE } from '../enums/type'

// Except for `enums` translations, check if translation files
// contain mandatory keys and are coherent
//
// For each folder/directory containing localizations files
for (const dir of ['widget', 'index', 'app']) {
  const files = readdirSync(`./locales/${dir}/`)

  // Considering the english file (en.json) as a reference
  // (hence this file must be manually double-checked!)...
  const reference = await file(`./locales/${dir}/en.json`).json()

  // and for each file of this directory/folder
  await Promise.all(
    files.map(async (f) => {
      const locales = await file(`./locales/${dir}/${f}`).json()
      const number_of_strings = Object.keys(reference).length

      // check in other translations files (e.g. fr.json)
      // ...if it contains the same number of keys
      it(`${dir}/${f}: should contain ${number_of_strings} translations`, () => {
        expect(Object.keys(locales).length).toBe(number_of_strings)
      })

      for (const [key, value] of Object.entries(locales)) {
        // ...if keys are named the same way
        it(`${dir}/${f}[${key}] key should exist`, () => {
          expect(Object.keys(reference).includes(key)).toBe(true)
        })

        // ...if the value of these keys seems relevant
        it(`${dir}/${f}[${key}] value should be ok`, () => {
          expect(value.length).toBeGreaterThan(1)
          expect(value).not.toStartWith(' ')
          expect(value).not.toEndWith(' ')
          expect(value).not.toBeNull()
          expect(value).not.toBe(' ')
        })
      }
    })
  )
}

// Only for `enums` translations, check if translation files
// contain mandatory keys and are coherent
// TODO: factorize this test with the former
//
const files = readdirSync('./locales/enums/')

// For each file of `enums` folder
await Promise.all(
  files.map(async (f) => {
    const translated_enums = await file(`./locales/enums/${f}`).json()
    // check...
    // ...if there are as many keys in translation files as there are in ENUMS file
    const number_of_enums = Object.keys(TYPE).length + Object.keys(FEATURE).length
    it(`enums/${f}: should contain ${number_of_enums} translations`, () => {
      expect(Object.keys(translated_enums).length).toBe(number_of_enums)
    })

    for (const [key, value] of Object.entries(translated_enums)) {
      // ...if keys are named the same way
      it(`enums/${f}[${key}] key should exist`, () => {
        expect(Object.values(TYPE).includes(key) || Object.values(FEATURE).includes(key)).toBe(true)
      })

      // ...if the value of these keys seems relevant
      it(`enums/${f}[${key}] should be ok`, () => {
        expect(value.length).toBeGreaterThan(1)
        expect(value).not.toStartWith(' ')
        expect(value).not.toEndWith(' ')
        expect(value).not.toBeNull()
        expect(value).not.toBe(' ')
      })
    }
  })
)
