import request from '@/plugins/request';

// ----------中间地图部分---------------

// 地图模型类型
export function getModelTypeData(data) {
  return request({
    url: '/screenServer/petitionModelType/getModelTypeData',
    method: 'get',
    params: data
  });
}
// 地图
export function getAreaList(data) {
  return request({
    url: '/screenServer/petitionWarningData/getAreaList',
    method: 'get',
    params: data
  });
}
// 各监督模型占比
export function getContrast(data) {
  return request({
    url: '/screenServer/petitionModel/getContrast',
    method: 'get',
    params: data
  });
}

// ----------预警情况---------------

// 左边数据
export function getWarningCondition(data) {
  return request({
    url: '/screenServer/petitionWarningData/getWarningCondition',
    method: 'get',
    params: data
  });
}
// 右边列表
export function getWarningConditionPage(data) {
  return request({
    url: '/screenServer/petitionWarningData/getWarningConditionPage',
    method: 'get',
    params: data
  });
}
// ----------主要情况---------------

// 上访数据
export function getMainConditions(data) {
  return request({
    url: '/screenServer/petitionWarningData/getMainConditions',
    method: 'get',
    params: data
  });
}
// 资金维度
export function getFundsLatitude(data) {
  return request({
    url: '/screenServer/petitionWarningData/getFundsLatitude',
    method: 'get',
    params: data
  });
}

// ----------高频问题---------------

export function getHighFrequency(data) {
  return request({
    url: '/screenServer/petitionWarningData/getHighFrequency',
    method: 'get',
    params: data
  });
}

// ----------历年预警趋势对比---------------

export function getHistoryWarning(data) {
  return request({
    url: '/screenServer/petitionWarningData/getHistoryWarning',
    method: 'get',
    params: data
  });
}
// ----------监督成效---------------

export function getResultsContrast(data) {
  return request({
    url: '/screenServer/petitionWarningDispose/getResultsContrast',
    method: 'get',
    params: data
  });
}
