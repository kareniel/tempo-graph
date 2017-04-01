const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.route('/', mainView)
app.use(store)

app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <div id="tempo-graph"></div>
    </body>
  `
}

function store (state, emitter) {
  emitter.on('DOMContentLoaded', () => {



  })
}