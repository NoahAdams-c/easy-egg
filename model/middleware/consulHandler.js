/**
 * @Description: consul服务检测相关
 * @Author: chenchen
 * @Date: 2021-02-20 16:37:10
 * @LastEditors: chenchen
 * @LastEditTime: 2021-02-20 17:53:25
 */
module.exports = () => {
  return async (ctx, next) => {
    const url = ctx.request.url
    const methods = ctx.request.method
    // 健康检测
    if (url === '/consul/check') {
      ctx.body = 'OK'
      return
    }
    await next()
  }
}
