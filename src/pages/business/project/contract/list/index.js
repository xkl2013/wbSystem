import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import PageDataView from '@/submodule/components/DataView';
import {
    FEE_APPLY_TYPE,
    CONTRACT_ARCHIVE_STATUS,
    PROJECT_TYPE,
    TALENDT_TYPE,
    CONTRACT_PROGRESS_STATUS,
    CONTRACT_MONEY_STATUS,
    CONTRACT_REIMBURSE_STATUS,
    CONTRACT_FEE_STATUS,
    CONTRACT_SETTLEMENT_STATUS,
    CONTRACT_END_STATUS,
} from '@/utils/enum';
import { thousandSeparatorFixed } from '@/utils/utils';
import { contractCategory } from '@/utils/enumNo2';
import {
    getContractList,
    getProjectList,
    getCustomerList,
    getTalentList,
    getUserList,
} from '@/services/globalSearchApi';
import styles from './index.less';
import { columnsFn } from './_selfColumn';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ business_project_contract, loading }) => {
    return {
        business_project_contract,
        projectListPage: business_project_contract.projectListPage,
        contractListPage: business_project_contract.contractListPage,
        loading: loading.effects['business_project_contract/getContractList'],
    };
})
class Establish extends Component {
    constructor(props) {
        super(props);
        this.pageDataView = React.createRef();
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

    fetchFn = (beforeFetch) => {
        const data = beforeFetch();
        // 合同名称
        if (data.contractName !== undefined) {
            data.contractName = data.contractName.label;
        }

        // 负责人名称
        if (data.contractHeaderName !== undefined) {
            data.contractHeaderName = data.contractHeaderName.label;
        }
        // 项目名称
        if (data.projectName !== undefined) {
            data.projectName = data.projectName.label;
        }
        // 客户名称
        if (data.customerName !== undefined) {
            data.customerName = data.customerName.label;
        }
        // 艺人名称
        if (data.talentName !== undefined) {
            data.talentName = data.talentName.label;
        }
        // 审批状态
        if (data.contractApprovalStatus !== undefined && data.contractApprovalStatus.length > 0) {
            data.contractApprovalStatus = data.contractApprovalStatus.map((item) => {
                return Number(item);
            });
        }
        // 合同分类 0:主合同 1:子合同
        if (data.contractCategory !== undefined && data.contractCategory.length > 0) {
            data.contractCategory = data.contractCategory.map((item) => {
                return Number(item);
            });
        }
        // 归档状态
        if (data.contractArchiveStatus !== undefined && data.contractArchiveStatus.length > 0) {
            data.contractArchiveStatus = data.contractArchiveStatus.map((item) => {
                return Number(item);
            });
        }
        // 签约时间
        if (data.contractDate && data.contractDate.length > 0) {
            data.contractStartDate = moment(data.contractDate[0]).format(dateFormat);
            data.contractEndDate = moment(data.contractDate[1]).format(dateFormat);
        }
        delete data.contractDate;
        // 项目类型
        if (data.contractProjectType !== undefined && data.contractProjectType.length > 0) {
            data.projectTypes = data.contractProjectType.map((item) => {
                return Number(item);
            });
        }
        delete data.contractProjectType;
        // talent类型
        if (data.talentTypes !== undefined && data.talentTypes.length > 0) {
            data.talentTypes = data.talentTypes.map((item) => {
                return Number(item);
            });
        }
        this.props.dispatch({
            type: 'business_project_contract/getContractList',
            payload: data,
        });
    };

    // 新增
    addFn = () => {
        this.props.history.push({
            pathname: '/foreEnd/business/project/contract/add',
        });
    };

    addChildContract = (val) => {
        this.props.history.push({
            pathname: '/foreEnd/business/project/contract/add',
            query: {
                id: val,
            },
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: '/foreEnd/business/project/contract/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val, resubmitEnum) => {
        this.props.history.push({
            pathname: '/foreEnd/business/project/contract/edit',
            query: {
                oldContractId: val,
                resubmitEnum,
            },
        });
    };

    goProgress = (val) => {
        // 点击进入项目费用确认详情
        window.open(`/foreEnd/business/project/contract/verify/detail?id=${val}`, '_blank');
    };

    checkFeeData = (val) => {
        // 鼠标单击进入项目合同-合同费用tab页
        window.open(`/foreEnd/business/project/contract/detail?id=${val}&selTab=${4}`, '_blank');
    };

    checkAccountData = (val) => {
        // 鼠标单击进入项目合同-合同结算tab页
        window.open(`/foreEnd/business/project/contract/detail?id=${val}&selTab=${5}`, '_blank');
    };

    // tip 展示
    renderTipsFn = (contractListPage) => {
        const { contractAmount, contractCount, contractReturnAmount } = contractListPage || {};
        return (
            <div className={styles.tips}>
                合计：
                <span className="weightFont">合同数量</span>
                =
                {contractCount}
                {' '}
                <span className="weightFont">合同总金额</span>
                =
                {`¥ ${thousandSeparatorFixed(contractAmount)}`}
                {' '}
                <span className="weightFont">实际回款金额</span>
                =
                {`¥ ${thousandSeparatorFixed(contractReturnAmount)}`}
            </div>
        );
    };

    render() {
        const contractListPage = this.props.contractListPage || {};
        const columns = columnsFn(this);
        return (
            <div className={styles.wrap}>
                <PageDataView
                    ref={this.pageDataView}
                    rowKey="contractId"
                    loading={this.props.loading}
                    searchCols={[
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
                                key: 'customerName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入客户名称',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getCustomerList({
                                            customerName: val,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'id', label: 'customerName' },
                                },
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
                        ],
                        [
                            {
                                key: 'talentName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入艺人名',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getTalentList({ talentName: val });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: {
                                        value: (item) => {
                                            return `${item.talentId}_${item.talentType}`;
                                        },
                                        label: 'talentName',
                                    },
                                },
                            },
                            {
                                key: 'contractHeaderName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入负责人',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getUserList({ pageNum: 1, pageSize: 100, userChsName: val });
                                    },
                                    fieldNames: { value: 'userId', label: 'userChsName' },
                                    initDataType: 'onfocus',
                                },
                            },
                            {
                                key: 'contractCode',
                                placeholder: '请输入合同编号',
                                className: styles.searchCls,
                            },
                        ],
                    ]}
                    advancedSearchCols={[
                        [
                            {
                                key: 'contractDate',
                                label: '签约日期',
                                type: 'daterange',
                                placeholder: ['签约开始日期', '签约结束日期'],
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'contractProjectType',
                                type: 'checkbox',
                                label: '项目类型',
                                options: PROJECT_TYPE,
                            },
                        ],
                        [
                            {
                                key: 'contractApprovalStatus',
                                type: 'checkbox',
                                label: '审批状态',
                                options: FEE_APPLY_TYPE,
                            },
                        ],
                        [
                            {
                                key: 'talentTypes',
                                type: 'checkbox',
                                label: 'talent类型',
                                options: TALENDT_TYPE,
                            },
                        ],
                        [
                            {
                                key: 'contractArchiveStatus',
                                type: 'checkbox',
                                label: '归档状态',
                                options: CONTRACT_ARCHIVE_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'contractCategory',
                                type: 'checkbox',
                                label: '主子合同',
                                options: contractCategory,
                            },
                        ],
                        [
                            {
                                key: 'contractProgressStatusList',
                                type: 'checkbox',
                                label: '执行状态',
                                options: CONTRACT_PROGRESS_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'contractMoneyStatusList',
                                type: 'checkbox',
                                label: '回款状态',
                                options: CONTRACT_MONEY_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'reimburseStatusList',
                                type: 'checkbox',
                                label: '报销状态',
                                options: CONTRACT_REIMBURSE_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'expenseConfirmStatusList',
                                type: 'checkbox',
                                label: '费用确认状态',
                                options: CONTRACT_FEE_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'endStatusList',
                                type: 'checkbox',
                                label: '结案状态',
                                options: CONTRACT_END_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'contractSettlementStatusList',
                                type: 'checkbox',
                                label: '结算状态',
                                options: CONTRACT_SETTLEMENT_STATUS,
                            },
                        ],
                    ]}
                    btns={[
                        {
                            label: '新增',
                            onClick: this.addFn,
                            authority: '/foreEnd/business/project/contract/add',
                        },
                    ]}
                    fetch={this.fetchFn}
                    cols={columns}
                    scroll={{ x: 2500 }}
                    pageData={contractListPage}
                    tips={this.renderTipsFn(contractListPage)}
                />
            </div>
        );
    }
}

export default Establish;
