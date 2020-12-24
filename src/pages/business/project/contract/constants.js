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
                ],
                [
                    renderProjectName(obj),
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
                ],
                [
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
            ],
        },
        {
            title: '商务条款',
            columns: [
                [renderContractMoneyTotal(obj)],
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
        renderContractReturn(obj),
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
