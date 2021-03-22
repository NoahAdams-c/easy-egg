/**
 * @Description:
 * @Author: OBKoro1
 * @Date: 2020-04-16 12:31:28
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-19 16:32:30
 */
const util = require('util')
const moment = require('moment')
const axios = require('axios').default
// TODO: 需配置日志服务地址
const LOG_SERVER_HOST = ''

/**
 * 打印方法
 *
 * @param {Timestamp} time
 * @param {String} log 日志内容
 */
const logger = (time, log = '') => {
  const timeStr = moment(time).format('YYYY-MM-DD HH:mm:ss')
  console.log(`\x1B[32m(${timeStr}): \x1B[0m%s\n`, log)
}

/**
 * 错误打印方法
 *
 * @param {Timestamp} time
 * @param {String} log 日志内容
 */
const errorLog = (time, log = '') => {
  const timeStr = moment(time).format('YYYY-MM-DD HH:mm:ss')
  console.log(`\x1B[31m(${timeStr}): \x1B[0m%s\n`, log)
}

const getIPAddress = () => {
  const interfaces = require('os').networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

const cur_ip = getIPAddress()

module.exports = (type, content, info = {}) => {
  const current = moment().valueOf()
  if (type === 'error' && content instanceof Error) {
    if (content instanceof Error) {
      content = util.format(
        '%s\nerrcode: %s\nerrmsg: %s\n',
        content.stack,
        content.errcode,
        content.errmsg
      )
    }
    errorLog(current, content)
  } else {
    logger(current, content)
  }
  const logInfo = {
    created_at: moment(current).format('YYYY-MM-DD HH:mm:ss.SSS'),
    host: cur_ip,
    lq_id: info.lq_id,
    call_id: info.call_id,
    log_type: type,
    log_content: content
  }
  // axios.post(LOG_SERVER_HOST + '/log/insert-log', logInfo)
}
