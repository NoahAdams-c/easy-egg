#### v1.0.0
初始化

#### v1.0.1
修复：命令无法使用

#### v1.0.2
界面基本完成; 测试本地路径获取

#### v1.0.3
本地路径获取完成，配置界面全部完成

#### v1.0.4
修复windows环境路径错误，优化页面样式

#### v1.0.5
清除测试数据，修复路径样式bug

#### v1.1.0
完成第一版所有功能，可正常创建项目并运行

#### v1.1.1
修复项目目录结构初始化时目录名错误

#### v1.1.2
修复项目目录结构初始化时资源文件目录错误

#### v1.1.3
清除测试数据与测试日志

#### v1.1.4
修复windows使用脚本时环境参数使用不正确的问题

#### v1.1.5
修复资源文件提交被忽略问题

#### v1.1.6
新增egg应用对象扩展在单机多进程集群使用的适配逻辑

#### v1.1.7
优化应用对象扩展在单机多进程集群使用的适配逻辑：
  1. 可使用链式访问方式
  2. 使用Promise等待更新完成再返回，以免在更新应用对象完成前访问到旧数据

#### v1.1.8
修改"项目名称"项的验证规则