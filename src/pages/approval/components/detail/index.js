import React from 'react';
import { detailConfig } from './config';

import ybh from '@/assets/approval/ybh@2x.png';
import dsp from '@/assets/approval/dsp@2x.png';
import ycx from '@/assets/approval/ycx@2x.png';
import yty from '@/assets/approval/yty@2x.png';

let styles = {
    imgCon: {
        position: 'relative',
    },
    imgState: {
        position: 'absolute',
        right: '92px',
        top: '10px',
        width: '148px',
        height: '87px',
        display: 'block',
    },
};
class Project extends React.Component {
    constructor(props) {
        super(props);
    }

    renderChildren = (apprlvalDetail = {}) => {
        if (!apprlvalDetail.id) {
            return null;
        }
        // 获取type
        const approvalFlow = apprlvalDetail.approvalFlow || {};
        const type = approvalFlow.flowMark;
        const NodeObj = detailConfig[type] || {};
        // 获取ID
        const approvalForm = apprlvalDetail.approvalForm || {};
        const approvalFormFields = approvalForm.approvalFormFields || [];
        let id = '';
        if (approvalFormFields && approvalFormFields.length > 0) {
            id = approvalFormFields[0].value;
        }
        const commentsParams = { id: apprlvalDetail.id, interfaceName: '8' };
        return NodeObj.component ? (
            <NodeObj.component
                id={id}
                type='approval'
                commentsParams={commentsParams}
                {...this.props}
                ref='detail'
            />
        ) : null;
    };

    stateIcon = type => {
        // 审批状态角标
        if (type == -1) {
            return <img src={ycx} alt='' style={styles.imgState} />;
        } else if (type == 0) {
            return <img src={ybh} alt='' style={styles.imgState} />;
        } else if (type == 2) {
            return <img src={yty} alt='' style={styles.imgState} />;
        } else if (type == 1 || type == 3 || type == 5) {
            return <img src={dsp} alt='' style={styles.imgState} />;
        } else {
            return null;
        }
    };
    render() {
        const { apprlvalDetail } = this.props;
        return (
            <div style={styles.imgCon}>
                <div>{this.renderChildren(apprlvalDetail)}</div>
                {apprlvalDetail && this.stateIcon(apprlvalDetail.status)}
            </div>
        );
    }
}
export default Project;
