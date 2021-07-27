/**
 * @Description: 项目构建
 * @Author: chenchen
 * @Date: 2021-03-18 16:23:43
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 11:12:03
 */
const SequelizeAuto = require('sequelize-auto')
const ChildProcess = require('child_process')
const Fs = require('fs')
const Path = require('path')

const genProjectDir = require('./model/projectDirModel')
const genPackageJson = require('./model/packageJsonModel')
const genConfigDefault = require('./model/configDefaultModel')
const genPluginConfig = require('./model/pluginConfigModel')
const genAppHook = require('./model/appHookModel')
const genMainRouter = require('./model/mainRouterModel')
const genSubRouter = require('./model/subRouterModel')
const genController = require('./model/controllerModel')
const genService = require('./model/serviceModel')

class Structure {
  constructor(config) {
    // 项目配置
    this.config = config
    // 项目路径
    this.projectPath = Path.join(config.root, config.name)
    // eegg配置文件名
    this.confFileName = 'eegg.conf.json'
    // 是否为windows平台
    this.isWin = process.platform === 'win32'
  }

  /**
   * 初始化项目基本目录结构
   */
  init() {
    // 如果项目不存在则创建项目根目录
    if (!Fs.existsSync(this.projectPath)) {
      ChildProcess.execSync(
        `cd ${this.config.root} && mkdir ${this.config.name}`
      )
    }
    // 创建项目目录结构
    this.makeDir(this.projectPath, genProjectDir(this.config))
    // 生成eegg配置文件
    this.genEEGGConf()
    // 复制一些固定的配置文件
    ChildProcess.execSync(
      `${this.isWin ? 'copy' : 'cp -r'} ${Path.join(
        __dirname,
        'model',
        'resources'
      )}${this.isWin ? '\\' : '/'}. ${this.projectPath}`
    )
    // 生成依赖包配置文件
    Fs.writeFileSync(
      Path.join(this.projectPath, 'package.json'),
      JSON.stringify(genPackageJson(this.config, this.isWin), undefined, 2)
    )
    // 复制中间件
    ChildProcess.execSync(
      `${this.isWin ? 'copy' : 'cp -r'} ${Path.join(
        __dirname,
        'model',
        'middleware'
      )}${this.isWin ? '\\' : '/'}. ${Path.join(
        this.projectPath,
        'app',
        'middleware'
      )}`
    )
    // 复制框架扩展
    ChildProcess.execSync(
      `${this.isWin ? 'copy' : 'cp -r'} ${Path.join(
        __dirname,
        'model',
        'frame_extend'
      )}${this.isWin ? '\\' : '/'}. ${Path.join(
        this.projectPath,
        'app',
        'extend'
      )}`
    )
  }

  /**
   * 项目配置文件生成
   */
  generateConfig() {
    // 创建默认配置文件
    Fs.writeFileSync(
      Path.join(this.projectPath, 'config', 'config.default.js'),
      genConfigDefault(this.config)
    )
    // 创建数据库配置文件
    Fs.writeFileSync(
      Path.join(this.projectPath, 'config', 'databases.json'),
      JSON.stringify(this.config.databases.slice(1), undefined, 2)
    )
    // 创建sequelize默认数据源配置文件
    Fs.writeFileSync(
      Path.join(this.projectPath, 'database', 'config.json'),
      JSON.stringify(
        {
          development: {
            username: this.config.databases[0].username,
            password: this.config.databases[0].password,
            database: this.config.databases[0].database,
            host: this.config.databases[0].host,
            port: this.config.databases[0].port,
            dialect: 'mysql'
          }
        },
        undefined,
        2
      )
    )
    // 创建访问白名单配置文件
    Fs.writeFileSync(
      Path.join(this.projectPath, 'config', 'domainWhiteList.json'),
      JSON.stringify(this.config.whiteList, undefined, 2)
    )
    // 创建egg扩展配置文件
    Fs.writeFileSync(
      Path.join(this.projectPath, 'config', 'plugin.js'),
      genPluginConfig(this.config)
    )
    // 创建应用钩子文件
    Fs.writeFileSync(
      Path.join(this.projectPath, 'app.js'),
      genAppHook(this.config)
    )
    // 创建数据模型
    this.genModel()
  }

  /**
   * 路由与接口生成
   */
  genAPIandRouter() {
    // 生成总路由文件
    Fs.writeFileSync(
      Path.join(this.projectPath, 'app', 'router.js'),
      genMainRouter(this.config)
    )
    this.config.serviceDesignDatas.forEach(ns => {
      // 生成子路由文件
      Fs.writeFileSync(
        Path.join(this.projectPath, 'app', 'router', `${ns.name}.js`),
        genSubRouter(ns)
      )
      ns.children.forEach(model => {
        // 生成控制层文件
        Fs.writeFileSync(
          Path.join(
            this.projectPath,
            'app',
            'controller',
            ns.name,
            `${model.name}.js`
          ),
          genController(ns.name, model.name, model.children)
        )
        // 生成业务层文件
        Fs.writeFileSync(
          Path.join(
            this.projectPath,
            'app',
            'service',
            ns.name,
            `${model.name}.js`
          ),
          genService(model.name, model.children)
        )
        // 生成接口信息文件
        Fs.writeFileSync(
          Path.join(
            this.projectPath,
            'app',
            'api',
            ns.name,
            `${model.name}.json`
          ),
          JSON.stringify(model.children, undefined, 2)
        )
      })
    })
    // 生成接口文档相关文件
    this.config.serviceDesignDatas.length && this.genAPIDocs()
  }

  /**
   * sequelize#model生成
   */
  async genModel() {
    try {
      for (let item of this.config.databases) {
        if (!item.modelTables.length) continue
        const outputDir = Path.join(
          this.projectPath,
          'app',
          item.baseDir || 'model'
        )
        const auto = new SequelizeAuto(
          item.database,
          item.username,
          item.password,
          {
            host: item.host,
            dialect: item.dialect,
            directory: outputDir,
            port: item.port,
            additional: {
              freezeTableName: true,
              timestamps: false
            },
            tables: item.modelTables
          }
        )
        await auto.run()
        this.handleModelContent(outputDir)
      }
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 处理生成的model为可被Eggjs使用的格式
   */
  handleModelContent(modelDir) {
    // fs.rm 在node版本v14.14后才支持
    // Fs.rmSync(Path.join(modelDir, 'init-models.js'), {
    //   recursive: true,
    //   force: true
    // })
    ChildProcess.execSync(
      `${this.isWin ? 'del' : 'rm -rf'} ${Path.join(
        modelDir,
        'init-models.js'
      )}`
    )
    Fs.readdirSync(modelDir, { withFileTypes: true }).filter(item => {
      if (item.isFile()) {
        const modelPath = Path.join(modelDir, item.name)
        const buf = Fs.readFileSync(modelPath)
        const content = buf.toString('utf-8')
        let fixedContent = content.split('\n')
        fixedContent.splice(0, 2)
        fixedContent.unshift(
          'module.exports = ({model: sequelize, Sequelize: DataTypes}) => {'
        )
        fixedContent = fixedContent.join('\n')
        Fs.writeFileSync(modelPath, fixedContent)
      }
    })
  }

  /**
   * 接口文档相关文件生成
   */
  genAPIDocs() {
    // 复制controller文件
    ChildProcess.execSync(
      `${this.isWin ? 'copy' : 'cp'} ${Path.join(
        __dirname,
        'model',
        'apidocs',
        'apiDocsController.js'
      )} ${Path.join(this.projectPath, 'app', 'controller', 'apiDocs.js')}`
    )
    // 复制router文件
    ChildProcess.execSync(
      `${this.isWin ? 'copy' : 'cp'} ${Path.join(
        __dirname,
        'model',
        'apidocs',
        'apiDocsRouter.js'
      )} ${Path.join(this.projectPath, 'app', 'router', 'apiDocs.js')}`
    )
    // 复制接口文档页面文件
    ChildProcess.execSync(
      `${this.isWin ? 'copy' : 'cp'} ${Path.join(
        __dirname,
        'model',
        'apidocs',
        'index.html'
      )} ${Path.join(this.projectPath, 'app', 'view')}`
    )
  }

  /**
   * eegg配置文件生成
   */
  genEEGGConf() {
    const temp = JSON.parse(JSON.stringify(this.config))
    delete temp.serviceDesignDatas
    Fs.writeFileSync(
      Path.join(this.projectPath, this.confFileName),
      JSON.stringify(temp, undefined, 2),
      {
        flag: ''
      }
    )
  }

  /**
   * 创建目录
   */
  makeDir(path, option) {
    for (let item of option) {
      if (!Fs.existsSync(Path.join(path, item.name))) {
        ChildProcess.execSync(`cd ${path} && mkdir ${item.name}`)
      }
      if (item.children.length) {
        this.makeDir(Path.join(path, item.name), item.children)
      }
    }
  }
}

module.exports = Structure
