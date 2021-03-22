/**
 * @Description: 项目目录结构模板
 * @Author: chenchen
 * @Date: 2021-03-19 10:47:27
 * @LastEditors: chenchen
 * @LastEditTime: 2021-03-22 13:51:05
 */
module.exports = (props) => {
	const modelsDir = props.databases.map((item) => {
		return {
			name: item.baseDir,
			children: []
		}
	})
	const namespacesDir = props.serviceDesignDatas.map((item) => {
		return {
			name: item.name,
			children: []
		}
	})
	return [
		{
			name: "app",
			children: [
				{
					name: "model",
					children: []
				},
				...modelsDir.slice(1),
				{
					name: "controller",
					children: namespacesDir
				},
				{
					name: "service",
					children: namespacesDir
				},
				{
					name: "extends",
					children: []
				},
				{
					name: "middleware",
					children: []
				},
				{
					name: "public",
					children: []
				},
				{
					name: "router",
					children: []
				}
			]
		},
		{
			name: "config",
			children: []
		},
		{
			name: "database",
			children: [
				{
					name: "migrations",
					children: []
				},
				{
					name: "seeders",
					children: []
				}
			]
		},
		{
			name: "test",
			children: []
		}
	]
}
