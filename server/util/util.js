const getDate = timeStr => {
  let time = new Date(+timeStr)
  let year = time.getFullYear()
  let month =
    time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
  let date = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
  return `${year}-${month}-${date}`
}

const getTime = timeStr => {
  let time = new Date(+timeStr)
  let year = time.getFullYear()
  let month =
    time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
  let date = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
  let hour = time.getHours() > 9 ? time.getHours() : '0' + time.getHours()
  let min = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()
  return `${year}-${month}-${date} ${hour}:${min}`
}

module.exports = {
  getTime: getTime,
  getDate: getDate
}
