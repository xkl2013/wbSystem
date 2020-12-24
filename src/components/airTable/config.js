import { getComponent } from './component/baseComponent';

export const config = {
    1: {
        name: '单行文本',
        component: getComponent(1),
        icon: 'iconziduan-danhangwenben',
    },
    2: {
        name: '超链接',
        component: getComponent(2),
        icon: 'iconziduan-chaolianjie',
    },
    3: {
        name: '多行文本',
        component: getComponent(3),
        icon: 'iconziduan-duohangwenben',
    },
    4: {
        name: '附件上传',
        component: getComponent(4),
        icon: 'iconziduan-fujian',
    },
    5: {
        name: '复选',
        component: getComponent(5),
        icon: 'iconziduan-fuxuan',
    },
    6: {
        name: '下拉单选',
        component: getComponent(6),
        icon: 'iconziduan-xiala',
    },
    7: {
        name: '下拉多选',
        component: getComponent(7),
        icon: 'iconziduan-xialaduoxuan',
    },
    8: {
        name: '评级',
        component: getComponent(8),
        icon: 'iconziduan-pingji',
    },
    9: {
        name: '数字输入',
        component: getComponent(9),
        icon: 'iconziduan-shuzi',
    },
    10: {
        name: '百分比',
        component: getComponent(10),
        icon: 'iconziduan-baifenbi',
    },
    11: {
        name: '日期',
        component: getComponent(11),
        icon: 'iconziduan-riqi',
    },
    12: {
        name: '引用',
        component: getComponent(12),
        icon: 'iconziduan-yinyong',
    },
    13: {
        name: '模糊搜索多选',
        component: getComponent(13),
        icon: 'iconziduan-lianxiangduoxuan',
    },
    14: {
        name: '树结构',
        component: getComponent(14),
        icon: 'iconziduan-ren',
    },
    15: {
        name: '文本搜索框',
        component: getComponent(15),
        icon: 'iconziduan-lianxiangdanxuan',
    },
    17: {
        name: '级联选择',
        component: getComponent(17),
        icon: 'iconziduan-lianxiangdanxuan',
    },
    18: {
        name: '动态返点阶梯', // 年框模块特有控件将在业务里面维护,不在此处维护,防止出现异常,默认用单行文本去接受
        component: getComponent(1),
        icon: 'iconziduan-danhangwenben',
    },
    19: {
        name: '静态返点阶梯', // 年框模块特有控件将在业务里面维护,不在此处维护,防止出现异常,默认用单行文本去接受
        component: getComponent(1),
        icon: 'iconziduan-danhangwenben',
    },
    20: {
        name: '日趋区间选择',
        component: getComponent(20),
        icon: 'iconziduan-lianxiangdanxuan',
    },
};
export default config;
