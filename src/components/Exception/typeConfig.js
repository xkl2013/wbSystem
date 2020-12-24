/* global CDN_PATH */
const config = {
  403: {
    img: `${CDN_PATH}/403.png`,
    title: '暂无权限',
    desc: '您没有权限使用该功能,请联系管理员',
  },
  404: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
    title: '404',
    desc: '抱歉，你访问的页面不存在',
  },
  500: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
    title: '500',
    desc: '抱歉，服务器出错了',
  },
};

export default config;
