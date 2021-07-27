/**
 * @Description: 子路由文件模板
 * @Author: chenchen
 * @Date: 2021-03-22 11:35:33
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 16:20:34
 */
module.exports = ns => {
  let apiTemplates = ''
  ns.children.forEach(m => {
    apiTemplates += `\n\t// ${m.name}`
    m.children.forEach(api => {
      apiTemplates += `\n\trouter.${api.methods}('/${ns.name}/${m.name}${
        api.routerName ? '/' + api.routerName : ''
      }', ${api.needAuth ? 'checkAuth, ' : ''}controller.${ns.name}.${m.name}.${
        api.name
      }) // ${api.description}`
    })
  })
  return `module.exports = app => {
    const { router, controller, middleware } = app
    // 授权中间件
    const checkAuth = middleware.checkAuth()${apiTemplates}
}`
}
