/*
 * @Author: allen.wong 
 * @Date: 2018-08-08 10:05:14 
 * @Last Modified by: allen.wong
 * @Last Modified time: 2018-08-08 15:29:40
 */

const models = require('../db/db.js')
const util = require('../util/util.js')

// 新增报销记录
/**
 * 必须 项目名称  开始时间 结束时间  （餐费  交通费 不都为0）用户名
 */
const fn_addrecord = async ctx => {
  let date = Date.parse(new Date())
  let data = ctx.request.body
  data.start = data.end = date
  data.sum = data.meal + data.traffic
  await models.Data.create(data, {
    fields: ['project', 'start', 'end', 'meal', 'sum', 'traffic', 'username']
  }).then(r => {
    if (r !== null) {
      ctx.rest({ code: 1, msg: 'created', data: r.dataValues })
    } else {
      ctx.rest({ code: 0, msg: 'fail created' })
    }
  })
}

// 数据更新
/**
 * 同数据新增
 */
const fn_updrecord = async ctx => {
  let data = ctx.request.body
  data.sum = data.meal + data.traffic
  await models.Data.update(data, {
    where: { did: ctx.request.body.did },
    fields: ['project', 'start', 'end', 'meal', 'sum', 'traffic']
  }).then(r => {
    if (r[0]) {
      ctx.rest({ code: 1, msg: 'updated' })
    } else {
      ctx.rest({ code: 0, msg: 'nothing changed' })
    }
  })
}

// 查询数据详情
/**
 * did查询
 */

const fn_recordinfo = async ctx => {
  await models.Data.findOne({
    where: ctx.query
  }).then(r => {
    if (r !== null) {
      ctx.rest({ code: 1, msg: 'query finished', data: r.dataValues })
    } else {
      ctx.rest({ code: 0, msg: 'not exist' })
    }
  })
}

// 删除数据
/**
 * 传did或者did的数组
 */

const fn_delrecord = async ctx => {
  let data = []
  if (ctx.query.did[0] === '[') {
    data = JSON.parse(ctx.query.did)
  } else {
    data.push(ctx.query.did)
  }
  await models.Data.findAll({
    where: {
      did: {
        $in: data
      }
    }
  }).then(async r => {
    if (r.length) {
      for (let item of r) {
        await item.destroy()
      }
      ctx.rest({code: 1, msg: 'deleted'})
    } else {
      ctx.rest({code: 0, msg: 'delete nothing'})
    }
  })
}

// 查询数据列表
/**
 * 查询条件  项目名称 开始时间 结束时间 用户名 状态
 */

const fn_recordlist = async ctx => {
  let data = {}
  for (let key in ctx.query) {
    if (key !== 'page' && key !== 'limit') {
      if (key === 'project' || key === 'username' || key === 'status') {
        data[key] = ctx.query[key]
      }
      if (key === 'start') {
        data[key] = {$gte: ctx.query[key]}
      }
      if (key === 'end') {
        data[key] = {$lte: ctx.query[key]}
      }
    }
  }
  
  await models.Data.findAndCount({
    where: data,
    attributes: ['did', 'project', 'start', 'end', 'username', 'status'],
    limit: ctx.query.limit || 10,
    offset: (ctx.query.limit || 10) * ((ctx.query.page || 1) - 1)
  }).then(r => {
    if (r.count) {
      let final = []
      for (let item of r.rows) {
        item.dataValues.start = util.getTime(item.dataValues.start)
        item.dataValues.end = util.getTime(item.dataValues.end)
        final.push(item.dataValues)
      }
      ctx.rest({
        code: 1,
        msg: 'query finished',
        count: r.count,
        data: final,
        page: ctx.query.page || 1,
        pages: Math.ceil(r.count / (ctx.query.limit || 10))
      })
    } else {
      ctx.rest({code: 0, msg: 'not exist'})
    }
  })
}

module.exports = {
  'POST /api/addrecord': fn_addrecord,
  'POST /api/updrecord': fn_updrecord,
  'GET /api/recordinfo': fn_recordinfo,
  'GET /api/delrecord': fn_delrecord,
  'GET /api/recordlist': fn_recordlist
}
