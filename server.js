/**
 * @Description: express server
 * @Author: chenchen
 * @Date: 2021-03-12 14:17:03
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-16 17:40:12
 */
const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const body_parser = require("body-parser")
const { port } = require("./config")

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
		// static
		app.use(express.static(path.join(__dirname, "views")))
		// josn parser
		app.use(body_parser.json())

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

		// create server listen
		const server = app.listen(port, function () {
			console.log("Listening on port %d\n", server.address().port)
		})
		return app
	}
}
