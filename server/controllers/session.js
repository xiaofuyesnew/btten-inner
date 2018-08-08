const models = require('../db/db.js')

// 创建session或者更新session
const fn_createsession = async ctx => {
  await models.Session.findOne({
    where: ctx.request.body
  }).then(async m => {
    let myDate = Date.parse(new Date())
    if (m === null) {
      await models.Session.create({
        uid: ctx.request.body.uid,
        session: myDate
      }).then(r => {
        console.log(r)
        ctx.rest({ code: 1, msg: 'created', data: r.dataValues})
      })
    } else {
      await models.Session.update(
        { session: myDate },
        {
          where: {
            uid: ctx.request.body.uid
          },
          fields: ['session']
        }
      ).then(async r => {
        ctx.rest({ code: 1, msg: 'updated'})
      })
    }
  })
}

// 删除session
const fn_delsession = async ctx => {
  await models.Session.findAll({
    where: ctx.query
  }).then(async m => {
    if (m.length) {
      for (let item of m) {
        await item.destroy()
      }
      ctx.rest({ code: 1, msg: 'deleted' })
    } else {
      ctx.rest({ code: 0, msg: 'not exist, did not delete anything' })
    }
  })
}

// 查询session
const fn_getsession = async ctx => {
  await models.Session.findOne({
    where: ctx.query
  }).then(async m => {
    if (m !== null) {
      ctx.rest({code: 1, msg: 'query finished', data: m.dataValues })
    } else {
      ctx.rest({code: 0, msg: 'not exist'})
    }
  })
}

module.exports = {
  'POST /api/createsession': fn_createsession,
  'GET /api/getsession': fn_getsession,
  'GET /api/delsession': fn_delsession
}
