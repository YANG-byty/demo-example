import * as echarts from 'echarts';
import CircinateChart from '@/components/CircinateChart.vue';
import vueSeamlessScroll from 'vue-seamless-scroll';
import * as requestRefers from '@/api/forestry';
import { handalNumber, sortFn } from '@/libs/util';
export default {
  components: { vueSeamlessScroll, CircinateChart },
  data() {
    return {
      modelTypeList: [],
      modelTypeListActive: 0,
      listData: [],
      collapseList: [],
      issueList: [],
      tabBtnList: [],
      activeModel: 0,
      showModal: false,
      startTime: '',
      endTime: '',
      areaMapList: [],
      areaMapTabIndex: 0,
      areaMapTitle: '',
      areaId: '',
      warningConditionObj: {},
      forestryModelId: '',
      warningConditionnArr: [],
      disposeConditionArr: [],
      disposeResultArr: {},
      parameter: {},
      activeModelId: '',
      showMaxMap: false,
      maxMapObj: {}
    };
  },
  computed: {
    optionSingleHeightTime() {
      return {
        singleHeight: 41,
        waitTime: 3000
      };
    }
  },
  methods: {
    // 取消选中地图
    cancelMap(clear) {
      if (clear) {
        this.areaMapTabIndex = 0;
        this.areaMapTitle = '';
        this.areaId = '';
      }
      this.getModelType();
      this.getHighFrequencyFn();
      this.getWarningConditionFn();
      this.getDisposeConditionFn();
      this.getDisposeResultFn();
    },
    // 获取选择年份
    setTime(val) {
      this.startTime = val.startTime;
      this.endTime = val.endTime;
      this.getMaplist();
      this.getWarningCondition();
      this.getWarningModelFn();
      this.getHighFrequencyFn();
      this.getAreaContrastFn();
      this.getWarningConditionFn();
      this.getDisposeConditionFn();
      this.getDisposeResultFn();
    },
    // 显示悬浮框
    showModalFn(id) {
      if (id) {
        this.parameter = {
          forestryModelId: id,
          areaId: this.areaId,
          endTime: this.endTime,
          startTime: this.startTime
        };
        this.showModal = true;
      }
    },
    // 地图切换
    areaMapTabFn(index, item, flag) {
      if (flag) {
        if (this.areaMapTabIndex != index) {
          this.areaMapTabIndex = index;
          this.areaMapTitle = item.name;
          this.areaId = index == 0 ? '' : this.areaMapList[index - 1].id;
          if (index != 1) {
            this.showMaxMap = true;
            this.maxMapObj = item;
          }
        } else {
          this.cancelMap(true);
        }
        this.cancelMap(false);
      } else {
        if (this.areaMapTabIndex != index) {
          this.areaMapTabIndex = index;
          this.areaMapTitle = item.name;
          this.areaId = index == 0 ? '' : this.areaMapList[index - 1].id;
          this.cancelMap(false);
        }
        this.showMaxMap = false;
      }
    },
    // 点击具体模型
    activeModelFn(index, id) {
      if (this.activeModel == index) {
        return;
      }
      this.activeModel = index;
      this.activeModelId = id;
      this.getWarningConditionFn();
      this.getDisposeConditionFn();
      this.getDisposeResultFn();
      if (id) {
        this.collapseList.filter((item, idx) => {
          if (
            id == item.id &&
            (this.forestryModelId != this.collapseList[idx].id || this.forestryModelId == this.collapseList[idx].id) &&
            !this.collapseList[idx].isDropup
          ) {
            this.isDropupFn(idx);
          }
        });
      }
    },
    // 折叠
    isDropupFn(index) {
      this.forestryModelId = this.collapseList[index].id;
      this.collapseList[index].isDropup = !this.collapseList[index].isDropup;
      if (this.collapseList[index].isDropup) {
        this.listData = [];
        this.getWarningModelPageFn();
      }
      let arr = this.collapseList;

      this.collapseList = arr.map((item, idx) => {
        if (index != idx) {
          item.isDropup = false;
        }
        return item;
      });
    },
    // 预警情况类型切换
    modelTypeListFn(index) {
      this.modelTypeListActive = index;
      this.getModelType();
    },
    // 总预警量
    warningChart(data) {
      let myChart = echarts.init(document.getElementById('warning-chart'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let color = ['#ff4444', '#ffd159'];
      let echartData = [
        {
          name: '红色预警量',
          value: data.redWarning
        },
        {
          name: '黄色预警量',
          value: data.yellowWarning
        }
      ];

      let formatNumber = function (num) {
        let reg = /(?=(\B)(\d{3})+$)/g;
        return num.toString().replace(reg, ',');
      };
      let total = echartData.reduce((a, b) => {
        return a + b.value * 1;
      }, 0);

      let option = {
        color: color,
        tooltip: {
          trigger: 'item'
        },
        title: [
          {
            text: '{name|' + '}{val|' + formatNumber(total) + '}',
            top: 'center',
            left: 'center',
            textStyle: {
              rich: {
                name: {
                  fontSize: 14,
                  fontWeight: 'normal',
                  color: '#fff',
                  padding: [10, 0]
                },
                val: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#fff'
                }
              }
            }
          }
        ],
        series: [
          {
            type: 'pie',
            radius: ['45%', '60%'],
            center: ['50%', '50%'],
            data: echartData,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                borderWidth: 2
              }
            },
            labelLine: {
              show: false
            },
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    // 各区县预警情况对比
    countyChart(data) {
      let xData = [],
        arr = [[], []];
      data.map((item) => {
        xData.push(item.areaName);
        arr[0].push(item.yellowCount);
        arr[1].push(item.redCount);
      });
      let myChart = echarts.init(document.getElementById('county-chart'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        legend: {
          x: 'right',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        grid: {
          borderWidth: 0,
          top: 30,
          bottom: 22,
          textStyle: {
            color: '#fff'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: 'rgba(0,115,221,1)'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: 'rgba(255,255,255,1)',
              fontSize: 12
            },
            data: xData
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: 'rgba(255,255,255,1)',
              fontSize: 12
            },
            splitArea: {
              show: false
            },
            //分格线
            splitLine: {
              lineStyle: {
                type: 'dashed', //虚线
                color: '#0073DD',
                opacity: 0.5
              }
            }
          }
        ],
        series: [
          {
            name: '黄色预警',
            type: 'bar',
            stack: '总量',
            barMaxWidth: 22,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(235, 255, 0, 1)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(235, 255, 0, .2)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            data: arr[0]
          },
          {
            name: '红色预警',
            type: 'bar',
            stack: '总量',
            barMaxWidth: 22,
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(255, 92, 0, 1)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 92, 0, .2)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                },
                barBorderRadius: 0
              }
            },
            data: arr[1]
          }
        ]
      };
      myChart.setOption(option);
    },
    // 历年预警趋势对比
    overYearsChart(data) {
      let xData = [],
        arr = [];
      data.map((item) => {
        xData.push(item.year);
        arr.push(item.count);
      });
      let myChart = echarts.init(document.getElementById('overYears-chart'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let option = {
        tooltip: {
          trigger: 'axis',
          padding: 0,
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          },
          formatter: function (val) {
            let index = val[0].dataIndex;
            let list = data[index].areaJson;
            let keys = Object.keys(list);
            let values = Object.values(list);
            var text = `<div class="flex-row row-between" style="color:#00F0FF">丽水市 <span style="margin-left:10px">${data[index].count}条</span></div>`;
            keys.map((item, idx) => {
              text += `<div class="flex-row row-between">${item} <span style="margin-left:10px">${values[idx]}</span></div>`;
            });
            return `<div style="padding: 4px 8px;border: 1px solid #0073DD;border-radius: 4px;background: rgba(51,51,51,.6)">${text}</div>`;
          }
        },
        grid: {
          borderWidth: 0,
          top: 20,
          bottom: 22,
          textStyle: {
            color: '#fff'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: 'rgba(0,115,221,1)'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: 'rgba(255,255,255,1)',
              fontSize: 12
            },
            data: xData
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: 'rgba(255,255,255,1)',
              fontSize: 12
            },
            splitArea: {
              show: false
            },
            //分格线
            splitLine: {
              lineStyle: {
                type: 'dashed', //虚线
                color: '#0073DD',
                opacity: 0.5
              }
            }
          }
        ],
        series: [
          {
            name: '黄色预警',
            type: 'bar',
            stack: '总量',
            barMaxWidth: 22,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(0, 209, 255, 1)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(0, 209, 255, 0)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            data: arr
          },
          {
            name: '总数',
            type: 'line',
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(0, 240, 255, 1)',
                barBorderRadius: 0
              }
            },
            lineStyle: {
              normal: {
                width: 2,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(0, 206, 245, 1)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(0, 206, 245, 1)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            data: arr
          }
        ]
      };
      myChart.setOption(option);
    },
    // 获取地图数据
    getMaplist() {
      let obj = {
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getAreaListMap(obj).then((res) => {
        this.areaMapList = res || [];
      });
    },
    // 获取预警情况类型
    getModelType() {
      requestRefers.forestryModelType().then((res) => {
        this.modelTypeList = res || [];
        this.getWarningCondition();
        this.getWarningModelFn();
      });
    },
    // 获取预警情况环形图
    getWarningCondition() {
      let obj = {
        forestryModelTypeId: this.modelTypeList[this.modelTypeListActive].id,
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getWarningCondition(obj).then((res) => {
        this.warningConditionObj = res;
        this.$nextTick(() => {
          this.warningChart(res);
        });
        this.$set(this.warningConditionObj, 'redPercentage', res.redPercentage.split('%')[0]);
        this.$set(this.warningConditionObj, 'yellowPercentage', res.yellowPercentage.split('%')[0]);
      });
    },
    // 获取预警一级表头
    getWarningModelFn() {
      let obj = {
        forestryModelTypeId: this.modelTypeList[this.modelTypeListActive].id,
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getWarningModel(obj).then((res) => {
        this.collapseList = res || [];
        if (res.length > 0) {
          this.collapseList.map((item) => {
            item.isDropup = false;
            return item;
          });
          this.collapseList[0].isDropup = true;
          this.forestryModelId = this.collapseList[0].id;
          this.getWarningModelPageFn();
        }
      });
    },
    // 获取预警二级表格
    getWarningModelPageFn() {
      let obj = {
        forestryModelId: this.forestryModelId,
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime,
        page: 1,
        size: 50
      };
      requestRefers.getWarningModelPage(obj).then((res) => {
        this.listData = res.records || [];
      });
    },
    // 获取高频问题
    getHighFrequencyFn() {
      let obj = {
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getHighFrequency(obj).then((res) => {
        this.issueList = res || [];
        this.issueList.map((item) => {
          item.count = handalNumber(String(item.count));
          return item;
        });
      });
    },
    // 获取各区县预警情况对比
    getAreaContrastFn() {
      let obj = {
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getAreaContrast(obj).then((res) => {
        this.$nextTick(() => {
          this.countyChart(res || []);
        });
      });
    },
    // 获取历年预警趋势对比
    getHistoryWarningFn() {
      requestRefers.getHistoryWarning().then((res) => {
        this.$nextTick(() => {
          this.overYearsChart(res || []);
        });
      });
    },
    // 获取具体模型
    getfForestryModelListFn() {
      this.getWarningConditionFn();
      this.getDisposeConditionFn();
      this.getDisposeResultFn();
      requestRefers.forestryModelList().then((res) => {
        this.tabBtnList = res;
        this.tabBtnList.unshift({ name: '全部模型', id: '' });
      });
    },
    // 获取预警情况
    getWarningConditionFn() {
      let obj = {
        areaId: this.areaId,
        forestryModelId: this.activeModelId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      let color = ['#FF4444', '#FFD159'];
      requestRefers.getModelWarningCondition(obj).then((res) => {
        this.warningConditionnArr = sortFn(res, 'type');
        this.warningConditionnArr.map((item, index) => {
          item.color = color[index];
          item.name = item.type == 1 ? '红色预警量' : '黄色预警量';
          return item;
        });
      });
    },
    // 获取处置情况
    getDisposeConditionFn() {
      let obj = {
        areaId: this.areaId,
        forestryModelId: this.activeModelId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      let color = ['#0073DD', '#00F0FF'];
      requestRefers.getModelDisposeCondition(obj).then((res) => {
        this.disposeConditionArr = res;
        this.disposeConditionArr.map((item, index) => {
          item.color = color[index];
          return item;
        });
      });
    },
    // 获取处置成效
    getDisposeResultFn() {
      let obj = {
        areaId: this.areaId,
        forestryModelId: this.activeModelId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getModelDisposeResult(obj).then((res) => {
        let keys = Object.keys(res);
        let values = Object.values(res);
        let arr = [];
        keys.map((item, index) => {
          arr.push({
            name: item,
            num: values[index]
          });
        });
        this.disposeResultArr = arr;
      });
    }
  },
  created() {
    this.getMaplist();
    this.getModelType();
    this.getHighFrequencyFn();
    this.getAreaContrastFn();
    this.getHistoryWarningFn();
    this.getfForestryModelListFn();
  },
  mounted() {}
};
