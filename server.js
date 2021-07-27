/**
 * @Description: express server
 * @Author: chenchen
 * @Date: 2021-03-12 14:17:03
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 13:48:16
 */
const SequelizeAuto = require('sequelize-auto')
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const ChildProcess = require('child_process')
const body_parser = require('body-parser')
const { port } = require('./config')
const Structure = require('./structure')

let structureInstance = null

/**
 * 查找文件
 * @param {String} origin_path 起始路径
 * @param {String} target 目标文件名
 * @param {Integer} max_deep 搜索最大深度
 * @param {Array} res 搜索结果
 * @param {Integer} deep 搜索当前深度
 */
const findFile = (origin_path, target, max_deep = 2, res = [], deep = 0) => {
  if (deep > max_deep) return res
  if (fs.existsSync(origin_path)) {
    if (fs.statSync(origin_path).isDirectory()) {
      fs.readdirSync(origin_path, {
        withFileTypes: true
      }).forEach(item => {
        res = findFile(
          path.join(origin_path, item.name),
          target,
          max_deep,
          res,
          deep + 1
        )
      })
    } else {
      const baseName = path.basename(origin_path)
      if (baseName === target) {
        res.push(origin_path)
      }
      return res
    }
  }
  return res
}

/**
 * 生成已有项目的业务设计信息
 * @param {String} projectPath 项目路径
 */
const genServiceDesign = projectPath => {
  const isProject = findFile(projectPath, 'eegg.conf.json', 1).length
  const serviceDesignData = []
  if (isProject) {
    const apiPath = path.join(projectPath, 'app', 'api')
    if (fs.existsSync(apiPath)) {
      fs.readdirSync(apiPath).map(ns => {
        const nsPath = path.join(apiPath, ns)
        if (fs.statSync(nsPath).isDirectory()) {
          const nsChildren = []
          serviceDesignData.push({
            name: ns,
            children: nsChildren
          })
          fs.readdirSync(nsPath).map(model => {
            const modelPath = path.join(nsPath, model)
            if (/^\w+\.json$/.test(model)) {
              // 清除require缓存
              delete require.cache[modelPath]
              nsChildren.push({
                name: model.replace('.json', ''),
                children: require(modelPath)
              })
            }
          })
        }
      })
    }
  }
  return serviceDesignData
}

let existsProjectList = []

module.exports = {
  /**
   * init server
   */
  getServerInstance: () => {
    // cors
    app.all('*', function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'X-Requested-With')
      res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
      res.header('X-Powered-By', ' 3.2.1')
      next()
    })
    // 静态资源目录
    app.use(express.static(path.join(__dirname, 'views')))
    // JSON解析
    app.use(body_parser.json())
    // ========>> 路由注册
    // 遍历3层目录内存在的eegg创建的项目
    app.get('/projects', (req, res) => {
      const originPath = process.cwd()
      const target = 'eegg.conf.json'
      const findRes = findFile(originPath, target).map((item, index) => {
        // 清除require缓存
        delete require.cache[item]
        const info = require(item)
        const projectPath = path.join(info.root, info.name)
        const serviceDesignDatas = genServiceDesign(projectPath)
        return {
          path: projectPath,
          serviceDesignDatas,
          ...info
        }
      })
      existsProjectList = findRes
      res.send({
        status: 0,
        exists: findRes
      })
    })
    // 获取指定数据源中的表
    app.get('/tables', async (req, res) => {
      const { username, password, dbName, host, port } = req.query
      const auto = new SequelizeAuto(dbName, username, password, {
        host,
        dialect: 'mysql',
        port,
        noWrite: true
      })
      const data = await auto.run()
      res.send({
        status: 0,
        tables: Object.keys(data.tables)
      })
    })
    // 获取本地文件目录
    app.get('/files', (req, res) => {
      const currentPath = req.query.path
        ? decodeURIComponent(req.query.path)
        : process.cwd()
      const dirents = fs.readdirSync(currentPath, { withFileTypes: true })
      const files = dirents.map(dirent => {
        return {
          name: dirent.name,
          isDir: dirent.isDirectory()
        }
      })
      res.send({
        status: 0,
        currentPath,
        files,
        isWin: process.platform === 'win32'
      })
    })
    // 删除项目
    app.delete('/project', (req, res) => {
      const { path } = req.body
      // 检查目录是否存在于已存在项目中
      const isProjectExists = existsProjectList
        .map(item => item.path)
        .includes(path)
      // 执行删除
      if (isProjectExists) {
        ChildProcess.execSync(
          `${process.platform === 'win32' ? 'del' : 'rm -rf'} ${path}`
        )
      }
      res.send({
        status: 0,
        msg: 'ok'
      })
    })
    // 构建项目实例
    app.post('/project/instance', (req, res) => {
      const config = req.body
      structureInstance = new Structure(config)
      res.send({
        status: 0,
        msg: 'ok'
      })
    })
    // 初始化项目目录
    app.post('/project/init', (req, res) => {
      structureInstance.init()
      res.send({
        status: 0,
        msg: 'ok'
      })
    })
    // 生成项目配置
    app.post('/project/config', (req, res) => {
      structureInstance.generateConfig()
      res.send({
        status: 0,
        msg: 'ok'
      })
    })
    // 生成接口路由
    app.post('/project/api', (req, res) => {
      structureInstance.genAPIandRouter()
      res.send({
        status: 0,
        msg: 'ok'
      })
    })

    // create server listen
    const server = app.listen(port, function () {
      console.log('Listening on port %d\n', server.address().port)
    })
    return app
  }
}
