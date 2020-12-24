// airTable公共接口
/* eslint-disable import/no-cycle */
import airTableApi from '@/services/airTable';
// 合同回款部分接口
import settleApi from '@/pages/business/settleManage/charge/service';
// 内容客户部分接口
import contentApi from '@/pages/business/customer/content/service';
// KOL刊例部分接口
import publicationApi from '@/pages/business/talent/publication/blogger/service';
// 客户跟进部分接口
import followUpApi from '@/pages/business/customer/followup/airtable.config';
// 年框项目明细部分接口
import frameManageList from '@/pages/business/frameManage/rebate/airtable.config';
// 年框客户部分接口
import frameManageCustom from '@/pages/business/frameManage/customer/airtable.config';
// 年框项目部分接口
import frameManageProject from '@/pages/business/frameManage/project/airtable.config';
// 直播产品接口
import liveProductApi from '@/pages/business/live/product/service';
import {
    formatColumns as productFormatColumns,
    emitChangeCell4Msg as productEmitChangeCell,
} from '@/pages/business/live/product';
// 艺人直播场次接口
import liveSessionApi from '@/pages/business/live/session/service';
// 直播初筛接口
import liveSessionFirstApi from '@/pages/business/live/session/first/service';
import {
    formatColumns as firstFormatColumns,
    emitChangeCell4Msg as firstEmitChangeCell,
} from '@/pages/business/live/session/first';
// 直播二筛接口
import liveSessionSecondApi from '@/pages/business/live/session/second/service';
import {
    formatColumns as secondFormatColumns,
    emitChangeCell4Msg as secondEmitChangeCell,
} from '@/pages/business/live/session/second';
// 直播最终接口
import liveSessionFinalApi from '@/pages/business/live/session/final/service';
import {
    formatColumns as finalFormatColumns,
    emitChangeCell4Msg as finalEmitChangeCell,
} from '@/pages/business/live/session/final';
// 直播排序接口
import liveSessionSortedApi from '@/pages/business/live/session/sorted/service';
import {
    formatColumns as sortedFormatColumns,
    emitChangeCell4Msg as sortedEmitChangeCell,
} from '@/pages/business/live/session/sorted';
// 博主直播场次接口
import liveBloggerSessionApi from '@/pages/business/live/bloggerSession/service';
// 博主直播初筛接口
import liveBloggerSessionFirstApi from '@/pages/business/live/bloggerSession/first/service';
import {
    formatColumns as bloggerFirstFormatColumns,
    emitChangeCell4Msg as bloggerFirstEmitChangeCell,
} from '@/pages/business/live/bloggerSession/first';
// 博主直播二筛接口
import liveBloggerSessionSecondApi from '@/pages/business/live/bloggerSession/second/service';
import {
    formatColumns as bloggerSecondFormatColumns,
    emitChangeCell4Msg as bloggerSecondEmitChangeCell,
} from '@/pages/business/live/bloggerSession/second';
// 博主直播最终接口
import liveBloggerSessionFinalApi from '@/pages/business/live/bloggerSession/final/service';
import {
    formatColumns as bloggerFinalFormatColumns,
    emitChangeCell4Msg as bloggerFinalEmitChangeCell,
} from '@/pages/business/live/bloggerSession/final';
// 博主直播排序接口
import liveBloggerSessionSortedApi from '@/pages/business/live/bloggerSession/sorted/service';
import {
    formatColumns as bloggerSortedFormatColumns,
    emitChangeCell4Msg as bloggerSortedEmitChangeCell,
} from '@/pages/business/live/bloggerSession/sorted';
// 直播商品子表
import liveProductChildApi from '@/pages/business/live/talentChild/service';
import { formatColumns as productChildFormatColumns } from '@/pages/business/live/talentChild';

// 全球招募报名库接口
import recruitApi from '@/pages/business/recruit/list/service';
import {
    formatColumns as recruitFormatColumns,
    emitChangeCell4Msg as recruitEmitChangeCell,
} from '@/pages/business/recruit/list';
// 全球招募报名库接口
import bloggerCRMApi from '@/pages/business/bloggerCRM/service';
import {
    formatColumns as bloggerCRMFirstFormatColumns,
    emitChangeCell4Msg as bloggerCRMFirstEmitChangeCell,
} from '@/pages/business/bloggerCRM/first';
import {
    formatColumns as bloggerCRMSecondFormatColumns,
    emitChangeCell4Msg as bloggerCRMSecondEmitChangeCell,
} from '@/pages/business/bloggerCRM/second';
import {
    formatColumns as bloggerCRMCommunicatingFormatColumns,
    emitChangeCell4Msg as bloggerCRMCommunicatingEmitChangeCell,
} from '@/pages/business/bloggerCRM/communicating';
import {
    formatColumns as bloggerCRMFinalFormatColumns,
    emitChangeCell4Msg as bloggerCRMFinalEmitChangeCell,
} from '@/pages/business/bloggerCRM/final';

// 商务线索管理接口
import threadManageApi from '@/pages/business/threadManage/list/service';
import {
    formatColumns as threadManageFormatColumns,
    emitChangeCell4Msg as threadManageEmitChangeCell,
} from '@/pages/business/threadManage/list';

import { checkPathname } from '@/components/AuthButton';

/*
 * @params(type)  业务类型主键
 * @params(pathname)  路径地址
 * @params(name)   模块名称
 * @params(pageType)   展现形式  'page'|'modal'
 */
const config = {
    1: {
        type: 1,
        pathname: '/foreEnd/business/talentManage/talent/actor/detail',
        name: '艺人',
        pageType: 'page',
    },
    2: {
        type: 2,
        pathname: '/foreEnd/business/talentManage/talent/blogger/detail',
        name: '博主',
        pageType: 'page',
    },
    3: {
        type: 3,
        pathname: '/foreEnd/business/customer/customer/detail',
        name: '客户',
        pageType: 'page',
    },
    4: {
        type: 4,
        pathname: '/foreEnd/business/customer/thread/detail',
        name: '线索',
        pageType: 'page',
    },
    5: {
        type: 5,
        pathname: '/foreEnd/business/project/establish/detail',
        name: '立项',
        pageType: 'page',
    },
    6: {
        type: 6,
        pathname: '/foreEnd/business/project/manage/detail',
        name: '项目',
        pageType: 'page',
    },
    7: {
        type: 7,
        pathname: '/foreEnd/business/project/contract/detail',
        name: '合同',
        pageType: 'page',
    },
    8: {
        type: 8,
        pathname: '/foreEnd/approval/apply/myjob/detail',
        name: '通用审批',
        pageType: 'page',
    },
    9: {
        type: 9,
        pathname: '/foreEnd/business/feeManage/reimbursement/detail',
        name: '费用报销',
        pageType: 'page',
    },
    10: {
        type: 10,
        pathname: '/foreEnd/business/feeManage/apply/detail',
        name: '费用申请',
        pageType: 'page',
    },
    11: {
        type: 11,
        pathname: '/foreEnd/approval/approval/business/detail', // 兼容老业务
        pathnameCallback: (type) => {
            // 1 商单类 2 非商单
            return {
                1: '/foreEnd/approval/approval/business/detail',
                2: '/foreEnd/approval/approval/contract/detail',
            }[type];
        },
        name: '合同条款审核详情',
        pageType: 'page',
    },
    12: {
        type: 12,
        pathname: '/foreEnd/business/customer/followup',
        name: '商务客户',
        pageType: 'modal',
        modalTitle: '商务客户',
        tableId: 1,
        interfaceName: '12',
        isShowComment: true,
        commentSort: 1,
        hasGroup: false,
        noEdit: false,
        noDel: false,
        ...airTableApi,
        ...followUpApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 250,
    },
    13: {
        type: 13,
        pathname: '/foreEnd/calendar/mine',
        name: '我的日历',
        pageType: 'modal',
    },
    14: {
        type: 14, // 业务id
        pathname: '/foreEnd/business/settleManage/charge/register', // 对应路由路径
        name: '合同回款-款项登记', // 编辑详情标题
        pageType: 'modal', // 详情是否弹框展示
        tableId: 3, // 对应后端表id
        interfaceName: '14', // 消息接口id
        isShowComment: true, // 是否展示动态
        commentSort: 1, // 动态排序
        hasGroup: false, // 是否支持拆分
        noEdit: false, // 是否显示编辑按钮
        noDel: false, // 是否显示删除按钮
        ...airTableApi,
        ...settleApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'], // 操作栏配置
    },
    15: {
        type: 15,
        pathname: '/foreEnd/business/settleManage/charge/claim',
        name: '合同回款-款项认领',
        pageType: 'modal',
        tableId: 4,
        interfaceName: '15',
        isShowComment: true,
        commentSort: 1,
        hasGroup: true,
        noEdit: false,
        noDel: false,
        noAdd: true, // 是否显示新增按钮
        ...airTableApi,
        ...settleApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
    },
    16: {
        type: 16,
        pathname: '/foreEnd/business/settleManage/charge/examine',
        name: '合同回款-认领审核',
        pageType: 'modal',
        tableId: 5,
        interfaceName: '16',
        isShowComment: true,
        commentSort: 1,
        hasGroup: true,
        noEdit: true,
        noDel: true,
        noAdd: true,
        ...airTableApi,
        ...settleApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
    },
    17: {
        type: 17,
        pathname: '/foreEnd/business/settleManage/charge/return',
        name: '合同回款-项目回款',
        pageType: 'modal',
        tableId: 6,
        interfaceName: '17',
        isShowComment: true,
        commentSort: 1,
        hasGroup: true,
        noEdit: true,
        noDel: true,
        noAdd: true,
        ...airTableApi,
        ...settleApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
    },
    18: {
        type: 18,
        pathname: '/foreEnd/business/talentManage/schedule',
        name: '档期管理',
        pageType: 'modal',
    },
    19: {
        type: 19,
        pathname: '/foreEnd/business/project/contract/verify/detail',
        name: '项目费用确认单详情',
        pageType: 'page',
    },
    20: {
        type: 19,
        pathname: '/foreEnd/business/settleManage/statement/detail',
        name: '项目结算单',
        pageType: 'page',
    },
    21: {
        type: 21,
        pathname: '/foreEnd/business/talentManage/publication/blogger/doubleMicro',
        name: 'KOL刊例-双微',
        pageType: 'modal',
        tableId: 9,
        interfaceName: '21',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300, // 指定列宽度->可能列名太长
        noAdd: true,
        noEdit: true,
        noDel: true,
    },
    22: {
        type: 22,
        pathname: '/foreEnd/business/talentManage/publication/blogger/redBook',
        name: 'KOL刊例-小红书',
        pageType: 'modal',
        tableId: 10,
        interfaceName: '22',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        noAdd: true,
        noEdit: true,
        noDel: true,
    },
    23: {
        type: 23,
        pathname: '/foreEnd/business/talentManage/publication/blogger/douYin',
        name: 'KOL刊例-抖音',
        pageType: 'modal',
        tableId: 11,
        interfaceName: '23',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        noAdd: true,
        noEdit: true,
        noDel: true,
    },
    24: {
        type: 24,
        pathname: '/foreEnd/business/talentManage/publication/blogger/biliBili',
        name: 'KOL刊例-B站',
        pageType: 'modal',
        tableId: 12,
        interfaceName: '24',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        noAdd: true,
        noEdit: true,
        noDel: true,
    },
    25: {
        type: 25,
        pathname: '/foreEnd/business/talentManage/publication/blogger/kuaiShou',
        name: 'KOL刊例-快手',
        pageType: 'modal',
        tableId: 13,
        interfaceName: '25',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        noAdd: true,
        noEdit: true,
        noDel: true,
    },
    26: {
        type: 26,
        pathname: '/foreEnd/business/customer/content',
        name: '内容客户',
        pageType: 'modal',
        tableId: 14,
        interfaceName: '26',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...contentApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 250,
    },
    // 数据转接 - 单独弹窗 - 无具体业务模块
    27: {
        type: 27,
        name: '数据转接',
        pageType: 'page',
        interfaceName: '27',
    },
    28: {
        type: 28,
        pathname: '/foreEnd/business/talentManage/publication/blogger/doubleMicro',
        name: 'KOL刊例-双微',
        pageType: 'modal',
        tableId: 15,
        originTableId: 9,
        interfaceName: '28',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300, // 指定列宽度->可能列名太长
    },
    29: {
        type: 29,
        pathname: '/foreEnd/business/talentManage/publication/blogger/redBook',
        name: 'KOL刊例-小红书',
        pageType: 'modal',
        tableId: 16,
        originTableId: 10,
        interfaceName: '29',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
    },
    30: {
        type: 30,
        pathname: '/foreEnd/business/talentManage/publication/blogger/douYin',
        name: 'KOL刊例-抖音',
        pageType: 'modal',
        tableId: 17,
        originTableId: 11,
        interfaceName: '30',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
    },
    31: {
        type: 31,
        pathname: '/foreEnd/business/talentManage/publication/blogger/biliBili',
        name: 'KOL刊例-B站',
        pageType: 'modal',
        tableId: 18,
        originTableId: 12,
        interfaceName: '31',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
    },
    32: {
        type: 32,
        pathname: '/foreEnd/business/talentManage/publication/blogger/kuaiShou',
        name: 'KOL刊例-快手',
        pageType: 'modal',
        tableId: 19,
        originTableId: 13,
        interfaceName: '32',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
    },
    33: {
        type: 33,
        pathname: '/foreEnd/business/frameManage/rebate',
        name: '项目年框明细',
        pageType: 'modal',
        tableId: 20,
        interfaceName: '33',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...frameManageList,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        noAdd: true,
    },
    34: {
        type: 34,
        pathname: '/foreEnd/business/frameManage/customer',
        name: '年框客户',
        pageType: 'modal',
        tableId: 21,
        interfaceName: '34',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...frameManageCustom,
    },
    35: {
        type: 35,
        pathname: '/foreEnd/business/frameManage/project',
        name: '年框项目',
        pageType: 'modal',
        tableId: 22,
        isShowComment: true,
        interfaceName: '35',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...frameManageProject,
    },
    36: {
        type: 36,
        pathname: '/foreEnd/business/talentManage/throwManage/detail',
        name: '投放详情',
        pageType: 'page',
    },
    37: {
        type: 37,
        pathname: '/foreEnd/business/live/product',
        name: '产品库',
        pageType: 'modal',
        tableId: 26,
        isShowComment: false,
        interfaceName: '38',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...liveProductApi,
        formatColumns: productFormatColumns,
        emitChangeCell: productEmitChangeCell,
        noDel: true,
        noEdit: !checkPathname('/foreEnd/business/live/product/edit'),
    },
    38: {
        type: 38,
        pathname: '/foreEnd/business/live/session',
        name: '直播场次列表',
        pageType: 'modal',
        tableId: 27,
        isShowComment: false,
        interfaceName: '38',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveSessionApi,
    },
    39: {
        type: 39,
        pathname: '/foreEnd/business/live/session/first',
        name: '产品初筛',
        pageType: 'modal',
        tableId: 28,
        isShowComment: true,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveSessionFirstApi,
        formatColumns: firstFormatColumns,
        emitChangeCell: firstEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/live/session/first/edit'),
        noDel: !checkPathname('/foreEnd/business/live/session/first/del'),
    },
    40: {
        type: 40,
        pathname: '/foreEnd/business/live/session/second',
        name: '产品二筛',
        pageType: 'modal',
        tableId: 29,
        isShowComment: true,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveSessionSecondApi,
        formatColumns: secondFormatColumns,
        emitChangeCell: secondEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/live/session/second/edit'),
        noDel: !checkPathname('/foreEnd/business/live/session/second/del'),
    },
    41: {
        type: 41,
        pathname: '/foreEnd/business/live/session/final',
        name: '最终选品',
        pageType: 'modal',
        tableId: 30,
        isShowComment: true,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveSessionFinalApi,
        formatColumns: finalFormatColumns,
        emitChangeCell: finalEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/live/session/final/edit'),
        noDel: !checkPathname('/foreEnd/business/live/session/final/del'),
    },
    42: {
        type: 42,
        pathname: '/foreEnd/business/live/session/sorted',
        name: '直播排序',
        pageType: 'modal',
        tableId: 31,
        isShowComment: true,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveSessionSortedApi,
        formatColumns: sortedFormatColumns,
        emitChangeCell: sortedEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/live/session/sorted/edit'),
        noDel: !checkPathname('/foreEnd/business/live/session/sorted/del'),
        delLabel: '移除',
    },
    43: {
        type: 43,
        pathname: '/foreEnd/business/live/bloggerProduct',
        name: '产品库',
        pageType: 'modal',
        tableId: 32,
        isShowComment: false,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...liveProductApi,
    },
    44: {
        type: 44,
        pathname: '/foreEnd/business/live/bloggerSession',
        name: '直播场次列表',
        pageType: 'modal',
        tableId: 33,
        isShowComment: false,
        interfaceName: '38',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveBloggerSessionApi,
    },
    45: {
        type: 45,
        pathname: '/foreEnd/business/live/bloggerSession/first',
        name: '产品初筛',
        pageType: 'modal',
        tableId: 34,
        isShowComment: true,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveBloggerSessionFirstApi,
        formatColumns: bloggerFirstFormatColumns,
        emitChangeCell: bloggerFirstEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/live/bloggerSession/first/edit'),
        noDel: !checkPathname('/foreEnd/business/live/bloggerSession/first/del'),
    },
    46: {
        type: 46,
        pathname: '/foreEnd/business/live/bloggerSession/second',
        name: '产品二筛',
        pageType: 'modal',
        tableId: 35,
        isShowComment: true,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveBloggerSessionSecondApi,
        formatColumns: bloggerSecondFormatColumns,
        emitChangeCell: bloggerSecondEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/live/bloggerSession/second/edit'),
        noDel: !checkPathname('/foreEnd/business/live/bloggerSession/second/del'),
    },
    47: {
        type: 47,
        pathname: '/foreEnd/business/live/bloggerSession/final',
        name: '最终选品',
        pageType: 'modal',
        tableId: 36,
        isShowComment: true,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveBloggerSessionFinalApi,
        formatColumns: bloggerFinalFormatColumns,
        emitChangeCell: bloggerFinalEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/live/bloggerSession/final/edit'),
        noDel: !checkPathname('/foreEnd/business/live/bloggerSession/final/del'),
    },
    48: {
        type: 48,
        pathname: '/foreEnd/business/live/bloggerSession/sorted',
        name: '直播排序',
        pageType: 'modal',
        tableId: 37,
        isShowComment: true,
        interfaceName: '37',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveBloggerSessionSortedApi,
        formatColumns: bloggerSortedFormatColumns,
        emitChangeCell: bloggerSortedEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/live/bloggerSession/sorted/edit'),
        noDel: !checkPathname('/foreEnd/business/live/bloggerSession/sorted/del'),
        delLabel: '移除',
    },
    49: {
        type: 49,
        pathname: '',
        name: 'GMV实时分析表',
        pageType: 'modal',
        tableId: 38,
        isShowComment: true,
        interfaceName: '38',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveSessionSortedApi,
        formatColumns: sortedFormatColumns,
    },
    50: {
        type: 50,
        pathname: '',
        name: 'GMV实时分析表',
        pageType: 'modal',
        tableId: 39,
        isShowComment: true,
        interfaceName: '39',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...liveSessionSortedApi,
        formatColumns: sortedFormatColumns,
    },
    51: {
        type: 51,
        pathname: '',
        name: '意向合作主播',
        pageType: 'modal',
        tableId: 40,
        isShowComment: true,
        interfaceName: '40',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...liveProductChildApi,
        formatColumns: productChildFormatColumns,
    },
    52: {
        type: 52,
        pathname: '/foreEnd/business/talentManage/publication/blogger/live',
        name: 'KOL刊例-直播带货',
        pageType: 'modal',
        tableId: 41,
        interfaceName: '39',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300, // 指定列宽度->可能列名太长
    },
    53: {
        type: 53,
        pathname: '/foreEnd/business/talentManage/publication/blogger/live',
        name: 'KOL刊例-直播带货',
        pageType: 'modal',
        tableId: 42,
        originTableId: 41,
        interfaceName: '40',
        isShowComment: true,
        commentSort: 1,
        ...airTableApi,
        ...publicationApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300, // 指定列宽度->可能列名太长
    },
    54: {
        type: 54,
        pathname: '/foreEnd/business/recruit/list',
        name: '报名初筛',
        pageType: 'modal',
        tableId: 43,
        isShowComment: true,
        interfaceName: '41',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...recruitApi,
        formatColumns: recruitFormatColumns,
        emitChangeCell: recruitEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/recruit/edit'),
        noDel: !checkPathname('/foreEnd/business/recruit/del'),
    },
    55: {
        type: 55,
        pathname: '/foreEnd/business/threadManage/list',
        name: '商务线索管理',
        pageType: 'modal',
        tableId: 44,
        isShowComment: true,
        interfaceName: '44',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 300,
        ...threadManageApi,
        formatColumns: threadManageFormatColumns,
        emitChangeCell: threadManageEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/threadManage/edit'),
        noDel: !checkPathname('/foreEnd/business/threadManage/del'),
    },
    56: {
        type: 56,
        pathname: '/foreEnd/business/recruit/list2',
        name: '报名二筛',
        pageType: 'modal',
        tableId: 45,
        isShowComment: true,
        interfaceName: '41',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...recruitApi,
        formatColumns: recruitFormatColumns,
        emitChangeCell: recruitEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/recruit/edit2'),
        noDel: !checkPathname('/foreEnd/business/recruit/del2'),
    },
    57: {
        type: 57,
        pathname: '/foreEnd/business/bloggerCRM/first',
        name: '初筛',
        pageType: 'modal',
        tableId: 46,
        isShowComment: true,
        interfaceName: '57',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...bloggerCRMApi,
        formatColumns: bloggerCRMFirstFormatColumns,
        emitChangeCell: bloggerCRMFirstEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/bloggerCRM/edit'),
        noDel: !checkPathname('/foreEnd/business/bloggerCRM/del'),
        noTransfer: !checkPathname('/foreEnd/business/bloggerCRM/transfer'),
        noImport: !checkPathname('/foreEnd/business/bloggerCRM/import'),
        noApproval: true,
    },
    58: {
        type: 58,
        pathname: '/foreEnd/business/bloggerCRM/second',
        name: '二筛',
        pageType: 'modal',
        tableId: 47,
        isShowComment: true,
        interfaceName: '41',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...bloggerCRMApi,
        formatColumns: bloggerCRMSecondFormatColumns,
        emitChangeCell: bloggerCRMSecondEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/bloggerCRM/edit'),
        noDel: !checkPathname('/foreEnd/business/bloggerCRM/del'),
        noTransfer: !checkPathname('/foreEnd/business/bloggerCRM/transfer'),
        noImport: true,
        noApproval: true,
    },
    59: {
        type: 59,
        pathname: '/foreEnd/business/bloggerCRM/approval',
        name: '沟通中',
        pageType: 'page',
        tableId: 48,
        isShowComment: true,
        interfaceName: '48',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...bloggerCRMApi,
        formatColumns: bloggerCRMCommunicatingFormatColumns,
        emitChangeCell: bloggerCRMCommunicatingEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/bloggerCRM/edit'),
        noDel: !checkPathname('/foreEnd/business/bloggerCRM/del'),
        noTransfer: !checkPathname('/foreEnd/business/bloggerCRM/transfer'),
        noImport: true,
        noApproval: !checkPathname('/foreEnd/business/bloggerCRM/approval'),
    },
    60: {
        type: 60,
        pathname: '/foreEnd/business/bloggerCRM/final',
        name: '最终待确认',
        pageType: 'modal',
        tableId: 49,
        isShowComment: true,
        interfaceName: '41',
        commentSort: 1,
        ...airTableApi,
        operateMenu: ['hide', 'filter', 'group', 'sort'],
        columnWidth: 200,
        ...bloggerCRMApi,
        formatColumns: bloggerCRMFinalFormatColumns,
        emitChangeCell: bloggerCRMFinalEmitChangeCell,
        noEdit: !checkPathname('/foreEnd/business/bloggerCRM/edit'),
        noDel: !checkPathname('/foreEnd/business/bloggerCRM/del'),
        noTransfer: !checkPathname('/foreEnd/business/bloggerCRM/transfer'),
        noImport: true,
    },
    100: {
        type: 100,
        name: '云协作',
        pageType: 'page',
    },
};
export const getModuleFromTableId = (tableId) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in config) {
        if (config[key].tableId === Number(tableId)) {
            return config[key];
        }
    }
    return null;
};

// 根据interfaceName 反查 config key
export const getConfigKeyFromInterfaceName = (interfaceName) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in config) {
        if (config[key].interfaceName === String(interfaceName)) {
            return key;
        }
    }
    return null;
};
export default config;
