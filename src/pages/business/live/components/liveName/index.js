import React, { useEffect, useState } from 'react';
import { getDetail } from '@/pages/business/live/session/service';
import s from './index.less';

const LiveName = (props) => {
    const { liveId, tableId } = props;
    const [liveName, setLiveName] = useState('');

    useEffect(() => {
        if (liveId && tableId) {
            const getLiveName = async () => {
                const res = await getDetail({
                    tableId,
                    rowId: liveId,
                });
                if (res && res.success && res.data) {
                    const liveCode = res.data.rowData.find((item) => {
                        return item.colName === 'liveCode';
                    });
                    if (liveCode && liveCode.cellValueList && liveCode.cellValueList[0]) {
                        setLiveName(liveCode.cellValueList[0].text);
                    }
                }
            };
            getLiveName();
        }
    }, [liveId, tableId]);

    return (
        <div className={s.liveContainer}>
            场次：
            <span className={s.totalNum}>{liveName}</span>
        </div>
    );
};
export default LiveName;
