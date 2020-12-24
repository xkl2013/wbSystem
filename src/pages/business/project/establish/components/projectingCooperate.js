import { getUserList } from '@/services/globalSearchApi';
import { IS_OR_NOT, PROJECT_ESTABLISH_RATIO } from '@/utils/enum';

function changeCooperate(obj, value) {
    obj.changeSelfForm({
        cooperate: value,
        cooperateRatio: undefined,
        cooperateUserId: undefined,
        cooperateUserName: undefined,
        cooperateDepartmentId: undefined,
        cooperateDepartmentName: undefined,
    });
}
function changeCooperateUser(obj, value) {
    obj.changeSelfForm({
        cooperateUserId: value && value.userId,
        cooperateUserName: value && value.userChsName,
        cooperateDepartmentId: value && value.userDepartmentId,
        cooperateDepartmentName: value && value.employeeDepartmentName,
    });
}
const renderProjectingCooperate = (obj) => {
    const { cooperate } = obj.formData;
    let cols = [
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
            componentAttr: {
                onChange: changeCooperate.bind(this, obj),
            },
            getFormat: (value, form) => {
                form.cooperate = Number(value);
                return form;
            },
            setFormat: (value) => {
                return String(value);
            },
        },
    ];
    if (Number(cooperate) === 1) {
        cols = cols.concat([
            {
                label: '业绩比例',
                key: 'cooperateRatio',
                placeholder: '负责人：合作人',
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
                getFormat: (value, form) => {
                    form.cooperateRatio = Number(value);
                    return form;
                },
                setFormat: (value) => {
                    return String(value);
                },
            },
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
                                const { projectingHeaderId } = obj.formData;
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
                        return getUserList({
                            userChsName: val,
                            pageSize: 50,
                            pageNum: 1,
                        });
                    },
                    fieldNames: { value: 'userId', label: 'userChsName' },
                    allowClear: true,
                    onChange: changeCooperateUser.bind(this, obj),
                    initDataType: 'onfocus',
                },
                getFormat: (value, form) => {
                    form.cooperateUserId = value.value;
                    form.cooperateUserName = value.label;
                    return form;
                },
                setFormat: (value, form) => {
                    if (value.label || value.value || value.value === 0) {
                        return value;
                    }
                    return { label: form.cooperateUserName, value: form.cooperateUserId };
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
        ]);
    }
    return cols;
};
export default renderProjectingCooperate;
