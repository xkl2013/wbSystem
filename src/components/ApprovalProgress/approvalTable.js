import React, { PureComponent } from 'react';
import styles from '@/components/ApprovalProgress/index.less';
import BITable from '@/ant_components/BITable';
import Information from '@/components/informationModel';

const columns = (floeData) => {
    return [
        {
            title: '提交人/审批人',
            dataIndex: 'executorName',
            align: 'center',
            key: 'executorName',
            render: (text, item, index) => {
                if (index === 0) {
                    const flowKeys = floeData.flowKey || '';
                    const data = [
                        {
                            ...item,
                            id: item.executorId,
                            name: item.executorName,
                            flowKeys,
                            flowName: floeData.name,
                            path: '/foreEnd/executorApproval/executor/detail',
                        },
                    ];
                    return <Information data={data} informationModel />;
                }
                return text;
            },
        },
        {
            title: '操作状态',
            dataIndex: 'executorResult',
            align: 'center',
            key: 'executorResult',
            render: (text, record, index) => {
                if (index === 0) {
                    return '已提交';
                }
                return text;
            },
        },
        {
            title: '操作时间',
            dataIndex: 'createAt',
            align: 'center',
            key: 'createAt',
        },
        {
            title: '审批意见',
            dataIndex: 'opinion',
            align: 'center',
            width: '40%',
        },
    ];
};
export default class ApprovalTable extends PureComponent {
    render() {
        const { dataSource, approvalFlowDto, style } = this.props;
        return (
            <BITable
                className={styles.table}
                style={style}
                dataSource={dataSource}
                columns={columns(approvalFlowDto)}
                bordered
                rowKey={(item) => {
                    return item.id;
                }}
                pagination={false}
            />
        );
    }
}
