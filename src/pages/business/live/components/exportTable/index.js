import React from 'react';
import BIButton from '@/ant_components/BIButton';
import DownLoad from '@/components/DownLoad';
import s from './index.less';

const ExportTable = (props) => {
    const { selectedRows, tableId, liveId, name } = props;
    const ids = [];
    selectedRows.map((item) => {
        ids.push(item.id);
    });
    return (
        <DownLoad
            loadUrl={`/crmApi/business/live/product/export/${tableId}`}
            params={{
                method: 'post',
                data: {
                    liveId,
                    businessLiveProductIdList: ids,
                },
            }}
            fileName={() => {
                return `${name}.xlsx`;
            }}
            textClassName={s.exportContainer}
            text={
                <BIButton type="default" className={s.btn}>
                    <span className={s.text}>导出</span>
                </BIButton>
            }
            hideProgress
        />
    );
};
export default ExportTable;
