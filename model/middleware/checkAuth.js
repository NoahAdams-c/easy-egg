/**
 * @Description: 检查授权，并将授权信息解析后传递到请求
 * @Author: chenchen
 * @Date: 2021-02-20 16:34:05
 * @LastEditors: chenchen
 * @LastEditTime: 2021-02-20 16:38:31
 */
module.exports = () => {
  return async (ctx, next) => {
    const encrytedToken = ctx.get('Authorization')
    // 解密token
    const token = ctx.helper.decrypteToken(encrytedToken)
    // 验证token
    await ctx.helper.verifyToken(token, '2')
    // 解析token
    const decodeData = ctx.helper.decodeToken(token)

    // TODO: 补充检测逻辑

    ctx.jwtDecodeData = decodeData
    await next()
  }
}
