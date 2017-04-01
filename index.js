const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.route('/', mainView)
app.use(store)
app.mount('body')

function mainView (state, emit) {
  const {gridWidth, gridHeight, yAxisWidth} = state.config
  const {yAxis, nodes} = state
  const width = (gridWidth * nodes.length) - gridWidth
  const height = (gridHeight * yAxis.length)

  return html`
    <body>
      <div id="tempo-graph" style="width: ${width}px; height:${height}px">

        <div>
          ${nodes.map((node, index, array) => html`
            <div
              data-index=${index}
              onmousedown=${onMouseDown}
              class="node ${nodeType(index, array)}" 
              style="
                left: ${node.x - 12.5}px;
                top: ${node.y - 12.5}px;">
            </div>
          `)}
        </div>

        <svg height=${height} width=${width}>
          ${nodes.reduce(nodesToEdges, []).map((edge, index, array) => {
            return html`
              <line class="edge" 
                x1=${edge[0].x} y1=${edge[0].y} x2=${edge[1].x} y2=${edge[1].y}/>
            `})}
        </svg>

        ${yAxis.map((value, index) => html`
          <div 
            class="tick"
            style="
              left: -${yAxisWidth}px; 
              bottom: ${(index * gridHeight) - gridHeight}px; 
              height: ${gridHeight}px">
            ${value}
          </div>
        `)}
      </div>
    </body>
  `



  function onMouseDown (e) {
    e.preventDefault()

    const frame = e.target.parentNode.getBoundingClientRect()

    document.addEventListener('mousemove', onDragStart)

    function onDragStart (e) {
      e.preventDefault()

      document.removeEventListener('mousemove', onDragStart)
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onDragEnd)

      emit('grab-node', e.target.dataset.index)
    }

    function onDrag (e) {
      e.preventDefault()

      emit('move-node', { yPos: Math.abs(frame.bottom - e.y) })
    }

    function onDragEnd (e) {
      e.preventDefault()

      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onDragEnd)

      emit('grab-node', null)
    }
  }
}

function store (state, emitter) {
  state.config = {
    gridWidth: 100,
    gridHeight: 40,
    yAxisWidth: 40 
  }

  state.yAxis = [0, 1, 2, 3, 4, 5]

  state.nodes = [
    {x: 0, y: 240},
    {x: 100, y: 240},
    {x: 200, y: 200},
    {x: 300, y: 200},
    {x: 400, y: 180},
    {x: 500, y: 200}
  ]

  state.grabbedNode = null

  emitter.on('DOMContentLoaded', () => {

    emitter.on('grab-node', id => {
      state.grabbedNode = id
    })

    emitter.on('move-node', (payload) => {
      const {gridHeight} = state.config
      const {yPos} = payload
      state.nodes[state.grabbedNode].y = yPos
      emitter.emit('render')
    })

  })
}

function nodesToEdges (acc, val, idx, arr) {
  if (idx === 0) {
    return [[null, val]]
  }
  if (idx === arr.length - 1) {
    return acc.slice(1).concat([[acc[idx - 1][1], val]])
  }
  return acc.concat([[acc[idx - 1][1], val]])

}

function nodeType (index, array) {
  const endNode = (index === 0 || index === array.length - 1)
  const transNode = (index % 2)
  return (endNode) ? 'end-node' : (transNode ? 'trans-node' : '')
}