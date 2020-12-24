import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message } from 'antd';
import PageDataView from '@/submodule/components/DataView';
import { str2intArr, thousandSeparatorFixed } from '@/utils/utils';
import { getProjectList, getUserList as getAllUsers, getTalentList, getCompanyList } from '@/services/globalSearchApi';
import { FEE_APPLY_TYPE, DEAL_STATUS, REIMBURSE_SOURCE } from '@/utils/enum';
import { DATETIME_FORMAT } from '@/utils/constants';
import downRow from '@/assets/downRow.png';
import rightRow from '@/assets/rightRow.png';
import { getReimburseInfoDetail } from '@/services/globalDetailApi';
import { columnsFn, columnsChildFn } from './_selfColumn';
import styles from './index.less';

@connect(({ admin_approval, loading }) => {
    return {
        approvalReimburseLists: admin_approval.approvalReimburseLists,
        loading: loading.effects['admin_approval/getApprovalReimburseList'],
    };
})
class ReimburseList extends React.Component {
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
        if (data.reimburseUser) {
            if (data.reimburseUser.value !== null) {
                data.reimburseUserId = data.reimburseUser.value;
                data.reimburseUserName = data.reimburseUser.label;
            } else {
                data.reimburseUserName = data.reimburseUser.label;
            }
            delete data.reimburseUser;
        }
        if (data.deptId) {
            data.deptId = data.deptId.value;
        }
        if (data.project) {
            if (data.project.value !== null) {
                data.projectId = data.project.value;
                data.projectName = data.project.label;
            } else {
                data.projectName = data.project.label;
            }
            delete data.project;
        }
        if (data.applicationActorBloger) {
            data.applicationActorBlogerId = data.applicationActorBloger.value;
            data.applicationActorBlogerName = data.applicationActorBloger.label;
        }
        delete data.applicationActorBloger;
        if (data.reimburseFeeTakerMainName) {
            data.reimburseFeeTakerMainName = data.reimburseFeeTakerMainName.label;
        }
        if (data.applyDate && data.applyDate.length > 0) {
            data.applyDateStart = moment(data.applyDate[0]).format(DATETIME_FORMAT);
            data.applyDateEnd = moment(data.applyDate[1]).format(DATETIME_FORMAT);
        }
        delete data.applyDate;
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
        if (data.reimburseSource !== undefined && data.reimburseSource.length > 0) {
            data.reimburseSource = str2intArr(data.reimburseSource);
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'admin_approval/getApprovalReimburseList',
            payload: data,
        });
    };

    // 跳转详情页
    gotoDetail = (id) => {
        const { history } = this.props;
        history.push({
            pathname: './myjob/detail',
            query: {
                id,
            },
        });
    };

    // tip 展示
    renderTipsFn = (approvalReimburseLists) => {
        if (Object.keys(approvalReimburseLists).length === 0) {
            return false;
        }
        return (
            <div className={styles.tips}>
                合计:
                {' '}
                <span className="weightFont">报销单数量</span>
                =
                {approvalReimburseLists.page.total}
                {' '}
                <span className="weightFont">报销总金额</span>
                =
                {(approvalReimburseLists.totalFee && `¥ ${thousandSeparatorFixed(approvalReimburseLists.totalFee)}`)
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
        return [
            <button
                type="button"
                onClick={async (e) => {
                    let obj = {};
                    if (!props.expanded) {
                        e.persist();
                        const res = await getReimburseInfoDetail(props.record.reimburseId);
                        let result = [];
                        if (res.code === '200') {
                            result = res.data;
                        } else {
                            message.error(res.message);
                        }
                        obj = Object.assign(props.record, { reimburseProjects: result });
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
            </button>,
        ];
    };

    render() {
        const {
            approvalReimburseLists = {
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
                rowKey="reimburseId"
                loading={loading}
                searchCols={[
                    [
                        {
                            key: 'reimburseUser',
                            placeholder: '请输入实际报销人',
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
                            key: 'deptId',
                            placeholder: '请输入实际报销人所属部门',
                            className: styles.searchCol,
                            type: 'orgtree',
                            initValue: undefined,
                        },
                        {
                            key: 'project',
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
                            key: 'supplierName',
                            placeholder: '请输入收款对象名称',
                            className: styles.searchCol,
                        },
                        {
                            key: 'reimburseCode',
                            placeholder: '请输入报销单号',
                            className: styles.searchCol,
                        },
                    ],
                    [
                        {
                            key: 'reimburseFeeTakerMainName',
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
                            key: 'approvalStatus',
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
                            key: 'reimburseSource',
                            type: 'checkbox',
                            label: '费用报销来源',
                            options: REIMBURSE_SOURCE,
                        },
                    ],
                ]}
                fetch={this.fetchFn}
                cols={columns}
                tips={this.renderTipsFn(approvalReimburseLists)}
                pageData={approvalReimburseLists}
                expandIcon={this.customExpandIcon}
                expandedRowRender={(e) => {
                    return columnsChildFn(e);
                }}
            />
        );
    }
}
export default ReimburseList;
