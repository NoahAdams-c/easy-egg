/**
 * @Description: express server
 * @Author: chenchen
 * @Date: 2021-03-12 14:17:03
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-22 11:54:20
 */
const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const body_parser = require("body-parser")
const { port } = require("./config")
const Structure = require("./structure")

let structureInstance = null

module.exports = {
	/**
	 * init server
	 */
	getServerInstance: () => {
		// cors
		app.all("*", function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "*")
			res.header("Access-Control-Allow-Headers", "X-Requested-With")
			res.header(
				"Access-Control-Allow-Methods",
				"PUT,POST,GET,DELETE,OPTIONS"
			)
			res.header("X-Powered-By", " 3.2.1")
			next()
		})
		// 静态资源目录
		app.use(express.static(path.join(__dirname, "views")))
		// JSON解析
		app.use(body_parser.json())
		// ========>> 路由注册
		// 获取本地文件目录
		app.get("/files", (req, res) => {
			const currentPath = req.query.path
				? decodeURIComponent(req.query.path)
				: process.cwd()
			const dirents = fs.readdirSync(currentPath, { withFileTypes: true })
			const files = dirents.map((dirent) => {
				return {
					name: dirent.name,
					isDir: dirent.isDirectory()
				}
			})
			res.send({
				status: 0,
				currentPath,
				files,
				isWin: process.platform === "win32"
			})
		})
		// 构建项目实例
		app.post("/project/instance", (req, res) => {
			const config = req.body
			structureInstance = new Structure(config)
			res.send(structureInstance.config)
		})
		// 初始化项目目录
		app.post("/project/init", (req, res) => {
			structureInstance.init()
			res.send("ok")
		})
		// 生成项目配置
		app.post("/project/config", (req, res) => {
			structureInstance.generateConfig()
			res.send("ok")
		})
		// 生成接口路由
		app.post("/project/api", (req, res) => {
			structureInstance.genAPIandRouter()
			res.send("ok")
		})

		// create server listen
		const server = app.listen(port, function () {
			console.log("Listening on port %d\n", server.address().port)
		})
		return app
	}
}
