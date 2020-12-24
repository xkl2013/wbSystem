import _ from 'lodash';
import { getProjectList } from '@/pages/business/project/contract/services';
import { project2contract } from './transfer';
// 获取不可编辑状态
const getDisabled = (obj) => {
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    const { contractCategory } = obj.formData;
    if (Number(contractCategory) === 1) {
        // 子合同不允许编辑
        return true;
    }
    // 默认可编辑
    return false;
};
// 选择项目触发联动
const changeProjectName = async (obj, item) => {
    const { contractId, contractType, contractCategory } = obj.formData;
    const temp = {};
    // 合同id
    if (contractId) {
        temp.contractId = contractId;
    }
    // 合同类型
    temp.contractType = contractType;
    // 合同主子类型
    temp.contractCategory = contractCategory;
    const contract = await project2contract(item.key, contractCategory);
    _.assign(temp, contract);
    obj.changeSelfForm(temp, true);
};
const renderProjectName = (obj) => {
    return {
        label: '项目名称',
        key: 'contractProjectName',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '请选择项目名称',
                },
            ],
        },
        placeholder: '请选择',
        type: 'associationSearch',
        componentAttr: {
            request: (val) => {
                return getProjectList({
                    projectName: val,
                    pageSize: 50,
                    pageNum: 1,
                    projectBaseType: 1,
                    endStatusList: [0, 2],
                    projectingStateList: [0, 1], // 项目进展未终止
                    projectingSignStateList: [0], // 未签约
                });
            },
            fieldNames: { value: 'projectId', label: 'projectName' },
            allowClear: true,
            onChange: changeProjectName.bind(this, obj),
            initDataType: 'onfocus',
        },
        disabled: getDisabled(obj),
        getFormat: (value, form) => {
            form.contractProjectId = value.value;
            form.contractProjectName = value.label;
            return form;
        },
        setFormat: (value, form) => {
            if (value.label || value.value || value.value === 0) {
                return value;
            }
            return {
                label: form.contractProjectName,
                value: form.contractProjectId,
            };
        },
    };
};
export default renderProjectName;
