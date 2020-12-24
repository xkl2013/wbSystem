/**
 * 静态数据和全局配置
 * */

// localStorage Keys
// eslint-disable-next-line
import storage from '@/utils/storage';

/**
 * 按环境配置用户角色ID
 * 默认为线上，development为测试环境
 */
export const ROLE_CAIWU = 33; // 财务
const isEnv = process.env.NODE_ENV === 'development' || process.env.BUILD_ENV === 'development';
export const ROLE_CAIWUHETONG = isEnv ? 32 : 43; // 财务合同
export const ROLE_SOP = isEnv ? 57 : 55; // sop-产品运行
// 当前用户权限
export const ADMIN_AUTH = 'admin_auth';
// 当前用户信息
export const ADMIN_USER = 'admin_user_cookie';
// 记录当前socket链接时间搓
export const SOCKET_TIME_STAMP = 'socket_time_stamp';
// 线上环境应用token
export const ADMIN_APP_TOKEN = 'admin_app_token';
// 记录快捷入口状态记录
export const QUICK_ENTRY_OPEN = 'quick_entry_open';
export const PROXY_PATH = () => {
    return '/adminApi';
};
export const LOGIN_URL = () => {
    return '';
};
// 时间格式
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const SPECIAL_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const SPECIAL_DATETIME_FORMAT_30 = 'YYYY-MM-DD HH:30';
export const SPECIAL_DATETIME_FORMAT_00 = 'YYYY-MM-DD HH:00';
export const BUCKET = {
    development: 'attachment_test',
    production: 'apollo_attachment',
};
// 分页配置
export const PAGINATION = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: 1,
    total: 0,
    pageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
};
// 聘用形式 1:实习 2:劳动 3:劳务 4:外包
export const EMPLOYEE_TYPE = {
    1: '实习',
    2: '劳动',
    3: '劳务',
    4: '外包',
};
export const HOST = process.env.BUILD_ENV === 'development' ? 'https://arthas.mttop.cn' : 'https://mt.mttop.cn';
export const SHIMO_HOST = {
    production: 'https://mt.mttop.cn/crm',
    development: 'https://arthas.mttop.cn/crm',
};
export const SHIMO_DOMAIN = 'https://cowork.mttop.cn';
export const GET_SHIMO_PATH = () => {
    const token = storage.getToken();
    // 现只有一套环境
    return `${SHIMO_HOST[process.env.BUILD_ENV]}/shimo/directToShimo?token=${token}`;
    // return `https://mt.mttop.cn/crm/shimo/directToShimo?token=${token}`;
};

// 费用申请单，下推功能，财务常见，用户ID
export const FINANCE_PUSHDOWN_USER_ID1 = 112;
export const FINANCE_PUSHDOWN_USER_ID2 = 412;
export const FINANCE_PUSHDOWN_USER_ID3 = 19;
export const FINANCE_PUSHDOWN_USER_ID4 = 170;
export const FINANCE_PUSHDOWN_USER_ID5 = 712;
export const FINANCE_PUSHDOWN_USER_ID6 = 161; // 扈艳丽
export const FINANCE_PUSHDOWN_USER_ID7 = 319; // 李漫

// 谷歌浏览器下载地址
export const chromeWin32 = 'https://static.mttop.cn/83.0.4103.106_chrome32_stable_windows_installer.exe';
export const chromeWin64 = 'https://static.mttop.cn/83.0.4103.106_chrome64_stable_windows_installer.exe';
export const chromeMac = 'https://static.mttop.cn/googlechrome.dmg';

// 需要用于global filter 进行数据筛选的，必须加到default里
export default {
    PROXY_PATH,
    PAGINATION,
    EMPLOYEE_TYPE,
};
