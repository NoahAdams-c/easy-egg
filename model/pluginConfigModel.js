/**
 * @Description: egg扩展配置文件模板
 * @Author: chenchen
 * @Date: 2021-03-19 15:59:56
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-22 13:23:44
 */
module.exports = (props) => {
	const base = `exports.sequelize = {
    enable: true,
    package: "egg-sequelize"
}
exports.cors = {
    enable: true,
    package: "egg-cors"
}`
	const jwtPluginConfig = props.extends.includes("jwt")
		? `\nexports.jwt = {
    enable: true,
    package: 'egg-easy-jwt'
}`
		: ""
	const socketioPluginConfig =
		props.type === "socket"
			? `\nexports.io = {
    enable: true,
    package: 'egg-socket.io'
}`
			: ""
	return base + jwtPluginConfig + socketioPluginConfig
}
