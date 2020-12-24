import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, message } from 'antd';
import moment from 'moment';
import PageDataView from '@/submodule/components/DataView';
import IconFont from '@/components/CustomIcon/IconFont';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import downRow from '@/assets/downRow.png';
import rightRow from '@/assets/rightRow.png';
import { FEE_APPLY_TYPE, PAY_STATUS, WRITE_OFF_STATUS } from '@/utils/enum';
import { getProjectList, getTalentList, getUserList as getAllUsers, getCompanyList } from '@/services/globalSearchApi';
import { thousandSeparatorFixed } from '@/utils/utils';
import DownLoad from '@/components/DownLoad';
import { DATETIME_FORMAT } from '@/utils/constants';
import { getFeeType } from '@/services/dictionary';
import BIDatePicker from '@/ant_components/BIDatePicker';
// eslint-disable-next-line
import AssociationSearch from '@/components/associationSearchFilter';
import BIInput from '@/ant_components/BIInput';
import BISelect from '@/ant_components/BISelect';
import { getCompanyDetail, getApplicationInfoDetail } from '@/services/globalDetailApi';
import styles from './index.less';
import { columnsFn, columnsChildFn } from './_selfColumn';

@connect(({ business_fee_apply, loading }) => {
    return {
        applyListPage: business_fee_apply.applyListPage,
        loading: loading.effects['business_fee_apply/getApply'],
    };
})
class ComList extends Component {
    constructor(props) {
        super(props);
        this.pageDataView = React.createRef();
        this.state = {
            applicationIdList: [],
            params: {},
            payList: [],
            paylistAffirm: {},
            paylistState: false,
            changePayInfoStatus: false,
            selectedRowKeys: [],
            changePayInfoCompany: '',
            changePayInfoBankName: '',
            changePayInfoBankNum: null,
            reimbursePayCompanyCode: '',
            changePayInfoBankList: [],
            changePayInfoBankInfo: [],
            nowDate: moment()
                .locale('zh-cn')
                .format('YYYY-MM-DD'),
        };
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

    fetchFn = async (beforeFetch) => {
        const data = beforeFetch();
        // 申请人
        if (data.applicationUserId) {
            if (data.applicationUserId.value === null) {
                data.applicationUserName = data.applicationUserId.label;
                data.applicationUserId = undefined;
            } else {
                data.applicationUserName = data.applicationUserId.label;
                data.applicationUserId = data.applicationUserId.value;
            }
        }
        // 项目名称
        if (data.applicationProjectId) {
            if (data.applicationProjectId.value === null) {
                data.applicationProjectName = data.applicationProjectId.label;
                data.applicationProjectId = undefined;
            } else {
                data.applicationProjectName = data.applicationProjectId.label;
                data.applicationProjectId = data.applicationProjectId.value;
            }
        }

        // 艺人名称
        if (data.applicationActorBlogerId) {
            if (data.applicationActorBlogerId.value === null) {
                data.applicationActorBlogerName = data.applicationActorBlogerId.label;
                data.applicationActorBlogerId = undefined;
            } else {
                data.applicationActorBlogerName = data.applicationActorBlogerId.label;
                data.applicationActorBlogerType = Number(data.applicationActorBlogerId.value.split('_')[1]);
                data.applicationActorBlogerId = Number(data.applicationActorBlogerId.value.split('_')[0]);
                data.applicationActorBlogerId = undefined;
            }
        }
        if (data.applicationApplyDeptId) {
            data.applicationApplyDeptId = data.applicationApplyDeptId.value;
        }
        if (data.applicationFeeTakerMainName) {
            data.applicationFeeTakerMainName = data.applicationFeeTakerMainName.label;
        }
        // 费用类型
        if (data.feeType !== undefined && data.feeType.length > 0) {
            data.feeTypeList = data.feeType.map((item) => {
                return item.value;
            });
        }
        delete data.feeType;
        if (data.applyDate && data.applyDate.length > 0) {
            data.applyStartTime = moment(data.applyDate[0]).format(DATETIME_FORMAT);
            data.applyEndTime = moment(data.applyDate[1]).format(DATETIME_FORMAT);
        }
        delete data.applyDate;
        this.setState({
            params: { ...data },
            selectedRowKeys: [],
            payList: [],
        });
        this.props.dispatch({
            type: 'business_fee_apply/getApply',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './apply/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: './apply/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './apply/edit',
            query: {
                id: val,
            },
        });
    };

    // tip 展示
    renderTipsFn = (total, totalMoney) => {
        return (
            <div className={styles.tips}>
                合计:
                {' '}
                <span className="weightFont">申请单数量</span>
                =
                {total}
                {' '}
                <span className="weightFont">申请总金额</span>
                =
                {(totalMoney && `¥ ${thousandSeparatorFixed(totalMoney)}`) || 0}
                {' '}
            </div>
        );
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
        const applicationIdList = [];
        const payList = [];
        selectedRows.map((item) => {
            applicationIdList.push(item.applicationId);
            payList.push({
                reimburseId: item.applicationId,
                reimburseTotalFee: item.applicationApplyTotalFee,
                reimburseApproveStatus: item.applicationApproveStatus,
                reimbursePayStatus: item.applicationPayStatus,
            });
        });
        this.setState({
            applicationIdList: Array.from(new Set(applicationIdList)),
            payList: Array.from(new Set(payList)),
        });
    };

    // rowSelection配置
    // rowSelectionConfig = () => {
    //     let applicationIdList = [];
    //     const payList = [];
    //     return {
    //         onChange: (selectedRowKeys, selectedRows) => {
    //             selectedRows.map(item => {
    //                 applicationIdList.push(item.applicationId);
    //                 payList.push({
    //                     reimburseId: item.applicationId,
    //                     reimburseTotalFee: item.applicationApplyTotalFee,
    //                     reimburseApproveStatus: item.applicationApproveStatus,
    //                     reimbursePayStatus: item.applicationPayStatus,
    //                 });
    //             });
    //             this.setState({
    //                 applicationIdList: Array.from(new Set(applicationIdList)),
    //                 payList: Array.from(new Set(payList)),
    //             });
    //         },
    //     };
    // };
    // 自定义展开icon
    customExpandIcon = (props) => {
        let text;
        if (props.expanded) {
            text = <img width="14px" height="8px" src={downRow} alt="" />;
        } else {
            text = <img width="8px" height="14px" src={rightRow} alt="" />;
        }
        return (
            <div
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
                style={{ cursor: 'pointer' }}
            >
                {text}
            </div>
        );
    };

    downloadFn = () => {
        const { params, applicationIdList } = this.state;
        return (
            <DownLoad
                loadUrl="/crmApi/application/export"
                params={{ method: 'post', data: { applicationIdList, ...params } }}
                fileName={() => {
                    return '费用申请付款单.xlsx';
                }}
                textClassName={styles.floatRight}
                text={
                    <BIButton className={styles.btn}>
                        <IconFont type="iconliebiaoye-daochu" />
                        {/* <img width="12px" style={{ marginRight: '4px' }} src={exportIcon} alt="" /> */}
                        导出付款单
                    </BIButton>
                }
                hideProgress
            />
        );
    };

    payAffirm = () => {
        const { payList } = this.state;
        if (payList && payList.length > 0) {
            const paylistAffirmId = [];
            let payTrue = 0;
            let payFlase = 0;
            let paylistAffirm = {};
            payList.map((item) => {
                if (item.reimburseApproveStatus === 3 && item.reimbursePayStatus === 0) {
                    paylistAffirmId.push(item.reimburseId);
                    payTrue += 1;
                } else {
                    payFlase += 1;
                }
            });
            paylistAffirm = Object.assign(
                {},
                {
                    paylistAffirmId,
                    payTrue,
                    payFlase,
                    payLength: payList.length,
                },
            );
            if (paylistAffirmId.length > 0) {
                this.setState({
                    paylistAffirm,
                    paylistState: true,
                });
            } else {
                message.warn('您选择的数据中0条符合条件，请重新选择符合条件的数据！');
            }
        } else {
            message.warn('请勾选要确认付款项');
        }
    };

    // 付款确认时间更改
    changePayDate = (data) => {
        this.setState({
            nowDate: data !== null ? moment(data).format('YYYY-MM-DD') : '',
        });
    };

    // 批量更改付款信息
    changePayInfo = () => {
        const { payList } = this.state;
        if (payList && payList.length > 0) {
            const paylistAffirmId = [];
            let changePayInfoTrue = 0;
            let changePayInfoFalse = 0;
            let paylistAffirm = {};
            payList.map((item) => {
                if (item.reimbursePayStatus === 1) {
                    changePayInfoFalse += 1;
                } else {
                    paylistAffirmId.push(item.reimburseId);
                    changePayInfoTrue += 1;
                }
            });
            paylistAffirm = Object.assign(
                {},
                {
                    paylistAffirmId,
                    changePayInfoTrue,
                    changePayInfoFalse,
                    payLength: payList.length,
                },
            );
            if (paylistAffirmId.length > 0) {
                this.setState({
                    paylistAffirm,
                    changePayInfoStatus: true,
                });
            } else {
                message.warn('您选择的数据中0条符合条件，请重新选择符合条件的数据！');
            }
        } else {
            message.warn('请勾选要变更付款信息的数据');
        }
    };

    payListData() {
        // 批量确认付款
        const { paylistAffirm, nowDate } = this.state;
        if (nowDate !== '') {
            this.props
                .dispatch({
                    type: 'business_fee_apply/applicationPayList',
                    payload: {
                        idList: paylistAffirm.paylistAffirmId || [],
                        confirmPayTime: nowDate,
                    },
                })
                .then(() => {
                    this.paylistClose();
                    this.props.dispatch({
                        type: 'business_fee_apply/getApply',
                        payload: this.state.params,
                    });
                    this.setState({
                        selectedRowKeys: [],
                        payList: [],
                    });
                });
        } else {
            message.warning('请填写付款确认时间！');
        }
    }

    paylistClose() {
        this.setState({
            paylistState: false,
        });
    }

    // 提交付款信息更改
    putChangePayInfo() {
        const {
            changePayInfoCompany,
            changePayInfoBankName,
            changePayInfoBankNum,
            reimbursePayCompanyCode,
            paylistAffirm,
        } = this.state;
        if (changePayInfoCompany === '') {
            message.warning('请选择公司主体！');
        } else if (changePayInfoBankName === '') {
            message.warning('请选择银行账号关联出开户行！');
        } else if (changePayInfoBankNum === null) {
            message.warning('请选择银行账号！');
        } else {
            const data = {
                idList: paylistAffirm.paylistAffirmId,
                applicationPayBankAcountNo: changePayInfoBankNum,
                applicationPayCompanyCode: reimbursePayCompanyCode,
                applicationPayCompanyId: changePayInfoCompany.value,
                applicationPayCompanyName: changePayInfoCompany.label,
                applicationPayBankAddress: changePayInfoBankName,
            };
            this.props.dispatch({
                type: 'business_fee_apply/putApplicationPayInfo',
                payload: {
                    data,
                    cb: () => {
                        message.success(
                            `仅${paylistAffirm.changePayInfoTrue}条数据完成付款信息变更，
                            剩余${paylistAffirm.changePayInfoFalse}条数据已完成付款，不可变更付款信息`,
                        );
                        this.closeChangePayInfo();
                        this.fetch();
                    },
                },
            });
        }
    }

    // 关闭付款信息更改
    closeChangePayInfo() {
        this.setState({
            changePayInfoStatus: false,
            changePayInfoCompany: '',
            changePayInfoBankName: '',
            changePayInfoBankNum: null,
            reimbursePayCompanyCode: '',
            changePayInfoBankList: [],
            changePayInfoBankInfo: [],
        });
    }

    render() {
        const { applyListPage } = this.props;
        const {
            paylistState,
            paylistAffirm,
            selectedRowKeys,
            nowDate,
            changePayInfoStatus,
            changePayInfoBankInfo,
            changePayInfoBankName,
            changePayInfoBankList,
        } = this.state;
        applyListPage.list = Array.isArray(applyListPage.list)
            ? applyListPage.list.map((item, index) => {
                return {
                    ...item,
                    index: index + 1,
                };
            })
            : [];
        const columns = columnsFn(this);
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const componentAttr = {
            request: (val) => {
                return getCompanyList({ pageNum: 1, pageSize: 50, companyName: val });
            },
            fieldNames: { value: 'companyId', label: 'companyName' },
        };
        return (
            <>
                <BIModal
                    visible={changePayInfoStatus}
                    onOk={() => {
                        return this.putChangePayInfo();
                    }}
                    onCancel={() => {
                        return this.closeChangePayInfo();
                    }}
                    title="付款信息变更"
                    destroyOnClose={true}
                >
                    <p className={styles.changePayInfoBox}>
                        <span>
                            <i>*</i>
                            公司主体：
                        </span>
                        <AssociationSearch
                            {...componentAttr}
                            className={styles.changePayInfoTerm}
                            placeholder="请选择公司主体"
                            getPopupContainer={(trigger) => {
                                return trigger.parentNode;
                            }}
                            onChange={async (values) => {
                                if (values !== undefined) {
                                    const res = await getCompanyDetail(values.value);
                                    if (res.success) {
                                        this.setState({
                                            changePayInfoCompany: values,
                                            reimbursePayCompanyCode: res.data.company.companyCode,
                                            changePayInfoBankList: res.data.companyBankList.map((item) => {
                                                return {
                                                    companyBankNo: item.companyBankNo,
                                                    companyBankName: item.companyBankName,
                                                };
                                            }),
                                            changePayInfoBankInfo: [],
                                        });
                                    }
                                } else {
                                    this.setState({
                                        changePayInfoCompany: '',
                                        changePayInfoBankName: '',
                                        changePayInfoBankNum: null,
                                        changePayInfoBankInfo: [],
                                    });
                                }
                            }}
                        />
                    </p>
                    <p className={styles.changePayInfoBox}>
                        <span>
                            <i>*</i>
                            开户行：
                        </span>
                        <BIInput
                            className={styles.changePayInfoTerm}
                            placeholder="请选择开户行"
                            disabled={true}
                            value={changePayInfoBankName}
                        />
                    </p>
                    <p className={styles.changePayInfoBox}>
                        <span>
                            <i>*</i>
                            银行账号：
                        </span>
                        <BISelect
                            className={styles.changePayInfoTerm}
                            placeholder="请选择银行账号"
                            labelInValue={true}
                            value={changePayInfoBankInfo}
                            getPopupContainer={(trigger) => {
                                return trigger.parentNode;
                            }}
                            onChange={(values) => {
                                this.setState({
                                    changePayInfoBankNum: values.label,
                                    changePayInfoBankName: values.key,
                                    changePayInfoBankInfo: [
                                        {
                                            value: values.label,
                                            key: values.key,
                                        },
                                    ],
                                });
                            }}
                        >
                            {changePayInfoBankList.map((item) => {
                                return (
                                    <BISelect.Option
                                        style={{ textAlign: 'left' }}
                                        key={item.companyBankNo}
                                        value={item.companyBankName}
                                    >
                                        {item.companyBankNo}
                                    </BISelect.Option>
                                );
                            })}
                        </BISelect>
                    </p>
                </BIModal>
                <BIModal
                    visible={paylistState}
                    onOk={() => {
                        return this.payListData();
                    }}
                    onCancel={() => {
                        return this.paylistClose();
                    }}
                    title="确认付款提示"
                    width={420}
                >
                    <p className={styles.payDateBox}>
                        请输入付款时间：
                        <BIDatePicker
                            placeholder="请输入付款时间"
                            className={styles.payDate}
                            onChange={this.changePayDate}
                            defaultValue={moment(nowDate, 'YYYY-MM-DD')}
                            allowClear
                            getCalendarContainer={(trigger) => {
                                return trigger.parentNode;
                            }}
                        />
                    </p>
                    <p style={{ fontSize: '14px', color: '#576877' }}>
                        {`您一共选中了${paylistAffirm.payLength}条数据，${paylistAffirm.payTrue}条符合条件，
                        ${paylistAffirm.payFlase}条不符合条件，此过程会触发生成台账且不可逆，是否进行付款确认？`}
                    </p>
                </BIModal>
                <PageDataView
                    ref={this.pageDataView}
                    rowKey="applicationId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'applicationProjectId',
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
                            {
                                key: 'applicationCode',
                                placeholder: '请输入申请单单号',
                                className: styles.searchCol,
                            },
                            {
                                key: 'applicationActorBlogerId',
                                placeholder: '请输入艺人名称',
                                className: styles.searchCol,
                                componentAttr: {
                                    suffixIcon: <Icon type="search" style={{ fontSize: '16px' }} />,
                                    request: (val) => {
                                        return getTalentList({
                                            pageNum: 1,
                                            pageSize: 300,
                                            talentName: val,
                                        });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: {
                                        value: (item) => {
                                            return `${item.talentId}_${item.talentType}`;
                                        },
                                        label: 'talentName',
                                    },
                                },
                                type: 'associationSearchFilter',
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
                                    showArrow: true,
                                },
                            },
                            {},
                        ],

                        [
                            {
                                key: 'applicationApproveStatus',
                                type: 'checkbox',
                                label: '审批状态',
                                options: FEE_APPLY_TYPE,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: FEE_APPLY_TYPE.find((item) => {
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
                                key: 'applicationPayStatus',
                                type: 'checkbox',
                                label: '付款状态',
                                options: PAY_STATUS,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: PAY_STATUS.find((item) => {
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
                    advancedSearchCols={[
                        [
                            {
                                key: 'applicationChequesName',
                                placeholder: '请输入收款对象名称',
                                className: styles.searchCol,
                            },
                            {
                                key: 'applicationUserId',
                                placeholder: '请输入申请人姓名',
                                className: styles.searchCol,
                                componentAttr: {
                                    suffixIcon: <Icon type="search" style={{ fontSize: '16px' }} />,
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
                                key: 'applicationChargeAgainstSatus',
                                type: 'checkbox',
                                label: '冲销状态',
                                options: WRITE_OFF_STATUS,
                                renderFormat: (value) => {
                                    const result = [];
                                    value.map((tax) => {
                                        result.push({
                                            id: tax,
                                            name: WRITE_OFF_STATUS.find((item) => {
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
                            label: '新增',
                            onClick: this.addFn,
                            authority: '/foreEnd/business/feeManage/apply/add',
                        },
                        {
                            label: '付款确认',
                            iconBtnSrc: 'iconliebiaoye-fukuanqueren', // payAffirmIcon
                            onClick: this.payAffirm,
                            authority: '/foreEnd/business/feeManage/apply/paylist',
                        },
                        {
                            label: '导出付款单',
                            authority: '/foreEnd/business/feeManage/apply/export',
                            download: this.downloadFn,
                            type: 'download',
                        },
                        {
                            label: '付款信息变更',
                            iconBtnSrc: 'iconliebiaoye-fukuanxinxibiangeng',
                            onClick: this.changePayInfo,
                            authority: '/foreEnd/business/feeManage/apply/changePayInfo',
                        },
                    ]}
                    fetch={this.fetchFn}
                    cols={columns}
                    tips={this.renderTipsFn(applyListPage.page.total, applyListPage.totalFee)}
                    pageData={applyListPage}
                    expandIcon={this.customExpandIcon}
                    expandedRowRender={(e) => {
                        return columnsChildFn(e);
                    }}
                    rowSelectionConfig={rowSelection}
                />
            </>
        );
    }
}

export default ComList;
