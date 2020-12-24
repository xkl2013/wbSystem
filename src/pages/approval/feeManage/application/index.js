import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message } from 'antd';
import PageDataView from '@/submodule/components/DataView';
import { str2intArr, thousandSeparatorFixed } from '@/utils/utils';
import { getProjectList, getUserList as getAllUsers, getTalentList, getCompanyList } from '@/services/globalSearchApi';
import { FEE_APPLY_TYPE, DEAL_STATUS, WRITE_OFF_STATUS } from '@/utils/enum';
import { DATETIME_FORMAT } from '@/utils/constants';
import downRow from '@/assets/downRow.png';
import rightRow from '@/assets/rightRow.png';
import { getFeeType } from '@/services/dictionary';
import { getApplicationInfoDetail } from '@/services/globalDetailApi';
import { columnsFn, columnsChildFn } from './_selfColumn';
import styles from './index.less';

@connect(({ admin_approval, loading }) => {
    return {
        approvalApplicationLists: admin_approval.approvalApplicationLists,
        loading: loading.effects['admin_approval/getApprovalApplicationList'],
    };
})
class ApplicationList extends React.Component {
    constructor(props) {
        super(props);
        this.pageDataView = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        const pageDataView = this.pageDataView.current;
        if (pageDataView) {
            pageDataView.fetch();
        }
    };

    // 筛选条件处理
    fetchFn = async (beforeFetch) => {
        const data = beforeFetch();
        if (data.applicationUser) {
            if (data.applicationUser.value !== null) {
                data.applicationUserId = data.applicationUser.value;
                data.applicationUserName = data.applicationUser.label;
            } else {
                data.applicationUserName = data.applicationUser.label;
            }
            delete data.applicationUser;
        }
        if (data.applicationApplyDeptId) {
            data.applicationApplyDeptId = data.applicationApplyDeptId.value;
        }
        if (data.applicationProject) {
            if (data.applicationProject.value !== null) {
                data.applicationProjectId = data.applicationProject.value;
                data.applicationProjectName = data.applicationProject.label;
            } else {
                data.applicationProjectName = data.applicationProject.label;
            }
            delete data.applicationProject;
        }
        if (data.applicationActorBloger) {
            data.applicationActorBlogerId = data.applicationActorBloger.value;
            data.applicationActorBlogerName = data.applicationActorBloger.label;
        }
        delete data.applicationActorBloger;
        if (data.applicationFeeTakerMainName) {
            data.applicationFeeTakerMainName = data.applicationFeeTakerMainName.label;
        }
        if (data.applyDate && data.applyDate.length > 0) {
            data.applyStartTime = moment(data.applyDate[0]).format(DATETIME_FORMAT);
            data.applyEndTime = moment(data.applyDate[1]).format(DATETIME_FORMAT);
        }
        delete data.applyDate;
        // 费用类型
        if (data.feeType !== undefined && data.feeType.length > 0) {
            data.feeTypeList = data.feeType.map((item) => {
                return item.value;
            });
        }
        delete data.feeType;
        if (data.handleDate && data.handleDate.length > 0) {
            data.handleDateStart = moment(data.handleDate[0]).format(DATETIME_FORMAT);
            data.handleDateEnd = moment(data.handleDate[1]).format(DATETIME_FORMAT);
        }
        delete data.handleDate;
        if (data.approvalStatus !== undefined && data.approvalStatus.length > 0) {
            data.approvalStatus = str2intArr(data.approvalStatus);
        }
        if (data.handleStatus !== undefined && data.handleStatus.length > 0) {
            data.handleStatus = str2intArr(data.handleStatus);
        }
        if (data.applicationChargeAgainstSatus !== undefined && data.applicationChargeAgainstSatus.length > 0) {
            data.applicationChargeAgainstSatus = str2intArr(data.applicationChargeAgainstSatus);
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'admin_approval/getApprovalApplicationList',
            payload: data,
        });
    };

    // 跳转详情页
    gotoDetail = (val) => {
        const { history } = this.props;
        history.push({
            pathname: './myjob/detail',
            query: {
                id: val,
            },
        });
    };

    // tip 展示
    renderTipsFn = (approvalApplicationLists) => {
        if (Object.keys(approvalApplicationLists).length === 0) {
            return false;
        }
        return (
            <div className={styles.tips}>
                合计:
                {' '}
                <span className="weightFont">申请单数量</span>
                =
                {approvalApplicationLists.page.total}
                {' '}
                <span className="weightFont">申请总金额</span>
                =
                {(approvalApplicationLists.totalFee
                    && `¥ ${thousandSeparatorFixed(approvalApplicationLists.totalFee)}`)
                    || 0}
                {' '}
            </div>
        );
    };

    // 自定义展开icon
    customExpandIcon = (props) => {
        let text;
        if (props.expanded) {
            text = <img width="14px" height="8px" src={downRow} alt="" />;
        } else {
            text = <img width="8px" height="14px" src={rightRow} alt="" />;
        }
        return (
            <button
                type="button"
                onClick={async (e) => {
                    let obj = {};
                    if (!props.expanded) {
                        e.persist();
                        const res = await getApplicationInfoDetail(props.record.applicationId);
                        let result = [];
                        if (res.code === '200') {
                            result = res.data;
                        } else {
                            message.error(res.message);
                        }
                        obj = Object.assign(props.record, { applicationProjectVoList: result });
                    } else {
                        obj = props.record;
                    }
                    return props.onExpand(obj, e);
                }}
                style={{
                    cursor: 'pointer',
                    outline: 'none',
                    margin: 0,
                    padding: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            >
                {text}
            </button>
        );
    };

    render() {
        const {
            approvalApplicationLists = {
                list: [],
                page: {
                    pageSize: 0,
                    pageNum: 0,
                    total: 0,
                },
                totalFee: 0,
            },
            loading,
        } = this.props;
        const columns = columnsFn(this);
        return (
            <PageDataView
                ref={this.pageDataView}
                rowKey="applicationId"
                loading={loading}
                searchCols={[
                    [
                        {
                            key: 'applicationUser',
                            placeholder: '请输入申请人姓名',
                            className: styles.searchCol,
                            componentAttr: {
                                request: (val) => {
                                    return getAllUsers({
                                        userRealName: val,
                                        pageSize: 100,
                                        pageNum: 1,
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'userId', label: 'userRealName' },
                            },
                            type: 'associationSearchFilter',
                        },
                        {
                            key: 'applicationApplyDeptId',
                            placeholder: '请输入申请人所属部门',
                            className: styles.searchCol,
                            type: 'orgtree',
                            initValue: undefined,
                        },
                        {
                            key: 'applicationProject',
                            placeholder: '请输入项目名称',
                            className: styles.searchCol,
                            componentAttr: {
                                request: (val) => {
                                    return getProjectList({ projectName: val });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'projectId', label: 'projectName' },
                            },
                            type: 'associationSearchFilter',
                        },
                    ],
                    [
                        {
                            key: 'applicationActorBloger',
                            placeholder: '请输入艺人名称',
                            className: styles.searchCol,
                            componentAttr: {
                                request: (val) => {
                                    return getTalentList({
                                        talentName: val,
                                        pageSize: 50,
                                        pageNum: 1,
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: {
                                    value: 'talentId',
                                    label: 'talentName',
                                },
                            },
                            type: 'associationSearchFilter',
                        },
                        {
                            key: 'applicationChequesName',
                            placeholder: '请输入收款对象名称',
                            className: styles.searchCol,
                        },
                        {
                            key: 'applicationCode',
                            placeholder: '请输入申请单号',
                            className: styles.searchCol,
                        },
                    ],
                    [
                        {
                            key: 'applicationFeeTakerMainName',
                            placeholder: '请输入费用承担主体',
                            className: styles.searchCol,
                            type: 'associationSearchFilter',
                            componentAttr: {
                                allowClear: true,
                                request: (val) => {
                                    return getCompanyList({
                                        pageNum: 1,
                                        pageSize: 50,
                                        companyName: val,
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'companyId', label: 'companyName' },
                            },
                        },
                        {
                            key: 'feeType',
                            checkOption: {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择费用类型',
                                    },
                                ],
                            },
                            placeholder: '请选择费用类型',
                            className: styles.searchCol,
                            type: 'associationSearch',
                            componentAttr: {
                                request: (val) => {
                                    return getFeeType({ value: val });
                                },
                                fieldNames: { value: 'index', label: 'value' },
                                mode: 'multiple',
                                allowClear: true,
                                dropdownStatus: true,
                            },
                        },
                        {},
                    ],
                    [
                        {
                            key: 'applyDate',
                            label: '申请日期',
                            type: 'daterange',
                            placeholder: ['申请开始日期', '申请结束日期'],
                            className: styles.dateRangeCls,
                        },
                    ],
                    [
                        {
                            key: 'handleDate',
                            label: '处理时间',
                            type: 'daterangetime',
                            placeholder: ['处理开始时间', '处理结束时间'],
                            componentAttr: {
                                showTime: true,
                            },
                            className: styles.dateTimeRangeCls,
                        },
                    ],
                    [
                        {
                            key: 'applicationApproveStatus',
                            type: 'checkbox',
                            label: '审批状态',
                            options: FEE_APPLY_TYPE,
                        },
                    ],
                    [
                        {
                            key: 'handleStatus',
                            type: 'checkbox',
                            label: '处理状态',
                            options: DEAL_STATUS,
                        },
                    ],
                    [
                        {
                            key: 'applicationChargeAgainstSatus',
                            type: 'checkbox',
                            label: '冲销状态',
                            options: WRITE_OFF_STATUS,
                        },
                    ],
                ]}
                fetch={this.fetchFn}
                cols={columns}
                tips={this.renderTipsFn(approvalApplicationLists)}
                pageData={approvalApplicationLists}
                expandIcon={this.customExpandIcon}
                expandedRowRender={(e) => {
                    return columnsChildFn(e);
                }}
            />
        );
    }
}
export default ApplicationList;
