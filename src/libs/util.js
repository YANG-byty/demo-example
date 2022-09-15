/* eslint-disable */
import cookies from './util.cookies';
import log from './util.log';
import db from './util.db';
import Setting from '@/setting';
const util = {
  cookies,
  log,
  db
};
function tTitle(title = '') {
  if (window && window.$t) {
    if (title.indexOf('$t:') === 0) {
      return window.$t(title.split('$t:')[1]);
    } else {
      return title;
    }
  } else {
    return title;
  }
}

/**
 * @description: 根据数组内对象某一属性(number类型)进行排序
 * @param {*} source 目标数组
 * @param {*} sortField 排序属性
 * @param {*} sortType ASC DESC 默认升序
 * @return {*}
 */
export const sortFn = (source, sortField, sortBy = 'ASC') => {
  return source.sort((a, b) => (sortBy === 'ASC' ? a[sortField] - b[sortField] : b[sortField] - a[sortField]));
};

/**
 * 处理身份证号，加省略号
 * str：要进行隐藏的变量
 * frontLen: 前面需要保留几位
 * endLen: 后面需要保留几位
 * @param str
 * @param frontLen
 * @param endLen
 */
export const hiddenCardId = (str, frontLen = 4, endLen = 4) => {
  var len = str.length - frontLen - endLen;
  var start = '';
  for (var i = 0; i < len; i++) {
    start += '*';
  }
  return str.substring(0, frontLen) + start + str.substring(str.length - endLen);
};

/**
 * 处理数字，加逗号
 * @param str
 */
export const handalNumber = (str) => {
  return str
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, '$1,')
    .replace(/,$/, '')
    .split('')
    .reverse()
    .join('');
};

/**
 * 函数防抖
 * functionTimeOut // 函数防抖节流存储对象
 * functionDelay // 延迟执行时间
 * @param that
 * @param fn
 * @param delay
 */
export const debounce = (that, fn, delay) => {
  delay = delay || 3000;

  if (that.functionTimeOut) {
    clearTimeout(that.functionTimeOut);
  }
  const context = that;
  const args = arguments;
  that.functionTimeOut = setTimeout(function () {
    fn.apply(context, args);
  }, delay);
};

/**
 * @description 更改标题
 * @param {Object} title 标题
 * @param {Object} count 未读消息数提示（可视情况选择使用或不使用）
 */
util.title = function ({ title, count }) {
  title = tTitle(title);
  let fullTitle = title ? `${title} - ${Setting.titleSuffix}` : Setting.titleSuffix;

  if (count) fullTitle = `(${count}条消息)${fullTitle}`;
  window.document.title = fullTitle;
};

function requestAnimation(task) {
  if ('requestAnimationFrame' in window) {
    return window.requestAnimationFrame(task);
  }

  setTimeout(task, 16);
}

export { requestAnimation };

export function clearLoginInfo() {
  util.cookies.remove('token');
  util.cookies.remove('nick_name');
  util.cookies.remove('token_type');
  util.cookies.remove('user_id');
  localStorage.clear();
  sessionStorage.clear();
}

export const isString = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'String'; //是否字符串
};
export const isObj = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object'; //是否是对象
};
export const isArray = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Array'; //是否是数组
};
export const isNumber = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Number'; //是否是数字
};
export const isFunction = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Function'; //是否是函数
};
export const isNull = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Null'; //是否Null
};
export const isUndefined = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'; //是否Undefined
};
export const isBoolean = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'; //是否Boolean
};
export const isDate = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Date'; //是否Date
};
export const uniqueToArr = (arr) => {
  let obj = {};
  let ss = arr.reduce(function (item, next) {
    obj[next.id] ? '' : (obj[next.id] = true && item.push(next));
    return item;
  }, []);
  return ss;
};
export const sumOfArr = (arr) => {
  let s = 0;
  arr.forEach((val, idx, arr) => {
    let ss = val - 0;
    s += ss;
  }, 0);

  return s;
};

export const getURLParameters = (url) =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
    {}
  );

export default util;
