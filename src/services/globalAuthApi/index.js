import _ from 'lodash';
import { checkoutAuth } from './config';

/**
 * props: {}
 * id: 详情页id -- 必传
 * path: 跳转详情页路由 -- 必传
 */

export default async (props) => {
    const request = checkoutAuth(props.path);
    if (_.isEmpty(request)) {
        return '未传入定义模块!';
    }
    if (request.authignore) {
        return true;
    }
    try {
        let data = props.id;
        // 客户详情接口与其他不同，需特殊处理
        if (request.type === 3) {
            data = {
                id: props.id,
            };
            if (Number(props.tabIndex) === 2) {
                const contact = await request.contactRequest(data);
                if (contact && contact.success && contact.data) {
                    data.id = contact.data.customerId;
                } else {
                    return false;
                }
            }
        }
        // 内容客户详情
        if (request.type === 26) {
            data = {
                tableId: 14,
                rowId: props.id,
            };
        }
        // 商务客户详情
        if (request.type === 99) {
            data = {
                tableId: 1,
                rowId: props.id,
            };
        }
        const result = await request.request(data);
        if (result.success && result.data) {
            return Number(data.id || props.id);
        }
        return result.message || false;
    } catch (error) {
        return '请求出问题了...';
    }
};
