import React from 'react';
import { columnsFn } from '@/pages/business/project/establish/components/projectingReturn/selfTable';
import BITable from '@/ant_components/BITable';
import s from '@/pages/business/project/establish/components/projectingBudgetInfo/index.less';

const getReturnCols = (formData) => {
    return (
        <div className={s.view}>
            <BITable
                className={s.tableWrap}
                rowKey="id"
                dataSource={formData.projectingReturnDTOList}
                bordered
                pagination={false}
                columns={columnsFn({ from: 'detail' })}
            />
        </div>
    );
};
export default getReturnCols;
