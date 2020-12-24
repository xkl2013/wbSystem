/* eslint-disable */
import { useCallback, useState } from 'react';
import BIModal from '@/ant_components/BIModal';
import { updateLineData } from '@/pages/business/live/utils';

export const useMessage = (props) => {
    const { dataSource, liveId, tableId, setDataSource } = props;
    const [callbackId, setCallbackId] = useState();
    const [userEditMsg, setUserEditMsg] = useState({ status: 0 });
    const onEmitMsg = useCallback((data) => {
        data.liveId = liveId;
        data.tableId = tableId;
        setUserEditMsg(data);
    }, []);
    // 接收编辑更新消息{liveId,data,operateType:['add','edit','del']}
    const onReceiveMsg = useCallback(
        (msg, cbId) => {
            const { operateType, data } = msg;
            // 场次不匹配
            if (Number(msg.liveId) !== Number(liveId)) {
                setCallbackId(cbId);
                return;
            }
            if (operateType === 'clear') {
                BIModal.warning({
                    title: '该场次已被其他协作者删除',
                    onOk: () => {
                        window.opener && window.opener.location.reload();
                        window.close();
                    },
                });
                setCallbackId(cbId);
                return;
            }
            // table不匹配
            if (!data || Number(data.tableId) !== Number(tableId)) {
                setCallbackId(cbId);
                return;
            }
            const { dynamicRowDataDTO } = data;
            if (operateType === 'add') {
                const newDataSource = updateLineData(dataSource, {
                    value: dynamicRowDataDTO,
                    operateType: 'add',
                });
                setDataSource(newDataSource);
                setCallbackId(cbId);
            } else {
                const updateOldIndex = dataSource.findIndex((item) => {
                    return Number(item.historyGroupId) === Number(dynamicRowDataDTO.historyGroupId);
                });
                if (updateOldIndex > -1) {
                    if (
                        operateType === 'del' &&
                        userEditMsg.status === 1 &&
                        userEditMsg.rowId === dataSource[updateOldIndex].id
                    ) {
                        const dom = document.getElementById(
                            `cellUnit_${tableId}_${userEditMsg.rowId}_${userEditMsg.columnCode}`,
                        );
                        dom && dom.setAttribute('data-editing-cell', '0');
                        BIModal.warning({
                            title: '该条记录已被其他协作者变更状态（删除或移动）',
                        });
                    }
                    // TODO:临时特殊处理（已排序不允许修改）
                    if ((tableId === 30 || tableId === 36) && dynamicRowDataDTO) {
                        dynamicRowDataDTO.rowData.map((item) => {
                            if (
                                item.colName === 'selectState' &&
                                item.cellValueList[0] &&
                                String(item.cellValueList[0].value) === '4'
                            ) {
                                item.dynamicCellConfigDTO = { readonlyFlag: true, showDetailFlag: true };
                            }
                        });
                    }

                    // 更新操作，只处理内存数据
                    const newDataSource = updateLineData(dataSource, {
                        index: updateOldIndex,
                        value: dynamicRowDataDTO,
                        operateType,
                        force: true,
                    });
                    setDataSource(newDataSource);
                    setCallbackId(cbId);
                }
            }
        },
        [dataSource, userEditMsg, setDataSource],
    );

    return {
        userEditMsg,
        callbackId,
        onEmitMsg,
        onReceiveMsg,
    };
};
