<template>
  <div class="progress-bar" :id="progressBar"></div>
</template>
<script>
import * as echarts from 'echarts';
import { debounce } from '@/libs/util';
export default {
  name: 'progress-bar',
  props: {
    progressBar: {
      type: String,
      default: 'progress-bar'
    },
    color: {
      type: String,
      default: '#FF4444'
    },
    data: {
      type: Array,
      default: () => {
        return [0, 100];
      }
    }
  },
  data() {
    return {};
  },
  watch: {
    data(val) {
      debounce(
        this,
        () => {
          this.progressBarChart();
        },
        200
      );
    }
  },
  methods: {
    // 进度条
    progressBarChart() {
      // console.log(this.data, this.progressBar);
      let myChart = echarts.init(document.getElementById(this.progressBar));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let chartData = [[this.data[0]], ['CCC']];
      let getmyd = chartData[0]; //收入金额
      let getmydzd = [];

      // const max = Math.ceil(this.calMax([getmyd]) / 10) * 10;
      const max = this.data[1];
      // let big = 0;
      // getmyd.forEach((el) => {
      //   if (!(el === undefined || el === '' || el === 0)) {
      //     if (big < Number(el)) {
      //       big = Number(el);
      //     }
      //   } else {
      //     big = 100;
      //   }
      // });
      for (let i = 0; i < getmyd.length; i++) {
        getmydzd.push(10 * (max / 10));
      }

      let option = {
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '5%'
          // containLabel: true,
        },
        xAxis: [
          {
            type: 'value',
            axisLabel: {
              show: false,
              color: '#fff',
              formatter: function (val) {
                return val + '';
              },
              textStyle: {
                fontSize: '12'
              }
            },
            min: 0,
            max: max, // 计算最大值
            interval: max / 5, //  平均分为5份
            splitNumber: 5,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff',
                width: 1,
                opacity: 0.3
              }
            },
            axisTick: {
              show: false
            }
          },
          {
            type: 'value',
            axisLabel: {
              show: false
            },
            min: 0,
            max: max, // 计算最大值
            interval: max / 10, //  平均分为5份
            splitNumber: 10,
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed',
                color: '#D8D8D8'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            //左侧柱状图的Y轴
            gridIndex: 0, //y轴所在的 grid 的索引
            splitLine: 'none',
            axisTick: 'none',
            axisLine: 'none',
            data: getmyd,
            inverse: false,
            axisLabel: {
              show: true,
              verticalAlign: 'bottom',
              align: 'right',
              padding: [0, 10, 18, 0],
              textStyle: {
                color: '#fff',
                fontSize: '14'
              },
              formatter: function (value) {
                return '{x|' + value + '}';
                // return '{x|' + value + '}  {y|' + '%}';
              },
              rich: {
                y: {
                  color: '#3dffef',
                  fontFamily: 'Orbitron',
                  fontSize: 14
                },
                x: {
                  color: '#3dffef',
                  fontFamily: 'Orbitron',
                  fontSize: 14
                }
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            show: true,
            height: 22,
            start: 1,
            end: 100,
            // end: max,
            orient: 'vertical',
            zlevel: 66
          }
        ],
        series: [
          {
            name: '值',
            type: 'bar',
            // barGap: '100%',
            padding: 10,
            // zlevel: 1,
            xAxisIndex: 0,
            legendHoverLink: false,
            symbolRepeat: true,
            silent: true,
            label: {
              show: false,
              position: 'right',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
            itemStyle: {
              normal: {
                borderRadius: 0,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: this.color // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: this.color // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            barWidth: 15,
            data: getmyd,
            z: 0
          },
          {
            // 分隔
            type: 'pictorialBar',
            symbolRotate: '-25',
            itemStyle: {
              normal: {
                color: 'rgba(1, 12, 38, 0.4)'
              }
            },
            symbolRepeat: 'fixed',
            symbolMargin: 6,
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [5, 22],
            symbolPosition: 'start',
            symbolOffset: [0, -2],
            data: getmyd,
            z: 66,
            animationEasing: 'elasticOut'
          },
          {
            name: '背景',
            type: 'bar',
            barWidth: 20,
            barGap: '-118%',
            data: getmydzd,
            itemStyle: {
              normal: {
                color: 'rgba(5,59,113,0.7)',
                borderRadius: 0,
                // borderColor: 'rgba(0, 255, 236, 1)',
                borderColor: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#015EFE' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#10C2E8' // 100% 处的颜色
                    }
                  ],
                  false
                )
              }
            },
            z: -1
          },
          {
            type: 'pictorialBar',
            name: '左内边框',
            symbol: 'rect',
            symbolSize: [3, 22],
            symbolOffset: [0, -2],
            animation: false,
            // symbolKeepAspect: true,
            // animationEasing: 'none',
            itemStyle: {
              normal: {
                color: 'rgba(5,59,113,1)'
              },
              opacity: 1
            },
            z: 99,
            data: new Array(getmyd.length).fill(1)
          }
        ]
      };
      myChart.setOption(option);
    },
    //计算最大值
    calMax(arr) {
      let max = 0;
      arr.forEach((el) => {
        el.forEach((el1) => {
          if (!(el1 === undefined || el1 === '' || el1 === 0)) {
            if (max < Number(el1)) {
              max = Number(el1);
            }
          } else {
            max == 100;
          }
        });
      });
      let maxint = Math.ceil(max / 9.5);
      //不让最高的值超过最上面的刻度
      let maxval = maxint * 10;
      //让显示的刻度是整数
      return maxval;
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.progress-bar {
  width: 100%;
  width: 9rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid #0073dd;
}
</style>
