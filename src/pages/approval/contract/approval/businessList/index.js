import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import PageDataView from '@/components/DataView';
import { getUserList as getInnerUserList, getProjectList, getTalentList } from '@/services/globalSearchApi';
import { APPROVAL_STATUS, FINALIZED_STATUS, DEAL_STATUS, CONTRACT_SIGN_TYPE } from '@/utils/enum'; // 枚举
import { DATETIME_FORMAT } from '@/utils/constants';
import { str2intArr } from '@/utils/utils';
import columnsFn from './_selfColumn';
import styles from './index.less';

@connect(({ admin_approval, loading }) => {
    return {
        commerceApprovalBusinessLists: admin_approval.commerceApprovalBusinessLists,
        loading: loading.effects['admin_approval/getApprovalCommerceBusinessLists'],
    };
})
// 合同审核申请列表 - 商单审核
class ApprovalBusines extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // pageDataLists: [],
            pageStatus: true, // true 审核；false 发起
        };
    }

    componentWillMount() {
        this.pageStatusFn();
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        // const { pageDataView } = this.refs;
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    fetchData = (beforeFetch) => {
        const data = beforeFetch();
        // 项目名称
        if (data.clauseProjectName) {
            if (data.clauseProjectName.value !== null) {
                data.clauseProjectId = data.clauseProjectName.value;
            }
            data.clauseProjectName = data.clauseProjectName.label;
        }
        // 艺人或博主
        if (data.clauseStarName) {
            // if (data.clauseStarName.value !== null) {
            //     data.clauseStarId = data.clauseStarName.value;
            // }
            data.clauseStarName = data.clauseStarName.label;
        }
        // 申请人姓名
        if (data.clauseApplyUserName) {
            if (data.clauseApplyUserName.value !== null) {
                data.clauseApplyUserId = data.clauseApplyUserName.value;
            }
            data.clauseApplyUserName = data.clauseApplyUserName.label;
        }
        // 申请人所属部门
        if (data.clauseApplyDeptName) {
            if (data.clauseApplyDeptName.value !== null) {
                data.clauseApplyDeptId = data.clauseApplyDeptName.value;
            }
            data.clauseApplyDeptName = data.clauseApplyDeptName.label;
        }
        // 申请日期
        if (data.clauseApplyTime && data.clauseApplyTime.length > 0) {
            data.clauseApplyTimeStart = moment(data.clauseApplyTime[0]).format(DATETIME_FORMAT);
            data.clauseApplyTimeEnd = moment(data.clauseApplyTime[1]).format(DATETIME_FORMAT);
        }
        delete data.clauseApplyTime;
        // 定稿日期
        if (data.clauseFinalizedTime && data.clauseFinalizedTime.length > 0) {
            data.clauseFinalizedTimeStart = moment(data.clauseFinalizedTime[0]).format(DATETIME_FORMAT);
            data.clauseFinalizedTimeEnd = moment(data.clauseFinalizedTime[1]).format(DATETIME_FORMAT);
        }
        delete data.clauseFinalizedTime;
        // 签约方式
        if (
            data.clauseSigningWay !== undefined
            && Array.isArray(data.clauseSigningWay)
            && data.clauseSigningWay.length > 0
        ) {
            data.clauseSigningWay = str2intArr(data.clauseSigningWay);
        }
        // 处理状态
        if (data.handleStatus !== undefined && Array.isArray(data.handleStatus) && data.handleStatus.length > 0) {
            const arr = str2intArr(data.handleStatus);
            if (arr.indexOf(2) > -1) {
                arr.push(-1);
            }
            data.handleStatus = arr;
        }
        // 审核状态
        if (
            data.clauseApprovalStatus !== undefined
            && Array.isArray(data.clauseApprovalStatus)
            && data.clauseApprovalStatus.length > 0
        ) {
            data.clauseApprovalStatus = str2intArr(data.clauseApprovalStatus);
        }
        // 定稿状态
        if (
            data.clauseFinalizedStatus !== undefined
            && Array.isArray(data.clauseFinalizedStatus)
            && data.clauseFinalizedStatus.length > 0
        ) {
            data.clauseFinalizedStatus = str2intArr(data.clauseFinalizedStatus);
        }

        this.setState({
            // params: { ...data },
        });
        this.props.dispatch({
            type: 'admin_approval/getApprovalCommerceBusinessLists',
            payload: Object.assign({ clauseContractType: 1 }, data),
        });
    };

    checkData = (val) => {
        // 详情页跳转
        this.props.history.push({
            pathname: './business/detail',
            query: {
                id: val,
            },
        });
    };

    // 我审批和我发起 参数区分
    pageStatusFn() {
        const localUrl = window.location.pathname;
        this.setState({
            pageStatus: localUrl === '/foreEnd/approval/approval/business',
        });
    }

    render() {
        const { commerceApprovalBusinessLists } = this.props;
        const { pageStatus } = this.state;
        return (
            <>
                <PageDataView
                    // ref="pageDataView"
                    ref={(pageDataView) => {
                        this.pageDataView = pageDataView;
                    }}
                    rowKey="clauseApprovalId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'clauseProjectName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入项目名称',
                                className: styles.searchCol,
                                componentAttr: {
                                    request: (val) => {
                                        return getProjectList({
                                            pageNum: 1,
                                            pageSize: 100,
                                            projectName: val,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'projectId', label: 'projectName' },
                                },
                            },
                            {
                                key: 'clauseStarName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入艺人或博主',
                                className: styles.searchCol,
                                componentAttr: {
                                    request: (val) => {
                                        return getTalentList({
                                            pageNum: 1,
                                            pageSize: 100,
                                            talentName: val,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: {
                                        value: 'talentId',
                                        label: 'talentName',
                                    },
                                },
                            },
                            {
                                key: 'clauseApplyUserName',
                                placeholder: '请输入申请人姓名',
                                type: 'associationSearchFilter',
                                className: styles.searchCol,
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择申请人',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    request: (val) => {
                                        return getInnerUserList({
                                            userRealName: val,
                                            pageSize: 50,
                                            pageNum: 1,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'userId', label: 'userRealName' },
                                    allowClear: true,
                                    // onChange: changeUser.bind(this, obj),
                                    disabled: true,
                                },
                                getFormat: (value, form) => {
                                    // form.applicationUserId = value.value;
                                    // form.applicationUserName = value.label;
                                    Object.assign({}, form, {
                                        applicationUserId: value.value,
                                        applicationUserName: value.label,
                                    });
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.applicationUserName,
                                        value: form.applicationUserId,
                                    };
                                },
                            },
                        ],
                        [
                            {
                                key: 'clauseApplyDeptName',
                                className: styles.searchCol,
                                componentAttr: {
                                    disabled: true,
                                },
                                placeholder: '请输入申请人所属部门',
                                type: 'orgtree',
                                getFormat: (value, form) => {
                                    // form.applicationApplyDeptId = value.value;
                                    // form.applicationApplyDeptName = value.label;
                                    Object.assign({}, form, {
                                        applicationApplyDeptId: value.value,
                                        applicationApplyDeptName: value.label,
                                    });
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.applicationApplyDeptName,
                                        value: form.applicationApplyDeptId,
                                    };
                                },
                            },
                        ],
                        [
                            {
                                key: 'clauseApplyTime',
                                label: '申请日期',
                                type: 'daterange',
                                placeholder: ['开始日期', '结束日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'clauseFinalizedTime',
                                label: '定稿时间',
                                type: 'daterange',
                                placeholder: ['开始日期', '结束日期'],
                                className: styles.dateRangeCls,
                            },
                            {},
                        ],
                        [
                            {
                                key: 'clauseSigningWay',
                                type: 'checkbox',
                                label: '签约方式',
                                options: CONTRACT_SIGN_TYPE,
                            },
                        ],
                        [
                            pageStatus
                                ? {
                                    key: 'handleStatus',
                                    type: 'checkbox',
                                    label: '处理状态',
                                    options: DEAL_STATUS,
                                }
                                : {
                                    key: 'clauseApprovalStatus',
                                    type: 'checkbox',
                                    label: '审核状态',
                                    options: FINALIZED_STATUS,
                                },
                        ],
                        [
                            {
                                key: 'clauseFinalizedStatus',
                                type: 'checkbox',
                                label: '定稿状态',
                                options: APPROVAL_STATUS,
                            },
                        ],
                    ]}
                    fetch={this.fetchData}
                    cols={columnsFn(this)}
                    pageData={{ ...commerceApprovalBusinessLists }}
                    pagination={{
                        showSizeChanger: true,
                        pageSize: 30,
                        pageSizeOptions: ['30', '50', '100', '200', '500', '1000'],
                    }}
                />
            </>
        );
    }
}
export default ApprovalBusines;
