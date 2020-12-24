import { checkProjectName as esCheck } from '@/pages/business/project/establish/services';
import { checkProjectName as manCheck } from '@/pages/business/project/manage/services';
import storage from '@/utils/storage';
import { ROLE_SOP } from '@/utils/constants';

// 获取不可编辑状态
const getDisabled = (obj, from) => {
    const myself = storage.getUserInfo();
    // 没有数据时，默认可编辑
    if (!obj || !obj.formData) {
        return false;
    }
    // 项目编辑时只有sop组可以编辑
    if (from === 'manage' && obj.formData.projectingId) {
        if (Number(myself.roleId) === ROLE_SOP) {
            return false;
        }
        return true;
    }
    // 默认可编辑
    return false;
};
const renderProjectingName = (obj, { from }) => {
    // from来源：'establish','manage'
    return {
        label: '项目名称',
        key: 'projectingName',
        componentAttr: {
            maxLength: 50,
            disabled: getDisabled(obj, from),
        },
        checkOption: {
            validateTrigger: 'onBlur',
            validateFirst: true,
            rules: [
                {
                    required: true,
                    message: '请输入项目名称',
                },
                {
                    max: 50,
                    message: '至多输入50个字',
                },
                {
                    validator: async (rule, value, callback) => {
                        const { projectingType, projectingId } = obj.formData;
                        // 项目名称查重
                        let checkFunc = esCheck;
                        if (from === 'manage') {
                            checkFunc = manCheck;
                        }
                        // 没选项目类型时不需要查重
                        if (!projectingType) {
                            callback();
                            return;
                        }
                        const response = await checkFunc({
                            projectName: value,
                            projectId: projectingId,
                            projectType: projectingType,
                        });
                        if (response && response.success && !response.data) {
                            callback(rule.message);
                            return;
                        }
                        callback();
                    },
                    message: '项目名称已存在',
                },
            ],
        },
        placeholder: '请输入',
    };
};
export default renderProjectingName;
