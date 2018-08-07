module.exports = {
  APIError: (code = 'internal:unknown_error', message = '') => {
    this.code = code
    this.message = message
  },
  restify: (pathPrefix = '/api/') => {
    return async (ctx, next) => {
      if (ctx.request.path.startsWith(pathPrefix)) {
        ctx.rest = data => {
          ctx.response.type = 'application/json'
          ctx.response.body = data
        }
        try {
          await next()
        } catch (e) {
          ctx.response.status = 400
          ctx.response.type = 'application/json'
          ctx.response.body = {
            code: e.code || 'internal:unknown_error',
            msg: e.message || ''
          }
        }
      } else {
        await next()
      }
    }
  }
}