import React from 'react';
import { columnsFn } from '@/pages/business/project/establish/components/projectingObligation/selfTable';
import BITable from '@/ant_components/BITable';
import s from '@/pages/business/project/establish/components/projectingBudgetInfo/index.less';

const getObligationCols = (formData, from, callback) => {
    const columns = columnsFn({ formData, from, callback });
    if (from !== 'manage') {
        columns.pop();
    }
    return (
        <div className={s.view}>
            <BITable
                className={s.tableWrap}
                rowKey={(item) => {
                    return `${item.projectingAppointmentTalentId}_${item.projectingAppointmentTalentType}`;
                }}
                dataSource={formData.projectingAppointmentDTOList}
                bordered
                pagination={false}
                columns={columns}
            />
        </div>
    );
};
export default getObligationCols;
