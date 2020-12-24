import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/components/DataView';
import { THREAD_TYPE } from '@/utils/enum';
import { getUserList as getAllUsers, getFlowsList } from '@/services/globalSearchApi';
import columnsFn from './_selfColumn';
import styles from './index.less';

@connect(({ admin_approval, loading }) => {
    return {
        approvalsListPage: admin_approval.approvalsListPage,
        flowGroups: admin_approval.flowGroups,
        admin_approval,
        loading: loading.effects['admin_approval/getApprovalsList'],
    };
})
class Thread1 extends Component {
    pageDataView = null;

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
        this.getFlowGroup();
    }

    getFlowGroup = () => {
        this.props.dispatch({
            type: 'admin_approval/getFlowGroups',
            payload: {},
        });
    };

    fetch = () => {
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    fetchData = (beforeFetch) => {
        let data = beforeFetch();
        data = { ...this.formateParams(data), participateStatus: 3 };
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
                    const newArr = Array.isArray(obj) ? obj : [];
                    const startTime = newArr[0];
                    const endTime = newArr[1];
                    returnObj.applyDateStart = startTime ? startTime.format('YYYY-MM-DD HH:mm:ss') : undefined;
                    returnObj.applyDateEnd = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : undefined;
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
        // openUrl('/admin/orgStructure/company/detail', {id: val});
        this.props.history.push({
            pathname: './notify/detail',
            query: {
                id: val,
            },
        });
    };

    render() {
        const data = this.props.approvalsListPage;
        const columns = columnsFn(this);
        return (
            <PageDataView
                ref={(dom) => {
                    this.pageDataView = dom;
                }}
                rowKey="instanceId"
                loading={this.props.loading}
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
                                // allowClear: true
                            },
                        },
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
                        {},
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
                            renderFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push({
                                        id: tax,
                                        name: THREAD_TYPE.find((item) => {
                                            return String(item.id) === String(tax);
                                        }).name,
                                    });
                                });
                                return result;
                            },
                            setFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push(tax.id);
                                });
                                return result;
                            },
                            getFormat: (value) => {
                                return value.join(',');
                            },
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
