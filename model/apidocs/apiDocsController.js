/**
 * @Description: 接口文档
 * @Author: chenchen
 * @Date: 2021-07-23 12:22:17
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 15:11:41
 */
const { Controller } = require('egg')

class APIDocsController extends Controller {
  async renderPage() {
    const { ctx } = this
    await ctx.render('index')
  }

  async getDatas() {
    const { ctx } = this
    const apiData = ctx.helper.genServiceDesign()
    ctx.helper.handleSuccess({ data: apiData })
  }
}

module.exports = APIDocsController
