/**
 * @Description: express server
 * @Author: chenchen
 * @Date: 2021-03-12 14:17:03
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-12 14:58:20
 */
const express = require("express")
const app = express()
const path = require("path")
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
		console.log(__dirname)
		// josn parser
		app.use(body_parser.json())

		// create server listen
		const server = app.listen(port, function () {
			console.log("Listening on port %d\n", server.address().port)
		})
		return app
	}
}
