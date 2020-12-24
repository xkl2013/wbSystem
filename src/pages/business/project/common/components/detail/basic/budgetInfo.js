import React from 'react';
import { columnsFn } from '@/pages/business/project/establish/components/projectingBudgetInfo/tableColum';
import BITable from '@/ant_components/BITable';
import s from '@/pages/business/project/establish/components/projectingBudgetInfo/index.less';

const getBudgetInfoCols = (formData) => {
    return (
        <div className={s.view}>
            <BITable
                className={s.tableWrap}
                rowKey={(item) => {
                    return `${item.talentId}_${item.talentType}`;
                }}
                dataSource={formData.projectBudgets}
                bordered
                pagination={false}
                columns={columnsFn({ props: { editable: false, formData } })}
            />
        </div>
    );
};
export default getBudgetInfoCols;
