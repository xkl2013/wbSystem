import pathToRegexp from 'path-to-regexp';

export const urlToList = (url: string): string[] => {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}

export const getFlatMenuKeys = (menuData: any[]) => {
  let keys: any[] = [];
  menuData.forEach(item => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
};

export const getMenuMatches = (menuData: any[], path: string) =>
  getFlatMenuKeys(menuData).filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

export const getDefaultCollapsedSubMenus = (props: any): any[] => {
  const {
    history: { location },
    menuData,
  } = props;
  const data = urlToList(location.pathname)
    .map(item => getMenuMatches(menuData, item)[0])
    .filter(item => item)
    .reduce((acc, curr) => [...acc, curr], ['/']);
  return data
}
export const checkoutThirdMenu = (item: any) => {
  const children = item.children || [];
  for (let i = 0; i < children.length; i += 1) {
    const obj = children[i];
    const thirdChild = obj.children || [];
    // 如果非tabList显示则使用sliderBar展示
    if ((!obj.tagGroup || obj.tagGroup.length === 0) && !obj.hideSecondMenu) {

      return true
    }
    for (let j = 0; j < thirdChild.length; j += 1) {
      if (thirdChild[j].children && thirdChild[j].children.length && !thirdChild[j].hideSecondMenu) {   // 排除功能按钮
        return true
      }
    }
  }
  return false
}
export const conversionPath = (path: string) => {
  if (path && path.indexOf('http') === 0) {
    return path;
  }
  return `/${path || ''}`.replace(/\/+/g, '/');
};

export const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};


