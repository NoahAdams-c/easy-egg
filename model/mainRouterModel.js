/**
 * @Description: 总路由文件模板
 * @Author: chenchen
 * @Date: 2021-03-22 11:34:31
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-22 11:40:54
 */
module.exports = (props) => {
	let subRoutersTemplate = ""
	props.serviceDesignDatas.forEach((item) => {
		subRoutersTemplate += `\n\trequire('./router/${item.name}.js')(app)`
	})
	return `module.exports = app => {${subRoutersTemplate}
}`
}
