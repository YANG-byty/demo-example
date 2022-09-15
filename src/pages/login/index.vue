<template>
  <div class="page-account">
    <div id="loader-wrapper">
      <div id="loader"></div>
      <div class="loader-section section-left"></div>
      <div class="loader-section section-right"></div>
      <div class="load_title">{{ currntLoginStatus }}</div>
    </div>
  </div>
</template>

<script>
import Setting from '@/setting';
import { mapActions } from 'vuex';
import { authLogin } from '@api/redirect';
import util from '@/libs/util';
import { getURLParameters } from '@/libs/util';
export default {
  data() {
    return {
      currntLoginStatus: '系统资源加载中...'
    };
  },
  mounted() {
    const code = this.$route.query.code;
    const token = util.cookies.get('token');
    const otherPlatformTag = this.parseUrl().token;

    //省平台跳转进来
    if (otherPlatformTag) {
      return;
    }

    // 清廉丽水综合平台正常登录进来
    if (code) {
      let params = {
        code,
        redirectUri: Setting.OAUTH_REDIRECT_URI
      };
      this.login(params)
        .then(() => {
          this.$router.push('/');
        })
        .catch(() => {
          this.currntLoginStatus = '登录失败...';
        });

      return;
    }
    // 2.清廉丽水综合平台工作桌面跳转
    if (!code && token) {
      this.getUserInfo(token)
        .then(() => {
          this.$router.push('/');
        })
        .catch(() => {
          this.currntLoginStatus = '登录失败...';
        });

      return;
    }
    // 去清廉丽水综合平台登录页
    this.authLogin();
  },
  methods: {
    ...mapActions('admin/account', ['login', 'getUserInfo']),
    /***
     * @description 去清廉丽水综合平台的登录页
     **/
    authLogin() {
      window.location.href = authLogin();
    },
    /***
     * @description 解析第三方跳转过来的地址获取登录标记
     **/
    parseUrl() {
      // const url = 'https://www.baidu.com/?token=%27asdfasdf%27';
      const url = decodeURIComponent(window.location.href);
      return getURLParameters(url);
    }
  }
};
</script>
<style scoped lang="less">
.page-account {
  height: 100%;
  margin: 0px;
  padding: 0px;
}
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
}

#loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #fff;
  -webkit-animation: spin 2s linear infinite;
  -ms-animation: spin 2s linear infinite;
  -moz-animation: spin 2s linear infinite;
  -o-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  z-index: 1001;
}

#loader:before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #fff;
  -webkit-animation: spin 3s linear infinite;
  -moz-animation: spin 3s linear infinite;
  -o-animation: spin 3s linear infinite;
  -ms-animation: spin 3s linear infinite;
  animation: spin 3s linear infinite;
}

#loader:after {
  content: '';
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #fff;
  -moz-animation: spin 1.5s linear infinite;
  -o-animation: spin 1.5s linear infinite;
  -ms-animation: spin 1.5s linear infinite;
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

#loader-wrapper .loader-section {
  position: fixed;
  top: 0;
  width: 51%;
  height: 100%;
  background: #1890ff;
  z-index: 1000;
  -webkit-transform: translateX(0);
  -ms-transform: translateX(0);
  transform: translateX(0);
}

#loader-wrapper .loader-section.section-left {
  left: 0;
}

#loader-wrapper .loader-section.section-right {
  right: 0;
}

.loaded #loader-wrapper .loader-section.section-left {
  -webkit-transform: translateX(-100%);
  -ms-transform: translateX(-100%);
  transform: translateX(-100%);
  -webkit-transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.loaded #loader-wrapper .loader-section.section-right {
  -webkit-transform: translateX(100%);
  -ms-transform: translateX(100%);
  transform: translateX(100%);
  -webkit-transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.loaded #loader {
  opacity: 0;
  -webkit-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
}

.loaded #loader-wrapper {
  visibility: hidden;
  -webkit-transform: translateY(-100%);
  -ms-transform: translateY(-100%);
  transform: translateY(-100%);
  -webkit-transition: all 0.3s 1s ease-out;
  transition: all 0.3s 1s ease-out;
}

.no-js #loader-wrapper {
  display: none;
}

.no-js h1 {
  color: #222222;
}

#loader-wrapper .load_title {
  font-family: 'Open Sans';
  color: #fff;
  font-size: 19px;
  width: 100%;
  text-align: center;
  z-index: 9999999999999;
  position: absolute;
  top: 60%;
  opacity: 1;
  line-height: 30px;
}

#loader-wrapper .load_title span {
  font-weight: normal;
  font-style: italic;
  font-size: 13px;
  color: #fff;
  opacity: 0.5;
}
</style>
