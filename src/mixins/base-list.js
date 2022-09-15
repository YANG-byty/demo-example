import request from '@/plugins/request';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      // 设置属性
      baseListOptions: {
        activatedIsNeed: true, // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '', // 数据列表接口，API地址
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        getDetailURL: '', //详情接口地址
        detailByKey: 'id', //详情接口地址
        indate: ['', ''],
        firstItem: false, //
        userCallback: false, //列表是否需要回显
        showCommonDetailModel: false, // 详情弹框显隐
        showCommonAddOrEditModel: false, // 添加编辑弹框显隐
        commonDetailInfo: {}, // 详情
        tablefirstItemHighlight: false, //第一条数据是否高亮
        curHighlightItem: {}, //第一条高亮的数据
        oneDeleteURL: '', // 删除接口，API地址
        oneDeleteByKey: 'id', // 删除接口，由那个key进行标记操作？比如：pid，uid...
        batchDeleteURL: '', // 批量删除接口，API地址
        batchDeleteByKey: 'strList', // 删除接口，由那个key进行标记操作？比如：pid，uid...
        exportURL: '', // 导出接口，API地址
        // 默认属性
        columns: [], // 列表标签
        dataForm: {}, // 查询条件
        defaultDataForm: {},
        dataList: [], // 数据列表
        page: 1, // 当前页码
        limit: 10, // 每页数
        total: 0, // 总条数
        listReqType: 'get',
        delType: 'delete',
        curDelDesc: '该数据',
        expansionData: {}, //列表请求参数的扩展字段
        dataListLoading: false, // 数据列表，loading状态
        dataListSelections: [] // 数据列表，多选项
      },
      currentPageTitle: ''
    };
  },
  created() {
    this.currentPageTitle = this.$route.meta.title;
    if (this.baseListOptions.activatedIsNeed) {
      this.getDataList();
    }
  },
  methods: {
    //获取列表数据
    getDataList() {
      return new Promise((resolve, reject) => {
        this.baseListOptions.dataListLoading = true;
        let dataForm = Object.assign({}, this.baseListOptions.dataForm);
        for (let i in dataForm) {
          if (dataForm[i] == '-1') {
            dataForm[i] = '';
          }
        }
        let params = {
          page: this.baseListOptions.getDataListIsPage ? this.baseListOptions.page : null,
          limit: this.baseListOptions.getDataListIsPage ? this.baseListOptions.limit : null,
          ...dataForm,
          ...this.baseListOptions.defaultDataForm,
          startTime: this.baseListOptions.indate[0] ? `${dayjs(this.baseListOptions.indate[0]).format('YYYY-MM-DD')} 00:00` : '',
          endTime: this.baseListOptions.indate[1] ? `${dayjs(this.baseListOptions.indate[1]).format('YYYY-MM-DD')} 23:59` : '',
          ...this.baseListOptions.expansionData
        };

        let config = {
          url: this.baseListOptions.getDataListURL,
          method: this.baseListOptions.listReqType
        };
        if (this.baseListOptions.listReqType == 'get') {
          config.params = params;
        } else {
          config.data = params;
        }
        request(config)
          .then((res) => {
            this.baseListOptions.dataListLoading = false;
            if (this.baseListOptions.getDataListIsPage) {
              if (!res) {
                this.baseListOptions.dataList = [];
                this.baseListOptions.total = 0;
                resolve([]);
                return false;
              }
              if (!res.list) {
                this.baseListOptions.dataList = [];
                this.baseListOptions.total = 0;
                resolve([]);
                return false;
              }
              this.baseListOptions.dataList = res.list;

              this.baseListOptions.total = res.total;
              if (this.baseListOptions.userCallback) {
                this.updateChecked();
              }
              if (this.baseListOptions.tablefirstItemHighlight && this.baseListOptions.page === 1) {
                this.baseListOptions.dataList[0]['_highlight'] = true;
                this.baseListOptions.curHighlightItem = res.list[0];
                if (this.baseListOptions.expansionData.isModelPer) {
                  this.getRulesDetails();
                }
              }
              resolve(res.list);
            } else {
              this.baseListOptions.dataList = res;
              resolve(res);
            }
          })
          .catch(() => {
            this.baseListOptions.dataListLoading = false;
          });
      });
    },
    //搜索
    handleSearch() {
      this.baseListOptions.page = 1;
      this.getDataList();
    },
    //重置
    handleReset() {
      this.baseListOptions.dataForm = {};
      this.baseListOptions.indate = [];
      // this.baseListOptions.expansionData = {};
      this.getDataList();
    },
    //分页
    handleChangePage(page) {
      this.baseListOptions.page = page;
      this.getDataList();
    },
    //change page size
    handleChangePageSize(size) {
      this.baseListOptions.page = 1;
      this.baseListOptions.limit = size;
      this.getDataList();
    },

    //获取弹窗详情数据
    getDetailsData(data) {
      request({
        url: `${this.baseListOptions.getDetailURL}/${data[this.baseListOptions.detailByKey]}`,
        method: 'get'
      }).then((res) => {
        this.baseListOptions.showCommonDetailModel = true;
        this.baseListOptions.commonDetailInfo = res;
      });
    },
    //删除
    deleteListData(data) {
      let str = `您确认要删除<strong>${this.baseListOptions.curDelDesc}</strong>吗？`;
      this.$Modal.confirm({
        title: '删除确认',
        content: str,
        onOk: () => {
          let config = {
            method: this.baseListOptions.delType
          };
          if (this.baseListOptions.delType == 'post') {
            config.url = this.baseListOptions.oneDeleteURL;
            config.data = { id: data.id };
          } else {
            config.url = `${this.baseListOptions.oneDeleteURL}/${data[this.baseListOptions.oneDeleteByKey]}`;
          }
          request(config).then((res) => {
            this.Message.success('操作成功');
            this.getDataList();
          });
        }
      });
    }
  }
};
