/**
 * @Description: 业务层文件模板
 * @Author: chenchen
 * @Date: 2021-03-22 11:33:33
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-22 13:16:33
 */
module.exports = (modelName, apis) => {
	let serviceTemplates = ""
	apis.forEach((api) => {
		serviceTemplates += `\n\t/**
     * @Description ${api.description}
     * @param {Object} props { ${api.requiredParams.join(", ")}${
			api.notRequiredParams.length
				? "[, " + api.notRequiredParams.join(", ") + " ]"
				: ""
		} }
     */`
		serviceTemplates += `\n\tasync ${api.name}(props) {
        const { app, ctx } = this
        const jwtDecodeData = ctx.jwtDecodeData
        // TODO: 业务代码${
			api.expectResponse.length
				? "\n\t\tlet " + api.expectResponse.join(" = '',") + " = ''"
				: ""
		}
        ctx.helper.handleSuccess({${
			api.expectResponse.length ? api.expectResponse.join(",") : ""
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
