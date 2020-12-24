import React from 'react';
import moment from 'moment';
import PageDataView from '@/components/DataView';
import { connect } from 'dva';
import { STARTPAYSTATUS, APPROVALSTATUS, PAYSTATUS } from '@/utils/enum';
import { getContractList, getProjectList, getTalentList, getUserList as getAllUsers } from '@/services/globalSearchApi';
import { DATETIME_FORMAT } from '@/utils/constants';
import { str2intArr, thousandSeparatorFixed } from '@/utils/utils';
import { columnsFn } from './_selfColumn';
import styles from './index.less';

@connect(({ business_balance, loading }) => {
    return {
        statementData: business_balance.statementData,
        business_balance,
        loading: loading.effects['business_balance/getStatementLists'],
    };
})
class StatementList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    // 筛选参数处理
    fetchFn = (beforeFetch) => {
        const data = beforeFetch();
        if (data.contractName) {
            data.contractName = data.contractName.label;
        } else {
            delete data.contractName;
        }
        if (data.projectName) {
            data.projectName = data.projectName.label;
        } else {
            delete data.projectName;
        }
        if (data.talentName) {
            data.talentName = data.talentName.label;
        } else {
            delete data.talentName;
        }
        if (data.applyUserName) {
            data.applyUserName = data.applyUserName.label;
        } else {
            delete data.applyUserName;
        }
        if (data.applyUserDeptName) {
            data.applyUserDeptName = data.applyUserDeptName.label;
        } else {
            delete data.applyUserDeptName;
        }
        if (data.createTime && data.createTime.length > 0) {
            data.createTimeStart = moment(data.createTime[0]).format(DATETIME_FORMAT);
            data.createTimeEnd = moment(data.createTime[1]).format(DATETIME_FORMAT);
        }
        delete data.createTime;
        if (data.startTime && data.startTime.length > 0) {
            data.startTimeStart = moment(data.startTime[0]).format(DATETIME_FORMAT);
            data.startTimeEnd = moment(data.startTime[1]).format(DATETIME_FORMAT);
        }
        delete data.startTime;
        if (data.oughtSettleAmountTruly) {
            data.oughtSettleAmountTrulyStart = Number(data.oughtSettleAmountTruly.min);
            data.oughtSettleAmountTrulyEnd = Number(data.oughtSettleAmountTruly.max);
        }
        delete data.oughtSettleAmountTruly;
        if (data.startPayStatus !== undefined && data.startPayStatus.length > 0) {
            data.startPayStatusList = str2intArr(data.startPayStatus);
        }
        delete data.startPayStatus;
        if (data.approvalStatus !== undefined && data.approvalStatus.length > 0) {
            data.approvalStatusList = str2intArr(data.approvalStatus);
        }
        delete data.approvalStatus;
        if (data.payStatus !== undefined && data.payStatus.length > 0) {
            data.payStatusList = str2intArr(data.payStatus);
        }
        delete data.payStatus;
        this.props.dispatch({
            type: 'business_balance/getStatementLists',
            payload: data,
        });
    };

    // 跳转详情页
    gotoDetail = (id) => {
        this.props.history.push({
            pathname: './detail',
            query: {
                id,
            },
        });
    };

    // tip 展示
    renderTips = (data) => {
        return (
            <div className={styles.tips}>
                合计：
                <span className="weightFont">结算单数量</span>
                =
                {data.dataTotal}
                {' '}
                <span className="weightFont">应结算金额</span>
                =
                {(data.oughtSettleAmountTrulyTotal
                    && `¥ ${thousandSeparatorFixed(data.oughtSettleAmountTrulyTotal)}`)
                    || 0}
                {' '}
                <span className="weightFont">佣金总金额</span>
                =
                {(data.brokerageTotal && `¥ ${thousandSeparatorFixed(data.brokerageTotal)}`) || 0}
                {' '}
                <span className="weightFont">分成到手总金额</span>
                =
                {(data.dividedIntoHandAmountTotal && `¥ ${thousandSeparatorFixed(data.dividedIntoHandAmountTotal)}`)
                    || 0}
            </div>
        );
    };

    render() {
        const { statementData } = this.props;
        return (
            <>
                <PageDataView
                    ref={(e) => {
                        this.pageDataView = e;
                    }}
                    rowKey="id"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'contractCode',
                                placeholder: '请输入合同编号',
                                className: styles.searchCls,
                                // componentAttr: {
                                //     allowClear: true,
                                // },
                            },
                            {
                                key: 'contractName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入合同名称',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getContractList({ contractName: val });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'contractId', label: 'contractName' },
                                },
                            },
                            {
                                key: 'projectCode',
                                placeholder: '请输入项目编号',
                                className: styles.searchCls,
                            },
                        ],
                        [
                            {
                                key: 'projectName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入项目名称',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getProjectList({
                                            projectName: val,
                                            projectBaseType: 1,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'projectId', label: 'projectName' },
                                },
                            },
                            {
                                key: 'talentName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入艺人或博主',
                                className: styles.searchCls,
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
                                        value: (val) => {
                                            return `${val.talentId}_${val.talentType}`;
                                        },
                                        label: 'talentName',
                                    },
                                },
                            },
                            {
                                key: 'applyUserName',
                                placeholder: '请输入申请人姓名',
                                type: 'associationSearchFilter',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getAllUsers({
                                            userChsName: val,
                                            pageSize: 100,
                                            pageNum: 1,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'userId', label: 'userRealName' },
                                },
                            },
                        ],
                        [
                            {
                                key: 'applyUserDeptName',
                                placeholder: '请输入申请人所属部门',
                                className: styles.searchCls,
                                type: 'orgtree',
                            },
                        ],
                        [
                            {
                                key: 'createTime',
                                label: '创建日期',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'startTime',
                                label: '发起日期',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {},
                        ],
                        [
                            {
                                key: 'oughtSettleAmountTruly',
                                label: '应结算金额',
                                placeholder: '请输入金额',
                                type: 'numberRange',
                            },
                        ],
                        [
                            {
                                key: 'startPayStatus',
                                type: 'checkbox',
                                label: '发起付款状态',
                                options: STARTPAYSTATUS,
                            },
                        ],
                        [
                            {
                                key: 'approvalStatus',
                                type: 'checkbox',
                                label: '审批状态',
                                options: PAYSTATUS,
                            },
                        ],
                        [
                            {
                                key: 'payStatus',
                                type: 'checkbox',
                                label: '付款状态',
                                options: APPROVALSTATUS,
                            },
                        ],
                    ]}
                    fetch={this.fetchFn}
                    cols={columnsFn(this)}
                    pageData={{ ...statementData }}
                    tips={this.renderTips(statementData.tipsData)}
                    scroll={{ x: 1880 }}
                />
            </>
        );
    }
}
export default StatementList;
