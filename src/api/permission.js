import request from '@/plugins/request';
//获取当前用户的菜单
export function getUserMenus(params) {
  return request({
    url: '/litigation/current/user/menu',
    method: 'get',
    params
  });
}

//获取当前用户的权限点
export function getUserPerms() {
  return request({
    url: '/litigation/current/user/perms',
    method: 'get'
  });
}
