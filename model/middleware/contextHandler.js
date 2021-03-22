/**
 * @Description: 请求上下文中间件
 * @Author: chenchen
 * @Date: 2021-02-20 16:35:55
 * @LastEditors: chenchen
 * @LastEditTime: 2021-02-20 16:38:58
 */

module.exports = () => {
  return async function contextHandler(ctx, next) {
    const inTime = new Date().getTime()
    const url = ctx.request.url

    ctx.helper.logToRemote(
      'request',
      `URL:${url}\nMethod:${ctx.request.method}\nHeader: ${JSON.stringify(
        ctx.request.header
      )}\nRequest body: ${JSON.stringify(ctx.request.body)}`
    )

    // TODO: 请求进入前处理

    await next()

    // TODO: 响应出去前处理

    ctx.helper.logToRemote(
      'response',
      `URL:${url}\nMethod:${ctx.request.method}\nHeader: ${JSON.stringify(
        ctx.response.header
      )}\nResponse body:${JSON.stringify(ctx.response.body)}`
    )
    const outTime = new Date().getTime()
    console.log('url: %s, 执行时间： %d ms', url, outTime - inTime)
  }
}
