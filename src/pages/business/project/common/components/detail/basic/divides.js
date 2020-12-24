import React from 'react';
import { columnsFn } from '@/pages/business/project/establish/components/projectingTalentDivides/table';
import BITable from '@/ant_components/BITable';
import s from '@/pages/business/project/establish/components/projectingBudgetInfo/index.less';

const getDividesCols = (formData, from) => {
    const columns = columnsFn({ formData, from });
    columns.pop();
    return (
        <div className={s.view}>
            <BITable
                className={s.tableWrap}
                rowKey={(item) => {
                    return `${item.talentId}_${item.talentType}`;
                }}
                dataSource={formData.projectingTalentDivides}
                bordered
                pagination={false}
                columns={columns}
            />
        </div>
    );
};
export default getDividesCols;
