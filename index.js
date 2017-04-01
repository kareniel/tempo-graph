const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.route('/', mainView)
app.use(store)

app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <div id="tempo-graph">
        ${yAxis(state, emit)}
        ${graph(state, emit)}
      </div>
    </body>
  `
}

function graph (state, emit) {
  const {gridWidth, gridHeight, yAxisWidth} = state.config

  return html`
    <div>
      ${state.nodes.map(node => html`
        <div 
          onmousedown=${onMouseDown}
          class="node" 
          style="left: ${(node.x * gridWidth) + yAxisWidth}px; bottom: ${(node.y * gridHeight) + 10}px">
        </div>
      `)}
    </div>
  `
  function onMouseDown (e) {
    e.preventDefault()
    document.addEventListener('mousemove', onDragStart)

    function onDragStart (e) {
      e.preventDefault()
      document.removeEventListener('mousemove', onDragStart)
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onDragEnd)
    }

    function onDrag (e) {
      e.preventDefault()
    }

    function onDragEnd (e) {
      document.removeEventListener('mouseup', onDragEnd)
    }
  }
}

function yAxis (state, emit) {
  const values = [114, 116, 118, 120, 122, 124, 126, 128, 130].reverse()

  return html `
    <div id="y-axis">
      ${values.map((value, index) => html`
        <p class="tick">${value}</p>
      `)}
    </div>
  `
}

function store (state, emitter) {
  state.config = {
    gridWidth: 100,
    gridHeight: 50,
    yAxisWidth: 70 
  }

  state.nodes = [
    {x: 0, y: 3},
    {x: 1, y: 4},
    {x: 2, y: 5},
    {x: 3, y: 6},
    {x: 4, y: 7},
    {x: 5, y: 6},
    {x: 6, y: 5}
  ]

  emitter.on('DOMContentLoaded', () => {

    emitter.on('', () => {

    })

  })
}