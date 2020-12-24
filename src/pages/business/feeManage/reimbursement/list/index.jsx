import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, message } from 'antd';
import moment from 'moment';
import PageDataView from '@/submodule/components/DataView';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import downRow from '@/assets/downRow.png';
import rightRow from '@/assets/rightRow.png';
import IconFont from '@/components/CustomIcon/IconFont';
import { FEE_APPLY_TYPE, PAY_STATUS, REIMBURSE_SOURCE } from '@/utils/enum';
import { getProjectList, getUserList as getAllUsers, getTalentList, getCompanyList } from '@/services/globalSearchApi';
import { thousandSeparatorFixed } from '@/utils/utils';
import DownLoad from '@/components/DownLoad';
import { DATETIME_FORMAT } from '@/utils/constants';

import BIDatePicker from '@/ant_components/BIDatePicker';
// eslint-disable-next-line
import AssociationSearchFilter from '@/components/associationSearchFilter';
import BIInput from '@/ant_components/BIInput';
import BISelect from '@/ant_components/BISelect';
import { getCompanyDetail, getReimburseInfoDetail } from '@/services/globalDetailApi';
import styles from './index.less';
import { columnsFn, columnsChildFn } from './_selfColumn';

@connect(({ business_fee_reimburse, loading }) => {
    return {
        reimbursesListPage: business_fee_reimburse.reimbursesListPage,
        loading: loading.effects['business_fee_reimburse/getReimburses'],
    };
})
class ComList extends Component {
    constructor(props) {
        super(props);
        this.pageDataView = React.createRef();
        this.state = {
            reimburseIdList: [],
            params: {},
            payList: [],
            paylistAffirm: {},
            paylistState: false,
            changePayInfoStatus: false,
            selectedRowKeys: [],
            changePayInfoCompany: '',
            changePayInfoBankInfo: [],
            changePayInfoBankName: '',
            changePayInfoBankNum: null,
            reimbursePayCompanyCode: '',
            changePayInfoBankList: [],
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
        // 项目名称
        if (data.projectId) {
            if (data.projectId.value === null) {
                data.projectName = data.projectId.label;
                data.projectId = undefined;
            } else {
                data.projectName = data.projectId.label;
                data.projectId = data.projectId.value;
            }
        }
        if (data.reimburseUserId) {
            if (data.reimburseUserId.value === null) {
                data.reimburseUserName = data.reimburseUserId.label;
                data.reimburseUserId = undefined;
            } else {
                data.reimburseUserName = data.reimburseUserId.label;
                data.reimburseUserId = data.reimburseUserId.value;
            }
        }
        if (data.deptId) {
            data.deptId = data.deptId.value;
        }
        if (data.artistName) {
            if (data.artistName.value === null) {
                data.applicationActorBlogerName = data.artistName.label;
                data.artistName = undefined;
            } else {
                data.applicationActorBlogerId = Number(data.artistName.value.split('_')[0]);
                data.applicationActorBlogerType = Number(data.artistName.value.split('_')[1]);
                data.applicationActorBlogerName = data.artistName.label;
                data.artistName = undefined;
            }
        }
        if (data.applyDate && data.applyDate.length > 0) {
            data.applyDateStart = moment(data.applyDate[0]).format(DATETIME_FORMAT);
            data.applyDateEnd = moment(data.applyDate[1]).format(DATETIME_FORMAT);
        }
        delete data.applyDate;
        if (data.reimburseFeeTakerMainName) {
            if (data.reimburseFeeTakerMainName.value === null) {
                data.reimburseFeeTakerMainName = undefined;
            } else {
                data.reimburseFeeTakerMainName = data.reimburseFeeTakerMainName.label;
            }
        }
        this.setState({
            params: {
                projectId: data.projectId,
                supplierName: data.supplierName,
                reimburseCode: data.reimburseCode,
                reimburseUserId: data.reimburseUserId,
                applyDateStart: data.applyDateStart,
                applyDateEnd: data.applyDateEnd,
                approvalStatus: data.approvalStatus,
                paymentStatus: data.paymentStatus,
            },
            selectedRowKeys: [],
            payList: [],
        });
        this.props.dispatch({
            type: 'business_fee_reimburse/getReimburses',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './reimbursement/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: './reimbursement/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './reimbursement/edit',
            query: {
                id: val,
            },
        });
    };

    // tip 展示
    renderTipsFn = (total, totalMoney) => {
        return (
            <div className={styles.tips}>
                合计：
                <span className="weightFont">报销单数量</span>
                =
                {total}
                {' '}
                <span className="weightFont">报销总金额</span>
                =
                {(totalMoney && `¥ ${thousandSeparatorFixed(totalMoney)}`) || 0}
                {' '}
            </div>
        );
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
        const reimburseIdList = [];
        const payList = [];
        selectedRows.map((item) => {
            reimburseIdList.push(item.reimburseId);
            payList.push({
                reimburseId: item.reimburseId,
                reimburseTotalFee: item.reimburseTotalFee,
                reimburseApproveStatus: item.reimburseApproveStatus,
                reimbursePayStatus: item.reimbursePayStatus,
            });
        });
        this.setState({
            reimburseIdList: Array.from(new Set(reimburseIdList)),
            payList: Array.from(new Set(payList)),
        });
    };

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
                style={{ cursor: 'pointer' }}
            >
                {text}
            </div>
        );
    };

    downloadFn = () => {
        const { params, reimburseIdList } = this.state;
        return (
            <DownLoad
                loadUrl="/crmApi/reimburse/export"
                params={{ method: 'post', data: { reimburseIdList, ...params } }}
                fileName={() => {
                    return '费用报销付款单.xlsx';
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
                    type: 'business_fee_reimburse/reimbursePayList',
                    payload: {
                        idList: paylistAffirm.paylistAffirmId || [],
                        confirmPayTime: nowDate,
                    },
                })
                .then(() => {
                    this.paylistClose();
                    this.props.dispatch({
                        type: 'business_fee_reimburse/getReimburses',
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
                reimbursePayBankAcountNo: changePayInfoBankNum,
                reimbursePayCompanyCode,
                reimbursePayCompanyId: changePayInfoCompany.value,
                reimbursePayCompanyName: changePayInfoCompany.label,
                reimbursePayBankAddress: changePayInfoBankName,
            };
            this.props.dispatch({
                type: 'business_fee_reimburse/putReimbursePayInfo',
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
        const { reimbursesListPage } = this.props;
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
        reimbursesListPage.list = Array.isArray(reimbursesListPage.list)
            ? reimbursesListPage.list.map((item, index) => {
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

                        <AssociationSearchFilter
                            {...componentAttr}
                            className={styles.changePayInfoTerm}
                            placeholder="请选择公司主体"
                            getPopupContainer={(trigger) => {
                                return trigger.parentNode;
                            }}
                            initDataType="onfocus"
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
                            getCalendarContainer={(trigger) => {
                                return trigger.parentNode;
                            }}
                            defaultValue={moment(nowDate, 'YYYY-MM-DD')}
                            allowClear
                        />
                    </p>
                    <p style={{ fontSize: '14px', color: '#576877' }}>
                        {`您一共选中了${paylistAffirm.payLength}条数据，${paylistAffirm.payTrue}条符合条件，
                        ${paylistAffirm.payFlase}条不符合条件，此过程会触发生成台账且不可逆，是否进行付款确认？`}
                    </p>
                </BIModal>
                <PageDataView
                    ref={this.pageDataView}
                    rowKey="reimburseId"
                    loading={this.props.loading}
                    searchCols={[
                        [
                            {
                                key: 'projectId',
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
                                key: 'reimburseCode',
                                placeholder: '请输入报销单单号',
                                className: styles.searchCol,
                            },
                            {
                                key: 'artistName',
                                placeholder: '请输入艺人名称',
                                className: styles.searchCol,
                                componentAttr: {
                                    suffixIcon: <Icon type="search" style={{ fontSize: '16px' }} />,
                                    request: (val) => {
                                        return getTalentList({
                                            talentName: val,
                                            pageSize: 50,
                                            pageNum: 1,
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
                                type: 'associationSearchFilter',
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
                                key: 'approvalStatus',
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
                                key: 'paymentStatus',
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
                                key: 'supplierName',
                                placeholder: '请输入收款对象名称',
                                className: styles.searchCol,
                            },
                            {
                                key: 'reimburseUserId',
                                placeholder: '请输入实际报销人',
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
                                key: 'deptId',
                                placeholder: '请输入实际报销人所属部门',
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
                                key: 'reimburseSource',
                                type: 'checkbox',
                                label: '费用报销来源',
                                options: REIMBURSE_SOURCE,
                            },
                        ],
                    ]}
                    btns={[
                        {
                            label: '新增',
                            onClick: this.addFn,
                            authority: '/foreEnd/business/feeManage/reimbursement/add',
                        },
                        {
                            label: '导出付款单',
                            authority: '/foreEnd/business/feeManage/reimbursement/export',
                            download: this.downloadFn,
                            type: 'download',
                        },
                        {
                            label: '付款确认',
                            iconBtnSrc: 'iconliebiaoye-fukuanqueren', // payAffirmIcon
                            onClick: this.payAffirm,
                            authority: '/foreEnd/business/feeManage/reimbursement/paylist',
                        },
                        {
                            label: '付款信息变更',
                            iconBtnSrc: 'iconliebiaoye-fukuanxinxibiangeng', // changePayInfo
                            onClick: this.changePayInfo,
                            authority: '/foreEnd/business/feeManage/reimbursement/changePayInfo',
                        },
                    ]}
                    fetch={this.fetchFn}
                    cols={columns}
                    tips={this.renderTipsFn(reimbursesListPage.page.total, reimbursesListPage.totalFee)}
                    pageData={reimbursesListPage}
                    expandedRowRender={(e) => {
                        return columnsChildFn(e);
                    }}
                    expandIcon={this.customExpandIcon}
                    rowSelectionConfig={rowSelection}
                />
            </>
        );
    }
}

export default ComList;
