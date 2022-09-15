import request from '@/plugins/request';

export function getAccessToken(data) {
  return request({
    url: '/litigation/auth/client/token',
    method: 'post',
    data
  });
}

export function removeAccessToken(data) {
  return request({
    url: '/auth/token/remove',
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
export function updatePassword(data) {
  return request({
    url: '/user/user/uuser/updatePassword',
    method: 'get',
    params: data
  });
}
export function updateAvatar(data) {
  return request({
    url: '/user/user/changeAvatar',
    method: 'get',
    params: data
  });
}
export function loginTypeList() {
  return request({
    url: '/sys/login/type/list',
    method: 'get'
  });
}
//绑定账号
export function boundAccountList(data) {
  return request({
    url: '/user/user/uauthAssociatedAccount/bind',
    method: 'post',
    data
  });
}
//获取登录时间
export function getCurrentLoginTime() {
  return request({
    url: '/user/user/getUserLoginDetailDto',
    method: 'get'
  });
}
//获取登录历史
export function getLoginHistory() {
  return request({
    url: '/user/user/getUserLoginHistory',
    method: 'get'
  });
}
