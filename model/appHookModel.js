/**
 * @Description: 应用钩子文件模板
 * @Author: chenchen
 * @Date: 2021-03-19 16:41:29
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-27 11:08:10
 */
module.exports = props => {
  const consulConfig = props.extends.includes('consul')
    ? `// 初始化consul客户端
        const consul = new Consul({
        host: '127.0.0.1',
        port: 8500,
        promisify: true
        })
        // 注册服务
        await consul.agent.service
        .register({
            name: 'test-egg-frame',
            address: '127.0.0.1',
            port: ${props.port},
            check: {
            http: 'http://127.0.0.1:${props.port}/consul/check',
            interval: '10s',
            timeout: '5s'
            }
        })
        .then(() => {
            console.log('test-egg-frame regist Consul success!')
        })
        .catch(err => {
            // TODO: 如果注册失败应该做相应处理
        })
        // 初始化配置
        const dynamicConf = await consul.kv.get('test-egg-frame#_DYNAMIC_CONF')
        console.log(dynamicConf)
        if (!dynamicConf) {
        await consul.kv.set(
            'test-egg-frame#_DYNAMIC_CONF',
            JSON.stringify(this.app._DYNAMIC_CONF)
        )
        } else {
        this.app._DYNAMIC_CONF = JSON.parse(dynamicConf.Value)
        }`
    : ''
  return `${consulConfig ? "const Consul = require('consul')" : ''}
    const { set: _set } = require("lodash")
    const fs = require('fs')
    const path = require('path')
    
    class AppBootHook {
      constructor(app) {
        this.app = app
      }
    
      configWillLoad() {
        // 此时 config 文件已经被读取并合并，但是还并未生效
        // 这是应用层修改配置的最后时机
        // 注意：此函数只支持同步调用
      }
    
      async didLoad() {
        // 所有的配置已经加载完毕
        // 可以用来加载应用自定义的文件，启动自定义的服务
      }
    
      async willReady() {
        // 所有的插件都已启动完毕，但是应用整体还未 ready
        // 可以做一些数据初始化等操作，这些操作成功才会启动应用
      }
    
      async didReady() {
        // 应用已经启动完毕
        // 更新所有worker进程上的应用对象扩展
        this.app.messenger.on("updApplicationStorage", ({ key, val }) => {
          _set(this.app, key, val)
          this.app.messenger.sendToApp("updApplicationStorageFinish")
        })
        // 将接口信息对象放到内存中
        await this.app.setStorage(
          'apiDesignInfo',
          genApiDesignInfo(this.app.baseDir)
        )
      }
    
      async serverDidReady() {
        // http / https server 已启动，开始接受外部请求
        // 此时可以从 app.server 拿到 server 的实例
        ${consulConfig}
      }
    }
    
    /**
     * 生成接口设计信息
     * @param {String} projectPath 项目路径
     */
    const genApiDesignInfo = projectPath => {
      const apiDesignInfo = {}
      const apiPath = path.join(projectPath, 'app', 'api')
      if (fs.existsSync(apiPath)) {
        fs.readdirSync(apiPath).map(ns => {
          const nsPath = path.join(apiPath, ns)
          let routerPrefix = ''
          if (fs.statSync(nsPath).isDirectory()) {
            routerPrefix += '/' + ns
            fs.readdirSync(nsPath).map(model => {
              const modelPath = path.join(nsPath, model)
              if (/^\\w+\\.json$/.test(model)) {
                routerPrefix += '/' + model.replace('.json', '')
                // 清除require缓存
                delete require.cache[modelPath]
                apiDesignInfo[routerPrefix] = require(modelPath) || []
              }
            })
          }
        })
      }
      return apiDesignInfo
    }

    module.exports = AppBootHook`
}
