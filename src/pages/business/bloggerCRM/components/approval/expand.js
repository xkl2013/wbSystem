import React from 'react';
import classNames from 'classnames';
import IconFont from '@/components/CustomIcon/IconFont';
import { Tooltip } from 'antd';
import s from './expand.less';

const ExpandApproval = (props) => {
    const { record, showApproval } = props;
    const approvalStatus = record.rowData.find((item) => {
        return item.colName === 'approvalStatus';
    });
    const isApproved = approvalStatus && approvalStatus.cellValueList && approvalStatus.cellValueList[0];
    return isApproved ? (
        <div className={s.approvalContainer} onClick={showApproval.bind(null, record.id)}>
            <Tooltip title={record.isLocked ? '审批锁定，点击查看详情' : '点击查看详情，可再次发起审批'}>
                <IconFont
                    className={classNames(s.approvalIcon, record.isLocked ? s.locked : '')}
                    type="iconshenpizhong"
                />
            </Tooltip>
        </div>
    ) : null;
};

export default ExpandApproval;
