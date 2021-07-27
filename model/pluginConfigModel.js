/**
 * @Description: egg扩展配置文件模板
 * @Author: chenchen
 * @Date: 2021-03-19 15:59:56
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 10:53:47
 */
module.exports = props => {
  const base = `exports.sequelize = {
    enable: true,
    package: "egg-sequelize"
}
exports.nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks'
}
exports.cors = {
    enable: true,
    package: "egg-cors"
}`
  const jwtPluginConfig = props.extends.includes('jwt')
    ? `\nexports.jwt = {
    enable: true,
    package: 'egg-easy-jwt'
}`
    : ''
  const socketioPluginConfig =
    props.type === 'socket'
      ? `\nexports.io = {
    enable: true,
    package: 'egg-socket.io'
}`
      : ''
  return base + jwtPluginConfig + socketioPluginConfig
}
