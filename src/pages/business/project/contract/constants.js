/* eslint-disable */
/**
 * 新增/编辑form表单cols
 * */
import moment from 'moment';
import {
    PROJECT_INFO_TYPE,
    CONTRACT_TYPE,
    CONTRACT_PRI_TYPE,
    CONTRACT_SIGN_TYPE,
    CONTRACT_INVOICE_ORDER,
    IS_OR_NOT,
    PROJECT_ESTABLISH_RATIO,
} from '@/utils/enum';
import SelfTable from '@/pages/business/project/establish/components/projectingBudgetInfo/selfTable';
import {
    getCustomerList,
    getCompanyList,
    getStudioList,
    getCommerceListSearch,
    getUserList as getInnerUserList,
} from '@/services/globalSearchApi';
import { DATETIME_FORMAT } from '@/utils/constants';
import Notice from '@/pages/business/components/noticers';
import { getKeyValue } from '@/utils/utils';
import {
    renderProjectName,
    renderContractCooperateProduct,
    renderContractCooperateIndustry,
    renderContractMoneyTotal,
    renderContractMoneyCompany,
    renderContractTalentDivides,
    renderContractObligation,
    renderContractReturn,
    renderContractCooperateBrand,
} from './components';

const BUDGETS = [
    'makeupCost',
    'makeupCostType',
    'intermediaryCost',
    'intermediaryCostType',
    'tripCost',
    'tripCostType',
    'otherCost',
    'otherCostType',
    'invitationCost',
    'invitationCostType',
    'makeCost',
    'makeCostType',
];

// 修改签约方式
const changeSignType = (obj, values) => {
    // 更换签约方式时清空客户、公司、工作室、回款主体信息
    const newData = {
        contractSigningType: values,
        contractCompanyList: undefined,
        contractOfficeList: undefined,
        contractMoneyCompanyId: undefined,
        contractMoneyCompanyName: undefined,
        contractMoneyStudioId: undefined,
        contractMoneyStudioName: undefined,
    };
    obj.changeSelfForm(newData);
};

// 合同审核附件关联
const changeAttr = (obj, values) => {
    if (values) {
        const attachments = values.attachments || [];
        const result = attachments.map((item) => {
            return {
                domain: item.domain,
                value: item.url,
                name: item.name,
                attachmentOrigin: 2,
            };
        });
        const contractAttachmentList = obj.formData.contractAttachmentList;
        if (!contractAttachmentList || contractAttachmentList.length === 0) {
            obj.changeSelfForm({ contractAttachmentList: result, clauseName: values });
        } else if (contractAttachmentList.length >= 1) {
            let arr = contractAttachmentList.filter((item) => {
                return item.attachmentOrigin !== 2;
            });
            arr = arr.concat(result);
            obj.changeSelfForm({ contractAttachmentList: arr, clauseName: values });
        }
    } else {
        const contractAttachmentList = obj.formData.contractAttachmentList;
        const arr = contractAttachmentList.filter((item) => {
            return item.attachmentOrigin !== 2;
        });
        obj.changeSelfForm({ contractAttachmentList: arr, clauseName: values });
    }
};

const uploadChange = (e, obj) => {
    const result = [];
    e.map((item) => {
        if (item.response && item.response.data) {
            result.push({
                domain: item.response.data.domain,
                value: item.response.data.qiniuFileName,
                name: item.response.data.originalFileName,
            });
        }
    });
    // const contractAttachmentList = obj.formData.contractAttachmentList;
    obj.changeSelfForm({ contractAttachmentList: result });
};

function getApproveId() {
    if (process.env.NODE_ENV === 'development' || process.env.BUILD_ENV === 'development') {
        // 测试环境
        return 4004;
    }
    // 线上
    return 4004;
}

export const formatCols = (obj) => {
    return [
        {
            title: '基本信息',
            columns: [
                [
                    {
                        label: '合同类型',
                        key: 'contractType',
                        checkOption: {
                            initialValue: '1',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择合同类型',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_TYPE,
                        disabled: true,
                        getFormat: (value, form) => {
                            form.contractType = Number(value);
                            return form;
                        },
                        setFormat: (value, form) => {
                            return String(value);
                        },
                    },
                    {
                        label: '主子合同',
                        key: 'contractCategory',
                        checkOption: {
                            initialValue: '0',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择主子合同',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        disabled: true,
                        type: 'select',
                        options: CONTRACT_PRI_TYPE,
                        getFormat: (value, form) => {
                            form.contractCategory = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    renderProjectName(obj),
                    {
                        label: '项目明细分类',
                        key: 'contractProjectCategory',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择项目明细',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: PROJECT_INFO_TYPE,
                        getFormat: (value, form) => {
                            form.contractProjectCategory = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '合同名称',
                        key: 'contractName',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入合同名称',
                                },
                                {
                                    max: 50,
                                    message: '至多输入50个字',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '签约方式',
                        key: 'contractSigningType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择签约方式',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: CONTRACT_SIGN_TYPE,
                        componentAttr: {
                            onChange: changeSignType.bind(this, obj),
                        },
                        getFormat: (value, form) => {
                            form.contractSigningType = Number(value);
                            if (Number(value) === 1) {
                                form.contractStudioList = [];
                            }
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '客户主体',
                        key: 'contractCustomerList',
                        placeholder: '请选择',
                        type: 'associationSearch',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择客户主体',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        const obj = (value || []).find((el) => {
                                            return !el.value;
                                        });
                                        obj ? callback(`${obj.label}的ID可能有误，请尝试其他主体`) : callback();
                                    },
                                },
                            ],
                        },
                        componentAttr: {
                            mode: 'multiple',
                            allowClear: true,
                            request: (val) => {
                                return getCustomerList({
                                    customerName: val,
                                });
                            },
                            fieldNames: { value: 'id', label: 'customerName' },
                            initDataType: 'onfocus',
                        },
                        getFormat: (item, form) => {
                            const arr = [];
                            item.map((value) => {
                                arr.push({
                                    contractCompanyId: value.value,
                                    contractCompanyName: value.label,
                                });
                            });
                            form.contractCustomerList = arr;
                            return form;
                        },
                        setFormat: (item, form) => {
                            // 多重判断防止label=''或value=0
                            const result = [];
                            item.map((value) => {
                                if (value.label || value.value || value.value === 0) {
                                    result.push(value);
                                } else {
                                    result.push({
                                        label: value.contractCompanyName,
                                        value: value.contractCompanyId,
                                    });
                                }
                            });
                            return result;
                        },
                    },
                    (() => {
                        // 动态改变公司主体显隐（显示条件：{contractSigningType}=>{1,2}）
                        if (obj.formData.contractSigningType == 1 || obj.formData.contractSigningType == 2) {
                            return {
                                label: '公司主体',
                                key: 'contractCompanyList',
                                placeholder: '请选择',
                                type: 'associationSearch',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择公司主体',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    mode: 'multiple',
                                    allowClear: true,
                                    request: (val) => {
                                        return getCompanyList({
                                            pageNum: 1,
                                            pageSize: 50,
                                            companyName: val,
                                        });
                                    },
                                    fieldNames: { value: 'companyId', label: 'companyName' },
                                    initDataType: 'onfocus',
                                },
                                getFormat: (item, form) => {
                                    const arr = [];
                                    item.map((value) => {
                                        arr.push({
                                            contractCompanyId: value.value,
                                            contractCompanyName: value.label,
                                        });
                                    });
                                    form.contractCompanyList = arr;
                                    return form;
                                },
                                setFormat: (item, form) => {
                                    const result = [];
                                    item.map((value) => {
                                        if (value.label || value.value || value.value === 0) {
                                            result.push(value);
                                        } else {
                                            result.push({
                                                label: value.contractCompanyName,
                                                value: value.contractCompanyId,
                                            });
                                        }
                                    });
                                    return result;
                                },
                            };
                        }
                    })(),
                ],
                [
                    (() => {
                        // 动态改变工作室主体显隐（显示条件：{contractSigningType}=>{2,3}）
                        if (obj.formData.contractSigningType == 2 || obj.formData.contractSigningType == 3) {
                            return {
                                label: '工作室主体',
                                key: 'contractStudioList',
                                placeholder: '请选择',
                                type: 'associationSearch',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择工作室主体',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    mode: 'multiple',
                                    allowClear: true,
                                    request: (val) => {
                                        return getStudioList({
                                            pageNum: 1,
                                            pageSize: 50,
                                            studioName: val,
                                        });
                                    },
                                    fieldNames: { value: 'studioId', label: 'studioName' },
                                    initDataType: 'onfocus',
                                },
                                getFormat: (item, form) => {
                                    const arr = [];
                                    item.map((value) => {
                                        arr.push({
                                            contractCompanyId: value.value,
                                            contractCompanyName: value.label,
                                        });
                                    });
                                    form.contractStudioList = obj.formData.contractSigningType === 1 ? [] : arr;
                                    return form;
                                },
                                setFormat: (item, form) => {
                                    const result = [];
                                    item.map((value) => {
                                        if (value.label || value.value || value.value === 0) {
                                            result.push(value);
                                        } else {
                                            result.push({
                                                label: value.contractCompanyName,
                                                value: value.contractCompanyId,
                                            });
                                        }
                                    });
                                    return result;
                                },
                            };
                        }
                    })(),
                    {
                        label: '合同份数',
                        key: 'contractCount',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入合同份数',
                                },
                            ],
                        },
                        placeholder: '请输入',
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 0,
                            min: 0,
                            // max: 100,
                        },
                    },
                ],
                [
                    {
                        label: '签约日期',
                        key: 'contractSigningDate',
                        type: 'date',
                        placeholder: '请选择',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择签约日期',
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.contractSigningDate = moment(value).format(DATETIME_FORMAT);
                            return form;
                        },
                        setFormat: (value) => {
                            return moment(value);
                        },
                    },
                ],
                [
                    (() => {
                        if (obj.formData.contractProjectId && obj.formData.contractProjectName) {
                            return {
                                label: '合同条款流程',
                                key: 'clauseName',
                                type: 'associationSearch',
                                placeholder: '请选择合同审核流程',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择合同审核流程',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    allowClear: true,
                                    request: () => {
                                        const res = getCommerceListSearch(obj.formData.contractProjectId);
                                        return res;
                                    },
                                    fieldNames: { value: 'clauseId', label: 'clauseName' },
                                    onChange: changeAttr.bind(this, obj),
                                    dropdownMatchSelectWidth: false,
                                    initDataType: 'onfocus',
                                },
                                getFormat: (value, form) => {
                                    form.clauseId = value.value;
                                    form.clauseName = value.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.clauseName,
                                        value: form.clauseId,
                                        // attachments: value.attachments,
                                    };
                                },
                            };
                        }
                    })(),
                ],
            ],
        },
        {
            title: '商务条款',
            columns: [
                [renderContractMoneyTotal(obj), renderContractMoneyCompany(obj)],
                [
                    (() => {
                        // 动态改变回款主体(公司）显隐（显示条件：{contractSigningType}=>{1,2}）
                        if (obj.formData.contractSigningType == 1 || obj.formData.contractSigningType == 2) {
                            return {
                                label: '回款主体—公司',
                                key: 'contractMoneyCompanyId',
                                placeholder: '请输入',
                                type: 'associationSearch',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择回款主体-公司',
                                        },
                                    ],
                                },
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
                                    initDataType: 'onfocus',
                                },
                                getFormat: (value, form) => {
                                    form.contractMoneyCompanyId = value.value;
                                    form.contractMoneyCompanyName = value.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.contractMoneyCompanyName,
                                        value: form.contractMoneyCompanyId,
                                    };
                                },
                            };
                        }
                    })(),
                    (() => {
                        // 动态改变回款主体(工作室）显隐（显示条件：{contractSigningType}=>{2,3}）
                        if (obj.formData.contractSigningType == 2 || obj.formData.contractSigningType == 3) {
                            return {
                                label: '回款主体—工作室',
                                key: 'contractMoneyStudioId',
                                placeholder: '请输入',
                                type: 'associationSearch',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择回款主体-工作室',
                                        },
                                    ],
                                },
                                componentAttr: {
                                    allowClear: true,
                                    request: (val) => {
                                        return getStudioList({
                                            pageNum: 1,
                                            pageSize: 50,
                                            studioName: val,
                                        });
                                    },
                                    fieldNames: { value: 'studioId', label: 'studioName' },
                                    initDataType: 'onfocus',
                                },
                                getFormat: (value, form) => {
                                    form.contractMoneyStudioId = value.value;
                                    form.contractMoneyStudioName = value.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.contractMoneyStudioName,
                                        value: form.contractMoneyStudioId,
                                    };
                                },
                            };
                        }
                    })(),
                ],
                [
                    {
                        label: '开票项目',
                        key: 'contractInvoiceProject',
                        componentAttr: {
                            maxLength: 40,
                        },
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入开票项目',
                                },
                            ],
                        },
                        placeholder: '请输入',
                    },
                    {
                        label: '开票顺序',
                        key: 'contractInvoiceOrder',
                        placeholder: '请选择',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择开票顺序',
                                },
                            ],
                        },
                        type: 'select',
                        options: CONTRACT_INVOICE_ORDER,
                        getFormat: (value, form) => {
                            form.contractInvoiceOrder = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '起止日期',
                        key: 'contractStartDate',
                        placeholder: ['起始日期', '终止日期'],
                        type: 'daterange',
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择起止日期',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value.length !== 2) {
                                            callback('请选择完整的起止日期');
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        getFormat: (value, form) => {
                            form.contractStartDate = moment(value[0]).format(DATETIME_FORMAT);
                            form.contractEndDate = moment(value[1]).format(DATETIME_FORMAT);
                            return form;
                        },
                        setFormat: (value, form) => {
                            if (Array.isArray(value)) {
                                return value;
                            }
                            if (form.contractStartDate && form.contractEndDate) {
                                return [moment(form.contractStartDate), moment(form.contractEndDate)];
                            }
                            return [];
                        },
                    },
                ],
                [renderContractCooperateProduct(obj), renderContractCooperateIndustry(obj)],
                [renderContractCooperateBrand(obj)],
            ],
        },
        {
            title: '负责人信息',
            columns: [
                [
                    {
                        label: '负责人',
                        key: 'contractHeaderName',
                        placeholder: '请选择',
                        disabled: true,
                        getFormat: (value, form) => {
                            form.contractHeaderId = obj && obj.formData && obj.formData.contractHeaderId;
                            form.contractHeaderName = value;
                            return form;
                        },
                    },
                    {
                        label: '负责人所属部门',
                        key: 'contractHeaderDepartmentName',
                        placeholder: '请选择',
                        disabled: true,
                        getFormat: (value, form) => {
                            form.contractHeaderDepartmentId =
                                obj && obj.formData && obj.formData.contractHeaderDepartmentId;
                            form.contractHeaderDepartmentName = value;
                            return form;
                        },
                    },
                ],
            ],
        },
        {
            title: '合作人信息',
            fixed: true,
            columns: [
                [
                    {
                        label: '业务双记',
                        key: 'cooperate',
                        placeholder: '请选择',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择业务双记',
                                },
                            ],
                        },
                        type: 'select',
                        options: IS_OR_NOT,
                        disabled: true,
                        getFormat: (value, form) => {
                            form.cooperate = Number(value);
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                    (() => {
                        const cooperate = getKeyValue(obj.form, obj.formData, 'cooperate');
                        if (Number(cooperate) === 1) {
                            return {
                                label: '业绩比例',
                                key: 'cooperateRatio',
                                placeholder: '请选择',
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择业绩比例',
                                        },
                                    ],
                                },
                                type: 'select',
                                options: PROJECT_ESTABLISH_RATIO,
                                disabled: true,
                                getFormat: (value, form) => {
                                    form.cooperateRatio = Number(value);
                                    return form;
                                },
                                setFormat: (value) => {
                                    return String(value);
                                },
                            };
                        }
                        return {};
                    })(),
                    {},
                ],
                (() => {
                    const cooperate = getKeyValue(obj.form, obj.formData, 'cooperate');
                    if (Number(cooperate) === 1) {
                        return [
                            {
                                label: '合作人',
                                key: 'cooperateUserId',
                                placeholder: '请选择',
                                checkOption: {
                                    validateFirst: true,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择合作人',
                                        },
                                        {
                                            validator: (rule, value, callback) => {
                                                const projectingHeaderId = getKeyValue(
                                                    obj.form,
                                                    obj.formData,
                                                    'contractHeaderId',
                                                );
                                                if (value.value === projectingHeaderId) {
                                                    callback('合作人不能与负责人相同');
                                                }
                                                callback();
                                            },
                                        },
                                    ],
                                },
                                type: 'associationSearch',
                                componentAttr: {
                                    request: (val) => {
                                        return getInnerUserList({
                                            userChsName: val,
                                            pageSize: 50,
                                            pageNum: 1,
                                        });
                                    },
                                    fieldNames: { value: 'userId', label: 'userChsName' },
                                    initDataType: 'onfocus',
                                },
                                disabled: true,
                                getFormat: (value, form) => {
                                    form.cooperateUserId = value.value;
                                    form.cooperateUserName = value.label;
                                    return form;
                                },
                                setFormat: (value, form) => {
                                    if (value.label || value.value || value.value === 0) {
                                        return value;
                                    }
                                    return {
                                        label: form.cooperateUserName,
                                        value: form.cooperateUserId,
                                    };
                                },
                            },
                            {
                                label: '合作人所属部门',
                                key: 'cooperateDepartmentName',
                                placeholder: '请选择',
                                disabled: true,
                                checkOption: {
                                    rules: [
                                        {
                                            required: true,
                                            message: '合作人所属部门不能为空',
                                        },
                                    ],
                                },
                            },
                            {},
                        ];
                    }
                    return [];
                })(),
            ],
        },
        renderContractObligation(obj),
        renderContractReturn(obj),
        renderContractTalentDivides(obj),
        {
            title: '费用预估',
            fixed: true,
            columns: [
                [
                    {
                        key: 'contractBudgetList',
                        type: 'custom',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        component: (
                            <SelfTable
                                editable={obj && obj.formData.contractPid}
                                noBtn={true}
                                onChange={obj.changeBudgets}
                                formData={obj.formData}
                            />
                        ),
                        getFormat: (value, form) => {
                            const arr = [];
                            value.map((item) => {
                                Object.keys(item).map((key) => {
                                    if (BUDGETS.includes(key)) {
                                        item[key] = Number(item[key]);
                                    }
                                });
                                arr.push(item);
                            });
                            form.contractBudgetList = arr;
                            return form;
                        },
                        setFormat: (value, form) => {
                            const arr = [];
                            value.map((item) => {
                                if (item.trailTalentId) {
                                    arr.push({
                                        talentId: item.trailTalentId,
                                        talentName: item.trailTalentName,
                                        talentType: item.trailTalentType,
                                    });
                                } else {
                                    arr.push(item);
                                }
                            });
                            return arr;
                        },
                    },
                ],
            ],
        },
        {
            title: '合同附件',
            fixed: true,
            columns: [
                [
                    {
                        key: 'contractAttachmentList',
                        placeholder: '请上传',
                        type: 'upload',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        componentAttr: {
                            btnText: '添加附件',
                            // onChangeFile: value => uploadChange(value, obj),
                        },
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    required: true,
                                    message: '至少包含一个附件',
                                },
                            ],
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
