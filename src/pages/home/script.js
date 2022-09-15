import * as echarts from 'echarts';
import * as requestRefers from '@/api/home';
import countTo from 'vue-count-to'; //数字滚动
import { handalNumber } from '@/libs/util';
export default {
  components: {
    countTo
  },
  data() {
    return {
      redObj: {},
      yellowObj: {},
      areaMapList: [],
      areaMapTabIndex: 0,
      areaMapTitle: '',
      xfFrequencyList: [],
      tyFrequencyList: [],
      lyFrequencyList: [],
      analysisObj: {},
      showModal: false,
      parameter: {},
      maxMapObj: {},
      showMaxMap: false,
      flagName: 'letter-visit'
    };
  },
  methods: {
    numberFn(count) {
      return handalNumber(String(count));
    },
    handleClick(path) {
      let routeData = this.$router.resolve({
        path: path
      });
      window.open(routeData.href, path);
    },
    // 显示悬浮框
    showModalFn(id, name) {
      if (id) {
        this.flagName = name;
        switch (name) {
          case 'forestry':
            this.parameter = {
              forestryModelId: id
            };
            break;
          case 'letter-visit':
            this.parameter = {
              petitionModelId: id
            };
            break;
          case 'sport':
            this.parameter = {
              sportsModelId: id
            };
            break;

          default:
            break;
        }

        this.showModal = true;
      }
    },
    // 地图切换
    areaMapTabFn(index, item, flag) {
      this.showMaxMap = false;
      if (this.areaMapTabIndex != index) {
        this.areaMapTabIndex = index;
        this.areaMapTitle = item.title;
      }
      if (flag && index != 1) {
        this.showMaxMap = true;
        this.maxMapObj = item;
      }
    },
    // 历年预警趋势对比
    leftChartBoxOne(data) {
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
      let myChart = echarts.init(document.getElementById('leftChartOne'));
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
              show: false
              // lineStyle: {
              //   width: 1,
              //   color: '#525885',
              //   type: 'dotted'
              // }
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
          top: '30',
          left: '10',
          right: '10',
          bottom: '10',
          containLabel: true
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
    // 各领域统计
    rightChartBoxOne(data) {
      let myChart = echarts.init(document.getElementById('rightChartOne'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let title = '信访';
      let color = ['#FF4444', '#D7D7D7'];
      let echartData = [
        {
          name: '信访',
          value: data.count
        }
        // {
        //   name: '剩余',
        //   value: data.total - data.count
        // }
      ];
      // let formatNumber = function (num) {
      //   let reg = /(?=(\B)(\d{3})+$)/g;
      //   return num.toString().replace(reg, ',');
      // };
      // let total = echartData.reduce((a, b) => {
      //   return a + b.value * 1;
      // }, 0);
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (val) {
            return `<div>信访: ${data.percentage}</div>`;
          }
        },
        color: color,
        title: [
          {
            text: '{val|' + title + '}\n{name|' + data.percentage + '}',
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
      let title = '体育';
      let color = ['#0073DD', '#D7D7D7'];
      let echartData = [
        {
          name: '体育',
          value: data.count
        }
        // {
        //   name: '剩余',
        //   value: data.total - data.count
        // }
      ];

      // let formatNumber = function (num) {
      //   let reg = /(?=(\B)(\d{3})+$)/g;
      //   return num.toString().replace(reg, ',');
      // };
      // let total = echartData.reduce((a, b) => {
      //   return a + b.value * 1;
      // }, 0);

      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (val) {
            return `<div>体育: ${data.percentage}</div>`;
          }
        },
        color: color,
        title: [
          {
            text: '{val|' + title + '}\n{name|' + data.percentage + '}',
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
    rightChartBoxThree(data) {
      let myChart = echarts.init(document.getElementById('rightChartThree'));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let title = '林业';
      let color = ['#46FF90', '#D7D7D7'];
      let echartData = [
        {
          name: '林业',
          value: data.count
        }
        // {
        //   name: '剩余',
        //   value: data.total - data.count
        // }
      ];

      // let formatNumber = function (num) {
      //   let reg = /(?=(\B)(\d{3})+$)/g;
      //   return num.toString().replace(reg, ',');
      // };
      // let total = echartData.reduce((a, b) => {
      //   return a + b.value * 1;
      // }, 0);

      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (val) {
            return `<div>林业: ${data.percentage}</div>`;
          }
        },
        color: color,
        title: [
          {
            text: '{val|' + title + '}\n{name|' + data.percentage + '}',
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
    // 获取预警情况统计
    getSportsWarningDataFn() {
      requestRefers.getSportsWarningData().then((res) => {
        this.redObj = res.red;
        this.yellowObj = res.yellow;
      });
    },
    // 获取地图数据
    getMaplistFn() {
      requestRefers.getAreaList().then((res) => {
        this.areaMapList = res || [];
      });
    },
    // 获取信访高频问题
    getXFFrequencyFn() {
      requestRefers.getXFHighFrequency().then((res) => {
        this.xfFrequencyList = res;
      });
    },
    // 获取体育高频问题
    getTYFrequencyFn() {
      requestRefers.getTYHighFrequency().then((res) => {
        this.tyFrequencyList = res;
      });
    },
    // 获取林业高频问题
    getLYFrequencyFn() {
      requestRefers.getLYHighFrequency().then((res) => {
        this.lyFrequencyList = res;
      });
    },
    // 获取历年预警趋势对比
    getHistoryWarningFn() {
      requestRefers.getHistoryWarning().then((res) => {
        this.leftChartBoxOne(res || []);
      });
    },
    // 获取各区县预警情况对比
    getAreaContrastFn() {
      requestRefers.getAreaContrast().then((res) => {
        this.$nextTick(() => {
          this.countyChart(res || []);
        });
      });
    },
    // 获取预警情况分析-统计环形图
    getWarningAnalysisFn() {
      requestRefers.getWarningAnalysis().then((res) => {
        let obj = {};
        res.map((item) => {
          obj[item.name] = item;
        });
        this.analysisObj = obj;
        this.rightChartBoxOne(obj.petition);
        this.rightChartBoxTwo(obj.sports);
        this.rightChartBoxThree(obj.forestry);
      });
    }
  },
  created() {
    this.getSportsWarningDataFn();
    this.getMaplistFn();
    this.getXFFrequencyFn();
    this.getLYFrequencyFn();
    this.getTYFrequencyFn();
    this.getHistoryWarningFn();
    this.getAreaContrastFn();
    this.getWarningAnalysisFn();
  },
  mounted() {}
};
