/*
 * @Author: allen.wong 
 * @Date: 2018-08-07 14:18:31 
 * @Last Modified by: allen.wong
 * @Last Modified time: 2018-08-08 15:02:09
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

// 查询用户信息
/**
 * uid
 */

const fn_userinfo = async ctx => {
  await models.User.findOne({
    where: ctx.query,
    attributes: ['uid', 'username', 'auth', 'birth', 'intime', 'sex']
  }).then(m => {
    if (m !== null) {
      ctx.rest({code: 1, msg: 'query finished', data: m.dataValues})
    } else {
      ctx.rest({code: 0, msg: 'not exist'})
    }
  })
}

// 查询用户列表
/**
 * 查询条件  用户名 权限 生日 入职时间 性别
 * 分页条件  查询页数, 每页的限制
 */

const fn_userlist = async ctx => {
  let data = {}
  for (let key in ctx.query) {
    if (key !== 'page' && key !== 'limit') {
      data[key] = ctx.query[key]
    }
  }
  console.log(data)
  await models.User.findAndCount({
    where: data,
    attributes: ['uid', 'username', 'auth', 'birth', 'intime', 'sex'],
    limit: ctx.query.limit || 10,
    offset: (ctx.query.limit || 10) * ((ctx.query.page || 1) - 1)
  }).then(m => {
    if (m.count) {
      let final = []
      for (let item of m.rows) {
        final.push(item.dataValues)
      }
      ctx.rest({
        code: 1,
        msg: 'query finished',
        data: final,
        count: m.count,
        page: ctx.query.page || 1,
        pages: Math.ceil(m.count / (ctx.query.limit || 10))
      })
    } else {
      ctx.rest({code: 0, msg: 'not exist'})
    }
  })
}

// 修改用户数据
/**
 * uid定位
 */

 const fn_upduser = async ctx => {
   await models.User.update(ctx.request.body, {
     where: {uid: ctx.request.body.uid},
     fields: ['password', 'auth', 'birth', 'intime', 'sex']
   }).then(m => {
     if (m[0]) {
      ctx.rest({code: 1, msg: 'updated'})
     } else {
      ctx.rest({code: 0, msg: 'nothing changed'})
     }
   })
 }


module.exports = {
  'POST /api/adduser': fn_adduser,
  'POST /api/upduser': fn_upduser,
  'GET /api/deluser': fn_deluser,
  'GET /api/userlist': fn_userlist,
  'GET /api/userinfo': fn_userinfo
}
