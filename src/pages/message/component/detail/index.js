/*
 * @Author: your name
 * @Date: 2020-01-02 17:44:15
 * @LastEditTime : 2020-01-02 19:34:42
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/message/component/detail/index.js
 */
import { message } from 'antd';
import config, { getModuleFromTableId, getConfigKeyFromInterfaceName } from '@/config/business';
import { openUrl } from '@/utils/urlOp';
import { getLiveTable } from '@/pages/business/live/product/service';
import { getRecruitmentTableId } from '@/pages/business/recruit/service';
import Modal from './modals';
import { getCommerceDetail } from '../../../approval/services';
import { toShimoDetail } from './_util';
import toApprovalDetail from '../../../newApproval/_utils/checkDetail';

/*
 *  @params(messageObj) 消息实体
 *  @params(beforeJump) 用于权限拦截,跳转之前数据处理,返回params数据
 */
export default async function ToDetail({ messageObj, beforeJump }, callback) {
    const extraMsgObj = messageObj.extraMsgObj || {};
    const { moduleId, moduleType, business, messageActionType } = extraMsgObj;
    let params = { id: moduleId };
    let businessModule = config[moduleType];
    if (Number(moduleType) >= 41) {
        // moduleType 大于 41后，与config key不一致，需反查出正确的key
        businessModule = config[getConfigKeyFromInterfaceName(moduleType)];
    }
    // 直播产品，同意moduleId对应多个tableId，特殊处理
    if (Number(moduleType) === 37) {
        const res = await getLiveTable(moduleId);
        if (res && res.success && res.data) {
            const tableId = res.data.tableId;
            businessModule = getModuleFromTableId(tableId);
        } else return;
    }
    // 产品库
    if (Number(moduleType) === 38) {
        businessModule = config[37];
    }
    // 全球招募，同一moduleId对应多个tableId，特殊处理
    if (Number(moduleType) === 41) {
        const res = await getRecruitmentTableId(moduleId);
        if (res && res.success && res.data) {
            const tableId = res.data.tableId;
            businessModule = getModuleFromTableId(tableId);
        } else return;
    }
    if (messageActionType === 0) {
        return;
    }
    if (businessModule === undefined) {
        message.warn('不识别消息类型');
        return;
    }
    if (beforeJump) {
        const beforeParams = beforeJump(extraMsgObj) || {};
        params = Object.assign({}, params, beforeParams);
    }
    if (businessModule.pageType === 'modal') {
        Modal.showModal(businessModule, extraMsgObj);
        return;
    }
    if (businessModule.pageType === 'page') {
        // eslint-disable-next-line no-underscore-dangle
        switch (Number(moduleType)) {
            case 8:
                await toApprovalDetail({ instanceId: moduleId, flowKey: business, target: '_blank' });
                break;
            case 11: // 商单类和非商单类// 临时使用
                const response = await getCommerceDetail(moduleId);
                if (response && response.success) {
                    const clauseContractType = (response.data || {}).clauseContractType;
                    const pathname = businessModule.pathnameCallback(clauseContractType);
                    openUrl(pathname, params);
                } else {
                    message.warn('数据异常');
                }
                break;
            case 27:
                window.open(`/foreEnd/dataChange?businessId=${moduleId}`);
                break;
            case 100: // 石墨消息
                await toShimoDetail(extraMsgObj.messageModelUrl);
                break;
            default:
                openUrl(businessModule.pathname, params);
                break;
        }
    }
    if (callback) {
        callback(businessModule);
    }
}
