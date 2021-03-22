/**
 * @Description: 错误捕捉
 * @Author: chenchen
 * @Date: 2021-02-20 16:36:41
 * @LastEditors: chenchen
 * @LastEditTime: 2021-02-20 16:38:11
 */

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (err) {
      if (err.errcode) {
        const { errmsg } = ctx.helper.errcode[err.errcode]
        if (errmsg) {
          err.errmsg = err.error || errmsg
        }
      } else {
        err.errcode = 40000
        err.errmsg = '操作失败'
      }
      ctx.helper.logToRemote('error', err)
      ctx.helper.handleFail(err.errcode, err.res)
    }
  }
}
