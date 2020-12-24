import React, { PureComponent } from 'react';
import { Timeline } from 'antd';
import modalfy from '@/components/modalfy';
import UpdateInfo from './updateInfo';
import renderEmpty from '@/components/RenderEmpty';
import s from './index.less';

@modalfy
class ApprovalList extends PureComponent {
    // 自定义时间轴节点
    renderDot = (i) => {
        return <div className={s.outerDiv}>{i === 0 && <div className={s.innerDiv} />}</div>;
    };

    render() {
        const { formData, commonCallback, showApproval } = this.props;
        if (!formData || formData.length === 0) {
            return renderEmpty();
        }
        return (
            <Timeline className={s.listContainer}>
                {formData.map((item, i) => {
                    const { approvalFormData, approvalInstanceDto } = item;
                    return (
                        <Timeline.Item dot={this.renderDot(i)} key={i}>
                            <UpdateInfo
                                approvalFormData={approvalFormData}
                                approvalInstanceDto={approvalInstanceDto}
                                commonCallback={commonCallback}
                                showApproval={showApproval}
                            />
                            {i < formData.length - 1 && <div className={s.split} />}
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        );
    }
}

export default ApprovalList;
