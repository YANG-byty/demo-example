<template>
  <div class="screen-wrap">
    <div class="head-bar"><span>demo案例</span></div>
    <div class="menu flex-row row-center">
      <div class="item flex-col col-center" @click="handleClick(item)" v-for="item in list" :key="item.title">
        <img :src="item.icon" alt="" />
        <p class="name">{{ item.title }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          title: 'canvas画板',
          path: '/canvas',
          icon: require('@/assets/img/linye-icon.png')
        },
        {
          title: '体育领域大数据监督应用',
          path: '/sport',
          icon: require('@/assets/img/tiyu-icon.png')
        },
        {
          title: '信访领域大数据监督应用',
          path: '/letter-visit',
          icon: require('@/assets/img/xinfang-icon.png')
        }
      ]
    };
  },
  methods: {
    handleClick(item) {
      let routeData = this.$router.resolve({
        path: item.path
      });
      window.open(routeData.href, item.path);
    }
  }
};
</script>
<style lang="less" scoped>
.screen-wrap {
  background-image: url(../assets/img/index-bodybg.png);
  .head-bar {
    width: 100%;
    height: 5.9375rem;
    line-height: 5.9375rem;
    text-align: center;
    color: #fff;
    font-size: 2.5rem;
    font-family: logo;
    background-image: url(../assets/img/index-headbg.png);
    background-repeat: no-repeat;
    span {
      letter-spacing: 3px;
      background: linear-gradient(180deg, #fff 0%, #f5fdff 28%, #4fefff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .menu {
    padding-top: 15rem;
    .item {
      margin: 0 1.625rem;
      width: 26.875rem;
      height: 23.9375rem;
      background-image: url(../assets/img/index-itembg.png);
      background-repeat: no-repeat;
      cursor: pointer;
      .name {
        font-size: 1.75rem;
        font-family: number;
        background: linear-gradient(180deg, #fff 0%, #f5fdff 28%, #4fefff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      &:first-child {
        .name {
          background: linear-gradient(270deg, #00ffff 0%, #0e5fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      &:hover {
        img {
          animation: up 1s ease-in-out;
        }
      }
      @keyframes up {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0);
        }
      }
      @-webkit-keyframes up {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0);
        }
      }
    }
  }
}
</style>
