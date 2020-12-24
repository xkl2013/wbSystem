import React from 'react';
import Notice from '@/pages/business/components/noticers';

function getApproveId() {
    if (process.env.NODE_ENV === 'development' || process.env.BUILD_ENV === 'development') {
        // 测试环境
        return 1297;
    }
    // 线上
    return 1330;
}
const renderProjectingNotice = () => {
    return {
        key: 'notice',
        type: 'custom',
        component: <Notice approveId={getApproveId()} />,
    };
};
export default renderProjectingNotice;
