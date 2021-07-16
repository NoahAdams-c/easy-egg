const HOST = 'http://127.0.0.1:12345'

new Vue({
  el: '#app',

  data: {
    // 是否为windows平台
    isWin: false,
    // 是否确认创建项目
    isConfirmNewProject: false,
    // 是否确认修改已有项目
    isConfirmEditProject: false,
    // 已存在项目列表
    existsProjectsInfo: [],
    // 当前配置步骤
    curConfigStep: 1,
    // 目录选择文件列表
    fileList: [],
    // 选择的保存目录
    savePath: '',
    // 是否展示保存目录选择弹窗
    isPathChoiseDialogShow: false,
    // 项目基本信息表单对象
    baseInfoForm: {
      projectKeys: '',
      projectName: '',
      projectAuthor: '',
      projectDescrption: '',
      projectSavePath: '',
      projectRepository: '',
      projectType: 'http'
    },
    // 项目基本信息表单验证规则
    baseInfoRules: {
      projectName: [
        {
          required: true,
          message: '必须填写项目名称哦！',
          trigger: 'change'
        },
        {
          pattern: /^(\w|\-){4,20}$/,
          message: '项目名称必须由4-20位数字、字母、下划线、短杠组成哦！',
          trigger: 'change'
        }
      ],
      projectSavePath: [
        {
          required: true,
          message: '必须填写项目保存路径哦！',
          trigger: 'change'
        }
      ]
    },
    // 项目配置与扩展折叠面板激活项
    configCollapseActives: ['serverConfig'],
    // 服务配置表单对象
    serverConfigForm: {
      serverPort: '7007',
      serverWhiteList: ''
    },
    // 数据库配置列表
    dbConfigList: [],
    // 数据库配置弹窗是否展示
    isDBConfigDialogShow: false,
    // 数据库配置表单对象
    dbConfigForm: {
      username: '',
      password: '',
      database: '',
      host: '127.0.0.1',
      port: '3306'
    },
    // 是否正在加载表数据
    isLoadingTableData: false,
    // 数据源中的所有的表
    tables: [],
    // 数据源中将生成模型的表
    modelTables: [],
    // 数据库配置表单验证规则
    dbConfigRules: {
      username: [
        {
          required: true,
          message: '必须填写数据库登录用户名哦！',
          trigger: 'change'
        }
      ],
      database: [
        {
          required: true,
          message: '必须填写数据库名哦！',
          trigger: 'change'
        }
      ],
      host: [
        {
          required: true,
          message: '必须填写数据库地址哦！',
          trigger: 'change'
        }
      ]
    },
    // 可选插件扩展
    extendComponets: [
      {
        key: 'sequelize',
        label: 'Sequelize',
        disabled: true
      },
      {
        key: 'jwt',
        label: 'JWT鉴权',
        disabled: true
      },
      {
        key: 'errorhandler',
        label: '全局错误捕捉中间件',
        disabled: true
      },
      {
        key: 'contexthandler',
        label: '请求上下文中间件',
        disabled: true
      },
      {
        key: 'checkparams',
        label: '参数检测中间件',
        disabled: true
      },
      {
        key: 'checkauth',
        label: '鉴权检测中间件',
        disabled: true
      },
      {
        key: 'unittest',
        label: '单元测试',
        disabled: true
      },
      {
        key: 'remotelogger',
        label: '日志入库',
        disabled: true
      },
      {
        key: 'consul',
        label: '服务健康监测'
      }
    ],
    // 已选插件扩展
    selectedExtends: [
      'jwt',
      'sequelize',
      'errorhandler',
      'contexthandler',
      'checkparams',
      'checkauth',
      'remotelogger'
    ],
    // 业务设计步骤
    serviceDesignSteps: ['命名空间', '模块', '接口方法'],
    // 业务设计当前所在步骤
    curServiceDesignStep: 1,
    // 新增业务设计项(命名空间、模块、接口方法)名
    newDesignName: '',
    // 当前选择的业务设计项数组
    selectedDesignNames: [],
    // 业务设计数据(三层树状结构，依次为命名空间、模块、接口方法)
    serviceDesignDatas: [],
    // 接口设计表单弹窗是否显示
    isAPIDesignDialogShow: false,
    // 接口设计表单对象
    APIDesignForm: {
      name: '',
      description: '',
      needAuth: true,
      routerName: '',
      methods: 'get',
      requiredParams: '',
      notRequiredParams: '',
      expectResponse: ''
    },
    // 接口设计表单验证规则
    APIDesignRules: {
      name: [
        {
          required: true,
          message: '必须填写接口方法名哦！',
          trigger: 'change'
        }
      ],
      description: [
        {
          required: true,
          message: '必须填写接口描述哦！',
          trigger: 'change'
        }
      ],
      routerName: [
        {
          required: true,
          message: '必须填写路由名哦！',
          trigger: 'change'
        }
      ]
    },
    // 配置预览导航是否展开
    isPreviewNavUnfold: null,
    // 生成项目进度弹窗是否显示
    isProgressDialogShow: false,
    // 当前项目生成进度
    genProjectPercentage: 0,
    // 当前项目生成状态
    genProjectStatus: 'success'
  },

  created() {
    // 获取当前目录下（3层内）已存在的eegg项目
    this.getExistsProject()
  },

  computed: {
    // 业务设计面包屑
    serviceDesignBreadcrumb() {
      return this.serviceDesignSteps.slice(0, this.curServiceDesignStep)
    },
    // 业务设计列表数据
    serviceDesignList() {
      return this.curServiceDesignStep === 1
        ? this.serviceDesignDatas
        : this.searchServiceDesignData(
            this.selectedDesignNames[this.curServiceDesignStep - 2]
          ).children
    },
    // 指定接口数据
    APIData() {
      let data = null
      if (this.selectedDesignNames[2]) {
        data = this.searchServiceDesignData(this.selectedDesignNames[2])
      }
      return data
    }
  },

  methods: {
    /**
     * 获取当前目录下（3层内）已存在的eegg项目
     */
    async getExistsProject() {
      const res = await axios
        .get(`${HOST}/projects`)
        .then(res => res.data)
        .catch(err => err.response.data)
      if (res && res.status === 0) {
        this.existsProjectsInfo = res.exists
      }
    },

    /**
     * 打开已有项目，初始化项目信息
     */
    openExistProject(info) {
      this.baseInfoForm = {
        projectKeys: info.keys,
        projectName: info.name,
        projectAuthor: info.author,
        projectDescrption: info.description,
        projectSavePath: info.root,
        projectRepository: info.repository,
        projectType: info.type
      }
      this.serverConfigForm = {
        serverPort: info.port,
        serverWhiteList: info.whiteList.join('\n')
      }
      this.dbConfigList = info.databases
      this.selectedExtends = info.extends
      this.serviceDesignDatas = info.serviceDesignDatas
      this.isConfirmEditProject = true
    },

    /**
     * 展示/隐藏表下拉框时触发
     */
    async onTableSelectorVisibleChange(visible) {
      if (visible) {
        await this.$refs['dbConfigForm'].validate()
        flag = await this.$refs['dbConfigForm'].validate()
        if (!flag) return false
        // 当展示下拉框时拉取表数据
        this.isLoadingTableData = true
        const res = await axios
          .get(`${HOST}/tables`, {
            params: {
              username: this.dbConfigForm.username,
              password: this.dbConfigForm.password,
              dbName: this.dbConfigForm.database,
              host: this.dbConfigForm.host,
              port: this.dbConfigForm.port
            }
          })
          .then(res => res.data)
          .catch(err => err.response.data)
        if (res && res.status === 0) {
          this.tables = res.tables
        }
        this.isLoadingTableData = false
      }
    },

    /**
     * 新增数据库配置
     */
    async addDBConfig() {
      await this.$refs['dbConfigForm'].validate()
      flag = await this.$refs['dbConfigForm'].validate()
      if (!flag) return
      let modelConfig = {}
      if (this.dbConfigList.length > 0) {
        modelConfig = {
          delegate: `${this.dbConfigForm.database.toLowerCase()}Model`,
          baseDir: `${this.dbConfigForm.database.toLowerCase()}_model`
        }
      }
      this.dbConfigList.push(
        JSON.parse(
          JSON.stringify({
            ...this.dbConfigForm,
            ...modelConfig,
            dialect: 'mysql',
            timezone: '+08:00',
            modelTables: this.modelTables
          })
        )
      )
      this.onDBConfigDialogClose()
    },

    /**
     * 关闭数据库配置弹窗触发
     */
    onDBConfigDialogClose() {
      this.$refs['dbConfigForm'].resetFields()
      this.tables = []
      this.modelTables = []
      this.isDBConfigDialogShow = false
    },

    /**
     * 完成基本信息
     */
    async finishBaseInfo() {
      await this.$refs['baseInfoForm'].validate()
      flag = await this.$refs['baseInfoForm'].validate()
      if (!flag) return
      this.baseInfoForm.projectKeys = `${
        this.baseInfoForm.projectName
      }_${Date.now()}`
      // console.log("baseInfoForm", this.baseInfoForm)
      this.curConfigStep++
    },

    /**
     * 完成服务配置
     */
    finishServerConfig() {
      if (!this.dbConfigList.length) {
        this.$message.error('请至少配置一个数据源哦')
        this.configCollapseActives = ['DBConfig']
        return
      }
      // console.log("serverConfigForm", this.serverConfigForm)
      // console.log("dbConfigList", this.dbConfigList)
      // console.log("selectedExtends", this.selectedExtends)
      this.curConfigStep++
    },

    /**
     * 完成业务设计
     */
    finishServiceDesign() {
      // console.log("serviceDesignDatas", this.serviceDesignDatas)
      this.curConfigStep++
    },

    /**
     * 获取指定业务设计项下的业务设计数据
     * @param {String} name 指定业务设计项名
     * @param {String} list 起始层业务设计数据列表
     */
    searchServiceDesignData(name, list) {
      let originList = list || this.serviceDesignDatas
      for (let item of originList) {
        if (item.name === name) {
          return item
        }
        if (item.children) {
          const res = this.searchServiceDesignData(name, item.children)
          if (res) {
            return res
          }
        }
      }
      return null
    },

    /**
     * 面包屑跳转
     */
    breadcrumbJump(step) {
      this.curServiceDesignStep = step
    },

    /**
     * 下一步业务设计
     */
    nextSeviceDesign(name) {
      this.selectedDesignNames[this.curServiceDesignStep - 1] = name
      this.curServiceDesignStep++
    },

    /**
     * 预览接口
     */
    reviewAPI(name) {
      this.selectedDesignNames.splice(2, 1, name)
    },

    /**
     * 新增接口
     */
    addAPI() {
      this.selectedDesignNames.splice(2, 1)
      this.isAPIDesignDialogShow = true
    },

    /**
     * 编辑接口
     */
    editAPI(name) {
      this.selectedDesignNames.splice(2, 1, name)
      // console.log(this.APIData)
      this.APIDesignForm = {
        name: this.APIData.name,
        description: this.APIData.description,
        needAuth: this.APIData.needAuth,
        routerName: this.APIData.routerName,
        methods: this.APIData.methods,
        requiredParams: this.APIData.requiredParams.join('\n'),
        notRequiredParams: this.APIData.notRequiredParams.join('\n'),
        expectResponse: this.APIData.expectResponse.join('\n')
      }
      this.isAPIDesignDialogShow = true
    },

    /**
     * 删除接口
     */
    deleteAPI(name) {
      this.selectedDesignNames.splice(2, 1)
      const newAPIList = this.serviceDesignList.filter(
        item => item.name !== name
      )
      for (let ns of this.serviceDesignDatas) {
        if (ns.name === this.selectedDesignNames[0]) {
          for (let module of ns.children) {
            if (module.name === this.selectedDesignNames[1]) {
              module.children = newAPIList
              break
            }
          }
          break
        }
      }
    },

    /**
     * 新增业务设计项
     */
    addSeviceDesignItem() {
      if (!/^\w+$/.test(this.newDesignName)) {
        this.$message.error(
          `${
            this.serviceDesignBreadcrumb[
              this.serviceDesignBreadcrumb.length - 1
            ]
          }名只允许单词字符哦`
        )
        return
      }
      if (this.curServiceDesignStep === 1) {
        this.serviceDesignDatas.push({
          name: this.newDesignName,
          children: []
        })
      } else {
        for (let item of this.serviceDesignDatas) {
          if (item.name === this.selectedDesignNames[0]) {
            item.children.push({
              name: this.newDesignName,
              children: []
            })
            break
          }
        }
      }
      // this.nextSeviceDesign(this.newDesignName)
      this.newDesignName = ''
    },

    /**
     * 新增/修改接口设计
     */
    async addOrEditAPIDesign() {
      await this.$refs['APIDesignForm'].validate()
      flag = await this.$refs['APIDesignForm'].validate()
      if (!flag) return
      // console.log("APIDesignForm", this.APIDesignForm)
      outerLoop: for (let ns of this.serviceDesignDatas) {
        if (ns.name === this.selectedDesignNames[0]) {
          for (let module of ns.children) {
            if (module.name === this.selectedDesignNames[1]) {
              for (let index in module.children) {
                if (
                  module.children[index].name === this.selectedDesignNames[2]
                ) {
                  // 已存在，修改
                  module.children[index] = {
                    name: this.APIDesignForm.name,
                    description: this.APIDesignForm.description,
                    needAuth: this.APIDesignForm.needAuth,
                    routerName: this.APIDesignForm.routerName,
                    methods: this.APIDesignForm.methods,
                    requiredParams: this.APIDesignForm.requiredParams
                      .split(/\s/)
                      .filter(item => !!item),
                    notRequiredParams: this.APIDesignForm.notRequiredParams
                      .split(/\s/)
                      .filter(item => !!item),
                    expectResponse: this.APIDesignForm.expectResponse
                      .split(/\s/)
                      .filter(item => !!item)
                  }
                  break outerLoop
                }
              }
              // 不存在，新增
              module.children.push({
                name: this.APIDesignForm.name,
                description: this.APIDesignForm.description,
                needAuth: this.APIDesignForm.needAuth,
                routerName: this.APIDesignForm.routerName,
                methods: this.APIDesignForm.methods,
                requiredParams: this.APIDesignForm.requiredParams
                  .split(/\s/)
                  .filter(item => !!item),
                notRequiredParams: this.APIDesignForm.notRequiredParams
                  .split(/\s/)
                  .filter(item => !!item),
                expectResponse: this.APIDesignForm.expectResponse
                  .split(/\s/)
                  .filter(item => !!item)
              })
              break outerLoop
            }
          }
        }
      }
      this.isAPIDesignDialogShow = false
    },

    /**
     * 关闭接口设计弹窗触发
     */
    onAPIDesignDialogClose() {
      this.$refs['APIDesignForm'].resetFields()
      this.isAPIDesignDialogShow = false
    },

    /**
     * 获取文件列表
     */
    async getFileList(path) {
      const p = path || this.baseInfoForm.projectSavePath
      const result = await axios
        .get(`${HOST}/files${p ? '?path=' + encodeURIComponent(p) : ''}`)
        .then(res => res.data)
        .catch(err => err.response.data)
      if (result.status === 0) {
        this.savePath = result.currentPath
        this.fileList = result.files
        this.isWin = result.isWin
      }
    },

    /**
     * 打开目录
     */
    openDir(file) {
      if (!file.isDir) {
        return
      }
      let path = ''
      if (this.isWin) {
        path = `${this.savePath}${
          /^\w{1}:\\$/.test(this.savePath) ? '' : '\\'
        }${file.name}`
      } else {
        path = `${this.savePath}${this.savePath === '/' ? '' : '/'}${file.name}`
      }
      this.getFileList(path)
    },

    /**
     * 返回上一级目录
     */
    goBack() {
      let pathSplit = []
      if (this.isWin) {
        pathSplit = this.savePath.split('\\')
      } else {
        pathSplit = this.savePath.split('/')
      }
      if (!pathSplit[1]) {
        return
      }
      pathSplit.splice(-1, 1)
      let path = ''
      if (this.isWin) {
        path = `${pathSplit.join('\\')}${pathSplit.length > 1 ? '' : '\\'}`
      } else {
        path = `${pathSplit.length > 1 ? '' : '/'}${pathSplit.join('/')}`
      }
      this.getFileList(path)
    },

    /**
     * 确认保存路径
     */
    confirmSavePath() {
      // console.log("savePath", this.savePath)
      this.baseInfoForm.projectSavePath = this.savePath
      // console.log("baseInfoForm", this.baseInfoForm.projectSavePath)
      this.isPathChoiseDialogShow = false
    },

    /**
     * 构建项目
     */
    async structProject() {
      this.isProgressDialogShow = true
      await axios
        .post(`${HOST}/project/instance`, {
          root: this.baseInfoForm.projectSavePath,
          name: this.baseInfoForm.projectName,
          author: this.baseInfoForm.projectAuthor,
          description: this.baseInfoForm.projectDescrption,
          repository: this.baseInfoForm.projectRepository,
          type: this.baseInfoForm.projectType,
          keys: this.baseInfoForm.projectKeys,
          port: this.serverConfigForm.serverPort,
          whiteList: this.serverConfigForm.serverWhiteList
            .split(/\s/)
            .filter(item => !!item),
          databases: this.dbConfigList,
          extends: this.selectedExtends,
          serviceDesignDatas: this.serviceDesignDatas
        })
        .then(res => res.data)
        .catch(err => err.response.data)
      this.genProjectPercentage = 25
      await axios
        .post(`${HOST}/project/init`)
        .then(res => res.data)
        .catch(err => err.response.data)
      this.genProjectPercentage = 50
      await axios
        .post(`${HOST}/project/config`)
        .then(res => res.data)
        .catch(err => err.response.data)
      this.genProjectPercentage = 75
      await axios
        .post(`${HOST}/project/api`)
        .then(res => res.data)
        .catch(err => err.response.data)
      this.genProjectPercentage = 100
      setTimeout(() => {
        this.$alert('项目创建完成!', 'Congratulations', {
          confirmButtonText: '确定',
          center: true,
          callback: action => {
            this.genProjectPercentage = 0
            this.isProgressDialogShow = false
          }
        })
      }, 500)
    }
  }
})
