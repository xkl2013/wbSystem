/**
 * 判断是否有子任务
 * params:包含以下字段，object
 * currentId:被点击任务的id，number类型
 * callBack:回掉函数，function
 *  */
import BIModal from '@/ant_components/BIModal';
import { getSubnodeFinish } from '../../modalForm/services';

// 有子任务时需要提示框确定是否全部删除
export const showTip = async (params) => {
    const confirm = BIModal.confirm({
        title: '',
        content: '删除该任务，该任务下的所有子任务也会被删除，是否确认删除？',
        onOk: async () => {
            if (params.callBack) {
                params.callBack();
            }
        },
        onCancel: () => {
            confirm.destroy();
        },
    });
};
// 无子任务时需要提示框确定是否全部删除
export const showNoTaskTip = async (params) => {
    const confirm = BIModal.confirm({
        title: '',
        content: '该任务将被彻底删除,确认删除？',
        onOk: async () => {
            if (params.callBack) {
                params.callBack();
            }
        },
        onCancel: () => {
            confirm.destroy();
        },
    });
};
export const delAllTask = async (params) => {
    // 掉接口判断该任务下是否有子任务，有的话弹框提示，没有直接掉接口删除
    const res = await getSubnodeFinish(params.currentId);
    if (res && res.success) {
        // res.data:0无子任务，1存在未完成的子任务，2所有子任务已完成
        if (res.data !== 0) {
            showTip(params);
        } else {
            showNoTaskTip(params);
        }
    }
};
