import request from '@/plugins/request';

// ----------悬浮框-林业---------------

// 模型说明
export function getDetails(data) {
  return request({
    url: '/screenServer/forestryModel/getDetails',
    method: 'get',
    params: data
  });
}
// 处理情况
export function getDisposeConditionModel(data) {
  return request({
    url: '/screenServer/forestryModel/getDisposeCondition',
    method: 'get',
    params: data
  });
}
// 预警内容
export function getWarningContent(data) {
  return request({
    url: '/screenServer/forestryModel/getWarningContent',
    method: 'get',
    params: data
  });
}
// 预警统计
export function getWarningStatistics(data) {
  return request({
    url: '/screenServer/forestryModel/getWarningStatistics',
    method: 'get',
    params: data
  });
}

// ----------悬浮框-信访---------------

// 模型说明
export function getLetterDetails(data) {
  return request({
    url: '/screenServer/petitionModel/getDetails',
    method: 'get',
    params: data
  });
}
// 处理情况
export function getLetterDisposeConditionModel(data) {
  return request({
    url: '/screenServer/petitionModel/getDisposeCondition',
    method: 'get',
    params: data
  });
}
// 预警内容
export function getLetterWarningContent(data) {
  return request({
    url: '/screenServer/petitionModel/getWarningContent',
    method: 'get',
    params: data
  });
}
// 预警统计
export function getLetterWarningStatistics(data) {
  return request({
    url: '/screenServer/petitionModel/getWarningStatistics',
    method: 'get',
    params: data
  });
}

// ----------悬浮框-体育---------------

// 模型说明
export function getSportDetails(data) {
  return request({
    url: '/screenServer/sportsModel/getDetails',
    method: 'get',
    params: data
  });
}
// 处理情况
export function getSportDisposeConditionModel(data) {
  return request({
    url: '/screenServer/sportsModel/getDisposeCondition',
    method: 'get',
    params: data
  });
}
// 预警内容
export function getSportWarningContent(data) {
  return request({
    url: '/screenServer/sportsModel/getWarningContent',
    method: 'get',
    params: data
  });
}
// 预警统计
export function getSportWarningStatistics(data) {
  return request({
    url: '/screenServer/sportsModel/getWarningStatistics',
    method: 'get',
    params: data
  });
}
