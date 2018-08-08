/*
 * @Author: allen.wong 
 * @Date: 2018-08-08 17:57:57 
 * @Last Modified by: allen.wong
 * @Last Modified time: 2018-08-08 18:07:54
 */
const models = require('../db/db.js')

// 加班审核
/**
 * did确定条目 可以是数组
 * 改变status
 */

const fn_chkrecord = async ctx => {
  let data = []
  if (ctx.request.body.did[0] === '[') {
    data = JSON.parse(ctx.request.body.did)
  } else {
    data.push(ctx.request.body.did)
  }
  await models.Data.update({status: ctx.request.body.status}, {
    where: {did: {
      $in: data
    }},
    fields: ['status']
  }).then(r => {
    if (r[0]) {
      ctx.rest({code: 1, msg: 'updated'})
    } else {
      ctx.rest({code: 0, msg: 'nothing changed'})
    }
  })
}

module.exports = {
  'POST /api/chkrecord': fn_chkrecord,
}