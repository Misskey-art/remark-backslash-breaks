'use strict'

const visit = require('unist-util-visit')

const findEol = /\s*\\(?:\r?\n|\r)/g

module.exports = () => (tree) => {
  visit(tree, 'paragraph', (node) => {
    visit(node, 'text', (textNode, index, parent) => {
      const result = []
      let start = 0

      let match = findEol.exec(textNode.value)

      while (match) {
        const position = match.index

        if (start !== position) {
          result.push({
            type: 'text',
            value: textNode.value.slice(start, position),
          })
        }

        result.push({ type: 'break' })
        start = position + match[0].length
        match = findEol.exec(textNode.value)
      }

      if (result.length > 0 && parent && typeof index === 'number') {
        if (start < textNode.value.length) {
          result.push({ type: 'text', value: textNode.value.slice(start) })
        }

        parent.children.splice(index, 1, ...result)
        return index + result.length
      }
    })
  })
}
