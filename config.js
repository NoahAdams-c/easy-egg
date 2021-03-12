/**
 * @Description: 配置文件
 * @Author: chenchen
 * @Date: 2020-02-25 15:58:24
 * @LastEditors: chenchen
 * @LastEditTime: 2020-11-26 16:54:05
 */

module.exports = {
	// current server port
	port: 12345,

	db_pool_config: {
		// acquireTimeout: 10000, // 获取连接的毫秒（默认：10000）
		waitForConnections: true, // 没有连接或达到最大连接时连接的形为。为true时，连接池会将连接排队以等待可用连接。为false将立即抛出错误（默认：true）
		connectionLimit: 10, // 单次可创建最大连接数（默认：10）
		queueLimit: 0 // 连接池的最大请求数，从getConnection方法前依次排队。设置为0将没有限制（默认：0）
	},

	db_config: [
		{
			user: "root",
			password: "960904",
			database: "D_TEST",
			host: "127.0.0.1",
			port: 3306
		},
		{
			user: "root",
			password: "3W.eyuai.org",
			database: "eyu-assistant",
			host: "43.240.204.74",
			port: 23401
		},
		{
			user: "root",
			password: "3W.eyuai.org",
			database: "eyu-ai-db",
			host: "43.240.204.74",
			port: 23401
		},
		{
			user: "eyuai",
			password: "log.eyuai.com.org",
			database: "eyu-log",
			host: "43.240.204.74",
			port: 23402
		}
	],

	// redis 配置
	redis_config: {
		host: "127.0.0.1",
		port: 6379,
		password: "960904"
		// db: '0'
	},

	SALT: "===Z1i5DPHZ1C7aqs1JBsiQ" // 加密盐
}
