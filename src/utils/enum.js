// -------------------------审批流---------------------------------
// 审批流类型
export const FLOW_TYPE = [
    { id: 'freedom', name: '自由流程' },
    { id: 'fixed', name: '固定流程' },
    { id: 'condition', name: '分条件审批' },
];
// 审批人去重
export const FLOW_APPROVER = [
    { id: '1', name: '不启用自动去重' },
    { id: '2', name: '同一个审批人仅在连续出现时，自动去重' },
    { id: '3', name: '同一个审批人在流程中出现多次，仅保留最后一个' },
];
// 审批人空缺时
export const FLOW_VACANCY = [{ id: '1', name: '无法启动审批' }];
// 知会人抄送方式
export const FLOW_COPY_WAY = [
    { id: '1', name: '仅全部同意时抄送' },
    { id: '2', name: '仅发起时抄送' },
    { id: '3', name: '发起时和全部同意时均发送' },
];
// 审批人与发起人重复时
export const FLOW_REPEAT = [{ id: '1', name: '自动跳过' }];
// 高级设置类型 dataType
export const FLOW_SET_DATA_TYPE = [
    { id: '1', name: '审批人去重' },
    { id: '2', name: '审批人空缺时' },
    { id: '3', name: '知会人抄送方式' },
    { id: '4', name: '审批人与发起人重复时' },
];

// 台账 - 结算税率
export const ACCOUNT_TAXRATE = [
    { id: '0.00', name: '0%' },
    { id: '0.03', name: '3%' },
    { id: '0.06', name: '6%' },
    { id: '0.09', name: '9%' },
];
// -------------------------客户---------------------------------
// 公司类型
export const CUSTOM_COMPANY_TYPE = [
    { id: '0', name: '直客' },
    { id: '1', name: '代理公司' },
    { id: '2', name: '直客+代理' },
];
// 公司规模
export const COMPANY_MODE = [{ id: '1', name: '上市公司' }, { id: '2', name: '500强' }, { id: '3', name: '一般企业' }];
// 部门属性
export const DEPARTMENT_TYPE = [
    { id: '1', name: '销售部门' },
    { id: '2', name: '管理部门' },
    { id: '3', name: '成本部门' },
    { id: '4', name: '研发部门' },
];
// -------------------------费用报销/申请-----------------------------
// 费用来源
export const REIMBURSE_SOURCE = [{ id: '1', name: '手工创建' }, { id: '2', name: '下推' }];
// 税率
export const REIMBURSE_TAX_RATE = [
    { id: '0.01', name: '1%' },
    { id: '0.03', name: '3%' },
    { id: '0.05', name: '5%' },
    { id: '0.06', name: '6%' },
    { id: '0.09', name: '9%' },
    { id: '0.11', name: '11%' },
    { id: '0.13', name: '13%' },
];
// 发票类型
export const REIMBURSE_INVOICE_TYPE = [{ id: '1', name: '专票' }, { id: '2', name: '普票及其他' }];
// 币种
export const CURRENCY_TYPE = [
    { id: '1', currency: 'CNY', name: '人民币' },
    { id: '2', currency: 'EUR', name: '欧元' },
    { id: '3', currency: 'GBP', name: '英镑' },
    { id: '4', currency: 'HKD', name: '港币' },
    { id: '5', currency: 'JPY', name: '日元' },
    { id: '6', currency: 'USD', name: '美元' },
    { id: '7', currency: 'MOP', name: '澳门币' },
    { id: '8', currency: 'TWD', name: '新台币' },
];
// 结算方式
export const SETTLEMENT_TYPE = [{ id: '1', name: '网银转账' }, { id: '2', name: '现金' }, { id: '3', name: '支票' }];
// 收款对象类型
export const CHEQUES_TYPE = [
    // {id: '1', name: '客户'},
    { id: '2', name: '供应商' },
    { id: '3', name: '员工' },
];
// 艺人预估费用类型
export const TALENT_FEE_TYPE = [
    { id: '1', name: '预估妆发及拍摄费' },
    { id: '2', name: '预估居间费' },
    { id: '3', name: '预估差旅费' },
    { id: '4', name: '预估业务招待费' },
    { id: '5', name: '预估制作费' },
    { id: '6', name: '预估其他费用' },
];
// 费用审批状态
export const FEE_APPLY_TYPE = [
    { id: '1', name: '待审批' },
    // {id: '2', name: '审批中'},
    { id: '3', name: '审批通过' },
    { id: '4', name: '审批未通过' },
    { id: '5', name: '审批撤销' },
    // {id: '6', name: '审批流程启动失败'},
    { id: '7', name: '审批回退' },
];
export const FEE_APPLY_TYPE_LIST = [
    { id: '1', name: '待审批' },
    { id: '2', name: '待审批' },
    { id: '3', name: '审批通过' },
    { id: '4', name: '审批未通过' },
    { id: '5', name: '审批撤销' },
    { id: '6', name: '审批流程启动失败' },
    { id: '7', name: '已退回' },
    { id: '8', name: '审批回退' },
];

// ----------------------------------合同-----------------------------------
// 合同类型
export const CONTRACT_TYPE = [
    { id: '1', name: '业务合同' },
    { id: '2', name: '保密协议' },
    { id: '3', name: '妆发费' },
    { id: '4', name: '电商直播' },
];
// 合同主子类型
export const CONTRACT_PRI_TYPE = [{ id: '0', name: '主合同' }, { id: '1', name: '子合同' }];
// 合同归档状态
export const CONTRACT_ARCHIVE_STATUS = [{ id: '0', name: '未归档' }, { id: '1', name: '已归档' }];
// 合同执行状态
export const CONTRACT_PROGRESS_STATUS = [
    { id: '1', name: '待执行' },
    { id: '2', name: '执行中' },
    { id: '3', name: '执行结束' },
];
// 合同回款状态
export const CONTRACT_MONEY_STATUS = [
    { id: '1', name: '未回款' },
    { id: '2', name: '部分回款' },
    { id: '3', name: '已回全款' },
];
// 合同报销状态
export const CONTRACT_REIMBURSE_STATUS = [{ id: '1', name: '可报销' }, { id: '0', name: '不可报销' }];
// 合同费用确认状态
export const CONTRACT_FEE_STATUS = [
    { id: '0', name: '未确认' },
    { id: '1', name: '部分确认' },
    { id: '2', name: '已确认' },
];
// 合同结算状态
export const CONTRACT_SETTLEMENT_STATUS = [
    { id: '0', name: '未结算' },
    { id: '1', name: '部分结算' },
    { id: '2', name: '已结清' },
];
// 合同结案状态
export const CONTRACT_END_STATUS = [
    { id: '0', name: '不可结案 ' },
    { id: '2', name: '可结案' },
    { id: '1', name: '已结案' },
];
// 合同签约方式
export const CONTRACT_SIGN_TYPE = [
    { id: '1', name: '客户+公司' },
    { id: '2', name: '客户+公司+工作室' },
    { id: '3', name: '客户+工作室' },
];
// 合同开票顺序
export const CONTRACT_INVOICE_ORDER = [{ id: '0', name: '先开票' }, { id: '1', name: '后开票' }];
// 合同履约义务类型
export const CONTRACT_OBLIGATION_TYPE = [
    {
        value: '01',
        label: '代言',
        children: [
            {
                value: '0101',
                label: '授权',
                children: [
                    {
                        value: '010101',
                        label: '授权代言人',
                        path: '代言-授权-授权代言人',
                        isLeaf: true,
                    },
                    {
                        value: '010102',
                        label: '授权形象大使',
                        path: '代言-授权-授权形象大使',
                        isLeaf: true,
                    },
                ],
            },
            {
                value: '0102',
                label: '拍摄',
                children: [
                    {
                        value: '010201',
                        label: '拍摄平面广告',
                        path: '代言-拍摄-拍摄平面广告',
                        isLeaf: true,
                    },
                    {
                        value: '010202',
                        label: '拍摄视频广告',
                        path: '代言-拍摄-拍摄视频广告',
                        isLeaf: true,
                    },
                ],
            },
            { value: '0103', label: '活动', path: '代言-活动', isLeaf: true },
        ],
    },
    {
        value: '02',
        label: '广告推广',
        children: [
            {
                value: '0201',
                label: '活动',
                children: [
                    {
                        value: '020101',
                        label: '出席现场活动',
                        path: '广告推广-活动-出席现场活动',
                        isLeaf: true,
                    },
                    {
                        value: '020102',
                        label: '出席线上活动',
                        path: '广告推广-活动-出席线上活动',
                        isLeaf: true,
                    },
                ],
            },
            {
                value: '0202',
                label: '图文',
                children: [
                    {
                        value: '020201',
                        label: '小红书',
                        path: '广告推广-图文-小红书',
                        isLeaf: true,
                    },
                    { value: '020202', label: '微博', path: '广告推广-图文-微博', isLeaf: true },
                    { value: '020203', label: '全平台', path: '广告推广-图文-全平台', isLeaf: true },
                    { value: '020204', label: '微信', path: '广告推广-图文-微信', isLeaf: true },
                    { value: '020205', label: 'B站', path: '广告推广-图文-B站', isLeaf: true },
                ],
            },
            {
                value: '0203',
                label: '视频',
                children: [
                    { value: '020301', label: '抖音', path: '广告推广-视频-抖音', isLeaf: true },
                    {
                        value: '020302',
                        label: '小红书',
                        path: '广告推广-视频-小红书',
                        isLeaf: true,
                    },
                    { value: '020303', label: '微博', path: '广告推广-视频-微博', isLeaf: true },
                    { value: '020304', label: 'B站', path: '广告推广-视频-B站', isLeaf: true },
                    { value: '020305', label: '全平台', path: '广告推广-视频-全平台', isLeaf: true },
                    { value: '020306', label: '站外授权', path: '广告推广-视频-站外授权', isLeaf: true },
                    { value: '020307', label: '快手', path: '广告推广-视频-快手', isLeaf: true },
                ],
            },
            { value: '0204', label: '直播', path: '广告推广-直播', isLeaf: true },
        ],
    },
    { value: '03', label: '广告植入', path: '广告植入', isLeaf: true },
    {
        value: '04',
        label: '制作',
        children: [
            { value: '0401', label: '影视作品', path: '制作-影视作品', isLeaf: true },
            { value: '0402', label: '综艺作品', path: '制作-综艺作品', isLeaf: true },
            { value: '0403', label: '广告作品', path: '制作-广告作品', isLeaf: true },
            { value: '0404', label: '音乐作品', path: '制作-音乐作品', isLeaf: true },
            { value: '0405', label: '视频/图文', path: '制作-视频/图文', isLeaf: true },
        ],
    },
    {
        value: '05',
        label: '影视拍摄',
        children: [
            { value: '0501', label: '电视剧', path: '影视拍摄-电视剧', isLeaf: true },
            { value: '0502', label: '网络剧', path: '影视拍摄-网络剧', isLeaf: true },
            { value: '0503', label: '电影', path: '影视拍摄-电影', isLeaf: true },
        ],
    },
    { value: '06', label: '话剧演出', path: '话剧演出', isLeaf: true },
    {
        value: '07',
        label: '综艺拍摄',
        children: [{ value: '0701', label: '录制节目', path: '综艺拍摄-录制节目', isLeaf: true }],
    },
    {
        value: '08',
        label: '商演',
        children: [
            { value: '0801', label: '歌曲', path: '商演-歌曲', isLeaf: true },
            { value: '0802', label: '舞蹈', path: '商演-舞蹈', isLeaf: true },
        ],
    },
    {
        value: '09',
        label: '配音',
        children: [{ value: '0901', label: '录制配音', path: '配音-录制配音', isLeaf: true }],
    },
    { value: '10', label: '妆发', path: '妆发', isLeaf: true },
    { value: '11', label: '授课', path: '授课', isLeaf: true },
    { value: '12', label: '电商', children: [{ value: '1201', label: '直播', path: '电商-直播', isLeaf: true }] },
];
// 合同品牌类型
export const CONTRACT_BRAND_TYPE = [{ id: '1', name: '国际品牌' }, { id: '0', name: '国内品牌' }];
// 合同执行进度变更方式
export const CONTRACT_PROGRESS_TYPE = [{ id: '0', name: '自动按月均摊' }, { id: '1', name: '手工输入' }];

// 开票主体类型
export const CONTRACT_INVOICE_COMPANY_TYPE = [{ id: '0', name: '公司' }, { id: '1', name: '工作室' }];

// 发票类型
export const CONTRACT_INVOICE_TYPE = [{ id: '1', name: '专票' }, { id: '0', name: '普票' }];

// 发票税率
export const CONTRACT_INVOICE_TAX_RATE = [{ id: '1', name: '3%' }, { id: '2', name: '6%' }, { id: '3', name: '9%' }];
// ----------------------------------台帐管理---------------------------------
// 传送nc状态
export const TRANSMIT_NC_STATUS = [
    { id: '0', name: '失败' },
    { id: '1', name: '成功' },
    { id: '2', name: '未传送' },
    { id: '3', name: '传送中' },
];
export const EARNING_NC = [
    { id: '0', name: '失败' },
    { id: '1', name: '传送成功' },
    { id: '2', name: '未传送' },
    { id: '3', name: '传送中' },
];
// 合同收入 事项类型earning
export const EARNING_PROCEEDING = [
    { id: '1', name: '开票进度更新' },
    { id: '2', name: '执行进度更新' },
    { id: '3', name: '收款信息更新' },
];
// 合同成本 事项类型/costing
export const COSTING_PROCEEDING = [
    { id: '1', name: '合同审批通过' },
    { id: '2', name: '执行进度更新' },
    { id: '3', name: '关键任务执行完毕&付款完成确认' },
    { id: '4', name: '成本差异调整' },
];
// 事项类型expenses
export const EXPENSES_PROCEEDING = [{ id: '1', name: '报销审批通过' }, { id: '2', name: '付款完成确认' }];
// 事项类型travel
export const TRAVEL_PROCEEDING = [{ id: '1', name: '申请审批通过' }, { id: '2', name: '付款完成确认' }];
// 业务类型
export const EXPENSES_BUSINESS_STATE = [{ id: '1', name: '费用报销' }, { id: '2', name: '费用申请' }];
// ----------------------------------公共------------------------------------
// common  是否
export const IS_OR_NOT = [{ id: '0', name: '否' }, { id: '1', name: '是' }];
// 参与人类型
export const PARTICIPANT_TYPE = [
    { id: '1', name: '经理人' },
    { id: '2', name: '宣传人' },
    { id: '3', name: '制作人' },
    { id: '4', name: '知会人' },
    { id: '5', name: '审批人' },
    { id: '6', name: '参与人' },
    { id: '7', name: '创建人' },
    { id: '8', name: '负责人' },
    { id: '9', name: 'BOSS' },
    { id: '10', name: '执行人' },
    { id: '11', name: '跟进人' },
    { id: '12', name: '合作人' },
    { id: '13', name: '新媒体运营' },
    { id: '14', name: '认领人' },
];
// 员工在职状态
export const STAFF_STATUS = [
    { id: '1', name: '实习' },
    { id: '2', name: '试用期' },
    { id: '3', name: '正式员工' },
    { id: '4', name: '离职' },
    { id: '5', name: '劳务' },
    { id: '6', name: '外包' },
];
// 聘用形式
export const EMPLOY_TYPE = [
    { id: '1', name: '实习' },
    { id: '2', name: '劳动' },
    { id: '3', name: '劳务' },
    { id: '4', name: '外包' },
];
// 职别
export const JOB_POSITION = [
    { id: '1.1', name: '1.1' },
    { id: '1.2', name: '1.2' },
    { id: '1.3', name: '1.3' },
    { id: '2.1', name: '2.1' },
    { id: '2.2', name: '2.2' },
    { id: '2.3', name: '2.3' },
    { id: '3.1', name: '3.1' },
    { id: '3.2', name: '3.2' },
    { id: '3.3', name: '3.3' },
    { id: '4.1', name: '4.1' },
    { id: '4.2', name: '4.2' },
    { id: '4.3及以上', name: '4.3及以上' },
];
// 户口性质
export const RESIDENCS_TYPE = [
    { id: '1', name: '本地非农业' },
    { id: '2', name: '本地农业' },
    { id: '3', name: '外地非农业' },
    { id: '4', name: '外地农业' },
];
// 性别
export const SEX_TYPE = [{ id: '1', name: '男' }, { id: '0', name: '女' }];
// 证件类型
export const CREDENTIAL_TYPE = [
    { id: '1', name: '身份证' },
    { id: '2', name: '护照' },
    { id: '3', name: '港澳通行证' },
    { id: '4', name: '台湾通行证' },
    { id: '5', name: '其他' },
];
// 婚姻状态
export const MARRY_STATUES = [{ id: '1', name: '已婚' }, { id: '2', name: '未婚' }];
// 血型
export const BLOOD_TYPE = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
    { id: '3', name: 'AB' },
    { id: '4', name: 'O' },
];
// 艺人来源
export const STAR_SOURCE = [
    { id: '1', name: '艺人推荐' },
    { id: '2', name: '公司员工' },
    { id: '3', name: '星探推荐' },
    { id: '4', name: '其他' },
];
// 艺人/博主平台
export const STAR_PLATFORM = [
    { id: '1', name: '微博' },
    { id: '2', name: '抖音' },
    { id: '3', name: '小红书' },
    { id: '4', name: 'B站' },
    { id: '5', name: '快手' },
];
// 艺人/博主等级
export const STAR_LEVEL = [
    { id: '1', name: 'S' },
    { id: '2', name: 'A' },
    { id: '3', name: 'B' },
    { id: '4', name: 'C' },
];
// 博主类型
export const BLOGGER_TYPE = [
    { id: '1', name: '幽默' },
    { id: '2', name: '美食' },
    { id: '3', name: '美妆' },
    { id: '4', name: '颜值' },
    { id: '5', name: '生活方式' },
    { id: '6', name: '生活测评' },
    { id: '7', name: '萌宠' },
    { id: '8', name: '时尚' },
    { id: '9', name: '旅行' },
    { id: '10', name: '动画' },
    { id: '11', name: '母婴' },
    { id: '12', name: '情感' },
    { id: '13', name: '摄影' },
    { id: '14', name: '舞蹈' },
    { id: '15', name: '影视' },
    { id: '16', name: '游戏' },
    { id: '17', name: '数码' },
    { id: '18', name: '街坊' },
    { id: '19', name: '汽车' },
    { id: '20', name: '剧情' },
    { id: '21', name: '才艺' },
    { id: '22', name: '其他' },
];
// 博主推荐类型
export const BLOGGER_RECOMMEND_STATE = [
    { id: '1', name: '重点博主' },
    { id: '2', name: '近期推荐' },
    { id: '12', name: '重点且近期' },
    { id: '3', name: '其它' },
];
// 纳税类型
export const TAX_TYPE = [{ name: '一般纳税人', id: '0' }, { name: '小规模纳税人', id: '1' }];
// 访问形式
export const CLIENT_STATUS = [{ id: '0', name: 'App' }, { id: '1', name: 'web' }];
// --------------------------------线索------------------------------------
// 线索类型
export const TRAIL_TYPE = [{ id: '1', name: '商务' }];
// 线索类型 - 线索来源
export const THREAD_TYPE = [
    {
        id: '1',
        name: '商务',
        child: [
            { id: '1', name: '直客' },
            { id: '2', name: '代理公司' },
            { id: '3', name: '纯中介' },
            { id: '4', name: '媒体' },
            { id: '5', name: '公司员工', isShow: true },
            { id: '6', name: '工作室邮箱' },
            { id: '7', name: '商务邮箱' },
            { id: '8', name: '商务微信' },
            { id: '14', name: '客服中心' },
        ],
    },
    {
        id: '2',
        name: '综艺',
        child: [
            { id: '9', name: 'casting' },
            { id: '5', name: '公司员工', isShow: true },
            { id: '10', name: '制片人' },
            { id: '11', name: '导演' },
            { id: '12', name: '平台' },
            { id: '13', name: '客服' },
            { id: '99', name: '其他' },
        ],
    },
    {
        id: '3',
        name: '影视',
        child: [
            { id: '9', name: 'casting' },
            { id: '5', name: '公司员工', isShow: true },
            { id: '10', name: '制片人' },
            { id: '11', name: '导演' },
            { id: '12', name: '平台' },
            { id: '13', name: '客服' },
            { id: '99', name: '其他' },
        ],
    },
];
// 公司类型-公司模块
export const COMPANYS_TYPE = [
    { id: '1', name: '股份有限公司' },
    { id: '2', name: '有限责任公司' },
    { id: '3', name: '个体工商户' },
];
export const THREAD_STATUS = [
    { id: '1', name: '开始接洽' },
    { id: '2', name: '已撤销' },
    { id: '3', name: '立项已提交' },
];
// 线索级别
export const THREAD_LEVEL = [
    { id: '1', name: 'S' },
    { id: '2', name: 'A' },
    { id: '3', name: 'B' },
    { id: '4', name: 'C' },
];
// 线索进展
export const TRAIL_PROGRESS = [{ id: '1', name: '线索跟进' }, { id: '2', name: '线索立项' }];
// 公司性质
export const COMPANY_PROERTY = [
    { id: '1', name: '平台' },
    { id: '2', name: '制作公司' },
    { id: '3', name: '集团公司' },
];
// 公司级别
export const COMPANY_RANK = [
    { id: '1', name: 'S' },
    { id: '2', name: 'A' },
    { id: '3', name: 'B' },
    { id: '4', name: 'C' },
];
// 主营行业
export const MAIN_BUSINESS = [
    { id: '1', name: 'IT' },
    { id: '2', name: '数码' },
    { id: '3', name: '家电' },
    { id: '4', name: '汽车' },
    { id: '5', name: '旅游' },
    { id: '6', name: '教育' },
    { id: '7', name: '金融' },
    { id: '8', name: '家居' },
    { id: '9', name: '日化' },
    { id: '10', name: '护肤' },
    { id: '11', name: '服饰' },
    { id: '12', name: '奢侈品' },
    { id: '13', name: '食品' },
    { id: '14', name: '饮料' },
    { id: '15', name: '电商' },
    { id: '16', name: '游戏' },
    { id: '17', name: '网服' },
    { id: '18', name: '宠物' },
    { id: '19', name: '娱乐' },
];
// 成交状态
export const DEALSTATUS = [{ id: '0', name: '未成交' }, { id: '1', name: '已成交' }];
// --------------------------------------立项------------------------------------
// 年框类型
export const PROJECT_YEAR_FRAME_TYPE = [
    { id: '1', name: '抖音及其他' },
    { id: '2', name: '微博及其他' },
    { id: '3', name: '不计入年框' },
];
// 项目类型
export const PROJECT_TYPE = [
    {
        id: '1',
        name: '商务',
        index: '1',
        value: '商务',
        children: [
            {
                id: '0',
                name: '普通立项',
                index: '0',
                value: '普通立项',
            },
            {
                id: '1',
                name: '平台下单',
                index: '1',
                value: '平台下单',
            },
            {
                id: '2',
                name: '长期项目',
                index: '2',
                value: '长期项目',
            },
            {
                id: '3',
                name: 'CPS项目',
                index: '3',
                value: 'CPS项目',
            },
        ],
    },
    { id: '2', name: '综艺', index: '2', value: '综艺' },
    { id: '3', name: '影视', index: '3', value: '影视' },
    { id: '4', name: '电商直播', index: '4', value: '电商直播' },
];
// 立项分类
export const PROJECT_PLATFORM_TYPE = [
    { id: '0', name: '普通立项' },
    { id: '1', name: '平台下单' },
    { id: '2', name: '长期项目' },
    { id: '3', name: 'CPS项目' },
];
// 下单类型
export const PROJECT_AGENT_ORDER = [
    { id: '0', name: '一般下单' },
    { id: '2', name: '代下单' },
    { id: '1', name: '接单' },
];
// 立项审批状态（筛选）
export const PROJECT_ESTABLISH_TYPE = [
    { id: '-1', name: '项目已终止' },
    { id: '1', name: '待审批' },
    { id: '3', name: '审批通过' },
    { id: '4', name: '审批未通过' },
    { id: '5', name: '审批撤销' },
    { id: '8', name: '审批回退' },
];
// 项目明细类型
export const PROJECT_INFO_TYPE = [
    { id: '1', name: '电影' },
    { id: '2', name: '剧集' },
    { id: '3', name: '综艺' },
    { id: '4', name: '代言' },
    { id: '5', name: '商演' },
    { id: '6', name: '演唱会' },
    { id: '7', name: '版权' },
    { id: '8', name: '专辑' },
    { id: '9', name: '妆发' },
    { id: '10', name: '生日会' },
    { id: '11', name: '广告推广策划' },
    { id: '12', name: '编剧' },
    { id: '13', name: '导演' },
    { id: '14', name: '其他' },
    { id: '15', name: '日常' },
    { id: '16', name: '广告植入' },
    { id: '17', name: '平台流量' },
    { id: '18', name: '话剧' },
    { id: '19', name: '音乐剧' },
];
// 项目级别
export const PROJECT_LEVEL = STAR_LEVEL;
// 项目来源
export const PROJECT_SOURCE = THREAD_TYPE;
// 平台下单方式
export const PROJECT_ORDER_TYPE = [{ id: '1', name: '星图任务ID' }, { id: '2', name: '邮件下单' }];
// 立项业绩分成
export const PROJECT_ESTABLISH_RATIO = [
    { id: '7', name: '20%：80%' },
    { id: '3', name: '30%：70%' },
    { id: '4', name: '40%：60%' },
    { id: '1', name: '50%：50%' },
    { id: '5', name: '60%：40%' },
    { id: '6', name: '70%：30%' },
    { id: '8', name: '80%：20%' },
    { id: '2', name: '100%：100%' },
];
// 公司类型
export const COMPANY_TYPE = [{ id: '0', name: '直客' }, { id: '1', name: '代理公司' }, { id: '2', name: '直客+代理' }];
// 合作类型
export const COOPERATION_TYPE = [
    {
        value: '1',
        label: '代言',
        children: [
            {
                value: '11',
                label: '授权代言人',
            },
            {
                value: '12',
                label: '授权形象大使',
            },
        ],
    },
    {
        value: '2',
        label: '广告推广',
        children: [
            {
                value: '21',
                label: '活动',
            },
            {
                value: '22',
                label: '社交传播',
            },
        ],
    },
    {
        value: '3',
        label: '广告植入',
    },
    {
        value: '4',
        label: '制作',
        children: [
            {
                value: '41',
                label: '影视作品',
            },
            {
                value: '42',
                label: '综艺作品',
            },
            {
                value: '43',
                label: '广告作品',
            },
            {
                value: '44',
                label: '音乐作品',
            },
            {
                value: '45',
                label: '视频/图文',
            },
        ],
    },
    {
        value: '5',
        label: '影视',
        children: [
            {
                value: '51',
                label: '电视剧',
            },
            {
                value: '52',
                label: '网络剧',
            },
            {
                value: '53',
                label: '电影',
            },
            {
                value: '54',
                label: '互动剧',
            },
        ],
    },
    {
        value: '6',
        label: '舞台剧',
        children: [
            {
                value: '61',
                label: '话剧',
            },
            {
                value: '62',
                label: '音乐剧',
            },
        ],
    },
    {
        value: '7',
        label: '综艺',
        children: [
            {
                value: '2',
                label: '录制节目',
            },
        ],
    },
    {
        value: '8',
        label: '商演',
        children: [
            {
                value: '81',
                label: '歌剧',
            },
            {
                value: '82',
                label: '舞蹈',
            },
        ],
    },
    {
        value: '9',
        label: '配音',
        children: [
            {
                value: '91',
                label: '录制配音',
            },
        ],
    },
];
// 合作类型商务
export const COOPERATION_TYPE_SW = [
    {
        value: '1',
        label: '代言',
        children: [
            {
                value: '11',
                label: '授权代言人',
            },
            {
                value: '12',
                label: '授权形象大使',
            },
        ],
    },
    {
        value: '2',
        label: '广告推广',
        children: [
            {
                value: '21',
                label: '活动',
            },
            {
                value: '22',
                label: '社交传播',
            },
        ],
    },
    {
        value: '3',
        label: '广告植入',
    },
    {
        value: '8',
        label: '商演',
        children: [
            {
                value: '81',
                label: '歌剧',
            },
            {
                value: '82',
                label: '舞蹈',
            },
        ],
    },
];
// 合作类型综艺影视
export const COOPERATION_TYPE_ZY = [
    {
        value: '4',
        label: '制作',
        children: [
            {
                value: '41',
                label: '影视作品',
            },
            {
                value: '42',
                label: '综艺作品',
            },
            {
                value: '43',
                label: '广告作品',
            },
            {
                value: '44',
                label: '音乐作品',
            },
            {
                value: '45',
                label: '视频/图文',
            },
        ],
    },
    {
        value: '5',
        label: '影视',
        children: [
            {
                value: '51',
                label: '电视剧',
            },
            {
                value: '52',
                label: '网络剧',
            },
            {
                value: '53',
                label: '电影',
            },
            {
                value: '54',
                label: '互动剧',
            },
        ],
    },
    {
        value: '6',
        label: '舞台剧',
        children: [
            {
                value: '61',
                label: '话剧',
            },
            {
                value: '62',
                label: '音乐剧',
            },
        ],
    },
    {
        value: '7',
        label: '综艺',
        children: [
            {
                value: '2',
                label: '录制节目',
            },
        ],
    },
    {
        value: '8',
        label: '商演',
        children: [
            {
                value: '81',
                label: '歌剧',
            },
            {
                value: '82',
                label: '舞蹈',
            },
        ],
    },
    {
        value: '9',
        label: '配音',
        children: [
            {
                value: '91',
                label: '录制配音',
            },
        ],
    },
];
// 影剧类型
export const FILM_TYPE = [
    { id: '1', name: '电视剧' },
    { id: '2', name: '网剧' },
    { id: '3', name: '电影' },
    { id: '4', name: '网络大电影' },
    { id: '5', name: '舞台剧' },
];
// 立项状态
export const PROJECT_ESTABLISH_TYPE2 = [
    { id: '-1', name: '项目已终止' },
    { id: '1', name: '待审批' },
    { id: '2', name: '审批中' },
    { id: '3', name: '审批通过' },
    { id: '4', name: '审批未通过' },
    { id: '5', name: '审批撤销' },
    { id: '8', name: '审批回退' },
];
// 立项状态(展示)
export const PROJECT_ESTABLISH_TYPE_SHOW = [
    { id: '-1', name: '项目已终止' },
    { id: '1', name: '待审批' },
    { id: '2', name: '待审批' },
    { id: '3', name: '审批通过' },
    { id: '4', name: '审批未通过' },
    { id: '5', name: '审批撤销' },
    { id: '8', name: '审批回退' },
];
// 综艺节目类型
export const PROGRAMME_TYPE = [
    { id: '1', name: '真人秀' },
    { id: '2', name: '棚综' },
    { id: '3', name: '采访' },
    { id: '4', name: '微综艺' },
    { id: '5', name: '其他' },
];
// 综艺嘉宾类型
export const GUEST_TYPE = [
    { id: '1', name: '常驻嘉宾' },
    { id: '2', name: '飞行嘉宾' },
    { id: '3', name: '选手' },
    { id: '4', name: '固定嘉宾' },
];
//  商务投放平台
export const PUT_PLATFORM = [
    { id: '1', name: '全平台' },
    { id: '2', name: '抖音' },
    { id: '3', name: 'b站' },
    { id: '4', name: '小红书' },
    { id: '6', name: '微博' },
    { id: '7', name: '微信' },
    { id: '8', name: '直播' },
    { id: '9', name: '秒拍' },
    { id: '10', name: '今日头条' },
    { id: '5', name: '其他' },
];
// 艺人/博主预算消费类型
export const FEE_TYPE = [
    { id: '1', name: '公司承担' },
    { id: '2', name: '艺人承担' },
    { id: '3', name: '公司与艺人共同承担' },
];
// ------------------------------项目--------------------------------------
// 项目签约状态
export const PROJECTING_SIGN_STATE = [
    { id: '0', name: '未签约' },
    { id: '1', name: '签约审批中' },
    { id: '2', name: '已撤销' },
    { id: '3', name: '已签约' },
];
// 项目执行状态
export const PROJECTING_EXECTE_STATE = [
    { id: '0', name: '未执行' },
    { id: '1', name: '执行中' },
    { id: '2', name: '执行结束' },
];
// 项目进展状态
export const PROJECTING_STATE = [
    { id: '0', name: '未签约' },
    { id: '1', name: '已签约' },
    { id: '-1', name: '项目终止' },
];
// 项目回款状态
export const PROJECT_MONEY_STATUS = [
    { id: '0', name: '未回款' },
    { id: '1', name: '部分回款' },
    { id: '2', name: '已回全款' },
];
// 综艺信息分类
export const ENTERTAINMENT_TYPE = [{ id: '1', name: '台综' }, { id: '2', name: '网综' }, { id: '3', name: '短综' }];
// 付款状态
export const PAY_STATUS = [{ id: '0', name: '未付款' }, { id: '1', name: '已付款' }];
// 冲销状态
export const WRITE_OFF_STATUS = [
    { id: '0', name: '未冲销' },
    { id: '1', name: '冲销中' },
    { id: '2', name: '部分冲销' },
    { id: '3', name: '全部冲销' },
];
// 审批流-审批状态-单独节点
export const APPROVAL_STATE = [
    { id: '-1', name: '已撤销' },
    { id: '0', name: '已驳回' },
    { id: '1', name: '待审批' },
    { id: '2', name: '已同意' },
    { id: '3', name: '待审批' },
    { id: '5', name: '待审批' },
    { id: '7', name: '已回退' },
    { id: '8', name: '已回退' },
];
// 审批流-审批状态-总状态
export const APPROVAL_GLOBAL_STATE = [
    { id: '-1', name: '已撤销' },
    { id: '0', name: '已驳回' },
    { id: '1', name: '待审批' },
    { id: '2', name: '已同意' },
    { id: '3', name: '待审批' },
    { id: '5', name: '待审批' },
    { id: '7', name: '待审批' },
    { id: '8', name: '已回退' },
];
// 审批管理 - 我发起的 -审批状态
export const APPROVAL_APPLY_STATUS = [
    { id: '-1', name: '已撤销' },
    { id: '0', name: '已驳回' },
    { id: '1', name: '待审批' },
    { id: '2', name: '已同意' },
    { id: '3', name: '待审批' },
    { id: '5', name: '待审批' },
    { id: '8', name: '已回退' },
];

// 审批管理 - 我审批的 -审批状态
export const APPROVAL_APPROVAL_STATUS = [
    { id: '-1', name: '已撤销' },
    { id: '0', name: '已驳回' },
    { id: '1', name: '待审批' },
    { id: '2', name: '已同意' },
    { id: '3', name: '待审批' },
    { id: '5', name: '待审批' },
    { id: '8', name: '已回退' },
];
// 处理状态
export const DEAL_STATUS = [{ id: '1', name: '待处理' }, { id: '2', name: '已处理' }];
// 定稿状态
export const APPROVAL_STATUS = [{ id: '0', name: '未定稿' }, { id: '1', name: '已定稿' }];
// 审核状态
export const FINALIZED_STATUS = [
    { id: '-1', name: '已撤销' },
    { id: '1', name: '审核中' },
    { id: '2', name: '已审核' },
];

// 博主签约状态  1:未签约 2:签约中 3:已签约 4:解约中 5 已解约
export const BLOGGER_SIGN_STATE = [
    { id: '1', name: '未签约' },
    { id: '2', name: '签约中' },
    { id: '3', name: '已签约' },
    { id: '4', name: '待解约' },
    { id: '5', name: '已解约' },
];
// 公司简码
export const COMPANY_SHORTCODE = [
    { id: 'TYXZ', name: 'TYXZ' },
    { id: 'TYHR', name: 'TYHR' },
    { id: 'DBHR', name: 'DBHR' },
    { id: 'JSHR', name: 'JSHR' },
    { id: 'TYTYXZ', name: 'TYTYXZ' },
    { id: 'ZYXZ', name: 'ZYXZ' },
    { id: 'CYTJ', name: 'CYTJ' },
    { id: 'CYHR', name: 'CYHR' },
    { id: 'CYBJ', name: 'CYBJ' },
    { id: 'XFXZ', name: 'XFXZ' },
    { id: 'TYBJ', name: 'TYBJ' },
    { id: 'TYTJ', name: 'TYTJ' },
    { id: 'DBTJ', name: 'DBTJ' },
    { id: 'ZDKTJ', name: 'ZDKTJ' },
    { id: 'TYYYHR', name: 'TYYYHR' },
    { id: 'TYYYTJ', name: 'TYYYTJ' },
    { id: 'TYTJ', name: 'TYTJ' },
    { id: 'XHTJ', name: 'XHTJ' },
    { id: 'HYTJ', name: 'HYTJ' },
    { id: 'FLSH', name: 'FLSH' },
    { id: 'CHXM', name: 'CHXM' },
    { id: 'XMXM', name: 'XMXM' },
    { id: 'XCTJ', name: 'XCTJ' },
    { id: 'WSXY', name: 'WSXY' },
    { id: 'YRXZ', name: 'YRXZ' },
];
// 民族
export const NATION_TYPE = [
    {
        id: '1',
        name: '壮族',
    },
    {
        id: '2',
        name: '藏族',
    },
    {
        id: '3',
        name: '裕固族',
    },
    {
        id: '4',
        name: '彝族',
    },
    {
        id: '5',
        name: '瑶族',
    },
    {
        id: '6',
        name: '锡伯族',
    },
    {
        id: '7',
        name: '乌孜别克族',
    },
    {
        id: '8',
        name: '维吾尔族',
    },
    {
        id: '9',
        name: '佤族',
    },
    {
        id: '10',
        name: '土家族',
    },
    {
        id: '11',
        name: '土族',
    },
    {
        id: '12',
        name: '塔塔尔族',
    },
    {
        id: '13',
        name: '塔吉克族',
    },
    {
        id: '14',
        name: '水族',
    },
    {
        id: '15',
        name: '畲族',
    },
    {
        id: '16',
        name: '撒拉族',
    },
    {
        id: '17',
        name: '羌族',
    },
    {
        id: '18',
        name: '普米族',
    },
    {
        id: '19',
        name: '怒族',
    },
    {
        id: '20',
        name: '纳西族',
    },
    {
        id: '21',
        name: '仫佬族',
    },
    {
        id: '22',
        name: '苗族',
    },
    {
        id: '23',
        name: '蒙古族',
    },
    {
        id: '24',
        name: '门巴族',
    },
    {
        id: '25',
        name: '毛南族',
    },
    {
        id: '26',
        name: '满族',
    },
    {
        id: '27',
        name: '珞巴族。僳僳族',
    },
    {
        id: '28',
        name: '黎族',
    },
    {
        id: '29',
        name: '拉祜族',
    },
    {
        id: '30',
        name: '柯尔克孜族',
    },
    {
        id: '31',
        name: '景颇族',
    },
    {
        id: '32',
        name: '京族',
    },
    {
        id: '33',
        name: '基诺族',
    },
    {
        id: '34',
        name: '回族',
    },
    {
        id: '35',
        name: '赫哲族',
    },
    {
        id: '36',
        name: '哈萨克族',
    },
    {
        id: '37',
        name: '哈尼族',
    },
    {
        id: '38',
        name: '仡佬族',
    },
    {
        id: '39',
        name: '高山族',
    },
    {
        id: '40',
        name: '鄂温克族',
    },
    {
        id: '41',
        name: '俄罗斯族',
    },
    {
        id: '42',
        name: '鄂伦春族',
    },
    {
        id: '43',
        name: '独龙族',
    },
    {
        id: '44',
        name: '东乡族',
    },
    {
        id: '45',
        name: '侗族',
    },
    {
        id: '46',
        name: '德昂族',
    },
    {
        id: '47',
        name: '傣族',
    },
    {
        id: '48',
        name: '达斡尔族',
    },
    {
        id: '49',
        name: '朝鲜族',
    },
    {
        id: '50',
        name: '布依族',
    },
    {
        id: '51',
        name: '保安族',
    },
    {
        id: '52',
        name: '布朗族',
    },
    {
        id: '53',
        name: '白族',
    },
    {
        id: '54',
        name: '阿昌族',
    },
    {
        id: '55',
        name: '汉族',
    },
];

// -------------------------投放管理---------------------------------

// 投放趋势下的账号平台
export const THROW_PLATFORM1 = [{ id: '1', name: '微博' }, { id: '2', name: '抖音' }];
// 账号平台
export const THROW_PLATFORM = [
    { id: '1', name: '微博' },
    { id: '2', name: '抖音' },
    { id: '3', name: '小红书' },
    { id: '4', name: 'B站' },
    { id: '5', name: '快手' },
];

// 投放渠道
export const THROW_CHANNEL = [
    { id: '1', name: '粉丝通' },
    { id: '2', name: '粉丝头条' },
    { id: '3', name: 'B站' },
    { id: '4', name: '抖加' },
    { id: '5', name: '快手' },
    { id: '6', name: 'WEIQ' },
    { id: '7', name: '薯条' },
    { id: '8', name: 'FeedsLive' },
    { id: '9', name: '竞价' },
    { id: '10', name: '品牌广告' },
];

// 投放类型
export const THROW_TYPE_TOTAL = [
    { id: '1', name: '日常' },
    { id: '2', name: '广告' },
    { id: '3', name: '广告视频' },
    { id: '4', name: '电商视频' },
    { id: '5', name: '图文微任务' },
    { id: '6', name: '电商' },
    { id: '7', name: '娱乐直播' },
    { id: '8', name: '电商直播' },
];

// 投放状态
export const THROW_STATUS = [
    { id: '1', name: '待投放' },
    { id: '2', name: '投放中' },
    { id: '3', name: '成功' },
    { id: '4', name: '失败' },
];
// 投放成功状态
export const THROW_STATUS_SUCESS = [{ id: '3', name: '成功' }, { id: '4', name: '失败' }];

// 1、投放渠道：粉丝通、粉丝头条、抖+、快手、B站
export const THROW_TYPE = [
    {
        id: '1',
        name: '粉丝通',
        children: [
            {
                id: '1',
                name: '日常',
            },
            {
                id: '2',
                name: '广告',
            },
        ],
    },
    {
        id: '2',
        name: '粉丝头条',
        children: [
            {
                id: '1',
                name: '日常',
            },
            {
                id: '3',
                name: '广告视频',
            },
            {
                id: '4',
                name: '电商视频',
            },
            {
                id: '5',
                name: '图文微任务',
            },
        ],
    },
    {
        id: '3',
        name: 'B站',
        children: [
            {
                id: '1',
                name: '日常',
            },
            {
                id: '2',
                name: '广告',
            },
        ],
    },
    {
        id: '4',
        name: '抖加',
        children: [
            {
                id: '1',
                name: '日常',
            },
            {
                id: '2',
                name: '广告',
            },
            {
                id: '6',
                name: '电商',
            },
            {
                id: '7',
                name: '娱乐直播',
            },
            {
                id: '8',
                name: '电商直播',
            },
        ],
    },
    {
        id: '5',
        name: '快手',
        children: [
            {
                id: '1',
                name: '日常',
            },
            {
                id: '2',
                name: '广告',
            },
        ],
    },
    {
        id: '6',
        name: 'WEIQ',
        children: [
            {
                id: '5',
                name: '图文微任务',
            },
        ],
    },
    {
        id: '7',
        name: '薯条',
        children: [
            {
                id: '1',
                name: '日常',
            },
            {
                id: '6',
                name: '电商',
            },
        ],
    },
    {
        id: '8',
        name: 'FeedsLive',
        children: [
            {
                id: '8',
                name: '电商直播',
            },
        ],
    },
    {
        id: '9',
        name: '竞价',
        children: [
            {
                id: '8',
                name: '电商直播',
            },
        ],
    },
    {
        id: '10',
        name: '品牌广告',
        children: [
            {
                id: '8',
                name: '电商直播',
            },
        ],
    },
];
export const SIFT_TYPE = [
    // 公司管理
    {
        id: '/admin/orgStructure/company',
        name: 1,
    },
    // 内部用户
    {
        id: '/admin/users/internal',
        name: 2,
    },
    // Talent - 艺人
    {
        id: '/foreEnd/business/talentManage/talent/actor',
        name: 3,
    },
    // Talent - 博主
    {
        id: '/foreEnd/business/talentManage/talent/blogger',
        name: 4,
    },
    // 投放列表
    {
        id: '/foreEnd/business/talentManage/throwManage/list',
        name: 5,
    },
    // 投放分析
    {
        id: '/foreEnd/business/talentManage/throwManage/analyze',
        name: 6,
    },
    // 客户管理 - 客户
    {
        id: '/foreEnd/business/customer/customer',
        name: 7,
    },
    // 知会我的
    {
        id: '/foreEnd/approval/notify',
        name: 8,
    },
    // 客户管理 - 线索
    {
        id: '/foreEnd/business/customer/thread',
        name: 9,
    },
    // 项目管理 - 立项管理
    {
        id: '/foreEnd/business/project/establish',
        name: 10,
    },
    // 项目管理 - 项目管理
    {
        id: '/foreEnd/business/project/manage',
        name: 11,
    },
    // 项目管理 - 项目合同
    {
        id: '/foreEnd/business/project/contract',
        name: 12,
    },
    // 费用 - 报销
    {
        id: '/foreEnd/business/feeManage/reimbursement',
        name: 13,
    },
    // 费用 - 申请
    {
        id: '/foreEnd/business/feeManage/apply',
        name: 14,
    },
    // 台账 - 收入确认
    {
        id: '/foreEnd/business/account/earning',
        name: 15,
    },
    // 台账 - 成本确认
    {
        id: '/foreEnd/business/account/costing',
        name: 16,
    },
    // 台账 - 费用类
    {
        id: '/foreEnd/business/account/expenses',
        name: 17,
    },
    // 我审批的 - 一般审批
    {
        id: '/foreEnd/approval/approval/myjob',
        name: 18,
    },
    // 我发起的 - 我发起的
    {
        id: '/foreEnd/approval/apply/myjob',
        name: 19,
    },
    // 我审批的 - 合同审核详情
    {
        id: '/foreEnd/approval/approval/contract',
        name: 20,
    },
    // 我审批的 - 合同商务条款审批
    {
        id: '/foreEnd/approval/approval/business',
        name: 21,
    },
    // 我发起的 - 合同审核详情
    {
        id: '/foreEnd/approval/apply/contract',
        name: 22,
    },
    // 我发起的 - 合同商务条款审批
    {
        id: '/foreEnd/approval/apply/business',
        name: 23,
    },
    {
        id: '/foreEnd/business/travelOrder/travelOrderManage',
        name: 24,
    },
    // 我发起的 - 合同商务条款审批
    {
        id: '/foreEnd/business/project/verify',
        name: 25,
    },
    // 结算管理 - 结算单
    {
        id: '/foreEnd/business/balance/statement/list',
        name: 26,
    },
    // 我审批的 - 费用报销
    {
        id: '/foreEnd/approval/approval/reimbursement',
        name: 27,
    },
    // 我审批的 - 费用申请
    {
        id: '/foreEnd/approval/approval/application',
        name: 28,
    },
    // 供应商
    {
        id: '/foreEnd/business/supplier',
        name: 29,
    },
    // 结算进度
    {
        id: '/foreEnd/business/settleManage/progress',
        name: 30,
    },
];
// 日程提醒
export const SCHEDULE_REMINDER = [
    { id: '1', name: '不提醒' },
    { id: '2', name: '事件发生时' },
    { id: '3', name: '5分钟前' },
    { id: '4', name: '15分钟前' },
    { id: '5', name: '30分钟前' },
    { id: '6', name: '1小时前' },
    { id: '7', name: '2小时前' },
    { id: '8', name: '1天前' },
    { id: '9', name: '2天前' },
    { id: '10', name: '1周前' },
];
// 日程权限
export const SCHEDULE_PERMISSION = [
    { id: '1', name: '公开' },
    { id: '0', name: '私密' },
    // { id: '2', name: '部分可见' },
];
// 任务状态
export const TASK_STATUS = [{ id: '0', name: '未完成' }, { id: '1', name: '已完成' }];
// 所属日历
export const ALLOW_SCHEDULE = [{ id: '0', name: '我的日历' }];
// 定制盘管理 - 用户类型
export const BUSINESS_SPECIAL_TYPE = [{ id: '1', name: '用户' }, { id: '2', name: '角色' }, { id: '3', name: '部门' }];
// talent类型
export const TALENDT_TYPE = [{ id: '0', name: '艺人' }, { id: '1', name: '博主' }];

// 差旅订单类型
export const TRAVEL_ORDER_TYPE = [{ id: '1', name: '机票' }, { id: '2', name: '火车票' }, { id: '3', name: '酒店' }];

// 差旅订单状态
export const TRAVEL_ORDER_STATUS = [{ id: '1', name: '新增' }, { id: '2', name: '退订' }, { id: '3', name: '改签' }];

// 差旅订单是否超标
export const TRAVEL_ORDER_INSURANCE = [{ id: '0', name: '否' }, { id: '1', name: '是' }];

// 差旅订单审核状态
export const TRAVEL_APPROVAL_STATUS = [{ id: '0', name: '未审核' }, { id: '1', name: '已审核' }];

// 差旅订单付款状态
export const TRAVEL_PAYMENT_STATUS = [{ id: '0', name: '未付款' }, { id: '1', name: '已付款' }];

// 差旅订单是否生成台账  orderLedgerStatus
export const TRAVEL_ORDER_LEDGER = [{ id: '0', name: '否' }, { id: '1', name: '是' }];

// 费用承担类型  applyFeeBearType
export const APPLY_FEEBEAR_TYPE = [
    { id: '1', name: '公司承担' },
    { id: '2', name: '艺人承担' },
    { id: '3', name: '公司与艺人共同承担' },
];

// 发票类型
export const ORDER_INVOICE_TYPE = [
    { id: '1', name: '专票' },
    { id: '2', name: '普票' },
    { id: '3', name: '滴滴' },
    { id: '4', name: '机票+燃油费' },
    { id: '5', name: '铁路客票' },
    { id: '6', name: '公路客票' },
    { id: '7', name: '水路客票' },
    { id: '8', name: '其他客票' },
];

// 费用承担方
export const APPLY_FEEBEAR_PERSON = [
    { id: '1', name: '公司承担' },
    { id: '2', name: '艺人承担' },
    { id: '3', name: '公司与艺人共同承担' },
];

// 项目类别
export const TRAVEL_PROJECT_TYPE = [{ id: '0', name: '基础项目' }, { id: '1', name: '立项项目' }];

export const GROUPLIST = [
    { id: '0', name: 'A组' },
    { id: '1', name: 'B组' },
    { id: '2', name: 'C组' },
    { id: '3', name: 'D组' },
    { id: '4', name: '所长' },
    { id: '5', name: '母婴' },
    { id: '6', name: '其他' },
];

export const OPERATION_TYPE = [
    { id: '1', name: '新增' },
    { id: '2', name: '删除' },
    { id: '3', name: '修改' },
    { id: '4', name: '添加' }, // 列表新增元素
    { id: '5', name: '删除' }, // 列表移除元素
];
// 发起付款状态
export const STARTPAYSTATUS = [{ id: '0', name: '未发起' }, { id: '1', name: '已发起' }];
export const APPROVALSTATUS = [{ id: '0', name: '未付款' }, { id: '1', name: '已付款' }];
export const PUSHACCOUNTSTATUS = [{ id: '0', name: '未发送' }, { id: '1', name: '已发送' }];
export const PAYSTATUS = [{ id: '1', name: '待审批' }, { id: '3', name: '审批通过' }, { id: '4', name: '审批未通过' }];
export const FEESCENE = [{ id: '1', name: '交通福利' }, { id: '2', name: '外勤' }];
export const OUTOFFICESTATUS = [
    { id: '1', name: '待审批' },
    { id: '2', name: '待审批' },
    { id: '3', name: '已同意' },
    { id: '4', name: '已驳回' },
];

// 排序规则
export const ORDER_BY = [{ id: '1', name: '从高到低' }, { id: '2', name: '从低到高' }];
// ---------------- 工作台 ------------------
// 优先级
export const PRIORITY_TYPE = [{ id: '1', name: '普通' }, { id: '2', name: '紧急' }, { id: '3', name: '非常紧急' }];
// ---------------------------刊例----------------------------------
// 锁定周期
export const LOCK_PERIOD = [{ id: '0', name: '每月' }, { id: '1', name: '每季度' }];
// 解锁月份
export const UNLOCK_MONTH = [
    { id: '1', name: '第一个月' },
    { id: '2', name: '第二个月' },
    { id: '3', name: '第三个月' },
];
// --------------------------- 供应商 ---------------------------
// 税务资质 引用TAX_TYPE
// 供应商类型
export const SUPPLIER_TYPE = [{ id: '1', name: '内部供应商' }, { id: '2', name: '外部供应商' }];
// 税率
export const SUPPLIER_RATE = [{ id: '0.03', name: '3%' }, { id: '0.06', name: '6%' }];
// --------------------------- 博主拓展 ---------------------------
// 签约年限
export const SIGN_YEAR = [{ id: '1', name: '3年' }, { id: '2', name: '5年' }];
// 合约类型
export const TALENT_CONTRACT_TYPE = [
    { id: '1', name: '全约' },
    { id: '2', name: '独家商务约' },
    { id: '3', name: '非独家商务约' },
    { id: '4', name: '抖音新媒体约' },
    { id: '5', name: 'B站新媒体约' },
    { id: '6', name: '小红书新媒体约' },
    { id: '7', name: '微博新媒体约' },
    { id: '8', name: '快手新媒体约' },
];
const enumData = {
    SUPPLIER_TYPE,
    SUPPLIER_RATE,
    FLOW_TYPE,
    FLOW_REPEAT,
    FLOW_COPY_WAY,
    FLOW_APPROVER,
    FLOW_VACANCY,
    FLOW_SET_DATA_TYPE,
    DEPARTMENT_TYPE,
    IS_OR_NOT,
    STAFF_STATUS,
    EMPLOY_TYPE,
    JOB_POSITION,
    RESIDENCS_TYPE,
    MARRY_STATUES,
    BLOOD_TYPE,
    STAR_SOURCE,
    STAR_LEVEL,
    BLOGGER_TYPE,
    BLOGGER_RECOMMEND_STATE,
    TAX_TYPE,
    THREAD_TYPE,
    THREAD_STATUS,
    COMPANY_TYPE,
    CLIENT_STATUS,
    THREAD_LEVEL,
    TRAIL_PROGRESS,
    COMPANY_PROERTY,
    MAIN_BUSINESS,
    FILM_TYPE,
    COOPERATION_TYPE,
    ENTERTAINMENT_TYPE,
    PROJECTING_SIGN_STATE,
    PROJECTING_EXECTE_STATE,
    APPROVAL_STATE,
    APPROVAL_GLOBAL_STATE,
    PROJECTING_STATE,
    APPROVAL_APPLY_STATUS,
    APPROVAL_APPROVAL_STATUS,
    PROJECT_ESTABLISH_TYPE,
    PAY_STATUS,
    WRITE_OFF_STATUS,
    DEAL_STATUS,
    APPROVAL_STATUS,
    FINALIZED_STATUS,
    CONTRACT_INVOICE_COMPANY_TYPE,
    CONTRACT_INVOICE_TYPE,
    PROJECT_ESTABLISH_TYPE_SHOW,
    THROW_TYPE,
    THROW_PLATFORM,
    THROW_PLATFORM1,
    THROW_CHANNEL,
    THROW_TYPE_TOTAL,
    THROW_STATUS,
    SCHEDULE_REMINDER,
    SCHEDULE_PERMISSION,
    TASK_STATUS,
    ALLOW_SCHEDULE,
    PROJECT_ESTABLISH_RATIO,
    TALENDT_TYPE,
    TRAVEL_ORDER_TYPE,
    TRAVEL_ORDER_STATUS,
    TRAVEL_ORDER_INSURANCE,
    TRAVEL_PAYMENT_STATUS,
    TRAVEL_APPROVAL_STATUS,
    TRAVEL_ORDER_LEDGER,
    ORDER_INVOICE_TYPE,
    APPLY_FEEBEAR_TYPE,
    OPERATION_TYPE,
    BUSINESS_SPECIAL_TYPE,
    ORDER_BY,
    PRIORITY_TYPE,
};
enumData.formateEnum = (type, id) => {
    const originData = enumData[type] || [];
    const obj = originData.find((item) => {
        return String(item.id) === String(id);
    }) || {};
    return obj.name || '';
};
export default enumData;
