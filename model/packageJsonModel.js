/**
 * @Description: 项目包配置文件模板
 * @Author: chenchen
 * @Date: 2021-03-19 18:02:05
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-22 16:04:44
 */
const origin = {
	name: "",
	version: "1.0.0",
	description: "",
	author: "",
	private: true,
	dependencies: {
		axios: "^0.21.1",
		egg: "^2.29.1",
		"egg-cors": "^2.2.3",
		"egg-easy-jwt": "^1.0.1",
		"egg-scripts": "^2.5.0",
		"egg-sequelize": "^4.0.2",
		lodash: "^4.17.20",
		md5: "^2.3.0",
		moment: "^2.29.1",
		mysql2: "^2.2.5"
	},
	devDependencies: {
		autod: "^3.0.1",
		"autod-egg": "^1.0.0",
		"egg-bin": "^4.3.7",
		"egg-mock": "^3.19.2",
		eslint: "^4.18.1",
		"eslint-config-egg": "^7.0.0",
		"factory-girl": "^5.0.2",
		"sequelize-cli": "^4.0.0"
	},
	engines: {
		node: ">=8.0.0"
	},
	scripts: {
		pm2dev: "node server.js",
		pm2prod: "node server.prod.js",
		autod: "autod",
		lint: "eslint .",
		test: "egg-bin test",
		cov: "egg-bin cov",
		ci:
			"npm run lint && NODE_ENV=test npx sequelize db:migrate && npm run cov"
	},
	ci: {
		version: "8"
	},
	eslintIgnore: ["coverage", "dist"],
	repository: {
		type: "git",
		url: ""
	},
	files: ["lib", "index.js"]
}

module.exports = (props, isWin) => {
	origin.name = props.name
	origin.author = props.author
	origin.description = props.description
	origin.repository.url = props.repository
	origin.scripts.dev = isWin
		? "egg-bin dev --env=local"
		: "EGG_SERVER_ENV=local egg-bin dev"
	origin.scripts.prod = isWin
		? "egg-bin dev --env=prod"
		: "EGG_SERVER_ENV=prod egg-bin dev"
	if (props.extends.includes("consul")) {
		origin.dependencies["consul"] = "^0.40.0"
	}
	return origin
}
