import request from '@/plugins/request';

export function clientToken(data) {
  return request({
    url: '/screenServer/auth/client/token',
    method: 'post',
    data
  });
}

export function removeAccessToken(data) {
  return request({
    url: '/screenServer/auth/token/remove',
    method: 'delete',
    data
  });
}

export function getLoginUserInfo() {
  return request({
    url: '/user/user/getUserLoginInfo',
    method: 'get'
  });
}
