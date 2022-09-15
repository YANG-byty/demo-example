<template>
  <div class="circinate" :id="circinateId"></div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: 'circinate-chart',
  props: {
    circinateId: {
      type: String,
      default: 'circinate'
    },
    color: {
      type: Array,
      default: () => {
        return ['#ff4444', '#ffd159'];
      }
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  watch: {
    data(val) {
      this.circinateChart();
    }
  },
  methods: {
    // 环形图
    circinateChart() {
      let myChart = echarts.init(document.getElementById(this.circinateId));
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      let color = this.color;
      let echartData = [];
      this.data.map((item) => {
        echartData.push({
          name: item.name,
          value: item.count
        });
      });

      let option = {
        tooltip: {
          trigger: 'item'
        },
        color: color,
        grid: {
          borderWidth: 0,
          top: 0,
          bottom: 0,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['100%', '60%'],
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
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.circinate {
  width: 7.9375rem;
  height: 7.9375rem;
}
</style>
