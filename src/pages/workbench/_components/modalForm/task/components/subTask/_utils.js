/**
 * 判断是否有子任务
 * params:包含以下三个字段，object
 * currentId:被点击任务的id，number类型
 * callBack:回掉函数，function
 * status：1已完成，0未完成，number类型
 *  */
import BIModal from '@/ant_components/BIModal';
import { finishflagStatus, getSubnodeFinish } from '../../../services';

// 请求完成状态接口
export const fetchUpdateFinishFlag = async (params) => {
    const response = await finishflagStatus({ status: params.status, id: params.currentId });
    if (response && response.success) {
        if (params.callBack) {
            params.callBack();
        }
    }
    return true;
};

// 有未完成的子任务时需要提示框确定---子任务状态变成已完成
export const showFinishTip = async (params) => {
    const confirm = BIModal.confirm({
        title: '',
        content: '完成该任务，该任务下的所有子任务也会变更为完成状态，是否确认完成？',
        onOk: async () => {
            const callBack = params.callBack;
            if (callBack) callBack();
            // return fetchUpdateFinishFlag(params);
        },
        onCancel: () => {
            confirm.destroy();
        },
    });
};
// 提交数据时判断是否有未完成的子任务
export const fetchFinishflagStatus = async (params) => {
    const callBack = params.callBack;
    if (params.status === 1) {
        // 掉接口判断该任务下是否有未完成的子任务，有的话弹框提示，没有直接掉接口变成已完成
        const res = await getSubnodeFinish(params.currentId);
        if (res && res.success) {
            // res.data:0无子任务，1存在未完成的子任务，2所有子任务已完成
            if (res.data === 1) {
                return showFinishTip(params);
            }
        }
    }
    if (callBack) callBack();
};
// 点击卡片checkbox更换完成状态
export const fetchCardFinishflagStatus = async (params) => {
    const callBack = async () => {
        const res = await fetchUpdateFinishFlag(params);
        if (res && res.success && params.callBack) {
            params.callBack();
        }
    };
    if (params.status === 1) {
        // 掉接口判断该任务下是否有未完成的子任务，有的话弹框提示，没有直接掉接口变成已完成
        const res = await getSubnodeFinish(params.currentId);
        if (res && res.success) {
            // res.data:0无子任务，1存在未完成的子任务，2所有子任务已完成
            if (res.data === 1) {
                return showFinishTip({ ...params, callBack });
            }
        }
    }
    await callBack();
};
export const formItemLayout = {
    labelAlign: 'right',
    labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 19 },
        sm: { span: 19 },
    },
};
