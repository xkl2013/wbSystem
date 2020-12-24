/**
 * request 网络请求工具
 */
import umi_request, { extend } from 'umi-request';
import router from 'umi/router';
import { notification, message } from 'antd';
import storage from './storage';
import { PROXY_PATH } from './constants';
import { checkoutType } from './utils';

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
const handleRestfulUrl = (url = '', options = {}) => {
    const { data, params } = options;
    const newParams = Array.isArray(data || params) ? {} : data || params;
    const { API_IDS = '' } = newParams || {};
    const type = checkoutType(API_IDS);
    if (type === 'array' && API_IDS.length > 0) {
        const ids = [];
        return url.replace(/{id}/g, (word) => {
            ids.push(word);
            return API_IDS[ids.length - 1];
        });
    }
    return url.replace(/{id}/g, () => {
        return API_IDS;
    });
};

/**
 * 异常处理程序
 */
const errorHandler = (error = {}) => {
    if (!error.response) return;
    const response = error.response;
    const errortext = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    message.config({
        maxCount: 1,
    });
    if (status === 401) {
        // 跳转至登录页
        message.error('登录失效，请重新登录');
        router.push('/loginLayout/loginIn');
        return;
    }
    if (status === 403) {
        message.error('登录失效，请重新登录');
        router.push('/loginLayout/loginIn');
        return;
    }
    if (status <= 504 && status >= 500) {
        // router.push('/exception/500');
        // return;
    }
    if (status >= 404 && status < 422) {
        router.push('/exception/404');
        return;
    }
    notification.destroy();
    notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errortext,
    });
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
    errorHandler, // 默认错误处理
    prefix: PROXY_PATH(), // prefix
    headers: {
        'Content-Type': 'application/json',
        authorization: storage.getToken(),
    },
    credentials: 'omit', // 默认请求是否带上cookie,暂不做处理,如需添加请设置跨域处进行设置
});
// 动态添加数据;
request.interceptors.request.use((url, options) => {
    options.headers = Object.assign({}, options.headers, { authorization: storage.getToken(), osSystem: 'PC' });
    return {
        url: handleRestfulUrl(url, options),
        options,
    };
});
// 处理异常数据
request.interceptors.response.use(async (response, ops) => {
    if (response.status === 200) {
        const data = await response.clone().json();
        if (!data.success) {
            if (ops.hideErrorMessage) {
                // 不需要异常提示,交由业务处理
                return data;
            }
            message.config({
                maxCount: 1,
            });
            if (data.message || data.msg) message.error(data.message || data.msg);
        }
    }
    return response;
});
export const CancelToken = () => {
    const TokenInstance = umi_request.CancelToken;
    return TokenInstance.source();
};
export default request;
