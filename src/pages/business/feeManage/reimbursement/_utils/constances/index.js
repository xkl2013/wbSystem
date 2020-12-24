/**
 * 新增/编辑form表单cols
 * */
import React from 'react';
import moment from 'moment';
import { CURRENCY_TYPE, IS_OR_NOT } from '@/utils/enum';
import { DATE_FORMAT } from '@/utils/constants';
import { getUserList, getCompanyList } from '@/services/globalSearchApi';
import { getCompanyDetail, getUserDetail } from '@/services/globalDetailApi';
import Notice from '@/pages/business/components/noticers';
import { columnsFn as feeTableCols } from './_tableFee';
import { columnsFn as feeNormalTableCols } from './_tableFeeNormal';
import { formatSelfCols as feeFormCols } from './_formFee';
import { formatSelfCols as feeNormalFormCols } from './_formFeeNormal';
import { columnsFn as chequesTableCols } from './_tableCheques';
import { formatSelfCols as chequesFormCols } from './_formCheques';
import payTableCols from './_tablePay';
import { formatSelfCols as payFormCols } from './_formPay';

async function changeUser(obj, value) {
    const response = await getUserDetail(value.userId);
    if (response && response.success && response.data) {
        const user = response.data.user || {};
        const company = response.data.company || {};
        const department = response.data.department || {};
        obj.changeSelfForm({
            reimburseReimbureUserId: user.userId,
            reimburseReimbureUserName: user.userRealName,
            reimburseReimbureUserCode: user.userCode,
            reimburseReimbureUserCompanyId: company.companyId,
            reimburseReimbureUserCompanyName: company.companyName,
            reimburseReimbureUserCompanyCode: company.companyCode,
            reimburseReimbureUserDeptId: department.departmentId,
            reimburseReimbureUserDeptName: department.departmentName,
            reimburseReimbureUserDeptCode: department.departmentCode,
        });
    }
}

async function changeInvoiceCompany(obj, value) {
    const response = await getCompanyDetail(value.value);
    if (response && response.success && response.data) {
        const { company, companyBankList } = response.data;
        obj.changeSelfForm({
            reimburseReimbureCompanyName: company.companyName,
            reimburseReimbureCompanyId: company.companyId,
            reimburseReimbureCompanyCode: company.companyCode,
        });
        const companyBank = companyBankList.find((item) => {
            return item.companyBankIsReimbursement === 1;
        });
        obj.changeParentForm('reimbursePay', [
            {
                reimbursePayCompanyId: value.value,
                reimbursePayCompanyName: value.companyName,
                reimbursePayCompanyCode: company.companyCode,
                reimbursePayBankAddress: companyBank ? companyBank.companyBankName : null,
                reimbursePayBankAcountNo: companyBank ? companyBank.companyBankNo : null,
            },
        ]);
    }
}

function getApproveId() {
    if (process.env.NODE_ENV === 'development' || process.env.BUILD_ENV === 'development') {
        // 测试环境
        return 201;
    }
    // 线上
    return 201;
}

export const formatCols = (obj) => {
    const formData = obj && obj.formData;
    return [
        {
            title: '基本信息',
            columns: [
                [
                    (() => {
                        if (formData && formData.reimburseCode) {
                            return {
                                label: '费用报销编号',
                                key: 'reimburseCode',
                                componentAttr: {
                                    disabled: true,
                                },
                            };
                        }
                    })(),
                    (() => {
                        if (formData && formData.reimburseApplyTime) {
                            return {
                                label: '申请日期',
                                key: 'reimburseApplyTime',
                                placeholder: '请选择',
                                type: 'date',
                                disabled: true,
                                getFormat: (value, form) => {
                                    const result = form;
                                    result.reimburseApplyTime = moment(value).format(DATE_FORMAT);
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
                        label: '填报人姓名',
                        key: 'reimburseReportUserName',
                        placeholder: '请选择',
                        componentAttr: {
                            disabled: true,
                        },
                        type: 'input',
                    },
                    {
                        label: '填报人所属部门',
                        key: 'reimburseReportUserDeptName',
                        placeholder: '请选择',
                        componentAttr: {
                            disabled: true,
                        },
                        type: 'input',
                    },
                    {
                        label: '实际报销人',
                        key: 'reimburseReimbureUserName',
                        placeholder: '请选择',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择报销人',
                                },
                            ],
                        },
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return getUserList({ userRealName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'userId', label: 'userRealName' },
                            allowClear: true,
                            onChange: changeUser.bind(this, obj),
                        },
                        getFormat: (value, form) => {
                            const result = form;
                            result.reimburseReimbureUserId = value.value;
                            result.reimburseReimbureUserName = value.label;
                            return result;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.reimburseReimbureUserName,
                                value: form.reimburseReimbureUserId,
                            };
                        },
                    },
                    {
                        label: '实际报销人所属部门',
                        key: 'reimburseReimbureUserDeptName',
                        componentAttr: {
                            disabled: true,
                        },
                        placeholder: '请选择',
                        type: 'input',
                    },
                    {
                        label: '是否预充值',
                        key: 'reimburseRecharge',
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
                            disabled: true,
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: IS_OR_NOT,
                        getFormat: (value, form) => {
                            const result = form;
                            result.reimburseRecharge = Number(value);
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
                        key: 'reimburseCurrency',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择币种',
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
                            result.reimburseCurrency = Number(value.value);
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
                        label: '报销总金额',
                        key: 'reimburseTotalFee',
                        componentAttr: {
                            disabled: true,
                            precision: 2,
                            // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                        },
                        placeholder: '',
                        type: 'inputNumber',
                    },
                    {
                        label: '申请付款总金额',
                        key: 'reimburseTotalPayFee',
                        componentAttr: {
                            disabled: true,
                            precision: 2,
                            // formatter: value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            // parser: value => value.replace(/\¥\s?|(,*)/g, ''),
                        },
                        placeholder: '',
                        type: 'inputNumber',
                    },
                    {
                        label: '费用承担主体',
                        key: 'reimburseFeeTakerMainName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择发票主体',
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
                            initDataType: 'onfocus',
                            fieldNames: { value: 'companyId', label: 'companyName' },
                            onChange: changeInvoiceCompany.bind(this, obj),
                        },
                        getFormat: (value, form) => {
                            const result = form;
                            result.reimburseFeeTakerMainId = value.value;
                            result.reimburseFeeTakerMainName = value.label;
                            result.reimburseFeeTakerMainCode = obj.formData.reimburseReimbureCompanyCode;
                            return result;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.reimburseFeeTakerMainName,
                                value: form.reimburseFeeTakerMainId,
                            };
                        },
                    },
                    {
                        label: '报销事由',
                        key: 'reimburseReason',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入报销事由',
                                },
                                {
                                    max: 50,
                                    message: '至多输入50个汉字',
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
                        key: 'reimburseNormals',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            border: true,
                            tableCols: feeNormalTableCols.bind(this, obj),
                            formCols: feeNormalFormCols.bind(this, obj),
                            formKey: 'reimburseNormals',
                            addBtnText: '添加',
                            editBtnText: '编辑',
                            changeParentForm: obj.changeParentForm,
                        },
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    validator: (rule, value, callback) => {
                                        if (value && value.length > 0) {
                                            let result = false;
                                            for (let i = 0; i < value.length; i += 1) {
                                                if (
                                                    !value[i].index
                                                    && (!value[i].reimburseFeeTakerDeptId
                                                        || (value[i].reimburseInvoiceType !== 2
                                                            && !value[i].reimburseTaxRate))
                                                ) {
                                                    result = true;
                                                    break;
                                                }
                                            }
                                            if (result) {
                                                callback('日常费用明细填写不完整');
                                                return;
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
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
                        key: 'reimburseProjects',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            border: true,
                            tableCols: feeTableCols.bind(this, obj),
                            formCols: feeFormCols.bind(this, obj),
                            formKey: 'reimburseProjects',
                            addBtnText: '添加',
                            editBtnText: '编辑',
                            hiddenKey: ['reimburseDuty'],
                            changeParentForm: obj.changeParentForm,
                        },
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    validator: (rule, value, callback) => {
                                        if (value && value.length > 0) {
                                            let result = false;
                                            for (let i = 0; i < value.length; i += 1) {
                                                if (
                                                    !value[i].index
                                                    && value[i].reimburseInvoiceType !== 2
                                                    && !value[i].reimburseTaxRate
                                                ) {
                                                    result = true;
                                                    break;
                                                }
                                            }
                                            if (result) {
                                                callback('项目费用明细填写不完整');
                                                return;
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ],
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
                        key: 'reimburseCheques',
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
                                                if (!value[i].index && !value[i].reimburseChequesBankCity) {
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
                            formKey: 'reimburseCheques',
                            addBtnText: '添加',
                            editBtnText: '编辑',
                            changeParentForm: obj.changeParentForm,
                            disabled: formData && formData.reimburseCheques && formData.reimburseCheques.length > 0,
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
                        key: 'reimbursePay',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '付款信息填写不完整',
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
                            formKey: 'reimbursePay',
                            addBtnText: null,
                            editBtnText: '编辑',
                            changeParentForm: obj.changeParentForm,
                            disabled: formData && formData.reimbursePay && formData.reimbursePay.length > 0,
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
                                    name: item.reimburseAttachmentName,
                                    value: item.reimburseAttachmentUrl,
                                    domain: item.reimburseAttachmentDomain,
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
