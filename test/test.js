'use strict'

const unified = require('unified')
const fs = require('fs')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')

const plugin = require('../src')

const doc = fs.readFileSync('./test/fixture.md', 'utf8')

const result = unified()
.use(markdown)
.use(plugin)
.use(remark2rehype)
.use(html)
.processSync(doc)

test('backslash to <br>', () => {
  expect(result.contents).toContain('first line<br>')
})
test('not replace the backslash in the last line of a paragraph', () => {
  expect(result.contents).toContain('last line\\</p>')
})
