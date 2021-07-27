/**
 * @Description: 检查参数
 * @Author: chenchen
 * @Date: 2021-01-04 14:47:33
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 17:17:09
 */
module.exports = () => {
  return async (ctx, next) => {
    let checkResult = {}
    let flag = false
    const requsetMethod = ctx.request.method
    const [ns, model, router = ''] = ctx.request.url
      .split('?')[0]
      .split('/')
      .filter(item => !!item)
    const apiInfo = ctx.app.apiDesignInfo['/' + ns + '/' + model]
      ? ctx.app.apiDesignInfo['/' + ns + '/' + model].filter(
          item =>
            item.routerName === router &&
            item.methods === requsetMethod.toLowerCase()
        )[0]
      : null
    if (!apiInfo) {
      await next()
      return
    }
    const requiredParams = apiInfo.requiredParams.map(item => item.name)
    // 先检查必传参数是否传递
    let body = {}
    if (requsetMethod === 'GET') {
      body = ctx.query
    } else {
      body = ctx.request.body
    }
    const { status: paramValidStatus, result: paramValidResult } =
      ctx.helper.isValid(body, requiredParams)
    if (!paramValidStatus) {
      checkResult = paramValidResult
      flag = true
    }
    // 再检查传递的参数是否符合类型、长度要求
    const typeCheckRes = {}
    apiInfo.requiredParams.concat(apiInfo.notRequiredParams).forEach(item => {
      const paramsValue = body[item.name]
      if (typeof paramsValue !== 'undefined') {
        switch (item.type) {
          case 'String':
            if (
              typeof paramsValue !== 'string' ||
              paramsValue.length > item.len
            ) {
              typeCheckRes[item.name] = `shold be String(${item.len})`
            }
            break
          case 'Integer':
            if (
              typeof paramsValue !== 'number' ||
              parseInt(paramsValue) !== paramsValue
            ) {
              typeCheckRes[item.name] = `shold be Integer`
            }
            break
          case 'Float':
            if (
              typeof paramsValue !== 'number' ||
              parseFloat(paramsValue) !== paramsValue
            ) {
              typeCheckRes[item.name] = `shold be Float`
            }
            break
          case 'Array':
            if (!Array.isArray(paramsValue)) {
              typeCheckRes[item.name] = `shold be Array`
            }
            break
          case 'Object':
            let jsonVal = ''
            try {
              jsonVal = JSON.stringify(paramsValue)
            } catch (err) {
              jsonVal = null
            }
            if (!jsonVal || jsonVal.indexOf('{') !== 0) {
              typeCheckRes[item.name] = `shold be Object`
            }
            break
        }
      }
    })
    if (Object.keys(typeCheckRes).length) {
      checkResult.formatError = typeCheckRes
      flag = true
    }
    if (flag) {
      ctx.helper.handleFail(40001, checkResult)
      return
    }

    await next()
  }
}
