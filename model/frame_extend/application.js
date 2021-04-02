/**
 * @Description: 应用对象扩展
 * @Author: chenchen
 * @Date: 2021-02-20 17:33:40
 * @LastEditors: chenchen
 * @LastEditTime: 2021-04-02 14:45:59
 */
module.exports = {
	/**
	 * 更新应用对象属性值
	 * @param {String} key 属性名或访问链，如user.id
	 * @param {*} val 值
	 */
	async setStorage(key, val) {
		this.messenger.sendToApp("updApplicationStorage", { key, val })
		await new Promise((resolve) => {
			this.messenger.on("updApplicationStorageFinish", resolve)
		})
	},
	_DYNAMIC_CONF: {}
}
