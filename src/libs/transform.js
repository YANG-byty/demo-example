export const transformTreeData = (original, config, isTreeSelect = false) => {
  let res = [];
  original.forEach((item) => {
    let title = item[config.title];
    let countUser = item[config.countUser];
    let value = item[config.value];
    let children = item[config.children];
    if (children && children.length) {
      children = transformTreeData(children, config);
    }
    res.push({
      value,
      children,
      title: `${title}（${countUser}）`,
      selected: false,
      pid: item.pid,
      parentId: item.parentId,
      userIds: item.userIds,
      parentIds: item.parentIds,
      id: item.id,
      orgName: item.orgName,
      orgCode: item.orgCode,
      leader: item.leader,
      expand: !isTreeSelect
    });
  });
  return res;
};
//转化权限树数据
export const transformPermissionTreeData = (original, config) => {
  let res = [];
  original.forEach((item) => {
    let children = item[config.children];
    let title = item[config.title];
    if (children && children.length) {
      children = transformPermissionTreeData(children, config);
    }
    res.push({
      ...item,
      title: `${title}${item.remark ? '（' : ''}${item.remark}${item.remark ? '）' : ''}`,
      children,
      expand: true
    });
  });
  return res;
};
//转换角色树数据
export const transformRoleTreeData = (original, config, tag = false) => {
  let res = [];
  original.forEach((item) => {
    let title = item[config.title];
    let value = item[config.value];
    let children = item[config.children];
    let disabled = false;
    let _disabled = false;
    if (item.parentId === '0') {
      disabled = true;
    }
    if (item.parentId === '0' && tag) {
      _disabled = true;
    }
    if (children && children.length) {
      children = transformRoleTreeData(children, config);
    }
    res.push({
      value,
      children,
      title,
      disabled,
      _disabled,
      selected: false,
      parentId: item.parentId,
      id: item.id,
      roleName: item.roleName,
      remark: item.remark,
      expand: true,
      _showChildren: !!tag
    });
  });
  return res;
};
//菜单数据转化
export const transformMenuTreeData = (original, config) => {
  if (!original) return [];
  let res = [];
  original.forEach((item) => {
    let children = item[config.children];
    if (children && children.length) {
      children = transformMenuTreeData(children, config);
    }
    let header = '';
    if (item.menuType === 'M') {
      header = item.header;
    }
    let auth = '';
    if (item.visible === '0') {
      auth = ['hidden'];
    }
    res.push({
      children,
      header,
      auth,
      target: item.target,
      icon: item.icon,
      parentId: item.parentId,
      title: item.title,
      path: item.path,
      id: item.id
    });
  });
  return res;
};

/**
 * @description 转化区划，条线树形数据
 * @param {Array} original 需要转化的源数据
 * @param {Object} config 专化数据的对应规则
 * @param {Boolean} tag 没有子项是否加载
 * @param {Boolean} isNum 组织是否需要显示人数
 * @param {Array} callBack 树需要回显的数据
 * @param {Boolean} isDisable 禁用的节点是否可操作
 */
export const transformAreaTreeData = (original, config, tag = true, isNum = false, callBack = [], isDisable = false) => {
  if (!original) return [];
  let res = [];
  original.forEach((item) => {
    let title = item[config.title];
    let value = item[config.value];
    let ifSub = item[config.ifSub];
    let checked = false;
    let disabled = false;
    if (isNum && item.userNum) {
      title = `${item[config.title]}(${item.userNum})`;
    }
    if (isDisable && item.status == 1) {
      disabled = true;
    }
    if (ifSub == 1 && config.ifSubDisable) {
      disabled = true;
    }
    if (callBack.length > 0) {
      callBack.forEach((x) => {
        if (x === item.id) {
          checked = true;
        }
      });
    }
    let obj = {
      value,
      title,
      ifSub,
      selected: false,
      checked,
      disabled,
      ...item
    };
    if (ifSub == 1 && tag) {
      obj.loading = false;
      obj.children = [];
    }
    res.push(obj);
  });
  return res;
};

//树形表格数据转化
export const transformTableTreeData = (original, config) => {
  let res = [];
  original.forEach((item) => {
    let obj = {
      ...item
    };
    if (item.ifSub == 1) {
      obj.children = [];
      obj._loading = false;
    }
    res.push({
      ...item
    });
  });
  return res;
};

export const transformGroupTreeData = (original, config) => {
  let res = [];
  original.forEach((item) => {
    let title = item.className;
    let value = item.id;
    let children = item.secondaryClass;
    let disabled = false;
    if (item.pid == '0' && children.length > 0) {
      disabled = true;
    }
    if (children && children.length) {
      children = transformGroupTreeData(children, config);
    }
    res.push({
      value,
      children,
      title,
      disabled,
      id: item.id,
      expand: true
    });
  });
  return res;
};
