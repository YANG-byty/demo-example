<template>
  <Modal v-model="visible" :footer-hide="true" :closable="false">
    <div class="row-between flex-row">
      <img class="img-close" @click="beforeClose" src="@/assets/img/close.png" alt="" />
      <div class="left-warp">
        <div class="title"><span>模型说明</span></div>
        <div class="wrap">
          <div class="model-wrap row-between flex-row col-center" v-for="(item, index) in modelList" :key="index">
            <div class="model-name">{{ item.name }}</div>
            <div class="model-text">
              <p class="omit">{{ item.remark }}</p>
            </div>
          </div>
        </div>
        <div class="title"><span>预警统计</span></div>
        <div class="chart-wrap row-between flex-row col-center">
          <div id="modal-chart"></div>
          <div class="chart-legend row-between flex-row col-center">
            <div :class="[index == 0 ? 'left' : '', 'legend', 'row-center']" v-for="(item, index) in statisticsList" :key="index">
              <div>{{ item.type }}</div>
              <div>
                <span>{{ item.count }}</span> 条
              </div>
              <Progress :percent="Number(item.percentage.split('%')[0])" hide-info />
              <div>{{ item.percentage }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-warp">
        <div class="title"><span>预警内容</span></div>
        <div class="common-table">
          <div class="table">
            <Table :columns="warningColumns" :loading="warningLoading" :data="warningList">
              <template slot-scope="{ row, index }" slot="status">
                <span :class="row.status == '红' ? 'red' : 'yellow'">{{ row.status }}</span>
              </template>
            </Table>
          </div>
        </div>
        <div class="common-page align-right">
          <Page :current="warningParams.page" :total="warningTotal" show-total @on-change="warningPageCurrentChangeHandle" />
        </div>
        <div class="title"><span>处理情况</span></div>
        <div class="common-table">
          <div class="table">
            <Table :columns="columns" :loading="loading" :data="dataList" no-data-text="暂无数据（省级平台对接中）" />
          </div>
        </div>
        <div class="common-page align-right">
          <Page :current="params.page" :total="total" show-total @on-change="pageCurrentChangeHandle" />
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import * as echarts from 'echarts';
import * as requestRefers from '@/api/common';
export default {
  name: 'floating-window',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    flagName: {
      type: String,
      default: 'forestry'
    },
    parameter: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      visible: false,
      modelList: [],
      warningList: [],
      warningColumns: [
        {
          title: '类型',
          align: 'center',
          width: 70,
          slot: 'status'
        },
        // {
        //   title: '监督对象',
        //   key: 'name',
        //   align: 'left',
        //   minWidth: 120
        // },
        {
          title: '预警内容',
          key: 'warningContent',
          align: 'left',
          minWidth: 360,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '预警时间',
          key: 'warningTime',
          align: 'center',
          minWidth: 120
        },
        {
          title: '处理状态',
          key: 'disposeStatusStr',
          align: 'left',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        }
      ],
      warningTotal: 0,
      warningLoading: false,
      warningParams: {
        size: 10,
        page: 1
      },
      dataList: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 70
        },
        {
          title: '信访人姓名',
          key: 'name',
          align: 'center',
          minWidth: 90
        },
        {
          title: '单位',
          key: 'unit',
          align: 'center',
          minWidth: 150,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '职务',
          key: 'position',
          align: 'center',
          minWidth: 120
        },
        {
          title: '处理措施',
          key: 'disposeMeasure',
          align: 'center',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '处理时间',
          key: 'disposeTime',
          align: 'center',
          minWidth: 170
        }
      ],
      total: 0,
      loading: false,
      params: {
        size: 10,
        page: 1
      },
      statisticsList: []
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.resetFn();
        this.getDetails();
        this.getWarningStatisticsFn();
        this.getWarningContentFn();
        this.getDisposeConditionModelFn();
      }
    },
    visible(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    beforeClose() {
      this.visible = false;
    },
    // 分页
    warningPageCurrentChangeHandle(data) {
      this.warningParams.page = data;
      this.getWarningContentFn();
    },
    // 分页
    pageCurrentChangeHandle(data) {
      this.params.page = data;
      this.getDisposeConditionModelFn();
    },
    // 模型说明
    modalChart(data) {
      let myChart = echarts.init(document.getElementById('modal-chart'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let datas = [];
      data.map((item) => {
        datas.push({
          value: item.count,
          name: item.type,
          percent: item.percentage
        });
      });

      let colors = ['#0263FF', '#F59A23'];
      let option = {
        grid: {
          bottom: 150,
          left: 0,
          right: '10%'
        },
        series: [
          // 主要展示层的
          {
            radius: ['10%', '90%'],
            center: ['50%', '50%'],
            type: 'pie',
            itemStyle: {
              normal: {
                color: function (params) {
                  return colors[params.dataIndex];
                }
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 15,
                length2: 120,
                lineStyle: {
                  color: '#d3d3d3'
                },
                align: 'right'
              },
              color: '#000',
              emphasis: {
                show: true
              }
            },
            label: {
              show: false
            },
            label: {
              normal: {
                position: 'inner',
                formatter: '{d}%',
                textStyle: {
                  color: '#fff',
                  fontWeight: 400,
                  fontSize: 14
                }
              }
            },
            data: datas
          }
        ]
      };
      myChart.setOption(option);
    },
    // 获取模型说明
    getDetails() {
      this.modelList = [];
      switch (this.flagName) {
        case 'forestry':
          requestRefers.getDetails({ id: this.parameter.forestryModelId }).then((res) => {
            this.modelList = [
              {
                name: '模型名称',
                remark: res.name
              },
              {
                name: '模型领域',
                remark: res.domain
              },
              {
                name: '廉政风险点',
                remark: res.incorruptGovernmentRisk
              },
              {
                name: '预警类型',
                remark: res.warningType == 1 ? '红色预警' : '黄色预警'
              },
              {
                name: '预警描述',
                remark: res.warningDescribe
              },
              {
                name: '预警规则',
                remark: res.warningRule
              }
            ];
          });
          break;
        case 'letter-visit':
          requestRefers.getLetterDetails({ id: this.parameter.petitionModelId }).then((res) => {
            this.modelList = [
              {
                name: '模型名称',
                remark: res.name
              },
              {
                name: '模型领域',
                remark: res.domain
              },
              {
                name: '廉政风险点',
                remark: res.incorruptGovernmentRisk
              },
              {
                name: '预警类型',
                remark: res.warningType == 1 ? '红色预警' : '流转预警'
              },
              {
                name: '预警描述',
                remark: res.warningDescribe
              },
              {
                name: '预警规则',
                remark: res.warningRule
              }
            ];
          });
          break;
        case 'sport':
          requestRefers.getSportDetails({ id: this.parameter.sportsModelId }).then((res) => {
            this.modelList = [
              {
                name: '模型名称',
                remark: res.name
              },
              {
                name: '模型领域',
                remark: res.domain
              },
              {
                name: '廉政风险点',
                remark: res.incorruptGovernmentRisk
              },
              {
                name: '预警类型',
                remark: res.warningType == 1 ? '红色预警' : '黄色预警'
              },
              {
                name: '预警描述',
                remark: res.warningDescribe
              },
              {
                name: '预警规则',
                remark: res.warningRule
              }
            ];
          });
          break;

        default:
          break;
      }
    },
    // 获取预警统计
    getWarningStatisticsFn() {
      let obj = {
        ...this.parameter
      };
      switch (this.flagName) {
        case 'forestry':
          requestRefers.getWarningStatistics(obj).then((res) => {
            this.statisticsList = res;
            this.$nextTick(() => {
              this.modalChart(res || []);
            });
          });
          break;
        case 'letter-visit':
          requestRefers.getLetterWarningStatistics(obj).then((res) => {
            this.statisticsList = res;
            this.$nextTick(() => {
              this.modalChart(res || []);
            });
          });
          break;
        case 'sport':
          requestRefers.getSportWarningStatistics(obj).then((res) => {
            this.statisticsList = res;
            this.$nextTick(() => {
              this.modalChart(res || []);
            });
          });
          break;

        default:
          break;
      }
    },
    // 获取预警内容
    getWarningContentFn() {
      this.warningList = [];
      this.warningTotal = 0;

      let obj = {
        ...this.parameter,
        ...this.warningParams
      };
      switch (this.flagName) {
        case 'forestry':
          this.warningLoading = true;
          requestRefers
            .getWarningContent(obj)
            .then((res) => {
              this.warningLoading = false;
              this.warningList = res.records || [];
              this.warningTotal = Number(res.total);
            })
            .catch((err) => {
              this.warningLoading = false;
            });
          break;
        case 'letter-visit':
          this.warningLoading = true;
          requestRefers
            .getLetterWarningContent(obj)
            .then((res) => {
              this.warningLoading = false;
              this.warningList = res.records || [];
              this.warningTotal = Number(res.total);
            })
            .catch((err) => {
              this.warningLoading = false;
            });
          break;
        case 'sport':
          this.warningLoading = true;
          requestRefers
            .getSportWarningContent(obj)
            .then((res) => {
              this.warningLoading = false;
              this.warningList = res.records || [];
              this.warningTotal = Number(res.total);
            })
            .catch((err) => {
              this.warningLoading = false;
            });
          break;

        default:
          break;
      }
    },
    // 获取处理情况
    getDisposeConditionModelFn() {
      this.dataList = [];
      this.total = 0;

      let obj = {
        ...this.parameter,
        ...this.params
      };
      switch (this.flagName) {
        case 'forestry':
          this.loading = true;
          requestRefers
            .getDisposeConditionModel(obj)
            .then((res) => {
              this.loading = false;
              this.dataList = res.records || [];
              this.total = Number(res.total);
            })
            .catch((err) => {
              this.loading = false;
            });
          break;
        case 'letter-visit':
          this.loading = true;
          requestRefers
            .getLetterDisposeConditionModel(obj)
            .then((res) => {
              this.loading = false;
              this.dataList = res.records || [];
              this.total = Number(res.total);
            })
            .catch((err) => {
              this.loading = false;
            });
          break;
        case 'sport':
          this.loading = true;
          requestRefers
            .getSportDisposeConditionModel(obj)
            .then((res) => {
              this.loading = false;
              this.dataList = res.records || [];
              this.total = Number(res.total);
            })
            .catch((err) => {
              this.loading = false;
            });
          break;

        default:
          break;
      }
    },
    resetFn() {
      this.warningParams = {
        size: 10,
        page: 1
      };
      this.params = {
        size: 10,
        page: 1
      };
    }
  },
  mounted() {}
};
</script>

<style src="./style.less" lang="less" scoped></style>
