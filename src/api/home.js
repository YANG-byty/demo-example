import request from '@/plugins/request';

// 地图
export function getAreaList(data) {
  return request({
    url: '/screenServer/homePage/getAreaList',
    method: 'get',
    params: data
  });
}
// ----------预警情况统计---------------

export function getSportsWarningData(data) {
  return request({
    url: '/screenServer/homePage/getTotalWarning',
    method: 'get',
    params: data
  });
}
// ----------信访高频问题---------------
export function getXFHighFrequency(data) {
  return request({
    url: '/screenServer/petitionWarningData/getHighFrequency',
    method: 'get',
    params: data
  });
}
// ----------体育高频问题---------------
export function getTYHighFrequency(data) {
  return request({
    url: '/screenServer/sportsWarningData/getHighFrequency',
    method: 'get',
    params: data
  });
}
// ----------林业高频问题---------------
export function getLYHighFrequency(data) {
  return request({
    url: '/screenServer/forestryWarningData/getHighFrequency',
    method: 'get',
    params: data
  });
}
// ----------历年预警趋势对比---------------
export function getHistoryWarning(data) {
  return request({
    url: '/screenServer/homePage/getHistoryWarning',
    method: 'get',
    params: data
  });
}
// 各区县预警情况对比
export function getAreaContrast(data) {
  return request({
    url: '/screenServer/homePage/getAreaContrast',
    method: 'get',
    params: data
  });
}
// 统计环形图
export function getWarningAnalysis(data) {
  return request({
    url: '/screenServer/homePage/getDomainStatistics',
    method: 'get',
    params: data
  });
}
