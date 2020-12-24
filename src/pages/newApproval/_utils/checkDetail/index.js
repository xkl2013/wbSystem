import _ from 'lodash';
import { message } from 'antd';
import { checkoutAuth } from './config';
import { getApprovalInstance } from '../../services';

/**
 * props: {}
 * instanceId:  -- 必传
 * flowKey -- 选填
 */

export default async (props) => {
    const instanceId = props.instanceId;
    const target = props.target;
    const history = window.g_history;
    let flowKey;
    let pathConfig;
    if (props.flowKey) {
        flowKey = props.flowKey;
        pathConfig = checkoutAuth(flowKey);
        if (_.isEmpty(pathConfig)) {
            if (target) {
                window.open(`/foreEnd/newApproval/detail?id=${instanceId}`, target || '_blank');
            } else {
                history.push(`/foreEnd/newApproval/detail?id=${instanceId}`);
            }
            return;
        }
        if (!instanceId) {
            message.warn('id未传入！');
            return;
        }
        if (target) {
            window.open(`${pathConfig.pathname}?id=${instanceId}`, target || '_blank');
        } else {
            history.push(`${pathConfig.pathname}?id=${instanceId}`);
        }
    } else {
        const result = await getApprovalInstance(instanceId);
        if (result.success && result.data) {
            let id = '';
            const instanceData = result.data || {};
            const approvalFlow = instanceData.approvalFlow || {};
            const approvalForm = instanceData.approvalForm || {};
            flowKey = approvalFlow.flowKey || '';
            pathConfig = checkoutAuth(flowKey);
            if (!_.isEmpty(approvalForm) && !_.isEmpty(approvalForm.approvalFormFields)) {
                const fields = approvalForm.approvalFormFields || [];
                id = fields[0].value || '';
            }
            if (_.isEmpty(pathConfig)) {
                if (target) {
                    window.open(`/foreEnd/newApproval/detail?id=${instanceId}`, target || '_blank');
                } else {
                    history.push(`/foreEnd/newApproval/detail?id=${instanceId}`);
                }
                return;
            }
            if (!id) {
                message.warn('id未传入！');
                return;
            }
            if (target) {
                window.open(`${pathConfig.pathname}?id=${id}`, target || '_blank');
            } else {
                history.push(`${pathConfig.pathname}?id=${id}`);
            }
        } else {
            message.warn('出错了！');
        }
    }
};
