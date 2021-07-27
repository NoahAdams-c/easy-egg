module.exports = app => {
  const { router, controller } = app
  router.get('/apidocs', controller.apiDocs.renderPage) // 渲染接口文档页
  router.get('/apidocs/data', controller.apiDocs.getDatas) // 获取接口数据
}
