import { columnsFn } from './selfTable';
import { formatSelfCols } from './selfForm';
import { accAdd } from '@/utils/calculate';
// 修改父表单数据
const changeParentForm = async (obj, key, value) => {
    const temp = {};
    temp[key] = value;
    if (key === 'projectingReturnDTOList') {
        obj.changeSelfForm({
            projectingReturnDTOList: temp[key],
        });
    }
};
const renderProjectingReturn = (obj, { from }) => {
    const { trailPlatformOrder, projectingBudget } = obj.formData;
    // 长期项目显示回款计划
    return (
        Number(trailPlatformOrder) === 2 && {
            title: '回款计划',
            fixed: true,
            columns: [
                [
                    {
                        key: 'projectingReturnDTOList',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        checkOption: {
                            validateTrigger: 'onSubmit',
                            validateFirst: true,
                            rules: [
                                {
                                    validator: (rule, value, callback) => {
                                        if (!value || value.length === 0) {
                                            callback();
                                            return;
                                        }
                                        let result = false;
                                        for (let i = 0; i < value.length; i += 1) {
                                            if (!value[i].projectingReturnDate) {
                                                result = true;
                                                break;
                                            }
                                        }
                                        if (result) {
                                            callback('回款计划填写不完整');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        if (!value || value.length === 0) {
                                            callback();
                                            return;
                                        }
                                        let total = 0;
                                        value.map((item) => {
                                            total = accAdd(total, Number(item.projectingReturnMoney));
                                        });
                                        if (total !== Number(projectingBudget)) {
                                            callback('预计回款金额之和不等于签单额');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ],
                        },
                        componentAttr: {
                            border: true,
                            tableCols: columnsFn.bind(this, { formData: obj.formData, from }),
                            formCols: formatSelfCols.bind(this, obj),
                            formKey: 'projectingReturnDTOList',
                            addBtnText: '添加',
                            editBtnText: '编辑',
                            changeParentForm: changeParentForm.bind(this, obj),
                        },
                    },
                ],
            ],
        }
    );
};
export default renderProjectingReturn;
