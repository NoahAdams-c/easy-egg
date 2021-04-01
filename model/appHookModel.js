/**
 * @Description: 应用钩子文件模板
 * @Author: chenchen
 * @Date: 2021-03-19 16:41:29
 * @LastEditors: chenchen
 * @LastEditTime: 2021-04-01 17:10:13
 */
module.exports = (props) => {
	const consulConfig = props.extends.includes("consul")
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
		: ""
	return `${consulConfig ? "const Consul = require('consul')" : ""}
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
        // 更新所有worker进程上的应用对象
        this.app.messenger.on('updApplicationStorage', ({ key, val }) => {
          this.app[key] = val
        })
      }
    
      async serverDidReady() {
        // http / https server 已启动，开始接受外部请求
        // 此时可以从 app.server 拿到 server 的实例
        ${consulConfig}
      }
    }
    module.exports = AppBootHook`
}
