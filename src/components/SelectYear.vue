<template>
  <div class="side-box info flex-row col-center row-center">
    <div class="year flex-row col-center">
      <div class="all" @click="clearTime">全部</div>
      <DatePicker
        type="year"
        :editable="false"
        placeholder="年份选择"
        v-model="dataFrom.startTime"
        @on-change="changeTimeFn($event, 'start')"
      ></DatePicker>
      <span class="line"></span>
      <DatePicker
        :editable="false"
        type="year"
        placeholder="年份选择"
        v-model="dataFrom.endTime"
        @on-change="changeTimeFn($event, 'end')"
      ></DatePicker>
    </div>
    <div class="line-y"></div>
    <div class="city">丽水市{{ areaMapTitle ? ' · ' + areaMapTitle : '' }}</div>
  </div>
</template>

<script>
export default {
  name: 'select-year',
  props: {
    areaMapTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataFrom: {},
      timeObj: {
        startTime: '',
        endTime: ''
      }
    };
  },
  watch: {
    data(val) {
      this.circinateChart();
    }
  },
  methods: {
    clearTime() {
      if (this.timeObj.startTime == '' && this.timeObj.endTime == '') {
        return;
      }
      this.dataFrom = {};
      this.timeObj.startTime = '';
      this.timeObj.endTime = '';
      this.$emit('setTime', this.timeObj);
    },
    changeTimeFn(val, type) {
      switch (type) {
        case 'start':
          this.timeObj.startTime = val;
          if (!(this.timeObj.startTime == '' || this.timeObj.endTime == '')) {
            if (this.timeObj.startTime > this.timeObj.endTime) {
              this.Message.error('开始年份不能大于结束年份！');
              this.timeObj.startTime = '';
              this.dataFrom.startTime = '';
            }
          }

          break;
        case 'end':
          this.timeObj.endTime = val;
          if (!(this.timeObj.startTime == '' || this.timeObj.endTime == '')) {
            if (this.timeObj.startTime > this.timeObj.endTime) {
              this.Message.error('结束年份不能小于开始年份！');
              this.timeObj.endTime = '';
              this.dataFrom.endTime = '';
            }
          }
          break;

        default:
          break;
      }
      if (!(this.timeObj.startTime == '' || this.timeObj.endTime == '')) {
        this.$emit('setTime', this.timeObj);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.all,
.city {
  padding: 0 1rem;
  margin-right: 1rem;
  color: #fff;
  font-weight: bold;
}
.all {
  cursor: pointer;
}
.line {
  margin: 0 0.5rem;
  width: 0.625rem;
  height: 0.125rem;
  background: #fff;
}
.line-y {
  margin: 0 0.5rem;
  width: 0.125rem;
  height: 1rem;
  background: #fff;
}
/deep/.ivu-input-wrapper {
  .ivu-input {
    width: 6.875rem;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    background: transparent;
    &:focus {
      box-shadow: none;
    }
    &::-webkit-input-placeholder {
      color: #0073dd !important;
    } /* 使用webkit内核的浏览器 */
    &:-moz-placeholder {
      color: #0073dd !important;
    } /* Firefox版本4-18 */
    &::-moz-placeholder {
      color: #0073dd !important;
    } /* Firefox版本19+ */
    &:-ms-input-placeholder {
      color: #0073dd !important;
    }
  }
  .ivu-input-prefix i,
  .ivu-input-suffix i {
    color: #fff;
    font-size: 1.25rem;
    font-weight: bold;
  }
}
</style>
