import { formaterDefaultValue } from '@/components/General/utils/defaultValue';

const handleEditApprovalFormFields = (editFormFields = [], instanceFormFields = [], flowType) => {
    if (!Array.isArray(editFormFields) || editFormFields.length === 0) return instanceFormFields;
    if (!Array.isArray(editFormFields, instanceFormFields) || instanceFormFields.length === 0) {
        return instanceFormFields;
    }
    return instanceFormFields.map((item) => {
        const obj = editFormFields.find((ls) => {
            return ls.name === item.name;
        }) || {};
        if (flowType === 'condition' && item.conditonField === 1) {
            return item;
        }
        return {
            ...item,
            value: obj.value,
        };
    });
};
const formaterValue = (item) => {
    if (!item.defaultParam || typeof item.defaultParam !== 'string') return '';
    let defaultValue = null;
    try {
        defaultValue = JSON.parse(item.defaultParam);
    } catch (e) {
        console.log(e);
    }
    return defaultValue ? formaterDefaultValue(defaultValue, item) : item.value;
};
export const getFlowId = (obj = {}) => {
    const approvalFlow = obj.approvalFlow || {};
    return approvalFlow.parentId || approvalFlow.id;
};
/*
 * 处理表单默认值的问题
 * @params 表单原始数据formData
 * @return 处理表单数据
 */
export const handleDefaultValue = (approvalFormFields) => {
    return approvalFormFields.map((item) => {
        if (item.approvalFormFields && item.approvalFormFields.length > 0) {
            return {
                ...item,
                approvalFormFields: handleDefaultValue(item.approvalFormFields),
            };
        }
        return {
            ...item,
            value: item.value || (item.defaultParam ? formaterValue(item) : item.value),
        };
    });
};
export const editApprovalParams = (editData = {}, instanceData = {}) => {
    const flowType = instanceData.type;
    const editApprovalForm = editData.approvalForm || {};
    const instanceApprovalFlow = instanceData.approvalForm || {};
    const newData = {
        ...instanceData,
        approvalForm: {
            ...instanceData.approvalForm,
            approvalFormFields: handleEditApprovalFormFields(
                editApprovalForm.approvalFormFields,
                instanceApprovalFlow.approvalFormFields,
                flowType,
            ),
        },
    };
    return newData;
};
