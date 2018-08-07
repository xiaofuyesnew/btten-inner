
const Koa = require('koa')
const controller = require('./controller.js')
const bodyParser = require('koa-bodyparser')
const REST = require('./rest.js')
const Cors = require('koa2-cors')

const app = new Koa()

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  await next()
})

app.use(Cors({
  origin: () => {
    return '*'
  }
}))

app.use(bodyParser())

app.use(REST.restify())

app.use(controller())

app.listen(3000)

console.log('app started at 3000...')