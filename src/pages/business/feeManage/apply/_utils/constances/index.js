/**
 * 新增/编辑form表单cols
 * */
import React from 'react';
import moment from 'moment';
import { IS_OR_NOT, CURRENCY_TYPE } from '@/utils/enum';
import { DATE_FORMAT } from '@/utils/constants';
import { getUserList as getInnerUserList, getCompanyList } from '@/services/globalSearchApi';
import { getUserDetail, getCompanyDetail } from '@/services/globalDetailApi';
import Notice from '@/pages/business/components/noticers';
import { columnsFn as feeTableCols } from './_tableFee';
import { columnsFn as feeNormalTableCols } from './_tableFeeNormal';
import { columnsFn as chequesTableCols } from './_tableCheques';
import payTableCols from './_tablePay';
import { formatSelfCols as feeFormCols } from './_formFee';
import { formatSelfCols as feeNormalFormCols } from './_formFeeNormal';
import { formatSelfCols as chequesFormCols } from './_formCheques';
import { formatSelfCols as payFormCols } from './_formPay';

async function changeUser(obj, value) {
    const response = await getUserDetail(value.userId);
    if (response && response.success && response.data) {
        const user = response.data.user || {};
        const company = response.data.company || {};
        const department = response.data.department || {};
        obj.changeSelfForm({
            applicationUserId: user.userId,
            applicationUserName: user.userRealName,
            applicationUserCode: user.userCode,
            applicationApplyCompanyId: company.companyId,
            applicationApplyCompanyName: company.companyName,
            applicationApplyCompanyCode: company.companyCode,
            applicationApplyDeptId: department.departmentId,
            applicationApplyDeptName: department.departmentName,
            applicationApplyDeptCode: department.departmentCode,
        });
    }
}

// 费用承担主体 change fn
async function changeInvoiceCompany(obj, value) {
    const response = await getCompanyDetail(value.value);
    if (response && response.success && response.data) {
        const { company, companyBankList } = response.data;
        obj.changeSelfForm({
            applicationCompanyName: company.companyName,
            applicationCompanyId: company.companyId,
            applicationCompanyCode: company.companyCode,
        });
        const companyBank = companyBankList.find((item) => {
            return item.companyBankIsReimbursement === 1;
        });
        obj.changeParentForm('applicationPay', [
            {
                applicationPayCompanyId: value.value,
                applicationPayCompanyName: value.companyName,
                applicationPayCompanyCode: company.companyCode,
                applicationPayBankAddress: companyBank ? companyBank.companyBankName : '',
                applicationPayBankAcountNo: companyBank ? companyBank.companyBankNo : '',
            },
        ]);
    }
}

function getApproveId() {
    if (process.env.NODE_ENV === 'development' || process.env.BUILD_ENV === 'development') {
        // 测试环境
        return 203;
    }
    // 线上
    return 203;
}

export const formatCols = (obj) => {
    const formData = obj && obj.formData;
    return [
        {
            title: '基本信息',
            columns: [
                [
                    (() => {
                        if (formData && formData.applicationCode) {
                            return {
                                label: '费用申请编号',
                                key: 'applicationCode',
                                componentAttr: {
                                    disabled: true,
                                },
                            };
                        }
                    })(),
                    (() => {
                        if (formData && formData.applicationCreateTime) {
                            return {
                                label: '申请日期',
                                key: 'applicationCreateTime',
                                placeholder: '请选择',
                                type: 'date',
                                disabled: true,
                                getFormat: (value, form) => {
                                    const result = form;
                                    result.applicationCreateTime = moment(value).format(DATE_FORMAT);
                                    return result;
                                },
                                setFormat: (value) => {
                                    return moment(value);
                                },
                            };
                        }
                    })(),
                ],
                [
                    {
                        label: '申请人姓名',
                        key: 'applicationUserId',
                        placeholder: '请选择',
                        type: 'associationSearch',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择申请人',
                                },
                            ],
                        },
                        componentAttr: {
                            request: (val) => {
                                return getInnerUserList({ userRealName: val, pageSize: 50, pageNum: 1 });
                            },
                            fieldNames: { value: 'userId', label: 'userRealName' },
                            allowClear: true,
                            onChange: changeUser.bind(this, obj),
                            disabled: true,
                        },
                        getFormat: (value, form) => {
                            const result = form;
                            result.applicationUserId = value.value;
                            result.applicationUserName = value.label;
                            return result;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.applicationUserName,
                                value: form.applicationUserId,
                            };
                        },
                    },
                    {
                        label: '申请人所属部门',
                        key: 'applicationApplyDeptId',
                        componentAttr: {
                            disabled: true,
                        },
                        placeholder: '请选择',
                        type: 'orgtree',
                        getFormat: (value, form) => {
                            const result = form;
                            result.applicationApplyDeptId = value.value;
                            result.applicationApplyDeptName = value.label;
                            return result;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.applicationApplyDeptName,
                                value: form.applicationApplyDeptId,
                            };
                        },
                    },
                    {
                        label: '是否预充值',
                        key: 'applicationRecharge',
                        checkOption: {
                            initialValue: '0',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ],
                        },
                        componentAttr: {
                            allowClear: true,
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: IS_OR_NOT,
                        getFormat: (value, form) => {
                            const result = form;
                            result.applicationRecharge = Number(value);
                            return result;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '币种',
                        key: 'applicationCurrency',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                const arr = CURRENCY_TYPE.filter((item) => {
                                    return item.name.indexOf(val) > -1;
                                });
                                return {
                                    success: true,
                                    data: {
                                        list: arr,
                                    },
                                };
                            },
                            fieldNames: { value: 'id', label: 'name' },
                            allowClear: true,
                            disabled: true,
                        },
                        getFormat: (value, form) => {
                            const result = form;
                            result.applicationCurrency = Number(value.value);
                            return result;
                        },
                        setFormat: (value) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return { label: '人民币', value };
                        },
                    },
                    {
                        label: '申请总金额',
                        key: 'applicationApplyTotalFee',
                        componentAttr: {
                            disabled: true,
                            precision: 2,
                            min: 0,
                            max: 1000000000000,
                            // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                        },
                        placeholder: '',
                        type: 'inputNumber',
                    },
                    {
                        label: '费用承担主体',
                        key: 'applicationFeeTakerMainId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择费用承担主体',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
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
                            onChange: changeInvoiceCompany.bind(this, obj),
                        },
                        getFormat: (value, form) => {
                            const result = form;
                            result.applicationFeeTakerMainId = value.value;
                            result.applicationFeeTakerMainName = value.label;
                            result.applicationFeeTakerMainCode = obj.formData.applicationFeeTakerMainCode;
                            return result;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.applicationFeeTakerMainName,
                                value: form.applicationFeeTakerMainId,
                            };
                        },
                    },
                    {
                        label: '申请事由',
                        key: 'applicationReason',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入申请事由',
                                },
                                {
                                    max: 50,
                                    message: '至多输入50个字',
                                },
                            ],
                        },
                        type: 'textarea',
                        componentAttr: {
                            placeholder: '请输入',
                            rows: 3,
                            maxLength: 50,
                        },
                    },
                ],
            ],
        },
        {
            title: '日常费用明细',
            fixed: true,
            columns: [
                [
                    {
                        key: 'applicationNormalVoList',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            border: true,
                            tableCols: feeNormalTableCols,
                            formCols: feeNormalFormCols.bind(this, obj),
                            formKey: 'applicationNormalVoList',
                            addBtnText: '添加',
                            editBtnText: '编辑',
                            changeParentForm: obj.changeParentForm,
                        },
                    },
                ],
            ],
        },
        {
            title: '项目费用明细',
            fixed: true,
            columns: [
                [
                    {
                        key: 'applicationProjectVoList',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            border: true,
                            tableCols: feeTableCols,
                            formCols: feeFormCols.bind(this, obj),
                            formKey: 'applicationProjectVoList',
                            addBtnText: '添加',
                            editBtnText: '编辑',
                            changeParentForm: obj.changeParentForm,
                            hiddenKey: ['applicationDuty'],
                        },
                    },
                ],
            ],
        },
        {
            title: '收款信息',
            fixed: true,
            columns: [
                [
                    {
                        key: 'applicationCheques',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '收款信息填写不完整',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value && value.length > 0) {
                                            for (let i = 0; i < value.length; i += 1) {
                                                if (!value[i].index && !value[i].applicationChequesBankCity) {
                                                    callback('收款信息填写不完整');
                                                    return;
                                                }
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        componentAttr: {
                            border: true,
                            tableCols: chequesTableCols,
                            formCols: chequesFormCols.bind(this, obj),
                            formKey: 'applicationCheques',
                            addBtnText: '添加',
                            editBtnText: '编辑',
                            changeParentForm: obj.changeParentForm,
                            disabled: formData && formData.applicationCheques && formData.applicationCheques.length > 0,
                        },
                    },
                ],
            ],
        },
        {
            title: '付款信息',
            fixed: true,
            columns: [
                [
                    {
                        key: 'applicationPay',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '付款信息不完整',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value && value.length > 0) {
                                            if (
                                                value[0].reimbursePayBankAddress === null
                                                || value[0].reimbursePayBankAcountNo === null
                                            ) {
                                                callback('付款信息填写不完整');
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        componentAttr: {
                            border: true,
                            tableCols: payTableCols,
                            formCols: payFormCols.bind(this, obj),
                            formKey: 'applicationPay',
                            addBtnText: null,
                            editBtnText: '编辑',
                            changeParentForm: obj.changeParentForm,
                            disabled: formData && formData.applicationPay && formData.applicationPay.length > 0,
                        },
                    },
                ],
            ],
        },
        {
            title: '附件',
            columns: [
                [
                    {
                        key: 'attachments',
                        placeholder: '请选择',
                        type: 'upload',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            btnText: '添加附件',
                        },
                        setFormat: (value) => {
                            return value.map((item) => {
                                if (item.name || item.value || item.value === 0) {
                                    return item;
                                }
                                return {
                                    name: item.applicationAttachmentName,
                                    value: item.applicationAttachmentUrl,
                                    domain: item.applicationAttachmentDomain,
                                };
                            });
                        },
                    },
                ],
            ],
        },
        {
            title: '知会人',
            fixed: true,
            columns: [
                [
                    {
                        key: 'notice',
                        type: 'custom',
                        component: <Notice approveId={getApproveId()} />,
                    },
                ],
            ],
        },
    ];
};

export default {
    formatCols,
};
