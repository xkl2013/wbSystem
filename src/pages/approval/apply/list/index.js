import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import PageDataView from '@/components/DataView';
import { APPROVAL_APPLY_STATUS } from '@/utils/enum';
import { getOptionName, msgF } from '@/utils/utils';

import BIModal from '@/ant_components/BIModal';
import { getFlowsList } from '@/services/globalSearchApi';
import styles from './index.less';
import { cancelApproval, getApprlvalDetail } from '../../services';
import columnsFn from './_selfColumn';

@connect(({ admin_approval, loading }) => {
    return {
        approvalsListPage: admin_approval.approvalsListPage,
        flowGroups: admin_approval.flowGroups,
        flowTypes: admin_approval.flowTypes,
        admin_approval,
        loading: loading.effects['admin_approval/getApprovalsList'],
    };
})
class Thread1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // a: 1,
        };
    }

    componentDidMount() {
        this.getFlowGroup();
        this.getFlowTypes();
        this.fetch();
        // this.changeFlowTypes();
    }

    getFlowGroup = () => {
        this.props.dispatch({
            type: 'admin_approval/getFlowGroups',
            payload: {},
        });
    };

    getFlowTypes = () => {
        this.props.dispatch({
            type: 'admin_approval/getFlowTypes',
            payload: { participateStatus: 1 },
        });
    };

    fetch = () => {
        // const { pageDataView } = this.refs;
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    fetchData = (beforeFetch) => {
        let data = beforeFetch();
        data = { ...this.formateParams(data), participateStatus: 1 };
        this.getData(data);
    };

    formateParams = (params = {}) => {
        const returnObj = {};
        Object.keys(params).forEach((item) => {
            const obj = params[item];
            switch (item) {
                case 'approvorName':
                    returnObj.approvorName = typeof obj === 'object' ? obj.label : obj;
                    break;
                case 'applyDate':
                    returnObj.applyDateStart = obj ? obj[0].format('YYYY-MM-DD HH:mm:ss') : undefined;
                    returnObj.applyDateEnd = obj ? obj[1].format('YYYY-MM-DD HH:mm:ss') : undefined;
                    break;
                case 'groupIds':
                    returnObj[item] = obj
                        ? obj
                            .map((ls) => {
                                return Number(ls);
                            })
                            .join(',')
                        : undefined;
                    break;
                case 'status':
                    returnObj[item] = obj
                        ? obj
                            .map((ls) => {
                                return Number(ls);
                            })
                            .join(',')
                        : undefined;
                    break;
                default:
                    returnObj[item] = obj;
                    break;
            }
        });
        return returnObj;
    };

    getData = (data) => {
        this.props.dispatch({
            type: 'admin_approval/getApprovalsList',
            payload: data,
        });
    };

    checkData = (val) => {
        // 查看
        // openUrl('/admin/orgStructure/company/detail', {id: val});
        const { instanceId, statusId } = val;
        this.props.history.push({
            pathname: './myjob/detail',
            query: {
                id: instanceId,
                statusId,
            },
        });
    };

    changeFlowTypes = () => {
        // 更改审批状态name
        const { flowTypes = [] } = this.props;
        let arr = [];
        if (flowTypes && flowTypes.length > 0) {
            arr = flowTypes.map((item) => {
                return {
                    ...item,
                    name: getOptionName(APPROVAL_APPLY_STATUS, item.id),
                };
            });
        }
        return arr;
    };

    handleCancel = (val) => {
        // 撤销
        BIModal.confirm({
            title: '撤销将中断审批申请',
            okText: '确定',
            cancelText: '取消',
            autoFocusButton: null,
            onOk: () => {
                this.cancelProject(val.instanceId);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    cancelProject = async (id) => {
        // 撤销项目
        const result = await cancelApproval(id, { opinion: '' });
        if (result && result.success) {
            message.success(msgF(result.message));
            this.fetch();
        }
    };

    handleReset = async (val) => {
        // 重新提交
        const result = await getApprlvalDetail({ id: val.instanceId });
        if (result && result.success) {
            const {
                approvalForm: { approvalFormFields = [] },
            } = result.data;
            const realId = approvalFormFields && approvalFormFields[0] && approvalFormFields[0].value;
            this.props.history.push({
                pathname: '/foreEnd/business/project/establish/edit',
                query: {
                    id: realId,
                    type: 'add',
                },
            });
        }
    };

    render() {
        const data = this.props.approvalsListPage;
        const columns = columnsFn(this);
        return (
            <PageDataView
                ref={(pageDataView) => {
                    this.pageDataView = pageDataView;
                }}
                rowKey="instanceId"
                loading={this.props.loading}
                searchCols={[
                    [
                        {
                            key: 'approvorName',
                            placeholder: '请输入审批事项',
                            className: styles.searchCls,
                            type: 'associationSearchFilter',
                            componentAttr: {
                                request: (val) => {
                                    return getFlowsList({
                                        pageNum: 1,
                                        pageSize: 100,
                                        name: val,
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'id', label: 'name' },
                            },
                        },
                    ],
                    [
                        {
                            key: 'applyDate',
                            label: '申请时间',
                            type: 'daterange',
                            placeholder: ['申请开始日期', '申请结束日期'],
                            className: styles.dateRangeCls,
                        },
                    ],
                    [
                        {
                            key: 'groupIds',
                            type: 'checkbox',
                            label: '审批分组',
                            options: this.props.flowGroups,
                        },
                    ],
                    [
                        {
                            key: 'status',
                            type: 'checkbox',
                            label: '审批状态',
                            options: this.changeFlowTypes(),
                        },
                    ],
                ]}
                fetch={this.fetchData}
                cols={columns}
                pageData={data}
            />
        );
    }
}

export default Thread1;
