import React, { useState } from 'react';
import { HOST } from '@/utils/constants';
import { Tooltip, message } from 'antd';
import IconFont from '@/components/CustomIcon/IconFont';
import { getRoomId } from '../../service';
import styles from './styles.less';

const LinkButton = (props) => {
    const [loading, saveLoading] = useState(false);
    if (!props.liveId) return;
    const onClickNode = async () => {
        if (loading) return;
        saveLoading(true);
        const res = await getRoomId(props.liveId);
        saveLoading(false);
        if (res && res.data && res.data.roomId) {
            const roomId = res.data.roomId;
            const analysePage = `${HOST}/analysis/detail?roomId=${roomId}`;
            window.open(analysePage, '_blank');
        } else {
            message.warn('本场直播数据暂未监测');
        }
    };
    return (
        <Tooltip placement="topLeft" title="直播分析">
            <span className={styles.btnIcon} onClick={onClickNode}>
                <IconFont type="iconblock" style={{ marginRight: '5px' }} />
                分析
            </span>
        </Tooltip>
    );
};
export default LinkButton;
