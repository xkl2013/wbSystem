/* eslint-disable */
import { COSTING_PROCEEDING, CONTRACT_SIGN_TYPE, PROJECT_INFO_TYPE, ACCOUNT_TAXRATE } from '@/utils/enum';
import {
    getProjectList,
    getTalentList,
    getCompanyList,
    getCustomerList,
    getUserList,
    getSupplierList,
} from '@/services/globalSearchApi';
import { getFeeType } from '@/services/dictionary';

function changeTax(obj, props, value) {
    const form = obj.formData;
    let projectCostSettlementTax;
    let projectCostSettlementNoTax;
    const rate = Number(form.projectCostSettlementTaxrate);
    if (rate) {
        projectCostSettlementTax = ((Number(value) * rate) / (1 + rate)).toFixed(2);
        projectCostSettlementNoTax = (Number(value) - projectCostSettlementTax).toFixed(2);
    }
    obj.changeParentForm({
        projectCostEntryAmount: value,
        projectCostSettlementTax,
        projectCostSettlementNoTax,
    });
}

function changeTaxRate(obj, e) {
    const form = obj.formData;
    let projectCostSettlementTax;
    let projectCostSettlementNoTax;
    if (e != undefined && form.projectCostEntryAmount) {
        const rate = Number(e);
        projectCostSettlementTax = ((Number(form.projectCostEntryAmount) * rate) / (1 + rate)).toFixed(2);
        projectCostSettlementNoTax = (Number(form.projectCostEntryAmount) - projectCostSettlementTax).toFixed(2);
    }
    obj.changeParentForm({
        projectCostSettlementTax,
        projectCostSettlementNoTax,
        projectCostSettlementTaxrate: Number(e),
    });
}

export const formatCols = (obj, props) => {
    return [
        {
            title: '基本信息',
            columns: [
                [
                    {
                        label: '事项',
                        key: 'projectCostThings',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择事项',
                                },
                            ],
                        },
                        disabled: true,
                        placeholder: '请选择事项',
                        type: 'select',
                        options: COSTING_PROCEEDING,
                        getFormat: (value, form) => {
                            form.applicationFeeType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    {
                        label: '合同编号',
                        key: 'projectCostContractCode',
                        disabled: true,
                    },
                    {
                        label: '合同名称',
                        key: 'projectCostContractName',
                        disabled: true,
                    },
                ],
                [
                    {
                        label: '签约方式',
                        key: 'projectCostContractWay',
                        disabled: true,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择签约方式',
                                },
                            ],
                        },
                        placeholder: '请选择签约方式',
                        type: 'select',
                        options: CONTRACT_SIGN_TYPE,
                        getFormat: (value, form) => {
                            form.applicationFeeType = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    {
                        label: '项目',
                        type: 'associationSearch',
                        key: 'projectCostProjectName',
                        placeholder: '请输入项目名称',
                        componentAttr: {
                            request: (val) => {
                                return getProjectList({
                                    projectName: val,
                                    pageSize: 50,
                                    pageNum: 1,
                                });
                            },
                            initDataType: 'onfocus',
                            fieldNames: {
                                value: 'projectId',
                                label: 'projectName',
                            },
                            allowClear: true,
                        },
                        getFormat: (value, form) => {
                            form.projectCostProjectId = value.value;
                            form.projectCostProjectName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: form.projectCostProjectId,
                                label: form.projectCostProjectName,
                            };
                        },
                    },
                    {
                        label: '艺人/博主',
                        key: 'projectCostTalentName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择艺人/博主',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        componentAttr: {
                            request: (val) => {
                                return getTalentList({ talentName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: {
                                value: (val) => {
                                    return `${val.talentId}_${val.talentType}`;
                                },
                                label: 'talentName',
                            },
                        },
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.projectCostTalentId = Number(value.value.split('_')[0]);
                            form.projectCostTalentType = Number(value.value.split('_')[1]);
                            form.projectCostTalentName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: `${form.projectCostTalentId}_${form.projectCostTalentType}`,
                                label: form.projectCostTalentName,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '项目明细分类',
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
                        type: 'select',
                        allowClear: true,
                        options: PROJECT_INFO_TYPE,
                        getFormat: (value, form) => {
                            form.projectCostProjectDetailClassify = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    {
                        label: '费用类型',
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
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return getFeeType({ value: val });
                            },
                            initDataType: 'onfocus',
                            fieldNames: { value: 'index', label: 'value' },
                            allowClear: true,
                        },
                        getFormat: (value, form) => {
                            form.projectCostFeeType = value.value;
                            form.projectCostFeeTypeName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value,
                                label: form.projectCostFeeTypeName || undefined,
                            };
                        },
                    },
                    {
                        label: '合同金额',
                        key: 'projectCostContractAmount',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入合同金额',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            // max: 99999999,
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                    },
                ],
                [
                    {
                        label: '公司金额',
                        key: 'projectCostCompanyAmount',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入公司金额',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            // max: 99999999,
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                    },
                    {
                        label: '拆账金额',
                        key: 'projectCostTearAmount',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入拆账金额',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            // max: 99999999,
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                    },
                    {
                        label: '进度差',
                        key: 'projectCostProgressGap',
                        validateFirst: true,
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入进度差',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 100,
                            formatter: (value) => {
                                return `${value}%`;
                            },
                            parser: (value) => {
                                return value.replace('%', '');
                            },
                        },
                        placeholder: '请输入进度差',
                        type: 'inputNumber',
                        getFormat: (value, form) => {
                            form.projectCostProgressGap = value;
                            return form;
                        },
                        setFormat: (value, form) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '入账金额',
                        key: 'projectCostEntryAmount',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入入账金额',
                                },
                            ],
                        },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            onChange: changeTax.bind(this, obj, props),
                            // max: 99999999,
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                    },
                    {
                        label: '公司主体',
                        key: 'projectCostCompanyName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择公司主体',
                                },
                            ],
                        },
                        placeholder: '请选择公司主体',
                        componentAttr: {
                            request: (val) => {
                                return getCompanyList({ companyName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: {
                                value: 'companyId',
                                label: 'companyName',
                            },
                        },
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.projectCostTalentId = value.value;
                            form.projectCostCompanyName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: form.projectCostTalentId,
                                label: form.projectCostCompanyName,
                            };
                        },
                    },
                    {
                        label: '客户主体',
                        key: 'projectCostCustomerName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择客户主体',
                                },
                            ],
                        },
                        placeholder: '请选择客户主体',
                        componentAttr: {
                            request: (val) => {
                                return getCustomerList({ customerName: val });
                            },
                            initDataType: 'onfocus',
                            fieldNames: {
                                value: 'id',
                                label: 'customerName',
                            },
                        },
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.projectCostCustomerId = value.value;
                            form.projectCostCustomerName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: form.projectCostCustomerId,
                                label: form.projectCostCustomerName,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '结算税率',
                        key: 'projectCostSettlementTaxrate',
                        placeholder: '请选择',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择结算税率',
                                },
                            ],
                        },
                        componentAttr: {
                            onChange: changeTaxRate.bind(this, obj),
                        },
                        type: 'select',
                        options: ACCOUNT_TAXRATE,
                        getFormat: (value, form) => {
                            form.projectCostSettlementTaxrate = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            // debugger;
                            return String(value);
                        },
                    },
                    {
                        label: '税额',
                        key: 'projectCostSettlementTax',
                        disabled: true,
                        // checkOption: {
                        //     rules: [
                        //         {
                        //             required: true,
                        //             message: '请选择结算税率',
                        //         },
                        //     ],
                        // },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            // max: 99999999,
                        },
                        placeholder: '请输入税额',
                        type: 'inputNumber',
                    },
                    {
                        label: '未税金额',
                        key: 'projectCostSettlementNoTax',
                        disabled: true,
                        // checkOption: {
                        //     rules: [
                        //         {
                        //             required: true,
                        //             message: '请选择结算税率',
                        //         },
                        //     ],
                        // },
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            // max: 99999999,
                        },
                        placeholder: '请输入未税金额',
                        type: 'inputNumber',
                    },
                ],
                [
                    {
                        label: '结算供应商',
                        key: 'projectCostSettlementSupplierName',
                        type: 'associationSearch',
                        // checkOption: {
                        //     rules: [
                        //         {
                        //             required: true,
                        //             message: '请选择税率',
                        //         },
                        //     ],
                        // },
                        placeholder: '请输入结算供应商',
                        componentAttr: {
                            request: (val) => {
                                return getSupplierList({
                                    supplierName: val,
                                    pageSize: 50,
                                    pageNum: 1,
                                });
                            },
                            initDataType: 'onfocus',
                            fieldNames: {
                                value: 'supplierId',
                                label: 'supplierName',
                            },
                            allowClear: true,
                        },
                        getFormat: (value, form) => {
                            form.projectCostSettlementSupplierId = value.value;
                            form.projectCostSettlementSupplierName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: form.projectCostSettlementSupplierId,
                                label: form.projectCostSettlementSupplierName,
                            };
                        },
                    },
                    {
                        label: '负责人',
                        key: 'projectCostProjectManagerName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择项目负责人',
                                },
                            ],
                        },
                        placeholder: '请选择项目负责人',
                        componentAttr: {
                            request: (val) => {
                                return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                            },
                            initDataType: 'onfocus',
                            fieldNames: {
                                value: 'userId',
                                label: 'userChsName',
                            },
                            allowClear: true,
                        },
                        type: 'associationSearch',
                        getFormat: (value, form) => {
                            form.projectCostProjectManagerId = value.value;
                            form.projectCostProjectManagerName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value: form.projectCostProjectManagerId,
                                label: form.projectCostProjectManagerName,
                            };
                        },
                    },
                    {
                        key: 'projectCostProjectManagerDeptName',
                        label: '负责人所属部门',
                        placeholder: '请选择项目负责人所属部门',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '负责人所属部门不能为空',
                                },
                            ],
                        },
                        type: 'orgtree',
                        getFormat: (value, form) => {
                            form.projectCostProjectManagerDeptId = value.value;
                            form.projectCostProjectManagerDeptName = value.label;
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                label: form.projectCostProjectManagerDeptName,
                                value: form.projectCostProjectManagerDeptId,
                            };
                        },
                    },
                ],
            ],
        },
    ];
};

export default {
    formatCols,
};
