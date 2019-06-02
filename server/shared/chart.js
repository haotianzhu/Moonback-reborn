// +x to some field on echart
const echartModify = (user, key, value) => {
  user.echart[key] = parseInt(user.echart[key]) + value
  // user.echart.level = calculateLevel(user)
  return user
}

const echartSet = (user, key, value) => {
  user.echart[key] = value
  // user.echart.level = calculateLevel(user)
  return user
}

const dailyLogin = (user) => {
  if (!checkIsFirstLogin(user.modifyDate)) {
    user.echart.level = parseInt(user.echart.level) + 1
  }
  return user.echart
}

const checkIsFirstLogin = (date) => {
  const today = new Date()
  const lastDate = new Date(date)
  console.log(today, lastDate, isToday(today, lastDate))
  return isToday(today, lastDate)
}

// https://stackoverflow.com/questions/8393947/what-is-the-best-way-to-determine-if-a-date-is-today-in-javascript?lq=1
function isToday (d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

module.exports.dailyLogin = dailyLogin
module.exports.echartSet = echartSet
module.exports.echartModify = echartModify
