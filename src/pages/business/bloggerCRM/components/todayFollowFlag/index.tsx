import React from 'react';
import IconFont from '@/components/CustomIcon/IconFont';

const TodayFollowFlag = (props: any) => {
    const { origin } = props;
    const [first] = props.value || [];
    const { value } = first || {};
    if (origin === 'detailForm') {
        return Number(value) === 1 ? '是' : '否';
    }
    return Number(value) === 1 ? <IconFont type="iconquerenduigougouhao" /> : '-';
};
export default TodayFollowFlag;
