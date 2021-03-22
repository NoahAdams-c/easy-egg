/**
 * @Description:
 * @Author: OBKoro1
 * @Date: 2021-03-18 16:23:43
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-22 14:10:03
 */
/**
 * @Description: 项目构建
 * @Author: chenchen
 * @Date: 2021-03-18 16:23:43
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-19 10:45:09
 */
const ChildProcess = require("child_process")
const Fs = require("fs")
const Path = require("path")

const genProjectDir = require("./model/projectDirModel")
const genPackageJson = require("./model/packageJsonModel")
const genConfigDefault = require("./model/configDefaultModel")
const genPluginConfig = require("./model/pluginConfigModel")
const genAppHook = require("./model/appHookModel")
const genMainRouter = require("./model/mainRouterModel")
const genSubRouter = require("./model/subRouterModel")
const genController = require("./model/controllerModel")
const genService = require("./model/serviceModel")

class Structure {
	constructor(config) {
		// 项目根目录
		this.config = config
		// 是否为windows平台
		this.isWin = process.platform === "win32"
	}

	/**
	 * 初始化项目基本目录结构
	 */
	init() {
		// 创建项目根目录
		ChildProcess.execSync(
			`cd ${this.config.root} && mkdir ${this.config.name}`
		)
		// 创建项目目录结构
		this.makeDir(
			Path.join(this.config.root, this.config.name),
			genProjectDir(this.config)
		)
		// 复制一些固定的配置文件
		ChildProcess.execSync(
			`${this.isWin ? "copy" : "cp -r"} ${Path.join(
				process.cwd(),
				"model",
				"resources"
			)}${this.isWin ? "\\" : "/"}. ${Path.join(
				this.config.root,
				this.config.name
			)}`
		)
		// 生产包配置文件
		Fs.writeFileSync(
			Path.join(this.config.root, this.config.name, "package.json"),
			JSON.stringify(genPackageJson(this.config), undefined, 2)
		)
		// 复制中间件
		ChildProcess.execSync(
			`${this.isWin ? "copy" : "cp -r"} ${Path.join(
				process.cwd(),
				"model",
				"middleware"
			)}${this.isWin ? "\\" : "/"}. ${Path.join(
				this.config.root,
				this.config.name,
				"app",
				"middleware"
			)}`
		)
		// 复制框架扩展
		ChildProcess.execSync(
			`${this.isWin ? "copy" : "cp -r"} ${Path.join(
				process.cwd(),
				"model",
				"frame_extend"
			)}${this.isWin ? "\\" : "/"}. ${Path.join(
				this.config.root,
				this.config.name,
				"app",
				"extend"
			)}`
		)
	}

	/**
	 * 项目配置文件生成
	 */
	generateConfig() {
		// 创建默认配置文件
		Fs.writeFileSync(
			Path.join(
				this.config.root,
				this.config.name,
				"config",
				"config.default.js"
			),
			genConfigDefault(this.config)
		)
		// 创建数据库配置文件
		Fs.writeFileSync(
			Path.join(
				this.config.root,
				this.config.name,
				"config",
				"databases.json"
			),
			JSON.stringify(this.config.databases.slice(1), undefined, 2)
		)
		// 创建sequelize默认数据源配置文件
		Fs.writeFileSync(
			Path.join(
				this.config.root,
				this.config.name,
				"database",
				"config.json"
			),
			JSON.stringify(
				{
					development: {
						username: this.config.databases[0].username,
						password: this.config.databases[0].password,
						database: this.config.databases[0].database,
						host: this.config.databases[0].host,
						port: this.config.databases[0].port,
						dialect: "mysql"
					}
				},
				undefined,
				2
			)
		)
		// 创建访问白名单配置文件
		Fs.writeFileSync(
			Path.join(
				this.config.root,
				this.config.name,
				"config",
				"domainWhiteList.json"
			),
			JSON.stringify(this.config.whiteList, undefined, 2)
		)
		// 创建egg扩展配置文件
		Fs.writeFileSync(
			Path.join(
				this.config.root,
				this.config.name,
				"config",
				"plugin.js"
			),
			genPluginConfig(this.config)
		)
		// 创建应用钩子文件
		Fs.writeFileSync(
			Path.join(this.config.root, this.config.name, "app.js"),
			genAppHook(this.config)
		)
	}

	/**
	 * 路由与接口生成
	 */
	genAPIandRouter() {
		// 生成总路由文件
		Fs.writeFileSync(
			Path.join(this.config.root, this.config.name, "app", "router.js"),
			genMainRouter(this.config)
		)
		this.config.serviceDesignDatas.forEach((ns) => {
			// 生成子路由文件
			Fs.writeFileSync(
				Path.join(
					this.config.root,
					this.config.name,
					"app",
					"router",
					`${ns.name}.js`
				),
				genSubRouter(ns)
			)
			ns.children.forEach((model) => {
				// 生成控制层文件
				Fs.writeFileSync(
					Path.join(
						this.config.root,
						this.config.name,
						"app",
						"controller",
						ns.name,
						`${model.name}.js`
					),
					genController(ns.name, model.name, model.children)
				)
				// 生成业务层文件
				Fs.writeFileSync(
					Path.join(
						this.config.root,
						this.config.name,
						"app",
						"service",
						ns.name,
						`${model.name}.js`
					),
					genService(model.name, model.children)
				)
			})
		})
	}

	/**
	 * 创建目录
	 */
	makeDir(path, option) {
		for (let item of option) {
			ChildProcess.execSync(`cd ${path} && mkdir ${item.name}`)
			if (item.children.length) {
				this.makeDir(Path.join(path, item.name), item.children)
			}
		}
	}
}

module.exports = Structure
