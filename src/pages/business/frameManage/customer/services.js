import request from '@/utils/request';
import { getFormate, setFormate } from '../components/step/_utils';

/**
 *
 * @param {} data  提交原始数据
 * @return{} data  经格式化处理的数据,将数据中 initType字段删除
 */
const formateFrameCustomer = (data) => {
    const newData = { ...data };
    newData.value = data.value.map((ls) => {
        const cellValueList = Array.isArray(ls.cellValueList) ? ls.cellValueList : [];
        const cellValue = (cellValueList[0] || {}).value;
        if (ls.columnCode === 'greesRole' && cellValue && cellValue.indexOf('initType')) {
            let formateCellValue = setFormate(cellValueList);
            formateCellValue = formateCellValue.map((item) => {
                delete item.initType;
                return item;
            });
            return {
                ...ls,
                cellValueList: getFormate(formateCellValue),
            };
        }
        return ls;
    });
    return newData;
};
// 新增年框客户
export function addOrUpdateDataSource({ data }) {
    return request('/year/frame/customer/addOrUpdate', {
        prefix: '/crmApi',
        method: 'post',
        data: formateFrameCustomer(data),
    });
}
// 年框客户列表
export function getDataSource({ tableId, data }) {
    return request(`/year/frame/customer/list/${tableId}`, {
        prefix: '/crmApi',
        method: 'post',
        data,
    });
}
// 获取数据详情
export async function getDetail({ tableId, rowId }) {
    return request(`/year/frame/row/${tableId}/${rowId}`, { method: 'get', prefix: '/crmApi' });
}
// 删除数据
export async function delData({ data }) {
    return request('/year/frame/customer/delete', { method: 'post', prefix: '/crmApi', data });
}

export default {
    addOrUpdateDataSource,
    getDataSource,
    getDetail,
    delData,
};
