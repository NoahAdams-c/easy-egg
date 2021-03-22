/**
 * @Description: 控制层文件模板
 * @Author: chenchen
 * @Date: 2021-03-22 11:32:28
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-22 13:05:32
 */
module.exports = (nsName, modelName, apis) => {
	let controllerTemplates = ""
	apis.forEach((api) => {
		controllerTemplates += `\n\n\t/**
     * @Description ${api.description}
     * @Router ${api.methods} /${nsName}/${modelName}/${api.routerName}${
			api.needAuth ? "\n\t * @Request header { Authorization }" : ""
		}
     * @Request ${
			api.methods === "get" ? "query" : "body"
		} { ${api.requiredParams.join(", ")}${
			api.notRequiredParams.length
				? "[, " + api.notRequiredParams.join(", ") + " ]"
				: ""
		} }
     * @Response 200 { errcode, errmsg, ${
			api.expectResponse.length
				? ", " + api.expectResponse.join(", ")
				: ""
		} }
     * @Response 400 { errcode, errmsg }
     */`
		controllerTemplates += `\n\tasync ${api.name}() {
        const { ctx } = this
        await ctx.service.${nsName}.${modelName}.${api.name}(${
			api.methods === "get" ? "ctx.query" : "ctx.request.body"
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
