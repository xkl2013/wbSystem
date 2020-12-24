import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageDataView from '@/components/DataView';
import IconFont from '@/components/CustomIcon/IconFont';
import { EARNING_NC, EXPENSES_PROCEEDING, EXPENSES_BUSINESS_STATE, REIMBURSE_SOURCE, TALENDT_TYPE } from '@/utils/enum';
import { getUserList, getCompanyList } from '@/services/globalSearchApi';
import { DATETIME_FORMAT } from '@/utils/constants';
import { str2intArr, thousandSeparatorFixed } from '@/utils/utils';
import BIButton from '@/ant_components/BIButton';
import DownLoad from '@/components/DownLoad';
import BIModal from '@/ant_components/BIModal';
import ModelQueue from '@/components/ModelQueue';
import { getFeeType } from '@/services/dictionary';
import { columnsFn } from './_selfColumn';
import { getProjectList, getTalentList } from '../services';
import styles from './index.less';

let taskTimePoll = null;
/* eslint-disable */
@connect(({ business_account, loading }) => {
    return {
        expensesData: business_account.expensesData,
        checkoutArr: business_account.checkoutArr,
        taskList: business_account.taskList,
        business_account,
        loading: loading.effects['business_account/postExpensesData'],
    };
})
class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectId: [],
            params: {},
            checkIDState: false,
            checkStateObj: {},
            showState: false,
            modelShow: false,
            exporting: false,
        };
    }

    componentDidMount() {
        clearTimeout(taskTimePoll);
        this.fetch();
        this.getTaskList();
    }

    componentWillUnmount() {
        clearTimeout(taskTimePoll);
    }

    getTipsSum(arr, val, unVal) {
        if (Array.isArray(arr) && arr.length === 0) return 0;
        let newArr = [];
        if (unVal !== '') {
            // 去重
            newArr = arr.filter((item) => {
                return Number(item[unVal]) === Number(EXPENSES_PROCEEDING[0].id);
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

    getData = (data) => {
        this.props.dispatch({
            type: 'business_account/postExpensesData',
            payload: data,
        });
    };

    fetch = () => {
        const { pageDataView } = this.refs;
        if (pageDataView !== null) {
            pageDataView.fetch();
        }
    };

    _fetch = (beforeFetch) => {
        const data = beforeFetch();
        // 费用报销人/申请人
        if (data.feeExpenseUserId) {
            data.feeExpenseUserId = data.feeExpenseUserId.value;
        }
        // 项目名称
        if (data.feeProjectName) {
            data.feeProjectName = data.feeProjectName.label;
        }
        // 目标艺人/博主
        if (data.feeTalentName) {
            data.feeTalentName = data.feeTalentName.label;
        }
        // 费用承担部门
        if (data.feeBearDeptName) {
            data.feeBearDeptName = data.feeBearDeptName.label;
        }
        // 公司名称
        if (data.feeCompanyName) {
            data.feeCompanyName = data.feeCompanyName.label;
        }
        // 审批完成时间
        if (data.feeApprovalFinishTime && data.feeApprovalFinishTime.length > 0) {
            data.feeApprovalFinishTimeStart = moment(data.feeApprovalFinishTime[0]).format(DATETIME_FORMAT);
            data.feeApprovalFinishTimeEnd = moment(data.feeApprovalFinishTime[1]).format(DATETIME_FORMAT);
        }
        delete data.feeApprovalFinishTime;
        // 付款完成时间
        if (data.feePaymentConfirmTime && data.feePaymentConfirmTime.length > 0) {
            data.feePaymentConfirmTimeStart = moment(data.feePaymentConfirmTime[0]).format(DATETIME_FORMAT);
            data.feePaymentConfirmTimeEnd = moment(data.feePaymentConfirmTime[1]).format(DATETIME_FORMAT);
        }
        delete data.feePaymentConfirmTime;
        // 传送NC时间
        if (data.feeNcTime && data.feeNcTime.length > 0) {
            data.feeNcTimeStart = moment(data.feeNcTime[0]).format(DATETIME_FORMAT);
            data.feeNcTimeEnd = moment(data.feeNcTime[1]).format(DATETIME_FORMAT);
        }
        delete data.feeNcTime;
        // 业务类型
        if (data.feeBusinessType !== undefined && data.feeBusinessType.length > 0) {
            data.feeBusinessTypeList = str2intArr(data.feeBusinessType);
        }
        delete data.feeBusinessType;
        // 传送nc状态
        if (data.feeNcStatus !== undefined && data.feeNcStatus.length > 0) {
            data.feeTransferNcStatusList = str2intArr(data.feeNcStatus);
        }
        delete data.feeNcStatus;
        // 事项
        if (data.feeThings !== undefined && data.feeThings.length > 0) {
            data.feeThingsList = str2intArr(data.feeThings);
        }
        delete data.feeThings;
        // talent类型
        if (data.feeTalentType !== undefined && data.feeTalentType.length > 0) {
            data.feeTalentTypeList = str2intArr(data.feeTalentType);
        }
        delete data.feeTalentType;
        // 费用类型
        if (data.feeType !== undefined && data.feeType.length > 0) {
            data.feeTypeList = data.feeType.map((item) => {
                return item.value;
            });
        }
        delete data.feeType;
        // 来源
        if (data.feeSource !== undefined && data.feeSource.length > 0) {
            data.feeSourceList = str2intArr(data.feeSource);
        }
        delete data.feeSource;

        this.setState({
            params: { ...data },
        });
        this.props.dispatch({
            type: 'business_account/postExpensesData',
            payload: data,
        });
    };
    onBeforeLoad = () => {
        const { params, selectId } = this.state;
        this.setState({ exporting: true });
        if (!selectId || selectId.length === 0) {
            message.warn('导出数据量较大，请勿关闭页面，耐心等待2-3分钟，谢谢！', 4);
        }
    };
    // tip 展示
    _renderTips = (moneyTips) => {
        const arr = [
            { title: '台帐数量', value: '', unVal: '' },
            { title: '含税金额', value: 'feeHadTaxAmount', unVal: 'feeThings' },
            { title: '未税金额', value: 'feeNoTaxAmount', unVal: 'feeThings' },
            { title: '税额', value: 'feeTaxAmount', unVal: 'feeThings' },
            { title: '入帐金额', value: 'feeEntryAmount', unVal: '' },
        ];
        const arrDom = [];
        arr.map((item, index) => {
            if (index === 0) {
                arrDom.push(
                    <span key={index}>
                        <b>{item.title}</b>={moneyTips.length}
                    </span>,
                );
            } else {
                arrDom.push(
                    <span key={index}>
                        <b>{item.title}</b>={thousandSeparatorFixed(this.getTipsSum(moneyTips, item.value, item.unVal))}
                    </span>,
                );
            }
        });
        return (
            <div className={styles.tips}>
                当前页合计：
                {arrDom}
            </div>
        );
    };

    rowSelectionConfig = () => {
        const selectId = [];
        return {
            onChange: (selectedRowKeys, selectedRows) => {
                selectedRows.map((item) => {
                    selectId.push(item.feeId);
                });
                this.setState({
                    selectId: Array.from(new Set(selectId)),
                });
            },
        };
    };

    downloadFn = () => {
        const { params, selectId } = this.state;
        return (
            <DownLoad
                loadUrl="/crmApi/ledger/fee/export"
                params={{ method: 'post', data: { selectId, ...params } }}
                fileName={() => {
                    return '费用类台帐列表.xlsx';
                }}
                textClassName={styles.floatRight}
                onBeforeLoad={this.onBeforeLoad}
                onAfterLoad={() => this.setState({ exporting: false })}
                text={
                    <BIButton className={styles.btn} loading={this.state.exporting}>
                        {this.state.exporting ? null : <IconFont type="iconliebiaoye-daochu" />}
                        {/* <img width="12px" style={{ marginRight: '4px' }} src={exportIcon} alt="" /> */}
                        导出
                    </BIButton>
                }
                hideProgress
            />
        );
    };

    getTaskList = () => {
        clearTimeout(taskTimePoll);
        this.props
            .dispatch({
                type: 'business_account/getSyncTaskList',
                payload: {
                    type: 'fee',
                },
            })
            .then(() => {
                this.taskPoll();
            });
    };

    taskPoll = () => {
        clearTimeout(taskTimePoll);
        const { taskList } = this.props;
        const taskStatus = taskList.map((item) => {
            return item.status;
        });
        if (taskList.length === 0) {
            this.setState({
                modelShow: false,
            });
        }
        if (taskList.length > 0) {
            this.setState({
                modelShow: true,
            });
            if (taskStatus.indexOf(0) >= 0) {
                this.setState({
                    showState: true,
                });
            }
        }
        if (taskStatus.indexOf(0) >= 0 && this.state.showState) {
            console.log('继续轮询');
            this.setState({
                showState: true,
            });
            taskTimePoll = setTimeout(() => {
                this.props.dispatch({
                    type: 'business_account/getSyncTaskList',
                    payload: {
                        type: 'fee',
                    },
                });
                this.taskPoll();
                console.log(new Date());
            }, 5000);
        } else {
            clearTimeout(taskTimePoll);
            console.log('结束轮询');
        }
    };

    checkNCId = () => {
        const { selectId } = this.state;

        if (selectId && selectId.length > 0) {
            this.props
                .dispatch({
                    type: 'business_account/checkNCIds',
                    payload: {
                        type: 'fee',
                        data: selectId,
                    },
                })
                .then(() => {
                    const { checkoutArr } = this.props;
                    if (checkoutArr.validIds && checkoutArr.validIds.length > 0) {
                        const checkStateObj = {
                            allLen: checkoutArr.invalidIds.length + checkoutArr.validIds.length,
                            invalidIdsLen: checkoutArr.invalidIds.length,
                            validIdsLen: checkoutArr.validIds.length,
                        };
                        this.setState({
                            checkIDState: true,
                            checkStateObj: Object.assign({}, checkStateObj),
                        });
                    } else {
                        message.warn('您选择的数据中0条符合条件，请重新选择符合条件的数据！');
                    }
                });
        } else {
            message.error('请先勾选要传送NC的数据');
        }
    };

    checkIDClose = () => {
        this.setState({
            checkIDState: false,
        });
    };

    transferNC = () => {
        const { validIds } = this.props.checkoutArr;
        this.props
            .dispatch({
                type: 'business_account/syncNCIds',
                payload: {
                    type: 'fee',
                    data: validIds,
                },
            })
            .then((res) => {
                if (res.success === true) {
                    this.setState({ showState: true, checkIDState: false, checkStateObj: {} });
                    this.getTaskList();
                    this.fetch();
                }
            });
    };

    formQueueData = (dataSource) => {
        const data = dataSource.map((item, index) => {
            return {
                id: item.id,
                realLedgerNum: item.realLedgerNum,
                startTime: item.beginTime,
                endTime: item.endTime,
                status: item.status,
                successLedgerNum: item.successLedgerNum,
                failLedgerNum: item.failLedgerNum,
                taskPlan:
                    item.realLedgerNum > 0 && item.status === 0
                        ? (((item.successLedgerNum + item.failLedgerNum) / item.realLedgerNum) * 100).toFixed(2)
                        : 100,
            };
        });
        return data;
    };

    showBack = (status) => {
        this.setState({
            showState: status,
        });
        if (status) {
            this.getTaskList();
        } else {
            clearTimeout(taskTimePoll);
        }
    };

    render() {
        const { expensesData, taskList } = this.props;
        const { checkIDState, checkStateObj, showState, modelShow } = this.state;
        const queueData = this.formQueueData(taskList);
        return (
            <>
                <BIModal
                    visible={checkIDState}
                    onOk={() => {
                        return this.transferNC();
                    }}
                    onCancel={() => {
                        return this.checkIDClose();
                    }}
                    title="确认传送提示"
                    width={420}
                >
                    <p style={{ fontSize: '14px', color: '#576877' }}>
                        {`您本次共选择台账数量为${checkStateObj.allLen}，${checkStateObj.validIdsLen}条符合条件，${checkStateObj.invalidIdsLen}条不符合条件，此过程会持续较长时间且不可逆，是否确定推送NC？`}
                    </p>
                </BIModal>
                <PageDataView
                    style={modelShow ? { paddingBottom: '44px' } : null}
                    ref="pageDataView"
                    rowKey="feeId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'feeExpenseNo',
                                placeholder: '请输入报销单/申请单号',
                                className: styles.searchCol,
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
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'index', label: 'value' },
                                    mode: 'multiple',
                                    allowClear: true,
                                    dropdownStatus: true,
                                },
                            },
                            {
                                key: 'feeExpenseUserId',
                                type: 'associationSearchFilter',
                                placeholder: '请输入报销人/申请人',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getUserList({
                                            userChsName: val,
                                            pageSize: 50,
                                            pageNum: 1,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'userId', label: 'userChsName' },
                                },
                            },
                        ],
                        [
                            {
                                key: 'feeProjectName',
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
                                key: 'feeTalentName',
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
                                key: 'feeBearDeptName',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择费用承担部门',
                                        },
                                    ],
                                },
                                placeholder: '请选择费用承担部门',
                                type: 'orgtree',
                                className: styles.searchCls,
                                getFormat: (value, form) => {
                                    form.applicationFeeTakerDeptId = value.value;
                                    form.applicationFeeTakerDeptName = value.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.applicationFeeTakerDeptName,
                                        value: form.applicationFeeTakerDeptId,
                                    };
                                },
                            },
                        ],
                        [
                            {
                                key: 'feeCompanyName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入公司名称',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getCompanyList({
                                            companyName: val,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'companyId', label: 'companyName' },
                                },
                            },
                            {
                                key: 'feeReceiveFromName',
                                placeholder: '请输入收款对象名称',
                                className: styles.searchCol,
                            },
                            {},
                        ],
                        [
                            {
                                key: 'feeApprovalFinishTime',
                                label: '审批完成时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'feePaymentConfirmTime',
                                label: '付款完成时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'feeNcTime',
                                label: '传送NC时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'feeBusinessType',
                                type: 'checkbox',
                                label: '业务类型',
                                options: EXPENSES_BUSINESS_STATE,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: EXPENSES_BUSINESS_STATE.find((item) => {
                                                return item.id === tax;
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
                        [
                            {
                                key: 'feeNcStatus',
                                type: 'checkbox',
                                label: '传送NC状态',
                                options: EARNING_NC,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: EARNING_NC.find((item) => {
                                                return item.id === tax;
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
                        [
                            {
                                key: 'feeSource',
                                type: 'checkbox',
                                label: '来源',
                                options: REIMBURSE_SOURCE,
                            },
                        ],
                        [
                            {
                                key: 'feeTalentType',
                                type: 'checkbox',
                                label: 'talent类型',
                                options: TALENDT_TYPE,
                            },
                        ],
                        [
                            {
                                key: 'feeThings',
                                type: 'checkbox',
                                label: '事项',
                                options: EXPENSES_PROCEEDING,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: EXPENSES_PROCEEDING.find((item) => {
                                                return item.id === tax;
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
                    btns={[
                        {
                            label: '传送NC',
                            iconBtnSrc: 'iconliebiaoye-daochu1',
                            onClick: this.checkNCId,
                            authority: '/foreEnd/business/account/expenses/ncpush',
                        },
                        {
                            label: '导出付款单',
                            authority: '/foreEnd/business/account/expenses/export',
                            download: this.downloadFn,
                            type: 'download',
                        },
                    ]}
                    fetch={this._fetch}
                    cols={columnsFn(this)}
                    pageData={{ ...expensesData }}
                    tips={this._renderTips(expensesData.list)}
                    rowSelectionConfig={this.rowSelectionConfig()}
                    scroll={{ x: 3100 }}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '100', '500', '1000', '5000', '10000'],
                    }}
                />
                <ModelQueue
                    modelShow={modelShow}
                    showBack={this.showBack}
                    showState={showState}
                    titleText="费用类台账传送NC"
                    data={queueData}
                />
            </>
        );
    }
}

export default Expenses;
