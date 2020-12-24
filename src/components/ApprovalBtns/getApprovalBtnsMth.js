import storage from '@/utils/storage';
import { getExecutors } from './services';

/**
 *   审批： 同意、驳回、转交、退回、撤销、编辑  按钮显隐判断
 *
 * @export
 * @param {object} data 审批流全量数据
 * @returns {object} {btnsObj} 按钮显隐状态
 */
export default async function (data) {
    const btnsObj = {
        agreeBtn: false, // 同意
        rejectBtn: false, // 驳回
        handOverBtn: false, // 转交
        rebackBtn: false, // 回退
        revocationBtn: false, // 撤销
        editBtn: false, // 回退编辑
    };
    if (!data || JSON.stringify(data) === '{}') {
        return btnsObj;
    }
    const { userId, roleList } = storage.getUserInfo();
    const { status, approvalFlowNodeDtos = [], userVO = {} } = data || {};
    const { userId: createId } = userVO || {}; // 创建人ID
    // status: -1 已撤销, 0 已驳回, 1 审批中, 2 已同意, 5 待审批, 7 回退， 8 回退编辑
    if (status === 8) {
        if (createId === userId) {
            btnsObj.editBtn = true;
        }
    }
    if (status === 1 || status === 5 || status === 7) {
        if (createId === userId) {
            btnsObj.revocationBtn = true;
        }
        if (Array.isArray(approvalFlowNodeDtos) && approvalFlowNodeDtos.length > 0) {
            // 审批中节点
            const approvalIngArr = approvalFlowNodeDtos.filter((item) => {
                return item.status === 1;
            });
            if (Array.isArray(approvalIngArr) && approvalIngArr.length > 0) {
                const { executorType, executorId, id } = approvalIngArr[0] || {};
                if (executorType === 0 && executorId === userId) {
                    // 个人审批
                    btnsObj.agreeBtn = true;
                    btnsObj.rejectBtn = true;
                    btnsObj.handOverBtn = true;
                    btnsObj.rebackBtn = true;
                }
                if (
                    executorType === 2
                    && (roleList || []).find((ls) => {
                        return ls.roleId === executorId;
                    })
                ) {
                    const resNew = await getExecutors({
                        instanceId: data.id,
                        executorId,
                        executorType: 2,
                        nodeId: id,
                    });
                    if (resNew.success) {
                        const { list } = resNew.data;
                        const newObj = list.find((item) => {
                            return Number(item.userId) === userId;
                        });
                        if (newObj && Number(newObj.status) === 1) {
                            // 角色审批
                            btnsObj.agreeBtn = true;
                            btnsObj.rejectBtn = true;
                            // btnsObj.handOverBtn = true;
                            btnsObj.rebackBtn = true;
                        }
                    }
                }
            }
        }
    }

    return btnsObj;
}
