/**
 * @Description: 业务层文件模板
 * @Author: chenchen
 * @Date: 2021-03-22 11:33:33
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-22 18:28:38
 */
module.exports = (modelName, apis) => {
  let serviceTemplates = ''
  apis.forEach(api => {
    const paramsCommentTemplate =
      api.requiredParams.length || api.notRequiredParams.length
        ? `
     * @param {Object} props { ${genParamsTemplate(api.requiredParams)}${
            api.notRequiredParams.length
              ? '[, ' + genParamsTemplate(api.notRequiredParams) + ' ]'
              : ''
          } }`
        : ''
    const jwtdataTemplate = api.needAuth
      ? `
        const jwtDecodeData = ctx.jwtDecodeData`
      : ''
    serviceTemplates += `\n\t/**
     * @Description ${api.description}${paramsCommentTemplate}
     */`
    serviceTemplates += `\n\tasync ${api.name}(${
      api.requiredParams.length || api.notRequiredParams.length ? 'props' : ''
    }) {
        const { app, ctx } = this${jwtdataTemplate}
        // TODO: 业务代码${
          api.expectResponse.length
            ? '\n\t\tlet ' + api.expectResponse.map(item => item.name).join(',')
            : ''
        }
        ctx.helper.handleSuccess({${
          api.expectResponse.length
            ? api.expectResponse.map(item => item.name).join(', ')
            : ''
        }})
    }`
  })
  return `const { Service } = require('egg')

class ${
    modelName.substring(0, 1).toUpperCase() + modelName.substring(1)
  }Service extends Service {${serviceTemplates}
}

module.exports = ${
    modelName.substring(0, 1).toUpperCase() + modelName.substring(1)
  }Service`
}

/**
 * 生成参数模板
 * @param {Array} params 参数对象数组
 */
const genParamsTemplate = params => {
  let handledParamsArr = params.map(item => {
    return `${item.name}:${item.type}${
      item.type === 'String' ? '(' + item.len + ')' : ''
    }`
  })
  return handledParamsArr.join(', ')
}
