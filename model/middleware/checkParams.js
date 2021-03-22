/**
 * @Description: 检查参数
 * @Author: chenchen
 * @Date: 2021-01-04 14:47:33
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-19 18:09:34
 */
module.exports = (requiredParams = []) => {
	return async (ctx, next) => {
		const requsetMethod = ctx.request.method
		let body = {}
		if (requsetMethod === "GET") {
			body = ctx.query
		} else {
			body = ctx.request.body
		}
		const {
			status: paramValidStatus,
			result: paramValidResult
		} = ctx.helper.isValid(body, requiredParams)
		if (!paramValidStatus) {
			ctx.helper.handleFail(40001, paramValidResult)
			return
		}

		await next()
	}
}
