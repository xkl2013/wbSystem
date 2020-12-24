import React from 'react';
import PageDataView from '@/components/DataView';
import { connect } from 'dva';
import { message } from 'antd';
import moment from 'moment';
import { CONTRACT_FEE_STATUS } from '@/utils/enum';
import { contractMoneyStatus } from '@/utils/enumNo2';
import { getContractList, getProjectList, getTalentList } from '@/services/globalSearchApi';
import { str2intArr } from '@/utils/utils';
import _ from 'lodash';
import { columnsFn } from './_selfColumn';
import styles from './index.less';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const hasSettlementStatus = [{ id: '0', name: '否' }, { id: '1', name: '是' }];
const CUSTOM_SETTLEMENT_STATUS = [{ id: '100', name: '未结算' }, { id: '2', name: '已结算' }];
@connect(({ business_balance, loading }) => {
    return {
        progressData: business_balance.progressData,
        loading: loading.effects['business_balance/getProgressLists'],
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
        if (data.projectingName) {
            data.projectingName = data.projectingName.label;
        } else {
            delete data.projectName;
        }
        if (data.talentName) {
            data.talentName = data.talentName.label;
        } else {
            delete data.talentName;
        }

        if (data.contractMoneyStatus !== undefined && data.contractMoneyStatus.length > 0) {
            data.contractMoneyStatus = str2intArr(data.contractMoneyStatus);
        } else delete data.contractMoneyStatus;
        if (data.expenseConfirmStatus !== undefined && data.expenseConfirmStatus.length > 0) {
            data.expenseConfirmStatus = str2intArr(data.expenseConfirmStatus);
        } else delete data.expenseConfirmStatus;
        if (data.contractSettlementStatusTemp !== undefined && data.contractSettlementStatusTemp.length > 0) {
            data.contractSettlementStatus = _.cloneDeep(data.contractSettlementStatusTemp);
            const index = data.contractSettlementStatus.findIndex((ls) => {
                return ls === '100';
            });
            if (index >= 0) {
                data.contractSettlementStatus.splice(index, 1, 0, 1);
            }
            data.contractSettlementStatus = str2intArr(data.contractSettlementStatus);
        }
        delete data.contractSettlementStatusTemp;
        if (data.hasSettlementStatus !== undefined && data.hasSettlementStatus.length > 0) {
            data.hasSettlementStatus = str2intArr(data.hasSettlementStatus);
        } else delete data.hasSettlementStatus;
        // 签约时间
        if (data.contractSigningDate && data.contractSigningDate.length > 0) {
            data.contractSigningDateStart = moment(data.contractSigningDate[0]).format(dateFormat);
            data.contractSigningDateEnd = moment(data.contractSigningDate[1]).format(dateFormat);
        }
        delete data.contractSigningDate;
        this.props.dispatch({
            type: 'business_balance/getProgressLists',
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
    startApproval = () => {
        message.info('功能同:合同模块');
    }
    render() {
        const { progressData } = this.props;
        return (
            <div className={styles.wrap}>
                <PageDataView
                    ref={(e) => {
                        this.pageDataView = e;
                    }}
                    rowKey="id"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'projectingName',
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
                                key: 'contract1Name',
                                type: 'associationSearchFilter',
                                placeholder: '请输入负责人',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getContractList({ contractName: val });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'contractId', label: 'contractName' },
                                },
                            }
                        ],
                        [
                            {
                                key: 'contractDate',
                                label: '应收日期',
                                type: 'daterange',
                                placeholder: ['签约开始日期', '签约结束日期'],
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'expenseConfirmStatus',
                                type: 'checkbox',
                                label: '应收状态',
                                options: [{ id: 1, name: '延期' }, { id: 2, name: '正常' }],
                            },
                        ],
                    ]}
                    fetch={this.fetchFn}
                    cols={columnsFn(this)}
                    pageData={{ ...progressData }}
                    scroll={{ x: 1880 }}
                />
            </div>
        );
    }
}
export default StatementList;
