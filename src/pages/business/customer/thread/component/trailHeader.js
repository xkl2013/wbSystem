import { getUserList } from '@/services/globalSearchApi';

function changeUser(obj, value) {
    obj.changeSelfForm({
        trailHeaderId: value && value.userId,
        trailHeaderName: value && value.userChsName,
        trailHeaderdepartmentId: value && value.userDepartmentId,
        trailHeaderdepartment: value && value.employeeDepartmentName,
    });
}
const renderTrailHeader = (obj) => {
    return [
        {
            key: 'trailHeaderId',
            placeholder: '请选择',
            label: '负责人',
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
                form.trailHeaderId = value.value;
                form.trailHeaderName = value.label;
                return form;
            },
            setFormat: (value, form) => {
                if (value.label || value.value || value.value === 0) {
                    return value;
                }
                return { label: form.trailHeaderName, value: form.trailHeaderId };
            },
        },
        {
            key: 'trailHeaderdepartment',
            label: '负责人所属部门',
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
                form.trailHeaderdepartmentId = obj.formData.trailHeaderdepartmentId;
                form.trailHeaderdepartment = value;
                return form;
            },
            setFormat: (value) => {
                let name = value;
                const arr = value.split('-');
                if (arr[0] && arr[0].trim() === 'null') {
                    name = arr[1] && arr[1].trim();
                }
                return name;
            },
        },
        {},
    ];
};
export default renderTrailHeader;
