import request from '@/plugins/request';

// ----------预警情况---------------
export function forestryModelType(data) {
  return request({
    url: '/screenServer/forestryModelType/list',
    method: 'get',
    params: data
  });
}
// 环形图
export function getWarningCondition(data) {
  return request({
    url: '/screenServer/forestryWarningData/getWarningCondition',
    method: 'get',
    params: data
  });
}
// 预警模型一级表头
export function getWarningModel(data) {
  return request({
    url: '/screenServer/forestryWarningData/getWarningModel',
    method: 'get',
    params: data
  });
}
// 预警模型二级表格
export function getWarningModelPage(data) {
  return request({
    url: '/screenServer/forestryWarningData/getWarningModelPage',
    method: 'get',
    params: data
  });
}

// ----------各区县林业预警统计---------------

// 各区县林业预警统计-地图
export function getAreaListMap(data) {
  return request({
    url: '/screenServer/forestryWarningData/getAreaList',
    method: 'get',
    params: data
  });
}
// 具体模型
export function forestryModelList(data) {
  return request({
    url: '/screenServer/forestryModel/list',
    method: 'get',
    params: data
  });
}
// 预警情况
export function getModelWarningCondition(data) {
  return request({
    url: '/screenServer/forestryWarningData/getModelWarningCondition',
    method: 'get',
    params: data
  });
}
// 处置情况
export function getModelDisposeCondition(data) {
  return request({
    url: '/screenServer/forestryWarningDispose/getModelDisposeCondition',
    method: 'get',
    params: data
  });
}
// 处置成效
export function getModelDisposeResult(data) {
  return request({
    url: '/screenServer/forestryWarningDispose/getModelDisposeResult',
    method: 'get',
    params: data
  });
}

// ----------预警对比---------------

// 高频问题
export function getHighFrequency(data) {
  return request({
    url: '/screenServer/forestryWarningData/getHighFrequency',
    method: 'get',
    params: data
  });
}
// 各区县预警情况对比
export function getAreaContrast(data) {
  return request({
    url: '/screenServer/forestryWarningData/getAreaContrast',
    method: 'get',
    params: data
  });
}
// 历年预警趋势对比
export function getHistoryWarning(data) {
  return request({
    url: '/screenServer/forestryWarningData/getHistoryWarning',
    method: 'get',
    params: data
  });
}
