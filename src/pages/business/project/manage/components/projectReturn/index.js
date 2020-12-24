import { columnsFn } from './selfTable';
import { formatSelfCols } from './selfForm';
// 修改父表单数据
const changeParentForm = async (obj, key, value) => {
    const temp = {};
    temp[key] = value;
    if (key === 'projectReturnList') {
        obj.changeSelfForm({
            projectReturnList: temp[key],
        });
    }
};
const renderProjectReturn = (obj, { from }) => {
    const { trailPlatformOrder } = obj.formData;
    return (
        Number(trailPlatformOrder) === 2 && {
            title: '回款计划',
            fixed: true,
            columns: [
                [
                    {
                        key: 'projectReturnList',
                        type: 'formTable',
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                        checkOption: {
                            validateFirst: true,
                            rules: [
                                {
                                    validator: (rule, value, callback) => {
                                        if (!value) {
                                            callback();
                                            return;
                                        }
                                        let result = false;
                                        if (obj && obj.formData.projectReturnList) {
                                            for (let i = 0; i < obj.formData.projectReturnList.length; i += 1) {
                                                const item = obj.formData.projectReturnList[i];
                                                // eslint-disable-next-line max-len
                                                if (
                                                    !item.batch
                                                    || !item.projectReturnMoney
                                                    || !item.projectReturnDate
                                                ) {
                                                    result = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (result) {
                                            callback('回款计划填写不完整');
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
                            formKey: 'projectReturnList',
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
export default renderProjectReturn;
