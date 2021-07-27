/**
 * @Description: 默认配置文件模板
 * @Author: chenchen
 * @Date: 2021-03-19 13:45:55
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 16:18:24
 */
module.exports = props => {
  return `const path = require('path')
// 引入访问白名单配置
const domainWhiteList = require('./domainWhiteList.json')
// 引入数据库配置
const dbConfig = require('./databases.json')
const { development:dbDefault } = require('../database/config.json')

module.exports = appInfo => {
    const config = {}

    config.cluster = {
        listen: {
            // 端口
            port: ${props.port}
        }
    }
    config.keys = '${props.keys}'
    // 中间件配置
    config.middleware = [${
      props.extends.includes('errorhandler') ? "'errorHandler'," : ''
    }${props.extends.includes('contexthandler') ? "'contextHandler'," : ''}${
    props.extends.includes('consul') ? "'consulHandler'," : ''
  }'checkParams']
    // sequelize配置
    config.sequelize = {
        datasources: [
            {
                ...dbDefault,
                timezone: "+08:00"
            },
            ...dbConfig
        ]
    }
    config.onerror = {
        html(ctx, err) {
            ctx.body = '<h3>error</h3>'
            ctx.status = 500
        }
    }
    config.errorHandler = {
        match: '/'
    }
    config.security = {
        csrf: {
            useSession: true,
            enable: false,
            cookieName: 'csrfToken',
            sessionName: 'csrfToken'
        },
        // 访问白名单配置
        domainWhiteList
    }
    config.cors = {
        origin: '*',
        exposeHeaders: 'WWW-Authenticate,Server-Authorization,Date',
        maxAge: 100,
        credentials: true,
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        allowHeaders: 'Content-Type,Authorization,Accept,X-Custom-Header,anonymous'
    }
    config.static = {
        prefix: '/',
        dir: [path.join(appInfo.baseDir, 'app/public')]
    }
    config.view = {
        root: [path.join(appInfo.baseDir, 'app/view')].join(','),
        defaultExtension: '.html',
        defaultViewEngine: 'nunjucks',
        mapping: {
          '.html': 'nunjucks'
        },
        cache: true
    }

    return config
}`
}
