/**
 * @Description: 应用对象扩展
 * @Author: chenchen
 * @Date: 2021-02-20 17:33:40
 * @LastEditors: chenchen
 * @LastEditTime: 2021-04-01 17:08:35
 */
module.exports = {
	setStorage(key, val) {
		this.messenger.sendToApp("updApplicationStorage", { key, val })
	},
	_DYNAMIC_CONF: {}
}
