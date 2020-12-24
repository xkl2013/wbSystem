import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { STAFF_STATUS } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import FlexDetail from '@/components/flex-detail';
import BITable from '@/ant_components/BITable';
import SelfPagination from '@/components/SelfPagination';
import { getCommerceId } from '@/services/comment';

/**
 * 发起人详情及审批历史记录
 *  flowKeys: {
 *      PROJECTING("立项审批","projecting"),
        REIMBURSE("费用报销","reimburse"),
        CONTRACT("合同审批","contract"),
        APPLICATION("费用申请","application"),
        COMMONCONTRACTCOMMERCE("合同条款审核非商单类","common_ContractCommerce"),
        CONTRACTCOMMERCE("合同条款审核商单类","ContractCommerce"),
        TRAVEL("出差申请","travel"),
        OUTWORK("外勤","outwork"),
        PROPAGATE("宣传费用申请","propagate"),
 * }
 *
 */

function getFlowType(flowKey, name) {
    switch (flowKey) {
        case 'projecting':
            return '立项审批';
        case 'reimburse':
            return '费用报销';
        case 'contract':
            return '合同审批';
        case 'application':
            return '费用申请';
        case 'common_ContractCommerce':
            return '合同条款审核非商单类';
        case 'ContractCommerce':
            return '合同条款审核商单类';
        case 'travel':
            return '出差申请';
        case 'outwork':
            return '外勤';
        case 'propagate':
            return '宣传费用申请';
        default:
            return name;
    }
}

const columns = [
    {
        title: '申请日期',
        dataIndex: 'createAt',
        align: 'center',
        key: 'createAt',
    },
    {
        title: '审批状态',
        dataIndex: 'statusName',
        align: 'center',
        key: 'statusName',
    },
    {
        title: '最近审批节点',
        dataIndex: 'nodeName',
        align: 'center',
        key: 'nodeName',
        render: (d, record) => {
            const name = (record.approvalTaskLogDtos || [])
                .map((item) => {
                    return item.nodeName;
                })
                .join('');
            return name;
        },
    },
    {
        title: '审批意见',
        dataIndex: 'opinion',
        align: 'center',
        render: (d, record) => {
            const opinions = (record.approvalTaskLogDtos || [])
                .map((item) => {
                    return item.opinion;
                })
                .join('');
            return opinions;
        },
    },
    {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: (text, record) => {
            return (
                <span
                    className={styles.btnCls}
                    onClick={async () => {
                        if (record.approvalFlowDto && record.approvalFlowDto.flowKey === 'ContractCommerce') {
                            const res = await getCommerceId(record.id);
                            let id = null;
                            if (res && res.data) {
                                id = res.data.clauseCurrentVersionId;
                            }
                            window.open(`/foreEnd/approval/approval/business/detail?id=${id}`, '_blank');
                        } else if (
                            record.approvalFlowDto
                            && record.approvalFlowDto.flowKey === 'common_ContractCommerce'
                        ) {
                            const res = await getCommerceId(record.id);
                            let id = null;
                            if (res && res.data) {
                                id = res.data.clauseCurrentVersionId;
                            }
                            window.open(`/foreEnd/approval/approval/contract/detail?id=${id}`, '_blank');
                        } else {
                            window.open(`/foreEnd/approval/approval/myjob/detail?id=${record.id}`, '_blank');
                        }
                    }}
                >
                    查看
                </span>
            );
        },
    },
];

const labelWrap = [
    [
        {
            key: 'userChsName',
            label: '发起人姓名',
        },
        {
            key: 'employeeDepartmentName',
            label: '所属部门',
        },
    ],
    [
        {
            key: 'employeePosition',
            label: '岗位',
        },
        {
            key: 'employeeStatus',
            label: '员工状态',
            render: (item) => {
                return item.employeeStatus && getOptionName(STAFF_STATUS, item.employeeStatus);
            },
        },
    ],
];

@connect(({ admin_approval }) => {
    return {
        executorListPage: admin_approval.executorListPage,
    };
})
class ExecutorDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { informationInstance } = this.props;
        this.props.dispatch({
            type: 'admin_approval/getExecutorData',
            payload: {
                flowKeys: informationInstance.flowKeys,
                applicantUserId: informationInstance.id,
                pageNum: 1,
                pageSize: 10,
            },
        });
    }

    fetchPage = (page) => {
        const { informationInstance } = this.props;
        this.props.dispatch({
            type: 'admin_approval/getExecutorData',
            payload: {
                flowKeys: informationInstance.flowKeys,
                applicantUserId: informationInstance.id,
                pageNum: page,
                pageSize: 10,
            },
        });
    };

    renderPagination = () => {
        const { executorListPage } = this.props;
        const pagination = executorListPage.page;
        return pagination.total > 20 ? (
            <SelfPagination
                showTotal={(total) => {
                    return `共${total}条`;
                }}
                pageSize={10}
                total={pagination.total}
                current={pagination.pageNum}
                onChange={(nextPage) => {
                    this.fetchPage(nextPage);
                }}
            />
        ) : null;
    };

    render() {
        const { executorListPage, informationInstance } = this.props;
        const approvalType = getFlowType(informationInstance.flowKeys, informationInstance.flowName);
        const userName = executorListPage.userInfo.userChsName || '';
        return (
            <div>
                <FlexDetail LabelWrap={labelWrap} detail={executorListPage.userInfo || {}} title="基本信息" />
                <FlexDetail LabelWrap={[[]]} detail={{}} title={`${userName}-${approvalType}历史记录`}>
                    <BITable
                        rowKey="id"
                        dataSource={executorListPage.list}
                        bordered
                        pagination={false}
                        columns={columns}
                    />
                    {this.renderPagination()}
                </FlexDetail>
            </div>
        );
    }
}

export default ExecutorDetail;
