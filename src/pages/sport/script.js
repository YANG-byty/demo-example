import * as echarts from 'echarts';
import vueSeamlessScroll from 'vue-seamless-scroll';
import countTo from 'vue-count-to'; //数字滚动
import * as requestRefers from '@/api/sport';
import { sortFn } from '@/libs/util';
export default {
  components: { vueSeamlessScroll, countTo },
  data() {
    return {
      isDropup: true,
      listData: [],
      collapseList: [],
      typeImgList: [
        require('@/assets/img/sport/tiyuzhifa.png'),
        require('@/assets/img/sport/tiyuxiehui.png'),
        require('@/assets/img/sport/tiyudengji.png'),
        require('@/assets/img/sport/jishudengji.png')
      ],
      showModal: false,
      parameter: {},
      areaMapList: [],
      areaMapTabIndex: 0,
      areaMapTitle: '',
      startTime: '',
      endTime: '',
      areaId: '',
      modelTypeList: [],
      redObj: {},
      yellowObj: {},
      maxSportsModelObj: {},
      analysisObj: {},
      type: 1,
      sportsModelTypeId: '',
      disposeResultObj: {},
      maxMapObj: {},
      showMaxMap: false
    };
  },
  methods: {
    // 取消选中地图
    cancelMap(clear) {
      if (clear) {
        this.areaMapTabIndex = 0;
        this.areaMapTitle = '';
        this.areaId = '';
      }
      this.getModelTypeDataFn();
      this.getSportsWarningDataFn();
      this.getDisposeResultFn();
      this.getSportsModelFn();
      this.getWarningAnalysisFn();
      this.getWarningDisposeDetailsFn();
      this.getWarningDisposeDetailsPageFn();
    },
    // 获取选择年份
    setTime(val) {
      this.startTime = val.startTime;
      this.endTime = val.endTime;
      this.getMaplistFn();
      this.getModelTypeDataFn();
      this.getSportsWarningDataFn();
      this.getDisposeResultFn();
      this.getSportsModelFn();
      this.getWarningAnalysisFn();
      if (this.type == 1) {
        this.getWarningDisposeDetailsFn();
        return;
      }
      this.getWarningDisposeDetailsPageFn();
    },
    // 预警分析详情类型切换
    typeChangeFn(type) {
      this.type = type;
      this.listData = [];
      if (type == 1) {
        this.getWarningDisposeDetailsFn();
        return;
      }
      this.getWarningDisposeDetailsPageFn();
    },
    // 显示悬浮框
    showModalFn(id) {
      if (id) {
        this.parameter = {
          sportsModelId: id,
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
    isDropupFn(index) {
      this.sportsModelTypeId = this.collapseList[index].id;
      this.collapseList[index].isDropup = !this.collapseList[index].isDropup;
      if (this.collapseList[index].isDropup) {
        this.listData = [];
        this.getWarningDisposeDetailsPageFn();
      }
      let arr = this.collapseList;
      this.collapseList = arr.map((item, idx) => {
        if (index != idx) {
          item.isDropup = false;
        }
        return item;
      });
    },
    //各预警情况
    leftChartBoxOne(data) {
      let that = this;
      let myChart = echarts.init(document.getElementById('leftChartOne'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let color = ['#6F2CFF', '#4659FF', '#0073DD', '#0098ED', '#00C1DB', '#00DBB3', '#3ACF52', '#A2DB00', '#DBD200', '#DB9E00'];
      let arrValue = getArrayValue(data, 'value');
      let sumValue = eval(arrValue.join('+'));
      let optionData = getData(data);

      function getArrayValue(array, key) {
        var key = key || 'value';
        var res = [];
        if (array) {
          array.forEach(function (t) {
            res.push(t[key]);
          });
        }
        return res;
      }
      function getData(data) {
        var res = {
          series: [],
          yAxis: []
        };
        for (let i = 0; i < data.length; i++) {
          res.series.push({
            name: '',
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [92 - i * 9 + '%', 96 - i * 9 + '%'],
            center: ['50%', '50%'],
            startAngle: 90,
            label: {
              show: false
            },
            itemStyle: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              borderWidth: 3
            },
            data: [
              {
                value: data[i].value,
                name: data[i].name,
                id: data[i].id
              },
              {
                value: sumValue - data[i].value,
                name: '',
                itemStyle: {
                  color: 'rgba(0,0,0,0)',
                  borderWidth: 0
                },
                tooltip: {
                  show: false
                },
                hoverAnimation: false
              }
            ]
          });
          res.series.push({
            name: '',
            type: 'pie',
            silent: true,
            z: 1,
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [92 - i * 9 + '%', 96 - i * 9 + '%'],
            center: ['50%', '50%'],
            label: {
              show: false
            },
            itemStyle: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              borderWidth: 3
            },
            data: [
              {
                value: 10,
                itemStyle: {
                  color: 'rgb(0, 55, 117)',
                  borderWidth: 0
                },
                tooltip: {
                  show: false
                },
                hoverAnimation: false
              },
              {
                value: 0,
                name: '',
                itemStyle: {
                  color: 'rgba(0,0,0,0)',
                  borderWidth: 0
                },
                tooltip: {
                  show: false
                },
                hoverAnimation: false
              }
            ]
          });
        }
        return res;
      }
      let option = {
        tooltip: {
          // triggerOn: 'click',
          show: true,
          trigger: 'item',
          padding: 0,
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          },
          position: function (point, params, dom, rect, size) {
            var x = 0; // x坐标位置
            var y = 0; // y坐标位置
            // 当前鼠标位置
            var pointX = point[0];
            var pointY = point[1];
            // 提示框大小
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];

            // boxWidth > pointX 说明鼠标左边放不下提示框
            if (boxWidth > pointX) {
              x = pointX + 10;
            } else {
              // 左边放的下
              x = pointX - boxWidth - 10;
            }
            // boxHeight > pointY 说明鼠标上边放不下提示框
            if (boxHeight > pointY) {
              y = 5;
            } else {
              // 上边放得下
              y = pointY - boxHeight;
            }
            return [x, y];
          },
          formatter: function () {
            var text = '';
            for (var i = 0; i < data.length; i++) {
              text += `<div class="item" ><span style="background-color: ${color[i]};"></span> ${data[i].name}（${data[i].value}）</span></div>`;
            }
            return `<div class="leftChart-mask">${text}</div>`;
          }
        },
        color: color,
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              inside: true,
              textStyle: {
                color: '#fff',
                fontSize: 16
              },
              show: true
            },
            data: optionData.yAxis
          }
        ],
        xAxis: [
          {
            show: false
          }
        ],
        series: optionData.series
      };
      myChart.setOption(option);
      myChart.on('click', (e) => {
        that.showModalFn(e.data.id);
      });
    },
    //预警情况分析
    rightChartBoxOne(data) {
      let myChart = echarts.init(document.getElementById('rightChartOne'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let title = '总预警量';
      let color = ['#FF4444', '#FFD159'];
      let echartData = [
        {
          name: '红色预警量',
          value: data.red
        },
        {
          name: '黄色预警量',
          value: data.yellow
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
        tooltip: {
          trigger: 'item'
        },
        color: color,
        title: [
          {
            text: '{val|' + formatNumber(total) + '}\n{name|' + title + '}',
            top: 'center',
            left: 'center',
            textStyle: {
              rich: {
                name: {
                  fontSize: 16,
                  fontWeight: 'normal',
                  color: '#fff',
                  padding: [5, 0]
                },
                val: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#fff',
                  padding: [5, 0]
                }
              }
            }
          }
        ],
        series: [
          {
            type: 'pie',
            radius: ['80%', '100%'],
            center: ['50%', '50%'],
            data: echartData,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                borderWidth: 2
              }
            },
            labelLine: {
              show: false,
              normal: {
                length: 20,
                length2: 120,
                lineStyle: {
                  color: '#e6e6e6'
                }
              }
            },
            label: {
              show: false
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    rightChartBoxTwo(data) {
      let myChart = echarts.init(document.getElementById('rightChartTwo'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let title = '总处理量';
      let color = ['#0073DD', '#00F0FF'];
      let echartData = [
        {
          name: '已处理量',
          value: data.dispose
        },
        {
          name: '未处理量',
          value: data.untreated
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
        tooltip: {
          trigger: 'item'
        },
        color: color,
        title: [
          {
            text: '{val|' + formatNumber(total) + '}\n{name|' + title + '}',
            top: 'center',
            left: 'center',
            textStyle: {
              rich: {
                name: {
                  fontSize: 16,
                  fontWeight: 'normal',
                  color: '#fff',
                  padding: [5, 0]
                },
                val: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#fff',
                  padding: [5, 0]
                }
              }
            }
          }
        ],

        series: [
          {
            type: 'pie',
            radius: ['80%', '100%'],
            center: ['50%', '50%'],
            data: echartData,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                borderWidth: 2
              }
            },
            labelLine: {
              show: false,
              normal: {
                length: 20,
                length2: 120,
                lineStyle: {
                  color: '#e6e6e6'
                }
              }
            },
            label: {
              show: false
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    // 获取地图数据
    getMaplistFn() {
      let obj = {
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getAreaList(obj).then((res) => {
        this.areaMapList = res || [];
      });
    },
    // 获取地图下方统计
    getModelTypeDataFn() {
      let obj = {
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getModelTypeData(obj).then((res) => {
        this.modelTypeList = res || [];
      });
    },
    // 获取预警情况统计
    getSportsWarningDataFn() {
      let obj = {
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getSportsWarningData(obj).then((res) => {
        this.redObj = res.red;
        this.yellowObj = res.yellow;
      });
    },
    //  预警情况分析-处置成效统计
    getDisposeResultFn() {
      let obj = {
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getDisposeResult(obj).then((res) => {
        console.log(res);
        this.disposeResultObj = res || {};
      });
    },
    // 获取各预警情况
    getSportsModelFn() {
      let obj = {
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getSportsModel(obj).then((res) => {
        let data = [];
        if (res.length == 0) return;
        res.map((item) => {
          data.push({
            id: item.id,
            name: item.name,
            value: item.count,
            percentage: item.percentage
          });
        });
        data = sortFn(data, 'value', 'DESC');
        this.maxSportsModelObj = data[0];
        this.leftChartBoxOne(data);
      });
    },
    // 获取预警情况分析-统计环形图
    getWarningAnalysisFn() {
      let obj = {
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getWarningAnalysis(obj).then((res) => {
        this.analysisObj = {
          ...res[0],
          ...res[1]
        };
        this.rightChartBoxOne(res[0]);
        this.rightChartBoxTwo(res[1]);
      });
    },
    // 获取预警详情一级表头
    getWarningDisposeDetailsFn() {
      let obj = {
        type: this.type,
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getWarningDisposeDetails(obj).then((res) => {
        this.collapseList = res || [];
        if (res.length > 0) {
          this.collapseList.map((item) => {
            item.isDropup = false;
            return item;
          });
          this.collapseList[0].isDropup = true;
          this.sportsModelTypeId = this.collapseList[0].id;
          this.getWarningDisposeDetailsPageFn();
        }
      });
    },
    // 获取预警详情表格、处置详情
    getWarningDisposeDetailsPageFn() {
      let obj = {
        type: this.type,
        sportsModelTypeId: this.sportsModelTypeId,
        areaId: this.areaId,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.page,
        size: this.size
      };
      requestRefers.getWarningDisposeDetailsPage(obj).then((res) => {
        this.listData = res.records || [];
      });
    }
  },
  mounted() {
    this.getMaplistFn();
    this.getModelTypeDataFn();
    this.getSportsWarningDataFn();
    this.getDisposeResultFn();
    this.getSportsModelFn();
    this.getWarningAnalysisFn();
    this.getWarningDisposeDetailsFn();
  },
  computed: {
    optionSingleHeightTime() {
      return {
        singleHeight: 41,
        waitTime: 3000
      };
    }
  }
};
