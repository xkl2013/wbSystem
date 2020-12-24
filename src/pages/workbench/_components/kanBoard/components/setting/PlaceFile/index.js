import React, { forwardRef } from 'react';
import { Popconfirm, message } from 'antd';
import { finishedScheduleFile } from '../../../../../services';

const PlaceFile = (props, ref) => {
    const { data, onRefresh, taskParams } = props;
    const panelId = (data || {}).key;
    const PlaceFileConfirm = async () => {
        const res = await finishedScheduleFile({
            panelId: Number(panelId),
            projectId: Number(taskParams.projectId),
        });
        if (res && res.success && onRefresh) {
            const dataSource = res.data || {};
            if (dataSource.filedItems > 0) {
                await onRefresh(panelId);
            }

            message.success(`本次成功归档${dataSource.filedItems || 0}条任务(包含主任务和子任务)`);
        }
    };
    return (
        <Popconfirm
            placement="topLeft"
            title="确认将列表中所有已完成任务归档吗？"
            onConfirm={PlaceFileConfirm}
            ref={ref}
        >
            <div>归档列表内已完成任务</div>
        </Popconfirm>
    );
};
export default forwardRef(PlaceFile);
