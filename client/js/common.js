/*
 * @Author: allen.wong 
 * @Date: 2018-08-02 17:50:52 
 * @Last Modified by: allen.wong
 * @Last Modified time: 2018-08-06 16:29:10
 */

// 每个页面都要调用的方法
!(function () {
  // 验证登录
  
})()

function showAside() {
  if (!this.asideShowed) {
    this.asideShowed = true
  }

  if (this.showAside) {
    this.showAside = false
  } else {
    this.showAside = true
  }
}

function logout() {
  
}

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  var r = window.location.search.substr(1).match(reg)
  if (r === null){
      return ''
  } else {
      return decodeURI(r[2])
  }
}