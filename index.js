// var html = require('bel')
// var morph = require('nanomorph')
var html = require('yo-yo')
var debounce = require('debounce')

module.exports = function infiniteElements (elements, options) {
  var rows = elements || []
  var containerHeight = options.height
  var rowHeight = options.rowHeight
  var renderTop = 0
  var renderBottom = 0
  var scrollTop = 0

  function render (rows) {
    var rowsToRender = fillRenderArea(rows)
    var tree = html`<div class="container" onscroll=${debounce(onscroll, 50)}>
      ${topRow()}
      ${rowsToRender}
      ${bottomRow()}
    </div>`

    tree.style.height = options.height + 'px'
    tree.style['overflow-y'] = 'scroll'

    var container = document.querySelector('.container')
    if (container) {
      // TODO: nanomorph needs node reordering before it can be used here
      // https://github.com/yoshuawuyts/nanomorph/issues/8

      // var tree = morph(container, tree)
      // document.body.replaceChild(container, tree)
      html.update(container, tree)
    }

    tree.render = render
    return tree
  }

  function topRow () {
    var row = html`<div></div>`
    row.style.height = (renderTop * rowHeight) + 'px'
    return row
  }

  function bottomRow () {
    var row = html`<div></div>`
    row.style.height = ((rows.length - renderBottom) * rowHeight) + 'px'
    return row
  }

  function onscroll () {
    scrollTop = this.scrollTop
    render(rows)
  }

  function fillRenderArea (rows) {
    var total = rows.length
    var rowsPerBody = Math.floor(containerHeight / rowHeight)
    renderTop = Math.round(Math.max(0, Math.floor(scrollTop / rowHeight) - rowsPerBody * 1.2))
    renderBottom = Math.round(Math.min(renderTop + 4 * rowsPerBody, total))
    var sliced = rows.slice(renderTop, renderBottom)
    return sliced
  }

  return render(rows)
}
