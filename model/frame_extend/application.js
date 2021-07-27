/**
 * @Description: 应用对象扩展
 * @Author: chenchen
 * @Date: 2021-02-20 17:33:40
 * @LastEditors: chenchen
 * @LastEditTime: 2021-07-26 15:12:25
 */
module.exports = {
  /**
   * 更新应用对象属性值
   * @param {String} key 属性名或访问链，如user.id
   * @param {*} val 值
   */
  async setStorage(key, val) {
    this.messenger.sendToApp('updApplicationStorage', { key, val })
    await new Promise(resolve => {
      this.messenger.on('updApplicationStorageFinish', resolve)
    })
  },
  apiDesignInfo: {},
  _DYNAMIC_CONF: {}
}
