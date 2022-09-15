import * as echarts from 'echarts';
import vueSeamlessScroll from 'vue-seamless-scroll';
import countTo from 'vue-count-to'; //数字滚动
import * as requestRefers from '@/api/letter-visit';
import { handalNumber, hiddenCardId } from '@/libs/util';
import moment from 'moment';
export default {
  components: { vueSeamlessScroll, countTo },
  data() {
    return {
      dataFrom: {},
      nowTime: [moment(new Date()).format('YYYY-MM-DD').split('-'), moment(new Date()).format('HH:mm:ss')],
      typeImgList: [
        require('@/assets/img/letter-visit/xinfangyujin.png'),
        require('@/assets/img/letter-visit/quntiyujin.png'),
        require('@/assets/img/letter-visit/yuejiyujin.png'),
        require('@/assets/img/letter-visit/weiwen.png'),
        require('@/assets/img/letter-visit/shixiangzijin.png'),
        require('@/assets/img/letter-visit/weiguizhifu.png'),
        require('@/assets/img/letter-visit/zijinfafang.png')
      ],
      dayTime: '',
      listData: [],
      showModal: false,
      parameter: {},
      startTime: '',
      endTime: '',
      areaId: '',
      modelTypeList: [],
      petitionModelTypeId: '',
      areaMapList: [],
      areaMapTabIndex: 0,
      areaMapTitle: '',
      contrastList: [],
      conditionsObj: {},
      fundsLatitudeObj: {},
      yearTotal: 0,
      warningConditionObj: {},
      warningObj: {},
      frequencyList: [],
      resultsContrastObj: {},
      maxMapObj: {},
      showMaxMap: false
    };
  },
  computed: {
    optionSingleHeightTime() {
      return {
        singleHeight: 31,
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
      this.getContrastFn();
      this.getWarningConditionFn();
      this.getWarningConditionPageFn();
      this.getMainConditionsFn();
      this.getHighFrequencyFn();
      this.getHistoryWarningFn();
    },
    clearTime() {
      if (this.startTime == '' && this.endTime == '') {
        return;
      }
      this.dataFrom = {};
      this.startTime = '';
      this.endTime = '';
      this.getModelTypeDataFn();
      this.getWarningConditionFn();
      this.getWarningConditionPageFn();
      this.getMainConditionsFn();
      this.getFundsLatitudeFn();
      this.getHighFrequencyFn();
      this.getHistoryWarningFn();
    },
    changeTimeFn(val, type) {
      switch (type) {
        case 'start':
          this.startTime = val;
          if (!(this.startTime == '' || this.endTime == '')) {
            if (this.startTime > this.endTime) {
              this.Message.error('开始年份不能大于结束年份！');
              this.startTime = '';
              this.dataFrom.startTime = '';
            }
          }

          break;
        case 'end':
          this.endTime = val;
          if (!(this.startTime == '' || this.endTime == '')) {
            if (this.startTime > this.endTime) {
              this.Message.error('结束年份不能小于开始年份！');
              this.endTime = '';
              this.dataFrom.endTime = '';
            }
          }
          break;

        default:
          break;
      }
      if (!(this.startTime == '' || this.endTime == '')) {
        this.getModelTypeDataFn();
        this.getWarningConditionFn();
        this.getWarningConditionPageFn();
        this.getMainConditionsFn();
        this.getFundsLatitudeFn();
        this.getHighFrequencyFn();
        this.getHistoryWarningFn();
      }
    },
    // 显示悬浮框
    showModalFn(id) {
      if (id) {
        this.parameter = {
          petitionModelId: id,
          areaId: this.areaId,
          endTime: this.endTime,
          startTime: this.startTime
        };
        this.showModal = true;
      }
    },
    // 地图切换
    areaMapTabFn(index, item) {
      if (this.areaMapTabIndex != index) {
        this.areaMapTabIndex = index;
        this.areaMapTitle = item.name;
        this.areaId = index == 0 ? '' : this.areaMapList[index - 1].id;
        if (index != 1) {
          this.showMaxMap = true;
          this.maxMapObj = item;
        }
        this.cancelMap();
        this.yearTotal = this.fundsLatitudeObj.area[item.name];
      } else {
        this.cancelMap(true);
        this.yearTotal = this.fundsLatitudeObj.yearTotal;
      }
    },
    // 地图模型类型切换
    modelTypeFn(id) {
      this.showMaxMap = false;
      this.petitionModelTypeId = this.petitionModelTypeId == id ? '' : id;
      this.getMaplistFn();
      this.getContrastFn();
      this.getHighFrequencyFn();
      this.getMainConditionsFn();
      this.getWarningConditionPageFn();
      this.getWarningConditionFn();
    },
    // 增长趋势图
    leftChartBoxOne() {
      let keys = Object.keys(this.fundsLatitudeObj.area);
      let values = Object.values(this.fundsLatitudeObj.area);
      let colors = [
        ['#0262FD', '#022A7A'],
        ['#FA7524', '#232A5A'],
        ['#712CDD', '#081C65'],
        ['#BF702B', '#2E2B51'],
        ['#5FBF9B', '#163866'],
        ['#C7A122', '#24294D'],
        ['#82D1C4', '#44738E'],
        ['#5BBABF', '#0D2360'],
        ['#499DD1', '#132D70'],
        ['#57CE45', '#112E4D']
      ];
      let datas = [];
      values.map((item, index) => {
        datas.push({
          value: item,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[index][0] },
              { offset: 1, color: colors[index][1] }
            ])
          }
        });
      });
      let myChart = echarts.init(document.getElementById('leftChartOne'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '40',
          left: '10',
          right: '10',
          bottom: '10',
          containLabel: true
        },
        color: ['#F3921F'],
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#61919C',
                width: 1
              }
            },
            axisTick: {
              //刻度线
              show: false
            },
            axisLine: {
              show: false
            },
            //网格线
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#525885',
                type: 'dotted'
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            data: keys,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '万元',
            nameTextStyle: {
              color: '#fff'
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 12,
                formatter: '{value}'
              }
            },
            axisLine: {
              show: false
            },
            //网格线
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#525885',
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: 16,
            data: datas
          }
        ]
      });
    },
    // 历年预警趋势对比
    rightChartBoxOne(data) {
      let xData = [],
        xDataBar = [],
        arr = [];
      let colors = [
        ['#0262FD', '#022A7A'],
        ['#FA7524', '#232A5A'],
        ['#712CDD', '#081C65'],
        ['#BF702B', '#2E2B51'],
        ['#9EC857', '#182550']
      ];
      for (let i = 0; i < Math.ceil(data.length / 5); i++) {
        colors = colors.concat(colors);
      }
      data.map((item, index) => {
        xData.push(item.year);
        arr.push(item.count);
        xDataBar.push({
          value: item.count,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[index][0] },
              { offset: 1, color: colors[index][1] }
            ])
          }
        });
      });
      let myChart = echarts.init(document.getElementById('rightChartOne'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      myChart.setOption({
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
          top: '30',
          left: '10',
          right: '10',
          bottom: '10',
          containLabel: true
        },
        color: ['#F3921F'],
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#61919C',
                width: 1
              }
            },
            axisTick: {
              //刻度线
              show: false
            },
            axisLine: {
              show: false
            },
            //网格线
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#525885',
                type: 'dotted'
              }
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            data: xData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '条',
            nameTextStyle: {
              color: '#fff'
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 12,
                formatter: '{value}'
              }
            },
            axisLine: {
              show: false
            },
            //网格线
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#525885',
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: 16,
            data: xDataBar
          },
          {
            data: arr,
            type: 'line',
            smooth: true,
            symbolSize: 8,
            color: '#0E9CFF'
          }
        ]
      });
    },
    // 热点关注
    hotAttention(data) {
      let datas = [];
      data.splice(data.length - 20).map((item, index) => {
        let colorStr = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )})`;
        datas.push({
          name: item.name + '\n' + item.value,
          value: item.value,
          symbolSize: Number(60) + index * 2,
          draggable: true,
          itemStyle: {
            normal: {
              // borderColor: colorStr,
              // borderWidth: 4,
              // shadowBlur: 100,
              // shadowColor: colorStr,
              color: colorStr
            }
          }
        });
      });
      let myChart = echarts.init(document.getElementById('hot-attention'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      myChart.setOption({
        animationDurationUpdate: function (idx) {
          // 越往后的数据延迟越大
          return idx * 100;
        },
        animationEasingUpdate: 'bounceIn',
        color: ['#fff', '#fff', '#fff'],
        series: [
          {
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 200,
              edgeLength: 10
            },
            roam: true,
            label: {
              normal: {
                show: true,
                lineHeight: 18
              }
            },
            data: datas
          }
        ]
      });
    },
    // 获取地图模型类型数据
    getModelTypeDataFn() {
      this.getMaplistFn();
      this.getContrastFn();
      let obj = {
        endTime: this.endTime,
        startTime: this.startTime
      };
      requestRefers.getModelTypeData(obj).then((res) => {
        this.modelTypeList = res || [];
      });
    },
    // 获取地图数据
    getMaplistFn() {
      let obj = {
        petitionModelTypeId: this.petitionModelTypeId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getAreaList(obj).then((res) => {
        this.areaMapList = res || [];
      });
    },
    // 获取各监督模型占比
    getContrastFn() {
      let obj = {
        areaId: this.areaId,
        petitionModelTypeId: this.petitionModelTypeId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getContrast(obj).then((res) => {
        this.contrastList = res || [];
        if (this.contrastList.length == 0) {
          return;
        }
        let iconList = [];
        for (let i = 0; i < Math.ceil(res.length / 7); i++) {
          iconList = iconList.concat(this.typeImgList);
        }
        this.contrastList.map((item, index) => {
          item.iconImg = iconList[index];
          return item;
        });
      });
    },
    // 获取预警情况-左边数据
    getWarningConditionFn() {
      let obj = {
        areaId: this.areaId,
        petitionModelTypeId: this.petitionModelTypeId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getWarningCondition(obj).then((res) => {
        this.warningConditionObj = res.petition;
        this.warningObj = {
          redCount: handalNumber(String(res.warning[0].count)),
          yellowCount: handalNumber(String(res.warning[1].count))
        };
      });
    },
    // 获取预警情况-右边列表
    getWarningConditionPageFn() {
      let obj = {
        areaId: this.areaId,
        petitionModelTypeId: this.petitionModelTypeId,
        startTime: this.startTime,
        endTime: this.endTime,
        page: 1,
        size: 50
      };
      requestRefers.getWarningConditionPage(obj).then((res) => {
        this.listData = res.records || [];
        this.listData.map((item) => {
          item.idNumber = hiddenCardId(item.idNumber);
          return item;
        });
      });
    },
    // 获取主要情况
    getMainConditionsFn() {
      let obj = {
        areaId: this.areaId,
        petitionModelTypeId: this.petitionModelTypeId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getMainConditions(obj).then((res) => {
        this.conditionsObj = res;
      });
    },
    // 获取主要情况
    getFundsLatitudeFn() {
      let obj = {
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getFundsLatitude(obj).then((res) => {
        this.fundsLatitudeObj = res;
        this.yearTotal = res.yearTotal;
        this.leftChartBoxOne();
      });
    },
    // 获取高频问题
    getHighFrequencyFn() {
      let obj = {
        areaId: this.areaId,
        petitionModelTypeId: this.petitionModelTypeId,
        startTime: this.startTime,
        endTime: this.endTime
      };
      requestRefers.getHighFrequency(obj).then((res) => {
        this.frequencyList = res;
      });
    },
    // 获取历年预警趋势对比
    getHistoryWarningFn() {
      let obj = {
        startTime: this.startTime,
        endTime: this.endTime,
        areaId: this.areaId
      };
      requestRefers.getHistoryWarning(obj).then((res) => {
        this.rightChartBoxOne(res || []);
      });
    },
    // 获取热点关注
    getResultsContrastFn() {
      requestRefers.getResultsContrast().then((res) => {
        // this.resultsContrastObj = res;
        // for (const key in this.resultsContrastObj) {
        //   this.resultsContrastObj[key] = handalNumber(String(this.resultsContrastObj[key]));
        // }
        this.hotAttention(res || []);
      });
    },
    getNowTime() {
      this.nowTime = [moment(new Date()).format('YYYY-MM-DD').split('-'), moment(new Date()).format('HH:mm:ss')];
    },
    getDayFn() {
      let index = new Date().getDay();
      let time = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      this.dayTime = time[index];
    }
  },
  created() {
    setInterval(this.getNowTime, 1000);
    this.getDayFn();
    this.getModelTypeDataFn();
    this.getWarningConditionFn();
    this.getWarningConditionPageFn();
    this.getMainConditionsFn();
    this.getFundsLatitudeFn();
    this.getHighFrequencyFn();
    this.getHistoryWarningFn();
    this.getResultsContrastFn();
  },
  mounted() {}
};
