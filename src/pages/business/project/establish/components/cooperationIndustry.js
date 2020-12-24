function changeIndustry(obj, value) {
    obj.changeSelfForm({
        projectingCooperateIndustry: value,
    });
}
function filter(inputValue, path) {
    return path.some((option) => {
        return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    });
}
const renderProjectingCooperateIndustry = (obj) => {
    const { cooperationIndustry } = obj.formData;
    return {
        label: '合作行业',
        key: 'projectingCooperateIndustry',
        checkOption: {
            rules: [
                {
                    required: true,
                    message: '合作行业不能为空',
                },
            ],
        },
        type: 'cascader',
        componentAttr: {
            placeholder: '请选择合作行业',
            fieldNames: { label: 'value', value: 'code', children: 'children' },
            options: cooperationIndustry,
            changeOnSelect: true,
            onChange: changeIndustry.bind(this, obj),
            showSearch: { filter },
        },
        getFormat: (value, form) => {
            form.projectingCooperateIndustry = value.join('-');
            return form;
        },
        setFormat: (value) => {
            if (Array.isArray(value)) {
                return value.map((item) => {
                    return item.code || item;
                });
            }
            // form回填
            return value.split('-');
        },
    };
};
export default renderProjectingCooperateIndustry;
