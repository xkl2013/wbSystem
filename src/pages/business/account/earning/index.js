/* eslint-disable */
import React from 'react';
import { message, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageDataView from '@/components/DataView';
import exportIcon from '@/assets/export.png';
import ncIcon from '@/assets/nc-icon.png';
import IconFont from '@/components/CustomIcon/IconFont';
import { CONTRACT_SIGN_TYPE, EARNING_NC, EARNING_PROCEEDING, PROJECT_INFO_TYPE, TALENDT_TYPE } from '@/utils/enum';
import { getCompanyList, getCustomerList } from '@/services/globalSearchApi';
import { DATETIME_FORMAT } from '@/utils/constants';
import { str2intArr, thousandSeparatorFixed } from '@/utils/utils';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import DownLoad from '@/components/DownLoad';
import ModelQueue from '@/components/ModelQueue';
import { getTipsSum } from '../utils.js';
import { columnsFn } from './_selfColumn';
import { getProjectList, getTalentList } from '../services';
import styles from './index.less';

let taskTimePoll = null;

@connect(({ business_account, loading }) => {
    return {
        earningData: business_account.earningData,
        checkoutArr: business_account.checkoutArr,
        taskList: business_account.taskList,
        business_account,
        loading: loading.effects['business_account/postEarningData'],
    };
})
class Earning extends React.Component {
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
            transferIng: false,
        };
    }

    getData = (data) => {
        // this.props.dispatch({
        //     type: 'business_account/postEarningData',
        //     payload: data,
        // });
        this.fetch();
    };

    fetch = () => {
        const { pageDataView } = this.refs;
        if (pageDataView != null) {
            pageDataView.fetch();
        }
    };

    _fetch = (beforeFetch) => {
        const data = beforeFetch();
        // 项目名称
        if (data.projectInputProjectName) {
            data.projectInputProjectName = data.projectInputProjectName.label;
        }
        // 目标艺人/博主
        if (data.projectInputTalentName) {
            data.projectInputTalentName = data.projectInputTalentName.label;
        }
        // 公司名称
        if (data.projectInputCompanyName) {
            data.projectInputCompanyName = data.projectInputCompanyName.label;
        }
        // 客户名称
        if (data.projectInputCustomerName) {
            data.projectInputCustomerName = data.projectInputCustomerName.label;
        }
        // 进度更新时间
        if (data.projectInputProgressUpdateTime && data.projectInputProgressUpdateTime.length > 0) {
            data.projectInputProgressUpdateTimeStart = moment(data.projectInputProgressUpdateTime[0]).format(
                DATETIME_FORMAT,
            );
            data.projectInputProgressUpdateTimeEnd = moment(data.projectInputProgressUpdateTime[1]).format(
                DATETIME_FORMAT,
            );
        }
        delete data.projectInputProgressUpdateTime;
        // 回款更新时间
        if (data.projectInputTrulyCashTime && data.projectInputTrulyCashTime.length > 0) {
            data.projectInputTrulyCashTimeStart = moment(data.projectInputTrulyCashTime[0]).format(DATETIME_FORMAT);
            data.projectInputTrulyCashTimeEnd = moment(data.projectInputTrulyCashTime[1]).format(DATETIME_FORMAT);
        }
        delete data.projectInputTrulyCashTime;
        // 开票更新时间
        if (data.projectInputInvoiceTime && data.projectInputInvoiceTime.length > 0) {
            data.projectInputInvoiceTimeStart = moment(data.projectInputInvoiceTime[0]).format(DATETIME_FORMAT);
            data.projectInputInvoiceTimeEnd = moment(data.projectInputInvoiceTime[1]).format(DATETIME_FORMAT);
        }
        delete data.projectInputInvoiceTime;
        // nc时间
        if (data.projectInputTransferNcTime && data.projectInputTransferNcTime.length > 0) {
            data.projectInputTransferNcTimeStart = moment(data.projectInputTransferNcTime[0]).format(DATETIME_FORMAT);
            data.projectInputTransferNcTimeEnd = moment(data.projectInputTransferNcTime[1]).format(DATETIME_FORMAT);
        }
        delete data.projectInputTransferNcTime;
        // 开票更新时间
        if (data.projectInputInvoiceUpdateTime && data.projectInputInvoiceUpdateTime.length > 0) {
            data.projectInputInvoiceUpdateTimeStart = moment(data.projectInputInvoiceUpdateTime[0]).format(
                DATETIME_FORMAT,
            );
            data.projectInputInvoiceUpdateTimeEnd = moment(data.projectInputInvoiceUpdateTime[1]).format(
                DATETIME_FORMAT,
            );
        }
        delete data.projectInputInvoiceUpdateTime;
        // 上线时间
        if (data.projectingOnlineDate && data.projectingOnlineDate.length > 0) {
            data.projectingOnlineDateStart = moment(data.projectingOnlineDate[0]).format(DATETIME_FORMAT);
            data.projectingOnlineDateEnd = moment(data.projectingOnlineDate[1]).format(DATETIME_FORMAT);
        }
        delete data.projectingOnlineDate;
        // 签约方式
        if (data.projectInputContractWay != undefined && data.projectInputContractWay.length > 0) {
            data.projectInputContractWayList = str2intArr(data.projectInputContractWay);
        }
        delete data.projectInputContractWay;
        // 传送nd状态
        if (data.projectInputTransferNcStatus != undefined && data.projectInputTransferNcStatus.length > 0) {
            data.projectInputTransferNcStatusList = str2intArr(data.projectInputTransferNcStatus);
        }
        delete data.projectInputTransferNcStatus;
        // 事项
        if (data.projectInputThings != undefined && data.projectInputThings.length > 0) {
            data.projectInputThingsList = str2intArr(data.projectInputThings);
        }
        delete data.projectInputThings;
        // talent类型
        if (data.projectInputTalentType != undefined && data.projectInputTalentType.length > 0) {
            data.projectInputTalentTypeList = str2intArr(data.projectInputTalentType);
        }
        delete data.projectInputTalentType;
        this.setState({
            params: { ...data },
        });
        this.props.dispatch({
            type: 'business_account/postEarningData',
            payload: data,
        });
    };

    // tip 展示
    _renderTips = (moneyTips) => {
        const arr = [
            { title: '台帐数量', value: '', unVal: '' },
            {
                title: '合同金额',
                value: 'projectInputContractTotalAmount',
                unVal: 'projectInputContractCode',
            },
            {
                title: '公司金额',
                value: 'projectInputCompanyTotalAmount',
                unVal: 'projectInputContractCode',
            },
            { title: '回款金额', value: 'projectInputCashAmount', unVal: '' },
            { title: '开票金额', value: 'projectInputInvoiceAmount', unVal: '' },
            { title: '未税金额', value: 'projectInputNoTax', unVal: '' },
            { title: '税额', value: 'projectInputTaxAmount', unVal: '' },
            { title: '入帐金额', value: 'projectInputEntryAmount', unVal: '' },
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
                        <b>{item.title}</b>={thousandSeparatorFixed(getTipsSum(moneyTips, item.value, item.unVal))}
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

    rowSelectionConfig = () => {
        const selectId = [];
        return {
            onChange: (selectedRowKeys, selectedRows) => {
                selectedRows.map((item) => {
                    selectId.push(item.projectInputId);
                });
                this.setState({
                    selectId: Array.from(new Set(selectId)),
                });
            },
        };
    };
    onBeforeLoad = () => {
        const { params, selectId } = this.state;
        this.setState({ exporting: true });
        if (!selectId || selectId.length === 0) {
            message.warn('导出数据量较大，请勿关闭页面，耐心等待2-3分钟，谢谢！', 4);
        }
    };
    downloadFn = () => {
        const { params, selectId } = this.state;
        return (
            <DownLoad
                loadUrl="/crmApi/ledger/input/export"
                params={{ method: 'post', data: { selectId, ...params } }}
                fileName={() => {
                    return '项目合同收入台帐列表.xlsx';
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

    componentDidMount() {
        clearTimeout(taskTimePoll);
        this.fetch();
        this.getTaskList();
    }

    componentWillUnmount() {
        clearTimeout(taskTimePoll);
    }

    getTaskList = () => {
        clearTimeout(taskTimePoll);
        this.props
            .dispatch({
                type: 'business_account/getSyncTaskList',
                payload: {
                    type: 'input',
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
                        type: 'input',
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
                        type: 'input',
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
        this.setState({ transferIng: true });
        this.props
            .dispatch({
                type: 'business_account/syncNCIds',
                payload: {
                    type: 'input',
                    data: validIds,
                },
            })
            .then((res) => {
                if (res.success === true) {
                    this.setState({ showState: true, checkIDState: false, checkStateObj: {}, transferIng: false });
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
        const { earningData, taskList } = this.props;
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
                    confirmLoading={this.state.transferIng}
                    width={420}
                >
                    <p style={{ fontSize: '14px', color: '#576877' }}>
                        {`您本次共选择台账数量为${checkStateObj.allLen}，${checkStateObj.validIdsLen}条符合条件，${checkStateObj.invalidIdsLen}条不符合条件，此过程会持续较长时间且不可逆，是否确定推送NC？`}
                    </p>
                </BIModal>

                <PageDataView
                    style={modelShow ? { paddingBottom: '44px' } : null}
                    ref="pageDataView"
                    rowKey="projectInputId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'projectInputContractCode',
                                placeholder: '请输入合同编号',
                                className: styles.searchCol,
                            },
                            {
                                key: 'projectInputProjectName',
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
                                key: 'projectInputTalentName',
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
                        ],
                        [
                            {
                                key: 'projectInputProjectDetailClassify',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择项目明细分类',
                                        },
                                    ],
                                },
                                placeholder: '请选择项目明细分类',
                                className: styles.selectTy,
                                type: 'select',
                                options: PROJECT_INFO_TYPE,
                                getFormat: (value, form) => {
                                    form.projectingCategory = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return String(value);
                                },
                            },
                            {
                                key: 'projectInputCompanyName',
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
                                key: 'projectInputCustomerName',
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
                        ],
                        [
                            {
                                key: 'projectInputProgressUpdateTime',
                                label: '进度更新时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'projectInputTrulyCashTime',
                                label: '实际回款时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'projectInputInvoiceUpdateTime',
                                label: '开票更新时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'projectInputTransferNcTime',
                                label: '传送NC时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'projectInputInvoiceTime',
                                label: '发票开具时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'projectingOnlineDate',
                                label: '上线时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'projectInputContractWay',
                                type: 'checkbox',
                                label: '签约方式',
                                options: CONTRACT_SIGN_TYPE,
                                className: styles.checkTy,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: CONTRACT_SIGN_TYPE.find((item) => {
                                                return item.id == tax;
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
                                key: 'projectInputTransferNcStatus',
                                type: 'checkbox',
                                label: '传送NC状态',
                                options: EARNING_NC,
                                className: styles.checkTY,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: EARNING_NC.find((item) => {
                                                return item.id == tax;
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
                                key: 'projectInputTalentType',
                                type: 'checkbox',
                                label: 'talent类型',
                                options: TALENDT_TYPE,
                            },
                        ],
                        [
                            {
                                key: 'projectInputThings',
                                type: 'checkbox',
                                label: '事项',
                                options: EARNING_PROCEEDING,
                                className: styles.checkTY,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: EARNING_PROCEEDING.find((item) => {
                                                return item.id == tax;
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
                            authority: '/foreEnd/business/account/earning/ncpush',
                        },
                        {
                            label: '导出付款单',
                            authority: '/foreEnd/business/account/earning/export',
                            download: this.downloadFn,
                            type: 'download',
                        },
                    ]}
                    fetch={this._fetch}
                    cols={columnsFn(this)}
                    pageData={{ ...earningData }}
                    tips={this._renderTips(earningData.list)}
                    rowSelectionConfig={this.rowSelectionConfig()}
                    scroll={{ x: 3810 }}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '100', '500', '1000', '5000', '10000'],
                    }}
                />
                <ModelQueue
                    modelShow={modelShow}
                    showBack={this.showBack}
                    showState={showState}
                    titleText="项目合同收入确认台账传送NC"
                    data={queueData}
                />
            </>
        );
    }
}

export default Earning;
