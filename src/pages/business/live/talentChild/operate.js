import React from 'react';
import { Popconfirm } from 'antd';
import IconFont from '@/components/CustomIcon/IconFont';

const Operate = (props) => {
    const { cellRenderProps, rowData } = props;
    const { onDel } = cellRenderProps || {};
    const onDelRow = () => {
        if (typeof onDel === 'function') {
            onDel({ data: { id: rowData.id } });
        }
    };
    return (
        <div>
            <Popconfirm title="确定要删除吗?" onConfirm={onDelRow}>
                <IconFont type="iconshanchu" />
            </Popconfirm>
        </div>
    );
};
export default Operate;
