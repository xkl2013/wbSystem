import React, { PureComponent } from 'react';
import { Empty } from 'antd';
import styles from './index.less';
import { getInstance } from '@/services/comment';
import ApprovalTable from './approvalTable';
import NotifyNode from '@/components/notifyNode';
import ApprovalPerson from './approvalPerson';

/**
 *
 *  审批流组件
 *  props：
 *  data // 数据源对象，包含 approvalFlowNodeDtos = [], approvalTaskLogDtos = []
 *  title1 // 审批预览title
 *  title2  // 审批记录title
 *
 * */

export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            newData: props.data || {}, // 审批流详情
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({ newData: nextProps.data });
        }
    }

    getInstance = async (id) => {
        // 获取审批流
        const response = await getInstance(id);
        if (response && response.success) {
            this.setState({ newData: response.data });
        }
    };

    render() {
        const { newData } = this.state;
        const { approvalFlowNodeDtos, approvalTaskLogDtos, approvalFlowDto, approvalNoticers } = newData;
        const { title1 = '审批人', title2 = '审批记录', title3 = '知会人' } = this.props;
        return (
            <div className={styles.container}>
                <div className={styles.title}>{title1}</div>
                {approvalFlowNodeDtos && approvalFlowNodeDtos.length > 0 ? (
                    <ApprovalPerson data={newData} getInstance={this.getInstance} />
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
                <div className={styles.title}>{title2}</div>
                <ApprovalTable dataSource={approvalTaskLogDtos || []} approvalFlowDto={approvalFlowDto || {}} />
                {approvalNoticers && approvalNoticers.length > 0 && (
                    <div>
                        <div className={styles.title}>{title3}</div>
                        <div>
                            <NotifyNode
                                hideBtn={true}
                                title=""
                                data={approvalNoticers.map((item) => {
                                    return {
                                        ...item,
                                        executorName: item.userName,
                                    };
                                })}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
