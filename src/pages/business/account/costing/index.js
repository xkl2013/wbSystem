/* eslint-disable */
import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageDataView from '@/components/DataView';
import IconFont from '@/components/CustomIcon/IconFont';
import ncIcon from '@/assets/nc-icon.png';
import { CONTRACT_SIGN_TYPE, EARNING_NC, COSTING_PROCEEDING, PROJECT_INFO_TYPE, TALENDT_TYPE } from '@/utils/enum';
import { getCompanyList, getCustomerList } from '@/services/globalSearchApi';
import { DATETIME_FORMAT } from '@/utils/constants';
import { str2intArr, thousandSeparatorFixed } from '@/utils/utils';
import BIButton from '@/ant_components/BIButton';
import DownLoad from '@/components/DownLoad';
import exportIcon from '@/assets/export.png';
import BIModal from '@/ant_components/BIModal';
import ModelQueue from '@/components/ModelQueue';
import { getFeeType } from '@/services/dictionary';
import { getTipsSum } from '../utils.js';
import { columnsFn } from './_selfColumn';
import { getProjectList, getTalentList } from '../services';
import styles from './index.less';

let taskTimePoll = null;
@connect(({ business_account, loading }) => {
    return {
        costingData: business_account.costingData,
        checkoutArr: business_account.checkoutArr,
        taskList: business_account.taskList,
        business_account,
        loading: loading.effects['business_account/postCostingData'],
    };
})
class Costing extends React.Component {
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

    getData = (data) => {
        this.props.dispatch({
            type: 'business_account/postCostingData',
            payload: data,
        });
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
        if (data.projectCostProjectName) {
            data.projectCostProjectName = data.projectCostProjectName.label;
        }
        // 目标艺人/博主
        if (data.projectCostTalentName) {
            data.projectCostTalentName = data.projectCostTalentName.label;
        }
        // 公司名称
        if (data.projectCostCompanyName) {
            data.projectCostCompanyName = data.projectCostCompanyName.label;
        }
        // 客户名称
        if (data.projectCostCustomerName) {
            data.projectCostCustomerName = data.projectCostCustomerName.label;
        }
        // 进度更新时间
        if (data.projectCostProgressUpdateTime && data.projectCostProgressUpdateTime.length > 0) {
            data.projectCostProgressUpdateTimeStart = moment(data.projectCostProgressUpdateTime[0]).format(
                DATETIME_FORMAT,
            );
            data.projectCostProgressUpdateTimeEnd = moment(data.projectCostProgressUpdateTime[1]).format(
                DATETIME_FORMAT,
            );
        }
        delete data.projectCostProgressUpdateTime;
        // nc时间
        if (data.projectCostTransferNcTime && data.projectCostTransferNcTime.length > 0) {
            data.projectCostTransferNcTimeStart = moment(data.projectCostTransferNcTime[0]).format(DATETIME_FORMAT);
            data.projectCostTransferNcTimeEnd = moment(data.projectCostTransferNcTime[1]).format(DATETIME_FORMAT);
        }
        delete data.projectCostTransferNcTime;
        // 签约方式
        if (data.projectCostContractWay != undefined && data.projectCostContractWay.length > 0) {
            data.projectCostContractWayList = str2intArr(data.projectCostContractWay);
        }
        delete data.projectCostContractWay;
        // 传送nc状态
        if (data.projectCostTransferNcStatus != undefined && data.projectCostTransferNcStatus.length > 0) {
            data.projectCostTransferNcStatusList = str2intArr(data.projectCostTransferNcStatus);
        }
        delete data.projectCostTransferNcStatus;
        // 事项
        if (data.projectCostThings != undefined && data.projectCostThings.length > 0) {
            data.projectCostThingsList = str2intArr(data.projectCostThings);
        }
        delete data.projectCostThings;
        // talent类型
        if (data.projectCostTalentType != undefined && data.projectCostTalentType.length > 0) {
            data.projectCostTalentTypeList = str2intArr(data.projectCostTalentType);
        }
        delete data.projectCostTalentType;
        // 费用类型
        if (data.projectCostFeeType != undefined) {
            data.projectCostFeeType = data.projectCostFeeType.value;
        }

        this.setState({
            params: { ...data },
        });
        this.props.dispatch({
            type: 'business_account/postCostingData',
            payload: data,
        });
    };

    // tip 展示
    _renderTips = (moneyTips) => {
        const arr = [
            { title: '台帐数量', value: '', unVal: '' },
            {
                title: '合同金额',
                value: 'projectCostContractAmount',
                unVal: 'projectCostContractCode',
            },
            {
                title: '公司金额',
                value: 'projectCostCompanyAmount',
                unVal: 'projectCostContractCode',
            },
            {
                title: '入帐金额',
                value: 'projectCostEntryAmount',
                unVal: '',
            },
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
                    selectId.push(item.projectCostId);
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
                loadUrl="/crmApi/ledger/cost/export"
                params={{ method: 'post', data: { selectId, ...params } }}
                fileName={() => {
                    return '项目合同成本台帐列表.xlsx';
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
                    type: 'cost',
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
                        type: 'cost',
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
                        type: 'cost',
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

    // 编辑跳转
    editDetail = (id) => {
        this.props.history.push({
            pathname: './costing/edit',
            query: {
                id,
            },
        });
    };

    transferNC = () => {
        const { validIds } = this.props.checkoutArr;
        this.props
            .dispatch({
                type: 'business_account/syncNCIds',
                payload: {
                    type: 'cost',
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
        const { costingData, taskList } = this.props;
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
                    rowKey="projectCostId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            // projectCostContractCode
                            {
                                key: 'projectCostContractCode',
                                placeholder: '请输入合同编号',
                                className: styles.searchCol,
                            },
                            // projectCostProjectName
                            {
                                key: 'projectCostProjectName',
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
                            // projectCostTalentName
                            {
                                key: 'projectCostTalentName',
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
                        ],
                        [
                            // projectCostProjectDetailClassify
                            {
                                key: 'projectCostProjectDetailClassify',
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
                                    form.projectCostProjectDetailClassify = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return value;
                                },
                            },
                            // projectCostCompanyName
                            {
                                key: 'projectCostCompanyName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入公司名称',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getCompanyList({
                                            companyName: val,
                                            // companyId: 0,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'companyId', label: 'companyName' },
                                },
                            },
                            // projectCostCustomerName
                            {
                                key: 'projectCostCustomerName',
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
                            // projectCostFeeType
                            {
                                key: 'projectCostFeeType',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择费用类型',
                                        },
                                    ],
                                },
                                placeholder: '请选择费用类型',
                                className: styles.selectTy,
                                type: 'associationSearch',
                                componentAttr: {
                                    request: (val) => {
                                        return getFeeType({ value: val });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'index', label: 'value' },
                                },
                            },
                        ],
                        [
                            // projectCostProgressUpdateTime
                            {
                                key: 'projectCostProgressUpdateTime',
                                label: '进度更新时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            // projectCostTransferNcTime
                            {
                                key: 'projectCostTransferNcTime',
                                label: '传送NC时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            // projectCostTransferNcTime
                            {
                                key: '',
                                label: '',
                                type: '',
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'projectCostContractWay',
                                type: 'checkbox',
                                label: '签约方式',
                                options: CONTRACT_SIGN_TYPE,
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
                                key: 'projectCostTalentType',
                                type: 'checkbox',
                                label: 'talent类型',
                                options: TALENDT_TYPE,
                            },
                        ],
                        [
                            // projectCostTransferNcStatus
                            {
                                key: 'projectCostTransferNcStatus',
                                type: 'checkbox',
                                label: '传送NC状态',
                                options: EARNING_NC,
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
                            // projectCostThings
                            {
                                key: 'projectCostThings',
                                type: 'checkbox',
                                label: '事项',
                                options: COSTING_PROCEEDING,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: COSTING_PROCEEDING.find((item) => {
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
                            iconBtnSrc: 'iconliebiaoye-daochu1', // ncIcon
                            onClick: this.checkNCId,
                            authority: '/foreEnd/business/account/costing/ncpush',
                        },
                        {
                            label: '导出付款单',
                            authority: '/foreEnd/business/account/costing/export',
                            download: this.downloadFn,
                            type: 'download',
                        },
                    ]}
                    fetch={this._fetch}
                    cols={columnsFn(this)}
                    pageData={costingData}
                    tips={this._renderTips(costingData.list)}
                    rowSelectionConfig={this.rowSelectionConfig()}
                    scroll={{ x: 3300 }}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '100', '500', '1000', '5000', '10000'],
                    }}
                />
                <ModelQueue
                    modelShow={modelShow}
                    showBack={this.showBack}
                    showState={showState}
                    titleText="项目合同成本确认台账传送NC"
                    data={queueData}
                />
            </>
        );
    }
}

export default Costing;
