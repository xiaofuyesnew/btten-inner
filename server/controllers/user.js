/*
 * @Author: allen.wong 
 * @Date: 2018-08-07 14:18:31 
 * @Last Modified by: allen.wong
 * @Last Modified time: 2018-08-07 15:24:29
 */

const models = require('../db/db.js')

// 新增用户
/**
 *
 * 参数  username password auth 三者必须
 */
const fn_adduser = async ctx => {
  await models.User.findOne({
    where: { username: ctx.request.body.username }
  }).then(async m => {
    if (m === null) {
      await models.User.create(ctx.request.body).then(async r => {
        ctx.rest({ code: 1, msg: 'created', data: r.dataValues })
      })
    } else {
      ctx.rest({ code: 0, msg: 'already exist' })
    }
  })
}

// 删除用户
/**
 * 
 * 参数 uid 必须 可以是数组多个删除
 */
const fn_deluser = async ctx => {
  let param = []
  console.log(ctx.query.uid[0])
  if (ctx.query.uid[0] === '[') {
    param = JSON.parse(ctx.query.uid)
  } else {
    param.push(+ctx.query.uid)
  }
  console.log(param)
  await models.User.findAll({
    where: { uid: {
      $in: param
    } }
  }).then(async m => {
    if (m.length) {
      for (let item of m) {
        await item.destroy()
      }
      ctx.rest({code: 1, msg: 'deleted'})
    } else {
      ctx.rest({code: 0, msg: 'not exist, did not delete anything'})
    }
  })
}

module.exports = {
  'POST /api/adduser': fn_adduser,
  // 'POST /api/upduser': fn_upduser,
  'GET /api/deluser': fn_deluser,
  // 'GET /api/userinfo': fn_userinfo
}
