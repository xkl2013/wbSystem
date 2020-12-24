/* eslint-disable */
import React from 'react';
import { message, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageDataView from '@/components/DataView';
import exportIcon from '@/assets/export.png';
import IconFont from '@/components/CustomIcon/IconFont';
import ncIcon from '@/assets/nc-icon.png';
import {
    BX_FEE_TYPE,
    TRAVEL_PROCEEDING,
    TALENDT_TYPE,
    TRAVEL_ORDER_TYPE,
    TRAVEL_ORDER_STATUS,
    TRANSMIT_NC_STATUS,
} from '@/utils/enum';
import { getCompanyList, getUserList } from '@/services/globalSearchApi';
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
        travelData: business_account.travelData,
        checkoutArr: business_account.checkoutArr,
        taskList: business_account.taskList,
        business_account,
        loading: loading.effects['business_account/postTravelData'],
    };
})
class Travel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectId: [],
            params: {},
            checkIDState: false,
            checkStateObj: {},
            showState: false,
            modelShow: false,
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

    getData = (data) => {
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
        console.log(data);
        // 订单号
        if (data.travelOrderNo === '') {
            delete data.travelOrderNo;
        }
        // 出差申请编号
        if (data.travelApplyCode === '') {
            delete data.travelApplyCode;
        }
        // 费用类型
        if (data.travelFeeType) {
            data.travelFeeType = Number(data.travelFeeType);
        }
        // 下单人
        if (data.travelOrderUser) {
            if (data.travelOrderUser.value === null) {
                data.travelOrderUserName = data.travelOrderUser.label;
            } else {
                data.travelOrderUserId = data.travelOrderUser.value;
                data.travelOrderUserName = data.travelOrderUser.label;
            }
            delete data.travelOrderUser;
        }
        // 申请人
        if (data.travelApplyUser) {
            if (data.travelApplyUser.value === null) {
                data.travelApplyUserName = data.travelApplyUser.label;
            } else {
                data.travelApplyUserId = data.travelApplyUser.value;
                data.travelApplyUserName = data.travelApplyUser.label;
            }
            delete data.travelApplyUser;
        }
        // 项目名称
        if (data.travelProject) {
            if (data.travelProject.value === null) {
                data.travelProjectName = data.travelProject.label;
            } else {
                data.travelProjectId = data.travelProject.value;
                data.travelProjectName = data.travelProject.label;
            }
            delete data.travelProject;
        }
        // 艺人或博主
        if (data.travelTalent) {
            if (data.travelTalentCode.value === null) {
                data.travelTalentName = data.travelTalent.label;
            } else {
                data.travelTalentCode = data.travelTalent.value;
                data.travelTalentName = data.travelTalent.label;
            }
            delete data.travelTalent;
        }
        // 费用承担主体
        if (data.travelFeeBearCompanyName) {
            if (data.travelFeeBearCompanyId.value === null) {
                data.travelFeeBearCompanyName = data.travelFeeBearCompanyName.label;
            } else {
                data.travelFeeBearCompanyId = data.travelFeeBearCompanyName.value;
                data.travelFeeBearCompanyName = data.travelFeeBearCompanyName.label;
            }
        }
        // 费用承担部门
        if (data.travelFeeBearDeptName) {
            data.travelFeeBearDeptName = data.travelFeeBearDeptName.label;
        }
        // 订单日期
        if (data.travelOrderTime && data.travelOrderTime.length > 0) {
            data.travelOrderTimeStart = moment(data.travelOrderTime[0]).format(DATETIME_FORMAT);
            data.travelOrderTimeEnd = moment(data.travelOrderTime[1]).format(DATETIME_FORMAT);
        }
        delete data.travelOrderTime;
        // 审批通过时间
        if (data.travelAuditFinishTime && data.travelAuditFinishTime.length > 0) {
            data.travelAuditFinishTimeStart = moment(data.travelAuditFinishTime[0]).format(DATETIME_FORMAT);
            data.travelAuditFinishTimeEnd = moment(data.travelAuditFinishTime[1]).format(DATETIME_FORMAT);
        }
        delete data.travelAuditFinishTime;
        // 付款完成日期
        if (data.travelPayConfirmTime && data.travelPayConfirmTime.length > 0) {
            data.travelPayConfirmTimeStart = moment(data.travelPayConfirmTime[0]).format(DATETIME_FORMAT);
            data.travelPayConfirmTimeEnd = moment(data.travelPayConfirmTime[1]).format(DATETIME_FORMAT);
        }
        delete data.travelPayConfirmTime;
        // 传送NC时间
        if (data.travelNcTime && data.travelNcTime.length > 0) {
            data.travelNcTimeStart = moment(data.travelNcTime[0]).format(DATETIME_FORMAT);
            data.travelNcTimeEnd = moment(data.travelNcTime[1]).format(DATETIME_FORMAT);
        }
        delete data.travelNcTime;
        // 事项
        if (data.travelThingsList != undefined && data.travelThingsList.length > 0) {
            data.travelThingsList = str2intArr(data.travelThingsList);
        }
        // delete data.travelThingsList;
        // 订单类型
        if (data.travelOrderTypeList != undefined && data.travelOrderTypeList.length > 0) {
            data.travelOrderTypeList = str2intArr(data.travelOrderTypeList);
        }
        // delete data.travelOrderTypeList;
        // 订单状态
        if (data.travelOrderStatusList != undefined && data.travelOrderStatusList.length > 0) {
            data.travelOrderStatusList = str2intArr(data.travelOrderStatusList);
        }
        // delete data.travelOrderStatusList;
        // 传送NC状态
        if (data.travelNcStatusList != undefined && data.travelNcStatusList.length > 0) {
            data.travelNcStatusList = str2intArr(data.travelNcStatusList);
        }
        // delete data.travelNcStatusList;
        // talent类型
        if (data.travelTalentTypeList != undefined && data.travelTalentTypeList.length > 0) {
            data.travelTalentTypeList = str2intArr(data.travelTalentTypeList);
        }
        // delete data.travelTalentTypeList;
        this.setState({
            params: { ...data },
        });
        this.props.dispatch({
            type: 'business_account/postTravelData',
            payload: data,
        });
    };

    // tip 展示
    _renderTips = (moneyTips) => {
        const arr = [
            { title: '台帐数量', value: '', unVal: '' },
            {
                title: '订单金额',
                value: 'travelOrderMoney',
                unVal: '',
            },
            {
                title: '保险金额',
                value: 'travelInsuranceMoney',
                unVal: '',
            },
            { title: '税额', value: 'travelTaxMoney', unVal: '' },
            { title: '未税金额', value: 'travelNoTaxMoney', unVal: '' },
            { title: '服务费', value: 'travelServiceMoney', unVal: '' },
            { title: '退改手续费', value: 'travelRefundChangeMoney', unVal: '' },
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
                    selectId.push(item.travelId);
                });
                this.setState({
                    selectId: Array.from(new Set(selectId)),
                });
            },
        };
    };

    downloadFn = () => {
        const { params, selectId } = this.state;
        return selectId.length > 0 ? (
            <DownLoad
                loadUrl="/crmApi/ledger/travel/export"
                params={{ method: 'post', data: { selectId, ...params } }}
                fileName={() => {
                    return '差旅台帐列表.xlsx';
                }}
                textClassName={styles.floatRight}
                text={
                    <BIButton className={styles.btn}>
                        <IconFont type="iconliebiaoye-daochu" />
                        {/* <img width="12px" style={{ marginRight: '4px' }} src={exportIcon} alt="" /> */}
                        导出
                    </BIButton>
                }
                hideProgress
            />
        ) : (
            <BIButton
                className={styles.btn}
                style={{ marginLeft: '10px' }}
                onClick={() => {
                    return message.warn('请勾选要导出项');
                }}
            >
                <IconFont type="iconliebiaoye-daochu" />
                {/* <img width="12px" style={{ marginRight: '4px' }} src={exportIcon} alt="" /> */}
                导出
            </BIButton>
        );
    };

    getTaskList = () => {
        clearTimeout(taskTimePoll);
        this.props
            .dispatch({
                type: 'business_account/getSyncTaskList',
                payload: {
                    type: 'travel',
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
                        type: 'travel',
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
                        type: 'travel',
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
                    type: 'travel',
                    data: validIds,
                },
            })
            .then((res) => {
                if (res.success) {
                    this.setState({ showState: true, checkIDState: false, checkStateObj: {} });
                    this.getTaskList();
                    this.fetch();
                } else {
                    message.error(res.message);
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
        const { travelData, taskList } = this.props;
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
                    rowKey="projectInputId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'travelOrderNo',
                                placeholder: '请输入订单号',
                                className: styles.searchCol,
                                componentAttr: {
                                    allowClear: true,
                                },
                            },
                            {
                                key: 'travelApplyCode',
                                placeholder: '请输入出差申请编号',
                                className: styles.searchCol,
                                componentAttr: {
                                    allowClear: true,
                                },
                            },
                            {
                                key: 'travelFeeType',
                                placeholder: '请选择费用类型',
                                type: 'select',
                                options: BX_FEE_TYPE,
                                componentAttr: {
                                    allowClear: true,
                                },
                                className: styles.selectTy,
                                getFormat: (value, form) => {
                                    form.travelFeeType = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return String(value);
                                },
                            },
                        ],
                        [
                            {
                                key: 'travelOrderUser',
                                type: 'associationSearchFilter',
                                placeholder: '请选择下单人',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getUserList({
                                            userChsName: val,
                                            pageSize: 50,
                                            pageNum: 1,
                                        });
                                    },
                                    fieldNames: { value: 'userId', label: 'userChsName' },
                                },
                            },
                            {
                                key: 'travelApplyUser',
                                type: 'associationSearchFilter',
                                placeholder: '请选择申请人',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getUserList({
                                            userChsName: val,
                                            pageSize: 50,
                                            pageNum: 1,
                                        });
                                    },
                                    fieldNames: { value: 'userId', label: 'userChsName' },
                                },
                            },
                            {
                                key: 'travelProject',
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
                                    fieldNames: { value: 'projectId', label: 'projectName' },
                                },
                            },
                        ],
                        [
                            {
                                key: 'travelTalent',
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
                                    fieldNames: {
                                        value: (val) => {
                                            return `${val.talentId}_${val.talentType}`;
                                        },
                                        label: 'talentName',
                                    },
                                },
                            },
                            {
                                key: 'travelFeeBearCompanyName',
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
                                    fieldNames: { value: 'companyId', label: 'companyName' },
                                },
                                getFormat: (values, form) => {
                                    form.travelFeeBearCompanyId = values.value;
                                    form.travelFeeBearCompanyName = values.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.travelFeeBearCompanyName,
                                        value: form.travelFeeBearCompanyId,
                                    };
                                },
                            },
                            {
                                key: 'travelFeeBearDeptName',
                                placeholder: '请选择费用承担部门',
                                type: 'orgtree',
                                className: styles.searchCls,
                                getFormat: (values, form) => {
                                    form.travelFeeBearDeptId = values.value;
                                    form.travelFeeBearDeptName = values.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.travelFeeBearDeptName,
                                        value: form.travelFeeBearDeptId,
                                    };
                                },
                            },
                        ],
                        [
                            {
                                key: 'travelOrderTime',
                                label: '订单日期',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'travelAuditFinishTime',
                                label: '审批通过时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {
                                key: 'travelPayConfirmTime',
                                label: '付款完成日期',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                        ],
                        [
                            {
                                key: 'travelNcTime',
                                label: '传送NC时间',
                                type: 'daterange',
                                placeholder: ['起始日期', '截止日期'],
                                className: styles.dateRangeCls,
                            },
                            {},
                            {},
                        ],
                        [
                            {
                                key: 'travelThingsList',
                                type: 'checkbox',
                                label: '事项',
                                options: TRAVEL_PROCEEDING,
                            },
                        ],
                        [
                            {
                                key: 'travelOrderTypeList',
                                type: 'checkbox',
                                label: '订单类型',
                                options: TRAVEL_ORDER_TYPE,
                            },
                        ],
                        [
                            {
                                key: 'travelOrderStatusList',
                                type: 'checkbox',
                                label: '订单状态',
                                options: TRAVEL_ORDER_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'travelNcStatusList',
                                type: 'checkbox',
                                label: '传送NC状态',
                                options: TRANSMIT_NC_STATUS,
                            },
                        ],
                        [
                            {
                                key: 'travelTalentTypeList',
                                type: 'checkbox',
                                label: 'talent类型',
                                options: TALENDT_TYPE,
                            },
                        ],
                    ]}
                    btns={[
                        {
                            label: '传送NC',
                            iconBtnSrc: 'iconliebiaoye-daochu1',
                            onClick: this.checkNCId,
                            authority: '/foreEnd/business/account/travel/ncpush',
                        },
                        {
                            label: '导出付款单',
                            authority: '/foreEnd/business/account/travel/export',
                            download: this.downloadFn,
                            type: 'download',
                        },
                    ]}
                    fetch={this._fetch}
                    cols={columnsFn(this)}
                    pageData={{ ...travelData }}
                    tips={this._renderTips(travelData.list)}
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
                    titleText="差旅台账传送NC"
                    data={queueData}
                />
            </>
        );
    }
}

export default Travel;
