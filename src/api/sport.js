import request from '@/plugins/request';

// ----------中间地图部分---------------

// 地图
export function getAreaList(data) {
  return request({
    url: '/screenServer/sportsWarningData/getAreaList',
    method: 'get',
    params: data
  });
}
// 地图下面统计
export function getModelTypeData(data) {
  return request({
    url: '/screenServer/sportsModelType/getModelTypeData',
    method: 'get',
    params: data
  });
}

// ----------预警情况统计---------------

export function getSportsWarningData(data) {
  return request({
    url: '/screenServer/sportsWarningData/getWarningCondition',
    method: 'get',
    params: data
  });
}
// 各预警情况
export function getSportsModel(data) {
  return request({
    url: '/screenServer/sportsModel/getWarningCondition',
    method: 'get',
    params: data
  });
}

// ----------预警情况分析---------------

// 统计环形图
export function getWarningAnalysis(data) {
  return request({
    url: '/screenServer/sportsWarningData/getWarningAnalysis',
    method: 'get',
    params: data
  });
}
// 预警情况分析-处置成效统计
export function getDisposeResult(data) {
  return request({
    url: '/screenServer/sportsWarningData/getDisposeResult',
    method: 'get',
    params: data
  });
}
// 预警详情/处置详情-表头   类型 1预警详情，2处置详情
export function getWarningDisposeDetails(data) {
  return request({
    url: '/screenServer/sportsWarningData/getWarningDisposeDetails',
    method: 'get',
    params: data
  });
}
// 预警详情/处置详情-表格   类型 1预警详情，2处置详情
export function getWarningDisposeDetailsPage(data) {
  return request({
    url: '/screenServer/sportsWarningData/getWarningDisposeDetailsPage',
    method: 'get',
    params: data
  });
}
