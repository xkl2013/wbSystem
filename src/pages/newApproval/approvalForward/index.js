import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/components/DataView';
import BIButton from '@/ant_components/BIButton';
import { getUserList as getAllUsers } from '@/services/globalSearchApi';
import columnsFn from './_selfColumn';
import styles from './index.less';

const dataSource = {
    list: [
        {
            id: 1,
            applyNum: 'FYBX-20191228000975',
            applyName: '丹参滴丸',
            approvalType: '费用报销',
            approvalTip: [
                {
                    trueFeeName: '的呢我',
                    payName: '非官方个',
                    feePayPerson: '绝不是简单方便时不仅是',
                    totalMoney: 333333333,
                    reason: '福IE回复的房贷户sad回复数dsad所得税法保护技术的分别是对方不是的房价的第三代',
                },
            ],
            applyDate: '2019-12-12 18:00:00',
        },
        {
            id: 2,
            applyNum: 'FYBX-20191228000975',
            applyName: '双方都',
            approvalType: '合同条款审核（商单）',
            approvalTip: [
                {
                    trueFeeName: '我二哥',
                    payName: '他如果',
                    feePayPerson: '绝不是简单方便时不仅是',
                    totalMoney: 333333333,
                    reason: '而挂号费二房东',
                },
            ],
            applyDate: '2019-12-12 18:00:00',
        },
    ],
    page: {
        pageSize: 20,
        pageNum: 1,
        total: 2,
    },
};

@connect(({ admin_newApproval }) => {
    return {
        approvalsListPage: admin_newApproval.approvalsListPage,
        // loading: loading.effects['admin_approval/getApprovalsList'],
    };
})
class ApprovalForward extends Component {
    constructor(props) {
        super(props);
        this.pageDataView = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                component: this.rightBtns(),
            },
        });
    }

    rightBtns = () => {
        // 右侧按钮
        return (
            <BIButton type="primary" ghost className={styles.headerBtn} onClick={this.startApproval}>
                发起审批
            </BIButton>
        );
    };

    startApproval = () => {
        this.props.history.push({ pathname: '/foreEnd/approval/initiate' });
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
        const { history } = this.props;
        history.push({
            pathname: './myjob/detail',
            query: {
                id: val,
            },
        });
    };

    render() {
        const { loading } = this.props;
        const columns = columnsFn(this);
        return (
            <PageDataView
                ref={this.pageDataView}
                rowKey="id"
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
                            key: 'applyNum',
                            placeholder: '请输入申请编号',
                            className: styles.searchCls,
                            type: 'associationSearchFilter',
                        },
                        {
                            key: 'applyDate',
                            label: '申请时间',
                            type: 'daterange',
                            placeholder: ['申请开始日期', '申请结束日期'],
                            className: styles.dateRangeCls,
                        },
                    ],
                    // [
                    //     {
                    //         key: 'advancedSearch',
                    //         type: 'advancedSearch',
                    //         className: styles.dateRangeCls,
                    //     },
                    // ],
                    [
                        {
                            key: 'applyDate',
                            label: '申请时间',
                            type: 'daterange',
                            placeholder: ['申请开始日期', '申请结束日期'],
                            className: styles.dateRangeCls,
                        },
                    ],
                ]}
                advancedStatus={true}
                fetch={this.fetchFn}
                cols={columns}
                pageData={dataSource}
            />
        );
    }
}

export default ApprovalForward;
