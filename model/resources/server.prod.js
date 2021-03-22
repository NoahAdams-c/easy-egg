/**
 * @Description:
 * @Author: bubao
 * @Date: 2019-11-09 04:21:53
 * @LastEditors: chenchen
 * @LastEditTime: 2020-12-28 18:04:24
 */
// server.js
const egg = require('egg')

// const workers = Number(process.argv[2] || require('os').cpus().length)
egg.startCluster({
    workers: 23,
    baseDir: __dirname,
    sticky: false,
    NODE_ENV: 'prod'
})
// pm2 start server.js --name eyuai-open-api
