import React from 'react';
import { message, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageDataView from '@/submodule/components/DataView';
import exportIcon from '@/assets/export.png';
import travelAudit from '@/assets/travelAudit.png';
import {
    TRAVEL_ORDER_TYPE,
    TRAVEL_ORDER_STATUS,
    APPLY_FEEBEAR_PERSON,
    TRAVEL_APPROVAL_STATUS,
    TRAVEL_PROJECT_TYPE,
} from '@/utils/enum';
import {
    getCompanyList,
    getUserList,
    getContractList,
    getTalentList,
    getProjectList,
} from '@/services/globalSearchApi';
import { DATETIME_FORMAT } from '@/utils/constants';
import { str2intArr, thousandSeparatorFixed } from '@/utils/utils';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import DownLoad from '@/components/DownLoad';
import columnsFn from './_selfColumn';
import styles from './index.less';

function getTipsSum(arr, val, unVal) {
    if (Array.isArray(arr) && arr.length === 0) return 0;
    let newArr;
    if (unVal !== '') {
        // 去重
        const res = new Map();
        newArr = arr.filter((a) => {
            return !res.has(a[unVal]) && res.set(a[unVal], 1);
        });
    } else {
        newArr = arr;
    }
    // 累加算和
    const result = newArr.reduce((total = 0, currentValue) => {
        return (currentValue[val] || 0) + total;
    }, 0);
    return Number(result).toFixed(2);
}

@connect(({ admin_travelOrder, loading }) => {
    return {
        TravelListPage: admin_travelOrder.TravelListPage,
        loading: loading.effects['admin_travelOrder/getTravelOrderList'],
    };
})
class TravelOrderManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectId: [],
            params: {},
            selecedItem: [],
            modelShow: false,
            auditModalShow: false,
        };
    }

    componentDidMount() {
        this.fetch();
    }

    getData = () => {
        this.fetch();
    };

    fetch = () => {
        //   const { pageDataView } = this.ref;
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    dataFetch = (beforeFetch) => {
        const data = beforeFetch();
        // 订单状态 1:新增 2:退订 3:改签
        if (data.orderStatus !== undefined && data.orderStatus.length > 0) {
            data.orderStatusList = str2intArr(data.orderStatus);
        }
        delete data.orderStatus;
        // 订单付款状态 0:未付款 1:已付款
        if (data.orderPaymentStatus !== undefined && data.orderPaymentStatus.length > 0) {
            data.orderPaymentStatuses = str2intArr(data.orderPaymentStatus);
        }
        delete data.orderPaymentStatus;
        // 费用承担方 1:公司承担 2:艺人承担 3:公司与艺人共同承担
        if (data.applyFeeBearType !== undefined && data.applyFeeBearType.length > 0) {
            data.applyFeeBearTypeList = str2intArr(data.applyFeeBearType);
        }
        delete data.applyFeeBearType;
        // 项目类型 0日常，1立项项目
        if (data.applyProjectType !== undefined && data.applyProjectType.length > 0) {
            data.applyProjectTypeList = str2intArr(data.applyProjectType);
        }
        delete data.applyProjectType;
        // 合同名称
        if (data.applyContractName !== undefined) {
            data.applyContractName = data.applyContractName.label;
        }
        // 费用承担主体
        if (data.applyFeeBearCompanyName !== undefined) {
            data.applyFeeBearCompanyName = data.applyFeeBearCompanyName.label;
        }
        // 费用承担部门
        if (data.applyFeeBearDeptName !== undefined) {
            data.applyFeeBearDeptName = data.applyFeeBearDeptName.label;
        }
        // 项目名称
        if (data.applyProjectName !== undefined) {
            data.applyProjectName = data.applyProjectName.label;
        }
        // 艺人/博主
        if (data.applyTalentName !== undefined) {
            data.applyTalentName = data.applyTalentName.label;
        }
        // 订单下单人姓名
        if (data.orderUserName !== undefined) {
            data.orderUserName = data.orderUserName.label;
        }
        // 订单类型 1:机票 2:火车票 3:酒店
        if (data.orderType !== undefined && data.orderType.length > 0) {
            data.orderTypeList = str2intArr(data.orderType);
        }
        delete data.orderType;
        // 订单是否已生成台账 0:否 1:是
        if (data.orderLedgerStatus !== undefined && data.orderLedgerStatus.length > 0) {
            data.orderLedgerStatuses = str2intArr(data.orderLedgerStatus);
        }
        delete data.orderLedgerStatus;
        // 是否超标 0:否 1:是
        if (data.orderIsExceed !== undefined && data.orderIsExceed.length > 0) {
            data.orderIsExceeds = str2intArr(data.orderIsExceed);
        }
        delete data.orderIsExceed;
        // 审核状态 0未审核 1已审核
        if (data.orderAuditStatus !== undefined && data.orderAuditStatus.length > 0) {
            data.orderAuditStatusList = str2intArr(data.orderAuditStatus);
        }
        delete data.orderAuditStatus;
        // 订单日期（起）
        if (data.orderDate && data.orderDate.length > 0) {
            data.orderDateStart = moment(data.orderDate[0]).format(DATETIME_FORMAT);
            data.orderDateEnd = moment(data.orderDate[1]).format(DATETIME_FORMAT);
        }
        delete data.orderDate;
        this.setState({
            params: { ...data },
        });
        this.props.dispatch({
            type: 'admin_travelOrder/getTravelOrderList',
            payload: data,
        });
    };

    // tip 展示
    renderTips = (moneyTips) => {
        const arr = [
            { title: '订单数量', value: '', unVal: '' },
            { title: '订单金额', value: 'orderMoney', unVal: '' },
            { title: '保险金额', value: 'orderInsuranceMoney', unVal: '' },
            { title: '服务费', value: 'orderServiceMoney', unVal: '' },
            { title: '退改手续费', value: 'orderRefundChangeMoney', unVal: '' },
        ];
        const arrDom = [];
        arr.map((item, index) => {
            if (index === 0) {
                arrDom.push(
                    <span key={index}>
                        <b>{item.title}</b>
                        =
                        {moneyTips.length}
                    </span>,
                );
            } else {
                arrDom.push(
                    <span key={index}>
                        <b>{item.title}</b>
                        =
                        {thousandSeparatorFixed(getTipsSum(moneyTips, item.value, item.unVal))}
                    </span>,
                );
            }
        });
        return (
            <Popover
                content={
                    <div className={styles.popoverWrap}>
                        当前页合计：
                        {arrDom}
                    </div>
                }
                placement="topLeft"
            >
                <div className={styles.tips}>
                    当前页合计：
                    {arrDom}
                </div>
            </Popover>
        );
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
        const selectId = [];
        selectedRows.map((item) => {
            selectId.push(item.orderId);
        });
        this.setState({
            selectId: Array.from(new Set(selectId)),
            selecedItem: selectedRows,
        });
    };

    downloadFn = () => {
        const { selectId } = this.state;
        if (selectId.length > 0) {
            return (
                <DownLoad
                    loadUrl="/crmApi/travelOrder/export"
                    params={{ method: 'post', data: selectId }}
                    fileName={() => {
                        return '差旅订单管理列表.xlsx';
                    }}
                    textClassName={styles.floatRight}
                    hideProgress
                    text={
                        <BIButton className={styles.btn}>
                            <img width="12px" style={{ marginRight: '4px' }} src={exportIcon} alt="" />
                            导出
                        </BIButton>
                    }
                />
            );
        }
        return (
            <BIButton
                className={styles.btn}
                style={{ marginLeft: '10px' }}
                onClick={() => {
                    return message.warn('请勾选要导出项');
                }}
            >
                <img width="12px" style={{ marginRight: '4px' }} src={exportIcon} alt="" />
                导出
            </BIButton>
        );
    };

    AuditConfirm = () => {
        // 审核  审核状态 0未审核 1已审核  orderAuditStatus
        const { selectId, selecedItem } = this.state;
        const hasNotAudit = selecedItem.filter((item) => {
            return item.orderAuditStatus === 0;
        });
        if (selectId.length > 0) {
            if (hasNotAudit.length === 0) {
                message.warn('您选择的数据中0条符合条件，请重新选择符合条件的数据！');
            } else {
                this.setState({ auditModalShow: true });
            }
        } else {
            message.warn('请勾选要审核的选项');
        }
    };

    postTravelOrderAudit = () => {
        // 审核modal
        const { selectId, auditModalShow, selecedItem } = this.state;
        const hasAudit = selecedItem.filter((item) => {
            return item.orderAuditStatus === 1;
        });
        const hasNotAuditLens = selectId.length - hasAudit.length;
        const hasNotAudit = selecedItem.filter((item) => {
            return item.orderAuditStatus === 0;
        });
        const payloadId = (hasNotAudit || []).map((item) => {
            return item.orderId;
        });
        return (
            <BIModal
                visible={auditModalShow}
                maskClosable={false}
                destroyOnClose={true}
                title="审核"
                okText="确定"
                cancelText="取消"
                onOk={() => {
                    this.props
                        .dispatch({
                            type: 'admin_travelOrder/postTravelOrderAudit',
                            payload: {
                                data: payloadId,
                            },
                        })
                        .then(() => {
                            this.setState({ auditModalShow: false });
                            this.props.dispatch({
                                type: 'admin_travelOrder/getTravelOrderList',
                                payload: this.state.params,
                            });
                            this.setState({
                                selectedRowKeys: [],
                            });
                        });
                }}
                onCancel={() => {
                    return this.setState({ auditModalShow: false });
                }}
            >
                <div className={styles.rateTitle}>
                    {`您一共选中了${selectId.length}条数据，${hasNotAuditLens}条符合条件，${hasAudit.length}条不符合条件，此过程不可逆，是否确定对数据进行审核？`}
                </div>
            </BIModal>
        );
    };

    checkData = (val) => {
        // 查看详情
        this.props.history.push({
            pathname: '/foreEnd/business/travelOrder/travelOrderManage/detail',
            query: {
                id: val || '',
            },
        });
    };

    render() {
        const { TravelListPage } = this.props;
        const { modelShow, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            columnWidth: '30px',
            onChange: this.onSelectChange,
        };
        return (
            <>
                <PageDataView
                    style={modelShow ? { paddingBottom: '44px' } : null}
                    ref={(pageDataView) => {
                        this.pageDataView = pageDataView;
                    }}
                    rowKey="orderId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'orderCode',
                                placeholder: '请输入订单号',
                                className: styles.searchCol,
                                componentAttr: {
                                    allowClear: true,
                                },
                            },
                            {
                                key: 'applyCode',
                                placeholder: '请输入出差申请编号',
                                className: styles.searchCol,
                                componentAttr: {
                                    allowClear: true,
                                },
                            },
                            {
                                key: 'orderUserName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入下单人姓名',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getUserList({
                                            userRealName: val,
                                            pageSize: 50,
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
                                key: 'applyFeeBearCompanyName',
                                placeholder: '请选择费用承担主体',
                                type: 'associationSearch',
                                className: styles.searchCls,
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
                                key: 'applyFeeBearDeptName',
                                placeholder: '请选择费用承担部门',
                                type: 'orgtree',
                                className: styles.searchCls,
                            },
                            {},
                        ],
                    ]}
                    advancedSearchCols={[
                        [
                            {
                                key: 'applyProjectName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入项目名称',
                                className: styles.searchCls,
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
                                key: 'applyTalentName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入目标艺人或博主',
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
                                key: 'applyContractName',
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
                                key: 'orderDate',
                                label: '订单日期',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'applyFeeBearType',
                                type: 'checkbox',
                                label: '费用承担方',
                                options: APPLY_FEEBEAR_PERSON,
                            },
                        ],
                        [
                            {
                                key: 'orderType',
                                type: 'checkbox',
                                label: '订单类型',
                                options: TRAVEL_ORDER_TYPE,
                            },
                        ],
                        [
                            {
                                key: 'orderStatus',
                                type: 'checkbox',
                                label: '订单状态',
                                options: TRAVEL_ORDER_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'applyProjectType',
                                type: 'checkbox',
                                label: '项目类别',
                                options: TRAVEL_PROJECT_TYPE,
                                className: styles.checkTY,
                            },
                        ],
                        [
                            {
                                key: 'orderAuditStatus',
                                type: 'checkbox',
                                label: '审核状态',
                                options: TRAVEL_APPROVAL_STATUS,
                                className: styles.checkTY,
                            },
                        ],
                    ]}
                    btns={[
                        {
                            label: '审核',
                            authority: '/foreEnd/business/travelOrder/travelOrderManage/audit',
                            iconBtnSrc: travelAudit,
                            onClick: this.AuditConfirm,
                        },
                        {
                            label: '导出',
                            authority: '/foreEnd/business/travelOrder/travelOrderManage/export',
                            download: this.downloadFn,
                            type: 'download',
                        },
                    ]}
                    fetch={this.dataFetch}
                    cols={columnsFn(this)}
                    pageData={{ ...TravelListPage }}
                    tips={this.renderTips(TravelListPage.list)}
                    rowSelectionConfig={rowSelection}
                    scroll={{ x: 1600 }}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '100', '500', '1000', '5000', '10000'],
                    }}
                />
                {this.postTravelOrderAudit()}
            </>
        );
    }
}

export default TravelOrderManage;
