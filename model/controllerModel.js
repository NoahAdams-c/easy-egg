/**
 * @Description: 控制层文件模板
 * @Author: chenchen
 * @Date: 2021-03-22 11:32:28
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 11:45:02
 */
module.exports = (nsName, modelName, apis) => {
  let controllerTemplates = ''
  apis.forEach(api => {
    controllerTemplates += `\n\n\t/**
     * @Description ${api.description}
     * @Router ${api.methods} /${nsName}/${modelName}${
      api.routerName ? '/' + api.routerName : ''
    }${api.needAuth ? '\n\t * @Request header { Authorization }' : ''}
     * @Request ${
       api.methods === 'get' ? 'query' : 'body'
     } { ${genParamsTemplate(api.requiredParams)}${
      api.notRequiredParams.length
        ? '[, ' + genParamsTemplate(api.notRequiredParams) + ' ]'
        : ''
    } }
     * @Response 200 { errcode:String, errmsg:String${
       api.expectResponse.length
         ? ', ' + genParamsTemplate(api.expectResponse, 1)
         : ''
     } }
     * @Response 400 { errcode:String, errmsg:String }
     */`
    controllerTemplates += `\n\tasync ${api.name}() {
        const { ctx } = this
        await ctx.service.${nsName}.${modelName}.${api.name}(${
      api.requiredParams.length || api.notRequiredParams.length
        ? api.methods === 'get'
          ? 'ctx.query'
          : 'ctx.request.body'
        : ''
    })
    }`
  })
  return `const { Controller } = require('egg')

class ${
    modelName.substring(0, 1).toUpperCase() + modelName.substring(1)
  }Controller extends Controller {${controllerTemplates}
}

module.exports = ${
    modelName.substring(0, 1).toUpperCase() + modelName.substring(1)
  }Controller`
}

/**
 * 生成参数模板
 * @param {Array} params 参数对象数组
 * @param {Integer} type 类型，0--请求参数，1--响应参数
 */
const genParamsTemplate = (params, type = 0) => {
  let handledParamsArr = params.map(item => {
    return `${item.name}:${item.type}${
      type === 0 && item.type === 'String' ? '(' + item.len + ')' : ''
    }`
  })
  return handledParamsArr.join(', ')
}
