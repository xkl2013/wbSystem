import { getUserList } from '@/services/globalSearchApi';

function changeUser(obj, value) {
    obj.changeSelfForm({
        projectingHeaderId: value && value.userId,
        projectingHeaderName: value && value.userChsName,
        projectingHeaderDepartId: value && value.userDepartmentId,
        projectingHeaderDepartName: value && value.employeeDepartmentName,
    });
}
const renderProjectingHeader = (obj) => {
    return [
        {
            label: '负责人',
            key: 'projectingHeaderName',
            placeholder: '请选择',
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '请选择负责人',
                    },
                ],
            },
            type: 'associationSearch',
            componentAttr: {
                request: (val) => {
                    return getUserList({ userChsName: val, pageSize: 50, pageNum: 1 });
                },
                fieldNames: { value: 'userId', label: 'userChsName' },
                allowClear: true,
                onChange: changeUser.bind(this, obj),
                initDataType: 'onfocus',
            },
            getFormat: (value, form) => {
                form.projectingHeaderId = value.value;
                form.projectingHeaderName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.projectingHeaderName, value: form.projectingHeaderId };
            },
        },
        {
            label: '负责人所属部门',
            key: 'projectingHeaderDepartName',
            placeholder: '请选择',
            disabled: true,
            checkOption: {
                rules: [
                    {
                        required: true,
                        message: '负责人所属部门不能为空',
                    },
                ],
            },
            getFormat: (value, form) => {
                form.projectingHeaderDepartId = obj.formData.projectingHeaderDepartId;
                form.projectingHeaderDepartName = value;
                return form;
            },
        },
    ];
};
export default renderProjectingHeader;
