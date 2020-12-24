import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/components/DataView';
import { APPROVAL_APPROVAL_STATUS, DEAL_STATUS } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import { getUserList as getAllUsers, getFlowsListOutFee } from '@/services/globalSearchApi';
import styles from './index.less';
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
        this.pageDataView = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
        this.getApprovalMyTask();
        this.getFlowGroup();
        this.getFlowTypes();
    }

    getApprovalMyTask = () => {
        // 获取审批数量
        const { dispatch } = this.props;
        dispatch({
            type: 'admin_news/getApprovalMyTask',
        });
    };

    getFlowGroup = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'admin_approval/getFlowGroups',
            payload: {},
        });
    };

    getFlowTypes = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'admin_approval/getFlowTypes',
            payload: { participateStatus: 2 },
        });
    };

    fetch = () => {
        const pageDataView = this.pageDataView.current;
        if (pageDataView) {
            pageDataView.fetch();
        }
    };

    fetchFn = (beforeFetch) => {
        let data = beforeFetch();
        data = { ...this.formateParams(data), participateStatus: 2 };
        this.getData(data);
    };

    formateParams = (params = {}) => {
        const returnObj = {};
        Object.keys(params).forEach((item) => {
            const obj = params[item];
            switch (item) {
                case 'applyDate':
                    returnObj.applyDateStart = obj ? obj[0].format('YYYY-MM-DD HH:mm:ss') : undefined;
                    returnObj.applyDateEnd = obj ? obj[1].format('YYYY-MM-DD HH:mm:ss') : undefined;
                    break;
                case 'approvalDateTime':
                    returnObj.approvalDateStart = obj ? obj[0].format('YYYY-MM-DD HH:mm:ss') : undefined;
                    returnObj.approvalDateEnd = obj ? obj[1].format('YYYY-MM-DD HH:mm:ss') : undefined;
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
                case 'applyName':
                    returnObj.applyName = typeof obj === 'object' ? obj.label : obj;
                    break;
                case 'approvorName':
                    returnObj.approvorName = typeof obj === 'object' ? obj.label : obj;
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
        const { dispatch } = this.props;
        dispatch({
            type: 'admin_approval/getApprovalsList',
            payload: data,
        });
    };

    checkData = (val) => {
        // openUrl('/admin/orgStructure/company/detail', {id: val});
        const { history } = this.props;
        history.push({
            pathname: './myjob/detail',
            query: {
                id: val,
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
                    name: getOptionName(APPROVAL_APPROVAL_STATUS, item.id),
                };
            });
        }
        return arr;
    };

    render() {
        const { flowGroups, loading, approvalsListPage } = this.props;
        const columns = columnsFn(this);
        return (
            <PageDataView
                ref={this.pageDataView}
                rowKey="instanceId"
                loading={loading}
                searchCols={[
                    [
                        {
                            key: 'applyName',
                            placeholder: '请输入申请人名称',
                            className: styles.searchCls,
                            initValue: undefined,
                            type: 'associationSearchFilter',
                            componentAttr: {
                                request: (val) => {
                                    return getAllUsers({
                                        pageNum: 1,
                                        pageSize: 100,
                                        userChsName: val,
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'userId', label: 'userChsName' },
                            },
                        },
                        {
                            key: 'approvorName',
                            placeholder: '请输入审批事项',
                            className: styles.searchCls,
                            type: 'associationSearchFilter',
                            componentAttr: {
                                request: (val) => {
                                    return getFlowsListOutFee({
                                        pageNum: 1,
                                        pageSize: 100,
                                        name: val,
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'id', label: 'name' },
                            },
                        },
                        {},
                    ],
                    [
                        {
                            key: 'approvalDateTime',
                            label: '审批时间',
                            type: 'daterange',
                            placeholder: ['审批开始日期', '审批结束日期'],
                            className: styles.dateRangeCls,
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
                            options: flowGroups,
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
                    [
                        {
                            key: 'dealStatus',
                            type: 'checkbox',
                            label: '处理状态',
                            options: DEAL_STATUS,
                            defaultValue: ['1'],
                        },
                    ],
                ]}
                fetch={this.fetchFn}
                cols={columns}
                pageData={approvalsListPage}
            />
        );
    }
}

export default Thread1;
